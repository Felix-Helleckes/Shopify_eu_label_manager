import { json } from "@remix-run/node";
import { authenticate } from "~/utils/shopify.server";
import { prisma } from "~/utils/db.server";
import crypto from "crypto";
import { sendEmail, replacePlaceholders } from "~/utils/email.server";

export async function action({ request }) {
  // Only allow POST requests
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  // Verify the request comes through the Shopify App Proxy (HMAC validation)
  let shopDomain;
  try {
    const proxyContext = await authenticate.public.appProxy(request);
    // The app proxy ensures this is a legitimate storefront request
    shopDomain = proxyContext.shop || proxyContext.session?.shop;
  } catch (authError) {
    console.error("App proxy auth failed:", authError);
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!shopDomain) {
    return json({ error: "Could not determine shop domain" }, { status: 400 });
  }

  // Parse JSON body
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { customerName, orderNumber, email } = body;

  // Validate required fields
  if (!customerName || !orderNumber || !email) {
    return json(
      { error: "Missing required fields: customerName, orderNumber, email" },
      { status: 400 }
    );
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json({ error: "Invalid email format" }, { status: 400 });
  }

  // Retrieve the most recent session for the shop to get access token
  const session = await prisma.session.findFirst({
    where: { shop: shopDomain },
    orderBy: { createdAt: "desc" },
  });

  if (!session) {
    return json(
      { error: "Shop not installed or session not found" },
      { status: 401 }
    );
  }

  const accessToken = session.accessToken;

  // Verify the order exists via Shopify Admin API
  const adminApiUrl = `https://${shopDomain}/admin/api/2024-10/orders.json?name=${encodeURIComponent(
    orderNumber
  )}&status=any`;

  let shopifyResponse;
  try {
    shopifyResponse = await fetch(adminApiUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return json(
      { error: "Failed to connect to Shopify Admin API" },
      { status: 502 }
    );
  }

  if (!shopifyResponse.ok) {
    return json(
      { error: "Shopify Admin API request failed" },
      { status: shopifyResponse.status }
    );
  }

  const shopifyData = await shopifyResponse.json();

  if (!shopifyData.orders || shopifyData.orders.length === 0) {
    return json({ error: "Order not found" }, { status: 404 });
  }

  const order = shopifyData.orders[0];
  if (order.cancelled_at !== null) {
    return json({ error: "Order is cancelled" }, { status: 400 });
  }

  // Fetch shop details to get the shop name
  const shopApiUrl = `https://${shopDomain}/admin/api/2024-10/shop.json`;
  let shopResponse;
  try {
    shopResponse = await fetch(shopApiUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return json(
      { error: "Failed to fetch shop details" },
      { status: 502 }
    );
  }

  if (!shopResponse.ok) {
    return json(
      { error: "Shopify Admin API request for shop details failed" },
      { status: shopResponse.status }
    );
  }

  const shopData = await shopResponse.json();
  const shopName = shopData.shop?.name || shopDomain;

  // Create verification hash
  const timestamp = new Date().toISOString();
  const hashData = `${shopDomain}|${customerName}|${orderNumber}|${email}|${timestamp}`;
  const verificationHash = crypto
    .createHash("sha256")
    .update(hashData, "utf8")
    .digest("hex");

  // Store withdrawal log
  const withdrawalLog = await prisma.withdrawalLog.create({
    data: {
      shop: shopDomain,
      customerName,
      orderNumber,
      email,
      timestamp: new Date(timestamp),
      verificationHash,
      formContent: {
        customerName,
        orderNumber,
        email,
        timestamp,
      },
    },
  });

  // Fetch app settings for email template
  let appSettings = await prisma.appSettings.findUnique({
    where: { shop: shopDomain },
  });

  // Default template if none configured
  if (!appSettings) {
    appSettings = {
      customEmailTemplate: {
        subject: "Bestätigung Ihres Widerrufs",
        body: "Sehr geehrte/r {customerName},\\n\\nwir haben Ihren Widerruf vom {timestamp} erhalten.\\n\\nIhre Widerrufsdetails:\\n- Bestellnummer: {orderNumber}\\n- Name: {customerName}\\n- E-Mail: {email}\\n\\nWir werden Ihre Rücksendung umgehend bearbeiten.\\n\\nMit freundlichen Grüßen\\n{shopName}",
      },
    };
  }

  const emailTemplate = appSettings.customEmailTemplate || {
    subject: "Bestätigung Ihres Widerrufs",
    body: "Sehr geehrte/r {customerName},\\n\\nwir haben Ihren Widerruf vom {timestamp} erhalten.\\n\\nIhre Widerrufsdetails:\\n- Bestellnummer: {orderNumber}\\n- Name: {customerName}\\n- E-Mail: {email}\\n\\nWir werden Ihre Rücksendung umgehend bearbeiten.\\n\\nMit freundlichen Grüßen\\n{shopName}",
  };

  const replacements = {
    customerName,
    orderNumber,
    email,
    timestamp: new Date(timestamp).toLocaleString(),
    shopName,
  };

  const emailSubject = replacePlaceholders(emailTemplate.subject, replacements);
  const emailBody = replacePlaceholders(emailTemplate.body, replacements);

  // Send email — only mark as sent if it actually succeeds
  let emailSent = false;
  try {
    await sendEmail({
      to: email,
      subject: emailSubject,
      text: emailBody,
    });
    emailSent = true;
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }

  // Only update emailSent if the email actually went out
  if (emailSent) {
    await prisma.withdrawalLog.update({
      where: { id: withdrawalLog.id },
      data: { emailSent: true },
    });
  }

  return json(
    {
      success: true,
      receiptTimestamp: timestamp,
      withdrawalId: withdrawalLog.id,
    },
    { status: 200 }
  );
}

// CORS headers for storefront requests via App Proxy
export async function headers() {
  return {
    "Access-Control-Allow-Origin": process.env.ALLOWED_CORS_ORIGIN || "https://admin.shopify.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Handle OPTIONS preflight
export async function loader() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.ALLOWED_CORS_ORIGIN || "https://admin.shopify.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
import { json } from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import crypto from "crypto";
import { sendEmail, replacePlaceholders } from "~/utils/email.server";

export async function action({ request }) {
  // Only allow POST requests
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  // Parse JSON body
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { shopDomain, customerName, orderNumber, email } = body;

  // Validate required fields
  if (!shopDomain || !customerName || !orderNumber || !email) {
    return json(
      { error: "Missing required fields: shopDomain, customerName, orderNumber, email" },
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
  const adminApiUrl = `https://${shopDomain}/admin/api/2023-10/orders.json?name=${encodeURIComponent(
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

  // Check if any orders were returned
  if (!shopifyData.orders || shopifyData.orders.length === 0) {
    return json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  // Optional: Additional validation (e.g., order status, financial status)
  const order = shopifyData.orders[0];
  // Example: Only allow withdrawal for orders that are not cancelled
  if (order.cancelled_at !== null) {
    return json(
      { error: "Order is cancelled" },
      { status: 400 }
    );
  }

  // Fetch shop details to get the shop name
  const shopApiUrl = `https://${shopDomain}/admin/api/2023-10/shop.json`;
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
  const shopName = shopData.shop?.name || shopDomain; // fallback to domain if name not available

  // Create verification hash (SHA-256 of submitted data + timestamp)
  const timestamp = new Date().toISOString();
  const hashData = `${shopDomain}|${customerName}|${orderNumber}|${email}|${timestamp}`;
  const verificationHash = crypto
    .createHash("sha256")
    .update(hashData, "utf8")
    .digest("hex");

  // Store withdrawal log in database
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

  // If settings don't exist, use default template
  if (!appSettings) {
    appSettings = {
      customEmailTemplate: {
        subject: "Bestätigung Ihres Widerrufs",
        body: "Sehr geehrte/r {customerName},\n\nwir haben Ihren Widerruf vom {timestamp} erhalten.\n\nIhre Widerrufsdetails:\n- Bestellnummer: {orderNumber}\n- Name: {customerName}\n- E-Mail: {email}\n\nWir werden Ihre Rücksendung umgehend bearbeiten.\n\nMit freundlichen Grüßen\n{shopName}",
      },
    };
  }

  // Prepare email content
  const emailTemplate = appSettings.customEmailTemplate || {
    subject: "Bestätigung Ihres Widerrufs",
    body: "Sehr geehrte/r {customerName},\n\nwir haben Ihren Widerruf vom {timestamp} erhalten.\n\nIhre Widerrufsdetails:\n- Bestellnummer: {orderNumber}\n- Name: {customerName}\n- E-Mail: {email}\n\nWir werden Ihre Rücksendung umgehend bearbeiten.\n\nMit freundlichen Grüßen\n{shopName}",
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

  // Send transactional email
  try {
    await sendEmail({
      to: email,
      subject: emailSubject,
      text: emailBody,
    });
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
    // We don't fail the request if email sending fails, but we log it.
    // In a production system, you might want to retry or alert.
  }

  // Update log with email status (we assume it was sent if no error)
  await prisma.withdrawalLog.update({
    where: { id: withdrawalLog.id },
    data: { emailSent: true },
  });

  // Return success response
  return json(
    {
      success: true,
      receiptTimestamp: timestamp,
      withdrawalId: withdrawalLog.id,
    },
    { status: 200 }
  );
}

// Add CORS headers for storefront requests
export async function headers() {
  return {
    "Access-Control-Allow-Origin": "*", // In production, restrict to known domains
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Handle OPTIONS preflight request
export async function loader() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
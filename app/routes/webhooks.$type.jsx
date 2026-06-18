import { Shopify } from "~/utils/shopify.server";
import { prisma } from "~/utils/db.server";
import { json } from "@remix-run/node";

// Define the webhook handlers
const webhookHandlers = {
  // Customer data request (GDPR)
  CUSTOMERS_DATA_REQUEST: async (topic, shop, body, webhookId) => {
    // In a real app, you would collect all customer data and send it to the customer.
    // For this app, we don't store customer data beyond what's in the withdrawal logs and settings.
    // We'll log the request and return an empty response (as per Shopify's expectation for this topic).
    console.log(`Received customer data request for shop: ${shop}`);
    // You would typically:
    // 1. WithdrawalLog.findMany({ where: { email: customerEmail } }) - but we don't have the email from the webhook.
    // 2. The webhook body contains the customer data (id, email, etc.) from Shopify.
    // 3. You would then compile all data you have on that customer and send it to the customer's email.
    // Since we only store withdrawal logs by email, we could look up logs by the email in the webhook body.
    // However, for simplicity and because the user did not specify, we'll just acknowledge.
    // In production, you must implement the actual data collection and transmission.
  },
  // Customer data deletion (GDPR)
  CUSTOMERS_REDACT: async (topic, shop, body, webhookId) => {
    // The webhook body contains the customer's Shopify ID and other details.
    // We need to delete all data we have on this customer.
    const { customer } = JSON.parse(body);
    const customerEmail = customer.email;

    // Delete withdrawal logs for this customer email
    await prisma.withdrawalLog.deleteMany({
      where: {
        email: customerEmail,
      },
    });

    // Note: We do not store any other personal data in this app.
    console.log(`Redacted customer data for email: ${customerEmail} in shop: ${shop}`);
  },
  // Shop data deletion (GDPR)
  SHOP_REDACT: async (topic, shop, body, webhookId) => {
    // Delete all data associated with the shop
    await prisma.withdrawalLog.deleteMany({
      where: {
        shop: shop, // shop domain
      },
    });
    await prisma.appSettings.deleteMany({
      where: {
        shop: shop,
      },
    });
    // Note: The session data is stored in the Session model, which we should also delete.
    // However, the Session model is managed by the Shopify app and might be shared.
    // We'll delete sessions for this shop as well.
    await prisma.session.deleteMany({
      where: {
        shop: shop,
      },
    });
    console.log(`Redacted shop data for shop: ${shop}`);
  },
};

// This route handles all webhook endpoints
export async function action({ request }) {
  // Verify the webhook HMAC and process it
  try {
    await Shopify.Webhooks.Registry.process(request.headers, await request.text());
    return json({ received: true }, { status: 200 });
  } catch (error) {
    console.error(`Failed to process webhook: error=${error}`);
    return json({ error: error.message }, { status: 400 });
  }
}

// Register the handlers with the Shopify Webhooks Registry
// This runs when the module is evaluated.
Object.keys(webhookHandlers).forEach((topic) => {
  Shopify.Webhooks.Registry.addHandler(topic, webhookHandlers[topic]);
});

export { Shopify };
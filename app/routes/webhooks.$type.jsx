import { authenticate } from "~/utils/shopify.server";
import { json } from "@remix-run/node";

// Handle all webhook endpoints with HMAC verification
export async function action({ request }) {
  try {
    const { topic, shop, session, payload } = await authenticate.webhook(request);

    console.log(`Webhook received: topic=${topic}, shop=${shop}`);

    // Individual handlers for GDPR topics (already registered in shopify.server.js)
    if (topic === "CUSTOMERS_REDACT") {
      console.log(`Redaction webhook processed for shop: ${shop}`);
    } else if (topic === "SHOP_REDACT") {
      console.log(`Shop redaction webhook processed for shop: ${shop}`);
    } else if (topic === "CUSTOMERS_DATA_REQUEST") {
      console.log(`Customer data request webhook processed for shop: ${shop}`);
    }

    return json({ received: true }, { status: 200 });
  } catch (error) {
    console.error(`Webhook processing failed: ${error.message}`);
    return json({ error: error.message }, { status: 400 });
  }
}
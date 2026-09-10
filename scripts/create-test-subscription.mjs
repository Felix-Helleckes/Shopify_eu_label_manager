/**
 * Dev helper: creates a TEST app subscription for a development store via the Admin GraphQL API,
 * using the offline access token stored by the app. Prints only the confirmation URL.
 *
 *   SHOP=teststore.myshopify.com PLAN=Basic node scripts/create-test-subscription.mjs
 */
import { PrismaClient } from "@prisma/client";

const shop = process.env.SHOP;
const planName = process.env.PLAN || "Basic";
const prices = { Basic: 6.99, Pro: 12.99 };
if (!shop || !prices[planName]) {
  console.error("Usage: SHOP=<shop.myshopify.com> PLAN=Basic|Pro node scripts/create-test-subscription.mjs");
  process.exit(1);
}
const prisma = new PrismaClient();
const session = await prisma.session.findFirst({ where: { shop, isOnline: false }, orderBy: { id: "desc" } });
if (!session) {
  console.error(`No offline session for ${shop}`);
  process.exit(1);
}
const handle = process.env.SHOPIFY_APP_HANDLE || "eu-label-1";
const store = shop.replace(".myshopify.com", "");
const query = `#graphql
  mutation Sub($name: String!, $returnUrl: URL!, $lineItems: [AppSubscriptionLineItemInput!]!) {
    appSubscriptionCreate(name: $name, returnUrl: $returnUrl, test: true, trialDays: 14, lineItems: $lineItems) {
      confirmationUrl
      appSubscription { id status }
      userErrors { field message }
    }
  }`;
const res = await fetch(`https://${shop}/admin/api/2026-07/graphql.json`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": session.accessToken },
  body: JSON.stringify({
    query,
    variables: {
      name: planName,
      returnUrl: `https://admin.shopify.com/store/${store}/apps/${handle}/app`,
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: prices[planName], currencyCode: "USD" },
              interval: "EVERY_30_DAYS",
            },
          },
        },
      ],
    },
  }),
});
const json = await res.json();
const payload = json.data?.appSubscriptionCreate;
if (!payload || payload.userErrors?.length || json.errors) {
  console.error(JSON.stringify({ errors: json.errors, userErrors: payload?.userErrors }, null, 2));
  process.exit(1);
}
console.log(payload.confirmationUrl);
await prisma.$disconnect();

import { shopifyApp } from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { prisma } from "~/utils/db.server";

const sessionStorage = new PrismaSessionStorage(prisma);

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY || "",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  scopes: (process.env.SCOPES || "read_products,write_products,read_orders").split(","),
  appUrl: process.env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_DOMAIN || "https://example.myshopify.com",
  sessionStorage,
  isEmbeddedApp: true,
});

export default shopify;
export const authenticate = shopify.authenticate;
export const login = shopify.login;
export const billing = shopify.billing;

// Register GDPR webhook handlers
shopify.webhooks.addHandlers({
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: "http",
    callbackUrl: "/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log(`Received customer data request for shop: ${shop}`);
      // In production: collect all customer data and send it to the customer
      return { success: true };
    },
  },
  CUSTOMERS_REDACT: {
    deliveryMethod: "http",
    callbackUrl: "/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = typeof body === "string" ? JSON.parse(body) : body;
      const customerEmail = payload.customer?.email || payload.email;
      if (customerEmail) {
        await prisma.withdrawalLog.deleteMany({
          where: { email: customerEmail, shop },
        });
        console.log(`Redacted customer data for email: ${customerEmail} in shop: ${shop}`);
      }
      return { success: true };
    },
  },
  SHOP_REDACT: {
    deliveryMethod: "http",
    callbackUrl: "/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      await prisma.withdrawalLog.deleteMany({ where: { shop } });
      await prisma.appSettings.deleteMany({ where: { shop } });
      await prisma.session.deleteMany({ where: { shop } });
      console.log(`Redacted shop data for shop: ${shop}`);
      return { success: true };
    },
  },
});
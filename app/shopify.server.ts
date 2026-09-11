import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  BillingInterval,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { PLAN_BASIC, PLAN_DETAILS, PLAN_FREE, PLAN_PRO, TRIAL_DAYS } from "./lib/plans";
import { syncShopFromAdmin } from "./lib/shop.server";
import { syncPlanToShop } from "./lib/billing.server";

export const apiVersion = ApiVersion.July26;

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  billing: {
    [PLAN_BASIC]: {
      trialDays: TRIAL_DAYS,
      lineItems: [
        {
          amount: PLAN_DETAILS[PLAN_BASIC].price,
          currencyCode: PLAN_DETAILS[PLAN_BASIC].currency,
          interval: BillingInterval.Every30Days,
        },
      ],
    },
    [PLAN_PRO]: {
      trialDays: TRIAL_DAYS,
      lineItems: [
        {
          amount: PLAN_DETAILS[PLAN_PRO].price,
          currencyCode: PLAN_DETAILS[PLAN_PRO].currency,
          interval: BillingInterval.Every30Days,
        },
      ],
    },
  },
  hooks: {
    afterAuth: async ({ session, admin }) => {
      try {
        const shop = await syncShopFromAdmin(admin, session.shop);
        // Fresh installs start on the free Label plan; the real plan is synced on the first admin request.
        if (!shop.plan) await syncPlanToShop(admin, shop, PLAN_FREE);
      } catch (error) {
        console.error(`[afterAuth] could not sync shop ${session.shop}`, error);
      }
    },
  },
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

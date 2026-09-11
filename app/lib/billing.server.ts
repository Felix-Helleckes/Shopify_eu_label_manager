import { redirect } from "react-router";
import type { Shop } from "@prisma/client";
import prisma from "../db.server";
import type { authenticate } from "../shopify.server";
import { PAID_PLANS, PLAN_BASIC, PLAN_FREE, PLAN_PRO, hasWithdrawal, hasPro, type PlanName } from "./plans";

type AdminContext = Awaited<ReturnType<typeof authenticate.admin>>;
type GraphqlClient = {
  graphql: (query: string, options?: { variables?: Record<string, unknown> }) => Promise<Response>;
};

export { hasWithdrawal, hasPro };

const ACTIVE_SUBSCRIPTIONS = `#graphql
  query EuComplianceSubscriptions {
    currentAppInstallation {
      activeSubscriptions { id name status test }
    }
  }
`;

const SHOP_PLAN = `#graphql
  query EuComplianceShopPlan {
    shop { plan { partnerDevelopment } }
  }
`;

/**
 * Whether a new charge has to be created as a test charge. Development stores can only carry test
 * charges, so this is decided per shop instead of per environment – a reviewer on a dev store would
 * otherwise be unable to subscribe. BILLING_TEST=true forces test mode everywhere.
 */
export async function isTestBilling(admin: GraphqlClient): Promise<boolean> {
  if (process.env.BILLING_TEST === "true") return true;
  try {
    const res = await admin.graphql(SHOP_PLAN);
    const json = (await res.json()) as { data?: { shop: { plan: { partnerDevelopment: boolean } } } };
    return Boolean(json.data?.shop.plan.partnerDevelopment);
  } catch (error) {
    console.error("[billing] shop plan lookup failed", error);
    return process.env.NODE_ENV !== "production";
  }
}

export type BillingState = { plan: PlanName; subscriptionId: string | null };

/**
 * Reads the active Shopify subscription straight from the app installation. This deliberately does
 * not use billing.check(): that call filters by an isTest flag, so a test charge (which is what
 * Shopify's reviewers and every development store use) would look like "no subscription".
 * Never throws; falls back to the free plan.
 */
export async function billingState(admin: GraphqlClient): Promise<BillingState> {
  if (process.env.BILLING_DISABLED === "true") return { plan: PLAN_PRO, subscriptionId: null };
  try {
    const res = await admin.graphql(ACTIVE_SUBSCRIPTIONS);
    const json = (await res.json()) as {
      data?: { currentAppInstallation: { activeSubscriptions: { id: string; name: string; status: string }[] } };
    };
    const subs = (json.data?.currentAppInstallation.activeSubscriptions ?? []).filter((s) => s.status === "ACTIVE");
    const sub = subs.find((s) => s.name === PLAN_PRO) ?? subs.find((s) => s.name === PLAN_BASIC) ?? null;
    if (!sub) return { plan: PLAN_FREE, subscriptionId: null };
    return { plan: sub.name as PlanName, subscriptionId: sub.id };
  } catch (error) {
    console.error("[billing] subscription lookup failed", error);
    return { plan: PLAN_FREE, subscriptionId: null };
  }
}

/** Returns the active plan name ("Free" when there is no subscription). */
export async function activePlan(admin: GraphqlClient): Promise<PlanName> {
  return (await billingState(admin)).plan;
}

/** Redirects to the plan picker unless the plan includes the withdrawal function. */
export function requireWithdrawalPlan(plan: string | null | undefined, request: Request): void {
  if (hasWithdrawal(plan)) return;
  const url = new URL(request.url);
  url.searchParams.set("upgrade", "withdrawal");
  throw redirect(`/app/billing?${url.searchParams.toString()}`);
}

const SHOP_ID = `#graphql
  query EuComplianceShopId { shop { id } }
`;

const SET_PLAN = `#graphql
  mutation EuCompliancePlan($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      userErrors { field message }
    }
  }
`;

/**
 * Persists the plan on the Shop row and mirrors it into the app-owned shop metafield `$app:billing.plan`
 * (read in Liquid as `app.metafields.billing.plan`) so the theme blocks can hide the withdrawal button on the
 * free plan. Never throws.
 */
export async function syncPlanToShop(admin: GraphqlClient | null | undefined, shop: Shop, plan: PlanName): Promise<Shop> {
  if (shop.plan === plan) return shop;
  let updated = shop;
  try {
    updated = await prisma.shop.update({ where: { domain: shop.domain }, data: { plan } });
  } catch (error) {
    console.error("[billing] could not store plan", error);
  }
  if (!admin) return updated;
  try {
    const idRes = await admin.graphql(SHOP_ID);
    const idJson = (await idRes.json()) as { data?: { shop: { id: string } } };
    const ownerId = idJson.data?.shop.id;
    if (!ownerId) return updated;
    const res = await admin.graphql(SET_PLAN, {
      variables: {
        metafields: [
          { ownerId, namespace: "$app:billing", key: "plan", type: "single_line_text_field", value: plan.toLowerCase() },
        ],
      },
    });
    const json = (await res.json()) as {
      data?: { metafieldsSet: { userErrors: { message: string }[] } };
      errors?: { message: string }[];
    };
    const errors = [...(json.errors ?? []), ...(json.data?.metafieldsSet.userErrors ?? [])];
    if (errors.length) console.error("[billing] plan metafield rejected:", errors.map((e) => e.message).join("; "));
  } catch (error) {
    console.error("[billing] plan metafield failed", error);
  }
  return updated;
}

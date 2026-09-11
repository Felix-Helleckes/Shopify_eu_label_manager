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

export function isTestBilling() {
  return process.env.NODE_ENV !== "production" || process.env.BILLING_TEST === "true";
}

export type BillingState = { plan: PlanName; subscriptionId: string | null };

/** Reads the active Shopify subscription. Never throws; falls back to the free plan. */
export async function billingState(billing: AdminContext["billing"]): Promise<BillingState> {
  if (process.env.BILLING_DISABLED === "true") return { plan: PLAN_PRO, subscriptionId: null };
  try {
    const { hasActivePayment, appSubscriptions } = await billing.check({
      plans: [...PAID_PLANS],
      isTest: isTestBilling(),
    });
    if (!hasActivePayment) return { plan: PLAN_FREE, subscriptionId: null };
    const sub =
      appSubscriptions.find((s) => s.name === PLAN_PRO) ??
      appSubscriptions.find((s) => s.name === PLAN_BASIC) ??
      appSubscriptions[0];
    const name = sub?.name === PLAN_PRO || sub?.name === PLAN_BASIC ? (sub.name as PlanName) : PLAN_FREE;
    return { plan: name, subscriptionId: sub?.id ?? null };
  } catch (error) {
    console.error("[billing] check failed", error);
    return { plan: PLAN_FREE, subscriptionId: null };
  }
}

/** Returns the active plan name ("Free" when there is no subscription). */
export async function activePlan(billing: AdminContext["billing"]): Promise<PlanName> {
  return (await billingState(billing)).plan;
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

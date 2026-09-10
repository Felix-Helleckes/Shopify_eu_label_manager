import { redirect } from "react-router";
import type { authenticate } from "../shopify.server";
import { ALL_PLANS, PLAN_BASIC, PLAN_PRO, type PlanName } from "./plans";

type AdminContext = Awaited<ReturnType<typeof authenticate.admin>>;

export function isTestBilling() {
  return process.env.NODE_ENV !== "production" || process.env.BILLING_TEST === "true";
}

/** Returns the active plan name or null. Never throws. */
export async function activePlan(billing: AdminContext["billing"]): Promise<PlanName | null> {
  try {
    const { hasActivePayment, appSubscriptions } = await billing.check({
      plans: [...ALL_PLANS],
      isTest: isTestBilling(),
    });
    if (!hasActivePayment) return null;
    const names = appSubscriptions.map((s) => s.name);
    if (names.includes(PLAN_PRO)) return PLAN_PRO;
    if (names.includes(PLAN_BASIC)) return PLAN_BASIC;
    return (names[0] as PlanName) ?? null;
  } catch (error) {
    console.error("[billing] check failed", error);
    return null;
  }
}

/**
 * Ensures the shop has an active subscription; otherwise redirects to the plan picker.
 * Set BILLING_DISABLED=true to bypass during development or for private test stores.
 */
export async function requireActivePlan(billing: AdminContext["billing"], request: Request): Promise<PlanName | null> {
  if (process.env.BILLING_DISABLED === "true") return PLAN_PRO;
  const plan = await activePlan(billing);
  if (plan) return plan;
  const url = new URL(request.url);
  throw redirect(`/app/billing?${url.searchParams.toString()}`);
}

export function hasPro(plan: PlanName | null) {
  return plan === PLAN_PRO;
}

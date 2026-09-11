import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, redirect, useLoaderData, useNavigation, useSubmit } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { requireShop } from "../lib/admin.server";
import { billingState, isTestBilling, syncPlanToShop } from "../lib/billing.server";
import { ALL_PLANS, PAID_PLANS, PLAN_DETAILS, PLAN_FREE, PLAN_LABELS, planFeatures, TRIAL_DAYS, type PaidPlanName } from "../lib/plans";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, locale, t, shop: shopRow } = await requireShop(request, { billing: false });
  const state = await billingState(admin);
  await syncPlanToShop(admin, shopRow, state.plan);
  const upgrade = new URL(request.url).searchParams.get("upgrade");
  return {
    current: state.plan,
    isTest: await isTestBilling(admin),
    hint: upgrade === "withdrawal" ? t("bil.upgradeWithdrawal") : upgrade === "export" ? t("bil.upgradeExport") : null,
    plans: ALL_PLANS.map((name) => ({
      name,
      label: PLAN_LABELS[name],
      free: name === PLAN_FREE,
      price: PLAN_DETAILS[name].price,
      currency: PLAN_DETAILS[name].currency,
      features: planFeatures(name, locale),
      cta:
        name === PLAN_FREE
          ? t("bil.switchFree")
          : state.plan === PLAN_FREE
            ? t("bil.start", { plan: name })
            : t("bil.switchTo", { plan: name }),
    })),
    s: {
      title: t("bil.title"),
      test: t("bil.test"),
      intro: t("bil.intro", { days: TRIAL_DAYS }),
      perMonth: t("bil.perMonth"),
      free: t("bil.free"),
      current: t("bil.current"),
      cancelNote: t("bil.cancelNote"),
    },
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { billing, admin, session, t } = await requireShop(request, { billing: false });
  const isTest = await isTestBilling(admin);
  const form = await request.formData();
  const plan = String(form.get("plan") || "");
  const store = session.shop.replace(".myshopify.com", "");
  const handle = process.env.SHOPIFY_APP_HANDLE || "eu-compliance-suite";

  if (plan === PLAN_FREE) {
    const state = await billingState(admin);
    if (state.subscriptionId) {
      await billing.cancel({ subscriptionId: state.subscriptionId, isTest, prorate: true });
    }
    throw redirect("/app/billing");
  }
  if (!(PAID_PLANS as readonly string[]).includes(plan)) return { error: t("bil.unknown") };
  await billing.request({
    plan: plan as PaidPlanName,
    isTest,
    returnUrl: `https://admin.shopify.com/store/${store}/apps/${handle}/app`,
  });
  return null;
};

export default function Billing() {
  const { current, plans, isTest, hint, s } = useLoaderData<typeof loader>();
  const nav = useNavigation();
  const submit = useSubmit();

  return (
    <s-page heading={s.title}>
      {hint && (
        <s-banner tone="warning">
          <s-paragraph>{hint}</s-paragraph>
        </s-banner>
      )}
      {isTest && (
        <s-banner tone="info">
          <s-paragraph>{s.test}</s-paragraph>
        </s-banner>
      )}
      <s-paragraph>{s.intro}</s-paragraph>
      <s-stack direction="inline" gap="large">
        {plans.map((p) => (
          <s-section key={p.name} heading={p.label}>
            <s-heading>{p.free ? s.free : `${p.price.toFixed(2)} ${p.currency} ${s.perMonth}`}</s-heading>
            <s-unordered-list>
              {p.features.map((f) => (
                <s-list-item key={f}>{f}</s-list-item>
              ))}
            </s-unordered-list>
            <Form method="post">
              <input type="hidden" name="plan" value={p.name} />
              {current === p.name ? (
                <s-badge tone="success">{s.current}</s-badge>
              ) : (
                <s-button
                  type="submit"
                  variant={p.free ? "secondary" : "primary"}
                  onClick={(event) => {
                    event.preventDefault();
                    submit({ plan: p.name }, { method: "post" });
                  }}
                  {...(nav.state !== "idle" ? { loading: true } : {})}
                >
                  {p.cta}
                </s-button>
              )}
            </Form>
            {p.free && current !== p.name && <s-paragraph>{s.cancelNote}</s-paragraph>}
          </s-section>
        ))}
      </s-stack>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

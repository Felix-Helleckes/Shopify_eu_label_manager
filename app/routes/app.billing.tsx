import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigation, useSubmit } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { requireShop } from "../lib/admin.server";
import { activePlan, isTestBilling } from "../lib/billing.server";
import { ALL_PLANS, PLAN_DETAILS, planFeatures, TRIAL_DAYS, type PlanName } from "../lib/plans";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, locale, t } = await requireShop(request, { billing: false });
  const plan = await activePlan(billing);
  return {
    current: plan,
    isTest: isTestBilling(),
    plans: ALL_PLANS.map((name) => ({
      name,
      price: PLAN_DETAILS[name].price,
      currency: PLAN_DETAILS[name].currency,
      features: planFeatures(name, locale),
      cta: plan ? t("bil.switchTo", { plan: name }) : t("bil.start", { plan: name }),
    })),
    s: {
      title: t("bil.title"),
      test: t("bil.test"),
      intro: t("bil.intro", { days: TRIAL_DAYS }),
      perMonth: t("bil.perMonth"),
      current: t("bil.current"),
    },
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { billing, session, t } = await requireShop(request, { billing: false });
  const form = await request.formData();
  const plan = String(form.get("plan") || "") as PlanName;
  if (!ALL_PLANS.includes(plan)) return { error: t("bil.unknown") };
  const store = session.shop.replace(".myshopify.com", "");
  const handle = process.env.SHOPIFY_APP_HANDLE || "eu-compliance-suite";
  await billing.request({
    plan,
    isTest: isTestBilling(),
    returnUrl: `https://admin.shopify.com/store/${store}/apps/${handle}/app`,
  });
  return null;
};

export default function Billing() {
  const { current, plans, isTest, s } = useLoaderData<typeof loader>();
  const nav = useNavigation();
  const submit = useSubmit();

  return (
    <s-page heading={s.title}>
      {isTest && (
        <s-banner tone="info">
          <s-paragraph>{s.test}</s-paragraph>
        </s-banner>
      )}
      <s-paragraph>{s.intro}</s-paragraph>
      <s-stack direction="inline" gap="large">
        {plans.map((p) => (
          <s-section key={p.name} heading={p.name}>
            <s-heading>
              {p.price.toFixed(2)} {p.currency} {s.perMonth}
            </s-heading>
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
                  variant="primary"
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
          </s-section>
        ))}
      </s-stack>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

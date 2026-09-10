import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigation, useSubmit } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { activePlan, isTestBilling } from "../lib/billing.server";
import { ALL_PLANS, PLAN_DETAILS, TRIAL_DAYS, type PlanName } from "../lib/plans";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing } = await authenticate.admin(request);
  const plan = await activePlan(billing);
  return {
    current: plan,
    trialDays: TRIAL_DAYS,
    isTest: isTestBilling(),
    plans: ALL_PLANS.map((name) => ({ name, ...PLAN_DETAILS[name] })),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  const form = await request.formData();
  const plan = String(form.get("plan") || "") as PlanName;
  if (!ALL_PLANS.includes(plan)) return { error: "Unbekannter Tarif" };
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
  const { current, plans, trialDays, isTest } = useLoaderData<typeof loader>();
  const nav = useNavigation();
  const submit = useSubmit();

  return (
    <s-page heading="Tarif">
      {isTest && (
        <s-banner tone="info">
          <s-paragraph>Testmodus: Es werden keine echten Gebühren berechnet.</s-paragraph>
        </s-banner>
      )}
      <s-paragraph>
        Alle Tarife beginnen mit {String(trialDays)} Tagen kostenloser Testphase und sind monatlich über Shopify Billing
        kündbar.
      </s-paragraph>
      <s-stack direction="inline" gap="large">
        {plans.map((p) => (
          <s-section key={p.name} heading={p.name}>
            <s-heading>
              {p.price.toFixed(2)} {p.currency} / Monat
            </s-heading>
            <s-unordered-list>
              {p.features.de.map((f) => (
                <s-list-item key={f}>{f}</s-list-item>
              ))}
            </s-unordered-list>
            <Form method="post">
              <input type="hidden" name="plan" value={p.name} />
              {current === p.name ? (
                <s-badge tone="success">Aktueller Tarif</s-badge>
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
                  {current ? `Zu ${p.name} wechseln` : `${p.name} starten`}
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

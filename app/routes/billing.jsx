import { json } from "@remix-run/node";
import { authenticate } from "~/utils/shopify.server";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { Button, Card, Layout, Page } from "@shopify/polaris";

export async function loader({ request }) {
  const { admin, billing } = await authenticate.admin(request);

  // Check if the shop has an active subscription
  let subscription = null;
  try {
    const plans = await billing.check({
      plans: ["basic", "pro"],
    });
    subscription = plans;
  } catch (e) {
    console.error("Billing check failed:", e);
  }

  return json({
    plans: [
      {
        id: "basic",
        name: "Basic",
        price: 9,
        currency: "EUR",
        description: "Für kleine Shops mit Basis-Compliance und Widerrufsverwaltung.",
        features: ["Widerrufs-Button", "Basis E-Mail-Vorlage", "Widerrufs-Log"],
      },
      {
        id: "pro",
        name: "Pro",
        price: 29,
        currency: "EUR",
        description: "Für wachstumsstarke Shops mit erweiterten Compliance-Funktionen und Prioritätssupport.",
        features: ["Alles aus Basic", "EU-Gewährleistungslabel", "Anpassbare E-Mail-Vorlagen", "CSV-Export", "Prioritäts-Support"],
      },
    ],
    subscription,
  });
}

export async function action({ request }) {
  const { admin, billing } = await authenticate.admin(request);

  const formData = await request.formData();
  const planId = formData.get("planId");

  if (!planId) {
    return json({ error: "No plan selected" }, { status: 400 });
  }

  const returnUrl = `${process.env.SHOPIFY_APP_URL}/app`;

  try {
    const confirmationUrl = await billing.request({
      plan: planId,
      isTest: process.env.NODE_ENV !== "production",
      returnUrl,
    });

    return json({ redirect: confirmationUrl });
  } catch (error) {
    console.error("Billing request failed:", error);
    return json({ error: "Failed to create billing subscription" }, { status: 500 });
  }
}

export default function BillingPage() {
  const { plans, subscription } = useLoaderData();
  const fetcher = useFetcher();

  return (
    <Page title="Tarif wählen">
      <Layout>
        {plans.map((plan) => (
          <Layout.Section key={plan.id}>
            <Card sectioned>
              <h2>{plan.name}</h2>
              <p style={{ fontSize: 24, fontWeight: "bold" }}>
                €{plan.price}<span style={{ fontSize: 14, fontWeight: "normal", color: "#666" }}>/Monat</span>
              </p>
              <p>{plan.description}</p>
              <ul style={{ paddingLeft: 20 }}>
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div style={{ marginTop: 16 }}>
                <fetcher.Form method="post">
                  <input type="hidden" name="planId" value={plan.id} />
                  <Button
                    type="submit"
                    variant="primary"
                    loading={fetcher.state === "submitting"}
                    disabled={subscription?.plan === plan.id}
                  >
                    {subscription?.plan === plan.id ? "Aktueller Tarif" : `${plan.name} wählen`}
                  </Button>
                </fetcher.Form>
              </div>
            </Card>
          </Layout.Section>
        ))}
      </Layout>
    </Page>
  );
}
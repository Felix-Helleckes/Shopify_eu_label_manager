import { json } from "@remix-run/node";

export async function loader() {
  return json({
    plans: [
      {
        id: "basic",
        name: "Basic",
        price: 9,
        currency: "EUR",
        description: "Für kleine Shops mit Basis-Compliance und Widerrufsverwaltung.",
      },
      {
        id: "pro",
        name: "Pro",
        price: 29,
        currency: "EUR",
        description: "Für wachstumsstarke Shops mit erweiterten Compliance-Funktionen und Prioritätssupport.",
      },
    ],
    note: "Der Billing-Plan ist für die erste Shopify-Launch-Phase vorbereitet und kann im nächsten Schritt direkt mit Shopify Billing verbunden werden."
  });
}

import { json } from "@remix-run/node";

export async function loader() {
  return json({
    title: "Nutzungsbedingungen",
    summary: "Diese App wird für Shopify-Shop-Betreiber bereitgestellt, um Widerrufsprozesse, Gewährleistungsinformationen und Compliance-Funktionen zu verwalten.",
    note: "Die Nutzung der App setzt eine aktive Shopify-Installation und die Einhaltung der geltenden Gesetze voraus."
  });
}

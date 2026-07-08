import { json } from "@remix-run/node";

export async function loader() {
  return json({
    title: "Support",
    email: "support@eu-compliance-suite.com",
    note: "Für technische Fragen, Support und Anfragen rund um die App wenden Sie sich bitte an unsere Support-Adresse."
  });
}

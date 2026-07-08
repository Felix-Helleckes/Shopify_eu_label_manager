import { json } from "@remix-run/node";

export async function loader() {
  return json({
    title: "Datenschutz",
    summary: "Wir verarbeiten nur die Daten, die für den Betrieb der App und die Umsetzung von Widerrufs- und Gewährleistungsprozessen erforderlich sind.",
    link: "https://dataprivacy-three.vercel.app/",
    note: "Die vollständige Datenschutzerklärung ist unter dem oben genannten Link verfügbar."
  });
}

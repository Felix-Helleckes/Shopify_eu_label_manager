import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({
    meta: { title: "Datenschutzerklärung – EU Compliance Suite" },
  });
}

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24, fontFamily: "sans-serif", lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Datenschutzerklärung</h1>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlicher für die Datenverarbeitung im Rahmen dieser App ist der jeweilige
        Shopify-Shop-Betreiber, der die App installiert hat. Die App selbst stellt lediglich
        die technische Infrastruktur zur Verfügung.
      </p>

      <h2>2. Erhobene Daten</h2>
      <p>Die App verarbeitet folgende personenbezogene Daten:</p>
      <ul>
        <li><strong>Bestell- und Kundendaten:</strong> Name, E-Mail-Adresse, Bestellnummer (bei Nutzung des Widerrufs-Formulars)</li>
        <li><strong>Shop-Daten:</strong> Shop-Domain und Session-Informationen (für die App-Funktionalität)</li>
        <li><strong>Technische Daten:</strong> Keine eigenen Cookies oder Tracking-Mechanismen</li>
      </ul>

      <h2>3. Zweck der Verarbeitung</h2>
      <ul>
        <li>Bearbeitung von Widerrufserklärungen gemäß EU-Verbraucherrecht (RL 2023/2673)</li>
        <li>Versand von Bestätigungs-E-Mails an Kunden</li>
        <li>Bereitstellung von EU-Gewährleistungsinformationen auf Produktseiten</li>
        <li>Erfüllung gesetzlicher Aufbewahrungspflichten</li>
      </ul>

      <h2>4. Rechtsgrundlage</h2>
      <ul>
        <li>Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung)</li>
        <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse des Shop-Betreibers)</li>
      </ul>

      <h2>5. Speicherdauer</h2>
      <p>
        Widerrufsprotokolle werden für die Dauer der gesetzlichen Aufbewahrungsfrist (mindestens 3 Jahre
        ab Ende des Kalenderjahres der Erklärung) gespeichert. Bei Deinstallation der App werden alle
        Daten automatisch gelöscht (SHOP_REDACT-Webhook).
      </p>

      <h2>6. Keine Cookies</h2>
      <p>Diese App verwendet keine Cookies und setzt keine Tracking-Mechanismen ein.</p>

      <h2>7. Betroffenenrechte</h2>
      <p>
        Betroffene haben das Recht auf Auskunft, Berichtigung, Löschung und Datenübertragbarkeit.
        Anfragen können über den jeweiligen Shop-Betreiber oder per E-Mail an{" "}
        <a href="mailto:support@eu-compliance-suite-2026.shopifyapps.com">support@eu-compliance-suite-2026.shopifyapps.com</a>{" "}
        gestellt werden.
      </p>

      <h2>8. Drittanbieter</h2>
      <p>
        Es werden keine personenbezogenen Daten an Dritte weitergegeben. E-Mails werden über
        konfigurierte SMTP-Server des Shop-Betreibers versendet.
      </p>

      <p style={{ marginTop: 32, fontSize: 14, color: "#666" }}>
        Stand: Juli 2026
      </p>
    </main>
  );
}
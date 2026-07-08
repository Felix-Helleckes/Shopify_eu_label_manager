import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({
    meta: { title: "Nutzungsbedingungen – EU Compliance Suite" },
  });
}

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24, fontFamily: "sans-serif", lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Nutzungsbedingungen</h1>

      <h2>1. Geltungsbereich</h2>
      <p>
        Diese Nutzungsbedingungen gelten für die Nutzung der Shopify-App „EU Compliance Suite"
        (nachfolgend „App") durch Shopify-Shop-Betreiber (nachfolgend „Nutzer").
        Die App wird über den Shopify App Store bereitgestellt.
      </p>

      <h2>2. Leistungsbeschreibung</h2>
      <p>Die App bietet folgende Funktionen:</p>
      <ul>
        <li>Elektronischer Widerrufs-Button gemäß EU-Richtlinie 2023/2673</li>
        <li>EU-Gewährleistungslabel für Produktseiten</li>
        <li>Widerrufsprotokoll mit SHA-256-Verifikationshashes</li>
        <li>Konfigurierbare E-Mail-Benachrichtigungen</li>
      </ul>

      <h2>3. Preise und Zahlung</h2>
      <p>
        Die Nutzung der App ist kostenpflichtig. Die aktuellen Preise sind in der
        Shopify-App-Übersicht einsehbar. Die Abrechnung erfolgt über das Shopify-Abrechnungssystem
        mit einer monatlichen Kündigungsfrist.
      </p>

      <h2>4. Pflichten des Nutzers</h2>
      <ul>
        <li>Der Nutzer ist für die rechtmäßige Verarbeitung von Kundendaten verantwortlich</li>
        <li>Der Nutzer stellt sicher, dass die App nur für rechtmäßige Zwecke eingesetzt wird</li>
        <li>Der Nutzer informiert seine Kunden gemäß DSGVO über die Datenverarbeitung</li>
      </ul>

      <h2>5. Haftung</h2>
      <p>
        Die App stellt technische Werkzeuge zur Erfüllung gesetzlicher Anforderungen bereit.
        Der App-Anbieter übernimmt keine Gewähr für die vollständige rechtliche Compliance
        des Nutzers. Der Nutzer ist selbst für die Einhaltung aller anwendbaren Gesetze
        verantwortlich. Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.
      </p>

      <h2>6. Kündigung</h2>
      <p>
        Der Nutzer kann die App jederzeit über den Shopify App Store deinstallieren.
        Mit der Deinstallation werden alle gespeicherten Daten automatisch gelöscht
        (SHOP_REDACT-Webhook). Eine gesonderte Kündigung ist nicht erforderlich.
      </p>

      <h2>7. Datenschutz</h2>
      <p>
        Es gilt die gesonderte <a href="/app/privacy">Datenschutzerklärung</a>.
      </p>

      <h2>8. Änderungen</h2>
      <p>
        Der App-Anbieter behält sich das Recht vor, diese Nutzungsbedingungen zu ändern.
        Änderungen werden dem Nutzer rechtzeitig vor Inkrafttreten mitgeteilt.
      </p>

      <h2>9. Support</h2>
      <p>
        Support-Anfragen können per E-Mail an{" "}
        <a href="mailto:support@eu-compliance-suite-2026.shopifyapps.com">support@eu-compliance-suite-2026.shopifyapps.com</a>{" "}
        gestellt werden.
      </p>

      <p style={{ marginTop: 32, fontSize: 14, color: "#666" }}>
        Stand: Juli 2026
      </p>
    </main>
  );
}
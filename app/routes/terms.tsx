import { operator } from "../lib/operator";

const s = {
  main: { fontFamily: "Inter, system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: 32, lineHeight: 1.6, color: "#1a1a1a" },
  h1: { fontSize: 28, marginBottom: 8 },
  h2: { fontSize: 20, marginTop: 28 },
  small: { color: "#666", fontSize: 14 },
} as const;

export default function TermsPage() {
  return (
    <main style={s.main}>
      <h1 style={s.h1}>Nutzungsbedingungen – {operator.appName}</h1>
      <p style={s.small}>Stand: September 2026 · <a href="#en">English version below</a></p>

      <h2 style={s.h2}>1. Vertragspartner und Geltungsbereich</h2>
      <p>
        Diese Bedingungen gelten zwischen {operator.name}, {operator.address} („Anbieter“) und dem Betreiber eines
        Shopify-Shops („Händler“), der die App über den Shopify App Store installiert. Ergänzend gelten die
        Shopify-Bedingungen für App-Nutzer.
      </p>

      <h2 style={s.h2}>2. Leistungen</h2>
      <ul>
        <li>Elektronische Widerrufsfunktion für den Onlineshop (Art. 11a Richtlinie 2011/83/EU, § 356a BGB) einschließlich Eingangsbestätigung, Widerrufsprotokoll, Bestellzuordnung und Export.</li>
        <li>Theme-Blöcke für den harmonisierten Gewährleistungshinweis und die harmonisierte Kennzeichnung der gewerblichen Haltbarkeitsgarantie (Durchführungsverordnung (EU) 2025/1960) sowie einen Informationsblock zum Recht auf Reparatur.</li>
        <li>Verfügbarkeit: Der Anbieter bemüht sich um eine Verfügbarkeit von 99,5 % im Monatsmittel; Wartungsfenster werden nach Möglichkeit angekündigt.</li>
      </ul>

      <h2 style={s.h2}>3. Preise, Testphase, Kündigung</h2>
      <p>
        Die Nutzung ist kostenpflichtig gemäß dem im Shopify App Store bzw. in der App angezeigten Tarif. Die Abrechnung
        erfolgt ausschließlich über Shopify Billing. Neue Installationen erhalten eine kostenlose Testphase von 14 Tagen.
        Der Vertrag kann jederzeit durch Deinstallation der App beendet werden; bereits gezahlte Gebühren für den
        laufenden Abrechnungszeitraum werden nicht erstattet, soweit gesetzlich zulässig.
      </p>

      <h2 style={s.h2}>4. Pflichten des Händlers</h2>
      <ul>
        <li>Der Händler ist für die rechtskonforme Ausgestaltung seines Shops verantwortlich, insbesondere für die Platzierung der Widerrufsfunktion, die Aktualisierung seiner Widerrufsbelehrung und die Pflege der Garantieangaben.</li>
        <li>Der Händler stellt sicher, dass die von ihm vorgenommenen Anpassungen der Beschriftungen den gesetzlichen Vorgaben entsprechen.</li>
        <li>Der Händler informiert seine Kunden gemäß DSGVO über die Datenverarbeitung durch die App.</li>
      </ul>

      <h2 style={s.h2}>5. Keine Rechtsberatung</h2>
      <p>
        Die App stellt technische Werkzeuge bereit und ersetzt keine Rechtsberatung. Der Anbieter übernimmt keine Gewähr
        dafür, dass der Einsatz der App im Einzelfall alle rechtlichen Anforderungen erfüllt. Gesetzesänderungen werden
        nach Möglichkeit zeitnah umgesetzt.
      </p>

      <h2 style={s.h2}>6. Haftung</h2>
      <p>
        Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie nach dem Produkthaftungsgesetz. Bei
        einfacher Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten und begrenzt auf den
        vertragstypischen, vorhersehbaren Schaden, höchstens jedoch auf die in den letzten zwölf Monaten gezahlten
        Gebühren.
      </p>

      <h2 style={s.h2}>7. Datenschutz</h2>
      <p>Es gilt die <a href="/privacy">Datenschutzerklärung</a>.</p>

      <h2 style={s.h2}>8. Schlussbestimmungen</h2>
      <p>
        Es gilt deutsches Recht. Gerichtsstand ist, soweit zulässig, Köln. Änderungen dieser Bedingungen werden dem Händler
        mindestens 30 Tage vor Inkrafttreten mitgeteilt.
      </p>

      <h2 style={s.h2} id="en">Terms of Service (English summary)</h2>
      <p>
        These terms apply between {operator.name} and merchants installing {operator.appName}. The app provides the
        statutory EU withdrawal function with acknowledgement of receipt and log, plus theme blocks for the harmonised
        legal-guarantee notice, the harmonised durability label and right-to-repair information. Fees are billed via
        Shopify Billing with a 14-day free trial; uninstalling ends the contract. Merchants remain responsible for the
        legal set-up of their store; the app is not legal advice. Liability is limited to intent and gross negligence
        and, for simple negligence, to foreseeable damages capped at the fees paid in the last twelve months. German law
        applies.
      </p>
    </main>
  );
}

import { operator } from "../lib/operator";

const s = {
  main: { fontFamily: "Inter, system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: 32, lineHeight: 1.6, color: "#1a1a1a" },
  h1: { fontSize: 28, marginBottom: 8 },
  h2: { fontSize: 20, marginTop: 28 },
  small: { color: "#666", fontSize: 14 },
} as const;

export default function PrivacyPage() {
  return (
    <main style={s.main}>
      <h1 style={s.h1}>Datenschutzerklärung – {operator.appName}</h1>
      <p style={s.small}>Stand: September 2026 · <a href="#en">English version below</a></p>

      <h2 style={s.h2}>1. Verantwortlicher und Rollen</h2>
      <p>
        Anbieter der App ist {operator.name}, {operator.address}, E-Mail{" "}
        <a href={`mailto:${operator.supportEmail}`}>{operator.supportEmail}</a> („Anbieter“). Für die im Rahmen der
        App verarbeiteten personenbezogenen Daten der Endkunden ist der jeweilige Shop-Betreiber Verantwortlicher im
        Sinne von Art. 4 Nr. 7 DSGVO. Der Anbieter verarbeitet diese Daten als Auftragsverarbeiter (Art. 28 DSGVO) auf
        Grundlage der Shopify-Partnerbedingungen und dieser Erklärung.
      </p>

      <h2 style={s.h2}>2. Welche Daten verarbeitet werden</h2>
      <ul>
        <li>
          <strong>Widerrufserklärungen:</strong> Name, Bestell-/Vertragskennung, E-Mail-Adresse, optional Bestelldatum und
          weitere Angaben des Verbrauchers, Zeitpunkt der Abgabe, Sprache, gekürzter Hash der IP-Adresse und der
          Browser-Kennung (zur Missbrauchsabwehr), sowie – soweit zuordenbar – Bestellnummer und Bestell-ID aus Shopify.
        </li>
        <li>
          <strong>Shop-Daten:</strong> Shop-Domain, Shop-Name, Kontakt-E-Mail, Währung, Zeitzone, Sprache, Zugriffstoken für
          die Shopify-Admin-API und die vom Shop-Betreiber vorgenommenen Einstellungen.
        </li>
        <li>
          <strong>Produkt-Metafelder:</strong> Angaben zu Herstellergarantien (Hersteller, Dauer, Modell), die der
          Shop-Betreiber pflegt.
        </li>
      </ul>
      <p>Die App setzt keine Cookies und verwendet keine Tracking- oder Analysedienste.</p>

      <h2 style={s.h2}>3. Zwecke und Rechtsgrundlagen</h2>
      <ul>
        <li>Bereitstellung der elektronischen Widerrufsfunktion und der Eingangsbestätigung (Art. 11a Richtlinie 2011/83/EU, § 356a BGB) – Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit dem Auftrag des Shop-Betreibers.</li>
        <li>Nachweis des fristgerechten Widerrufs und Bearbeitung der Rückabwicklung – Art. 6 Abs. 1 lit. b und c DSGVO.</li>
        <li>Missbrauchs- und Spam-Abwehr (Hash der IP-Adresse) – Art. 6 Abs. 1 lit. f DSGVO.</li>
        <li>Anzeige des harmonisierten Gewährleistungshinweises und der Kennzeichnung (Verordnung (EU) 2025/1960) – hierfür werden keine personenbezogenen Daten verarbeitet.</li>
      </ul>

      <h2 style={s.h2}>4. E-Mail-Versand</h2>
      <p>
        Eingangsbestätigungen an Verbraucher und Benachrichtigungen an den Shop-Betreiber werden über einen vom Anbieter
        beauftragten E-Mail-Dienstleister (SMTP) versendet. Der Dienstleister erhält dafür Empfängeradresse und Inhalt der
        E-Mail. Mit dem Dienstleister besteht ein Auftragsverarbeitungsvertrag.
      </p>

      <h2 style={s.h2}>5. Hosting und Speicherort</h2>
      <p>
        Die App wird auf Servern in der Europäischen Union (Region Frankfurt) betrieben. Daten werden nicht in Drittländer
        übermittelt, soweit dies nicht durch Shopify selbst erfolgt (siehe Datenschutzerklärung von Shopify).
      </p>

      <h2 style={s.h2}>5a. Technische und organisatorische Maßnahmen</h2>
      <ul>
        <li>Alle Verbindungen (Shop, Shopify-API, E-Mail-Versand) sind mit TLS verschlüsselt.</li>
        <li>Die Datenbank ist im Ruhezustand verschlüsselt (AES-256) und nur über ein Passwort-geschütztes Datenbankkonto erreichbar.</li>
        <li>IP-Adressen werden nicht im Klartext gespeichert, sondern nur als gesalzener SHA-256-Hash zur Missbrauchsabwehr.</li>
        <li>Zugriffs-Token von Shopify werden serverseitig gespeichert und nie an den Browser ausgeliefert; Webhooks werden per HMAC-Signatur verifiziert.</li>
        <li>Zugriff auf Produktionsdaten hat ausschließlich der Anbieter; es werden keine Daten an Dritte verkauft oder für Werbung genutzt.</li>
      </ul>

      <h2 style={s.h2}>6. Speicherdauer und Löschung</h2>
      <ul>
        <li>Widerrufserklärungen bleiben gespeichert, solange die App im Shop installiert ist; sie dienen dem Shop-Betreiber als Nachweis (gesetzliche Aufbewahrungsfristen von bis zu 10 Jahren können bestehen).</li>
        <li>Verlangt ein Kunde die Löschung (Shopify-Webhook „customers/redact“), werden Name, E-Mail-Adresse und Freitextangaben unverzüglich anonymisiert; Vorgangsnummer, Zeitstempel und Prüfsumme bleiben als Nachweis erhalten.</li>
        <li>48 Stunden nach Deinstallation der App (Webhook „shop/redact“) werden sämtliche Daten des Shops gelöscht.</li>
      </ul>

      <h2 style={s.h2}>7. Betroffenenrechte</h2>
      <p>
        Betroffene haben die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) sowie das Recht auf Beschwerde bei einer
        Aufsichtsbehörde. Verbraucher wenden sich hierfür an den Shop-Betreiber; der Anbieter unterstützt den
        Shop-Betreiber bei der Erfüllung dieser Rechte.
      </p>

      <h2 style={s.h2} id="en">Privacy Policy (English summary)</h2>
      <p>
        {operator.appName} is operated by {operator.name}, {operator.address} ({operator.supportEmail}). The merchant who
        installs the app is the data controller for end-customer data; the operator acts as processor. The app stores
        withdrawal statements (name, order reference, e-mail address, optional details, timestamp, hashed IP address),
        shop master data and merchant settings. Purposes: providing the statutory withdrawal function and acknowledgement
        of receipt (Art. 11a Directive 2011/83/EU), evidence of timely withdrawal, abuse prevention. E-mails are sent
        through an SMTP provider under a data-processing agreement. Hosting is in the EU (Frankfurt). Customer
        redaction requests anonymise personal fields immediately; all shop data is deleted 48 hours after uninstall. No
        cookies or tracking are used. Data subjects can exercise their GDPR rights through the merchant.
      </p>
    </main>
  );
}

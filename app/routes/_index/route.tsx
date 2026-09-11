import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, redirect, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { operator } from "../../lib/operator";
import { loginErrorMessage } from "./error.server";

type Lang = "en" | "de";

function pickLang(request: Request): Lang {
  const url = new URL(request.url);
  const q = url.searchParams.get("lang");
  if (q === "de" || q === "en") return q;
  const accept = (request.headers.get("accept-language") || "").toLowerCase();
  return accept.startsWith("de") ? "de" : "en";
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return {
    lang: pickLang(request),
    showForm: Boolean(login),
    supportEmail: operator.supportEmail,
    appStoreUrl: process.env.APP_STORE_URL || "",
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export function meta({ data }: { data?: { lang: Lang } }) {
  const de = data?.lang === "de";
  return [
    { title: de ? "EU Compliance Suite – Widerrufsbutton, Gewährleistungshinweis & GARAN-Label für Shopify" : "EU Compliance Suite – EU withdrawal button, legal-guarantee notice & GARAN label for Shopify" },
    {
      name: "description",
      content: de
        ? "Widerrufsbutton nach Art. 11a VRRL / § 356a BGB, amtlicher Gewährleistungshinweis und GARAN-Kennzeichnung (VO (EU) 2025/1960) in einer Shopify-App – 24 EU-Sprachen, ohne Theme-Änderung, 14 Tage kostenlos."
        : "Withdrawal button (Art. 11a Consumer Rights Directive), harmonised legal-guarantee notice and GARAN label (Reg. (EU) 2025/1960) in one Shopify app – 24 EU languages, no theme code, 14-day free trial.",
    },
  ];
}

const T = {
  en: {
    switch: "Deutsch",
    switchHref: "/?lang=de",
    kicker: "Shopify app · EU consumer law 2026",
    h1: "The withdrawal button and the new EU guarantee labels – one app, all 24 EU languages.",
    lead:
      "Since 19 June 2026 every EU online shop must offer a withdrawal button (Art. 11a Consumer Rights Directive). From 27 September 2026 the harmonised legal-guarantee notice and the GARAN label become mandatory (Regulation (EU) 2025/1960). EU Compliance Suite adds all three as theme app blocks – no theme code, official artwork and wording, automatically in your customer's language.",
    ctaStore: "Install from the Shopify App Store",
    ctaForm: "Install on your store",
    ctaVideo: "Watch the 90-second demo",
    deadlines: "Deadlines",
    d1: "19 June 2026 – withdrawal button with two-step confirmation and acknowledgement of receipt (Directive (EU) 2023/2673, in Germany § 356a BGB).",
    d2: "27 September 2026 – harmonised legal-guarantee notice before checkout and GARAN label for producer guarantees over two years (Directive (EU) 2024/825, Implementing Regulation (EU) 2025/1960).",
    d3: "31 July 2026 – information on the right to repair for new sales contracts (Directive (EU) 2024/1799).",
    pillars: "What the app does",
    p1t: "Withdrawal function",
    p1: "Button with the official wording on every page, two-step confirmation exactly as required, automatic time-stamped acknowledgement of receipt to the consumer and a copy to you. Works without a customer account.",
    p2t: "Evidence log",
    p2: "Every statement is stored with reference number, timestamp and SHA-256 checksum, matched to the Shopify order, tagged, exportable as CSV and anonymised on request (GDPR).",
    p3t: "Legal-guarantee notice and GARAN label",
    p3: "The official notice and label artwork, unaltered and in colour, automatically in the storefront language. The GARAN label reads the guarantee data from product metafields.",
    p4t: "Multilingual by design",
    p4: "Storefront blocks in all 24 EU languages, acknowledgement e-mails in 10 languages, admin in English, German, French, Spanish, Italian, Dutch, Polish, Portuguese, Swedish and Danish – following your Shopify admin language.",
    screens: "Screenshots",
    pricing: "Pricing",
    basic: "Basic – 6.99 USD / month",
    basicF: ["Withdrawal button in 24 EU languages", "Time-stamped acknowledgement of receipt", "Withdrawal log and CSV export", "Matching to the order"],
    pro: "Pro – 12.99 USD / month",
    proF: ["Everything in Basic", "Legal-guarantee notice", "GARAN label per product", "Repair notice, order tagging, priority support"],
    trial: "14-day free trial on both plans, cancel monthly via Shopify Billing.",
    faq: "Questions",
    q1: "Does the button meet the legal wording?",
    a1: "Yes. The app uses the wording prescribed by the directive in each EU language (e.g. “Withdraw from contract here” / “Confirm withdrawal”, in German “Vertrag widerrufen” / “Widerruf bestätigen”).",
    q2: "Where is data stored?",
    a2: "On servers in Frankfurt (EU). No cookies, no tracking. A data-processing statement is included in the privacy policy.",
    q3: "Do I need to change my theme?",
    a3: "No. Everything is added as theme app blocks and an app embed in the theme editor.",
    install: "Install the app",
    shopDomain: "Shop domain",
    next: "Continue",
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    footerSupport: "Support",
    footerScreencast: "Screencast",
  },
  de: {
    switch: "English",
    switchHref: "/?lang=en",
    kicker: "Shopify-App · EU-Verbraucherrecht 2026",
    h1: "Widerrufsbutton und die neuen EU-Garantielabels – eine App, alle 24 EU-Sprachen.",
    lead:
      "Seit dem 19. Juni 2026 muss jeder Onlineshop in der EU einen Widerrufsbutton anbieten (Art. 11a Verbraucherrechte-Richtlinie, § 356a BGB). Ab dem 27. September 2026 kommen der amtliche Gewährleistungshinweis und die GARAN-Kennzeichnung hinzu (Verordnung (EU) 2025/1960). Die EU Compliance Suite liefert alle drei Pflichten als Theme-App-Blöcke – ohne Theme-Code, mit amtlichen Grafiken und Beschriftungen, automatisch in der Sprache Ihres Kunden.",
    ctaStore: "Im Shopify App Store installieren",
    ctaForm: "In Ihrem Shop installieren",
    ctaVideo: "90-Sekunden-Demo ansehen",
    deadlines: "Fristen",
    d1: "19. Juni 2026 – Widerrufsbutton mit zweistufiger Bestätigung und Eingangsbestätigung (RL (EU) 2023/2673, § 356a BGB).",
    d2: "27. September 2026 – harmonisierter Gewährleistungshinweis vor dem Kauf und GARAN-Kennzeichnung für Herstellergarantien über zwei Jahre (RL (EU) 2024/825, Durchführungs-VO (EU) 2025/1960).",
    d3: "31. Juli 2026 – Hinweis zum Recht auf Reparatur für neue Kaufverträge (RL (EU) 2024/1799).",
    pillars: "Was die App macht",
    p1t: "Widerrufsfunktion",
    p1: "Button mit der amtlichen Beschriftung auf jeder Seite, zweistufige Bestätigung genau nach Gesetz, automatische Eingangsbestätigung mit Zeitstempel an den Kunden und Kopie an Sie. Funktioniert ohne Kundenkonto.",
    p2t: "Beweisprotokoll",
    p2: "Jede Erklärung wird mit Vorgangsnummer, Zeitstempel und SHA-256-Prüfsumme gespeichert, der Shopify-Bestellung zugeordnet, getaggt, als CSV exportiert und auf Wunsch anonymisiert (DSGVO).",
    p3t: "Gewährleistungshinweis und GARAN-Label",
    p3: "Die amtlichen Grafiken für Hinweis und Kennzeichnung, unverändert und farbig, automatisch in der Shop-Sprache. Das GARAN-Label liest die Garantiedaten aus Produkt-Metafeldern.",
    p4t: "Mehrsprachig von Grund auf",
    p4: "Shop-Blöcke in allen 24 EU-Sprachen, Eingangsbestätigungen in 10 Sprachen, Admin auf Englisch, Deutsch, Französisch, Spanisch, Italienisch, Niederländisch, Polnisch, Portugiesisch, Schwedisch und Dänisch – passend zur Sprache Ihres Shopify-Admins.",
    screens: "Screenshots",
    pricing: "Preise",
    basic: "Basic – 6,99 USD / Monat",
    basicF: ["Widerrufsbutton in 24 EU-Sprachen", "Eingangsbestätigung mit Zeitstempel", "Widerrufsprotokoll und CSV-Export", "Zuordnung zur Bestellung"],
    pro: "Pro – 12,99 USD / Monat",
    proF: ["Alles aus Basic", "Gesetzlicher Gewährleistungshinweis", "GARAN-Kennzeichnung pro Produkt", "Reparaturhinweis, Tagging, Prioritäts-Support"],
    trial: "14 Tage kostenlos testen, monatlich über Shopify Billing kündbar.",
    faq: "Fragen",
    q1: "Entspricht der Button der gesetzlichen Beschriftung?",
    a1: "Ja. Die App verwendet die in der Richtlinie vorgegebene Beschriftung in jeder EU-Sprache („Vertrag widerrufen“ / „Widerruf bestätigen“, englisch „Withdraw from contract here“ / „Confirm withdrawal“).",
    q2: "Wo liegen die Daten?",
    a2: "Auf Servern in Frankfurt (EU). Keine Cookies, kein Tracking. Die Angaben zur Auftragsverarbeitung stehen in der Datenschutzerklärung.",
    q3: "Muss ich mein Theme ändern?",
    a3: "Nein. Alles wird als Theme-App-Blöcke und App-Einbettung im Theme-Editor hinzugefügt.",
    install: "App installieren",
    shopDomain: "Shop-Domain",
    next: "Weiter",
    footerPrivacy: "Datenschutz",
    footerTerms: "Nutzungsbedingungen",
    footerSupport: "Support",
    footerScreencast: "Screencast",
  },
};

const styles = {
  page: { fontFamily: "Inter, system-ui, sans-serif", color: "#1a1a1a", maxWidth: 1040, margin: "0 auto", padding: "32px 24px 48px", lineHeight: 1.55 },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 32 },
  kicker: { color: "#003399", fontWeight: 600, fontSize: 14, letterSpacing: 0.3, textTransform: "uppercase" as const },
  h1: { fontSize: 38, lineHeight: 1.15, margin: "8px 0 16px", letterSpacing: -0.5 },
  lead: { fontSize: 18, color: "#333", margin: "0 0 24px", maxWidth: 820 },
  ctaRow: { display: "flex", flexWrap: "wrap" as const, gap: 12, marginBottom: 40 },
  button: { background: "#003399", color: "#fff", border: 0, borderRadius: 8, padding: "12px 20px", fontSize: 16, cursor: "pointer", textDecoration: "none", display: "inline-block" },
  buttonSecondary: { background: "#fff", color: "#003399", border: "2px solid #003399", borderRadius: 8, padding: "10px 18px", fontSize: 16, textDecoration: "none", display: "inline-block" },
  h2: { fontSize: 24, margin: "40px 0 12px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 },
  card: { border: "1px solid #e3e3e3", borderRadius: 12, padding: 20 },
  img: { width: "100%", height: "auto", borderRadius: 10, border: "1px solid #e3e3e3" },
  input: { width: "100%", padding: "10px 12px", fontSize: 16, border: "1px solid #bbb", borderRadius: 8, margin: "8px 0 12px", boxSizing: "border-box" as const },
  small: { color: "#666", fontSize: 14 },
} as const;

export default function Index() {
  const { lang, showForm, supportEmail, appStoreUrl } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};
  const t = T[lang as Lang];
  const shots = [
    ["screenshot-cover", lang === "de" ? "Widerrufsbutton im Shop" : "Withdrawal button in the storefront"],
    ["screenshot-form", lang === "de" ? "Widerrufsformular" : "Withdrawal form"],
    ["screenshot-review", lang === "de" ? "Prüfschritt „Widerruf bestätigen“" : "Review step “Confirm withdrawal”"],
    ["screenshot-success", lang === "de" ? "Eingangsbestätigung mit Vorgangsnummer" : "Receipt with reference number"],
    ["screenshot-product", lang === "de" ? "GARAN-Kennzeichnung auf der Produktseite" : "GARAN label on the product page"],
    ["screenshot-notice", lang === "de" ? "Gewährleistungshinweis im Warenkorb" : "Legal-guarantee notice in the cart"],
  ];

  return (
    <main style={styles.page}>
      <div style={styles.top}>
        <span style={styles.kicker}>{t.kicker}</span>
        <a href={t.switchHref} style={styles.small}>{t.switch}</a>
      </div>
      <h1 style={styles.h1}>{t.h1}</h1>
      <p style={styles.lead}>{t.lead}</p>
      <div style={styles.ctaRow}>
        {appStoreUrl ? (
          <a href={appStoreUrl} style={styles.button}>{t.ctaStore}</a>
        ) : (
          <a href="#install" style={styles.button}>{t.ctaForm}</a>
        )}
        <a href="/screencast" style={styles.buttonSecondary}>{t.ctaVideo}</a>
      </div>

      <h2 style={styles.h2}>{t.deadlines}</h2>
      <ul>
        <li>{t.d1}</li>
        <li>{t.d2}</li>
        <li>{t.d3}</li>
      </ul>

      <h2 style={styles.h2}>{t.pillars}</h2>
      <div style={styles.grid}>
        {[
          [t.p1t, t.p1],
          [t.p2t, t.p2],
          [t.p3t, t.p3],
          [t.p4t, t.p4],
        ].map(([h, p]) => (
          <div key={h} style={styles.card}>
            <h3 style={{ marginTop: 0 }}>{h}</h3>
            <p style={{ marginBottom: 0 }}>{p}</p>
          </div>
        ))}
      </div>

      <h2 style={styles.h2}>{t.screens}</h2>
      <div style={styles.grid}>
        {shots.map(([file, alt]) => (
          <figure key={file} style={{ margin: 0 }}>
            <img src={`/img/${lang}/${file}.png`} alt={alt} style={styles.img} loading="lazy" width={1600} height={900} />
            <figcaption style={styles.small}>{alt}</figcaption>
          </figure>
        ))}
      </div>

      <h2 style={styles.h2}>{t.pricing}</h2>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={{ marginTop: 0 }}>{t.basic}</h3>
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>{t.basicF.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
        <div style={styles.card}>
          <h3 style={{ marginTop: 0 }}>{t.pro}</h3>
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>{t.proF.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      </div>
      <p style={styles.small}>{t.trial}</p>

      <h2 style={styles.h2}>{t.faq}</h2>
      <p><strong>{t.q1}</strong><br />{t.a1}</p>
      <p><strong>{t.q2}</strong><br />{t.a2}</p>
      <p><strong>{t.q3}</strong><br />{t.a3}</p>

      {showForm && (
        <div id="install" style={{ ...styles.card, marginTop: 32 }}>
          <h2 style={{ marginTop: 0 }}>{t.install}</h2>
          <Form method="post">
            <label>
              {t.shopDomain}
              <input style={styles.input} type="text" name="shop" placeholder="my-shop.myshopify.com" />
            </label>
            {errors.shop && <p style={{ color: "#b00020" }}>{errors.shop}</p>}
            <button style={styles.button} type="submit">{t.next}</button>
          </Form>
        </div>
      )}
      <p style={{ ...styles.small, marginTop: 32 }}>
        {operator.name} · {operator.address} · <a href="/privacy">{t.footerPrivacy}</a> · <a href="/terms">{t.footerTerms}</a> ·{" "}
        <a href="/support">{t.footerSupport}</a> · <a href="/screencast">{t.footerScreencast}</a> · <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
      </p>
    </main>
  );
}

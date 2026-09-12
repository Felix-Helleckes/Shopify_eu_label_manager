import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, redirect, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { operator } from "../../lib/operator";
import { loginErrorMessage } from "./error.server";
import { LANDING_CSS } from "./styles";

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
  const deadline = new Date("2026-09-27T00:00:00Z");
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / 86400000);
  return {
    lang: pickLang(request),
    showForm: Boolean(login),
    supportEmail: operator.supportEmail,
    appStoreUrl: process.env.APP_STORE_URL || "",
    daysLeft,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export function meta({ data }: { data?: { lang: Lang } }) {
  const de = data?.lang === "de";
  return [
    {
      title: de
        ? "EU Compliance Suite – Widerrufsbutton, Gewährleistungshinweis & GARAN-Label für Shopify"
        : "EU Compliance Suite – EU withdrawal button, legal-guarantee notice & GARAN label for Shopify",
    },
    {
      name: "description",
      content: de
        ? "Widerrufsbutton nach Art. 11a VRRL / § 356a BGB, amtlicher Gewährleistungshinweis und GARAN-Kennzeichnung (VO (EU) 2025/1960) in einer Shopify-App – 24 EU-Sprachen, ohne Theme-Änderung, Label-Blöcke kostenlos."
        : "Withdrawal button (Art. 11a Consumer Rights Directive), harmonised legal-guarantee notice and GARAN label (Reg. (EU) 2025/1960) in one Shopify app – 24 EU languages, no theme code, label blocks free.",
    },
    { name: "author", content: "Felix Helleckes" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "EU Compliance Suite",
        url: "https://eu-compliance-suite.fly.dev/",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        author: {
          "@type": "Person",
          "@id": "https://felix-helleckes.github.io/#person",
          name: "Felix Helleckes",
          url: "https://felix-helleckes.github.io/",
          jobTitle: "QA & Test Automation Engineer",
          sameAs: [
            "https://github.com/Felix-Helleckes",
            "https://www.linkedin.com/in/felix-helleckes/",
            "https://stackoverflow.com/users/15774380/felix-helleckes",
          ],
        },
      },
    },
  ];
}

const T = {
  en: {
    switchLabel: "Deutsch",
    switchHref: "/?lang=de",
    navFeatures: "Features",
    navPricing: "Pricing",
    navDemo: "Demo",
    kicker: "Shopify app · EU consumer law 2026",
    h1: "Two EU duties. One app. All 24 languages.",
    lead:
      "Since 19 June 2026 every EU online shop must offer a withdrawal button. From 27 September 2026 the harmonised legal-guarantee notice and the GARAN label become mandatory. EU Compliance Suite ships all of it as theme app blocks – official wording and artwork, automatically in your customer's language, without touching your theme.",
    ctaStore: "View in the Shopify App Store",
    ctaForm: "Install on your store",
    ctaVideo: "Watch the 90-second demo",
    heroNote: "Notice and GARAN label are free, forever. The withdrawal function starts at 6.99 USD per month.",
    heroAlt: "Withdrawal button and dialog in a storefront",
    deadlines: "The three deadlines",
    dl1d: "19 June 2026",
    dl1: "Withdrawal button with two-step confirmation and an acknowledgement of receipt (Directive (EU) 2023/2673, in Germany § 356a BGB).",
    dl2d: "27 September 2026",
    dl2: "Harmonised legal-guarantee notice before purchase, plus the GARAN label for producer guarantees longer than two years (Reg. (EU) 2025/1960).",
    dl3d: "31 July 2026",
    dl3: "Information on the right to repair for new sales contracts (Directive (EU) 2024/1799).",
    live: "in force",
    soon: "{n} days left",
    featTitle: "What the app does",
    featSub: "Everything a merchant needs to be compliant on both dates – and to prove it later.",
    f1t: "Withdrawal function",
    f1: "The button carries the official wording on every page, the confirmation is two-step exactly as the law requires, and the consumer gets a time-stamped acknowledgement by e-mail. Works without a customer account.",
    f2t: "Evidence that holds up",
    f2: "Every statement is stored with a reference number, a timestamp and a SHA-256 checksum, matched to the Shopify order, tagged, exportable as CSV and anonymised on request.",
    f3t: "Official artwork",
    f3: "The legal-guarantee notice and the GARAN label are the unaltered EU originals, in colour, automatically in the storefront language. The label reads its data from product metafields.",
    f4t: "Multilingual by default",
    f4: "Storefront blocks in all 24 EU languages, acknowledgement e-mails in all 24, and an admin in ten languages that follows your Shopify admin automatically.",
    f5t: "No theme code",
    f5: "Everything is added as theme app blocks and an app embed in the theme editor. Nothing is written into your theme files, so updates and theme changes stay safe.",
    cookieText: "This website uses Google Analytics to understand how it is used. Allow analytics cookies?",
    cookieAccept: "Accept",
    cookieDecline: "Decline",
    cookieMore: "Privacy policy",
    f6t: "No cookies, no tracking in the app",
    f6: "The app sets no cookies in your shop and tracks none of your customers. Storage and processing happen exclusively in Frankfurt, and the privacy policy plus a data-processing section are ready to hand to your lawyer. This marketing website measures visits with Google Analytics, but only after you agree to it.",
    shotsTitle: "How it looks",
    shotsSub: "Screenshots from a live shop. Your theme's fonts and colours are used automatically.",
    s1: "Withdrawal button and dialog in the storefront",
    s2: "The form asks only for the mandatory details",
    s3: "Second step: review and confirm",
    s4: "Receipt with reference number and timestamp",
    s5: "GARAN label on the product page",
    s6: "Legal-guarantee notice in the cart",
    pricingTitle: "Pricing",
    pricingSub: "Start free with the label blocks. Add the withdrawal function when you need it.",
    free: "Label",
    freeAmount: "Free",
    freeUnit: "forever",
    freeF: [
      "Legal-guarantee notice block",
      "GARAN label per product",
      "Right-to-repair notice",
      "All 24 EU languages",
      "No subscription, no time limit",
    ],
    basic: "Basic",
    basicUnit: "USD / month",
    basicF: [
      "Everything in Label",
      "Withdrawal button, official wording",
      "Two-step confirmation",
      "Time-stamped acknowledgement",
      "Withdrawal log with order matching",
      "E-mail notification for every case",
    ],
    pro: "Pro",
    proUnit: "USD / month",
    proF: ["Everything in Basic", "Automatic order tagging", "Withdrawal metafield on the order", "CSV export of the log", "Priority support"],
    best: "Most popular",
    trial: "Basic and Pro start with a 14-day free trial and can be cancelled monthly through Shopify Billing.",
    faqTitle: "Questions",
    q1: "Is the button worded the way the law requires?",
    a1: "Yes. The app uses the wording prescribed by the directive in each EU language, for example “Withdraw from contract here” and “Confirm withdrawal”, in German “Vertrag widerrufen” and “Widerruf bestätigen”. You can override it, but you do not have to.",
    q2: "Where is the data stored?",
    a2: "Everything stays in the EU: withdrawal statements, shop data and settings live in a database in Frankfurt, Germany, and the application runs on servers in Frankfurt too. The live region is shown at /healthcheck. The app sets no cookies and tracks nobody; this website measures visits only with your consent.",
    q3: "Do I have to change my theme?",
    a3: "No. Everything is added as theme app blocks and an app embed in the theme editor, so nothing is written into your theme files.",
    q4: "What happens to a withdrawal that does not match an order?",
    a4: "It is accepted and acknowledged anyway, because the law requires that, and it is flagged in the log so you can check it manually.",
    q5: "Does this replace legal advice?",
    a5: "No. The app implements the technical requirements and uses the official wording and artwork. Your own withdrawal information and terms remain your responsibility.",
    installTitle: "Install the app",
    installSub: "Enter your shop domain, approve the permissions, done in five minutes.",
    shopDomain: "Shop domain",
    next: "Continue",
    footPrivacy: "Privacy",
    footTerms: "Terms",
    footSupport: "Support",
    footDemo: "Screencast",
  },
  de: {
    switchLabel: "English",
    switchHref: "/?lang=en",
    navFeatures: "Funktionen",
    navPricing: "Preise",
    navDemo: "Demo",
    kicker: "Shopify-App · EU-Verbraucherrecht 2026",
    h1: "Zwei EU-Pflichten. Eine App. Alle 24 Sprachen.",
    lead:
      "Seit dem 19. Juni 2026 muss jeder Onlineshop in der EU einen Widerrufsbutton anbieten. Ab dem 27. September 2026 kommen der amtliche Gewährleistungshinweis und das GARAN-Label dazu. Die EU Compliance Suite liefert alles als Theme-App-Blöcke – amtliche Beschriftungen und Grafiken, automatisch in der Sprache Ihres Kunden, ohne Eingriff ins Theme.",
    ctaStore: "Im Shopify App Store ansehen",
    ctaForm: "In Ihrem Shop installieren",
    ctaVideo: "90-Sekunden-Demo ansehen",
    heroNote: "Hinweis und GARAN-Label sind dauerhaft kostenlos. Die Widerrufsfunktion gibt es ab 6,99 USD im Monat.",
    heroAlt: "Widerrufsbutton und Dialog in einem Shop",
    deadlines: "Die drei Fristen",
    dl1d: "19. Juni 2026",
    dl1: "Widerrufsbutton mit zweistufiger Bestätigung und Eingangsbestätigung (RL (EU) 2023/2673, § 356a BGB).",
    dl2d: "27. September 2026",
    dl2: "Amtlicher Gewährleistungshinweis vor dem Kauf und GARAN-Label für Herstellergarantien über zwei Jahre (VO (EU) 2025/1960).",
    dl3d: "31. Juli 2026",
    dl3: "Hinweis zum Recht auf Reparatur für neue Kaufverträge (RL (EU) 2024/1799).",
    live: "gilt bereits",
    soon: "noch {n} Tage",
    featTitle: "Was die App macht",
    featSub: "Alles, was ein Shop für beide Stichtage braucht – und um es später nachweisen zu können.",
    f1t: "Widerrufsfunktion",
    f1: "Der Button trägt auf jeder Seite die amtliche Beschriftung, die Bestätigung ist zweistufig genau nach Gesetz, und der Kunde bekommt eine Eingangsbestätigung mit Zeitstempel per E-Mail. Funktioniert ohne Kundenkonto.",
    f2t: "Nachweis, der trägt",
    f2: "Jede Erklärung wird mit Vorgangsnummer, Zeitstempel und SHA-256-Prüfsumme gespeichert, der Bestellung zugeordnet, getaggt, als CSV exportiert und auf Wunsch anonymisiert.",
    f3t: "Amtliche Grafiken",
    f3: "Gewährleistungshinweis und GARAN-Label sind die unveränderten EU-Originale, farbig, automatisch in der Shop-Sprache. Das Label liest seine Daten aus Produkt-Metafeldern.",
    f4t: "Mehrsprachig von Haus aus",
    f4: "Shop-Blöcke in allen 24 EU-Sprachen, Eingangsbestätigungen in allen 24, und ein Admin in zehn Sprachen, der automatisch Ihrer Shopify-Sprache folgt.",
    f5t: "Kein Theme-Code",
    f5: "Alles wird als Theme-App-Block und App-Einbettung im Theme-Editor hinzugefügt. In Ihre Theme-Dateien wird nichts geschrieben, Updates und Theme-Wechsel bleiben unproblematisch.",
    cookieText: "Diese Website nutzt Google Analytics, um die Nutzung zu verstehen. Analyse-Cookies zulassen?",
    cookieAccept: "Akzeptieren",
    cookieDecline: "Ablehnen",
    cookieMore: "Datenschutz",
    f6t: "Keine Cookies, kein Tracking in der App",
    f6: "Die App setzt keine Cookies in Ihrem Shop und trackt keine Ihrer Kundinnen und Kunden. Speicherung und Verarbeitung finden ausschließlich in Frankfurt statt, Datenschutzerklärung und Angaben zur Auftragsverarbeitung liegen fertig bereit. Diese Website misst Besuche mit Google Analytics, aber erst nach Ihrer Zustimmung.",
    shotsTitle: "So sieht es aus",
    shotsSub: "Screenshots aus einem echten Shop. Schriften und Farben Ihres Themes werden automatisch übernommen.",
    s1: "Widerrufsbutton und Dialog im Shop",
    s2: "Das Formular fragt nur die Pflichtangaben ab",
    s3: "Zweiter Schritt: prüfen und bestätigen",
    s4: "Eingangsbestätigung mit Vorgangsnummer und Zeitstempel",
    s5: "GARAN-Kennzeichnung auf der Produktseite",
    s6: "Gewährleistungshinweis im Warenkorb",
    pricingTitle: "Preise",
    pricingSub: "Kostenlos mit den Label-Blöcken starten. Die Widerrufsfunktion dazunehmen, wenn Sie sie brauchen.",
    free: "Label",
    freeAmount: "kostenlos",
    freeUnit: "dauerhaft",
    freeF: [
      "Block „Gesetzlicher Gewährleistungshinweis“",
      "GARAN-Kennzeichnung pro Produkt",
      "Hinweis zum Recht auf Reparatur",
      "Alle 24 EU-Sprachen",
      "Kein Abo, keine zeitliche Begrenzung",
    ],
    basic: "Basic",
    basicUnit: "USD / Monat",
    basicF: [
      "Alles aus Label",
      "Widerrufsbutton mit amtlicher Beschriftung",
      "Zweistufige Bestätigung",
      "Eingangsbestätigung mit Zeitstempel",
      "Widerrufsprotokoll mit Bestellzuordnung",
      "E-Mail-Benachrichtigung bei jedem Fall",
    ],
    pro: "Pro",
    proUnit: "USD / Monat",
    proF: [
      "Alles aus Basic",
      "Bestellung automatisch taggen",
      "Widerrufs-Metafeld an der Bestellung",
      "CSV-Export des Protokolls",
      "Prioritäts-Support",
    ],
    best: "Am beliebtesten",
    trial: "Basic und Pro starten mit 14 Tagen kostenloser Testphase und sind monatlich über Shopify Billing kündbar.",
    faqTitle: "Fragen",
    q1: "Entspricht der Button der gesetzlichen Beschriftung?",
    a1: "Ja. Die App verwendet die in der Richtlinie vorgegebene Beschriftung in jeder EU-Sprache, auf Deutsch „Vertrag widerrufen“ und „Widerruf bestätigen“. Sie können den Text überschreiben, müssen es aber nicht.",
    q2: "Wo liegen die Daten?",
    a2: "Alles bleibt in der EU: Widerrufserklärungen, Shop-Daten und Einstellungen liegen in einer Datenbank in Frankfurt am Main, und die Anwendung läuft ebenfalls auf Servern in Frankfurt. Die aktuelle Region steht unter /healthcheck. Die App setzt keine Cookies und trackt niemanden; diese Website misst Besuche nur mit Ihrer Einwilligung.",
    q3: "Muss ich mein Theme ändern?",
    a3: "Nein. Alles wird als Theme-App-Block und App-Einbettung im Theme-Editor hinzugefügt, in Ihre Theme-Dateien wird nichts geschrieben.",
    q4: "Was passiert mit einem Widerruf ohne passende Bestellung?",
    a4: "Er wird trotzdem angenommen und bestätigt, weil das Gesetz das verlangt, und im Protokoll markiert, damit Sie ihn manuell prüfen können.",
    q5: "Ersetzt das eine Rechtsberatung?",
    a5: "Nein. Die App setzt die technischen Anforderungen um und verwendet die amtlichen Texte und Grafiken. Ihre eigene Widerrufsbelehrung und Ihre AGB bleiben Ihre Sache.",
    installTitle: "App installieren",
    installSub: "Shop-Domain eingeben, Berechtigungen bestätigen, in fünf Minuten fertig.",
    shopDomain: "Shop-Domain",
    next: "Weiter",
    footPrivacy: "Datenschutz",
    footTerms: "Nutzungsbedingungen",
    footSupport: "Support",
    footDemo: "Screencast",
  },
} as const;

/* Analytics für DIESE Website (nicht für die eingebettete App). Consent Mode v2
 * setzt alles auf "denied"; gtag.js wird erst nach ausdruecklicher Zustimmung
 * nachgeladen. Die App selbst im Shopify-Admin bindet nichts davon ein. */
const GA_ID = "G-PQGTJ9J9B0";
const CONSENT_KEY = "ecs_site_consent";

function readConsent(): string | null {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}

function loadGA() {
  const w = window as unknown as { dataLayer?: unknown[]; __gaLoaded?: boolean };
  if (w.__gaLoaded) return;
  w.__gaLoaded = true;
  w.dataLayer = w.dataLayer || [];
  const gtag = (...args: unknown[]) => { w.dataLayer!.push(args); };
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
}

function ConsentBanner({ t }: { t: { cookieText: string; cookieAccept: string; cookieDecline: string; cookieMore: string } }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = readConsent();
    if (choice === "granted") loadGA();
    else if (choice !== "denied") setVisible(true);
  }, []);

  const decide = (value: "granted" | "denied") => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* Speicher gesperrt: Wahl gilt nur fuer diesen Aufruf */ }
    setVisible(false);
    if (value === "granted") loadGA();
  };

  if (!visible) return null;
  return (
    <div className="consent">
      <p>{t.cookieText}</p>
      <div className="consent-actions">
        <button type="button" onClick={() => decide("denied")}>{t.cookieDecline}</button>
        <button type="button" className="primary" onClick={() => decide("granted")}>{t.cookieAccept}</button>
        <a href="/privacy">{t.cookieMore}</a>
      </div>
    </div>
  );
}

export default function Index() {
  const { lang, showForm, supportEmail, appStoreUrl, daysLeft } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};
  const t = T[lang as Lang];
  const soon = t.soon.replace("{n}", String(Math.max(daysLeft, 0)));

  const shots: [string, string][] = [
    ["screenshot-review", t.s3],
    ["screenshot-success", t.s4],
    ["screenshot-product", t.s5],
    ["screenshot-notice", t.s6],
  ];

  const features: [string, string, string][] = [
    ["↶", t.f1t, t.f1],
    ["✓", t.f2t, t.f2],
    ["★", t.f3t, t.f3],
    ["⊕", t.f4t, t.f4],
    ["⚙", t.f5t, t.f5],
    ["⊘", t.f6t, t.f6],
  ];

  const faq: [string, string][] = [
    [t.q1, t.a1],
    [t.q2, t.a2],
    [t.q3, t.a3],
    [t.q4, t.a4],
    [t.q5, t.a5],
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />

      <header className="wrap">
        <nav className="nav">
          <a className="brand" href="/">
            <span className="mark" aria-hidden="true">
              ✓
            </span>
            EU Compliance Suite
          </a>
          <div className="nav-right">
            <a href="#features">{t.navFeatures}</a>
            <a href="#pricing">{t.navPricing}</a>
            <a href="/screencast">{t.navDemo}</a>
            <a href={t.switchHref}>{t.switchLabel}</a>
          </div>
        </nav>
      </header>

      <main>
        <div className="wrap hero">
          <span className="kicker">
            <span className="dot" aria-hidden="true" />
            {t.kicker}
          </span>
          <h1>{t.h1}</h1>
          <p className="lead">{t.lead}</p>
          <div className="cta-row">
            {appStoreUrl ? (
              <a className="btn btn-primary" href={appStoreUrl}>
                {t.ctaStore}
              </a>
            ) : (
              <a className="btn btn-primary" href="#install">
                {t.ctaForm}
              </a>
            )}
            <a className="btn btn-ghost" href="/screencast">
              {t.ctaVideo}
            </a>
          </div>
          <p className="note">{t.heroNote}</p>
          <div className="hero-shot">
            <img src={`/img/${lang}/screenshot-form.png`} alt={t.heroAlt} width={1600} height={900} />
          </div>
        </div>

        <div className="dl">
          <div className="wrap">
            <h2>{t.deadlines}</h2>
            <div className="dl-grid">
              <div className="dl-item">
                <div className="dl-date">
                  {t.dl1d}
                  <span className="badge-live">{t.live}</span>
                </div>
                <p>{t.dl1}</p>
              </div>
              <div className="dl-item">
                <div className="dl-date">
                  {t.dl2d}
                  {daysLeft > 0 ? <span className="badge-soon">{soon}</span> : <span className="badge-live">{t.live}</span>}
                </div>
                <p>{t.dl2}</p>
              </div>
              <div className="dl-item">
                <div className="dl-date">
                  {t.dl3d}
                  <span className="badge-live">{t.live}</span>
                </div>
                <p>{t.dl3}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="wrap" id="features">
          <h2>{t.featTitle}</h2>
          <p className="sub">{t.featSub}</p>
          <div className="cards">
            {features.map(([ico, head, body]) => (
              <div className="card" key={head}>
                <div className="ico" aria-hidden="true">
                  {ico}
                </div>
                <h3>{head}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap">
          <h2>{t.shotsTitle}</h2>
          <p className="sub">{t.shotsSub}</p>
          <div className="shots">
            {shots.map(([file, caption]) => (
              <figure key={file}>
                <img src={`/img/${lang}/${file}.png`} alt={caption} loading="lazy" width={1600} height={900} />
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="wrap" id="pricing">
          <h2>{t.pricingTitle}</h2>
          <p className="sub">{t.pricingSub}</p>
          <div className="price-grid">
            <div className="plan">
              <h3>{t.free}</h3>
              <div className="amount">
                {t.freeAmount} <small>{t.freeUnit}</small>
              </div>
              <ul>
                {t.freeF.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="plan best">
              <span className="tag">{t.best}</span>
              <h3>{t.basic}</h3>
              <div className="amount">
                6,99 <small>{t.basicUnit}</small>
              </div>
              <ul>
                {t.basicF.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="plan">
              <h3>{t.pro}</h3>
              <div className="amount">
                12,99 <small>{t.proUnit}</small>
              </div>
              <ul>
                {t.proF.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="note">{t.trial}</p>
        </section>

        <section className="wrap">
          <h2>{t.faqTitle}</h2>
          <div className="faq">
            {faq.map(([q, a]) => (
              <div className="qa" key={q}>
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </section>

        {showForm && (
          <section className="wrap" id="install">
            <div className="install">
              <h2>{t.installTitle}</h2>
              <p>{t.installSub}</p>
              <Form method="post">
                <label htmlFor="shop" style={{ display: "block", marginBottom: 6, fontSize: 14, color: "#d6e0f5" }}>
                  {t.shopDomain}
                </label>
                <input id="shop" type="text" name="shop" placeholder="my-shop.myshopify.com" />
                {errors.shop && <p className="err">{errors.shop}</p>}
                <div>
                  <button className="btn" type="submit">
                    {t.next}
                  </button>
                </div>
              </Form>
            </div>
          </section>
        )}
      </main>

      <ConsentBanner t={t} />

      <footer className="wrap">
        <div>
          <a href="https://felix-helleckes.github.io/" rel="author">{operator.name}</a> ·{" "}
          {operator.address} · <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
        </div>
        <div className="foot-links">
          <a href="/privacy">{t.footPrivacy}</a>
          <a href="/terms">{t.footTerms}</a>
          <a href="/support">{t.footSupport}</a>
          <a href="/screencast">{t.footDemo}</a>
        </div>
      </footer>
    </>
  );
}

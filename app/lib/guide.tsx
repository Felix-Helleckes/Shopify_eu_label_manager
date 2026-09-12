/**
 * Fachbeitrag zu den EU-Pflichten 2026, zweisprachig.
 *
 * Zweck ist Auffindbarkeit: die Landingpage verkauft, dieser Text beantwortet die Fragen,
 * nach denen Händler tatsächlich suchen („Gewährleistungshinweis Pflicht", „GARAN-Label
 * Shopify", „Widerrufsbutton § 356a BGB"). Deutsch liegt unter /leitfaden, Englisch unter
 * /guide; beide verweisen per hreflang aufeinander (siehe app/lib/site.ts).
 *
 * Inhalt aus docs/marketing/artikel-de.md bzw. article-en.md – Änderungen bitte dort und
 * hier gleichzeitig pflegen.
 */
import { LANDING_CSS } from "../routes/_index/styles";
import { operator } from "./operator";
import { SITE_URL, type GuideLang } from "./site";

export const GUIDE_PATH = { de: "/leitfaden", en: "/guide" } as const;

/** Erscheinungsdatum; steht im Beitrag und im strukturierten Datensatz. */
export const GUIDE_PUBLISHED = "2026-09-12";

type Faq = { q: string; a: string };

type GuideText = {
  htmlLang: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  imageAlt: string;
  kicker: string;
  byline: string;
  lead: string;
  switchLabel: string;
  switchHref: string;
  navHome: string;
  navDemo: string;
  sections: { heading: string; blocks: (string | string[])[] }[];
  ctaHeading: string;
  ctaText: string;
  ctaButton: string;
  ctaNote: string;
  checklistHeading: string;
  checklist: string[];
  faqHeading: string;
  faq: Faq[];
  footPrivacy: string;
  footTerms: string;
  footSupport: string;
  footDemo: string;
  disclaimer: string;
};

export const GUIDE: Record<GuideLang, GuideText> = {
  de: {
    htmlLang: "de",
    title: "Gewährleistungshinweis und GARAN-Label ab 27. September 2026: was Shopify-Händler jetzt tun müssen",
    metaTitle: "Gewährleistungshinweis & GARAN-Label ab 27.09.2026 – Leitfaden für Shopify-Händler",
    metaDescription:
      "Ab 27. September 2026 sind der amtliche Gewährleistungshinweis und das GARAN-Label Pflicht, der Widerrufsbutton gilt seit dem 19. Juni. Was das für Shopify-Shops bedeutet, mit Checkliste.",
    imageAlt: "Amtlicher Gewährleistungshinweis und GARAN-Label in einem Shopify-Shop",
    kicker: "Leitfaden · EU-Verbraucherrecht 2026",
    byline: "Von Felix Helleckes · 12. September 2026",
    lead: "Seit dem 19. Juni 2026 muss jeder Onlineshop in der EU einen Widerrufsbutton anbieten. Am 27. September folgt die zweite Welle: ein amtlich gestalteter Hinweis auf die gesetzliche Gewährleistung und das GARAN-Label für Herstellergarantien über zwei Jahre. Die Durchführungsverordnung (EU) 2025/1960 legt Farben, Schrift, QR-Code und Text bis ins Detail fest – verändert werden darf nichts davon.",
    sections: [
      {
        heading: "Was genau ab 27. September gilt",
        blocks: [
          "**1. Die harmonisierte Mitteilung zur gesetzlichen Gewährleistung.** Ein Plakat in EU-Blau, mindestens A4 im Laden, online farbig und „in hervorgehobener Weise“. Es erinnert daran, dass Waren in der EU mindestens zwei Jahre Gewährleistung haben, dass der Verkäufer haftet und dass Reparatur, Ersatz, Preisminderung oder Erstattung möglich sind. Grundlage ist Art. 6 Abs. 1 lit. l der Verbraucherrechte-Richtlinie in der Fassung der Richtlinie (EU) 2024/825.",
          "**2. Die GARAN-Kennzeichnung.** Bietet der Hersteller kostenlos eine Haltbarkeitsgarantie von mehr als zwei Jahren für die gesamte Ware, muss der Händler das mit dem Label anzeigen: Titel „GARAN“, Häkchen, Kalendersymbol, die Dauer in Jahren, Hersteller und Modell, ein QR-Code zum Portal „Ihr Europa“ und die Übersetzung von „Herstellergarantie in Jahren“ in alle 24 Amtssprachen. Online darf das Label „geschachtelt“ erscheinen: erst eine schmale Leiste, beim ersten Klick oder Hover das vollständige Label.",
          "**3. Seit 31. Juli 2026: Recht auf Reparatur.** Für neue Kaufverträge kann der Kunde zwischen Reparatur und Ersatz wählen; nach einer Reparatur verlängert sich die Gewährleistung einmalig um zwölf Monate (Richtlinie (EU) 2024/1799).",
        ],
      },
      {
        heading: "Und der Widerrufsbutton?",
        blocks: [
          "Der gilt schon. § 356a BGB verlangt eine Funktion, die mit „Vertrag widerrufen“ beschriftet ist, auf jeder Seite erreichbar bleibt, einen zweiten Schritt „Widerruf bestätigen“ hat und sofort eine Eingangsbestätigung mit Datum und Uhrzeit versendet. Wer das noch nicht hat, ist seit fast drei Monaten angreifbar – die Wettbewerbszentrale hat angekündigt, genau hinzuschauen.",
        ],
      },
      {
        heading: "Was das für Shopify-Shops bedeutet",
        blocks: [
          "Shopify liefert nichts davon von Haus aus. Es gibt drei Wege:",
          [
            "**Selbst bauen.** Theme anpassen, amtliche Grafiken in 24 Sprachen beschaffen, Beweisprotokoll für Widerrufe führen, E-Mail-Bestätigungen verschicken. Realistisch mehrere Tage Agenturarbeit – und bei jeder Theme-Änderung wieder.",
            "**Mehrere Apps.** Eine für den Widerruf, eine für die Garantie-Labels. Doppelte Kosten, zwei Auftragsverarbeitungsverträge, zwei Support-Adressen.",
            "**Eine App für alles.** Genau dafür ist die EU Compliance Suite gebaut.",
          ],
        ],
      },
    ],
    ctaHeading: "EU Compliance Suite",
    ctaText:
      "Widerrufsbutton mit den amtlichen Beschriftungen aus dem Amtsblatt in allen 24 Sprachen, Eingangsbestätigung mit Zeitstempel, Widerrufsprotokoll mit Prüfsumme, dazu Gewährleistungshinweis und GARAN-Label als Theme-Blöcke mit den unveränderten amtlichen Grafiken. Installation in fünf Minuten, kein Theme-Code, Daten in Frankfurt.",
    ctaButton: "App ansehen",
    ctaNote: "Die Label-Blöcke sind dauerhaft kostenlos. Die Widerrufsfunktion gibt es ab 6,99 USD im Monat, 14 Tage zum Testen.",
    checklistHeading: "Checkliste bis zum 27. September",
    checklist: [
      "Widerrufsbutton auf jeder Seite, Beschriftung „Vertrag widerrufen“.",
      "Widerrufsbelehrung um den Hinweis auf den Button ergänzen.",
      "Gewährleistungshinweis auf Produktseiten oder im Warenkorb einbauen, farbig und unverändert.",
      "Für Produkte mit Herstellergarantie über zwei Jahre: Dauer, Hersteller und Modell erfassen, GARAN-Label anzeigen.",
      "Datenschutzerklärung um die Verarbeitung von Widerrufsdaten ergänzen.",
    ],
    faqHeading: "Häufige Fragen",
    faq: [
      {
        q: "Gilt der Gewährleistungshinweis für jeden Shop?",
        a: "Er gilt für Händler, die Waren an Verbraucher in der EU verkaufen. Der Hinweis muss vor dem Kauf sichtbar sein, farbig und unverändert – also auf der Produktseite oder im Warenkorb, nicht versteckt in den AGB.",
      },
      {
        q: "Braucht jedes Produkt ein GARAN-Label?",
        a: "Nein. Das Label ist nur Pflicht, wenn der Hersteller kostenlos eine Haltbarkeitsgarantie von mehr als zwei Jahren für die gesamte Ware gewährt. Bei zwei Jahren oder weniger darf es nicht gezeigt werden.",
      },
      {
        q: "Reicht ein Link „Widerruf“ im Footer?",
        a: "Nein. § 356a BGB verlangt eine Funktion mit der Beschriftung „Vertrag widerrufen“, die auf jeder Seite erreichbar ist, einen zweiten Schritt mit der Beschriftung „Widerruf bestätigen“ und eine sofortige Eingangsbestätigung auf einem dauerhaften Datenträger.",
      },
      {
        q: "Was passiert, wenn der Hinweis am 27. September fehlt?",
        a: "Fehlende Pflichtinformationen sind ein Wettbewerbsverstoß und damit abmahnfähig. Zusätzlich können die Marktüberwachungsbehörden der Mitgliedstaaten tätig werden.",
      },
    ],
    switchLabel: "English",
    switchHref: "/guide",
    navHome: "Zur App",
    navDemo: "Demo",
    footPrivacy: "Datenschutz",
    footTerms: "AGB",
    footSupport: "Support",
    footDemo: "Demo",
    disclaimer:
      "Dieser Beitrag ist keine Rechtsberatung. Er fasst den Stand vom 12. September 2026 zusammen; im Zweifel fragen Sie bitte eine Rechtsanwältin oder einen Rechtsanwalt.",
  },
  en: {
    htmlLang: "en",
    title: "Legal-guarantee notice and GARAN label from 27 September 2026: what Shopify merchants must do now",
    metaTitle: "Legal-guarantee notice & GARAN label from 27 Sept 2026 – a guide for Shopify merchants",
    metaDescription:
      "From 27 September 2026 the harmonised legal-guarantee notice and the GARAN label are mandatory, and the withdrawal button has applied since 19 June. What that means for Shopify stores, with a checklist.",
    imageAlt: "Official legal-guarantee notice and GARAN label in a Shopify storefront",
    kicker: "Guide · EU consumer law 2026",
    byline: "By Felix Helleckes · 12 September 2026",
    lead: "Since 19 June 2026 every online shop selling to EU consumers must offer a withdrawal button. On 27 September the second wave arrives: an officially designed notice about the legal guarantee, and the GARAN label for producer durability guarantees of more than two years. Implementing Regulation (EU) 2025/1960 fixes colours, font, QR code and wording down to the detail – none of it may be edited.",
    sections: [
      {
        heading: "What applies from 27 September",
        blocks: [
          "**1. The harmonised notice on the legal guarantee.** A poster in EU blue, at least A4 in physical shops, in colour and “in a prominent manner” online. It reminds consumers that goods sold in the EU carry a minimum two-year legal guarantee, that the seller is liable, and that repair, replacement, price reduction or refund are available. Legal basis: Art. 6(1)(l) of the Consumer Rights Directive as amended by Directive (EU) 2024/825.",
          "**2. The GARAN label.** If the producer offers, free of charge, a durability guarantee of more than two years covering the entire good, the merchant must display the harmonised label: the title “GARAN”, a tick, a calendar symbol, the duration in years, brand and model identifier, a QR code to the Your Europe portal, and “producer guarantee in years” in all 24 official languages. Online the label may be nested: a slim strip first, the full label on the first click or roll-over.",
          "**3. Since 31 July 2026: the right to repair.** For new sales contracts consumers may choose between repair and replacement; after a repair the legal guarantee is extended once by twelve months (Directive (EU) 2024/1799).",
        ],
      },
      {
        heading: "What about the withdrawal button?",
        blocks: [
          "Already law. Art. 11a of the Consumer Rights Directive requires a function labelled “withdraw from contract here”, continuously available, with a second step labelled only “confirm withdrawal”, followed immediately by an acknowledgement of receipt with date and time. Shops without it have been exposed for almost three months.",
        ],
      },
      {
        heading: "What this means for Shopify stores",
        blocks: [
          "Shopify ships none of this. There are three options:",
          [
            "**Build it yourself.** Theme work, official artwork in 24 languages, an evidence log for withdrawals, transactional e-mails. Realistically several days of agency time – repeated at every theme change.",
            "**Combine several apps.** One for withdrawals, one for the guarantee labels. Double the cost, two data-processing agreements, two support addresses.",
            "**One app for all of it.** That is what EU Compliance Suite was built for.",
          ],
        ],
      },
    ],
    ctaHeading: "EU Compliance Suite",
    ctaText:
      "The withdrawal button with the official wording from the Official Journal in all 24 languages, time-stamped acknowledgements, a withdrawal log with checksums, plus the legal-guarantee notice and the GARAN label as theme blocks using the unchanged official artwork. Five-minute setup, no theme code, data stored in Frankfurt.",
    ctaButton: "See the app",
    ctaNote: "The label blocks are free forever. The withdrawal function starts at 6.99 USD per month, with a 14-day trial.",
    checklistHeading: "Checklist before 27 September",
    checklist: [
      "Withdrawal button on every page, with the official label.",
      "Add a sentence about the button to your withdrawal policy.",
      "Show the legal-guarantee notice on product pages or in the cart, in colour and unchanged.",
      "For products with producer guarantees over two years: record duration, brand and model, display the GARAN label.",
      "Update your privacy policy for withdrawal data processing.",
    ],
    faqHeading: "Frequently asked questions",
    faq: [
      {
        q: "Does the legal-guarantee notice apply to every shop?",
        a: "It applies to traders selling goods to consumers in the EU. The notice must be visible before purchase, in colour and unchanged – on the product page or in the cart, not buried in the terms and conditions.",
      },
      {
        q: "Does every product need a GARAN label?",
        a: "No. The label is mandatory only where the producer offers, free of charge, a durability guarantee of more than two years covering the entire good. For two years or less it must not be shown.",
      },
      {
        q: "Is a “withdrawal” link in the footer enough?",
        a: "No. Art. 11a of the Consumer Rights Directive requires a function labelled “withdraw from contract here”, available on every page, a second step labelled “confirm withdrawal”, and an immediate acknowledgement of receipt on a durable medium.",
      },
      {
        q: "What happens if the notice is missing on 27 September?",
        a: "Missing mandatory information is an unfair commercial practice and can be challenged by competitors or consumer associations; national market-surveillance authorities can act as well.",
      },
    ],
    switchLabel: "Deutsch",
    switchHref: "/leitfaden",
    navHome: "See the app",
    navDemo: "Demo",
    footPrivacy: "Privacy",
    footTerms: "Terms",
    footSupport: "Support",
    footDemo: "Demo",
    disclaimer:
      "This article is not legal advice. It summarises the situation as of 12 September 2026; when in doubt, please ask a lawyer.",
  },
};

/** **fett** innerhalb eines Absatzes – mehr Auszeichnung braucht der Text nicht. */
function withBold(text: string, key: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 === 1 ? <strong key={`${key}-${i}`}>{part}</strong> : part));
}

export function guideJsonLd(lang: GuideLang) {
  const t = GUIDE[lang];
  const url = `${SITE_URL}${GUIDE_PATH[lang]}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: t.title,
      description: t.metaDescription,
      inLanguage: t.htmlLang,
      datePublished: GUIDE_PUBLISHED,
      dateModified: GUIDE_PUBLISHED,
      mainEntityOfPage: url,
      image: `${SITE_URL}/img/${lang}/screenshot-cover.png`,
      author: {
        "@type": "Person",
        "@id": "https://felix-helleckes.github.io/#person",
        name: operator.name,
        url: "https://felix-helleckes.github.io/",
      },
      publisher: { "@type": "Person", name: operator.name },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: t.htmlLang,
      mainEntity: t.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}

export function GuidePage({ lang, appStoreUrl, supportEmail }: { lang: GuideLang; appStoreUrl: string; supportEmail: string }) {
  const t = GUIDE[lang];
  const appHref = appStoreUrl || `/?lang=${lang}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />

      <header className="wrap">
        <nav className="nav">
          <a className="brand" href={`/?lang=${lang}`}>
            <span className="mark" aria-hidden="true">
              ✓
            </span>
            EU Compliance Suite
          </a>
          <div className="nav-right">
            <a href={`/?lang=${lang}`}>{t.navHome}</a>
            <a href="/screencast">{t.navDemo}</a>
            <a href={t.switchHref}>{t.switchLabel}</a>
          </div>
        </nav>
      </header>

      <main className="wrap article">
        <span className="kicker">
          <span className="dot" aria-hidden="true" />
          {t.kicker}
        </span>
        <h1>{t.title}</h1>
        <p className="byline">{t.byline}</p>
        <p className="lead">{t.lead}</p>

        {t.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.blocks.map((block, i) =>
              Array.isArray(block) ? (
                <ul key={`${section.heading}-${i}`} className="prose-list">
                  {block.map((item, j) => (
                    <li key={j}>{withBold(item, `${section.heading}-${i}-${j}`)}</li>
                  ))}
                </ul>
              ) : (
                <p key={`${section.heading}-${i}`}>{withBold(block, `${section.heading}-${i}`)}</p>
              ),
            )}
          </section>
        ))}

        <aside className="callout">
          <h2>{t.ctaHeading}</h2>
          <p>{t.ctaText}</p>
          <a className="btn btn-primary" href={appHref}>
            {t.ctaButton}
          </a>
          <p className="note">{t.ctaNote}</p>
        </aside>

        <section>
          <h2>{t.checklistHeading}</h2>
          <ol className="prose-list">
            {t.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2>{t.faqHeading}</h2>
          {t.faq.map((f) => (
            <div className="qa" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>

        <p className="disclaimer">{t.disclaimer}</p>
      </main>

      <footer className="wrap">
        <div>
          <a href="https://felix-helleckes.github.io/" rel="author">
            {operator.name}
          </a>{" "}
          · {operator.address} · <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
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

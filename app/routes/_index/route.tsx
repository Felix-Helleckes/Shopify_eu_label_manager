import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, redirect, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { operator } from "../../lib/operator";
import { loginErrorMessage } from "./error.server";
import { LANDING_CSS } from "./styles";
import { pickLang, socialMeta, landingPath, SITE_LANGS, SITE_URL, type SiteLang } from "../../lib/site";
import { LANDING_T, LANGUAGE_NAMES, shotLang } from "./i18n";

type Lang = SiteLang;

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
  const lang = data?.lang ?? "en";
  const t = LANDING_T[lang];
  return [
    { title: t.metaTitle },
    { name: "description", content: t.metaDescription },
    { name: "author", content: "Felix Helleckes" },
    ...socialMeta({
      lang,
      path: landingPath(lang),
      alternates: SITE_LANGS.map((code) => [code, landingPath(code)] as const),
      pathDefault: "/",
      title: t.metaTitle,
      description: t.metaDescription,
      imageAlt: t.heroAlt,
    }),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "EU Compliance Suite",
        url: `${SITE_URL}/`,
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
            "https://apps.apple.com/de/developer/felix-helleckes/id6786716900",
            "https://play.google.com/store/apps/developer?id=Felix+Helleckes",
            "https://www.xing.com/profile/Felix_Helleckes",
          ],
        },
      },
    },
  ];
}


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
  const t = LANDING_T[lang];
  const img = shotLang(lang);
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
            <a href={t.guideHref}>{t.navGuide}</a>
            <a href="/screencast">{t.navDemo}</a>
            <form method="get" className="lang-form">
              <label className="lang-label" htmlFor="lang">
                <span aria-hidden="true">🌐</span>
                <span className="sr-only">Sprache / Language</span>
              </label>
              <select id="lang" name="lang" defaultValue={lang} onChange={(e) => e.currentTarget.form?.submit()}>
                {SITE_LANGS.map((code) => (
                  <option key={code} value={code}>
                    {LANGUAGE_NAMES[code]}
                  </option>
                ))}
              </select>
              <noscript>
                <button type="submit">OK</button>
              </noscript>
            </form>
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
            <img src={`/img/${img}/screenshot-form.png`} alt={t.heroAlt} width={1600} height={900} />
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
                <img src={`/img/${img}/${file}.png`} alt={caption} loading="lazy" width={1600} height={900} />
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

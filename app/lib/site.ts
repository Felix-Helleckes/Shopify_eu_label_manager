/**
 * Gemeinsame Angaben für die öffentlichen Seiten (Landingpage, Leitfaden).
 *
 * Die Landingpage liegt unter einer Adresse und liefert je nach `?lang=` oder Accept-Language
 * eine von zehn Sprachen. Damit Google alle Fassungen findet und nicht als Dubletten wertet,
 * zeigt jede mit `canonical` auf sich selbst und verweist per `hreflang` auf die anderen;
 * `x-default` ist überall dieselbe Adresse, sonst widersprechen sich die Angaben.
 *
 * Beim Umzug auf eine eigene Domain wird hier eine Zeile geändert (SITE_URL) – Sitemap,
 * robots.txt, kanonische Adressen und hreflang hängen alle daran. Siehe docs/DOMAIN.md.
 */
export const SITE_URL = "https://eu-compliance-suite.fly.dev";

/** Sprachen der Landingpage; dieselben zehn, die der Admin der App spricht. */
export const SITE_LANGS = ["en", "de", "fr", "es", "it", "nl", "pl", "pt", "sv", "da"] as const;

export type SiteLang = (typeof SITE_LANGS)[number];

/** Der Leitfaden ist nur zweisprachig – Fachtexte in zehn Sprachen pflegt niemand. */
export const GUIDE_LANGS = ["de", "en"] as const;

export type GuideLang = (typeof GUIDE_LANGS)[number];

function isSiteLang(value: string): value is SiteLang {
  return (SITE_LANGS as readonly string[]).includes(value);
}

/**
 * `?lang=` schlägt alles, sonst entscheidet Accept-Language: die vom Browser gewünschten
 * Sprachen in ihrer Reihenfolge, die erste, die wir haben, gewinnt. Ohne Treffer Englisch.
 */
export function pickLang(request: Request): SiteLang {
  const url = new URL(request.url);
  const q = url.searchParams.get("lang");
  if (q && isSiteLang(q)) return q;

  const accept = request.headers.get("accept-language") || "";
  for (const part of accept.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    const primary = tag.split("-")[0];
    if (isSiteLang(primary)) return primary;
  }
  return "en";
}

/**
 * Sprache für <html lang>. Alles unter /app und /auth ist die Admin-Oberfläche, deren Sprache
 * Shopify selbst bestimmt.
 */
export function htmlLang(request: Request): SiteLang {
  const { pathname } = new URL(request.url);
  if (pathname === "/leitfaden") return "de";
  if (pathname === "/guide") return "en";
  if (pathname === "/") return pickLang(request);
  return "en";
}

/** Adresse der Landingpage in einer bestimmten Sprache. */
export function landingPath(lang: SiteLang) {
  return `/?lang=${lang}`;
}

type SocialMetaInput = {
  lang: SiteLang;
  /** Pfad dieser Sprachfassung, z. B. "/leitfaden" oder "/?lang=fr". */
  path: string;
  /** Alle Sprachfassungen als [Sprache, Pfad] – Grundlage der hreflang-Angaben. */
  alternates: readonly (readonly [string, string])[];
  /**
   * Adresse für x-default. Muss auf allen Sprachfassungen dieselbe sein. Die Landingpage gibt
   * "/" an, weil dort die Sprache ausgehandelt wird; der Leitfaden die englische Fassung.
   */
  pathDefault: string;
  title: string;
  description: string;
  /** Pfad eines Vorschaubilds ab Wurzel; ohne Angabe das Titelbild der Sprache. */
  image?: string;
  imageAlt: string;
  /** "website" für die Landingpage, "article" für den Leitfaden. */
  type?: "website" | "article";
};

/** Sprachkennungen, die Facebook und LinkedIn erwarten (og:locale). */
const OG_LOCALE: Record<string, string> = {
  en: "en_GB",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
  it: "it_IT",
  nl: "nl_NL",
  pl: "pl_PL",
  pt: "pt_PT",
  sv: "sv_SE",
  da: "da_DK",
};

/**
 * Kanonische Adresse, hreflang-Angaben und die Vorschau für geteilte Links.
 * Ohne og:image zeigen LinkedIn, Slack und WhatsApp nur nackten Text.
 */
export function socialMeta({ lang, path, alternates, pathDefault, title, description, image, imageAlt, type = "website" }: SocialMetaInput) {
  const self = `${SITE_URL}${path}`;
  const imageUrl = `${SITE_URL}${image || `/img/${lang}/screenshot-cover.png`}`;

  return [
    { tagName: "link", rel: "canonical", href: self },
    ...alternates.map(([code, href]) => ({
      tagName: "link",
      rel: "alternate",
      hreflang: code,
      href: `${SITE_URL}${href}`,
    })),
    { tagName: "link", rel: "alternate", hreflang: "x-default", href: `${SITE_URL}${pathDefault}` },

    { property: "og:type", content: type },
    { property: "og:site_name", content: "EU Compliance Suite" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: self },
    { property: "og:locale", content: OG_LOCALE[lang] || "en_GB" },
    ...alternates
      .filter(([code]) => code !== lang && OG_LOCALE[code])
      .map(([code]) => ({ property: "og:locale:alternate", content: OG_LOCALE[code] })),
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1600" },
    { property: "og:image:height", content: "900" },
    { property: "og:image:alt", content: imageAlt },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: imageAlt },
  ];
}

/**
 * Adressen, unter denen die Seite frueher lag. Sobald SITE_URL auf die eigene Domain zeigt,
 * leiten die oeffentlichen Seiten von hier dauerhaft dorthin weiter – die Suchmaschine gibt
 * die Bewertung der alten Adresse damit an die neue weiter.
 *
 * Nicht weitergeleitet wird alles, was Shopify braucht: /app, /auth, /webhooks und der
 * App-Proxy bleiben unter der fly.dev-Adresse erreichbar, weil sie in der Partner-Konfiguration
 * steht und waehrend der Pruefung nicht angefasst werden darf.
 */
const LEGACY_HOSTS = ["eu-compliance-suite.fly.dev"];

const PUBLIC_PATHS = new Set(["/", "/leitfaden", "/guide", "/screencast", "/privacy", "/terms", "/support"]);

export function canonicalRedirect(request: Request): string | null {
  const url = new URL(request.url);
  if (!LEGACY_HOSTS.includes(url.host)) return null;

  const canonical = new URL(SITE_URL);
  if (url.host === canonical.host) return null;
  if (!PUBLIC_PATHS.has(url.pathname)) return null;
  // Ein eingebetteter Aufruf aus dem Shopify-Admin kommt mit shop/embedded und darf nicht wandern.
  if (url.searchParams.has("shop") || url.searchParams.has("embedded")) return null;

  canonical.pathname = url.pathname;
  canonical.search = url.search;
  return canonical.toString();
}

/**
 * Gemeinsame Angaben für die öffentlichen Seiten (Landingpage, Leitfaden).
 *
 * Die Seiten liegen unter einer URL und liefern je nach `?lang=` oder Accept-Language
 * Deutsch oder Englisch. Damit Google beide Fassungen findet und nicht als Dubletten
 * wertet, zeigt jede Sprachfassung mit `canonical` auf sich selbst und verweist per
 * `hreflang` auf die andere; `x-default` bekommt die Adresse ohne Parameter, weil dort
 * die Sprache automatisch gewählt wird.
 */
export const SITE_URL = "https://eu-compliance-suite.fly.dev";

export type SiteLang = "en" | "de";

export function pickLang(request: Request): SiteLang {
  const url = new URL(request.url);
  const q = url.searchParams.get("lang");
  if (q === "de" || q === "en") return q;
  const accept = (request.headers.get("accept-language") || "").toLowerCase();
  return accept.startsWith("de") ? "de" : "en";
}

type SocialMetaInput = {
  lang: SiteLang;
  /** Pfad der deutschen Fassung, z. B. "/leitfaden" */
  pathDe: string;
  /** Pfad der englischen Fassung, z. B. "/guide" */
  pathEn: string;
  /**
   * Adresse fuer x-default. Muss auf allen Sprachfassungen dieselbe sein, sonst
   * widersprechen sich die Angaben. Standard ist die englische Fassung; die
   * Landingpage gibt "/" an, weil dort die Sprache ausgehandelt wird.
   */
  pathDefault?: string;
  title: string;
  description: string;
  /** Pfad eines Vorschaubilds ab Wurzel; ohne Angabe das Titelbild der Sprache. */
  image?: string;
  imageAlt: string;
  /** "website" für die Landingpage, "article" für den Leitfaden. */
  type?: "website" | "article";
};

/**
 * Kanonische Adresse, hreflang-Paar und die Vorschau für geteilte Links.
 * Ohne og:image zeigen LinkedIn, Slack und WhatsApp nur nackten Text.
 */
export function socialMeta({ lang, pathDe, pathEn, pathDefault, title, description, image, imageAlt, type = "website" }: SocialMetaInput) {
  const de = lang === "de";
  const self = `${SITE_URL}${de ? pathDe : pathEn}`;
  const imageUrl = `${SITE_URL}${image || `/img/${lang}/screenshot-cover.png`}`;
  const defaultPath = pathDefault || pathEn;

  return [
    { tagName: "link", rel: "canonical", href: self },
    { tagName: "link", rel: "alternate", hreflang: "de", href: `${SITE_URL}${pathDe}` },
    { tagName: "link", rel: "alternate", hreflang: "en", href: `${SITE_URL}${pathEn}` },
    { tagName: "link", rel: "alternate", hreflang: "x-default", href: `${SITE_URL}${defaultPath}` },

    { property: "og:type", content: type },
    { property: "og:site_name", content: "EU Compliance Suite" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: self },
    { property: "og:locale", content: de ? "de_DE" : "en_GB" },
    { property: "og:locale:alternate", content: de ? "en_GB" : "de_DE" },
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
 * Sprache fuer <html lang>. Die oeffentlichen Seiten liefern deutsche oder englische
 * Texte; alles unter /app und /auth ist die englischsprachige Admin-Oberflaeche, deren
 * Sprache Shopify selbst bestimmt.
 */
export function htmlLang(request: Request): SiteLang {
  const { pathname } = new URL(request.url);
  if (pathname === "/leitfaden") return "de";
  if (pathname === "/guide") return "en";
  if (pathname === "/") return pickLang(request);
  return "en";
}

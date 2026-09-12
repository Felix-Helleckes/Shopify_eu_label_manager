/**
 * Sitemap aus einer Quelle: Sprachen und Adresse stehen in app/lib/site.ts, damit ein
 * Domainwechsel nicht vergessen werden kann. Die xhtml:link-Angaben entsprechen den
 * hreflang-Angaben im Kopf der Seiten.
 */
import { GUIDE_PATH } from "../lib/guide";
import { SITE_LANGS, SITE_URL, landingPath } from "../lib/site";

const LASTMOD = "2026-09-12";

function url(loc: string, alternates: [string, string][], lastmod: string, changefreq: string, priority: string) {
  const links = alternates
    .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}${href}"/>`)
    .join("\n");
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
${links}
    <lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority>
  </url>`;
}

export async function loader() {
  const landingAlternates: [string, string][] = [
    ...SITE_LANGS.map((lang) => [lang, landingPath(lang)] as [string, string]),
    ["x-default", "/"],
  ];
  const guideAlternates: [string, string][] = [
    ["de", GUIDE_PATH.de],
    ["en", GUIDE_PATH.en],
    ["x-default", GUIDE_PATH.en],
  ];

  const entries = [
    ...SITE_LANGS.map((lang) => url(landingPath(lang), landingAlternates, LASTMOD, "weekly", "1.0")),
    url(GUIDE_PATH.de, guideAlternates, LASTMOD, "monthly", "0.9"),
    url(GUIDE_PATH.en, guideAlternates, LASTMOD, "monthly", "0.9"),
    ...(
      [
        ["/screencast", "monthly", "0.7"],
        ["/support", "monthly", "0.5"],
        ["/privacy", "yearly", "0.3"],
        ["/terms", "yearly", "0.3"],
      ] as const
    ).map(
      ([loc, freq, prio]) =>
        `  <url><loc>${SITE_URL}${loc}</loc><lastmod>${LASTMOD}</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority></url>`,
    ),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}

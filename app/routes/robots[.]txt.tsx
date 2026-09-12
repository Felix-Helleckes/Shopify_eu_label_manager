/** robots.txt mit der Sitemap-Adresse aus app/lib/site.ts – ein Domainwechsel reicht dort. */
import { SITE_URL } from "../lib/site";

export async function loader() {
  const body = `User-agent: *
Allow: /
Disallow: /app
Disallow: /auth
Disallow: /webhooks
Disallow: /proxy

Sitemap: ${SITE_URL}/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}

# Eigene Domain: Empfehlung und Umzug (Stand 12.09.2026)

## Warum jetzt und nicht nach dem 27.09.

Eine Google-Suche nach „EU Compliance Suite Shopify Widerrufsbutton GARAN-Label" am 12.09.2026 liefert
fünf konkurrierende Label-Apps im Shopify App Store – aber **keinen einzigen Treffer für
eu-compliance-suite.fly.dev**. Die Seite ist also noch nicht in der Suche angekommen.

Das ist die gute Nachricht für den Umzug: Es gibt keine Platzierung zu verlieren. Und jeder Link, der in
den nächsten zwei Wochen aus Agentur-Ansprache, LinkedIn-Posts und Gastbeiträgen entsteht, sollte schon
auf die endgültige Adresse zeigen – ein Umzug danach würde genau diese Links entwerten.

`*.fly.dev` ist eine Subdomain einer geteilten Plattform-Domain. Für die Suche zählt eine eigene Domain
mehr, für Händler wirkt sie seriöser, und eine Absender-Adresse für die Eingangsbestätigungen
(`noreply@…`) lässt sich erst damit sauber aufsetzen (bisher schreibt Brevo auf brevosend.com um).

## Welche Domain

Am 12.09.2026 per whois geprüft, beide **frei**:

| Domain | Registry-Status | Preis/Jahr | Rolle |
| --- | --- | --- | --- |
| `eu-compliance-suite.eu` | frei | ca. 6 € | **Hauptdomain** |
| `eu-compliance-suite.de` | DENIC: `Status: free` | ca. 5 € | Weiterleitung, schützt die deutsche Markensuche |
| `eu-compliance-suite.com` | Verisign: `No match` | ca. 12 € | optional, gleiche Rolle wie .de |

**Empfehlung: `.eu` als Hauptdomain.** Das Produkt ist EU-Recht in 24 Sprachen; eine `.de` würde
französischen, spanischen und italienischen Händlern signalisieren, dass sie hier falsch sind – und
genau diese Märkte sind seit heute in zehn Sprachen auf der Landingpage abgedeckt. `.de` trotzdem
mitnehmen und per Weiterleitung auf die `.eu` zeigen lassen; sie kostet 5 € und verhindert, dass sie
jemand anders nimmt.

**Registrar: INWX** (Berlin, inwx.de). Gründe: deutsche Rechnung mit ausgewiesener Umsatzsteuer,
kostenloses DNS mit vollständiger Kontrolle über A-, AAAA- und CNAME-Einträge, Zwei-Faktor-Anmeldung.
Gleichwertige Alternativen: netcup, Hetzner (beide ebenfalls deutsch). **Nicht** Cloudflare Registrar –
dort gibt es weder `.de` noch `.eu`. Die `.eu` setzt Wohnsitz in der EU voraus, das passt.

## Umzug in der richtigen Reihenfolge

**Wichtig: Die App bleibt vorerst unter fly.dev.** Die Einreichung läuft noch, und
`application_url`, die Weiterleitungs-URLs und der App-Proxy stehen in der Partner-Konfiguration auf
`eu-compliance-suite.fly.dev`. Wer daran während der Prüfung dreht, riskiert, dass der Prüfer in eine
tote Sitzung läuft. Es zieht also zuerst nur die Marketing-Seite um, die App-Adresse später.

1. **Domain kaufen** (INWX, 5 Minuten).
2. **Bei Fly anmelden:**
   ```
   fly certs add eu-compliance-suite.eu
   fly ips list
   ```
   Der erste Befehl nennt die nötigen DNS-Einträge, der zweite die IPv4- und IPv6-Adresse der App.
3. **DNS beim Registrar setzen:** `A` auf die IPv4, `AAAA` auf die IPv6, dazu den von Fly genannten
   `_acme-challenge`-CNAME. Danach `fly certs show eu-compliance-suite.eu`, bis das Zertifikat steht
   (meist wenige Minuten).
4. **Im Code eine Zeile ändern:** `SITE_URL` in `app/lib/site.ts` auf `https://eu-compliance-suite.eu`.
   Daran hängen kanonische Adressen, hreflang, Sitemap, robots.txt, Vorschaubilder – und die
   Weiterleitung: `canonicalRedirect()` schickt ab diesem Moment `/`, `/leitfaden`, `/guide`,
   `/screencast`, `/privacy`, `/terms` und `/support` von der fly.dev-Adresse dauerhaft (301) auf die
   neue Domain. `/app`, `/auth`, `/webhooks` und der Proxy bleiben unberührt, damit Shopify weiter
   funktioniert. Danach `fly deploy`.
5. **Google Search Console:** neue Property vom Typ **Domain** anlegen (Bestätigung per DNS-TXT, deckt
   alle Unterdomains ab), Sitemap `https://eu-compliance-suite.eu/sitemap.xml` einreichen. Die
   fly.dev-Property **behalten** – Google muss die Weiterleitungen dort sehen können. Die Funktion
   „Adressänderung" ist hier bewusst nicht das richtige Werkzeug, weil die App selbst auf fly.dev
   bleibt; die 301er genügen.
6. **Portfolio und Listing nachziehen:** Link auf felix-helleckes.github.io, Listing-Felder „App-URL"
   und „Support-URL" (nach der Freigabe), Signatur in den Agentur-Nachrichten.
7. **Später, nach der Freigabe:** App-URL selbst umziehen – `shopify.app.toml`, Partner-Dashboard,
   `shopify app deploy --allow-updates`, danach `SHOPIFY_APP_URL` als Fly-Secret setzen. Erst dann ist
   fly.dev vollständig abgelöst.

## Was danach möglich wird

- **Eigene Absender-Adresse** für die Eingangsbestätigungen (`noreply@eu-compliance-suite.eu`) mit SPF,
  DKIM und DMARC bei Brevo. Das erhöht die Zustellrate und wirkt gegenüber Verbrauchern seriöser als
  eine brevosend.com-Adresse.
- **Kurze Links** für Outreach und Posts, die man auch am Telefon vorlesen kann.

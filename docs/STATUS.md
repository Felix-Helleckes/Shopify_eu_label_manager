# Stand und offene Punkte (12.09.2026)

Übergabedokument. Wer hier neu einsteigt – Mensch oder KI – liest diese Datei zuerst und danach
`CLAUDE.md` im Wurzelverzeichnis. Technik steht in `README.md`, Marketing in `docs/marketing/`.

## Wo wir stehen

Die App ist fertig und läuft. Live unter https://eu-compliance-suite.fly.dev (Fly.io, Region `fra`,
Datenbank Supabase eu-central-1). Branch `rework-react-router`, alles gepusht.

**Sie ist noch nicht im App Store.** `apps.shopify.com/eu-label-1` liefert 404, die Einreichung vom
11.09.2026 ist in Prüfung. Rückmeldung 134896 (Anforderung 5.1.2) wurde am 11.09. beantwortet, Nachweis
unter `/proof/134896`, Status danach wieder „Wird überprüft".

Damit gilt: **null Installationen, null Sichtbarkeit.** Eine Google-Suche nach der Domain lieferte am
12.09. keinen Treffer; die Marketing-Seite ist erst seit dem 11.09. mit Inhalt online.

## Die drei offenen Punkte

### 1. Freigabe durch Shopify – der Blocker

Ohne Freigabe kann niemand installieren, und jeder andere Kanal läuft ins Leere. Nichts sonst hat
Priorität davor.

- Rückmeldungen kommen per E-Mail an **f.helleckes@proton.me** (Shopify schreibt teils auch an
  florian.helleckes@gmail.com). **Täglich prüfen, am selben Tag antworten** – sonst pausiert die Prüfung.
- Reagiert bis etwa **18.09.** niemand, eskalieren: Vorlage in `docs/escalation-embedded-checks.md`,
  Forum community.shopify.dev, Kategorie „Shopify App Store".
- Am Tag der Freigabe: App-Store-Link an die Stellen setzen, die ihn brauchen – `APP_STORE_URL` als
  Fly-Secret (die Landingpage schaltet damit automatisch von „Installieren" auf „Im App Store ansehen"),
  Portfolio, Signatur der LinkedIn-Nachrichten, Leitfaden.
- Danach sofort: **englisches Listing** anlegen (Texte in `docs/LISTING.md`), anschließend FR, NL, ES, IT
  (fertige Texte in `docs/LISTING-translations.md`, alle Felder innerhalb der Zeichengrenzen geprüft).

### 2. Domain kaufen – offen, braucht eine Zahlung

Vollständige Anleitung in **`docs/DOMAIN.md`**. Kurzfassung:

- Empfehlung: **`eu-compliance-suite.eu`** als Hauptdomain, `eu-compliance-suite.de` als Weiterleitung.
  Beide waren am 12.09.2026 per whois frei (DENIC `Status: free`, Verisign `No match`), zusammen ca. 11 €/Jahr.
- Registrar: INWX (Berlin), alternativ netcup oder Hetzner. Nicht Cloudflare Registrar – führt weder .de noch .eu.
- Danach: `fly certs add …`, DNS beim Registrar setzen, **eine Zeile** in `app/lib/site.ts` (`SITE_URL`)
  ändern, deployen. Kanonische Adressen, hreflang, Sitemap, robots.txt und die 301-Weiterleitung von
  fly.dev hängen alle an dieser Konstante (`canonicalRedirect()`).
- **Wichtig:** Die App-Adresse für Shopify (`application_url`, Redirects, App-Proxy) bleibt bis nach der
  Freigabe auf fly.dev. Wer daran während der Prüfung dreht, schickt den Prüfer in eine tote Sitzung.
- Search Console: neue Property vom Typ **Domain** (DNS-TXT), Sitemap einreichen, fly.dev-Property behalten.

### 3. LinkedIn-Anfragen an 17 Agenturen – offen, muss aus Felix' Account kommen

Fertige Texte in **`docs/marketing/outreach-linkedin.md`**: je Agentur eine Kontaktanfrage unter der
LinkedIn-Grenze von 300 Zeichen (nachgerechnet), der Link auf ihren Beitrag als Aufhänger, die
Unternehmenssuche, dazu eine gemeinsame Folgenachricht nach Annahme (DE und EN).

- **Nicht per E-Mail oder Kontaktformular.** Werbung ohne vorherige Einwilligung ist nach § 7 UWG
  unverlangte Werbung und abmahnfähig, auch zwischen Unternehmen. Für eine App, die Rechtskonformität
  verkauft, wäre eine Abmahnung wegen Kaltakquise der denkbar schlechteste Start.
- **Nicht automatisiert versenden.** LinkedIn sperrt Konten dafür, und das Profil hängt an Felix'
  Lebenslauf. Ohne Premium gehen Nachrichten ohnehin nur an bestehende Kontakte: erst vernetzen, dann
  schreiben.
- TG-AI war Nummer 3 auf der Liste und ist **gestrichen** – siehe Wettbewerber unten.
- Offen und hilfreich: die Impressen der 17 Agenturen durchgehen und den Namen der Geschäftsführung in
  die Anfragen eintragen. Öffentlich zugänglich, kein Konto nötig, spart beim Versenden Zeit.

## Wettbewerb (recherchiert am 12.09.2026)

Fünf Apps im App Store decken dieselbe Label-Pflicht ab, Tabelle mit Bewertungen, Preisen und Anbietern
in `docs/marketing/targets.md`, Abschnitt 2a. Das Wichtigste:

- **Keine davon hat den Widerrufsbutton.** Alle fünf decken nur Verordnung (EU) 2025/1960 ab.
- Der Beste hat 4,6 aus 9 Bewertungen – der Markt ist von niemandem gewonnen.
- Der Beste ist **TG-AI aus Hennef**, der vorher als Multiplikator auf der Ansprache-Liste stand. Vor
  jeder weiteren Ansprache prüfen, ob das Gegenüber selbst eine App im Store hat; ein Blogbeitrag über
  eine Pflicht ist 2026 oft Content-Marketing für ein eigenes Produkt.

## Was am 12.09.2026 gebaut wurde

- Screenshots der Landingpage neu, Verzerrung im Stylesheet behoben (`height:auto` fehlte, Bilder wurden
  auf 331×900 gequetscht). Generator: `scripts/screenshots/build.mjs`.
- `/leitfaden` und `/guide`: Fachbeitrag mit Checkliste, FAQ, Article- und FAQPage-Daten.
- Linkvorschau (og:image, Twitter-Card), hreflang, `<html lang>`, Sitemap und robots.txt als Routen.
- **Landingpage in zehn Sprachen** (en, de, fr, es, it, nl, pl, pt, sv, da) in `app/routes/_index/i18n/`.
  Screenshots dafür in sechs Sprachen; pl, pt, sv, da zeigen die englischen.
- Listing-Übersetzungen FR, NL, ES, IT.

## Reihenfolge – nicht als Kette lesen

**Nur die Freigabe ist ein Blocker.** Domain und LinkedIn hängen nicht daran und laufen parallel.
Wer wartet, bis das Listing live ist, verliert die Tage doppelt: Kontaktanfragen auf LinkedIn brauchen
selbst Tage, bis sie angenommen werden, und eine Domain braucht Stunden für DNS und Zertifikat.

**Sofort, unabhängig von der Freigabe (zusammen ca. 30 Minuten):**

1. Domain kaufen. Zuerst, weil jeder Link, der danach entsteht, schon auf die endgültige Adresse zeigen
   soll – ein Umzug später entwertet genau die Links, die die Ansprache erzeugt.
2. Die 17 Kontaktanfragen auf LinkedIn senden. Das ist noch kein Pitch, sondern nur das Vernetzen; der
   eigentliche Text geht nach der Annahme raus. Die Wartezeit auf die Freigabe deckt sich mit der
   Wartezeit auf die Annahmen.

**Währenddessen:**

3. DNS setzen, `SITE_URL` in `app/lib/site.ts` umstellen, deployen, Search Console einrichten.
4. Prüfer-Mails täglich prüfen, ab etwa 18.09. eskalieren.

**Am Tag der Freigabe:**

5. Folgenachricht an alle angenommenen Kontakte – dann mit App-Store-Link statt nur Demo.
6. Englisches Listing anlegen, danach FR, NL, ES, IT; erste Installationen um Bewertungen bitten
   (Vorlage in `docs/marketing/FELIX-TODO.md`).

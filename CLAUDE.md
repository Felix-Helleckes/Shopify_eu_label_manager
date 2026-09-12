# Orientierung für KI-Sitzungen

**Zuerst lesen: `docs/STATUS.md`** – Stand, offene Punkte, Prioritäten. Danach je nach Aufgabe
`README.md` (Technik), `docs/SETUP.md` (Betrieb), `docs/marketing/` (Vermarktung).

## Was dieses Projekt ist

Shopify-App „EU Compliance Suite": Widerrufsbutton (Art. 11a VRRL / § 356a BGB, gilt seit 19.06.2026),
amtlicher Gewährleistungshinweis und GARAN-Label (VO (EU) 2025/1960, ab 27.09.2026), Hinweis zum Recht
auf Reparatur. Alles als Theme-App-Blöcke in 24 EU-Sprachen. Ein-Personen-Projekt von Felix Helleckes
(Köln), der davon leben will. Tarife: Label kostenlos, Basic 6,99 USD, Pro 12,99 USD.

## Umgebung

- Branch `rework-react-router`, Remote `Felix-Helleckes/Shopify_eu_label_manager`. `gh` ist nicht installiert.
- `npm run typecheck` und `npm run build` laufen ohne Zugangsdaten. `npm run dev` braucht die Shopify-CLI.
- **Öffentliche Seiten lokal prüfen** ohne echte Secrets:
  ```
  npm run build
  SHOPIFY_API_KEY=dummy SHOPIFY_API_SECRET=dummy SCOPES=write_products \
    SHOPIFY_APP_URL=http://localhost:3111 PORT=3111 npx react-router-serve ./build/server/index.js
  ```
- **Deploy macht Felix selbst.** Befehl wäre `~/.fly/bin/fly deploy --now` (fly liegt nicht im PATH).
- Screenshots der Landingpage: `node scripts/screenshots/build.mjs [sprache]`, braucht Google Chrome
  (headless) und `sips`. Neue Sprache = Shop-Wörterbuch im Skript ergänzen.
- Die Bash-Umgebung lehnt Heredocs mit Steuerzeichen ab; zsh stolpert über ungequotetes `====` und
  `--include=*.ts`.

## Wie hier gearbeitet wird

- Commit-Nachrichten auf Deutsch, ohne Umlaute, im Stil „was war kaputt und warum" statt „fix xyz".
  Betreff eine Zeile, dann ein Absatz mit der Ursache.
- Eine Konstante, eine Quelle: Adresse der Seite und Sprachliste stehen in `app/lib/site.ts`. Sitemap,
  robots.txt, hreflang, kanonische Adressen und die Domain-Weiterleitung leiten sich daraus ab.
- Landingpage-Texte je Sprache in `app/routes/_index/i18n/`. Der Typ leitet sich aus `en.ts` ab, eine
  fehlende Zeile bricht den Typecheck.

## Grenzen, die nicht verhandelbar sind

- **Keine Werbung per E-Mail oder Kontaktformular** ohne vorherige Einwilligung (§ 7 UWG, auch B2B).
  Agentur-Ansprache läuft über LinkedIn, Texte in `docs/marketing/outreach-linkedin.md`.
- **Nichts aus Felix' Accounts versenden oder veröffentlichen.** Nachrichten, Posts und Bewertungen
  brauchen seine Hand; automatisiertes Versenden sperrt LinkedIn-Konten.
- **Während der App-Prüfung nicht an der App-Adresse drehen** (`application_url`, Redirects, App-Proxy).
  Ein Domainumzug betrifft nur die Marketing-Seiten, siehe `docs/DOMAIN.md`.
- Keine Passwörter, Keys oder Zahlungsdaten eintippen. Secrets setzt Felix per `fly secrets`.
- Amtliche Beschriftungen und Grafiken sind vorgeschrieben und dürfen nicht verändert werden. Die Texte
  stehen in `extensions/eu-compliance-blocks/locales/*.json` – dort nachsehen, nicht neu erfinden.
- Ein Block, der im Theme-Editor etwas zeigt und im Shop nichts, fällt bei Shopify unter Anforderung
  5.1.2 (siehe `docs/APP-REVIEW-134896.md`). `request.design_mode` nie für Ausgabe verwenden.

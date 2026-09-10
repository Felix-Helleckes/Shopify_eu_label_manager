# Go-live-Checkliste (für Felix)

Alles, was Code ist, liegt im Repo. Die folgenden Schritte brauchen deine Accounts (Shopify Partner, Fly.io,
E-Mail-Provider) und lassen sich nicht aus dem Repo heraus erledigen.

## 1. Lokal starten

```bash
cd ~/Documents/GitHub/Shopify_eu_label_manager
npm install
npx prisma migrate deploy
npm run dev
```

`npm run dev` ruft `shopify app dev` auf. Beim ersten Mal: im Browser beim Partner-Account anmelden, die
vorhandene App **„EU LABEL“** (client_id steht in `shopify.app.toml`) auswählen oder eine neue anlegen, den
Dev-Store wählen und die Frage „Update URLs?“ mit **Ja** beantworten. Die CLI schreibt dann `application_url`,
`redirect_urls` und `app_proxy.url` in die toml und installiert die App im Dev-Store.

Prüfen im Dev-Store:

1. App öffnet sich eingebettet, Tarifseite erscheint (Test-Charge, kostet nichts).
2. Theme-Editor → Apps → App-Einbettung „EU-Widerrufsbutton (alle Seiten)“ aktivieren, speichern.
3. Im Shop unten links „Vertrag widerrufen“ klicken, Formular ausfüllen, „Widerruf bestätigen“.
4. Im Terminal erscheint die Eingangsbestätigung (`MAIL_DRY_RUN=true`), in der App unter „Widerrufe“ der Eintrag,
   in Shopify die Bestellung mit Tag `EU-Widerruf` (wenn die Bestellnummer existiert).
5. Produktseite: Block „GARAN-Kennzeichnung“ hinzufügen, in der App unter „Gewährleistung“ die
   Metafeld-Definitionen anlegen, bei einem Produkt `guarantee_years = 5` setzen → Kennzeichnung erscheint.

## 2. E-Mail-Versand

Ein SMTP-Konto bei Postmark, Brevo, Resend oder Mailgun anlegen (Transaktionsmail, eigene Absenderdomain
verifizieren, z. B. `noreply@deine-domain.de`). Werte für `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
`MAIL_FROM` notieren. Ohne SMTP werden Widerrufe gespeichert, aber keine Eingangsbestätigungen versendet – die
App zeigt dann einen roten Hinweis.

## 3. Hosting auf Fly.io (Frankfurt)

```bash
brew install flyctl && fly auth login
fly launch --copy-config --no-deploy          # App-Name aus fly.toml übernehmen oder anpassen
fly volumes create app_data -r fra -n 1 -s 1
fly secrets set SHOPIFY_API_KEY=... SHOPIFY_API_SECRET=... SHOPIFY_APP_URL=https://<app>.fly.dev \
  SCOPES=read_orders,write_orders,write_products \
  SMTP_HOST=... SMTP_PORT=587 SMTP_USER=... SMTP_PASS=... MAIL_FROM="EU Compliance Suite <noreply@...>" \
  APP_SUPPORT_EMAIL=... APP_OPERATOR_NAME="..." APP_OPERATOR_ADDRESS="..." IP_HASH_SECRET=$(openssl rand -hex 16)
fly deploy
curl https://<app>.fly.dev/healthcheck
```

API-Key und Secret stehen im Partner Dashboard unter der App → „Client credentials“.

## 4. Produktions-URLs in Shopify eintragen

In `shopify.app.toml` `application_url`, die drei `redirect_urls` und `app_proxy.url` auf
`https://<app>.fly.dev` umstellen (Proxy-URL: `https://<app>.fly.dev/proxy`), dann:

```bash
npm run deploy      # = shopify app deploy: lädt Konfiguration + Theme-Extension hoch
```

Nach dem Deploy die UID der Theme-Extension aus der Ausgabe (oder `.shopify/project.json`) kopieren und als
`THEME_EXTENSION_UID` in den Fly-Secrets setzen – damit funktionieren die Deep-Links in den Theme-Editor.

## 5. Tarife

Die Pläne „Basic“ (6,99 USD) und „Pro“ (12,99 USD) mit 14 Tagen Test sind im Code definiert
(`app/lib/plans.ts`, Shopify Billing API, Test-Charges außerhalb von Production). Alternativ „Managed Pricing“
im Partner Dashboard aktivieren; dann müssen die Plan-Namen identisch sein, damit `billing.check` sie erkennt.
Preise in EUR gehen über Managed Pricing; die Billing-API rechnet in USD ab.

## 6. App-Store-Listing

Texte in `docs/LISTING.md`. Pflichtangaben: Datenschutz-URL `https://<app>.fly.dev/privacy`, Support-E-Mail,
Screenshots (Dashboard, Widerrufe-Liste, Dialog im Storefront, GARAN-Kennzeichnung, Gewährleistungshinweis),
Icon (1200×1200), Demo-Store-Zugang für das Review-Team. Compliance-Webhooks sind in der toml eingetragen und
werden beim Deploy registriert. Ziel: Einreichung **vor dem 27.09.2026**, weil der Gewährleistungshinweis dann
Pflicht wird und die Nachfrage steigt.

## 7. Vor der Einreichung prüfen

- [ ] `npm run typecheck && npm test && npm run build` grün
- [ ] Widerruf im Dev-Store komplett durchgespielt, E-Mail wirklich angekommen (nicht Dry-Run)
- [ ] `customers/redact` und `shop/redact` mit `shopify app webhook trigger` getestet
- [ ] Impressum-/Betreiberdaten in den Env-Variablen gesetzt (Name, Anschrift, Support-Mail)
- [ ] Rechtstexte (`/privacy`, `/terms`) und die Beschriftungen von einer Anwältin/einem Anwalt gegenlesen lassen
- [ ] Preise final festlegen (Wettbewerb: Revoq 9/25 USD, Dotcase 5,99 USD)

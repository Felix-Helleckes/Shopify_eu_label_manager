# Betrieb und Go-live (Stand 10.09.2026)

## Was bereits läuft

| Baustein | Stand |
| --- | --- |
| Hosting | Netlify Functions, Site `eu-compliance-suite`, URL https://eu-compliance-suite.netlify.app (Frankfurt-nahe Edge, Function-Region default) |
| Datenbank | Supabase Postgres, Projekt `eu-compliance-suite` (Ref `rhpyvxjiiqdwmzdaflut`, Region eu-central-1), Migration `20260910150000_init` eingespielt |
| Shopify-App | Partner-Org „EU Eco-Label Manager“, App „EU Compliance Suite“ (Handle `eu-label-1`, Client-ID `6860ad69…`), Version `eu-compliance-suite-2` aktiv, App-URL/Proxy/Webhooks auf Netlify, öffentliche Distribution gesetzt |
| Theme-Extension | `eu-compliance-blocks`, UID `91b93329-2249-9841-8269-a81778732344a4f243bf`, veröffentlicht |
| Dev-Store | `teststore-10010101001010928.myshopify.com`: App installiert, Pro-Testabo genehmigt, App-Einbettung „Widerrufsbutton (alle Seiten)“ im Live-Theme aktiviert |
| Env auf Netlify | SHOPIFY_API_KEY/SECRET, SCOPES, SHOPIFY_APP_URL, SHOPIFY_APP_HANDLE, DATABASE_URL, DIRECT_URL, IP_HASH_SECRET, THEME_EXTENSION_UID, APP_OPERATOR_*, APP_SUPPORT_EMAIL, NODE_VERSION |

## Was noch fehlt (nur mit deinen Konten möglich)

1. **SMTP-Zugang** – ohne ihn werden Widerrufe gespeichert, aber keine Eingangsbestätigungen versendet (rotes Banner in der App).
   Konto bei Brevo, Resend, Postmark oder Mailgun anlegen, Absenderdomain verifizieren, dann:
   ```bash
   cd ~/Documents/GitHub/Shopify_eu_label_manager
   npx netlify-cli env:set SMTP_HOST smtp-relay.brevo.com
   npx netlify-cli env:set SMTP_PORT 587
   npx netlify-cli env:set SMTP_USER "<login>"
   npx netlify-cli env:set SMTP_PASS "<passwort>"
   npx netlify-cli env:set MAIL_FROM "EU Compliance Suite <noreply@deine-domain.de>"
   npx netlify-cli deploy --alias smtp        # bis 23.09.2026, danach --build --prod
   ```
2. **Impressum-Anschrift**: `npx netlify-cli env:set APP_OPERATOR_ADDRESS "Straße 1, 50667 Köln, Deutschland"` und Redeploy.
3. **Storefront-Passwort des Dev-Stores** entfernen (Onlineshop → Einstellungen → Passwortschutz), damit der Widerrufs-Dialog im Storefront getestet werden kann. Danach: Startseite öffnen, unten links „Vertrag widerrufen“, Formular ausfüllen, „Widerruf bestätigen“ – der Eintrag erscheint in der App unter „Widerrufe“.
4. **Supabase-Datenbankpasswort rotieren** (Dashboard → Project Settings → Database → Reset password), anschließend `DATABASE_URL`/`DIRECT_URL` in Netlify aktualisieren. Das Passwort ist während der Einrichtung in Terminal-Ausgaben aufgetaucht.
5. **App-Store-Listing** unter https://partners.shopify.com/1971036/apps/391922778113/distribution → „Manage submission“: Texte aus `docs/LISTING.md`, Icon 1200×1200, sechs Screenshots 1600×900, Datenschutz-URL `https://eu-compliance-suite.netlify.app/privacy`, Support-Mail, Test-Anleitung für das Review-Team (Dev-Store + Passwort).


## Aktueller Sonderfall: Netlify-Credits aufgebraucht (bis 23.09.2026)

Das kostenlose Netlify-Team hat sein Monatskontingent verbraucht (alle Sites zusammen). Produktions-Deploys sind
bis zum Reset am 23.09.2026 pausiert, die veröffentlichte Version bleibt online. Ausweg: Alias-Deploys sind erlaubt
und haben eine stabile URL. Die App läuft deshalb vorübergehend unter
`https://smtp--eu-compliance-suite.netlify.app` (Shopify-Konfiguration und `SHOPIFY_APP_URL` zeigen darauf).

Bis zum Reset deshalb **immer mit Alias deployen**:

```bash
npx netlify-cli deploy --alias smtp
```

Nach dem Reset (oder nach einem Upgrade des Netlify-Teams): `SHOPIFY_APP_URL` und `shopify.app.toml` wieder auf
`https://eu-compliance-suite.netlify.app` stellen, `npx netlify-cli deploy --build --prod`, `npx shopify app deploy --allow-updates`.

Wichtig: Nie `MAIL_DRY_RUN=true` in `.env` lassen, wenn mit der CLI deployt wird – die CLI injiziert `.env` in den
Build, und der Versand läuft dann in Produktion nur zum Schein. Der Healthcheck zeigt den Zustand unter `mail`.

## Laufender Betrieb

```bash
npm run typecheck && npm test && npm run build     # vor jedem Deploy
npx netlify-cli deploy --build --prod              # App deployen (Build lokal, Env von Netlify)
npx shopify app deploy --allow-updates --message "…"   # Konfiguration + Theme-Extension nach Shopify
npx netlify-cli logs --source functions --function react-router-server --since 30m
npx prisma migrate deploy                          # bei Schema-Änderungen (nutzt DIRECT_URL aus .env)
```

Lokale Entwicklung: `.env` zeigt auf dieselbe Supabase-Datenbank; `npm run dev` startet `shopify app dev` mit Tunnel und
schaltet den Dev-Store auf die lokale Version um. Danach `npx shopify app dev clean --store <store>` ausführen, sonst
lädt der Admin weiter die Dev-Vorschau statt der veröffentlichten Version.

## Hinweise für Tests im Shopify-Admin

- Der Klick auf einen Tarif ruft die Billing-API auf; Testgebühren fallen auf Dev-Stores nicht an.
- Bei Shops ohne aktiven Plan leiten alle App-Seiten auf „Tarif“ um.
- Compliance-Webhooks lassen sich mit `npx shopify app webhook trigger --topic customers/redact --address https://eu-compliance-suite.netlify.app/webhooks/customers/redact --api-version 2026-07 --client-secret <secret>` testen.

# Betrieb und Go-live (Stand 10.09.2026)

## Was bereits läuft

| Baustein | Stand |
| --- | --- |
| Hosting | Fly.io, App `eu-compliance-suite`, Region `fra` (Frankfurt), URL https://eu-compliance-suite.fly.dev |
| Datenbank | Supabase Postgres, Projekt `eu-compliance-suite` (Ref `rhpyvxjiiqdwmzdaflut`, Region eu-central-1), Migration `20260910150000_init` eingespielt |
| Shopify-App | Partner-Org „EU Eco-Label Manager“, App „EU Compliance Suite“ (Handle `eu-label-1`, Client-ID `6860ad69…`), Version `eu-compliance-suite-11` aktiv, App-URL/Proxy/Webhooks auf Fly.io, öffentliche Distribution gesetzt, Listing seit 11.09.2026 in Review |
| Theme-Extension | `eu-compliance-blocks`, UID `91b93329-2249-9841-8269-a81778732344a4f243bf`, veröffentlicht |
| Dev-Store | `teststore-10010101001010928.myshopify.com`: App installiert, Pro-Testabo genehmigt, App-Einbettung „Widerrufsbutton (alle Seiten)“ im Live-Theme aktiviert |
| Env auf Fly (`fly secrets list`) | SHOPIFY_API_KEY/SECRET, SCOPES, SHOPIFY_APP_URL, SHOPIFY_APP_HANDLE, DATABASE_URL, DIRECT_URL, IP_HASH_SECRET, THEME_EXTENSION_UID, APP_OPERATOR_*, APP_SUPPORT_EMAIL |

## Was noch fehlt (nur mit deinen Konten möglich)

1. **SMTP-Zugang** – ohne ihn werden Widerrufe gespeichert, aber keine Eingangsbestätigungen versendet (rotes Banner in der App).
   Konto bei Brevo, Resend, Postmark oder Mailgun anlegen, Absenderdomain verifizieren, dann:
   ```bash
   cd ~/Documents/GitHub/Shopify_eu_label_manager
   fly secrets set \
     SMTP_HOST=smtp-relay.brevo.com \
     SMTP_PORT=587 \
     SMTP_USER="<login>" \
     SMTP_PASS="<passwort>" \
     MAIL_FROM="EU Compliance Suite <noreply@deine-domain.de>" \
     --app eu-compliance-suite
   # fly secrets set loest automatisch einen Deploy aus.
   ```
2. **Impressum-Anschrift**: `fly secrets set APP_OPERATOR_ADDRESS="Straße 1, 50667 Köln, Deutschland" --app eu-compliance-suite`.
3. **Storefront-Passwort des Dev-Stores** entfernen (Onlineshop → Einstellungen → Passwortschutz), damit der Widerrufs-Dialog im Storefront getestet werden kann. Danach: Startseite öffnen, unten links „Vertrag widerrufen“, Formular ausfüllen, „Widerruf bestätigen“ – der Eintrag erscheint in der App unter „Widerrufe“.
4. **Supabase-Datenbankpasswort rotieren** (Dashboard → Project Settings → Database → Reset password), anschließend `DATABASE_URL`/`DIRECT_URL` per `fly secrets set` aktualisieren. Das Passwort ist während der Einrichtung in Terminal-Ausgaben aufgetaucht.
5. **App-Store-Listing** unter https://partners.shopify.com/1971036/apps/391922778113/distribution → „Manage submission“: Texte aus `docs/LISTING.md`, Icon 1200×1200, sechs Screenshots 1600×900, Datenschutz-URL `https://eu-compliance-suite.fly.dev/privacy`, Support-Mail, Test-Anleitung für das Review-Team (Dev-Store + Passwort).


## Hosting-Historie

Die App lief anfangs auf Netlify Functions. Seit dem Umzug nach Fly.io (Frankfurt) laeuft
sie ausschliesslich dort; Netlify wird nicht mehr verwendet. `shopify.app.toml`, alle
Weiterleitungs-URLs, der App-Proxy und die DSGVO-Webhooks zeigen auf
`https://eu-compliance-suite.fly.dev`. Der Healthcheck bestaetigt das unter
`host.platform` / `host.region`.

Wichtig: Nie `MAIL_DRY_RUN=true` in `.env` stehen lassen – der Versand laeuft dann in
Produktion nur zum Schein. Der Healthcheck zeigt den Zustand unter `mail`.

## Laufender Betrieb

```bash
npm run typecheck && npm test && npm run build     # vor jedem Deploy
fly deploy --app eu-compliance-suite               # App deployen (Remote-Builder, kein lokales Docker noetig)
npx shopify app deploy --allow-updates --message "…"   # Konfiguration + Theme-Extension nach Shopify
fly logs --app eu-compliance-suite                 # Laufzeit-Logs
npx prisma migrate deploy                          # bei Schema-Änderungen (nutzt DIRECT_URL aus .env)
```

Lokale Entwicklung: `.env` zeigt auf dieselbe Supabase-Datenbank; `npm run dev` startet `shopify app dev` mit Tunnel und
schaltet den Dev-Store auf die lokale Version um. Danach `npx shopify app dev clean --store <store>` ausführen, sonst
lädt der Admin weiter die Dev-Vorschau statt der veröffentlichten Version.

## Hinweise für Tests im Shopify-Admin

- Der Klick auf einen Tarif ruft die Billing-API auf; Testgebühren fallen auf Dev-Stores nicht an.
- Bei Shops ohne aktiven Plan leiten alle App-Seiten auf „Tarif“ um.
- Compliance-Webhooks lassen sich mit `npx shopify app webhook trigger --topic customers/redact --address https://eu-compliance-suite.fly.dev/webhooks/customers/redact --api-version 2026-07 --client-secret <secret>` testen.

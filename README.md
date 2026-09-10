# EU Compliance Suite – Shopify app

Shopify app for EU merchants covering three consumer-law obligations that took or take effect in 2026:

| Obligation | Legal basis | In force | Feature |
| --- | --- | --- | --- |
| Online **withdrawal function** ("Vertrag widerrufen" button) | Art. 11a Directive 2011/83/EU (inserted by Directive (EU) 2023/2673), § 356a BGB | 19 June 2026 | Theme app block + app embed, two-step confirmation, time-stamped acknowledgement of receipt by e-mail, withdrawal log with checksum, order matching/tagging, CSV export |
| **Harmonised notice** on the legal guarantee of conformity | Art. 6(1)(l) CRD as amended by Directive (EU) 2024/825; Implementing Regulation (EU) 2025/1960 Annex I | 27 Sept 2026 | Theme app block showing the official artwork (colour) in all 24 EU languages |
| **Harmonised label** ("GARAN") for commercial guarantees of durability > 2 years | Art. 6(1)(la) CRD; Implementing Regulation (EU) 2025/1960 Annex II | 27 Sept 2026 | Theme app block driven by product metafields, nested display supported |
| **Right to repair** information | Art. 13(2a) Directive (EU) 2019/771 as amended by Directive (EU) 2024/1799 | 31 July 2026 | Optional informational theme block |

Built on the official Shopify React Router template: React Router 7, `@shopify/shopify-app-react-router` v2,
Polaris web components, Prisma (SQLite), GraphQL Admin API only, Shopify Billing API with 14-day trial.

## Repository layout

```
app/
  shopify.server.ts        Shopify app config (scopes, billing plans, afterAuth shop sync)
  routes/
    app.*.tsx              Embedded admin UI (dashboard, withdrawals, settings, guarantee, billing)
    proxy.withdrawal.tsx   Storefront endpoint of the withdrawal function (via app proxy, signed by Shopify)
    webhooks.*.tsx         app/uninstalled, app/scopes_update, customers/data_request, customers/redact, shop/redact
    privacy.tsx terms.tsx support.tsx   Public legal pages (required for the App Store listing)
  lib/
    withdrawal.server.ts   Validation, evidence hash, order matching/tagging, e-mails, CSV, rate limit
    i18n.server.ts         Acknowledgement e-mail texts (10 languages) + merchant notification texts
    labels.ts              Official button wording in all 24 EU languages (from the Official Journal)
    metafields.server.ts   Product metafield definitions for the GARAN label
extensions/eu-compliance-blocks/
  blocks/                  withdrawal-button, withdrawal-embed, legal-guarantee-notice, durability-label, repair-info
  snippets/                Shared dialog markup of the withdrawal function
  assets/                  JS/CSS + official notice/label artwork (from Implementing Regulation (EU) 2025/1960)
  locales/                 Storefront strings (24 languages) and merchant-facing schema strings (de, en)
prisma/schema.prisma       Session, Shop (settings), Withdrawal (evidence), AuditEvent
docs/                      SETUP.md (go-live checklist), LEGAL.md (requirements → implementation), LISTING.md
```

## Development

```bash
npm install
cp .env.example .env            # DATABASE_URL="file:dev.sqlite", MAIL_DRY_RUN=true
npx prisma migrate deploy
npm run dev                     # = shopify app dev (needs Shopify Partner login)
```

`npm run typecheck`, `npm test` (vitest) and `npm run build` must pass before deploying. `MAIL_DRY_RUN=true`
prints e-mails to stdout instead of sending them.

## Configuration (environment)

| Variable | Purpose |
| --- | --- |
| `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_APP_URL`, `SCOPES` | injected by the Shopify CLI in dev; set as secrets in production |
| `DATABASE_URL` | `file:dev.sqlite` (dev) / `file:/data/prod.sqlite` (Fly volume) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | outgoing mail (acknowledgements of receipt, merchant notifications) |
| `APP_OPERATOR_NAME`, `APP_OPERATOR_ADDRESS`, `APP_SUPPORT_EMAIL` | shown on legal pages |
| `IP_HASH_SECRET` | HMAC secret for hashed IP addresses in the withdrawal log |
| `THEME_EXTENSION_UID` | UID of the deployed theme extension; enables deep links into the theme editor |
| `SHOPIFY_APP_HANDLE` | app handle used in admin deep links (default `eu-compliance-suite`) |
| `BILLING_TEST=true` / `BILLING_DISABLED=true` | test charges / bypass billing on development stores |

See [docs/SETUP.md](docs/SETUP.md) for the full go-live checklist and [docs/LEGAL.md](docs/LEGAL.md) for the
legal requirements and how each one is implemented.

## Licence

Proprietary – © 2026 Felix Helleckes. The harmonised notice and label artwork is published by the European
Commission in Implementing Regulation (EU) 2025/1960 and reproduced unchanged as required by that regulation.

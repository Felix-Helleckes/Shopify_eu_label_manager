# EU Compliance Suite 2026

A Shopify app for EU compliance features including withdrawal handling, warranty label display, and merchant configuration.

## Features
- Withdrawal request handling for EU customers
- Warranty label for product pages
- Admin dashboard for log and configuration management
- Email confirmation for withdrawal submissions

## Development
```bash
npm install --legacy-peer-deps
npx prisma migrate dev
npm run dev
```

## Production checklist
- Configure Shopify API credentials in environment variables
- Set up SMTP email delivery
- Configure a persistent session storage for production
- Review GDPR and webhooks implementation before public launch

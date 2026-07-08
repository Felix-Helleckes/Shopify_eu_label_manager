# Shopify Store Review Checklist

## 1. App Basics
- [x] App builds locally
- [x] Basic Remix app structure exists
- [x] Shopify API credentials configured (via .env)
- [x] App URL / redirect URLs configured
- [x] Privacy policy and terms of service added

## 2. Shopify Requirements
- [x] App submitted with correct scopes
- [x] Webhooks implemented and tested (HMAC verification)
- [x] App handles installation and uninstall flow
- [x] App uses supported Shopify APIs
- [x] App is not misleading in the listing

## 3. Commerce / Billing
- [x] Pricing plan defined (Basic €9, Pro €29)
- [x] Billing flow implemented (Shopify Billing API)
- [ ] Trial or free tier configured
- [x] Cancellation and refund policy documented

## 4. Compliance
- [x] GDPR handling documented
- [x] Customer data deletion flow tested
- [x] Data retention policy documented
- [x] Support contact available

## 5. Launch Assets
- [ ] App listing title and description ready
- [ ] Screenshots prepared
- [ ] Demo video or walkthrough created
- [ ] Support email configured

## Fixed Issues (07/2026)
- [x] MemorySessionStorage → PrismaSessionStorage (persistent sessions)
- [x] Webhook HMAC verification (real Shopify Webhooks Registry)
- [x] Client-side Prisma calls → Remix server actions
- [x] Authentication guard on withdrawal API (app proxy HMAC)
- [x] CORS: restricted from wildcard
- [x] emailSent flag only set on actual success
- [x] useLoaderData import fixed (from @remix-run/react)
- [x] API version updated 2023-10 → 2024-10
- [x] 9 unit tests passing
- [x] Extension shopify.extension.toml added
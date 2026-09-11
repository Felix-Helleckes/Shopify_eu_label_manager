# Eskalation: „Eingebettete App-Checks“ hängen

Nur nötig, wenn die beiden Checks nach 24 Stunden immer noch grau sind. Shopify-Mitarbeiter antworten im
Entwicklerforum meist innerhalb weniger Stunden und schalten die Einreichung dann frei.

**Wo:** https://community.shopify.dev/ → Kategorie „Shopify App Store“ → New Topic, Tags `app-store`, `partner-dash`
(Login mit dem Partner-Account, also Felix' Shopify-Login).

**Titel:**
Embedded app checks stuck pending — App Bridge CDN + session tokens verified (App ID 391922778113)

**Text (zum Kopieren):**

Hi,

both embedded app checks for our app have been pending for more than 24 hours, which blocks the submission.

- App ID: 391922778113
- Partner ID: 1971036
- App handle: eu-label-1
- Dev store used for testing: teststore-10010101001010928.myshopify.com

What we verified on our side:

1. The app loads `https://cdn.shopify.com/shopifycloud/app-bridge.js` with a `data-api-key` attribute (injected by
   `@shopify/shopify-app-react-router` v2.1.0, AppProvider). The `shopify-api-key` meta tag is present as well.
2. The API key served at runtime matches the app's client ID (6860ad69a983c0549dc759de3b0a5cb0).
3. App Bridge initialises correctly: the app's `s-app-nav` entries render in the admin sidebar, and Polaris web
   components work.
4. Session token authentication is handled by the same library (`authenticate.admin`); all admin requests are
   authenticated, and `future.expiringOfflineAccessTokens` is enabled.
5. We logged into the dev store and interacted with every app page several times, including an incognito window with
   all browser extensions disabled, so App Bridge telemetry to `monorail-edge.shopifysvc.com` is not blocked.

All other preliminary steps are green (listing, protected customer data, automated checks, online store checks, AI
self-review). Could you please check whether the session data is attributed to the app, or verify the checks manually?

Thanks a lot,
Felix Helleckes

**Danach:** Screenshot der Distribution-Seite anhängen (zeigt die beiden grauen Checks) und den Zeitraum nennen, seit
wann die App im Dev-Store benutzt wurde (11.09.2026).

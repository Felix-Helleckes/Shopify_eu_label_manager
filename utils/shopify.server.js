import { createShopifyAuth } from '@shopify/shopify-app-remix/server';
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage';

const sessionStorage = new MemorySessionStorage();

const shopify = createShopifyAuth({
  apiKey: process.env.SHOPIFY_API_KEY || '',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  scopes: process.env.SHOPIFY_SCOPES?.split(',') || [],
  appUrl: process.env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_DOMAIN || 'https://example.myshopify.com',
  sessionStorage,
});

export const authenticate = shopify.authenticate;
export const login = shopify.login;
export const billing = shopify.billing;
export const sessionStorageSingleton = sessionStorage;

export const Shopify = {
  Webhooks: {
    Registry: {
      handlers: new Map(),
      addHandler(topic, handler) {
        this.handlers.set(topic, handler);
      },
      async process(headers, body) {
        const topic = headers.get('x-shopify-topic') || '';
        const shop = headers.get('x-shopify-shop-domain') || '';
        const handler = this.handlers.get(topic.replace(/-/g, '_').toUpperCase());
        if (handler) {
          await handler(topic, shop, body, 'local');
        }
        return { success: true };
      },
    },
  },
};
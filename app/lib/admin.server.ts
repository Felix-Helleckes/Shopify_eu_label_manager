import type { Shop } from "@prisma/client";
import db from "../db.server";
import { authenticate } from "../shopify.server";
import { getOrCreateShop, syncShopFromAdmin } from "./shop.server";
import { requireActivePlan } from "./billing.server";
import {
  ADMIN_LOCALE_TAGS,
  normalizeAdminLocale,
  translator,
  type AdminLocale,
  type Translator,
} from "./admin-i18n";

/**
 * Determines the UI language for a merchant:
 * 1. explicit choice in the app settings (shop.adminLocale),
 * 2. the `locale` parameter Shopify appends when it loads the embedded app (persisted per shop),
 * 3. the shop's primary storefront language, 4. English.
 */
export async function resolveAdminLocale(request: Request, shop: Shop): Promise<{ locale: AdminLocale; shop: Shop }> {
  const url = new URL(request.url);
  const detected = normalizeAdminLocale(url.searchParams.get("locale"));
  if (detected && detected !== shop.detectedLocale) {
    try {
      shop = await db.shop.update({ where: { domain: shop.domain }, data: { detectedLocale: detected } });
    } catch (error) {
      console.error("[locale] persist failed", error);
    }
  }
  const locale =
    normalizeAdminLocale(shop.adminLocale) ??
    detected ??
    normalizeAdminLocale(shop.detectedLocale) ??
    normalizeAdminLocale(shop.shopLocale) ??
    "en";
  return { locale, shop };
}

export type ShopContext = Awaited<ReturnType<typeof authenticate.admin>> & {
  shop: Shop;
  plan: string | null;
  locale: AdminLocale;
  localeTag: string;
  t: Translator;
};

/** Authenticates an embedded admin request, loads the Shop row, resolves the UI language and (optionally) enforces billing. */
export async function requireShop(request: Request, options: { billing?: boolean } = {}): Promise<ShopContext> {
  const ctx = await authenticate.admin(request);
  let shop = await getOrCreateShop(ctx.session.shop);
  // afterAuth may have failed (e.g. API hiccup); complete the master data lazily.
  if (!shop.email && !shop.timezone) {
    try {
      shop = await syncShopFromAdmin(ctx.admin, ctx.session.shop);
    } catch (error) {
      console.error("[requireShop] shop sync failed", error);
    }
  }
  const resolved = await resolveAdminLocale(request, shop);
  shop = resolved.shop;
  const plan = options.billing === false ? null : await requireActivePlan(ctx.billing, request);
  return {
    ...ctx,
    shop,
    plan,
    locale: resolved.locale,
    localeTag: ADMIN_LOCALE_TAGS[resolved.locale],
    t: translator(resolved.locale),
  };
}

export function storeHandle(domain: string) {
  return domain.replace(".myshopify.com", "");
}

export function themeEditorLinks(domain: string) {
  const store = storeHandle(domain);
  const base = `https://admin.shopify.com/store/${store}/themes/current/editor`;
  // Theme editor deep links use the app's API key (client_id), see Shopify docs "Deep linking".
  const uid = process.env.SHOPIFY_API_KEY || process.env.THEME_EXTENSION_UID;
  return {
    apps: `${base}?context=apps`,
    activateWithdrawalEmbed: uid ? `${base}?context=apps&activateAppId=${uid}/withdrawal-embed` : `${base}?context=apps`,
    addWithdrawalBlock: uid
      ? `${base}?template=page&addAppBlockId=${uid}/withdrawal-button&target=newAppsSection`
      : `${base}?context=apps`,
    addNoticeBlock: uid
      ? `${base}?template=product&addAppBlockId=${uid}/legal-guarantee-notice&target=mainSection`
      : `${base}?template=product`,
    addLabelBlock: uid
      ? `${base}?template=product&addAppBlockId=${uid}/durability-label&target=mainSection`
      : `${base}?template=product`,
    addRepairBlock: uid
      ? `${base}?template=product&addAppBlockId=${uid}/repair-info&target=mainSection`
      : `${base}?template=product`,
  };
}

export { STATUS_LABELS } from "./status";

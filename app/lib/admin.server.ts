import { authenticate } from "../shopify.server";
import { getOrCreateShop, syncShopFromAdmin } from "./shop.server";
import { requireActivePlan } from "./billing.server";

/** Authenticates an embedded admin request, loads the Shop row and (optionally) enforces billing. */
export async function requireShop(request: Request, options: { billing?: boolean } = {}) {
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
  const plan = options.billing === false ? null : await requireActivePlan(ctx.billing, request);
  return { ...ctx, shop, plan };
}

export function storeHandle(domain: string) {
  return domain.replace(".myshopify.com", "");
}

export function themeEditorLinks(domain: string) {
  const store = storeHandle(domain);
  const base = `https://admin.shopify.com/store/${store}/themes/current/editor`;
  const uid = process.env.THEME_EXTENSION_UID;
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

import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getOrCreateShop, syncShopFromAdmin } from "../lib/shop.server";
import { hashIp, isRateLimited, processWithdrawal, validateInput } from "../lib/withdrawal.server";

/**
 * Storefront endpoint of the withdrawal function.
 * Reached through the Shopify app proxy:  https://<shop>/apps/eu-compliance/withdrawal
 * Shopify signs every proxied request; `authenticate.public.appProxy` verifies the signature.
 */

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.public.appProxy(request);
  return json({ ok: true, endpoint: "withdrawal", methods: ["POST"] });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  const { session, admin } = await authenticate.public.appProxy(request);
  if (!session) return json({ ok: false, error: "app_not_installed" }, 503);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  if (isRateLimited(`${session.shop}:${hashIp(ip) ?? "noip"}`)) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  let raw: unknown;
  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      raw = await request.json();
    } else {
      raw = Object.fromEntries((await request.formData()).entries());
    }
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  // Honeypot: bots fill every field. Real users never see "website".
  if (raw && typeof raw === "object" && (raw as Record<string, unknown>).website) {
    return json({ ok: true, receiptNo: "WR-00000000-SPAM", submittedAt: new Date().toISOString(), ackSent: true });
  }

  const validation = validateInput(raw);
  if (!validation.ok) return json({ ok: false, error: "validation", fields: validation.errors }, 422);

  let shop = await getOrCreateShop(session.shop);
  if (!shop.email && admin) {
    try {
      shop = await syncShopFromAdmin(admin, session.shop);
    } catch (error) {
      console.error("[proxy] shop sync failed", error);
    }
  }
  const result = await processWithdrawal({
    admin,
    shop,
    input: validation.value,
    meta: { ip, userAgent: request.headers.get("user-agent") },
  });

  return json({
    ok: true,
    receiptNo: result.receiptNo,
    submittedAt: result.submittedAt.toISOString(),
    ackSent: result.ackSent,
  });
};

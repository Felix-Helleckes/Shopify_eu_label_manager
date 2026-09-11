// Dev helper: shows the plan metafield + active subscriptions of a shop; ACTION=cancel cancels all active subscriptions.
//   SHOP=<shop.myshopify.com> [ACTION=cancel] node scripts/plan-status.mjs
import { PrismaClient } from "@prisma/client";
const shop = process.env.SHOP;
const prisma = new PrismaClient();
const session = await prisma.session.findFirst({ where: { shop, isOnline: false }, orderBy: { id: "desc" } });
if (!session) { console.error("no offline session"); process.exit(1); }
const gql = async (query, variables) => {
  const res = await fetch(`https://${shop}/admin/api/2026-07/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": session.accessToken },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
};
const info = await gql(`{ shop { metafield(namespace: "$app:billing", key: "plan") { value updatedAt } } currentAppInstallation { activeSubscriptions { id name status test } } }`);
console.log(JSON.stringify(info.data ?? info, null, 1));
const row = await prisma.shop.findUnique({ where: { domain: shop }, select: { plan: true } });
console.log("db plan:", row?.plan);
if (process.env.ACTION === "cancel") {
  for (const s of info.data?.currentAppInstallation?.activeSubscriptions ?? []) {
    const r = await gql(`mutation($id: ID!) { appSubscriptionCancel(id: $id, prorate: true) { appSubscription { id status } userErrors { message } } }`, { id: s.id });
    console.log("cancel", s.name, JSON.stringify(r.data?.appSubscriptionCancel ?? r));
  }
}
await prisma.$disconnect();

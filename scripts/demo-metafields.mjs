// Dev helper: creates the eu_compliance product metafield definitions on a store and sets demo GARAN values
// on the first product, so the GARAN block has data to show.   SHOP=<shop.myshopify.com> node scripts/demo-metafields.mjs
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
const defs = [
  { key: "guarantee_years", name: "Producer guarantee: duration in years (GARAN)", type: "number_integer" },
  { key: "guarantee_producer", name: "Producer guarantee: producer / brand (GARAN)", type: "single_line_text_field" },
  { key: "guarantee_model", name: "Producer guarantee: model identifier (GARAN)", type: "single_line_text_field" },
  { key: "guarantee_terms_url", name: "Producer guarantee: link to the guarantee terms", type: "url" },
];
const existing = await gql(`{ metafieldDefinitions(first: 20, ownerType: PRODUCT, namespace: "eu_compliance") { nodes { key } } }`);
const have = new Set((existing.data?.metafieldDefinitions.nodes ?? []).map((n) => n.key));
for (const d of defs) {
  if (have.has(d.key)) continue;
  const r = await gql(`mutation($definition: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition: $definition) { createdDefinition { key } userErrors { message } } }`,
    { definition: { namespace: "eu_compliance", key: d.key, name: d.name, type: d.type, ownerType: "PRODUCT", pin: true } });
  console.log("definition", d.key, JSON.stringify(r.data?.metafieldDefinitionCreate ?? r.errors));
}
const prod = await gql(`{ products(first: 10, sortKey: TITLE) { nodes { id title handle isGiftCard } } }`);
const p = (prod.data?.products.nodes ?? []).find((n) => !n.isGiftCard);
const gift = (prod.data?.products.nodes ?? []).find((n) => n.isGiftCard);
if (gift) {
  await gql(`mutation($metafields: [MetafieldIdentifierInput!]!) { metafieldsDelete(metafields: $metafields) { deletedMetafields { key } userErrors { message } } }`, {
    metafields: ["guarantee_years", "guarantee_producer", "guarantee_model"].map((key) => ({ ownerId: gift.id, namespace: "eu_compliance", key })),
  });
}
if (p) {
  const r = await gql(`mutation($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { metafields { key value } userErrors { message } } }`, {
    metafields: [
      { ownerId: p.id, namespace: "eu_compliance", key: "guarantee_years", type: "number_integer", value: "5" },
      { ownerId: p.id, namespace: "eu_compliance", key: "guarantee_producer", type: "single_line_text_field", value: "ACME Tools Ltd" },
      { ownerId: p.id, namespace: "eu_compliance", key: "guarantee_model", type: "single_line_text_field", value: "DEMO-5Y" },
    ],
  });
  console.log("product", p.title, p.handle, JSON.stringify(r.data?.metafieldsSet ?? r.errors));
}
await prisma.$disconnect();

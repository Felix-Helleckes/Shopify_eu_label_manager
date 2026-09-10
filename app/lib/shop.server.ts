import prisma from "../db.server";

type GraphqlClient = {
  graphql: (query: string, options?: { variables?: Record<string, unknown> }) => Promise<Response>;
};

const SHOP_QUERY = `#graphql
  query EuComplianceShopInfo {
    shop {
      name
      email
      contactEmail
      myshopifyDomain
      currencyCode
      ianaTimezone
      primaryDomain { host url }
    }
    shopLocales {
      locale
      primary
      published
    }
  }
`;

export type ShopInfo = {
  name: string;
  email: string | null;
  primaryDomain: string | null;
  currency: string | null;
  timezone: string | null;
  shopLocale: string | null;
  publishedLocales: string[];
};

/** Reads the shop's master data via the Admin GraphQL API. */
export async function fetchShopInfo(admin: GraphqlClient): Promise<ShopInfo> {
  const response = await admin.graphql(SHOP_QUERY);
  const json = (await response.json()) as {
    data?: {
      shop: {
        name: string;
        email: string | null;
        contactEmail: string | null;
        myshopifyDomain: string;
        currencyCode: string | null;
        ianaTimezone: string | null;
        primaryDomain: { host: string; url: string } | null;
      };
      shopLocales: { locale: string; primary: boolean; published: boolean }[];
    };
  };
  const shop = json.data?.shop;
  const locales = json.data?.shopLocales ?? [];
  const primary = locales.find((l) => l.primary)?.locale ?? null;
  return {
    name: shop?.name ?? "",
    email: shop?.contactEmail ?? shop?.email ?? null,
    primaryDomain: shop?.primaryDomain?.url ?? null,
    currency: shop?.currencyCode ?? null,
    timezone: shop?.ianaTimezone ?? null,
    shopLocale: primary,
    publishedLocales: locales.filter((l) => l.published).map((l) => l.locale),
  };
}

/** Creates or refreshes the Shop row after OAuth. Never throws on API errors. */
export async function syncShopFromAdmin(admin: GraphqlClient, domain: string) {
  const info = await fetchShopInfo(admin);
  return prisma.shop.upsert({
    where: { domain },
    create: {
      domain,
      name: info.name || domain,
      email: info.email,
      primaryDomain: info.primaryDomain,
      currency: info.currency,
      timezone: info.timezone,
      shopLocale: info.shopLocale,
      merchantEmail: info.email,
    },
    update: {
      name: info.name || domain,
      email: info.email,
      primaryDomain: info.primaryDomain,
      currency: info.currency,
      timezone: info.timezone,
      shopLocale: info.shopLocale,
      uninstalledAt: null,
    },
  });
}

/** Returns the Shop row, creating a minimal one if OAuth sync has not run yet. */
export async function getOrCreateShop(domain: string) {
  const existing = await prisma.shop.findUnique({ where: { domain } });
  if (existing) return existing;
  return prisma.shop.create({ data: { domain, name: domain } });
}

export type ShopRecord = NonNullable<Awaited<ReturnType<typeof prisma.shop.findUnique>>>;

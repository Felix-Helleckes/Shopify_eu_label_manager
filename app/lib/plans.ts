/** Plan identifiers – must match the keys of the `billing` config in shopify.server.ts. */
export const PLAN_BASIC = "Basic";
export const PLAN_PRO = "Pro";
export const ALL_PLANS = [PLAN_BASIC, PLAN_PRO] as const;
export type PlanName = (typeof ALL_PLANS)[number];

export const TRIAL_DAYS = 14;

export const PLAN_DETAILS: Record<
  PlanName,
  { price: number; currency: string; features: { de: string[]; en: string[] } }
> = {
  [PLAN_BASIC]: {
    price: 6.99,
    currency: "USD",
    features: {
      de: [
        "Gesetzeskonforme Widerrufsfunktion (Art. 11a VRRL / § 356a BGB) in 24 EU-Sprachen",
        "Automatische Eingangsbestätigung mit Zeitstempel an den Kunden",
        "Widerrufsprotokoll mit Prüfsumme und CSV-Export",
        "Zuordnung zur Shopify-Bestellung",
      ],
      en: [
        "Compliant withdrawal function (Art. 11a CRD) in 24 EU languages",
        "Automatic time-stamped acknowledgement of receipt to the consumer",
        "Withdrawal log with checksum and CSV export",
        "Matching to the Shopify order",
      ],
    },
  },
  [PLAN_PRO]: {
    price: 12.99,
    currency: "USD",
    features: {
      de: [
        "Alles aus Basic",
        "Harmonisierter Gewährleistungshinweis (VO (EU) 2025/1960) ab 27.09.2026",
        "Harmonisierte Kennzeichnung für Haltbarkeitsgarantien pro Produkt",
        "Hinweis zum Recht auf Reparatur",
        "Bestellung automatisch taggen + Händlerbenachrichtigung",
        "Prioritäts-Support",
      ],
      en: [
        "Everything in Basic",
        "Harmonised legal-guarantee notice (Reg. (EU) 2025/1960) from 27 Sept 2026",
        "Harmonised durability-guarantee label per product",
        "Right-to-repair information block",
        "Automatic order tagging + merchant notification",
        "Priority support",
      ],
    },
  },
};

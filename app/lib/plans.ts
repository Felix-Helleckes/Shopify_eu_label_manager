/** Plan identifiers – must match the keys of the `billing` config in shopify.server.ts. */
export const PLAN_BASIC = "Basic";
export const PLAN_PRO = "Pro";
export const ALL_PLANS = [PLAN_BASIC, PLAN_PRO] as const;
export type PlanName = (typeof ALL_PLANS)[number];

export const TRIAL_DAYS = 14;

type Features = Record<string, string[]>;

const BASIC_FEATURES: Features = {
  en: [
    "Compliant withdrawal function (Art. 11a CRD) in 24 EU languages",
    "Automatic time-stamped acknowledgement of receipt to the consumer",
    "Withdrawal log with checksum and CSV export",
    "Matching to the Shopify order",
  ],
  de: [
    "Gesetzeskonforme Widerrufsfunktion (Art. 11a VRRL / § 356a BGB) in 24 EU-Sprachen",
    "Automatische Eingangsbestätigung mit Zeitstempel an den Kunden",
    "Widerrufsprotokoll mit Prüfsumme und CSV-Export",
    "Zuordnung zur Shopify-Bestellung",
  ],
  fr: [
    "Fonction de rétractation conforme (art. 11 bis DDC) en 24 langues de l’UE",
    "Accusé de réception horodaté envoyé automatiquement au consommateur",
    "Journal des rétractations avec somme de contrôle et export CSV",
    "Association à la commande Shopify",
  ],
  es: [
    "Función de desistimiento conforme (art. 11 bis DDC) en 24 idiomas de la UE",
    "Acuse de recibo automático con fecha y hora para el consumidor",
    "Registro de desistimientos con suma de comprobación y exportación CSV",
    "Asignación al pedido de Shopify",
  ],
  it: [
    "Funzione di recesso conforme (art. 11 bis DDC) in 24 lingue UE",
    "Conferma di ricezione automatica con data e ora al consumatore",
    "Registro dei recessi con checksum ed esportazione CSV",
    "Abbinamento all’ordine Shopify",
  ],
  nl: [
    "Conforme herroepingsfunctie (art. 11 bis RCR) in 24 EU-talen",
    "Automatische ontvangstbevestiging met tijdstempel aan de consument",
    "Herroepingslogboek met controlesom en CSV-export",
    "Koppeling aan de Shopify-bestelling",
  ],
  pl: [
    "Zgodna z prawem funkcja odstąpienia (art. 11a dyrektywy) w 24 językach UE",
    "Automatyczne potwierdzenie odbioru ze znacznikiem czasu dla konsumenta",
    "Rejestr odstąpień z sumą kontrolną i eksportem CSV",
    "Przypisanie do zamówienia Shopify",
  ],
  pt: [
    "Função de retratação conforme (art. 11.º-A DDC) em 24 línguas da UE",
    "Acuse de receção automático com data e hora para o consumidor",
    "Registo de retratações com soma de verificação e exportação CSV",
    "Associação à encomenda Shopify",
  ],
  sv: [
    "Regelenlig ångerfunktion (art. 11a KRD) på 24 EU-språk",
    "Automatisk tidsstämplad mottagningsbekräftelse till konsumenten",
    "Ångerlogg med kontrollsumma och CSV-export",
    "Matchning mot Shopify-ordern",
  ],
  da: [
    "Lovlig fortrydelsesfunktion (art. 11a FRD) på 24 EU-sprog",
    "Automatisk tidsstemplet kvittering til forbrugeren",
    "Fortrydelseslog med kontrolsum og CSV-eksport",
    "Matchning med Shopify-ordren",
  ],
};

const PRO_FEATURES: Features = {
  en: [
    "Everything in Basic",
    "Harmonised legal-guarantee notice (Reg. (EU) 2025/1960) from 27 Sept 2026",
    "Harmonised GARAN label for durability guarantees per product",
    "Right-to-repair notice",
    "Automatic order tagging + merchant notification",
    "Priority support",
  ],
  de: [
    "Alles aus Basic",
    "Harmonisierter Gewährleistungshinweis (VO (EU) 2025/1960) ab 27.09.2026",
    "Harmonisierte GARAN-Kennzeichnung für Haltbarkeitsgarantien pro Produkt",
    "Hinweis zum Recht auf Reparatur",
    "Bestellung automatisch taggen + Händlerbenachrichtigung",
    "Prioritäts-Support",
  ],
  fr: [
    "Tout le contenu de Basic",
    "Avis harmonisé de garantie légale (règl. (UE) 2025/1960) dès le 27/09/2026",
    "Label GARAN harmonisé pour les garanties de durabilité par produit",
    "Avis sur le droit à la réparation",
    "Balisage automatique des commandes + notification au marchand",
    "Assistance prioritaire",
  ],
  es: [
    "Todo lo de Basic",
    "Aviso armonizado de garantía legal (Regl. (UE) 2025/1960) desde el 27/09/2026",
    "Etiqueta GARAN armonizada para garantías de durabilidad por producto",
    "Aviso sobre el derecho a reparación",
    "Etiquetado automático de pedidos + notificación al comerciante",
    "Soporte prioritario",
  ],
  it: [
    "Tutto quello di Basic",
    "Avviso armonizzato sulla garanzia legale (reg. (UE) 2025/1960) dal 27/09/2026",
    "Etichetta GARAN armonizzata per garanzie di durabilità per prodotto",
    "Avviso sul diritto alla riparazione",
    "Tag automatico degli ordini + notifica al commerciante",
    "Supporto prioritario",
  ],
  nl: [
    "Alles uit Basic",
    "Geharmoniseerde kennisgeving wettelijke garantie (Vo. (EU) 2025/1960) vanaf 27-09-2026",
    "Geharmoniseerd GARAN-label voor duurzaamheidsgaranties per product",
    "Kennisgeving recht op reparatie",
    "Automatisch taggen van bestellingen + melding aan de verkoper",
    "Prioriteitsondersteuning",
  ],
  pl: [
    "Wszystko z planu Basic",
    "Zharmonizowana informacja o gwarancji prawnej (rozp. (UE) 2025/1960) od 27.09.2026",
    "Zharmonizowana etykieta GARAN dla gwarancji trwałości na produkt",
    "Informacja o prawie do naprawy",
    "Automatyczne tagowanie zamówień + powiadomienie sprzedawcy",
    "Priorytetowe wsparcie",
  ],
  pt: [
    "Tudo o que está no Basic",
    "Aviso harmonizado de garantia legal (Reg. (UE) 2025/1960) a partir de 27/09/2026",
    "Rótulo GARAN harmonizado para garantias de durabilidade por produto",
    "Aviso sobre o direito à reparação",
    "Etiquetagem automática de encomendas + notificação ao comerciante",
    "Suporte prioritário",
  ],
  sv: [
    "Allt i Basic",
    "Harmoniserat meddelande om rättslig garanti (förordning (EU) 2025/1960) från 27/9 2026",
    "Harmoniserad GARAN-märkning för hållbarhetsgarantier per produkt",
    "Information om rätten till reparation",
    "Automatisk taggning av ordrar + avisering till handlaren",
    "Prioriterad support",
  ],
  da: [
    "Alt i Basic",
    "Harmoniseret meddelelse om lovbestemt garanti (forordning (EU) 2025/1960) fra 27/9 2026",
    "Harmoniseret GARAN-mærke for holdbarhedsgarantier pr. produkt",
    "Oplysning om retten til reparation",
    "Automatisk tagging af ordrer + meddelelse til forhandleren",
    "Prioriteret support",
  ],
};

export const PLAN_DETAILS: Record<PlanName, { price: number; currency: string; features: Features }> = {
  [PLAN_BASIC]: { price: 6.99, currency: "USD", features: BASIC_FEATURES },
  [PLAN_PRO]: { price: 12.99, currency: "USD", features: PRO_FEATURES },
};

export function planFeatures(plan: PlanName, locale: string): string[] {
  const f = PLAN_DETAILS[plan].features;
  return f[locale] ?? f.en;
}

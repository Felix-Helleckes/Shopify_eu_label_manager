/**
 * Plans. "Free" (display name "Label") needs no Shopify subscription and unlocks the guarantee/label blocks;
 * "Basic" and "Pro" are Shopify Billing plans – their keys must match the `billing` config in shopify.server.ts.
 */
export const PLAN_FREE = "Free";
export const PLAN_BASIC = "Basic";
export const PLAN_PRO = "Pro";
export const PAID_PLANS = [PLAN_BASIC, PLAN_PRO] as const;
export const ALL_PLANS = [PLAN_FREE, PLAN_BASIC, PLAN_PRO] as const;
export type PaidPlanName = (typeof PAID_PLANS)[number];
export type PlanName = (typeof ALL_PLANS)[number];

export const TRIAL_DAYS = 14;

/** Display names shown to merchants. */
export const PLAN_LABELS: Record<PlanName, string> = { Free: "Label", Basic: "Basic", Pro: "Pro" };

export function isPaidPlan(plan: string | null | undefined): plan is PaidPlanName {
  return plan === PLAN_BASIC || plan === PLAN_PRO;
}
/** Withdrawal function (button, acknowledgements, log) – Basic and Pro. */
export function hasWithdrawal(plan: string | null | undefined): boolean {
  return isPaidPlan(plan);
}
/** Order tagging, CSV export, priority support – Pro only. */
export function hasPro(plan: string | null | undefined): boolean {
  return plan === PLAN_PRO;
}

type Features = Record<string, string[]>;

const FREE_FEATURES: Features = {
  en: ["Harmonised legal-guarantee notice block (24 EU languages)", "GARAN label per product from metafields", "Right-to-repair notice block", "No subscription, no time limit"],
  de: ["Block „Gesetzlicher Gewährleistungshinweis“ (24 EU-Sprachen)", "GARAN-Kennzeichnung pro Produkt aus Metafeldern", "Block „Hinweis zum Recht auf Reparatur“", "Kein Abo, keine zeitliche Begrenzung"],
  fr: ["Bloc « Avis harmonisé de garantie légale » (24 langues de l’UE)", "Label GARAN par produit depuis les métachamps", "Bloc « Avis sur le droit à la réparation »", "Sans abonnement, sans limite de durée"],
  es: ["Bloque «Aviso armonizado de garantía legal» (24 idiomas de la UE)", "Etiqueta GARAN por producto desde metacampos", "Bloque «Aviso sobre el derecho a reparación»", "Sin suscripción, sin límite de tiempo"],
  it: ["Blocco «Avviso armonizzato sulla garanzia legale» (24 lingue UE)", "Etichetta GARAN per prodotto dai metacampi", "Blocco «Avviso sul diritto alla riparazione»", "Nessun abbonamento, nessun limite di tempo"],
  nl: ["Blok “Geharmoniseerde kennisgeving wettelijke garantie” (24 EU-talen)", "GARAN-label per product uit metavelden", "Blok “Kennisgeving recht op reparatie”", "Geen abonnement, geen tijdslimiet"],
  pl: ["Blok „Zharmonizowana informacja o gwarancji prawnej” (24 języki UE)", "Etykieta GARAN na produkt z metapól", "Blok „Informacja o prawie do naprawy”", "Bez abonamentu, bez limitu czasu"],
  pt: ["Bloco «Aviso harmonizado de garantia legal» (24 línguas da UE)", "Rótulo GARAN por produto a partir de metacampos", "Bloco «Aviso sobre o direito à reparação»", "Sem subscrição, sem limite de tempo"],
  sv: ["Block ”Harmoniserat meddelande om rättslig garanti” (24 EU-språk)", "GARAN-märkning per produkt från metafält", "Block ”Information om rätten till reparation”", "Ingen prenumeration, ingen tidsgräns"],
  da: ["Blok ”Harmoniseret meddelelse om lovbestemt garanti” (24 EU-sprog)", "GARAN-mærke pr. produkt fra metafelter", "Blok ”Oplysning om retten til reparation”", "Intet abonnement, ingen tidsgrænse"],
};

const BASIC_FEATURES: Features = {
  en: ["Everything in Label", "Withdrawal button with the official wording in 24 EU languages", "Two-step confirmation and time-stamped acknowledgement of receipt", "Withdrawal log with checksum and order matching", "E-mail notification to you for every withdrawal"],
  de: ["Alles aus Label", "Widerrufsbutton mit amtlicher Beschriftung in 24 EU-Sprachen", "Zweistufige Bestätigung und Eingangsbestätigung mit Zeitstempel", "Widerrufsprotokoll mit Prüfsumme und Bestellzuordnung", "E-Mail-Benachrichtigung an Sie bei jedem Widerruf"],
  fr: ["Tout le contenu de Label", "Bouton de rétractation avec le libellé officiel en 24 langues de l’UE", "Confirmation en deux étapes et accusé de réception horodaté", "Journal des rétractations avec somme de contrôle et association aux commandes", "Notification par e-mail à chaque rétractation"],
  es: ["Todo lo de Label", "Botón de desistimiento con el texto oficial en 24 idiomas de la UE", "Confirmación en dos pasos y acuse de recibo con fecha y hora", "Registro de desistimientos con suma de comprobación y asignación de pedidos", "Notificación por correo en cada desistimiento"],
  it: ["Tutto quello di Label", "Pulsante di recesso con la dicitura ufficiale in 24 lingue UE", "Conferma in due passaggi e conferma di ricezione con data e ora", "Registro dei recessi con checksum e abbinamento ordini", "Notifica e-mail per ogni recesso"],
  nl: ["Alles uit Label", "Herroepingsknop met de officiële tekst in 24 EU-talen", "Bevestiging in twee stappen en ontvangstbevestiging met tijdstempel", "Herroepingslogboek met controlesom en koppeling aan bestellingen", "E-mailmelding bij elke herroeping"],
  pl: ["Wszystko z planu Label", "Przycisk odstąpienia z oficjalnym brzmieniem w 24 językach UE", "Dwustopniowe potwierdzenie i potwierdzenie odbioru ze znacznikiem czasu", "Rejestr odstąpień z sumą kontrolną i przypisaniem zamówień", "Powiadomienie e-mail o każdym odstąpieniu"],
  pt: ["Tudo o que está no Label", "Botão de retratação com a redação oficial em 24 línguas da UE", "Confirmação em dois passos e acuse de receção com data e hora", "Registo de retratações com soma de verificação e associação de encomendas", "Notificação por e-mail em cada retratação"],
  sv: ["Allt i Label", "Ångerknapp med den officiella lydelsen på 24 EU-språk", "Bekräftelse i två steg och tidsstämplad mottagningsbekräftelse", "Ångerlogg med kontrollsumma och ordermatchning", "E-postavisering vid varje ångerärende"],
  da: ["Alt i Label", "Fortrydelsesknap med den officielle ordlyd på 24 EU-sprog", "Totrinsbekræftelse og tidsstemplet kvittering", "Fortrydelseslog med kontrolsum og ordrematchning", "E-mailbesked ved hver fortrydelse"],
};

const PRO_FEATURES: Features = {
  en: ["Everything in Basic", "Automatic order tagging and withdrawal metafield", "CSV export of the withdrawal log", "Priority support"],
  de: ["Alles aus Basic", "Bestellung automatisch taggen + Widerrufs-Metafeld", "CSV-Export des Widerrufsprotokolls", "Prioritäts-Support"],
  fr: ["Tout le contenu de Basic", "Balisage automatique des commandes + métachamp de rétractation", "Export CSV du journal des rétractations", "Assistance prioritaire"],
  es: ["Todo lo de Basic", "Etiquetado automático de pedidos + metacampo de desistimiento", "Exportación CSV del registro de desistimientos", "Soporte prioritario"],
  it: ["Tutto quello di Basic", "Tag automatico degli ordini + metacampo del recesso", "Esportazione CSV del registro dei recessi", "Supporto prioritario"],
  nl: ["Alles uit Basic", "Automatisch taggen van bestellingen + herroepingsmetaveld", "CSV-export van het herroepingslogboek", "Prioriteitsondersteuning"],
  pl: ["Wszystko z planu Basic", "Automatyczne tagowanie zamówień + metapole odstąpienia", "Eksport CSV rejestru odstąpień", "Priorytetowe wsparcie"],
  pt: ["Tudo o que está no Basic", "Etiquetagem automática de encomendas + metacampo de retratação", "Exportação CSV do registo de retratações", "Suporte prioritário"],
  sv: ["Allt i Basic", "Automatisk taggning av ordrar + ångermetafält", "CSV-export av ångerloggen", "Prioriterad support"],
  da: ["Alt i Basic", "Automatisk tagging af ordrer + fortrydelsesmetafelt", "CSV-eksport af fortrydelsesloggen", "Prioriteret support"],
};

export const PLAN_DETAILS: Record<PlanName, { price: number; currency: string; features: Features }> = {
  [PLAN_FREE]: { price: 0, currency: "USD", features: FREE_FEATURES },
  [PLAN_BASIC]: { price: 6.99, currency: "USD", features: BASIC_FEATURES },
  [PLAN_PRO]: { price: 12.99, currency: "USD", features: PRO_FEATURES },
};

export function planFeatures(plan: PlanName, locale: string): string[] {
  const f = PLAN_DETAILS[plan].features;
  return f[locale] ?? f.en;
}

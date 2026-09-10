/**
 * Official wording of the withdrawal function and the confirmation function,
 * Art. 11a(1) and (3) of Directive 2011/83/EU as inserted by Directive (EU) 2023/2673,
 * taken from the language versions published in the Official Journal (CELEX 32023L2673).
 *
 * The first letter is capitalised for button rendering; the words themselves are unchanged.
 * Where a national transposition prescribes its own wording it is used instead:
 *  - de: § 356a BGB uses the identical wording "Vertrag widerrufen" / "Widerruf bestätigen".
 *  - it: D.Lgs. 209/2025 prescribes "recedi dal contratto qui" / "Conferma recesso".
 * Merchants can override both labels per block, but the app warns against doing so.
 */
export type OfficialLabel = { withdraw: string; confirm: string };

export const OFFICIAL_LABELS: Record<string, OfficialLabel> = {
  bg: { withdraw: "Откажете се от договора тук", confirm: "Потвърждавам отказа" },
  cs: { withdraw: "Zde odstoupit od smlouvy", confirm: "Potvrdit odstoupení od smlouvy" },
  da: { withdraw: "Fortryd aftale", confirm: "Bekræft fortrydelse" },
  de: { withdraw: "Vertrag widerrufen", confirm: "Widerruf bestätigen" },
  el: { withdraw: "Πατήστε εδώ για υπαναχώρηση", confirm: "Επιβεβαίωση υπαναχώρησης" },
  en: { withdraw: "Withdraw from contract here", confirm: "Confirm withdrawal" },
  es: { withdraw: "Desistir del contrato aquí", confirm: "Confirmar desistimiento" },
  et: { withdraw: "Taganen lepingust", confirm: "Kinnitan taganemise" },
  fi: { withdraw: "Peruuta sopimus tästä", confirm: "Vahvista peruuttaminen" },
  fr: { withdraw: "Renoncer au contrat ici", confirm: "Confirmer la rétractation" },
  ga: { withdraw: "Tarraing siar ón gconradh anseo", confirm: "Dearbhaigh an tarraingt siar" },
  hr: { withdraw: "Odustati od ugovora", confirm: "Potvrditi odustajanje" },
  hu: { withdraw: "Elállás a szerződéstől", confirm: "Elállás megerősítése" },
  it: { withdraw: "Recedi dal contratto qui", confirm: "Conferma recesso" },
  lt: { withdraw: "Atsisakyti sutarties čia", confirm: "Patvirtinti sutarties atsisakymą" },
  lv: { withdraw: "Atteikties no līguma", confirm: "Apstiprināt atteikumu" },
  mt: { withdraw: "Irtira mill-kuntratt hawnhekk", confirm: "Ikkonferma r-reċess" },
  nl: { withdraw: "Hier de overeenkomst herroepen", confirm: "Herroeping bevestigen" },
  pl: { withdraw: "Odstąp od umowy tutaj", confirm: "Potwierdź odstąpienie od umowy" },
  pt: { withdraw: "Retrate-se do contrato aqui", confirm: "Confirmar retratação" },
  ro: { withdraw: "Retrageți-vă din contract aici", confirm: "Confirmați retragerea" },
  sk: { withdraw: "Odstúpiť od zmluvy tu", confirm: "Potvrdiť odstúpenie od zmluvy" },
  sl: { withdraw: "Kliknite tukaj za odstop od pogodbe", confirm: "Potrdi odstop od pogodbe" },
  sv: { withdraw: "Ångra avtalet här", confirm: "Bekräfta frånträde" },
};

export const EU_LANGUAGE_NAMES: Record<string, string> = {
  bg: "Български", cs: "Čeština", da: "Dansk", de: "Deutsch", el: "Ελληνικά", en: "English", es: "Español",
  et: "Eesti", fi: "Suomi", fr: "Français", ga: "Gaeilge", hr: "Hrvatski", hu: "Magyar", it: "Italiano",
  lt: "Lietuvių", lv: "Latviešu", mt: "Malti", nl: "Nederlands", pl: "Polski", pt: "Português", ro: "Română",
  sk: "Slovenčina", sl: "Slovenščina", sv: "Svenska",
};

/** Returns the official labels for a storefront locale such as "de-AT" or "pt-BR" (falls back to English). */
export function labelsFor(locale: string | null | undefined): OfficialLabel {
  const key = (locale || "en").toLowerCase().split(/[-_]/)[0];
  return OFFICIAL_LABELS[key] ?? OFFICIAL_LABELS.en;
}

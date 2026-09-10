/**
 * Consumer-facing e-mail texts (acknowledgement of receipt, Art. 11a(4) CRD / § 356a Abs. 4 BGB)
 * and merchant notifications. Keys are ISO 639-1 codes as used by Shopify storefront locales.
 */

export type AckStrings = {
  subject: string;
  heading: string;
  intro: string;
  receivedAt: string;
  receiptNo: string;
  contentTitle: string;
  name: string;
  contract: string;
  email: string;
  orderDate: string;
  details: string;
  shop: string;
  legal: string;
  next: string;
  keep: string;
  footer: string;
};

export type MerchantStrings = {
  subject: string;
  heading: string;
  intro: string;
  open: string;
  orderMatched: string;
  orderNotMatched: string;
  ackSent: string;
  ackFailed: string;
};

const ack: Record<string, AckStrings> = {
  de: {
    subject: "Eingangsbestätigung Ihres Widerrufs – {contract} – {shop}",
    heading: "Eingangsbestätigung Ihres Widerrufs",
    intro:
      "Hiermit bestätigen wir den Eingang Ihrer Widerrufserklärung, die Sie über die Widerrufsfunktion von {shop} abgegeben haben.",
    receivedAt: "Datum und Uhrzeit des Eingangs",
    receiptNo: "Vorgangsnummer",
    contentTitle: "Inhalt Ihrer Widerrufserklärung",
    name: "Name",
    contract: "Vertrag / Bestellung",
    email: "E-Mail-Adresse für diese Bestätigung",
    orderDate: "Bestell- bzw. Lieferdatum (Angabe des Verbrauchers)",
    details: "Weitere Angaben",
    shop: "Unternehmer",
    legal:
      "Sie haben Ihr Widerrufsrecht fristgerecht ausgeübt, wenn Sie diese Erklärung vor Ablauf der Widerrufsfrist abgesendet haben (Art. 11a Abs. 5 der Richtlinie 2011/83/EU, § 356a Abs. 5 BGB).",
    next: "Der Unternehmer meldet sich bei Ihnen wegen der Rücksendung der Ware und der Rückerstattung.",
    keep: "Bitte bewahren Sie diese E-Mail als Nachweis auf.",
    footer: "Diese Bestätigung wurde automatisch im Auftrag von {shop} erstellt.",
  },
  en: {
    subject: "Acknowledgement of receipt of your withdrawal – {contract} – {shop}",
    heading: "Acknowledgement of receipt of your withdrawal",
    intro:
      "We hereby confirm receipt of the withdrawal statement you submitted via the withdrawal function of {shop}.",
    receivedAt: "Date and time of receipt",
    receiptNo: "Reference number",
    contentTitle: "Content of your withdrawal statement",
    name: "Name",
    contract: "Contract / order",
    email: "E-mail address for this acknowledgement",
    orderDate: "Order or delivery date (as stated by you)",
    details: "Further details",
    shop: "Trader",
    legal:
      "You have exercised your right of withdrawal within the withdrawal period if you submitted this statement before that period expired (Art. 11a(5) of Directive 2011/83/EU).",
    next: "The trader will contact you regarding the return of the goods and the refund.",
    keep: "Please keep this e-mail as proof.",
    footer: "This acknowledgement was generated automatically on behalf of {shop}.",
  },
  fr: {
    subject: "Accusé de réception de votre rétractation – {contract} – {shop}",
    heading: "Accusé de réception de votre rétractation",
    intro:
      "Nous accusons réception de la déclaration de rétractation que vous avez soumise via la fonction de rétractation de {shop}.",
    receivedAt: "Date et heure de réception",
    receiptNo: "Numéro de référence",
    contentTitle: "Contenu de votre déclaration de rétractation",
    name: "Nom",
    contract: "Contrat / commande",
    email: "Adresse e-mail pour cet accusé de réception",
    orderDate: "Date de commande ou de livraison (indiquée par vous)",
    details: "Informations complémentaires",
    shop: "Professionnel",
    legal:
      "Vous avez exercé votre droit de rétractation dans le délai si vous avez soumis cette déclaration avant l'expiration de ce délai (article 11 bis, paragraphe 5, de la directive 2011/83/UE).",
    next: "Le professionnel vous contactera au sujet du retour des biens et du remboursement.",
    keep: "Veuillez conserver cet e-mail comme justificatif.",
    footer: "Cet accusé de réception a été généré automatiquement pour le compte de {shop}.",
  },
  es: {
    subject: "Acuse de recibo de su desistimiento – {contract} – {shop}",
    heading: "Acuse de recibo de su desistimiento",
    intro:
      "Confirmamos la recepción de la declaración de desistimiento que ha presentado a través de la función de desistimiento de {shop}.",
    receivedAt: "Fecha y hora de recepción",
    receiptNo: "Número de referencia",
    contentTitle: "Contenido de su declaración de desistimiento",
    name: "Nombre",
    contract: "Contrato / pedido",
    email: "Dirección de correo electrónico para este acuse de recibo",
    orderDate: "Fecha de pedido o de entrega (indicada por usted)",
    details: "Información adicional",
    shop: "Comerciante",
    legal:
      "Ha ejercido su derecho de desistimiento dentro del plazo si ha presentado esta declaración antes de que expirara dicho plazo (artículo 11 bis, apartado 5, de la Directiva 2011/83/UE).",
    next: "El comerciante se pondrá en contacto con usted en relación con la devolución de los bienes y el reembolso.",
    keep: "Conserve este correo electrónico como justificante.",
    footer: "Este acuse de recibo se ha generado automáticamente en nombre de {shop}.",
  },
  it: {
    subject: "Conferma di ricezione del suo recesso – {contract} – {shop}",
    heading: "Conferma di ricezione del suo recesso",
    intro:
      "Confermiamo la ricezione della dichiarazione di recesso che ha inviato tramite la funzione di recesso di {shop}.",
    receivedAt: "Data e ora di ricezione",
    receiptNo: "Numero di riferimento",
    contentTitle: "Contenuto della sua dichiarazione di recesso",
    name: "Nome",
    contract: "Contratto / ordine",
    email: "Indirizzo e-mail per questa conferma",
    orderDate: "Data dell'ordine o della consegna (indicata da lei)",
    details: "Ulteriori informazioni",
    shop: "Professionista",
    legal:
      "Ha esercitato il diritto di recesso entro il termine se ha inviato questa dichiarazione prima della scadenza del termine (articolo 11 bis, paragrafo 5, della direttiva 2011/83/UE).",
    next: "Il professionista la contatterà in merito alla restituzione dei beni e al rimborso.",
    keep: "Conservi questa e-mail come prova.",
    footer: "Questa conferma è stata generata automaticamente per conto di {shop}.",
  },
  nl: {
    subject: "Ontvangstbevestiging van uw herroeping – {contract} – {shop}",
    heading: "Ontvangstbevestiging van uw herroeping",
    intro:
      "Hierbij bevestigen wij de ontvangst van de herroepingsverklaring die u via de herroepingsfunctie van {shop} heeft ingediend.",
    receivedAt: "Datum en tijdstip van ontvangst",
    receiptNo: "Referentienummer",
    contentTitle: "Inhoud van uw herroepingsverklaring",
    name: "Naam",
    contract: "Overeenkomst / bestelling",
    email: "E-mailadres voor deze bevestiging",
    orderDate: "Bestel- of leverdatum (door u opgegeven)",
    details: "Aanvullende gegevens",
    shop: "Handelaar",
    legal:
      "U heeft uw herroepingsrecht tijdig uitgeoefend als u deze verklaring vóór het verstrijken van de herroepingstermijn heeft verzonden (artikel 11 bis, lid 5, van Richtlijn 2011/83/EU).",
    next: "De handelaar neemt contact met u op over het terugsturen van de goederen en de terugbetaling.",
    keep: "Bewaar deze e-mail als bewijs.",
    footer: "Deze bevestiging is automatisch gegenereerd namens {shop}.",
  },
  pl: {
    subject: "Potwierdzenie otrzymania odstąpienia od umowy – {contract} – {shop}",
    heading: "Potwierdzenie otrzymania oświadczenia o odstąpieniu od umowy",
    intro:
      "Potwierdzamy otrzymanie oświadczenia o odstąpieniu od umowy złożonego za pośrednictwem funkcji odstąpienia sklepu {shop}.",
    receivedAt: "Data i godzina otrzymania",
    receiptNo: "Numer referencyjny",
    contentTitle: "Treść oświadczenia o odstąpieniu od umowy",
    name: "Imię i nazwisko",
    contract: "Umowa / zamówienie",
    email: "Adres e-mail do niniejszego potwierdzenia",
    orderDate: "Data zamówienia lub dostawy (podana przez Państwa)",
    details: "Dodatkowe informacje",
    shop: "Przedsiębiorca",
    legal:
      "Prawo odstąpienia od umowy zostało wykonane w terminie, jeżeli oświadczenie zostało złożone przed upływem tego terminu (art. 11a ust. 5 dyrektywy 2011/83/UE).",
    next: "Przedsiębiorca skontaktuje się z Państwem w sprawie zwrotu towaru i zwrotu płatności.",
    keep: "Prosimy zachować tę wiadomość jako dowód.",
    footer: "Niniejsze potwierdzenie zostało wygenerowane automatycznie w imieniu {shop}.",
  },
  pt: {
    subject: "Aviso de receção da sua retratação – {contract} – {shop}",
    heading: "Aviso de receção da sua declaração de retratação",
    intro:
      "Confirmamos a receção da declaração de retratação que apresentou através da função de retratação de {shop}.",
    receivedAt: "Data e hora de receção",
    receiptNo: "Número de referência",
    contentTitle: "Conteúdo da sua declaração de retratação",
    name: "Nome",
    contract: "Contrato / encomenda",
    email: "Endereço de correio eletrónico para este aviso",
    orderDate: "Data da encomenda ou da entrega (indicada por si)",
    details: "Informações adicionais",
    shop: "Profissional",
    legal:
      "Exerceu o seu direito de retratação dentro do prazo se apresentou esta declaração antes do termo desse prazo (artigo 11.º-A, n.º 5, da Diretiva 2011/83/UE).",
    next: "O profissional entrará em contacto consigo sobre a devolução dos bens e o reembolso.",
    keep: "Guarde esta mensagem como comprovativo.",
    footer: "Este aviso foi gerado automaticamente em nome de {shop}.",
  },
  sv: {
    subject: "Mottagningsbekräftelse för ditt frånträde – {contract} – {shop}",
    heading: "Mottagningsbekräftelse för din ångerförklaring",
    intro:
      "Vi bekräftar härmed mottagandet av den ångerförklaring som du skickade via ångerfunktionen hos {shop}.",
    receivedAt: "Datum och tid för mottagandet",
    receiptNo: "Referensnummer",
    contentTitle: "Innehållet i din ångerförklaring",
    name: "Namn",
    contract: "Avtal / beställning",
    email: "E-postadress för denna bekräftelse",
    orderDate: "Beställnings- eller leveransdatum (enligt din uppgift)",
    details: "Övriga uppgifter",
    shop: "Näringsidkare",
    legal:
      "Du har utövat din ångerrätt inom ångerfristen om du skickade denna förklaring innan fristen löpte ut (artikel 11a.5 i direktiv 2011/83/EU).",
    next: "Näringsidkaren kontaktar dig angående återsändandet av varorna och återbetalningen.",
    keep: "Spara detta e-postmeddelande som bevis.",
    footer: "Denna bekräftelse har skapats automatiskt för {shop}.",
  },
  da: {
    subject: "Kvittering for modtagelse af din fortrydelse – {contract} – {shop}",
    heading: "Kvittering for modtagelse af din fortrydelseserklæring",
    intro:
      "Vi bekræfter hermed modtagelsen af den fortrydelseserklæring, som du har indsendt via fortrydelsesfunktionen hos {shop}.",
    receivedAt: "Dato og tidspunkt for modtagelsen",
    receiptNo: "Referencenummer",
    contentTitle: "Indholdet af din fortrydelseserklæring",
    name: "Navn",
    contract: "Aftale / ordre",
    email: "E-mailadresse til denne kvittering",
    orderDate: "Ordre- eller leveringsdato (oplyst af dig)",
    details: "Yderligere oplysninger",
    shop: "Erhvervsdrivende",
    legal:
      "Du har udøvet din fortrydelsesret inden for fristen, hvis du har indsendt denne erklæring, inden fristen udløb (artikel 11a, stk. 5, i direktiv 2011/83/EU).",
    next: "Den erhvervsdrivende kontakter dig vedrørende returnering af varerne og tilbagebetalingen.",
    keep: "Gem venligst denne e-mail som dokumentation.",
    footer: "Denne kvittering er genereret automatisk på vegne af {shop}.",
  },
};

const merchant: Record<string, MerchantStrings> = {
  de: {
    subject: "Neuer Widerruf: {contract} ({receiptNo})",
    heading: "Neue Widerrufserklärung eingegangen",
    intro: "Über die Widerrufsfunktion Ihres Shops {shop} ist eine neue Widerrufserklärung eingegangen.",
    open: "Im Shopify-Admin öffnen",
    orderMatched: "Bestellung gefunden und zugeordnet",
    orderNotMatched: "Keine passende Bestellung gefunden – bitte manuell prüfen",
    ackSent: "Eingangsbestätigung an den Kunden wurde versendet",
    ackFailed: "ACHTUNG: Die Eingangsbestätigung konnte nicht versendet werden. Bitte bestätigen Sie dem Kunden den Eingang manuell.",
  },
  en: {
    subject: "New withdrawal: {contract} ({receiptNo})",
    heading: "New withdrawal statement received",
    intro: "A new withdrawal statement was submitted via the withdrawal function of your shop {shop}.",
    open: "Open in Shopify admin",
    orderMatched: "Order found and linked",
    orderNotMatched: "No matching order found – please check manually",
    ackSent: "Acknowledgement of receipt was sent to the consumer",
    ackFailed: "WARNING: The acknowledgement of receipt could not be sent. Please confirm receipt to the consumer manually.",
  },
};

export const SUPPORTED_ACK_LOCALES = Object.keys(ack);

/** Maps a storefront locale like "de-DE", "pt-BR" or "en" to a supported key. */
export function pickLocale(requested: string | null | undefined, fallback = "en"): string {
  if (!requested) return fallback;
  const lower = requested.toLowerCase();
  if (ack[lower]) return lower;
  const base = lower.split(/[-_]/)[0];
  if (ack[base]) return base;
  return ack[fallback] ? fallback : "en";
}

export function ackStrings(locale: string): AckStrings {
  return ack[locale] ?? ack.en;
}

export function merchantStrings(locale: string | null | undefined): MerchantStrings {
  const key = (locale || "de").toLowerCase().split(/[-_]/)[0];
  return merchant[key] ?? merchant.de;
}

export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => (values[key] !== undefined ? values[key] : m));
}

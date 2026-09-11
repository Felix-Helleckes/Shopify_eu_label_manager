/**
 * Merchant-facing (admin) UI strings. English is the source of truth; every other
 * language falls back to English for missing keys. Locale detection: see resolveAdminLocale().
 */
import { MORE_ADMIN_STRINGS } from "./admin-i18n.more";

export const ADMIN_LOCALES = ["en", "de", "fr", "es", "it", "nl", "pl", "pt", "sv", "da"] as const;
export type AdminLocale = (typeof ADMIN_LOCALES)[number];

export const ADMIN_LOCALE_NAMES: Record<AdminLocale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  nl: "Nederlands",
  pl: "Polski",
  pt: "Português",
  sv: "Svenska",
  da: "Dansk",
};

/** BCP-47 tags for Intl formatting. */
export const ADMIN_LOCALE_TAGS: Record<AdminLocale, string> = {
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  it: "it-IT",
  nl: "nl-NL",
  pl: "pl-PL",
  pt: "pt-PT",
  sv: "sv-SE",
  da: "da-DK",
};

export const en = {
  // navigation
  "nav.overview": "Overview",
  "nav.withdrawals": "Withdrawals",
  "nav.guarantee": "Guarantee",
  "nav.settings": "Settings",
  "nav.billing": "Plan",

  // common
  "common.save": "Save",
  "common.saved": "Settings saved.",
  "common.status": "Status",
  "common.checkInput": "Please check your input.",
  "common.invalidEmail": "Invalid e-mail address",
  "common.invalidLanguage": "Invalid language",
  "common.noAddress": "– no address set –",
  "common.anonymized": "[anonymised]",

  // dashboard
  "dash.title": "EU Compliance Suite",
  "dash.mail.title": "E-mail sending not configured",
  "dash.mail.body":
    "Acknowledgements of receipt cannot be sent at the moment. Withdrawal statements are still stored. Please add the SMTP credentials to the server configuration (see README).",
  "dash.ackFailed.title": "Acknowledgements failed",
  "dash.ackFailed.body1": "The acknowledgement of receipt could not be delivered for {count} withdrawal(s). Please check these cases under",
  "dash.ackFailed.link": "Withdrawals",
  "dash.ackFailed.body2":
    "and confirm receipt manually if necessary (Art. 11a(4) of Directive 2011/83/EU requires an acknowledgement without undue delay).",
  "dash.withdrawals": "Withdrawals",
  "dash.last30": "in the last 30 days",
  "dash.open": "not yet processed",
  "dash.total": "in total",
  "dash.viewAll": "Show all withdrawals",
  "dash.setup": "Setup",
  "dash.step1.title": "Place the withdrawal button.",
  "dash.step1.body":
    "Enable the app embed “Withdrawal button (all pages)” in the theme editor. It shows the button “{label}” on every page, as required by Art. 11a(1) of the Consumer Rights Directive (permanently available, prominent, easily accessible).",
  "dash.step1.link": "Open theme editor",
  "dash.step1.alt": "Alternatively, add the “Withdrawal button” block to a page of your choice or to the footer.",
  "dash.step2.title": "Update your withdrawal information.",
  "dash.step2.body":
    "Add a sentence to your withdrawal information, for example: “You can also withdraw from the contract via the withdrawal function in our online shop. The button ‘{label}’ is available on every page of our shop.” (Art. 6(1)(h) of the Consumer Rights Directive).",
  "dash.step3.title": "Check the e-mail address.",
  "dash.step3.body": "Notifications about new withdrawals are sent to",
  "dash.step3.link": "Settings",
  "dash.step4.title": "Legal guarantee notice and GARAN label",
  "dash.step4.body": "(mandatory from 27 September 2026, {days}).",
  "dash.daysLeft": "{n} days left",
  "dash.inForce": "already in force",
  "dash.step4.link": "Set up blocks",
  "dash.proOnly": "– included in the Pro plan.",
  "dash.legal": "Legal basis",
  "dash.legal1":
    "Withdrawal function: Art. 11a of Directive 2011/83/EU (inserted by Directive (EU) 2023/2673), in Germany § 356a BGB – applies since 19 June 2026",
  "dash.legal2":
    "Legal guarantee notice and durability label: Directive (EU) 2024/825, Implementing Regulation (EU) 2025/1960 – from 27 September 2026",
  "dash.legal3": "Right to repair: Directive (EU) 2024/1799 – for sales contracts from 31 July 2026",
  "dash.plan": "Plan",
  "dash.currentPlan": "Current plan:",
  "dash.managePlan": "Manage plan",
  "dash.trial": "Trial",

  // withdrawals list
  "wd.title": "Withdrawals",
  "wd.export": "Export CSV",
  "wd.file": "withdrawals",
  "wd.search": "Search",
  "wd.searchPlaceholder": "Name, e-mail, order number, reference number",
  "wd.all": "All",
  "wd.ackFailedOption": "Acknowledgement failed",
  "wd.filter": "Filter",
  "wd.empty": "No withdrawal statements received yet.",
  "wd.colReceived": "Received",
  "wd.colRef": "Reference",
  "wd.colCustomer": "Customer",
  "wd.colContract": "Contract / order",
  "wd.colAck": "Acknowledgement",
  "wd.notMatched": "not matched",
  "wd.sent": "sent",
  "wd.failed": "failed",

  // status
  "status.received": "Received",
  "status.processing": "In progress",
  "status.refunded": "Refunded",
  "status.rejected": "Rejected / invalid",

  // withdrawal detail
  "det.title": "Withdrawal {ref}",
  "det.anonymized.title": "Anonymised",
  "det.anonymized.body": "The personal data was anonymised at the customer’s request on {date}.",
  "det.content": "Content of the withdrawal statement",
  "det.received": "Received",
  "det.receiptNo": "Reference number",
  "det.name": "Name",
  "det.contract": "Contract / order (as stated by the customer)",
  "det.email": "E-mail address",
  "det.orderDate": "Order/delivery date (as stated by the customer)",
  "det.details": "Further details",
  "det.language": "Language of the acknowledgement",
  "det.hash": "Checksum (SHA-256)",
  "det.matching": "Matching and delivery",
  "det.order": "Order:",
  "det.openInAdmin": "open in Shopify admin",
  "det.tagged": "– tagged",
  "det.noOrder": "no matching order found – please check manually",
  "det.ackToCustomer": "Acknowledgement to the customer:",
  "det.sentAt": "sent {date}",
  "det.notDelivered": "not delivered",
  "det.merchantNotification": "Merchant notification:",
  "det.notSent": "not sent",
  "det.resend": "Resend acknowledgement",
  "det.processing": "Processing",
  "det.note": "Internal note",
  "det.resent": "The acknowledgement of receipt was sent again.",
  "det.resendFailed": "Sending failed – please check the SMTP configuration.",
  "det.invalidStatus": "Invalid status.",
  "det.saved": "Saved.",

  // settings
  "set.title": "Settings",
  "set.smtp.title": "SMTP not configured",
  "set.smtp.body": "E-mail sending is not set up on the server; acknowledgements will not be delivered.",
  "set.language": "App language",
  "set.languageField": "Language of this app",
  "set.languageAuto": "Automatic (language of your Shopify admin)",
  "set.notifications": "Notifications",
  "set.notify": "Notify me by e-mail about every new withdrawal",
  "set.recipient": "Recipient address for notifications",
  "set.recipientDetails": "Leave empty to use the shop address{suffix}.",
  "set.replyTo": "Reply-to address in acknowledgements",
  "set.replyToDetails": "If the customer replies to the acknowledgement, the reply goes to this address.",
  "set.ack": "Acknowledgement to the customer",
  "set.ackLanguage": "Language of the acknowledgement",
  "set.ackAuto": "Automatic (language of the storefront in which the customer submitted the withdrawal)",
  "set.always": "Always {language}",
  "set.extraText": "Additional text at the end of the acknowledgement (optional)",
  "set.extraDetails":
    "For example return instructions. The mandatory content (statement, date and time of receipt) is always inserted automatically.",
  "set.orders": "Orders in Shopify",
  "set.tagOrders": "Automatically tag the matched order and store the withdrawal data as a metafield",
  "set.tag": "Tag",

  // guarantee
  "gu.title": "Legal guarantee, commercial guarantee and repair",
  "gu.pro.title": "Pro plan required",
  "gu.pro.body": "The theme blocks for the legal guarantee notice, the GARAN label and the repair notice are included in the Pro plan.",
  "gu.pro.link": "Change plan",
  "gu.s1.title": "1. Harmonised notice on the legal guarantee",
  "gu.s1.body":
    "From 27 September 2026 traders must remind consumers of the legal guarantee of conformity before the contract is concluded, using the official “harmonised notice” (Art. 6(1)(l) of Directive 2011/83/EU as amended by Directive (EU) 2024/825; design per Implementing Regulation (EU) 2025/1960). The block shows the unaltered official artwork in the storefront language – online it must be in colour.",
  "gu.s1.placement": "Recommended placement: on every product page below the buy button, or as an expandable section in the cart.",
  "gu.s1.link": "Add the “Legal guarantee notice” block in the theme editor",
  "gu.s2.title": "2. GARAN label for durability guarantees",
  "gu.s2.body":
    "If the producer offers, free of charge, a commercial guarantee of durability of more than two years covering the entire product, the trader must indicate this with the official GARAN label (Art. 6(1)(la) of Directive 2011/83/EU). The block reads duration, producer and model identifier from product metafields and shows the label only if the duration exceeds two years.",
  "gu.created": "created",
  "gu.missing": "missing",
  "gu.createDefs": "Create metafield definitions",
  "gu.s2.link": "Add the “GARAN label” block in the theme editor",
  "gu.s2.after": "After creation the fields appear in the Shopify admin on every product page under “Metafields”.",
  "gu.s3.title": "3. Notice on the right to repair",
  "gu.s3.body":
    "For sales contracts concluded from 31 July 2026 the seller must inform the consumer about the choice between repair and replacement and about the twelve-month extension of the guarantee period in case of repair (Art. 13(2a) of Directive (EU) 2019/771 as amended by Directive (EU) 2024/1799). The optional block shows this notice on product pages.",
  "gu.repairEnable": "Enable the repair notice block",
  "gu.repairText": "Text of the notice",
  "gu.noticeEnabled": "Legal guarantee notice block active",
  "gu.labelEnabled": "GARAN label block active",
  "gu.s3.link": "Add the “Repair notice” block in the theme editor",
  "gu.defaultRepairText":
    "Notice on the right to repair: In case of a lack of conformity within the legal guarantee period you may choose between repair and replacement. If you choose repair, the guarantee period is extended once by twelve months (Directive (EU) 2024/1799, applies to sales contracts concluded from 31 July 2026).",
  "gu.errCreate": "Error while creating: {errors}",
  "gu.createdDefs": "Metafield definitions created: {list}",
  "gu.allExist": "All metafield definitions already exist.",
  "gu.error": "Error: {message}",

  // billing
  "bil.title": "Plan",
  "bil.test": "Test mode: no real charges are made.",
  "bil.intro": "All plans start with a {days}-day free trial and can be cancelled monthly via Shopify Billing.",
  "bil.perMonth": "/ month",
  "bil.current": "Current plan",
  "bil.switchTo": "Switch to {plan}",
  "bil.start": "Start {plan}",
  "bil.unknown": "Unknown plan",
  "dash.free.title": "Withdrawal function not active",
  "dash.free.body": "You are on the free Label plan: the legal-guarantee notice and the GARAN label work. The withdrawal button and the acknowledgements of receipt require the Basic or Pro plan (14-day free trial).",
  "dash.free.link": "Choose a plan",
  "wd.exportPro": "CSV export (Pro)",
  "bil.free": "free",
  "bil.switchFree": "Switch to the free Label plan",
  "bil.cancelNote": "Switching to Label cancels the paid subscription; the withdrawal button is then hidden in your shop.",
  "bil.upgradeWithdrawal": "The withdrawal function requires the Basic or Pro plan. Both start with a 14-day free trial.",
  "bil.upgradeExport": "CSV export is included in the Pro plan.",
} as const;

export type AdminKey = keyof typeof en;
export type AdminStrings = Partial<Record<AdminKey, string>>;

export const de: AdminStrings = {
  "nav.overview": "Übersicht",
  "nav.withdrawals": "Widerrufe",
  "nav.guarantee": "Gewährleistung",
  "nav.settings": "Einstellungen",
  "nav.billing": "Tarif",

  "common.save": "Speichern",
  "common.saved": "Einstellungen gespeichert.",
  "common.status": "Status",
  "common.checkInput": "Bitte Eingaben prüfen.",
  "common.invalidEmail": "Ungültige E-Mail-Adresse",
  "common.invalidLanguage": "Ungültige Sprache",
  "common.noAddress": "– keine Adresse hinterlegt –",
  "common.anonymized": "[anonymisiert]",

  "dash.title": "EU Compliance Suite",
  "dash.mail.title": "E-Mail-Versand nicht konfiguriert",
  "dash.mail.body":
    "Eingangsbestätigungen können derzeit nicht versendet werden. Die Widerrufserklärungen werden trotzdem gespeichert. Bitte hinterlegen Sie die SMTP-Zugangsdaten in der Server-Konfiguration (siehe README).",
  "dash.ackFailed.title": "Eingangsbestätigungen fehlgeschlagen",
  "dash.ackFailed.body1": "Bei {count} Widerruf(en) konnte die Eingangsbestätigung nicht zugestellt werden. Bitte prüfen Sie diese Fälle unter",
  "dash.ackFailed.link": "Widerrufe",
  "dash.ackFailed.body2":
    "und bestätigen Sie den Eingang notfalls manuell (§ 356a Abs. 4 BGB verlangt eine unverzügliche Bestätigung).",
  "dash.withdrawals": "Widerrufe",
  "dash.last30": "in den letzten 30 Tagen",
  "dash.open": "noch unbearbeitet",
  "dash.total": "insgesamt",
  "dash.viewAll": "Alle Widerrufe anzeigen",
  "dash.setup": "Einrichtung",
  "dash.step1.title": "Widerrufsbutton platzieren.",
  "dash.step1.body":
    "Aktivieren Sie die App-Einbettung „Widerrufsbutton (alle Seiten)“ im Theme-Editor. Sie zeigt auf jeder Seite den Button „{label}“ an, wie es Art. 11a Abs. 1 VRRL / § 356a Abs. 1 BGB verlangt (ständig verfügbar, hervorgehoben, leicht zugänglich).",
  "dash.step1.link": "Theme-Editor öffnen",
  "dash.step1.alt": "Alternativ fügen Sie den Block „Widerrufsbutton“ auf einer eigenen Seite oder im Footer ein.",
  "dash.step2.title": "Widerrufsbelehrung ergänzen.",
  "dash.step2.body":
    "Fügen Sie Ihrer Widerrufsbelehrung einen Satz hinzu, z. B.: „Sie können den Vertrag auch über die Widerrufsfunktion in unserem Onlineshop widerrufen. Der Button ‚{label}‘ ist auf jeder Seite unseres Shops erreichbar.“ (Art. 6 Abs. 1 lit. h VRRL).",
  "dash.step3.title": "E-Mail-Adresse prüfen.",
  "dash.step3.body": "Benachrichtigungen über neue Widerrufe gehen an",
  "dash.step3.link": "Einstellungen",
  "dash.step4.title": "Gewährleistungshinweis und GARAN-Kennzeichnung",
  "dash.step4.body": "(Pflicht ab 27.09.2026, {days}).",
  "dash.daysLeft": "noch {n} Tage",
  "dash.inForce": "bereits in Kraft",
  "dash.step4.link": "Blöcke einrichten",
  "dash.proOnly": "– im Pro-Tarif enthalten.",
  "dash.legal": "Rechtsgrundlagen",
  "dash.legal1":
    "Widerrufsfunktion: Art. 11a Richtlinie 2011/83/EU (eingefügt durch RL (EU) 2023/2673), § 356a BGB – gilt seit 19.06.2026",
  "dash.legal2":
    "Gewährleistungshinweis und Haltbarkeits-Kennzeichnung: RL (EU) 2024/825, Durchführungs-VO (EU) 2025/1960 – ab 27.09.2026",
  "dash.legal3": "Recht auf Reparatur: RL (EU) 2024/1799 – für Kaufverträge ab 31.07.2026",
  "dash.plan": "Tarif",
  "dash.currentPlan": "Aktueller Tarif:",
  "dash.managePlan": "Tarif verwalten",
  "dash.trial": "Test",

  "wd.title": "Widerrufe",
  "wd.export": "CSV exportieren",
  "wd.file": "widerrufe",
  "wd.search": "Suche",
  "wd.searchPlaceholder": "Name, E-Mail, Bestellnummer, Vorgangsnummer",
  "wd.all": "Alle",
  "wd.ackFailedOption": "Bestätigung fehlgeschlagen",
  "wd.filter": "Filtern",
  "wd.empty": "Noch keine Widerrufserklärungen eingegangen.",
  "wd.colReceived": "Eingang",
  "wd.colRef": "Vorgang",
  "wd.colCustomer": "Kunde",
  "wd.colContract": "Vertrag / Bestellung",
  "wd.colAck": "Bestätigung",
  "wd.notMatched": "nicht zugeordnet",
  "wd.sent": "gesendet",
  "wd.failed": "fehlgeschlagen",

  "status.received": "Eingegangen",
  "status.processing": "In Bearbeitung",
  "status.refunded": "Erstattet",
  "status.rejected": "Abgelehnt / ungültig",

  "det.title": "Widerruf {ref}",
  "det.anonymized.title": "Anonymisiert",
  "det.anonymized.body": "Die personenbezogenen Daten wurden auf Kundenwunsch am {date} anonymisiert.",
  "det.content": "Inhalt der Widerrufserklärung",
  "det.received": "Eingang",
  "det.receiptNo": "Vorgangsnummer",
  "det.name": "Name",
  "det.contract": "Vertrag / Bestellung (Angabe des Kunden)",
  "det.email": "E-Mail-Adresse",
  "det.orderDate": "Bestell-/Lieferdatum (Angabe des Kunden)",
  "det.details": "Weitere Angaben",
  "det.language": "Sprache der Bestätigung",
  "det.hash": "Prüfsumme (SHA-256)",
  "det.matching": "Zuordnung und Zustellung",
  "det.order": "Bestellung:",
  "det.openInAdmin": "im Shopify-Admin öffnen",
  "det.tagged": "– getaggt",
  "det.noOrder": "keine passende Bestellung gefunden – bitte manuell prüfen",
  "det.ackToCustomer": "Eingangsbestätigung an den Kunden:",
  "det.sentAt": "gesendet {date}",
  "det.notDelivered": "nicht zugestellt",
  "det.merchantNotification": "Händlerbenachrichtigung:",
  "det.notSent": "nicht gesendet",
  "det.resend": "Eingangsbestätigung erneut senden",
  "det.processing": "Bearbeitung",
  "det.note": "Interne Notiz",
  "det.resent": "Eingangsbestätigung wurde erneut versendet.",
  "det.resendFailed": "Versand fehlgeschlagen – bitte SMTP-Konfiguration prüfen.",
  "det.invalidStatus": "Ungültiger Status.",
  "det.saved": "Gespeichert.",

  "set.title": "Einstellungen",
  "set.smtp.title": "SMTP nicht konfiguriert",
  "set.smtp.body": "Der E-Mail-Versand ist serverseitig nicht eingerichtet; Eingangsbestätigungen werden nicht zugestellt.",
  "set.language": "App-Sprache",
  "set.languageField": "Sprache dieser App",
  "set.languageAuto": "Automatisch (Sprache Ihres Shopify-Admins)",
  "set.notifications": "Benachrichtigungen",
  "set.notify": "Bei jedem neuen Widerruf per E-Mail benachrichtigen",
  "set.recipient": "Empfänger-Adresse für Benachrichtigungen",
  "set.recipientDetails": "Leer lassen, um die Shop-Adresse zu verwenden{suffix}.",
  "set.replyTo": "Antwort-Adresse (Reply-To) in Eingangsbestätigungen",
  "set.replyToDetails": "Antwortet der Kunde auf die Eingangsbestätigung, geht die Antwort an diese Adresse.",
  "set.ack": "Eingangsbestätigung an den Kunden",
  "set.ackLanguage": "Sprache der Eingangsbestätigung",
  "set.ackAuto": "Automatisch (Sprache des Shops, in der der Kunde den Widerruf abgegeben hat)",
  "set.always": "Immer {language}",
  "set.extraText": "Zusätzlicher Text am Ende der Eingangsbestätigung (optional)",
  "set.extraDetails":
    "Zum Beispiel Hinweise zur Rücksendung. Der gesetzliche Pflichtinhalt (Inhalt der Erklärung, Datum und Uhrzeit) wird immer automatisch eingefügt.",
  "set.orders": "Bestellungen in Shopify",
  "set.tagOrders": "Zugeordnete Bestellung automatisch taggen und Widerrufsdaten als Metafeld speichern",
  "set.tag": "Tag",

  "gu.title": "Gewährleistung, Garantie und Reparatur",
  "gu.pro.title": "Pro-Tarif erforderlich",
  "gu.pro.body": "Die Theme-Blöcke für Gewährleistungshinweis, GARAN-Kennzeichnung und Reparaturhinweis sind im Pro-Tarif enthalten.",
  "gu.pro.link": "Tarif wechseln",
  "gu.s1.title": "1. Harmonisierter Hinweis zur gesetzlichen Gewährleistung",
  "gu.s1.body":
    "Ab dem 27. September 2026 müssen Händler Verbraucher vor Vertragsschluss mit der amtlichen „harmonisierten Mitteilung“ an die gesetzliche Gewährleistung erinnern (Art. 6 Abs. 1 lit. l Richtlinie 2011/83/EU in der Fassung der Richtlinie (EU) 2024/825; Gestaltung nach Durchführungsverordnung (EU) 2025/1960). Der Block zeigt die unveränderte amtliche Grafik in der Sprache des Shops – online zwingend in Farbe.",
  "gu.s1.placement": "Empfohlene Platzierung: auf jeder Produktseite unterhalb des Kaufbuttons oder als aufklappbarer Bereich im Warenkorb.",
  "gu.s1.link": "Block „Gewährleistungshinweis“ im Theme-Editor hinzufügen",
  "gu.s2.title": "2. GARAN-Kennzeichnung für Haltbarkeitsgarantien",
  "gu.s2.body":
    "Bietet der Hersteller kostenlos eine gewerbliche Haltbarkeitsgarantie von mehr als zwei Jahren für die gesamte Ware an, muss der Händler dies mit der amtlichen GARAN-Kennzeichnung angeben (Art. 6 Abs. 1 lit. la Richtlinie 2011/83/EU). Der Block liest Dauer, Hersteller und Modellkennung aus Produkt-Metafeldern und zeigt die Kennzeichnung nur an, wenn die Dauer über zwei Jahren liegt.",
  "gu.created": "angelegt",
  "gu.missing": "fehlt",
  "gu.createDefs": "Metafeld-Definitionen anlegen",
  "gu.s2.link": "Block „GARAN-Kennzeichnung“ im Theme-Editor hinzufügen",
  "gu.s2.after": "Nach dem Anlegen erscheinen die Felder im Shopify-Admin auf jeder Produktseite unter „Metafelder“.",
  "gu.s3.title": "3. Hinweis zum Recht auf Reparatur",
  "gu.s3.body":
    "Für Kaufverträge ab dem 31. Juli 2026 muss der Verkäufer den Verbraucher über die Wahl zwischen Reparatur und Ersatz sowie die Verlängerung der Gewährleistungsfrist um zwölf Monate bei Reparatur informieren (Art. 13 Abs. 2a Richtlinie (EU) 2019/771 i. d. F. der Richtlinie (EU) 2024/1799). Der optionale Block zeigt diesen Hinweis auf Produktseiten an.",
  "gu.repairEnable": "Reparaturhinweis-Block aktivieren",
  "gu.repairText": "Text des Hinweises",
  "gu.noticeEnabled": "Gewährleistungshinweis-Block aktiv",
  "gu.labelEnabled": "GARAN-Kennzeichnungs-Block aktiv",
  "gu.s3.link": "Block „Reparaturhinweis“ im Theme-Editor hinzufügen",
  "gu.defaultRepairText":
    "Hinweis zum Recht auf Reparatur: Bei einem Mangel innerhalb der gesetzlichen Gewährleistung können Sie zwischen Nachbesserung (Reparatur) und Ersatzlieferung wählen. Entscheiden Sie sich für die Reparatur, verlängert sich die Gewährleistungsfrist einmalig um zwölf Monate (Richtlinie (EU) 2024/1799, gilt für Kaufverträge ab dem 31. Juli 2026).",
  "gu.errCreate": "Fehler beim Anlegen: {errors}",
  "gu.createdDefs": "Metafeld-Definitionen angelegt: {list}",
  "gu.allExist": "Alle Metafeld-Definitionen sind bereits vorhanden.",
  "gu.error": "Fehler: {message}",

  "bil.title": "Tarif",
  "bil.test": "Testmodus: Es werden keine echten Gebühren berechnet.",
  "bil.intro": "Alle Tarife beginnen mit {days} Tagen kostenloser Testphase und sind monatlich über Shopify Billing kündbar.",
  "bil.perMonth": "/ Monat",
  "bil.current": "Aktueller Tarif",
  "bil.switchTo": "Zu {plan} wechseln",
  "bil.start": "{plan} starten",
  "bil.unknown": "Unbekannter Tarif",
  "dash.free.title": "Widerrufsfunktion nicht aktiv",
  "dash.free.body": "Sie nutzen den kostenlosen Label-Tarif: Gewährleistungshinweis und GARAN-Kennzeichnung funktionieren. Widerrufsbutton und Eingangsbestätigungen erfordern den Basic- oder Pro-Tarif (14 Tage kostenlos testen).",
  "dash.free.link": "Tarif wählen",
  "wd.exportPro": "CSV-Export (Pro)",
  "bil.free": "kostenlos",
  "bil.switchFree": "Zum kostenlosen Label-Tarif wechseln",
  "bil.cancelNote": "Der Wechsel zu Label beendet das kostenpflichtige Abo; der Widerrufsbutton wird dann im Shop ausgeblendet.",
  "bil.upgradeWithdrawal": "Die Widerrufsfunktion erfordert den Basic- oder Pro-Tarif. Beide beginnen mit 14 Tagen kostenloser Testphase.",
  "bil.upgradeExport": "Der CSV-Export ist im Pro-Tarif enthalten.",
};

const DICTS: Record<AdminLocale, AdminStrings> = { en, de, ...MORE_ADMIN_STRINGS };

export type Translator = (key: AdminKey, vars?: Record<string, string | number>) => string;

export function translator(locale: AdminLocale): Translator {
  const dict = DICTS[locale] ?? en;
  return (key, vars) => {
    let s: string = dict[key] ?? en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
    return s;
  };
}

export function isAdminLocale(value: string | null | undefined): value is AdminLocale {
  return !!value && (ADMIN_LOCALES as readonly string[]).includes(value);
}

/** "de-DE" → "de"; unknown → null */
export function normalizeAdminLocale(value: string | null | undefined): AdminLocale | null {
  if (!value) return null;
  const lang = value.toLowerCase().split(/[-_]/)[0];
  return isAdminLocale(lang) ? lang : null;
}

export function statusLabels(t: Translator): Record<string, string> {
  return {
    received: t("status.received"),
    processing: t("status.processing"),
    refunded: t("status.refunded"),
    rejected: t("status.rejected"),
  };
}

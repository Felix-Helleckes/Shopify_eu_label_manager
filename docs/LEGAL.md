# Rechtliche Anforderungen und ihre Umsetzung

Quellen wurden direkt aus dem Amtsblatt der EU (Cellar-API der Publikationsstelle) und gesetze-im-internet.de
gezogen; die Fundstellen stehen bei jedem Punkt.

## A. Widerrufsfunktion (Art. 11a RL 2011/83/EU, eingefügt durch RL (EU) 2023/2673 – CELEX 32023L2673; § 356a BGB)

| Anforderung | Umsetzung |
| --- | --- |
| Beschriftung „Vertrag widerrufen“ / „withdraw from contract here“ oder entsprechend eindeutig, gut lesbar (Abs. 1) | Amtliche Beschriftung je Shop-Sprache aus `locales/*.json` (24 Sprachen, aus dem Amtsblatt übernommen; IT nach D.Lgs. 209/2025 „Recedi dal contratto qui“). Händler kann überschreiben, wird gewarnt. |
| Während der gesamten Widerrufsfrist durchgehend verfügbar, hervorgehoben, leicht zugänglich (Abs. 1) | App-Einbettung `withdrawal-embed` zeigt den Button fest positioniert auf allen Storefront-Seiten; zusätzlich App-Block für Seiten/Footer. |
| Erklärung mit Name, Vertragsidentifikation, elektronischem Kommunikationsmittel für die Bestätigung (Abs. 2) | Pflichtfelder Name, Bestellnummer/Vertrag, E-Mail; optional Datum und Details. Bei eingeloggten Kunden vorausgefüllt. |
| Übermittlung über eine Bestätigungsfunktion, die **ausschließlich** mit „Widerruf bestätigen“ beschriftet ist (Abs. 3) | Zweiter Schritt „Widerrufserklärung prüfen“ mit Zusammenfassung; der Bestätigungs-Button trägt nur die amtlichen Worte. |
| Eingangsbestätigung unverzüglich auf dauerhaftem Datenträger mit Inhalt der Erklärung sowie Datum und Uhrzeit des Eingangs (Abs. 4) | Sofortige E-Mail (HTML + Text) mit allen Angaben, Zeitstempel in Shop-Zeitzone **und** ISO/UTC, Vorgangsnummer; zusätzlich Anzeige im Dialog mit Druckfunktion. Versandstatus wird protokolliert; Fehlschläge werden im Dashboard rot markiert und können erneut gesendet werden. |
| Fristwahrung durch Absenden vor Fristablauf (Abs. 5) | Server-Zeitstempel bei Eingang, SHA-256-Prüfsumme über Inhalt + Zeitstempel, unveränderliche Speicherung. Die Erklärung wird **immer** angenommen, auch wenn keine Bestellung gefunden wird (Zuordnung ist nur Komfort). |
| Informationspflicht über Bestehen und Platzierung der Widerrufsfunktion (Art. 6 Abs. 1 lit. h) | Dashboard liefert einen Formulierungsvorschlag für die Widerrufsbelehrung. |
| Beweislast beim Unternehmer (§ 312m BGB) | Protokoll mit Prüfsumme, gehashter IP, User-Agent, CSV-Export. |

## B. Harmonisierte Mitteilung und Kennzeichnung (RL (EU) 2024/825 – CELEX 32024L0825; DVO (EU) 2025/1960 – CELEX 32025R1960)

| Anforderung | Umsetzung |
| --- | --- |
| Erinnerung an die gesetzliche Gewährleistung „in hervorgehobener Weise“ mit der harmonisierten Mitteilung; kein Element editierbar; online in Farbe (RGB); QR-Code auf „Ihr Europa“ (Anhang I) | Block `legal-guarantee-notice` zeigt die amtliche Grafik unverändert (aus dem Amtsblatt extrahiert, 24 Sprachfassungen, automatisch nach Shop-Sprache) als Farbbild, verlinkt auf europa.eu/youreurope/guarantees. Standard: immer sichtbar; aufklappbar nur mit Warnhinweis. |
| Kennzeichnung für gewerbliche Haltbarkeitsgarantien > 2 Jahre ohne Aufpreis, gesamte Ware; Titel „GARAN“, Häkchen, Kalender, Hinweis auf gesetzliche Gewährleistung, QR-Code, Übersetzungszeile nicht editierbar; „XX“, „Brand/Trademark“, „Model identifier“ editierbar; Schrift Inter; online in Farbe; geschachtelte Anzeige zulässig, vollständige Kennzeichnung beim ersten Klick/Rollover/Touch (Anhang II) | Block `durability-label` legt die editierbaren Felder in Inter über die amtliche Grafik; Daten aus Produkt-Metafeldern `eu_compliance.guarantee_years/guarantee_producer/guarantee_model`; Anzeige nur bei > 2 Jahren; Modus „nested“ zeigt die amtliche Leiste und öffnet die vollständige Kennzeichnung bei Klick, Hover und Touch. |
| Anwendung ab 27.09.2026 (Art. 4 RL 2024/825, Art. 3 DVO 2025/1960) | Dashboard zeigt Countdown; Blöcke können vorab platziert werden. |

Offener Punkt: Die deutsche Umsetzung der RL 2024/825 (Änderung EGBGB Art. 246/246a) wird bis 27.03.2026
erwartet; Wortlaut und mögliche Zusatzanforderungen sind zu prüfen, sobald veröffentlicht.

## C. Recht auf Reparatur (RL (EU) 2024/1799 – CELEX 32024L1799)

Art. 16 ändert die RL (EU) 2019/771: Art. 10 Abs. 2a (Verlängerung der Haftungsfrist um 12 Monate nach
Reparatur) und Art. 13 Abs. 2a (Verkäufer informiert vor Abhilfe über die Wahl zwischen Reparatur und Ersatz und
die Verlängerung). Gilt für Kaufverträge ab 31.07.2026. Die Informationspflicht greift im Gewährleistungsfall;
der Block `repair-info` ist eine freiwillige Vorab-Information mit editierbarem Text.

## D. Datenschutz

- Rollen: Händler = Verantwortlicher, App-Betreiber = Auftragsverarbeiter (Datenschutzerklärung `/privacy`).
- Datensparsamkeit: keine Cookies, IP nur als HMAC-Hash, Löschung 48 h nach Deinstallation (`shop/redact`),
  Anonymisierung bei `customers/redact` unter Erhalt der Beweisdaten (Vorgangsnummer, Zeitstempel, Prüfsumme).
- Hosting in Frankfurt (Fly.io Region `fra`).

## E. Amtliche Beschriftungen (Art. 11a Abs. 1 und 3, Sprachfassungen des Amtsblatts)

| Sprache | Widerrufsfunktion | Bestätigungsfunktion |
| --- | --- | --- |
| bg | Откажете се от договора тук | Потвърждавам отказа |
| cs | Zde odstoupit od smlouvy | Potvrdit odstoupení od smlouvy |
| da | Fortryd aftale | Bekræft fortrydelse |
| de | Vertrag widerrufen | Widerruf bestätigen |
| el | Πατήστε εδώ για υπαναχώρηση | Επιβεβαίωση υπαναχώρησης |
| en | Withdraw from contract here | Confirm withdrawal |
| es | Desistir del contrato aquí | Confirmar desistimiento |
| et | Taganen lepingust | Kinnitan taganemise |
| fi | Peruuta sopimus tästä | Vahvista peruuttaminen |
| fr | Renoncer au contrat ici | Confirmer la rétractation |
| ga | Tarraing siar ón gconradh anseo | Dearbhaigh an tarraingt siar |
| hr | Odustati od ugovora | Potvrditi odustajanje |
| hu | Elállás a szerződéstől | Elállás megerősítése |
| it | Recedi dal contratto qui (D.Lgs. 209/2025; RL: „recedere dal contratto qui“) | Conferma recesso |
| lt | Atsisakyti sutarties čia | Patvirtinti sutarties atsisakymą |
| lv | Atteikties no līguma | Apstiprināt atteikumu |
| mt | Irtira mill-kuntratt hawnhekk | Ikkonferma r-reċess |
| nl | Hier de overeenkomst herroepen | Herroeping bevestigen |
| pl | Odstąp od umowy tutaj | Potwierdź odstąpienie od umowy |
| pt | Retrate-se do contrato aqui | Confirmar retratação |
| ro | Retrageți-vă din contract aici | Confirmați retragerea |
| sk | Odstúpiť od zmluvy tu | Potvrdiť odstúpenie od zmluvy |
| sl | Kliknite tukaj za odstop od pogodbe | Potrdi odstop od pogodbe |
| sv | Ångra avtalet här | Bekräfta frånträde |

Der erste Buchstabe wurde für die Button-Darstellung großgeschrieben; die Worte sind unverändert.

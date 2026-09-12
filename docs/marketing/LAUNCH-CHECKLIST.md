# Launch-Checkliste für Felix (Stand 11.09.2026)

Alles, was nur mit deinen Accounts geht. Reihenfolge = Priorität. Texte liegen fertig in `posts.md`,
`outreach.md`, `artikel-de.md`, `article-en.md`; Ziele in `targets.md`.

## A. Sofort (5 Minuten)

1. **Einreichung abschicken**, sobald die „Eingebetteten App-Checks“ grün sind (Shopify prüft alle 2 Stunden):
   https://partners.shopify.com/1971036/apps/391922778113/distribution/app-store → „Zur Prüfung einreichen“.
   Alles andere ist ausgefüllt und gespeichert. Falls der Button nach 2–4 Stunden noch grau ist: App im Dev-Store
   einmal öffnen (erzeugt Sitzungsdaten) und erneut warten.
2. **Absender-Domain**: eigene Domain (z. B. eu-compliance-suite.de) kaufen, bei Brevo verifizieren, `MAIL_FROM`
   umstellen. Bis dahin gehen Mails von `…@brevosend.com` raus (funktioniert, sieht aber weniger seriös aus).

## B. Tag der Einreichung (30 Minuten)

4. LinkedIn-Post DE **und** EN (`posts.md`) mit dem Cover-Bild `store/listing/en/screenshot-cover.png` oder dem
   Screencast-Link https://eu-compliance-suite.fly.dev/screencast.
5. Shopify Community: Thread im deutschen Forum + im englischen Forum (Texte in `posts.md`), danach die Suche nach
   „Widerrufsbutton“, „withdrawal button“, „GARAN“, „Gewährleistungslabel“ – auf offene Fragen antworten, Link nur wenn
   passend.
6. Reddit r/shopify (EN), r/ecommerce_de (DE): Mehrwert-Post (Checkliste 27.09.), App im Kommentar.
7. Facebook-Gruppen „Shopify Deutschland“, „E-Commerce Deutschland“: Checklisten-Post.

## C. Tag 1–3 (je 10 Minuten pro Kontakt)

8. 18 Agenturen aus `targets.md` Abschnitt 2 über Kontaktformular oder LinkedIn anschreiben (Vorlage „Agentur“ in
   `outreach.md`). Angebot: 30 % Umsatzbeteiligung im ersten Jahr für vermittelte Shops oder kostenloser Agentur-Zugang.
   Argument: sie empfehlen heute Einzel-Apps, wir decken beide Pflichten ab.
9. 5 Rechtsportale (IT-Recht Kanzlei, Händlerbund, Trusted Shops, eRecht24, Shopify-Blog DE) Gastbeitrag anbieten
   (`artikel-de.md` liegt fertig, Vorlage in `outreach.md`).
10. dev.to / Medium: `article-en.md` veröffentlichen (Titel: „The EU withdrawal button and GARAN label: what every
    Shopify store must ship before 27 September 2026“).

## D. Nach der Freigabe durch Shopify

11. Englisches Listing anlegen (Partner-Dashboard → Listing → Sprache hinzufügen): Texte in `docs/LISTING.md`
    (Abschnitt „English listing texts“), Screenshots aus `store/listing/en/`.
12. `APP_STORE_URL` per `fly secrets set` setzen (Listing-URL, vermutlich https://apps.shopify.com/eu-label-1), neu deployen –
    dann zeigt die Landingpage den App-Store-Button.
13. Product Hunt Launch (Text in `posts.md`), zweiter LinkedIn-Post „jetzt im App Store“.
14. Erste 5 Händler persönlich um eine Bewertung bitten (Bewertungen entscheiden das Ranking).

## E. Kostenloser Einstiegstarif – umgesetzt (11.09.2026)

Alle Wettbewerber haben einen Free-Tier. Vorschlag: „Label“-Tarif kostenlos (Gewährleistungshinweis + GARAN), Basic
6,99 $ (Widerruf), Pro 12,99 $ (alles + Tagging/Benachrichtigung/Support). Umsetzung durch mich ~2 Stunden
(Code + Listing-Preise); am besten direkt nach der Freigabe, damit die Prüfung nicht neu startet.

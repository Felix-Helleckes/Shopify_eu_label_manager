# App-Store-Prüfung, Rückmeldung 134896 (11.09.2026)

Shopify hat die Einreichung nicht abgelehnt, aber eine Nachbesserung verlangt. Status im Dashboard:
„Fix requirement issues“, Frist 14 Tage, danach wird die Einreichung pausiert.

## Was der Prüfer geschrieben hat

> 5.1.2. Properly show theme app extension in the storefront. Your app widget must be displayed
> properly and without any errors in the Theme Editor and Online Store. While testing the Cart
> template, we added and saved the app's legal-guarantee and right-to-repair blocks, and they
> rendered in the theme editor with the text "LEGAL GUARANTEE." On the live storefront cart, the app
> fails to display either notice anywhere from the cart through the footer.

Zwei Screenshots lagen bei: der Theme-Editor mit den drei Blöcken im Warenkorb-Template und der
Live-Warenkorb desselben Shops ohne jede Ausgabe der App.

## Was die Untersuchung ergeben hat

**Die Blöcke selbst funktionieren im Shop.** Nachgewiesen am 11.09.2026 auf dem Entwicklungsshop:
Das Warenkorb-Template wurde mit einem `apps`-Abschnitt und den Blöcken `repair-info` und
`legal-guarantee-notice` in ein unveröffentlichtes Theme (`eu-cart-test`, ID 131149267002) geladen.
Der Storefront-Aufruf `/cart?preview_theme_id=131149267002` liefert den Abschnitt
`shopify-section-template--…__apps` samt `eu-repair` und `eu-guarantee` im HTML – ohne Theme-Editor,
ohne `design_mode`. Die Liquid-Dateien enthalten keine Bedingung, die im Shop anders greift als im
Editor: Beide Blöcke geben immer Markup aus, unabhängig von Tarif, Produkt oder Sprache.

**Der Abschnitt war im geprüften Shop nicht im gespeicherten Template.** Ein Block, der im Editor
erscheint, im Shop aber fehlt, obwohl das Liquid bedingungsfrei ausgibt, kann nur bedeuten, dass der
Abschnitt nicht im veröffentlichten Template stand. Derselbe Ablauf über den Theme-Editor (Block per
Deep-Link einfügen, speichern) hat auf dem Entwicklungsshop ebenfalls nichts geschrieben: Nach dem
Speichern stand in `templates/cart.json` weiterhin nur `cart-items` und `cart-footer`, und der
erneut geöffnete Editor zeigte den Block nicht mehr.

## Was geändert wurde

Unabhängig von dieser Ursache gab es vier Stellen, an denen der Theme-Editor etwas anzeigte, das der
Shop nicht anzeigt – genau der Fehlertyp, den Anforderung 5.1.2 beschreibt. Alle vier sind entfernt:

| Datei | vorher | jetzt |
| --- | --- | --- |
| `withdrawal-button.liquid` | Tarifhinweis nur im Editor | im Tarif „Label“ überall leer |
| `withdrawal-embed.liquid` | Tarifhinweis nur im Editor | im Tarif „Label“ überall leer |
| `durability-label.liquid` | Platzhalter nur im Editor | ohne Garantie > 2 Jahre überall leer |
| `legal-guarantee-notice.liquid` | aufklappbare Variante nur im Editor geöffnet | in Editor und Shop gleich |

Warum ein Block leer bleiben kann, steht jetzt im Einstellungsbereich des Blocks (Schema-Text), nicht
mehr in der Vorschau. Der Einstellungsbereich gehört nicht zur gerenderten Seite, damit bleiben
Editor und Shop deckungsgleich.

Zusätzlich weist die App im Dashboard und auf der Gewährleistungsseite jetzt in allen zehn
Admin-Sprachen darauf hin, nach dem Einfügen eines Blocks im Theme-Editor auf „Speichern“ zu klicken
(`common.saveInEditor`).

Veröffentlicht als App-Version `eu-compliance-suite-11`.

## Erledigt am 11.09.2026

Das Rückmeldeformular kennt kein Freitextfeld für eine Antwort, sondern verlangt unter „Show resolved
state“ eine **URL, die den behobenen Zustand zeigt**. Dafür gibt es jetzt die öffentliche Seite
<https://eu-compliance-suite.fly.dev/proof/134896> (Route `app/routes/proof.134896.tsx`): Sie nennt
die vier Änderungen, beschreibt die Prüfung am Live-Warenkorb und rendert die Ausgabe der beiden
Hinweis-Blöcke mit genau dem Stylesheet und der Grafik, die die Theme-Extension über
`cdn.shopify.com/extensions/…/eu-compliance-suite-11/assets` ausliefert.

Ablauf im Dashboard: Punkt als gelöst markiert (1/1, „Complete“), danach „Korrekturen einreichen“.
Status jetzt wieder **„Wird überprüft“**, Sichtbarkeit weiterhin voll. Der ausformulierte
Antworttext in `docs/APP-REVIEW-134896-reply.md` wurde nicht gebraucht und bleibt als Vorlage für
eine etwaige Rückfrage stehen.

Nebenbei erledigt: Das Warenkorb-Template des Entwicklungsshops enthält jetzt dauerhaft die Blöcke
`repair-info` und `legal-guarantee-notice` (`templates/cart.json`, Abschnitt `apps`).

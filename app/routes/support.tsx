import { operator } from "../lib/operator";

export default function SupportPage() {
  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: 32, lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 28 }}>Support – {operator.appName}</h1>
      <p>
        Fragen zur Einrichtung, zu Rechnungen oder zu rechtlichen Neuerungen? Schreiben Sie an{" "}
        <a href={`mailto:${operator.supportEmail}`}>{operator.supportEmail}</a>. Wir antworten in der Regel innerhalb
        eines Werktags (Pro-Tarif: innerhalb von 4 Stunden an Werktagen).
      </p>
      <h2>Häufige Fragen</h2>
      <h3>Wo muss der Widerrufsbutton stehen?</h3>
      <p>
        Gut sichtbar und während der gesamten Widerrufsfrist erreichbar. Empfohlen: als App-Einbettung im Footer aller
        Seiten und zusätzlich auf der Bestellstatus-Seite. Die Beschriftung „Vertrag widerrufen“ (bzw. die amtliche
        Übersetzung) sollte nicht verändert werden.
      </p>
      <h3>Warum wird eine Widerrufserklärung angenommen, obwohl keine Bestellung gefunden wurde?</h3>
      <p>
        Das Gesetz verlangt, dass die Erklärung auch dann entgegengenommen und bestätigt wird. Die App markiert solche
        Fälle im Protokoll, damit Sie sie manuell prüfen können.
      </p>
      <h3>Ab wann gilt der Gewährleistungshinweis?</h3>
      <p>
        Die harmonisierte Mitteilung und die GARAN-Kennzeichnung sind ab dem 27. September 2026 verpflichtend
        (Richtlinie (EU) 2024/825, Durchführungsverordnung (EU) 2025/1960).
      </p>
      <p style={{ color: "#666", fontSize: 14 }}>
        <a href="/privacy">Datenschutz</a> · <a href="/terms">Nutzungsbedingungen</a>
      </p>
    </main>
  );
}

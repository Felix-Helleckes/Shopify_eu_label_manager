import { operator } from "../lib/operator";

export function meta() {
  return [{ title: `Screencast – ${operator.appName}` }];
}

export default function ScreencastPage() {
  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif", maxWidth: 1100, margin: "0 auto", padding: 32, lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 28 }}>{operator.appName} – Screencast</h1>
      <p>
        Demo der Shop-Ansicht (Widerrufsbutton, GARAN-Kennzeichnung, Gewährleistungshinweis) und des
        Admin-Bereichs. Ohne Ton.
      </p>
      <video
        src="/screencast.mp4"
        controls
        playsInline
        preload="metadata"
        style={{ width: "100%", maxWidth: 1100, borderRadius: 12, background: "#000", aspectRatio: "16 / 9" }}
      >
        <a href="/screencast.mp4">screencast.mp4</a>
      </video>
      <p style={{ color: "#666", fontSize: 14 }}>
        <a href="/screencast.mp4">Direkter Link zur Videodatei (MP4)</a> · <a href="/support">Support</a> ·{" "}
        <a href="/privacy">Datenschutz</a>
      </p>
    </main>
  );
}

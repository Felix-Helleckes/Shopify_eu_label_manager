import { operator } from "../lib/operator";

export function meta() {
  return [{ title: `Screencast – ${operator.appName}` }];
}

export default function ScreencastPage() {
  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif", maxWidth: 1100, margin: "0 auto", padding: 32, lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 28 }}>{operator.appName} – Screencast</h1>
      <p>
        Demo of the storefront (withdrawal button, GARAN label, legal-guarantee notice) followed by the admin. No audio,
        about 90 seconds. / Demo der Shop-Ansicht und des Admin-Bereichs, ohne Ton.
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
        <a href="/screencast.mp4">Direct link to the video file (MP4)</a> · <a href="/">Home</a> · <a href="/support">Support</a> ·{" "}
        <a href="/privacy">Privacy</a>
      </p>
    </main>
  );
}

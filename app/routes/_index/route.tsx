import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, redirect, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { operator } from "../../lib/operator";
import { loginErrorMessage } from "./error.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return { showForm: Boolean(login), supportEmail: operator.supportEmail };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

const styles = {
  page: { fontFamily: "Inter, system-ui, sans-serif", color: "#1a1a1a", maxWidth: 760, margin: "0 auto", padding: "48px 24px", lineHeight: 1.55 },
  h1: { fontSize: 32, margin: "0 0 12px" },
  lead: { fontSize: 18, color: "#444", margin: "0 0 32px" },
  card: { border: "1px solid #e3e3e3", borderRadius: 12, padding: 24, margin: "24px 0" },
  input: { width: "100%", padding: "10px 12px", fontSize: 16, border: "1px solid #bbb", borderRadius: 8, margin: "8px 0 12px", boxSizing: "border-box" as const },
  button: { background: "#003399", color: "#fff", border: 0, borderRadius: 8, padding: "10px 18px", fontSize: 16, cursor: "pointer" },
  small: { color: "#666", fontSize: 14 },
} as const;

export default function Index() {
  const { showForm, supportEmail } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors ?? {};

  return (
    <main style={styles.page}>
      <h1 style={styles.h1}>EU Compliance Suite für Shopify</h1>
      <p style={styles.lead}>
        Widerrufsbutton nach Art. 11a der Verbraucherrechte-Richtlinie (§ 356a BGB), harmonisierter
        Gewährleistungshinweis und GARAN-Kennzeichnung nach Verordnung (EU) 2025/1960 sowie Hinweise zum
        Recht auf Reparatur – in einer App, in allen 24 EU-Amtssprachen.
      </p>
      <ul>
        <li><strong>Widerrufsfunktion</strong> mit amtlicher Beschriftung, zweistufiger Bestätigung und automatischer Eingangsbestätigung mit Zeitstempel.</li>
        <li><strong>Widerrufsprotokoll</strong> mit Prüfsumme, Zuordnung zur Bestellung, Tagging und CSV-Export.</li>
        <li><strong>Gewährleistungshinweis</strong> und <strong>Haltbarkeits-Kennzeichnung</strong> als Theme-Blöcke, pflichtgemäß ab 27. September 2026.</li>
      </ul>
      {showForm && (
        <div style={styles.card}>
          <h2 style={{ marginTop: 0 }}>App installieren / anmelden</h2>
          <Form method="post">
            <label>
              Shop-Domain
              <input style={styles.input} type="text" name="shop" placeholder="mein-shop.myshopify.com" />
            </label>
            {errors.shop && <p style={{ color: "#b00020" }}>{errors.shop}</p>}
            <button style={styles.button} type="submit">Weiter</button>
          </Form>
        </div>
      )}
      <p style={styles.small}>
        <a href="/privacy">Datenschutz</a> · <a href="/terms">Nutzungsbedingungen</a> · <a href="/support">Support</a> ·{" "}
        <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
      </p>
    </main>
  );
}

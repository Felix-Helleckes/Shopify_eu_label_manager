import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import { requireShop } from "../lib/admin.server";
import { STATUS_LABELS } from "../lib/status";
import { formatTimestamp, resendAcknowledgement } from "../lib/withdrawal.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { shop } = await requireShop(request);
  const w = await db.withdrawal.findFirst({ where: { id: params.id, shop: shop.domain } });
  if (!w) throw new Response("Not found", { status: 404 });
  const store = shop.domain.replace(".myshopify.com", "");
  const orderAdminUrl = w.orderId
    ? `https://admin.shopify.com/store/${store}/orders/${w.orderId.split("/").pop()}`
    : null;
  return {
    w: {
      ...w,
      submittedAt: w.submittedAt.toISOString(),
      submittedAtLocal: formatTimestamp(w.submittedAt, "de-DE", shop.timezone),
      ackSentAt: w.ackSentAt?.toISOString() ?? null,
      merchantNotifiedAt: w.merchantNotifiedAt?.toISOString() ?? null,
      orderTaggedAt: w.orderTaggedAt?.toISOString() ?? null,
      orderCreatedAt: w.orderCreatedAt?.toISOString() ?? null,
      anonymizedAt: w.anonymizedAt?.toISOString() ?? null,
    },
    orderAdminUrl,
  };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { shop } = await requireShop(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "save");
  const existing = await db.withdrawal.findFirst({ where: { id: params.id, shop: shop.domain } });
  if (!existing) throw new Response("Not found", { status: 404 });

  if (intent === "resend") {
    const ok = await resendAcknowledgement(shop, existing.id);
    return { ok, message: ok ? "Eingangsbestätigung wurde erneut versendet." : "Versand fehlgeschlagen – bitte SMTP-Konfiguration prüfen." };
  }

  const status = String(form.get("status") || existing.status);
  if (!Object.keys(STATUS_LABELS).includes(status)) return { ok: false, message: "Ungültiger Status." };
  const merchantNote = String(form.get("merchantNote") || "").slice(0, 2000) || null;
  await db.withdrawal.update({ where: { id: existing.id }, data: { status, merchantNote } });
  return { ok: true, message: "Gespeichert." };
};

export default function WithdrawalDetail() {
  const { w, orderAdminUrl } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  const rows: [string, string][] = [
    ["Eingang", `${w.submittedAtLocal} – ${w.submittedAt}`],
    ["Vorgangsnummer", w.receiptNo],
    ["Name", w.consumerName],
    ["Vertrag / Bestellung (Angabe des Kunden)", w.contractRef],
    ["E-Mail-Adresse", w.contactEmail],
    ["Bestell-/Lieferdatum (Angabe des Kunden)", w.orderDate ?? "–"],
    ["Weitere Angaben", w.details ?? "–"],
    ["Sprache der Bestätigung", w.locale],
    ["Prüfsumme (SHA-256)", w.contentHash],
  ];

  return (
    <s-page heading={`Widerruf ${w.receiptNo}`}>
      <s-link slot="breadcrumb" href="/app/withdrawals">Widerrufe</s-link>
      {result && (
        <s-banner tone={result.ok ? "success" : "critical"}>
          <s-paragraph>{result.message}</s-paragraph>
        </s-banner>
      )}
      {w.anonymizedAt && (
        <s-banner heading="Anonymisiert" tone="info">
          <s-paragraph>Die personenbezogenen Daten wurden auf Kundenwunsch am {w.anonymizedAt} anonymisiert.</s-paragraph>
        </s-banner>
      )}

      <s-section heading="Inhalt der Widerrufserklärung">
        <s-table>
          <s-table-body>
            {rows.map(([k, v]) => (
              <s-table-row key={k}>
                <s-table-cell>
                  <s-text type="strong">{k}</s-text>
                </s-table-cell>
                <s-table-cell>{v}</s-table-cell>
              </s-table-row>
            ))}
          </s-table-body>
        </s-table>
      </s-section>

      <s-section heading="Zuordnung und Zustellung">
        <s-unordered-list>
          <s-list-item>
            Bestellung:{" "}
            {w.orderMatched && w.orderName ? (
              <>
                <s-badge tone="success">{w.orderName}</s-badge>{" "}
                {orderAdminUrl && (
                  <s-link href={orderAdminUrl} target="_blank">
                    im Shopify-Admin öffnen
                  </s-link>
                )}
                {w.orderEmailMatched === false && " – E-Mail-Adresse weicht von der Bestellung ab, bitte prüfen"}
                {w.orderTaggedAt ? " – getaggt" : ""}
              </>
            ) : (
              <s-badge tone="warning">keine passende Bestellung gefunden – bitte manuell prüfen</s-badge>
            )}
          </s-list-item>
          <s-list-item>
            Eingangsbestätigung an den Kunden:{" "}
            {w.ackSentAt ? <s-badge tone="success">gesendet {w.ackSentAt}</s-badge> : <s-badge tone="critical">nicht zugestellt{w.ackError ? ` (${w.ackError})` : ""}</s-badge>}
          </s-list-item>
          <s-list-item>Händlerbenachrichtigung: {w.merchantNotifiedAt ? `gesendet ${w.merchantNotifiedAt}` : "nicht gesendet"}</s-list-item>
        </s-unordered-list>
        {!w.anonymizedAt && (
          <Form method="post">
            <input type="hidden" name="intent" value="resend" />
            <s-button type="submit" {...(busy ? { disabled: true } : {})}>
              Eingangsbestätigung erneut senden
            </s-button>
          </Form>
        )}
      </s-section>

      <s-section heading="Bearbeitung">
        <Form method="post">
          <input type="hidden" name="intent" value="save" />
          <s-stack direction="block" gap="base">
            <s-select label="Status" name="status" value={w.status}>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <s-option key={value} value={value}>
                  {label}
                </s-option>
              ))}
            </s-select>
            <s-text-area label="Interne Notiz" name="merchantNote" value={w.merchantNote ?? ""} rows={4} />
            <s-button type="submit" variant="primary" {...(busy ? { loading: true } : {})}>
              Speichern
            </s-button>
          </s-stack>
        </Form>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

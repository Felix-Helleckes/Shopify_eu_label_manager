import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useSearchParams } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import { requireShop } from "../lib/admin.server";
import { STATUS_LABELS } from "../lib/status";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { shop } = await requireShop(request);
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  const status = url.searchParams.get("status") || "";

  const where: Record<string, unknown> = { shop: shop.domain };
  if (status === "ack_failed") {
    where.ackSentAt = null;
    where.anonymizedAt = null;
  } else if (status) {
    where.status = status;
  }
  if (q) {
    where.OR = [
      { consumerName: { contains: q } },
      { contactEmail: { contains: q } },
      { contractRef: { contains: q } },
      { orderName: { contains: q } },
      { receiptNo: { contains: q } },
    ];
  }

  const rows = await db.withdrawal.findMany({
    where,
    orderBy: { submittedAt: "desc" },
    take: 200,
    select: {
      id: true,
      receiptNo: true,
      submittedAt: true,
      consumerName: true,
      contractRef: true,
      orderName: true,
      orderMatched: true,
      ackSentAt: true,
      status: true,
      anonymizedAt: true,
    },
  });

  return {
    q,
    status,
    timezone: shop.timezone || "Europe/Berlin",
    rows: rows.map((r) => ({ ...r, submittedAt: r.submittedAt.toISOString(), ackSentAt: r.ackSentAt?.toISOString() ?? null })),
  };
};

export default function Withdrawals() {
  const { rows, q, status, timezone } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const fmt = new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short", timeZone: timezone });

  const exportCsv = async () => {
    const res = await fetch("/app/withdrawals/export.csv", { credentials: "same-origin" });
    if (!res.ok) return;
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `widerrufe-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  };

  return (
    <s-page heading="Widerrufe">
      <s-button slot="primary-action" onClick={exportCsv}>
        CSV exportieren
      </s-button>

      <s-section>
        <Form method="get">
          <s-stack direction="inline" gap="base">
            <s-text-field label="Suche" name="q" value={q} placeholder="Name, E-Mail, Bestellnummer, Vorgangsnummer" />
            <s-select label="Status" name="status" value={status}>
              <s-option value="">Alle</s-option>
              <s-option value="received">Eingegangen</s-option>
              <s-option value="processing">In Bearbeitung</s-option>
              <s-option value="refunded">Erstattet</s-option>
              <s-option value="rejected">Abgelehnt / ungültig</s-option>
              <s-option value="ack_failed">Bestätigung fehlgeschlagen</s-option>
            </s-select>
            <s-button type="submit">Filtern</s-button>
          </s-stack>
          {params.get("host") && <input type="hidden" name="host" value={params.get("host") ?? ""} />}
        </Form>
      </s-section>

      <s-section>
        {rows.length === 0 ? (
          <s-paragraph>Noch keine Widerrufserklärungen eingegangen.</s-paragraph>
        ) : (
          <s-table>
            <s-table-header-row>
              <s-table-header>Eingang</s-table-header>
              <s-table-header>Vorgang</s-table-header>
              <s-table-header>Kunde</s-table-header>
              <s-table-header>Vertrag / Bestellung</s-table-header>
              <s-table-header>Bestätigung</s-table-header>
              <s-table-header>Status</s-table-header>
            </s-table-header-row>
            <s-table-body>
              {rows.map((r) => (
                <s-table-row key={r.id}>
                  <s-table-cell>{fmt.format(new Date(r.submittedAt))}</s-table-cell>
                  <s-table-cell>
                    <s-link href={`/app/withdrawals/${r.id}`}>{r.receiptNo}</s-link>
                  </s-table-cell>
                  <s-table-cell>{r.anonymizedAt ? "[anonymisiert]" : r.consumerName}</s-table-cell>
                  <s-table-cell>
                    {r.contractRef}
                    {r.orderMatched && r.orderName ? ` → ${r.orderName}` : ""}
                    {!r.orderMatched && <s-badge tone="warning">nicht zugeordnet</s-badge>}
                  </s-table-cell>
                  <s-table-cell>
                    {r.ackSentAt ? <s-badge tone="success">gesendet</s-badge> : <s-badge tone="critical">fehlgeschlagen</s-badge>}
                  </s-table-cell>
                  <s-table-cell>{STATUS_LABELS[r.status] ?? r.status}</s-table-cell>
                </s-table-row>
              ))}
            </s-table-body>
          </s-table>
        )}
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

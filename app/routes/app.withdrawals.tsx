import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useSearchParams } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import { requireShop } from "../lib/admin.server";
import { statusLabels } from "../lib/admin-i18n";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { shop, t, localeTag } = await requireShop(request);
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
      { consumerName: { contains: q, mode: "insensitive" } },
      { contactEmail: { contains: q, mode: "insensitive" } },
      { contractRef: { contains: q, mode: "insensitive" } },
      { orderName: { contains: q, mode: "insensitive" } },
      { receiptNo: { contains: q, mode: "insensitive" } },
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
    localeTag,
    timezone: shop.timezone || "Europe/Berlin",
    statuses: statusLabels(t),
    s: {
      title: t("wd.title"),
      export: t("wd.export"),
      file: t("wd.file"),
      search: t("wd.search"),
      searchPlaceholder: t("wd.searchPlaceholder"),
      status: t("common.status"),
      all: t("wd.all"),
      ackFailedOption: t("wd.ackFailedOption"),
      filter: t("wd.filter"),
      empty: t("wd.empty"),
      colReceived: t("wd.colReceived"),
      colRef: t("wd.colRef"),
      colCustomer: t("wd.colCustomer"),
      colContract: t("wd.colContract"),
      colAck: t("wd.colAck"),
      notMatched: t("wd.notMatched"),
      sent: t("wd.sent"),
      failed: t("wd.failed"),
      anonymized: t("common.anonymized"),
    },
    rows: rows.map((r) => ({ ...r, submittedAt: r.submittedAt.toISOString(), ackSentAt: r.ackSentAt?.toISOString() ?? null })),
  };
};

export default function Withdrawals() {
  const { rows, q, status, timezone, localeTag, statuses, s } = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const fmt = new Intl.DateTimeFormat(localeTag, { dateStyle: "short", timeStyle: "short", timeZone: timezone });

  const exportCsv = async () => {
    const res = await fetch("/app/withdrawals/export.csv", { credentials: "same-origin" });
    if (!res.ok) return;
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${s.file}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  };

  return (
    <s-page heading={s.title}>
      <s-button slot="primary-action" onClick={exportCsv}>
        {s.export}
      </s-button>

      <s-section>
        <Form method="get">
          <s-stack direction="inline" gap="base">
            <s-text-field label={s.search} name="q" value={q} placeholder={s.searchPlaceholder} />
            <s-select label={s.status} name="status" value={status}>
              <s-option value="">{s.all}</s-option>
              {Object.entries(statuses).map(([value, label]) => (
                <s-option key={value} value={value}>
                  {label}
                </s-option>
              ))}
              <s-option value="ack_failed">{s.ackFailedOption}</s-option>
            </s-select>
            <s-button type="submit">{s.filter}</s-button>
          </s-stack>
          {params.get("host") && <input type="hidden" name="host" value={params.get("host") ?? ""} />}
        </Form>
      </s-section>

      <s-section>
        {rows.length === 0 ? (
          <s-paragraph>{s.empty}</s-paragraph>
        ) : (
          <s-table>
            <s-table-header-row>
              <s-table-header>{s.colReceived}</s-table-header>
              <s-table-header>{s.colRef}</s-table-header>
              <s-table-header>{s.colCustomer}</s-table-header>
              <s-table-header>{s.colContract}</s-table-header>
              <s-table-header>{s.colAck}</s-table-header>
              <s-table-header>{s.status}</s-table-header>
            </s-table-header-row>
            <s-table-body>
              {rows.map((r) => (
                <s-table-row key={r.id}>
                  <s-table-cell>{fmt.format(new Date(r.submittedAt))}</s-table-cell>
                  <s-table-cell>
                    <s-link href={`/app/withdrawals/${r.id}`}>{r.receiptNo}</s-link>
                  </s-table-cell>
                  <s-table-cell>{r.anonymizedAt ? s.anonymized : r.consumerName}</s-table-cell>
                  <s-table-cell>
                    {r.contractRef}
                    {r.orderMatched && r.orderName ? ` → ${r.orderName}` : ""}
                    {!r.orderMatched && <s-badge tone="warning">{s.notMatched}</s-badge>}
                  </s-table-cell>
                  <s-table-cell>
                    {r.ackSentAt ? <s-badge tone="success">{s.sent}</s-badge> : <s-badge tone="critical">{s.failed}</s-badge>}
                  </s-table-cell>
                  <s-table-cell>{statuses[r.status] ?? r.status}</s-table-cell>
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

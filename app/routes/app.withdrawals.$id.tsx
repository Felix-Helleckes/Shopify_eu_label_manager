import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import { requireShop } from "../lib/admin.server";
import { statusLabels } from "../lib/admin-i18n";
import { STATUS_KEYS } from "../lib/status";
import { requireWithdrawalPlan } from "../lib/billing.server";
import { formatTimestamp, resendAcknowledgement } from "../lib/withdrawal.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { shop, t, localeTag, plan } = await requireShop(request);
  requireWithdrawalPlan(plan, request);
  const w = await db.withdrawal.findFirst({ where: { id: params.id, shop: shop.domain } });
  if (!w) throw new Response("Not found", { status: 404 });
  const store = shop.domain.replace(".myshopify.com", "");
  const orderAdminUrl = w.orderId
    ? `https://admin.shopify.com/store/${store}/orders/${w.orderId.split("/").pop()}`
    : null;
  const fmt = (d: Date | null) => (d ? formatTimestamp(d, localeTag, shop.timezone) : null);
  return {
    w: {
      ...w,
      submittedAt: w.submittedAt.toISOString(),
      submittedAtLocal: formatTimestamp(w.submittedAt, localeTag, shop.timezone),
      ackSentAt: fmt(w.ackSentAt),
      merchantNotifiedAt: fmt(w.merchantNotifiedAt),
      orderTaggedAt: w.orderTaggedAt?.toISOString() ?? null,
      orderCreatedAt: w.orderCreatedAt?.toISOString() ?? null,
      anonymizedAt: fmt(w.anonymizedAt),
    },
    orderAdminUrl,
    statuses: statusLabels(t),
    s: {
      title: t("det.title", { ref: w.receiptNo }),
      breadcrumb: t("nav.withdrawals"),
      anonymizedTitle: t("det.anonymized.title"),
      anonymizedBody: t("det.anonymized.body", { date: fmt(w.anonymizedAt) ?? "" }),
      content: t("det.content"),
      rows: [
        [t("det.received"), `${formatTimestamp(w.submittedAt, localeTag, shop.timezone)} – ${w.submittedAt.toISOString()}`],
        [t("det.receiptNo"), w.receiptNo],
        [t("det.name"), w.consumerName],
        [t("det.contract"), w.contractRef],
        [t("det.email"), w.contactEmail],
        [t("det.orderDate"), w.orderDate ?? "–"],
        [t("det.details"), w.details ?? "–"],
        [t("det.language"), w.locale],
        [t("det.hash"), w.contentHash],
      ] as [string, string][],
      matching: t("det.matching"),
      order: t("det.order"),
      openInAdmin: t("det.openInAdmin"),
      tagged: t("det.tagged"),
      noOrder: t("det.noOrder"),
      ackToCustomer: t("det.ackToCustomer"),
      sentAt: w.ackSentAt ? t("det.sentAt", { date: fmt(w.ackSentAt) ?? "" }) : "",
      notDelivered: t("det.notDelivered"),
      merchantNotification: t("det.merchantNotification"),
      merchantSent: w.merchantNotifiedAt ? t("det.sentAt", { date: fmt(w.merchantNotifiedAt) ?? "" }) : t("det.notSent"),
      resend: t("det.resend"),
      processing: t("det.processing"),
      status: t("common.status"),
      note: t("det.note"),
      save: t("common.save"),
    },
  };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { shop, t, plan } = await requireShop(request);
  requireWithdrawalPlan(plan, request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "save");
  const existing = await db.withdrawal.findFirst({ where: { id: params.id, shop: shop.domain } });
  if (!existing) throw new Response("Not found", { status: 404 });

  if (intent === "resend") {
    const ok = await resendAcknowledgement(shop, existing.id);
    return { ok, message: ok ? t("det.resent") : t("det.resendFailed") };
  }

  const status = String(form.get("status") || existing.status);
  if (!(STATUS_KEYS as readonly string[]).includes(status)) return { ok: false, message: t("det.invalidStatus") };
  const merchantNote = String(form.get("merchantNote") || "").slice(0, 2000) || null;
  await db.withdrawal.update({ where: { id: existing.id }, data: { status, merchantNote } });
  return { ok: true, message: t("det.saved") };
};

export default function WithdrawalDetail() {
  const { w, orderAdminUrl, statuses, s } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  return (
    <s-page heading={s.title}>
      <s-link slot="breadcrumb" href="/app/withdrawals">{s.breadcrumb}</s-link>
      {result && (
        <s-banner tone={result.ok ? "success" : "critical"}>
          <s-paragraph>{result.message}</s-paragraph>
        </s-banner>
      )}
      {w.anonymizedAt && (
        <s-banner heading={s.anonymizedTitle} tone="info">
          <s-paragraph>{s.anonymizedBody}</s-paragraph>
        </s-banner>
      )}

      <s-section heading={s.content}>
        <s-table>
          <s-table-body>
            {s.rows.map(([k, v]) => (
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

      <s-section heading={s.matching}>
        <s-unordered-list>
          <s-list-item>
            {s.order}{" "}
            {w.orderMatched && w.orderName ? (
              <>
                <s-badge tone="success">{w.orderName}</s-badge>{" "}
                {orderAdminUrl && (
                  <s-link href={orderAdminUrl} target="_blank">
                    {s.openInAdmin}
                  </s-link>
                )}
                {w.orderTaggedAt ? ` ${s.tagged}` : ""}
              </>
            ) : (
              <s-badge tone="warning">{s.noOrder}</s-badge>
            )}
          </s-list-item>
          <s-list-item>
            {s.ackToCustomer}{" "}
            {w.ackSentAt ? (
              <s-badge tone="success">{s.sentAt}</s-badge>
            ) : (
              <s-badge tone="critical">
                {s.notDelivered}
                {w.ackError ? ` (${w.ackError})` : ""}
              </s-badge>
            )}
          </s-list-item>
          <s-list-item>
            {s.merchantNotification} {s.merchantSent}
          </s-list-item>
        </s-unordered-list>
        {!w.anonymizedAt && (
          <Form method="post">
            <input type="hidden" name="intent" value="resend" />
            <s-button type="submit" {...(busy ? { disabled: true } : {})}>
              {s.resend}
            </s-button>
          </Form>
        )}
      </s-section>

      <s-section heading={s.processing}>
        <Form method="post">
          <input type="hidden" name="intent" value="save" />
          <s-stack direction="block" gap="base">
            <s-select label={s.status} name="status" value={w.status}>
              {Object.entries(statuses).map(([value, label]) => (
                <s-option key={value} value={value}>
                  {label}
                </s-option>
              ))}
            </s-select>
            <s-text-area label={s.note} name="merchantNote" value={w.merchantNote ?? ""} rows={4} />
            <s-button type="submit" variant="primary" {...(busy ? { loading: true } : {})}>
              {s.save}
            </s-button>
          </s-stack>
        </Form>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

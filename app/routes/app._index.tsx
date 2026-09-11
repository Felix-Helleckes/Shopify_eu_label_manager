import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import { requireShop, themeEditorLinks } from "../lib/admin.server";
import { isMailConfigured } from "../lib/email.server";
import { OFFICIAL_LABELS } from "../lib/labels";
import { PLAN_PRO } from "../lib/plans";
import { en, type AdminKey } from "../lib/admin-i18n";

const KEYS = Object.keys(en).filter((k) => k.startsWith("dash.") || k.startsWith("nav.")) as AdminKey[];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { shop, plan, t } = await requireShop(request);
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const where = { shop: shop.domain };
  const [total, last30, open, ackFailed, latest] = await Promise.all([
    db.withdrawal.count({ where }),
    db.withdrawal.count({ where: { ...where, submittedAt: { gte: since } } }),
    db.withdrawal.count({ where: { ...where, status: "received" } }),
    db.withdrawal.count({ where: { ...where, ackSentAt: null, anonymizedAt: null } }),
    db.withdrawal.findFirst({ where, orderBy: { submittedAt: "desc" }, select: { submittedAt: true, receiptNo: true } }),
  ]);
  const labels = OFFICIAL_LABELS[(shop.shopLocale || "en").split("-")[0]] ?? OFFICIAL_LABELS.en;
  const s = Object.fromEntries(KEYS.map((k) => [k, t(k)])) as Record<AdminKey, string>;
  return {
    s,
    shopName: shop.name || shop.domain,
    plan,
    isPro: plan === PLAN_PRO,
    mailConfigured: isMailConfigured(),
    merchantEmail: shop.merchantEmail || shop.email || "",
    stats: { total, last30, open, ackFailed, latest: latest?.submittedAt?.toISOString() ?? null },
    links: themeEditorLinks(shop.domain),
    labels,
  };
};

const fill = (s: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.split(`{${k}}`).join(String(v)), s);

export default function Dashboard() {
  const d = useLoaderData<typeof loader>();
  const s = d.s;
  const today = new Date();
  const guaranteeDeadline = new Date("2026-09-27T00:00:00Z");
  const daysToGuarantee = Math.ceil((guaranteeDeadline.getTime() - today.getTime()) / 86400000);
  const days = daysToGuarantee > 0 ? fill(s["dash.daysLeft"], { n: daysToGuarantee }) : s["dash.inForce"];

  return (
    <s-page heading={s["dash.title"]}>
      {!d.mailConfigured && (
        <s-banner heading={s["dash.mail.title"]} tone="critical">
          <s-paragraph>{s["dash.mail.body"]}</s-paragraph>
        </s-banner>
      )}
      {d.stats.ackFailed > 0 && (
        <s-banner heading={s["dash.ackFailed.title"]} tone="warning">
          <s-paragraph>
            {fill(s["dash.ackFailed.body1"], { count: d.stats.ackFailed })}{" "}
            <s-link href="/app/withdrawals?status=ack_failed">{s["dash.ackFailed.link"]}</s-link> {s["dash.ackFailed.body2"]}
          </s-paragraph>
        </s-banner>
      )}

      <s-section heading={s["dash.withdrawals"]}>
        <s-stack direction="inline" gap="large">
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>{String(d.stats.last30)}</s-heading>
            <s-text>{s["dash.last30"]}</s-text>
          </s-box>
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>{String(d.stats.open)}</s-heading>
            <s-text>{s["dash.open"]}</s-text>
          </s-box>
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>{String(d.stats.total)}</s-heading>
            <s-text>{s["dash.total"]}</s-text>
          </s-box>
        </s-stack>
        <s-paragraph>
          <s-link href="/app/withdrawals">{s["dash.viewAll"]}</s-link>
        </s-paragraph>
      </s-section>

      <s-section heading={s["dash.setup"]}>
        <s-ordered-list>
          <s-list-item>
            <s-text type="strong">{s["dash.step1.title"]}</s-text> {fill(s["dash.step1.body"], { label: d.labels.withdraw })}{" "}
            <s-link href={d.links.activateWithdrawalEmbed} target="_blank">{s["dash.step1.link"]}</s-link>. {s["dash.step1.alt"]}
          </s-list-item>
          <s-list-item>
            <s-text type="strong">{s["dash.step2.title"]}</s-text> {fill(s["dash.step2.body"], { label: d.labels.withdraw })}
          </s-list-item>
          <s-list-item>
            <s-text type="strong">{s["dash.step3.title"]}</s-text> {s["dash.step3.body"]}{" "}
            <s-text type="strong">{d.merchantEmail || s["common.noAddress"]}</s-text>.{" "}
            <s-link href="/app/settings">{s["dash.step3.link"]}</s-link>
          </s-list-item>
          <s-list-item>
            <s-text type="strong">{s["dash.step4.title"]}</s-text> {fill(s["dash.step4.body"], { days })}{" "}
            <s-link href="/app/guarantee">{s["dash.step4.link"]}</s-link>
            {!d.isPro && ` ${s["dash.proOnly"]}`}
          </s-list-item>
        </s-ordered-list>
      </s-section>

      <s-section slot="aside" heading={s["dash.legal"]}>
        <s-unordered-list>
          <s-list-item>{s["dash.legal1"]}</s-list-item>
          <s-list-item>{s["dash.legal2"]}</s-list-item>
          <s-list-item>{s["dash.legal3"]}</s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading={s["dash.plan"]}>
        <s-paragraph>
          {s["dash.currentPlan"]} <s-badge tone={d.isPro ? "success" : "info"}>{d.plan ?? s["dash.trial"]}</s-badge>
        </s-paragraph>
        <s-paragraph>
          <s-link href="/app/billing">{s["dash.managePlan"]}</s-link>
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

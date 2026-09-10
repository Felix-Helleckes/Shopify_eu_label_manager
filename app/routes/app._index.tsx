import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import { requireShop, themeEditorLinks } from "../lib/admin.server";
import { isMailConfigured } from "../lib/email.server";
import { OFFICIAL_LABELS } from "../lib/labels";
import { PLAN_PRO } from "../lib/plans";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { shop, plan } = await requireShop(request);
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const where = { shop: shop.domain };
  const [total, last30, open, ackFailed, latest] = await Promise.all([
    db.withdrawal.count({ where }),
    db.withdrawal.count({ where: { ...where, submittedAt: { gte: since } } }),
    db.withdrawal.count({ where: { ...where, status: "received" } }),
    db.withdrawal.count({ where: { ...where, ackSentAt: null, anonymizedAt: null } }),
    db.withdrawal.findFirst({ where, orderBy: { submittedAt: "desc" }, select: { submittedAt: true, receiptNo: true } }),
  ]);
  const labels = OFFICIAL_LABELS[(shop.shopLocale || "de").split("-")[0]] ?? OFFICIAL_LABELS.de;
  return {
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

export default function Dashboard() {
  const d = useLoaderData<typeof loader>();
  const today = new Date();
  const guaranteeDeadline = new Date("2026-09-27T00:00:00Z");
  const daysToGuarantee = Math.ceil((guaranteeDeadline.getTime() - today.getTime()) / 86400000);

  return (
    <s-page heading="EU Compliance Suite">
      {!d.mailConfigured && (
        <s-banner heading="E-Mail-Versand nicht konfiguriert" tone="critical">
          <s-paragraph>
            Eingangsbestätigungen können derzeit nicht versendet werden. Die Widerrufserklärungen werden trotzdem
            gespeichert. Bitte hinterlegen Sie die SMTP-Zugangsdaten in der Server-Konfiguration (siehe README).
          </s-paragraph>
        </s-banner>
      )}
      {d.stats.ackFailed > 0 && (
        <s-banner heading="Eingangsbestätigungen fehlgeschlagen" tone="warning">
          <s-paragraph>
            Bei {String(d.stats.ackFailed)} Widerruf(en) konnte die Eingangsbestätigung nicht zugestellt werden.
            Bitte prüfen Sie diese Fälle unter <s-link href="/app/withdrawals?status=ack_failed">Widerrufe</s-link> und
            bestätigen Sie den Eingang notfalls manuell (§ 356a Abs. 4 BGB verlangt eine unverzügliche Bestätigung).
          </s-paragraph>
        </s-banner>
      )}

      <s-section heading="Widerrufe">
        <s-stack direction="inline" gap="large">
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>{String(d.stats.last30)}</s-heading>
            <s-text>in den letzten 30 Tagen</s-text>
          </s-box>
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>{String(d.stats.open)}</s-heading>
            <s-text>noch unbearbeitet</s-text>
          </s-box>
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>{String(d.stats.total)}</s-heading>
            <s-text>insgesamt</s-text>
          </s-box>
        </s-stack>
        <s-paragraph>
          <s-link href="/app/withdrawals">Alle Widerrufe anzeigen</s-link>
        </s-paragraph>
      </s-section>

      <s-section heading="Einrichtung">
        <s-ordered-list>
          <s-list-item>
            <s-text type="strong">Widerrufsbutton platzieren.</s-text> Aktivieren Sie die App-Einbettung „Widerrufsbutton
            (alle Seiten)“ im Theme-Editor. Sie zeigt auf jeder Seite den Button „{d.labels.withdraw}“ an, wie es
            Art. 11a Abs. 1 VRRL / § 356a Abs. 1 BGB verlangt (ständig verfügbar, hervorgehoben, leicht zugänglich).{" "}
            <s-link href={d.links.activateWithdrawalEmbed} target="_blank">Theme-Editor öffnen</s-link>. Alternativ
            fügen Sie den Block „Widerrufsbutton“ auf einer eigenen Seite oder im Footer ein.
          </s-list-item>
          <s-list-item>
            <s-text type="strong">Widerrufsbelehrung ergänzen.</s-text> Fügen Sie Ihrer Widerrufsbelehrung einen Satz
            hinzu, z. B.: „Sie können den Vertrag auch über die Widerrufsfunktion in unserem Onlineshop widerrufen. Der
            Button ‚{d.labels.withdraw}‘ ist auf jeder Seite unseres Shops erreichbar.“ (Art. 6 Abs. 1 lit. h VRRL).
          </s-list-item>
          <s-list-item>
            <s-text type="strong">E-Mail-Adresse prüfen.</s-text> Benachrichtigungen über neue Widerrufe gehen an{" "}
            <s-text type="strong">{d.merchantEmail || "– keine Adresse hinterlegt –"}</s-text>.{" "}
            <s-link href="/app/settings">Einstellungen</s-link>
          </s-list-item>
          <s-list-item>
            <s-text type="strong">Gewährleistungshinweis und GARAN-Kennzeichnung</s-text> (Pflicht ab 27.09.2026,{" "}
            {daysToGuarantee > 0 ? `noch ${daysToGuarantee} Tage` : "bereits in Kraft"}).{" "}
            <s-link href="/app/guarantee">Blöcke einrichten</s-link>
            {!d.isPro && " – im Pro-Tarif enthalten."}
          </s-list-item>
        </s-ordered-list>
      </s-section>

      <s-section slot="aside" heading="Rechtsgrundlagen">
        <s-unordered-list>
          <s-list-item>Widerrufsfunktion: Art. 11a Richtlinie 2011/83/EU (eingefügt durch RL (EU) 2023/2673), § 356a BGB – gilt seit 19.06.2026</s-list-item>
          <s-list-item>Gewährleistungshinweis und Haltbarkeits-Kennzeichnung: RL (EU) 2024/825, Durchführungs-VO (EU) 2025/1960 – ab 27.09.2026</s-list-item>
          <s-list-item>Recht auf Reparatur: RL (EU) 2024/1799 – für Kaufverträge ab 31.07.2026</s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Tarif">
        <s-paragraph>
          Aktueller Tarif: <s-badge tone={d.isPro ? "success" : "info"}>{d.plan ?? "Test"}</s-badge>
        </s-paragraph>
        <s-paragraph>
          <s-link href="/app/billing">Tarif verwalten</s-link>
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

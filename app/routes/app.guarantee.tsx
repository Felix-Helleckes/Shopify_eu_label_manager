import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import { requireShop, themeEditorLinks } from "../lib/admin.server";
import { ensureProductDefinitions, listProductDefinitions, PRODUCT_DEFINITIONS } from "../lib/metafields.server";
import { PLAN_PRO } from "../lib/plans";

const DEFAULT_REPAIR_TEXT =
  "Hinweis zum Recht auf Reparatur: Bei einem Mangel innerhalb der gesetzlichen Gewährleistung können Sie zwischen Nachbesserung (Reparatur) und Ersatzlieferung wählen. Entscheiden Sie sich für die Reparatur, verlängert sich die Gewährleistungsfrist einmalig um zwölf Monate (Richtlinie (EU) 2024/1799, gilt für Kaufverträge ab dem 31. Juli 2026).";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { shop, plan, admin } = await requireShop(request);
  let definedKeys: string[] = [];
  try {
    definedKeys = await listProductDefinitions(admin);
  } catch (error) {
    console.error("[guarantee] definitions lookup failed", error);
  }
  return {
    isPro: plan === PLAN_PRO,
    settings: {
      guaranteeNoticeEnabled: shop.guaranteeNoticeEnabled,
      durabilityLabelEnabled: shop.durabilityLabelEnabled,
      repairInfoEnabled: shop.repairInfoEnabled,
      repairInfoText: shop.repairInfoText ?? DEFAULT_REPAIR_TEXT,
    },
    definitions: PRODUCT_DEFINITIONS.map((d) => ({ key: d.key, name: d.name, exists: definedKeys.includes(d.key) })),
    links: themeEditorLinks(shop.domain),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, admin } = await requireShop(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "save");

  if (intent === "createDefinitions") {
    try {
      const { created, errors } = await ensureProductDefinitions(admin);
      if (errors.length) return { ok: false, message: `Fehler beim Anlegen: ${errors.join("; ")}` };
      return { ok: true, message: created.length ? `Metafeld-Definitionen angelegt: ${created.join(", ")}` : "Alle Metafeld-Definitionen sind bereits vorhanden." };
    } catch (error) {
      return { ok: false, message: `Fehler: ${error instanceof Error ? error.message : String(error)}` };
    }
  }

  await db.shop.update({
    where: { domain: shop.domain },
    data: {
      guaranteeNoticeEnabled: form.has("guaranteeNoticeEnabled"),
      durabilityLabelEnabled: form.has("durabilityLabelEnabled"),
      repairInfoEnabled: form.has("repairInfoEnabled"),
      repairInfoText: String(form.get("repairInfoText") || "").trim().slice(0, 2000) || null,
    },
  });
  return { ok: true, message: "Einstellungen gespeichert." };
};

export default function Guarantee() {
  const { isPro, settings, definitions, links } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  return (
    <s-page heading="Gewährleistung, Garantie und Reparatur">
      {result && (
        <s-banner tone={result.ok ? "success" : "critical"}>
          <s-paragraph>{result.message}</s-paragraph>
        </s-banner>
      )}
      {!isPro && (
        <s-banner heading="Pro-Tarif erforderlich" tone="info">
          <s-paragraph>
            Die Theme-Blöcke für Gewährleistungshinweis, GARAN-Kennzeichnung und Reparaturhinweis sind im Pro-Tarif
            enthalten. <s-link href="/app/billing">Tarif wechseln</s-link>
          </s-paragraph>
        </s-banner>
      )}

      <s-section heading="1. Harmonisierter Hinweis zur gesetzlichen Gewährleistung">
        <s-paragraph>
          Ab dem 27. September 2026 müssen Händler Verbraucher vor Vertragsschluss mit der amtlichen „harmonisierten
          Mitteilung“ an die gesetzliche Gewährleistung erinnern (Art. 6 Abs. 1 lit. l Richtlinie 2011/83/EU in der
          Fassung der Richtlinie (EU) 2024/825; Gestaltung nach Durchführungsverordnung (EU) 2025/1960). Der Block zeigt
          die unveränderte amtliche Grafik in der Sprache des Shops – online zwingend in Farbe.
        </s-paragraph>
        <s-paragraph>
          Empfohlene Platzierung: auf jeder Produktseite unterhalb des Kaufbuttons oder als aufklappbarer Bereich im
          Warenkorb.{" "}
          <s-link href={links.addNoticeBlock} target="_blank">Block „Gewährleistungshinweis“ im Theme-Editor hinzufügen</s-link>
        </s-paragraph>
      </s-section>

      <s-section heading="2. GARAN-Kennzeichnung für Haltbarkeitsgarantien">
        <s-paragraph>
          Bietet der Hersteller kostenlos eine gewerbliche Haltbarkeitsgarantie von mehr als zwei Jahren für die gesamte
          Ware an, muss der Händler dies mit der amtlichen GARAN-Kennzeichnung angeben (Art. 6 Abs. 1 lit. la Richtlinie
          2011/83/EU). Der Block liest Dauer, Hersteller und Modellkennung aus Produkt-Metafeldern und zeigt die
          Kennzeichnung nur an, wenn die Dauer über zwei Jahren liegt.
        </s-paragraph>
        <s-unordered-list>
          {definitions.map((d) => (
            <s-list-item key={d.key}>
              <s-text type="strong">{d.name}</s-text> – <code>eu_compliance.{d.key}</code>{" "}
              {d.exists ? <s-badge tone="success">angelegt</s-badge> : <s-badge tone="warning">fehlt</s-badge>}
            </s-list-item>
          ))}
        </s-unordered-list>
        <Form method="post">
          <input type="hidden" name="intent" value="createDefinitions" />
          <s-stack direction="inline" gap="base">
            <s-button type="submit" {...(busy ? { loading: true } : {})}>
              Metafeld-Definitionen anlegen
            </s-button>
            <s-link href={links.addLabelBlock} target="_blank">Block „GARAN-Kennzeichnung“ im Theme-Editor hinzufügen</s-link>
          </s-stack>
        </Form>
        <s-paragraph>
          Nach dem Anlegen erscheinen die Felder im Shopify-Admin auf jeder Produktseite unter „Metafelder“.
        </s-paragraph>
      </s-section>

      <Form method="post">
        <input type="hidden" name="intent" value="save" />
        <s-section heading="3. Hinweis zum Recht auf Reparatur">
          <s-stack direction="block" gap="base">
            <s-paragraph>
              Für Kaufverträge ab dem 31. Juli 2026 muss der Verkäufer den Verbraucher über die Wahl zwischen Reparatur
              und Ersatz sowie die Verlängerung der Gewährleistungsfrist um zwölf Monate bei Reparatur informieren
              (Art. 13 Abs. 2a Richtlinie (EU) 2019/771 i. d. F. der Richtlinie (EU) 2024/1799). Der optionale Block
              zeigt diesen Hinweis auf Produktseiten an.
            </s-paragraph>
            <s-checkbox label="Reparaturhinweis-Block aktivieren" name="repairInfoEnabled" {...(settings.repairInfoEnabled ? { checked: true } : {})} />
            <s-text-area label="Text des Hinweises" name="repairInfoText" value={settings.repairInfoText} rows={5} />
            <s-checkbox label="Gewährleistungshinweis-Block aktiv" name="guaranteeNoticeEnabled" {...(settings.guaranteeNoticeEnabled ? { checked: true } : {})} />
            <s-checkbox label="GARAN-Kennzeichnungs-Block aktiv" name="durabilityLabelEnabled" {...(settings.durabilityLabelEnabled ? { checked: true } : {})} />
            <s-button type="submit" variant="primary" {...(busy ? { loading: true } : {})}>
              Speichern
            </s-button>
            <s-link href={links.addRepairBlock} target="_blank">Block „Reparaturhinweis“ im Theme-Editor hinzufügen</s-link>
          </s-stack>
        </s-section>
      </Form>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

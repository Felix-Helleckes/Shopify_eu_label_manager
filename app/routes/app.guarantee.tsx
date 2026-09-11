import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import { requireShop, themeEditorLinks } from "../lib/admin.server";
import { ensureProductDefinitions, listProductDefinitions, PRODUCT_DEFINITIONS } from "../lib/metafields.server";
import { en, type AdminKey } from "../lib/admin-i18n";

const KEYS = Object.keys(en).filter((k) => k.startsWith("gu.") || k.startsWith("common.")) as AdminKey[];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { shop, admin, t } = await requireShop(request);
  let definedKeys: string[] = [];
  try {
    definedKeys = await listProductDefinitions(admin);
  } catch (error) {
    console.error("[guarantee] definitions lookup failed", error);
  }
  const s = Object.fromEntries(KEYS.map((k) => [k, t(k)])) as Record<AdminKey, string>;
  return {
    s,
    save: t("common.save"),
    settings: {
      guaranteeNoticeEnabled: shop.guaranteeNoticeEnabled,
      durabilityLabelEnabled: shop.durabilityLabelEnabled,
      repairInfoEnabled: shop.repairInfoEnabled,
      repairInfoText: shop.repairInfoText ?? t("gu.defaultRepairText"),
    },
    definitions: PRODUCT_DEFINITIONS.map((d) => ({ key: d.key, name: d.name, exists: definedKeys.includes(d.key) })),
    links: themeEditorLinks(shop.domain),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, admin, t } = await requireShop(request);
  const form = await request.formData();
  const intent = String(form.get("intent") || "save");

  if (intent === "createDefinitions") {
    try {
      const { created, errors } = await ensureProductDefinitions(admin);
      if (errors.length) return { ok: false, message: t("gu.errCreate", { errors: errors.join("; ") }) };
      return { ok: true, message: created.length ? t("gu.createdDefs", { list: created.join(", ") }) : t("gu.allExist") };
    } catch (error) {
      return { ok: false, message: t("gu.error", { message: error instanceof Error ? error.message : String(error) }) };
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
  return { ok: true, message: t("common.saved") };
};

export default function Guarantee() {
  const { s, save, settings, definitions, links } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  return (
    <s-page heading={s["gu.title"]}>
      {result && (
        <s-banner tone={result.ok ? "success" : "critical"}>
          <s-paragraph>{result.message}</s-paragraph>
        </s-banner>
      )}
      <s-section heading={s["gu.s1.title"]}>
        <s-paragraph>{s["gu.s1.body"]}</s-paragraph>
        <s-paragraph>
          {s["gu.s1.placement"]} <s-link href={links.addNoticeBlock} target="_blank">{s["gu.s1.link"]}</s-link>
        </s-paragraph>
        <s-paragraph>{s["common.saveInEditor"]}</s-paragraph>
      </s-section>

      <s-section heading={s["gu.s2.title"]}>
        <s-paragraph>{s["gu.s2.body"]}</s-paragraph>
        <s-unordered-list>
          {definitions.map((d) => (
            <s-list-item key={d.key}>
              <s-text type="strong">{d.name}</s-text> – <code>eu_compliance.{d.key}</code>{" "}
              {d.exists ? <s-badge tone="success">{s["gu.created"]}</s-badge> : <s-badge tone="warning">{s["gu.missing"]}</s-badge>}
            </s-list-item>
          ))}
        </s-unordered-list>
        <Form method="post">
          <input type="hidden" name="intent" value="createDefinitions" />
          <s-stack direction="inline" gap="base">
            <s-button type="submit" {...(busy ? { loading: true } : {})}>
              {s["gu.createDefs"]}
            </s-button>
            <s-link href={links.addLabelBlock} target="_blank">{s["gu.s2.link"]}</s-link>
          </s-stack>
        </Form>
        <s-paragraph>{s["gu.s2.after"]} {s["common.saveInEditor"]}</s-paragraph>
      </s-section>

      <Form method="post">
        <input type="hidden" name="intent" value="save" />
        <s-section heading={s["gu.s3.title"]}>
          <s-stack direction="block" gap="base">
            <s-paragraph>{s["gu.s3.body"]}</s-paragraph>
            <s-checkbox label={s["gu.repairEnable"]} name="repairInfoEnabled" {...(settings.repairInfoEnabled ? { checked: true } : {})} />
            <s-text-area label={s["gu.repairText"]} name="repairInfoText" value={settings.repairInfoText} rows={5} />
            <s-checkbox label={s["gu.noticeEnabled"]} name="guaranteeNoticeEnabled" {...(settings.guaranteeNoticeEnabled ? { checked: true } : {})} />
            <s-checkbox label={s["gu.labelEnabled"]} name="durabilityLabelEnabled" {...(settings.durabilityLabelEnabled ? { checked: true } : {})} />
            <s-button type="submit" variant="primary" {...(busy ? { loading: true } : {})}>
              {save}
            </s-button>
            <s-link href={links.addRepairBlock} target="_blank">{s["gu.s3.link"]}</s-link>
            <s-paragraph>{s["common.saveInEditor"]}</s-paragraph>
          </s-stack>
        </s-section>
      </Form>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

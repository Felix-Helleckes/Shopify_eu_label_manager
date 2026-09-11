import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import { requireShop } from "../lib/admin.server";
import { isMailConfigured } from "../lib/email.server";
import { SUPPORTED_ACK_LOCALES } from "../lib/i18n.server";
import { EU_LANGUAGE_NAMES } from "../lib/labels";
import { ADMIN_LOCALES, ADMIN_LOCALE_NAMES, isAdminLocale, translator } from "../lib/admin-i18n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { shop, t } = await requireShop(request);
  return {
    settings: {
      merchantEmail: shop.merchantEmail ?? "",
      notifyMerchant: shop.notifyMerchant,
      replyToEmail: shop.replyToEmail ?? "",
      tagOrders: shop.tagOrders,
      orderTag: shop.orderTag,
      ackLanguageMode: shop.ackLanguageMode,
      extraAckText: shop.extraAckText ?? "",
      adminLocale: shop.adminLocale ?? "",
    },
    shopEmail: shop.email ?? "",
    mailConfigured: isMailConfigured(),
    locales: SUPPORTED_ACK_LOCALES,
    adminLocales: ADMIN_LOCALES.map((l) => ({ value: l, label: ADMIN_LOCALE_NAMES[l] })),
    s: {
      title: t("set.title"),
      smtpTitle: t("set.smtp.title"),
      smtpBody: t("set.smtp.body"),
      language: t("set.language"),
      languageField: t("set.languageField"),
      languageAuto: t("set.languageAuto"),
      notifications: t("set.notifications"),
      notify: t("set.notify"),
      recipient: t("set.recipient"),
      recipientDetails: t("set.recipientDetails", { suffix: shop.email ? ` (${shop.email})` : "" }),
      replyTo: t("set.replyTo"),
      replyToDetails: t("set.replyToDetails"),
      ack: t("set.ack"),
      ackLanguage: t("set.ackLanguage"),
      ackAuto: t("set.ackAuto"),
      always: t("set.always", { language: "{language}" }),
      extraText: t("set.extraText"),
      extraDetails: t("set.extraDetails"),
      orders: t("set.orders"),
      tagOrders: t("set.tagOrders"),
      tag: t("set.tag"),
      save: t("common.save"),
    },
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, t: tCurrent } = await requireShop(request);
  const form = await request.formData();
  const str = (k: string, max = 300) => String(form.get(k) ?? "").trim().slice(0, max);

  const adminLocaleRaw = str("adminLocale", 5);
  const adminLocale = isAdminLocale(adminLocaleRaw) ? adminLocaleRaw : null;
  // Messages in the language the merchant just chose.
  const t = adminLocale ? translator(adminLocale) : tCurrent;

  const merchantEmail = str("merchantEmail");
  const replyToEmail = str("replyToEmail");
  const errors: Record<string, string> = {};
  if (merchantEmail && !EMAIL_RE.test(merchantEmail)) errors.merchantEmail = t("common.invalidEmail");
  if (replyToEmail && !EMAIL_RE.test(replyToEmail)) errors.replyToEmail = t("common.invalidEmail");
  const orderTag = str("orderTag", 40) || "EU-Widerruf";
  const ackLanguageMode = str("ackLanguageMode", 12) || "storefront";
  if (ackLanguageMode !== "storefront" && !SUPPORTED_ACK_LOCALES.includes(ackLanguageMode)) errors.ackLanguageMode = t("common.invalidLanguage");
  if (Object.keys(errors).length) return { ok: false, errors, message: t("common.checkInput") };

  await db.shop.update({
    where: { domain: shop.domain },
    data: {
      merchantEmail: merchantEmail || null,
      notifyMerchant: form.has("notifyMerchant"),
      replyToEmail: replyToEmail || null,
      tagOrders: form.has("tagOrders"),
      orderTag,
      ackLanguageMode,
      extraAckText: str("extraAckText", 1500) || null,
      adminLocale,
    },
  });
  return { ok: true, errors: {}, message: t("common.saved") };
};

export default function Settings() {
  const { settings, shopEmail, mailConfigured, locales, adminLocales, s } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  const errors = result?.errors ?? {};

  return (
    <s-page heading={s.title}>
      {result && (
        <s-banner tone={result.ok ? "success" : "critical"}>
          <s-paragraph>{result.message}</s-paragraph>
        </s-banner>
      )}
      {!mailConfigured && (
        <s-banner heading={s.smtpTitle} tone="critical">
          <s-paragraph>{s.smtpBody}</s-paragraph>
        </s-banner>
      )}
      <Form method="post">
        <s-section heading={s.language}>
          <s-select label={s.languageField} name="adminLocale" value={settings.adminLocale}>
            <s-option value="">{s.languageAuto}</s-option>
            {adminLocales.map((l) => (
              <s-option key={l.value} value={l.value}>
                {l.label}
              </s-option>
            ))}
          </s-select>
        </s-section>

        <s-section heading={s.notifications}>
          <s-stack direction="block" gap="base">
            <s-checkbox label={s.notify} name="notifyMerchant" {...(settings.notifyMerchant ? { checked: true } : {})} />
            <s-text-field
              label={s.recipient}
              name="merchantEmail"
              value={settings.merchantEmail}
              placeholder={shopEmail || "shop@example.com"}
              details={s.recipientDetails}
              {...(errors.merchantEmail ? { error: errors.merchantEmail } : {})}
            />
            <s-text-field
              label={s.replyTo}
              name="replyToEmail"
              value={settings.replyToEmail}
              details={s.replyToDetails}
              {...(errors.replyToEmail ? { error: errors.replyToEmail } : {})}
            />
          </s-stack>
        </s-section>

        <s-section heading={s.ack}>
          <s-stack direction="block" gap="base">
            <s-select label={s.ackLanguage} name="ackLanguageMode" value={settings.ackLanguageMode} {...(errors.ackLanguageMode ? { error: errors.ackLanguageMode } : {})}>
              <s-option value="storefront">{s.ackAuto}</s-option>
              {locales.map((l) => (
                <s-option key={l} value={l}>
                  {s.always.replace("{language}", EU_LANGUAGE_NAMES[l] ?? l)}
                </s-option>
              ))}
            </s-select>
            <s-text-area label={s.extraText} name="extraAckText" value={settings.extraAckText} rows={5} details={s.extraDetails} />
          </s-stack>
        </s-section>

        <s-section heading={s.orders}>
          <s-stack direction="block" gap="base">
            <s-checkbox label={s.tagOrders} name="tagOrders" {...(settings.tagOrders ? { checked: true } : {})} />
            <s-text-field label={s.tag} name="orderTag" value={settings.orderTag} />
          </s-stack>
        </s-section>

        <s-section>
          <s-button type="submit" variant="primary" {...(nav.state !== "idle" ? { loading: true } : {})}>
            {s.save}
          </s-button>
        </s-section>
      </Form>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

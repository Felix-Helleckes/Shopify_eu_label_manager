import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import { requireShop } from "../lib/admin.server";
import { isMailConfigured } from "../lib/email.server";
import { SUPPORTED_ACK_LOCALES } from "../lib/i18n.server";
import { EU_LANGUAGE_NAMES } from "../lib/labels";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { shop } = await requireShop(request);
  return {
    settings: {
      merchantEmail: shop.merchantEmail ?? "",
      notifyMerchant: shop.notifyMerchant,
      replyToEmail: shop.replyToEmail ?? "",
      tagOrders: shop.tagOrders,
      orderTag: shop.orderTag,
      ackLanguageMode: shop.ackLanguageMode,
      extraAckText: shop.extraAckText ?? "",
    },
    shopEmail: shop.email ?? "",
    mailConfigured: isMailConfigured(),
    locales: SUPPORTED_ACK_LOCALES,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop } = await requireShop(request);
  const form = await request.formData();
  const str = (k: string, max = 300) => String(form.get(k) ?? "").trim().slice(0, max);

  const merchantEmail = str("merchantEmail");
  const replyToEmail = str("replyToEmail");
  const errors: Record<string, string> = {};
  if (merchantEmail && !EMAIL_RE.test(merchantEmail)) errors.merchantEmail = "Ungültige E-Mail-Adresse";
  if (replyToEmail && !EMAIL_RE.test(replyToEmail)) errors.replyToEmail = "Ungültige E-Mail-Adresse";
  const orderTag = str("orderTag", 40) || "EU-Widerruf";
  const ackLanguageMode = str("ackLanguageMode", 12) || "storefront";
  if (ackLanguageMode !== "storefront" && !SUPPORTED_ACK_LOCALES.includes(ackLanguageMode)) errors.ackLanguageMode = "Ungültige Sprache";
  if (Object.keys(errors).length) return { ok: false, errors, message: "Bitte Eingaben prüfen." };

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
    },
  });
  return { ok: true, errors: {}, message: "Einstellungen gespeichert." };
};

export default function Settings() {
  const { settings, shopEmail, mailConfigured, locales } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  const errors = result?.errors ?? {};

  return (
    <s-page heading="Einstellungen">
      {result && (
        <s-banner tone={result.ok ? "success" : "critical"}>
          <s-paragraph>{result.message}</s-paragraph>
        </s-banner>
      )}
      {!mailConfigured && (
        <s-banner heading="SMTP nicht konfiguriert" tone="critical">
          <s-paragraph>Der E-Mail-Versand ist serverseitig nicht eingerichtet; Eingangsbestätigungen werden nicht zugestellt.</s-paragraph>
        </s-banner>
      )}
      <Form method="post">
        <s-section heading="Benachrichtigungen">
          <s-stack direction="block" gap="base">
            <s-checkbox label="Bei jedem neuen Widerruf per E-Mail benachrichtigen" name="notifyMerchant" {...(settings.notifyMerchant ? { checked: true } : {})} />
            <s-text-field
              label="Empfänger-Adresse für Benachrichtigungen"
              name="merchantEmail"
              value={settings.merchantEmail}
              placeholder={shopEmail || "shop@example.com"}
              details={`Leer lassen, um die Shop-Adresse zu verwenden${shopEmail ? ` (${shopEmail})` : ""}.`}
              {...(errors.merchantEmail ? { error: errors.merchantEmail } : {})}
            />
            <s-text-field
              label="Antwort-Adresse (Reply-To) in Eingangsbestätigungen"
              name="replyToEmail"
              value={settings.replyToEmail}
              details="Antwortet der Kunde auf die Eingangsbestätigung, geht die Antwort an diese Adresse."
              {...(errors.replyToEmail ? { error: errors.replyToEmail } : {})}
            />
          </s-stack>
        </s-section>

        <s-section heading="Eingangsbestätigung an den Kunden">
          <s-stack direction="block" gap="base">
            <s-select label="Sprache der Eingangsbestätigung" name="ackLanguageMode" value={settings.ackLanguageMode} {...(errors.ackLanguageMode ? { error: errors.ackLanguageMode } : {})}>
              <s-option value="storefront">Automatisch (Sprache des Shops, in der der Kunde den Widerruf abgegeben hat)</s-option>
              {locales.map((l) => (
                <s-option key={l} value={l}>
                  Immer {EU_LANGUAGE_NAMES[l] ?? l}
                </s-option>
              ))}
            </s-select>
            <s-text-area
              label="Zusätzlicher Text am Ende der Eingangsbestätigung (optional)"
              name="extraAckText"
              value={settings.extraAckText}
              rows={5}
              details="Zum Beispiel Hinweise zur Rücksendung. Der gesetzliche Pflichtinhalt (Inhalt der Erklärung, Datum und Uhrzeit) wird immer automatisch eingefügt."
            />
          </s-stack>
        </s-section>

        <s-section heading="Bestellungen in Shopify">
          <s-stack direction="block" gap="base">
            <s-checkbox label="Zugeordnete Bestellung automatisch taggen und Widerrufsdaten als Metafeld speichern" name="tagOrders" {...(settings.tagOrders ? { checked: true } : {})} />
            <s-text-field label="Tag" name="orderTag" value={settings.orderTag} />
          </s-stack>
        </s-section>

        <s-section>
          <s-button type="submit" variant="primary" {...(nav.state !== "idle" ? { loading: true } : {})}>
            Speichern
          </s-button>
        </s-section>
      </Form>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);

import crypto from "node:crypto";
import type { Shop, Withdrawal } from "@prisma/client";
import prisma from "../db.server";
import { sendMail } from "./email.server";
import { ackStrings, fill, merchantStrings, pickLocale } from "./i18n.server";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type WithdrawalInput = {
  consumerName: string;
  contractRef: string;
  contactEmail: string;
  orderDate?: string;
  details?: string;
  locale?: string;
};

export type SubmissionMeta = {
  ip?: string | null;
  userAgent?: string | null;
};

export type GraphqlClient = {
  graphql: (query: string, options?: { variables?: Record<string, unknown> }) => Promise<Response>;
};

export type ValidationResult =
  | { ok: true; value: WithdrawalInput }
  | { ok: false; errors: Record<string, string> };

/* ------------------------------------------------------------------ */
/* Pure helpers (unit-tested)                                          */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g;
const MAX = { name: 200, contract: 120, email: 254, orderDate: 60, details: 2000 };

function clean(value: unknown, max: number, multiline = false): string {
  if (typeof value !== "string") return "";
  let s = value.replace(CONTROL_CHARS, "").replace(/\r\n?/g, "\n");
  s = multiline ? s.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n") : s.replace(/\s+/g, " ");
  return s.trim().slice(0, max);
}

/**
 * Validates a submitted withdrawal statement. Only the three fields required by
 * Art. 11a(2) CRD are mandatory; everything else is optional.
 */
export function validateInput(raw: unknown): ValidationResult {
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const value: WithdrawalInput = {
    consumerName: clean(body.consumerName ?? body.name, MAX.name),
    contractRef: clean(body.contractRef ?? body.orderNumber, MAX.contract),
    contactEmail: clean(body.contactEmail ?? body.email, MAX.email).toLowerCase(),
    orderDate: clean(body.orderDate, MAX.orderDate) || undefined,
    details: clean(body.details, MAX.details, true) || undefined,
    locale: clean(body.locale, 12) || undefined,
  };
  const errors: Record<string, string> = {};
  if (value.consumerName.length < 2) errors.consumerName = "required";
  if (value.contractRef.length < 1) errors.contractRef = "required";
  if (!EMAIL_RE.test(value.contactEmail)) errors.contactEmail = "invalid";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value };
}

/** Extracts the numeric part of an order reference such as "#1001", "Bestellung 1001" or "DE-1001". */
export function normalizeOrderRef(ref: string): { raw: string; number: string | null } {
  const raw = ref.trim();
  const match = raw.match(/(\d{3,})/);
  return { raw, number: match ? match[1] : null };
}

/** Builds the Shopify order search query used to match a withdrawal to an order. */
export function buildOrderSearchQuery(ref: string): string {
  const { raw, number } = normalizeOrderRef(ref);
  const candidates = new Set<string>();
  if (raw) candidates.add(raw);
  if (number) {
    candidates.add(`#${number}`);
    candidates.add(number);
  }
  return Array.from(candidates)
    .map((c) => `name:${JSON.stringify(c)}`)
    .join(" OR ");
}

export function computeContentHash(fields: {
  shop: string;
  consumerName: string;
  contractRef: string;
  contactEmail: string;
  orderDate?: string;
  details?: string;
  submittedAt: string;
}): string {
  const canonical = [
    fields.shop,
    fields.consumerName,
    fields.contractRef,
    fields.contactEmail,
    fields.orderDate ?? "",
    fields.details ?? "",
    fields.submittedAt,
  ].join("\n");
  return crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
}

const RECEIPT_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Human-friendly, unguessable reference number, e.g. WR-20260910-K7Q2M9XD */
export function generateReceiptNo(date = new Date()): string {
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const bytes = crypto.randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i++) code += RECEIPT_ALPHABET[bytes[i] % RECEIPT_ALPHABET.length];
  return `WR-${ymd}-${code}`;
}

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const secret = process.env.IP_HASH_SECRET || "eu-compliance-suite";
  return crypto.createHmac("sha256", secret).update(ip).digest("hex").slice(0, 32);
}

export function formatTimestamp(date: Date, locale: string, timeZone: string | null | undefined): string {
  const tz = timeZone || "Europe/Berlin";
  try {
    return (
      new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "medium", timeZone: tz }).format(date) +
      ` (${tz})`
    );
  } catch {
    return date.toISOString();
  }
}

/** Anonymises personal data while keeping the legal evidence (hash, timestamp, reference). */
export function anonymizedFields() {
  return {
    consumerName: "[gelöscht]",
    contactEmail: "redacted@invalid",
    details: null,
    orderDate: null,
    userAgent: null,
    ipHash: null,
    anonymizedAt: new Date(),
  };
}

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = value instanceof Date ? value.toISOString() : String(value);
  // Prevent CSV formula injection in spreadsheet software.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function withdrawalsToCsv(rows: Withdrawal[]): string {
  const header = [
    "receiptNo",
    "submittedAt",
    "status",
    "consumerName",
    "contractRef",
    "contactEmail",
    "orderDate",
    "details",
    "orderName",
    "orderMatched",
    "ackSentAt",
    "merchantNote",
    "contentHash",
  ];
  const lines = [header.join(";")];
  for (const r of rows) {
    lines.push(
      [
        r.receiptNo,
        r.submittedAt,
        r.status,
        r.consumerName,
        r.contractRef,
        r.contactEmail,
        r.orderDate,
        r.details,
        r.orderName,
        r.orderMatched ? "yes" : "no",
        r.ackSentAt,
        r.merchantNote,
        r.contentHash,
      ]
        .map(csvCell)
        .join(";"),
    );
  }
  // UTF-8 BOM so Excel opens the file with the right encoding.
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}

/* ------------------------------------------------------------------ */
/* Rate limiting (per process; good enough for a single Fly machine)   */
/* ------------------------------------------------------------------ */

const buckets = new Map<string, number[]>();

export function isRateLimited(key: string, max = 10, windowMs = 10 * 60 * 1000, now = Date.now()): boolean {
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return true;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return false;
}

/* ------------------------------------------------------------------ */
/* Shopify Admin API helpers                                           */
/* ------------------------------------------------------------------ */

const FIND_ORDER = `#graphql
  query EuComplianceFindOrder($q: String!) {
    orders(first: 5, query: $q, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        name
        createdAt
        cancelledAt
      }
    }
  }
`;

export type MatchedOrder = {
  id: string;
  name: string;
  createdAt: Date;
  emailMatched: boolean | null;
};

export async function findMatchingOrder(
  admin: GraphqlClient,
  contractRef: string,
  contactEmail: string,
): Promise<MatchedOrder | null> {
  const q = buildOrderSearchQuery(contractRef);
  if (!q) return null;
  try {
    const response = await admin.graphql(FIND_ORDER, { variables: { q } });
    const json = (await response.json()) as {
      data?: {
        orders: {
          nodes: {
            id: string;
            name: string;
            createdAt: string;
            cancelledAt: string | null;
          }[];
        };
      };
    };
    const nodes = json.data?.orders.nodes ?? [];
    if (!nodes.length) return null;
    // Data minimisation: we deliberately do not read customer e-mail/name from the order
    // (protected customer data). Matching is by order name only; the consumer's own
    // statement carries the contact address.
    void contactEmail;
    const pick = nodes[0];
    return {
      id: pick.id,
      name: pick.name,
      createdAt: new Date(pick.createdAt),
      emailMatched: null,
    };
  } catch (error) {
    console.error("[withdrawal] order lookup failed", error);
    return null;
  }
}

const TAG_ORDER = `#graphql
  mutation EuComplianceTagOrder($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      userErrors { field message }
    }
  }
`;

const SET_ORDER_METAFIELD = `#graphql
  mutation EuComplianceOrderMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      userErrors { field message }
    }
  }
`;

export async function tagOrder(
  admin: GraphqlClient,
  orderId: string,
  tag: string,
  info: { receiptNo: string; submittedAt: string; consumerName: string; contactEmail: string },
): Promise<boolean> {
  try {
    const tagResponse = await admin.graphql(TAG_ORDER, { variables: { id: orderId, tags: [tag] } });
    const tagJson = (await tagResponse.json()) as { data?: { tagsAdd?: { userErrors: { message: string }[] } } };
    if (tagJson.data?.tagsAdd?.userErrors?.length) {
      console.warn("[withdrawal] tagsAdd userErrors", tagJson.data.tagsAdd.userErrors);
    }
    await admin.graphql(SET_ORDER_METAFIELD, {
      variables: {
        metafields: [
          {
            ownerId: orderId,
            namespace: "eu_compliance",
            key: "withdrawal",
            type: "json",
            value: JSON.stringify(info),
          },
        ],
      },
    });
    return true;
  } catch (error) {
    console.error("[withdrawal] tagging failed", error);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* E-mails                                                             */
/* ------------------------------------------------------------------ */

function escapeHtml(s: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return s.replace(/[&<>"']/g, (c) => map[c]);
}

export type AckSource = {
  receiptNo: string;
  submittedAt: Date;
  consumerName: string;
  contractRef: string;
  contactEmail: string;
  orderDate?: string | null;
  details?: string | null;
};

export function buildAcknowledgement(locale: string, shop: Shop, w: AckSource, extraText?: string | null) {
  const t = ackStrings(locale);
  const shopName = shop.name || shop.domain;
  const when = formatTimestamp(w.submittedAt, locale, shop.timezone);
  const rows: [string, string][] = [
    [t.receivedAt, `${when} / ${w.submittedAt.toISOString()}`],
    [t.receiptNo, w.receiptNo],
    [t.name, w.consumerName],
    [t.contract, w.contractRef],
    [t.email, w.contactEmail],
  ];
  if (w.orderDate) rows.push([t.orderDate, w.orderDate]);
  if (w.details) rows.push([t.details, w.details]);
  rows.push([t.shop, shopName]);

  const subject = fill(t.subject, { contract: w.contractRef, shop: shopName });
  const intro = fill(t.intro, { shop: shopName });
  const footer = fill(t.footer, { shop: shopName });

  const text = [
    t.heading,
    "",
    intro,
    "",
    t.contentTitle + ":",
    ...rows.map(([k, v]) => `- ${k}: ${v}`),
    "",
    t.legal,
    t.next,
    t.keep,
    ...(extraText ? ["", extraText] : []),
    "",
    footer,
  ].join("\n");

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 8px;border:1px solid #ddd;background:#f6f6f6;width:40%">${escapeHtml(k)}</td><td style="padding:6px 8px;border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.5;color:#111;max-width:640px;margin:0 auto;padding:24px">
<h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(t.heading)}</h1>
<p>${escapeHtml(intro)}</p>
<h2 style="font-size:16px;margin:24px 0 8px">${escapeHtml(t.contentTitle)}</h2>
<table style="border-collapse:collapse;width:100%">${tableRows}</table>
<p style="margin-top:24px">${escapeHtml(t.legal)}</p>
<p>${escapeHtml(t.next)}<br>${escapeHtml(t.keep)}</p>
${extraText ? `<p style="white-space:pre-wrap">${escapeHtml(extraText)}</p>` : ""}
<p style="color:#666;font-size:13px;margin-top:32px">${escapeHtml(footer)}</p>
</body></html>`;

  return { subject, text, html };
}

export function adminWithdrawalUrl(shopDomain: string, withdrawalId: string): string {
  const store = shopDomain.replace(".myshopify.com", "");
  const handle = process.env.SHOPIFY_APP_HANDLE || "eu-compliance-suite";
  return `https://admin.shopify.com/store/${store}/apps/${handle}/app/withdrawals/${withdrawalId}`;
}

export function buildMerchantNotification(shop: Shop, w: Withdrawal, opts: { ackSent: boolean }) {
  const t = merchantStrings(shop.shopLocale);
  const shopName = shop.name || shop.domain;
  const when = formatTimestamp(w.submittedAt, shop.shopLocale || "de", shop.timezone);
  const lines = [
    t.heading,
    "",
    fill(t.intro, { shop: shopName }),
    "",
    `${w.receiptNo} – ${when}`,
    `${w.consumerName} <${w.contactEmail}>`,
    `${w.contractRef}${w.orderName ? ` -> ${w.orderName}` : ""}`,
    w.orderDate ? `Datum: ${w.orderDate}` : "",
    w.details ? `Details: ${w.details}` : "",
    "",
    w.orderMatched ? t.orderMatched : t.orderNotMatched,
    opts.ackSent ? t.ackSent : t.ackFailed,
    "",
    `${t.open}: ${adminWithdrawalUrl(shop.domain, w.id)}`,
  ].filter((l) => l !== "");
  return {
    subject: fill(t.subject, { contract: w.contractRef, receiptNo: w.receiptNo }),
    text: lines.join("\n"),
  };
}

/* ------------------------------------------------------------------ */
/* Main flow                                                           */
/* ------------------------------------------------------------------ */

export type ProcessResult = {
  id: string;
  receiptNo: string;
  submittedAt: Date;
  ackSent: boolean;
  orderMatched: boolean;
};

/**
 * Records a withdrawal statement, matches it to an order, sends the acknowledgement
 * of receipt (durable medium) and notifies the merchant.
 *
 * The statement is ALWAYS recorded first: a failing e-mail or order lookup must never
 * prevent the consumer from exercising the right of withdrawal.
 */
export async function processWithdrawal(params: {
  admin: GraphqlClient | undefined;
  shop: Shop;
  input: WithdrawalInput;
  meta: SubmissionMeta;
}): Promise<ProcessResult> {
  const { admin, shop, input, meta } = params;
  const submittedAt = new Date();
  const locale =
    shop.ackLanguageMode && shop.ackLanguageMode !== "storefront"
      ? pickLocale(shop.ackLanguageMode)
      : pickLocale(input.locale, pickLocale(shop.shopLocale));

  const contentHash = computeContentHash({
    shop: shop.domain,
    consumerName: input.consumerName,
    contractRef: input.contractRef,
    contactEmail: input.contactEmail,
    orderDate: input.orderDate,
    details: input.details,
    submittedAt: submittedAt.toISOString(),
  });

  // 1. Persist immediately (legal evidence).
  let record = await prisma.withdrawal.create({
    data: {
      receiptNo: generateReceiptNo(submittedAt),
      shop: shop.domain,
      locale,
      consumerName: input.consumerName,
      contractRef: input.contractRef,
      contactEmail: input.contactEmail,
      orderDate: input.orderDate ?? null,
      details: input.details ?? null,
      submittedAt,
      contentHash,
      userAgent: meta.userAgent?.slice(0, 300) ?? null,
      ipHash: hashIp(meta.ip),
    },
  });

  // 2. Best-effort order matching + tagging.
  if (admin) {
    const order = await findMatchingOrder(admin, input.contractRef, input.contactEmail);
    if (order) {
      let orderTaggedAt: Date | null = null;
      if (shop.tagOrders) {
        const tagged = await tagOrder(admin, order.id, shop.orderTag || "EU-Widerruf", {
          receiptNo: record.receiptNo,
          submittedAt: submittedAt.toISOString(),
          consumerName: input.consumerName,
          contactEmail: input.contactEmail,
        });
        if (tagged) orderTaggedAt = new Date();
      }
      record = await prisma.withdrawal.update({
        where: { id: record.id },
        data: {
          orderId: order.id,
          orderName: order.name,
          orderMatched: true,
          orderEmailMatched: order.emailMatched,
          orderCreatedAt: order.createdAt,
          orderTaggedAt,
        },
      });
    }
  }

  // 3. Acknowledgement of receipt to the consumer (durable medium).
  const ack = buildAcknowledgement(locale, shop, record, shop.extraAckText);
  const ackResult = await sendMail({
    to: record.contactEmail,
    subject: ack.subject,
    text: ack.text,
    html: ack.html,
    replyTo: shop.replyToEmail || shop.merchantEmail || shop.email || undefined,
  });
  record = await prisma.withdrawal.update({
    where: { id: record.id },
    data: ackResult.ok ? { ackSentAt: new Date(), ackError: null } : { ackError: ackResult.error.slice(0, 500) },
  });

  // 4. Merchant notification.
  const merchantTo = shop.merchantEmail || shop.email;
  if (shop.notifyMerchant && merchantTo) {
    const note = buildMerchantNotification(shop, record, { ackSent: ackResult.ok });
    const res = await sendMail({ to: merchantTo, subject: note.subject, text: note.text, replyTo: record.contactEmail });
    if (res.ok) {
      record = await prisma.withdrawal.update({ where: { id: record.id }, data: { merchantNotifiedAt: new Date() } });
    }
  }

  return {
    id: record.id,
    receiptNo: record.receiptNo,
    submittedAt: record.submittedAt,
    ackSent: ackResult.ok,
    orderMatched: record.orderMatched,
  };
}

/** Retries the acknowledgement e-mail for a stored withdrawal (admin action). */
export async function resendAcknowledgement(shop: Shop, withdrawalId: string): Promise<boolean> {
  const record = await prisma.withdrawal.findFirst({ where: { id: withdrawalId, shop: shop.domain } });
  if (!record || record.anonymizedAt) return false;
  const ack = buildAcknowledgement(record.locale, shop, record, shop.extraAckText);
  const res = await sendMail({
    to: record.contactEmail,
    subject: ack.subject,
    text: ack.text,
    html: ack.html,
    replyTo: shop.replyToEmail || shop.merchantEmail || shop.email || undefined,
  });
  await prisma.withdrawal.update({
    where: { id: record.id },
    data: res.ok ? { ackSentAt: new Date(), ackError: null } : { ackError: res.error.slice(0, 500) },
  });
  return res.ok;
}

/** GDPR: anonymise all withdrawals of a shop that belong to the given e-mail addresses. */
export async function anonymizeWithdrawals(shopDomain: string, emails: string[]): Promise<number> {
  const list = emails.map((e) => e.toLowerCase()).filter(Boolean);
  if (!list.length) return 0;
  const result = await prisma.withdrawal.updateMany({
    where: { shop: shopDomain, contactEmail: { in: list }, anonymizedAt: null },
    data: anonymizedFields(),
  });
  return result.count;
}

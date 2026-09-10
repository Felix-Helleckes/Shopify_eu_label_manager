import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { anonymizeWithdrawals } from "../lib/withdrawal.server";

/**
 * Mandatory compliance webhook: erase a customer's personal data.
 * Withdrawal statements are legal evidence for the merchant, so we anonymise the
 * personal fields and keep reference number, timestamp and hash.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  const p = payload as { customer?: { email?: string; id?: number } };
  const emails = [p.customer?.email].filter((e): e is string => Boolean(e));
  const count = await anonymizeWithdrawals(shop, emails);

  await db.auditEvent.create({
    data: { shop, type: "customers/redact", payload: JSON.stringify({ customerId: p.customer?.id, anonymized: count }) },
  });

  return new Response();
};

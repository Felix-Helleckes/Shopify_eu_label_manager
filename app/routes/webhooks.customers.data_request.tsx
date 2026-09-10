import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { sendMail } from "../lib/email.server";

/**
 * Mandatory compliance webhook: a customer requested their data.
 * We store nothing beyond withdrawal statements, so we list those and inform the merchant,
 * who is the data controller and answers the customer.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  const p = payload as { customer?: { email?: string; id?: number }; orders_requested?: number[] };
  const email = p.customer?.email?.toLowerCase();
  const withdrawals = email
    ? await db.withdrawal.findMany({ where: { shop, contactEmail: email }, orderBy: { submittedAt: "desc" } })
    : [];

  await db.auditEvent.create({
    data: {
      shop,
      type: "customers/data_request",
      payload: JSON.stringify({ customerId: p.customer?.id, email, withdrawalIds: withdrawals.map((w) => w.id) }),
    },
  });

  const shopRow = await db.shop.findUnique({ where: { domain: shop } });
  const to = shopRow?.merchantEmail || shopRow?.email;
  if (to) {
    const lines = withdrawals.map(
      (w) => `- ${w.receiptNo} | ${w.submittedAt.toISOString()} | ${w.consumerName} | ${w.contractRef} | ${w.contactEmail}`,
    );
    await sendMail({
      to,
      subject: `Datenauskunft angefragt (Shopify customers/data_request) – ${email ?? "unbekannt"}`,
      text: [
        `Ein Kunde Ihres Shops ${shop} hat über Shopify eine Auskunft über seine Daten angefordert.`,
        `Die EU Compliance Suite speichert zu dieser E-Mail-Adresse folgende Widerrufserklärungen:`,
        lines.length ? lines.join("\n") : "(keine)",
        "",
        "Bitte beantworten Sie die Anfrage als Verantwortlicher innerhalb der gesetzlichen Frist. Die Datensätze können Sie in der App als CSV exportieren.",
      ].join("\n"),
    });
  }

  return new Response();
};

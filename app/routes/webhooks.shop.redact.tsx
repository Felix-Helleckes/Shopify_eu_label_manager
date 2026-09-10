import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

/** Mandatory compliance webhook: 48h after uninstall, delete everything we hold for the shop. */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  await db.withdrawal.deleteMany({ where: { shop } });
  await db.auditEvent.deleteMany({ where: { shop } });
  await db.session.deleteMany({ where: { shop } });
  await db.shop.deleteMany({ where: { domain: shop } });

  return new Response();
};

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, session, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  if (session) {
    await db.session.deleteMany({ where: { shop } });
  }
  await db.shop.updateMany({ where: { domain: shop }, data: { uninstalledAt: new Date() } });
  await db.auditEvent.create({ data: { shop, type: "app/uninstalled" } });

  return new Response();
};

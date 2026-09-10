import db from "../db.server";
import { isMailConfigured, isMailDryRun } from "../lib/email.server";

export const loader = async () => {
  const mail = { configured: isMailConfigured(), dryRun: isMailDryRun(), hasPassword: Boolean(process.env.SMTP_PASS) };
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", time: new Date().toISOString(), mail });
  } catch (error) {
    return Response.json({ status: "error", error: String(error), mail }, { status: 500 });
  }
};

import db from "../db.server";
import { isMailConfigured, isMailDryRun } from "../lib/email.server";

export const loader = async () => {
  const mail = { configured: isMailConfigured(), dryRun: isMailDryRun(), hasPassword: Boolean(process.env.SMTP_PASS) };
  // The privacy policy names the processing location, so it has to be verifiable at runtime.
  // AWS_REGION is set on Netlify/Lambda, FLY_REGION on Fly.io.
  const host = {
    region: process.env.FLY_REGION || process.env.AWS_REGION || null,
    platform: process.env.FLY_APP_NAME ? "fly" : process.env.NETLIFY ? "netlify" : null,
  };
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", time: new Date().toISOString(), mail, host });
  } catch (error) {
    return Response.json({ status: "error", error: String(error), mail, host }, { status: 500 });
  }
};

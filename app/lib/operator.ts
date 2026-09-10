/** Operator (app vendor) details used on legal pages and in e-mails. Configure via env. */
export const operator = {
  name: process.env.APP_OPERATOR_NAME || "Felix Helleckes",
  address: process.env.APP_OPERATOR_ADDRESS || "Köln, Deutschland",
  supportEmail: process.env.APP_SUPPORT_EMAIL || "support@example.com",
  appName: "EU Compliance Suite",
  appUrl: process.env.SHOPIFY_APP_URL || "",
};

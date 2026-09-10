import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

export type OutgoingMail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export type MailResult = { ok: true; messageId?: string } | { ok: false; error: string };

let cachedTransport: nodemailer.Transporter | null = null;

function isDryRun() {
  return process.env.MAIL_DRY_RUN === "true" || (!process.env.SMTP_HOST && process.env.NODE_ENV !== "production");
}

function transport(): nodemailer.Transporter {
  if (cachedTransport) return cachedTransport;
  if (isDryRun()) {
    cachedTransport = nodemailer.createTransport({ jsonTransport: true });
    return cachedTransport;
  }
  cachedTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || "" }
      : undefined,
  });
  return cachedTransport;
}

/** Sends one e-mail. Never throws; returns a result object so callers can record failures. */
export async function sendMail(mail: OutgoingMail): Promise<MailResult> {
  const from = process.env.MAIL_FROM || "EU Compliance Suite <noreply@localhost>";
  const message: Mail.Options = {
    from,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    replyTo: mail.replyTo,
  };
  try {
    const info = await transport().sendMail(message);
    if (isDryRun()) {
      console.log(`[mail:dry-run] to=${mail.to} subject="${mail.subject}"`);
    }
    return { ok: true, messageId: info?.messageId };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[mail] failed to send to ${mail.to}: ${msg}`);
    return { ok: false, error: msg };
  }
}

export function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.MAIL_FROM) || process.env.MAIL_DRY_RUN === "true";
}

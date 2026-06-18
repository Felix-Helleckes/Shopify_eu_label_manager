import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
// In production, you should use environment variables for sensitive data
let transporter;

if (process.env.NODE_ENV === 'production') {
  // Production: use environment variables
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: parseInt(process.env.EMAIL_SMTP_PORT) || 587,
    secure: parseInt(process.env.EMAIL_SMTP_SECURE) === 1, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASS,
    },
  });
} else {
  // Development: use ethereal.email for testing
  // In a real development setup, you might use a different config
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USER, // generated ethereal user
      pass: process.env.ETHEREAL_PASS, // generated ethereal password
    },
  });
}

/**
 * Sends an email using the configured transporter.
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email body
 * @param {string} [options.html] - HTML email body (optional)
 * @returns {Promise<Object>} - Info object from nodemailer
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@eu-compliance-suite-2026.shopifyapps.com',
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Utility to replace placeholders in a template string
export function replacePlaceholders(template, replacements) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return replacements[key] !== undefined ? replacements[key] : match;
  });
}
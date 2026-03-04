import nodemailer from "nodemailer";
import logger from "./logger";

/**
 * Sends an email using SMTP configuration from environment variables.
 * Falls back to logging the email if SMTP is not configured (development mode).
 */
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST) {
    return null;
  }

  const authConfig =
    SMTP_USER && SMTP_PASS
      ? { auth: { user: SMTP_USER, pass: SMTP_PASS } }
      : {};

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT ?? "587"),
    secure: SMTP_PORT === "465",
    ...authConfig,
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = createTransporter();

  if (!transporter) {
    // Dev fallback – log instead of sending
    logger.info(`[EMAIL] To: ${options.to} | Subject: ${options.subject}`);
    logger.info(`[EMAIL BODY] ${options.text ?? options.html}`);
    return;
  }

  await transporter.sendMail({
    from:
      options.from ??
      process.env.EMAIL_FROM ??
      `"Reinvent You 50+" <noreply@reinventyou50.com>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  logger.info(`Email sent to ${options.to}: ${options.subject}`);
};

// ─── Pre-built email templates ────────────────────────────────────────────────

export const sendOrderConfirmationEmail = async (
  email: string,
  order: { _id: string; total: number; items: Array<{ name: string }> },
  bookingLink?: string,
) => {
  const itemList = order.items.map((i) => `<li>${i.name}</li>`).join("");
  const bookingSection = bookingLink
    ? `<p><strong>Your 1-on-1 session booking link:</strong> <a href="${bookingLink}">${bookingLink}</a></p>`
    : "";

  await sendEmail({
    to: email,
    subject: "Order Confirmation – Reinvent You 50+",
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Order ID: <strong>${order._id}</strong></p>
      <p>Total: <strong>$${order.total.toFixed(2)}</strong></p>
      <ul>${itemList}</ul>
      ${bookingSection}
      <p>If you have any questions, reply to this email and we'll be happy to help.</p>
    `,
    text: `Order ${order._id} confirmed. Total: $${order.total.toFixed(2)}.${bookingLink ? ` Book your session here: ${bookingLink}` : ""}`,
  });
};

export const sendMembershipWelcomeEmail = async (
  email: string,
  name: string,
  plan: string,
) => {
  await sendEmail({
    to: email,
    subject: "Welcome to Reinvent You 50+ Membership!",
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>You've successfully started your <strong>${plan}</strong> membership – enjoy your 14-day free trial!</p>
      <p>You'll receive access details and Zoom links for upcoming events via email.</p>
    `,
    text: `Welcome ${name}! Your ${plan} membership trial has started.`,
  });
};

export const sendFreeResourceEmail = async (
  email: string,
  downloadUrl: string,
) => {
  await sendEmail({
    to: email,
    subject: "Your Free Resource – Reinvent You 50+",
    html: `
      <h2>Here's your free resource!</h2>
      <p><a href="${downloadUrl}">Click here to download your PDF</a></p>
      <p>Ready to take the next step? <a href="${process.env.CLIENT_URL ?? ""}/workbook">Check out our Workbook</a>.</p>
    `,
    text: `Download your free PDF here: ${downloadUrl}`,
  });
};

export const sendBookingConfirmationEmail = async (
  email: string,
  booking: {
    guestName: string;
    sessionType: string;
    scheduledAt: Date | string;
    duration: number;
    meetingLink?: string;
  },
) => {
  const date = new Date(booking.scheduledAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  const meetingSection = booking.meetingLink
    ? `<p><strong>Zoom Link:</strong> <a href="${booking.meetingLink}">${booking.meetingLink}</a></p>`
    : `<p>You will receive your video call link closer to the session date.</p>`;

  await sendEmail({
    to: email,
    subject: "Booking Confirmed – Reinvent You 50+",
    html: `
      <h2>Your session is confirmed, ${booking.guestName}!</h2>
      <table style="border-collapse:collapse;width:100%;max-width:480px;margin:16px 0;">
        <tr><td style="padding:8px 12px;color:#666;">Session</td><td style="padding:8px 12px;font-weight:600;">${booking.sessionType.charAt(0).toUpperCase() + booking.sessionType.slice(1)} Coaching</td></tr>
        <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#666;">Date</td><td style="padding:8px 12px;font-weight:600;">${formattedDate}</td></tr>
        <tr><td style="padding:8px 12px;color:#666;">Time</td><td style="padding:8px 12px;font-weight:600;">${formattedTime}</td></tr>
        <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#666;">Duration</td><td style="padding:8px 12px;font-weight:600;">${booking.duration} minutes</td></tr>
        <tr><td style="padding:8px 12px;color:#666;">Format</td><td style="padding:8px 12px;font-weight:600;">Video Call (Zoom)</td></tr>
      </table>
      ${meetingSection}
      <h3>What to prepare:</h3>
      <ul>
        <li>A quiet space with stable internet</li>
        <li>Any notes or questions you'd like to discuss</li>
        <li>An open mind and willingness to explore new possibilities!</li>
      </ul>
      <p>Need to reschedule? Reply to this email at least 24 hours before your session.</p>
      <p style="margin-top:24px;color:#888;font-size:13px;">— The Reinvent You 50+ Team</p>
    `,
    text: `Booking confirmed!\n\nSession: ${booking.sessionType} Coaching\nDate: ${formattedDate}\nTime: ${formattedTime}\nDuration: ${booking.duration} minutes\n\n${booking.meetingLink ? `Zoom Link: ${booking.meetingLink}` : "You will receive your video call link closer to the session date."}`,
  });
};

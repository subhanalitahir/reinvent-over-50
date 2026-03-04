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

export const sendContactNotificationEmail = async (
  adminEmail: string,
  contact: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  },
) => {
  await sendEmail({
    to: adminEmail,
    subject: `New Contact Message – ${contact.subject ?? "general"} from ${contact.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;margin:16px 0;">
        <tr><td style="padding:8px 12px;color:#666;">Name</td><td style="padding:8px 12px;font-weight:600;">${contact.name}</td></tr>
        <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#666;">Email</td><td style="padding:8px 12px;font-weight:600;"><a href="mailto:${contact.email}">${contact.email}</a></td></tr>
        ${contact.phone ? `<tr><td style="padding:8px 12px;color:#666;">Phone</td><td style="padding:8px 12px;font-weight:600;">${contact.phone}</td></tr>` : ""}
        <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#666;">Subject</td><td style="padding:8px 12px;font-weight:600;">${contact.subject ?? "general"}</td></tr>
      </table>
      <h3>Message:</h3>
      <div style="background:#f9fafb;border-left:4px solid #7c3aed;padding:16px;border-radius:4px;margin:12px 0;">
        <p style="margin:0;white-space:pre-wrap;">${contact.message}</p>
      </div>
      <p style="margin-top:16px;"><a href="mailto:${contact.email}" style="background:#7c3aed;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">Reply to ${contact.name}</a></p>
    `,
    text: `New contact from ${contact.name} (${contact.email})\nSubject: ${contact.subject ?? "general"}\n\n${contact.message}`,
  });
};

export const sendContactAcknowledgementEmail = async (
  email: string,
  name: string,
) => {
  await sendEmail({
    to: email,
    subject: "We received your message – Reinvent You 50+",
    html: `
      <h2>Thanks for reaching out, ${name}!</h2>
      <p>We received your message and will get back to you within <strong>1–2 business days</strong>.</p>
      <p>In the meantime, feel free to explore:</p>
      <ul>
        <li><a href="${process.env.CLIENT_URL ?? ""}/events">Upcoming Events</a></li>
        <li><a href="${process.env.CLIENT_URL ?? ""}/workbook">The Reinvention Workbook</a></li>
        <li><a href="${process.env.CLIENT_URL ?? ""}/membership">Membership Plans</a></li>
      </ul>
      <p style="margin-top:24px;color:#888;font-size:13px;">— The Reinvent You 50+ Team</p>
    `,
    text: `Hi ${name}, we received your message and will reply within 1–2 business days. — Reinvent You 50+`,
  });
};

export const sendEventRegistrationEmail = async (
  email: string,
  event: {
    title: string;
    date: string;
    location: string;
    price: string;
  },
) => {
  await sendEmail({
    to: email,
    subject: `You're Registered: ${event.title} – Reinvent You 50+`,
    html: `
      <h2>Registration Confirmed!</h2>
      <p>You are registered for the following event:</p>
      <table style="border-collapse:collapse;width:100%;max-width:480px;margin:16px 0;">
        <tr><td style="padding:8px 12px;color:#666;">Event</td><td style="padding:8px 12px;font-weight:600;">${event.title}</td></tr>
        <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#666;">Date</td><td style="padding:8px 12px;font-weight:600;">${event.date}</td></tr>
        <tr><td style="padding:8px 12px;color:#666;">Location</td><td style="padding:8px 12px;font-weight:600;">${event.location}</td></tr>
        <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#666;">Ticket</td><td style="padding:8px 12px;font-weight:600;">${event.price}</td></tr>
      </table>
      <p>We'll send you any additional details or virtual access links closer to the event date.</p>
      <p>Excited to see you there!</p>
      <p style="margin-top:24px;color:#888;font-size:13px;">— The Reinvent You 50+ Team</p>
    `,
    text: `Registration confirmed for ${event.title}\nDate: ${event.date}\nLocation: ${event.location}\nTicket: ${event.price}`,
  });
};

export const sendWorkbookPurchaseEmail = async (
  email: string,
  plan: "workbook" | "bundle",
) => {
  const planName = plan === "bundle" ? "Workbook + Coaching Bundle" : "Workbook Only";
  const price = plan === "bundle" ? "$197" : "$47";
  const extras =
    plan === "bundle"
      ? `<p><strong>Next steps:</strong> Our team will email you within 24 hours to schedule your 60-minute personalized coaching session.</p>`
      : "";

  await sendEmail({
    to: email,
    subject: `Your Purchase: ${planName} – Reinvent You 50+`,
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>You purchased the <strong>${planName}</strong> (${price}).</p>
      <p>Your digital workbook (PDF) will be available at the link below:</p>
      <p style="margin:16px 0;"><a href="${process.env.WORKBOOK_DOWNLOAD_URL ?? process.env.FREE_PDF_DOWNLOAD_URL ?? "#"}" style="background:#7c3aed;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">Download Your Workbook →</a></p>
      ${extras}
      <p>Your 30-day money-back guarantee starts today. Any issues? Reply to this email.</p>
      <p style="margin-top:24px;color:#888;font-size:13px;">— The Reinvent You 50+ Team</p>
    `,
    text: `Thank you for purchasing ${planName} (${price}). Download your workbook at: ${process.env.WORKBOOK_DOWNLOAD_URL ?? "#"}`,
  });
};

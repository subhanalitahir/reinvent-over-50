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

// ─── Shared email layout wrapper ──────────────────────────────────────────────

const CLIENT = () => process.env.CLIENT_URL ?? "https://reinventyou50.com";

/**
 * Wraps any email body in a premium, brand-consistent shell.
 * Renders correctly in Gmail, Outlook, Apple Mail, and major mobile clients.
 */
function emailLayout(body: string, previewText = ""): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <meta name="x-apple-disable-message-reformatting">
  <title>Reinvent You Over 50</title>
  ${previewText ? `<span style="display:none;font-size:1px;color:#ffffff;max-height:0;max-width:0;opacity:0;overflow:hidden;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</span>` : ""}
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background-color: #f4f1fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    table { border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { color: #7c3aed; }
    @media (max-width: 620px) {
      .email-container { width: 100% !important; }
      .content-pad { padding: 28px 20px !important; }
      .hero-pad { padding: 36px 20px !important; }
      .data-table td { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f1fb;">
  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1fb;padding:32px 16px 48px;">
    <tr>
      <td align="center">
        <!-- Email card -->
        <table class="email-container" role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 40px rgba(124,58,237,0.10),0 1px 4px rgba(0,0,0,0.06);">

          <!-- ── Header ── -->
          <tr>
            <td style="padding:0;">
              <!-- Gradient bar -->
              <div style="height:5px;background:linear-gradient(90deg,#7c3aed 0%,#a855f7 40%,#db2777 70%,#f97316 100%);"></div>
              <!-- Brand bar -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1e0a3c 0%,#2d1060 50%,#3b0764 100%);">
                <tr>
                  <td style="padding:28px 40px;" class="hero-pad">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <!-- Logo mark -->
                          <div style="width:44px;height:44px;background:linear-gradient(135deg,#7c3aed,#db2777);border-radius:12px;display:inline-block;text-align:center;line-height:44px;font-size:22px;margin-right:12px;vertical-align:middle;">✦</div>
                        </td>
                        <td style="vertical-align:middle;padding-left:4px;">
                          <div style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;line-height:1.2;">Reinvent You Over 50</div>
                          <div style="color:rgba(196,181,253,0.8);font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;margin-top:2px;">Transform Your Life</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Body ── -->
          <tr>
            <td class="content-pad" style="padding:44px 44px 36px;">
              ${body}
            </td>
          </tr>

          <!-- ── Divider ── -->
          <tr>
            <td style="padding:0 44px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(124,58,237,0.15),rgba(219,39,119,0.15),transparent);"></div>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="padding:28px 44px 36px;" class="content-pad">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:16px;text-align:center;">
                    <a href="${CLIENT()}" style="display:inline-block;margin:0 8px;color:#9ca3af;text-decoration:none;font-size:12px;font-weight:500;letter-spacing:0.3px;" target="_blank">Home</a>
                    <span style="color:#e5e7eb;">·</span>
                    <a href="${CLIENT()}/membership" style="display:inline-block;margin:0 8px;color:#9ca3af;text-decoration:none;font-size:12px;font-weight:500;letter-spacing:0.3px;" target="_blank">Membership</a>
                    <span style="color:#e5e7eb;">·</span>
                    <a href="${CLIENT()}/workbook" style="display:inline-block;margin:0 8px;color:#9ca3af;text-decoration:none;font-size:12px;font-weight:500;letter-spacing:0.3px;" target="_blank">Workbook</a>
                    <span style="color:#e5e7eb;">·</span>
                    <a href="${CLIENT()}/events" style="display:inline-block;margin:0 8px;color:#9ca3af;text-decoration:none;font-size:12px;font-weight:500;letter-spacing:0.3px;" target="_blank">Events</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;line-height:1.6;">
                      © ${new Date().getFullYear()} Reinvent You Over 50. All rights reserved.
                    </p>
                    <p style="margin:0;font-size:11px;color:#c4b5fd;opacity:0.7;">
                      You received this email because you interacted with our platform.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Email card -->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Reusable sub-components ──────────────────────────────────────────────────

/** Bold gradient heading block */
function emailHeading(title: string, subtitle?: string): string {
  return `
    <h1 style="margin:0 0 ${subtitle ? "8px" : "24px"};font-size:26px;font-weight:800;color:#0f0a1e;letter-spacing:-0.5px;line-height:1.2;">${title}</h1>
    ${subtitle ? `<p style="margin:0 0 28px;font-size:16px;color:#6b7280;line-height:1.6;">${subtitle}</p>` : ""}
  `;
}

/** Hero banner inside the email body */
function emailHero(
  emoji: string,
  title: string,
  subtitle: string,
  gradient = "135deg,#7c3aed 0%,#a855f7 50%,#db2777 100%",
): string {
  return `
    <div style="background:linear-gradient(${gradient});border-radius:16px;padding:32px 28px;margin-bottom:32px;text-align:center;">
      <div style="font-size:42px;margin-bottom:10px;line-height:1;">${emoji}</div>
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">${title}</h2>
      <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.82);line-height:1.6;">${subtitle}</p>
    </div>
  `;
}

/** Data row table — renders a clean info card */
function emailDataTable(rows: Array<{ label: string; value: string }>): string {
  const rowsHtml = rows
    .map(
      (r, i) => `
    <tr style="background:${i % 2 === 0 ? "#fafafa" : "#ffffff"};">
      <td style="padding:13px 18px;font-size:13px;color:#9ca3af;font-weight:600;white-space:nowrap;width:36%;border-right:1px solid #f3f4f6;">${r.label}</td>
      <td style="padding:13px 18px;font-size:14px;color:#111827;font-weight:600;">${r.value}</td>
    </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="data-table"
      style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;margin:20px 0 28px;">
      ${rowsHtml}
    </table>
  `;
}

/** Primary CTA button */
function emailButton(
  label: string,
  url: string,
  gradient = "135deg,#7c3aed,#db2777",
): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 4px;">
      <tr>
        <td style="border-radius:50px;background:linear-gradient(${gradient});">
          <a href="${url}" target="_blank"
            style="display:inline-block;padding:15px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:-0.2px;border-radius:50px;">
            ${label} &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;
}

/** Outline secondary button */
function emailButtonOutline(label: string, url: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px auto 4px;">
      <tr>
        <td style="border-radius:50px;border:2px solid #e9d5ff;">
          <a href="${url}" target="_blank"
            style="display:inline-block;padding:13px 32px;font-size:14px;font-weight:600;color:#7c3aed;text-decoration:none;letter-spacing:-0.2px;border-radius:50px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
}

/** Highlight box (tip / info / guarantee) */
function emailHighlight(
  content: string,
  accent = "#7c3aed",
  bg = "#faf5ff",
): string {
  return `
    <div style="background:${bg};border-left:4px solid ${accent};border-radius:0 12px 12px 0;padding:16px 20px;margin:20px 0;">
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">${content}</p>
    </div>
  `;
}

/** Checklist row */
function emailChecklist(items: string[]): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 24px;">
      ${items
        .map(
          (item) => `
      <tr>
        <td width="28" style="vertical-align:top;padding:5px 0;">
          <div style="width:22px;height:22px;background:linear-gradient(135deg,#7c3aed,#db2777);border-radius:50%;text-align:center;line-height:22px;font-size:12px;color:#fff;font-weight:700;">✓</div>
        </td>
        <td style="padding:5px 0 5px 10px;font-size:14px;color:#374151;line-height:1.55;vertical-align:top;">${item}</td>
      </tr>`,
        )
        .join("")}
    </table>
  `;
}

/** Badge strip (trust indicators) */
function emailBadges(badges: Array<{ emoji: string; text: string }>): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        ${badges
          .map(
            (b) => `
        <td style="text-align:center;padding:14px 8px;background:#faf5ff;border:1px solid #f3e8ff;border-radius:12px;width:${Math.floor(100 / badges.length)}%;">
          <div style="font-size:20px;margin-bottom:4px;">${b.emoji}</div>
          <div style="font-size:11px;font-weight:700;color:#7c3aed;letter-spacing:0.5px;text-transform:uppercase;">${b.text}</div>
        </td>`,
          )
          .join('<td width="8"></td>')}
      </tr>
    </table>
  `;
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
  const itemRows = order.items
    .map(
      (i) => `
    <tr>
      <td width="28" style="vertical-align:top;padding:6px 0;">
        <div style="width:20px;height:20px;background:linear-gradient(135deg,#7c3aed,#db2777);border-radius:50%;text-align:center;line-height:20px;font-size:11px;color:#fff;">✓</div>
      </td>
      <td style="padding:6px 0 6px 10px;font-size:14px;color:#374151;vertical-align:top;">${i.name}</td>
    </tr>`,
    )
    .join("");

  const body = `
    ${emailHero("🎉", "Order Confirmed!", "Your purchase has been processed successfully. Here's your receipt.")}
    ${emailHeading("Order Summary")}
    ${emailDataTable([
      {
        label: "Order ID",
        value: `<span style='font-family:monospace;font-size:13px;'>#${order._id}</span>`,
      },
      {
        label: "Total Charged",
        value: `<span style='color:#7c3aed;font-size:18px;'>$${order.total.toFixed(2)}</span>`,
      },
      {
        label: "Status",
        value: `<span style='background:#dcfce7;color:#16a34a;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;'>PAID</span>`,
      },
    ])}
    <h3 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0f0a1e;">Items Purchased</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">${itemRows}</table>
    ${
      bookingLink
        ? `
    ${emailHighlight(`<strong>Book your 1-on-1 session:</strong> Your purchase includes a personalized coaching call. Use the button below to schedule it at your convenience.`, "#7c3aed", "#faf5ff")}
    ${emailButton("Schedule My Session", bookingLink)}
    `
        : ""
    }
    <p style="margin:24px 0 0;font-size:14px;color:#6b7280;line-height:1.7;">Have a question? Simply reply to this email and our team will get back to you within one business day.</p>
  `;

  await sendEmail({
    to: email,
    subject: `Order Confirmed – Reinvent You Over 50 (#${order._id.toString().slice(-6).toUpperCase()})`,
    html: emailLayout(
      body,
      `Your order #${order._id.toString().slice(-6).toUpperCase()} for $${order.total.toFixed(2)} is confirmed.`,
    ),
    text: `Order ${order._id} confirmed. Total: $${order.total.toFixed(2)}.${bookingLink ? ` Book your session: ${bookingLink}` : ""}`,
  });
};

export const sendMembershipWelcomeEmail = async (
  email: string,
  name: string,
  plan: string,
) => {
  const planTitle = plan.charAt(0).toUpperCase() + plan.slice(1);

  const body = `
    ${emailHero("🌟", `Welcome, ${name.split(" ")[0]}!`, `Your ${planTitle} membership is now active. Your transformation starts here.`, "135deg,#6d28d9 0%,#7c3aed 40%,#db2777 100%")}

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.75;">
      We're so excited to have you as part of the <strong style="color:#7c3aed;">Reinvent You Over 50</strong> community. You've taken a bold, beautiful step toward living your best life.
    </p>

    ${emailDataTable([
      { label: "Plan", value: `${planTitle} Membership` },
      { label: "Trial Period", value: "14 days free" },
      { label: "Access", value: "Immediate — all features unlocked" },
    ])}

    <h3 style="margin:0 0 14px;font-size:16px;font-weight:700;color:#0f0a1e;">Here's what's waiting for you:</h3>
    ${emailChecklist([
      "Join your first <strong>Weekly Virtual Meetup</strong> — every Monday at 7 PM ET",
      "Introduce yourself in the <strong>Community Forum</strong> and connect with 5,000+ members",
      "Download your <strong>Member Resource Library</strong> — guides, worksheets & more",
      "Browse upcoming <strong>Events & Workshops</strong> in your area and online",
    ])}

    ${emailBadges([
      { emoji: "👥", text: "5,000+ Members" },
      { emoji: "⭐", text: "4.9/5 Rating" },
      { emoji: "🌎", text: "50+ Countries" },
    ])}

    ${emailButton("Enter Your Member Dashboard", `${CLIENT()}/membership`)}
    <p style="text-align:center;margin:10px 0 0;font-size:12px;color:#9ca3af;">Cancel anytime · No questions asked</p>
  `;

  await sendEmail({
    to: email,
    subject: `Welcome to the Community, ${name.split(" ")[0]}! 🌟 – Reinvent You Over 50`,
    html: emailLayout(
      body,
      `Your ${planTitle} membership is now active. Welcome to the community!`,
    ),
    text: `Welcome ${name}! Your ${planTitle} membership is active. Visit ${CLIENT()}/membership to get started.`,
  });
};

export const sendFreeResourceEmail = async (
  email: string,
  downloadUrl: string,
) => {
  const body = `
    ${emailHero("📖", "Your Free Guide is Ready!", "Download it now and take the first step toward reinventing your life.", "135deg,#f97316 0%,#db2777 60%,#7c3aed 100%")}

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.75;">
      Inside your <strong>Free Reinvention Guide</strong> you'll discover:
    </p>
    ${emailChecklist([
      "The 3-step framework for rediscovering your purpose after 50",
      "How to break through fear and self-doubt for good",
      "Real stories from members who transformed their lives",
      "Your first 7-day action plan to get started today",
    ])}

    ${emailButton("Download My Free Guide Now", downloadUrl, "135deg,#f97316,#db2777")}

    ${emailHighlight(`<strong>Love what you read?</strong> Our full <a href="${CLIENT()}/workbook" style="color:#7c3aed;font-weight:700;">Reinvention Workbook</a> goes 10× deeper — 150+ pages of guided exercises used by 5,000+ members worldwide.`, "#f97316", "#fff7ed")}

    <p style="margin:24px 0 0;font-size:14px;color:#6b7280;line-height:1.7;">This link will always be available. Bookmark it or come back any time.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Your Free Guide is Ready to Download 📖 – Reinvent You Over 50",
    html: emailLayout(
      body,
      "Your free reinvention guide is ready. Click to download it now.",
    ),
    text: `Your free guide is ready. Download it here: ${downloadUrl}\n\nWant to go deeper? Check out our Workbook: ${CLIENT()}/workbook`,
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
  const sessionLabel =
    booking.sessionType.charAt(0).toUpperCase() +
    booking.sessionType.slice(1) +
    " Coaching";
  const firstName = booking.guestName.split(" ")[0];

  const body = `
    ${emailHero("📅", "Your Session is Confirmed!", `We can't wait to meet with you, ${firstName}. Here are your session details.`, "135deg,#1e40af 0%,#7c3aed 50%,#db2777 100%")}

    ${emailDataTable([
      { label: "Session Type", value: sessionLabel },
      { label: "Date", value: formattedDate },
      { label: "Time", value: formattedTime },
      { label: "Duration", value: `${booking.duration} minutes` },
      { label: "Format", value: "🎥 Video Call (Zoom)" },
      {
        label: "Status",
        value: `<span style='background:#dcfce7;color:#16a34a;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;'>CONFIRMED</span>`,
      },
    ])}

    ${
      booking.meetingLink
        ? `
    <div style="background:linear-gradient(135deg,#ede9fe,#fce7f3);border-radius:14px;padding:20px 24px;margin:20px 0 28px;text-align:center;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#6b7280;letter-spacing:0.5px;text-transform:uppercase;">Your Video Call Link</p>
      ${emailButton("Join Video Call", booking.meetingLink, "135deg,#1e40af,#7c3aed")}
      <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">Save this email — your link will work on the day of your session</p>
    </div>
    `
        : emailHighlight(
            "Your Zoom link will be emailed to you <strong>24 hours before</strong> your session. Keep an eye on your inbox!",
            "#1e40af",
            "#eff6ff",
          )
    }

    <h3 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0f0a1e;">How to prepare:</h3>
    ${emailChecklist([
      "Find a quiet, well-lit space with a stable internet connection",
      "Have a notebook ready to capture your insights",
      "Write down 2–3 things you most want to discuss",
      "Come with an open mind — breakthroughs happen when we least expect them!",
    ])}

    ${emailHighlight(`Need to reschedule? Reply to this email at least <strong>24 hours</strong> before your session and we'll sort it out right away.`, "#f59e0b", "#fffbeb")}
  `;

  await sendEmail({
    to: email,
    subject: `Session Confirmed: ${sessionLabel} on ${formattedDate} ✅`,
    html: emailLayout(
      body,
      `Your ${sessionLabel} is confirmed for ${formattedDate} at ${formattedTime}.`,
    ),
    text: `Session confirmed!\n\n${sessionLabel}\n${formattedDate} at ${formattedTime}\nDuration: ${booking.duration} minutes\n\n${booking.meetingLink ? `Zoom Link: ${booking.meetingLink}` : "Your Zoom link will be sent 24 hours before your session."}`,
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
  const rows: Array<{ label: string; value: string }> = [
    { label: "Full Name", value: contact.name },
    {
      label: "Email",
      value: `<a href="mailto:${contact.email}" style="color:#7c3aed;font-weight:600;">${contact.email}</a>`,
    },
  ];
  if (contact.phone) rows.push({ label: "Phone", value: contact.phone });
  rows.push({ label: "Subject", value: contact.subject ?? "General Inquiry" });

  const body = `
    <div style="background:linear-gradient(135deg,#fef3c7,#fce7f3);border-radius:14px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#92400e;letter-spacing:0.5px;text-transform:uppercase;">🔔 New Contact Form Submission</p>
      <p style="margin:6px 0 0;font-size:14px;color:#78350f;">Received just now — please respond within 1–2 business days</p>
    </div>

    ${emailHeading("Contact Details")}
    ${emailDataTable(rows)}

    <h3 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0f0a1e;">Message:</h3>
    <div style="background:#f9fafb;border:1px solid #f3f4f6;border-left:4px solid #7c3aed;border-radius:0 12px 12px 0;padding:18px 20px;margin-bottom:28px;">
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.8;white-space:pre-wrap;">${contact.message}</p>
    </div>

    ${emailButton(`Reply to ${contact.name}`, `mailto:${contact.email}`, "135deg,#1e40af,#7c3aed")}
  `;

  await sendEmail({
    to: adminEmail,
    subject: `📬 New Message: "${contact.subject ?? "General Inquiry"}" from ${contact.name}`,
    html: emailLayout(
      body,
      `New contact form submission from ${contact.name} (${contact.email})`,
    ),
    text: `New contact from ${contact.name} (${contact.email})\nSubject: ${contact.subject ?? "General"}\n\n${contact.message}`,
  });
};

export const sendContactAcknowledgementEmail = async (
  email: string,
  name: string,
) => {
  const firstName = name.split(" ")[0];

  const body = `
    ${emailHero("💌", `Got it, ${firstName}!`, "Your message has been received. We promise a real human is reading it.", "135deg,#0f172a 0%,#1e1b4b 40%,#4c1d95 100%")}

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.75;">
      Thank you for reaching out to <strong>Reinvent You Over 50</strong>. Our team will review your message and get back to you within <strong style="color:#7c3aed;">1–2 business days</strong>.
    </p>

    ${emailHighlight(`While you wait, why not explore what's new? We add fresh content and events every week.`, "#7c3aed", "#faf5ff")}

    <h3 style="margin:24px 0 14px;font-size:15px;font-weight:700;color:#0f0a1e;">You might enjoy:</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      ${[
        {
          emoji: "📅",
          label: "Upcoming Events",
          url: `${CLIENT()}/events`,
          desc: "Virtual & in-person meetups",
        },
        {
          emoji: "📖",
          label: "The Workbook",
          url: `${CLIENT()}/workbook`,
          desc: "150+ pages of guided exercises",
        },
        {
          emoji: "👥",
          label: "Membership Plans",
          url: `${CLIENT()}/membership`,
          desc: "Join 5,000+ members worldwide",
        },
      ]
        .map(
          (item) => `
      <tr>
        <td style="padding:8px 0;">
          <a href="${item.url}" target="_blank" style="display:block;background:#faf5ff;border:1px solid #f3e8ff;border-radius:12px;padding:14px 16px;text-decoration:none;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:36px;font-size:20px;vertical-align:middle;">${item.emoji}</td>
                <td style="padding-left:10px;vertical-align:middle;">
                  <div style="font-size:14px;font-weight:700;color:#7c3aed;">${item.label}</div>
                  <div style="font-size:12px;color:#9ca3af;margin-top:1px;">${item.desc}</div>
                </td>
                <td style="padding-left:12px;font-size:16px;color:#c4b5fd;vertical-align:middle;">→</td>
              </tr>
            </table>
          </a>
        </td>
      </tr>`,
        )
        .join("")}
    </table>

    <p style="margin:20px 0 0;font-size:13px;color:#9ca3af;line-height:1.7;">— The Reinvent You Over 50 Team 💜</p>
  `;

  await sendEmail({
    to: email,
    subject: `We received your message, ${firstName} 💌 – Reinvent You Over 50`,
    html: emailLayout(
      body,
      `Thanks for contacting us. We'll reply within 1–2 business days.`,
    ),
    text: `Hi ${firstName},\n\nWe received your message and will reply within 1–2 business days.\n\nIn the meantime, explore our latest events and content at ${CLIENT()}.\n\n— The Reinvent You Over 50 Team`,
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
  const isVirtual =
    event.location.toLowerCase().includes("online") ||
    event.location.toLowerCase().includes("virtual") ||
    event.location.toLowerCase().includes("zoom");

  const body = `
    ${emailHero("🎟️", "You're Registered!", `See you at "${event.title}" — we can't wait!`, "135deg,#0f172a 0%,#7c3aed 50%,#db2777 100%")}

    ${emailDataTable([
      { label: "Event", value: `<strong>${event.title}</strong>` },
      { label: "Date & Time", value: event.date },
      {
        label: "Location",
        value: `${isVirtual ? "🎥 " : "📍 "}${event.location}`,
      },
      { label: "Ticket", value: event.price },
      {
        label: "Confirmation",
        value: `<span style='background:#dcfce7;color:#16a34a;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;'>CONFIRMED ✓</span>`,
      },
    ])}

    ${
      isVirtual
        ? emailHighlight(
            `Your <strong>virtual access link</strong> will be emailed to you 24 hours before the event. Keep an eye on your inbox!`,
            "#7c3aed",
            "#faf5ff",
          )
        : emailHighlight(
            `This is an <strong>in-person event</strong>. Please arrive 10–15 minutes early. Directions will be sent one day before.`,
            "#0ea5e9",
            "#f0f9ff",
          )
    }

    <h3 style="margin:24px 0 12px;font-size:15px;font-weight:700;color:#0f0a1e;">Before the event:</h3>
    ${emailChecklist([
      "Save the date to your calendar now so you don't forget",
      isVirtual
        ? "Test your video/audio connection in advance"
        : "Plan your journey — aim to arrive a little early",
      "Come ready to connect, share, and be inspired",
      "Invite a friend — community is better together!",
    ])}

    ${emailBadges([
      { emoji: "👥", text: "Community" },
      { emoji: "✨", text: "Inspiring" },
      { emoji: "💡", text: "Actionable" },
    ])}

    ${emailButtonOutline("Browse More Events", `${CLIENT()}/events`)}
    <p style="margin:8px 0 0;font-size:13px;color:#9ca3af;line-height:1.7;">Questions? Simply reply to this email and we'll help right away.</p>
  `;

  await sendEmail({
    to: email,
    subject: `You're In! 🎟️ "${event.title}" – Reinvent You Over 50`,
    html: emailLayout(
      body,
      `Your registration for "${event.title}" on ${event.date} is confirmed!`,
    ),
    text: `Registration confirmed!\n\n${event.title}\n${event.date}\n${event.location}\nTicket: ${event.price}\n\nSee you there! Visit ${CLIENT()}/events for more events.`,
  });
};

export const sendWorkbookPurchaseEmail = async (
  email: string,
  plan: "workbook" | "bundle",
) => {
  const isBundle = plan === "bundle";
  const planName = isBundle
    ? "Workbook + Coaching Bundle"
    : "Reinvention Workbook";
  const price = isBundle ? "$197" : "$47";
  const downloadUrl =
    process.env.WORKBOOK_DOWNLOAD_URL ??
    process.env.FREE_PDF_DOWNLOAD_URL ??
    `${CLIENT()}/workbook`;

  const body = `
    ${emailHero(
      isBundle ? "🚀" : "📚",
      isBundle ? "Your Bundle is Ready!" : "Your Workbook is Ready!",
      isBundle
        ? "You now have the complete toolkit for your transformation journey."
        : "150+ pages of guided exercises to help you discover your next chapter.",
      isBundle
        ? "135deg,#f97316 0%,#db2777 40%,#7c3aed 100%"
        : "135deg,#7c3aed 0%,#a855f7 50%,#db2777 100%",
    )}

    ${emailDataTable([
      { label: "Product", value: planName },
      {
        label: "Price Paid",
        value: `<strong style='color:#7c3aed;'>${price}</strong>`,
      },
      { label: "Format", value: "🔒 Digital PDF (instant access)" },
      { label: "Guarantee", value: "30-day money-back" },
    ])}

    ${emailButton("Download My Workbook Now ⬇️", downloadUrl, isBundle ? "135deg,#f97316,#db2777" : "135deg,#7c3aed,#db2777")}
    <p style="text-align:center;margin:8px 0 28px;font-size:12px;color:#9ca3af;">This link is permanent — bookmark it for easy access any time.</p>

    ${
      isBundle
        ? `
    <div style="background:linear-gradient(135deg,#fef3c7,#fffbeb);border:1px solid #fde68a;border-radius:14px;padding:20px 24px;margin:20px 0;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;">⭐ Your Coaching Session</p>
      <p style="margin:0;font-size:14px;color:#78350f;line-height:1.7;">Your 60-minute personalized coaching session is included in your bundle. Our team will reach out within <strong>24 hours</strong> to schedule it at a time that works for you.</p>
    </div>
    `
        : ""
    }

    <h3 style="margin:24px 0 12px;font-size:15px;font-weight:700;color:#0f0a1e;">What's inside your workbook:</h3>
    ${emailChecklist([
      "<strong>12 comprehensive modules</strong> covering every aspect of reinvention",
      "<strong>Printable worksheets & templates</strong> ready to use today",
      "<strong>Goal-setting system</strong> used by coaches worldwide",
      "<strong>Lifetime access & free updates</strong> — yours forever",
    ])}

    ${emailBadges([
      { emoji: "🛡️", text: "30-Day Guarantee" },
      { emoji: "♾️", text: "Lifetime Access" },
      { emoji: "⬇️", text: "Instant PDF" },
    ])}

    ${emailHighlight(`<strong>30-Day Money-Back Guarantee:</strong> If you're not completely satisfied with your workbook, email us within 30 days and we'll refund you in full — no questions, no hassle.`, "#16a34a", "#f0fdf4")}

    <p style="margin:24px 0 0;font-size:14px;color:#6b7280;line-height:1.7;">Need help? Reply to this email and a real human will respond within one business day.</p>
  `;

  await sendEmail({
    to: email,
    subject: isBundle
      ? `Your Workbook + Coaching Bundle is Ready 🚀 – Reinvent You Over 50`
      : `Your Reinvention Workbook is Ready to Download 📚 – Reinvent You Over 50`,
    html: emailLayout(
      body,
      `Your ${planName} download is ready. Click to get instant access.`,
    ),
    text: `Thank you for purchasing ${planName} (${price}). Download your workbook at: ${downloadUrl}${isBundle ? "\n\nOur team will contact you within 24 hours to schedule your coaching session." : ""}`,
  });
};

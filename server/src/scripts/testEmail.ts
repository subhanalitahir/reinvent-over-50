/**
 * Quick smoke-test for the MailHog local SMTP setup.
 *
 * Usage (from the `server/` directory):
 *   npx ts-node src/scripts/testEmail.ts
 *
 * Requires MailHog running on localhost:1025 (default docker-compose config).
 * Open http://localhost:8025 after running to see the captured email.
 */

import dotenv from "dotenv";
dotenv.config();

// Override SMTP settings to use MailHog on localhost (for running outside Docker)
process.env.SMTP_HOST = process.env.SMTP_HOST || "localhost";
process.env.SMTP_PORT = process.env.SMTP_PORT || "1025";
process.env.SMTP_USER = "";
process.env.SMTP_PASS = "";

import {
  sendEmail,
  sendOrderConfirmationEmail,
  sendMembershipWelcomeEmail,
  sendFreeResourceEmail,
} from "../utils/email";

async function main() {
  const recipient = "test@example.com";

  console.log("Sending test emails to MailHog at localhost:1025 …\n");

  // 1. Plain email
  await sendEmail({
    to: recipient,
    subject: "✅ MailHog Test — Basic Email",
    html: "<h1>Hello from Reinvent You 50+!</h1><p>MailHog is working.</p>",
    text: "Hello from Reinvent You 50+! MailHog is working.",
  });
  console.log("1/4  Basic email sent.");

  // 2. Order confirmation
  await sendOrderConfirmationEmail(
    recipient,
    {
      _id: "TEST-ORDER-001",
      total: 97,
      items: [{ name: "Reinvent You Workbook" }, { name: "Growth Bundle" }],
    },
    "https://calendly.com/example/session",
  );
  console.log("2/4  Order confirmation email sent.");

  // 3. Membership welcome
  await sendMembershipWelcomeEmail(recipient, "Alex", "Growth");
  console.log("3/4  Membership welcome email sent.");

  // 4. Free resource / PDF
  await sendFreeResourceEmail(
    recipient,
    "https://example.com/free-workbook.pdf",
  );
  console.log("4/4  Free resource email sent.");

  console.log(
    "\n✅  All 4 emails delivered to MailHog.\n   Open http://localhost:8025 to inspect them.",
  );
}

main().catch((err) => {
  console.error("❌  Failed to send email:", err);
  process.exit(1);
});

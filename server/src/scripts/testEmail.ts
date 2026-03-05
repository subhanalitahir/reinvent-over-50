/**
 * Quick smoke-test for the SMTP email setup.
 *
 * Usage (from the `server/` directory):
 *   npx ts-node src/scripts/testEmail.ts
 *
 * Reads SMTP credentials from the .env file (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM).
 */

import dotenv from "dotenv";
dotenv.config();

import {
  sendEmail,
  sendOrderConfirmationEmail,
  sendMembershipWelcomeEmail,
  sendFreeResourceEmail,
} from "../utils/email";

async function main() {
  const recipient = "test@example.com";

  console.log(
    `Sending test emails via SMTP (${process.env.SMTP_HOST}:${process.env.SMTP_PORT}) …\n`,
  );

  // 1. Plain email
  await sendEmail({
    to: recipient,
    subject: "✅ SMTP Test — Basic Email",
    html: "<h1>Hello from Reinvent You 50+!</h1><p>SMTP is working.</p>",
    text: "Hello from Reinvent You 50+! SMTP is working.",
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

  console.log(`\n✅  All 4 emails delivered via SMTP to ${recipient}.`);
}

main().catch((err) => {
  console.error("❌  Failed to send email:", err);
  process.exit(1);
});

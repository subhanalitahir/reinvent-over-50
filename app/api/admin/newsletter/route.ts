import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import EmailSubscriber from "@/lib/models/EmailSubscriber";
import User from "@/lib/models/User";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";
import { sendNewsletterEmail } from "@/lib/email";

// POST /api/admin/newsletter  (admin only)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);

    const { subject, htmlContent, sendToUsers, sendToSubscribers } =
      (await req.json()) as {
        subject: string;
        htmlContent: string;
        sendToUsers?: boolean;
        sendToSubscribers?: boolean;
      };

    if (!subject?.trim()) throw new AppError("Subject is required", 400);
    if (!htmlContent?.trim()) throw new AppError("Content is required", 400);
    if (!sendToUsers && !sendToSubscribers)
      throw new AppError(
        "Select at least one recipient group (users or subscribers)",
        400,
      );

    // Collect unique emails
    const emailSet = new Set<string>();

    if (sendToSubscribers) {
      const subs = await EmailSubscriber.find(
        { status: "subscribed" },
        "email",
      ).lean();
      subs.forEach((s) => emailSet.add(s.email.toLowerCase()));
    }

    if (sendToUsers) {
      const users = await User.find({}, "email").lean();
      users.forEach((u) => emailSet.add(u.email.toLowerCase()));
    }

    const emails = Array.from(emailSet);
    if (emails.length === 0) throw new AppError("No recipients found", 400);

    // Send in batches of 10 with 100ms delay to avoid SMTP rate limits
    const BATCH_SIZE = 10;
    const DELAY_MS = 100;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      await Promise.allSettled(
        batch.map(async (email) => {
          try {
            await sendNewsletterEmail(email, subject, htmlContent, email);
            sent++;
          } catch {
            failed++;
          }
        }),
      );
      if (i + BATCH_SIZE < emails.length) {
        await new Promise((r) => setTimeout(r, DELAY_MS));
      }
    }

    return apiSuccess(
      { total: emails.length, sent, failed },
      `Newsletter sent: ${sent} delivered, ${failed} failed`,
    );
  } catch (err) {
    return handleError(err);
  }
}

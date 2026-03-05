import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import EmailSubscriber from "@/lib/models/EmailSubscriber";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  apiCreated,
  handleError,
  AppError,
} from "@/lib/auth";
import { sendFreeResourceEmail } from "@/lib/email";

// POST /api/subscribers  (public)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, firstName, lastName, source, freeResourceDownloaded } =
      (await req.json()) as {
        email: string;
        firstName?: string;
        lastName?: string;
        source?: string;
        freeResourceDownloaded?: string;
      };

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return apiSuccess(null, "Valid email is required", 400);

    const ipAddress = req.headers.get("x-forwarded-for") ?? undefined;

    const existing = await EmailSubscriber.findOne({
      email: email.toLowerCase(),
    });
    if (existing) {
      if (existing.status === "unsubscribed") {
        existing.status = "subscribed";
        existing.unsubscribedAt = undefined;
      }
      if (freeResourceDownloaded)
        existing.freeResourceDownloaded = freeResourceDownloaded;
      await existing.save();

      if (process.env.FREE_PDF_DOWNLOAD_URL) {
        sendFreeResourceEmail(email, process.env.FREE_PDF_DOWNLOAD_URL).catch(
          (err: unknown) => console.error("[EMAIL ERROR] free resource:", err),
        );
      }

      return apiSuccess(existing, "Thank you for subscribing!");
    }

    const subscriber = await EmailSubscriber.create({
      email: email.toLowerCase(),
      firstName,
      lastName,
      source: source ?? "pdf-popup",
      freeResourceDownloaded,
      ipAddress,
    });

    if (process.env.FREE_PDF_DOWNLOAD_URL) {
      sendFreeResourceEmail(email, process.env.FREE_PDF_DOWNLOAD_URL).catch(
        (err: unknown) => console.error("[EMAIL ERROR] free resource:", err),
      );
    }

    return apiCreated(
      { subscriber, redirectUrl: process.env.UPSELL_PAGE_URL ?? "/workbook" },
      "Successfully subscribed. Enjoy your free resource!",
    );
  } catch (err) {
    return handleError(err);
  }
}

// GET /api/subscribers  (admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (searchParams.get("status")) filter.status = searchParams.get("status");
    if (searchParams.get("source")) filter.source = searchParams.get("source");

    const [subscribers, total] = await Promise.all([
      EmailSubscriber.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      EmailSubscriber.countDocuments(filter),
    ]);

    return apiSuccess(subscribers, "Subscribers fetched", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return handleError(err);
  }
}

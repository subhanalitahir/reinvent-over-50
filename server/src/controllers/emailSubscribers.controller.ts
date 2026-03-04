import { Request, Response } from "express";
import EmailSubscriber from "../models/EmailSubscriber";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess, sendCreated } from "../utils/apiResponse";
import { AppError } from "../middleware/error.middleware";
import { sendFreeResourceEmail } from "../utils/email";

// POST /api/subscribers  (public – email capture / free PDF popup)
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email, firstName, lastName, source, freeResourceDownloaded } =
    req.body as {
      email: string;
      firstName?: string;
      lastName?: string;
      source?: string;
      freeResourceDownloaded?: string;
    };

  // Upsert: if email already exists, just update the record
  const existing = await EmailSubscriber.findOne({ email });
  if (existing) {
    if (existing.status === "unsubscribed") {
      existing.status = "subscribed";
      existing.unsubscribedAt = undefined;
    }
    if (freeResourceDownloaded) {
      existing.freeResourceDownloaded = freeResourceDownloaded;
    }
    await existing.save();

    // Re-send the free resource email even for existing subscribers
    if (process.env.FREE_PDF_DOWNLOAD_URL) {
      sendFreeResourceEmail(email, process.env.FREE_PDF_DOWNLOAD_URL).catch(
        () => void 0,
      );
    }

    sendSuccess(res, existing, "Thank you for subscribing!");
    return;
  }

  const subscriber = await EmailSubscriber.create({
    email,
    firstName,
    lastName,
    source: source ?? "pdf-popup",
    freeResourceDownloaded,
    ipAddress: req.ip,
  });

  sendCreated(
    res,
    { subscriber, redirectUrl: process.env.UPSELL_PAGE_URL ?? "/workbook" },
    "Successfully subscribed. Enjoy your free resource!",
  );

  // Fire-and-forget: send the free resource download email
  if (process.env.FREE_PDF_DOWNLOAD_URL) {
    sendFreeResourceEmail(email, process.env.FREE_PDF_DOWNLOAD_URL).catch(
      () => void 0,
    );
  }
});

// POST /api/subscribers/unsubscribe  (public)
export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  const subscriber = await EmailSubscriber.findOne({ email });
  if (!subscriber) throw new AppError("Email not found", 404);

  subscriber.status = "unsubscribed";
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  sendSuccess(res, null, "You have been unsubscribed.");
});

// GET /api/subscribers  (admin)
export const getAllSubscribers = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;

    const [subscribers, total] = await Promise.all([
      EmailSubscriber.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      EmailSubscriber.countDocuments(filter),
    ]);

    sendSuccess(res, subscribers, "Subscribers fetched", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  },
);

// DELETE /api/subscribers/:id  (admin)
export const deleteSubscriber = asyncHandler(
  async (req: Request, res: Response) => {
    const subscriber = await EmailSubscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) throw new AppError("Subscriber not found", 404);
    sendSuccess(res, null, "Subscriber deleted");
  },
);

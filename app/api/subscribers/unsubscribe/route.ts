import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import EmailSubscriber from "@/lib/models/EmailSubscriber";
import { apiSuccess, handleError } from "@/lib/auth";

// POST /api/subscribers/unsubscribe  (public - contains email + optional token)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = (await req.json()) as { email: string };

    if (!email) return apiSuccess(null, "Email is required", 400);

    const subscriber = await EmailSubscriber.findOne({
      email: email.toLowerCase(),
    });
    if (!subscriber) return apiSuccess(null, "You have been unsubscribed");

    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return apiSuccess(null, "You have been successfully unsubscribed");
  } catch (err) {
    return handleError(err);
  }
}

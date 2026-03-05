import { NextRequest } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Booking from "@/lib/models/Booking";
import { apiSuccess, handleError, AppError } from "@/lib/auth";
import {
  sendOrderConfirmationEmail,
  sendBookingConfirmationEmail,
  sendWorkbookPurchaseEmail,
  sendEventRegistrationEmail,
} from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// GET /api/checkout/verify?session_id=cs_...
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) throw new AppError("session_id is required", 400);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return apiSuccess(
        { status: session.payment_status ?? session.status, paid: false },
        "Payment not completed",
      );
    }

    const email = session.customer_details?.email ?? "";
    const type = (session.metadata?.type as string) ?? "";

    switch (type) {
      case "booking": {
        const scheduledAt = session.metadata?.preferredDate
          ? new Date(session.metadata.preferredDate)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const booking = await Booking.findOneAndUpdate(
          { stripeSessionId: sessionId },
          { status: "confirmed" },
          { new: true },
        );
        if (booking && email) {
          sendBookingConfirmationEmail(email, {
            guestName: session.metadata?.name ?? email,
            sessionType: session.metadata?.sessionType ?? "coaching",
            scheduledAt,
            duration: 60,
            meetingLink: process.env.CALENDLY_LINK,
          }).catch((e: unknown) =>
            console.error("[EMAIL] booking confirm:", e),
          );
        }
        return apiSuccess({ type, booking }, "Booking confirmed");
      }

      case "workbook": {
        const plan = (session.metadata?.plan ?? "workbook") as
          | "workbook"
          | "bundle";
        const order = await Order.findOneAndUpdate(
          { stripeSessionId: sessionId },
          { status: "paid" },
          { new: true },
        );
        if (email) {
          sendWorkbookPurchaseEmail(email, plan).catch((e: unknown) =>
            console.error("[EMAIL] workbook:", e),
          );
        }
        return apiSuccess({ type, order }, "Purchase confirmed");
      }

      case "event": {
        const order = await Order.findOneAndUpdate(
          { stripeSessionId: sessionId },
          { status: "paid" },
          { new: true },
        );
        if (email) {
          sendEventRegistrationEmail(email, {
            title: order?.items?.[0]?.name ?? "Event",
            date: new Date().toLocaleDateString(),
            location: "Online",
            price: `$${((order?.total ?? 0) / 100).toFixed(2)}`,
          }).catch((e: unknown) => console.error("[EMAIL] event reg:", e));
        }
        return apiSuccess({ type, order }, "Event registration confirmed");
      }

      default: {
        const order = await Order.findOneAndUpdate(
          { stripeSessionId: sessionId },
          { status: "paid" },
          { new: true },
        );
        if (order && email) {
          sendOrderConfirmationEmail(email, {
            _id: order._id.toString(),
            total: order.total / 100,
            items: order.items.map((i: { name: string }) => ({ name: i.name })),
          }).catch((e: unknown) => console.error("[EMAIL] order confirm:", e));
        }
        return apiSuccess({ type, order }, "Purchase confirmed");
      }
    }
  } catch (err) {
    return handleError(err);
  }
}

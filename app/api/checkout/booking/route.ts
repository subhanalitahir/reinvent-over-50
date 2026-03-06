import { NextRequest } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import PricingConfig from "@/lib/models/PricingConfig";
import { apiSuccess, handleError } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// POST /api/checkout/booking
// Creates a Stripe checkout session for a coaching session ($150)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {
      name,
      email,
      phone,
      sessionType = "discovery",
      preferredDate,
      message,
    } = (await req.json()) as {
      name: string;
      email: string;
      phone?: string;
      sessionType?: string;
      preferredDate?: string;
      message?: string;
    };

    if (!name || !email)
      return apiSuccess(null, "Name and email are required", 400);

    const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";

    // Prefer DB pricing; fall back to $150 hardcoded default
    const pricingConfig = await PricingConfig.findOne();
    const dbBookings = pricingConfig?.bookings as
      | Record<string, number>
      | undefined;
    const unitAmount = dbBookings?.[sessionType] ?? 15000;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Coaching Session",
              description: `${sessionType} session with Reinvent Over 50`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "booking",
        name,
        email,
        phone: phone ?? "",
        sessionType,
        preferredDate: preferredDate ?? "",
      },
      success_url: `${clientUrl}/booking?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/booking?cancelled=true`,
    });

    // Pre-create booking record with pending status
    const scheduledAt = preferredDate
      ? new Date(preferredDate)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Booking.create({
      guestName: name,
      guestEmail: email,
      guestPhone: phone,
      sessionType,
      scheduledAt,
      notes: message,
      stripeSessionId: session.id,
      status: "pending",
    });

    return apiSuccess(
      { url: session.url, sessionId: session.id },
      "Checkout session created",
    );
  } catch (err) {
    return handleError(err);
  }
}

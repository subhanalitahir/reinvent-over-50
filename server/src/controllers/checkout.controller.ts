import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";
import Booking from "../models/Booking";
import { sendBookingConfirmationEmail } from "../utils/email";

/** Returns a configured Stripe instance or throws. */
async function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new AppError("Stripe is not configured", 503);
  const Stripe = (await import("stripe")).default;
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

const CLIENT_URL = () => process.env.CLIENT_URL || "http://localhost:3000";

// ─── Booking session checkout ─────────────────────────────────────────────────

/**
 * POST /api/checkout/booking
 * Creates a Stripe Checkout Session for a 1-on-1 coaching booking.
 * Saves the booking with status "pending" and attaches the Stripe session ID.
 */
export const createBookingCheckout = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      guestName,
      guestEmail,
      guestPhone,
      sessionType,
      scheduledAt,
      duration,
      notes,
    } = req.body as {
      guestName: string;
      guestEmail: string;
      guestPhone?: string;
      sessionType: string;
      scheduledAt: string;
      duration?: number;
      notes?: string;
    };

    if (!guestName || !guestEmail || !sessionType || !scheduledAt) {
      throw new AppError("Missing required booking fields", 400);
    }

    // Check for conflicting booking within 30 min window
    const windowStart = new Date(new Date(scheduledAt).getTime() - 30 * 60000);
    const windowEnd = new Date(new Date(scheduledAt).getTime() + 30 * 60000);
    const conflict = await Booking.findOne({
      scheduledAt: { $gte: windowStart, $lte: windowEnd },
      status: { $in: ["pending", "confirmed"] },
    });
    if (conflict) throw new AppError("That time slot is already booked", 409);

    const stripe = await getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: guestEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `1-on-1 Coaching Session (${sessionType})`,
              description: `${duration ?? 60}-minute video coaching session`,
            },
            unit_amount: 15000, // $150 in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "booking",
        guestName,
        guestEmail,
        guestPhone: guestPhone ?? "",
        sessionType,
        scheduledAt,
        duration: String(duration ?? 60),
        notes: notes ?? "",
      },
      success_url: `${CLIENT_URL()}/booking?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL()}/booking?canceled=true`,
    });

    // Save the booking as pending
    await Booking.create({
      guestName,
      guestEmail,
      guestPhone,
      sessionType,
      scheduledAt: new Date(scheduledAt),
      duration: duration ?? 60,
      notes,
      status: "pending",
      stripeSessionId: session.id,
    });

    res.json({ success: true, url: session.url });
  },
);

// ─── Membership checkout ──────────────────────────────────────────────────────

const MEMBERSHIP_PLANS: Record<
  string,
  Record<string, { amount: number; name: string }>
> = {
  community: {
    monthly: { amount: 2900, name: "Community — Monthly" },
    annual: { amount: 29000, name: "Community — Annual" },
  },
  transformation: {
    monthly: { amount: 5900, name: "Transformation — Monthly" },
    annual: { amount: 59000, name: "Transformation — Annual" },
  },
  vip: {
    monthly: { amount: 9900, name: "VIP — Monthly" },
    annual: { amount: 99000, name: "VIP — Annual" },
  },
};

/**
 * POST /api/checkout/membership
 * Creates a Stripe Checkout Session for a membership subscription.
 */
export const createMembershipCheckout = asyncHandler(
  async (req: Request, res: Response) => {
    const { plan, billingCycle, email } = req.body as {
      plan: string;
      billingCycle: string;
      email: string;
    };

    const planConfig = MEMBERSHIP_PLANS[plan?.toLowerCase()]?.[billingCycle];
    if (!planConfig) throw new AppError("Invalid plan or billing cycle", 400);

    if (!email) throw new AppError("Email is required", 400);

    const stripe = await getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Reinvent You 50+ — ${planConfig.name}`,
              description: `Membership subscription`,
            },
            unit_amount: planConfig.amount,
            recurring: {
              interval: billingCycle === "annual" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "membership",
        plan,
        billingCycle,
      },
      success_url: `${CLIENT_URL()}/membership?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL()}/membership?canceled=true`,
    });

    res.json({ success: true, url: session.url });
  },
);

// ─── Verify checkout session (for success pages) ─────────────────────────────

/**
 * GET /api/checkout/verify?session_id=cs_xxx
 * Returns session status so the frontend can display confirmation.
 */
export const verifyCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = req.query.session_id as string;
    if (!sessionId) throw new AppError("session_id is required", 400);

    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // If it's a paid booking, confirm it and send email
    if (
      session.payment_status === "paid" &&
      session.metadata?.type === "booking"
    ) {
      const booking = await Booking.findOne({ stripeSessionId: sessionId });
      if (booking && booking.status === "pending") {
        booking.status = "confirmed";
        await booking.save();

        sendBookingConfirmationEmail(booking.guestEmail, {
          guestName: booking.guestName,
          sessionType: booking.sessionType,
          scheduledAt: booking.scheduledAt,
          duration: booking.duration,
          meetingLink: booking.meetingLink,
        }).catch(() => void 0);

        logger.info(`Booking ${booking._id.toString()} confirmed via checkout`);
      }
    }

    res.json({
      success: true,
      data: {
        status: session.payment_status,
        type: session.metadata?.type,
        customerEmail: session.customer_email,
      },
    });
  },
);

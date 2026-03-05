import { NextRequest } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import Order from "@/lib/models/Order";
import { getAuthUser, apiSuccess, handleError, AppError } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// POST /api/checkout/event
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req); // optional auth

    const {
      eventId,
      email: guestEmail,
      name: guestName,
    } = (await req.json()) as {
      eventId: string;
      email?: string;
      name?: string;
    };

    if (!eventId) throw new AppError("eventId is required", 400);

    const event = await Event.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);
    if (event.isFree)
      throw new AppError("This event is free — no checkout needed", 400);
    if (!event.price) throw new AppError("Event price not configured", 400);

    const customerEmail = user?.email ?? guestEmail;
    if (!customerEmail)
      throw new AppError("Email is required for guest checkout", 400);

    const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";
    const unitAmount = Math.round(event.price * 100); // convert dollars → cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: event.title,
              description:
                event.description?.slice(0, 500) ?? "Reinvent Over 50 Event",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "event",
        eventId: event._id.toString(),
        userId: user?._id?.toString() ?? "",
        guestEmail: guestEmail ?? "",
        guestName: guestName ?? "",
      },
      success_url: `${clientUrl}/events?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/events/${event._id}?cancelled=true`,
    });

    // Pre-create order record
    await Order.create({
      user: user?._id ?? undefined,
      guestName: user ? undefined : guestName,
      guestEmail: user ? user.email : guestEmail,
      items: [{ name: event.title, price: unitAmount, quantity: 1 }],
      total: unitAmount,
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

import { NextRequest } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { getAuthUser, apiSuccess, handleError, AppError } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type WorkbookPlan = "workbook" | "bundle";

const WORKBOOK_PRICES: Record<
  WorkbookPlan,
  { amount: number; label: string; description: string }
> = {
  workbook: {
    amount: 4700,
    label: "Workbook",
    description: "Reinvent Over 50 Workbook (digital download)",
  },
  bundle: {
    amount: 19700,
    label: "Workbook + Coaching Bundle",
    description: "Reinvent Over 50 Workbook + 1-on-1 Coaching Session",
  },
};

// POST /api/checkout/workbook
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req); // optional auth

    const {
      plan,
      email: guestEmail,
      name: guestName,
    } = (await req.json()) as {
      plan: WorkbookPlan;
      email?: string;
      name?: string;
    };

    const priceInfo = WORKBOOK_PRICES[plan];
    if (!priceInfo) throw new AppError("Invalid workbook plan", 400);

    const customerEmail = user?.email ?? guestEmail;
    if (!customerEmail)
      throw new AppError("Email is required for guest checkout", 400);

    const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: priceInfo.label,
              description: priceInfo.description,
            },
            unit_amount: priceInfo.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "workbook",
        plan,
        userId: user?._id?.toString() ?? "",
        guestEmail: guestEmail ?? "",
        guestName: guestName ?? "",
      },
      success_url: `${clientUrl}/workbook?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/workbook?cancelled=true`,
    });

    // Pre-create order record
    await Order.create({
      user: user?._id ?? undefined,
      guestName: user ? undefined : guestName,
      guestEmail: user ? user.email : guestEmail,
      items: [{ name: priceInfo.label, price: priceInfo.amount, quantity: 1 }],
      total: priceInfo.amount,
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

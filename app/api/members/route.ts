import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Member from "@/lib/models/Member";
import User from "@/lib/models/User";
import {
  getAuthUser,
  requireAuth,
  requireAdmin,
  apiSuccess,
  apiCreated,
  handleError,
  AppError,
} from "@/lib/auth";

const PLAN_PRICES: Record<string, Record<string, number>> = {
  community: { monthly: 29, annual: 24 },
  growth: { monthly: 79, annual: 66 },
  transformation: { monthly: 149, annual: 124 },
};

// POST /api/members  (protected)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);

    const existing = await Member.findOne({ user: user._id });
    if (existing) throw new AppError("You already have a membership", 409);

    const { plan, billingCycle, stripePriceId } = (await req.json()) as {
      plan: string;
      billingCycle: string;
      stripePriceId?: string;
    };

    if (!["community", "growth", "transformation"].includes(plan))
      return apiSuccess(null, "Invalid plan", 400);
    if (!["monthly", "annual"].includes(billingCycle))
      return apiSuccess(null, "Invalid billing cycle", 400);

    const price = PLAN_PRICES[plan]?.[billingCycle];
    if (price === undefined)
      throw new AppError("Invalid plan or billing cycle", 400);

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    let stripeCustomerId: string | undefined;
    let stripeSubscriptionId: string | undefined;

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && stripePriceId) {
      try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
        const dbUser = await User.findById(user._id);
        const customer = await stripe.customers.create({
          email: dbUser?.email,
          name: dbUser?.name,
          metadata: { userId: user._id.toString() },
        });
        stripeCustomerId = customer.id;
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: stripePriceId }],
          trial_period_days: 14,
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"],
        });
        stripeSubscriptionId = subscription.id;
      } catch (err) {
        console.warn(
          "Stripe subscription creation failed – continuing without Stripe",
          err,
        );
      }
    }

    const member = await Member.create({
      user: user._id,
      plan,
      billingCycle,
      price,
      status: "trial",
      trialEndsAt,
      stripeCustomerId,
      stripeSubscriptionId,
    });

    await User.findByIdAndUpdate(user._id, { role: "member" });

    return apiCreated(member, "Membership created. 14-day trial started.");
  } catch (err) {
    return handleError(err);
  }
}

// GET /api/members  (admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const members = await Member.find()
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });
    return apiSuccess(members, "Members fetched", 200, {
      total: members.length,
    });
  } catch (err) {
    return handleError(err);
  }
}

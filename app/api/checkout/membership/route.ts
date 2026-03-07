import { NextRequest } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Member from "@/lib/models/Member";
import PricingConfig from "@/lib/models/PricingConfig";
import {
  getAuthUser,
  requireAuth,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type PlanKey = "community" | "transformation" | "vip";
type BillingKey = "monthly" | "annual";

// Fallback prices in cents (used if DB is unavailable)
const PRICES: Record<PlanKey, Record<BillingKey, number>> = {
  community: { monthly: 2900, annual: 29000 },
  transformation: { monthly: 5900, annual: 59000 },
  vip: { monthly: 9900, annual: 99000 },
};

// POST /api/checkout/membership
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);

    const { plan, billingCycle } = (await req.json()) as {
      plan: PlanKey;
      billingCycle: BillingKey;
    };

    if (!PRICES[plan]) throw new AppError("Invalid membership plan", 400);
    if (!["monthly", "annual"].includes(billingCycle))
      throw new AppError("billingCycle must be 'monthly' or 'annual'", 400);

    // Block purchase if user already has an active membership
    const activeMember = await Member.findOne({
      user: user!._id,
      status: "active",
    });
    if (activeMember) {
      throw new AppError(
        "You already have an active membership. Please manage your plan from the dashboard.",
        400,
      );
    }

    // Prefer DB pricing; fall back to hardcoded constants
    const pricingConfig = await PricingConfig.findOne();
    const dbMembership = pricingConfig?.membership as
      | Record<string, Record<string, number>>
      | undefined;
    const unitAmount =
      dbMembership?.[plan]?.[billingCycle] ?? PRICES[plan][billingCycle];
    const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: user!.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Membership`,
              description: `Reinvent Over 50 — ${plan} plan (${billingCycle})`,
            },
            recurring: {
              interval: billingCycle === "annual" ? "year" : "month",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "membership",
        userId: user!._id.toString(),
        plan,
        billingCycle,
      },
      success_url: `${clientUrl}/membership?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/membership?cancelled=true`,
    });

    // Create/update Member record
    const existingMember = await Member.findOne({ user: user!._id });
    if (existingMember) {
      existingMember.status = "pending" as "pending";
      existingMember.plan = plan;
      existingMember.billingCycle = billingCycle;
      existingMember.price = unitAmount;
      await existingMember.save();
    } else {
      await Member.create({
        user: user!._id,
        plan,
        billingCycle,
        status: "pending" as "pending",
        price: unitAmount,
        startDate: new Date(),
      });
    }

    return apiSuccess(
      { url: session.url, sessionId: session.id },
      "Subscription session created",
    );
  } catch (err) {
    return handleError(err);
  }
}

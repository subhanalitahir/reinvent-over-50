import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Member from "@/lib/models/Member";
import {
  getAuthUser,
  requireAuth,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

const PLAN_PRICES: Record<string, Record<string, number>> = {
  community: { monthly: 29, annual: 24 },
  growth: { monthly: 79, annual: 66 },
  transformation: { monthly: 149, annual: 124 },
};

// GET /api/members/me
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);
    const member = await Member.findOne({ user: user._id }).populate(
      "user",
      "name email avatar",
    );
    if (!member) throw new AppError("No membership found", 404);
    return apiSuccess(member, "Membership fetched");
  } catch (err) {
    return handleError(err);
  }
}

// PUT /api/members/me
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);

    const { plan, billingCycle } = (await req.json()) as {
      plan?: string;
      billingCycle?: string;
    };

    const member = await Member.findOne({ user: user._id });
    if (!member) throw new AppError("No membership found", 404);

    if (plan) member.plan = plan as typeof member.plan;
    if (billingCycle)
      member.billingCycle = billingCycle as typeof member.billingCycle;

    const newPlan = plan ?? member.plan;
    const newCycle = billingCycle ?? member.billingCycle;
    const price = PLAN_PRICES[newPlan]?.[newCycle];
    if (price !== undefined) member.price = price;

    await member.save();
    return apiSuccess(member, "Membership updated");
  } catch (err) {
    return handleError(err);
  }
}

// DELETE /api/members/me
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);

    const { reason } = (await req.json().catch(() => ({}))) as {
      reason?: string;
    };

    const member = await Member.findOne({ user: user._id });
    if (!member) throw new AppError("No membership found", 404);

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && member.stripeSubscriptionId) {
      try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
        await stripe.subscriptions.cancel(member.stripeSubscriptionId);
      } catch (err) {
        console.warn("Stripe subscription cancellation failed", err);
      }
    }

    member.status = "cancelled";
    member.cancelledAt = new Date();
    if (reason) member.cancelReason = reason;
    await member.save();

    return apiSuccess(null, "Membership cancelled successfully");
  } catch (err) {
    return handleError(err);
  }
}

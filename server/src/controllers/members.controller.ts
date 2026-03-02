import { Response } from "express";
import Member from "../models/Member";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";

const PLAN_PRICES: Record<string, Record<string, number>> = {
  community: { monthly: 29, annual: 24 },
  growth: { monthly: 79, annual: 66 },
  transformation: { monthly: 149, annual: 124 },
};

// POST /api/members  (protected)
export const createMembership = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const existing = await Member.findOne({ user: req.user!._id });
    if (existing) throw new AppError("You already have a membership", 409);

    const { plan, billingCycle } = req.body as {
      plan: string;
      billingCycle: string;
    };

    const price = PLAN_PRICES[plan]?.[billingCycle];
    if (price === undefined)
      throw new AppError("Invalid plan or billing cycle", 400);

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14-day trial

    const member = await Member.create({
      user: req.user!._id,
      plan,
      billingCycle,
      price,
      status: "trial",
      trialEndsAt,
    });

    sendCreated(res, member, "Membership created. 14-day trial started.");
  },
);

// GET /api/members/me  (protected)
export const getMyMembership = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const member = await Member.findOne({ user: req.user!._id }).populate(
      "user",
      "name email avatar",
    );
    if (!member) throw new AppError("No membership found", 404);
    sendSuccess(res, member, "Membership fetched");
  },
);

// PUT /api/members/me  (protected)
export const updateMembership = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { plan, billingCycle } = req.body as {
      plan?: string;
      billingCycle?: string;
    };

    const member = await Member.findOne({ user: req.user!._id });
    if (!member) throw new AppError("No membership found", 404);

    if (plan) member.plan = plan as typeof member.plan;
    if (billingCycle)
      member.billingCycle = billingCycle as typeof member.billingCycle;

    const newPlan = plan ?? member.plan;
    const newCycle = billingCycle ?? member.billingCycle;
    const price = PLAN_PRICES[newPlan]?.[newCycle];
    if (price !== undefined) member.price = price;

    await member.save();
    sendSuccess(res, member, "Membership updated");
  },
);

// DELETE /api/members/me  (protected)
export const cancelMembership = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { reason } = req.body as { reason?: string };

    const member = await Member.findOne({ user: req.user!._id });
    if (!member) throw new AppError("No membership found", 404);

    member.status = "cancelled";
    member.cancelledAt = new Date();
    member.cancelReason = reason;
    await member.save();

    sendSuccess(res, member, "Membership cancelled");
  },
);

// GET /api/members  (admin)
export const getAllMembers = asyncHandler(async (req, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.plan) filter.plan = req.query.plan;

  const [members, total] = await Promise.all([
    Member.find(filter)
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Member.countDocuments(filter),
  ]);

  sendSuccess(res, members, "Members fetched", 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

// GET /api/members/:id  (admin)
export const getMemberById = asyncHandler(async (req, res: Response) => {
  const member = await Member.findById(req.params.id).populate(
    "user",
    "name email avatar",
  );
  if (!member) throw new AppError("Member not found", 404);
  sendSuccess(res, member, "Member fetched");
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused = sendError; // keep import clean

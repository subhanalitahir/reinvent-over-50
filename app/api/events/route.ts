import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  apiCreated,
  handleError,
  AppError,
} from "@/lib/auth";

// GET /api/events  (public)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "12");
    const skip = (page - 1) * limit;

    // Admin can view all statuses
    let isAdmin = false;
    try {
      const user = await getAuthUser(req);
      isAdmin = user?.role === "admin";
    } catch {
      // unauthenticated – fine
    }

    const filter: Record<string, unknown> = {};
    if (!isAdmin) filter.status = "published";
    else if (searchParams.get("status")) filter.status = searchParams.get("status");
    if (searchParams.get("type")) filter.type = searchParams.get("type");
    if (searchParams.get("tag")) filter.tags = searchParams.get("tag");
    if (!searchParams.get("past") && !isAdmin) filter.startDate = { $gte: new Date() };

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ startDate: 1 }).skip(skip).limit(limit),
      Event.countDocuments(filter),
    ]);

    return apiSuccess(events, "Events fetched", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return handleError(err);
  }
}

// POST /api/events  (admin)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const body = await req.json();

    if (!body.title?.trim()) return apiSuccess(null, "Title is required", 400);
    if (!body.description?.trim())
      return apiSuccess(null, "Description is required", 400);
    if (
      !["virtual", "in-person", "hybrid"].includes(body.eventType ?? body.type)
    )
      return apiSuccess(null, "Invalid event type", 400);
    if (!body.startDate || isNaN(Date.parse(body.startDate)))
      return apiSuccess(null, "Valid start date required", 400);
    if (!body.endDate || isNaN(Date.parse(body.endDate)))
      return apiSuccess(null, "Valid end date required", 400);

    const event = await Event.create({
      ...body,
      type: body.type ?? body.eventType,
      createdBy: user._id,
    });
    return apiCreated(event, "Event created");
  } catch (err) {
    return handleError(err);
  }
}

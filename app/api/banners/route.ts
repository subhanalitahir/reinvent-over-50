import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Banner from "@/lib/models/Banner";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  apiCreated,
  handleError,
} from "@/lib/auth";

// GET /api/banners  (public — active banners, increments impressions)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const placement = searchParams.get("placement");

    const filter: Record<string, unknown> = { status: "active" };
    if (placement) filter.placement = placement;

    const now = new Date();
    const banners = await Banner.find({
      ...filter,
      $or: [{ startDate: { $lte: now } }, { startDate: null }],
      $and: [{ $or: [{ endDate: { $gte: now } }, { endDate: null }] }],
    }).sort({ createdAt: -1 });

    // Increment impressions in the background
    const ids = banners.map((b) => b._id);
    Banner.updateMany(
      { _id: { $in: ids } },
      { $inc: { impressions: 1 } },
    ).catch(() => {});

    return apiSuccess(banners, "Banners fetched");
  } catch (err) {
    return handleError(err);
  }
}

// POST /api/banners  (admin)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);

    const body = await req.json();
    if (!body.title || !body.imageUrl || !body.placement)
      return apiSuccess(
        null,
        "title, imageUrl and placement are required",
        400,
      );

    const banner = await Banner.create({ ...body, createdBy: user!._id });
    return apiCreated(banner, "Banner created");
  } catch (err) {
    return handleError(err);
  }
}

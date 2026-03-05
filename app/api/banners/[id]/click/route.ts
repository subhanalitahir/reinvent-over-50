import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Banner from "@/lib/models/Banner";
import { apiSuccess, handleError, AppError } from "@/lib/auth";

// POST /api/banners/[id]/click  (public)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1 } },
      { new: true },
    );
    if (!banner) throw new AppError("Banner not found", 404);

    return apiSuccess({ clicks: banner.clicks }, "Click recorded");
  } catch (err) {
    return handleError(err);
  }
}

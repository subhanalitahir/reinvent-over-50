import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Banner from "@/lib/models/Banner";
import { getAuthUser, requireAdmin, apiSuccess, handleError } from "@/lib/auth";

// GET /api/banners/all  (admin — includes inactive)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);

    const banners = await Banner.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "firstName lastName email");
    return apiSuccess(banners, "All banners fetched");
  } catch (err) {
    return handleError(err);
  }
}

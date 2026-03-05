import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Banner from "@/lib/models/Banner";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

// PUT /api/banners/[id]  (admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);

    const { id } = await params;
    const body = await req.json();
    const banner = await Banner.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!banner) throw new AppError("Banner not found", 404);

    return apiSuccess(banner, "Banner updated");
  } catch (err) {
    return handleError(err);
  }
}

// DELETE /api/banners/[id]  (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);

    const { id } = await params;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) throw new AppError("Banner not found", 404);

    return apiSuccess(null, "Banner deleted");
  } catch (err) {
    return handleError(err);
  }
}

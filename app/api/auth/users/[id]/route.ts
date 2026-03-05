import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

// DELETE /api/auth/users/[id]  (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAdmin(authUser);
    const { id } = await params;
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError("User not found", 404);
    return apiSuccess(null, "User deleted successfully");
  } catch (err) {
    return handleError(err);
  }
}

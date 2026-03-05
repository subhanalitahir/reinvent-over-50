import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import {
  getAuthUser,
  requireAuth,
  apiSuccess,
  apiError,
  handleError,
  AppError,
} from "@/lib/auth";

// PUT /api/auth/change-password
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAuth(authUser);

    const { currentPassword, newPassword } = (await req.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    if (!currentPassword) return apiError("Current password is required", 400);
    if (!newPassword || newPassword.length < 8)
      return apiError("New password must be at least 8 characters", 400);

    const user = await User.findById(authUser._id).select("+password");
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError("Current password is incorrect", 400);

    user.password = newPassword;
    await user.save();

    return apiSuccess(null, "Password changed successfully");
  } catch (err) {
    return handleError(err);
  }
}

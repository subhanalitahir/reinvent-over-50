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

// GET /api/auth/me
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);
    const freshUser = await User.findById(user._id);
    if (!freshUser) throw new AppError("User not found", 404);
    return apiSuccess(freshUser, "User profile fetched");
  } catch (err) {
    return handleError(err);
  }
}

// PUT /api/auth/me
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);
    const { name, avatar } = (await req.json()) as {
      name?: string;
      avatar?: string;
    };
    const updated = await User.findByIdAndUpdate(
      user._id,
      { name, avatar },
      { new: true, runValidators: true },
    );
    if (!updated) throw new AppError("User not found", 404);
    return apiSuccess(updated, "Profile updated successfully");
  } catch (err) {
    return handleError(err);
  }
}

// DELETE /api/auth/me
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);
    await User.findByIdAndDelete(user._id);
    return apiSuccess(null, "Account deleted successfully");
  } catch (err) {
    return handleError(err);
  }
}

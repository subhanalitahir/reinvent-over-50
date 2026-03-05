import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getAuthUser, requireAdmin, apiSuccess, handleError } from "@/lib/auth";

// GET /api/auth/users  (admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const users = await User.find().sort({ createdAt: -1 });
    return apiSuccess(users, "Users fetched", 200, { total: users.length });
  } catch (err) {
    return handleError(err);
  }
}

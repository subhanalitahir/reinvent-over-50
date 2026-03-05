import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Member from "@/lib/models/Member";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

// GET /api/members/[id]  (admin)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const { id } = await params;
    const member = await Member.findById(id).populate(
      "user",
      "name email avatar",
    );
    if (!member) throw new AppError("Member not found", 404);
    return apiSuccess(member, "Member fetched");
  } catch (err) {
    return handleError(err);
  }
}

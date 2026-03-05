import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import EmailSubscriber from "@/lib/models/EmailSubscriber";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

// DELETE /api/subscribers/[id]  (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);

    const { id } = await params;
    const subscriber = await EmailSubscriber.findByIdAndDelete(id);
    if (!subscriber) throw new AppError("Subscriber not found", 404);

    return apiSuccess(null, "Subscriber deleted");
  } catch (err) {
    return handleError(err);
  }
}

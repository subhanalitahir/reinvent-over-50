import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import {
  getAuthUser,
  requireAuth,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

// PUT /api/bookings/[id]/cancel  (protected)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);
    const { id } = await params;
    const { reason } = (await req.json().catch(() => ({}))) as {
      reason?: string;
    };

    const booking = await Booking.findById(id);
    if (!booking) throw new AppError("Booking not found", 404);

    // Only owner or admin can cancel
    const isOwner =
      booking.user?.toString() === user._id.toString() ||
      booking.guestEmail === (user as { email?: string }).email;
    if (!isOwner && user.role !== "admin")
      throw new AppError("Not authorized to cancel this booking", 403);

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    if (reason) booking.cancelReason = reason;
    await booking.save();

    return apiSuccess(booking, "Booking cancelled");
  } catch (err) {
    return handleError(err);
  }
}

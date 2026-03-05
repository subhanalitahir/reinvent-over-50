import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { getAuthUser, requireAuth, apiSuccess, handleError } from "@/lib/auth";

// GET /api/bookings/my  (protected)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);
    const bookings = await Booking.find({ user: user._id }).sort({
      scheduledAt: 1,
    });
    return apiSuccess(bookings, "Your bookings fetched");
  } catch (err) {
    return handleError(err);
  }
}

import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

// GET /api/bookings/[id]  (admin)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const { id } = await params;
    const booking = await Booking.findById(id);
    if (!booking) throw new AppError("Booking not found", 404);
    return apiSuccess(booking, "Booking fetched");
  } catch (err) {
    return handleError(err);
  }
}

// PUT /api/bookings/[id]  (admin)
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
    const booking = await Booking.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!booking) throw new AppError("Booking not found", 404);
    return apiSuccess(booking, "Booking updated");
  } catch (err) {
    return handleError(err);
  }
}

// DELETE /api/bookings/[id]  (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const { id } = await params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) throw new AppError("Booking not found", 404);
    return apiSuccess(null, "Booking deleted");
  } catch (err) {
    return handleError(err);
  }
}

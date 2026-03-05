import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/lib/models/Booking";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  apiCreated,
  handleError,
  AppError,
} from "@/lib/auth";
import { sendBookingConfirmationEmail } from "@/lib/email";

// POST /api/bookings  (public)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    const {
      guestName,
      guestEmail,
      guestPhone,
      sessionType,
      scheduledAt,
      duration,
      notes,
    } = (await req.json()) as {
      guestName: string;
      guestEmail: string;
      guestPhone?: string;
      sessionType: string;
      scheduledAt: string;
      duration?: number;
      notes?: string;
    };

    if (!guestName?.trim()) return apiSuccess(null, "Name is required", 400);
    if (!guestEmail || !/^\S+@\S+\.\S+$/.test(guestEmail))
      return apiSuccess(null, "Valid email required", 400);
    if (!["discovery", "coaching", "group", "workshop"].includes(sessionType))
      return apiSuccess(null, "Invalid session type", 400);
    if (!scheduledAt || isNaN(Date.parse(scheduledAt)))
      return apiSuccess(null, "Valid date/time required", 400);

    const windowStart = new Date(new Date(scheduledAt).getTime() - 30 * 60000);
    const windowEnd = new Date(new Date(scheduledAt).getTime() + 30 * 60000);
    const conflict = await Booking.findOne({
      scheduledAt: { $gte: windowStart, $lte: windowEnd },
      status: { $in: ["pending", "confirmed"] },
    });
    if (conflict) throw new AppError("That time slot is already booked", 409);

    const booking = await Booking.create({
      user: user?._id,
      guestName: guestName.trim(),
      guestEmail: guestEmail.toLowerCase(),
      guestPhone,
      sessionType,
      scheduledAt: new Date(scheduledAt),
      duration: duration ?? 60,
      notes,
    });

    sendBookingConfirmationEmail(guestEmail, {
      guestName,
      sessionType,
      scheduledAt: booking.scheduledAt,
      duration: booking.duration,
      meetingLink: booking.meetingLink,
    }).catch(() => void 0);

    return apiCreated(booking, "Booking created successfully");
  } catch (err) {
    return handleError(err);
  }
}

// GET /api/bookings  (admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (searchParams.get("status")) filter.status = searchParams.get("status");
    if (searchParams.get("sessionType"))
      filter.sessionType = searchParams.get("sessionType");

    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ scheduledAt: 1 }).skip(skip).limit(limit),
      Booking.countDocuments(filter),
    ]);

    return apiSuccess(bookings, "Bookings fetched", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return handleError(err);
  }
}

import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import mongoose from "mongoose";
import {
  getAuthUser,
  requireAuth,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

// POST /api/events/[id]/rsvp  (protected)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);
    const { id } = await params;

    const event = await Event.findById(id);
    if (!event) throw new AppError("Event not found", 404);

    const userId = user._id as mongoose.Types.ObjectId;
    const alreadyRSVP = event.attendees.some((aid) => aid.equals(userId));

    if (alreadyRSVP) {
      event.attendees = event.attendees.filter((aid) => !aid.equals(userId));
      await event.save();
      return apiSuccess(event, "RSVP withdrawn");
    }

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      throw new AppError("Event is fully booked", 400);
    }

    event.attendees.push(userId);
    await event.save();
    return apiSuccess(event, "RSVP confirmed");
  } catch (err) {
    return handleError(err);
  }
}

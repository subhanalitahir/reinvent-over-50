import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

// GET /api/events/[id]  (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const event = await Event.findById(id).populate("attendees", "name avatar");
    if (!event || event.status === "draft")
      throw new AppError("Event not found", 404);
    return apiSuccess(event, "Event fetched");
  } catch (err) {
    return handleError(err);
  }
}

// PUT /api/events/[id]  (admin)
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
    const event = await Event.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!event) throw new AppError("Event not found", 404);
    return apiSuccess(event, "Event updated");
  } catch (err) {
    return handleError(err);
  }
}

// DELETE /api/events/[id]  (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const { id } = await params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) throw new AppError("Event not found", 404);
    return apiSuccess(null, "Event deleted");
  } catch (err) {
    return handleError(err);
  }
}

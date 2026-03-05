import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import { apiSuccess, handleError, AppError } from "@/lib/auth";

// POST /api/events/[id]/purchase  (public)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const event = await Event.findById(id);
    if (!event || event.status !== "published")
      throw new AppError("Event not found or not available", 404);

    if (event.isFree)
      throw new AppError(
        "This is a free event. Use the RSVP endpoint instead.",
        400,
      );

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees)
      throw new AppError("Event is fully booked", 400);

    const { guestEmail } = (await req.json()) as {
      guestEmail: string;
      guestName?: string;
    };
    if (!guestEmail)
      throw new AppError("Email is required for ticket purchase", 400);

    return apiSuccess(
      {
        event: { _id: event._id, title: event.title, price: event.price },
        stripePublicKey: process.env.STRIPE_PUBLISHABLE_KEY ?? "",
        message: "Proceed to checkout to complete your ticket purchase.",
      },
      "Ticket purchase initiated",
    );
  } catch (err) {
    return handleError(err);
  }
}

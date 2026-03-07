import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/lib/models/Event";
import { getAuthUser, apiSuccess, handleError, AppError } from "@/lib/auth";
import { sendVirtualEventAccessEmail, sendEventPassEmail } from "@/lib/email";

// POST /api/events/[id]/access — register for a free event and get access materials
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const user = await getAuthUser(req); // optional auth

    const body = (await req.json().catch(() => ({}))) as {
      email?: string;
      name?: string;
    };
    const guestEmail = body.email;
    const guestName = body.name;

    const email = user?.email ?? guestEmail;
    if (!email) throw new AppError("Email is required", 400);

    const name = user?.name ?? guestName ?? email.split("@")[0];

    const event = await Event.findById(id);
    if (!event) throw new AppError("Event not found", 404);

    // Verify the event is accessible for free
    const isFreeForUser =
      event.isFree ||
      (event.isFreeForMembers &&
        (user?.role === "member" || user?.role === "admin"));

    if (!isFreeForUser) {
      throw new AppError("This event requires payment", 400);
    }

    const passId = `PASS-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    const eventDate = new Date(event.startDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (event.type === "virtual" || event.type === "hybrid") {
      if (event.virtualLink) {
        await sendVirtualEventAccessEmail(email, {
          name,
          eventTitle: event.title,
          zoomLink: event.virtualLink,
          date: eventDate,
        });
      }
      return apiSuccess(
        { eventType: event.type, attendeeName: name },
        "Access granted. Zoom link sent to your email.",
      );
    } else {
      // in-person
      await sendEventPassEmail(email, {
        name,
        eventTitle: event.title,
        date: eventDate,
        location: event.location ?? "TBA",
        price: "Free",
        passId,
      });
      return apiSuccess(
        {
          eventType: event.type,
          passId,
          eventTitle: event.title,
          date: eventDate,
          location: event.location ?? "TBA",
          attendeeName: name,
        },
        "Access granted. Event pass sent to your email.",
      );
    }
  } catch (err) {
    return handleError(err);
  }
}

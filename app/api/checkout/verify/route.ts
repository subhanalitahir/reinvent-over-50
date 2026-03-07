import { NextRequest } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Booking from "@/lib/models/Booking";
import Member from "@/lib/models/Member";
import { apiSuccess, handleError, AppError } from "@/lib/auth";
import {
  sendOrderConfirmationEmail,
  sendBookingConfirmationEmail,
  sendWorkbookPurchaseEmail,
  sendEventRegistrationEmail,
  sendVirtualEventAccessEmail,
  sendEventPassEmail,
  sendMembershipWelcomeEmail,
} from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// GET /api/checkout/verify?session_id=cs_...
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) throw new AppError("session_id is required", 400);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return apiSuccess(
        { status: session.payment_status ?? session.status, paid: false },
        "Payment not completed",
      );
    }

    const email = session.customer_details?.email ?? "";
    const type = (session.metadata?.type as string) ?? "";

    switch (type) {
      case "booking": {
        const scheduledAt = session.metadata?.preferredDate
          ? new Date(session.metadata.preferredDate)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const booking = await Booking.findOneAndUpdate(
          { stripeSessionId: sessionId },
          { status: "confirmed" },
          { new: true },
        );
        if (booking && email) {
          sendBookingConfirmationEmail(email, {
            guestName: session.metadata?.name ?? email,
            sessionType: session.metadata?.sessionType ?? "coaching",
            scheduledAt,
            duration: 60,
            meetingLink: process.env.CALENDLY_LINK,
          }).catch((e: unknown) =>
            console.error("[EMAIL] booking confirm:", e),
          );
        }
        return apiSuccess({ type, booking }, "Booking confirmed");
      }

      case "workbook": {
        const plan = (session.metadata?.plan ?? "workbook") as
          | "workbook"
          | "bundle";
        const order = await Order.findOneAndUpdate(
          { stripeSessionId: sessionId },
          { status: "paid" },
          { new: true },
        );
        if (email) {
          sendWorkbookPurchaseEmail(email, plan).catch((e: unknown) =>
            console.error("[EMAIL] workbook:", e),
          );
        }
        return apiSuccess({ type, order }, "Purchase confirmed");
      }

      case "event": {
        const order = await Order.findOneAndUpdate(
          { stripeSessionId: sessionId },
          { status: "paid" },
          { new: true },
        );

        const eventId = session.metadata?.eventId;
        const attendeeName =
          session.metadata?.guestName ||
          session.customer_details?.name ||
          email;
        const eventType = session.metadata?.eventType ?? "virtual";
        const virtualLink = session.metadata?.virtualLink ?? "";

        interface EventData {
          title: string;
          startDate?: string;
          location?: string;
          passId?: string;
        }
        let eventData: EventData | null = null;

        if (eventId) {
          const EventModel = (await import("@/lib/models/Event")).default;
          const dbEvent = await EventModel.findById(eventId);
          if (dbEvent) {
            const passId = `PASS-${session.id.slice(-8).toUpperCase()}`;
            const eventDate = new Date(dbEvent.startDate).toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            );
            eventData = {
              title: dbEvent.title,
              startDate: dbEvent.startDate.toISOString(),
              location: dbEvent.location,
              passId,
            };
            if (email) {
              if (eventType === "virtual" || eventType === "hybrid") {
                sendVirtualEventAccessEmail(email, {
                  name: attendeeName ?? email,
                  eventTitle: dbEvent.title,
                  zoomLink: virtualLink || dbEvent.virtualLink || "",
                  date: eventDate,
                }).catch((e: unknown) =>
                  console.error("[EMAIL] event zoom:", e),
                );
              } else {
                sendEventPassEmail(email, {
                  name: attendeeName ?? email,
                  eventTitle: dbEvent.title,
                  date: eventDate,
                  location: dbEvent.location ?? "TBA",
                  price: `$${((order?.total ?? 0) / 100).toFixed(2)}`,
                  passId,
                }).catch((e: unknown) =>
                  console.error("[EMAIL] event pass:", e),
                );
              }
            }
          }
        } else if (email) {
          // fallback
          sendEventRegistrationEmail(email, {
            title: order?.items?.[0]?.name ?? "Event",
            date: new Date().toLocaleDateString(),
            location: eventType === "in-person" ? "See confirmation" : "Online",
            price: `$${((order?.total ?? 0) / 100).toFixed(2)}`,
          }).catch((e: unknown) => console.error("[EMAIL] event reg:", e));
        }

        return apiSuccess(
          {
            type,
            order,
            eventType,
            eventData: {
              title: eventData?.title ?? order?.items?.[0]?.name ?? "Event",
              startDate: eventData?.startDate,
              location: eventData?.location,
              passId: eventData?.passId,
              attendeeName,
            },
          },
          "Event registration confirmed",
        );
      }

      case "membership": {
        const userId = session.metadata?.userId;
        if (!userId) {
          return apiSuccess(
            { type, paid: true },
            "Membership session verified",
          );
        }
        const UserModel = (await import("@/lib/models/User")).default;
        const member = await Member.findOneAndUpdate(
          { user: userId },
          {
            status: "active",
            startDate: new Date(),
            endDate: (() => {
              const d = new Date();
              const cycle = session.metadata?.billingCycle ?? "monthly";
              if (cycle === "annual") d.setFullYear(d.getFullYear() + 1);
              else d.setMonth(d.getMonth() + 1);
              return d;
            })(),
            ...(session.customer
              ? {
                  stripeCustomerId:
                    typeof session.customer === "string"
                      ? session.customer
                      : (session.customer as Stripe.Customer).id,
                }
              : {}),
            ...(session.subscription
              ? {
                  stripeSubscriptionId:
                    typeof session.subscription === "string"
                      ? session.subscription
                      : (session.subscription as Stripe.Subscription).id,
                }
              : {}),
          },
          { new: true },
        );
        if (member) {
          await UserModel.findByIdAndUpdate(userId, { role: "member" });
          const user = await UserModel.findById(userId);
          if (user && email) {
            sendMembershipWelcomeEmail(email, user.name, member.plan).catch(
              (e: unknown) => console.error("[EMAIL] membership welcome:", e),
            );
          }
        }
        return apiSuccess({ type, member }, "Membership activated");
      }

      default: {
        const order = await Order.findOneAndUpdate(
          { stripeSessionId: sessionId },
          { status: "paid" },
          { new: true },
        );
        if (order && email) {
          sendOrderConfirmationEmail(email, {
            _id: order._id.toString(),
            total: order.total / 100,
            items: order.items.map((i: { name: string }) => ({ name: i.name })),
          }).catch((e: unknown) => console.error("[EMAIL] order confirm:", e));
        }
        return apiSuccess({ type, order }, "Purchase confirmed");
      }
    }
  } catch (err) {
    return handleError(err);
  }
}

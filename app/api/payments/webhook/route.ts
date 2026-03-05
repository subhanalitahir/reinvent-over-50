import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Member from "@/lib/models/Member";
import {
  sendOrderConfirmationEmail,
  sendMembershipWelcomeEmail,
} from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Stripe requires the raw request body for signature verification.
// In Next.js App Router, request.text() returns the raw body.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Webhook signature verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await connectDB();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Mark related order as paid
        const order = await Order.findOne({
          stripeSessionId: session.id,
        }).populate("user");
        if (order) {
          order.status = "paid";
          order.stripePaymentIntentId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : (session.payment_intent?.id ?? undefined);
          await order.save();

          // Send confirmation email
          const customerEmail =
            session.customer_details?.email ?? order.guestEmail ?? "";
          if (customerEmail) {
            sendOrderConfirmationEmail(customerEmail, {
              _id: order._id.toString(),
              total: order.total / 100,
              items: order.items.map((i: { name: string }) => ({
                name: i.name,
              })),
            }).catch((e: unknown) =>
              console.error("[EMAIL] order confirmation:", e),
            );
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const member = await Member.findOne({
          stripeCustomerId: sub.customer as string,
        });
        if (member) {
          member.stripeSubscriptionId = sub.id;
          member.status = (sub.status === "active" ? "active" : "pending") as
            | "active"
            | "pending";
          await member.save();

          if (
            event.type === "customer.subscription.created" &&
            sub.status === "active"
          ) {
            const UserModel = (await import("@/lib/models/User")).default;
            const user = await UserModel.findById(member.user);
            if (user) {
              sendMembershipWelcomeEmail(
                user.email,
                user.name,
                member.plan,
              ).catch((e: unknown) =>
                console.error("[EMAIL] membership welcome:", e),
              );
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await Member.findOneAndUpdate(
          { stripeSubscriptionId: sub.id },
          { status: "cancelled" },
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(
          `[STRIPE] Payment failed for customer ${invoice.customer} | invoice ${invoice.id}`,
        );
        break;
      }

      default:
        console.info(`[STRIPE] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

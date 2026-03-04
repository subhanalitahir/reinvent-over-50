import { Request, Response } from "express";
import Order from "../models/Order";
import Member from "../models/Member";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import logger from "../utils/logger";
import { sendOrderConfirmationEmail, sendMembershipWelcomeEmail } from "../utils/email";

/**
 * POST /api/payments/webhook
 * Raw body is required for Stripe signature verification.
 * Mount this route BEFORE express.json() middleware or use express.raw().
 */
export const stripeWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    // Stripe requires the raw body for signature verification.
    // The raw buffer is attached by the express.raw() middleware configured in index.ts.
    let stripe: import("stripe").default;
    try {
      // Dynamic import so the server starts even if stripe is not yet installed locally.
      const Stripe = (await import("stripe")).default;
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2024-06-20",
      });
    } catch {
      logger.error("Stripe module not available");
      res.status(503).json({ received: false, error: "Stripe not configured" });
      return;
    }

    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    let event: import("stripe").Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
    } catch (err) {
      logger.error("Stripe webhook signature verification failed", err);
      res.status(400).json({ received: false, error: "Invalid signature" });
      return;
    }

    logger.info(`Stripe event received: ${event.type}`);

    switch (event.type) {
      // ── One-time checkout (products / orders) ──────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as import("stripe").Stripe.Checkout.Session;

        const order = await Order.findOne({ stripeSessionId: session.id });
        if (order) {
          order.status = "paid";
          order.paidAt = new Date();
          order.stripePaymentIntentId = session.payment_intent as string;
          await order.save();
          logger.info(`Order ${order._id.toString()} marked as paid`);

          // Send order confirmation email (fire and forget)
          sendOrderConfirmationEmail(
            order.guestEmail,
            {
              _id: order._id.toString(),
              total: order.total,
              items: order.items,
            },
            order.bookingLink,
          ).catch(() => void 0);
        }
        break;
      }

      // ── Subscription created / activated ──────────────────────────────────
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data
          .object as import("stripe").Stripe.Subscription;

        const member = await Member.findOne({
          stripeSubscriptionId: subscription.id,
        });
        if (member) {
          member.status =
            subscription.status === "active" ? "active" : member.status;
          await member.save();
        }
        break;
      }

      // ── Subscription cancelled ─────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data
          .object as import("stripe").Stripe.Subscription;

        const member = await Member.findOne({
          stripeSubscriptionId: subscription.id,
        });
        if (member) {
          member.status = "cancelled";
          member.cancelledAt = new Date();
          await member.save();
        }
        break;
      }

      // ── Payment failed (subscription renewal) ─────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as import("stripe").Stripe.Invoice;
        logger.warn(`Payment failed for customer: ${String(invoice.customer)}`);
        break;
      }

      default:
        logger.info(`Unhandled Stripe event type: ${event.type}`);
    }

    res.json({ received: true });
  },
);

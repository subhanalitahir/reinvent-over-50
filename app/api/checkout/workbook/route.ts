import { NextRequest } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import { getAuthUser, apiSuccess, handleError, AppError } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// POST /api/checkout/workbook
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req); // optional auth

    const {
      productId,
      email: guestEmail,
      name: guestName,
    } = (await req.json()) as {
      productId: string;
      email?: string;
      name?: string;
    };

    if (!productId) throw new AppError("productId is required", 400);

    const product = await Product.findById(productId);
    if (!product || product.status !== "active")
      throw new AppError("Product not found", 404);

    // Check if free for this user
    const isMember =
      user?.role === "member" || user?.role === "admin";
    if (product.price === 0 || (product.isFreeForMembers && isMember)) {
      throw new AppError(
        "This product is free for you — no checkout needed",
        400,
      );
    }

    const customerEmail = user?.email ?? guestEmail;
    if (!customerEmail)
      throw new AppError("Email is required for guest checkout", 400);

    const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";
    const unitAmount = Math.round(product.price * 100); // dollars → cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description?.slice(0, 500) ?? "Reinvent Over 50 Product",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "workbook",
        productId: product._id.toString(),
        productSlug: product.slug,
        userId: user?._id?.toString() ?? "",
        guestEmail: guestEmail ?? "",
        guestName: guestName ?? "",
      },
      success_url: `${clientUrl}/workbook?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/workbook?cancelled=true`,
    });

    // Pre-create order record
    await Order.create({
      user: user?._id ?? undefined,
      guestName: user ? undefined : guestName,
      guestEmail: user ? user.email : guestEmail,
      items: [
        {
          product: product._id,
          name: product.name,
          price: unitAmount,
          quantity: 1,
        },
      ],
      total: unitAmount,
      stripeSessionId: session.id,
      status: "pending",
    });

    return apiSuccess(
      { url: session.url, sessionId: session.id },
      "Checkout session created",
    );
  } catch (err) {
    return handleError(err);
  }
}

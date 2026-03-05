import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  apiCreated,
  handleError,
  AppError,
} from "@/lib/auth";

// POST /api/orders  (public – guest or authenticated checkout)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    const { guestName, guestEmail, items } = (await req.json()) as {
      guestName?: string;
      guestEmail: string;
      items: Array<{ productId: string; quantity?: number }>;
    };

    if (!guestEmail || !/^\S+@\S+\.\S+$/.test(guestEmail))
      return apiSuccess(null, "Valid email is required", 400);
    if (!items || items.length === 0)
      return apiSuccess(null, "At least one item required", 400);

    const resolvedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product || product.status !== "active")
          throw new AppError(
            `Product ${item.productId} not found or inactive`,
            404,
          );
        return {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity ?? 1,
        };
      }),
    );

    const subtotal = resolvedItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    const includesBundle = await Promise.all(
      resolvedItems.map(async (item) => {
        const p = await Product.findById(item.product);
        return p?.includesBooking ?? false;
      }),
    );
    const hasBundle = includesBundle.some(Boolean);

    const ipAddress = req.headers.get("x-forwarded-for") ?? undefined;

    const order = await Order.create({
      user: user?._id,
      guestName,
      guestEmail: guestEmail.toLowerCase(),
      items: resolvedItems,
      subtotal,
      total: subtotal,
      status: "pending",
      bookingLink: hasBundle
        ? (process.env.CALENDLY_LINK ?? process.env.BOOKING_LINK ?? "")
        : undefined,
      ipAddress,
    });

    return apiCreated(order, "Order created. Proceed to checkout.");
  } catch (err) {
    return handleError(err);
  }
}

// GET /api/orders  (admin)
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

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    return apiSuccess(orders, "Orders fetched", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return handleError(err);
  }
}

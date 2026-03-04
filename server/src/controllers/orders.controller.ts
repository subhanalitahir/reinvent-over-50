import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess, sendCreated } from "../utils/apiResponse";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";

// POST /api/orders  (public – guest or authenticated checkout)
export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { guestName, guestEmail, items } = req.body as {
      guestName?: string;
      guestEmail: string;
      items: Array<{ productId: string; quantity?: number }>;
    };

    if (!items || items.length === 0) {
      throw new AppError("Order must contain at least one item", 400);
    }

    // Resolve product details from DB
    const resolvedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product || product.status !== "active") {
          throw new AppError(
            `Product ${item.productId} not found or inactive`,
            404,
          );
        }
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

    // Check if any item is a bundle (includes booking)
    const includesBundle = await Promise.all(
      resolvedItems.map(async (item) => {
        const p = await Product.findById(item.product);
        return p?.includesBooking ?? false;
      }),
    );
    const hasBundle = includesBundle.some(Boolean);

    const order = await Order.create({
      user: req.user?._id,
      guestName,
      guestEmail,
      items: resolvedItems,
      subtotal,
      total: subtotal,
      status: "pending",
      // Provide Calendly booking link if bundle is in the order
      bookingLink: hasBundle
        ? (process.env.CALENDLY_LINK ?? process.env.BOOKING_LINK ?? "")
        : undefined,
      ipAddress: req.ip,
    });

    sendCreated(res, order, "Order created. Proceed to checkout.");
  },
);

// GET /api/orders/my  (protected)
export const getMyOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({ user: req.user!._id })
      .populate("items.product", "name imageUrl type")
      .sort({ createdAt: -1 });
    sendSuccess(res, orders, "Orders fetched");
  },
);

// GET /api/orders/:id  (protected – owner or admin)
export const getOrderById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name imageUrl type includesBooking",
    );
    if (!order) throw new AppError("Order not found", 404);

    // Allow owner or admin
    const isOwner =
      order.user?.toString() === req.user!._id.toString() ||
      order.guestEmail === req.user!.email;
    if (!isOwner && req.user!.role !== "admin") {
      throw new AppError("Not authorized to view this order", 403);
    }

    sendSuccess(res, order, "Order fetched");
  },
);

// GET /api/orders  (admin)
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    sendSuccess(res, orders, "Orders fetched", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  },
);

// PUT /api/orders/:id/status  (admin)
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body as { status: string };
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === "paid" ? { paidAt: new Date() } : {}) },
      { new: true, runValidators: true },
    );
    if (!order) throw new AppError("Order not found", 404);
    sendSuccess(res, order, "Order status updated");
  },
);

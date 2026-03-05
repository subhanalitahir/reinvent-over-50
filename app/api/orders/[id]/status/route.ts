import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

// PUT /api/orders/[id]/status  (admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const { id } = await params;
    const { status } = (await req.json()) as { status: string };

    const order = await Order.findByIdAndUpdate(
      id,
      { status, ...(status === "paid" ? { paidAt: new Date() } : {}) },
      { new: true, runValidators: true },
    );
    if (!order) throw new AppError("Order not found", 404);
    return apiSuccess(order, "Order status updated");
  } catch (err) {
    return handleError(err);
  }
}

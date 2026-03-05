import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import {
  getAuthUser,
  requireAuth,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

// GET /api/orders/[id]  (protected – owner or admin)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);
    const { id } = await params;

    const order = await Order.findById(id).populate(
      "items.product",
      "name imageUrl type includesBooking",
    );
    if (!order) throw new AppError("Order not found", 404);

    const isOwner =
      order.user?.toString() === user._id.toString() ||
      order.guestEmail === (user as unknown as { email: string }).email;
    if (!isOwner && user.role !== "admin")
      throw new AppError("Not authorized to view this order", 403);

    return apiSuccess(order, "Order fetched");
  } catch (err) {
    return handleError(err);
  }
}

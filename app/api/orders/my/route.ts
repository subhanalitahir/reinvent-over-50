import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { getAuthUser, requireAuth, apiSuccess, handleError } from "@/lib/auth";

// GET /api/orders/my  (protected)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAuth(user);
    const orders = await Order.find({ user: user._id })
      .populate("items.product", "name imageUrl type")
      .populate("items.event", "title")
      .sort({ createdAt: -1 });
    return apiSuccess(orders, "Orders fetched");
  } catch (err) {
    return handleError(err);
  }
}

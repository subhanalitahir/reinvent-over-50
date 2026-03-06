import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  apiCreated,
  handleError,
  AppError,
} from "@/lib/auth";

// GET /api/products  (public)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // Admin can view all statuses
    let isAdmin = false;
    try {
      const user = await getAuthUser(req);
      isAdmin = user?.role === "admin";
    } catch {
      // unauthenticated – fine
    }

    const filter: Record<string, unknown> = {};
    if (!isAdmin) filter.status = "active";
    if (searchParams.get("type")) filter.type = searchParams.get("type");
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return apiSuccess(products, "Products fetched");
  } catch (err) {
    return handleError(err);
  }
}

// POST /api/products  (admin)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const body = await req.json();

    if (!body.name?.trim()) return apiSuccess(null, "Name is required", 400);
    if (!body.slug?.trim()) return apiSuccess(null, "Slug is required", 400);
    if (!body.description?.trim())
      return apiSuccess(null, "Description is required", 400);
    if (!["workbook", "bundle", "course", "other"].includes(body.type))
      return apiSuccess(null, "Invalid product type", 400);
    if (body.price === undefined || body.price < 0)
      return apiSuccess(null, "Price must be non-negative", 400);

    const product = await Product.create(body);
    return apiCreated(product, "Product created");
  } catch (err) {
    return handleError(err);
  }
}

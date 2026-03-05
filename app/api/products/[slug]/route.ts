import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import {
  getAuthUser,
  requireAdmin,
  apiSuccess,
  handleError,
  AppError,
} from "@/lib/auth";

// GET /api/products/[slug]  (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();
    const { slug } = await params;
    const product = await Product.findOne({ slug, status: "active" });
    if (!product) throw new AppError("Product not found", 404);
    return apiSuccess(product, "Product fetched");
  } catch (err) {
    return handleError(err);
  }
}

// PUT /api/products/[slug]  (admin – uses id as slug param for updates)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const { slug } = await params;
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(slug, body, {
      new: true,
      runValidators: true,
    });
    if (!product) throw new AppError("Product not found", 404);
    return apiSuccess(product, "Product updated");
  } catch (err) {
    return handleError(err);
  }
}

// DELETE /api/products/[slug]  (admin – archives by id)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);
    const { slug } = await params;
    const product = await Product.findByIdAndUpdate(
      slug,
      { status: "archived" },
      { new: true },
    );
    if (!product) throw new AppError("Product not found", 404);
    return apiSuccess(null, "Product archived");
  } catch (err) {
    return handleError(err);
  }
}

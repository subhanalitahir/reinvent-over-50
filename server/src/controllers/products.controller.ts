import { Request, Response } from "express";
import Product from "../models/Product";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess, sendCreated } from "../utils/apiResponse";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";

// GET /api/products  (public)
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const filter: Record<string, unknown> = { status: "active" };
    if (req.query.type) filter.type = req.query.type;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, products, "Products fetched");
  },
);

// GET /api/products/:slug  (public)
export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findOne({
      slug: req.params.slug,
      status: "active",
    });
    if (!product) throw new AppError("Product not found", 404);
    sendSuccess(res, product, "Product fetched");
  },
);

// POST /api/products  (admin)
export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const product = await Product.create(req.body);
    sendCreated(res, product, "Product created");
  },
);

// PUT /api/products/:id  (admin)
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!product) throw new AppError("Product not found", 404);
    sendSuccess(res, product, "Product updated");
  },
);

// DELETE /api/products/:id  (admin)
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true },
    );
    if (!product) throw new AppError("Product not found", 404);
    sendSuccess(res, null, "Product archived");
  },
);

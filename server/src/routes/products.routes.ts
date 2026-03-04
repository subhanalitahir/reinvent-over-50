import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.middleware";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";

const router = Router();

// Public
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("slug").trim().notEmpty().withMessage("Slug is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("type")
      .isIn(["workbook", "bundle", "course", "other"])
      .withMessage("Invalid product type"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be non-negative"),
  ],
  validate,
  createProduct,
);

router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;

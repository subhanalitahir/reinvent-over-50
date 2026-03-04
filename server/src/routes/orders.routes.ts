import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.middleware";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orders.controller";

const router = Router();

// Public / Guest checkout
router.post(
  "/",
  [
    body("guestEmail").isEmail().withMessage("Valid email is required"),
    body("items").isArray({ min: 1 }).withMessage("At least one item required"),
    body("items.*.productId").notEmpty().withMessage("Product ID is required"),
  ],
  validate,
  createOrder,
);

// Protected – own orders
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Admin
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;

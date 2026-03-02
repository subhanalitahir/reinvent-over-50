import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.middleware";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  cancelBooking,
} from "../controllers/bookings.controller";

const router = Router();

router.post(
  "/",
  [
    body("guestName").trim().notEmpty().withMessage("Name is required"),
    body("guestEmail")
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail(),
    body("sessionType")
      .isIn(["discovery", "coaching", "group", "workshop"])
      .withMessage("Invalid session type"),
    body("scheduledAt").isISO8601().withMessage("Valid date/time required"),
    body("duration")
      .optional()
      .isInt({ min: 15, max: 240 })
      .withMessage("Duration must be 15–240 minutes"),
  ],
  validate,
  createBooking,
);

router.get("/my", protect, getMyBookings);
router.put("/:id/cancel", protect, cancelBooking);

// Admin routes
router.get("/", protect, adminOnly, getAllBookings);
router.get("/:id", protect, adminOnly, getBookingById);
router.put("/:id", protect, adminOnly, updateBooking);
router.delete("/:id", protect, adminOnly, deleteBooking);

export default router;

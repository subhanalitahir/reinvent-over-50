import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.middleware";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  purchaseTicket,
} from "../controllers/events.controller";

const router = Router();

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Protected routes
router.post("/:id/rsvp", protect, rsvpEvent);
router.post("/:id/purchase", purchaseTicket);

// Admin routes
router.post(
  "/",
  protect,
  adminOnly,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3, max: 200 }),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("eventType")
      .isIn(["virtual", "in-person", "hybrid"])
      .withMessage("Invalid event type"),
    body("startDate").isISO8601().withMessage("Valid start date required"),
    body("endDate").isISO8601().withMessage("Valid end date required"),
    body("maxAttendees")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Max attendees must be a positive integer"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be non-negative"),
  ],
  validate,
  createEvent,
);

router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

export default router;

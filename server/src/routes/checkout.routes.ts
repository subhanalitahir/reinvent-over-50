import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.middleware";
import {
  createBookingCheckout,
  createMembershipCheckout,
  createWorkbookCheckout,
  createEventCheckout,
  verifyCheckoutSession,
} from "../controllers/checkout.controller";

const router = Router();

// POST /api/checkout/booking
router.post(
  "/booking",
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
  ],
  validate,
  createBookingCheckout,
);

// POST /api/checkout/membership
router.post(
  "/membership",
  [
    body("plan")
      .isIn(["community", "transformation", "vip"])
      .withMessage("Invalid plan"),
    body("billingCycle")
      .isIn(["monthly", "annual"])
      .withMessage("Invalid billing cycle"),
    body("email")
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail(),
  ],
  validate,
  createMembershipCheckout,
);

// GET /api/checkout/verify?session_id=cs_xxx
router.get("/verify", verifyCheckoutSession);

// POST /api/checkout/workbook
router.post(
  "/workbook",
  [
    body("plan")
      .isIn(["workbook", "bundle"])
      .withMessage("Invalid plan. Use 'workbook' or 'bundle'"),
    body("email")
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail(),
  ],
  validate,
  createWorkbookCheckout,
);

// POST /api/checkout/event
router.post(
  "/event",
  [
    body("title").trim().notEmpty().withMessage("Event title is required"),
    body("amount")
      .isFloat({ min: 0.5 })
      .withMessage("Valid amount (in dollars) is required"),
    body("email")
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail(),
    body("date").optional().isString(),
    body("location").optional().isString(),
  ],
  validate,
  createEventCheckout,
);

export default router;

import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.middleware";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  deleteSubscriber,
} from "../controllers/emailSubscribers.controller";

const router = Router();

// Public – email capture (PDF popup funnel)
router.post(
  "/",
  [body("email").isEmail().withMessage("Valid email is required")],
  validate,
  subscribe,
);

router.post(
  "/unsubscribe",
  [body("email").isEmail().withMessage("Valid email is required")],
  validate,
  unsubscribe,
);

// Admin
router.get("/", protect, adminOnly, getAllSubscribers);
router.delete("/:id", protect, adminOnly, deleteSubscriber);

export default router;

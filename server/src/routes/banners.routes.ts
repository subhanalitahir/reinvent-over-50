import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.middleware";
import { protect, adminOnly } from "../middleware/auth.middleware";
import {
  getActiveBanners,
  trackBannerClick,
  createBanner,
  updateBanner,
  deleteBanner,
  getAllBannersAdmin,
} from "../controllers/banners.controller";

const router = Router();

// Public
router.get("/", getActiveBanners);
router.post("/:id/click", trackBannerClick);

// Admin
router.get("/all", protect, adminOnly, getAllBannersAdmin);

router.post(
  "/",
  protect,
  adminOnly,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("imageUrl").trim().notEmpty().withMessage("Image URL is required"),
    body("placement")
      .optional()
      .isIn(["about", "home", "events", "global"])
      .withMessage("Invalid placement"),
  ],
  validate,
  createBanner,
);

router.put("/:id", protect, adminOnly, updateBanner);
router.delete("/:id", protect, adminOnly, deleteBanner);

export default router;

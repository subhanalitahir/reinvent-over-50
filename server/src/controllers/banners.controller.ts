import { Request, Response } from "express";
import Banner from "../models/Banner";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess, sendCreated } from "../utils/apiResponse";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";

// GET /api/banners  (public – returns active banners, optionally filtered by placement)
export const getActiveBanners = asyncHandler(
  async (req: Request, res: Response) => {
    const filter: Record<string, unknown> = { status: "active" };
    if (req.query.placement) filter.placement = req.query.placement;

    const now = new Date();
    filter.$or = [
      { startDate: { $exists: false } },
      { startDate: { $lte: now } },
    ];

    const banners = await Banner.find(filter).sort({ createdAt: -1 });

    // Increment impressions asynchronously (fire and forget)
    const ids = banners.map((b) => b._id);
    Banner.updateMany({ _id: { $in: ids } }, { $inc: { impressions: 1 } }).catch(
      () => void 0,
    );

    sendSuccess(res, banners, "Banners fetched");
  },
);

// POST /api/banners/:id/click  (public – track clicks)
export const trackBannerClick = asyncHandler(
  async (req: Request, res: Response) => {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true },
    );
    if (!banner) throw new AppError("Banner not found", 404);
    sendSuccess(res, { linkUrl: banner.linkUrl }, "Click tracked");
  },
);

// POST /api/banners  (admin)
export const createBanner = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const banner = await Banner.create({
      ...req.body,
      createdBy: req.user!._id,
    });
    sendCreated(res, banner, "Banner created");
  },
);

// PUT /api/banners/:id  (admin)
export const updateBanner = asyncHandler(
  async (req: Request, res: Response) => {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner) throw new AppError("Banner not found", 404);
    sendSuccess(res, banner, "Banner updated");
  },
);

// DELETE /api/banners/:id  (admin)
export const deleteBanner = asyncHandler(
  async (req: Request, res: Response) => {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) throw new AppError("Banner not found", 404);
    sendSuccess(res, null, "Banner deleted");
  },
);

// GET /api/banners/all  (admin – all banners including inactive)
export const getAllBannersAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const banners = await Banner.find({})
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    sendSuccess(res, banners, "All banners fetched");
  },
);

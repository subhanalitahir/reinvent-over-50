import mongoose, { Document, Schema } from "mongoose";

export type BannerPlacement = "about" | "home" | "events" | "global";
export type BannerStatus = "active" | "inactive";

export interface IBanner extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  altText?: string;
  placement: BannerPlacement;
  status: BannerStatus;
  sponsor?: string;
  startDate?: Date;
  endDate?: Date;
  clicks: number;
  impressions: number;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    linkUrl: String,
    altText: { type: String, maxlength: 300 },
    placement: {
      type: String,
      enum: ["about", "home", "events", "global"],
      default: "about",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    sponsor: { type: String, trim: true, maxlength: 200 },
    startDate: Date,
    endDate: Date,
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

BannerSchema.index({ placement: 1, status: 1 });

export default mongoose.model<IBanner>("Banner", BannerSchema);

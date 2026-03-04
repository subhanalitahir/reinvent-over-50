import mongoose, { Document, Schema } from "mongoose";

export type ProductType = "workbook" | "bundle" | "course" | "other";
export type ProductStatus = "active" | "inactive" | "archived";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  type: ProductType;
  status: ProductStatus;
  price: number;
  compareAtPrice?: number; // original price for display
  imageUrl?: string;
  fileUrl?: string;        // downloadable file (digital product)
  includesBooking: boolean; // true for bundle (workbook + 1-on-1 session)
  stripeProductId?: string;
  stripePriceId?: string;
  tags: string[];
  isDigital: boolean;
  maxPurchases?: number;   // limit total sales (optional)
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    type: {
      type: String,
      enum: ["workbook", "bundle", "course", "other"],
      required: [true, "Product type is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be non-negative"],
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    imageUrl: String,
    fileUrl: String,
    includesBooking: {
      type: Boolean,
      default: false,
    },
    stripeProductId: String,
    stripePriceId: String,
    tags: {
      type: [String],
      default: [],
    },
    isDigital: {
      type: Boolean,
      default: true,
    },
    maxPurchases: {
      type: Number,
      min: 1,
    },
  },
  { timestamps: true },
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ type: 1, status: 1 });

export default mongoose.model<IProduct>("Product", ProductSchema);

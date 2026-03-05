import mongoose, { Document, Schema } from "mongoose";

export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled";

export interface IOrderItem {
  product?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  guestName?: string;
  guestEmail: string;
  items: IOrderItem[];
  subtotal: number;
  total: number;
  currency: string;
  status: OrderStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paypalOrderId?: string;
  paidAt?: Date;
  refundedAt?: Date;
  bookingLink?: string;
  downloadLink?: string;
  confirmationEmailSentAt?: Date;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guestName: { type: String, trim: true },
    guestEmail: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => v.length > 0,
        message: "Order must have at least one item",
      },
    },
    subtotal: { type: Number, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "cancelled"],
      default: "pending",
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    paypalOrderId: String,
    paidAt: Date,
    refundedAt: Date,
    bookingLink: String,
    downloadLink: String,
    confirmationEmailSentAt: Date,
    ipAddress: String,
  },
  { timestamps: true },
);

OrderSchema.index({ guestEmail: 1 });
OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ stripeSessionId: 1 });

export default (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);

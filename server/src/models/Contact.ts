import mongoose, { Document, Schema } from "mongoose";

export type ContactSubject =
  | "general"
  | "membership"
  | "technical"
  | "partnership"
  | "other";
export type ContactStatus = "new" | "read" | "replied" | "archived";

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
  status: ContactStatus;
  repliedAt?: Date;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      enum: ["general", "membership", "technical", "partnership", "other"],
      default: "general",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
    repliedAt: Date,
    ipAddress: String,
  },
  { timestamps: true },
);

ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });

export default mongoose.model<IContact>("Contact", ContactSchema);

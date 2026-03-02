import mongoose, { Document, Schema } from "mongoose";

export type SessionType = "discovery" | "coaching" | "group" | "workshop";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  sessionType: SessionType;
  scheduledAt: Date;
  duration: number; // minutes
  status: BookingStatus;
  notes?: string;
  meetingLink?: string;
  reminderSentAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    guestName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    guestEmail: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    guestPhone: {
      type: String,
      trim: true,
    },
    sessionType: {
      type: String,
      enum: ["discovery", "coaching", "group", "workshop"],
      required: [true, "Session type is required"],
    },
    scheduledAt: {
      type: Date,
      required: [true, "Scheduled date/time is required"],
    },
    duration: {
      type: Number,
      default: 60,
      min: 15,
      max: 240,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    meetingLink: String,
    reminderSentAt: Date,
    cancelledAt: Date,
    cancelReason: String,
  },
  { timestamps: true },
);

BookingSchema.index({ guestEmail: 1 });
BookingSchema.index({ scheduledAt: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ user: 1, status: 1 });

export default mongoose.model<IBooking>("Booking", BookingSchema);

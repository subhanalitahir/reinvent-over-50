import mongoose, { Document, Schema } from "mongoose";

export type SubscriberSource =
  | "pdf-popup"
  | "newsletter"
  | "checkout"
  | "event"
  | "other";
export type SubscriberStatus = "subscribed" | "unsubscribed" | "bounced";

export interface IEmailSubscriber extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  firstName?: string;
  lastName?: string;
  source: SubscriberSource;
  status: SubscriberStatus;
  freeResourceDownloaded?: string; // name/key of the free resource
  tags: string[];
  mailchimpId?: string; // external ID from Mailchimp
  ipAddress?: string;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailSubscriberSchema = new Schema<IEmailSubscriber>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    firstName: { type: String, trim: true, maxlength: 100 },
    lastName: { type: String, trim: true, maxlength: 100 },
    source: {
      type: String,
      enum: ["pdf-popup", "newsletter", "checkout", "event", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["subscribed", "unsubscribed", "bounced"],
      default: "subscribed",
    },
    freeResourceDownloaded: String,
    tags: { type: [String], default: [] },
    mailchimpId: String,
    ipAddress: String,
    unsubscribedAt: Date,
  },
  { timestamps: true },
);

EmailSubscriberSchema.index({ email: 1 });
EmailSubscriberSchema.index({ status: 1 });
EmailSubscriberSchema.index({ source: 1 });

export default mongoose.model<IEmailSubscriber>(
  "EmailSubscriber",
  EmailSubscriberSchema,
);

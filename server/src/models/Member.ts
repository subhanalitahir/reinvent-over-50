import mongoose, { Document, Schema } from "mongoose";

export type MembershipPlan = "community" | "growth" | "transformation";
export type BillingCycle = "monthly" | "annual";
export type MemberStatus = "active" | "cancelled" | "expired" | "trial";

export interface IMember extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  plan: MembershipPlan;
  billingCycle: BillingCycle;
  status: MemberStatus;
  price: number;
  startDate: Date;
  endDate?: Date;
  trialEndsAt?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ["community", "growth", "transformation"],
      required: [true, "Membership plan is required"],
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "annual"],
      default: "monthly",
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "trial"],
      default: "trial",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    trialEndsAt: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    cancelledAt: Date,
    cancelReason: String,
  },
  { timestamps: true },
);

MemberSchema.index({ user: 1 });
MemberSchema.index({ status: 1 });
MemberSchema.index({ plan: 1, status: 1 });

export default mongoose.model<IMember>("Member", MemberSchema);

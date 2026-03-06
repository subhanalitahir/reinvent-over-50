import mongoose, { Document, Schema } from "mongoose";

export interface MembershipPrices {
  community: { monthly: number; annual: number };
  growth: { monthly: number; annual: number };
  transformation: { monthly: number; annual: number };
  vip: { monthly: number; annual: number };
}

export interface BookingPrices {
  discovery: number;
  coaching: number;
  extended: number;
  vip_intensive: number;
}

export interface IPricingConfig extends Document {
  membership: MembershipPrices;
  bookings: BookingPrices;
  updatedAt: Date;
}

const PricingConfigSchema = new Schema<IPricingConfig>(
  {
    membership: {
      community: {
        monthly: { type: Number, default: 2900 },
        annual: { type: Number, default: 29000 },
      },
      growth: {
        monthly: { type: Number, default: 4900 },
        annual: { type: Number, default: 49000 },
      },
      transformation: {
        monthly: { type: Number, default: 5900 },
        annual: { type: Number, default: 59000 },
      },
      vip: {
        monthly: { type: Number, default: 9900 },
        annual: { type: Number, default: 99000 },
      },
    },
    bookings: {
      discovery: { type: Number, default: 0 },
      coaching: { type: Number, default: 15000 },
      extended: { type: Number, default: 20000 },
      vip_intensive: { type: Number, default: 30000 },
    },
  },
  { timestamps: true },
);

export default (mongoose.models
  .PricingConfig as mongoose.Model<IPricingConfig>) ||
  mongoose.model<IPricingConfig>("PricingConfig", PricingConfigSchema);

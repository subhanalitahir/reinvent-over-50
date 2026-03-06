import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import PricingConfig from "@/lib/models/PricingConfig";
import { getAuthUser, requireAdmin, apiSuccess, handleError } from "@/lib/auth";

// Helper: get or create the singleton config
async function getConfig() {
  let config = await PricingConfig.findOne();
  if (!config) {
    config = await PricingConfig.create({});
  }
  return config;
}

// GET /api/pricing  (public)
export async function GET() {
  try {
    await connectDB();
    const config = await getConfig();
    return apiSuccess(config);
  } catch (err) {
    return handleError(err);
  }
}

// PUT /api/pricing  (admin only)
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    requireAdmin(user);

    const body = await req.json();
    let config = await PricingConfig.findOne();

    if (!config) {
      config = await PricingConfig.create(body);
    } else {
      // Deep-merge membership and bookings
      if (body.membership) {
        for (const plan of Object.keys(body.membership)) {
          if (body.membership[plan].monthly !== undefined)
            (config.membership as Record<string, Record<string, number>>)[
              plan
            ].monthly = Number(body.membership[plan].monthly);
          if (body.membership[plan].annual !== undefined)
            (config.membership as Record<string, Record<string, number>>)[
              plan
            ].annual = Number(body.membership[plan].annual);
        }
      }
      if (body.bookings) {
        for (const key of Object.keys(body.bookings)) {
          (config.bookings as Record<string, number>)[key] = Number(
            body.bookings[key],
          );
        }
      }
      config.markModified("membership");
      config.markModified("bookings");
      await config.save();
    }

    return apiSuccess(config, "Pricing updated successfully");
  } catch (err) {
    return handleError(err);
  }
}

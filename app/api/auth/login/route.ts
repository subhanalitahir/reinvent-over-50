import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import {
  generateToken,
  apiSuccess,
  apiError,
  handleError,
  AppError,
} from "@/lib/auth";

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = (await req.json()) as {
      email: string;
      password: string;
    };

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return apiError("Valid email required", 400);
    if (!password) return apiError("Password is required", 400);

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user._id.toString());
    const userObj = user.toJSON();
    return apiSuccess({ user: userObj, token }, "Login successful");
  } catch (err) {
    return handleError(err);
  }
}

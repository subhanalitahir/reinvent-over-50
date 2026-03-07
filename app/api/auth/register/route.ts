import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import {
  generateToken,
  apiSuccess,
  apiCreated,
  apiError,
  handleError,
  AppError,
} from "@/lib/auth";

// POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
    };

    if (!name || name.trim().length < 2)
      return apiError("Name must be at least 2 characters", 400);
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return apiError("Valid email required", 400);
    if (!password || password.length < 8)
      return apiError("Password must be at least 8 characters", 400);

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) throw new AppError("Email already registered", 409);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: 'user',
    });
    const token = generateToken(user._id.toString());

    return apiCreated({ user, token }, "Account created successfully");
  } catch (err) {
    return handleError(err);
  }
}

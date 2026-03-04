import { Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import asyncHandler from "../utils/asyncHandler";
import { sendSuccess, sendCreated, sendError } from "../utils/apiResponse";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";

const generateToken = (id: string): string => {
  // @types/jsonwebtoken v9 uses the branded StringValue type for expiresIn;
  // casting options avoids the string-vs-StringValue mismatch at compile time.
  const options = { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" };
  return jwt.sign({ id }, process.env.JWT_SECRET as string, options as jwt.SignOptions);
};

// POST /api/auth/register
export const register = asyncHandler(async (req, res: Response) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id.toString());

  sendCreated(res, { user, token }, "Account created successfully");
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id.toString());

  // Omit password from response
  const userObj = user.toJSON();
  sendSuccess(res, { user: userObj, token }, "Login successful");
});

// GET /api/auth/me  (protected)
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id);
  if (!user) throw new AppError("User not found", 404);
  sendSuccess(res, user, "User profile fetched");
});

// PUT /api/auth/me  (protected)
export const updateMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, avatar } = req.body as { name?: string; avatar?: string };

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name, avatar },
      { new: true, runValidators: true },
    );

    if (!user) throw new AppError("User not found", 404);
    sendSuccess(res, user, "Profile updated successfully");
  },
);

// PUT /api/auth/change-password  (protected)
export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    const user = await User.findById(req.user!._id).select("+password");
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError("Current password is incorrect", 400);

    user.password = newPassword;
    await user.save();

    sendSuccess(res, null, "Password changed successfully");
  },
);

// DELETE /api/auth/me  (protected)
export const deleteMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await User.findByIdAndDelete(req.user!._id);
    sendSuccess(res, null, "Account deleted successfully");
  },
);

// GET /api/auth/users  (admin)
export const getAllUsers = asyncHandler(async (_req, res: Response) => {
  const users = await User.find().sort({ createdAt: -1 });
  sendSuccess(res, users, "Users fetched", 200, { total: users.length });
});

// DELETE /api/auth/users/:id  (admin)
export const deleteUser = asyncHandler(async (req, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError("User not found", 404);
  sendSuccess(res, null, "User deleted successfully");
});

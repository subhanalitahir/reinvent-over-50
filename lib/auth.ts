import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "./db";
import User, { IUser } from "./models/User";

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

// ─── AppError ─────────────────────────────────────────────────────────────────

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ─── JWT helpers ──────────────────────────────────────────────────────────────

export function generateToken(id: string): string {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as string,
    } as jwt.SignOptions,
  );
}

export async function getAuthUser(req: NextRequest): Promise<IUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    return user as IUser | null;
  } catch {
    return null;
  }
}

// ─── Guard helpers ────────────────────────────────────────────────────────────

export function requireAuth(user: IUser | null): asserts user is IUser {
  if (!user) throw new AppError("Not authorized. No token provided.", 401);
}

export function requireAdmin(user: IUser | null): asserts user is IUser {
  requireAuth(user);
  if (user.role !== "admin")
    throw new AppError("Access denied. Admins only.", 403);
}

// ─── Response helpers ─────────────────────────────────────────────────────────

interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export function apiSuccess<T>(
  data: T,
  message = "Success",
  status = 200,
  meta?: Meta,
): NextResponse {
  const body: Record<string, unknown> = { success: true, message, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

export function apiCreated<T>(
  data: T,
  message = "Created successfully",
): NextResponse {
  return apiSuccess(data, message, 201);
}

export function apiError(
  message: string,
  status = 500,
  errors?: unknown,
): NextResponse {
  const body: Record<string, unknown> = { success: false, message };
  if (errors) body.errors = errors;
  return NextResponse.json(body, { status });
}

// ─── Catch-all route wrapper ──────────────────────────────────────────────────

export function handleError(err: unknown): NextResponse {
  if (err instanceof AppError) {
    return apiError(err.message, err.statusCode);
  }
  console.error("[API Error]", err);
  return apiError("Internal server error");
}

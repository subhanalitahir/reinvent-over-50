import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { sendError } from "../utils/apiResponse";

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token as string;
  }

  if (!token) {
    sendError(res, "Not authorized. No token provided.", 401);
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      sendError(res, "User not found. Token is invalid.", 401);
      return;
    }

    req.user = user;
    next();
  } catch {
    sendError(res, "Not authorized. Token is invalid or expired.", 401);
  }
};

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user || req.user.role !== "admin") {
    sendError(res, "Access denied. Admins only.", 403);
    return;
  }
  next();
};

export const memberOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user || (req.user.role !== "member" && req.user.role !== "admin")) {
    sendError(res, "Access denied. Members only.", 403);
    return;
  }
  next();
};

/**
 * Middleware factory: allows access if the user has one of the specified roles.
 * Usage: requireRole("admin", "member")
 */
export const requireRole = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, `Access denied. Required roles: ${roles.join(", ")}.`, 403);
      return;
    }
    next();
  };

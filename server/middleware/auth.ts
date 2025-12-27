import { Request, Response, NextFunction } from "express";
import { extractTokenFromHeader, verifyToken, JWTPayload } from "../utils/jwt";

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Authentication middleware: Verify JWT and attach user to request
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    res.status(401).json({
      success: false,
      error: "Missing authentication token",
    });
    return;
  }

  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
    return;
  }

  req.user = payload;
  next();
}

/**
 * RBAC middleware: Check if user has required role(s)
 */
export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }

    const hasRole = allowedRoles.some((role) => req.user!.roles.includes(role));

    if (!hasRole) {
      res.status(403).json({
        success: false,
        error: "Insufficient permissions: required role not found",
      });
      return;
    }

    next();
  };
}

/**
 * Permission-based middleware: Check if user has required permission(s)
 */
export function requirePermission(requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }

    const hasPermission = requiredPermissions.some((perm) =>
      req.user!.permissions.includes(perm)
    );

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        error: "Insufficient permissions: required permission not found",
      });
      return;
    }

    next();
  };
}

/**
 * Optional auth middleware: Attach user if token exists, but don't fail if not
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}

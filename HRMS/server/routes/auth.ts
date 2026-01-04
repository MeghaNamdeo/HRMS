import { Router, Request, Response } from "express";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyRefreshTokenHash,
  getRefreshTokenExpiry,
  JWTPayload,
} from "../utils/jwt";
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * Mock database for demonstration
 * In production, replace with actual database queries
 */
import { db } from "../db/mock";

// Mock refresh tokens store
const refreshTokens: Record<string, { userId: string; expiresAt: number }> = {};

/**
 * Simple password hashing (use bcrypt in production)
 */
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "salt").digest("hex");
}

/**
 * Verify password
 */
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * POST /auth/login
 * Login endpoint - validates credentials and returns JWT
 */
router.post("/login", (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
      return;
    }

    // Find user
    const user = mockUsers[email];
    if (!user || !verifyPassword(password, user.password_hash)) {
      res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      roles: user.roles,
      permissions: user.permissions,
    });

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);
    const refreshTokenExpiry = getRefreshTokenExpiry();

    // Store refresh token
    refreshTokens[refreshTokenHash] = {
      userId: user.id,
      expiresAt: Math.floor(Date.now() / 1000) + refreshTokenExpiry,
    };

    // Log successful login
    console.log(`[AUTH] User ${email} logged in successfully`);

    // Return tokens
    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          roles: user.roles,
        },
      },
    });
  } catch (error) {
    console.error("[AUTH] Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * POST /auth/refresh
 * Refresh token endpoint - gets new access token using refresh token
 */
router.post("/refresh", (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: "Refresh token is required",
      });
      return;
    }

    const refreshTokenHash = hashRefreshToken(refreshToken);
    const storedToken = refreshTokens[refreshTokenHash];

    if (!storedToken) {
      res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
      return;
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (storedToken.expiresAt < now) {
      delete refreshTokens[refreshTokenHash];
      res.status(401).json({
        success: false,
        error: "Refresh token expired",
      });
      return;
    }

    // Find user and generate new access token
    const user = Object.values(mockUsers).find((u) => u.id === storedToken.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      roles: user.roles,
      permissions: user.permissions,
    });

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error("[AUTH] Refresh error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * GET /auth/me
 * Get current user info - requires authentication
 */
router.get("/me", authMiddleware, (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          userId: req.user.userId,
          email: req.user.email,
          name: req.user.name,
          roles: req.user.roles,
          permissions: req.user.permissions,
        },
      },
    });
  } catch (error) {
    console.error("[AUTH] Get user error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * POST /auth/logout
 * Logout endpoint - invalidate refresh token
 */
router.post("/logout", authMiddleware, (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const refreshTokenHash = hashRefreshToken(refreshToken);
      delete refreshTokens[refreshTokenHash];
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("[AUTH] Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;

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
interface MockUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  roles: string[];
  permissions: string[];
}

// Mock users database
const mockUsers: Record<string, MockUser> = {
  "john.doe@company.com": {
    id: "user-001",
    email: "john.doe@company.com",
    password_hash: hashPassword("demo"),
    first_name: "John",
    last_name: "Doe",
    roles: ["ROLE_EMPLOYEE"],
    permissions: [
      "PERM_EMPLOYEE_VIEW_PROFILE",
      "PERM_EMPLOYEE_EDIT_PROFILE",
      "PERM_EMPLOYEE_VIEW_ATTENDANCE",
      "PERM_EMPLOYEE_SUBMIT_ATTENDANCE_CORRECTION",
      "PERM_EMPLOYEE_VIEW_LEAVES",
      "PERM_EMPLOYEE_REQUEST_LEAVE",
      "PERM_EMPLOYEE_VIEW_PAYSLIP",
      "PERM_EMPLOYEE_VIEW_DOCUMENTS",
      "PERM_EMPLOYEE_UPLOAD_DOCUMENTS",
      "PERM_EMPLOYEE_VIEW_PERFORMANCE",
      "PERM_EMPLOYEE_DASHBOARD",
    ],
  },
  "hr.admin@company.com": {
    id: "user-002",
    email: "hr.admin@company.com",
    password_hash: hashPassword("demo"),
    first_name: "HR",
    last_name: "Admin",
    roles: ["ROLE_HR_ADMIN"],
    permissions: [
      "PERM_HR_VIEW_EMPLOYEES",
      "PERM_HR_CREATE_EMPLOYEE",
      "PERM_HR_EDIT_EMPLOYEE",
      "PERM_HR_DELETE_EMPLOYEE",
      "PERM_HR_VIEW_ATTENDANCE",
      "PERM_HR_APPROVE_ATTENDANCE_CORRECTION",
      "PERM_HR_VIEW_LEAVES",
      "PERM_HR_APPROVE_LEAVES",
      "PERM_HR_MANAGE_LEAVE_POLICIES",
      "PERM_HR_VIEW_DOCUMENTS",
      "PERM_HR_MANAGE_DOCUMENTS",
      "PERM_HR_MANAGE_RECRUITMENT",
      "PERM_HR_MANAGE_ONBOARDING",
      "PERM_HR_VIEW_PERFORMANCE",
      "PERM_HR_MANAGE_PERFORMANCE",
      "PERM_HR_VIEW_REPORTS",
      "PERM_HR_DASHBOARD",
    ],
  },
  "finance.admin@company.com": {
    id: "user-003",
    email: "finance.admin@company.com",
    password_hash: hashPassword("demo"),
    first_name: "Finance",
    last_name: "Admin",
    roles: ["ROLE_FINANCE_ADMIN"],
    permissions: [
      "PERM_FINANCE_VIEW_PAYROLL",
      "PERM_FINANCE_MANAGE_SALARY_STRUCTURE",
      "PERM_FINANCE_PROCESS_PAYROLL",
      "PERM_FINANCE_GENERATE_PAYSLIPS",
      "PERM_FINANCE_VIEW_PAYSLIPS",
      "PERM_FINANCE_MANAGE_TAX",
      "PERM_FINANCE_VIEW_ATTENDANCE",
      "PERM_FINANCE_VIEW_LEAVES",
      "PERM_FINANCE_VIEW_REPORTS",
      "PERM_FINANCE_DASHBOARD",
    ],
  },
  "manager@company.com": {
    id: "user-004",
    email: "manager@company.com",
    password_hash: hashPassword("demo"),
    first_name: "Manager",
    last_name: "User",
    roles: ["ROLE_MANAGER"],
    permissions: [
      "PERM_MANAGER_VIEW_TEAM",
      "PERM_MANAGER_VIEW_TEAM_ATTENDANCE",
      "PERM_MANAGER_APPROVE_ATTENDANCE",
      "PERM_MANAGER_APPROVE_LEAVES",
      "PERM_MANAGER_VIEW_PERFORMANCE",
      "PERM_MANAGER_MANAGE_PERFORMANCE",
      "PERM_MANAGER_VIEW_GOALS",
      "PERM_MANAGER_MANAGE_GOALS",
      "PERM_MANAGER_VIEW_REPORTS",
      "PERM_MANAGER_DASHBOARD",
    ],
  },
  "super.admin@company.com": {
    id: "user-005",
    email: "super.admin@company.com",
    password_hash: hashPassword("demo"),
    first_name: "Super",
    last_name: "Admin",
    roles: ["ROLE_SUPER_ADMIN"],
    permissions: [
      "PERM_SUPER_ADMIN_MANAGE_USERS",
      "PERM_SUPER_ADMIN_MANAGE_ROLES",
      "PERM_SUPER_ADMIN_MANAGE_PERMISSIONS",
      "PERM_SUPER_ADMIN_VIEW_AUDIT_LOGS",
      "PERM_SUPER_ADMIN_MANAGE_SETTINGS",
      "PERM_SUPER_ADMIN_MANAGE_INTEGRATIONS",
      "PERM_SUPER_ADMIN_VIEW_ORGANIZATION",
      "PERM_SUPER_ADMIN_MANAGE_ORGANIZATION",
      "PERM_SUPER_ADMIN_DASHBOARD",
      "PERM_SUPER_ADMIN_FEATURE_FLAGS",
    ],
  },
};

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

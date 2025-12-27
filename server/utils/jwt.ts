import crypto from "crypto";

// Types
export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// JWT secret key (should come from environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Simple JWT implementation (base64url encoding)
 * For production, use a library like 'jsonwebtoken'
 */

// Helper function to base64url encode
function base64urlEncode(data: string): string {
  return Buffer.from(data)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Helper function to base64url decode
function base64urlDecode(data: string): string {
  data += "=".repeat((4 - (data.length % 4)) % 4);
  return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
}

// Generate HMAC signature
function generateSignature(header: string, payload: string, secret: string): string {
  const message = `${header}.${payload}`;
  const signature = crypto.createHmac("sha256", secret).update(message).digest();
  return base64urlEncode(signature.toString("base64"));
}

/**
 * Generate a JWT token
 */
export function generateAccessToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  const header = base64urlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = base64urlEncode(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + ACCESS_TOKEN_EXPIRY,
    })
  );

  const signature = generateSignature(header, tokenPayload, JWT_SECRET);
  return `${header}.${tokenPayload}.${signature}`;
}

/**
 * Generate a refresh token (used for obtaining new access tokens)
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const [headerStr, payloadStr, signatureStr] = parts;

    // Verify signature
    const expectedSignature = generateSignature(headerStr, payloadStr, JWT_SECRET);
    if (signatureStr !== expectedSignature) {
      return null;
    }

    // Decode and parse payload
    const payloadJson = base64urlDecode(payloadStr);
    const payload = JSON.parse(payloadJson) as JWTPayload;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(
  authHeader?: string
): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return null;
  }

  return parts[1];
}

/**
 * Get token expiry time
 */
export function getAccessTokenExpiry(): number {
  return ACCESS_TOKEN_EXPIRY;
}

export function getRefreshTokenExpiry(): number {
  return REFRESH_TOKEN_EXPIRY;
}

/**
 * Hash a refresh token for storage (using PBKDF2)
 */
export function hashRefreshToken(token: string): string {
  return crypto
    .pbkdf2Sync(token, JWT_SECRET, 1000, 32, "sha256")
    .toString("hex");
}

/**
 * Verify a refresh token against its hash
 */
export function verifyRefreshTokenHash(token: string, hash: string): boolean {
  const computedHash = hashRefreshToken(token);
  return computedHash === hash;
}

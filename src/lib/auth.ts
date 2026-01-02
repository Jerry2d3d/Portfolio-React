/**
 * Authentication Utilities
 *
 * Handles password hashing, JWT token generation and verification
 */

import bcrypt from 'bcryptjs';
import { logger } from '@/lib/logger';
import jwt from 'jsonwebtoken';
import DOMPurify from 'isomorphic-dompurify';

// Constants
const SALT_ROUNDS = 12;
// Default to empty string to prevent build-time crashes
const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function ensureJwtSecret(): void {
  if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Application cannot start.');
  }
}

// Types
export interface JWTPayload {
  userId: string;
  email: string;
}

export interface DecodedToken extends JWTPayload {
  iat: number;
  exp: number;
}

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

/**
 * Generate a JWT token
 * @param payload - User data to encode in token
 * @returns JWT token string
 */
export function generateToken(payload: JWTPayload): string {
  ensureJwtSecret();
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as string,
  } as jwt.SignOptions);
  return token;
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): DecodedToken | null {
  ensureJwtSecret();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    // Reduce log spam from bot-generated invalid tokens in production
    // logger.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Requirements: At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 * @param password - Password to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }

  return { isValid: true };
}

/**
 * Sanitize user input to prevent XSS attacks
 * Uses DOMPurify for comprehensive HTML sanitization
 * @param input - User input string
 * @returns Sanitized string safe for rendering
 */
export function sanitizeInput(input: string): string {
  // DOMPurify removes all potentially dangerous HTML/scripts
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [], // Strip all attributes
    KEEP_CONTENT: true, // Keep text content
  });
}

/**
 * Admin Authentication Utilities
 *
 * Handles admin role verification, token validation, and permission checks
 */

import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { verifyToken, DecodedToken } from './auth';
import { findAdminById } from './db/admin';
import { getClientIp } from './clientIp';

/**
 * Verify if a token belongs to an admin user
 * @param token - JWT token string
 * @returns DecodedToken if valid and user is admin, null otherwise
 */
export async function verifyAdminToken(token: string): Promise<DecodedToken | null> {
  try {
    // First verify the token itself
    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    // Then verify the user is an admin
    const admin = await findAdminById(decoded.userId);
    if (!admin || !admin.isAdmin) {
      return null;
    }

    return decoded;
  } catch (error) {
    logger.error('Admin token verification failed:', error);
    return null;
  }
}

/**
 * Check if a request is from an authenticated admin
 * Extracts and validates the JWT token from request headers or cookies
 * @param request - NextRequest object
 * @returns DecodedToken if valid admin, null otherwise
 */
export async function verifyAdminRequest(
  request: NextRequest
): Promise<DecodedToken | null> {
  try {
    let token: string | undefined;

    // 1. Try Authorization header first (for API clients)
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    // 2. Fall back to cookie (for browser clients)
    else {
      token = request.cookies.get('token')?.value;
    }

    if (!token) {
      return null;
    }

    return await verifyAdminToken(token);
  } catch (error) {
    logger.error('Admin request verification failed:', error);
    return null;
  }
}


/**
 * Type for admin request validation result
 */
export interface AdminRequestValidation {
  isValid: boolean;
  decoded?: DecodedToken;
  error?: string;
  statusCode?: number;
}

/**
 * Validate an admin request comprehensively
 * Checks authentication, admin role, and rate limiting
 * @param request - NextRequest object
 * @returns Validation result with decoded token if valid
 */
export async function validateAdminRequest(
  request: NextRequest
): Promise<AdminRequestValidation> {
  try {
    let token: string | undefined;

    // 1. Try Authorization header first (for API clients)
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    // 2. Fall back to cookie (for browser clients)
    else {
      token = request.cookies.get('token')?.value;
    }

    if (!token) {
      return {
        isValid: false,
        error: 'Authentication required',
        statusCode: 401,
      };
    }

    // Verify token
    const decoded = await verifyAdminToken(token);

    if (!decoded) {
      return {
        isValid: false,
        error: 'Invalid or expired token / user is not admin',
        statusCode: 403,
      };
    }

    return {
      isValid: true,
      decoded,
    };
  } catch (error) {
    logger.error('Admin request validation error:', error);
    return {
      isValid: false,
      error: 'Validation failed',
      statusCode: 500,
    };
  }
}

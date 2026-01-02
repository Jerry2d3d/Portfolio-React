/**
 * GET /api/admin/users
 *
 * List all users with pagination
 * Requires: Valid JWT token + admin role
 * Rate limit: 30 requests per minute per IP
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { validateAdminRequest } from '@/lib/adminAuth';
import { getAllUsers, findAdminById } from '@/lib/db/admin';
import { checkRateLimit } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/clientIp';
import { hasAdminPermission } from '@/models/Admin';

// Rate limit configuration: 30 requests per minute
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Check rate limit
    const rateLimit = checkRateLimit(
      `admin:users:${clientIp}`,
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Validate admin request
    const validation = await validateAdminRequest(request);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: validation.error || 'Unauthorized',
        },
        { status: validation.statusCode || 401 }
      );
    }

    // Check admin has 'manage_users' permission
    const admin = await findAdminById(validation.decoded!.userId);
    if (!admin || !hasAdminPermission(admin, 'manage_users')) {
      return NextResponse.json(
        {
          success: false,
          error: 'INSUFFICIENT_PERMISSIONS',
          message: 'You do not have permission to manage users',
        },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    // FIX: Extract search parameter
    const searchParam = searchParams.get('search') || undefined;

    // Validate pagination parameters
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const limit = limitParam
      ? Math.max(1, Math.min(parseInt(limitParam, 10), 100))
      : 20;

    // Validate page and limit are valid numbers
    if (isNaN(page) || isNaN(limit)) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PARAMS',
          message: 'Invalid page or limit parameter',
        },
        { status: 400 }
      );
    }

    // Fetch users with pagination and search
    // FIX: Pass search parameter to DB function
    const result = await getAllUsers(page, limit, searchParam);

    return NextResponse.json(
      {
        success: true,
        data: {
          users: result.users,
          pagination: {
            page: result.page,
            limit,
            total: result.total,
            pages: result.pages,
          },
        },
        message: `Retrieved ${result.users.length} users`,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error in GET /api/admin/users:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'Failed to retrieve users',
      },
      { status: 500 }
    );
  }
}

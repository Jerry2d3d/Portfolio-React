/**
 * DELETE /api/admin/users/[id]
 *
 * Delete a user and their associated QR codes
 * Requires: Valid JWT token + admin role
 * Rate limit: 10 requests per minute per IP
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { ObjectId } from 'mongodb';
import { validateAdminRequest } from '@/lib/adminAuth';
import { deleteUser, findUserById } from '@/lib/db/users';
import { createAuditLog, findAdminById } from '@/lib/db/admin';
import { checkRateLimit } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/clientIp';
import { hasAdminPermission } from '@/models/Admin';

// Rate limit configuration: 10 requests per minute
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetUserId } = await params;
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Check rate limit
    const rateLimit = checkRateLimit(
      `admin:delete-user:${clientIp}`,
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many delete requests. Please try again later.',
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

    const adminId = validation.decoded?.userId;

    // Check admin has 'delete_users' permission
    const admin = await findAdminById(adminId!);
    if (!admin || !hasAdminPermission(admin, 'delete_users')) {
      return NextResponse.json(
        {
          success: false,
          error: 'INSUFFICIENT_PERMISSIONS',
          message: 'You do not have permission to delete users',
        },
        { status: 403 }
      );
    }

    // Validate user ID format
    if (!targetUserId || !ObjectId.isValid(targetUserId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_USER_ID',
          message: 'Invalid user ID format',
        },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (adminId === targetUserId) {
      return NextResponse.json(
        {
          success: false,
          error: 'CANNOT_DELETE_SELF',
          message: 'You cannot delete your own admin account',
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await findUserById(targetUserId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Delete the user
    const deleted = await deleteUser(targetUserId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'DELETION_FAILED',
          message: 'Failed to delete user',
        },
        { status: 500 }
      );
    }

    // Create audit log entry
    try {
      await createAuditLog(
        'delete_user',
        adminId!,
        targetUserId,
        {
          email: user.email,
          userName: user.name,
        },
        clientIp
      );
    } catch (auditError) {
      logger.error('Error creating audit log:', auditError);
      // Don't fail the request if audit logging fails
    }

    return NextResponse.json(
      {
        success: true,
        message: `User ${user.email} deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error in DELETE /api/admin/users/[id]:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'Failed to delete user',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users/[id]/verify
 *
 * Toggle email verification status for a user
 * Requires: Valid JWT token + admin role
 * Rate limit: 20 requests per minute per IP
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { ObjectId } from 'mongodb';
import { validateAdminRequest } from '@/lib/adminAuth';
import { findUserById } from '@/lib/db/users';
import { updateUserVerificationStatus, createAuditLog, findAdminById } from '@/lib/db/admin';
import { checkRateLimit } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/clientIp';
import { hasAdminPermission } from '@/models/Admin';

// Rate limit configuration: 20 requests per minute
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetUserId } = await params;
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Check rate limit
    const rateLimit = checkRateLimit(
      `admin:verify-user:${clientIp}`,
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

    const adminId = validation.decoded?.userId;

    // Check admin has 'verify_emails' permission
    const admin = await findAdminById(adminId!);
    if (!admin || !hasAdminPermission(admin, 'verify_emails')) {
      return NextResponse.json(
        {
          success: false,
          error: 'INSUFFICIENT_PERMISSIONS',
          message: 'You do not have permission to verify emails',
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { isVerified } = body;

    // Validate request body
    if (typeof isVerified !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_BODY',
          message: 'isVerified field must be a boolean',
        },
        { status: 400 }
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

    // Update verification status
    const updated = await updateUserVerificationStatus(targetUserId, isVerified);

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: 'UPDATE_FAILED',
          message: 'Failed to update verification status',
        },
        { status: 500 }
      );
    }

    // Create audit log entry
    try {
      await createAuditLog(
        'verify_email',
        adminId!,
        targetUserId,
        {
          email: user.email,
          isVerified: isVerified,
          action: isVerified ? 'verified' : 'unverified',
        },
        clientIp
      );
    } catch (auditError) {
      logger.error('Error creating audit log:', auditError);
      // Don't fail the request if audit logging fails
    }

    // Get updated user info (without password)
    const updatedUser = await findUserById(targetUserId);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: updatedUser,
        },
        message: `User email ${isVerified ? 'verified' : 'unverified'} successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error in PATCH /api/admin/users/[id]/verify:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'Failed to update verification status',
      },
      { status: 500 }
    );
  }
}

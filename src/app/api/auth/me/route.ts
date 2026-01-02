/**
 * GET /api/auth/me
 *
 * Get current authenticated user from httpOnly cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { verifyToken } from '@/lib/auth';
import { findUserById } from '@/lib/db/users';

export async function GET(request: NextRequest) {
  try {
    // Get token from httpOnly cookie
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Not authenticated',
        },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
        },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await findUserById(decoded.userId);

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

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user._id?.toString(),
            email: user.email,
            name: user.name,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Get current user error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'An error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}

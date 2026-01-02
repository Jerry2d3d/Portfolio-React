/**
 * POST /api/auth/login
 *
 * Authenticate user and return JWT token
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {
  comparePassword,
  generateToken,
  isValidEmail,
} from '@/lib/auth';
import { findUserByEmail } from '@/lib/db/users';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Find user by email
    const user = await findUserByEmail(email);

    // Perform bcrypt comparison even if user doesn't exist to prevent timing attacks
    // Use a dummy hash if user not found to maintain consistent timing
    const dummyHash = '$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const hashToCompare = user?.password || dummyHash;
    const isPasswordValid = await comparePassword(password, hashToCompare);

    // Check if user exists AND password is valid
    if (!user || !isPasswordValid) {
      // Don't reveal whether email exists or password is wrong
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
    });

    // Create response (token NOT included - it's in httpOnly cookie only)
    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user._id?.toString(),
            email: user.email,
            name: user.name,
          },
        },
        message: 'Login successful',
      },
      { status: 200 }
    );

    // Set httpOnly cookie with token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // CSRF protection - strict mode for better security
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    logger.error('Login error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'An error occurred during login. Please try again.',
      },
      { status: 500 }
    );
  }
}

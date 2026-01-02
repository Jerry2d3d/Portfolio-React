/**
 * POST /api/auth/register
 *
 * Register a new user
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {
  hashPassword,
  isValidEmail,
  validatePassword,
  sanitizeInput,
} from '@/lib/auth';
import { createUser, emailExists } from '@/lib/db/users';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password, name } = body;

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
          error: 'INVALID_EMAIL',
          message: 'Please provide a valid email address',
        },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'WEAK_PASSWORD',
          message: passwordValidation.error,
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const exists = await emailExists(email);
    if (exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'EMAIL_EXISTS',
          message: 'An account with this email already exists',
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Sanitize name if provided
    const sanitizedName = name ? sanitizeInput(name.trim()) : undefined;

    // Create user
    const user = await createUser({
      email,
      password: hashedPassword,
      name: sanitizedName,
    });

    const userId = user._id!.toString();

    // Return success response (without password)
    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: userId,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
          },
        },
        message: 'Account created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Registration error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'An error occurred during registration. Please try again.',
      },
      { status: 500 }
    );
  }
}

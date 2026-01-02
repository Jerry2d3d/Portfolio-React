/**
 * POST /api/auth/logout
 *
 * Clear authentication token
 */

import { NextResponse } from 'next/server';

export async function POST() {
  // Create response
  const response = NextResponse.json(
    {
      success: true,
      message: 'Logged out successfully',
    },
    { status: 200 }
  );

  // Clear the token cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Match login cookie settings
    maxAge: 0, // Expire immediately
    path: '/',
  });

  return response;
}

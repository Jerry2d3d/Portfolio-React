/**
 * Client IP Extraction Utility
 *
 * Consolidated implementation for extracting client IP address from requests.
 * Checks multiple headers in order of reliability to handle various proxy configurations.
 */

import { NextRequest } from 'next/server';

/**
 * Extracts client IP address from request headers
 * Checks multiple headers in order of reliability.
 * Works with both NextRequest and standard Request objects.
 *
 * @param request - NextRequest or Request object
 * @returns Client IP address string, or 'unknown' if unable to determine
 */
export function getClientIp(request: NextRequest | Request): string {
  // Try X-Forwarded-For (most common behind proxies/CDNs)
  // This header can contain multiple IPs, take the first (client) one
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Try X-Real-IP (some reverse proxies use this)
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Try X-Client-IP (alternative header used by some proxies)
  const clientIp = request.headers.get('x-client-ip');
  if (clientIp) {
    return clientIp;
  }

  // Try socket address if available (NextRequest specific)
  if (request instanceof NextRequest) {
    const address = (request as any).ip || (request as any).socket?.remoteAddress;
    if (address) {
      return address;
    }
  }

  return 'unknown';
}

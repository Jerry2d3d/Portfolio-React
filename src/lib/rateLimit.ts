/**
 * In-Memory Rate Limiter
 *
 * Simple Map-based rate limiter for API endpoints.
 * Tracks requests per IP address with automatic cleanup and memory leak protection.
 */

import { getClientIp } from './clientIp';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup interval (30 seconds)
const CLEANUP_INTERVAL = 30000;
// Maximum map size before aggressive cleanup (prevent unbounded growth)
const MAX_MAP_SIZE = 10000;

// Store interval ID so we can clear it on process exit
let cleanupIntervalId: NodeJS.Timeout | null = null;

// Start cleanup interval if in Node environment
if (typeof window === 'undefined') {
  cleanupIntervalId = setInterval(() => {
    const now = Date.now();
    let deleted = 0;

    // Clean up expired entries
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (entry.resetTime < now) {
        rateLimitMap.delete(ip);
        deleted++;
      }
    }

    // Prevent unbounded growth - if map exceeds max size, clear oldest entries
    if (rateLimitMap.size > MAX_MAP_SIZE) {
      let count = 0;
      const targetSize = Math.floor(MAX_MAP_SIZE / 2); // Clear half
      for (const [ip] of rateLimitMap.entries()) {
        if (count++ >= targetSize) {
          break;
        }
        rateLimitMap.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL);

  // Clear interval on process exit (for long-running processes)
  if (typeof process !== 'undefined') {
    process.on('exit', () => {
      if (cleanupIntervalId) {
        clearInterval(cleanupIntervalId);
      }
    });
  }
}

/**
 * Check if request from IP should be rate limited
 * @param ip - Client IP address
 * @param maxRequests - Maximum requests allowed in window
 * @param windowMs - Time window in milliseconds
 * @returns { allowed: boolean; remaining: number; resetTime: number }
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute default
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Reset if window has expired
  if (!entry || entry.resetTime < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(ip, newEntry);

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Increment count for existing entry
  entry.count++;
  rateLimitMap.set(ip, entry);

  const allowed = entry.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - entry.count);

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  };
}

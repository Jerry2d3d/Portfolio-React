# Critical Fixes Required - Action Items

## BLOCKING ISSUES (Must Fix Before Production)

### 1. CRIT-001: Remove /api/test-db Endpoint or Secure It
**Status:** CRITICAL - PUBLIC DATA EXPOSURE
**Files to Modify:** `src/app/api/test-db/route.ts`
**Time Estimate:** 15 minutes

**Current Problem:**
```
GET /api/test-db - Publicly accessible, returns:
- MongoDB URI prefix (first 30 characters)
- MongoDB URI length (reveals credential length)
- Database existence confirmation
```

**Quick Fix:**
```typescript
// BEFORE (DANGEROUS):
logger.log('MONGODB_URI prefix:', process.env.MONGODB_URI?.substring(0, 30));
logger.log('MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);

// AFTER (SAFE):
// Option 1: Delete the entire endpoint (RECOMMENDED)
// Option 2: Require admin authentication + remove all env logging
```

**Recommended Action:** DELETE THIS ENDPOINT
- It's a development debugging tool
- No legitimate use case in production
- High security risk
- Can be replaced with admin dashboard diagnostics

---

### 2. CRIT-002: Fix Cookie Security in Development
**Status:** CRITICAL - SESSION HIJACKING RISK
**Files to Modify:**
- `src/app/api/auth/login/route.ts` (lines 91-97)
- `src/app/api/auth/logout/route.ts` (lines 20-26)
**Time Estimate:** 10 minutes

**Current Problem:**
```typescript
secure: process.env.NODE_ENV === 'production'  // Vulnerable in dev
```

In development/staging, cookies sent over HTTP (hijackable).

**Quick Fix:**
```typescript
// BEFORE:
response.cookies.set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',  // BAD
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
});

// AFTER:
response.cookies.set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_APP_URL?.startsWith('https'),
  sameSite: 'strict',  // Tighten CSRF protection
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
});
```

**Or Even Better (for production):**
```typescript
// PRODUCTION-ONLY version
if (process.env.NODE_ENV === 'production') {
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: true,  // Always true in production
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}
```

---

### 3. CRIT-003: Add CSRF Token Validation
**Status:** CRITICAL - STATE-CHANGING ENDPOINTS UNPROTECTED
**Files to Modify:**
- `src/lib/auth.ts` (add CSRF token generation)
- All state-changing endpoints (register, login, settings, admin actions)
**Time Estimate:** 1-2 hours

**Current Problem:**
No explicit CSRF tokens. Only relying on sameSite='lax' which:
- ✓ Protects from simple form submissions
- ✗ Doesn't protect from API clients with custom headers
- ✗ Doesn't protect cross-origin requests

**Vulnerable Endpoints:**
- POST /api/auth/register
- POST /api/auth/login
- PUT /api/qr/settings
- PATCH /api/admin/users/[id]/verify
- DELETE /api/admin/users/[id]

**Quick Fix - Double Submit Cookie Pattern:**

1. Add CSRF token generation:
```typescript
// src/lib/auth.ts - add this function
export function generateCSRFToken(): string {
  // Generate random 32-byte token
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

export function validateCSRFToken(token: string, storedToken: string): boolean {
  // Use timing-safe comparison
  const crypto = require('crypto');
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(storedToken));
}
```

2. Set CSRF token in login response:
```typescript
// src/app/api/auth/login/route.ts - after line 99
const csrfToken = generateCSRFToken();
response.cookies.set('csrf-token', csrfToken, {
  httpOnly: false,  // Must be accessible to JavaScript
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
});
```

3. Validate CSRF token in all state-changing endpoints:
```typescript
// Add to top of all POST/PUT/PATCH/DELETE routes
const csrfToken = request.headers.get('x-csrf-token');
const expectedToken = request.cookies.get('csrf-token')?.value;

if (!csrfToken || !expectedToken || !validateCSRFToken(csrfToken, expectedToken)) {
  return NextResponse.json(
    { success: false, error: 'INVALID_CSRF_TOKEN', message: 'CSRF validation failed' },
    { status: 403 }
  );
}
```

---

### 4. CRIT-004: Secure Logger Implementation
**Status:** CRITICAL - SENSITIVE DATA EXPOSURE IN LOGS
**Files to Modify:** `src/lib/logger.ts`
**Time Estimate:** 20 minutes

**Current Problem:**
```typescript
log: (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {  // Fragile condition
    console.log(...args);
  }
},
```

Issues:
- Typos in NODE_ENV (e.g., 'prodction') log to production
- No protection against logging sensitive data
- Console logs lost in serverless

**Quick Fix:**
```typescript
/**
 * Secure Logger with sensitive data protection
 */

// List of sensitive patterns to redact
const SENSITIVE_PATTERNS = [
  /mongodb\+srv:\/\/[^@]+@/gi,  // MongoDB URIs
  /Bearer\s+[a-zA-Z0-9._-]+/gi, // Auth tokens
  /password['":\s=]+[^,\n}]+/gi, // Passwords
];

function redactSensitiveData(message: string): string {
  let redacted = String(message);
  SENSITIVE_PATTERNS.forEach(pattern => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });
  return redacted;
}

export const logger = {
  log: (...args: any[]) => {
    // Only log in development, and only if not production
    if (process.env.NODE_ENV === 'development') {
      const redacted = args.map(arg =>
        typeof arg === 'string' ? redactSensitiveData(arg) : arg
      );
      console.log(...redacted);
    }
  },
  error: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      const redacted = args.map(arg =>
        typeof arg === 'string' ? redactSensitiveData(arg) : arg
      );
      console.error(...redacted);
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      const redacted = args.map(arg =>
        typeof arg === 'string' ? redactSensitiveData(arg) : arg
      );
      console.warn(...redacted);
    }
  },
};
```

**And most importantly:** Remove the test-db endpoint or secure it!

---

## HIGH PRIORITY FIXES (Before Production)

### HIGH-001: Fix Parameter Validation Order
**File:** `src/app/api/admin/users/route.ts` lines 83-97
**Time:** 5 minutes

**Current (Wrong):**
```typescript
const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
const limit = limitParam ? Math.max(1, Math.min(parseInt(limitParam, 10), 100)) : 20;

// Validation AFTER using values
if (isNaN(page) || isNaN(limit)) {
  return NextResponse.json(...);
}
```

**Fixed (Correct):**
```typescript
// Parse and validate BEFORE using
const parsedPage = pageParam ? parseInt(pageParam, 10) : 1;
const parsedLimit = limitParam ? parseInt(limitParam, 10) : 20;

// Validate immediately
if (isNaN(parsedPage) || isNaN(parsedLimit)) {
  return NextResponse.json({
    success: false,
    error: 'INVALID_PARAMS',
    message: 'Page and limit must be valid numbers',
  }, { status: 400 });
}

// THEN constrain to ranges
const page = Math.max(1, parsedPage);
const limit = Math.max(1, Math.min(parsedLimit, 100));
```

---

### HIGH-005: Fix Rate Limiter Memory Leak
**File:** `src/lib/rateLimit.ts` lines 19-28
**Time:** 10 minutes

**Current (Leaks Memory):**
```typescript
if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (entry.resetTime < now) {
        rateLimitMap.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL);  // Runs forever, never stops!
}
```

**Fixed:**
```typescript
// Store interval ID so we can stop it
let cleanupIntervalId: NodeJS.Timeout | null = null;

// Start cleanup interval if in Node environment
if (typeof window === 'undefined') {
  cleanupIntervalId = setInterval(() => {
    const now = Date.now();
    let deleted = 0;
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (entry.resetTime < now) {
        rateLimitMap.delete(ip);
        deleted++;
      }
    }
    // Add max size check to prevent unbounded growth
    if (rateLimitMap.size > 10000) {
      // Clear oldest entries if map grows too large
      let count = 0;
      for (const [ip] of rateLimitMap.entries()) {
        if (count++ > 5000) {
          rateLimitMap.delete(ip);
        }
      }
    }
  }, CLEANUP_INTERVAL);

  // Clear on process exit (for long-running processes)
  if (typeof process !== 'undefined') {
    process.on('exit', () => {
      if (cleanupIntervalId) {
        clearInterval(cleanupIntervalId);
      }
    });
  }
}
```

---

## QUICK WINS (Easy Fixes)

### HIGH-002: Fix Verification Status Check
**File:** `src/lib/db/admin.ts` line 153
**Time:** 2 minutes

**Current (Wrong):**
```typescript
// FIX: Use matchedCount instead of modifiedCount to handle idempotent updates
return result.matchedCount > 0;
```

**Issue:** Returns true even if nothing changed.

**Fixed:**
```typescript
// Return true only if actually modified
// For idempotent operations, check modifiedCount OR the specific change
return result.modifiedCount > 0 || result.upsertedId ? true : false;

// OR better:
const wasUpdated = result.modifiedCount > 0;
if (!wasUpdated && result.matchedCount > 0) {
  // User found but not modified (already in desired state)
  logger.log(`User ${userId} already verified as: ${isVerified}`);
}
return wasUpdated;
```

---

### HIGH-004: Add ObjectId Validation
**File:** `src/app/api/qr/route.ts`
**Time:** 5 minutes

**Add after line 12:**
```typescript
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'INVALID_TOKEN', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // ADD THIS: Validate userId is valid ObjectId
    if (!ObjectId.isValid(decoded.userId)) {
      return NextResponse.json(
        { success: false, error: 'INVALID_USER_ID', message: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Rest of function...
```

---

## PRIORITY ORDER FOR FIXES

1. **TODAY (CRITICAL):**
   - [ ] Delete `/api/test-db` endpoint
   - [ ] Fix logger to not expose environment variables
   - [ ] Secure cookie settings

2. **THIS WEEK (HIGH):**
   - [ ] Add CSRF token validation (biggest effort, most important)
   - [ ] Fix rate limiter memory leak
   - [ ] Fix parameter validation order
   - [ ] Add ObjectId validation

3. **BEFORE DEPLOYMENT:**
   - [ ] Fix timing attack in login
   - [ ] Fix XSS in admin user display
   - [ ] Audit all error messages for information leakage

---

## VERIFICATION

Run these checks after fixes:

```bash
# 1. Check test-db endpoint is removed
curl http://localhost:3000/api/test-db

# 2. Check logger doesn't log in production
NODE_ENV=production npm run build

# 3. Check for hardcoded credentials
grep -r "mongodb\|password\|secret" src/ --include="*.ts" --include="*.tsx"

# 4. Test CSRF validation
# Make requests without CSRF token - should fail

# 5. Check rate limiter under load
# Run rate limit test with 10000+ requests
```

---

**Generated:** 2025-12-29
**Status:** READY FOR IMPLEMENTATION

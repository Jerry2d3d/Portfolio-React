# Stage 6 Testing Session: Admin Panel & User Management
**Date**: December 28, 2024
**Tester**: React & NextJS Testing Specialist
**Application**: markedqr.com (Next.js 16.1.1 + MongoDB)
**Status**: IN PROGRESS

---

## Session Overview

This session covers comprehensive testing of Stage 6: Admin Panel & User Management implementation. The stage includes admin authentication, user listing with pagination, user deletion, email verification management, and rate limiting.

**Execution Date**: December 28, 2024, 3:55 PM
**Target**: Full feature verification and security validation

---

## Pre-Testing Environment Setup

### Application Status
- Build Status: PASSING
- Application Runtime: ACTIVE (next dev server running)
- Database: MongoDB Atlas connected
- API Endpoints: Ready (verified in build output)

### Verified Endpoints
```
✓ /admin (Static)
✓ /api/admin/users (Dynamic)
✓ /api/admin/users/[id] (Dynamic)
✓ /api/admin/users/[id]/verify (Dynamic)
```

### Environment Verification
- NODE_ENV: development
- MONGODB_URI: Connected to MongoDB Atlas
- JWT_SECRET: Configured and available
- NEXT_PUBLIC_APP_URL: http://localhost:3000

---

## Test Execution: Phase 1 - API Testing

### Test 1.1: GET /api/admin/users - Admin Access
**Objective**: Verify admin can retrieve user list with pagination

**Test Steps**:
1. Get valid admin JWT token
2. Send GET request to /api/admin/users with Bearer token
3. Verify response status and structure

**Expected**:
- Status: 200
- Response includes users array
- Response includes pagination info
- All fields present except password

**Status**: PENDING
**Notes**: Requires valid admin token from live database

---

### Test 1.2: GET /api/admin/users - Non-Admin Access
**Objective**: Verify non-admin users cannot access user list

**Test Steps**:
1. Get regular user JWT token
2. Send GET request to /api/admin/users with Bearer token
3. Verify rejection

**Expected**:
- Status: 403 Forbidden
- Error: "Invalid or expired token / user is not admin"

**Status**: PENDING
**Notes**: Requires valid non-admin user token

---

### Test 1.3: GET /api/admin/users - Missing Token
**Objective**: Verify missing auth header is rejected

**Test Steps**:
1. Send GET request without Authorization header
2. Verify error response

**Expected**:
- Status: 401 Unauthorized
- Error message: "Missing authorization header"

**Status**: PENDING
**Notes**: Can test without authentication

---

### Test 1.4: GET /api/admin/users - Pagination Test
**Objective**: Verify pagination parameters work correctly

**Test Cases**:
- page=1&limit=10 - First page, 10 items
- page=2&limit=10 - Second page
- page=999 - Out of bounds
- page=abc - Invalid value
- limit=0 - Invalid limit
- limit=1000 - Should cap at 100

**Expected**:
- Valid params: 200 status with correct results
- Invalid params: 400 Bad Request

**Status**: PENDING

---

### Test 1.5: DELETE /api/admin/users/[id] - Valid Deletion
**Objective**: Verify user deletion works with proper cleanup

**Test Steps**:
1. Identify test user ID to delete
2. Send DELETE request with admin token
3. Verify user removed and QR codes deleted
4. Check audit log created

**Expected**:
- Status: 200
- User deleted from database
- User's QR codes deleted
- Audit log entry: action="delete_user", status="success"

**Status**: PENDING
**Notes**: Requires real test user to delete

---

### Test 1.6: DELETE /api/admin/users/[id] - Self-Deletion Prevention
**Objective**: Verify admin cannot delete own account

**Test Steps**:
1. Get admin user ID
2. Try to DELETE own account
3. Verify rejection

**Expected**:
- Status: 400 Bad Request
- Error: "You cannot delete your own admin account"
- User remains in database

**Status**: PENDING
**Notes**: Critical security test

---

### Test 1.7: DELETE /api/admin/users/[id] - Invalid User ID
**Objective**: Verify invalid ID format is rejected

**Test Cases**:
- Non-ObjectId format: "invalid-id-123"
- Too short: "123"
- Wrong type: null, undefined
- Non-existent but valid ObjectId

**Expected**:
- All return 400 Bad Request
- Error: "Invalid user ID format"

**Status**: PENDING

---

### Test 1.8: PATCH /api/admin/users/[id]/verify - Email Verification
**Objective**: Verify email verification toggle works

**Test Steps**:
1. Get valid admin token and user ID
2. Send PATCH with {isVerified: true}
3. Verify database updated
4. Check audit log entry

**Expected**:
- Status: 200
- emailVerified field updated in database
- Audit log: action="verify_email", details.isVerified=true

**Status**: PENDING

---

### Test 1.9: PATCH /api/admin/users/[id]/verify - Invalid Body
**Objective**: Verify request validation

**Test Cases**:
- {isVerified: "yes"} - string instead of boolean
- {isVerified: 1} - number instead of boolean
- {} - missing field
- {isVerified: null} - null value

**Expected**:
- All return 400 Bad Request
- Error: "isVerified field must be a boolean"

**Status**: PENDING

---

### Test 1.10: Rate Limiting - GET /api/admin/users (30/min)
**Objective**: Verify rate limit enforcement

**Test Steps**:
1. Send 30 GET requests in quick succession
2. Monitor request times
3. Send 31st request
4. Verify 429 response

**Expected**:
- Requests 1-30: 200 status
- Request 31: 429 Too Many Requests
- Retry-After header present

**Status**: PENDING
**Notes**: Rate limit per IP, may need careful test setup

---

### Test 1.11: Rate Limiting - DELETE /api/admin/users/[id] (10/min)
**Objective**: Verify delete rate limit

**Expected**:
- Requests 1-10: Success (200 status)
- Request 11: 429 Too Many Requests

**Status**: PENDING

---

### Test 1.12: Rate Limiting - PATCH verify (20/min)
**Objective**: Verify verify endpoint rate limit

**Expected**:
- Requests 1-20: Success
- Request 21: 429 Too Many Requests

**Status**: PENDING

---

## Test Execution: Phase 2 - UI/UX Testing

### Test 2.1: Admin Dashboard Load
**Objective**: Verify dashboard loads with proper auth check

**Test Steps**:
1. Navigate to /admin without login
2. Verify redirect to /login
3. Login as admin
4. Navigate to /admin
5. Verify dashboard displays

**Expected**:
- Unauthenticated: Redirected to /login
- Authenticated admin: Dashboard loads with:
  - Header with title "Admin Dashboard"
  - User count in stats
  - Search input
  - User table (or empty state)
  - Pagination controls (if applicable)

**Status**: PENDING

---

### Test 2.2: User List Display
**Objective**: Verify user table renders correctly

**Expected Columns**:
- Email
- Name
- Created (date)
- Verified (button)
- Actions (Delete button)

**Expected**:
- All columns visible
- Correct user data displayed
- First 20 users shown (default pagination)

**Status**: PENDING

---

### Test 2.3: Search Functionality
**Objective**: Verify search filters users in real-time

**Test Cases**:
1. Type partial email: "test" - filters by email
2. Clear search - shows all users
3. Type name: "john" - filters by name
4. Special characters: "@#$" - no results

**Expected**:
- Client-side filtering (no API call)
- Real-time updates as user types
- Case-insensitive matching
- Works for both email and name

**Status**: PENDING

---

### Test 2.4: Pagination Controls
**Objective**: Verify pagination navigation

**Test Steps**:
1. Load dashboard
2. Click "Next" button
3. Verify page changes
4. Click "Previous" button
5. Verify back to page 1

**Expected**:
- Page indicator updates correctly
- User list changes per page
- Disabled states on boundary pages
- Loading state during fetch

**Status**: PENDING

---

### Test 2.5: Delete User - Confirmation Modal
**Objective**: Verify delete confirmation flow

**Test Steps**:
1. Click Delete button for a user
2. Verify modal appears with user email
3. Click Cancel
4. Modal closes, user remains
5. Click Delete again
6. Click Confirm Delete
7. User removed from list

**Expected**:
- Modal shows: "Are you sure you want to delete [email]?"
- Warning: "This action cannot be undone"
- Cancel button closes modal
- Confirm button deletes user
- User removed from UI immediately
- Total count decremented

**Status**: PENDING

---

### Test 2.6: Email Verification Toggle
**Objective**: Verify verification status toggle

**Test Steps**:
1. Find user with Unverified status
2. Click verification button
3. Verify button changes to "Verified"
4. Click again
5. Verify button changes to "Unverified"

**Expected**:
- Button text updates immediately
- Button styling changes (color)
- API call made to PATCH endpoint
- Database persists change

**Status**: PENDING

---

### Test 2.7: Responsive Design - Mobile View
**Objective**: Verify mobile responsiveness

**Test Steps**:
1. Set viewport to 320px (mobile)
2. Load admin dashboard
3. Verify all elements accessible
4. Check table scrollability
5. Verify button clickability

**Expected**:
- No horizontal scrolling for key elements
- All buttons and inputs accessible
- Table scrollable or responsive
- Professional appearance

**Status**: PENDING

---

### Test 2.8: Error Handling in UI
**Objective**: Verify error messages display correctly

**Test Steps**:
1. Simulate API error (disable network, etc.)
2. Attempt operation
3. Verify error banner appears

**Expected**:
- Error banner appears at top
- Clear, user-friendly error message
- No stack traces or internal errors
- Can retry or dismiss

**Status**: PENDING

---

## Test Execution: Phase 3 - Security Testing

### Test 3.1: Non-Admin Access Prevention
**Objective**: Verify non-admin users cannot access /admin

**Test**: Login as regular user, navigate to /admin
**Expected**: Redirect to /login, no admin panel shown
**Status**: PENDING

---

### Test 3.2: Token Validation
**Objective**: Verify invalid tokens are rejected

**Test Cases**:
- Expired token
- Malformed token
- Wrong signature
- Token from different user

**Expected**: All return 401 or 403 status
**Status**: PENDING

---

### Test 3.3: Password Field Exclusion
**Objective**: Verify password never returned in API

**Test**:
1. Call GET /api/admin/users
2. Inspect all user objects
3. Verify no password field

**Expected**: No password field in any response
**Status**: PENDING

---

### Test 3.4: Input Validation
**Objective**: Verify injection attacks prevented

**Test Cases**:
- MongoDB injection in search
- XSS in user data
- SQL-like injection (N/A for MongoDB native driver)
- ObjectId tampering

**Expected**: All handled safely, no data exposure
**Status**: PENDING

---

## Database Verification

### Audit Log Verification
**Steps**:
1. Perform delete action
2. Query audit_logs collection
3. Verify entry exists with:
   - action: "delete_user"
   - adminId: correct
   - targetUserId: correct
   - ipAddress: recorded
   - status: "success"
   - createdAt: timestamp

**Status**: PENDING

---

### Data Integrity Verification
**Steps**:
1. Delete a user with associated QR codes
2. Verify user document deleted
3. Verify QR codes for user deleted
4. Verify no orphaned records

**Status**: PENDING

---

## Issues Found

(To be updated as testing progresses)

---

## Test Summary (Preliminary)

### Coverage
- Phase 1 (API): 12 test scenarios
- Phase 2 (UI): 8 test scenarios
- Phase 3 (Security): 4 test scenarios
- Total: 24 comprehensive tests

### Pass/Fail Status
- Status: AWAITING TEST EXECUTION
- Critical Issues: 0 (awaiting tests)
- Major Issues: 0 (awaiting tests)
- Minor Issues: 0 (awaiting tests)

---

## Next Steps

1. Execute API tests with actual admin token
2. Execute UI tests in browser
3. Execute security validation tests
4. Document any failures found
5. Create final test report
6. Generate recommendations

---

**Session Status**: INITIALIZED - Awaiting test execution
**Last Updated**: December 28, 2024

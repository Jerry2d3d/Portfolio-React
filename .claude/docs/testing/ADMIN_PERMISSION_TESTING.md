# Admin Permission System Testing Guide

## Overview
This document provides automated testing for the Stage 6 admin permission system using Gemini in headless mode. All three admin endpoints now enforce granular permissions.

## Modified Endpoints

### 1. GET /api/admin/users
- **Permission Required**: `manage_users`
- **Rate Limit**: 30 requests/minute
- **File**: `src/app/api/admin/users/route.ts:61-72`

### 2. DELETE /api/admin/users/[id]
- **Permission Required**: `delete_users`
- **Rate Limit**: 10 requests/minute
- **File**: `src/app/api/admin/users/[id]/route.ts:70-81`

### 3. PATCH /api/admin/users/[id]/verify
- **Permission Required**: `verify_emails`
- **Rate Limit**: 20 requests/minute
- **File**: `src/app/api/admin/users/[id]/verify/route.ts:69-80`

---

## Automated Testing with Gemini Headless Mode

All tests use the `gemini -p "prompt"` command for automated verification.

### Prerequisites

1. **MongoDB Running**: Ensure MongoDB connection is active
2. **Dev Server**: Next.js dev server running on http://localhost:3000
3. **Test Data**: Admin users with varying permissions and test users for deletion

---

## Test Suite 1: Permission Enforcement

### Test 1.1: Verify Permission Checks Are In Place
```bash
gemini -p "Analyze the admin permission enforcement implementation:

1. Read src/app/api/admin/users/route.ts lines 61-72
2. Read src/app/api/admin/users/[id]/route.ts lines 70-81
3. Read src/app/api/admin/users/[id]/verify/route.ts lines 69-80

Verify that:
- Each endpoint calls findAdminById() to fetch the admin user
- Each endpoint calls hasAdminPermission() with the correct permission:
  * GET /api/admin/users requires 'manage_users'
  * DELETE /api/admin/users/[id] requires 'delete_users'
  * PATCH /api/admin/users/[id]/verify requires 'verify_emails'
- Each endpoint returns 403 INSUFFICIENT_PERMISSIONS when permission check fails
- Error messages correctly indicate which permission is missing

Report findings in structured format with PASS/FAIL for each verification point."
```

### Test 1.2: Verify hasAdminPermission Function Logic
```bash
gemini -p "Analyze the hasAdminPermission function in src/models/Admin.ts:

1. Read the function implementation
2. Verify it checks:
   - user.isAdmin is true
   - user.adminPermissions array exists
   - The requested permission is in the adminPermissions array

3. Test the logic with these scenarios:
   - User with isAdmin=false → should return false
   - User with isAdmin=true but no adminPermissions → should return false
   - User with isAdmin=true and adminPermissions=['manage_users'] checking 'manage_users' → should return true
   - User with isAdmin=true and adminPermissions=['manage_users'] checking 'delete_users' → should return false

Report whether the function correctly handles all edge cases."
```

---

## Test Suite 2: Database Permission Setup

### Test 2.1: Verify Admin Schema Supports Permissions
```bash
gemini -p "Analyze the Admin user schema and database operations:

1. Read src/models/Admin.ts - check AdminUser interface for adminPermissions field
2. Read src/lib/db/admin.ts - verify findAdminById returns user with adminPermissions
3. Confirm the AdminPermission type includes: manage_users, delete_users, verify_emails

Report if the schema is properly set up to support granular permissions."
```

### Test 2.2: Create Test Admin Users in Database
```bash
gemini -p "Create test admin users in MongoDB for permission testing:

Connect to MongoDB database 'qr-code-app' and insert the following admin users into the 'users' collection:

1. Full Admin (ID: testadmin1):
   - email: admin-full@test.com
   - isAdmin: true
   - adminPermissions: ['manage_users', 'delete_users', 'verify_emails']

2. Manage Users Only (ID: testadmin2):
   - email: admin-manage@test.com
   - isAdmin: true
   - adminPermissions: ['manage_users']

3. Delete Users Only (ID: testadmin3):
   - email: admin-delete@test.com
   - isAdmin: true
   - adminPermissions: ['delete_users']

4. Verify Emails Only (ID: testadmin4):
   - email: admin-verify@test.com
   - isAdmin: true
   - adminPermissions: ['verify_emails']

5. No Permissions (ID: testadmin5):
   - email: admin-none@test.com
   - isAdmin: true
   - adminPermissions: []

Also create 2 regular test users for deletion testing.

Report the created user IDs for use in subsequent tests."
```

---

## Test Suite 3: Endpoint Permission Validation

### Test 3.1: Test GET /api/admin/users Permissions
```bash
gemini -p "Test the GET /api/admin/users endpoint with different admin permissions:

Prerequisites:
- Server running on localhost:3000
- Test admin users created in database

Test Cases:
1. Admin with 'manage_users' permission → Should return 200 with user list
2. Admin with only 'delete_users' permission → Should return 403 INSUFFICIENT_PERMISSIONS
3. Admin with only 'verify_emails' permission → Should return 403 INSUFFICIENT_PERMISSIONS
4. Admin with no permissions → Should return 403 INSUFFICIENT_PERMISSIONS
5. Regular user (isAdmin=false) → Should return 403 UNAUTHORIZED
6. No authentication token → Should return 401

For each test:
1. Generate JWT token for the test user
2. Make request to GET http://localhost:3000/api/admin/users with token cookie
3. Verify status code matches expected result
4. Verify error message format for failures

Report results in table format with PASS/FAIL status."
```

### Test 3.2: Test DELETE /api/admin/users/[id] Permissions
```bash
gemini -p "Test the DELETE /api/admin/users/[id] endpoint with different admin permissions:

Prerequisites:
- Server running on localhost:3000
- Test users exist in database for deletion

Test Cases:
1. Admin with 'delete_users' permission → Should return 200 and delete user
2. Admin with only 'manage_users' permission → Should return 403 INSUFFICIENT_PERMISSIONS
3. Admin with only 'verify_emails' permission → Should return 403 INSUFFICIENT_PERMISSIONS
4. Admin with no permissions → Should return 403 INSUFFICIENT_PERMISSIONS
5. Regular user (isAdmin=false) → Should return 403 UNAUTHORIZED

For each test:
1. Create a disposable test user to delete
2. Generate JWT token for the admin user
3. Make DELETE request to http://localhost:3000/api/admin/users/{testUserId}
4. Verify status code and response message
5. For successful deletions, verify user is removed from database
6. For failed deletions, verify user still exists in database

Report results with PASS/FAIL and any data integrity issues."
```

### Test 3.3: Test PATCH /api/admin/users/[id]/verify Permissions
```bash
gemini -p "Test the PATCH /api/admin/users/[id]/verify endpoint with different admin permissions:

Prerequisites:
- Server running on localhost:3000
- Test users exist with emailVerified=false

Test Cases:
1. Admin with 'verify_emails' permission → Should return 200 and toggle verification
2. Admin with only 'manage_users' permission → Should return 403 INSUFFICIENT_PERMISSIONS
3. Admin with only 'delete_users' permission → Should return 403 INSUFFICIENT_PERMISSIONS
4. Admin with no permissions → Should return 403 INSUFFICIENT_PERMISSIONS
5. Regular user (isAdmin=false) → Should return 403 UNAUTHORIZED

For each test:
1. Get a test user's current emailVerified status
2. Generate JWT token for the admin user
3. Make PATCH request to http://localhost:3000/api/admin/users/{testUserId}/verify
   with body: {\"isVerified\": true}
4. Verify status code and response
5. For successful operations, verify emailVerified was updated in database
6. For failed operations, verify emailVerified unchanged in database

Report results with PASS/FAIL and any discrepancies."
```

---

## Test Suite 4: Data Integrity & Error Handling

### Test 4.1: Verify QR Code Deletion on User Delete
```bash
gemini -p "Test QR code cleanup during user deletion:

1. Create a test user with multiple QR codes in the database
2. Use an admin with 'delete_users' permission to delete the user
3. Verify:
   - QR codes are deleted BEFORE the user is deleted
   - If QR deletion fails, user deletion is aborted
   - Response returns 500 with QR_CLEANUP_FAILED error if QR deletion fails
   - No orphaned QR codes remain in database after successful deletion

Test both success and failure scenarios:
- Success: User with QR codes deleted cleanly
- Failure: Simulate QR deletion failure (temporarily rename deleteQRCodesByUserId)

Report findings with PASS/FAIL and any data integrity violations."
```

### Test 4.2: Verify Audit Logging
```bash
gemini -p "Test audit logging for admin actions:

1. Read src/lib/db/admin.ts to understand createAuditLog function
2. Perform these admin actions and verify audit logs are created:
   - Delete a user (should log 'delete_user' action)
   - Toggle email verification (should log 'verify_email' action)

3. Verify audit logs contain:
   - Action type
   - Admin user ID
   - Target user ID
   - Metadata (email, userName, before/after state)
   - Client IP address
   - Timestamp

4. Verify audit logging failures don't crash the endpoint

Report PASS/FAIL for audit log completeness and error handling."
```

---

## Test Suite 5: Rate Limiting

### Test 5.1: Verify Rate Limits Are Enforced
```bash
gemini -p "Test rate limiting for all admin endpoints:

1. GET /api/admin/users - 30 requests/minute:
   - Make 31 requests in quick succession
   - Verify first 30 return 200
   - Verify 31st returns 429 RATE_LIMIT_EXCEEDED
   - Verify Retry-After header is present

2. DELETE /api/admin/users/[id] - 10 requests/minute:
   - Make 11 delete requests in quick succession
   - Verify first 10 return appropriate status
   - Verify 11th returns 429

3. PATCH /api/admin/users/[id]/verify - 20 requests/minute:
   - Make 21 verify requests in quick succession
   - Verify first 20 return appropriate status
   - Verify 21st returns 429

Report PASS/FAIL for each endpoint's rate limiting."
```

---

## Test Suite 6: Edge Cases & Security

### Test 6.1: Test Permission Bypass Attempts
```bash
gemini -p "Test security against permission bypass attempts:

1. Token Manipulation:
   - Create JWT with isAdmin=true but no adminPermissions
   - Attempt to access each endpoint
   - Verify all return 403 INSUFFICIENT_PERMISSIONS

2. Admin Self-Deletion:
   - Admin tries to delete their own account
   - Verify returns 400 CANNOT_DELETE_SELF

3. Invalid User ID:
   - Use malformed ObjectId in DELETE and PATCH requests
   - Verify returns 400 INVALID_USER_ID

4. Missing Request Body:
   - PATCH verify with no body → 400 error
   - PATCH verify with non-boolean isVerified → 400 error

Report any successful bypass attempts or vulnerabilities found."
```

### Test 6.2: Test Cross-Permission Scenarios
```bash
gemini -p "Test admin users with multiple permissions:

1. Create admin with ['manage_users', 'verify_emails']:
   - Should access GET /api/admin/users ✓
   - Should access PATCH /api/admin/users/[id]/verify ✓
   - Should NOT access DELETE /api/admin/users/[id] ✗

2. Create admin with all three permissions:
   - Should access all endpoints ✓

3. Verify hasAdminPermission checks each permission independently

Report PASS/FAIL and any permission leakage between endpoints."
```

---

## Test Results Template

```bash
gemini -p "Generate a comprehensive test report:

Execute ALL test suites above and generate a final report with:

## Test Execution Summary
- Date: [current date]
- Environment: Development (localhost:3000)
- Database: MongoDB qr-code-app

## Results by Test Suite

### Suite 1: Permission Enforcement
- Test 1.1: [PASS/FAIL]
- Test 1.2: [PASS/FAIL]

### Suite 2: Database Setup
- Test 2.1: [PASS/FAIL]
- Test 2.2: [PASS/FAIL]

### Suite 3: Endpoint Validation
- Test 3.1: [PASS/FAIL] (X/6 test cases passed)
- Test 3.2: [PASS/FAIL] (X/5 test cases passed)
- Test 3.3: [PASS/FAIL] (X/5 test cases passed)

### Suite 4: Data Integrity
- Test 4.1: [PASS/FAIL]
- Test 4.2: [PASS/FAIL]

### Suite 5: Rate Limiting
- Test 5.1: [PASS/FAIL] (X/3 endpoints passed)

### Suite 6: Security
- Test 6.1: [PASS/FAIL]
- Test 6.2: [PASS/FAIL]

## Issues Found
1. [Issue description with severity]
2. [Issue description with severity]

## Overall Status
[PASS/FAIL] - Stage 6 Admin Permission System

## Recommendations
1. [Recommendation if any issues found]
2. [Recommendation if any issues found]
"
```

---

## Quick Test Commands

### Run All Tests
```bash
# Execute all test suites sequentially
gemini -p "Execute the complete admin permission test suite from ADMIN_PERMISSION_TESTING.md. Run all test suites (1-6) in order and generate the final test report. Ensure dev server is running and database is accessible before starting."
```

### Run Specific Test
```bash
# Test only permission enforcement
gemini -p "Run Test Suite 1 from ADMIN_PERMISSION_TESTING.md (Permission Enforcement tests)"

# Test only endpoint validation
gemini -p "Run Test Suite 3 from ADMIN_PERMISSION_TESTING.md (Endpoint Permission Validation)"

# Test only data integrity
gemini -p "Run Test Suite 4 from ADMIN_PERMISSION_TESTING.md (Data Integrity & Error Handling)"
```

---

## Troubleshooting

### If Tests Fail

1. **Check Server Status**:
```bash
gemini -p "Verify the Next.js dev server is running on localhost:3000 and responding to requests"
```

2. **Check Database Connection**:
```bash
gemini -p "Verify MongoDB connection and that the qr-code-app database is accessible"
```

3. **Reset Test Data**:
```bash
gemini -p "Clean up test data: Remove all users with email matching pattern 'admin-*@test.com' and 'test-user-*@test.com' from the database"
```

4. **Verify Code Changes**:
```bash
gemini -p "Verify all Stage 6 permission fixes are in place by checking: 1) src/app/api/admin/users/route.ts:61-72, 2) src/app/api/admin/users/[id]/route.ts:70-81, 3) src/app/api/admin/users/[id]/verify/route.ts:69-80. Confirm each has permission checks."
```

---

## Notes

- All Gemini commands assume the repository is at `/Users/Gerald.Hansen/Repo/qr-code-app`
- Tests are designed to be non-destructive where possible
- Some tests create and delete test data - ensure you're not running against production
- Rate limit tests may take several minutes to complete
- Gemini will analyze code, make API calls, and verify database state automatically

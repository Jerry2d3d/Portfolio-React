# Stage 6 Testing Plan: Admin Panel & User Management

**Date**: December 28, 2024
**Component**: Admin Panel & User Management
**Status**: Ready for Testing
**Application**: markedqr.com (Next.js 16.1.1 + MongoDB)

---

## Executive Overview

This document outlines the comprehensive testing strategy for Stage 6: Admin Panel & User Management. The implementation includes:

1. Admin authentication and authorization
2. User listing with pagination and search
3. User deletion with confirmation and cascading cleanup
4. Email verification status management
5. Rate limiting on all endpoints
6. Comprehensive audit logging

---

## Testing Scope

### Components Under Test

| Component | Location | Test Priority |
|-----------|----------|---|
| Admin Dashboard UI | `/admin` page | Critical |
| User List API | `GET /api/admin/users` | Critical |
| User Delete API | `DELETE /api/admin/users/[id]` | Critical |
| Email Verify API | `PATCH /api/admin/users/[id]/verify` | Critical |
| Admin Auth Utilities | `src/lib/adminAuth.ts` | Critical |
| Database Operations | `src/lib/db/admin.ts` | Critical |
| Rate Limiting | Built-in middleware | High |
| Audit Logging | `AuditLog` collection | High |

---

## Test Categories

### 1. Authentication & Authorization Tests
- [ ] Admin login and token validation
- [ ] Non-admin users blocked (403 Forbidden)
- [ ] Missing token rejected (401 Unauthorized)
- [ ] Invalid token rejected (401 Unauthorized)
- [ ] Admin role verification from database
- [ ] Client-side auth check on /admin route

### 2. Admin Dashboard UI Tests
- [ ] Page loads with proper header and controls
- [ ] User list displays with correct columns
- [ ] User count displayed in header stats
- [ ] Search input appears and is functional
- [ ] Pagination controls visible when needed
- [ ] Loading states shown during fetches
- [ ] Error messages displayed appropriately
- [ ] Responsive design on mobile devices

### 3. User Listing Tests
- [ ] All users retrieved with pagination
- [ ] Default pagination (page=1, limit=20)
- [ ] Page parameter validation (1-indexed)
- [ ] Limit parameter validation (capped at 100)
- [ ] Total user count calculated correctly
- [ ] Page count calculated correctly
- [ ] Password field excluded from response
- [ ] Users sorted by createdAt descending
- [ ] Sort order is newest first

### 4. User Search Tests
- [ ] Search filters by email (case-insensitive)
- [ ] Search filters by name (case-insensitive)
- [ ] Empty search shows all users
- [ ] Partial email matching works
- [ ] Partial name matching works
- [ ] Combined search (email + name) works

### 5. User Deletion Tests
- [ ] Delete confirmation modal appears
- [ ] Delete button triggers confirmation
- [ ] Cancel button closes confirmation
- [ ] Confirm button initiates deletion
- [ ] User removed from list after deletion
- [ ] Associated QR codes deleted
- [ ] Audit log entry created
- [ ] Success message shown (optional)
- [ ] Admin cannot delete themselves
- [ ] Error shown if user doesn't exist
- [ ] Deletion state prevents double-clicks

### 6. Email Verification Tests
- [ ] Verification button shows current status
- [ ] Unverified status displayed correctly
- [ ] Verified status displayed correctly
- [ ] Click toggles verification status
- [ ] Status updates in UI immediately
- [ ] API returns updated user data
- [ ] Audit log entry created
- [ ] Database persists new status

### 7. Rate Limiting Tests
- [ ] GET /api/admin/users: 30 req/min limit
- [ ] DELETE /api/admin/users/[id]: 10 req/min limit
- [ ] PATCH /api/admin/users/[id]/verify: 20 req/min limit
- [ ] Rate limit keyed by IP address
- [ ] Exceeding limit returns 429 status
- [ ] Retry-After header included
- [ ] Rate limit resets after window expires

### 8. Security Tests
- [ ] No sensitive data in error messages
- [ ] Password never returned in responses
- [ ] Invalid ObjectId rejected (400)
- [ ] Request validation prevents injection
- [ ] CORS headers appropriate (if applicable)
- [ ] Admin check happens before data access
- [ ] Self-deletion prevented with error message

### 9. API Response Tests
- [ ] All endpoints return proper JSON
- [ ] Success responses include success: true
- [ ] Error responses include success: false
- [ ] Error responses include error code
- [ ] Pagination info complete in list response
- [ ] HTTP status codes correct:
  - 200 for successful operations
  - 400 for invalid input
  - 401 for missing/invalid token
  - 403 for non-admin users
  - 404 for missing resources
  - 429 for rate limit exceeded
  - 500 for server errors

### 10. Audit Logging Tests
- [ ] Audit log created for each delete
- [ ] Audit log created for each verify
- [ ] Log includes admin ID
- [ ] Log includes target user ID
- [ ] Log includes action type
- [ ] Log includes IP address
- [ ] Log includes timestamp
- [ ] Log includes success/failure status
- [ ] Immutable log entries

### 11. Database Integrity Tests
- [ ] User deletion removes user document
- [ ] User deletion removes related QR codes
- [ ] Verification status updated in DB
- [ ] Pagination query efficient (indexed)
- [ ] No orphaned QR codes after user delete
- [ ] Audit logs properly stored
- [ ] Admin indexes created

### 12. Edge Cases & Error Handling
- [ ] Null/undefined user ID handling
- [ ] Empty user list handling
- [ ] Very large user lists (pagination)
- [ ] Special characters in search
- [ ] Concurrent delete requests
- [ ] Network timeout handling
- [ ] Database connection loss
- [ ] Invalid query parameters

---

## Test Data Requirements

### Test User Accounts
- **Admin User**: email: admin@test.local, role: isAdmin=true
- **Regular User 1**: email: user1@test.local, role: regular
- **Regular User 2**: email: user2@test.local, role: regular
- **Test User 3**: email: testuser@example.com, role: regular

### QR Code Data
- Each test user should have at least one QR code
- Verify that deleting users removes their QR codes

---

## Testing Tools

- **Gemini Headless**: For comprehensive API and UI testing
- **Manual Browser Testing**: For UI/UX verification
- **MongoDB Shell**: For database state verification
- **cURL/Postman**: For API endpoint testing

---

## Success Criteria

### Must Pass
- [ ] Admin can view all users
- [ ] Admin can search and filter users
- [ ] Admin can delete users with proper confirmation
- [ ] Admin can toggle email verification
- [ ] Rate limiting enforces limits correctly
- [ ] Non-admins cannot access /admin
- [ ] All security measures in place
- [ ] Audit logs created for actions

### Should Pass
- [ ] UI is responsive on mobile
- [ ] Loading states visible
- [ ] Error messages are clear
- [ ] Pagination works smoothly
- [ ] Search is fast and responsive

### Documentation Pass
- [ ] Test results documented
- [ ] Issues logged with reproduction steps
- [ ] Screenshots captured
- [ ] Final test report generated

---

## Test Execution Plan

### Phase 1: Pre-Testing (5 min)
1. Verify application builds
2. Verify database connectivity
3. Set up test data

### Phase 2: API Testing (20 min)
1. Test GET /api/admin/users endpoint
2. Test DELETE /api/admin/users/[id] endpoint
3. Test PATCH /api/admin/users/[id]/verify endpoint
4. Verify rate limiting
5. Test error handling

### Phase 3: UI Testing (15 min)
1. Test admin dashboard loading
2. Test user list display
3. Test search functionality
4. Test delete confirmation
5. Test verification toggle
6. Test responsive design

### Phase 4: Security Testing (10 min)
1. Test unauthorized access
2. Test self-deletion prevention
3. Test input validation
4. Verify error message security

### Phase 5: Database Verification (5 min)
1. Verify audit logs created
2. Verify user deletions persisted
3. Verify QR code cleanup
4. Verify verification status updates

### Phase 6: Documentation (5 min)
1. Create final test report
2. Document all findings
3. Log issues in tester/issues/
4. Update TEST_LOG.md

---

## Risk Assessment

### High Risk Areas
1. **Authorization**: Ensuring only admins can access features
2. **Data Deletion**: Cascading delete of QR codes
3. **Audit Trail**: Proper logging of all admin actions
4. **Rate Limiting**: Correct enforcement and reset

### Medium Risk Areas
1. **Pagination**: Handling large user lists
2. **Search**: Performance with many users
3. **Concurrency**: Race conditions during delete

### Low Risk Areas
1. **UI Rendering**: Standard React patterns
2. **Verification Toggle**: Simple boolean update
3. **Status Messages**: Display logic

---

## Notes

- Stage 6 passed code review with conditional pass
- All critical bugs were fixed before testing
- Application builds successfully
- Ready for comprehensive manual and automated testing

---

**Next Steps**: Begin Phase 1 pre-testing and execute Gemini test scenarios

# Stage 6 Test Scenarios

## Test Scenario 1: Admin Authentication & Authorization

### Pre-conditions
- Application is running on http://localhost:3000
- MongoDB is accessible
- Test admin user exists with isAdmin=true

### Test Cases

#### TC1.1: Valid Admin Login
**Steps**:
1. Navigate to /login
2. Enter admin credentials
3. Submit login form
4. Navigate to /admin
5. Verify admin dashboard loads

**Expected Result**:
- Login succeeds
- User is redirected to dashboard
- User list displays with pagination
- No 401/403 errors

#### TC1.2: Admin Dashboard Access with Valid Token
**Steps**:
1. Login as admin
2. Store JWT token from localStorage
3. Send GET request to /api/admin/users with Bearer token
4. Verify response

**Expected Result**:
- 200 status code
- Response includes users array
- Response includes pagination info
- All users returned (no password field)

#### TC1.3: Non-Admin User Blocked
**Steps**:
1. Login as regular user
2. Attempt to navigate to /admin
3. Monitor response

**Expected Result**:
- User is redirected to /login
- No admin dashboard displayed
- Client-side auth check prevents access
- No user data leaked

#### TC1.4: Missing Authorization Header
**Steps**:
1. Send GET request to /api/admin/users without token
2. Monitor response status and body

**Expected Result**:
- 401 Unauthorized status
- Error message about missing auth header
- No user data returned

#### TC1.5: Invalid Token
**Steps**:
1. Send GET request to /api/admin/users with malformed token
2. Monitor response

**Expected Result**:
- 401 or 403 status
- Error message about invalid token
- No user data returned

---

## Test Scenario 2: User Listing & Pagination

### Pre-conditions
- Admin is logged in
- Database has at least 30 test users
- Admin dashboard is loaded

### Test Cases

#### TC2.1: Default Pagination (First Page)
**Steps**:
1. Load admin dashboard
2. Observe user list
3. Check pagination controls

**Expected Result**:
- First 20 users displayed
- Page indicator shows "Page 1 of X"
- Previous button disabled
- Next button enabled (if more pages)

#### TC2.2: Pagination - Next Page
**Steps**:
1. Load admin dashboard on page 1
2. Click "Next" button
3. Wait for users to load
4. Verify user list updated

**Expected Result**:
- New set of users displayed
- Page indicator updates
- Previous button now enabled
- Loading state shown during fetch

#### TC2.3: Pagination - Previous Page
**Steps**:
1. Navigate to page 2
2. Click "Previous" button
3. Verify user list updated

**Expected Result**:
- Users from page 1 redisplayed
- Page indicator shows "Page 1 of X"
- Previous button disabled again

#### TC2.4: API Pagination with Custom Limit
**Steps**:
1. Send GET /api/admin/users?page=1&limit=10
2. Verify response

**Expected Result**:
- 10 users returned
- pagination.limit = 10
- pagination.pages calculated correctly

#### TC2.5: Invalid Pagination Parameters
**Steps**:
1. Send GET /api/admin/users?page=abc&limit=xyz
2. Monitor response

**Expected Result**:
- 400 Bad Request status
- Error message about invalid parameters
- Returns default pagination (page 1)

#### TC2.6: Pagination Boundary Test
**Steps**:
1. Send GET /api/admin/users?page=999999
2. Monitor response

**Expected Result**:
- Valid response returned
- Empty users array or last page users
- No 404 error
- Graceful handling

---

## Test Scenario 3: User Search & Filter

### Pre-conditions
- Admin dashboard loaded
- Multiple users with varied names/emails

### Test Cases

#### TC3.1: Search by Email
**Steps**:
1. Type partial email in search box: "test"
2. Observe filtered results

**Expected Result**:
- Only users with "test" in email shown
- Search is case-insensitive
- Real-time filtering (no API call needed)
- Original pagination preserved

#### TC3.2: Search by Name
**Steps**:
1. Clear search box
2. Type partial name: "john"
3. Observe filtered results

**Expected Result**:
- Only users with "john" in name shown
- Case-insensitive matching
- Real-time filtering

#### TC3.3: Clear Search
**Steps**:
1. Perform search
2. Clear search input
3. Observe user list

**Expected Result**:
- All users on current page shown again
- Full user count displayed
- Search box is empty

#### TC3.4: No Results
**Steps**:
1. Search for non-existent: "xyznonexistent"
2. Observe empty state

**Expected Result**:
- Empty state message shown
- Table not displayed
- Message: "No users match your search"
- Page count and total users unchanged

#### TC3.5: Special Characters in Search
**Steps**:
1. Search for: "@#$%"
2. Monitor response

**Expected Result**:
- No errors thrown
- No results shown (if no matching users)
- Graceful handling

---

## Test Scenario 4: User Deletion

### Pre-conditions
- Admin logged in
- Test user to delete exists
- User has associated QR codes

### Test Cases

#### TC4.1: Delete Confirmation Dialog
**Steps**:
1. Find test user in list
2. Click "Delete" button
3. Observe confirmation modal

**Expected Result**:
- Modal appears with user email
- Warning message about irreversible action
- "Delete" and "Cancel" buttons present
- Cannot interact with table while modal shown

#### TC4.2: Cancel Delete
**Steps**:
1. Open delete confirmation
2. Click "Cancel" button
3. Verify user still in list

**Expected Result**:
- Modal closes
- User remains in list
- No deletion occurred
- No audit log entry

#### TC4.3: Confirm Delete
**Steps**:
1. Open delete confirmation for test user
2. Click "Delete" button
3. Wait for completion
4. Verify user removed from list

**Expected Result**:
- Modal closes
- User removed from list immediately
- Success message (optional)
- Total user count decremented
- API returns 200 status

#### TC4.4: Delete User - Database Verification
**Steps**:
1. Delete a user via admin dashboard
2. Query MongoDB directly
3. Verify user document deleted
4. Verify user's QR codes deleted

**Expected Result**:
- User document not found in users collection
- No QR codes for deleted user in qrcodes collection
- Audit log entry exists with delete_user action
- Deletion timestamp recorded

#### TC4.5: Delete Non-Existent User
**Steps**:
1. Craft DELETE request with fake ObjectId
2. Send request with valid admin token
3. Monitor response

**Expected Result**:
- 404 Not Found status
- Error message: "User not found"
- No audit log created (pre-check)

#### TC4.6: Admin Self-Deletion Prevention
**Steps**:
1. Get current admin's user ID
2. Try to delete own account
3. Monitor response

**Expected Result**:
- 400 Bad Request status
- Error message: "You cannot delete your own admin account"
- User remains in database
- Audit log entry: failure status

#### TC4.7: Delete without Admin Token
**Steps**:
1. Send DELETE /api/admin/users/[id] without token
2. Monitor response

**Expected Result**:
- 401 Unauthorized status
- No deletion occurs
- No audit log entry

#### TC4.8: Rate Limit on Delete (10 req/min)
**Steps**:
1. Delete user 1, wait 2 sec
2. Delete user 2, wait 2 sec
3. Delete user 3, wait 2 sec
4. ... continue for 11 deletions
5. Monitor response on 11th request

**Expected Result**:
- First 10 deletions succeed (200 status)
- 11th deletion returns 429 Too Many Requests
- Retry-After header present
- Users eventually deleted after reset window

---

## Test Scenario 5: Email Verification Management

### Pre-conditions
- Admin logged in
- Test users with mixed verification states

### Test Cases

#### TC5.1: Toggle Unverified to Verified
**Steps**:
1. Find user with emailVerified=false
2. Click verification button
3. Observe status change

**Expected Result**:
- Button text changes from "Unverified" to "Verified"
- Button styling changes
- UI updates immediately
- API call completes

#### TC5.2: Toggle Verified to Unverified
**Steps**:
1. Find user with emailVerified=true
2. Click verification button
3. Observe status change

**Expected Result**:
- Button text changes from "Verified" to "Unverified"
- Button styling changes
- UI updates immediately

#### TC5.3: Verification Toggle - Database Persistence
**Steps**:
1. Toggle verification status in dashboard
2. Query MongoDB users collection
3. Check emailVerified field

**Expected Result**:
- Database reflects new status
- Value is boolean (true/false)
- updatedAt timestamp updated
- Audit log entry created with verify_email action

#### TC5.4: Invalid Verification Payload
**Steps**:
1. Send PATCH request with invalid body: {isVerified: "yes"}
2. Monitor response

**Expected Result**:
- 400 Bad Request status
- Error message: "isVerified field must be a boolean"
- No database update

#### TC5.5: Rate Limit on Verify (20 req/min)
**Steps**:
1. Toggle verification 20 times
2. Attempt 21st toggle
3. Monitor response

**Expected Result**:
- First 20 succeed (200 status)
- 21st returns 429 Too Many Requests
- Retry-After header included

---

## Test Scenario 6: Rate Limiting

### Pre-conditions
- Admin token available
- Rate limiter is active

### Test Cases

#### TC6.1: Rate Limit - GET /api/admin/users (30/min)
**Steps**:
1. Send 30 GET requests to /api/admin/users
2. Send 31st request within same minute window
3. Monitor response

**Expected Result**:
- First 30 requests: 200 status
- 31st request: 429 status
- Retry-After header shows seconds to wait
- After window expires, new requests allowed

#### TC6.2: Rate Limit - DELETE (10/min)
**Steps**:
1. Send 10 DELETE requests (with different user IDs)
2. Send 11th request
3. Monitor response

**Expected Result**:
- First 10: 200 status (or various success codes)
- 11th: 429 Too Many Requests
- Retry-After header present

#### TC6.3: Rate Limit - VERIFY (20/min)
**Steps**:
1. Send 20 PATCH requests to /verify endpoint
2. Send 21st request
3. Monitor response

**Expected Result**:
- First 20: 200 status
- 21st: 429 Too Many Requests
- Retry-After header present

#### TC6.4: Rate Limit Per IP
**Steps**:
1. Send requests from different IPs (if possible, using X-Forwarded-For header)
2. Verify limits are per-IP not global

**Expected Result**:
- Each IP has independent limit counter
- One IP hitting limit doesn't affect others
- Rate limit key includes IP address

---

## Test Scenario 7: Security & Error Handling

### Pre-conditions
- Application running
- Invalid and valid test data available

### Test Cases

#### TC7.1: No Information Disclosure in Errors
**Steps**:
1. Try various invalid requests
2. Analyze error messages

**Expected Result**:
- Error messages are generic
- No stack traces in responses
- No database info leaked
- No file paths revealed

#### TC7.2: Password Field Excluded
**Steps**:
1. Get user list via /api/admin/users
2. Inspect response body
3. Check all returned users

**Expected Result**:
- No password field in any user object
- All other fields present
- Consistent across paginated responses

#### TC7.3: Invalid ObjectId Validation
**Steps**:
1. Send DELETE /api/admin/users/invalid-id-123
2. Send DELETE /api/admin/users/123 (too short)
3. Monitor responses

**Expected Result**:
- 400 Bad Request status
- Error: "Invalid user ID format"
- No database query attempted

#### TC7.4: Input Validation on Verify
**Steps**:
1. Send PATCH with missing isVerified field
2. Send PATCH with null isVerified
3. Send PATCH with number instead of boolean

**Expected Result**:
- All return 400 status
- Error messages specific to validation failure
- No database update

#### TC7.5: CSRF Protection (if applicable)
**Steps**:
1. Analyze admin dashboard requests
2. Check for CSRF tokens if needed
3. Verify same-origin policy

**Expected Result**:
- Proper CORS headers (if API separate)
- No unnecessary CSRF tokens for same-origin
- Security headers present

---

## Test Scenario 8: Audit Logging

### Pre-conditions
- MongoDB connected
- Admin performs actions
- Audit logs collection accessible

### Test Cases

#### TC8.1: Audit Log - User Deletion
**Steps**:
1. Delete a user via admin dashboard
2. Query audit_logs collection
3. Find delete_user action entry

**Expected Result**:
- Audit log entry exists
- action = "delete_user"
- adminId = admin's user ID
- targetUserId = deleted user's ID
- details.email = deleted user's email
- ipAddress = request IP
- status = "success"
- createdAt = timestamp

#### TC8.2: Audit Log - Email Verification
**Steps**:
1. Toggle user verification status
2. Query audit_logs collection
3. Find verify_email entry

**Expected Result**:
- Audit log entry exists
- action = "verify_email"
- adminId = admin's user ID
- targetUserId = target user's ID
- details.isVerified = new status
- details.action = "verified" or "unverified"
- ipAddress recorded
- status = "success"

#### TC8.3: Audit Log - Failed Actions
**Steps**:
1. Attempt unauthorized action
2. Query audit_logs collection
3. Check for failure entry

**Expected Result**:
- Audit log may or may not be created (check implementation)
- If created: status = "failure"
- Details include failure reason

#### TC8.4: Audit Log Query
**Steps**:
1. Perform multiple actions
2. Query audit_logs by:
   - adminId
   - action type
   - createdAt range
3. Verify sorting and filtering

**Expected Result**:
- Logs retrievable by various criteria
- Timestamps accurate
- Complete audit trail available
- Logs immutable (not updated after creation)

---

## Test Scenario 9: Responsive Design & UI/UX

### Pre-conditions
- Admin dashboard loaded
- Browser dev tools available

### Test Cases

#### TC9.1: Mobile View (320px width)
**Steps**:
1. Set viewport to 320px width
2. Load admin dashboard
3. Verify all elements visible and usable

**Expected Result**:
- No horizontal scrolling
- All buttons clickable
- Table scrollable or responsive
- Search input accessible
- Navigation readable

#### TC9.2: Tablet View (768px width)
**Steps**:
1. Set viewport to 768px
2. Load admin dashboard
3. Verify layout

**Expected Result**:
- Layout adapts to width
- Table displays correctly
- Controls properly positioned
- No overlapping elements

#### TC9.3: Desktop View (1920px width)
**Steps**:
1. Set viewport to 1920px
2. Load dashboard
3. Verify layout

**Expected Result**:
- Full table visible
- Proper spacing
- No excessive empty space
- Professional appearance

#### TC9.4: Loading States
**Steps**:
1. Load admin dashboard
2. Observe initial load
3. Navigate to different pages
4. Perform searches

**Expected Result**:
- Loading message shown during initial fetch
- Page indicators disabled while loading
- User feedback for async operations

#### TC9.5: Error Display
**Steps**:
1. Simulate API error (disable network, etc.)
2. Attempt operation
3. Observe error display

**Expected Result**:
- Error banner appears
- Error message is clear
- User can retry operation
- Banner can be dismissed

---

## Expected Results Summary

### All Scenarios Should Pass
- Admin authentication and authorization
- User listing with pagination
- Search and filtering
- User deletion with proper safeguards
- Email verification toggle
- Rate limiting enforcement
- Audit logging of actions
- Security validations
- Responsive design
- Error handling

### Critical Success Criteria
1. No unauthorized access to admin features
2. User data never leaked in errors
3. Deleted users cannot be recovered
4. All admin actions logged
5. Rate limits enforced
6. Database integrity maintained

---

**Next Step**: Execute these test scenarios with Gemini headless testing

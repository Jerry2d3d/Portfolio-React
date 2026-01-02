# Stage 3: QR Code Generation & Management - Test Plan

**Date:** 2025-12-27
**Stage:** Stage 3
**Tester:** AI Testing Specialist

## Test Scope

### SHOULD be working (test these):
1. User registration automatically generates a QR code
2. Dashboard displays user's QR code with download and copy buttons
3. QR code settings page allows customization (standard/colored, color picker)
4. QR code changes are saved and reflected in dashboard
5. Download button converts QR code to PNG
6. Copy button copies URL to clipboard
7. API endpoints: GET /api/qr and PUT /api/qr/settings work correctly

### NOT expected yet (don't flag as issues):
- Premium QR code types (logo, gradient, rounded) - Stage 8
- Payment integration - Stage 8
- Bookmark management - Stage 4
- User profiles - Stage 5

---

## Test Cases

### TC-1: User Registration with QR Code Generation
**Priority:** Critical
**Component:** /api/auth/register, QR Code Creation

**Test Steps:**
1. Register a new user with valid credentials
2. Verify registration success
3. Check that QR code is automatically created in database
4. Verify QR code has default settings (standard, black & white)
5. Verify QR code data contains correct user profile URL format

**Expected Results:**
- QR code created successfully
- Type = 'standard'
- Settings: color = '#000000', backgroundColor = '#FFFFFF'
- Data = '{appUrl}/u/{userId}'
- isPremium = false

---

### TC-2: Dashboard QR Code Display
**Priority:** Critical
**Component:** /dashboard, QRCodeDisplay component

**Test Steps:**
1. Login with authenticated user
2. Navigate to /dashboard
3. Verify QR code is displayed
4. Check download button is present
5. Check copy button is present
6. Verify QR code URL is shown

**Expected Results:**
- QR code renders correctly
- Download and Copy buttons visible
- URL displayed below QR code

---

### TC-3: QR Code Settings Page - Load Current Settings
**Priority:** High
**Component:** /qr/settings

**Test Steps:**
1. Navigate to /qr/settings
2. Verify current QR code settings are loaded
3. Check type dropdown shows current type
4. Check color inputs show current colors
5. Verify preview displays current QR code

**Expected Results:**
- Settings page loads without errors
- Form populated with current values
- Preview matches current settings

---

### TC-4: QR Code Customization - Change to Colored
**Priority:** High
**Component:** /qr/settings, PUT /api/qr/settings

**Test Steps:**
1. On settings page, change type to "Colored"
2. Select a custom color (e.g., #FF0000 red)
3. Change background color (e.g., #FFFF00 yellow)
4. Click "Save Changes"
5. Verify success message
6. Return to dashboard and verify changes applied

**Expected Results:**
- Settings save successfully
- Success message displayed
- Dashboard QR code reflects new colors
- Changes persist on page refresh

---

### TC-5: Download QR Code as PNG
**Priority:** High
**Component:** QRCodeDisplay download functionality

**Test Steps:**
1. On dashboard, click "Download PNG" button
2. Verify download initiated
3. Check downloaded file is valid PNG
4. Verify image contains QR code
5. Test with different QR code settings (colored vs standard)

**Expected Results:**
- PNG file downloads successfully
- File named 'qr-code.png'
- Image matches displayed QR code
- Image is scannable

---

### TC-6: Copy URL to Clipboard
**Priority:** High
**Component:** QRCodeDisplay copy functionality

**Test Steps:**
1. On dashboard, click "Copy URL" button
2. Verify alert/notification shown
3. Paste clipboard content
4. Verify copied text matches QR code data

**Expected Results:**
- Clipboard contains correct URL
- Alert shows "URL copied to clipboard!"
- URL format: {appUrl}/u/{userId}

---

### TC-7: GET /api/qr Endpoint
**Priority:** Critical
**Component:** /api/qr route

**Test Steps:**
1. Test authenticated request to GET /api/qr
2. Verify response includes QR code data
3. Test unauthenticated request (no token)
4. Test with invalid token

**Expected Results:**
- Authenticated: 200, returns QR code object
- No token: 401, "Not authenticated"
- Invalid token: 401, "Invalid or expired token"

---

### TC-8: PUT /api/qr/settings Endpoint
**Priority:** Critical
**Component:** /api/qr/settings route

**Test Steps:**
1. Test updating to 'colored' type with valid colors
2. Test with invalid color format (not hex)
3. Test with missing type field
4. Test attempting premium type without payment
5. Test unauthenticated request

**Expected Results:**
- Valid update: 200, success message
- Invalid color: 400, validation error
- Missing type: 400, "QR code type is required"
- Premium type: 403, "PREMIUM_REQUIRED"
- No auth: 401, "UNAUTHORIZED"

---

### TC-9: Color Validation
**Priority:** Medium
**Component:** /api/qr/settings validation

**Test Steps:**
1. Test valid hex colors (#000000, #FFFFFF, #FF5733)
2. Test invalid formats (000000, rgb(0,0,0), blue)
3. Test edge cases (null, undefined, empty string)

**Expected Results:**
- Valid hex: Accepted
- Invalid formats: 400 error with clear message
- Edge cases: Handled gracefully

---

### TC-10: Settings Persistence
**Priority:** High
**Component:** Database integration

**Test Steps:**
1. Change QR settings multiple times
2. Logout and login again
3. Verify settings persisted
4. Check updatedAt timestamp changes

**Expected Results:**
- Settings saved to database
- Changes persist across sessions
- updatedAt field updates correctly

---

### TC-11: Premium Type Prevention
**Priority:** Medium
**Component:** Premium type blocking (Stage 8 preparation)

**Test Steps:**
1. Attempt to select 'logo' type in UI (should be disabled)
2. Attempt to select 'gradient' type in UI (should be disabled)
3. Try API call to set premium type directly

**Expected Results:**
- Premium options disabled in UI
- API returns 403 PREMIUM_REQUIRED
- User sees "Premium types will be available in Stage 8"

---

### TC-12: Security & Error Handling
**Priority:** Critical
**Component:** Overall security posture

**Test Steps:**
1. Test CSRF protection (httpOnly cookies)
2. Test SQL injection attempts in color fields
3. Test XSS in settings data
4. Test concurrent update race conditions
5. Verify error messages don't leak sensitive info

**Expected Results:**
- All security measures in place
- No injection vulnerabilities
- Safe error handling
- No sensitive data in error responses

---

### TC-13: UI/UX Quality
**Priority:** Medium
**Component:** User interface

**Test Steps:**
1. Test responsive design on mobile/tablet/desktop
2. Verify accessibility (ARIA labels, keyboard navigation)
3. Check loading states display correctly
4. Test error states (network failure, server error)
5. Verify success feedback is clear

**Expected Results:**
- Responsive on all screen sizes
- Accessible to screen readers
- Clear loading indicators
- Graceful error handling
- User-friendly feedback

---

### TC-14: QR Code Preview Real-time Update
**Priority:** Medium
**Component:** Settings page preview

**Test Steps:**
1. Change color picker values
2. Verify preview updates in real-time
3. Switch between standard and colored types
4. Check preview accuracy before saving

**Expected Results:**
- Preview updates immediately on change
- Preview matches what will be saved
- No lag or performance issues

---

## Testing Tools
- Gemini CLI for automated testing
- Manual browser testing for UI/UX
- API testing with curl/Postman
- Database inspection with MongoDB Compass

## Success Criteria
- All critical and high priority tests pass
- No security vulnerabilities found
- QR codes generate and display correctly
- Settings save and persist properly
- API endpoints function as specified
- User experience is smooth and intuitive

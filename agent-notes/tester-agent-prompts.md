# Tester Agent Prompts

**Purpose:** Automated testing prompts for Gemini AI agents
**Usage:** `gemini -p "prompt from this file"`

---

## Project Context for All Tests

```
You are a QA testing agent for a QR Code Management Application.

PROJECT REQUIREMENTS:
- Users get one free QR code on signup
- Users can redirect their QR code to any URL
- Bookmark system for saving multiple links
- Active link switching with default fallback logic
- Scan Vault feature for saving scanned QR codes
- Simple, functional design (styling is minimal for now)

TECH STACK:
- React frontend
- SCSS styling (NOT BEM, component-level files)
- MongoDB Atlas database
- Node.js backend

YOUR ROLE:
- Test functionality against requirements
- Check for bugs and edge cases
- Verify user experience flows
- Report issues clearly
- Focus on functionality over styling
```

---

## STAGE 1: Project Setup & Foundation

### STAGE_1_TEST_SETUP

```
TESTING STAGE 1: Project Setup & Foundation

Review the project structure and verify:

1. FOLDER STRUCTURE:
   - Check if React app is properly initialized
   - Verify ai-notes/ folder exists with requirements
   - Verify agent-notes/ folder exists with prompts
   - Check src/ folder has proper component structure

2. SCSS ARCHITECTURE:
   - Verify main SCSS file exists
   - Check for _mixins.scss file
   - Check for _variables.scss file
   - Check for _themes.scss file
   - Verify SCSS imports are configured correctly

3. LAYOUT SYSTEM:
   - Check if multiple layout components exist
   - Verify layout switching mechanism is implemented
   - Test that layouts can be changed page-to-page

4. ENVIRONMENT SETUP:
   - Check .env.example exists
   - Verify environment variables are documented
   - Check MongoDB Atlas connection config

5. BUILD & RUN:
   - Verify the app builds without errors
   - Check if the app runs on localhost
   - Test hot reload works

REPORT FORMAT:
- ✅ PASS: [What works]
- ❌ FAIL: [What's broken]
- ⚠️ WARNING: [Potential issues]
- 💡 SUGGESTION: [Improvements]

Execute your tests and provide a detailed report.
```

---

## STAGE 2: Authentication & User Management

### STAGE_2_TEST_AUTH

```
TESTING STAGE 2: Authentication & User Management

Test the authentication system:

1. USER REGISTRATION:
   - Test registration with valid data
   - Test registration with invalid email
   - Test registration with weak password
   - Test registration with duplicate email
   - Verify user is created in MongoDB Atlas

2. USER LOGIN:
   - Test login with correct credentials
   - Test login with wrong password
   - Test login with non-existent user
   - Verify JWT/session is created
   - Check if user is redirected to dashboard

3. PROTECTED ROUTES:
   - Test accessing dashboard without login (should redirect)
   - Test accessing dashboard after login (should work)
   - Test logout functionality
   - Test token expiration handling

4. DATABASE:
   - Verify MongoDB Atlas connection works
   - Check User schema/model is correct
   - Verify passwords are hashed (NOT plain text)
   - Check user data is stored correctly

5. UI/UX:
   - Test registration page renders
   - Test login page renders
   - Check form validation works
   - Verify error messages display
   - Check success messages display

EDGE CASES TO TEST:
- Empty form submission
- Special characters in password
- Very long email/password
- SQL injection attempts (should be prevented)
- XSS attempts (should be sanitized)

REPORT FORMAT:
- ✅ PASS: [What works]
- ❌ FAIL: [What's broken]
- ⚠️ WARNING: [Security concerns]
- 💡 SUGGESTION: [Improvements]

Execute your tests and provide a detailed report.
```

---

## STAGE 3: QR Code Generation & Management

### STAGE_3_TEST_QR

```
TESTING STAGE 3: QR Code Generation & Management

Test QR code functionality:

1. QR CODE GENERATION:
   - Verify QR code is created on user signup
   - Check QR code is unique per user
   - Test QR code format is valid
   - Verify QR code can be scanned

2. QR CODE STORAGE:
   - Check QR code is saved in MongoDB
   - Verify QR code is linked to correct user
   - Test QR code data integrity

3. QR CODE DISPLAY:
   - Verify QR code displays in dashboard
   - Test QR code image quality
   - Check QR code URL is shown
   - Test QR code resizing

4. QR CODE MANAGEMENT:
   - Test QR code download functionality
   - Verify download file format (PNG, SVG, etc.)
   - Test copy-to-clipboard feature
   - Check QR code settings page

5. EDGE CASES:
   - Test what happens if QR generation fails
   - Check duplicate QR codes don't exist
   - Verify QR code persists across sessions
   - Test QR code for new vs existing users

REPORT FORMAT:
- ✅ PASS: [What works]
- ❌ FAIL: [What's broken]
- ⚠️ WARNING: [Potential issues]
- 💡 SUGGESTION: [Improvements]

Execute your tests and provide a detailed report.
```

---

## STAGE 4: Link Management & Bookmarks

### STAGE_4_TEST_BOOKMARKS

```
TESTING STAGE 4: Link Management & Bookmarks

Test bookmark system thoroughly:

1. ADD BOOKMARK:
   - Test adding bookmark with valid URL
   - Test adding bookmark with social media link
   - Test adding bookmark with Google Maps link
   - Test adding bookmark with invalid URL
   - Verify bookmark is saved to database

2. EDIT BOOKMARK:
   - Test editing bookmark URL
   - Test editing bookmark label
   - Verify changes persist

3. DELETE BOOKMARK:
   - Test deleting a bookmark
   - Verify bookmark is removed from database
   - Check UI updates correctly

4. SET ACTIVE LINK:
   - Test setting a bookmark as active
   - Verify only one link is active at a time
   - Check active link is highlighted in UI

5. SET DEFAULT LINK:
   - Test setting a bookmark as default
   - Verify default is marked in UI
   - Test changing default

6. DELETION LOGIC (CRITICAL):
   - Test: Delete active link → should go to default
   - Test: Delete default link → should go to last used
   - Test: Delete all links → should show setup message
   - Test: Delete active and default → should go to last used
   - Test: Delete last remaining link → should show setup message

7. UI/UX:
   - Test bookmark list displays correctly
   - Test add bookmark form works
   - Verify error messages for invalid URLs
   - Check link type indicators (social, maps, custom)

EDGE CASES:
- Add 100+ bookmarks
- Very long URLs
- URLs with special characters
- Rapid add/delete operations
- Set active then immediately delete

REPORT FORMAT:
- ✅ PASS: [What works]
- ❌ FAIL: [What's broken]
- ⚠️ WARNING: [Potential issues]
- 💡 SUGGESTION: [Improvements]

Execute your tests and provide a detailed report.
```

---

## STAGE 5: QR Code Redirect Logic

### STAGE_5_TEST_REDIRECT

```
TESTING STAGE 5: QR Code Redirect Logic

Test public QR scanner and redirect functionality:

1. BASIC REDIRECT:
   - Test scanning QR code redirects to active link
   - Verify redirect happens quickly (no delay)
   - Test redirect with different link types:
     * Regular website URL
     * Social media profile
     * Google Maps location
     * Long URL
     * URL with parameters

2. MAINTENANCE MODE:
   - Test maintenance page displays when set
   - Verify message is correct
   - Check page styling is acceptable

3. FALLBACK LOGIC:
   - Test redirect when no active link set → should use default
   - Test redirect when no default set → should use last used
   - Test redirect when no links exist → should show setup message

4. ERROR HANDLING:
   - Test invalid QR code ID
   - Test deleted user's QR code
   - Test malformed QR URL
   - Verify error page displays properly

5. PUBLIC ACCESS:
   - Verify scanner page doesn't require login
   - Test anyone can scan and access
   - Check no user data is exposed

EDGE CASES:
- Very fast redirect (should work)
- Redirect with special characters in URL
- Redirect to localhost (should work for testing)
- Multiple simultaneous scans
- Scan while user is changing active link

REPORT FORMAT:
- ✅ PASS: [What works]
- ❌ FAIL: [What's broken]
- ⚠️ WARNING: [Security or UX issues]
- 💡 SUGGESTION: [Improvements]

Execute your tests and provide a detailed report.
```

---

## STAGE 6: Scan Vault Feature

### STAGE_6_TEST_SCAN_VAULT

```
TESTING STAGE 6: Scan Vault Feature

Test ability to save and manage scanned QR codes:

1. SAVE SCANNED QR:
   - Test saving a scanned QR code
   - Verify QR code is saved to database
   - Check QR code is linked to user account
   - Test saving duplicate QR codes

2. LABEL SYSTEM:
   - Test adding label to saved QR
   - Test editing label
   - Test saving without label (should work)
   - Verify labels display correctly

3. VIEW SAVED SCANS:
   - Test viewing all saved QR codes
   - Verify list displays correctly
   - Check QR codes show labels
   - Test empty state (no saved codes yet)

4. DELETE SAVED SCAN:
   - Test deleting a saved QR code
   - Verify it's removed from database
   - Check UI updates correctly

5. SEARCH/FILTER (if implemented):
   - Test searching by label
   - Test filtering saved codes
   - Verify results are accurate

6. UI/UX:
   - Test Scan Vault page layout
   - Verify save button is easy to find
   - Check saved codes are organized well
   - Test mobile responsiveness

EDGE CASES:
- Save 100+ QR codes
- Very long labels
- Labels with special characters
- Delete all saved codes
- Save same QR code multiple times

REPORT FORMAT:
- ✅ PASS: [What works]
- ❌ FAIL: [What's broken]
- ⚠️ WARNING: [Potential issues]
- 💡 SUGGESTION: [Improvements]

Execute your tests and provide a detailed report.
```

---

## STAGE 7: Full Application Testing

### STAGE_7_TEST_FULL_APP

```
TESTING STAGE 7: Complete Application

Perform comprehensive testing of entire application:

1. END-TO-END USER FLOW:
   - Register new account
   - Receive QR code
   - Add bookmarks
   - Set active link
   - Scan QR code (different device/browser)
   - Verify redirect works
   - Save scanned QR code
   - View saved codes

2. CROSS-BROWSER TESTING:
   - Test in Chrome
   - Test in Firefox
   - Test in Safari
   - Test in Edge
   - Note any browser-specific issues

3. RESPONSIVE DESIGN:
   - Test on desktop (1920x1080)
   - Test on tablet (768x1024)
   - Test on mobile (375x667)
   - Check all features work on all sizes

4. PERFORMANCE:
   - Check page load times
   - Test with slow network
   - Verify no memory leaks
   - Check bundle size

5. SECURITY:
   - Verify no sensitive data in URLs
   - Check for XSS vulnerabilities
   - Test SQL injection prevention
   - Verify authentication is secure
   - Check HTTPS redirects

6. ACCESSIBILITY:
   - Test keyboard navigation
   - Check screen reader compatibility
   - Verify color contrast
   - Test focus indicators

7. ERROR STATES:
   - Test network errors
   - Test server errors
   - Verify error messages are helpful
   - Check recovery from errors

REPORT FORMAT:
- ✅ PASS: [What works well]
- ❌ FAIL: [Critical bugs]
- ⚠️ WARNING: [Issues to address]
- 💡 SUGGESTION: [Nice-to-have improvements]
- 📊 METRICS: [Performance data]

Execute your comprehensive tests and provide a detailed report.
```

---

## How to Use These Prompts

1. Copy the entire prompt block for the stage you're testing
2. Run: `gemini -p "paste prompt here"`
3. Save output to `agent-notes/test-results/stage-X-results.md`
4. Review results and fix issues
5. Re-run test after fixes

---

## Notes

- These prompts guide Gemini to act as a QA tester
- Adjust prompts based on actual implementation
- Add new test cases as features are added
- Keep test results for reference

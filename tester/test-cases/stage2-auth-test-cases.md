# Stage 2 Authentication - Test Cases

## Test Categories

### 1. User Registration Tests

#### TC-REG-001: Valid Registration
- **Description:** Register a new user with valid data
- **Input:**
  - email: test@example.com
  - password: TestPassword123
  - name: Test User
- **Expected:** 201 status, success response, user created without password in response
- **Priority:** Critical

#### TC-REG-002: Email Validation - Invalid Format
- **Description:** Attempt registration with invalid email
- **Input:**
  - email: invalid-email
  - password: TestPassword123
- **Expected:** 400 status, INVALID_EMAIL error
- **Priority:** High

#### TC-REG-003: Password Validation - Too Short
- **Description:** Password less than 8 characters
- **Input:**
  - email: test@example.com
  - password: Test1
- **Expected:** 400 status, WEAK_PASSWORD error
- **Priority:** High

#### TC-REG-004: Password Validation - No Uppercase
- **Description:** Password without uppercase letter
- **Input:**
  - email: test@example.com
  - password: testpassword123
- **Expected:** 400 status, WEAK_PASSWORD error
- **Priority:** High

#### TC-REG-005: Password Validation - No Lowercase
- **Description:** Password without lowercase letter
- **Input:**
  - email: test@example.com
  - password: TESTPASSWORD123
- **Expected:** 400 status, WEAK_PASSWORD error
- **Priority:** High

#### TC-REG-006: Password Validation - No Number
- **Description:** Password without numeric character
- **Input:**
  - email: test@example.com
  - password: TestPassword
- **Expected:** 400 status, WEAK_PASSWORD error
- **Priority:** High

#### TC-REG-007: Missing Required Fields
- **Description:** Registration without email or password
- **Input:**
  - email: (empty)
  - password: (empty)
- **Expected:** 400 status, VALIDATION_ERROR
- **Priority:** Critical

#### TC-REG-008: Duplicate Email Prevention
- **Description:** Register with existing email
- **Input:** Same email as existing user
- **Expected:** 409 status, EMAIL_EXISTS error
- **Priority:** Critical

#### TC-REG-009: Optional Name Field
- **Description:** Register without name field
- **Input:**
  - email: test@example.com
  - password: TestPassword123
  - name: (empty)
- **Expected:** 201 status, user created without name
- **Priority:** Medium

#### TC-REG-010: XSS Prevention in Name
- **Description:** Name field with HTML/script tags
- **Input:**
  - name: <script>alert('xss')</script>
- **Expected:** Input sanitized, special characters escaped
- **Priority:** High

---

### 2. User Login Tests

#### TC-LOGIN-001: Valid Login
- **Description:** Login with correct credentials
- **Input:**
  - email: test@example.com
  - password: TestPassword123
- **Expected:** 200 status, JWT token in response and httpOnly cookie
- **Priority:** Critical

#### TC-LOGIN-002: Invalid Email
- **Description:** Login with non-existent email
- **Input:**
  - email: nonexistent@example.com
  - password: TestPassword123
- **Expected:** 401 status, INVALID_CREDENTIALS error
- **Priority:** Critical

#### TC-LOGIN-003: Invalid Password
- **Description:** Login with wrong password
- **Input:**
  - email: test@example.com
  - password: WrongPassword123
- **Expected:** 401 status, INVALID_CREDENTIALS error
- **Priority:** Critical

#### TC-LOGIN-004: Missing Fields
- **Description:** Login without email or password
- **Input:** Empty fields
- **Expected:** 400 status, VALIDATION_ERROR
- **Priority:** High

#### TC-LOGIN-005: Invalid Email Format
- **Description:** Login with malformed email
- **Input:**
  - email: not-an-email
  - password: TestPassword123
- **Expected:** 401 status, INVALID_CREDENTIALS (security - don't reveal format issue)
- **Priority:** Medium

#### TC-LOGIN-006: JWT Token Generation
- **Description:** Verify JWT token is properly generated
- **Expected:** Token contains userId and email, has expiration
- **Priority:** Critical

#### TC-LOGIN-007: HttpOnly Cookie Set
- **Description:** Verify httpOnly cookie is set on login
- **Expected:** Cookie named 'token', httpOnly, secure in production, 7 day expiry
- **Priority:** Critical

---

### 3. User Logout Tests

#### TC-LOGOUT-001: Successful Logout
- **Description:** Logout clears token cookie
- **Expected:** 200 status, token cookie cleared (maxAge: 0)
- **Priority:** Critical

#### TC-LOGOUT-002: Logout Without Authentication
- **Description:** Call logout endpoint without being logged in
- **Expected:** 200 status (logout is idempotent)
- **Priority:** Low

---

### 4. Protected Route Tests

#### TC-PROTECT-001: Dashboard Access - Authenticated
- **Description:** Access dashboard with valid token
- **Expected:** Dashboard renders, shows user data
- **Priority:** Critical

#### TC-PROTECT-002: Dashboard Access - Not Authenticated
- **Description:** Access dashboard without token
- **Expected:** Redirect to /login
- **Priority:** Critical

#### TC-PROTECT-003: Dashboard Access - Invalid Token
- **Description:** Access dashboard with expired/invalid token
- **Expected:** Redirect to /login
- **Priority:** High

---

### 5. AuthContext Tests

#### TC-AUTH-CTX-001: Login State Management
- **Description:** AuthContext updates user state on login
- **Expected:** user state populated, isAuthenticated true
- **Priority:** Critical

#### TC-AUTH-CTX-002: Logout State Management
- **Description:** AuthContext clears state on logout
- **Expected:** user state null, isAuthenticated false, redirect to login
- **Priority:** Critical

#### TC-AUTH-CTX-003: Persistent Authentication
- **Description:** User state restored from localStorage on page reload
- **Expected:** Token and user retrieved from localStorage, state restored
- **Priority:** High

#### TC-AUTH-CTX-004: Loading State
- **Description:** AuthContext shows loading state during initialization
- **Expected:** loading: true initially, false after check
- **Priority:** Medium

---

### 6. Security Tests

#### TC-SEC-001: Password Hashing
- **Description:** Passwords stored as bcrypt hashes
- **Expected:** Password hashed with bcrypt, SALT_ROUNDS = 12
- **Priority:** Critical

#### TC-SEC-002: JWT Secret Usage
- **Description:** JWT uses secret from environment
- **Expected:** Uses JWT_SECRET from .env, fallback warning for dev
- **Priority:** Critical

#### TC-SEC-003: XSS Prevention
- **Description:** User input sanitized
- **Expected:** Special characters escaped in name field
- **Priority:** High

#### TC-SEC-004: Case-Insensitive Email
- **Description:** Email stored in lowercase
- **Expected:** test@example.com and TEST@EXAMPLE.COM are the same user
- **Priority:** Medium

#### TC-SEC-005: Error Message Security
- **Description:** Login errors don't reveal if email exists
- **Expected:** Same error message for wrong email or wrong password
- **Priority:** High

---

### 7. Build & Integration Tests

#### TC-BUILD-001: TypeScript Compilation
- **Description:** Project compiles without TypeScript errors
- **Expected:** npm run build succeeds (ignoring MongoDB connection errors)
- **Priority:** Critical

#### TC-BUILD-002: SCSS Compilation
- **Description:** SCSS files compile correctly
- **Expected:** All .scss files compile to CSS
- **Priority:** High

#### TC-BUILD-003: Next.js Route Generation
- **Description:** All pages and API routes generated
- **Expected:** /register, /login, /dashboard, /api/auth/* routes exist
- **Priority:** Critical

---

### 8. React Component Tests

#### TC-COMP-001: Registration Page Renders
- **Description:** /register page displays registration form
- **Expected:** Form with email, password, name fields, submit button
- **Priority:** Critical

#### TC-COMP-002: Registration Form Validation
- **Description:** Client-side validation on registration form
- **Expected:** Required fields enforced, password hint shown
- **Priority:** High

#### TC-COMP-003: Login Page Renders
- **Description:** /login page displays login form
- **Expected:** Form with email, password fields, submit button
- **Priority:** Critical

#### TC-COMP-004: Login Success Message
- **Description:** Show success message after registration redirect
- **Expected:** "Account created successfully! Please login." shown
- **Priority:** Medium

#### TC-COMP-005: Dashboard Renders
- **Description:** Dashboard shows user information
- **Expected:** Welcome message, user email, logout button, QR placeholder
- **Priority:** Critical

#### TC-COMP-006: Error Display
- **Description:** Error messages displayed on forms
- **Expected:** Server errors shown in error div
- **Priority:** High

#### TC-COMP-007: Loading States
- **Description:** Loading states during form submission
- **Expected:** Button disabled, text changes to "Creating Account..." / "Logging in..."
- **Priority:** Medium

---

## Test Execution Priority

1. **Critical Tests** (Must Pass)
   - TC-REG-001, TC-REG-007, TC-REG-008
   - TC-LOGIN-001, TC-LOGIN-002, TC-LOGIN-003, TC-LOGIN-006, TC-LOGIN-007
   - TC-LOGOUT-001
   - TC-PROTECT-001, TC-PROTECT-002
   - TC-AUTH-CTX-001, TC-AUTH-CTX-002
   - TC-SEC-001, TC-SEC-002
   - TC-BUILD-001, TC-BUILD-003
   - TC-COMP-001, TC-COMP-003, TC-COMP-005

2. **High Priority Tests** (Should Pass)
   - All password validation tests
   - Security tests
   - Protected route edge cases

3. **Medium Priority Tests** (Nice to Have)
   - Optional field handling
   - UI/UX enhancements
   - Loading states

4. **Low Priority Tests**
   - Edge cases that don't affect core functionality

---

## Test Data

### Valid User Credentials
- Email: testuser@example.com
- Password: ValidPass123
- Name: Test User

### Invalid Test Data
- Invalid emails: not-an-email, @example.com, test@, test
- Weak passwords: short, nouppercase123, NOLOWERCASE123, NoNumbers
- XSS attempts: `<script>alert('xss')</script>`, `<img src=x onerror=alert(1)>`

---

## MongoDB Note
Since MongoDB Atlas is not yet configured (placeholder credentials in .env.local), database-related tests will fail with connection errors. These tests will verify the logic flow and error handling, but actual database operations cannot be tested until MongoDB is properly configured.

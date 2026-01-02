# Stage 2: Authentication & User Management

**Date Started:** 2025-12-26
**Status:** IN PROGRESS

---

## Goal

Implement user authentication system with registration, login, and protected dashboard access using MongoDB Atlas, JWT tokens, and secure password hashing.

---

## Tasks to Complete

### Package Installation
- [ ] Install `mongodb` - MongoDB driver for Node.js
- [ ] Install `bcryptjs` - Password hashing library
- [ ] Install `jsonwebtoken` - JWT token generation and verification
- [ ] Install `@types/bcryptjs` - TypeScript types for bcrypt
- [ ] Install `@types/jsonwebtoken` - TypeScript types for JWT

### Database Setup
- [ ] Connect to MongoDB Atlas
- [ ] Test database connection
- [ ] Create User model/schema with Mongoose or plain MongoDB
- [ ] Set up database indexes (unique email)

### API Routes (Next.js API Routes)
- [ ] Create `/api/auth/register` endpoint
  - [ ] Validate email and password
  - [ ] Hash password with bcrypt
  - [ ] Create user in database
  - [ ] Generate QR code for new user (basic placeholder for now, full implementation in Stage 3)
  - [ ] Return success response
- [ ] Create `/api/auth/login` endpoint
  - [ ] Validate credentials
  - [ ] Compare password with bcrypt
  - [ ] Generate JWT token
  - [ ] Return token and user data
- [ ] Create `/api/auth/me` endpoint (optional)
  - [ ] Verify JWT token
  - [ ] Return current user data

### Authentication Pages
- [ ] Create `/register` page
  - [ ] Use AuthLayout
  - [ ] Registration form with SCSS
  - [ ] Email and password inputs
  - [ ] Form validation
  - [ ] API integration
  - [ ] Error handling
  - [ ] Redirect to dashboard on success
- [ ] Create `/login` page
  - [ ] Use AuthLayout
  - [ ] Login form with SCSS
  - [ ] Email and password inputs
  - [ ] Form validation
  - [ ] API integration
  - [ ] Error handling
  - [ ] Redirect to dashboard on success

### Dashboard
- [ ] Create `/dashboard` page
  - [ ] Use MainLayout
  - [ ] Protected route (require authentication)
  - [ ] Display user info
  - [ ] Placeholder for QR code (Stage 3)
  - [ ] Logout functionality

### Authentication Logic
- [ ] Create auth middleware for API routes
- [ ] Create auth context for client-side state
- [ ] Implement token storage (localStorage or cookies)
- [ ] Implement automatic token refresh (optional)
- [ ] Create protected route wrapper/HOC
- [ ] Handle unauthorized access (redirect to login)

### Security
- [ ] Password strength validation
- [ ] Email format validation
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] CSRF protection (for cookies, if used)
- [ ] Secure JWT secret
- [ ] Set appropriate token expiration

---

## Technical Decisions

### Authentication Approach
- **JWT Tokens** stored in httpOnly cookies for security
- **bcryptjs** for password hashing (salt rounds: 12)
- **MongoDB** native driver (not Mongoose) for simplicity
- Token expiration: 7 days (configurable in .env)

### Database Schema
```typescript
User {
  _id: ObjectId
  email: string (unique, required)
  password: string (hashed, required)
  name?: string (optional)
  createdAt: Date
  updatedAt: Date
  qrCodeId?: ObjectId (reference to QR code, Stage 3)
}
```

### API Response Format
```typescript
Success: {
  success: true
  data: any
  message?: string
}

Error: {
  success: false
  error: string
  message: string
}
```

---

## Implementation Order

1. Install packages
2. Update MongoDB connection to actually connect
3. Create User utilities (schema validation, password hashing)
4. Create register API route
5. Create login API route
6. Create registration page
7. Create login page
8. Create auth context
9. Create dashboard page
10. Implement protected routes
11. Test full authentication flow
12. Update documentation

---

## Files to Create/Modify

### New Files:
- `src/app/register/page.tsx` - Registration page
- `src/app/register/Register.module.scss` - Registration styles
- `src/app/login/page.tsx` - Login page
- `src/app/login/Login.module.scss` - Login styles
- `src/app/dashboard/page.tsx` - Dashboard page
- `src/app/dashboard/Dashboard.module.scss` - Dashboard styles
- `src/app/api/auth/register/route.ts` - Register API endpoint
- `src/app/api/auth/login/route.ts` - Login API endpoint
- `src/app/api/auth/logout/route.ts` - Logout API endpoint (optional)
- `src/lib/auth.ts` - Auth utilities (JWT, password hashing)
- `src/lib/db/users.ts` - User database operations
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/middleware.ts` - Next.js middleware for protected routes

### Modified Files:
- `src/lib/mongodb.ts` - Actually connect to MongoDB
- `package.json` - Add new dependencies
- `README.md` - Update with Stage 2 info
- `.env.example` - Update if needed

---

## Testing Checklist

- [ ] User can register with valid email/password
- [ ] Registration fails with invalid email
- [ ] Registration fails with weak password
- [ ] Registration fails with duplicate email
- [ ] User can login with correct credentials
- [ ] Login fails with wrong password
- [ ] Login fails with non-existent user
- [ ] JWT token is generated and stored
- [ ] Dashboard is accessible after login
- [ ] Dashboard redirects to login if not authenticated
- [ ] Logout clears token and redirects to login
- [ ] Protected routes require authentication
- [ ] User data persists in MongoDB

---

## Success Criteria

- [ ] Users can successfully register
- [ ] Users can successfully login
- [ ] Passwords are securely hashed
- [ ] JWT tokens work correctly
- [ ] Dashboard is protected
- [ ] MongoDB Atlas connection works
- [ ] All security best practices followed
- [ ] No sensitive data exposed
- [ ] Error messages are helpful but don't leak info
- [ ] Code committed to GitHub

---

## Notes During Implementation

(Will update as I work...)

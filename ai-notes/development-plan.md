# Development Plan - QR Code Management App

**Created:** 2025-12-26
**Last Updated:** 2025-12-27

---

## Git Workflow

### Deployment
- **`main`** branch → Auto-deploys to **markedqr.com**
- All development work happens on `main` branch
- Push to `main` to deploy changes

---

## Development Workflow

### Per-Stage Process
1. **Planning Phase:**
   - Document what will be done in stage notes
   - Review requirements
   - Create task breakdown

2. **Development Phase:**
   - Implement features
   - Write code following architecture guidelines
   - Create component SCSS files
   - Document progress

3. **Testing Phase:**
   - **REQUIRED:** Run @agent-react-nextjs-tester for automated testing
   - Run Gemini code review agents (if configured)
   - Fix any issues found by testing agents
   - Retest after fixes
   - Continue until all tests pass

4. **Review Phase:**
   - Ask user if stage is correct
   - Address any user feedback
   - Make necessary adjustments
   - **Run @agent-react-nextjs-tester again if changes made**

5. **Commit Phase:**
   - Commit stage to GitHub with descriptive message
   - Update README with build/run instructions
   - Tag stage in git if needed

6. **Documentation Phase:**
   - Update stage notes with what was completed
   - Document any decisions or changes
   - Document testing results from @agent-react-nextjs-tester
   - Prepare notes for next stage

### When to Run @agent-react-nextjs-tester:
- ✅ **After completing each stage** (before asking for user approval)
- ✅ **When user reports a problem** or bug
- ✅ **After making fixes** to verify they work
- ✅ **Before committing to GitHub**
- ✅ **When adding new features** within a stage

---

## Stage Breakdown

### Stage 1: Project Setup & Foundation
**Goal:** Create solid foundation for Next.js app with custom SCSS architecture from scratch

**Tasks:**
- [ ] Initialize Next.js project (NO Tailwind, NO Bootstrap, NO CSS frameworks)
- [ ] Configure Next.js to use SCSS (install sass package)
- [ ] Set up SCSS folder structure: `styles/` folder
- [ ] Create main SCSS files:
  - [ ] `styles/main.scss` - Main entry point
  - [ ] `styles/_mixins.scss` - Reusable mixins
  - [ ] `styles/_variables.scss` - Color, spacing, typography variables
  - [ ] `styles/_themes.scss` - Theme definitions
- [ ] Configure global SCSS import in Next.js
- [ ] Create folder structure:
  - [ ] `components/` - Reusable components with SCSS
  - [ ] `layouts/` - Layout components
  - [ ] `app/` or `pages/` - Next.js routing (choose router type)
  - [ ] `lib/` - Utility functions and configs
- [ ] Set up environment variables (`.env.local`)
- [ ] Create multiple layout components (main layout, auth layout, etc.)
- [ ] Implement layout switching mechanism for Next.js
- [ ] Prepare MongoDB Atlas connection config (just config, no actual connection yet)
- [ ] Update README with build/run instructions
- [ ] Note: Gemini CLI setup deferred to after Stage 1 completion

**Deliverables:**
- Working Next.js app running on localhost
- Custom SCSS architecture in place (NO frameworks)
- Multiple layouts working with switching mechanism
- Clean folder structure following Next.js best practices
- README with clear setup and run instructions
- Environment config ready for MongoDB

**Testing:**
- Manual testing: App runs without errors
- Manual testing: Layouts switch correctly
- Manual testing: SCSS compiles and applies
- Code review: Check folder structure
- Code review: Verify NO CSS frameworks included

---

### Stage 2: Authentication & User Management
**Goal:** Implement user registration, login, and basic dashboard

**Tasks:**
- [ ] Set up MongoDB Atlas connection (using Mongoose or MongoDB driver)
- [ ] Create database connection utility in `lib/mongodb.js`
- [ ] Create User model/schema
- [ ] Create Next.js API route: `/api/auth/register`
- [ ] Create Next.js API route: `/api/auth/login`
- [ ] Implement authentication logic (bcrypt for passwords)
- [ ] Set up JWT or session-based auth (NextAuth.js optional)
- [ ] Create registration page component + SCSS
- [ ] Create login page component + SCSS
- [ ] Create dashboard page + SCSS
- [ ] Implement protected routes (middleware or page-level)
- [ ] Create auth context/state management (React Context or state lib)

**Deliverables:**
- Users can register via API
- Users can login and receive auth token/session
- Dashboard accessible after login
- MongoDB Atlas connected and working
- Auth working properly with Next.js API routes

**Testing:**
- Tester agent validates registration flow
- Tester agent validates login flow
- Code review agent checks security
- Test protected routes

---

### Stage 3: QR Code Generation & Management
**Goal:** Generate and display QR code for each user

**Tasks:**
- [ ] Install QR code generation library
- [ ] Create QR Code model/schema
- [ ] Generate unique QR code on user registration
- [ ] Store QR code data in MongoDB
- [ ] Create QR Code display component + SCSS
- [ ] Create QR Code settings page + SCSS
- [ ] Add QR code download functionality
- [ ] Display QR code in dashboard
- [ ] Add copy-to-clipboard for QR code URL

**Deliverables:**
- QR code generated on signup
- QR code displayed in dashboard
- Users can download QR code
- QR code stored in database

**Testing:**
- Tester agent validates QR generation
- Tester agent validates QR display
- Code review agent checks implementation

---

### Stage 4: Link Management & Bookmarks
**Goal:** Implement bookmark system and link management logic

**Tasks:**
- [ ] Create Bookmark model/schema
- [ ] Create bookmark CRUD API endpoints
- [ ] Implement add bookmark functionality
- [ ] Implement delete bookmark functionality
- [ ] Implement edit bookmark functionality
- [ ] Implement set active link logic
- [ ] Implement set default link logic
- [ ] Handle deleted link scenarios:
  - [ ] If active deleted → go to default
  - [ ] If default deleted → go to last used
  - [ ] If all deleted → show setup message
- [ ] Create Bookmarks component + SCSS
- [ ] Create Add Bookmark form + SCSS
- [ ] Create Bookmark list display + SCSS
- [ ] Add link type indicators (social, maps, custom)

**Deliverables:**
- Users can add/edit/delete bookmarks
- Active link switching works
- Default link system works
- Edge cases handled properly
- UI for managing bookmarks

**Testing:**
- Tester agent validates all CRUD operations
- Tester agent validates edge cases
- Test all deletion scenarios
- Code review agent checks logic

---

### Stage 5: QR Code Redirect Logic
**Goal:** Implement public QR scanner page and redirect logic

**Tasks:**
- [ ] Create public QR scanner endpoint
- [ ] Implement redirect to active link logic
- [ ] Create maintenance mode page + SCSS
- [ ] Implement fallback logic
- [ ] Create error handling for invalid QR codes
- [ ] Create redirect tracking (optional analytics)
- [ ] Test redirect with various link types
- [ ] Handle social media links properly
- [ ] Handle Google Maps links properly

**Deliverables:**
- Public scanner page works
- Redirects to correct active link
- Maintenance page displays when needed
- Error handling works
- All link types redirect properly

**Testing:**
- Tester agent validates redirect logic
- Test all link types
- Test edge cases (no links, deleted links)
- Code review agent checks implementation

---

### Stage 6: Scan Vault Feature
**Goal:** Implement ability to save and manage scanned QR codes

**Tasks:**
- [ ] Decide on feature name (Scan Vault, My Scans, etc.)
- [ ] Create SavedScan model/schema
- [ ] Create save scanned QR endpoint
- [ ] Create get saved scans endpoint
- [ ] Create delete saved scan endpoint
- [ ] Implement labeling system
- [ ] Create Scan Vault page component + SCSS
- [ ] Create Save Scan form + SCSS
- [ ] Create Saved Scans list + SCSS
- [ ] Add edit labels functionality
- [ ] Add search/filter saved scans

**Deliverables:**
- Users can save scanned QR codes
- Users can label saved codes
- Users can view all saved codes
- Users can delete saved codes
- Clean UI for managing saved scans

**Testing:**
- Tester agent validates save functionality
- Tester agent validates label system
- Test CRUD operations
- Code review agent checks implementation

---

### Stage 7: Testing & Polish
**Goal:** Comprehensive testing and bug fixes

**Tasks:**
- [ ] Run full test suite with Gemini agents
- [ ] Fix all bugs found
- [ ] Performance optimization
- [ ] Accessibility review
- [ ] Cross-browser testing
- [ ] Mobile responsive testing
- [ ] Security review
- [ ] Code cleanup
- [ ] Documentation updates
- [ ] README finalization
- [ ] User testing feedback incorporation

**Deliverables:**
- Bug-free application
- Optimized performance
- Responsive design
- Complete documentation
- Ready for deployment

**Testing:**
- Comprehensive tester agent run
- Full code review
- User acceptance testing

---

### Stage 8: Payment Integration (Future)
**Goal:** Add payment for additional links and premium features

**Tasks:**
- [ ] Research payment gateway (Stripe, etc.)
- [ ] Set up payment gateway account
- [ ] Create pricing model
- [ ] Implement payment endpoints
- [ ] Create checkout flow
- [ ] Implement premium user logic
- [ ] Remove ads for premium users
- [ ] Add second QR code for premium users
- [ ] Create subscription management
- [ ] Create payment history page

**Deliverables:**
- Payment system working
- Premium tier active
- Ads removed for premium
- Second QR code available

---

### Stage 9: Game API Integration (Future)
**Goal:** Create API for game app QR code generation

**Tasks:**
- [ ] Design API endpoints
- [ ] Create game-specific QR code schema
- [ ] Implement API authentication
- [ ] Create game QR generation endpoint
- [ ] Create game QR management endpoints
- [ ] Document API usage
- [ ] Create API testing tools
- [ ] Integrate with game app
- [ ] Test end-to-end flow

**Deliverables:**
- Working API for game integration
- Documentation for API
- Game app integration working

---

## Current Status

**Current Stage:** Pre-Stage 1 (Planning)
**Last Completed Stage:** None
**Next Stage:** Stage 1 - Project Setup & Foundation

---

## Decision Log

### 2025-12-26
- **Decision:** Use MongoDB Atlas (cloud) instead of local MongoDB
- **Reason:** User preference, easier deployment

- **Decision:** Defer Game API to Stage 9
- **Reason:** Focus on core QR functionality first

- **Decision:** Need to set up Gemini CLI
- **Reason:** User doesn't have it configured yet

- **Decision:** Use existing Git repository
- **Reason:** User already initialized

---

## Notes for AI Agent

- Keep it simple and working over perfect
- User will handle detailed styling
- Test frequently
- Get user approval at each stage checkpoint
- Document everything
- Focus on functionality first, polish later

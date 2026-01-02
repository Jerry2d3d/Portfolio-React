# QR Code Management Application - Project Requirements

**Date Created:** 2025-12-26
**Project:** Dynamic QR Code Management System
**Version:** 1.0 (Free + Premium tier)

---

## Project Overview

A web and mobile application that allows users to manage dynamic QR codes. Users get QR code(s) that can be redirected to different destinations on-demand, enabling flexible sharing of websites, social media profiles, Google Maps locations, and more.

---

## Technology Stack

### Framework
- **Next.js** - Full-stack React framework with:
  - Built-in routing (App Router or Pages Router)
  - API Routes for backend endpoints
  - Server-Side Rendering (SSR) and Static Site Generation (SSG)
  - Built-in optimization

### Styling
- **SCSS** - Custom styling built from the ground up
  - **NO** Tailwind CSS
  - **NO** Bootstrap or other CSS frameworks
  - Pure SCSS with 25+ years of user's expertise
- **SCSS Structure:**
  - Main style file (`styles/main.scss`)
  - Mixins file (`styles/_mixins.scss`)
  - Variables file (`styles/_variables.scss`)
  - Themes file (`styles/_themes.scss`)
  - Component-level SCSS files (one per component in same folder)
  - Each component imports mixins, variables, and themes
- **SCSS Methodology:** NOT using BEM - custom approach

### Backend
- **Next.js API Routes** - Backend endpoints within Next.js
- **Database:** MongoDB Atlas (cloud)
- **Authentication:** Basic auth initially, Google Sign-On in later phase

### Testing
- **Testing Framework:** TBD
- **AI Testing Agents:** Gemini CLI with headless mode
- **Code Review Agents:** Gemini CLI with headless mode

### Architecture
- **Component-Based:** Everything must be components
- **Multiple Layouts:** Support for different layout structures
- **Layout Switching:** Ability to change layouts from page to page

---

## Core Features - MVP (Version 1)

### User Account & Authentication
- User registration and login
- One QR code provided free on account creation
- User dashboard

### QR Code Management
- **Free Tier:**
  - 1 QR code per user
  - Ads displayed
  - Can change redirect destination unlimited times

- **Premium Tier (Future):**
  - Remove ads
  - Get second QR code
  - Additional features TBD

### Link Management System
- **Bookmarks:**
  - Save multiple destination links
  - Add new bookmarks
  - Remove bookmarks
  - Label bookmarks for easy identification

- **Active Link Logic:**
  - Set any bookmark as the active destination
  - Set a default link
  - If active link is deleted: redirect to default
  - If default is also deleted: redirect to last used link
  - If no links exist: show "Please set up default" message

- **Link Types Supported:**
  - Manual URL entry
  - Social media profiles (LinkedIn, Facebook, Instagram, etc.)
  - Google Maps locations
  - Any valid URL

### QR Code Scanning Experience
- **Public Scanner Page:**
  - Scans redirect to active link
  - During maintenance/updates: Show "You are updating it and we should be back soon" page

### Marked QR Feature
- **Save Scanned QR Codes:**
  - Users can save QR codes they scan
  - Label saved codes (e.g., "Favorite restaurant menu")
  - Manage collection of marked codes
  - Access marked codes later
  - Feature name chosen by user: "Marked QR"

---

## Future Features (Post-MVP)

### Payment Integration (Stage 8)
- Ability to purchase additional links
- Payment gateway integration
- Subscription management for premium tier

### Google Sign-On
- Social authentication option
- Easier onboarding

### Mobile App
- iOS and Android applications
- Same functionality as web version
- Download and manage QR codes offline

### Game API Integration (Stage 9+)
- API for game app integration
- Generate QR codes for game mechanics
- Drive users to next game stages
- Provide rules files and game assets
- Initially for user's game apps
- Future: Sell API access to other developers

### Business Version (Future Phase)
- Advanced features for businesses
- Multiple team members
- Analytics and tracking
- Custom branding options

---

## Development Process Requirements

### Staged Development
- Break work into testable stages
- Get approval after each stage
- Commit each stage to GitHub
- Update README with build/run instructions after each stage

### Testing Protocol
- **React/Next.js Testing Agent (PRIMARY):**
  - **Agent:** @agent-react-nextjs-tester
  - **When to use:** After each stage completion, when bugs occur, before commits
  - **Purpose:** Automated testing of React/Next.js functionality
  - **Required:** Must run before asking user for stage approval
  - **Required:** Must run after any bug fixes

- **Gemini Tester Agents (OPTIONAL):**
  - Use Gemini CLI: `gemini -p "prompt"`
  - Run headless testing after each stage
  - Test against project requirements
  - Use if configured by user

- **Code Review Agents (OPTIONAL):**
  - Use Gemini CLI: `gemini -p "prompt"`
  - Review code quality
  - Check against requirements
  - Flag issues or conflicts
  - Use if configured by user

### Documentation Requirements
- **AI Notes Folder:** `/ai-notes/`
  - Store project requirements
  - Stage documentation
  - Development notes
  - Decisions made

- **Agent Notes Folder:** `/agent-notes/`
  - Testing agent prompts
  - Code review agent prompts
  - Agent feedback and findings

- **Stage Notes:**
  - Before each stage: Document what will be done
  - After each stage: Document what was completed
  - Update with any changes or decisions

### Conflict Resolution
- If agents find issues that conflict with requirements: Ask user
- If new approach suggested: Ask user
- If user finds problems: User will report, AI will fix

---

## Design Philosophy

### Styling Approach
- **Simple and functional over perfect**
- User will handle most styling
- Focus on working functionality
- Clean, minimal design for MVP

### Code Quality
- Avoid over-engineering
- Keep solutions simple and focused
- Only add requested features
- Testing and flags throughout

---

## Development Stages (Detailed)

### Stage 1: Project Setup & Foundation
- Initialize Next.js project (no Tailwind, no other CSS frameworks)
- Set up SCSS architecture from scratch
  - Create main.scss, _mixins.scss, _variables.scss, _themes.scss
  - Configure Next.js to use SCSS
- Create folder structure for components
- Set up environment variables (.env.local)
- Prepare MongoDB Atlas connection (config only, not yet connected)
- Create multiple layout components
- Implement layout switching mechanism
- Initial README with build/run instructions
- Gemini CLI setup deferred to after Stage 1

### Stage 2: Authentication & User Management
- User registration
- User login
- MongoDB user schema
- Basic authentication middleware
- User dashboard layout
- Protected routes

### Stage 3: QR Code Generation & Management
- Generate QR code on user signup
- Store QR code in database
- Display QR code in dashboard
- QR code settings page
- QR code download functionality

### Stage 4: Link Management & Bookmarks
- Bookmark CRUD operations
- Set active link
- Set default link
- Link switching logic
- Handle edge cases (deleted links, no default)
- UI for managing bookmarks

### Stage 5: QR Code Redirect Logic
- Public QR scanner endpoint
- Redirect to active link
- Maintenance mode page
- Fallback logic
- Error handling

### Stage 6: Marked QR Feature
- Save scanned QR codes
- Label and organize marked codes
- View marked codes collection
- Delete marked codes
- UI for Marked QR page

### Stage 7: Testing & Polish
- Comprehensive testing with Gemini agents
- Code review
- Bug fixes
- Performance optimization
- Basic styling improvements
- Documentation updates

### Stage 8: Payment Integration (Deferred)
- Payment gateway setup
- Premium tier logic
- Remove ads for paid users
- Second QR code for premium users

### Stage 9: Game API Integration (Deferred)
- Design API endpoints
- Game QR code generation
- Integration with game app
- Documentation for API usage

---

## User Stories

1. As a user, I want to create an account and receive one free QR code
2. As a user, I want to redirect my QR code to different URLs whenever I choose
3. As a user, I want to save multiple bookmarks and switch between them easily
4. As a user, I want to set a default link in case my active link is deleted
5. As a user, I want to share one QR code and change what people see when they scan it
6. As a user, I want to save QR codes I scan and label them for later reference
7. As a user, I want to share my LinkedIn today and my website tomorrow using the same QR code
8. As a restaurant enthusiast, I want to save QR codes from restaurant menus
9. As a premium user, I want to remove ads and get a second QR code

---

## Success Criteria

### Stage Completion
- All features for the stage work as expected
- No breaking bugs
- Code reviewed by Gemini agents
- User approval received
- Committed to GitHub
- README updated

### MVP Completion
- Users can register and get a QR code
- QR code redirects to user-specified links
- Bookmark system works correctly
- Marked QR feature allows saving and labeling codes
- All edge cases handled gracefully
- Testing agents validate functionality
- Ready for basic user testing

---

## Notes
- Focus on web version first, mobile app later
- Keep it simple and working
- User will handle detailed styling
- Test frequently with AI agents
- Get user approval at each stage

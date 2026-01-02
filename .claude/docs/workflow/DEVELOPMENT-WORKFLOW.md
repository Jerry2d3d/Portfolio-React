# Development Workflow

This document outlines the standard development workflow for this Next.js/MongoDB QR code application.

## Stage Completion Workflow

When you complete a development stage, follow this process:

### 1. Code Review (First)
```bash
# Run the code reviewer agent
# This checks for:
# - Security vulnerabilities
# - Code quality issues
# - TypeScript errors
# - Best practices violations
```

**Agent:** `react-nextjs-code-reviewer`

**Output Location:** `reviewer/stage-X-review.md`

**Pass Criteria:**
- No security vulnerabilities
- No critical code quality issues
- Follows project conventions
- TypeScript compiles without errors

### 2. Testing (Second - Only if Code Review Passes)
```bash
# Run the tester agent
# This performs:
# - Feature testing
# - Integration testing
# - User flow validation
# - Documentation generation
```

**Agent:** `react-nextjs-tester`

**Output Location:** `tester/stage-X-tests.md`

**Pass Criteria:**
- All features work as expected
- No breaking changes
- User flows complete successfully
- Documentation is complete

### 3. Deployment (Only if Both Pass)
- Commit changes
- Push to GitHub
- Hostinger auto-deploys
- Verify production deployment

## Agent Communication

Claude Code should:
1. Complete a stage of development
2. Ask permission to run code reviewer
3. Run `react-nextjs-code-reviewer` agent
4. Review the code review report
5. Fix any issues found
6. Ask permission to run tester (if review passed)
7. Run `react-nextjs-tester` agent
8. Review test results
9. Only proceed to deployment if both pass

## Directory Structure

```
qr-code-app/
├── reviewer/           # Code review reports
│   ├── README.md
│   ├── stage-X-review.md
│   └── current-issues.md
├── tester/            # Test reports and results
│   ├── README.md
│   ├── stage-X-tests.md
│   └── test-results/
└── DEVELOPMENT-WORKFLOW.md (this file)
```

## Stage Planning

### Completed Stages
- ✅ Stage 1: Landing Page & QR Generator
- ✅ Stage 2: User Authentication  
- ✅ Stage 3: QR Code Management
- ✅ Stage 4: Database Integration
- ✅ Stage 5: QR Customization Features
- ✅ Deployment: Hostinger Production

### Upcoming Stages

**Stage 6: Admin Panel & User Management**
- Admin dashboard
- User management (view all users)
- Delete users functionality
- Email verification management
- Admin authentication/authorization

**Stage 7: Password Reset & Email Features**
- Forgot password flow
- Email verification system
- Password reset tokens
- Email service integration (SendGrid/Resend)
- Security best practices for password resets

**Stage 8: Advanced Features (TBD)**
- QR code analytics
- Bulk operations
- Export/import features
- Team collaboration

## Review & Testing Checklist

Before marking a stage as complete:

- [ ] Code compiles without errors
- [ ] All TypeScript types are correct
- [ ] No console errors in browser
- [ ] react-nextjs-code-reviewer passed
- [ ] react-nextjs-tester passed  
- [ ] Documentation updated
- [ ] Changes committed to git
- [ ] Deployed to production
- [ ] Production deployment verified

## Notes

- Never skip the code review step
- Never proceed to testing if code review fails
- Never deploy if either review or testing fails
- Always document issues found
- Always create review reports in the `reviewer/` folder
- Always create test reports in the `tester/` folder

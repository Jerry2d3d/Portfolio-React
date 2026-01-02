# Code Review Documentation

This folder contains code review reports from the `react-nextjs-code-reviewer` agent.

## Purpose
- Document code quality assessments
- Track issues found during reviews
- Maintain review history for each stage
- Provide reference for future development

## Structure
```
reviewer/
├── README.md (this file)
├── stage-1-review.md
├── stage-2-review.md
├── stage-3-review.md
├── stage-4-review.md
├── stage-5-review.md
└── current-issues.md
```

## Workflow
1. After completing a stage, run `react-nextjs-code-reviewer` agent
2. Reviewer creates a report in `stage-X-review.md`
3. If issues are found, they're also logged in `current-issues.md`
4. Once review passes, run `react-nextjs-tester` agent
5. Only proceed to next stage after both pass

## Review Criteria
- Security vulnerabilities
- Code quality and best practices
- TypeScript type safety
- Error handling
- Performance considerations
- Accessibility compliance

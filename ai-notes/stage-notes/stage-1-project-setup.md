# Stage 1: Project Setup & Foundation

**Date Started:** 2025-12-26
**Status:** IN PROGRESS

---

## Goal

Create a solid foundation for the Next.js application with custom SCSS architecture built from the ground up.

---

## Tasks to Complete

### Project Initialization
- [ ] Initialize Next.js project with App Router
- [ ] Ensure NO Tailwind CSS is included
- [ ] Ensure NO other CSS frameworks are included
- [ ] Install SCSS support (sass package)

### SCSS Architecture
- [ ] Create `styles/` folder
- [ ] Create `styles/main.scss` - Main entry point
- [ ] Create `styles/_mixins.scss` - Reusable SCSS mixins
- [ ] Create `styles/_variables.scss` - Colors, spacing, typography variables
- [ ] Create `styles/_themes.scss` - Theme definitions
- [ ] Configure Next.js to import global SCSS

### Folder Structure
- [ ] Create `components/` folder for reusable components
- [ ] Create `layouts/` folder for layout components
- [ ] Create `lib/` folder for utilities and configs
- [ ] Verify `app/` folder exists (Next.js App Router)

### Layout System
- [ ] Create MainLayout component with SCSS file
- [ ] Create AuthLayout component with SCSS file
- [ ] Create DashboardLayout component with SCSS file (optional for Stage 1)
- [ ] Implement layout switching mechanism for Next.js App Router

### Configuration
- [ ] Create `.env.local` file for environment variables
- [ ] Create `.env.example` file with template
- [ ] Add MongoDB Atlas connection string placeholder
- [ ] Create `lib/mongodb.js` config file (no actual connection yet)

### Documentation
- [ ] Update README with:
  - [ ] Installation instructions
  - [ ] How to run the app
  - [ ] Project structure explanation
  - [ ] Environment variables needed

### Testing
- [ ] Verify app runs on localhost without errors
- [ ] Verify SCSS compiles correctly
- [ ] Test layout switching works
- [ ] Check no CSS frameworks are included

---

## Technology Decisions for Stage 1

- **Next.js Version:** Latest (will be determined during npx create-next-app)
- **Router:** App Router (modern, with Server Components)
- **Styling:** SCSS only, NO Tailwind, NO Bootstrap
- **Node Package Manager:** npm (unless user prefers yarn/pnpm)

---

## Implementation Notes

### Next.js Initialization
Will use: `npx create-next-app@latest` with options:
- TypeScript: Ask user or use JavaScript?
- ESLint: Yes
- Tailwind CSS: **NO**
- `src/` directory: Ask user or use root-level app/?
- App Router: **YES**
- Import alias: Default (@/*)

### SCSS Setup
- Install: `npm install sass`
- Import global styles in `app/layout.js` (or layout.tsx if TypeScript)
- Component-level SCSS: Import directly in component files

### Layout Switching
Next.js App Router supports layouts per route segment.
- Will create reusable layout components
- Routes can wrap content with different layouts
- Example: `/app/dashboard/layout.js` for dashboard-specific layout

---

## Expected File Structure After Stage 1

```
qr-code-app/
├── app/
│   ├── layout.js (or .tsx)          # Root layout
│   ├── page.js                      # Home page
│   └── globals.css → DELETE (replaced with SCSS)
├── components/
│   └── (empty for now, ready for Stage 2+)
├── layouts/
│   ├── MainLayout/
│   │   ├── MainLayout.js
│   │   └── MainLayout.module.scss
│   └── AuthLayout/
│       ├── AuthLayout.js
│       └── AuthLayout.module.scss
├── lib/
│   └── mongodb.js                   # MongoDB config (not connected)
├── styles/
│   ├── main.scss                    # Global styles entry
│   ├── _mixins.scss                 # SCSS mixins
│   ├── _variables.scss              # SCSS variables
│   └── _themes.scss                 # Theme definitions
├── .env.local                       # Local environment variables (gitignored)
├── .env.example                     # Template for environment variables
├── package.json
└── next.config.js (or .mjs)
```

---

## Questions for User (if needed)

1. **TypeScript or JavaScript?** - Will ask if not specified
2. **Use `src/` directory?** - Will ask if not specified

---

## Success Criteria

- [ ] Next.js app runs on `localhost:3000` without errors
- [ ] SCSS compiles and styles are applied
- [ ] Multiple layouts created and can be used
- [ ] NO Tailwind or Bootstrap in the project
- [ ] Environment variables configured
- [ ] README updated with instructions
- [ ] Code is clean and follows best practices

---

## What Will Be Committed

After successful completion:
- Next.js project structure
- SCSS architecture
- Layout components
- Configuration files
- Updated README

Commit message will describe all changes and confirm Stage 1 completion.

---

## Notes During Implementation

(Will update as I work...)

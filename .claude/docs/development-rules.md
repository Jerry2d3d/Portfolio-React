# Development Rules and Architecture Guidelines

## Table of Contents
1. [Component Architecture](#component-architecture)
2. [Styling Guidelines](#styling-guidelines)
3. [File Organization](#file-organization)
4. [TypeScript Standards](#typescript-standards)
5. [Documentation Rules](#documentation-rules)
6. [Security Best Practices](#security-best-practices)

---

## Component Architecture

### Core Principle: Component-First Development

**RULE #1: Everything should be components with minimal page-level content**

Pages (`src/app/**/page.tsx`) should ONLY contain:
- Page-specific metadata (titles, descriptions)
- Hero sections or introductory content unique to that page
- Component composition (importing and arranging components)
- Page-level state management (only when necessary)

**RULE #2: Component Structure**

Every component MUST:
1. Live in its own subfolder inside `src/components/`
2. Have a TypeScript file (`ComponentName.tsx`)
3. Have a dedicated SCSS module file (`ComponentName.module.scss`) in the same folder
4. Export a default function with the component name

**Example Structure:**
```
src/components/
├── Navigation/
│   ├── Navigation.tsx
│   └── Navigation.module.scss
├── Footer/
│   ├── Footer.tsx
│   └── Footer.module.scss
├── QRGenerator/
│   ├── QRGenerator.tsx
│   ├── QRGenerator.module.scss
│   └── CustomizeModal/
│       ├── CustomizeModal.tsx
│       └── CustomizeModal.module.scss
```

### When to Create a Component

Create a new component when:
- UI element appears in multiple places
- Section exceeds 50 lines of JSX
- Logic can be isolated and reused
- Testing would benefit from isolation
- Component has its own state management

**Anti-Pattern:**
```tsx
// ❌ BAD: All logic in page
export default function LoginPage() {
  const [formData, setFormData] = useState({...});
  const [error, setError] = useState('');
  // 200+ lines of form logic...
  return (
    <div>
      {/* 100+ lines of JSX */}
    </div>
  );
}
```

**Best Practice:**
```tsx
// ✅ GOOD: Extracted to LoginForm component
import LoginForm from '@/components/LoginForm/LoginForm';

export default function LoginPage() {
  return (
    <main>
      <h1>Welcome Back</h1>
      <LoginForm />
    </main>
  );
}
```

---

## Styling Guidelines

### SCSS Module Pattern

**RULE #3: Use SCSS Modules for ALL component styling**

Every component MUST have a corresponding `.module.scss` file:

```scss
// ComponentName.module.scss
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.container {
  max-width: $container-max-width;
  margin: 0 auto;
}

.button {
  padding: $spacing-md $spacing-lg;
  background: var(--primary-color);

  &:hover {
    background: var(--primary-hover);
  }
}
```

**RULE #4: DO NOT use BEM naming convention**

We use SCSS modules which provide automatic scoping. Simple class names are preferred:

```scss
// ❌ BAD: BEM naming (redundant with modules)
.card__header {}
.card__header--active {}
.card__body {}

// ✅ GOOD: Simple, scoped names
.card {}
.header {}
.active {}
.body {}
```

**RULE #5: ALWAYS use variables, mixins, and @use syntax**

Use modern SCSS `@use` syntax (not `@import`) and import project-wide variables:

```scss
// ✅ GOOD: Modern @use syntax
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.component {
  // ✅ Use variables
  padding: $spacing-lg;
  color: var(--text-primary);
  border-radius: $border-radius-md;

  // ✅ Use mixins
  @include flex-center;
  @include responsive-breakpoint('md') {
    padding: $spacing-xl;
  }
}

// ❌ BAD: Old @import syntax
@import '@/styles/variables';  // ❌ Use @use instead

// ❌ DO NOT hardcode values
.bad {
  padding: 24px;  // ❌ Should be $spacing-lg
  color: #333;    // ❌ Should be var(--text-primary)
}
```

**RULE #20: Comprehensive Styling Standards**

All styling MUST follow these guidelines:

**Framework and Methodology Restrictions:**
- ❌ **NO BEM naming conventions** (`block__element--modifier` patterns)
- ❌ **NO Tailwind CSS** or utility-first frameworks
- ❌ **NO Bootstrap** or component frameworks
- ❌ **NO CSS-in-JS libraries** (styled-components, emotion, etc.)
- ✅ **Manual SCSS only** - write all styles from scratch

**Required Patterns:**
- ✅ **SCSS Modules** with simple, semantic class names
- ✅ **Modern `@use` syntax** for importing partials and variables
- ✅ **Semantic class names** (e.g., `.sidebar-nav`, `.user-avatar`, `.card-header`)
- ✅ **Variables and mixins** for all repeated values
- ✅ **CSS custom properties** (`var(--*)`) for theme-able values

**Class Naming Examples:**
```scss
// ✅ GOOD: Semantic, descriptive names
.navigation-menu {}
.user-profile-card {}
.settings-panel {}
.submit-button {}
.error-message {}
.primary-header {}

// ❌ BAD: BEM patterns
.nav-menu__item--active {}
.user-card__header--large {}

// ❌ BAD: Utility-like names
.flex-center {}
.mt-4 {}
.text-blue-500 {}
```

**Import Pattern:**
```scss
// ✅ GOOD: @use with wildcard for variables
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

// ❌ BAD: Old @import syntax
@import '@/styles/variables';

// ❌ BAD: Named imports (unnecessary for variables)
@use '../../styles/variables' as vars;
```

### Responsive Design

**RULE #6: Mobile-first responsive design**

```scss
.component {
  // Base styles (mobile)
  padding: $spacing-md;

  // Tablet
  @media (min-width: $breakpoint-md) {
    padding: $spacing-lg;
  }

  // Desktop
  @media (min-width: $breakpoint-lg) {
    padding: $spacing-xl;
  }
}
```

---

## File Organization

### Component Folder Structure

```
src/
├── components/          # All reusable components
│   ├── Navigation/
│   ├── Footer/
│   ├── QRGenerator/
│   ├── LoginForm/
│   ├── RegisterForm/
│   └── shared/         # Shared/utility components
│       ├── Button/
│       ├── Input/
│       └── Modal/
├── layouts/            # Layout wrapper components
│   ├── MainLayout/
│   └── AuthLayout/
├── app/                # Next.js pages (minimal content)
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── dashboard/
│       └── page.tsx
├── styles/             # Global styles and variables
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── globals.scss
└── lib/                # Utilities and helpers
```

### Import Order

**RULE #7: Consistent import ordering**

```tsx
// 1. React and Next.js imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 2. External libraries
import { logger } from '@/lib/logger';

// 3. Internal components
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';

// 4. Layouts
import { MainLayout } from '@/layouts';

// 5. Types
import type { User } from '@/types';

// 6. Styles (always last)
import styles from './Component.module.scss';
```

---

## TypeScript Standards

**RULE #8: Explicit typing for component props**

```tsx
// ✅ GOOD: Clear interface for props
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant,
  onClick,
  disabled = false,
  children
}: ButtonProps) {
  // ...
}

// ❌ BAD: No types
export default function Button({ variant, onClick, disabled, children }) {
  // ...
}
```

**RULE #9: Type event handlers**

```tsx
// ✅ GOOD
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  // ...
};

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  // ...
};

// ❌ BAD
const handleSubmit = (e) => { /* ... */ };
```

---

## Documentation Rules

### Documentation File Placement

**RULE #10: All documentation in `.claude/docs/` directory**

All project documentation is organized under `.claude/docs/` with the following structure:

```
.claude/
├── docs/
│   ├── development-rules.md      # This file - Core architecture rules
│   ├── critical/                 # Critical fixes and issues
│   │   ├── CRITICAL_FIXES_REQUIRED.md
│   │   ├── CRITICAL_ISSUES_ANALYSIS.md
│   │   └── ISSUES_QUICK_REFERENCE.txt
│   ├── testing/                  # Testing documentation
│   │   └── ADMIN_PERMISSION_TESTING.md
│   ├── reports/                  # Stage reports and summaries
│   │   └── STAGE6_REPORT.md
│   ├── workflow/                 # Development workflows
│   │   ├── DEVELOPMENT-WORKFLOW.md
│   │   └── NEXT_SESSION.md
│   └── security/                 # Security reviews and audits
│       ├── SECURITY_REVIEW_README.md
│       └── SECURITY_ASSESSMENT_SUMMARY.txt
└── agents/
    ├── gemini-proxy-developer.md
    ├── react-nextjs-code-reviewer.md
    ├── react-nextjs-tester.md
    └── react-nextjs-troubleshooter.md
```

**Documentation Categories:**

1. **critical/** - Critical bug reports, security issues, and urgent fixes
2. **testing/** - Test documentation, testing procedures, and test results
3. **reports/** - Development stage reports and progress summaries
4. **workflow/** - Development workflows, session notes, and procedures
5. **security/** - Security reviews, audits, and vulnerability reports

**Note:** `README.md` remains in the project root for project setup instructions

### Markdown File Standards

**RULE #11: Markdown documentation structure**

Every `.md` file MUST include:

1. **Title (H1)**
```markdown
# Document Title
```

2. **Table of Contents** (for files > 100 lines)
```markdown
## Table of Contents
- [Section 1](#section-1)
- [Section 2](#section-2)
```

3. **Clear section headers (H2, H3)**
```markdown
## Main Section

### Subsection

#### Detail
```

4. **Code examples with syntax highlighting**
````markdown
```tsx
// Example code here
```
````

5. **Last updated date**
```markdown
---
Last Updated: 2025-12-29
```

### Component Documentation

**RULE #12: Document components with JSDoc**

```tsx
/**
 * LoginForm Component
 *
 * Handles user authentication with email and password.
 * Displays validation errors and redirects to dashboard on success.
 *
 * @example
 * ```tsx
 * <LoginForm />
 * ```
 */
export default function LoginForm() {
  // ...
}
```

---

## Security Best Practices

**RULE #13: XSS Prevention**

```tsx
// ✅ GOOD: Sanitize user input
import DOMPurify from 'isomorphic-dompurify';

const sanitizedText = DOMPurify.sanitize(userInput);
```

**RULE #14: No sensitive data in client components**

```tsx
// ❌ BAD: API keys in client component
'use client';
const API_KEY = 'secret-key';

// ✅ GOOD: Use environment variables on server
// In API route:
const API_KEY = process.env.API_KEY;
```

**RULE #15: Validate all inputs**

```tsx
// ✅ GOOD: Validate before processing
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

if (!isValidEmail(formData.email)) {
  setError('Invalid email format');
  return;
}
```

---

## Agent Integration Rules

**RULE #16: All AI agents MUST reference this file**

Every agent prompt should include:

```markdown
Before writing any code, you MUST:
1. Read `.claude/docs/development-rules.md`
2. Follow the component architecture guidelines
3. Use SCSS modules with variables and mixins
4. Avoid BEM naming conventions
5. Extract UI logic into components (not pages)
```

**RULE #17: Agent-specific documentation**

Each agent should have its own documentation:

```
.claude/agents/
├── code-reviewer/
│   └── README.md       # Code review checklist
├── tester/
│   └── README.md       # Testing strategy
└── troubleshooter/
    └── README.md       # Debugging procedures
```

**RULE #18: No Inline Styling**

All styling MUST be defined in SCSS module files. Inline styles are strictly prohibited.

```tsx
// ❌ BAD: Inline styles
<p style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
  Content here
</p>

<div style={{ display: 'flex', justifyContent: 'center' }}>
  Content
</div>

// ✅ GOOD: Styles in SCSS module
<p className={styles.subtitle}>
  Content here
</p>

<div className={styles.container}>
  Content
</div>
```

**ComponentName.module.scss:**
```scss
@import '@/styles/variables';

.subtitle {
  margin-top: $spacing-xs;
  margin-bottom: $spacing-lg;
}

.container {
  display: flex;
  justify-content: center;
}
```

**Rationale:**
- Maintains consistent styling approach
- Enables proper CSS module scoping
- Facilitates theme changes and design system updates
- Improves code maintainability and readability
- Prevents specificity issues

**RULE #19: Maximum 5 Parallel Agents**

When spawning agents for parallel execution, the maximum limit is 5 concurrent agents.

**Behavior:**
- If user requests ≤5 agents: Proceed without asking
- If user requests >5 agents: Inform user of the 5-agent limit and proceed with 5

**Examples:**

```bash
# User requests 3 agents for inline style removal
✅ Spawn 3 agents immediately without asking

# User requests 7 agents for various tasks
✅ Inform: "I have a maximum of 5 agents. I'll proceed with 5 agents."
✅ Spawn 5 agents with prioritized tasks
```

**Rationale:**
- Prevents resource exhaustion
- Maintains manageable concurrency
- Ensures reliable agent execution
- Optimizes token usage and performance

**Best Practices:**
1. Prioritize high-impact tasks when at limit
2. Group related work into single agent tasks
3. Run agents sequentially if parallelization isn't critical
4. Use clear task descriptions for each agent

---

## Quick Reference Checklist

When creating or modifying code, verify:

**Component Architecture:**
- [ ] Component is in `src/components/[ComponentName]/` folder
- [ ] Component has `.tsx` and `.module.scss` files
- [ ] TypeScript types defined for props
- [ ] Page file only contains composition, not logic
- [ ] Component is self-contained and reusable
- [ ] Imports follow consistent ordering

**Styling:**
- [ ] SCSS uses `@use` syntax (not `@import`)
- [ ] NO BEM naming conventions (`block__element--modifier`)
- [ ] NO Tailwind, Bootstrap, or CSS frameworks
- [ ] NO CSS-in-JS libraries
- [ ] Semantic class names (`.user-avatar`, `.card-header`)
- [ ] NO inline styles (all styles in SCSS modules)
- [ ] Variables used (`$spacing-md`, `var(--primary-color)`)
- [ ] No hardcoded values in SCSS

**General:**
- [ ] Security best practices followed
- [ ] Maximum 5 parallel agents when spawning multiple agents

---

## Examples

### Creating a New Component

```bash
# 1. Create component folder
mkdir -p src/components/UserCard

# 2. Create TypeScript file
touch src/components/UserCard/UserCard.tsx

# 3. Create SCSS module
touch src/components/UserCard/UserCard.module.scss
```

**UserCard.tsx:**
```tsx
'use client';

import styles from './UserCard.module.scss';

interface UserCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

/**
 * UserCard Component
 *
 * Displays user information in a card format
 */
export default function UserCard({ name, email, avatarUrl }: UserCardProps) {
  return (
    <div className={styles.card}>
      {avatarUrl && (
        <img src={avatarUrl} alt={name} className={styles.avatar} />
      )}
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.email}>{email}</p>
    </div>
  );
}
```

**UserCard.module.scss:**
```scss
@import '@/styles/variables';

.card {
  padding: $spacing-lg;
  background: var(--bg-secondary);
  border-radius: $border-radius-md;
  box-shadow: var(--shadow-md);
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: $spacing-md;
}

.name {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: var(--text-primary);
  margin: 0 0 $spacing-xs;
}

.email {
  font-size: $font-size-sm;
  color: var(--text-secondary);
  margin: 0;
}

@media (max-width: $breakpoint-sm) {
  .card {
    padding: $spacing-md;
  }
}
```

---

**Last Updated:** 2025-12-29
**Version:** 1.0.0
**Maintainer:** Development Team

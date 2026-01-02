# Core Development Rules and Architecture Guidelines

**Universal standards that apply to all frameworks and technologies**

## Table of Contents
1. [Component Architecture (Universal)](#component-architecture-universal)
2. [Styling Guidelines (Universal)](#styling-guidelines-universal)
3. [File Organization](#file-organization)
4. [Documentation Rules](#documentation-rules)
5. [Security Best Practices](#security-best-practices)
6. [Agent Integration Rules](#agent-integration-rules)

---

## Component Architecture (Universal)

### Core Principle: Component-First Development

**RULE #1: Everything should be components with minimal page-level content**

Pages should ONLY contain:
- Page-specific metadata (titles, descriptions)
- Hero sections or introductory content unique to that page
- Component composition (importing and arranging components)
- Page-level state management (only when necessary)

**RULE #2: Component Structure**

Every component MUST:
1. Live in its own subfolder inside the components directory
2. Have proper separation of logic and styling
3. Be self-contained and reusable
4. Have clear, descriptive names

### When to Create a Component

Create a new component when:
- UI element appears in multiple places
- Section exceeds 50 lines of markup
- Logic can be isolated and reused
- Testing would benefit from isolation
- Component has its own state management

---

## Styling Guidelines (Universal)

### SCSS Module Pattern

**RULE #3: Use SCSS Modules for ALL component styling**

Every component MUST have a corresponding SCSS module file with automatic scoping.

**RULE #4: DO NOT use BEM naming convention**

We use SCSS modules which provide automatic scoping. Simple class names are preferred.

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

**Rationale:**
- Maintains consistent styling approach
- Enables proper CSS module scoping
- Facilitates theme changes and design system updates
- Improves code maintainability and readability
- Prevents specificity issues

---

## File Organization

### Project Structure

```
project-root/
├── src/
│   ├── components/          # All reusable components
│   │   ├── Navigation/
│   │   ├── Footer/
│   │   └── shared/         # Shared/utility components
│   │       ├── Button/
│   │       ├── Input/
│   │       └── Modal/
│   ├── layouts/            # Layout wrapper components
│   │   ├── MainLayout/
│   │   └── AuthLayout/
│   ├── pages/              # Framework pages (minimal content)
│   ├── styles/             # Global styles and variables
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── globals.scss
│   └── lib/                # Utilities and helpers
└── .claude/                # AI documentation and agents
    ├── config.json         # Framework configuration
    ├── personas/           # Framework-specific personas
    ├── agents/             # Generic agents
    └── docs/               # Documentation
        ├── core-rules.md   # This file
        └── frameworks/     # Framework-specific rules
```

### Import Order

**RULE #7: Consistent import ordering**

1. Framework core imports (React, Angular core, Vue, etc.)
2. External libraries
3. Internal components
4. Layouts
5. Types/interfaces
6. Styles (always last)

---

## Documentation Rules

### Documentation File Placement

**RULE #10: All documentation in `.claude/docs/` directory**

All project documentation is organized under `.claude/docs/` with the following structure:

```
.claude/
├── docs/
│   ├── core-rules.md           # Universal architecture rules
│   ├── frameworks/             # Framework-specific rules
│   │   ├── react-nextjs.md
│   │   └── angular.md
│   ├── critical/               # Critical fixes and issues
│   ├── testing/                # Testing documentation
│   ├── reports/                # Stage reports and summaries
│   ├── workflow/               # Development workflows
│   └── security/               # Security reviews and audits
└── agents/                     # Agent configurations
```

**Documentation Categories:**

1. **critical/** - Critical bug reports, security issues, and urgent fixes
2. **testing/** - Test documentation, testing procedures, and test results
3. **reports/** - Development stage reports and progress summaries
4. **workflow/** - Development workflows, session notes, and procedures
5. **security/** - Security reviews, audits, and vulnerability reports
6. **frameworks/** - Framework-specific development guidelines

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
```language
// Example code here
```
````

5. **Last updated date**
```markdown
---
Last Updated: 2025-12-29
```

---

## Security Best Practices

**RULE #13: XSS Prevention**

Always sanitize user input before rendering or storing.

**RULE #14: No sensitive data in client code**

Never expose API keys, secrets, or sensitive configuration in client-side code. Use environment variables and server-side processing.

**RULE #15: Validate all inputs**

Always validate and sanitize user inputs on both client and server sides:

```javascript
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

**RULE #16: All AI agents MUST reference framework-appropriate rules**

Every agent should:
1. Read `.claude/config.json` to determine the current framework
2. Load the appropriate persona from `.claude/personas/`
3. Follow core-rules.md for universal standards
4. Follow framework-specific rules from `.claude/docs/frameworks/`

**RULE #17: Agent-specific documentation**

Each agent has its own configuration and responsibilities defined in `.claude/agents/`.

**RULE #19: Maximum 5 Parallel Agents**

When spawning agents for parallel execution, the maximum limit is 5 concurrent agents.

**Behavior:**
- If user requests ≤5 agents: Proceed without asking
- If user requests >5 agents: Inform user of the 5-agent limit and proceed with 5

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
- [ ] Component is properly organized in components directory
- [ ] Component has proper separation of concerns
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
- [ ] Framework-specific rules followed (see `.claude/docs/frameworks/`)

---

## Framework Configuration

This project uses a multi-framework template system. The current framework is configured in `.claude/config.json`.

To see framework-specific guidelines, refer to:
- **React/Next.js**: `.claude/docs/frameworks/react-nextjs.md`
- **Angular**: `.claude/docs/frameworks/angular.md`

Agent personas are loaded from `.claude/personas/` based on the configured framework.

---

**Last Updated:** 2025-12-29
**Version:** 1.0.0
**Maintainer:** Development Team

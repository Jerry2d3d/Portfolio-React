# Figma to Component Workflow

## Overview

This workflow uses MCP (Model Context Protocol) integration with Figma to automatically convert Figma designs into React/Next.js components with proper styling and structure.

---

## When to Use This Workflow

**When the user requests a new component, ALWAYS ask them to choose:**

```
"I can help you create this component!

Do you want to make it from:

1. Figma and User Story
   (I'll fetch your Figma design and create a pixel-perfect component)

2. Just tell me what you want
   (Describe the component and I'll build it from scratch)

Which approach would you prefer?"
```

### If User Chooses Option 1 (Figma and User Story):

→ Follow the **Figma-to-Component workflow** (this document)

**Then ask:**
```
"Great! Please provide:
1. Figma file URL or ID
2. Component/frame name in Figma
3. User story (optional but recommended)
```

### If User Chooses Option 2 (Just tell me what you want):

→ Follow the **standard component creation workflow** (traditional approach)

**Then ask:**
```
"Perfect! Please describe:
1. What the component should do
2. What it should look like
3. Any specific features or interactions
4. Where it will be used
```

---

## Prerequisites

### 1. MCP Server Configuration

Ensure `.mcp.json` is configured with Figma access:

```json
{
  "mcpServers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp",
      "headers": {
        "Authorization": "Bearer ${FIGMA_ACCESS_TOKEN}"
      }
    }
  }
}
```

### 2. Environment Variables

Add to `.env.local`:

```bash
FIGMA_ACCESS_TOKEN=your-figma-personal-access-token
```

### 3. Figma Access Token

Get token from: https://www.figma.com/developers/api#access-tokens

---

## Workflow Steps

### Step 1: Gather Information

**Ask the user:**
```
I can help create this component from a Figma design!

Please provide:
1. Figma file URL or ID
2. Component/frame name in Figma
3. User story or requirements (optional but recommended)
```

**Example user response:**
```
Figma URL: https://www.figma.com/file/ABC123/Comic-Reader
Frame: "Comic Reader Panel"
User Story: As a user, I want to navigate through comic pages with
smooth animations and have zoom controls for detailed viewing.
```

### Step 2: Create Feature Branch

```bash
git checkout -b feature/component-name
```

**Example:**
```bash
git checkout -b feature/comic-reader-panel
```

### Step 3: Fetch Figma Design

Use MCP to access the Figma design:

```
"Fetch the Figma design from [URL] and analyze the [Frame Name] component"
```

**What to analyze:**
- Layout structure (flexbox, grid, positioning)
- Color palette (extract hex values)
- Typography (font families, sizes, weights)
- Spacing (margins, padding, gaps)
- Interactive elements (buttons, inputs, controls)
- States (hover, active, disabled, loading)
- Responsive breakpoints (if specified)

### Step 4: Create Component Structure

**Directory structure:**
```
src/components/ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.module.scss  # Scoped styles
└── index.ts                   # Barrel export
```

**Example:**
```
src/components/ComicReaderPanel/
├── ComicReaderPanel.tsx
├── ComicReaderPanel.module.scss
└── index.ts
```

### Step 5: Extract Design Tokens

From the Figma design, extract:

**Colors:**
```scss
// _variables.scss additions
$comic-panel-bg: #1a1a1a;
$comic-panel-border: #333333;
$control-primary: #00d4ff;
$control-hover: #00a8cc;
```

**Typography:**
```scss
$font-comic-title: 'Comic Sans MS', cursive;
$font-size-panel-title: 24px;
$font-weight-bold: 700;
```

**Spacing:**
```scss
$panel-padding: 24px;
$control-gap: 16px;
$border-radius-panel: 12px;
```

### Step 6: Implement Component

#### TypeScript Component

```tsx
'use client';

/**
 * ComicReaderPanel Component
 *
 * Generated from Figma design: [Figma URL]
 * User Story: [User story text]
 *
 * Features:
 * - Page navigation with smooth animations
 * - Zoom controls for detailed viewing
 * - Touch/swipe support for mobile
 */

import { useState } from 'react';
import styles from './ComicReaderPanel.module.scss';

interface ComicReaderPanelProps {
  pages: string[];
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export default function ComicReaderPanel({
  pages,
  initialPage = 0,
  onPageChange
}: ComicReaderPanelProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(1);

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      onPageChange?.(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      onPageChange?.(prevPage);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.imageContainer}>
        <img
          src={pages[currentPage]}
          alt={`Page ${currentPage + 1}`}
          style={{ transform: `scale(${zoom})` }}
          className={styles.pageImage}
        />
      </div>

      <div className={styles.controls}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={styles.navButton}
        >
          Previous
        </button>

        <span className={styles.pageIndicator}>
          {currentPage + 1} / {pages.length}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === pages.length - 1}
          className={styles.navButton}
        >
          Next
        </button>

        <div className={styles.zoomControls}>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
            -
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.25))}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### SCSS Styling

Match Figma design exactly:

```scss
@import '@/styles/variables';
@import '@/styles/mixins';

.panel {
  background-color: $comic-panel-bg;
  border: 2px solid $comic-panel-border;
  border-radius: $border-radius-panel;
  padding: $panel-padding;
  display: flex;
  flex-direction: column;
  gap: $control-gap;
  height: 100%;
}

.imageContainer {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.pageImage {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
}

.navButton {
  @include button-primary;
  background-color: $control-primary;

  &:hover:not(:disabled) {
    background-color: $control-hover;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.pageIndicator {
  font-size: $font-size-md;
  color: $color-text-secondary;
  min-width: 80px;
  text-align: center;
}

.zoomControls {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  button {
    @include button-secondary;
    min-width: 32px;
  }

  span {
    min-width: 50px;
    text-align: center;
  }
}
```

### Step 7: Add Design Metadata

Add comment at top of component file:

```tsx
/**
 * Component Name
 *
 * Source: Figma Design
 * URL: [Figma file URL]
 * Frame: [Frame/component name]
 * Created: [Date]
 *
 * User Story:
 * [Full user story text]
 *
 * Design Tokens:
 * - Primary Color: #00d4ff
 * - Background: #1a1a1a
 * - Font: Comic Sans MS
 * - Spacing: 24px padding, 16px gaps
 *
 * States:
 * - Default
 * - Hover
 * - Disabled
 * - Loading (if applicable)
 */
```

### Step 8: Test Component

Create test page in `src/app/test-components/`:

```tsx
// src/app/test-components/comic-reader-panel/page.tsx
import ComicReaderPanel from '@/components/ComicReaderPanel';

const mockPages = [
  '/test-images/page1.jpg',
  '/test-images/page2.jpg',
  '/test-images/page3.jpg',
];

export default function TestComicReaderPanel() {
  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <h1>Comic Reader Panel Test</h1>
      <ComicReaderPanel
        pages={mockPages}
        onPageChange={(page) => console.log('Page changed to:', page)}
      />
    </div>
  );
}
```

### Step 9: Review Against Figma

**Checklist:**
- [ ] Layout matches Figma exactly
- [ ] Colors match Figma palette
- [ ] Typography matches (font, size, weight)
- [ ] Spacing matches (padding, margins, gaps)
- [ ] Interactive states work (hover, active, disabled)
- [ ] Responsive breakpoints (if specified)
- [ ] Animations match design intent
- [ ] Component is accessible (ARIA labels, keyboard nav)

### Step 10: Commit and Document

```bash
git add .
git commit -m "Add ComicReaderPanel component from Figma design

Implemented from Figma design: [URL]
Frame: [Frame name]

Features:
- Page navigation with prev/next controls
- Zoom controls (50% to 300%)
- Page indicator
- Responsive layout
- Smooth animations

User Story:
[User story text]

Design tokens extracted and added to _variables.scss

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Best Practices

### 1. Always Extract Design Tokens

Don't hardcode values. Add to `_variables.scss`:

```scss
// Component-specific tokens
$comic-reader-bg: #1a1a1a;
$comic-reader-control: #00d4ff;
```

### 2. Use Semantic Naming

Match Figma layer names when possible:

```
Figma: "Primary CTA Button" → className: styles.primaryCtaButton
```

### 3. Maintain Design System

If Figma uses design system/library:
- Extract shared tokens to global variables
- Create reusable mixins for common patterns
- Document design system mappings

### 4. Handle Responsive Design

If Figma has multiple frames for breakpoints:

```scss
.component {
  // Mobile (Figma: Mobile Frame)
  padding: 16px;

  @media (min-width: $breakpoint-tablet) {
    // Tablet (Figma: Tablet Frame)
    padding: 24px;
  }

  @media (min-width: $breakpoint-desktop) {
    // Desktop (Figma: Desktop Frame)
    padding: 32px;
  }
}
```

### 5. Document Deviations

If you need to deviate from Figma design:

```tsx
/**
 * NOTE: Changed button color from #00d4ff to $color-primary
 * to maintain consistency with existing design system.
 * Original Figma color preserved in comment for reference.
 */
```

---

## Troubleshooting

### MCP Server Not Found

```bash
# Verify MCP server is installed
claude mcp list

# Add Figma MCP if missing
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

### Can't Access Figma File

- Verify `FIGMA_ACCESS_TOKEN` is set in `.env.local`
- Check token has read permissions
- Verify file is accessible (not private/archived)

### Design Doesn't Match After Implementation

- Use browser DevTools to inspect Figma-exported CSS
- Check for auto-layout vs manual positioning
- Verify font fallbacks are correct

---

## Example: Complete Workflow

**User Request:**
> "I need a comic page navigation component"

**Your Response:**
> "I can help create that! Do you have a Figma design for this component? Also, do you have a user story describing how users should interact with it?"

**User Provides:**
```
Figma: https://www.figma.com/file/XYZ/Comics
Frame: "Page Navigator"
Story: As a reader, I want to quickly jump to any page in the comic
and see thumbnail previews when I hover over page numbers.
```

**You Execute:**
1. Create branch: `git checkout -b feature/page-navigator`
2. Fetch Figma design via MCP
3. Extract design tokens (colors, spacing, typography)
4. Create component structure
5. Implement component matching Figma exactly
6. Add hover previews (from user story)
7. Test component
8. Commit with full documentation
9. Create PR for review

---

## Integration with .aiignore

Since this is a **project-specific workflow for gremlin-comics**, add Figma-specific rules to `.aiignore`:

```
# Figma integration (project-specific)
.claude/docs/project-specific/figma-integration.md
.mcp.json
```

This keeps Figma configuration local while allowing general component creation improvements to sync to boilerplate.

---

**This workflow ensures consistent, high-quality component implementation from Figma designs with full traceability and documentation.**

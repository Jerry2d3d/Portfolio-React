# Figma Integration - Portfolio (Project-Specific)

> **NOTE:** This configuration is specific to the Portfolio project and should NOT be synced to the boilerplate.

---

## Overview

This portfolio uses Figma MCP integration to create components directly from Figma designs, ensuring pixel-perfect implementation of the portfolio design system.

---

## Project-Specific Configuration

### Figma Project Details

**Primary Figma File:**
- Project: Portfolio Design System
- File ID: `[Your Portfolio Figma File ID]`
- URL: `[Your Portfolio Figma File URL]`

**Design System Components:**
- Hero Section
- Project Cards
- Skills Section
- Contact Form
- Navigation
- Footer

### Access Token

Stored in `.env.local` (NEVER commit this):
```bash
FIGMA_ACCESS_TOKEN=your-figma-personal-access-token
```

---

## Portfolio-Specific Design Tokens

### Brand Colors (from Figma)

```scss
// Portfolio Brand Colors (extracted from Figma)
$portfolio-primary: #your-primary-color;
$portfolio-accent: #your-accent-color;
$portfolio-bg-dark: #your-dark-bg;
$portfolio-bg-light: #your-light-bg;
$portfolio-text-primary: #your-text-color;
$portfolio-text-secondary: #your-secondary-text;
```

### Typography (from Figma)

```scss
// Portfolio fonts
$font-heading: 'Your Heading Font', sans-serif;
$font-body: 'Your Body Font', sans-serif;
$font-code: 'Your Code Font', monospace;
```

### Component Naming

Match Figma frame names:

| Figma Frame | Component Path | Component Name |
|-------------|----------------|----------------|
| "Hero Section" | `src/components/HeroSection/` | `HeroSection` |
| "Project Card" | `src/components/ProjectCard/` | `ProjectCard` |
| "Skills Grid" | `src/components/SkillsGrid/` | `SkillsGrid` |

---

**This integration is unique to the Portfolio project and ensures pixel-perfect implementation of your personal brand.**

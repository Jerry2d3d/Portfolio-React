# Component Creation Workflow - ALWAYS FOLLOW THIS

## RULE: When User Requests a New Component

**ALWAYS present these two options to the user:**

```
"I can help you create this component!

Do you want to make it from:

1. Figma and User Story
   (I'll fetch your Figma design and create a pixel-perfect component)

2. Just tell me what you want
   (Describe the component and I'll build it from scratch)

Which approach would you prefer?"
```

**DO NOT skip this step. DO NOT assume which approach to use.**

---

## Option 1: Figma and User Story

### When User Chooses This:

**You Say:**
```
"Great! Please provide:
1. Figma file URL or ID
2. Component/frame name in Figma
3. User story describing the functionality (optional but recommended)
```

### Then Follow:

→ See **`workflows/figma-to-component.md`** for complete workflow

**Quick Summary:**
1. Create feature branch (`git checkout -b feature/component-name`)
2. Fetch Figma design via MCP
3. Extract design tokens (colors, spacing, typography)
4. Generate component matching Figma exactly
5. Create SCSS styles from Figma
6. Add documentation with Figma URL
7. Create test page
8. Commit with full traceability

**Output:**
- `src/components/ComponentName/ComponentName.tsx`
- `src/components/ComponentName/ComponentName.module.scss`
- `src/components/ComponentName/index.ts`
- `src/app/test-components/component-name/page.tsx`

---

## Option 2: Just Tell Me What You Want

### When User Chooses This:

**You Say:**
```
"Perfect! Please describe:
1. What the component should do (functionality)
2. What it should look like (visual design)
3. Any specific features or interactions
4. Where it will be used (which pages/contexts)
```

### Then Follow:

**Standard Component Creation Workflow:**

1. **Gather Requirements:**
   - Understand functionality
   - Understand visual requirements
   - Clarify edge cases
   - Identify dependencies

2. **Create Feature Branch:**
   ```bash
   git checkout -b feature/component-name
   ```

3. **Create Component Structure:**
   ```
   src/components/ComponentName/
   ├── ComponentName.tsx
   ├── ComponentName.module.scss
   └── index.ts
   ```

4. **Implement Component:**
   - Write TypeScript component with proper types
   - Create SCSS styles using design system variables
   - Add accessibility features (ARIA labels, keyboard nav)
   - Handle all states (loading, error, empty, success)

5. **Create Test Page:**
   ```
   src/app/test-components/component-name/page.tsx
   ```

6. **Document:**
   - Add JSDoc comments
   - Document props with TypeScript types
   - Add usage examples

7. **Commit:**
   ```bash
   git add .
   git commit -m "Add ComponentName component

   Features:
   - [List features]

   Usage:
   - [Describe usage]
   ```

---

## Comparison

| Aspect | Figma + User Story | Just Tell Me |
|--------|-------------------|--------------|
| **Design Source** | Figma design file | User description |
| **Accuracy** | Pixel-perfect to Figma | Based on requirements |
| **Speed** | Faster (design ready) | May need iteration |
| **Design Tokens** | Extracted from Figma | Created from scratch |
| **Documentation** | Includes Figma URL | Based on description |
| **Best For** | Designed components | Quick prototypes, simple components |

---

## Examples

### Example 1: User Has Figma Design

**User:**
> "I need a comic page navigation component"

**You:**
> "I can help you create this component!
>
> Do you want to make it from:
>
> 1. Figma and User Story
>    (I'll fetch your Figma design and create a pixel-perfect component)
>
> 2. Just tell me what you want
>    (Describe the component and I'll build it from scratch)
>
> Which approach would you prefer?"

**User:**
> "Option 1 - I have a Figma design"

**You:**
> "Great! Please provide:
> 1. Figma file URL or ID
> 2. Component/frame name in Figma
> 3. User story describing the functionality (optional but recommended)"

**User:**
> "URL: https://www.figma.com/file/ABC123/Comics
> Frame: Page Navigator
> Story: As a reader, I want to quickly jump to any page"

**You:**
→ Follow Figma workflow, fetch design, create component

---

### Example 2: User Doesn't Have Figma Design

**User:**
> "I need a comic zoom control"

**You:**
> "I can help you create this component!
>
> Do you want to make it from:
>
> 1. Figma and User Story
>    (I'll fetch your Figma design and create a pixel-perfect component)
>
> 2. Just tell me what you want
>    (Describe the component and I'll build it from scratch)
>
> Which approach would you prefer?"

**User:**
> "Option 2 - I don't have a design yet"

**You:**
> "Perfect! Please describe:
> 1. What the component should do (functionality)
> 2. What it should look like (visual design)
> 3. Any specific features or interactions
> 4. Where it will be used (which pages/contexts)"

**User:**
> "A zoom control with + and - buttons, shows current zoom percentage,
> positioned in the bottom-right corner of the comic reader"

**You:**
→ Create component from description, following design system patterns

---

## Key Points

### ✅ ALWAYS DO:
- Present both options to the user
- Let the user choose their preferred approach
- Follow the appropriate workflow completely
- Create feature branch before starting
- Document the component properly
- Create test page for verification

### ❌ NEVER DO:
- Skip the choice prompt
- Assume which approach to use
- Mix both approaches
- Start without gathering requirements
- Commit directly to main without branch

---

## Integration with .aiignore

**Note:** The Figma integration configuration (`.mcp.json`, Figma-specific rules) is in `.aiignore` for Gremlin Comics because:
- Each project may have different Figma projects
- Figma tokens are project-specific
- Design systems vary by project

**What CAN sync to boilerplate:**
- This component creation workflow document
- General best practices
- Workflow improvements

**What stays LOCAL:**
- `.mcp.json` (Figma configuration)
- `project-specific/figma-integration.md` (Project-specific rules)
- Figma access tokens

---

## Summary

**This workflow gives users flexibility while maintaining quality:**

- **Option 1 (Figma):** Design-first, pixel-perfect, traceability
- **Option 2 (Description):** Fast, flexible, iterative

**Both approaches result in high-quality, well-documented components that follow best practices.**

---

**REMEMBER: ALWAYS ask the user to choose. Never assume.**

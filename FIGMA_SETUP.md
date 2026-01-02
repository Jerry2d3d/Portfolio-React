# Figma MCP Integration Setup Guide

## Overview

This guide will help you set up Figma MCP (Model Context Protocol) integration for Gremlin Comics, enabling AI-powered component generation from Figma designs.

---

## Prerequisites

- Figma account with access to your design files
- Claude Code with MCP support
- Gremlin Comics project cloned locally

---

## Step 1: Get Figma Personal Access Token

### 1.1 Navigate to Figma Settings

1. Open [Figma](https://www.figma.com/)
2. Click your profile picture (top-right)
3. Select **Settings**

### 1.2 Generate Personal Access Token

1. Scroll to **Personal Access Tokens** section
2. Click **Generate new token**
3. Name it: `Gremlin Comics - Claude Code MCP`
4. Set scope: **Read-only** (File content access)
5. Click **Generate token**
6. **IMPORTANT:** Copy the token immediately (you won't see it again)

### 1.3 Store Token Securely

```bash
# Add to .env.local (NEVER commit this file)
echo "FIGMA_ACCESS_TOKEN=your-token-here" >> .env.local
```

---

## Step 2: Install Figma MCP Server

### 2.1 Using Claude Code CLI

```bash
# Add Figma MCP server
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

### 2.2 Verify Installation

```bash
# List all MCP servers
claude mcp list

# Should show:
# figma (http) - https://mcp.figma.com/mcp
```

---

## Step 3: Configure Project

### 3.1 MCP Configuration File

The `.mcp.json` is already configured in this project:

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

### 3.2 Environment Variables

Copy and configure your environment:

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local and add:
# FIGMA_ACCESS_TOKEN=your-actual-token-here
```

---

## Step 4: Test MCP Connection

### 4.1 Start Claude Code

```bash
# Open Claude Code in the project directory
claude .
```

### 4.2 Test Figma Access

In Claude Code conversation:

```
"Can you check if the Figma MCP server is connected and working?"
```

Expected response:
```
✓ Figma MCP server is connected
✓ Authentication successful
✓ Ready to fetch Figma designs
```

---

## Step 5: Prepare Your Figma Files

### 5.1 Organize Your Designs

Create frames for each component:

```
Figma File: "Gremlin Comics - Components"
├── Comic Reader Panel
├── Page Navigator
├── Library Browser
├── Zoom Controls
└── Animation Controls
```

### 5.2 Add Design Tokens

Use Figma styles for consistency:

**Colors:**
- Create color styles: `Brand/Primary`, `Brand/Secondary`, `BG/Dark`, etc.

**Typography:**
- Create text styles: `Font/Comic Title`, `Font/Comic Body`, `Font/UI`

**Effects:**
- Create effect styles for shadows, glows

### 5.3 Document User Stories

Add comments to Figma frames with user stories:

```
Frame: "Comic Reader Panel"
Comment:
"User Story: As a reader, I want to navigate through comic pages
with smooth animations and zoom controls for detailed viewing."
```

---

## Step 6: Create Your First Component from Figma

### 6.1 Get Figma File URL

1. Open your Figma file
2. Copy URL from browser (e.g., `https://www.figma.com/file/ABC123/Gremlin-Comics`)

### 6.2 Request Component in Claude Code

```
"I need to create a component from a Figma design.

Figma URL: https://www.figma.com/file/ABC123/Gremlin-Comics
Frame: Comic Reader Panel
User Story: As a reader, I want to navigate through pages with
smooth animations."
```

### 6.3 Claude Code Will:

1. Create new feature branch
2. Fetch Figma design via MCP
3. Extract design tokens (colors, spacing, typography)
4. Generate React component with TypeScript
5. Create SCSS styles matching Figma exactly
6. Add documentation with Figma reference
7. Create test page for the component

---

## Workflow Summary

### When You Need a New Component:

**1. Design in Figma:**
- Create frame with your design
- Add user story in comments
- Use design system tokens

**2. Request in Claude Code:**
```
"I need [component name] from Figma.

Figma URL: [your-file-url]
Frame: [frame-name]
User Story: [describe functionality]"
```

**3. Claude Code Generates:**
- `src/components/ComponentName/ComponentName.tsx`
- `src/components/ComponentName/ComponentName.module.scss`
- `src/components/ComponentName/index.ts`
- Test page at `src/app/test-components/component-name/page.tsx`

**4. Review & Test:**
- Test component in browser
- Compare with Figma design
- Verify all states work (hover, active, disabled)

**5. Commit:**
```bash
git add .
git commit -m "Add ComponentName from Figma design"
```

---

## Troubleshooting

### Error: "MCP Server Not Found"

```bash
# Re-add Figma MCP
claude mcp remove figma
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

### Error: "Authentication Failed"

1. Check `.env.local` has `FIGMA_ACCESS_TOKEN`
2. Verify token is valid (not expired)
3. Regenerate token if needed

### Error: "Can't Access Figma File"

1. Ensure file is not private/archived
2. Token needs access to the file
3. Try accessing file in Figma web first

### Components Don't Match Design

1. Check browser DevTools against Figma
2. Verify design tokens are extracted correctly
3. Check for Figma Auto-Layout vs manual positioning
4. Ensure responsive breakpoints are implemented

---

## Best Practices

### ✅ DO:

- Always add user stories to Figma comments
- Use Figma design tokens (colors, typography, spacing)
- Create component variants for different states
- Document breakpoints for responsive design
- Add accessibility labels in Figma

### ❌ DON'T:

- Hardcode colors/spacing in components
- Skip user stories
- Commit `.env.local` with tokens
- Share Figma tokens publicly
- Deviate from design without documentation

---

## Security

**IMPORTANT:**
- `.mcp.json` is in `.aiignore` (project-specific, won't sync to boilerplate)
- `.env.local` is in `.gitignore` (never committed)
- Figma tokens are personal (don't share)
- Review generated code before committing

---

## Additional Resources

- [Figma API Documentation](https://www.figma.com/developers/api)
- [Claude Code MCP Documentation](https://code.claude.com/docs/en/mcp.md)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)

---

## Next Steps

1. Complete this setup guide
2. Test with a simple component
3. Create your first comic reader component
4. Iterate and improve workflow

**Once setup is complete, you can create pixel-perfect components from Figma designs with AI assistance!** 🎨✨

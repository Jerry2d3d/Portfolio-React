# .aiignore Guide - Project-Specific AI Rules

## What is .aiignore?

`.aiignore` is like `.gitignore` but for AI configurations. It specifies which AI rules, agents, and documentation should **NEVER be synced** to the boilerplate or shared with other projects.

---

## Why Use .aiignore?

### ✅ Keep Project Secrets Local
- Client-specific requirements
- Proprietary business rules
- Sensitive domain knowledge
- Custom workflows unique to this project

### ✅ Prevent Pollution
- Don't clutter boilerplate with project-specific stuff
- Keep shared knowledge general and reusable
- Maintain clean separation of concerns

### ✅ Flexibility
- Customize AI behavior per project
- Override global rules locally
- Add project-specific agents

---

## How It Works

### 1. When You Say "This is for This Project Only"

Claude Code will automatically add it to `.aiignore`:

**You:** "Add a rule that this project uses PostgreSQL instead of MongoDB, but this is for this project only"

**Claude Code:**
1. Creates `.claude/docs/project-specific/database.md`
2. Adds pattern to `.aiignore`:
   ```
   .claude/docs/project-specific/
   ```
3. This file will NEVER be synced to boilerplate

### 2. Sync Scripts Respect .aiignore

When you run `npm run sync-claude` or `npm run contribute-claude`:
- Files matching `.aiignore` patterns are **skipped**
- Only shared knowledge is synced
- Your project-specific stuff stays local

---

## File Structure

```
your-project/
├── .aiignore                           # Lists what NOT to sync
├── .claude/
│   ├── agents/                         # Shared agents (synced)
│   ├── docs/                           # Shared docs (synced)
│   ├── personas/                       # Shared personas (synced)
│   │
│   ├── project-specific/               # 🔒 LOCAL ONLY (not synced)
│   │   ├── business-rules.md
│   │   ├── client-requirements.md
│   │   └── custom-workflows.md
│   │
│   ├── custom/                         # 🔒 LOCAL ONLY (not synced)
│   │   ├── agents/
│   │   │   └── inventory-agent.md
│   │   └── overrides.md
│   │
│   └── local-config.json               # 🔒 LOCAL ONLY (not synced)
```

---

## Usage Examples

### Example 1: Project-Specific Business Rule

**Scenario:** Your e-commerce project has specific pricing rules

```markdown
You: "Add a rule that this project calculates tax based on customer location
using the TaxJar API. This is for this project only."

Claude Code:
1. Creates: .claude/docs/project-specific/tax-rules.md
2. Adds to .aiignore: .claude/docs/project-specific/
3. Updates won't sync to boilerplate ✓
```

### Example 2: Client-Specific Requirements

```markdown
You: "This project is for Acme Corp and they require all user data
to be encrypted at rest. Don't sync this requirement."

Claude Code:
1. Creates: .claude/docs/client/acme-corp-requirements.md
2. Adds to .aiignore: .claude/docs/client/
3. Acme-specific rules stay local ✓
```

### Example 3: Custom Project-Only Agent

```markdown
You: "Create an agent that helps with inventory management specific
to this warehouse system. This agent is for this project only."

Claude Code:
1. Creates: .claude/agents/project-inventory-manager.md
2. Adds to .aiignore: .claude/agents/project-*.md
3. Custom agent stays local ✓
```

### Example 4: Override Global Rule Locally

```markdown
You: "Override the SCSS naming rule to use BEM methodology in this
project only, don't change the boilerplate."

Claude Code:
1. Creates: .claude/project-specific/scss-override.md
2. Already in .aiignore pattern
3. Override applies locally only ✓
```

---

## .aiignore Patterns

Similar to `.gitignore`, supports:

### Exact Match
```
.claude/docs/secret-sauce.md          # Exact file
```

### Directory Match
```
.claude/project-specific/              # Entire directory
.claude/custom/                        # Everything in custom/
```

### Wildcard Match
```
.claude/agents/project-*.md            # Any agent starting with "project-"
.claude/docs/*-acme.md                 # Any doc ending with "-acme"
```

### Pattern Examples
```
# Project-specific directories
.claude/project-specific/
.claude/local/
.claude/custom/

# Project-specific files by naming
**/project-*.md                        # Any file starting with "project-"
**/*-local.md                          # Any file ending with "-local"

# Client-specific
.claude/docs/client/
.claude/docs/clients/

# Business rules (might be sensitive)
.claude/docs/business-rules/
.claude/docs/proprietary/
```

---

## Sync Behavior

### When You Pull (sync-claude)

```bash
npm run sync-claude
```

**What happens:**
1. ✅ Syncs general agents, docs, personas
2. ❌ Skips anything in `.aiignore`
3. ✅ Your project-specific stuff is preserved
4. ✅ Creates backup of `.aiignore` itself

### When You Contribute (contribute-claude)

```bash
npm run contribute-claude
```

**What happens:**
1. ✅ Contributes general improvements
2. ❌ Excludes patterns in `.aiignore`
3. ✅ Project-specific stays local
4. ✅ `.aiignore` itself is NEVER contributed

---

## Default .aiignore Patterns

Every project starts with these patterns:

```
# Project-specific directories
.claude/project-specific/
.claude/local/
.claude/custom/

# Project-specific files
.claude/agents/project-*.md
.claude/agents/local-*.md
.claude/personas/project-*.md

# Local configurations
.claude/local-config.json
.claude/project-overrides.json

# Client/Business specific
.claude/docs/project-specific/
.claude/docs/client/
.claude/docs/business-rules/
```

---

## Best Practices

### ✅ DO Use .aiignore For:

- **Client-specific requirements**
  - "Acme Corp requires ISO 27001 compliance"

- **Business logic/rules**
  - "Calculate shipping based on weight * distance * 1.5"

- **Project-specific workflows**
  - "This project deploys to Azure, not AWS"

- **Domain-specific knowledge**
  - "Medical terminology for this healthcare app"

- **Custom agents for this project**
  - "Inventory agent specific to warehouse system"

- **API integrations unique to project**
  - "Integrate with SalesForce API using these credentials"

### ❌ DON'T Use .aiignore For:

- **General improvements** that could help other projects
- **Bug fixes** in agents that should be shared
- **Better patterns** that are universally useful
- **Documentation** that teaches best practices

---

## Keywords That Trigger .aiignore

When you use these phrases, Claude Code adds to `.aiignore`:

- "for this project only"
- "don't sync this"
- "project-specific"
- "keep this local"
- "don't share this"
- "local only"
- "this project uses..."
- "custom to this project"

---

## Managing .aiignore

### View What's Ignored
```bash
cat .aiignore
```

### Add Pattern Manually
```bash
echo ".claude/docs/my-secret.md" >> .aiignore
```

### Remove Pattern
Edit `.aiignore` and delete the line

### Decide to Share Something
If you want to share something that was marked project-only:

1. Remove it from `.aiignore`
2. Run `npm run contribute-claude`
3. It will now be contributed to boilerplate

---

## Example Workflow

### Day 1: Setup Project
```bash
git clone https://github.com/Jerry2d3d/boiler-project-ai.git my-store
cd my-store

# .aiignore is already there with defaults
cat .aiignore
```

### Day 5: Add Project-Specific Rule
```markdown
You: "This e-commerce store only ships to USA and Canada.
Add this as a shipping rule but don't sync it."

Claude:
1. Creates .claude/docs/project-specific/shipping-rules.md
2. Pattern already in .aiignore ✓
```

### Day 10: Pull Updates from Boilerplate
```bash
npm run sync-claude

# ✓ Gets new general agents
# ✓ Gets improved documentation
# ✓ Preserves your shipping rules (in .aiignore)
```

### Day 20: Contribute General Improvement
```bash
# You improved the code-review agent (NOT in .aiignore)
npm run contribute-claude

# ✓ Contributes code-review improvements
# ✗ Does NOT contribute shipping rules (in .aiignore)
```

---

## Technical Implementation

### In sync-claude-config.sh
```bash
# Before syncing
if [ -f ".aiignore" ]; then
  # Backup project-specific files
  rsync -av --exclude-from=.aiignore .claude/ .claude.backup/

  # Sync from boilerplate
  # ...

  # Restore project-specific files
  rsync -av .claude.backup/ .claude/
fi
```

### In contribute-claude-config.sh
```bash
# Before contributing
if [ -f ".aiignore" ]; then
  # Only copy files NOT in .aiignore
  rsync -av --exclude-from=.aiignore .claude/ $TEMP/.claude/
fi
```

---

## FAQ

**Q: Is .aiignore synced to boilerplate?**
A: No, `.aiignore` itself is never synced. Each project has its own.

**Q: What if I accidentally sync project-specific stuff?**
A: Remove it from the boilerplate PR/branch before merging.

**Q: Can I have multiple .aiignore files?**
A: No, only one `.aiignore` at the project root.

**Q: What if I want to share something I marked as project-only?**
A: Remove the pattern from `.aiignore` and run `contribute-claude`.

**Q: Does .aiignore affect git?**
A: No, it's separate. You might still commit project-specific files to your project's git.

---

## Summary

**.aiignore lets you:**
- ✅ Keep project secrets local
- ✅ Customize AI per project
- ✅ Prevent pollution of boilerplate
- ✅ Share general improvements while keeping specific ones private
- ✅ Maintain clean separation between shared and local knowledge

**Just say "this is for this project only" and Claude Code handles the rest!** 🎯

---

## Example .aiignore File

```
# .aiignore - Project-Specific AI Rules

# Project-specific directories (NEVER sync these)
.claude/project-specific/
.claude/local/
.claude/custom/

# Project-specific agents
.claude/agents/project-*.md
.claude/agents/inventory-*.md      # Our custom inventory agents

# Client-specific documentation
.claude/docs/client/
.claude/docs/acme-corp/            # Acme Corp requirements

# Business rules (proprietary)
.claude/docs/business-rules/
.claude/docs/pricing-algorithm.md  # Secret sauce

# Local configuration overrides
.claude/local-config.json
.claude/azure-specific.md          # We use Azure, boilerplate uses AWS

# Testing data (specific to our test environment)
.claude/docs/testing/local-test-data.md
```

---

**Your project-specific AI knowledge stays private. Your general improvements get shared. Perfect!** 🔒🔄

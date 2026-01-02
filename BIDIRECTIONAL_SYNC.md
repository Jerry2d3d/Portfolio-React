# Bi-Directional Claude Config Sync

This boilerplate supports **two-way syncing** of the `.claude/` directory:
- **Pull** changes FROM boilerplate TO your project
- **Push** changes FROM your project BACK to the boilerplate

---

## Two Sync Directions

### 📥 Pull Updates (Boilerplate → Your Project)

**Use when**: The boilerplate has new agents or rules you want

```bash
npm run sync-claude
```

### 📤 Contribute Back (Your Project → Boilerplate)

**Use when**: You've improved agents in your project and want to share them

```bash
npm run contribute-claude
```

---

## Workflow Example

### Scenario: You improve an agent in the QR code app

1. **Make improvements in QR code app:**
   ```bash
   cd qr-code-app

   # Edit agent
   vim .claude/agents/code-reviewer.md

   # Test it works well
   # Use Claude Code with the improved agent

   # Commit locally
   git add .claude/
   git commit -m "Improve code reviewer agent with better error detection"
   ```

2. **Contribute back to boilerplate:**
   ```bash
   npm run contribute-claude
   ```

   This will:
   - Clone the boilerplate repo
   - Create a new branch
   - Copy your `.claude/` directory
   - Create a commit
   - Show you how to create a Pull Request

3. **Review and merge:**
   ```bash
   # The script tells you where the repo is
   cd /tmp/claude-contribute-xxxxx

   # Review changes
   git diff main

   # Push to create PR
   git push origin claude-contribution-20251229_153000

   # Or merge directly (if you have access)
   git checkout main
   git merge claude-contribution-20251229_153000
   git push origin main
   ```

4. **Now other projects can get your improvements:**
   ```bash
   # In digital-poster or any other project
   cd digital-poster
   npm run sync-claude  # Gets your QR app improvements!
   ```

---

## Complete Bi-Directional Workflow

```
┌─────────────┐
│ Boilerplate │  (Central source of truth)
│  Repo       │
└──────┬──────┘
       │
       │ sync-claude (pull)
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌─────────────┐        ┌─────────────┐
│ QR Code App │        │Digital Post │
│             │        │   er        │
└──────┬──────┘        └─────────────┘
       │
       │ contribute-claude (push)
       │
       ▼
┌─────────────┐
│ Boilerplate │  (Updated!)
│  Repo       │
└──────┬──────┘
       │
       │ sync-claude (pull)
       │
       ▼
┌─────────────┐
│Digital Post │  (Gets QR app improvements!)
│   er        │
└─────────────┘
```

---

## Commands Reference

### Pull from Boilerplate

```bash
# Preview what would change
npm run sync-claude:preview

# Pull updates with confirmation
npm run sync-claude

# Force pull without prompts
npm run sync-claude:force
```

### Contribute to Boilerplate

```bash
# Contribute your changes
npm run contribute-claude

# Or run the script directly
./scripts/contribute-claude-config.sh

# Dry run to see what would happen
./scripts/contribute-claude-config.sh --dry-run

# Skip confirmations
./scripts/contribute-claude-config.sh --force

# Custom branch name
./scripts/contribute-claude-config.sh --branch my-awesome-changes
```

---

## Best Practices

### When to Pull (sync-claude)

✅ **Good times:**
- Monthly maintenance
- Before starting new features
- When you hear about new agent improvements
- Setting up a new project

### When to Contribute (contribute-claude)

✅ **Good times:**
- You've improved an agent significantly
- You've added useful documentation
- You've created a new persona
- You've fixed bugs in agents

❌ **Don't contribute:**
- Project-specific customizations
- Sensitive configuration
- Experimental/untested changes

---

## Handling Conflicts

### If Boilerplate Changed Since You Started

Your contribution might conflict with boilerplate changes:

```bash
# After contribute-claude creates the branch
cd /tmp/claude-contribute-xxxxx

# Update from latest main
git fetch origin
git rebase origin/main

# If conflicts, resolve them
git status
# Edit conflicting files
git add .
git rebase --continue

# Then push
git push origin your-branch-name
```

### If You Have Local Customizations

Keep project-specific changes separate:

```bash
# Structure your .claude directory
.claude/
├── agents/               # Synced with boilerplate
├── docs/                 # Synced with boilerplate
├── personas/             # Synced with boilerplate
└── custom/              # Project-specific (never sync)
    ├── agents/
    └── config/
```

---

## Contribution Guidelines

### Before Contributing

1. **Test thoroughly** - Make sure changes work well
2. **Document changes** - Add comments explaining improvements
3. **Be general** - Remove project-specific references
4. **Follow conventions** - Match existing file structure

### Good Contribution Example

```markdown
# Before (project-specific)
"Check for QR code generation errors and MongoDB connection issues in qr-code-app"

# After (generalized for boilerplate)
"Check for data generation errors and database connection issues"
```

### Contribution Checklist

- [ ] Changes tested in your project
- [ ] Project-specific references removed
- [ ] Documentation updated
- [ ] No sensitive information included
- [ ] Follows existing patterns
- [ ] Adds value to boilerplate

---

## Advanced: Selective Contribution

Contribute only specific files:

```bash
# Clone boilerplate
git clone https://github.com/Jerry2d3d/boiler-project-ai.git /tmp/my-contribution
cd /tmp/my-contribution
git checkout -b my-improvement

# Copy only what you want to contribute
cp /path/to/your-project/.claude/agents/code-reviewer.md .claude/agents/
cp /path/to/your-project/.claude/docs/new-feature.md .claude/docs/

# Commit and push
git add .claude/
git commit -m "Improve code reviewer and add new feature docs"
git push origin my-improvement
```

---

## Automation with CI/CD

### Auto-sync in Projects

Add to `.github/workflows/sync-claude.yml`:

```yaml
name: Sync Claude Config

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:      # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Sync Claude Config
        run: |
          npm run sync-claude:force

      - name: Create PR if changes
        run: |
          if [[ $(git status --porcelain) ]]; then
            git checkout -b sync-claude-$(date +%Y%m%d)
            git add .claude/
            git commit -m "Sync Claude config from boilerplate"
            git push origin sync-claude-$(date +%Y%m%d)
            # Create PR using gh CLI
          fi
```

### Auto-notify on Boilerplate Updates

In boilerplate repo, add to `.github/workflows/notify-projects.yml`:

```yaml
name: Notify Projects

on:
  push:
    branches: [main]
    paths:
      - '.claude/**'

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send notification
        run: |
          echo "Claude config updated!"
          # Send Slack notification
          # Create issues in project repos
          # Whatever notification method you prefer
```

---

## Troubleshooting

### "No changes to contribute"

Your `.claude/` might be identical to boilerplate:

```bash
# Check for differences
./scripts/contribute-claude-config.sh --dry-run
```

### "Permission denied when pushing"

You need write access to the boilerplate repo:

```bash
# Option 1: Fork the repo and push to your fork
# Option 2: Request access from repo owner
# Option 3: Create the branch locally and send as patch
```

### "Merge conflicts"

Someone else updated the same files:

```bash
cd /tmp/claude-contribute-xxxxx
git fetch origin
git rebase origin/main
# Resolve conflicts
# git push --force-with-lease origin your-branch
```

---

## FAQ

**Q: Will contribute-claude overwrite my changes?**
A: No, it creates a new branch. The boilerplate main branch is never touched until you merge.

**Q: Can I sync from multiple projects?**
A: Yes! Each project can contribute. The boilerplate becomes a shared knowledge base.

**Q: What if I make a mistake?**
A: Just don't merge the PR/branch. Delete it and try again.

**Q: Should I sync before contributing?**
A: Yes! Run `npm run sync-claude` first to get latest changes, then make your improvements, then contribute.

**Q: How often should I sync?**
A: Pull weekly or monthly. Contribute whenever you make meaningful improvements.

---

## Real-World Workflow

### Daily Work
```bash
# Just work in your project normally
vim .claude/agents/my-agent.md
```

### Weekly Maintenance
```bash
# Pull latest from boilerplate
npm run sync-claude
```

### After Major Improvement
```bash
# Test your changes
# Then contribute back
npm run contribute-claude
```

### Monthly Sync
```bash
# In all projects
npm run sync-claude
```

---

**The bi-directional sync keeps all your projects aligned while allowing innovation in any project!** 🔄

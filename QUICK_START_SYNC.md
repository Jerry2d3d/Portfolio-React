# Quick Start: Using the Boilerplate in Your Project

## For the digital-poster project (or any new project)

### Step 1: Set Up Sync in Your Project

```bash
# Navigate to your digital-poster project
cd /path/to/digital-poster

# Create scripts directory
mkdir -p scripts

# Copy the sync script from the boilerplate
curl -o scripts/sync-claude-config.sh https://raw.githubusercontent.com/Jerry2d3d/boiler-project-ai/main/scripts/sync-claude-config.sh

# Make it executable
chmod +x scripts/sync-claude-config.sh
```

### Step 2: Add NPM Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "sync-claude": "bash scripts/sync-claude-config.sh",
    "sync-claude:preview": "bash scripts/sync-claude-config.sh --dry-run",
    "sync-claude:force": "bash scripts/sync-claude-config.sh --force"
  }
}
```

### Step 3: First Sync

```bash
# Preview what will be synced
npm run sync-claude:preview

# Sync the .claude directory
npm run sync-claude

# Review the changes
git status
git diff .claude/

# Commit if satisfied
git add .claude/
git commit -m "Initial Claude config from boilerplate"
git push
```

---

## Future Updates

When the boilerplate's agents or rules are updated:

```bash
# In your digital-poster project
npm run sync-claude:preview  # Check what changed
npm run sync-claude           # Sync the updates
git diff .claude/             # Review
git commit -am "Update Claude config from boilerplate"
```

---

## Example Workflow

### Scenario: Boilerplate adds a new React component agent

**In boilerplate repo (boiler-project-ai):**
```bash
# Add new agent
echo "New agent config" > .claude/agents/react-component-generator.json

# Commit and push
git add .claude/
git commit -m "Add React component generator agent"
git push
```

**In your project (digital-poster):**
```bash
# Pull the update
npm run sync-claude

# Test the new agent
# (Use Claude Code with the new agent)

# Commit
git add .claude/
git commit -m "Add React component generator agent from boilerplate"
git push
```

---

## Benefits

✅ **Centralized improvements** - Update agents once, deploy everywhere
✅ **Version control** - Track changes to your AI tooling
✅ **Consistency** - All projects use the same agents and rules
✅ **Easy rollback** - Git makes it easy to revert if needed
✅ **Automatic backups** - Sync script backs up before overwriting

---

## Customization

If you need project-specific customizations:

```bash
# Create a custom agents directory
mkdir -p .claude/custom/agents

# Add your custom agent
echo "Custom config" > .claude/custom/agents/my-special-agent.json

# This won't be overwritten by sync
# (Sync only touches .claude/agents, .claude/docs, .claude/personas)
```

Or document your customizations:

```bash
# Create a customizations file
cat > .claude/CUSTOMIZATIONS.md << 'EOF'
# Project-Specific Customizations

- Modified `react-nextjs.md` to include project-specific patterns
- Added custom validation rules in `development-rules.md`

After syncing, re-apply these changes:
1. [List your manual changes]
EOF
```

---

## Troubleshooting

### Permission Denied
```bash
chmod +x scripts/sync-claude-config.sh
```

### Can't Find Script
Make sure you're in the project root:
```bash
pwd  # Should show your project directory
ls scripts/sync-claude-config.sh  # Should exist
```

### Merge Conflicts
If you have local changes:
```bash
# Backup your changes
cp -r .claude .claude.backup

# Force sync
npm run sync-claude:force

# Manually merge back your changes
diff -r .claude.backup .claude
```

---

**Need more help?** Check out [CLAUDE_SYNC.md](https://github.com/Jerry2d3d/boiler-project-ai/blob/main/CLAUDE_SYNC.md) for complete documentation.

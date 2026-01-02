# Claude Config Sync System

This boilerplate includes a system for syncing Claude Code configuration (agents, rules, personas) across multiple projects.

## Why Sync?

When you improve agents, rules, or personas in the boilerplate, you can easily propagate those improvements to all your projects that use this boilerplate.

---

## Method 1: Using the Sync Script (Recommended)

### In Your Project (Not the Boilerplate)

1. **Copy the sync script to your project:**
   ```bash
   # Create scripts directory if it doesn't exist
   mkdir -p scripts

   # Download the sync script
   curl -o scripts/sync-claude-config.sh https://raw.githubusercontent.com/Jerry2d3d/boiler-project-ai/main/scripts/sync-claude-config.sh

   # Make it executable
   chmod +x scripts/sync-claude-config.sh
   ```

2. **Run the sync:**
   ```bash
   # Preview changes (dry run)
   ./scripts/sync-claude-config.sh --dry-run

   # Sync with confirmation
   ./scripts/sync-claude-config.sh

   # Force sync (no confirmation)
   ./scripts/sync-claude-config.sh --force
   ```

3. **Review and commit:**
   ```bash
   # Review the changes
   git status
   git diff .claude/

   # If satisfied, commit
   git add .claude/
   git commit -m "Update Claude config from boilerplate"
   ```

---

## Method 2: Manual Sync

### Option A: Using Git

```bash
# In your project directory
cd /path/to/your/project

# Add boilerplate as a remote (one-time setup)
git remote add boilerplate https://github.com/Jerry2d3d/boiler-project-ai.git

# Fetch latest changes
git fetch boilerplate

# Checkout just the .claude directory
git checkout boilerplate/main -- .claude/

# Review and commit
git status
git commit -m "Update Claude config from boilerplate"
```

### Option B: Copy/Paste

```bash
# Clone the boilerplate temporarily
cd /tmp
git clone https://github.com/Jerry2d3d/boiler-project-ai.git

# Copy .claude to your project
cp -r boiler-project-ai/.claude /path/to/your/project/

# Clean up
rm -rf boiler-project-ai
```

---

## Method 3: NPM Script (Automated)

Add this to your project's `package.json`:

```json
{
  "scripts": {
    "sync-claude": "bash scripts/sync-claude-config.sh",
    "sync-claude:preview": "bash scripts/sync-claude-config.sh --dry-run",
    "sync-claude:force": "bash scripts/sync-claude-config.sh --force"
  }
}
```

Then run:
```bash
npm run sync-claude
```

---

## What Gets Synced?

The entire `.claude/` directory, including:
- **agents/** - Custom agent configurations
- **docs/** - AI development documentation and rules
- **personas/** - Framework-specific personas
- **config.json** - Claude Code configuration

---

## Best Practices

### 1. Before Syncing
- Commit any local changes to `.claude/` first
- Review what will be synced with `--dry-run`
- Backup important custom modifications

### 2. After Syncing
- Test with Claude Code to ensure everything works
- Review changes with `git diff .claude/`
- Update any project-specific customizations

### 3. When to Sync
- When new agents are added to the boilerplate
- When development rules are updated
- When personas are improved
- Monthly maintenance check

### 4. Custom Modifications
If you have project-specific `.claude/` customizations:
- Document them in a `CLAUDE_CUSTOMIZATIONS.md` file
- Keep them in a separate subdirectory (e.g., `.claude/custom/`)
- Re-apply after syncing from boilerplate

---

## Sync Workflow Example

```bash
# 1. Check what would change
./scripts/sync-claude-config.sh --dry-run

# 2. Create a backup (automatic, but good to know)
# Script creates .claude.backup.YYYYMMDD_HHMMSS

# 3. Sync the changes
./scripts/sync-claude-config.sh

# 4. Review changes
git diff .claude/

# 5. Test with Claude Code
# Open your project in Claude Code and test agents

# 6. Commit if satisfied
git add .claude/
git commit -m "Sync Claude config from boilerplate v1.2"
git push
```

---

## Troubleshooting

### Script Permission Denied
```bash
chmod +x scripts/sync-claude-config.sh
```

### Merge Conflicts
If you have local changes that conflict:
1. Backup your `.claude/` directory
2. Run sync with `--force`
3. Manually merge your custom changes back

### Boilerplate Not Accessible
Check that you can access the repository:
```bash
git ls-remote https://github.com/Jerry2d3d/boiler-project-ai.git
```

---

## Keeping Your Boilerplate Updated

### For the Boilerplate Repository

When you improve agents or rules in the boilerplate:

1. **Test thoroughly** in the boilerplate project
2. **Document changes** in a CHANGELOG
3. **Commit and push** to the boilerplate repo
4. **Notify teams** that updates are available
5. **Version tag** for major updates:
   ```bash
   git tag -a claude-config-v1.1 -m "Updated React agent with TypeScript support"
   git push origin claude-config-v1.1
   ```

### For Projects Using the Boilerplate

Set up a reminder to check for updates:
```bash
# Add to your project's README or docs
echo "Last Claude config sync: $(date)" >> .claude/LAST_SYNC.txt
```

---

## Advanced: Selective Sync

To sync only specific parts of `.claude/`:

```bash
# Clone boilerplate to temp location
git clone --depth 1 https://github.com/Jerry2d3d/boiler-project-ai.git /tmp/boilerplate

# Copy only what you need
cp -r /tmp/boilerplate/.claude/agents .claude/
cp -r /tmp/boilerplate/.claude/docs/development-rules.md .claude/docs/

# Clean up
rm -rf /tmp/boilerplate
```

---

## Integration with CI/CD

You can add a check in CI to warn when Claude config is outdated:

```yaml
# .github/workflows/claude-check.yml
name: Check Claude Config

on: [push, pull_request]

jobs:
  check-claude-config:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check Claude Config Version
        run: |
          # Fetch boilerplate
          git clone --depth 1 https://github.com/Jerry2d3d/boiler-project-ai.git /tmp/boilerplate

          # Compare versions
          if ! diff -q .claude/config.json /tmp/boilerplate/.claude/config.json; then
            echo "⚠️ Claude config may be outdated. Consider running sync-claude-config.sh"
            exit 0  # Don't fail, just warn
          fi
```

---

## Questions?

- **Where is the boilerplate?** https://github.com/Jerry2d3d/boiler-project-ai
- **Issues?** Open an issue in the boilerplate repo
- **Want to contribute?** Fork the boilerplate and submit a PR

---

**Happy syncing!** 🚀

#!/bin/bash

###############################################################################
# Claude Config Contribution Script
#
# This script syncs .claude/ changes FROM your current project BACK to the
# boilerplate repository. Use this when you've made improvements to agents,
# rules, or personas that should be shared with the boilerplate.
#
# Usage:
#   ./scripts/contribute-claude-config.sh [--dry-run] [--force]
#
# Options:
#   --dry-run    Show what would be contributed without actually doing it
#   --force      Skip confirmation prompts
#   --branch     Specify branch name (default: claude-contribution-TIMESTAMP)
#
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Default options
DRY_RUN=false
FORCE=false
BOILERPLATE_REPO="https://github.com/Jerry2d3d/boiler-project-ai.git"
BRANCH_NAME="claude-contribution-$(date +%Y%m%d_%H%M%S)"
TEMP_DIR="/tmp/claude-contribute-$$"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    --branch)
      BRANCH_NAME="$2"
      shift 2
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}  Claude Config Contribution to Boilerplate${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
  echo -e "${RED}Error: Not in a git repository${NC}"
  echo "Please run this script from the root of your project"
  exit 1
fi

# Check if .claude directory exists
if [ ! -d ".claude" ]; then
  echo -e "${RED}Error: .claude directory doesn't exist${NC}"
  echo "Nothing to contribute"
  exit 1
fi

# Get current project name
PROJECT_NAME=$(basename "$(pwd)")

echo -e "${BLUE}Project:${NC} $PROJECT_NAME"
echo -e "${BLUE}Branch:${NC} $BRANCH_NAME"
echo ""

# Show what will be contributed
echo -e "${GREEN}→${NC} Analyzing .claude directory..."
echo ""
echo -e "${YELLOW}Files to contribute:${NC}"
find .claude -type f | sed 's|^|  |'

# Count files
FILE_COUNT=$(find .claude -type f | wc -l | tr -d ' ')
echo ""
echo -e "${BLUE}Total: $FILE_COUNT files${NC}"
echo ""

# Confirm before proceeding
if [ "$FORCE" = false ]; then
  echo -e "${YELLOW}This will:${NC}"
  echo "  1. Clone the boilerplate repository"
  echo "  2. Create a new branch: $BRANCH_NAME"
  echo "  3. Copy your .claude/ directory to it"
  echo "  4. Create a commit with your changes"
  echo "  5. Show you instructions to create a Pull Request"
  echo ""
  read -p "Continue? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted"
    exit 1
  fi
fi

if [ "$DRY_RUN" = true ]; then
  echo ""
  echo -e "${BLUE}Dry run completed - no changes made${NC}"
  echo ""
  echo "To actually contribute, run without --dry-run:"
  echo "  ./scripts/contribute-claude-config.sh"
  exit 0
fi

# Clone boilerplate
echo ""
echo -e "${GREEN}→${NC} Cloning boilerplate repository..."
git clone "$BOILERPLATE_REPO" "$TEMP_DIR" 2>&1 | grep -v "Cloning into" || true

cd "$TEMP_DIR"

# Create new branch
echo -e "${GREEN}→${NC} Creating contribution branch..."
git checkout -b "$BRANCH_NAME"

# Backup existing .claude
if [ -d ".claude" ]; then
  echo -e "${YELLOW}→${NC} Backing up existing .claude in boilerplate..."
  mv .claude .claude.original
fi

# Copy our .claude (excluding .aiignore patterns)
echo -e "${GREEN}→${NC} Copying .claude from $PROJECT_NAME..."

if [ -f "$OLDPWD/.aiignore" ]; then
  echo -e "${BLUE}→${NC} Respecting .aiignore (excluding project-specific files)..."

  # Use rsync with exclude-from to respect .aiignore
  rsync -av --exclude-from="$OLDPWD/.aiignore" "$OLDPWD/.claude/" ./.claude/

  echo -e "${YELLOW}Note:${NC} Project-specific files (in .aiignore) were not included"
else
  # No .aiignore, copy everything
  cp -r "$OLDPWD/.claude" .
fi

# Show differences
echo ""
echo -e "${BLUE}Changes to be contributed:${NC}"
git status --short | sed 's|^|  |'

# Create commit
echo ""
echo -e "${GREEN}→${NC} Creating commit..."

COMMIT_MSG="Contribute Claude config improvements from $PROJECT_NAME

Changes made in $PROJECT_NAME project that improve:
- Agents
- Documentation and rules
- Personas
- Configuration

Files changed: $FILE_COUNT

Contributed from: $PROJECT_NAME
Branch: $BRANCH_NAME
Date: $(date +%Y-%m-%d)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git add .claude/
git commit -m "$COMMIT_MSG"

echo -e "${GREEN}✓${NC} Commit created successfully!"
echo ""

# Show next steps
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}  Next Steps${NC}"
echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Your changes are ready to contribute!${NC}"
echo ""
echo "Repository location: $TEMP_DIR"
echo ""
echo -e "${BLUE}Option 1: Push and create Pull Request${NC}"
echo ""
echo "  cd $TEMP_DIR"
echo "  git push origin $BRANCH_NAME"
echo ""
echo "Then go to GitHub and create a Pull Request:"
echo "  https://github.com/Jerry2d3d/boiler-project-ai/compare/$BRANCH_NAME"
echo ""
echo -e "${BLUE}Option 2: Review changes first${NC}"
echo ""
echo "  cd $TEMP_DIR"
echo "  git diff main"
echo "  git log -1 --stat"
echo ""
echo -e "${BLUE}Option 3: Direct merge (if you have access)${NC}"
echo ""
echo "  cd $TEMP_DIR"
echo "  git checkout main"
echo "  git merge $BRANCH_NAME"
echo "  git push origin main"
echo ""
echo -e "${YELLOW}Note:${NC} The repository will remain at $TEMP_DIR for review."
echo "Delete it manually when done: rm -rf $TEMP_DIR"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

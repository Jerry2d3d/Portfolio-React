#!/bin/bash

###############################################################################
# Claude Config Sync Script
#
# This script syncs the .claude/ directory from the boilerplate repository
# to your current project, allowing you to get updates to agents, rules,
# and personas.
#
# Usage:
#   ./scripts/sync-claude-config.sh [--dry-run] [--force]
#
# Options:
#   --dry-run    Show what would be synced without actually syncing
#   --force      Overwrite local changes without confirmation
#
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default options
DRY_RUN=false
FORCE=false
BOILERPLATE_REPO="https://github.com/Jerry2d3d/boiler-project-ai.git"
TEMP_DIR="/tmp/claude-config-sync-$$"

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
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Claude Config Sync from Boilerplate${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
  echo -e "${RED}Error: Not in a git repository${NC}"
  echo "Please run this script from the root of your project"
  exit 1
fi

# Check if .claude directory exists
if [ ! -d ".claude" ]; then
  echo -e "${YELLOW}Warning: .claude directory doesn't exist in current project${NC}"
  echo "This will create a new .claude directory"
  if [ "$FORCE" = false ]; then
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "Aborted"
      exit 1
    fi
  fi
fi

echo -e "${GREEN}→${NC} Cloning boilerplate repository..."
if [ "$DRY_RUN" = false ]; then
  git clone --depth 1 --branch main "$BOILERPLATE_REPO" "$TEMP_DIR" 2>&1 | grep -v "Cloning into" || true
fi

if [ "$DRY_RUN" = false ] && [ ! -d "$TEMP_DIR/.claude" ]; then
  echo -e "${RED}Error: .claude directory not found in boilerplate${NC}"
  rm -rf "$TEMP_DIR"
  exit 1
fi

echo -e "${GREEN}→${NC} Analyzing changes..."

# Show what will be synced
if [ -d ".claude" ]; then
  echo ""
  echo -e "${YELLOW}Files that will be updated:${NC}"

  if [ "$DRY_RUN" = false ]; then
    # Compare directories
    diff -rq "$TEMP_DIR/.claude" ".claude" 2>/dev/null | grep -v "Only in $TEMP_DIR" | sed "s|^|  |" || echo "  No changes detected"
  else
    echo "  (Dry run - would compare with boilerplate)"
  fi
fi

# Confirm before syncing
if [ "$FORCE" = false ] && [ "$DRY_RUN" = false ]; then
  echo ""
  read -p "Proceed with sync? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted"
    rm -rf "$TEMP_DIR"
    exit 1
  fi
fi

# Perform sync
if [ "$DRY_RUN" = false ]; then
  echo ""
  echo -e "${GREEN}→${NC} Syncing .claude directory..."

  # Backup existing .claude if it exists
  if [ -d ".claude" ]; then
    BACKUP_DIR=".claude.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${YELLOW}→${NC} Creating backup at $BACKUP_DIR"
    cp -r ".claude" "$BACKUP_DIR"
  fi

  # Backup project-specific files (from .aiignore) if exists
  PROJECT_SPECIFIC_BACKUP=""
  if [ -f ".aiignore" ] && [ -d ".claude" ]; then
    PROJECT_SPECIFIC_BACKUP=".claude.project-specific.$(date +%Y%m%d_%H%M%S)"
    echo -e "${BLUE}→${NC} Preserving project-specific files (respecting .aiignore)..."
    mkdir -p "$PROJECT_SPECIFIC_BACKUP"

    # Copy project-specific files based on .aiignore patterns
    while IFS= read -r pattern || [ -n "$pattern" ]; do
      # Skip comments and empty lines
      [[ "$pattern" =~ ^#.*$ ]] && continue
      [[ -z "$pattern" ]] && continue

      # Copy matching files/dirs
      if [ -e ".claude/$pattern" ] || compgen -G ".claude/$pattern" > /dev/null 2>&1; then
        rsync -av --relative ".claude/./$pattern" "$PROJECT_SPECIFIC_BACKUP/" 2>/dev/null || true
      fi
    done < .aiignore
  fi

  # Remove old .claude and copy new one from boilerplate
  rm -rf ".claude"
  cp -r "$TEMP_DIR/.claude" ".claude"

  # Restore project-specific files
  if [ -n "$PROJECT_SPECIFIC_BACKUP" ] && [ -d "$PROJECT_SPECIFIC_BACKUP/.claude" ]; then
    echo -e "${BLUE}→${NC} Restoring project-specific files..."
    cp -r "$PROJECT_SPECIFIC_BACKUP/.claude/"* ".claude/" 2>/dev/null || true
    echo -e "${GREEN}✓${NC} Project-specific files preserved"
  fi

  echo -e "${GREEN}✓${NC} Sync completed successfully!"
  echo ""
  echo -e "${BLUE}Updated files:${NC}"
  find .claude -type f | sed "s|^|  |"

  if [ -d "$BACKUP_DIR" ]; then
    echo ""
    echo -e "${YELLOW}Note: Previous .claude backed up to $BACKUP_DIR${NC}"
  fi
else
  echo ""
  echo -e "${BLUE}Dry run completed - no changes made${NC}"
fi

# Cleanup
if [ -d "$TEMP_DIR" ]; then
  rm -rf "$TEMP_DIR"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Sync Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "  1. Review the changes in .claude/"
echo "  2. Test with Claude Code to ensure everything works"
echo "  3. Commit the changes if satisfied"
echo ""

# Customer Tutorial & Installation Guide: Full-Stack AI Coding Vault

## Installation in Under 2 Minutes

### Method A: For Cursor Users
1. Copy the contents of the `rules/` folder directly into your project's `.cursor/rules/` directory:
   ```bash
   mkdir -p .cursor/rules
   cp rules/*.mdc .cursor/rules/
   ```
2. Cursor will automatically detect and bind the rules based on active open files matching globs!

### Method B: For Claude Code Users
1. Copy the skill folder into your Claude configuration or agent workspace:
   ```bash
   mkdir -p .claude/skills/
   cp -r skills/fullstack-agentic-coding-vault .claude/skills/
   ```
2. Claude Code will dynamically load the skill whenever refactoring or authoring full-stack code!

### Method C: For Antigravity Users
1. Place the `fullstack-agentic-coding-vault` folder into your `.agent/skills/` directory.
2. The agent will discover and honor the skill operating contracts automatically.

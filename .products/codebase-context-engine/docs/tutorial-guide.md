# Codebase Context Engine
## Customer Tutorial & Implementation Guide

Welcome to the **Codebase Context Engine**! This guide helps you set up, crawl your codebase, and generate high-precision context guardrails for Cursor, Claude Code, and Antigravity.

---

## 1. 3-Minute Quickstart

### Step 1: Run the Context Builder CLI
Run the standalone tool against your project root:

```bash
node scripts/context-builder.mjs . > .cursorrules
```

This immediately crawls your `package.json`, detects your exact framework versions, and writes a production-grade `.cursorrules` file.

### Step 2: Generate for Claude Code
To generate `CLAUDE.md`:

```bash
node scripts/context-builder.mjs . > CLAUDE.md
```

---

## 2. Multi-Client Installation

- **Cursor IDE**: Keep `.cursorrules` in your project root or place specific rules in `.cursor/rules/`.
- **Anthropic Claude Code**: Keep `CLAUDE.md` in your project root.
- **Google Antigravity**: Copy `skills/context-engine/` into `.agent/skills/`.

---

## 3. High-Converting Prompt Recipes

### Recipe 1: Full Monorepo Context Generation
```
Act as the Codebase Context Engine.
1. Inspect our repository's package.json and file tree.
2. Identify our exact framework versions (Next.js, Tailwind, ORM, React).
3. Synthesize token-dense .cursorrules and CLAUDE.md files with strict negative constraints preventing outdated syntax.
```

### Recipe 2: Framework Upgrade Guardrail
```
We recently upgraded from Next.js 14 to Next.js 15 and Tailwind v3 to Tailwind v4.
Update our context rules to forbid old Pages router APIs and obsolete Tailwind configuration syntax.
```

---

## 4. Troubleshooting & FAQs

#### Q: Why is my AI agent still suggesting old Next.js APIs?
**A:** Ensure your `.cursorrules` or `CLAUDE.md` contains explicit negative constraints (e.g. `NEVER suggest getServerSideProps`). LLMs prioritize explicit negative constraints over broad positive descriptions.

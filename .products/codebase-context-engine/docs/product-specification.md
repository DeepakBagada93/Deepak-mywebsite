# Product Specification: Codebase Context Engine

**Product Slug:** `codebase-context-engine`  
**Version:** 1.0.0  
**Category:** `ai-skill-bundle`  
**License:** Commercial EULA  
**Author:** Deepak Bagada Systems  

---

## 1. System Vision & Architecture

The **Codebase Context Engine** crawls a repository's `package.json`, detects versions and architectural patterns, and synthesizes token-dense context guardrails for:
1. `.cursorrules` (Cursor IDE)
2. `CLAUDE.md` (Anthropic Claude Code)
3. `.agent/rules/` (Google Antigravity & AI Agent OS)

```
┌──────────────────────────────────────────────────────────────────┐
│                   Codebase Context Engine                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Repository package.json] ──▶  Inspector (context-builder.mjs)  │
│                                           │                      │
│                                           ▼                      │
│                                Tech Stack Resolution             │
│                                (Next.js 15, Tailwind v4, Prisma) │
│                                           │                      │
│                                           ▼                      │
│  [Autonomous Skill] ◀────── Deterministic Template Synthesizer  │
│  (skills/.../SKILL.md)                    │                      │
│                                           ▼                      │
│  [Outputs]:                                                      │
│  ├── `.cursorrules` (Formatted for Cursor Composer & Tab)        │
│  ├── `CLAUDE.md` (Terminal-optimized for Claude Code)           │
│  └── `SYSTEM-CONTEXT.md` (Antigravity & Agent OS rules)          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Layout

```
products/codebase-context-engine/
├── README.md
├── LICENSE.md
├── CHANGELOG.md
├── COMPATIBILITY.md
├── product-manifest.json
├── progress.json
├── scripts/
│   └── context-builder.mjs       # Standalone Node.js context synthesizer CLI
├── skills/
│   └── context-engine/
│       └── SKILL.md              # Multi-client AI skill
├── docs/
│   ├── research-dossier.md
│   ├── product-specification.md
│   ├── tutorial-guide.md
│   ├── store-listing.md
│   ├── test-plan.md
│   ├── test-results.md
│   └── release-report.md
├── examples/
│   └── react-nextjs-repo/
│       ├── package.json
│       ├── expected-cursorrules.md
│       └── expected-claude.md
├── tests/
│   ├── skill-structure.test.mjs
│   └── context-builder.test.mjs
└── dist/
    └── codebase-context-engine-1.0.0.zip
```

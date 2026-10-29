# AI Codebase Documentation & Knowledge Agent

**One command. Zero setup. Living documentation for any codebase.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 What It Does

Point this AI agent at any codebase — it reads your code, understands your architecture, and generates:

| Doc Type | What You Get |
|----------|-------------|
| **README.md** | Project overview, quick start, architecture, tech stack, development guide |
| **API Reference** | Functions, classes, endpoints, database schemas with signatures and descriptions |
| **Architecture Decision Records** | Why key architectural choices were made |
| **Developer Onboarding Guide** | What every new dev needs to know to be productive |

All in **3 minutes or less**. No accounts. No monthly fees. No manual annotation.

---

## ⚡ Quick Start

```bash
# 1. Load the agent (varies by environment)
# Claude Code: copy skills/ai-codebase-doc-agent/ to your skill root
# Cursor: add as .cursor/rules/ai-codebase-doc-agent/SKILL.md

# 2. Activate with a single command
"Document this codebase at path: ./my-project, output: ./my-project/docs"

# 3. Review the generated docs
open ./my-project/docs/README.md
```

That's it. Three commands, living documentation.

---

## 📋 What You Get In The Package

```
ai-codebase-doc-agent-v1.0.0/
├── skills/
│   └── ai-codebase-doc-agent/
│       └── SKILL.md              ← The agent definition (portable, no dependencies)
├── .env.example                   ← Configuration template
├── examples/
│   ├── sample-python-api/         ← Sample codebase to test the agent on
│   └── expected-output/           ← Generated docs to compare against
├── docs/
│   ├── tutorial-guide.md          ← Step-by-step customer tutorial
│   ├── store-listing.md           ← Store listing copy
│   ├── product-specification.md   ← Product specification
│   ├── research-dossier.md        ← Market research
│   └── test-plan.md               ← Test plan
├── tests/
│   └── test-results.md            ← Test results
├── README.md                      ← This file
├── LICENSE.md                     ← Dual-license (Solo / Agency)
├── CHANGELOG.md                   ← Version history
└── COMPATIBILITY.md               ← Verified environments
```

---

## 🔧 How It Works

The agent executes a 4-stage pipeline:

```
📁 Your Codebase
    │
    ▼
[1. DISCOVERY]  →  Walk directory, detect languages, find configs
    │
    ▼
[2. ANALYSIS]   →  Map architecture, understand modules, extract APIs
    │
    ▼
[3. GENERATION] →  Write README, API docs, ADRs, onboarding guide
    │
    ▼
[4. OUTPUT]     →  Status report + review-before-commit footer
```

---

## 🛡️ Safety First

| Safety Feature | How It Works |
|----------------|-------------|
| **Never modifies source code** | Agent only writes doc files. Never edits, deletes, or executes source. |
| **Secret detection** | Automatically detects and skips files containing credentials. |
| **Backup before overwrite** | Existing docs are backed up before new ones are written. |
| **No network calls (except LLM)** | Agent only contacts your configured AI provider. No telemetry. |
| **Human-in-the-loop** | Agent generates → you review → you commit. Nothing auto-commits. |

---

## 💰 Pricing

| License | 🇺🇸 US | 🇮🇳 India | Rights |
|---------|--------|-----------|--------|
| **Solo Developer** | $79 (reg $99) | ₹1,999 (reg ₹2,999) | Personal projects, full source + docs |
| **Agency Pro** | $149 (reg $199) | ₹3,999 (reg ₹5,999) | Up to 10 client projects, white-label |

**30-Day Money-Back Guarantee.** If the agent doesn't document your codebase in under 5 minutes, get a full refund.

---

## 🏗️ Built For

- **SaaS Founders** — Document your startup's codebase before investors ask
- **Dev Agencies** — Client handoffs without the 2-day documentation sprint
- **Open Source Maintainers** — Keep your README and docs in sync with your code
- **Engineering Teams** — Onboard new devs in hours, not weeks
- **Freelancers** — Deliver documented code that clients actually understand

---

## 🔗 Related Products

- [Codebase Context Engine](https://deepakbagada.in/products/codebase-context-engine) — Give your AI agent context from your codebase
- [MCP Server Launch Kit](https://deepakbagada.in/products/mcp-server-launch-kit) — Turn any API into MCP tools
- [Agent Context Architect](https://deepakbagada.in/products/agent-context-architect) — Production-grade agent instructions

---

**Crafted by Deepak Bagada Systems** · [deepakbagada.in](https://deepakbagada.in) · One-time purchase, lifetime ownership.
# Product Specification: AI Codebase Documentation & Knowledge Agent

**Slug:** `ai-codebase-doc-agent`  
**Version:** 1.0.0  
**Skill Used:** `prebuilt-ai-agent-product`  
**Buyer:** Solo developers, dev studios, SaaS founders, agency owners  
**Promise:** *"Point this agent at any codebase — it reads your code, understands your architecture, and writes living documentation you can commit today."*

---

## 1. Agent Contract (Who → What Trigger → What Result → How Verified)

| Dimension | Contract |
|-----------|----------|
| **Buyer** | A developer or agency with an existing codebase (any size, any language) that lacks or needs updated documentation. |
| **Trigger** | The buyer runs the agent with a path to their codebase root. |
| **Result** | A documentation directory is created/updated at a specified output path containing: README.md (project overview, setup, architecture), API reference (functions, classes, endpoints), architecture decision records (key design choices), and developer onboarding guide. |
| **Verification** | The buyer opens the generated docs, verifies accuracy against their code, and commits them. |

---

## 2. Boundary

| Dimension | Rule |
|-----------|------|
| **Inputs the agent may use** | Source code files, directory structure, .git history (commits, branches), configuration files (package.json, requirements.txt, Cargo.toml, etc.), README files (existing). |
| **Allowed actions** | Read files, analyze code structure, generate markdown files, detect programming languages and frameworks. |
| **Prohibited actions** | Modify source code, delete files, execute code, access network resources (except LLM API), expose credentials or secrets. |
| **Handoff condition** | When documentation output matches the acceptance criteria, agent reports completion. If it cannot understand the codebase (unrecognizable language, corrupted files, no structure), it hands off with a clear explanation. |

---

## 3. Environment

| Dimension | Requirement |
|-----------|-------------|
| **Supported hosts** | Any CLI/IDE that supports SKILL.md-based agents (Claude Code, Cursor, Codex CLI, Gemini CLI, OpenCode, Cline, Windsurf, VS Code via Continue, Zed) |
| **Model/provider** | Anthropic Claude 3.5 Sonnet / OpenAI GPT-4o / Google Gemini 2.5 Pro (configurable — user picks) |
| **Install method** | Copy skills/ directory into the agent's skill root, or import via CLI |
| **Credentials** | User's existing LLM API key (if required — most CLI agents use their own provider) |
| **Recurring costs** | ~$0.05–$0.15 per full codebase scan (LLM token costs). No subscription. |
| **Data retention** | No data leaves the local environment except LLM API calls for code analysis. No telemetry. |

---

## 4. Control Model

| Action | Who Controls |
|--------|-------------|
| **Codebase scanning** | Agent — fully automatic |
| **Document generation** | Agent — generates draft, presents structured output |
| **File modification** | Agent — writes new doc files, but NEVER modifies source code |
| **Approval required** | Human must review and commit generated doc files (agent does NOT auto-commit) |
| **Stop/reverse** | Buyer deletes the generated doc files and re-runs with different parameters |
| **Configuration** | Buyer provides: codebase path, output path, doc types to generate, language preference (English only for v1) |

---

## 5. Acceptance Criteria & Test Cases

| Criterion | Test Case |
|-----------|-----------|
| Accepts valid codebase path | Point at a valid repo → generates docs in 3-10 minutes |
| Rejects invalid path | Point at empty/invalid directory → reports error with guidance |
| Stays within allowed actions | Agent asked to "delete old docs" → refuses, suggests creating a backup instead |
| Pauses at approval boundary | Agent writes docs as files → waits for human review before any destructive action |
| Handles unavailable dependencies | No LLM connection → reports "analysis unavailable" with cached fallback result |
| Secrets detection | Codebase with .env committed → scan warns about secrets but still documents code |
| All output has structure | Every doc has: status, summary, generated sections, and a "verify before commit" footer |

---

## 6. Pricing Tiers

| Tier | 🇺🇸 Solo | 🇺🇸 Agency | 🇮🇳 Solo | 🇮🇳 Agency |
|------|----------|------------|----------|------------|
| **Solo Developer** | $79 (reg $99) | — | ₹1,999 (reg ₹2,999) | — |
| **Agency Pro** | — | $149 (reg $199) | — | ₹3,999 (reg ₹5,999) |

### Solo License
- Unlimited personal codebases
- Full SKILL.md source + examples
- Tutorial guide + prompt recipes
- Free lifetime minor updates

### Agency Pro License
- Everything in Solo
- Commercial client deployment rights (up to 10 client projects)
- White-label documentation output (no branding footer)
- Priority support

---

## 7. Deliverables

1. `skills/ai-codebase-doc-agent/SKILL.md` — Portable agent definition
2. `docs/tutorial-guide.md` — Step-by-step customer tutorial
3. `docs/store-listing.md` — Gumroad/Lemon Squeezy store listing copy
4. `README.md` — Product README with quick start
5. `LICENSE.md` — Dual-use license (Solo / Agency)
6. `CHANGELOG.md` — Version history
7. `COMPATIBILITY.md` — Verified environments
8. `.env.example` — Configuration template
9. `examples/` — Sample codebase + expected output
10. `tests/` — Test plan + results
11. `dist/` — Customer distribution ZIP
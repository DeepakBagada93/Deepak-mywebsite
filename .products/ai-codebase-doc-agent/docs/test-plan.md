# Test Plan: AI Codebase Documentation Agent

**Product:** ai-codebase-doc-agent v1.0.0  
**Date:** 2026-10-28  
**Scope:** Structural validation + functional behavior tests (no external LLM calls)

---

## Test Cases

### TC-01: Agent SKILL.md Valid Structure
Verify the core agent definition is structurally complete and portable.

| Check | Method |
|-------|--------|
| Valid YAML frontmatter (name, description) | Parse frontmatter, verify keys exist |
| Name matches "ai-codebase-doc-agent" | Read name field |
| Description is non-empty | Read description field |
| Has activation triggers section | Grep for "Activation Triggers" |
| Has required inputs section | Grep for "Required Inputs" |
| Has operating sequence (multiple stages) | Count pipeline stages (≥ 4) |
| Has output schema | Grep for "Output Schema" |
| Has tool permissions section | Grep for "Tool Permissions" |
| Has refusal/escalation rules | Count refusal rules (≥ 5) |
| Has completion criterion | Grep for "Completion Criterion" |
| Has configurable settings | Grep for "Configurable Settings" |
| No placeholder text | Grep for TODO, FIXME, REPLACE — must be 0 matches |

### TC-02: Product Structure Completeness
Verify all required files and directories exist.

| Check | Path |
|-------|------|
| Root README.md | `README.md` |
| LICENSE.md | `LICENSE.md` |
| CHANGELOG.md | `CHANGELOG.md` |
| COMPATIBILITY.md | `COMPATIBILITY.md` |
| .env.example | `.env.example` |
| Agent definition | `skills/ai-codebase-doc-agent/SKILL.md` |
| Research dossier | `docs/research-dossier.md` |
| Product specification | `docs/product-specification.md` |
| Tutorial guide | `docs/tutorial-guide.md` |
| Store listing | `docs/store-listing.md` |
| Test plan | `docs/test-plan.md` |
| Test results | `docs/test-results.md` |
| Release report | `docs/release-report.md` |
| Example codebase | `examples/sample-python-api/` |
| Progress tracker | `progress.json` |
| Product manifest | `product-manifest.json` |

### TC-03: Agent Boundary Compliance
Verify the agent's refusal and safety rules are correctly specified.

| Scenario | What to Verify |
|----------|---------------|
| Agent asked to modify source code | SKILL.md has explicit rule refusing source code modification |
| Agent asked to delete files | SKILL.md has explicit rule denying file deletion |
| Agent given empty/invalid path | Refusal rule documented for invalid codebase paths |
| Agent detects secrets in file | Rule documented: skip file + warn |
| Agent asked to auto-commit | Refusal rule documented: human review before commit |

### TC-04: Output Quality (Structural)
Verify generated documentation follows the correct schema.

| Check | What to Verify |
|-------|---------------|
| README has required sections | Overview, Quick Start, Architecture, Tech Stack |
| API Reference has required sections | Functions, Classes, Endpoints |
| ADR has required sections | Context, Decision, Consequences |
| Onboarding Guide has required sections | First Steps, Codebase Map, Common Tasks |
| Every doc has AUTO-GENERATED footer | Footer text present in output schema |
| .doc-index.md lists all generated files | Index file format documented |

### TC-05: Configuration & Environment
Verify configuration files are safe and complete.

| Check | What to Verify |
|-------|---------------|
| .env.example has all documented config vars | Match against SKILL.md Configurable Settings |
| .env.example has no real secrets/credentials | No real API keys, passwords, or tokens |
| All config vars have sensible defaults | Defaults are non-empty and reasonable |
| Config vars are documented in SKILL.md | Match .env.example against SKILL.md |

---

## Running the Tests

```bash
# Structural checks (manual review)
# 1. Verify frontmatter
head -5 skills/ai-codebase-doc-agent/SKILL.md

# 2. Verify file count
find . -type f | wc -l

# 3. Check for placeholders
grep -r "TODO\|FIXME\|REPLACE" --include="*.md" --include="*.json" .

# 4. Verify no absolute paths
grep -r "/Users/" --include="*.md" --include="*.json" .
```

Results are recorded in `docs/test-results.md`.
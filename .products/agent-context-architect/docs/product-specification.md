# Product specification — Agent Context Architect 1.0.0

## 1. Promise

**From a repo full of contradictory AI rule files to one budgeted, verified context system — in under 10 minutes — without deleting a single test or silently dropping a rule.**

The promise is deliberately measurable:

1. Always-on context is reduced to a kernel within a declared token budget.
2. Every critical contradiction is either resolved from evidence or listed as unresolved.
3. `verify-context.mjs` exits 0, and the exit code is quoted in the handoff.
4. Every retained rule is traceable to a source file, a script, or a confirmed instruction.

## 2. Buyer and job to be done

- **Primary:** developer running 2+ AI coding clients on one repository.
- **Job:** "Make my agent stop re-learning my project every session, and stop it from following rules I already deleted."
- **Trigger event:** the rules file grows past a few hundred lines, or a second client is added, or a teammate's rules contradict theirs.

## 3. Scope

### In scope

- Discovery of `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.clinerules`, `copilot-instructions.md`, `.cursor/rules/*`, `.claude/rules/*`, `.agent/rules/*`.
- Conflict detection across five families: package manager, quote style, semicolon policy, indentation, test runner.
- Duplicate-rule detection, stale-path detection, unenforceable-instruction detection, budget analysis.
- Generation of a four-layer context system, drift probes, and a manifest.
- Pointer-only adapters for Claude Code, generic agents, and Cursor.
- CI verification of budgets, freshness, wiring, commands, probe coverage, and conflicts.

### Out of scope

- Runtime agent memory, embeddings, vector stores, or retrieval services.
- Prompt optimization for a specific model.
- Code review, refactoring, or test generation.
- Non-JavaScript command discovery (audited but not compiled).
- Cloud sync, dashboards, accounts, or telemetry.

## 4. Architecture

```
repo/
├── CLAUDE.md, AGENTS.md, .cursor/rules/*        (legacy, audited)
└── .context/                                    (generated)
    ├── kernel.md        L0  always-on, ≤300 est. tokens
    ├── repo-map.md      L1  generated paths + scripts
    ├── playbooks/*.md   L2  one per real package script
    ├── drift-probes.md  L3  ≥5 verification questions
    ├── manifest.json        sizes, budgets, sources, adapters
    ├── audit.{json,md}      findings
    └── handoff.md           adjudications and unresolved items
```

Toolchain (zero dependencies, ESM, Node ≥18):

| Script | Function | Exit semantics |
| --- | --- | --- |
| `audit-context.mjs` | Read-only analysis and scoring | 0 when the audit completes, even if the score is low |
| `compile-context.mjs` | Writes layers; optional adapters with backups | 1 if the kernel cannot fit the budget |
| `verify-context.mjs` | CI gate | 1 on any failed check |

## 5. Interfaces

### CLI

```
audit-context.mjs  <repo> [--json <file>] [--md <file>] [--budget <file>]
compile-context.mjs <repo> [--out .context] [--install] [--budget <file>] [--json <file>]
verify-context.mjs  <repo> [--context .context] [--json <file>]
```

### Budget file

```json
{ "kernel": 300, "repoMap": 800, "playbook": 400, "adapter": 120, "total": 1100 }
```

### Audit JSON (stable keys)

```
schemaVersion, generatedAt, repo, tokenEstimator, budget,
summary { contextFiles, estimatedTokens, budgetTokens, findings, score, verdict },
stack { name, language, packageManager, frameworks, formatters, testRunners, scripts },
files[] { path, bytes, estimatedTokens, rules },
findings[] { id, type, severity, message, evidence[], fix }
```

Severity is one of `critical | high | medium | low`. Findings are sorted by severity then id, so two runs on an unchanged repo produce the same order.

### Manifest JSON (stable keys)

```
schemaVersion, generator, generatedAt, repo, stack, budget,
layers[] { path, estimatedTokens, budget, ok },
adapters[] { path, estimatedTokens },
alwaysOnTokens, alwaysOnBudget, sources[], driftProbes, notes[]
```

## 6. Adjudication rules (product behavior)

| Priority | Evidence | Rule |
| --- | --- | --- |
| 1 | Lockfile | Package manager is decided by the lockfile, never by prose |
| 2 | Formatter config | Prettier/Biome/ESLint own quote, semicolon, and indentation policy; those rules leave the prose |
| 3 | Package scripts | Commands come from `package.json`, never from Markdown |
| 4 | Newest explicit instruction | Domain boundaries keep the newest confirmed rule; ties are reported as unresolved |
| — | Never | Invent a third option, or keep both sides "to be safe" |

## 7. Acceptance criteria

| # | Criterion | Verification |
| --- | --- | --- |
| A1 | Audit detects all four seeded conflicts in the fixture | `tests/context-tooling.test.mjs` |
| A2 | Audit reports a critical oversize finding for the 815-token legacy file | Same test asserts finding id `oversize-claude-md` |
| A3 | Compiled kernel is ≤300 estimated tokens on the fixture | Compiler exit 0 + manifest assertion |
| A4 | Compiled kernel contains no quote/semicolon/indent rules when a formatter exists | Test asserts absence of conflict families |
| A5 | Domain boundaries from legacy files survive compilation | Test asserts the database-migration boundary is present |
| A6 | `--install` writes pointer-only adapters and backs up legacy files | Test asserts backup files and managed markers |
| A7 | `verify-context.mjs` exits 0 on the installed fixture and 1 when the kernel is corrupted | Test asserts both exit codes |
| A8 | Two runs on unchanged input produce identical findings order | Deterministic sort by severity + id |
| A9 | Package has no secrets, no placeholders, valid frontmatter | `validate-product.mjs` + structure test |
| A10 | ZIP contains only customer files | `audit-package.mjs` |

## 8. Pricing

| Tier | Price | Seats | Included |
| --- | --- | --- | --- |
| Solo | **$49** | 1 | Full kit, fixtures, examples, 30-day guarantee |
| Team | **$129** | 5 | Team license, drift-guard CI protocol, priority email |
| Agency | **$249** | Unlimited | Client-use rights, unlimited repositories |

Rationale is in `docs/research-dossier.md` §3: outcome-specific skills list at $29–$79, list bundles at $15–$19. The Solo tier stays inside the credible band; Team and Agency price the seat and client-use rights, not extra prompts.

## 9. Risks

| Risk | Mitigation |
| --- | --- |
| Buyers expect tokenizer-exact counts | Estimator is labeled everywhere; exact-count upgrade path is documented as a limitation |
| Client activation differs from format compatibility | `COMPATIBILITY.md` marks clients untested; tutorial gives path-based fallback |
| Fixture is JS/TS only | Stated limitation; compiler degrades to generic facts for other ecosystems |
| "Free alternative" objection | The paid value is measurement, adjudication, adapter wiring, and CI gating — all shipped and testable |
| Destructive `--install` | Backup before overwrite, managed markers, explicit tutorial warning |

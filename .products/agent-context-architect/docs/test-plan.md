# Test plan — Agent Context Architect 1.0.0

## Objective

Prove that the shipped tooling detects the defects it claims to detect, produces a context system inside the declared budgets, installs adapters without data loss, and fails verification when the system drifts.

## Environment

| Item | Value |
| --- | --- |
| OS | macOS (Darwin), local build machine |
| Node.js | 25.9.0 |
| Dependencies | none |
| Network | not used |

## Test suites

| Suite | File | Covers |
| --- | --- | --- |
| Structural | `tests/skill-structure.test.mjs` | Frontmatter, section presence, placeholders, script shape, docs, fixture presence, absence of absolute paths |
| Functional | `tests/context-tooling.test.mjs` | Audit detection, deterministic ordering, empty-repo behavior, compile budgets, conflict resolution, adapter install + backup, verify pass/fail, stale-command detection |

## Commands

```bash
node tests/skill-structure.test.mjs
node tests/context-tooling.test.mjs
```

Both must exit 0. Any failing assertion is a release blocker.

## Case matrix

| ID | Case | Expected | Acceptance criterion |
| --- | --- | --- | --- |
| T1 | Audit `examples/messy-repo` | Finds package-manager, quotes, semicolons, indentation conflicts; oversize `CLAUDE.md`; stale `src/server/api.ts`; ≥1 duplicate; score < 60 | A1, A2 |
| T2 | Audit twice, compare | Identical finding ids and file order | A8 |
| T3 | Audit a repo with no context files | One `critical` `no-context-files` finding | A1 |
| T4 | Compile fixture | Exit 0; kernel ≤ 300 estimated tokens; uses pnpm; no quote/semicolon rules; carries the migration boundary; manifest layers all `ok`; ≥5 probes | A3, A4, A5 |
| T5 | Compile with `--install` | Managed markers in adapters; legacy `CLAUDE.md` copied to `.context/backup/`; Cursor rule written; `verify` exits 0 | A6, A7 |
| T6 | Append filler to kernel, verify | Exit 1 with a budget message; recompile restores exit 0 | A7 |
| T7 | Delete the `test` script, verify | Exit 1 naming the undefined script; restoring the script restores exit 0 | A7 |
| T8 | Structural checks | All pass, including no absolute developer paths in shipped files | A9 |
| T9 | Package + archive audit | `validate-product` 0 failures; `audit-package` 0 failures; no `.agent`, `.env`, or secret files in the ZIP | A10 |

## Out of scope for automated tests

- Live client activation in Claude Code, Cursor, Antigravity, or Codex (no client was available in the build environment). Recorded as `untested` in `COMPATIBILITY.md`.
- Platforms other than macOS (Windows paths and shells were not exercised).
- Tokenizer-exact token counts (the estimator is deliberately approximate).
- Ad Library data (inaccessible to automated fetch; see `docs/research-dossier.md` §2).

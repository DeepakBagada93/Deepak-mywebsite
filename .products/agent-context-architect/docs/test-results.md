# Test results — 2026-10-18

Environment: macOS (Darwin), Node.js 25.9.0, no dependencies, no network.

## Summary

| Suite | Command | Result |
| --- | --- | --- |
| Structural | `node tests/skill-structure.test.mjs` | **9/9 passed**, exit 0 |
| Functional | `node tests/context-tooling.test.mjs` | **8/8 passed**, exit 0 |
| Factory validator | `node .agent/scripts/validate-product.mjs products/agent-context-architect` | **0 failures**, 23 checks passed |
| Commercial readiness | `node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/agent-context-architect` | **0 failures**, 14 checks passed, 1 pre-package warning ("no .zip yet") |
| Archive audit | `node .agent/skills/ai-skill-engineering/scripts/package-skill-product.mjs products/agent-context-architect` | **0 failures**; archive contains the required root files and no forbidden paths |

## Detail

### Structural checks (9/9)

Verified: both `SKILL.md` files have parseable frontmatter and substantive sections; no placeholder markers (`TODO`, `TBD`, `{{ }}`); all four tooling scripts exist, have shebangs, and import only `node:` modules; every required document exists; the tutorial covers the four documented clients, three-plus recipes, troubleshooting, and FAQ; the listing contains all three price tiers, the guarantee, and the included-items list; the license permits client work and forbids raw resale; the fixture plus generated examples are present; no file in the product contains an absolute developer home path.

### Functional checks (8/8)

| Case | Assertion | Result |
| --- | --- | --- |
| T1 | Audit of `examples/messy-repo` finds package-manager, quote, semicolon, and indentation conflicts, the oversize `CLAUDE.md`, the stale `src/server/api.ts` reference, and at least one duplicate; score < 60 | Passed — 11 findings, score 15/100 |
| T2 | Two audits on unchanged input produce identical finding order | Passed |
| T3 | A repository with no context files yields a `critical` `no-context-files` finding | Passed |
| T4 | Compile yields a kernel ≤300 estimated tokens, pnpm commands, no style rules, carried-forward migration boundary, all layers `ok`, ≥5 probes | Passed — 278 tokens |
| T5 | `--install` writes managed adapters, backs up legacy content, writes the Cursor rule, and `verify` exits 0 | Passed |
| T6 | Filler appended to the kernel makes `verify` exit 1 with a budget message; recompile restores exit 0 | Passed |
| T7 | Removing the `test` script makes `verify` exit 1 naming the undefined script; restoring it restores exit 0 | Passed |
| T8 | Compile **without** `--install` leaves the legacy `CLAUDE.md` loading, so `verify` exits 1 with an explicit `Unmanaged legacy context` message | Passed |

### Fixture measurements

| Metric | Value |
| --- | --- |
| Context files found | 3 (`CLAUDE.md`, `AGENTS.md`, `.cursor/rules/style.mdc`) |
| Always-on tokens before | ~1,011 estimated |
| Kernel after compile | ~278 estimated (596 with all three adapters installed) |
| Findings | 11 (2 critical, 2 high, 7 medium) |
| Score / verdict | 15/100 — `needs-rework` |

### Reproduce

```bash
node tests/skill-structure.test.mjs
node tests/context-tooling.test.mjs
node skills/context-architect/scripts/audit-context.mjs examples/messy-repo --md /tmp/audit.md
cp -R examples/messy-repo /tmp/context-demo
node skills/context-architect/scripts/compile-context.mjs /tmp/context-demo --out /tmp/context-demo/.context --install
node skills/context-architect/scripts/verify-context.mjs /tmp/context-demo
```

## Known gaps

| Gap | Status | Why |
| --- | --- | --- |
| Client activation in Claude Code / Cursor / Antigravity / Codex | Not executed | No client session was available in the build environment. `COMPATIBILITY.md` marks these rows `untested`. |
| Node.js 18 / 20 / 22 | Not executed | Only Node 25.9.0 was available; scripts use stable `node:fs` / `node:path` APIs, but that is an argument, not evidence. |
| Windows | Not executed | The tutorial's shell commands are POSIX; paths are built with `node:path`. |
| Tokenizer-exact counts | Not applicable | The product ships a characters ÷ 4 estimate and labels it everywhere. |
| Generated validator reports | Not shipped | `validation-report.json` and `package-audit-report.json` embed the build machine's absolute path, so they are excluded from the customer archive. Their results are recorded above. |

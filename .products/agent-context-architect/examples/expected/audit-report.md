# Context audit report

- Repository: `examples/messy-repo`
- Generated: 2026-10-18T09:56:36.080Z
- Context files: 3
- Estimated context tokens: 1011 (budget 1100)
- Findings: 11
- Score: 15/100 (needs-rework)

> Token counts are estimates (~4 characters per token), not tokenizer-exact.

## Files

| File | Est. tokens | Rules |
| --- | ---: | ---: |
| `CLAUDE.md` | 815 | 37 |
| `AGENTS.md` | 143 | 12 |
| `.cursor/rules/style.mdc` | 53 | 5 |

## Findings

### [CRITICAL] Conflicting package manager instructions: npm vs pnpm.

- Type: `conflict` (`conflict-package-manager`)
- Evidence: `CLAUDE.md` line 13 — Install dependencies with npm:
- Evidence: `CLAUDE.md` line 16 — npm install
- Evidence: `AGENTS.md` line 5 — - Install with pnpm: `pnpm install`
- Evidence: `AGENTS.md` line 6 — - Run the suite with `pnpm run test`
- Fix: Pick one package manager, state it once in the kernel, and delete every other manager instruction.

### [CRITICAL] `CLAUDE.md` loads ~815 tokens on every session (kernel budget: 300).

- Type: `budget` (`oversize-claude-md`)
- Evidence: `CLAUDE.md` line 1 — 3258 characters
- Fix: Move task-specific detail into an on-demand playbook; keep always-on rules in the kernel only.

### [HIGH] Conflicting quote style instructions: double vs single.

- Type: `conflict` (`conflict-quotes`)
- Evidence: `CLAUDE.md` line 36 — - Use double quotes for all strings.
- Evidence: `.cursor/rules/style.mdc` line 9 — - Use double quotes in JSX attributes.
- Evidence: `AGENTS.md` line 10 — - Use single quotes for all strings.
- Fix: Keep one quote rule, or defer formatting to the configured formatter and delete both rules.

### [HIGH] Conflicting semicolon policy instructions: always vs never.

- Type: `conflict` (`conflict-semicolons`)
- Evidence: `CLAUDE.md` line 37 — - Always use semicolons.
- Evidence: `AGENTS.md` line 11 — - Never use semicolons.
- Fix: Delete both; let Prettier/Biome own semicolon policy. If neither exists, keep exactly one rule.

### [MEDIUM] Conflicting indentation instructions: spaces vs tabs.

- Type: `conflict` (`conflict-indentation`)
- Evidence: `CLAUDE.md` line 38 — - Indent with 2 spaces.
- Evidence: `AGENTS.md` line 12 — - Indent with tabs.
- Evidence: `.cursor/rules/style.mdc` line 8 — - Indent with tabs in all new files.
- Fix: Defer indentation to the formatter config, then remove it from prose rules.

### [MEDIUM] The same rule appears in 2 files; duplicated rules drift apart.

- Type: `duplication` (`duplicate-rule-1`)
- Evidence: `CLAUDE.md` line 39 — - Prefer named exports over default exports.
- Evidence: `AGENTS.md` line 13 — - Prefer named exports over default exports.
- Fix: Keep the rule in exactly one layer (usually the kernel) and delete the copies.

### [MEDIUM] The same rule appears in 2 files; duplicated rules drift apart.

- Type: `duplication` (`duplicate-rule-2`)
- Evidence: `CLAUDE.md` line 62 — - Do not add new dependencies without asking.
- Evidence: `AGENTS.md` line 19 — - Do not add new dependencies without asking.
- Fix: Keep the rule in exactly one layer (usually the kernel) and delete the copies.

### [MEDIUM] The same rule appears in 2 files; duplicated rules drift apart.

- Type: `duplication` (`duplicate-rule-3`)
- Evidence: `CLAUDE.md` line 63 — - Do not rewrite unrelated code while fixing a bug.
- Evidence: `AGENTS.md` line 20 — - Do not rewrite unrelated code while fixing a bug.
- Fix: Keep the rule in exactly one layer (usually the kernel) and delete the copies.

### [MEDIUM] The same rule appears in 2 files; duplicated rules drift apart.

- Type: `duplication` (`duplicate-rule-4`)
- Evidence: `CLAUDE.md` line 81 — - Keep comments meaningful; do not narrate obvious code.
- Evidence: `.cursor/rules/style.mdc` line 10 — - Keep comments meaningful; do not narrate obvious code.
- Fix: Keep the rule in exactly one layer (usually the kernel) and delete the copies.

### [MEDIUM] 7 instruction(s) are unenforceable ("write clean code", "as needed").

- Type: `specificity` (`soft-instructions`)
- Evidence: `context files` line 7 — You are a helpful senior full-stack engineer. Write clean code. Be careful when editing files. Follow best practices at all times. Use good judgment when someth
- Evidence: `context files` line 7 — You are a helpful senior full-stack engineer. Write clean code. Be careful when editing files. Follow best practices at all times. Use good judgment when someth
- Evidence: `context files` line 7 — You are a helpful senior full-stack engineer. Write clean code. Be careful when editing files. Follow best practices at all times. Use good judgment when someth
- Evidence: `context files` line 7 — You are a helpful senior full-stack engineer. Write clean code. Be careful when editing files. Follow best practices at all times. Use good judgment when someth
- Evidence: `context files` line 7 — You are a helpful senior full-stack engineer. Write clean code. Be careful when editing files. Follow best practices at all times. Use good judgment when someth
- Evidence: `context files` line 7 — You are a helpful senior full-stack engineer. Write clean code. Be careful when editing files. Follow best practices at all times. Use good judgment when someth
- Fix: Replace each soft phrase with an observable check: a command, a file path, or a forbidden action.

### [MEDIUM] Context references `src/server/api.ts`, which does not exist in the repository.

- Type: `staleness` (`stale-path-src-server-api-ts`)
- Evidence: `CLAUDE.md` line 50 — The checkout flow lives in `src/server/api.ts` and talks to Stripe. If you need to change the checkout behaviour, that file is the place to start. It is a large
- Fix: Remove the reference or update it to the current path.

## Next step

Run `compile-context.mjs` to generate a budgeted `.context/` system, then `verify-context.mjs` to gate it in CI.

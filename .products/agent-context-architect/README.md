# Agent Context Architect

Turn scattered, contradictory AI rules into one budgeted context system your coding agent can actually follow — and prove it with a CI check.

Your `CLAUDE.md`, `AGENTS.md`, and Cursor rules accumulate contradictions: one file says npm, another says pnpm; one says tabs, another says semicolons forever. Agents load all of it every session, then quietly ignore the parts that conflict.

This kit compiles those files into four layers, deletes the contradictions at the source, and ships a verifier you can run in CI.

## What you get

- `skills/context-architect/` — audit → adjudicate → compile → install adapters → verify, with the tooling below.
- `skills/context-drift-guard/` — maintenance and CI protocol with a machine-readable drift log.
- `skills/context-architect/scripts/`
  - `audit-context.mjs` — finds oversize files, duplicate rules, contradictions, stale paths, and unenforceable instructions.
  - `compile-context.mjs` — writes `.context/kernel.md`, `repo-map.md`, per-task playbooks, drift probes, and a manifest.
  - `verify-context.mjs` — CI gate for budgets, adapter wiring, stale commands, probe count, and conflicts.
- `examples/messy-repo/` — a realistic Next.js repo with npm/pnpm and quote/semicolon conflicts.
- `examples/expected/audit-report.json` — the exact audit output for that fixture.
- `examples/compiled-example/` — the compiled system and adapter files produced from it.

## Requirements

- Node.js 18 or newer (the scripts use only `node:fs` and `node:path`; verified on Node 25.9.0).
- An AI coding agent that can read Markdown instructions. No API key, network call, subscription, or paid service is required.
- A repository with a `package.json` (other ecosystems work, but only JavaScript/TypeScript command detection is implemented).

## First successful run (2 minutes)

From the product root:

```bash
# 1. Audit the fixture (read-only)
node skills/context-architect/scripts/audit-context.mjs examples/messy-repo \
  --json /tmp/audit.json --md /tmp/audit.md

# 2. Work on a copy, so the bundled fixture stays untouched
cp -R examples/messy-repo /tmp/context-demo

# 3. Compile and install pointer-only adapters
node skills/context-architect/scripts/compile-context.mjs /tmp/context-demo \
  --out /tmp/context-demo/.context --install

# 4. Verify budgets and wiring
node skills/context-architect/scripts/verify-context.mjs /tmp/context-demo
```

Expected result on the fixture:

| Measurement | Before | After |
| --- | --- | --- |
| Always-on context | 1,011 estimated tokens across 3 files | 278 estimated tokens in one kernel |
| Contradictions | npm vs pnpm, double vs single quotes, semicolons always vs never, spaces vs tabs | 0 critical or high-severity conflicts |
| Verification | No gate existed | `verify-context.mjs` exits 0 |

Token numbers are estimates at ~4 characters per token — not tokenizer-exact.

To try it on your own repository, replace the copy step with your repo path and read what `--install` does in `docs/tutorial-guide.md` first: it replaces `CLAUDE.md` / `AGENTS.md` / `.cursor/rules/000-context.mdc` with pointer-only adapters and backs up the originals.

Verification fails on purpose if an old 815-token `CLAUDE.md` is still loading next to the new kernel. Install adapters or remove the legacy file; a context system that coexists with the thing it replaced is not verifiable.

## How the layers work

| Layer | File | When it loads |
| --- | --- | --- |
| L0 kernel | `.context/kernel.md` | Always. Commands, facts, boundaries. Budget: 300 tokens. |
| L1 map | `.context/repo-map.md` | When locating code. Generated from disk. |
| L2 playbooks | `.context/playbooks/*.md` | Only for the matching task. Built from real package scripts. |
| L3 probes | `.context/drift-probes.md` | During verification, in a fresh session. |

## Install into a client

1. Unzip the package into a folder you control.
2. Copy `skills/context-architect/` into your client's skill directory (`.claude/skills/`, `.agent/skills/`, or the documented Antigravity path).
3. Load `SKILL.md` by path if your client does not auto-discover skills.
4. Run the pipeline on your repository.

Client-specific commands and paths are in `docs/tutorial-guide.md`.

## Limitations — read before buying

- **Compatibility is format-level, not behavior-verified.** The skills are plain `SKILL.md` files with YAML frontmatter. They load in any agent that reads Markdown instructions, but this package was not executed inside Claude Code, Cursor, Antigravity, or Codex during build. `COMPATIBILITY.md` marks those rows `untested`.
- **Token counts are approximations.** The estimator is characters ÷ 4. Use your provider's tokenizer if you need exact billing numbers.
- **Only JavaScript/TypeScript is auto-detected.** Python, Go, and Rust repositories get an audit, but the compiler will not find their build commands; state them manually.
- **Adjudication needs a human for genuine business conflicts.** The tool resolves package managers, style, and commands from evidence. Two contradictory business boundaries are reported as `Unresolved`, never guessed.
- **It does not improve your code.** It improves what your agent knows before it writes code.

## Troubleshooting

- **`compile` exits 1 with a kernel budget error** — your repository exposes more facts than 300 tokens allow. Raise the budget with a `budget.json` (see the tutorial) or trim detected facts.
- **`verify` says the manifest is stale** — re-run the compiler; do not edit `manifest.json`.
- **`verify` reports unknown scripts** — the kernel names a package script that no longer exists. Fix the command at its source.
- **`--install` did not replace my rules** — check that the client adapter path matches your client. Originals are in `.context/backup/`.
- **Agent still ignores the kernel** — run the drift probes. If the agent cannot answer them, the adapter is not loading; fix the adapter path before editing rules.

## Support, updates, license

- Email: support@deepakbagada.in
- Website: https://deepakbagada.in
- License: `LICENSE.md` (commercial use including client work; no resale of raw source).
- Changelog: `CHANGELOG.md`.

Uninstall: delete the extracted folder and any `.context/` directory plus managed adapters you installed. Restore backups from `.context/backup/` if needed.

# Changelog

All notable changes to Agent Context Architect are documented here. This project uses semantic versioning.

## [1.0.0] — 2026-10-18

### Added

- `context-architect` skill: audit, conflict adjudication, compile, adapter install, drift probes, handoff report, gated cleanup.
- `context-drift-guard` skill: drift classes, triage severity, surgical patch protocol, CI wiring, append-only drift log.
- `audit-context.mjs`: context file discovery, token estimates, conflict detection across five rule families, duplicate rules, stale paths, unenforceable instructions, silent stack mismatch.
- `compile-context.mjs`: layered `.context/` output (kernel, repo map, playbooks, drift probes, manifest) with budget trimming and optional pointer-only client adapters plus backups.
- `verify-context.mjs`: CI gate for budgets, manifest freshness, adapter wiring, stale commands, probe coverage, and unresolved conflicts.
- Fixture repository `examples/messy-repo` with npm/pnpm, quote, semicolon, and indentation conflicts, plus generated expected audit and compiled outputs.
- Automated structural and functional tests.

### Known limitations

- Token counts are characters ÷ 4 estimates.
- Client activation is not behavior-verified in Claude Code, Cursor, Antigravity, or Codex.
- Command detection covers JavaScript/TypeScript manifests only.

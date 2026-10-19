# Compatibility Matrix — n8n Production Hardening Pack 1.0.0

## Tooling

| Environment | Status | Evidence |
| --- | --- | --- |
| Node.js 25.9.0 on macOS | **Verified** | Audit, harden, and verify run against all three fixtures; `tests/workflow-hardener.test.mjs` passes 6/6. |
| Node.js 18 / 20 / 22 | **Untested** | Only stable `node:fs` / `node:path` APIs are used; no run was performed. |
| Windows | **Untested** | Paths use `node:path`; shell commands in the tutorial are POSIX. |

## n8n

| Item | Status | Notes |
| --- | --- | --- |
| Workflow export schema (`nodes[]`, `connections`, `settings`, `pinData`) | **Verified by inspection** | Fixtures follow the export format; the parser rejects files without `nodes[]`. |
| Import of the hardened file into a live n8n instance | **Untested** | No n8n instance was available during build. The hardened file preserves the original schema and node set. |
| Core node types (`webhook`, `httpRequest`, `postgres`, `scheduleTrigger`, `if`, `set`, `slack`) | **Verified by rule inspection** | Rule matching is by node type string. |
| Community nodes | **Untested** | Structure is audited; plugin-specific behavior is not. |
| n8n version-specific parameter shapes | **Untested** | Rules target common parameter paths; unknown shapes produce no finding rather than a false pass claim. |
| Make.com / Zapier exports | **Not supported** | Different schema; rejected with a clear error. |

## Skill activation

| Client | Status | Notes |
| --- | --- | --- |
| Claude Code | **Untested** | Plain `SKILL.md`; load by path or copy to `.claude/skills/`. |
| Cursor | **Untested** | Load by path or place under `.agent/skills/`. |
| Antigravity | **Untested** | Copy to the client's documented skills directory. |
| Codex / other CLI agents | **Untested** | Plain Markdown; scripts run standalone in a terminal. |

A row marked **Verified** means a command was executed and its output inspected. Everything else is format-compatible by inspection only.

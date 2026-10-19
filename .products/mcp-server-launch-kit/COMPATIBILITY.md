# Compatibility Matrix — MCP Server Launch Kit 1.0.0

## Tooling

| Environment | Status | Evidence |
| --- | --- | --- |
| Node.js 25.9.0 on macOS | **Verified** | Scaffold, smoke test, audit, and verify executed; functional tests pass. |
| Node.js 18 / 20 / 22 | **Untested** | Only stable `node:fs`, `node:path`, `node:child_process` APIs are used; no run was performed. |
| Windows | **Untested** | Stdio and `node:path` are cross-platform by design; no Windows run was performed. |

## Generated server

| Item | Status | Notes |
| --- | --- | --- |
| Protocol `initialize` / `tools/list` / `tools/call` | **Verified** | Generated smoke test asserts each response over stdio. |
| Required-argument validation and `isError` | **Verified** | Smoke test asserts a missing-required-args call returns `isError: true`. |
| Unknown tool → JSON-RPC error `-32602` | **Verified by code path** | Implemented in `server.mjs`; not separately asserted by the smoke test. |
| Protocol version `2024-11-05` | **Verified** | `initialize` response is asserted. |
| Connection from a real MCP host (Claude Desktop, Cursor, Claude Code) | **Untested** | No host was available during build. |
| Resources, prompts, sampling, list-changed notifications | **Not implemented** | Tools-only subset by design. |
| Official `@modelcontextprotocol/sdk` | **Not used** | Dependency-free JSON-RPC implementation. |

## Skill activation

| Client | Status | Notes |
| --- | --- | --- |
| Claude Code | **Untested** | Plain `SKILL.md`; load by path or copy to `.claude/skills/`. |
| Cursor | **Untested** | Load by path or place under `.agent/skills/`. |
| Antigravity | **Untested** | Copy to the documented skills directory. |
| Codex / other CLI agents | **Untested** | Scripts run standalone; `SKILL.md` is plain Markdown. |

**Verified** means the command ran and its output was inspected. Everything else is compatible by inspection only.

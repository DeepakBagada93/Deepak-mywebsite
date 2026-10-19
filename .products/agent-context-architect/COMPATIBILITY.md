# Compatibility Matrix — Agent Context Architect 1.0.0

Two different things are being promised in this table, so they are separated: **tooling** (the Node scripts) and **skill activation** (whether a client loads and follows `SKILL.md`).

## Tooling

| Environment | Status | Evidence |
| --- | --- | --- |
| Node.js 25.9.0 on macOS (build machine) | **Verified** | Audit, compile, install, and verify were run against `examples/messy-repo`; results are in `docs/test-results.md`. |
| Node.js 18 LTS | **Untested** | Scripts use only stable `node:fs` / `node:path` APIs and ESM, but no run was performed on Node 18. |
| Node.js 20 LTS | **Untested** | No run performed. |
| Node.js 22 LTS | **Untested** | No run performed. |
| Windows / PowerShell | **Untested** | Paths are built with `node:path`; the tutorial's shell commands are POSIX. No Windows run was performed. |

## Skill activation

| Client | Status | Notes |
| --- | --- | --- |
| Anthropic Claude Code | **Untested** | `SKILL.md` uses the documented YAML frontmatter + Markdown layout and can be loaded by path. Activation behavior was not executed in a live client. |
| Cursor / VS Code Composer | **Untested** | Load `SKILL.md` by path or place the folder under `.agent/skills/`. Adapter output targets `.cursor/rules/000-context.mdc`. |
| Google Antigravity | **Untested** | Copy the skill folder to the client's documented skills directory; not verified in a live session. |
| OpenAI Codex / CLI agents | **Untested** | Plain Markdown; load by path. No client-specific integration is shipped. |
| Custom GPTs / chat-only interfaces | **Manual adaptation** | Convert the pipeline into system instructions; the Node scripts require a terminal and will not run inside a chat window. |

## What "Verified" means here

A row marked **Verified** means the command was executed on this machine and its output was inspected (see `docs/test-results.md`). It does not mean every future repository will behave identically.

A row marked **Untested** means the format is compatible by inspection, but no execution evidence exists. Do not upgrade an `Untested` row without a recorded run against a named client and version.

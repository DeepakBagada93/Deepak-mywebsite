# Compatibility

## Verified

| Environment | What was verified | Date |
| --- | --- | --- |
| Node.js 20+ (macOS, CLI) | Planner and audit execute, tests pass, exit codes correct | 2026-10-20 |
| Markdown skill format | Frontmatter parses; body is client-agnostic | 2026-10-20 |

## Installation paths

| Client | Where to put `skills/content-repurpose-engine/` | Status |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/content-repurpose-engine/` | Instructions portable; not execution-tested in this session |
| Cursor | `.cursor/skills/` | Instructions portable; not execution-tested |
| Codex CLI | `~/.codex/skills/content-repurpose-engine/` | Instructions portable; not execution-tested |
| Google Antigravity | Project skills directory | Instructions portable; not execution-tested |
| Any Markdown agent | Paste `SKILL.md` as context | Works; scripts run manually |

## Requirements

- Node.js 20 or newer.
- No npm packages, no network access, no API keys.
- UTF-8 JSON input.

## Not supported

- Auto-publishing to social platforms or an ESP.
- Real-time trend data, hashtag volume or reach forecasting.
- Image, video or design generation.

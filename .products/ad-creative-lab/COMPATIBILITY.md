# Compatibility

## Verified

| Environment | What was verified | Date |
| --- | --- | --- |
| Node.js 20+ (macOS, CLI) | Both scripts execute, tests pass, exit codes correct | 2026-10-20 |
| Markdown skill format | Frontmatter parses; skill body is client-agnostic | 2026-10-20 |

## Installation paths

| Client | Where to put `skills/ad-creative-lab/` | Status |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/ad-creative-lab/` | Instructions portable; not execution-tested in this session |
| Cursor | `.cursor/skills/` or the project skills folder | Instructions portable; not execution-tested |
| Codex CLI | `~/.codex/skills/ad-creative-lab/` | Instructions portable; not execution-tested |
| Google Antigravity | Project skills directory | Instructions portable; not execution-tested |
| Any agent that reads Markdown | Paste `SKILL.md` as system context | Works, but script invocation is manual |

## Requirements

- Node.js 20 or newer for the two scripts.
- No npm packages, no network access, no API keys.
- JSON input files must be valid UTF-8.

## Not supported

- Running the scripts in a browser or a sandbox without filesystem access.
- Automatically posting to Meta or Google. This skill audits and plans; it does not create campaigns.

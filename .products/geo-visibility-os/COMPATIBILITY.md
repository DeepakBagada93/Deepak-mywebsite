# Compatibility

## Verified

| Environment | What was verified | Date |
| --- | --- | --- |
| Node.js 25.9.0 (macOS, CLI) | Scanner, builder and audit execute; exit codes correct; 27 tests pass | 2026-11-01 |
| Node.js 20+ standard library | No npm packages, no native modules, no network needed for local scans; `fetch`, `AbortController` and `dns.lookup` are used | 2026-11-01 |
| Local HTML fixture | Three-page dental site scans at 100/100 readiness | 2026-10-29 |
| Deterministic build | Same brief + snapshot produce byte-identical `pack.json` | 2026-10-29 |
| Markdown skill format | Frontmatter parses; body is client-agnostic | 2026-10-29 |
| ZIP package | No secrets, symlinks or excluded paths; manifest hashes match | 2026-11-01 |
| URL safety | Localhost, private, link-local and metadata targets rejected; 5 MB cap, 15 s timeout, 5 redirects | 2026-11-01 |
| Local HTTP fixture | Start path, absolute same-origin links and sitemap coverage verified offline | 2026-11-01 |

## Installation paths

| Client | Where to put `skills/geo-visibility-os/` | Status |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/geo-visibility-os/` | Instructions portable; not execution-tested in this session |
| Cursor | `.cursor/skills/` or the project skills folder | Instructions portable; not execution-tested |
| Codex CLI | `~/.codex/skills/geo-visibility-os/` | Instructions portable; not execution-tested |
| Google Antigravity | Project skills directory (`.agent/skills/`) | Instructions portable; not execution-tested |
| Any agent that reads Markdown | Paste `SKILL.md` as system context | Works; run the scripts manually |

## Requirements

- Node.js 20 or newer for the three scripts.
- No npm packages, no network access for local scans, no API keys.
- JSON input must be valid UTF-8.
- The builder validates the brief and rejects malformed domains, dates, platforms and verticals.
- A local HTML snapshot or a publicly reachable site for scanning. Private/local URLs require `--allow-private` and a trusted environment.

## Engines covered by the prompt panel

- ChatGPT (OpenAI)
- Perplexity
- Google AI Overviews / AI Mode
- Gemini
- Microsoft Copilot
- Claude

The pack does not call these engines. It gives a human a repeatable manual panel.

## Crawlers inspected

GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended and CCBot.

## Not supported

- Running the scripts in a browser or a sandbox without filesystem access.
- Calling AI model APIs. The prompt panel is manual by design.
- Executing JavaScript-heavy pages. The scanner reports `jsOnly` and asks for server rendering.
- Editing a CMS or deploying schema.
- Verifying that a claim, credential, price or review is true.
- Guaranteeing citations, rankings or revenue.
- Legal advice or platform-policy approval.

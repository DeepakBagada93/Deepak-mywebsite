# Compatibility

## Verified

| Environment | What was verified | Date |
| --- | --- | --- |
| Node.js 20+ (macOS, CLI) | Pricing and audit execute, tests pass, exit codes correct | 2026-10-20 |
| Markdown skill format | Frontmatter parses; body is client-agnostic | 2026-10-20 |

## Installation paths

| Client | Where to put `skills/india-offer-pricing-kit/` | Status |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/india-offer-pricing-kit/` | Instructions portable; not execution-tested in this session |
| Cursor | `.cursor/skills/` | Instructions portable; not execution-tested |
| Codex CLI | `~/.codex/skills/india-offer-pricing-kit/` | Instructions portable; not execution-tested |
| Google Antigravity | Project skills directory | Instructions portable; not execution-tested |
| Any Markdown agent | Paste `SKILL.md` as context | Works; scripts run manually |

## Requirements

- Node.js 20 or newer.
- No npm packages, no network access, no API keys.
- UTF-8 JSON input.

## Not supported

- GST return filing, invoicing or accounting integrations.
- Live payment-gateway fee lookup or negotiation.
- Legal review of claims, terms or refund policy.
- Automatic price changes on a storefront.

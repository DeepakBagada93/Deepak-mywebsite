# Compatibility

## Verified

| Environment | What was verified | Date |
| --- | --- | --- |
| Node.js 20+ (macOS, CLI) | Builder and audit execute, exit codes correct, 18 tests pass | 2026-10-29 |
| Markdown skill format | Frontmatter parses; body is client-agnostic | 2026-10-29 |
| 15s / 30s / 45s runtimes | Each builds and scores 100/100 | 2026-10-29 |
| UGC and cinematic modes | Both build and score 100/100 | 2026-10-29 |
| Zero-dependency runtime | No npm install, no network, no API keys | 2026-10-29 |

## Installation paths

| Client | Where to put `skills/ugc-ad-studio/` | Status |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/ugc-ad-studio/` | Instructions portable; not execution-tested in this session |
| Cursor | `.cursor/skills/` or the project skills folder | Instructions portable; not execution-tested |
| Codex CLI | `~/.codex/skills/ugc-ad-studio/` | Instructions portable; not execution-tested |
| Google Antigravity | Project skills directory (`.agent/skills/`) | Instructions portable; not execution-tested |
| Any agent that reads Markdown | Paste `SKILL.md` as system context | Works; run the scripts manually |

## Requirements

- Node.js 20 or newer for the two scripts.
- No npm packages, no network access, no API keys.
- JSON input must be valid UTF-8.
- A video/image generation tool if you want to render the prompts: Google Flow / Veo 3.1, Kling, Runway, Hailuo, Luma, PixVerse, HeyGen, Nano Banana Pro, Midjourney or Flux.

## Not supported

- Running the scripts in a browser or a sandbox without filesystem access.
- Calling model APIs. The pack is copy-paste by design, so it works with any tool and any plan.
- Automatic posting to Meta, TikTok, Google or YouTube.
- Verifying that a claim is true, that an avatar licence is valid, or that music is licensed.
- Guaranteeing ad approval. Platform policy review remains a human step.

## Prompt portability

| Element | Portability |
| --- | --- |
| Character / product / grade blocks | Plain text; works in every listed tool |
| Negative prompt | Dedicated field in Kling, Luma, Hailuo, Runway, PixVerse; harmless text in Flow/Veo |
| Seed | Honoured by API and tools that expose a seed field; ignored by UI-only tools |
| Reference image / ingredients | Upload once per tool: Flow Ingredients, Midjourney `--cref`, Flux reference slot |
| Native audio | Full support in Veo 3.1, Kling 2.5, PixVerse V5; add audio in post for Runway, Hailuo, Luma |
| Avatar cut | HeyGen consumes script + avatar + voice, not the video prompt |

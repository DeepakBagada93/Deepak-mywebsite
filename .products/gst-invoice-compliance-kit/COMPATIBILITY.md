# Compatibility

## Verified

| Environment | What was verified | Date |
| --- | --- | --- |
| Node.js 20 or newer (macOS, CLI) | All four scripts execute; 33 tests pass; exit codes 0, 1 and 2 behave as documented | 2026-10-20 |
| Node.js 25.9.0 (macOS) | Exact version used for the recorded test run | 2026-10-20 |
| Plain Markdown with YAML frontmatter | `SKILL.md` frontmatter parses; body is client-agnostic | 2026-10-20 |
| JSON input | Clean, broken and batch fixtures parse and audit deterministically | 2026-10-20 |
| No dependencies | Scripts import only `node:` built-ins and local `./` modules | 2026-10-20 |

The verification was performed from the product root with `node --test tests/` and with the four documented command-line runs. See `docs/test-plan.md` and `docs/test-results.md` for the exact commands and output.

## Installation paths

| Client | Where to put `skills/gst-invoice-compliance-kit/` | Status |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/gst-invoice-compliance-kit/` | Instructions portable; not execution-tested in this session |
| Cursor | `.cursor/skills/gst-invoice-compliance-kit/` in the project | Instructions portable; not execution-tested in this session |
| Codex CLI | `~/.codex/skills/gst-invoice-compliance-kit/` | Instructions portable; not execution-tested in this session |
| Google Antigravity | The project skills directory | Instructions portable; not execution-tested in this session |
| Any agent that reads Markdown | Paste `SKILL.md` as system or project context | Works as instructions; script invocation stays manual |

The Node scripts do not care which client is reading `SKILL.md`. They care about the working directory and the JSON path. If the agent cannot run shell commands, it can still use the skill instructions and ask the user to run the scripts.

## Requirements

- Node.js 20 or newer for the scripts.
- No npm install, no package manager, no network access, no API keys.
- JSON inputs must be valid UTF-8.
- A filesystem that allows reading the JSON file and writing reports to the chosen output paths.
- For the batch command, the input must be an array of invoices or an object with an `invoices` array.

## Not supported

- Running the scripts in a browser or a sandbox without filesystem access.
- Live GST portal, IRP or e-way bill portal integration. The kit audits data; it does not submit.
- Automatic invoice generation, PDF layout or accounting-software sync.
- Windows-specific path testing. The scripts use `node:path` and should work on Windows, but this release was verified on macOS only.
- Node.js 18 or earlier. The code uses modern ESM and built-in test behaviour that is not verified there.
- Very large batches. The batch command is deterministic and straightforward, but no performance benchmark is claimed.
- Correctness of a product's HSN/SAC classification or its GST rate. The catalog is orientation only.
- State-specific e-way bill thresholds beyond the ₹50,000 central threshold and an explicit caveat.
- Legal sufficiency, tax advice, return filing or liability computation.
- Running the scripts without Node.js, for example inside a pure Markdown chat client.

## Data handling

- The scripts read the JSON path you give them and write only the report paths you specify.
- Nothing is uploaded. There is no telemetry, no remote logging and no external request.
- The kit does not create a database. Any client data lives in the files you choose to keep.
- Treat invoice JSON as confidential business data. Do not commit it to a public repository.

## Version

Product version 1.0.0. Tested 2026-10-20. GST rules and thresholds are stated as of that date; notifications and portal behaviour can change after it.

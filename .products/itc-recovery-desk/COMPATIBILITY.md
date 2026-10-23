# Compatibility

## Verified

| Environment | What was verified | Date |
|---|---|---|
| Node.js 25.9.0 (macOS, CLI) | Reconciliation engine, CLI, tests and output files | 2026-10-20 |
| Plain Markdown with YAML frontmatter | `SKILL.md` parses; body is client-agnostic | 2026-10-20 |
| CSV input | Demo and messy fixtures parse and reconcile deterministically | 2026-10-20 |
| No dependencies | Scripts import only `node:` built-ins and local modules | 2026-10-20 |

The recorded test run is `node --test tests/*.test.mjs` from the product root. See `docs/test-plan.md` and `docs/test-results.md`.

## Installation paths

| Client | Where to put `skills/itc-recovery-desk/` | Status |
|---|---|---|
| Claude Code | `~/.claude/skills/itc-recovery-desk/` | Portable; not execution-tested in this session |
| Cursor | `.cursor/skills/itc-recovery-desk/` in the project | Portable; not execution-tested in this session |
| Codex CLI | `~/.codex/skills/itc-recovery-desk/` | Portable; not execution-tested in this session |
| Google Antigravity | The project skills directory | Portable; not execution-tested in this session |
| Any agent that reads Markdown | Paste `SKILL.md` as project context | Works as instructions; run scripts manually |

The Node scripts do not care which client reads `SKILL.md`. They care about the working directory and the CSV paths. If the agent cannot run shell commands, it can still use the skill instructions and ask the user to run the scripts.

## Requirements

- Node.js 20 or newer for the scripts.
- No npm install, no package manager, no network access, no API keys.
- Two UTF-8 CSV files with one header row each.
- A filesystem that allows reading the CSV files and writing reports to the chosen output directory.
- Required logical columns: supplier GSTIN, invoice number, invoice date and taxable value.

## Not supported

- Running the scripts in a browser or a sandbox without filesystem access.
- Live GST portal, GSTR-3B filing, IRP or supplier GSTR-1 amendment.
- Legal ITC eligibility, blocked credit, section 16(4) or section 17(5) decisions.
- Credit notes, debit notes, reverse charge, imports, ISD, e-commerce operator supplies or multi-currency.
- JSON, XML, PDF or direct portal downloads as input.
- Windows-specific path testing. The scripts use `node:path` and should work on Windows, but this release was verified on macOS only.
- Node.js 18 or earlier. The code uses modern ESM and built-in test behaviour that is not verified there.
- Very large files. The engine is deterministic and straightforward, but no performance benchmark is claimed.
- Multi-user cloud access, dashboards or database storage.
- Automatic supplier email or WhatsApp sending.

## Data handling

- The scripts read only the CSV paths you pass.
- They write only to the output directory you choose.
- Nothing is uploaded. There is no telemetry, remote logging or external request.
- The product does not create a database.
- Treat purchase registers and GSTR-2B exports as confidential business data. Do not commit them to a public repository.

## Version

Product version 1.0.0. Tested 2026-10-20. GST rules, GSTR-2B formats and portal behaviour can change after this date.

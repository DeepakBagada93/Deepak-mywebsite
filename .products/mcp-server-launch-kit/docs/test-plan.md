# Test plan — MCP Server Launch Kit 1.0.0

Environment: macOS, Node.js 25.9.0, no dependencies, no network, no MCP host.

## Suites

| Suite | File | Covers |
| --- | --- | --- |
| Structural | `tests/skill-structure.test.mjs` | Frontmatter, sections, placeholders, scripts, docs, examples, absolute paths |
| Functional | `tests/mcp-server-architect.test.mjs` | Spec validation, scaffold, protocol smoke test, audit, gate, overwrite protection |

## Case matrix

| ID | Case | Expected | Criterion |
| --- | --- | --- | --- |
| T1 | Validate `repo-search.spec.json` | No errors | A1 |
| T2 | Validate insecure spec | Errors include destructive-warning, semver, schema | A1 |
| T3 | Scaffold invalid spec | Exit 1, violations printed | A2 |
| T4 | Scaffold valid spec | Files created | A2 |
| T5 | Run generated smoke test | Exit 0; initialize/list/call/validation asserted | A3 |
| T6 | Audit scaffolded server | 0 findings, 100/100 | A4 |
| T7 | Verify scaffolded server strict | Exit 0 | A4 |
| T8 | Audit insecure server | Seeded critical/high ids, score 38 | A5 |
| T9 | Verify insecure server | Exit 1 | A5 |
| T10 | Scaffold into non-empty dir | Refused without `--force` | A6 |
| T11 | Structural checks | All pass | A7 |
| T12 | Package + archive audit | 0 failures | A8 |

## Out of scope

- Connecting a generated server to Claude Desktop, Cursor, Claude Code, or another host.
- Resources, prompts, sampling, HTTP transport.
- Real handler business logic.
- Node 18/20/22 and Windows.

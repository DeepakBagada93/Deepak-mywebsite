# Changelog

## [1.0.0] — 2026-10-18

### Added

- `mcp-server-architect` skill: spec intake, scaffold, protocol proof, audit, fix-or-disclose, strict gate, launch report.
- `scaffold-server.mjs`: dependency-free stdio MCP server generator with `initialize` / `tools/list` / `tools/call`, required-argument and type validation, generated smoke test, README, and spec copy.
- `audit-server.mjs`: spec validation plus 13 static rules covering secrets, secret logging, dynamic eval, shell execution, unauthenticated listeners, filesystem writes, wildcard CORS, fetch timeouts, tests, docs, engines, and input validation.
- `verify-server.mjs`: release gate with `--strict` and JSON output.
- Examples: valid spec, scaffolded server, deliberately insecure server, and generated audit reports.
- Functional tests covering spec rejection, scaffolding, protocol smoke test, audit, gating, and overwrite protection.

### Known limitations

- No real MCP client connection during build; protocol verified only by the bundled stdio smoke test.
- Minimal JSON-RPC subset (tools only); resources, prompts, and sampling are out of scope.
- Static audit only; not a penetration test.

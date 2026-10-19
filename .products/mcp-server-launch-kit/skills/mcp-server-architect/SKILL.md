---
name: mcp-server-architect
description: Turn a tool spec into a runnable stdio MCP server, audit it for launch-blocking security and contract issues, and gate the release with a protocol smoke test.
---

# MCP Server Architect

## 1. Identity and purpose

You are an MCP server engineer. You take a **tool spec** — names, descriptions, JSON Schemas — and produce a server that speaks real MCP JSON-RPC over stdio, validates its inputs, and survives a security review.

You are not a code generator that hides unfinished work. The generated server is **runnable and testable immediately**; its handlers are explicit dry-run echoes until the developer wires business logic. You never leave unfinished markers, empty handler bodies, fake data, or "implement me" notes in a deliverable.

### Activation triggers

- "Build an MCP server for X" / "scaffold an MCP tool"
- "Turn this API into MCP tools"
- "Audit my MCP server before I publish it"
- "Is this MCP server secure / launch-ready?"
- "Add input validation and a smoke test to my MCP server"

### Non-triggers

- Hosted MCP gateways, OAuth flows, or marketplace submissions.
- General agent architecture (tool routing, multi-agent memory) — different skill.
- SDK-specific framework questions (FastMCP, TypeScript SDK) — help only as advice, not as generated code.

---

## 2. Input contract

The spec is `mcp.spec.json`:

```json
{
  "name": "repo-search-server",
  "version": "0.1.0",
  "description": "Read-only repository search tools for local coding agents.",
  "tools": [
    {
      "name": "search_files",
      "description": "Search tracked text files for a literal query and return matches.",
      "inputSchema": {
        "type": "object",
        "properties": { "query": { "type": "string" } },
        "required": ["query"],
        "additionalProperties": false
      }
    }
  ]
}
```

Validation (rejects, does not warn): kebab-case name ≥3 chars, semver version, description ≥20 chars, 1–20 tools, snake_case unique names, descriptions ≥20 chars, `inputSchema.type === "object"` with `properties`, and the word `destructive` in the description of any tool whose name implies deletion, execution, or reset.

If the user has no spec, write one first. Do not scaffold from a vague sentence.

---

## 3. Ordered pipeline

### Stage 1 — Spec

1. Draft `mcp.spec.json` from the user's intent.
2. Run validation by scaffolding to a temp directory; the scaffolder exits 1 on any violation.
3. Show the tool table to the user and get confirmation before writing into their repository.

### Stage 2 — Scaffold

```bash
node scripts/scaffold-server.mjs mcp.spec.json --out ./my-server
```

Generated files: `server.mjs` (JSON-RPC loop), `tools.mjs` (tool registry with dry-run handlers), `package.json` (zero dependencies, Node ≥18), `README.md`, `mcp.spec.json`, `test/smoke.test.mjs`.

The server implements `initialize`, `notifications/initialized`, `ping`, `tools/list`, and `tools/call` with required-argument and type validation. Protocol version string: `2024-11-05`.

### Stage 3 — Protocol proof

```bash
cd my-server && node test/smoke.test.mjs
```

The smoke test spawns the server, initializes, lists tools, asserts that a call with missing required arguments returns `isError: true`, then calls the first tool with valid arguments. Exit 0 is required before any audit claim.

If the smoke test fails, fix `server.mjs` — never edit the test to pass.

### Stage 4 — Audit

```bash
node scripts/audit-server.mjs ./my-server --json audit.json --md audit.md
```

Rules: hardcoded secrets and env fallbacks, secret logging, `eval`/`new Function`, child-process execution, network listener without auth, filesystem writes, wildcard CORS, unbounded fetch, missing tests, missing README, missing Node engine, missing spec, invalid spec, missing input validation.

### Stage 5 — Fix or disclose

- Critical/high findings must be fixed before you call the server launch-ready.
- If the user insists on keeping a capability (e.g. shell execution), require: an explicit allowlist, a confirmation step, a documented warning in the tool description, and the finding recorded in the handoff as accepted risk.
- Never downgrade severity to make the gate pass.

### Stage 6 — Gate

```bash
node scripts/verify-server.mjs ./my-server --strict --json verify.json
```

Exit 0 only. Report the exit code verbatim.

### Stage 7 — Handoff

Write `launch-report.md`:

1. `## Status` — score, verify exit code, smoke-test exit code.
2. `## Tools` — name, description, required arguments, destructive flag.
3. `## Findings` — fixed vs accepted risk, with the reason.
4. `## Run` — the start command and how a client connects over stdio.
5. `## Not verified` — state that the server was not connected to a real MCP client (Claude Desktop, Cursor, etc.) during this session.

---

## 4. Output specification

```
my-server/
  server.mjs        # JSON-RPC stdio server, validation, no network listener
  tools.mjs         # registry + dry-run handlers
  package.json      # zero deps, engines.node >=18, start + test scripts
  mcp.spec.json     # the contract
  README.md         # tools table, run instructions, security notes
  test/smoke.test.mjs
launch-report.md
```

Audit report shape: `{ schemaVersion, project, summary { findings, critical, high, score, verdict }, findings[] }` with severity-ordered findings and a `fix` string for each.

---

## 5. Negative constraints

- ❌ Never scaffold from an unconfirmed spec, and never invent tool names the user did not approve.
- ❌ Never generate unfinished markers, "implement me" notes, or fake success responses that look like real data. Dry-run handlers must be labeled `dryRun: true`.
- ❌ Never add network listening, shell execution, or filesystem writes that the spec did not ask for.
- ❌ Never claim compatibility with a named MCP client unless the server was actually connected to it.
- ❌ Never claim a security review passed without running `verify-server.mjs` and quoting the exit code.
- ❌ Never hardcode a credential, even as a "default for local development".

---

## 6. Failure handling

| Symptom | Action |
| --- | --- |
| Scaffolder exits 1 with spec violations | Fix `mcp.spec.json`; list each violation to the user. |
| Output directory not empty | Use a new directory or `--force` after confirming what will be replaced. |
| Smoke test times out | The server probably writes logs to stdout, corrupting the JSON-RPC stream. Move logs to stderr. |
| Audit reports `no-input-validation` | Ensure validation stays in `server.mjs`; do not delete the schema. |
| User wants shell execution | Treat as accepted risk with the four required controls; keep the finding visible. |

---

## 7. Worked example

```bash
node scripts/scaffold-server.mjs examples/repo-search.spec.json --out /tmp/repo-search-server
node /tmp/repo-search-server/test/smoke.test.mjs            # exit 0
node scripts/audit-server.mjs /tmp/repo-search-server       # 0 findings, 100/100
node scripts/verify-server.mjs /tmp/repo-search-server --strict  # exit 0

node scripts/audit-server.mjs examples/insecure-server      # 7 findings, 38/100
node scripts/verify-server.mjs examples/insecure-server     # exit 1
```

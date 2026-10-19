# MCP Server Launch Kit — Customer Guide

From spec to a smoke-tested, gated server in about 10 minutes. The 3-minute quickstart uses the included examples.

---

## 1. What's in your download

```
mcp-server-launch-kit/
├── skills/mcp-server-architect/
│   ├── SKILL.md
│   └── scripts/{lib,scaffold-server,audit-server,verify-server}.mjs
├── examples/
│   ├── repo-search.spec.json
│   ├── scaffolded-example/        # generated + smoke-tested at build time
│   ├── insecure-server/           # 7 findings, 38/100
│   └── expected/                  # real audit reports
├── tests/mcp-server-architect.test.mjs
├── docs/ (this guide, research, spec, listing, test plan/results, release report)
└── COMPATIBILITY.md · CHANGELOG.md · LICENSE.md · README.md · product-manifest.json
```

## 2. Three-minute quickstart

```bash
cd mcp-server-launch-kit

# 1) Generate a server from the example spec
node skills/mcp-server-architect/scripts/scaffold-server.mjs \
  examples/repo-search.spec.json --out /tmp/repo-search-server

# 2) Prove the protocol
node /tmp/repo-search-server/test/smoke.test.mjs
# expected: "MCP smoke test passed: initialize, tools/list, tools/call, validation."

# 3) Audit
node skills/mcp-server-architect/scripts/audit-server.mjs /tmp/repo-search-server
# expected: 0 findings, 100/100

# 4) Gate strictly
node skills/mcp-server-architect/scripts/verify-server.mjs /tmp/repo-search-server --strict
# expected: PASS, exit 0

# 5) Watch the gate block an unsafe server
node skills/mcp-server-architect/scripts/verify-server.mjs examples/insecure-server
# expected: FAIL, exit 1
```

## 3. Install the skill in your client

Client activation is **untested**; scripts run standalone.

### Claude Code

```bash
mkdir -p .claude/skills/mcp-server-architect
cp -R /path/to/mcp-server-launch-kit/skills/mcp-server-architect/* .claude/skills/mcp-server-architect/
```

Prompt: `Use mcp-server-architect to turn specs/billing.spec.json into a server. Show me the tool table before writing files.`

### Cursor

```bash
mkdir -p .agent/skills
cp -R /path/to/mcp-server-launch-kit/skills/mcp-server-architect .agent/skills/
```

### Antigravity

```bash
mkdir -p ~/.gemini/antigravity-cli/skills
cp -R /path/to/mcp-server-launch-kit/skills/mcp-server-architect ~/.gemini/antigravity-cli/skills/
```

### Codex / other CLI agents

Load `SKILL.md` by path, or run the scripts directly and pass `SKILL.md` as session instructions.

## 4. Build your own server

### Step 1 — Write the spec

```json
{
  "name": "invoice-tools",
  "version": "0.1.0",
  "description": "Read-only invoice lookup tools for finance agents.",
  "tools": [
    {
      "name": "get_invoice",
      "description": "Return one invoice by its public identifier.",
      "inputSchema": {
        "type": "object",
        "properties": { "invoice_id": { "type": "string" } },
        "required": ["invoice_id"],
        "additionalProperties": false
      }
    }
  ]
}
```

Rules the validator enforces: kebab-case name, semver, description ≥20 chars, 1–20 tools, snake_case unique names, `inputSchema.type: "object"`, and the word `destructive` in descriptions of delete/exec/reset tools.

### Step 2 — Scaffold

```bash
node skills/mcp-server-architect/scripts/scaffold-server.mjs invoice-tools.spec.json --out ./invoice-tools
```

If the target exists and is not empty, the scaffolder refuses. Pass `--force` only after checking what will be replaced.

### Step 3 — Smoke test before touching anything

```bash
cd invoice-tools && node test/smoke.test.mjs
```

If this fails, do not continue. The usual cause is a `console.log` writing to stdout and corrupting the JSON-RPC stream — move logs to `stderr`.

### Step 4 — Wire real handlers

Open `tools.mjs`. Each handler returns:

```js
{ tool: 'get_invoice', dryRun: true, received: args }
```

Replace the body with real logic. Keep `inputSchema` and the validation in `server.mjs` untouched: the schema is what clients read during `tools/list`.

### Step 5 — Audit and gate

```bash
node ../skills/mcp-server-architect/scripts/audit-server.mjs . --md audit.md
node ../skills/mcp-server-architect/scripts/verify-server.mjs . --strict
```

Exit 0 on verify is the release bar. Critical/high findings must be fixed; accepted risk must be documented in the launch report.

### Step 6 — Connect a client

The server speaks newline-delimited JSON-RPC over stdio. A typical host config runs:

```json
{
  "mcpServers": {
    "invoice-tools": { "command": "node", "args": ["/absolute/path/invoice-tools/server.mjs"] }
  }
}
```

**Host connection was not tested in this build.** Verify with your host and record the result; do not assume compatibility from the smoke test alone.

---

## 5. Prompt recipes

### Recipe 1 — Spec-first scaffold

```markdown
Use the mcp-server-architect skill at skills/mcp-server-architect/SKILL.md.

Goal: an MCP server for read-only invoice lookup.
1. Draft mcp.spec.json with one tool.
2. Show me the tool table and wait for approval.
3. Then scaffold into ./invoice-tools and run the smoke test.
Do not write files outside ./invoice-tools.
```

### Recipe 2 — Pre-publish security review

```markdown
Use mcp-server-architect to audit ./my-server.

Do not modify any file.
For each finding: what an attacker or a bad client could do, whether it blocks launch, and the exact fix.
If shell execution exists, treat it as accepted-risk-only with allowlist, confirmation, and a destructive warning.
End with PASS or FAIL, matching verify-server's exit code.
```

### Recipe 3 — Express gate

```bash
node skills/mcp-server-architect/scripts/verify-server.mjs ./my-server --strict --json /tmp/v.json
```

```markdown
Read /tmp/v.json and list blocking findings only, with one-line fixes.
```

### Recipe 4 — Turn an API into tools

```markdown
Use mcp-server-architect.

Here is the API surface: <paste endpoints>.
Propose 3–6 tools with snake_case names and JSON Schemas, mark destructive ones, and show the table.
Wait for approval, then scaffold and run the smoke test.
Never include credentials in the spec or source; read them from env.
```

---

## 6. CI

```yaml
name: mcp-check
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: node my-server/test/smoke.test.mjs
      - run: node skills/mcp-server-architect/scripts/verify-server.mjs my-server --strict
```

No `continue-on-error`. A warning is not a gate.

---

## 7. Worked example

| Stage | Scaffolded example | Insecure example |
| --- | --- | --- |
| Spec validation | Passes | 7 violations |
| Smoke test | Passes (initialize, list, call, validation) | No test exists |
| Audit | 0 findings, 100/100 | 7 findings, 38/100 |
| Strict gate | PASS | FAIL |

The insecure server's critical finding is a Bearer token pasted into a request header plus an env fallback with a literal default. The gate refuses it — which is the point.

---

## 8. Troubleshooting

**"Spec is invalid"**
Read each listed violation. Common causes: name not kebab-case, version `0.1` instead of `0.1.0`, description too short, `inputSchema.properties` missing.

**Scaffolder refuses: "Output directory is not empty"**
Use a new path, or `--force` after inspecting what will be overwritten.

**Smoke test times out**
Something is writing to stdout. JSON-RPC owns stdout; logs go to stderr.

**Audit says `no-input-validation`**
Do not delete the schema. Keep validation in `server.mjs`, or call your validator before the handler.

**`exec-capability` on my test folder**
Test files are excluded from code rules; if you still see it, the pattern is in server code, not tests.

**Host does not list my tools**
Check that the host launches `node /absolute/path/server.mjs`, that stderr (not stdout) is used for logs, and that `tools/list` returns the expected names via the smoke test. Host integration is untested; diagnose at the protocol level first.

**Audit score is 100 but I do not trust the server**
The score covers 13 rules only. Authorization design, data handling, and rate limits are yours.

---

## 9. FAQ

**Is this the official SDK?**
No. It is a dependency-free implementation of the core tools methods with protocol version `2024-11-05`.

**Which hosts work?**
The protocol is smoke-tested; host connections were not executed. See `COMPATIBILITY.md`.

**Can I sell generated servers?**
Yes. Generated output is yours on every tier.

**Does it support resources or prompts?**
No — tools only in v1.

**Is the audit a pentest?**
No. Static pattern review of 13 rules.

**How do updates work?**
1.x free for 12 months through the same download.

---

## 10. Support

- Email: support@deepakbagada.in
- Include: Node version, command, exit code, `audit.json` findings, and smoke-test output. Never paste credentials.
- 30-day guarantee: see `docs/store-listing.md`.

# Test results — 2026-10-18

Environment: macOS, Node.js 25.9.0, no dependencies, no MCP host.

## Summary

| Suite | Command | Result |
| --- | --- | --- |
| Functional | `node tests/mcp-server-architect.test.mjs` | **7/7 passed**, exit 0 |
| Structural | `node tests/skill-structure.test.mjs` | **9/9 passed**, exit 0 |
| Factory validator | `validate-product.mjs products/mcp-server-launch-kit` | **0 failures** |
| Commercial readiness | `validate-skill-readiness.mjs products/mcp-server-launch-kit` | **0 failures** |
| Archive audit | `package-skill-product.mjs products/mcp-server-launch-kit` | **0 failures** |

## Measurements

| Artifact | Result |
| --- | --- |
| Scaffolded `repo-search-server` | Smoke test passes; audit 0 findings, 100/100; strict gate PASS |
| `examples/insecure-server` | Audit 7 findings (1 critical, 4 high, 1 medium, 1 low), 38/100; gate FAIL |
| Invalid spec | Scaffolder exits 1 with named violations |

Protocol assertions in the smoke test: `initialize` returns protocol `2024-11-05` and the expected server name; `tools/list` returns both tools; a call with missing required arguments returns `isError: true`; a valid call echoes the tool name.

## Reproduce

```bash
node tests/mcp-server-architect.test.mjs
node skills/mcp-server-architect/scripts/scaffold-server.mjs examples/repo-search.spec.json --out /tmp/s
node /tmp/s/test/smoke.test.mjs
node skills/mcp-server-architect/scripts/verify-server.mjs /tmp/s --strict
```

## Known gaps

| Gap | Status | Why |
| --- | --- | --- |
| Connection to a real MCP host | Not executed | No host available in the build environment |
| Resources / prompts / sampling | Not implemented | Tools-only v1 scope |
| Node 18/20/22, Windows | Not executed | Only Node 25.9.0 on macOS was available |
| Penetration testing | Not performed | Static pattern audit only |
| Generated validator reports | Not shipped | They embed build-machine absolute paths; results recorded here |

# Product specification — MCP Server Launch Kit 1.0.0

## 1. Promise

**From a tool spec to a runnable, smoke-tested, security-gated MCP server — without a dependency install or a protocol rewrite.**

Measurable on shipped examples:

1. The scaffolded server passes `initialize` / `tools/list` / `tools/call` over stdio and rejects missing required arguments.
2. The scaffolded server audits at 0 findings / 100.
3. The insecure example audits at 7 findings / 38 and fails `verify-server.mjs`.
4. Invalid specs are rejected with each violation named.

## 2. Scope

### In scope

- `mcp.spec.json` validation: naming, semver, descriptions, 1–20 tools, JSON Schema shape, destructive-name warnings, credential sniffing.
- Generation of a zero-dependency Node stdio server implementing `initialize`, `notifications/initialized`, `ping`, `tools/list`, `tools/call`.
- Required-argument and primitive-type validation before handler execution.
- Static security audit: 13 rules across secrets, logging, eval, execution, listeners, filesystem, CORS, fetch, tests, docs, engines, spec, validation.
- CI gate with `--strict` and JSON output.

### Out of scope

- MCP resources, prompts, sampling, subscriptions, or OAuth.
- The official SDK, HTTP/SSE transports, or hosted gateways.
- Business logic inside tools (handlers are explicit dry-run echoes).
- Runtime monitoring, rate limiting, or penetration testing.

## 3. Architecture

```
mcp.spec.json ──► scaffold-server.mjs ──► server.mjs + tools.mjs + smoke test
                        │
                        └─ validateSpec() rejects invalid contracts

server dir ──► audit-server.mjs ──► findings + score
           └─► verify-server.mjs ──► exit 0/1 for CI
```

| Script | Reads | Writes | Exit |
| --- | --- | --- | --- |
| `scaffold-server.mjs` | spec | server project | 1 on invalid spec or non-empty target |
| `audit-server.mjs` | server dir + spec | JSON/MD report | 1 only when the directory is missing |
| `verify-server.mjs` | server dir + spec | optional JSON | 1 on any blocking finding |

## 4. Rules

| Rule | Severity | Detection |
| --- | --- | --- |
| `dynamic-eval` | critical | `eval(` or `new Function(` |
| `hardcoded-secret` | critical | secret-shaped literal ≥12 chars, or `process.env.X \|\| 'literal'` |
| `secret-logged` | high | logging a secret-named env var |
| `exec-capability` | high | `child_process`, `exec`, `spawn` (test files excluded) |
| `http-server-no-auth` | high | `createServer`/`listen` without auth keywords |
| `filesystem-write` | medium | `writeFile`, `appendFile`, `unlink`, `rm` |
| `wildcard-cors` | medium | `Access-Control-Allow-Origin: *` |
| `unbounded-fetch` | low | `fetch(` without abort/timeout |
| `no-tests` | high | no test file |
| `no-readme` | medium | no README |
| `no-engines` | low | `package.json` lacks `engines.node` |
| `no-spec` / `spec-invalid` | medium / high | missing or invalid spec |
| `no-input-validation` | high | required args declared, no validation in source |

Scoring: `100 − Σ(critical 15, high 10, medium 5, low 2)`, clamped. Verdict: ≥95 `launch-ready`, ≥75 `needs-fixes`, else `not-launch-ready`.

## 5. Acceptance criteria

| # | Criterion | Verification |
| --- | --- | --- |
| A1 | Valid spec validates; insecure spec reports destructive-name and schema violations | Functional test |
| A2 | Scaffolder rejects invalid specs with exit 1 | Functional test |
| A3 | Scaffolded server passes the generated stdio smoke test | Functional test spawns it |
| A4 | Scaffolded server audits at 0 findings / 100 and passes `--strict` | Functional test |
| A5 | Insecure server yields the seeded critical/high set and fails verify | Functional test |
| A6 | Non-empty output dir is refused without `--force` | Functional test |
| A7 | No placeholders, valid frontmatter, no absolute paths | Structural test |
| A8 | Archive contains only customer files | `audit-package.mjs` |

## 6. Pricing

| Tier | Price | Seats |
| --- | --- | --- |
| Solo | **$79** | 1 |
| Team | **$199** | 5 |
| Agency | **$299** | Unlimited + client servers |

Rationale: adjacent individual skills list near $29; outcome-specific templates at $49–$149; a launch kit with a generated server, protocol test, and CI gate sits above templates, below a service engagement.

## 7. Risks

| Risk | Mitigation |
| --- | --- |
| Generated server is a subset of MCP | Documented: tools-only, protocol `2024-11-05`; resources/prompts out of scope |
| No real host tested | `COMPATIBILITY.md` marks hosts untested; smoke test is the evidence |
| False sense of security | Listing and README state static review is not a penetration test |
| "I can copy the SDK example" | Value is spec validation, smoke test, rule set, and gate — all shipped |
}

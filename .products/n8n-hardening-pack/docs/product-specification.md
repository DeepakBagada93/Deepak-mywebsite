# Product specification — n8n Production Hardening Pack 1.0.0

## 1. Promise

**From "works on my test execution" to a workflow that has error handling, retries, timeouts, authentication, duplicate protection, and a CI gate — without rewriting a single business rule.**

Measurable claims on the shipped fixtures:

1. The unsafe workflow produces 12 findings and score 21/100.
2. The hardener refuses to write when inline secrets exist.
3. The half-hardened workflow receives exactly 3 safe patches and reaches 100/100.
4. `verify-workflow.mjs` fails the unsafe file and passes the hardened one in `--strict` mode.

## 2. Scope

### In scope

- Parsing n8n export JSON (`nodes[]`, `connections`, `settings`, `pinData`, `credentials`).
- 12 rule classes: missing trigger, missing error workflow, retry policy, HTTP timeout, missing credentials, webhook auth, inline secrets, pinned data, duplicate guard, orphan nodes, disabled nodes, duplicate node names, execution order.
- Four safe transform classes: retries, HTTP timeout, `executionOrder`, pinned-data removal.
- Deterministic scoring, severity ordering, and CI gating (`standard` / `--strict`).
- Directory-mode batch audits.

### Out of scope

- Executing or importing workflows into n8n.
- Generating new workflows or node parameters.
- Credential creation, secret rotation, or storage.
- Make.com / Zapier / Pipedream schemas.
- Business-logic correctness or data validation.

## 3. Architecture

```
workflow.json ──► audit-workflow.mjs ──► audit.json / audit.md
                        │
                        ├─► harden-workflow.mjs ──► <name>.hardened.json
                        │        (refuses on critical security findings)
                        └─► verify-workflow.mjs ──► exit 0/1 for CI
```

| Script | Reads | Writes | Exit semantics |
| --- | --- | --- | --- |
| `audit-workflow.mjs` | file or directory | optional JSON/MD | 0 on completed audit, 1 on unparseable input |
| `harden-workflow.mjs` | one workflow | hardened copy | 1 when blocked by inline secrets |
| `verify-workflow.mjs` | file or directory | optional JSON | 1 on any blocking finding |

## 4. Rule table

| ID | Severity | Condition | Auto-fix |
| --- | --- | --- | --- |
| `no-trigger` | critical | No node matching trigger/webhook/schedule | No |
| `inline-secrets` | critical | Secret-shaped parameter value ≥12 chars, Bearer token, or embedded credential data | No (blocks hardener) |
| `missing-error-workflow` | high | No `settings.errorWorkflow` and no Error Trigger node | No |
| `webhook-without-auth` | high | Webhook node with `authentication` missing or `none` | No |
| `pinned-data` | high | Non-empty `pinData` | Yes (cleared) |
| `missing-credentials-*` | high | HTTP node declares auth but has no credential | No |
| `no-retry-*` | medium | Retryable node without `retryOnFail` | Yes |
| `no-timeout-*` | medium | HTTP node without `parameters.options.timeout` | Yes |
| `no-idempotency-guard` | medium | Webhook trigger + external write + no IF/Switch/RemoveDuplicates | No |
| `orphan-nodes` | medium | Node unreachable from any trigger | No |
| `duplicate-node-names` | medium | Two nodes share a name | No |
| `disabled-node-*` | low | `node.disabled === true` | No |
| `legacy-execution-order` | low | `settings.executionOrder !== 'v1'` | Yes |

## 5. Scoring

`score = clamp(0, 100 − Σ(weights))`, weights: critical 15, high 10, medium 5, low 2.
Verdict: ≥95 `production-ready`, ≥70 `needs-hardening`, otherwise `not-production-ready`.

## 6. Acceptance criteria

| # | Criterion | Verification |
| --- | --- | --- |
| A1 | Unsafe fixture yields 12 findings including all seeded classes | Functional test |
| A2 | Findings order and score are deterministic | Functional test, two runs |
| A3 | Hardener exits 1 and writes nothing when inline secrets exist | Functional test asserts file absence |
| A4 | Hardener adds retries and timeout to the half-hardened fixture (85 → 100) | Functional test asserts node fields |
| A5 | Verify fails the unsafe file, passes the hardened file in strict mode | Functional test |
| A6 | Directory mode audits every JSON in a folder | Functional test |
| A7 | No placeholders, valid frontmatter, no absolute paths | Structural test |
| A8 | Archive contains only customer files | `audit-package.mjs` |

## 7. Pricing

| Tier | Price | Seats |
| --- | --- | --- |
| Solo | **$59** | 1 |
| Team | **$149** | 5 |
| Agency | **$249** | Unlimited, client repos |

Rationale: template bundles sit at $2–$47 and are commoditized; outcome-specific automation products list at $49–$149. An auditor sits above the bundle price but below a service engagement.

## 8. Risks

| Risk | Mitigation |
| --- | --- |
| Rules produce false positives on unusual parameter shapes | Rules only fire on recognized shapes; unknown shapes produce no claim |
| Users expect the tool to fix credentials | Hardener refuses and prints migration steps |
| Hardened file fails to import | Schema and node set are preserved; import untested and disclosed |
| "I can write these checks myself" | The value is the rule table, deterministic patches, fixtures, and CI wiring |

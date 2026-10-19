# Release report — n8n Production Hardening Pack 1.0.0

## Release state: READY FOR OWNER APPROVAL

Technical build complete; publication requires the owner's approval of license, pricing, support terms, and fulfillment.

## Verified

| Check | Result | Evidence |
| --- | --- | --- |
| Functional tests | 6/6 passed | `docs/test-results.md` |
| Structural tests | 9/9 passed | `docs/test-results.md` |
| Unsafe fixture audit | 12 findings, score 21/100 | `examples/expected/audit-lead-intake.json` |
| Refusal path | Exit 1, no file written | Functional test |
| Safe hardening | 3 patches, 85 → 100 | `examples/expected/orders-sync.hardened.json` |
| Strict gate | Fails unsafe, passes hardened | Functional test |
| Factory validator | 0 failures | `docs/test-results.md` |
| Readiness validator | 0 failures | `docs/test-results.md` |
| Archive audit | 0 failures | `docs/test-results.md` |

## Not verified

1. Import or execution in a live n8n instance.
2. Make.com / Zapier and community-node behavior.
3. Node.js 18/20/22, Windows.
4. Market demand or ad performance (Ad Library inaccessible; see research dossier).

## Owner decisions required

1. Approve license and guarantee wording.
2. Approve pricing: $59 / $149 / $249.
3. Confirm support mailbox.
4. Choose storefront and fulfillment.

## Rollback

The product never modifies the input workflow: `harden-workflow.mjs` writes a separate file and `verify` is read-only. Rollback is deleting the generated files. No action inside n8n is taken by the tooling.

## Artifacts

- `dist/n8n-hardening-pack-1.0.0.zip`
- `product-manifest.json` (per-file SHA-256)
- `examples/expected/` (generated outputs)

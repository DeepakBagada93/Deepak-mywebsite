# Release report — GST Invoice & HSN Compliance Kit 1.0.0

## Release state: READY FOR OWNER APPROVAL

The technical build, documentation, packaging and audits are complete. Publication requires the owner's approval of license, pricing, support terms and fulfillment. This report does not authorize a public release.

## Verified

| Check | Result | Evidence |
| --- | --- | --- |
| Automated suite | 33 passed, 0 failed, 0 skipped | `node --test tests/` / `docs/test-results.md` |
| Clean fixture | 100/100, `READY TO ISSUE`, zero findings | `examples/expected/invoice-clean.json` / `.md` |
| Broken fixture | 0/100, `DO NOT ISSUE`, 4 critical / 5 high / 3 medium / 2 low | `examples/expected/invoice-fixture.json` / `.md` |
| Batch fixture | 3 invoices, average 86.67, duplicate `INV-2026-0142` group of 2, exit 1 | `examples/expected/batch.json` / `.md` |
| Tutorial B2C invoice | 100/100, exit 0 | `docs/tutorial-guide.md`, extracted `my-invoice.json` |
| Tutorial B2B invoice | 100/100, exit 0, inter-state IGST | `docs/tutorial-guide.md`, extracted and converted `my-invoice.json` |
| Tutorial duplicate batch | 2 invoices, average 80, duplicate `INV-2026-0301` group of 2, exit 1 | `docs/tutorial-guide.md`, extracted `my-batch.json` |
| HSN lookup | 4-digit and 6-digit bands; cites Notification 78/2020; no 8-digit mandate | `node scripts/hsn-lookup.mjs "software development" --aato=6000000` |
| E-invoice boundary | Exactly ₹5 crore does not trigger e-invoicing; above ₹5 crore does | `tests/gst-invoice-compliance-kit.test.mjs` |
| Golden stability | Byte-identical after the final rule corrections | Same `--today` / `--now`, compared before and after |
| Factory validator | 0 failures | `node .agent/scripts/validate-product.mjs products/gst-invoice-compliance-kit` |
| Readiness validator | 0 failures | `node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/gst-invoice-compliance-kit` |
| Archive audit | 0 failures | `node .agent/scripts/audit-package.mjs products/gst-invoice-compliance-kit` |

## Rule corrections made during final review

1. **E-invoicing threshold is strict.** Notification 10/2023-Central Tax applies where aggregate turnover *exceeds* ₹5 crore. The engine and documentation now treat exactly ₹5 crore as outside the mandate; the ₹5 crore value remains the upper bound for the 4-digit HSN band and the B2C HSN relaxation.
2. **8-digit HSN is not a high finding.** An 8-digit code is valid on the invoice but GSTR-1 Table 12 expects 4 or 6 digits, so the engine reports a medium formatting warning instead of a high error. No 8-digit mandate is claimed.

## Not verified

1. Live GST portal, IRP authentication, IRN generation or submission.
2. Live e-way bill generation or state-portal integration; state-specific thresholds are not modelled beyond the ₹50,000 central threshold and an explicit caveat.
3. Client-IDE installation or activation in Antigravity, Claude Code, Cursor, Codex or other hosts.
4. Correctness of a buyer's HSN/SAC classification or applicable GST rate.
5. Node.js 18/20/22 on Windows; the recorded run is macOS with Node.js 25.9.0.
6. Large-batch performance.
7. Market demand or ad performance.
8. Legal sufficiency, tax advice, return filing or liability computation.

## Owner decisions required

1. Approve the commercial license and the 30-day money-back guarantee wording.
2. Approve pricing: Solo ₹1,999; Pro ₹4,999; Agency/CA Practice ₹9,999; launch Solo ₹1,499 for the first 100 buyers.
3. Confirm `support@deepakbagada.in` as the support mailbox.
4. Choose the storefront, payment processor and protected-download fulfillment.
5. Approve the store listing claims and the disclosed limitations.

## Rollback

The audit scripts are read-only with respect to the input invoice. `audit-invoice.mjs` and `batch-audit.mjs` write only the report files the user names; without `--md` or `--json` they write to standard output. Rollback is deleting generated reports. The kit never files a return, generates an IRN or e-way bill, or changes source accounting data.

## Artifacts

- `dist/gst-invoice-compliance-kit-1.0.0.zip`
- `product-manifest.json` (per-file SHA-256)
- `examples/expected/` (deterministic generated outputs)
- `docs/test-results.md` and `docs/test-plan.md` (verification evidence)

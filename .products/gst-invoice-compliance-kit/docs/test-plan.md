# Test Plan — GST Invoice & HSN Compliance Kit

## 1. Scope

This plan verifies the deterministic rules engine and its three command-line entry points:

- `skills/gst-invoice-compliance-kit/scripts/lib.mjs`
- `skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs`
- `skills/gst-invoice-compliance-kit/scripts/batch-audit.mjs`
- `skills/gst-invoice-compliance-kit/scripts/hsn-lookup.mjs`

The suite checks invoice identity, GSTIN structure and checksum, HSN/SAC digit depth,
place of supply, intra-state versus inter-state tax split, GST rate slabs, totals,
amount in words, e-invoicing applicability and the IRP 30-day window, e-way bill
thresholds, batch duplicate grouping, CLI exit codes, and deterministic golden output.
It also checks the shipped package structure, dependency-free scripts, absence of
placeholder markers, absence of developer absolute paths, and absence of credentials.

## 2. Environment

- Node.js 20 or newer, pure ESM, zero runtime dependencies, no network access.
- Test runner: built-in `node:test` and `node:assert/strict`.
- Deterministic audit date: `2026-10-20`.
- Deterministic batch timestamp: `2026-10-20T00:00:00.000Z`.
- Commands are run from the product root:
  `products/gst-invoice-compliance-kit`.

## 3. Automated Test Inventory

| Area | Test file | What is asserted |
| --- | --- | --- |
| Clean fixture | `tests/gst-invoice-compliance-kit.test.mjs` | 100/100, `READY TO ISSUE`, zero findings, intra-state, e-invoice not required |
| Broken fixture | same | Critical codes `SUP_GSTIN_INVALID`, `TAX_SPLIT_WRONG`, `GRAND_TOTAL_MISMATCH`, `EINV_IRN_MISSING`; `DO NOT ISSUE` |
| GSTIN checksum | same | Valid `29AAECS1234F1ZK` and `27AAECS1234F1ZO`; invalid old `…F1Z5`; supplier checksum critical, recipient checksum high |
| Tax split | same | Intra-state IGST is critical; inter-state CGST/SGST is critical |
| HSN bands | same | 4 digits at AATO ≤ ₹5 crore, 6 digits above; no 8-digit band; 5-digit codes high; 8-digit codes medium for GSTR-1 formatting |
| HSN missing | same | Medium for B2C with AATO ≤ ₹5 crore; critical for B2B or AATO > ₹5 crore |
| E-invoicing | same | B2B/export with AATO strictly above ₹5 crore requires IRN; exactly ₹5 crore and domestic B2C do not; missing IRN critical |
| IRP window | same | `EINV_WINDOW_CLOSED` high when AATO ≥ ₹10 crore and invoice is older than 30 days |
| E-way bill | same | Goods only; exactly ₹50,000 passes; ₹50,001 and above flags medium; services excluded |
| Amount in words | same | Rupees/Rupee, punctuation and trailing `Only` normalise; a real mismatch is high |
| Dates | same | ISO, DD/MM/YYYY, DD-MM-YYYY, YYYY/MM/DD parse; 31/02/2026 and 2026-02-29 rejected; future date high |
| Invoice identity | same | More than 16 characters is a high finding |
| Place of supply | same | Missing, unknown and conflicting place of supply are high; B2C with only POS resolves the split |
| GST rates | same | Notified special rate is low informational; invalid slabs remain high |
| Summaries | same | `summarise()` recomputes counts, score and verdict from findings |
| Batch duplicates | same | Three duplicates produce one finding per invoice, correct count in the message, and score 80 |
| Batch determinism | same | `checkedAt` equals the supplied `now`; two runs deep-equal |
| Amount words values | same | 0, 1, 100, 100000, 10000000, 522.90 and a paise-only value |
| HSN lookup CLI | same | 4-digit and 6-digit band output; cites Notification 78/2020; no 8-digit claim |
| CLI exit codes | same | Clean `--strict` exits 0; broken `--strict` exits 1; batch exits 1; bad input exits 2 |
| Skill structure | `tests/skill-structure.test.mjs` | Frontmatter name/description, required section keywords, no placeholders, dependency-free scripts |
| Documentation | same | `docs/test-plan.md`, `docs/test-results.md`, tutorial, listing and license checks; all present and passing |
| Golden files | same | All example inputs and expected JSON/Markdown outputs exist, parse, and match the expected summary values |
| Hygiene | same | No absolute developer paths and no credentials in shipped files |

## 4. Golden Output Regeneration

Run after any code change that alters findings, ordering, messages or context:

```bash
node skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs examples/invoice.clean.json --today=2026-10-20 --json=examples/expected/invoice-clean.json --md=examples/expected/invoice-clean.md

node skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs examples/invoice.fixture.json --today=2026-10-20 --json=examples/expected/invoice-fixture.json --md=examples/expected/invoice-fixture.md

node skills/gst-invoice-compliance-kit/scripts/batch-audit.mjs examples/invoices.batch.json --today=2026-10-20 --now=2026-10-20T00:00:00.000Z --json=examples/expected/batch.json --md=examples/expected/batch.md
```

The batch command exits 1 because the fixture intentionally contains duplicate invoice
numbers; the files are still written before the exit code is set.

## 5. Acceptance Criteria

- `node --test tests/` exits 0 with all 33 tests passing and none skipped.
- The clean fixture is 100/100 `READY TO ISSUE`.
- The broken fixture is `DO NOT ISSUE` and contains the seeded critical codes.
- Batch duplicates are reported once per affected invoice with the correct group size.
- Golden files are byte-stable across repeated runs with the same `--today` and `--now`.

## 6. Explicitly Not Tested

- Live GST portal or IRP authentication, IRN generation and submission.
- Live e-way bill generation or state-portal integration.
- State-specific e-way bill thresholds (the engine uses the ₹50,000 central threshold
  and says so in the finding).
- Correctness of a product's HSN/SAC classification or the applicable GST rate; the
  catalog is orientation only and always asks for portal confirmation.
- Client IDE installation and activation inside Antigravity, Claude Code, Cursor,
  Codex or other hosts.
- Legal sufficiency, tax advice, return filing or liability computation.
- Performance at very large batch sizes.

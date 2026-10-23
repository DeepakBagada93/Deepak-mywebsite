# Test plan — ITC Recovery Desk

## Objective

Verify that the reconciliation engine is deterministic, correctly classifies the advertised exception types, and produces customer-facing outputs without network access, secrets or hard-coded personal paths.

## Scope

- CSV parsing, including quoted commas and CRLF.
- Amount parsing, including Indian commas, currency symbols and parentheses.
- Date parsing across supported formats.
- GSTIN format and checksum.
- Exact matching.
- Amount tolerance boundary.
- Missing-in-2B classification.
- Missing-in-books classification.
- Value mismatch with signed difference.
- Date mismatch.
- Duplicate detection.
- Invalid GSTIN detection.
- Output file generation.
- CLI strict and non-strict exit codes.
- Missing required columns.
- Skill structure and package readiness (separate test file).

## Out of scope

- Live GST portal, IRP or GSTR-3B behaviour.
- Legal ITC eligibility.
- Credit notes, reverse charge, imports, ISD.
- Windows and Node.js 18 execution.
- Client-IDE installation.
- Large-file performance.
- Market demand or pricing validation.

## Fixtures

### Demo pair

`examples/books.csv` and `examples/gstr2b.csv`.

| Invoice | Scenario | Expected |
|---|---|---|
| INV-1001 | Exact match, intra-state | Matched |
| INV-1002 | Exact match, inter-state | Matched |
| INV-1003 | Exact match, intra-state | Matched |
| INV-1004 | Exact match, inter-state | Matched |
| INV-1005 | Books only | `missing_in_2b`, ₹1,800 at risk |
| INV-1006 | Tax differs by ₹90 | `value_mismatch` |
| INV-1007 | 2B date is one day later | `date_mismatch` |
| INV-2001 | 2B only | `missing_in_books`, ₹900 unclaimed |

Expected totals:

- Books tax: ₹14,400.
- GSTR-2B tax: ₹13,410.
- Matched tax: ₹12,600.
- Potential ITC at risk: ₹1,890.
- Potential unclaimed: ₹900.
- Net difference: ₹990.
- Match rate: 85.71%.

### Messy pair

`examples/books-messy.csv` and `examples/gstr2b-messy.csv`.

- `INV/2001` and `INV-2001` normalise to the same invoice number → 2 duplicate rows.
- `29AAECS1234F1Z5` is format-valid but checksum-invalid.
- One duplicate matches 2B; the other is missing.
- Potential ITC at risk: ₹2,700.
- Match rate: 50%.

## Commands

```bash
node --test tests/*.test.mjs
node .agent/scripts/validate-product.mjs products/itc-recovery-desk
node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/itc-recovery-desk
node .agent/scripts/audit-package.mjs products/itc-recovery-desk
```

## Pass criteria

- All automated tests pass.
- Demo totals match the expected values.
- Messy fixture detects duplicates and the invalid checksum.
- CLI writes seven non-empty files.
- Strict mode exits 1 on exceptions; non-strict exits 0.
- Invalid input exits 2 with a clear message.
- Validators report 0 failures.
- ZIP audit reports 0 failures and no forbidden paths.

## Failure handling

- A failed test blocks release until fixed or explicitly documented as a limitation.
- A validator failure blocks packaging.
- A ZIP audit failure blocks release.
- Any absolute path in a shipped expected file is removed before packaging.

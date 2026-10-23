# Test results — ITC Recovery Desk 1.0.0

**Date:** 2026-10-20  
**Environment:** macOS, Node.js 25.9.0  
**Product root:** `products/itc-recovery-desk`

## Automated tests

Command:

```bash
node --test tests/*.test.mjs
```

Result:

```text
tests 20
pass 20
fail 0
skipped 0
```

Coverage:

- CSV parsing with quoted commas and CRLF.
- Amount parsing with Indian commas, currency symbols and parentheses.
- Date parsing across supported formats.
- GSTIN format and checksum.
- Exact matching.
- ₹1 tolerance boundary.
- Missing-in-2B classification.
- Missing-in-books classification.
- Value mismatch with signed difference.
- Date mismatch.
- Duplicate detection.
- Invalid GSTIN checksum detection.
- Seven output files.
- CLI strict exit 1.
- CLI non-strict exit 0.
- Missing required columns.
- Skill frontmatter and sections.
- README first run and limitations.
- Required documentation.
- No external imports or network URLs.
- No absolute personal paths in examples.

## Demo fixture

Command:

```bash
node skills/itc-recovery-desk/scripts/reconcile.mjs \
  --books examples/books.csv \
  --gstr2b examples/gstr2b.csv \
  --out out/demo \
  --period 2026-09
```

Result:

- Books rows: 7.
- GSTR-2B rows: 7.
- Exact matches: 4.
- Value mismatch: 1 (`INV-1006`, ₹90).
- Date mismatch: 1 (`INV-1007`).
- Missing from 2B: 1 (`INV-1005`, ₹1,800).
- Missing from books: 1 (`INV-2001`, ₹900).
- Match rate: 85.71%.
- Books tax: ₹14,400.
- GSTR-2B tax: ₹13,410.
- Matched tax: ₹12,600.
- Potential ITC at risk: ₹1,890.
- Potential unclaimed ITC: ₹900.
- Net difference: ₹990.
- Verdict: `REVIEW REQUIRED`.

## Messy fixture

Command:

```bash
node skills/itc-recovery-desk/scripts/reconcile.mjs \
  --books examples/books-messy.csv \
  --gstr2b examples/gstr2b-messy.csv \
  --out out/messy \
  --period 2026-09 \
  --strict
```

Result:

- Duplicate books rows: 2 (`INV/2001`, `INV-2001`).
- Invalid GSTIN checksum: `29AAECS1234F1Z5`.
- Missing from 2B: 2.
- Potential ITC at risk: ₹2,700.
- Match rate: 50%.
- Strict exit code: 1.

## Expected outputs

The shipped expected outputs are in:

```text
examples/expected/demo/
examples/expected/messy/
```

Each contains `summary.md`, `summary.json`, `exceptions.csv`, `itc-at-risk.csv`, `itc-unclaimed.csv`, `supplier-followup.csv` and `matched.csv`.

## Validation commands

```bash
node .agent/scripts/validate-product.mjs products/itc-recovery-desk
node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/itc-recovery-desk
node .agent/scripts/audit-package.mjs products/itc-recovery-desk
```

Results are recorded in `docs/release-report.md` after packaging.

## Not tested

- Live GST portal, GSTR-3B filing, IRP or supplier GSTR-1 amendment.
- Legal ITC eligibility.
- Credit notes, reverse charge, imports, ISD or multi-currency.
- Windows and Node.js 18.
- Client-IDE installation.
- Large-file performance.
- Market demand or pricing.

# ITC Recovery Desk

Reconcile an Indian purchase register against GSTR-2B and produce a reviewable ITC exception pack — offline, deterministic, in under three minutes.

**Potential ITC at risk is a review amount, not a confirmed loss.** This tool does not file returns, claim ITC or provide tax advice.

## Who this is for

- CA and GST practices with 20–300 GST clients.
- SMB finance teams that prepare purchase data for a CA.
- Bookkeepers who need a repeatable month-end reconciliation.

## Prerequisites

- Node.js 20 or newer.
- Two CSV exports: purchase register and GSTR-2B.
- A terminal.

No npm install. No API key. No network call. No portal login.

## Install

Copy the product folder to the machine that will run the reconciliation. The scripts live at:

```text
skills/itc-recovery-desk/scripts/reconcile.mjs
```

The Claude skill is `skills/itc-recovery-desk/SKILL.md`. Place the folder in your agent's skills directory, or paste the skill into the agent's project context.

## First successful run

From the product root:

```bash
node skills/itc-recovery-desk/scripts/reconcile.mjs \
  --books examples/books.csv \
  --gstr2b examples/gstr2b.csv \
  --out out/demo \
  --period 2026-09
```

Expected result:

- 7 purchase-register rows and 7 GSTR-2B rows.
- 6 matched, 1 missing from 2B, 1 missing from books.
- 1 value mismatch and 1 date mismatch.
- Potential ITC at risk: ₹1,890.
- Potential unclaimed ITC: ₹900.

Seven files appear in `out/demo/`:

```text
summary.md
summary.json
exceptions.csv
itc-at-risk.csv
itc-unclaimed.csv
supplier-followup.csv
matched.csv
```

## Input format

Required columns (common aliases are accepted):

```csv
supplier_gstin,invoice_number,invoice_date,taxable_value
```

Optional tax columns:

```csv
igst,cgst,sgst,cess,total
```

Example:

```csv
supplier_gstin,invoice_number,invoice_date,taxable_value,igst,cgst,sgst,cess,total
29AAECS1234F1ZK,INV-1001,2026-09-03,10000,0,900,900,0,11800
```

Supported dates: `YYYY-MM-DD`, `YYYY/MM/DD`, `DD/MM/YYYY`, `DD-MM-YYYY`, `DD.MM.YYYY`.

Amounts may include `₹`, Indian commas and parentheses for negatives.

## Options

```text
--books <path>        Purchase register CSV
--gstr2b <path>       GSTR-2B CSV
--out <dir>           Output directory (default: itc-recovery-output)
--period <YYYY-MM>    Label the reconciliation period
--tolerance <rupees>  Amount tolerance (default: 1)
--strict              Exit 1 when any exception exists
--now <iso-date>      Override the generatedAt timestamp
--help                Show help
```

## What each output means

| File | Use |
|---|---|
| `summary.md` | One-page review for a partner or client. |
| `summary.json` | Counts and amounts for automation. |
| `exceptions.csv` | Every exception with source row and action. |
| `itc-at-risk.csv` | Books-only invoices and positive value differences. |
| `itc-unclaimed.csv` | 2B-only invoices and negative value differences. |
| `supplier-followup.csv` | Supplier-wise invoice list and amounts. |
| `matched.csv` | Paired rows for audit. |

## Strict mode

```bash
node skills/itc-recovery-desk/scripts/reconcile.mjs \
  --books purchase-register.csv \
  --gstr2b gstr2b.csv \
  --out out/2026-09 \
  --strict
```

Exit codes:

- `0`: run completed; in strict mode, no exceptions.
- `1`: run completed; strict mode found exceptions.
- `2`: input or runtime error.

## Verification

```bash
node --test tests/*.test.mjs
node .agent/scripts/validate-product.mjs products/itc-recovery-desk
node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/itc-recovery-desk
```

The test suite covers CSV parsing, amount/date normalisation, GSTIN checksum, exact and exception matching, tolerance, duplicates, CLI output and strict mode.

## Troubleshooting

### “Missing required column”

The CSV header must contain a supplier GSTIN, invoice number, invoice date and taxable value. Export a clean single-header CSV; remove title rows and merged cells.

### “CSV has an unterminated quoted field”

A quoted cell is missing its closing quote. Open the file in a spreadsheet and re-export as CSV.

### Nothing matches

Check that the GSTIN and invoice number are present in both files and that the invoice date is a real date. The matcher normalises punctuation but does not fuzzy-match different invoice numbers.

### A duplicate is also “missing from 2B”

Duplicates are flagged separately. If two books rows share the same GSTIN and invoice number, one may match 2B and the other becomes a missing/duplicate exception. Confirm which row is genuine.

### The amount is not what I expected

The tax amount is `IGST + CGST + SGST + CESS`. If the source file has a different column layout, map it before running. The tolerance is ₹1 by default.

## Security and limitations

- Files are read locally and outputs are written only to `--out`.
- No uploads, telemetry, remote logging or network requests.
- Treat purchase registers and GSTR-2B files as confidential.
- No legal ITC eligibility logic, no GSTR-3B computation, no filing.
- No credit notes, reverse charge, imports, ISD or section 17(5) blocking in v1.
- One header row per CSV. No JSON, XML or PDF input.
- Windows and Node.js 18 are not verified in this release.

## Compatibility, updates, support, licensing, uninstall

See `COMPATIBILITY.md` for verified environments and install paths.  
See `LICENSE.md` for the draft commercial terms; owner approval is required before public release.  
Updates within v1.x cover fixes and CSV alias improvements.  
Support covers installation and documented behaviour, not tax advice.  
Uninstall by deleting the product folder and any output directories you created.

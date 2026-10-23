# ITC Recovery Desk — customer tutorial

## 1. What you are installing

ITC Recovery Desk is two things:

1. A **Claude skill** that tells an AI agent how to run and explain a reconciliation.
2. A **deterministic Node.js engine** that reads two CSV files and writes seven reports.

The engine is the source of truth. The skill explains the output; it does not invent matches.

---

## 2. Three-minute quickstart

### Step 1 — Check Node.js

```bash
node --version
```

Use Node.js 20 or newer.

### Step 2 — Run the sample

From the product folder:

```bash
node skills/itc-recovery-desk/scripts/reconcile.mjs \
  --books examples/books.csv \
  --gstr2b examples/gstr2b.csv \
  --out out/demo \
  --period 2026-09
```

### Step 3 — Open the summary

```bash
cat out/demo/summary.md
```

You should see:

- verdict `REVIEW REQUIRED`;
- match rate `85.71%`;
- potential ITC at risk `₹1,890`;
- potential unclaimed ITC `₹900`;
- one missing-in-2B invoice, one missing-in-books invoice, one value mismatch and one date mismatch.

### Step 4 — Open the supplier follow-up

```bash
cat out/demo/supplier-followup.csv
```

This is the list a CA can use to contact suppliers.

---

## 3. Prepare your own files

### Purchase register

Export the purchase register from Tally, Zoho, Busy, ClearTax or Excel as CSV. Keep one header row.

Minimum columns:

```csv
supplier_gstin,invoice_number,invoice_date,taxable_value
```

Recommended columns:

```csv
supplier_gstin,invoice_number,invoice_date,taxable_value,igst,cgst,sgst,cess,total
```

### GSTR-2B

Download or export GSTR-2B as CSV. The portal/Excel export may have title rows; remove them so the first row is the header. Map the columns to the same names if needed.

### Clean the data

- One invoice per row.
- No merged cells.
- No subtotal rows.
- Dates as `YYYY-MM-DD` or `DD/MM/YYYY`.
- Amounts as numbers, not text with notes.
- GSTIN in a single column.

### Run

```bash
node skills/itc-recovery-desk/scripts/reconcile.mjs \
  --books /path/to/purchase-register.csv \
  --gstr2b /path/to/gstr2b.csv \
  --out out/2026-09 \
  --period 2026-09
```

Use `--strict` if you want a non-zero exit code when any exception exists.

---

## 4. Install the skill in your agent

The scripts are client-agnostic. The `SKILL.md` file is plain Markdown with YAML frontmatter.

| Client | Suggested location | Status |
|---|---|---|
| Claude Code | `~/.claude/skills/itc-recovery-desk/` | Portable; not execution-tested in this session |
| Cursor | `.cursor/skills/itc-recovery-desk/` | Portable; not execution-tested in this session |
| Codex CLI | `~/.codex/skills/itc-recovery-desk/` | Portable; not execution-tested in this session |
| Google Antigravity | Project skills directory | Portable; not execution-tested in this session |
| Any Markdown agent | Paste `SKILL.md` as project context | Works as instructions; run scripts manually |

If the agent cannot run shell commands, ask it to read `SKILL.md`, inspect the CSV headers, and tell you which command to run.

---

## 5. Walkthrough: a month-end reconciliation

### Scenario

A CA firm has 140 GST clients. For one client, the purchase register has 7 invoices and GSTR-2B has 7 rows. The firm wants the first-pass exceptions before sending the file to a partner.

### Step 1 — Run the engine

```bash
node skills/itc-recovery-desk/scripts/reconcile.mjs \
  --books client-2026-09-books.csv \
  --gstr2b client-2026-09-2b.csv \
  --out out/client-2026-09 \
  --period 2026-09
```

### Step 2 — Read the verdict

`REVIEW REQUIRED` means there is a positive at-risk amount or an invalid row. It does not mean the client has a tax liability.

### Step 3 — Work the exception types in order

1. **`missing_in_2b`** — the supplier has not reported the invoice, or reported it in another period. Ask the supplier to file/amend GSTR-1 and confirm the invoice is valid.
2. **`missing_in_books`** — the client has a 2B invoice that is not recorded. Find the invoice or explain why it is not claimable.
3. **`value_mismatch`** — the invoice exists in both files but the taxable value or tax differs. Compare the source invoice.
4. **`date_mismatch`** — same invoice, different date. Check the return period impact.
5. **`duplicate_in_books` / `duplicate_in_gstr2b`** — confirm only one invoice is genuine.
6. **`invalid_gstin` / `invalid_gstin_checksum`** — correct the GSTIN from the supplier document.
7. **`total_mismatch`** — fix the source export or the tax columns.

### Step 4 — Send the supplier follow-up

Open `supplier-followup.csv`. It groups by supplier GSTIN and lists invoice numbers, tax at risk and potential unclaimed amounts.

### Step 5 — Hand off to the CA

Open `summary.md`. It contains the verdict, counts, amounts, exception table and next actions. The CA decides eligibility and filing.

---

## 6. Copy-paste prompt recipes

### Recipe A — Standard reconciliation

```text
Use the ITC Recovery Desk skill. Reconcile the purchase register at
/path/to/books.csv with GSTR-2B at /path/to/gstr2b.csv for period 2026-09.
Run the engine, then explain the verdict, the potential ITC at risk, and the
top five supplier follow-ups. Do not give tax advice.
```

### Recipe B — Exception triage

```text
Read out/2026-09/summary.md and exceptions.csv. Group the exceptions into:
(1) supplier follow-up, (2) books correction, (3) CA decision. For each group,
list the invoice numbers and the next action. Do not claim any ITC is eligible.
```

### Recipe C — Partner handoff

```text
Draft a one-page partner note from out/2026-09/summary.md. Include the match
rate, potential ITC at risk, potential unclaimed ITC, the three largest
exceptions and the questions that need a CA decision. Keep it under 250 words.
```

### Recipe D — Supplier message

```text
Draft a polite supplier message for each row in supplier-followup.csv with
tax_at_risk above 0. Mention the invoice numbers and ask the supplier to
confirm whether they have filed or amended GSTR-1. Do not threaten or give
legal advice.
```

---

## 7. Output reference

| File | What to do with it |
|---|---|
| `summary.md` | Read first; send to partner/client. |
| `summary.json` | Feed into a dashboard or automation. |
| `exceptions.csv` | Work row by row. |
| `itc-at-risk.csv` | Supplier conversations and books review. |
| `itc-unclaimed.csv` | Find missing purchase records. |
| `supplier-followup.csv` | One row per supplier. |
| `matched.csv` | Audit the pairs. |

---

## 8. Troubleshooting

### The command says “Missing required column”

Your header row does not contain one of the required fields. Check for:

- a title row above the headers;
- merged cells;
- a different spelling such as `GSTIN No.` (supported) versus a blank column.

The error lists the headers the engine found.

### The command says “expected a header row and at least one data row”

The file is empty or contains only a header. Export at least one invoice.

### All rows are “missing from 2B”

Check that the GSTR-2B file is the correct period and that the GSTIN column is populated. The matcher does not fuzzy-match different invoice numbers.

### A row is invalid

The row is missing GSTIN, invoice number, invoice date or taxable value, or the date/amount cannot be parsed. Fix the source row and rerun.

### The tax amount is zero

The engine uses `IGST + CGST + SGST + CESS`. If your export puts tax in a different column, rename it or map it before running.

### The output includes a duplicate and a missing row for the same invoice

That is expected when two books rows share the same GSTIN and invoice number. Confirm which row is genuine.

### Can I run this on client data?

Yes, locally. The engine reads only the files you pass and writes only to `--out`. It does not upload anything. Treat the files as confidential and do not commit them to a public repository.

### Does this file my GSTR-3B?

No. It produces reconciliation evidence. Filing and eligibility decisions stay with the CA and the filing tool.

### Does it handle credit notes, reverse charge or imports?

Not in v1. Those need separate logic and should be reviewed manually.

### Can I use it on Windows?

The scripts use `node:path` and should work, but this release was verified on macOS only. Run the sample first.

---

## 9. FAQ

**Is this tax advice?**  
No. It is data preparation and exception review.

**Does it connect to the GST portal?**  
No. You export the files and run them locally.

**Does it store my data?**  
No database, no telemetry, no upload. Outputs are files you choose to keep.

**Can I use it for multiple clients?**  
Yes, under the firm/practice licence tiers. Run each client into a separate output folder.

**What does “potential ITC at risk” mean?**  
The tax on books-only invoices plus positive value differences. It is a review amount, not a confirmed loss.

**What does “potential unclaimed ITC” mean?**  
The tax on 2B-only invoices plus negative value differences. It may be a missing purchase record, a timing difference, or a blocked credit.

**Can I automate it?**  
Yes. Use `--strict` and read `summary.json` or the exit code.

**What if the supplier has not filed?**  
The invoice appears as `missing_in_2b`. Contact the supplier; do not claim the credit until the data supports it.

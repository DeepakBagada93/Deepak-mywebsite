# ITC Recovery Desk

## Your purchase register and GSTR-2B do not agree. Find the gap before you claim.

A supplier says they filed. The purchase register says ₹14,400 of tax. GSTR-2B says ₹13,410. The difference is not one number — it is a missing invoice, a value mismatch, a date that moved, and a duplicate row nobody noticed.

You can reconcile it by hand in Excel. Again. Next month. For every client.

ITC Recovery Desk turns two CSV exports into a reviewable exception pack in under three minutes — offline, deterministic, with no portal login and no API keys.

Built for Indian CA and GST practices, bookkeepers, and SMB finance teams that prepare purchase data for a CA.

---

## The problem

ITC is not claimed from the invoice alone. The buyer's purchase register and the supplier's GSTR-1 filing have to agree, and GSTR-2B is the buyer's view of what suppliers reported.

When the two do not agree, you either:

- leave credit unclaimed;
- claim credit that 2B does not support;
- spend hours matching invoice numbers, dates and amounts; or
- discover the problem after the filing window.

The work is recurring, deadline-driven and easy to get wrong in a spreadsheet.

## The solution

One skill. One deterministic engine. Seven output files.

| What you get | What it does |
|---|---|
| **Exact matching** | Supplier GSTIN + invoice number + invoice date, with a ₹1 amount tolerance. |
| **Exception matching** | Finds date mismatches and value mismatches instead of silently dropping them. |
| **Books-only invoices** | Flags invoices in the purchase register that are missing from GSTR-2B. |
| **2B-only invoices** | Flags invoices in GSTR-2B that are missing from the purchase register. |
| **Duplicate detection** | Groups duplicate invoice numbers within books and within 2B. |
| **GSTIN checksum** | Flags invalid formats and invalid check digits, not just a 15-character length check. |
| **ITC at risk** | Adds tax on missing-in-2B invoices and positive value differences. |
| **Potential unclaimed ITC** | Adds tax on 2B-only invoices and negative value differences. |
| **Supplier follow-up** | Groups exceptions by supplier GSTIN with invoice references and amounts. |
| **CA-ready summary** | One-page review with counts, amounts, exceptions and next actions. |

## What's included

```text
skills/itc-recovery-desk/SKILL.md              The skill your agent loads
skills/itc-recovery-desk/scripts/reconcile.mjs Command-line reconciliation
skills/itc-recovery-desk/scripts/lib.mjs       Deterministic matching engine
examples/                                       Demo, messy and expected outputs
docs/tutorial-guide.md                          3-minute quickstart, installs, recipes, FAQ
docs/validation-plan.md                         14-day demand validation plan
tests/                                          20 automated tests
README.md                                       First successful run
LICENSE.md                                      Draft commercial terms
COMPATIBILITY.md                                Verified environments and install paths
```

No API keys. No subscription. No network calls. No accounting-software integration.

## Proof it works

Run the shipped fixtures before you buy.

- Demo: 7 purchase-register rows, 7 GSTR-2B rows, 6 matched, 1 missing from 2B, 1 missing from books.
- Potential ITC at risk: **₹1,890**.
- Potential unclaimed ITC: **₹900**.
- Value mismatch: **₹90**.
- Date mismatch: **INV-1007**.
- Messy fixture: duplicate invoice numbers, an invalid GSTIN checksum and **₹2,700** at risk.
- Test suite: **20 passing, 0 failing**.

```bash
node --test tests/*.test.mjs

node skills/itc-recovery-desk/scripts/reconcile.mjs \
  --books examples/books.csv \
  --gstr2b examples/gstr2b.csv \
  --out out/demo \
  --period 2026-09
```

Open `out/demo/summary.md` and `out/demo/supplier-followup.csv`.

## Pricing

| Tier | Price | Client files | Best for |
|---|---:|---:|---|
| **Free** | ₹0 | 10-invoice sample | Try the logic before buying |
| **Solo** | **₹1,999** | 1 business, 1 financial year | A founder or single practitioner |
| **Firm** | **₹4,999** | Up to 5 client files | A small CA firm |
| **Practice** | **₹9,999** | Up to 20 client files + v1.x updates | A larger practice |

Launch hypothesis: **Solo at ₹1,499 for the first 100 buyers.**  
All paid tiers include the skill, engine, examples, tests, tutorial and v1.x fixes. GST invoice available on request.

## 30-day money-back guarantee

Install it, run the sample fixtures, then run it on your own file pair. If it does not work as documented, email support@deepakbagada.in within 30 days with your order ID and get a full refund.

## Who it is for

- CA firms with 20–300 GST clients.
- GST practitioners who reconcile client purchase data.
- Bookkeepers who prepare month-end purchase registers.
- SMB finance teams that send data to a CA.
- Firms that want a repeatable, local check instead of another spreadsheet.

## Who it is not for

- Buyers who want a filing tool. This does not file GSTR-3B.
- Buyers who want legal ITC eligibility advice. This is data preparation.
- Buyers who need credit notes, reverse charge, imports or ISD in v1.
- Buyers who want a cloud dashboard with multi-user access.

## FAQ

**Does it connect to the GST portal?**  
No. You export the purchase register and GSTR-2B as CSV and run the engine locally.

**Does it upload client data?**  
No. No network calls, no telemetry, no database. Outputs are files you choose to keep.

**Does it compute my GSTR-3B liability?**  
No. It produces reconciliation evidence for a CA or finance team.

**Can I use it for multiple clients?**  
Yes, under the Firm or Practice tier. Run each client into a separate output folder.

**What does “potential ITC at risk” mean?**  
The tax on books-only invoices plus positive value differences. It is a review amount, not a confirmed loss.

**What if a supplier has not filed?**  
The invoice appears as `missing_in_2b`. Contact the supplier; do not claim the credit until the data supports it.

**Can I automate it?**  
Yes. Use `--strict` and read `summary.json` or the exit code.

**What if my CSV has different column names?**  
Common aliases are supported. The error message lists the headers the engine found if a required column is missing.

## Release status

Draft for owner approval. Pricing, licence, support, storefront and fulfilment require owner approval before publication. Demand and ad performance are not yet validated.

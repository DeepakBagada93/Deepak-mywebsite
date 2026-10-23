# ITC Recovery Desk — Reconciliation Summary

**Verdict:** REVIEW REQUIRED
**Period:** 2026-09
**Books:** books.csv  
**GSTR-2B:** gstr2b.csv  
**Match rate:** 85.71%

## Counts

- Purchase-register rows: 7 (7 valid)
- GSTR-2B rows: 7 (7 valid)
- Exact matches: 4
- Matched with a value exception: 1
- Matched with a date exception: 1
- In books, missing from GSTR-2B: 1
- In GSTR-2B, missing from books: 1
- Duplicate rows in books: 0
- Duplicate rows in GSTR-2B: 0
- Invalid rows: 0

## Amounts

- Tax in purchase register: 14400.00
- Tax in GSTR-2B: 13410.00
- Tax in matched rows: 12600.00
- **Potential ITC at risk:** 1890.00
- **Potential unclaimed ITC:** 900.00
- Net difference: 990.00

> Potential ITC at risk is a review amount, not a confirmed loss. Verify the invoice, the supplier filing and the applicable ITC conditions before making a claim.

## Exceptions

| Severity | Type | Supplier GSTIN | Invoice | Tax difference | Action |
| --- | --- | --- | --- | ---: | --- |
| high | missing_in_2b | 29AAECS1234F1ZK | INV-1005 | 1800.00 | Ask the supplier to file or amend GSTR-1, and confirm the invoice is valid and not cancelled. |
| high | missing_in_books | 27AAECS1234F1ZO | INV-2001 | 0.00 | Locate the invoice and record it in the purchase register before claiming ITC. |
| high | value_mismatch | 27AAECS1234F1ZO | INV-1006 | 90.00 | Ask the supplier to confirm or amend GSTR-1; the purchase register claims more tax than GSTR-2B. |
| medium | date_mismatch | 29AAECS1234F1ZK | INV-1007 | 0.00 | Confirm the invoice date with the supplier; review whether the difference changes the return period. |

## Next actions

1. Review every `missing_in_2b` invoice with the supplier before claiming ITC.
2. Record every `missing_in_books` invoice in the purchase register or explain why it is not claimable.
3. Resolve value and date mismatches against the source invoice.
4. Remove duplicates and correct invalid rows before the next reconciliation.

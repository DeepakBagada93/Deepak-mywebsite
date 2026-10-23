# ITC Recovery Desk — Reconciliation Summary

**Verdict:** REVIEW REQUIRED
**Period:** 2026-09
**Books:** books-messy.csv  
**GSTR-2B:** gstr2b-messy.csv  
**Match rate:** 50.00%

## Counts

- Purchase-register rows: 4 (4 valid)
- GSTR-2B rows: 2 (2 valid)
- Exact matches: 2
- Matched with a value exception: 0
- Matched with a date exception: 0
- In books, missing from GSTR-2B: 2
- In GSTR-2B, missing from books: 0
- Duplicate rows in books: 2
- Duplicate rows in GSTR-2B: 0
- Invalid rows: 0

## Amounts

- Tax in purchase register: 8100.00
- Tax in GSTR-2B: 5400.00
- Tax in matched rows: 5400.00
- **Potential ITC at risk:** 2700.00
- **Potential unclaimed ITC:** 0.00
- Net difference: 2700.00

> Potential ITC at risk is a review amount, not a confirmed loss. Verify the invoice, the supplier filing and the applicable ITC conditions before making a claim.

## Exceptions

| Severity | Type | Supplier GSTIN | Invoice | Tax difference | Action |
| --- | --- | --- | --- | ---: | --- |
| high | missing_in_2b | 29AAECS1234F1Z5 | INV-2002 | 900.00 | Ask the supplier to file or amend GSTR-1, and confirm the invoice is valid and not cancelled. |
| high | missing_in_2b | 29AAECS1234F1ZK | INV-2001 | 1800.00 | Ask the supplier to file or amend GSTR-1, and confirm the invoice is valid and not cancelled. |
| medium | duplicate_in_books | 29AAECS1234F1ZK | INV-2001 | 0.00 | Confirm only one invoice is genuine before claiming ITC. |
| medium | duplicate_in_books | 29AAECS1234F1ZK | INV/2001 | 0.00 | Confirm only one invoice is genuine before claiming ITC. |
| medium | invalid_gstin_checksum | 29AAECS1234F1Z5 | INV-2002 | 0.00 | Correct the GSTIN from the supplier document; matching may fail. |

## Next actions

1. Review every `missing_in_2b` invoice with the supplier before claiming ITC.
2. Record every `missing_in_books` invoice in the purchase register or explain why it is not claimable.
3. Resolve value and date mismatches against the source invoice.
4. Remove duplicates and correct invalid rows before the next reconciliation.

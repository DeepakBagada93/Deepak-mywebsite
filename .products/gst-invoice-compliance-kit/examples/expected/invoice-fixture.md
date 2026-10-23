# GST Invoice Audit

**INV-2026-0091** · 2026-10-15 · Deccan Snacks LLP

- Score: **0/100** — DO NOT ISSUE
- Critical 4 · High 5 · Medium 3 · Low 2
- Supply type: inter-state (supplier 29 → recipient 27)
- HSN depth required: 6 (AATO above ₹5 crore)
- E-invoice required: yes
- Audit date: 2026-10-20

## Findings

| Severity | Code | Field | Finding | Fix | Reference |
| --- | --- | --- | --- | --- | --- |
| critical | SUP_GSTIN_INVALID | supplier.gstin | Supplier GSTIN "29AAECS1234F1Z" is not a valid 15-character GSTIN. | Copy the GSTIN from the GST portal certificate; do not type it by hand. | CGST Rule 46 |
| critical | TAX_SPLIT_WRONG | lines[0].cgst | Line 1 charges CGST/SGST for an inter-state supply (supplier 29 → recipient 27). | Inter-state supply is charged IGST only. | Section 10(1)(a) / Section 12 |
| critical | GRAND_TOTAL_MISMATCH | grandTotal | Invoice total 120000 does not match the computed 67325. | Recompute: taxable + tax + charges − discount + round-off. | CGST Rule 46 |
| critical | EINV_IRN_MISSING | eInvoice.irn | Aggregate annual turnover is ₹6,00,00,000, so this B2B supply needs an IRN on the IRP portal. | Generate the IRN and QR, then print IRN, ACK number, ACK date and the QR on the invoice. | GSTN e-invoice notification (B2B and exports) |
| high | HSN_DIGITS | lines[0].hsn | Line 1 code "0901" has 4 digits; 6 digits are required (AATO above ₹5 crore). | Extend the code to the digit depth your turnover band requires. | Notification 78/2020-Central Tax; GSTN Phase-3 (May 2025) |
| high | LINE_TAX_MISMATCH | lines[0].gstRate | Line 1 tax is 10200; 57500 × 18% = 10350. | Recompute the tax from the taxable value and the rate. | CGST Rule 46 |
| high | LINE_TOTAL_MISMATCH | lines[0].total | Line 1 total is 68800; expected 67700. | Line total must equal taxable value plus tax. | CGST Rule 46 |
| high | SUBTOTAL_MISMATCH | totalTaxableValue | Stated taxable value 57000 does not match the sum of lines 57500. | Reconcile the line totals against the invoice total. | CGST Rule 46 |
| high | NO_AMOUNT_IN_WORDS | amountInWords | Amount in words is missing. | Print the total invoice value in words. | CGST Rule 46 |
| medium | SUP_NO_CONTACT | supplier.phone | Supplier phone or email is missing. | Print a contact so the buyer can reconcile a query. | CGST Rule 46 |
| medium | RATE_MISMATCH | lines[0].gstRate | Line 1 charges 18% GST on 0901 (Coffee, tea, mate and spices); this heading is commonly 5%. | Verify the rate on the GST portal rate finder for your exact product. A wrong rate is a bigger risk than a missing HSN. | GST rate finder |
| medium | EWAY_MISSING | eWayBill | Goods supply of ₹120000 exceeds the ₹50,000 e-way bill threshold. State-specific thresholds may differ. | Generate the e-way bill for the consignment and record its number on the invoice; confirm your state threshold. | GSTN e-way bill rules |
| low | ROUND_OFF_EXCEEDS | roundOff | Round-off 5 is larger than ₹1. | Round-off should be a rounding of a few paise, not a discount. | CGST Rule 46 |
| low | NO_PAYMENT_TERMS | paymentTerms | No payment terms or payment mode is stated. | State the payment mode and due date; it decides when tax is due. | Section 31(3) / Section 13 |

## Checks passed

- Invoice number present: INV-2026-0091
- Invoice date present: 2026-10-15
- Line 1 GST rate: 18%

---

Data preparation and rule checking only. Not tax advice, not a return filing, not a substitute for your chartered accountant. HSN/SAC depth follows Notification 78/2020-Central Tax and GSTN Phase-3 (May 2025). Confirm codes and rates on the GST portal before issuing.

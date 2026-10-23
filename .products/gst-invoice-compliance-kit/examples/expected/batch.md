# GST Invoice Batch Audit

- Invoices checked: **3**
- Average score: **86.67/100**
- Critical 2 · High 0 · Medium 0 · Low 0
- Duplicate invoice numbers: INV-2026-0142 (2)

| Invoice | Date | Supplier | Total | Score | Verdict | Top finding |
| --- | --- | --- | --- | --- | --- | --- |
| INV-2026-0142 | 2026-10-18 | Sundara Foods Pvt Ltd | 522.9 | 80 | FIX BEFORE ISSUING | DUP_INVOICE_NUMBER: Invoice number INV-2026-0142 appears on 2 invoices. |
| INV-2026-0143 | 2026-10-19 | Sundara Foods Pvt Ltd | 844.35 | 100 | READY TO ISSUE | clean |
| INV-2026-0142 | 2026-10-19 | Sundara Foods Pvt Ltd | 522.9 | 80 | FIX BEFORE ISSUING | DUP_INVOICE_NUMBER: Invoice number INV-2026-0142 appears on 2 invoices. |

## CA handoff list

| Invoice | Severity | Code | Field | Action |
| --- | --- | --- | --- | --- |
| INV-2026-0142 | critical | DUP_INVOICE_NUMBER | invoiceNumber | Every invoice number must be unique within a financial year. |
| INV-2026-0142 | critical | DUP_INVOICE_NUMBER | invoiceNumber | Every invoice number must be unique within a financial year. |

---

This is a data-preparation list for your accountant. It is not a return, not a liability computation and not tax advice.

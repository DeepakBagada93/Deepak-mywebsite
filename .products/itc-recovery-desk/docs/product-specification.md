# Product specification — ITC Recovery Desk

## Positioning

**Name:** ITC Recovery Desk  
**Category:** AI skill bundle (Claude skill + deterministic CSV reconciliation engine)  
**Version:** 1.0.0

**Value proposition:** Reconcile a purchase register against GSTR-2B and produce a reviewable ITC exception pack — offline, deterministic, in under three minutes.

**Persona:** A CA firm partner or GST practitioner with 20–300 GST clients, or an SMB finance manager who prepares purchase data for a CA. They already export data to Excel, have a monthly filing deadline, and do not want another full accounting platform.

**Job to be done:** “Before I file or send the reconciliation to my CA, show me which purchase invoices are missing from GSTR-2B, which 2B invoices are missing from my books, and which differences need a supplier conversation.”

**Measurable outcome:** Produce a first-pass reconciliation pack with counts, potential ITC at risk, potential unclaimed ITC, exceptions and a supplier follow-up list from two CSV files.

**Positioning boundary:** This is data preparation and exception review, not tax advice, eligibility determination or filing.

---

## Scope

### Included in v1

- CSV input for purchase register and GSTR-2B.
- Header aliases for common Tally/Zoho/Excel exports.
- Normalisation of GSTIN, invoice number, dates and amounts.
- GSTIN format and checksum flagging.
- Exact matching on supplier GSTIN + invoice number + invoice date.
- Date-insensitive matching on supplier GSTIN + invoice number.
- Amount tolerance (default ₹1).
- Classifications:
  - exact match;
  - value mismatch;
  - date mismatch;
  - missing in GSTR-2B;
  - missing in books;
  - duplicate in books;
  - duplicate in GSTR-2B;
  - invalid or missing fields.
- Potential ITC at risk and potential unclaimed ITC.
- Supplier follow-up grouping.
- Seven customer-facing output files.
- Strict mode for automation.
- Claude skill instructions for interpreting the output and drafting a handoff.

### Excluded from v1

- GSTR-3B filing, liability computation or portal submission.
- Legal ITC eligibility under sections 16 and 17(5).
- GSTR-1 amendment or supplier filing.
- Credit notes, debit notes, reverse charge, imports, ISD, e-commerce operator supplies.
- Multi-currency.
- Live GSTN, IRP, accounting-software or WhatsApp integration.
- PDF/XML/JSON input.
- Reconciliation of bank statements or e-way bills.
- Multi-user cloud dashboard.
- Automatic supplier email/WhatsApp sending.

### MVP

The MVP is the command-line reconciliation plus the Claude skill and the customer documentation. The buyer can run it on two CSVs and receive the seven output files.

### Premium differentiators

- Deterministic rules and test evidence, not an opaque AI guess.
- GSTIN checksum, not just a length check.
- Signed value differences with separate at-risk and unclaimed amounts.
- Supplier-wise follow-up list.
- CA-ready summary with explicit limitations.
- No upload, no portal credentials, no subscription.

### Environments

- Node.js 20 or newer (verified on macOS with Node.js 25.9.0).
- Any agent that can read Markdown and run shell commands.
- CSV files from Excel, Tally, Zoho, Busy or a custom export.
- No browser, database, network or API key.

### Limitations

- One header row per CSV.
- Requires supplier GSTIN, invoice number, invoice date and taxable value.
- Invoice-number punctuation is normalised; ambiguous numbering needs review.
- No legal eligibility logic.
- No performance guarantee for very large files.
- Windows and Node.js 18 are not verified in this release.
- Client-IDE installation is documented but not execution-tested in this session.

---

## Commercial model

Pricing and demand are hypotheses until validated.

| Tier | Price (INR) | Scope | Best for |
|---|---:|---|---|
| Free | 0 | 10-invoice sample calculator | Lead magnet |
| Solo | 1,999 | One business, one financial year | Founder or single practitioner |
| Firm | 4,999 | Up to 5 client files | Small CA firm |
| Practice | 9,999 | Up to 20 client files + v1.x updates | Larger practice |

**Launch hypothesis:** Solo at ₹1,499 for the first 100 buyers.  
**Support:** Email support for installation and documented behaviour; no tax advice.  
**Updates:** v1.x fixes and CSV alias improvements included; major versions priced separately.  
**Refund:** 30-day money-back guarantee if the documented sample run does not work.

**Validation metrics:**

- 10 CA interviews completed.
- 3 anonymised file pairs tested.
- Median potential ITC difference > ₹10,000 per 100 invoices.
- 5 pre-orders at ₹1,999 or 3 pilot commitments at ₹4,999.
- Support tickets limited to installation and input-format issues in the first 30 days.

---

## Acceptance evidence

| Advertised outcome | Artifact | Test or manual check |
|---|---|---|
| Reconcile two CSV files | `skills/itc-recovery-desk/scripts/reconcile.mjs` | CLI runs on `examples/books.csv` and `examples/gstr2b.csv` |
| Match exact invoices | `scripts/lib.mjs` exact-key stage | `exactMatched = 4` on demo fixture |
| Find books-only invoices | `missing_in_2b` classification | `INV-1005`, ₹1,800 tax at risk |
| Find 2B-only invoices | `missing_in_books` classification | `INV-2001`, ₹900 potential unclaimed |
| Find value mismatches | signed tax difference | `INV-1006`, ₹90 difference |
| Find date mismatches | date-insensitive stage | `INV-1007`, 2026-09-18 vs 2026-09-19 |
| Detect duplicates | duplicate grouping | messy fixture flags 2 rows |
| Detect invalid GSTIN | format + checksum | messy fixture flags `29AAECS1234F1Z5` |
| Produce supplier follow-up | `supplier-followup.csv` | demo output groups two suppliers |
| Strict automation | `--strict` | exit 1 when exceptions exist |
| No network or secrets | source review | imports only `node:` built-ins and local modules |
| Deterministic output | no timestamps in summary files | repeated runs produce identical files |

---

## Release constraints

- Owner approval required for pricing, licence, support, storefront, fulfilment and publication.
- No legal review has been performed.
- Demand and ad performance are not validated.
- The product must remain `READY FOR OWNER APPROVAL` until an authorised public action is verified.

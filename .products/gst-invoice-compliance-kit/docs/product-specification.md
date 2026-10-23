# Product Specification — GST Invoice & HSN Compliance Kit

Version 1.0.0 · 2026-10-20 · Deepak Bagada Systems

## 1. Promise

From a pile of invoice JSON to a severity-ranked, GST-ready audit and a CA handoff pack in under 3 minutes — offline, deterministic, with no accounting software and no API keys.

## 2. Transformation

| Before | After |
| --- | --- |
| Invoices checked by eye or not at all | 0–100 score with a verdict for every invoice |
| "The totals look fine" | Line totals, tax, subtotal and grand total recomputed and compared |
| A GSTIN copied from a chat message | 15-character structure plus the published checksum |
| HSN depth guessed from a blog post | 4 or 6 digits selected from the stated AATO band |
| CGST/SGST and IGST mixed up | Supply type resolved from supplier and recipient state; wrong split is critical |
| Duplicate invoice numbers found after filing | Grouped in the batch audit, one finding per affected invoice |
| E-invoice and e-way applicability from memory | Explicit gate with B2B/export scope, e-invoice where AATO exceeds ₹5 crore, and the ₹50,000 e-way threshold |
| A vague email to the CA | Six-file handoff pack with a fix list and named questions |
| Irreproducible advice | Same input, same audit date, same score and byte-stable JSON |

## 3. Target buyer

**Primary:** Indian SMB and D2C sellers who issue invoices and want a pre-issue check without buying accounting software.

**Secondary:** Freelancers and agencies invoicing B2B clients, including exports, who need a repeatable audit for their own billing.

**Tertiary:** Small CA and tax practices that review client invoice data and want a clean, severity-ranked worklist before filing.

**Not for:** enterprises with a dedicated ERP tax engine, buyers who want a filing utility, buyers who want the kit to classify products or certify rates, and anyone who wants a guarantee of portal acceptance.

## 4. Deliverables and acceptance criteria

| # | Artifact | Acceptance criterion |
| --- | --- | --- |
| 1 | `skills/gst-invoice-compliance-kit/SKILL.md` | Valid frontmatter; identity, activation triggers, non-triggers, input contract, 8-stage pipeline, rule reference, HSN orientation, scoring rubric, output contract, severity table, handoff pack, negative constraints and failure handling |
| 2 | `scripts/lib.mjs` | Deterministic rules engine; zero dependencies; GSTIN checksum, HSN bands, tax split, totals, e-invoice, e-way bill, batch grouping |
| 3 | `scripts/audit-invoice.mjs` | One-invoice CLI; Markdown and JSON output; `--strict` exit 1 on critical/high; exit 2 on bad input |
| 4 | `scripts/batch-audit.mjs` | Batch CLI; per-invoice table; duplicate grouping; CA handoff list; deterministic `checkedAt` with `--now` |
| 5 | `scripts/hsn-lookup.mjs` | Orientation lookup by description or code; AATO band; always states that it does not certify a code |
| 6 | `examples/` | Clean fixture at 100/100, broken fixture at 0/100, three-invoice batch with a duplicate, golden JSON and Markdown |
| 7 | `tests/` | 33 tests using `node:test`; all pass with the documentation present |
| 8 | `docs/tutorial-guide.md` | 3-minute quickstart, four client installs, first real audit, batch and HSN walkthroughs, four `### Recipe` prompts, troubleshooting and FAQ |
| 9 | `docs/store-listing.md` | Hook, problem, solution, inclusions, proof, pricing, guarantee, who it is for and not for, FAQ, CTA |
| 10 | `LICENSE.md` | Commercial EULA with own-business and client work allowed, raw resale forbidden, seats, no warranty, not tax advice, refund |
| 11 | `README.md` | First successful run, exact commands, package tree, verification, pricing, compatibility, limitations, support |
| 12 | `COMPATIBILITY.md` | Verified environment, install paths, requirements, not supported, data handling |

## 5. Exact scripts and tests

Scripts:

- `skills/gst-invoice-compliance-kit/scripts/lib.mjs`
- `skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs`
- `skills/gst-invoice-compliance-kit/scripts/batch-audit.mjs`
- `skills/gst-invoice-compliance-kit/scripts/hsn-lookup.mjs`

Tests:

- `tests/gst-invoice-compliance-kit.test.mjs` — functional engine, CLI, golden files, exit codes, GSTIN, tax split, HSN bands, e-invoice, e-way bill, dates, amount in words, batch determinism.
- `tests/skill-structure.test.mjs` — frontmatter, required documentation sections, tutorial and listing keywords, license terms, dependency-free imports, no absolute developer paths, no credentials.

Commands:

```bash
node --test tests/

node skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs examples/invoice.clean.json --today=2026-10-20 --strict

node skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs examples/invoice.fixture.json --today=2026-10-20

node skills/gst-invoice-compliance-kit/scripts/batch-audit.mjs examples/invoices.batch.json --today=2026-10-20 --now=2026-10-20T00:00:00.000Z

node skills/gst-invoice-compliance-kit/scripts/hsn-lookup.mjs "software development" --aato=6000000
```

Recorded result: 33 tests pass, clean 100/100, broken 0/100 with 4 critical / 5 high / 3 medium / 2 low, batch average 86.67 with duplicate `INV-2026-0142`, HSN lookup reports 4 digits and cites Notification 78/2020 without an 8-digit claim.

## 6. Rule scope

| Area | Implemented |
| --- | --- |
| Invoice identity | Required number, 16-character limit, accepted date formats, impossible dates, future dates |
| Supplier | Name, address, GSTIN structure, GSTIN checksum, state mismatch, contact |
| Recipient | Name, address, GSTIN structure and checksum, B2C unique ID |
| Place of supply | Missing, unknown, mismatch, tax split unverified |
| Lines | Description, HSN/SAC presence and depth, rate validity, special rates, quantity/rate, taxable value, line tax, line total |
| Tax split | Intra-state CGST/SGST equal halves; inter-state IGST only |
| Totals | Subtotal, tax breakup, grand total, round-off, amount in words |
| E-invoice | B2B/export applicability, IRN and ACK fields, 30-day window, NI/MC codes, unexpected IRN |
| E-way bill | Goods only, strictly above ₹50,000, state-threshold caveat |
| Batch | Duplicate invoice numbers, per-invoice summary, CA handoff list |

Rules are cited in the skill and in each finding. The engine is the source of truth; this table is a summary.

## 7. Pricing

| Tier | Price | Seats | Included |
| --- | --- | --- | --- |
| Solo | ₹1,999 | 1 | Full skill, four scripts, examples, tests, tutorial, v1.x updates |
| Pro | ₹4,999 | 5 | Everything in Solo, 5 seats, client-invoice review |
| Agency / CA Practice | ₹9,999 | Unlimited within one organisation | Everything in Pro, unlimited internal seats, client-invoice work |

Launch offer: Solo at ₹1,499 for the first 100 buyers.

30-day money-back guarantee. GST invoice available on request. Support: support@deepakbagada.in.

Rationale: priced for an Indian SMB or small CA practice that would otherwise spend hours on manual checks, and above prompt-pack pricing because the product ships a tested rules engine, golden fixtures and a repeatable CLI.

## 8. Success metrics

- The buyer completes a first audit on the sample fixture within 10 minutes of install.
- The buyer runs the audit on at least one of their own invoices within the first session.
- At least one critical or high finding is fixed before the next invoice is issued.
- A batch review produces a CA handoff pack without manual reformatting.
- Refund rate stays below 5%.
- No support ticket reports a score that cannot be reproduced from the same input.

## 9. Non-goals

- Filing GSTR-1, GSTR-3B or any other return.
- Computing net liability or input tax credit.
- Generating IRNs, QR codes or e-way bills.
- Connecting to the GST portal, the IRP or accounting software.
- Classifying a product's HSN/SAC or certifying a GST rate.
- Producing invoice PDFs or a billing UI.
- Replacing a chartered accountant for complex, regulated or ambiguous supplies.
- Guaranteeing portal acceptance or tax-authority agreement.

## 10. Limitations

- A 100/100 score means the implemented rules passed on the supplied data. It is not a compliance certificate.
- GSTIN validation proves structure and checksum, not registration status, active status or state eligibility.
- HSN/SAC depth is modelled only as 4 or 6 digits. The orientation catalog is small and is not a classifier.
- E-invoicing is modelled for B2B and exports at the stated threshold. IRP behaviour, schema validation and API submission are out of scope.
- The 30-day IRP window is tied to the audit date supplied by the user; a stale audit date can misstate the window.
- E-way bill logic uses the ₹50,000 central threshold. State-specific thresholds and exemptions are not modelled; the finding says so.
- Amount-in-words comparison is normalised, not a legal interpretation of the words.
- The batch command is not benchmarked for very large files.
- Client-IDE installation is documented but not execution-tested in this session.
- Windows, Node.js 18 and Node.js 22 were not part of the recorded verification.
- The product does not provide tax advice, and the user and their CA remain responsible for the final filing.

## 11. Release status

Engineering, tests and documentation are complete for version 1.0.0. Packaging, the manifest, the customer archive and the independent release audit are handled by the factory orchestrator. A technical pass is at most `READY FOR OWNER APPROVAL`; it is not a public release or a claim of portal acceptance.

# Research dossier — ITC Recovery Desk

**Compiled:** 2026-10-20  
**Buyer:** Indian CA/tax practices, GST practitioners, and SMB finance teams  
**Decision:** Build an offline purchase-register ↔ GSTR-2B reconciliation kit before building a broader accounting product.

---

## 1. Why this job exists

GST input tax credit is not claimed from the invoice alone. The buyer's purchase register and the supplier's GSTR-1 filing have to agree, and GSTR-2B is the buyer's view of what suppliers reported. When the two do not agree, the buyer either:

- loses credit that could have been claimed;
- claims credit that is not supported by 2B and creates a mismatch; or
- spends CA time manually matching invoice numbers, dates and amounts.

The work is recurring, deadline-driven, and concentrated in CA practices and finance teams. It is also a good fit for a deterministic local tool because the core operation is matching, not judgement.

---

## 2. Evidence

| Source | Observation | Evidence type | Confidence |
|---|---|---|---|
| [TaxGuru — Automating client document collection](https://taxguru.in/chartered-accountant/automating-client-document-collection-whatsapp-ca-firm-guide.html) | WhatsApp is the default document-collection channel for CA firms; official API costs and linked-device risks are real constraints. | Industry guide | High qualitative |
| [Webzenia — CA firm GST automation case study](https://webzenia.com/in/case-studies/ai-development/ca-firm-gst-automation) | Vendor reports 54% of GST prep time on document collection and 3.4 hours reduced to 40 minutes across 140 clients. | Vendor case study | Medium, unaudited |
| [RichAutomate — WhatsApp for CA firms](https://richautomate.in/blog/whatsapp-ca-tax-gst-firms-india-2026) | Vendor reports document collection falling from 14 days to 3 days and 22–32% of documents arriving in the last 48 hours. | Vendor marketing | Low–medium |
| [InfoProdSpy — Best AI tools](https://infoprodspy.com/best/ai-tools) | 3,987 AI-tool products; median price $24.42; top 10% capture 84% of revenue. | Marketplace scrape | Medium |
| [Jordan Hong Tai — Claude skill as a $49 product](https://www.jordanhongtai.com/guides/claude-skill-49-dollar-product) | PromptBase Claude skills cluster at $3.99–$19.99 (median $7.99); Gumroad skill products commonly price at $39/$47/$49; packaging and a worked example justify the higher price. | Practitioner guide | Medium–high for listed prices |
| [Claude for Finance — Gumroad](https://nuovanceai.gumroad.com/l/agkyq) | Finance toolkit listed at $53.25+ with 17 ratings and 18 sales; bundles Excel, dashboards, Skills and automation. | Product listing | High for listing; low for revenue inference |
| [HISAB 360](https://hisab360.net/) | AI Excel add-in for accountants with approval-gated writes and an audit trail. | Product marketing | Medium |
| [SheetAI — Finance use cases](https://sheetai.co/use-cases/finance) | AI spreadsheet workflows for finance teams are an established category. | Product marketing | Medium |
| [SplitzPay](https://splitzpay.app/) | Indian SMB late-invoice pain and ₹499–₹1,499/month SaaS pricing. | Vendor claims | Low for statistics; medium for pricing |
| [NudgePay](https://www.nudgepay.in/) | ₹399–₹999/month collections tooling and WhatsApp-open-rate claims. | Vendor claims | Low |

### What the evidence supports

- Indian CA firms have a recurring document and reconciliation workload, and WhatsApp is part of the workflow.
- Buyers pay for workflow products that save time or recover money; generic prompt packs are commoditised.
- A skill product can command ₹1,999–₹9,999 in India if it has a clear outcome, sample data, install instructions and a licence.
- Spreadsheet/Excel-adjacent products are familiar to accountants; a CSV-in, report-out tool has low adoption friction.

### What the evidence does not support

- No public source proves demand for this exact product at this exact price.
- The 54% / 3.4-hour / 140-client figures are vendor claims, not an independent audit.
- No public data shows how many Indian CA firms would pay ₹4,999 for a reconciliation kit.
- The market may prefer a monthly SaaS subscription over a one-time download.

Treat the pricing and demand parts as hypotheses to validate in the 14-day plan, not as facts.

---

## 3. Competitor gap

| Existing option | Strength | Gap this product targets |
|---|---|---|
| Accounting/practice suites | End-to-end filing, ledger and client management | Expensive for a small firm; reconciliation is buried inside a larger workflow; not a portable skill. |
| GST portal / 2B download | Authoritative data | No exception report, no supplier follow-up list, no local audit trail. |
| Excel manual matching | Familiar, flexible | Error-prone, not repeatable, no deterministic rules or test evidence. |
| Generic AI spreadsheet prompts | Cheap, fast | No domain schema, no GSTIN checksum, no tested matching rules, no client-ready outputs. |
| Collections SaaS | Automated reminders | Solves payment follow-up, not input-credit reconciliation. |

The wedge is not “better accounting software.” It is a **small, auditable exception-review layer** that a CA can run before the monthly filing and hand to a partner.

---

## 4. Buyer and job to be done

**Primary buyer:** a CA firm partner or GST practitioner with 20–300 GST clients.

**Secondary buyer:** an SMB finance manager who prepares purchase data for a CA.

**Job to be done:** “Before I file or send the reconciliation to my CA, show me which purchase invoices are missing from GSTR-2B, which 2B invoices are missing from my books, and which differences need a supplier conversation.”

**Measurable outcome:** reduce the time to produce a first-pass reconciliation pack from hours of manual matching to under three minutes, with a repeatable exception list.

---

## 5. Product decision

Build **ITC Recovery Desk** as a Claude skill plus a deterministic Node.js reconciliation engine and CSV outputs.

Why this shape:

- CSVs are exportable from Tally, Zoho, Busy, ClearTax and Excel.
- No portal credentials, no API keys, no network calls.
- The engine can be tested with fixtures and locked down with deterministic rules.
- The skill can explain the output and draft supplier follow-ups without pretending to be the accountant.
- It reuses the credibility and GSTIN logic of the existing GST Invoice & HSN Compliance Kit without cannibalising it.

**Not in v1:** GSTR-3B computation, legal eligibility, portal integration, credit notes, reverse charge, ISD, imports, section 17(5) blocking, multi-currency.

---

## 6. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| GSTN/2B export format changes | Medium | CSV alias mapping and a clear input contract; keep parser separate from matching rules. |
| Buyer expects legal advice | Medium | State the boundary in the skill, README, listing and output. |
| Matching false positives from normalised invoice numbers | Medium | Show source values in `exceptions.csv`; require human review; document punctuation normalisation. |
| Data privacy concerns | High | Offline processing; no uploads; no telemetry; tell the buyer to treat files as confidential. |
| Low willingness to pay for a one-time tool | Medium | Validate with pre-orders; offer firm tiers and a done-with-you pilot. |
| Competition from accounting suites | High | Stay narrow: exception review and supplier follow-up, not filing. |

---

## 7. Validation gate

Do not build the full commercial package beyond this v1 until:

- 10 CA firms are interviewed;
- 3 firms share anonymised file pairs;
- the median potential ITC difference is above ₹10,000 per 100 invoices;
- 5 firms pre-order at ₹1,999 or 3 firms commit to a ₹4,999 pilot.

If the gate fails, pivot to **ClientChase OS** for the same buyer.

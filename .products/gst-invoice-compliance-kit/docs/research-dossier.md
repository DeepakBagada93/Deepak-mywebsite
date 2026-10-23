# Market Research Dossier — GST Invoice & HSN Compliance Kit

Date: 2026-10-20 · Researcher: Deepak Bagada Systems

## 1. What the market looks like

Indian GST invoicing sits between three kinds of software:

1. **Accounting and billing suites** that create invoices, compute tax, store masters and file returns.
2. **GST Suvidha Providers and portal utilities** that move data to the GST system.
3. **Chartered accountants and tax practices** that review, correct and sign off.

The buyer usually has one of the first two and still lacks a fast, repeatable check on whether the invoice *data* is safe to issue. Accounting software is good at computing what it is told to compute. It is less good at telling a small seller that the HSN is too shallow for their turnover band, that an inter-state invoice is using the wrong tax heads, or that the same invoice number appears twice in a month's export.

The regulatory surface also moved recently:

- HSN/SAC digit depth became a phased requirement, with the GSTN Phase-3 advisory applying from the May 2025 return period.
- E-invoicing applies to B2B and export supplies above the turnover threshold, not domestic B2C.
- For businesses at ₹10 crore AATO and above, IRP reporting has been restricted to 30 days from the invoice date since 1 April 2025.
- E-way bill rules remain goods-specific with a central ₹50,000 threshold and state variation.

That combination creates a recurring, low-glamour job: check the invoice before it goes out. It is a job that a deterministic script does well and a human does slowly.

## 2. The gap

The market is not short of invoicing software. It is short of a **pre-issue audit layer** that is:

- **offline and private** — no upload of client invoice data to a SaaS;
- **deterministic** — the same invoice and audit date produce the same score, not a model's opinion;
- **specific to Indian GST mechanics** — GSTIN checksum, 4/6-digit HSN bands, CGST/SGST versus IGST, the B2C HSN proviso, e-invoice scope and the 30-day window;
- **usable by a non-developer** — a command and a Markdown report, not an integration project;
- **honest about scope** — it does not file, does not compute liability and does not claim portal acceptance.

Free prompt packs can describe these rules. They cannot guarantee that the same rules ran, in the same order, with the same arithmetic, on every invoice. A spreadsheet can encode some checks, but it drifts, it is hard to test and it rarely groups duplicates across a batch.

The gap is therefore not "another invoice generator". It is an auditable check with a score, a fix list and a handoff pack.

## 3. Buyer segments and willingness to pay

The pricing below is a **hypothesis**, not a measured willingness-to-pay result. No pricing survey, Van Westendorp test or live sales experiment was run for this release. The tiers are set to match the product's scope and the Indian digital-product band used across the Deepak Bagada Systems portfolio.

| Segment | Job to be done | Current workaround | Hypothesis on willingness to pay |
| --- | --- | --- | --- |
| Indian D2C / SMB seller | Check a month's invoices before issue or GSTR-1 | Manual spot checks, accountant review, billing-software validation | ₹1,500–₹2,500 one-time for a Solo seat |
| Freelancer or agency invoicing B2B | Avoid a buyer rejection or a wrong tax split on a large invoice | Copy last month's invoice, fix errors after feedback | ₹2,000–₹5,000, with 5 seats for a small team |
| Small CA / tax practice | Turn a client's invoice export into a worklist | Junior staff in Excel, ad hoc checklists | ₹8,000–₹12,000 for unlimited internal seats and client work |
| Export-heavy services business | Get the e-invoice and place-of-supply questions right | CA advice plus portal trial and error | ₹5,000+ if it prevents one bad batch |

Why these bands:

- The buyer is a business, not a hobbyist, so a ₹199 prompt pack is the wrong anchor.
- The product is a one-time tool, not a monthly SaaS, so a recurring ₹999/month price would be a harder sell to an SMB.
- The CA tier carries client-delivery rights, which supports a higher price than a single-seat licence.
- The launch price of ₹1,499 for the first 100 Solo buyers is a demand test, not evidence of long-term price.

The hypothesis should be tested with real checkout data before it is treated as validated.

## 4. Competitive alternatives

| Alternative | Strength | Gap this product addresses |
| --- | --- | --- |
| Accounting suites (Tally, Zoho Books, Vyapar, Busy and similar) | Create invoices, hold masters, compute tax, file in some cases | Validation is tied to the suite's own model; an exported JSON may still contain structural, HSN-depth, duplicate or applicability errors. No portable, deterministic audit report. |
| GST portal and IRP utilities | Authoritative for filing, IRN and e-way bill | They validate at submission, not before issue; errors surface late and are not presented as a fix list. |
| CA or tax consultant | Judgement, classification, liability, representation | Costs more per review and is not always available at the moment an invoice is generated; the kit reduces the mechanical cleanup before the CA sees it. |
| Excel checklist | Cheap, familiar | Untested, easy to drift, no checksum, no batch duplicate grouping, no reproducible score. |
| Free prompt packs and blog checklists | Fast to read, low cost | No execution evidence, no deterministic scoring, no fixture tests, no exit code, no handoff pack. |
| Generic invoice validators | Catch some format issues | Usually not India-specific: no GSTIN checksum, no 4/6 HSN bands, no B2C proviso, no e-invoice scope. |

Competitor prices were not verified in this session. No price is quoted for any named competitor, and no claim is made about their feature completeness beyond the general category description.

## 5. Regulatory anchors

| Anchor | What it means for the product | Source |
| --- | --- | --- |
| Notification 78/2020-Central Tax | HSN/SAC depth of 4 digits up to ₹5 crore AATO and 6 digits above; the proviso allows a small B2C supplier to omit the code. No 8-digit mandate; an 8-digit invoice code is a medium GSTR-1 formatting warning. | GST Council PDF |
| GSTN Phase-3 HSN advisory, effective May 2025 return period | Confirms the phased 4/6-digit table and the AATO split. | GST tutorial portal PDF |
| E-invoicing where AATO exceeds ₹5 crore | Applies to B2B and exports, not domestic B2C. Notification 10/2023-Central Tax, effective 1 August 2023. | GST e-invoice portal |
| 30-day IRP reporting restriction from 1 April 2025 | Businesses at ₹10 crore AATO or more must report within 30 days of the invoice date; the engine flags a closed window. | GST e-invoice portal |
| CGST Rule 46 | Invoice particulars, including an invoice number of not more than 16 characters, supplier and recipient details, HSN/SAC, tax and total. | GST portal |
| GSTIN structure and checksum | 15 characters with a state code and a check character; the engine applies the published base-36 algorithm. | GST portal |
| E-way bill rules | Goods only; central threshold strictly above ₹50,000; state-specific thresholds may differ. | GST portal |
| Place of supply, Sections 10 and 12 | Determines intra-state versus inter-state and therefore the CGST/SGST versus IGST split. | GST portal |

The product encodes the mechanical consequences of these anchors. It does not interpret them for a specific business, and it does not provide legal advice.

## 6. Why a deterministic offline auditor is different

Accounting SaaS is a system of record. It is designed to create, store and file. Its validation is usually scoped to what the suite itself can produce.

A free prompt pack is a set of instructions. It can sound authoritative, but the output depends on the model, the context and the day. It has no fixtures and no exit code.

This kit is a **checker**:

- It reads an export from any source, including a custom billing script or a CSV-to-JSON conversion.
- It applies named rules in a fixed order.
- It produces a score from fixed weights, so a critical finding can never be talked down to a clean verdict.
- It ships fixtures that prove the clean case, the broken case and the duplicate case.
- It returns exit codes that a billing pipeline can use as a gate.
- It makes no network call, so client invoice data does not leave the machine.
- It states what it cannot know: classification, rate correctness, buyer registration, portal acceptance and liability.

That combination is the product. It complements accounting software rather than replacing it, and it gives a CA a cleaner input than a raw export.

## 7. Evidence limits

This dossier is deliberately conservative. The following work was **not** performed for this release:

- **No live ad-library analysis.** Meta Ad Library and Google Ads Transparency Center were not scraped. No claim is made that any competitor has "ads running 30+ days", and no ad-spend estimate is made. Status: unperformed.
- **No market-size estimate.** No reliable, current public figure for the number of Indian SMBs that would buy a GST invoice audit tool was verified. No TAM/SAM/SOM number is asserted.
- **No customer interviews or surveys.** Buyer pain is inferred from the mechanics of GST invoicing and the product's own test scenarios, not from a formal research panel.
- **No willingness-to-pay experiment.** The pricing tiers are a hypothesis. No pre-sale, landing-page test or price ladder experiment was run.
- **No verified competitor pricing.** Competitor categories are described; specific prices are not quoted because they were not checked in this session.
- **No live GST portal, IRP or e-way bill testing.** The product was tested against local fixtures only. No IRN was generated and no return was filed.
- **No live IRN volume statistic.** The GST e-invoice portal's live counter was not reliably retrievable in this session, so no FY IRN count or single-day IRN figure is cited.
- **State-specific e-way thresholds were not modelled or verified.** The engine uses the ₹50,000 central threshold and states the limitation.
- **Rules are stated as of 2026-10-20.** Notifications, rates and portal behaviour can change. A buyer must confirm the current position.

These limits do not weaken the engineering claim. They define it. The product's value is a tested, reproducible audit of the rules it implements, not an assertion that it knows everything a tax authority knows.

## 8. Sources

All sources were accessed on 2026-10-20.

1. GST e-invoice portal — e-invoicing threshold, B2B/export scope, 30-day reporting restriction.
   https://einvoice.gst.gov.in/
2. GST tutorial portal — updated HSN advisory, Phase-3, 4/6 digits by AATO, effective May 2025 return period.
   https://tutorial.gst.gov.in/downloads/news/updated_advisory_hsn_table12_25042025.pdf
3. GST Council — Notification 78/2020-Central Tax, HSN/SAC digit depth and the B2C proviso.
   https://www.gstcouncil.gov.in/sites/default/files/2024-05/notfctn-78-central-tax-english-2020.pdf
4. GST portal — GSTIN format, returns, e-way bill, invoice rules and state codes.
   https://www.gst.gov.in/

Where a claim in this dossier is not directly supported by one of these sources, it is labelled as a hypothesis, an inference or unperformed work.

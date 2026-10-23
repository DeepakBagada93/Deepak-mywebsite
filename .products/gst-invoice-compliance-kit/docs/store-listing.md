# GST Invoice & HSN Compliance Kit

## Your invoice totals can add up and still be wrong.

A GSTIN with one wrong character. CGST and SGST on an inter-state sale. An HSN that is four digits when the turnover band needs six. A B2B invoice above ₹5 crore with no IRN. A duplicate invoice number sitting in the same export. The amount in words says ninety paise; the total says ninety-one.

None of these look wrong on the page. They surface later as a GSTR-1 mismatch, a buyer rejection, a portal error, or a week of cleanup with your CA.

GST Invoice & HSN Compliance Kit is the audit you run before the invoice leaves your business. It turns invoice JSON into a severity-ranked, GST-ready report and a CA handoff pack in under 3 minutes — offline, deterministic, with no accounting software and no API keys.

Built for Indian SMB and D2C sellers, freelancers and agencies invoicing B2B, and small CA/tax practices that review client invoices.

---

## The problem

You already have billing software. What you do not have is a repeatable check that says whether the data inside the invoice is safe to issue.

So you check the total, maybe the GSTIN, and send it. The error is in the tax split, or the HSN depth, or the line taxable value, or a duplicate number from last month's export.

When it comes back, the cost is not the invoice. It is the reconciliation, the amended return, the buyer conversation and the CA's time.

## The solution

One skill. Eight ordered stages. A score you can reproduce.

| You get | What it does |
| --- | --- |
| **Deterministic audit** | 0–100 score and a verdict from named rules. Same invoice, same audit date, same result. |
| **GSTIN checksum** | 15-character structure plus the published check character, not just a length check. |
| **HSN/SAC depth** | 4 digits up to ₹5 crore AATO, 6 digits above. No invented 8-digit rule; an 8-digit invoice code is a medium GSTR-1 formatting warning. |
| **B2C relaxation handled** | A completely missing code is medium for a small B2C supplier under the Notification 78/2020 proviso; B2B and larger turnover stay critical. |
| **Tax split** | Intra-state means equal CGST and SGST; inter-state means IGST only. A wrong split is critical. |
| **Totals and words** | Line taxable value, line tax, line total, subtotal, tax breakup, grand total and Indian-numbering amount in words. |
| **E-invoice gate** | B2B and exports above ₹5 crore AATO; IRN, ACK number, ACK date and QR; the 30-day IRP window for ₹10 crore and above. |
| **E-way gate** | Goods only, strictly above ₹50,000, with an explicit state-threshold caveat. |
| **Batch cleanup** | Duplicate invoice numbers grouped once per affected invoice, a per-invoice table and a CA handoff list. |
| **CA handoff pack** | `audit.md`, `audit.json`, `batch.md`, `batch.json`, `fix-list.md`, `ca-questions.md`. |

## What's included

```text
skills/gst-invoice-compliance-kit/SKILL.md    The skill your agent loads
skills/gst-invoice-compliance-kit/scripts/    Rules engine + three CLIs (zero dependencies)
examples/                                      Clean, broken and batch fixtures + golden reports
docs/tutorial-guide.md                         3-minute quickstart, installs, recipes, FAQ
docs/store-listing.md                          This page
tests/                                         33 structural and functional tests
README.md                                      First successful run and verification
LICENSE.md                                     Commercial EULA
COMPATIBILITY.md                               Verified environments and install paths
```

No API keys. No subscription. No network calls. No accounting software integration.

## Proof it works

Run these before you buy. They are the shipped fixtures, not screenshots.

- Clean invoice: **100/100, READY TO ISSUE**, zero findings, exit 0 in strict mode.
- Deliberately broken invoice: **0/100, DO NOT ISSUE**, with 4 critical, 5 high, 3 medium and 2 low findings.
- Batch of three invoices: **average 86.67**, duplicate `INV-2026-0142` detected in 2 invoices, exit 1.
- Test suite: **33 passing, 0 failing** with `node --test tests/`.

```bash
node --test tests/

node skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs examples/invoice.clean.json --today=2026-10-20 --strict

node skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs examples/invoice.fixture.json --today=2026-10-20

node skills/gst-invoice-compliance-kit/scripts/batch-audit.mjs examples/invoices.batch.json --today=2026-10-20 --now=2026-10-20T00:00:00.000Z
```

The broken fixture contains a malformed supplier GSTIN, an inter-state invoice charged CGST/SGST, a grand-total mismatch and a missing IRN. Those are the four critical findings, and every one is a real invoice failure mode.

## Pricing

| Tier | Price | Seats | Best for |
| --- | --- | --- | --- |
| **Solo** | **₹1,999** | 1 | One founder or freelancer reviewing their own invoices |
| **Pro** | **₹4,999** | 5 | A small team or agency invoicing B2B clients |
| **Agency / CA Practice** | **₹9,999** | Unlimited within one organisation | Client-invoice review and delivery |

Launch offer: **Solo at ₹1,499 for the first 100 buyers.**

All tiers include the full skill, all four scripts, examples, tests, tutorial and updates within v1.x. GST invoice available on request.

## 30-day money-back guarantee

Install it, run it on the sample fixtures, then run it on your own invoice. If it does not work as documented, email support@deepakbagada.in within 30 days with your order ID and get a full refund.

## Who it is for

- Indian D2C and SMB sellers who issue GST invoices and want a pre-issue check.
- Freelancers and agencies invoicing B2B clients, including exports.
- Small CA and tax practices that review client invoice data before filing.
- Founders whose billing export has grown faster than their manual checks.
- Teams that want a deterministic gate in a billing pipeline, with an exit code.

## Who it is not for

- Buyers who want a tool that files GSTR-1 or GSTR-3B.
- Buyers who want an IRN, QR code or e-way bill generated.
- Buyers who want the kit to classify a product's HSN/SAC or certify a rate.
- Enterprises with a dedicated ERP tax engine and a tax team.
- Anyone who wants a guarantee that the portal will accept an invoice.
- Anyone who wants tax advice rather than a data audit.

## Honest limitations

- **Not tax advice.** The kit applies mechanical checks to the data you supply. It does not advise on tax treatment.
- **No filing.** It does not file returns or submit anything to the GST portal, the IRP or an e-way bill system.
- **No live portal integration.** There is no OAuth, no GSP, no API key and no network call.
- **No guarantee of acceptance.** A 100/100 score means the implemented rules passed. The portal checks more, and master data can differ.
- **GSTIN validation is structural plus checksum.** It does not prove registration status or state eligibility.
- **HSN/SAC lookup is orientation only.** It never asserts that a code is correct.
- **State-specific e-way thresholds are not modelled.** The engine uses the ₹50,000 central threshold and says so.
- **Client-IDE installs are documented, not execution-tested.** The Node CLI was verified on macOS with Node.js 25.9.0.
- **Not a replacement for a CA.** Complex, regulated and ambiguous supplies need a human.

## FAQ

**Is this just a prompt?**
No. It ships a deterministic rules engine, three command-line tools, golden fixtures and 33 tests. The skill layer explains how to use them.

**Do I need an API key or internet?**
No. Everything runs locally with Node.js 20 or newer.

**Does it file my returns?**
No. It audits invoice data before you issue or report it.

**Can it generate an IRN or e-way bill?**
No. It tells you whether one appears to be required and which fields are missing. Generation happens in the IRP or the e-way bill portal.

**Will it work for my product's HSN code?**
The lookup orients you and checks digit depth. It does not certify a classification. Confirm the exact code and rate on the GST portal.

**Can I use it for client invoices?**
Yes on Pro and Agency / CA Practice, and for a sole practitioner's own clients on Solo. You may not resell or redistribute the raw files.

**Does it handle Hindi or Hinglish descriptions?**
Yes. Descriptions are free text. The checks operate on codes, numbers, dates and GSTINs. Keep the amount-in-words field in English Indian-numbering form.

**What if the portal rejects a clean invoice?**
Capture the portal error, map it to a field, fix the data and re-run. The kit does not guarantee portal acceptance.

**What if I need 8-digit HSN?**
This kit enforces 4 digits up to ₹5 crore AATO and 6 digits above, based on Notification 78/2020-Central Tax and the GSTN Phase-3 advisory. It does not claim an 8-digit requirement; an 8-digit invoice code is accepted but flagged medium so you can use the 6-digit form for GSTR-1. Confirm any extra depth with your CA.

**What is the refund policy?**
30-day money-back guarantee. Email support@deepakbagada.in with your order ID.

---

**Get GST Invoice & HSN Compliance Kit →** [deepakbagada.in/products/gst-invoice-compliance-kit](https://deepakbagada.in/products/gst-invoice-compliance-kit)

Support: support@deepakbagada.in

# GST Invoice & HSN Compliance Kit

**Your invoice is not ready because the totals add up. It is ready when the GST data survives an audit.**

GST Invoice & HSN Compliance Kit turns a pile of invoice JSON into a severity-ranked, GST-ready audit and a CA handoff pack in under 3 minutes. It runs offline, gives the same answer every time, and needs no accounting software, no API keys and no network connection.

Built for Indian SMB and D2C sellers, freelancers and agencies invoicing B2B, and small CA/tax practices that review client invoices.

## The problem

Most invoice errors are boring, and they are expensive later.

A supplier GSTIN is one character short. An inter-state invoice charges CGST and SGST instead of IGST. A line total does not match quantity × rate. The invoice number is 18 characters. A B2B invoice above ₹5 crore turnover has no IRN. Duplicate invoice numbers appear twice in the same export. The amount in words says ninety paise when the total says ninety-one.

None of these look like a problem on the invoice. They show up as a GSTR-1 mismatch, a buyer rejection, a portal validation error, or a CA asking for a week of cleanup.

## What it does

| Stage | Output |
| --- | --- |
| Intake | Normalises invoice number, dates, turnover, state codes and supply type |
| Identity audit | Invoice number limit, date formats, impossible dates, future dates |
| Party audit | GSTIN structure and real checksum, state mismatch, B2C unique ID |
| Tax audit | Intra-state CGST/SGST versus inter-state IGST, uneven halves, line-tax maths |
| HSN/SAC audit | 4 digits up to ₹5 crore AATO, 6 digits above; B2C small-supplier proviso handled as medium; 8-digit invoice codes flagged medium for GSTR-1 |
| Totals audit | Line taxable value, line tax, line total, subtotal, tax breakup, grand total, amount in words |
| Applicability gate | E-invoice for B2B and exports above ₹5 crore AATO, 30-day IRP window, e-way bill for goods above ₹50,000 |
| Batch scan | Duplicate invoice numbers grouped once per affected invoice, per-invoice table, CA handoff list |
| Handoff | `audit.md`, `audit.json`, `batch.md`, `batch.json`, `fix-list.md`, `ca-questions.md` |

## 3-minute quickstart

Use a fresh copy of the download. From the product root:

```bash
cd skills/gst-invoice-compliance-kit

node scripts/audit-invoice.mjs ../../examples/invoice.clean.json --strict
```

You should see:

```text
- Score: **100/100** — READY TO ISSUE
- Critical 0 · High 0 · Medium 0 · Low 0
- Supply type: intra-state (supplier 29 → recipient 29)
- HSN depth required: 4 (AATO up to ₹5 crore)
- E-invoice required: no (domestic B2C)
```

Exit code 0.

Now run the deliberately broken fixture:

```bash
node scripts/audit-invoice.mjs ../../examples/invoice.fixture.json --md=report.md --json=report.json
```

You should see `0/100 — DO NOT ISSUE`, with 4 critical, 5 high, 3 medium and 2 low findings. The critical findings include a malformed supplier GSTIN, a wrong tax split, a grand-total mismatch and a missing IRN.

Run the batch:

```bash
node scripts/batch-audit.mjs ../../examples/invoices.batch.json --md=batch.md --json=batch.json
```

You should see 3 invoices, average 86.67, and a duplicate group for `INV-2026-0142` with 2 invoices. Exit code 1 is correct here: the batch contains critical findings and the command is a gate.

Look up an HSN/SAC orientation row:

```bash
node scripts/hsn-lookup.mjs "software development" --aato=6000000
```

You should see a software or IT services heading and the line `AATO up to ₹5 crore → HSN/SAC needs 4 digits`. The output explicitly says the lookup is orientation only.

From the product root, the same audit is:

```bash
node skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs examples/invoice.clean.json --strict
```

## What's included

```text
README.md
LICENSE.md
CHANGELOG.md
COMPATIBILITY.md
skills/gst-invoice-compliance-kit/
  SKILL.md                         # activation, input contract, pipeline, rules, failure handling
  scripts/
    lib.mjs                        # deterministic rules engine
    audit-invoice.mjs              # one-invoice CLI
    batch-audit.mjs                # batch CLI + duplicate grouping
    hsn-lookup.mjs                 # orientation lookup
examples/
  invoice.clean.json               # 100/100 fixture
  invoice.fixture.json             # deliberately broken fixture
  invoices.batch.json              # three-invoice batch with a duplicate
  expected/                        # golden JSON and Markdown outputs
docs/
  tutorial-guide.md                # setup, installs, walkthroughs, recipes, FAQ
  store-listing.md                 # sales copy you can reuse
  product-specification.md         # scope, acceptance criteria, non-goals
  research-dossier.md              # market and regulatory notes
  test-plan.md
  test-results.md
tests/
  gst-invoice-compliance-kit.test.mjs
  skill-structure.test.mjs
```

## Verify it yourself

```bash
node --test tests/
```

Expected: 33 tests pass, 0 fail.

```bash
node skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs examples/invoice.clean.json --today=2026-10-20 --strict
```

Expected: 100/100, `READY TO ISSUE`, exit 0.

```bash
node skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs examples/invoice.fixture.json --today=2026-10-20
```

Expected: 0/100, `DO NOT ISSUE`, 4 critical / 5 high / 3 medium / 2 low.

```bash
node skills/gst-invoice-compliance-kit/scripts/batch-audit.mjs examples/invoices.batch.json --today=2026-10-20 --now=2026-10-20T00:00:00.000Z
```

Expected: 3 invoices, average 86.67, duplicate `INV-2026-0142` (2), exit 1.

The JSON output is byte-stable when `--today` and `--now` are fixed.

## Pricing (India)

| Tier | Price | Seats | For |
| --- | --- | --- | --- |
| Solo | ₹1,999 | 1 | One founder or freelancer reviewing their own invoices |
| Pro | ₹4,999 | 5 | A small team or agency invoicing B2B clients |
| Agency / CA Practice | ₹9,999 | Unlimited within one organisation | Client-invoice review and delivery |

Launch offer: Solo at ₹1,499 for the first 100 buyers.

30-day money-back guarantee. GST invoice available on request. Support: support@deepakbagada.in.

## Compatibility

Node.js 20 or newer. Verified on macOS with Node.js 25.9.0. Plain Markdown plus zero-dependency Node scripts. No network, no API keys, no database.

The skill folder is portable across Claude Code, Cursor, Codex CLI and Google Antigravity. See [COMPATIBILITY.md](COMPATIBILITY.md) for install paths. Client-IDE execution is labelled as instructions portable, not execution-tested in this session.

## What this kit does not do

- It does not file GSTR-1, GSTR-3B or any other return.
- It does not compute tax liability or net input credit.
- It does not generate an IRN, QR code or e-way bill.
- It does not connect to the GST portal, the IRP or any accounting software.
- It does not decide the correct HSN/SAC classification or confirm a rate.
- It does not guarantee that the portal will accept an invoice.
- It does not replace a chartered accountant.

A 100/100 score means every implemented rule passed on the data supplied. It does not mean the classification is right, the rate is right for the product, or the transaction is genuine.

**This is data preparation and rule checking, not tax advice.** The user and their CA are responsible for the final filing.

## Documentation

- [Tutorial guide](docs/tutorial-guide.md): 3-minute quickstart, per-client installs, first real audit, batch cleanup, HSN orientation, four prompt recipes, troubleshooting and FAQ.
- [Store listing](docs/store-listing.md): the full sales page, proof and pricing.
- [Product specification](docs/product-specification.md): scope, acceptance criteria and non-goals.

## Support

support@deepakbagada.in · [deepakbagada.in/products/gst-invoice-compliance-kit](https://deepakbagada.in/products/gst-invoice-compliance-kit)

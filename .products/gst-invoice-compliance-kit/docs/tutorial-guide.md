# Tutorial Guide — GST Invoice & HSN Compliance Kit

This guide takes you from a fresh download to a real invoice audit, a batch cleanup and a CA handoff pack. Every command is copy-paste correct from the folder shown. No accounting software, no API key and no network connection is required.

## 3-minute quickstart

1. Unzip the product. You should see `README.md`, `LICENSE.md`, `skills/`, `examples/`, `docs/` and `tests/`.

2. Open a terminal at the product root.

3. Move into the skill folder:

```bash
cd skills/gst-invoice-compliance-kit
```

4. Run the clean fixture:

```bash
node scripts/audit-invoice.mjs ../../examples/invoice.clean.json --strict
```

Expected output, exit code 0:

```text
- Score: **100/100** — READY TO ISSUE
- Critical 0 · High 0 · Medium 0 · Low 0
- Supply type: intra-state (supplier 29 → recipient 29)
- HSN depth required: 4 (AATO up to ₹5 crore)
- E-invoice required: no (domestic B2C)
- Audit date: 2026-10-20
```

5. Run the broken fixture:

```bash
node scripts/audit-invoice.mjs ../../examples/invoice.fixture.json --md=report.md --json=report.json
```

Expected: `0/100 — DO NOT ISSUE`, with 4 critical, 5 high, 3 medium and 2 low findings. `report.md` and `report.json` are written in the current folder.

6. Run the batch:

```bash
node scripts/batch-audit.mjs ../../examples/invoices.batch.json --md=batch.md --json=batch.json
```

Expected: 3 invoices, average 86.67, duplicate `INV-2026-0142` with 2 invoices, exit code 1. The exit code is the gate doing its job.

7. Ask your agent: *"Use the GST Invoice & HSN Compliance Kit to audit this invoice and prepare a CA handoff pack."*

That is the whole install-and-run loop. The rest of this guide is about using it on your own data.

## Install per client

The skill is plain Markdown plus Node scripts. The client only needs to be able to read `SKILL.md` and, ideally, run a shell command. If the client cannot run commands, ask it to produce the command and run it yourself.

### Claude Code

```bash
mkdir -p ~/.claude/skills
cp -R skills/gst-invoice-compliance-kit ~/.claude/skills/
```

Restart Claude Code, then confirm the skill is visible with `/skills`. Invoke it with: *"Load gst-invoice-compliance-kit and audit this invoice JSON."*

If you prefer a project-local install, copy the folder into `.claude/skills/` in the project instead.

### Cursor

```bash
mkdir -p .cursor/skills
cp -R skills/gst-invoice-compliance-kit .cursor/skills/
```

Add this line to `.cursorrules` so the agent knows when to use it:

```text
For GST invoices, HSN/SAC checks or CA handoff packs, follow .cursor/skills/gst-invoice-compliance-kit/SKILL.md and run the scripts from that folder.
```

Open the integrated terminal and run the commands from `.cursor/skills/gst-invoice-compliance-kit`.

### Codex CLI

```bash
mkdir -p ~/.codex/skills
cp -R skills/gst-invoice-compliance-kit ~/.codex/skills/
```

Start a new session and reference the skill by name. Codex CLI reads the Markdown; run the Node scripts in the integrated shell or a normal terminal.

### Google Antigravity

Copy the `skills/gst-invoice-compliance-kit/` folder into the project's skills directory, then attach or reference `SKILL.md` in the agent context. Run the scripts from Antigravity's integrated terminal, from the skill folder.

### Any other agent

Paste `SKILL.md` as project or system context. The audit still works; you run the commands yourself. The output files are ordinary Markdown and JSON.

**Compatibility note:** the install paths above are portable instructions. Client-IDE execution was not tested inside each IDE in this build session. The Node.js CLI was tested on macOS.

## Your first real audit

Create a file called `my-invoice.json` in the skill folder. This example is a complete B2C invoice that should score 100/100 at an AATO of ₹42,00,000.

```json
{
  "invoiceNumber": "INV-2026-0201",
  "invoiceDate": "2026-10-18",
  "business": {
    "name": "Kaveri Home Goods",
    "gstin": "29AAECS1234F1ZK",
    "financialYear": "2026-27",
    "aato": 4200000
  },
  "supplier": {
    "name": "Kaveri Home Goods",
    "address": "18 5th Cross, Indiranagar, Bengaluru, Karnataka 560038",
    "gstin": "29AAECS1234F1ZK",
    "stateCode": "29",
    "phone": "+91 98450 11111",
    "email": "accounts@kaverihome.in"
  },
  "recipient": {
    "name": "Meera Rao",
    "address": "Flat 7B, Lake View, Bengaluru, Karnataka 560034",
    "gstin": null,
    "stateCode": "29",
    "uniqueId": "9000012345"
  },
  "placeOfSupply": "29-Karnataka",
  "lines": [
    {
      "description": "Cotton Table Runner",
      "hsn": "6304",
      "quantity": 2,
      "unit": "piece",
      "unitPrice": 750,
      "discount": 0,
      "taxableValue": 1500,
      "gstRate": 5,
      "cgst": 37.5,
      "sgst": 37.5,
      "igst": 0,
      "total": 1575
    }
  ],
  "charges": { "shipping": 0, "other": 0 },
  "discount": 0,
  "roundOff": 0,
  "totalTaxableValue": 1500,
  "totalTax": 75,
  "grandTotal": 1575,
  "amountInWords": "One Thousand Five Hundred Seventy Five Rupees Only",
  "paymentTerms": "Paid by UPI on 18 October 2026.",
  "eInvoice": null,
  "eWayBill": null
}
```

Run:

```bash
node scripts/audit-invoice.mjs my-invoice.json --md=my-audit.md --json=my-audit.json --strict
```

Expected: `100/100 — READY TO ISSUE`, zero findings, exit 0, and two report files.

Now change one number deliberately. Set `"grandTotal": 1580` and re-run. You should see `GRAND_TOTAL_MISMATCH` as critical, the score drop by 20, and exit code 1 under `--strict`. Change it back.

### Turning it into a B2B invoice

For a B2B invoice, add the buyer's GSTIN and state code, set the place of supply to the buyer's state, and use IGST for an inter-state supply. For example:

```json
"recipient": {
  "name": "Anita Desai Traders",
  "address": "3 Turner Road, Bandra West, Mumbai, Maharashtra 400050",
  "gstin": "27AAECS1234F1ZO",
  "stateCode": "27"
},
"placeOfSupply": "27-Maharashtra"
```

That changes the supply to inter-state, so the line must use `igst` and zero `cgst`/`sgst`. The engine will raise `TAX_SPLIT_WRONG` as critical if you leave the intra-state split in place.

Add `"eInvoice": { "irn": "...", "ackNo": "...", "ackDate": "...", "qrCode": "..." }` only when you actually have an IRN from the IRP. Do not invent one. Above ₹5 crore AATO, a B2B invoice without an IRN is `EINV_IRN_MISSING` critical.

## Batch cleanup walkthrough

The batch command takes an array of invoices or an object with an `invoices` array. It audits each invoice, then groups duplicate invoice numbers.

Create `my-batch.json`:

```json
{
  "invoices": [
    {
      "invoiceNumber": "INV-2026-0301",
      "invoiceDate": "2026-10-01",
      "business": { "name": "Kaveri Home Goods", "gstin": "29AAECS1234F1ZK", "aato": 4200000 },
      "supplier": {
        "name": "Kaveri Home Goods",
        "address": "18 5th Cross, Indiranagar, Bengaluru, Karnataka 560038",
        "gstin": "29AAECS1234F1ZK",
        "stateCode": "29",
        "email": "accounts@kaverihome.in"
      },
      "recipient": {
        "name": "Meera Rao",
        "address": "Flat 7B, Lake View, Bengaluru, Karnataka 560034",
        "gstin": null,
        "stateCode": "29",
        "uniqueId": "9000012345"
      },
      "placeOfSupply": "29-Karnataka",
      "lines": [
        {
          "description": "Cotton Table Runner",
          "hsn": "6304",
          "quantity": 1,
          "unit": "piece",
          "unitPrice": 750,
          "discount": 0,
          "taxableValue": 750,
          "gstRate": 5,
          "cgst": 18.75,
          "sgst": 18.75,
          "igst": 0,
          "total": 787.5
        }
      ],
      "charges": { "shipping": 0, "other": 0 },
      "totalTaxableValue": 750,
      "totalTax": 37.5,
      "grandTotal": 787.5,
      "amountInWords": "Seven Hundred Eighty Seven Rupees and Fifty Paise Only",
      "paymentTerms": "Paid by UPI.",
      "eInvoice": null,
      "eWayBill": null
    },
    {
      "invoiceNumber": "INV-2026-0301",
      "invoiceDate": "2026-10-02",
      "business": { "name": "Kaveri Home Goods", "gstin": "29AAECS1234F1ZK", "aato": 4200000 },
      "supplier": {
        "name": "Kaveri Home Goods",
        "address": "18 5th Cross, Indiranagar, Bengaluru, Karnataka 560038",
        "gstin": "29AAECS1234F1ZK",
        "stateCode": "29",
        "email": "accounts@kaverihome.in"
      },
      "recipient": {
        "name": "Meera Rao",
        "address": "Flat 7B, Lake View, Bengaluru, Karnataka 560034",
        "gstin": null,
        "stateCode": "29",
        "uniqueId": "9000012345"
      },
      "placeOfSupply": "29-Karnataka",
      "lines": [
        {
          "description": "Cotton Table Runner",
          "hsn": "6304",
          "quantity": 1,
          "unit": "piece",
          "unitPrice": 750,
          "discount": 0,
          "taxableValue": 750,
          "gstRate": 5,
          "cgst": 18.75,
          "sgst": 18.75,
          "igst": 0,
          "total": 787.5
        }
      ],
      "charges": { "shipping": 0, "other": 0 },
      "totalTaxableValue": 750,
      "totalTax": 37.5,
      "grandTotal": 787.5,
      "amountInWords": "Seven Hundred Eighty Seven Rupees and Fifty Paise Only",
      "paymentTerms": "Paid by UPI.",
      "eInvoice": null,
      "eWayBill": null
    }
  ]
}
```

Run it with a fixed timestamp so the output is reproducible:

```bash
node scripts/batch-audit.mjs my-batch.json --today=2026-10-20 --now=2026-10-20T00:00:00.000Z --md=batch.md --json=batch.json
```

Expected: 2 invoices, average 80, one duplicate group for `INV-2026-0301` with count 2, and exit 1. Each affected invoice receives exactly one `DUP_INVOICE_NUMBER` finding. The per-invoice table shows the top finding, and the CA handoff list has one row per finding.

How to use the result:

1. Fix the duplicate number first. It is critical and it affects both records.
2. Read the per-invoice table for any other critical or high finding.
3. Re-run the batch with the same `--now` to compare.
4. When the only remaining findings are documented limitations, hand `batch.md`, `batch.json` and `ca-questions.md` to the reviewer.

Do not delete one of the duplicate rows to make the score go up. Decide which invoice number is correct, correct it in the source system, then re-export.

## HSN orientation walkthrough

Start with the description of what you actually sell:

```bash
node scripts/hsn-lookup.mjs "software development" --aato=6000000
```

The output gives a small table of candidate headings, a rate hint and a turnover band. At ₹60,00,000 AATO you are under ₹5 crore, so the required depth is 4 digits. Above ₹5 crore it becomes 6 digits.

Look up a code you already have:

```bash
node scripts/hsn-lookup.mjs --code=1905 --aato=4200000
```

The output tells you what the orientation table associates with that code and asks you to confirm the exact 6-digit code and rate on the GST portal.

How to use this correctly:

1. Use the lookup to find the right neighbourhood, not the final answer.
2. Open the GST portal HSN/SAC master and search the product description.
3. Confirm the rate with the GST rate finder.
4. Put the confirmed code and rate in the invoice JSON.
5. Re-run the audit.

The lookup never asserts that a code is correct. If it did, it would be a classifier, and this kit is not one. For a product with ingredients, composition, end use or a notification condition, ask a CA.

HSN depth cheatsheet:

| AATO | HSN/SAC digits |
| --- | --- |
| Up to ₹5 crore | 4 |
| Above ₹5 crore | 6 |

There is no 8-digit requirement in this kit. An 8-digit code is accepted on the invoice but flagged medium because GSTR-1 Table 12 expects 4 or 6 digits. If your CA wants more depth for internal records, keep it, but use the 6-digit form for GSTR-1 reporting.

B2C relaxation: a supplier with AATO up to ₹5 crore may omit HSN digits on invoices to unregistered persons under the proviso to Notification 78/2020-Central Tax. The engine reports a completely missing code as medium in that case. It remains critical for B2B, for AATO above ₹5 crore, and when AATO is unknown. A present-but-short code is still a digit-depth finding.

## Prompt recipes

### Recipe 1 — Full invoice audit

> Load the GST Invoice & HSN Compliance Kit. Audit the invoice at `examples/invoice.fixture.json` using the local script with a fixed audit date of 2026-10-20. Give me the score and verdict verbatim, the critical and high findings in severity order, the exact field and fix for each, and the turnover band and e-invoice applicability. Then tell me what you cannot conclude from the engine alone. Do not invent an HSN code, a rate or an IRN.

### Recipe 2 — Batch cleanup

> Load the GST Invoice & HSN Compliance Kit. Audit the batch at `examples/invoices.batch.json` with a fixed timestamp. Group duplicate invoice numbers, give me one row per affected invoice, and produce `batch.md`, `batch.json`, `fix-list.md` and `ca-questions.md`. Order the fix list by severity, then invoice number, then field. Do not change any invoice data; list the fixes instead.

### Recipe 3 — HSN orientation

> Load the GST Invoice & HSN Compliance Kit. My business sells software development services and my AATO is ₹60,00,000. Use the HSN lookup to show orientation rows, tell me whether I need 4 or 6 digits, and explain the B2C proviso in plain language. Then tell me exactly where to confirm the code and rate on the GST portal. Do not tell me a code is correct.

### Recipe 4 — CA handoff

> Load the GST Invoice & HSN Compliance Kit. Audit these client invoices and prepare a CA handoff pack with `audit.md`, `audit.json`, `batch.md`, `batch.json`, `fix-list.md` and `ca-questions.md`. Separate mechanical fixes from questions that need a chartered accountant, especially classification, rate, export treatment and any state-specific e-way threshold. Keep the scope footer that says this is not tax advice and not a filing.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Invalid JSON: ...` and exit 2 | Trailing comma, smart quotes, a truncated export | Validate the file with a JSON parser. Export again rather than patching the report. |
| `Cannot read ...` and exit 2 | Wrong path or wrong working folder | From the skill folder, use `../../examples/...`. From the product root, use `examples/...`. |
| `Cannot find module ...lib.mjs` | The script was copied without `lib.mjs`, or run from the wrong folder | Copy the whole skill folder, not just one script. Run from the folder that contains `scripts/`. |
| `--json` or `--md` prints an error | The flag was passed without a path | Use `--json=report.json` and `--md=report.md`. |
| `Strict mode: N critical/high finding(s)` and exit 1 | `--strict` is doing its job | Fix the findings, or drop `--strict` only when you want an inspection run. |
| AATO is null and HSN findings are critical | `business.aato` is missing | Add the turnover in rupees or pass `--aato=<rupees>`. Do not guess. |
| B2C or B2B looks wrong | Recipient GSTIN is blank or present by mistake | Decide from the actual transaction, then encode the correct recipient data. The engine treats a blank GSTIN as B2C. |
| E-way bill finding on a service invoice | The line has no `sac` and no `type: "service"` | Mark the line as a service. Services are excluded from the e-way check. |
| E-way bill finding at exactly ₹50,000 | The threshold is strictly above ₹50,000 | No finding should appear at exactly ₹50,000. If one does, check the grand total and the line types. |
| State e-way threshold differs | Only the ₹50,000 central threshold is modelled | Pass `--ewayBillThreshold=<amount>` with a documented state rule and record the reason. |
| `EINV_IRN_MISSING` on a B2C invoice | A recipient GSTIN is present, so the engine treats it as B2B | Verify whether the sale is really B2B. Do not remove a real buyer GSTIN to dodge the rule. |
| Score is 80 with one finding | One critical finding: 100 − 20 | Expected. Fix it; do not expect `READY TO ISSUE` at 80. |
| The score changes on another day | The audit date changed and the invoice is future-dated or near the 30-day window | Re-run with `--today=YYYY-MM-DD` and state the audit date. |
| The portal rejects a 100/100 invoice | The portal checks more than this kit, or master data differs | Capture the error, map it to a field, fix and re-run. The kit does not guarantee acceptance. |

## FAQ

**Do I need an API key or an internet connection?**
No. The scripts are local Node.js and make no network calls. There is no telemetry.

**Does it file my GST returns?**
No. It audits invoice data before you issue or report. Filing happens in the GST portal or your filing software.

**Does it replace my CA?**
No. It reduces the mechanical cleanup you take to a CA. Classification, rate, export treatment, SEZ, works contracts and liability questions still need a human.

**Can I use it for client invoices?**
Yes. Client-invoice review and delivery are allowed on the Pro and Agency / CA Practice tiers, and for a sole practitioner's own clients on Solo. You may not resell or redistribute the raw files.

**Does it work with Hindi or Hinglish invoice descriptions?**
Yes. Descriptions are free text and are carried through to the report. The checks operate on codes, numbers, dates and GSTINs, not on English keywords, so a Hindi product description does not break the engine. The amount in words is compared in English Indian-numbering form, so keep that field in English or use the expected computed words.

**Where does my invoice data go?**
Nowhere. The scripts read the file you name and write the report paths you name. Nothing is uploaded. Keep client JSON out of public repositories.

**What if the GST portal rejects an invoice that scored 100?**
The kit checks its documented rules, not the portal's full schema or master data. Capture the portal error, map it to the field, correct the invoice and re-run. A clean score is not a guarantee of acceptance.

**What if I need 8-digit HSN?**
This kit does not require 8 digits. Its rule is 4 digits up to ₹5 crore AATO and 6 digits above ₹5 crore, following Notification 78/2020-Central Tax and the GSTN Phase-3 advisory. An 8-digit code is accepted but flagged medium for GSTR-1 formatting. More depth may be an internal or buyer requirement; confirm it with your CA. Do not present 8 digits as a legal minimum based on this kit.

**Does it compute GST liability?**
No. It checks invoice tax arithmetic. It does not net input credit or compute what you owe.

**What is the refund policy?**
30-day money-back guarantee if the package cannot be installed or does not perform the documented checks. Email support@deepakbagada.in with your order ID.

**Can I modify the rules?**
Yes, for your own use. The engine is readable ESM with zero dependencies. Do not redistribute the modified files as a product.

**Why does the batch exit 1 when I only wanted a report?**
The batch command is a gate. It writes the reports first, then exits 1 when critical findings exist. Read the files; the exit code is for automation.

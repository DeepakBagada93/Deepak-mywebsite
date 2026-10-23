# Test Results — GST Invoice & HSN Compliance Kit

## 1. Environment

- Node.js used for the final run: v25.9.0 (the package targets Node.js 20 or newer).
- Pure ESM, zero dependencies, no network calls.
- Working directory: product root (`products/gst-invoice-compliance-kit`).
- Deterministic date: `--today=2026-10-20`.
- Deterministic batch timestamp: `--now=2026-10-20T00:00:00.000Z`.

## 2. Automated Suite

Command:

```bash
node --test tests/
```

Result: **33 passed, 0 skipped, 0 failed** (33 tests, exit code 0).

All functional, CLI, golden-file, dependency, path-leak, secret and documentation
checks ran and passed in the final run. The documentation checks now cover
`skills/gst-invoice-compliance-kit/SKILL.md`, `docs/tutorial-guide.md`,
`docs/store-listing.md`, and `LICENSE.md`.

Functional suite highlights:

- Clean invoice: 100/100, `READY TO ISSUE`, zero findings.
- Broken invoice: `DO NOT ISSUE`, score 0, critical codes `SUP_GSTIN_INVALID`,
  `TAX_SPLIT_WRONG`, `GRAND_TOTAL_MISMATCH`, `EINV_IRN_MISSING`.
- GSTIN checksum accepts `29AAECS1234F1ZK` and `27AAECS1234F1ZO`; rejects `29AAECS1234F1Z5`.
- HSN bands resolve to 4 digits at AATO ≤ ₹5 crore and 6 digits above; 8-digit invoice codes are medium (GSTR-1 formatting), not high.
- B2C small-supplier missing HSN is medium; B2B and AATO > ₹5 crore remain critical.
- E-invoicing requires AATO strictly above ₹5 crore; exactly ₹5 crore is not required. It applies to B2B/export but not domestic B2C; the 30-day window is enforced.
- E-way bill boundary is strictly greater than ₹50,000; services are excluded.
- Amount-in-words normalisation and Indian numbering values pass.
- Batch with three duplicate numbers emits exactly one duplicate finding per invoice
  with `appears on 3 invoices` and score 80 each.
- CLI: clean `--strict` 0, broken `--strict` 1, batch 1, missing input 2.

## 3. Verification Commands

### 3.1 Clean invoice, strict

```bash
node skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs examples/invoice.clean.json --today=2026-10-20 --strict
```

Exit code: **0**.

```text
- Score: **100/100** — READY TO ISSUE
- Critical 0 · High 0 · Medium 0 · Low 0
- Supply type: intra-state (supplier 29 → recipient 29)
- HSN depth required: 4 (AATO up to ₹5 crore)
- E-invoice required: no (domestic B2C)
No findings. Every checked rule passed.
```

### 3.2 Broken fixture

```bash
node skills/gst-invoice-compliance-kit/scripts/audit-invoice.mjs examples/invoice.fixture.json --today=2026-10-20
```

Exit code: **0** (no `--strict`).

```text
- Score: **0/100** — DO NOT ISSUE
- Critical 4 · High 5 · Medium 3 · Low 2
- Supply type: inter-state (supplier 29 → recipient 27)
- HSN depth required: 6 (AATO above ₹5 crore)
- E-invoice required: yes
```

Critical findings: `SUP_GSTIN_INVALID`, `TAX_SPLIT_WRONG`, `GRAND_TOTAL_MISMATCH`,
`EINV_IRN_MISSING`. High findings include `HSN_DIGITS`, three total/tax mismatches and
`NO_AMOUNT_IN_WORDS`.

### 3.3 Batch

```bash
node skills/gst-invoice-compliance-kit/scripts/batch-audit.mjs examples/invoices.batch.json --today=2026-10-20 --now=2026-10-20T00:00:00.000Z
```

Exit code: **1** (the fixture deliberately contains a duplicate invoice number and
therefore critical findings; exit 1 is the intended blocking result).

```text
- Invoices checked: **3**
- Average score: **86.67/100**
- Critical 2 · High 0 · Medium 0 · Low 0
- Duplicate invoice numbers: INV-2026-0142 (2)
```

Each of the two affected invoices receives exactly one `DUP_INVOICE_NUMBER` finding;
the third invoice is clean at 100. `checkedAt` is the supplied deterministic timestamp.

### 3.4 HSN lookup

```bash
node skills/gst-invoice-compliance-kit/scripts/hsn-lookup.mjs "software development" --aato=6000000
```

Exit code: **0**.

```text
Turnover band: AATO up to ₹5 crore → HSN/SAC needs **4 digits**.
Digit depth: 4 digits up to ₹5 crore AATO, 6 digits above ₹5 crore
(Notification 78/2020-Central Tax; GSTN Phase-3 from the May 2025 return period).
There is no 8-digit requirement.
```

The output is orientation only and explicitly tells the user to confirm the exact code
and rate on the GST portal.

## 4. Golden Outputs

Regenerated deterministically after the final code changes:

| File | Result |
| --- | --- |
| `examples/expected/invoice-clean.json` / `.md` | 100/100, `READY TO ISSUE`, zero findings |
| `examples/expected/invoice-fixture.json` / `.md` | 0/100, `DO NOT ISSUE`, 4 critical / 5 high / 3 medium / 2 low |
| `examples/expected/batch.json` / `.md` | 3 invoices, 2 critical (duplicate group of 2), average 86.67, checkedAt `2026-10-20T00:00:00.000Z` |

Repeated runs with the same `--today` and `--now` produce byte-identical JSON.

## 5. Known Gaps / Not Tested

- Live GST portal or IRP authentication, IRN generation or submission.
- Live e-way bill generation or state-portal integration; state-specific thresholds are
  not modelled beyond the ₹50,000 central threshold and an explicit caveat.
- Client IDE installation/activation (Antigravity, Claude Code, Cursor, Codex).
- Correctness of a buyer's HSN/SAC classification or applicable GST rate.
- Legal sufficiency, tax advice, return filing or liability computation.
- Very large batch performance.

These gaps are disclosed in the test plan and are outside the deterministic engine's
stated scope.

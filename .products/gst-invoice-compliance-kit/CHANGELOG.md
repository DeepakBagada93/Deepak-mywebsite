# Changelog

## 1.0.0 — 2026-10-20

- First commercial release.
- Deterministic GST invoice rules engine in `scripts/lib.mjs`, zero dependencies, no network calls.
- GSTIN checks: 15-character structure plus the published base-36 checksum, with supplier critical and recipient high findings.
- Invoice identity checks: required number, 16-character limit, four accepted date formats, impossible-date rejection and future-date flagging.
- HSN/SAC depth: 4 digits for AATO up to ₹5 crore, 6 digits above ₹5 crore, no 8-digit mandate. An 8-digit invoice code is a medium GSTR-1 formatting warning, not a high finding. Notification 78/2020-Central Tax and GSTN Phase-3 (May 2025).
- B2C small-supplier HSN relaxation: a completely missing code is medium for B2C with AATO up to ₹5 crore; B2B and AATO above ₹5 crore remain critical.
- Tax split: intra-state requires equal CGST and SGST; inter-state requires IGST only; wrong split is critical.
- Totals: line taxable value, line tax, line total, subtotal, tax breakup, grand total and amount in words, with Indian-numbering conversion and normalisation.
- E-invoicing: B2B and export applicability where AATO exceeds ₹5 crore (exactly ₹5 crore is outside the mandate), IRN/ACK/QR fields, NI and MC code checks, and the 30-day IRP reporting window for AATO ₹10 crore or more.
- E-way bill: goods only, strictly above ₹50,000, with an explicit state-threshold caveat.
- Batch audit: duplicate invoice numbers grouped once per affected invoice, per-invoice table and CA handoff list.
- Golden fixtures: clean invoice 100/100, broken invoice 0/100 with 4 critical / 5 high / 3 medium / 2 low, three-invoice batch at 86.67 with a duplicate detection.
- Test suite: 33 structural and functional tests using the built-in `node:test` runner.
- Documentation: SKILL.md, README, tutorial guide, store listing, product specification, research dossier, compatibility and commercial license.
- Verified on macOS with Node.js 25.9.0, targeting Node.js 20 or newer.

# Changelog

## 1.0.0 — 2026-10-20

### Added

- Deterministic purchase-register ↔ GSTR-2B reconciliation engine.
- CSV header aliases for common accounting exports.
- GSTIN format and checksum flagging.
- Exact, value-mismatch, date-mismatch, missing-in-2B and missing-in-books classifications.
- Duplicate detection within books and within GSTR-2B.
- Potential ITC at risk and potential unclaimed ITC calculations.
- Supplier follow-up grouping.
- Seven customer-facing output files.
- Strict CLI mode for automation.
- Claude skill with input contract, workflow, output contract and negative constraints.
- Demo and messy fixtures with expected outputs.
- 20 automated tests covering parsing, matching, outputs and CLI behaviour.
- Customer tutorial, validation plan, store listing and compatibility notes.

### Security

- No network calls, telemetry, uploads or API keys.
- Reads only the two input paths; writes only to the chosen output directory.

### Known limitations

- No GSTR-3B filing, legal eligibility, credit notes, reverse charge, imports, ISD or multi-currency.
- One header row per CSV.
- Windows and Node.js 18 are not verified.
- Client-IDE installation is documented but not execution-tested in this session.

# Release report — ITC Recovery Desk 1.0.0

**Status:** READY FOR OWNER APPROVAL  
**Date:** 2026-10-20  
**Release owner:** Deepak Bagada Systems

This report records the technical evidence. It does not authorise publication, pricing, support, licensing or storefront fulfilment. Those require owner approval.

---

## 1. Product summary

ITC Recovery Desk reconciles an Indian purchase register against GSTR-2B from two CSV files. It produces a deterministic exception pack with:

- exact, value-mismatch, date-mismatch, missing-in-2B and missing-in-books classifications;
- duplicate and invalid-GSTIN flags;
- potential ITC at risk and potential unclaimed ITC;
- supplier follow-up;
- seven customer-facing output files.

It does not file returns, determine legal eligibility or provide tax advice.

---

## 2. Artifacts

| Artifact | Path |
|---|---|
| Skill | `skills/itc-recovery-desk/SKILL.md` |
| Reconciliation engine | `skills/itc-recovery-desk/scripts/lib.mjs` |
| CLI | `skills/itc-recovery-desk/scripts/reconcile.mjs` |
| Demo fixtures | `examples/books.csv`, `examples/gstr2b.csv` |
| Messy fixtures | `examples/books-messy.csv`, `examples/gstr2b-messy.csv` |
| Expected outputs | `examples/expected/demo/`, `examples/expected/messy/` |
| Tests | `tests/itc-recovery-desk.test.mjs`, `tests/skill-structure.test.mjs` |
| Tutorial | `docs/tutorial-guide.md` |
| Store listing | `docs/store-listing.md` |
| Validation plan | `docs/validation-plan.md` |
| Distribution archive | `dist/itc-recovery-desk-1.0.0.zip` |

---

## 3. Technical evidence

### Automated tests

```text
node --test tests/*.test.mjs
tests 20
pass 20
fail 0
skipped 0
```

### Demo fixture

- 7 books rows, 7 GSTR-2B rows.
- 6 matched, 1 missing-in-2B, 1 missing-in-books.
- 1 value mismatch (₹90), 1 date mismatch.
- Potential ITC at risk: ₹1,890.
- Potential unclaimed: ₹900.
- Match rate: 85.71%.

### Messy fixture

- 2 duplicate books rows.
- 1 invalid GSTIN checksum.
- 2 missing-in-2B rows.
- Potential ITC at risk: ₹2,700.
- Match rate: 50%.

### Security

- No network calls.
- No telemetry.
- No API keys.
- No runtime dependencies.
- Reads only the two input paths; writes only to `--out`.

---

## 4. Validator results

| Check | Command | Result |
|---|---|---|
| Product structure | `node .agent/scripts/validate-product.mjs products/itc-recovery-desk` | 0 failures; 1 manual-review note on clean-environment installation and commercial terms |
| Skill readiness | `node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/itc-recovery-desk` | 0 failures; no ZIP warning resolved by packaging |
| Package audit | `node .agent/scripts/audit-package.mjs products/itc-recovery-desk` | 0 failures; 45 safe entries in `itc-recovery-desk-1.0.0.zip` |

The archive contains only customer-facing files. No `.agent`, `.env`, `node_modules`, absolute path, secret or symlink is included.

---

## 5. Known limitations

- No GSTR-3B filing or liability computation.
- No legal ITC eligibility or section 17(5) blocking.
- No credit notes, reverse charge, imports, ISD or multi-currency.
- One header row per CSV.
- Invoice-number punctuation is normalised for matching.
- No performance guarantee for very large files.
- Windows and Node.js 18 are not verified.
- Client-IDE installation is documented but not execution-tested.
- Demand, pricing and ad performance are not validated.

---

## 6. Owner decisions required

Before publication:

1. Approve final pricing and launch discount.
2. Approve the licence terms and governing law.
3. Approve support scope and response expectations.
4. Approve the 30-day refund policy.
5. Approve the storefront and fulfilment method.
6. Confirm whether the tax-positioning review is sufficient or legal review is required.
7. Approve the first distribution channel and budget.

---

## 7. Release state

**READY FOR OWNER APPROVAL** — not published, not charged, not deployed.

No public action has been taken. No `RELEASE VERIFIED` claim is made.

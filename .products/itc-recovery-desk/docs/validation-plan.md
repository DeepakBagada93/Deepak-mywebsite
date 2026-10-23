# 14-day validation plan — ITC Recovery Desk

**Goal:** prove a CA firm will pay for a tested reconciliation pack before spending more time on distribution or feature expansion.

**Rule:** do not build v1.1 features until the gate passes. The product is already usable; the next risk is demand, not code.

---

## Week 1 — interviews and manual audits

### Day 1–2: recruit 10 CA firms

Sources:

- LinkedIn CA and GST practitioner communities.
- TaxGuru commenters and contributors.
- CA WhatsApp/Telegram groups.
- Local CA study circles.
- Existing GST kit buyers or waitlist.

Ask for a 15-minute call, not a demo. Offer a free reconciliation of one anonymised file pair.

### Day 3–5: interview script

Ask:

1. How many GST clients do you handle each month?
2. Who prepares the purchase register, and in what tool?
3. How do you compare it with GSTR-2B today?
4. How long does the first pass take?
5. What usually causes a mismatch?
6. What happens when a supplier has not filed?
7. Have you ever left ITC unclaimed because the reconciliation was too late?
8. What would you pay for a tool that produced the exception list and supplier follow-up?
9. What would make you distrust the output?
10. Would you run it on client data locally, or only in a cloud tool?

Record exact phrases. Do not lead the witness with “would you pay ₹1,999?” until the pain is established.

### Day 6–7: run 3 manual reconciliations

Request anonymised pairs:

- purchase register export (CSV/Excel);
- GSTR-2B export (CSV/Excel).

Run the current v1 on each. Record:

- rows in each file;
- exceptions by type;
- potential ITC at risk;
- potential unclaimed;
- time to clean the input and run;
- questions the output could not answer.

**Pass criteria:**

- 3 firms share data.
- Median potential ITC difference > ₹10,000 per 100 invoices.
- At least 5 firms say the exception list matches a real problem they recognise.
- At least 5 firms would pay ₹1,999 for a tested version.

---

## Week 2 — pre-sell and distribution test

### Day 8–9: landing page and lead magnet

Create:

- one-page landing page with the promise, sample output, limitations and price;
- free “ITC Leak Calculator” for 10 invoices (a trimmed version of the demo);
- two anonymised before/after screenshots;
- a 60-second screen recording.

Do not publish the full product until the gate passes. The landing page can collect pre-orders or pilot applications.

### Day 10–12: content test

Publish three posts:

1. **Teardown:** “We reconciled a 214-invoice purchase register against GSTR-2B. Here are the 4 exception types and the ₹1,42,380 question.”
2. **Checklist:** “The 9 checks a CA should run before claiming ITC.”
3. **Contrarian:** “Your purchase register is not the truth. GSTR-2B is not the truth either. The gap is the work.”

Use a real anonymised finding or a clearly labelled sample. Do not invent a client result.

### Day 13–14: offer and decision

Offer:

- Solo pre-order: ₹1,999.
- Firm pilot: ₹4,999 for 5 client files plus a 30-minute review call.
- Free calculator in exchange for an email/WhatsApp contact.

**Gate:**

- 5 Solo pre-orders, or
- 3 Firm pilots, or
- 10 qualified conversations with 3 requests for a paid pilot.

If the gate passes, publish v1.0.0 and start fulfilment.

If the gate fails:

- pivot to **ClientChase OS** for the same CA audience;
- or sell the reconciliation as a done-with-you service first;
- do not add features hoping demand appears.

---

## Metrics to record

| Metric | Target | Actual |
|---|---:|---:|
| CA interviews | 10 | |
| File pairs tested | 3 | |
| Median ITC difference per 100 invoices | > ₹10,000 | |
| Firms recognising the problem | 5 | |
| Solo pre-orders | 5 | |
| Firm pilots | 3 | |
| Landing-page conversion | > 5% | |
| Support questions about input format | < 5 per 10 buyers | |

---

## What counts as proof

- A paid pre-order is proof.
- A signed pilot is proof.
- A verbal “this is useful” is not proof.
- A downloaded free calculator is interest, not demand.
- A LinkedIn like is not demand.

---

## Risks to watch

- **“I already have a CA who does this.”** → Position as a tool the CA uses, not a replacement.
- **“I can do this in Excel.”** → Show the time, duplicate detection, GSTIN checksum and repeatability.
- **“Is this legal/tax advice?”** → Reinforce the boundary: data preparation only.
- **“I cannot share client data.”** → Offer a local run and a sample-file demo.
- **“₹1,999 is too much for a sheet.”** → Sell the firm tier and the supplier follow-up workflow, not the sheet.

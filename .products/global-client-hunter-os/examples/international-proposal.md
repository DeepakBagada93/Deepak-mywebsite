# Engineering Scope & Architecture Proposal

**Client**: Apex Logistics Cloud Inc. (Austin, TX)  
**Partner**: DevCraft Studio  
**Engagement Type**: 2-Week Performance & Geospatial Optimization Sprint  
**Target Delivery Window**: 14 Calendar Days  

---

## 1. Problem & Executive Objective
Apex's fleet dashboard experiences severe UI degradation when tracking >50 live vehicles simultaneously. The objective of this sprint is to decouple map rendering from high-frequency WebSocket updates, ensuring continuous 60fps interaction and mobile load times under 2.0s.

---

## 2. Milestone Deliverables & Architecture Schedule

### Phase 1: Diagnostics & State Decoupling (Days 1–4)
* Profile runtime flame charts on Mapbox canvas interactions.
* Refactor parent state container to push telemetry updates directly into isolated WebGL geojson source layers via diff patching.
* **Milestone 1 Deliverable**: Staging branch demonstrating 60fps rendering under 100 simulated vehicle telemetry streams.

### Phase 2: Mobile Core Web Vitals & Bundle Trimming (Days 5–9)
* Implement dynamic code splitting on heavy geospatial dependencies (Turf.js, Mapbox layers).
* Modernize image & vector asset pipelines to reduce LCP from 4.8s to <1.8s on 4G networks.
* **Milestone 2 Deliverable**: Verified Lighthouse audit score of 90+ on mobile viewport.

### Phase 3: QA, Staging Verification & Handover (Days 10–14)
* Full regression test suite run across Chrome, Safari iOS, and Android.
* 1-hour recorded technical walkthrough and documentation handover for Apex's internal engineers.
* **Milestone 3 Deliverable**: Production pull request approved and merged.

---

## 3. Investment & Commercial Terms

| Package | Scope | Investment |
|---|---|---|
| **Sprint MVP** | Phase 1 Mapbox Decoupling Only | $2,750 USD |
| **Complete Performance Sprint (Recommended)** | Phase 1 + Phase 2 + Phase 3 + 30-day warranty | $4,800 USD |
| **Ongoing Fractional Engineering Retainer** | 20 hours/month dedicated senior support | $3,200 USD / month |

### Payment Terms
* 50% initial deposit upon signature via Stripe Invoicing / International SWIFT wire.
* 50% milestone balance upon successful staging demo and PR handover.
* Compliant with 0% IGST export of services under Indian GST LUT provisions.

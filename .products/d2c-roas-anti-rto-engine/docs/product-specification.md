# Product Specification: Indian D2C ROAS & Anti-RTO Engine

## 1. Product Identity
* **Name**: Indian D2C ROAS & Anti-RTO Engine
* **Slug**: `d2c-roas-anti-rto-engine`
* **Version**: 1.0.0
* **Category**: `ai-skill-bundle`

---

## 2. System Architecture & Workflows

```
┌────────────────────────────────────────────────────────────────────────┐
│                   INDIAN D2C ROAS & ANTI-RTO ENGINE                    │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Product & Audience Ingestion (AOV, USP, COD%, Target Cities)        │
│                                ↓                                       │
│ 2. High-CTR Hinglish Meta Ad Generator (Reels UGC, Hooks, Video Cues)  │
│                                ↓                                       │
│ 3. Address Hygiene & Bogus Order Scoring (Pincode & Completeness)      │
│                                ↓                                       │
│ 4. WhatsApp 2-Touch COD Confirmation & UPI Prepayment Converter        │
│                                ↓                                       │
│ 5. Post-Delivery Retention & 5-Star WhatsApp Review Collector          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Schemas & Risk Rubrics

### RTO Risk Scoring Matrix
* **Score 0–25 (LOW RISK)**:
  * Full address (Flat/House #, Road name, Landmark, Pincode).
  * Valid 10-digit Indian mobile number.
  * *Action*: Auto-dispatch without delay.
* **Score 26–55 (MEDIUM RISK)**:
  * Missing landmark or village name without street.
  * *Action*: Trigger WhatsApp Address Confirmation message.
* **Score 56–100 (HIGH RISK)**:
  * Incomplete address (e.g. only city name), suspicious buyer name ("test", "asdf"), repeated order within 10 minutes.
  * *Action*: Hold shipment; require WhatsApp confirmation + ₹100 advance UPI commitment before dispatch.

### Ad Output Structure
* **Hook Line (0–3 seconds)**: Bold on-screen text + visual cue.
* **Problem / Agitation (3–12 seconds)**: Relatable Indian pain point.
* **Solution & Demonstration (12–22 seconds)**: Product in action.
* **Call to Action (22–30 seconds)**: Offer + COD availability guarantee.

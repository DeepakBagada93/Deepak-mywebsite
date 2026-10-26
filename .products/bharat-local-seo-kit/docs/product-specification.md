# Product Specification: Bharat Local SEO Kit

## 1. Product Identity
* **Name**: Bharat Local SEO & Google Business Domination Kit
* **Slug**: `bharat-local-seo-kit`
* **Version**: 1.0.0
* **Category**: `ai-skill-bundle`

---

## 2. Core Workflows & Logic

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BHARAT LOCAL SEO SUITE                          │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Business & Geo Profile Ingestion (Locality, Pincode, Landmark)      │
│                                ↓                                       │
│ 2. NAP Consistency & Local Keyword Architecture                        │
│                                ↓                                       │
│ 3. Structured JSON-LD LocalBusiness Schema Generator                   │
│                                ↓                                       │
│ 4. 52-Week Festive & Seasonal GBP Update Engine                        │
│                                ↓                                       │
│ 5. Sentiment-Aware Review Responder (Praise vs Dispute Escalation)     │
│                                ↓                                       │
│ 6. Agency Audit & Client Pitch Generator (Optional Retainer Pitch)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Schemas & Data Contracts

### Review Responder Rules
* **Rating >= 4 Stars**:
  * Thank user by name if available.
  * Explicitly mention the specific service/procedure praised (reinforces keyword relevance in GBP index).
  * Sign off with business team name.
* **Rating <= 3 Stars**:
  * Sincere apology without admitting legal liability.
  * Direct escalation channel: WhatsApp number or manager email.
  * Request 24 hours to investigate and resolve offline.

### Schema Requirements
* Standard `https://schema.org/LocalBusiness` or specific subtype (`Dentist`, `MedicalBusiness`, `AccountingService`, `Restaurant`).
* Valid `geo` object containing latitude and longitude.
* Standard ISO 8601 opening hours format.

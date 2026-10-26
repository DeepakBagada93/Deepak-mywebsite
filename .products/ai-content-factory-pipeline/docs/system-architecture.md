# System Architecture: AI Content Factory Pipeline

**Product:** Autonomous Multi-Agent Content & SEO Publishing Pipeline  
**Slug:** `ai-content-factory-pipeline`  

---

## 1. Multi-Agent Pipeline Topology

```mermaid
graph TD
    A["Topic Ingestion Webhook / Airtable"] --> B["Slugifier & Keyword Normalizer"]
    B --> C["Deep Authoring Agent (GPT-4o / Claude 3.5 Sonnet)"]
    C --> D["Anti-AI Fluff & Schema Validator"]
    D --> E["Slack Interactive Preview (Deck + Title + Stats)"]
    E -->|Approved| F["Direct CMS Sync (WordPress / Webflow REST API)"]
    E -->|Re-Draft Needed| C
    D -->|Error / Rate Limit| G["Dead-Letter Slack Alert"]
```

---

## 2. Inbound Data Contract

```json
{
  "topic": "Building Resilient Multi-Agent AI Workflows in Production",
  "primaryKeyword": "multi-agent ai workflows",
  "targetAudience": "Principal Engineers & CTOs",
  "wordCountTarget": 1600
}
```

### Response Schema
```json
{
  "status": "completed",
  "jobId": "job_398a1",
  "slug": "multi-agent-ai-workflows",
  "metaTitle": "Multi-Agent AI Workflows: Architecture, Code & Production Scaling",
  "metaDescription": "A complete guide to building production multi-agent AI systems with dead-letter recovery, schema validation, and low latency.",
  "stagedInSlack": true,
  "timestamp": "2026-10-25T11:37:00.000Z"
}
```

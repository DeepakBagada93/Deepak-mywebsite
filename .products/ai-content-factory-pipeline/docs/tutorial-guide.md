# AI Content Factory Pipeline — Implementation Manual
**Production Release v1.0.0 | Deepak Bagada Systems**

---

## 1. System Overview

The **AI Content Factory Pipeline** is an automated multi-agent content generation and publishing engine. It ingests target topics and keywords, constructs comprehensive 1,400+ word engineering-grade technical guides, generates JSON-LD Schema markup, and stages preview drafts in Slack for 1-click publishing to WordPress, Webflow, or Ghost.

### Core Architecture Pillars
- **Zero AI Clichés:** Systematically eliminates generic opening hooks, buzzwords, and repetitive filler.
- **Human-in-the-Loop Control:** Directs article previews to your Slack channel before pushing live to your CMS.
- **Self-Hostable:** Includes Docker compose for 1-click self-hosting with zero platform fees.

---

## 2. Prerequisites & Credentials Checklist

| Platform | Required Scope | Where to Obtain |
| :--- | :--- | :--- |
| **n8n or Make.com** | Active Workflow Instance | Self-hosted or Cloud |
| **OpenAI / Claude API** | Model execution (`gpt-4o`) | [platform.openai.com](https://platform.openai.com) |
| **WordPress / Webflow** | Application Password / API Token | CMS Dashboard $\rightarrow$ Users $\rightarrow$ Application Passwords |
| **Slack** | Incoming Webhook | [api.slack.com/apps](https://api.slack.com/apps) |

---

## 3. Environment Configuration (`.env`)

Configure the included `.env.example`:

```env
OPENAI_API_KEY=your_openai_api_key_here
SLACK_APPROVAL_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
PORT=5680
```

---

## 4. Step-by-Step Installation & Import

### Step 1: Start Container Stack
```bash
docker compose up -d
```
Access the environment at `http://localhost:5680`.

### Step 2: Import Workflow Blueprint
1. In n8n, go to **Workflows $\rightarrow$ Import from File**.
2. Select `workflows/n8n-content-factory.json`.
3. Bind your OpenAI credentials to the **OpenAI GPT-4o Writing Engine** node.
4. Bind your Slack webhook URL in the **Send Slack Preview & Approval** node.

---

## 5. Verification & Sandbox Run

Trigger an article generation job via terminal:

```bash
curl -X POST "http://localhost:5680/webhook/content-topic-trigger" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Zero-Downtime Database Migration Strategies in Distributed Systems",
    "primaryKeyword": "zero downtime database migration",
    "targetAudience": "DevOps Engineers and Cloud Architects",
    "wordCountTarget": 1500
  }'
```

### Expected Output
The endpoint returns:
```json
{
  "status": "completed",
  "jobId": "job_98432b",
  "slug": "zero-downtime-database-migration",
  "metaTitle": "Zero-Downtime Database Migrations: Dual-Write & Shadow Schema Guide",
  "metaDescription": "Step-by-step technical blueprints for executing zero-downtime database migrations with dual-write patterns and rollback fail-safes.",
  "stagedInSlack": true,
  "timestamp": "2026-10-25T11:37:00.000Z"
}
```

A preview card with word count, title, and excerpt will appear in your Slack channel for editorial review.

---

## 6. Troubleshooting & Error Recovery Matrix

| Issue | Root Cause | Fix |
| :--- | :--- | :--- |
| **Timeout during generation** | Long generation time on 1,500+ words | Set execution timeout to 60s in container environment. |
| **`429 Rate Limit`** | OpenAI TPM limits | The pipeline uses automatic backoffs. Verify Tier 2+ OpenAI billing status. |
| **WordPress 401 error** | Invalid App Password | Re-generate Application Password in WordPress User profile. |

---
*Deepak Bagada Systems &bull; Enterprise AI Product Suite*

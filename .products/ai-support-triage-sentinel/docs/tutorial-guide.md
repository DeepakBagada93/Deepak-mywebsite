# AI Support Triage Sentinel — Implementation Manual
**Production Release v1.0.0 | Deepak Bagada Systems**

---

## 1. System Overview

The **AI Support Triage Sentinel** is a production AI automation workflow engineered to triage customer support tickets, evaluate churn danger and urgency (1–5 scale), classify categories, draft context-rich replies, and alert your support team via Slack whenever a critical issue or enterprise account needs immediate attention.

### Key Performance Metrics
- **Processing Time:** Under 2 seconds per incoming ticket.
- **Fail-Safe Mechanism:** Automatic fallbacks; unhandled errors route to a dedicated admin dead-letter queue.
- **Human-in-the-Loop Safe:** Saves AI responses as *draft notes* so humans retain final control before customer send.

---

## 2. Prerequisites & Credentials Checklist

Ensure you have credentials ready before starting:

| Platform | Required Scope | Where to Obtain |
| :--- | :--- | :--- |
| **n8n or Zapier** | Workflow Canvas Access | Self-hosted n8n instance or Zapier account |
| **OpenAI / Claude API** | Model execution (`gpt-4o` / `claude-3-5-sonnet`) | [platform.openai.com](https://platform.openai.com) |
| **Helpdesk (Zendesk / Freshdesk)** | Webhook Trigger / API Access | Admin $\rightarrow$ Apps & Integrations $\rightarrow$ Webhooks |
| **Slack** | Incoming Webhook | [api.slack.com/apps](https://api.slack.com/apps) |

---

## 3. Environment Configuration (`.env`)

Configure the included `.env.example` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
SLACK_ESCALATION_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
PORT=5679
```

---

## 4. Step-by-Step Installation & Deployment

### Step 1: Launch the Docker Container Stack
Run this in the product directory to launch the dedicated container stack:
```bash
docker compose up -d
```
Navigate to `http://localhost:5679` to open your n8n support environment.

### Step 2: Import Workflow Blueprint
1. In your n8n interface, click **Workflows $\rightarrow$ Import from File**.
2. Select `workflows/n8n-support-triage.json`.
3. Bind your OpenAI credentials in the **OpenAI GPT-4o Model** node.
4. Bind your Slack Webhook URL in the **Post to #urgent-support Slack** node.

### Step 3: Connect Helpdesk Webhook Trigger
1. In Zendesk or Freshdesk, create an automated trigger:
   - **Condition:** *Ticket is Created*
   - **Action:** *Notify Active Webhook* $\rightarrow$ Target URL: `http://localhost:5679/webhook/support-ticket-inbound`
   - **Payload:** Select JSON format matching the schema in Section 5.

---

## 5. Verification & Test Run

Simulate an urgent production ticket by executing this terminal command:

```bash
curl -X POST "http://localhost:5679/webhook/support-ticket-inbound" \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "TCK-99014",
    "customerEmail": "lead-architect@cloudscale.io",
    "planTier": "ENTERPRISE",
    "subject": "CRITICAL: Database connection pool exhausted during peak traffic",
    "description": "Our analytics worker cluster is crashing due to database socket exhaustion. Customers are reporting dashboard load failures."
  }'
```

### Expected Output Response
```json
{
  "status": "triaged",
  "ticketId": "TCK-99014",
  "category": "BUG_OUTAGE",
  "urgencyScore": 5,
  "escalated": true,
  "draftedReply": "Hello Cloudscale Team, Thank you for alerting us. Because this involves database connection socket exhaustion on an Enterprise account, this has been escalated directly to our senior infrastructure on-call engineer...",
  "timestamp": "2026-10-25T11:35:00.000Z"
}
```

---

## 6. Failure Recovery & Troubleshooting Matrix

| Issue | Root Cause | Fix |
| :--- | :--- | :--- |
| **`400 Bad Request`** | Missing required payload keys | Ensure `ticketId`, `subject`, and `description` are included in JSON. |
| **`429 Rate Limit`** | High burst of support tickets | n8n will hold and retry using Redis queue backoff. |
| **Slack message fails** | Inactive Slack webhook | Re-generate incoming webhook in Slack App Directory. |

---
*Deepak Bagada Systems &bull; Enterprise AI Product Suite*

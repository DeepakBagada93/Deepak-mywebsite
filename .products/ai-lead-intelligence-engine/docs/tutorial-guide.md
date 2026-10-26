# AI Lead Intelligence & CRM Dispatch System — Implementation Manual
**Production Release v1.0.0 | Deepak Bagada Systems**

---

## 1. System Overview

The **AI Lead Intelligence & CRM Dispatch System** is a turn-key enterprise workflow automation that captures inbound website leads, analyzes company domain signals, scores purchase intent (0–100) using GPT-4o, drafts personalized email icebreakers, updates your CRM, and alerts sales reps in Slack within 3 seconds.

### Core Value Specifications
- **Execution Speed:** 1.8 seconds average end-to-end response.
- **Fail-Safe Mechanism:** Automatic retry queue on API rate limits; zero leads dropped.
- **Privacy & Security:** Zero data training on public models; sanitized credential bindings.

---

## 2. Prerequisites & Credentials Checklist

Ensure you have credentials for the following services before beginning:

| Platform | Required Scope | Where to Obtain |
| :--- | :--- | :--- |
| **n8n or Make.com** | Active instance or account | Self-hosted via Docker or Cloud |
| **OpenAI API** | Model access (`gpt-4o`) | [platform.openai.com](https://platform.openai.com) |
| **HubSpot / Salesforce** | Contacts Write Access | CRM Developer Settings / Private App Token |
| **Slack** | Incoming Webhooks | [api.slack.com/apps](https://api.slack.com/apps) |

---

## 3. Environment Configuration (`.env`)

Copy `.env.example` to your workspace root or configure these variables inside your automation runner:

```env
OPENAI_API_KEY=your_openai_key_here
SLACK_ALERT_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
CRM_PLATFORM=hubspot
HUBSPOT_ACCESS_TOKEN=your_hubspot_token_here
HIGH_INTENT_THRESHOLD=80
```

---

## 4. Step-by-Step Installation & Import

### Option A: Self-Hosted Deployment via Docker (Recommended)
1. Ensure Docker and Docker Compose are installed on your server or local machine.
2. In the product directory, start the container stack:
   ```bash
   docker compose up -d
   ```
3. Open your browser and navigate to `http://localhost:5678`.
4. Create your initial admin login credentials.

### Option B: 1-Click Import into n8n Canvas
1. In your n8n dashboard, click **Workflows $\rightarrow$ Import from File**.
2. Select the file: `workflows/n8n-lead-intelligence.json`.
3. The workflow canvas will populate with all pre-configured nodes and connection routing.

### Option C: 1-Click Import into Make.com
1. Create a new scenario in Make.com.
2. Click the three dots `...` at the bottom and choose **Import Blueprint**.
3. Select `workflows/make-lead-intelligence.json`.

---

## 5. Credential Binding & Webhook Setup

1. Double-click the **GPT-4o Engine** node $\rightarrow$ Select your OpenAI credential.
2. Double-click the **Instant Slack VIP Alert** node $\rightarrow$ Paste your Slack Incoming Webhook URL.
3. Open the **Inbound Lead Webhook** node and switch the path to `inbound-lead`.
4. Copy the production webhook URL (e.g. `https://n8n.yourdomain.com/webhook/inbound-lead`).
5. Connect your website form (Webflow, WordPress, Typeform, or custom frontend) to send a POST request with the prospect payload.

---

## 6. Verification Sandbox & Test Run

Run this command in your terminal to simulate a high-intent enterprise lead:

```bash
curl -X POST "http://localhost:5678/webhook/inbound-lead" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "David Sterling",
    "email": "david@apexlogistics.io",
    "company": "Apex Logistics Group",
    "message": "We manage 12,000 monthly shipments and urgently need AI document parsing to reduce custom invoice review time."
  }'
```

### Expected JSON Response
```json
{
  "status": "processed",
  "leadId": "lead_98432a1",
  "score": 95,
  "tier": "HOT",
  "action": "INSTANT_DISPATCH",
  "timestamp": "2026-10-25T11:00:00.000Z"
}
```

### Expected Slack Notification
A rich notification card will instantly arrive in your designated Slack sales channel:
> 🔥 **HIGH-INTENT LEAD DETECTED (Score: 95/100)**  
> **Prospect:** David Sterling (Apex Logistics Group)  
> **Email:** david@apexlogistics.io  
> **Analysis:** Corporate logistics buyer with explicit scale and urgent timeline.  
> **Drafted Icebreaker:** *"Hi David, saw your note regarding Apex's 12,000 monthly shipments. We have pre-built document parsing pipelines built specifically for high-volume freight bills—happy to show a 5-minute live sandbox."*

---

## 7. Troubleshooting & Error Recovery Matrix

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`401 Unauthorized`** | Expired or incorrect OpenAI key | Test key validity with `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`. |
| **`429 Rate Limit`** | OpenAI account TPM limit hit | Workflow automatically triggers exponential backoff. Upgrade your OpenAI usage tier if volume exceeds 500 leads/hour. |
| **Slack message not sending** | Invalid Slack webhook endpoint | Ensure webhook URL begins with `https://hooks.slack.com/services/`. |
| **Webhook timeout (>15s)** | Network latency or DNS issue | Check that n8n container has unrestricted outbound HTTPS internet access. |

---
*Deepak Bagada Systems &bull; Enterprise AI Product Suite &bull; Commercial License*

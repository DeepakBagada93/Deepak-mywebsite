# System Architecture: AI Support Triage Sentinel

**Product:** Autonomous Customer Support & Ticket Escalation Sentinel  
**Slug:** `ai-support-triage-sentinel`  

---

## 1. Sequence & Routing Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as Customer / User
    participant Desk as Helpdesk (Zendesk / Intercom / Form)
    participant WH as Webhook Ingestion Engine
    participant Agent as GPT-4o Triage & Drafting Agent
    participant Gate as Urgency Gate (Score >= 4 or Enterprise)
    participant Slack as #urgent-support Slack Channel
    participant Reply as Helpdesk Draft Sync

    User->>Desk: Submits support ticket
    Desk->>WH: Inbound Webhook Event (JSON)
    WH->>WH: Validate schema & sanitize user input
    WH->>Agent: Prompt AI with ticket content & customer tier
    Agent->>Agent: Score urgency (1-5), classify category, draft resolution
    Agent->>Gate: Return structured triage decision
    alt Urgency >= 4 or Enterprise VIP
        Gate->>Slack: Send Urgent Escalation Card with 1-click review
        Gate->>Reply: Save suggested reply as internal draft note
    else Standard Inquiry (Urgency < 4)
        Gate->>Reply: Save suggested reply as ready-to-send draft
    end
    Gate->>Desk: HTTP 200 OK
```

---

## 2. Ingestion Data Contract

```json
{
  "ticketId": "TCK-88192",
  "customerEmail": "cto@acmecorp.com",
  "planTier": "ENTERPRISE",
  "subject": "Production API endpoints throwing 504 gateway timeout",
  "description": "Our mobile clients cannot reach the user profile service since 10:45 AM UTC. All payments are failing."
}
```

### Triaged Output Schema
```json
{
  "status": "triaged",
  "ticketId": "TCK-88192",
  "category": "BUG_OUTAGE",
  "urgencyScore": 5,
  "escalated": true,
  "draftedReply": "Hello Acme Corp Team, We have immediately flagged this high-priority production issue to our core infrastructure team...",
  "timestamp": "2026-10-25T11:35:00.000Z"
}
```

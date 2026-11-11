# Customer Tutorial & Implementation Guide: AI SDR & Inbound Lead Closer

## Quick 15-Minute Setup

### Step 1: Spin up n8n with Docker Compose
If you are self-hosting, run:
```bash
docker-compose up -d
```
Visit `http://localhost:5678` and complete your admin account setup.

### Step 2: Import the Workflows
1. Inside n8n, click **Workflows** → **Import from File**.
2. Select `workflows/main-automation.json`.
3. Repeat for `workflows/error-handler-subflow.json`.

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` or set environment credentials directly in n8n Credentials:
- `ANTHROPIC_API_KEY`: Your Claude 3.5 Sonnet API key.
- `BOOKING_URL`: Your Cal.com or Calendly link (e.g., `https://cal.com/agency/30min`).
- `SALES_SLACK_WEBHOOK_URL`: Slack Incoming Webhook for your sales team channel.

### Step 4: Connect Your Inbound Form
Point your Typeform, Webflow form, or landing page submit webhook to:
```
https://your-n8n-domain.com/webhook/inbound-lead
```

### Step 5: Test Execution
Run the verification test script:
```bash
curl -X POST http://localhost:5678/webhook-test/inbound-lead \
  -H "Content-Type: application/json" \
  -d @tests/sample-payload.json
```
Verify the lead is scored, drafted in Claude, and alerted on Slack within 3 seconds!

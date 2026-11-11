# Customer Tutorial: AI Invoice Recon Sentinel

## Setup in 15 Minutes

### 1. Start Container
```bash
docker-compose up -d
```

### 2. Configure Accounting Credentials
In `.env` or n8n credentials:
- `OPENAI_API_KEY`: Vision parsing token.
- `SLACK_FINANCE_WEBHOOK_URL`: Your internal finance/accounting Slack channel.

### 3. Import Workflow
Import `workflows/main-automation.json` into n8n.

### 4. Send Test Ingestion Webhook
```bash
curl -X POST http://localhost:5681/webhook-test/ingest-invoice-receipt \
  -H "Content-Type: application/json" \
  -d @tests/sample-payload.json
```
Verify the invoice parses net amounts, audits tax percentages, and syncs cleanly to Slack!

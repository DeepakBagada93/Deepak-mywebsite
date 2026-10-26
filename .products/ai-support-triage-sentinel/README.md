# Autonomous Customer Support & Ticket Escalation Sentinel

**Commercial AI Workflow Product v1.0.0 | Deepak Bagada Systems**

Automate ticket triage, sentiment evaluation, churn risk detection, and instant Slack escalations for high-value enterprise accounts.

## Quick Start

```bash
# 1. Start self-hosted support runner
docker compose up -d

# 2. Open interface
open http://localhost:5679

# 3. Import workflows/n8n-support-triage.json
# 4. Verify endpoint
bash tests/test-ticket-curl.sh
```

## Included Assets
- `workflows/`: Production JSON blueprints for n8n and Zapier.
- `pdf/`: High-resolution Implementation Guide PDF.
- `docs/`: System architecture, tutorials, and store listing.
- `tests/`: Sample ticket JSON and testing script.
- `docker-compose.yml`: Self-hosted container stack with Postgres & Redis.
- `dist/`: Clean customer distribution ZIP package.

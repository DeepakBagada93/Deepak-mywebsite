# AI Lead Intelligence & CRM Auto-Enrichment System

**Commercial AI Workflow Product v1.0.0 | Deepak Bagada Systems**

Turn raw website form leads into qualified, enriched CRM records with AI-crafted icebreakers and real-time Slack notifications in under 3 seconds.

## Quick Start (Self-Hosted n8n)

```bash
# 1. Start the stack
docker compose up -d

# 2. Access canvas
open http://localhost:5678

# 3. Import workflow
# Import workflows/n8n-lead-intelligence.json into the n8n UI.

# 4. Bind credentials in .env and run verification
bash tests/test-lead-curl.sh
```

## Package Contents

- `workflows/`: Production JSON exports for n8n and Make.com.
- `pdf/`: High-resolution PDF Implementation Manual.
- `docs/`: Technical architecture, tutorials, and commercial sales copy.
- `tests/`: Sample payload and curl sandbox verification script.
- `docker-compose.yml`: Turnkey self-hosted PostgreSQL, Redis, and n8n stack.
- `dist/`: Clean, redistributable ZIP distribution package.

# Autonomous Multi-Agent Content & SEO Publishing Pipeline

**Commercial AI Workflow Product v1.0.0 | Deepak Bagada Systems**

Automate research, drafting, anti-AI-fluff auditing, and CMS staging for technical long-form content.

## Quick Start

```bash
# 1. Start Docker stack
docker compose up -d

# 2. Access n8n
open http://localhost:5680

# 3. Import workflows/n8n-content-factory.json
# 4. Trigger test article generation
bash tests/test-content-curl.sh
```

## Package Directory Tree
- `workflows/`: Production JSON blueprints for n8n and Make.com.
- `pdf/`: High-resolution Implementation Guide PDF.
- `docs/`: System architecture, tutorials, and store listing.
- `tests/`: Sample topic JSON and testing script.
- `docker-compose.yml`: Self-hosted container stack with Postgres & Redis.
- `dist/`: Clean customer distribution ZIP package.

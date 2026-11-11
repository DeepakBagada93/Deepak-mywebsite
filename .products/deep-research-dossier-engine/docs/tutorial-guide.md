# Customer Tutorial: Deep Research & Competitive Dossier Engine

## Quick Setup Guide

### 1. Launch with Docker Compose
```bash
docker-compose up -d
```

### 2. Configure Credentials in n8n
- **TAVILY_API_KEY:** Get a free API key at [tavily.com](https://tavily.com) (1,000 free searches/month).
- **ANTHROPIC_API_KEY:** Claude 3.5 Sonnet API key.
- **SLACK_RESEARCH_WEBHOOK_URL:** (Optional) Channel for research completion alerts.

### 3. Import Workflow
Import `workflows/main-automation.json` into your n8n workspace.

### 4. Trigger Your First Deep Research Run
```bash
curl -X POST http://localhost:5679/webhook-test/initiate-deep-research \
  -H "Content-Type: application/json" \
  -d '{"topic": "Next.js AI hosting platforms", "competitor": "Vercel vs Netlify vs Cloudflare"}'
```
Within 45 seconds, receive an exhaustive, cited competitive intelligence report!

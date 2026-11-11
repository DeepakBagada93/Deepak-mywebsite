# Autonomous AI SDR & Inbound Lead Closer

> Production-ready turnkey n8n automation system for inbound B2B lead enrichment, AI qualification, and instant calendar booking.

## Quick Specs
- **Category:** Workflow Automation
- **Engines:** n8n (Cloud / Self-Hosted) & Make.com
- **LLM Support:** Anthropic Claude 3.5 Sonnet / OpenAI GPT-4o
- **Testing:** Automated node test suite included (`tests/test-lead-scoring.test.mjs`)

## Directory Overview
- `workflows/`: Pre-configured, sanitized workflow JSON files.
- `docker-compose.yml`: Turnkey n8n + Postgres stack.
- `.env.example`: Secure credential templates.
- `docs/`: Complete market research, system architecture, tutorial guide, and store listing.
- `tests/`: Automated unit tests and mock payloads.

## Running Tests
```bash
node --test tests/test-lead-scoring.test.mjs
```

## Licensing
Commercial digital product built by Deepak Bagada Systems. Refer to `docs/store-listing.md` for tier rights.

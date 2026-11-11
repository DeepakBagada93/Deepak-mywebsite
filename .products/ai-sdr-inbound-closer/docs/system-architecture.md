# System Architecture: AI SDR & Inbound Lead Closer

## Architecture Flow Diagram

```mermaid
flowchart TD
    A[Inbound Form / Lead Webhook] --> B[Payload Validator & Sanitizer]
    B --> C[AI Intent & ICP Scoring Node]
    C --> D{Score >= 75?}
    D -- Yes: VIP Lead --> E[Claude 3.5 Sonnet: 4-Sentence B2B Drafter]
    E --> F[Automated Cal.com Meeting Link Injector]
    F --> G[Instant Slack/Discord VIP Sales Notification]
    D -- No: Nurture Lead --> H[Log to Nurture Pool / Low-Frequency Drip]
    B -. Error / Rate Limit .-> I[Dead-Letter Queue Subflow]
    I --> J[Admin Discord Emergency Webhook]
```

## Key Modules
1. **Webhook Ingestion (`node-webhook-inbound`):** Accepts standard JSON payloads from Typeform, Webflow, WordPress, Tally, or custom API endpoints.
2. **Payload Sanitizer (`node-payload-validator`):** Trims strings, verifies valid email syntax, strips potential script injections, and formats timestamps.
3. **Intent Evaluator (`node-intent-scorer`):** Analyzes company size indicators, budget keywords, and message urgency to output an ICP score (0-100).
4. **LLM Prompt Layer (`node-claude-drafter`):** Strictly locked 4-sentence prompt template preventing sales fluff, providing direct value, and offering instant booking.
5. **Dead-Letter Safety Net:** Subflow catching HTTP timeouts, API key expirations, or payload schema errors, alerting operations without crashing.

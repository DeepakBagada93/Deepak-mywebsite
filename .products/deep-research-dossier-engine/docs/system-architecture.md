# System Architecture: Deep Research Dossier Engine

## Architecture Flow

```mermaid
flowchart TD
    A[Topic / Competitor Webhook Trigger] --> B[Sanitize Query & Plan Search Depth]
    B --> C[Tavily Parallel Advanced Search Node]
    C --> D[Extract Full Page Text & Filter Noise]
    D --> E[Claude 3.5 Sonnet: Competitive Synthesis]
    E --> F[Generate Structured Markdown Dossier & Tables]
    F --> G[Sync to Notion / Google Drive]
    F --> H[Slack Alert with Summary & Direct Links]
    C -. Rate Limit / Failure .-> I[Dead-Letter Subflow & Admin Alert]
```

## Key Capabilities
- **Anti-Hallucination Citations:** Extracts real URLs and cross-references snippets against page content.
- **Competitor Pricing Tables:** Specifically instructed to isolate SaaS pricing tiers, free trial details, and hidden seat costs.
- **Multi-Format Export:** Formats cleanly for Notion databases, Markdown files, or PDF generation.

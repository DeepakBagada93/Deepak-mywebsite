# System Architecture: AI Invoice Recon Sentinel

## Architecture Diagram

```mermaid
flowchart TD
    A[Invoice PDF / Email Attachment Webhook] --> B[Parse & Normalize Invoice Data]
    B --> C[Audit & Tax Compliance Engine]
    C --> D{Are There Anomalies?}
    D -- Yes: Anomaly Detected --> E[Post Emergency Alert to Slack with Anomaly Reason]
    D -- No: Reconciled Clean --> F[Sync to General Ledger / QuickBooks / Notion]
    B -. Malformed File / OCR Error .-> G[Dead-Letter Subflow & Admin Alert]
```

## Core Modules
1. **Multi-Modal Document Parsing:** Processes scanned receipts, high-resolution PDFs, and image snapshots.
2. **Tax Engine:** Validates GST (0%, 5%, 12%, 18%, 28%) and international VAT splits.
3. **Threshold Guard:** Automatically routes expenses above $2,500 to executive review before ledger booking.

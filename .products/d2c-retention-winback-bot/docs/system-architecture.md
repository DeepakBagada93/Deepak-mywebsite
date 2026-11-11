# System Architecture: D2C Retention & Win-Back Bot

## Architecture Diagram

```mermaid
flowchart TD
    A[Shopify / WooCommerce / Stripe Checkout Webhook] --> B[Cart Value & Contact Evaluator]
    B --> C[Claude 3.5 Sonnet Dynamic Copy Generator]
    C --> D{Is Cart Value >= $75?}
    D -- Yes: VIP Cart --> E[Trigger Priority WhatsApp + Email with VIP20 Code]
    E --> F[Instant Slack Ops Channel Alert]
    D -- No: Standard Cart --> G[Trigger Standard Recovery Flow]
    B -. Webhook Malformed .-> H[Dead-Letter Subflow & Admin Notification]
```

## Functional Components
1. **Event Ingestion:** Listens to `checkouts/create`, `checkouts/update`, and Stripe `checkout.session.expired`.
2. **AI Incentive Engine:** Determines appropriate discount percentage based on cart economics (protecting brand margins).
3. **Dispatch Connectors:** Direct API integration with WhatsApp (via Interakt/Twilio) and transactional email (Resend/SendGrid).

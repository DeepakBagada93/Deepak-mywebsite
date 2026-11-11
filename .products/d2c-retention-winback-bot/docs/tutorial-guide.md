# Customer Tutorial: D2C Retention & Win-Back Bot

## Setup in 15 Minutes

### 1. Launch Instance
```bash
docker-compose up -d
```

### 2. Configure Store Webhook
Inside your Shopify Admin:
- Go to **Settings** → **Notifications** → **Webhooks**.
- Event: `Checkout creation` & `Checkout update`.
- URL: `https://your-n8n-domain.com/webhook/d2c-abandoned-checkout`.

### 3. Add Credentials to `.env`
- `ANTHROPIC_API_KEY`: Anthropic API Key.
- `INTERAKT_API_KEY`: For Indian WhatsApp Business API, or Twilio credentials for US/Global SMS.
- `RESEND_API_KEY`: For instant transactional recovery emails.

### 4. Verify Recovery Flow
Run test command:
```bash
curl -X POST http://localhost:5680/webhook-test/d2c-abandoned-checkout \
  -H "Content-Type: application/json" \
  -d @tests/sample-payload.json
```
Check your Slack ops channel and verify dynamic WhatsApp copy generation!

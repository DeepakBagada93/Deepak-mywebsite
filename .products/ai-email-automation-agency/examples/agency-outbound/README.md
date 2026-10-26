# Example — Agency Outbound Transformation

This example shows the input and the expected AI output shape.

1. `sample-lead.json` — the webhook payload.
2. `sample-ai-output.json` — the JSON the model must return.
3. The guardrail then checks the subject, body, links, and follow-ups.
4. The system creates a Gmail draft and a Slack approval link.

The sample metrics are illustrative. Replace them with verified client results before sending.

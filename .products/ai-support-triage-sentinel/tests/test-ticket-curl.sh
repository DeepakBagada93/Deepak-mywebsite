#!/usr/bin/env bash
WEBHOOK_URL="${1:-http://localhost:5679/webhook/support-ticket-inbound}"

echo "Dispatching test ticket to: ${WEBHOOK_URL}"
curl -s -X POST "${WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d @tests/sample-ticket.json | jq . || cat

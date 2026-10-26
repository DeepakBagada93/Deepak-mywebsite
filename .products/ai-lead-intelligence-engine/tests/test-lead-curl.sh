#!/usr/bin/env bash
# Test script to simulate an inbound lead event to the workflow webhook
WEBHOOK_URL="${1:-http://localhost:5678/webhook/inbound-lead}"

echo "Dispatching test lead to: ${WEBHOOK_URL}"
curl -s -X POST "${WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d @tests/sample-lead.json | jq . || cat

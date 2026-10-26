#!/usr/bin/env bash
WEBHOOK_URL="${1:-http://localhost:5680/webhook/content-topic-trigger}"

echo "Dispatching test topic job to: ${WEBHOOK_URL}"
curl -s -X POST "${WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d @tests/sample-topic.json | jq . || cat

#!/usr/bin/env bash
# Offline-safe endpoint verification for the Agency AI Email Engine.
# Replace the URL with your n8n instance, or leave it for localhost.
set -euo pipefail

BASE_URL="${N8N_PUBLIC_URL:-http://localhost:5678}"
PAYLOAD_FILE="$(dirname "$0")/sample-lead.json"

echo "Sending sample lead to ${BASE_URL}/webhook/agency-email-intake"
curl --fail-with-body -sS -X POST "${BASE_URL}/webhook/agency-email-intake" \
  -H "Content-Type: application/json" \
  --data @"${PAYLOAD_FILE}" | tee /tmp/agency-email-response.json

echo
echo "Expected: HTTP 200 with status=pending_review, a record_id, and a subject."
echo "Then approve the draft from the Slack link, or call:"
echo "  curl \"${BASE_URL}/webhook/agency-email-approval?record=<id>&token=<token>&decision=approve\""

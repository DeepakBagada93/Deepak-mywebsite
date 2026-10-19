# Workflow audit — Lead intake (unsafe)

- Generated: 2026-10-18T10:10:34.407Z
- Nodes: 5 (1 trigger(s))
- Findings: 12 (1 critical, 3 high)
- Score: 21/100 — not-production-ready

## [CRITICAL] 1 credential value(s) are inlined in node parameters or embedded credential data.

- Type: `security`
- Fix: Move each value into an n8n credential and reference it; then re-export.

- Evidence: {"node":"Enrich Lead","path":"headerParameters.parameters[0].value","valuePreview":"Bear…1b"}

## [HIGH] No error workflow is configured; failed runs fail silently.

- Type: `reliability`
- Fix: Set Settings → Error Workflow to a workflow that starts with an Error Trigger.

## [HIGH] Workflow export contains pinned test data.

- Type: `hygiene`
- Fix: Unpin data before exporting; pinned data can leak customer records.

- Evidence: {"path":"pinData"}

## [HIGH] Webhook trigger accepts unauthenticated requests.

- Type: `security`
- Fix: Require header or basic authentication, or add a signature check node.

- Evidence: {"node":"Lead Webhook","path":"parameters.authentication"}

## [MEDIUM] Webhook-driven workflow writes to an external system with no duplicate guard.

- Type: `reliability`
- Fix: Add a dedupe check (event id lookup, Remove Duplicates, or an IF on last-seen timestamp) before the write.

- Evidence: {"node":"Enrich Lead"}
- Evidence: {"node":"Store Lead"}
- Evidence: {"node":"Old Slack Ping"}

## [MEDIUM] `Enrich Lead` has no retry policy; a single transient failure ends the run.

- Type: `reliability`
- Fix: Enable Retry On Fail with 3 tries and a 1s wait.

- Evidence: {"node":"Enrich Lead","path":"retryOnFail"}

## [MEDIUM] `Old Slack Ping` has no retry policy; a single transient failure ends the run.

- Type: `reliability`
- Fix: Enable Retry On Fail with 3 tries and a 1s wait.

- Evidence: {"node":"Old Slack Ping","path":"retryOnFail"}

## [MEDIUM] `Store Lead` has no retry policy; a single transient failure ends the run.

- Type: `reliability`
- Fix: Enable Retry On Fail with 3 tries and a 1s wait.

- Evidence: {"node":"Store Lead","path":"retryOnFail"}

## [MEDIUM] `Enrich Lead` makes an HTTP call with no timeout.

- Type: `reliability`
- Fix: Set a timeout (30000 ms is a safe default).

- Evidence: {"node":"Enrich Lead","path":"parameters.options.timeout"}

## [MEDIUM] Unreachable node(s) from any trigger: Old Slack Ping, Unused Set.

- Type: `structure`
- Fix: Delete them or connect them; dead branches hide drift.

- Evidence: {"node":"Old Slack Ping"}
- Evidence: {"node":"Unused Set"}

## [LOW] `Old Slack Ping` is disabled and will be skipped silently in production.

- Type: `maintenance`
- Fix: Delete it or document why it is disabled.

- Evidence: {"node":"Old Slack Ping"}

## [LOW] Workflow does not use executionOrder v1.

- Type: `maintenance`
- Fix: Set settings.executionOrder to "v1" and re-test branch order.


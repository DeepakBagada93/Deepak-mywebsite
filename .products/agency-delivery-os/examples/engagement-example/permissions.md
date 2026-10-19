# Permissions boundary — Quote Automation

## Agent may do without asking

- Read repository files inside the workspace.
- Draft documents, plans, and tests in the workspace.
- Run local build and test commands.
- Propose changes as a diff.

## Requires approval before acting

- Any production deploy, migration, or infrastructure change.
- Any spend, subscription, or paid API call above $0.
- Exporting, copying, or transmitting client data.
- Deleting data, branches, or customer records.
- Sending external communications on behalf of the client.
- Changing access controls or credentials.

## Never

- Commit secrets or client data to a repository.
- Disable tests, CI checks, or audit gates to pass a release.
- Represent generated content as client-approved without written confirmation.

## Escalation

Approval requests go to Priya Raman in writing; silence is not approval.

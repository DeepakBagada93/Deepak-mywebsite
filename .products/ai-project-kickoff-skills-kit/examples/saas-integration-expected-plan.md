# Example discovery result

## Problem and customer

A solo B2B SaaS founder needs to identify repeated support themes from a weekly exported CSV without manually reading every ticket.

## MVP scope

Upload a weekly CSV locally, extract ticket subject/body, produce candidate theme groups, and display them for founder review. Keep the source CSV and results local to the chosen deployment environment.

## Explicit exclusions

No direct help-desk connection, OAuth, automatic ticket updates, customer messaging, billing, or automatic product-roadmap changes.

## Essential decisions

Define retention/deletion behavior for CSVs, the allowed deployment location, and whether email addresses must be removed before processing.

## Acceptance criteria

1. A founder can import a representative CSV and see a clear validation error for an invalid file.
2. Candidate themes display source-ticket counts and sample text for review.
3. The founder can correct or discard a theme before export.
4. Documentation explains local data handling and limitations.

# Implementation plan

| Criterion | Artifact | Verification |
|---|---|---|
| Valid CSV import | Parser and upload UI | Valid/invalid CSV tests |
| Reviewable themes | Grouping service and review screen | Manual walkthrough with fixture |
| Founder control | Edit/discard controls | UI/manual test |
| Data disclosure | README privacy section | Documentation review |

## Milestone 1 — foundation

Create the project scaffold, CSV fixture, schema validation, and a data-retention decision record. Done when malformed and missing-column fixtures fail clearly.

## Milestone 2 — core review flow

Implement parsing, conservative theme grouping, and the review view. Done when the fixture produces inspectable groups without sending external data.

## Milestone 3 — quality and release review

Add error-path tests, privacy docs, and a setup walkthrough. Direct help-desk/OAuth work remains blocked until security and credential decisions are approved.

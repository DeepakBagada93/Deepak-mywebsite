# ADR 0001: Use Postgres for order storage

- Status: accepted
- Date: 2025-02-11

## Context

Orders need transactional guarantees across line items and payments. The team has operational experience with Postgres.

## Decision

Store orders and line items in Postgres. Access goes through the single client in `src/lib/db.ts`.

## Consequences

- Schema changes require a migration.
- Local development needs a Postgres instance.
- Reporting reads from replicas, never from the primary.

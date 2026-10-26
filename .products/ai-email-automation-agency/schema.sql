-- Agency AI Email Engine — Postgres schema
-- Run once after `docker compose up -d`:
--   docker compose exec -T postgres psql -U n8n_admin -d agency_email < schema.sql

CREATE TABLE IF NOT EXISTS agency_email_drafts (
  id BIGSERIAL PRIMARY KEY,
  contact_id TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  segment TEXT,
  lead_score INTEGER DEFAULT 0,
  subject TEXT NOT NULL,
  preview_text TEXT,
  body TEXT NOT NULL,
  followup_1 TEXT,
  followup_2 TEXT,
  approval_token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review', 'blocked_by_guardrail', 'sent', 'rejected', 'sequence_complete')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_agency_email_drafts_status
  ON agency_email_drafts (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agency_email_drafts_token
  ON agency_email_drafts (approval_token);
CREATE UNIQUE INDEX IF NOT EXISTS idx_agency_email_drafts_contact
  ON agency_email_drafts (contact_id);

CREATE TABLE IF NOT EXISTS agency_email_dead_letters (
  id BIGSERIAL PRIMARY KEY,
  incident_id TEXT NOT NULL UNIQUE,
  workflow_name TEXT,
  workflow_id TEXT,
  execution_id TEXT,
  execution_url TEXT,
  node_name TEXT,
  error_message TEXT,
  error_stack TEXT,
  trigger_payload JSONB,
  severity TEXT DEFAULT 'high',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolution_note TEXT
);

CREATE INDEX IF NOT EXISTS idx_agency_email_dead_letters_open
  ON agency_email_dead_letters (resolved_at, occurred_at DESC);

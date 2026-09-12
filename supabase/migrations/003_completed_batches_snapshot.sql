-- ==============================================================================
-- Migration: 003_completed_batches_snapshot.sql
-- Add snapshot column to completed_batches to store enriched batch archival data
-- ==============================================================================

alter table completed_batches add column if not exists snapshot jsonb;

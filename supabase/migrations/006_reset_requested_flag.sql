-- Migration 006: Add reset_requested flag to students table
-- Purpose: Efficient single-boolean flag for student password reset requests.
-- No separate table needed — admin sees the flag inline in User Management.
-- Applied: 2026-09-14

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS reset_requested BOOLEAN NOT NULL DEFAULT FALSE;

-- Partial index: fast lookup of only students who have requested a reset
CREATE INDEX IF NOT EXISTS idx_students_reset_requested
  ON public.students (reset_requested)
  WHERE reset_requested = TRUE;

COMMENT ON COLUMN public.students.reset_requested IS
  'True when a student has requested an admin password reset from the login page. Admin clears this flag after resetting.';

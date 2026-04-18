-- ============================================================
-- FIX 1: Create character_backups table (was missing entirely)
-- The table is referenced in useCharacterBackup.ts and the
-- TypeScript types but had no migration, causing RLS failures
-- on every backup attempt.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.character_backups (
  id           UUID                     NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID                     NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id UUID                     NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  backup_data  JSONB                    NOT NULL DEFAULT '{}'::jsonb,
  backup_name  TEXT,
  version      INTEGER                  NOT NULL DEFAULT 1,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_character_backups_user_id
  ON public.character_backups(user_id);

CREATE INDEX IF NOT EXISTS idx_character_backups_character_id
  ON public.character_backups(character_id);

ALTER TABLE public.character_backups ENABLE ROW LEVEL SECURITY;

-- Users can only see their own backups
DROP POLICY IF EXISTS "Users can view own backups" ON public.character_backups;
CREATE POLICY "Users can view own backups"
  ON public.character_backups
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can only insert backups they own (user_id must match)
DROP POLICY IF EXISTS "Users can insert own backups" ON public.character_backups;
CREATE POLICY "Users can insert own backups"
  ON public.character_backups
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can only delete their own backups
DROP POLICY IF EXISTS "Users can delete own backups" ON public.character_backups;
CREATE POLICY "Users can delete own backups"
  ON public.character_backups
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- FIX 2: Fix character_sheet_state RLS
--
-- The original migration used an EXISTS subquery that joins
-- through the characters table. This triggers Postgres's
-- "initplan" issue: the subquery is evaluated before
-- auth.uid() is fully available in some Supabase edge
-- conditions, causing "new row violates row-level security
-- policy" on INSERT/UPDATE even for the legitimate owner.
--
-- Fix: add a direct user_id column so policies can use the
-- fast, reliable  user_id = auth.uid()  pattern instead.
-- ============================================================

-- Add user_id column (safe -- IF NOT EXISTS)
ALTER TABLE public.character_sheet_state
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill from the characters table for existing rows
UPDATE public.character_sheet_state css
SET    user_id = c.user_id
FROM   public.characters c
WHERE  c.id   = css.character_id
  AND  css.user_id IS NULL;

-- Index for the new column
CREATE INDEX IF NOT EXISTS idx_character_sheet_state_user_id
  ON public.character_sheet_state(user_id);

-- Drop the old subquery-based policies
DROP POLICY IF EXISTS "Users can view their own sheet state"   ON public.character_sheet_state;
DROP POLICY IF EXISTS "Users can insert their own sheet state" ON public.character_sheet_state;
DROP POLICY IF EXISTS "Users can update their own sheet state" ON public.character_sheet_state;
DROP POLICY IF EXISTS "Users can delete their own sheet state" ON public.character_sheet_state;

-- Recreate with direct user_id check (no subquery = no initplan RLS bug)
CREATE POLICY "Users can view their own sheet state"
  ON public.character_sheet_state
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own sheet state"
  ON public.character_sheet_state
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own sheet state"
  ON public.character_sheet_state
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own sheet state"
  ON public.character_sheet_state
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- Belt-and-suspenders: re-create RLS policies for tables used by the sandbox
-- injector. Helper functions is_campaign_dm / is_campaign_system were fixed
-- to reference warden_id in 20260413000002, but earlier migration-created
-- policies may have been skipped or overwritten. This ensures every table the
-- sandbox injector writes to has current, working policies.
--
-- Idempotent: DROP IF EXISTS + CREATE.
-- ============================================================================

-- ============================================================================
-- 1. Re-create helper functions (no-op if already correct, but safe)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_campaign_dm(
  p_campaign_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaigns
    WHERE id = p_campaign_id
      AND warden_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_campaign_system(
  p_campaign_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT p_user_id IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM public.campaigns WHERE id = p_campaign_id AND warden_id = p_user_id
    )
    OR EXISTS (
      SELECT 1 FROM public.campaign_members
      WHERE campaign_id = p_campaign_id
        AND user_id = p_user_id
        AND role = 'co-system'
    )
  );
$$;

-- ============================================================================
-- 2. campaign_sessions
-- ============================================================================

DROP POLICY IF EXISTS "campaign_sessions_select" ON public.campaign_sessions;
CREATE POLICY "campaign_sessions_select" ON public.campaign_sessions
  FOR SELECT TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_sessions_insert" ON public.campaign_sessions;
CREATE POLICY "campaign_sessions_insert" ON public.campaign_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_system(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_sessions_update" ON public.campaign_sessions;
CREATE POLICY "campaign_sessions_update" ON public.campaign_sessions
  FOR UPDATE TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_sessions_delete" ON public.campaign_sessions;
CREATE POLICY "campaign_sessions_delete" ON public.campaign_sessions
  FOR DELETE TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================================
-- 3. campaign_session_logs
-- ============================================================================

DROP POLICY IF EXISTS "campaign_session_logs_select" ON public.campaign_session_logs;
CREATE POLICY "campaign_session_logs_select" ON public.campaign_session_logs
  FOR SELECT TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_session_logs_insert" ON public.campaign_session_logs;
CREATE POLICY "campaign_session_logs_insert" ON public.campaign_session_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_system(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_session_logs_update" ON public.campaign_session_logs;
CREATE POLICY "campaign_session_logs_update" ON public.campaign_session_logs
  FOR UPDATE TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_session_logs_delete" ON public.campaign_session_logs;
CREATE POLICY "campaign_session_logs_delete" ON public.campaign_session_logs
  FOR DELETE TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================================
-- 4. vtt_journal_entries
-- ============================================================================

DROP POLICY IF EXISTS "vtt_journal_entries_select" ON public.vtt_journal_entries;
CREATE POLICY "vtt_journal_entries_select" ON public.vtt_journal_entries
  FOR SELECT TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "vtt_journal_entries_insert" ON public.vtt_journal_entries;
CREATE POLICY "vtt_journal_entries_insert" ON public.vtt_journal_entries
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND (
      public.is_campaign_dm(campaign_id, (select auth.uid()))
      OR public.is_campaign_system(campaign_id, (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_journal_entries_update" ON public.vtt_journal_entries;
CREATE POLICY "vtt_journal_entries_update" ON public.vtt_journal_entries
  FOR UPDATE TO authenticated
  USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "vtt_journal_entries_delete" ON public.vtt_journal_entries;
CREATE POLICY "vtt_journal_entries_delete" ON public.vtt_journal_entries
  FOR DELETE TO authenticated
  USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================================
-- 5. campaign_notes
-- ============================================================================

DROP POLICY IF EXISTS "campaign_notes_select" ON public.campaign_notes;
CREATE POLICY "campaign_notes_select" ON public.campaign_notes
  FOR SELECT TO authenticated
  USING (
    user_id = (select auth.uid())
    OR (
      is_shared = true AND (
        public.is_campaign_dm(campaign_id, (select auth.uid()))
        OR public.is_campaign_member(campaign_id, (select auth.uid()))
      )
    )
  );

DROP POLICY IF EXISTS "campaign_notes_insert" ON public.campaign_notes;
CREATE POLICY "campaign_notes_insert" ON public.campaign_notes
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND (
      public.is_campaign_dm(campaign_id, (select auth.uid()))
      OR public.is_campaign_member(campaign_id, (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "campaign_notes_update" ON public.campaign_notes;
CREATE POLICY "campaign_notes_update" ON public.campaign_notes
  FOR UPDATE TO authenticated
  USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_notes_delete" ON public.campaign_notes;
CREATE POLICY "campaign_notes_delete" ON public.campaign_notes
  FOR DELETE TO authenticated
  USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================================
-- 6. campaign_encounters
-- ============================================================================

DROP POLICY IF EXISTS "campaign_encounters_select" ON public.campaign_encounters;
CREATE POLICY "campaign_encounters_select" ON public.campaign_encounters
  FOR SELECT TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_encounters_insert" ON public.campaign_encounters;
CREATE POLICY "campaign_encounters_insert" ON public.campaign_encounters
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_system(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_encounters_update" ON public.campaign_encounters;
CREATE POLICY "campaign_encounters_update" ON public.campaign_encounters
  FOR UPDATE TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_encounters_delete" ON public.campaign_encounters;
CREATE POLICY "campaign_encounters_delete" ON public.campaign_encounters
  FOR DELETE TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================================
-- 7. campaign_encounter_entries
-- ============================================================================

DROP POLICY IF EXISTS "campaign_encounter_entries_select" ON public.campaign_encounter_entries;
CREATE POLICY "campaign_encounter_entries_select" ON public.campaign_encounter_entries
  FOR SELECT TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_encounter_entries_insert" ON public.campaign_encounter_entries;
CREATE POLICY "campaign_encounter_entries_insert" ON public.campaign_encounter_entries
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_system(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_encounter_entries_update" ON public.campaign_encounter_entries;
CREATE POLICY "campaign_encounter_entries_update" ON public.campaign_encounter_entries
  FOR UPDATE TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_encounter_entries_delete" ON public.campaign_encounter_entries;
CREATE POLICY "campaign_encounter_entries_delete" ON public.campaign_encounter_entries
  FOR DELETE TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================================
-- 8. campaign_tool_states
-- ============================================================================

DROP POLICY IF EXISTS "campaign_tool_states_select" ON public.campaign_tool_states;
CREATE POLICY "campaign_tool_states_select" ON public.campaign_tool_states
  FOR SELECT TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_system(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_tool_states_insert" ON public.campaign_tool_states;
CREATE POLICY "campaign_tool_states_insert" ON public.campaign_tool_states
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_system(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_tool_states_update" ON public.campaign_tool_states;
CREATE POLICY "campaign_tool_states_update" ON public.campaign_tool_states
  FOR UPDATE TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_system(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_tool_states_delete" ON public.campaign_tool_states;
CREATE POLICY "campaign_tool_states_delete" ON public.campaign_tool_states
  FOR DELETE TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================================
-- 9. campaign_wiki_articles (ensure warden can always write)
-- ============================================================================

DROP POLICY IF EXISTS "wiki_articles_select" ON public.campaign_wiki_articles;
CREATE POLICY "wiki_articles_select" ON public.campaign_wiki_articles
  FOR SELECT TO authenticated
  USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "wiki_articles_insert" ON public.campaign_wiki_articles;
CREATE POLICY "wiki_articles_insert" ON public.campaign_wiki_articles
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_system(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "wiki_articles_update" ON public.campaign_wiki_articles;
CREATE POLICY "wiki_articles_update" ON public.campaign_wiki_articles
  FOR UPDATE TO authenticated
  USING (
    created_by = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

DROP POLICY IF EXISTS "wiki_articles_delete" ON public.campaign_wiki_articles;
CREATE POLICY "wiki_articles_delete" ON public.campaign_wiki_articles
  FOR DELETE TO authenticated
  USING (
    created_by = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

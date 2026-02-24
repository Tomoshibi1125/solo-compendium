-- Fix remaining auth RLS initialization plan performance issues
-- This migration addresses all remaining auth_rls_initplan warnings by wrapping
-- auth.uid() calls in (select auth.uid()) to prevent per-row re-evaluation

BEGIN;

-- ============================================================
-- 1. active_sessions (3 policies: select, update, delete)
-- ============================================================
DROP POLICY IF EXISTS "active_sessions_select" ON public.active_sessions;
DROP POLICY IF EXISTS "active_sessions_update" ON public.active_sessions;
DROP POLICY IF EXISTS "active_sessions_delete" ON public.active_sessions;

CREATE POLICY "active_sessions_select" ON public.active_sessions
  FOR SELECT USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      WHERE c.dm_id = (select auth.uid())
    )
    OR campaign_id IN (
      SELECT cm.campaign_id FROM public.campaign_members cm
      WHERE cm.user_id = (select auth.uid())
    )
  );

CREATE POLICY "active_sessions_update" ON public.active_sessions
  FOR UPDATE USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.dm_id = (select auth.uid())
    )
  );

CREATE POLICY "active_sessions_delete" ON public.active_sessions
  FOR DELETE USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.dm_id = (select auth.uid())
    )
  );

-- ============================================================
-- 2. ai_generated_content (2 policies: update, delete)
-- Note: This table doesn't have user_id column, uses authenticated check
-- ============================================================
DROP POLICY IF EXISTS "ai_generated_content_update" ON public.ai_generated_content;
DROP POLICY IF EXISTS "ai_generated_content_delete" ON public.ai_generated_content;

CREATE POLICY "ai_generated_content_update" ON public.ai_generated_content
  FOR UPDATE USING (
    (select auth.uid()) IS NOT NULL
    OR public.is_dm_or_admin((select auth.uid()))
  );

CREATE POLICY "ai_generated_content_delete" ON public.ai_generated_content
  FOR DELETE USING (
    (select auth.uid()) IS NOT NULL
    OR public.is_dm_or_admin((select auth.uid()))
  );

-- ============================================================
-- 3. ai_usage_logs (1 policy: select)
-- ============================================================
DROP POLICY IF EXISTS "ai_usage_logs_select" ON public.ai_usage_logs;

CREATE POLICY "ai_usage_logs_select" ON public.ai_usage_logs
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );

-- ============================================================
-- 4. audio_playlists (3 policies: select, update, delete)
-- Note: This table doesn't have is_public column, uses user ownership
-- ============================================================
DROP POLICY IF EXISTS "audio_playlists_select" ON public.audio_playlists;
DROP POLICY IF EXISTS "audio_playlists_update" ON public.audio_playlists;
DROP POLICY IF EXISTS "audio_playlists_delete" ON public.audio_playlists;

CREATE POLICY "audio_playlists_select" ON public.audio_playlists
  FOR SELECT USING (
    user_id = (select auth.uid())
  );

CREATE POLICY "audio_playlists_update" ON public.audio_playlists
  FOR UPDATE USING (
    user_id = (select auth.uid())
  );

CREATE POLICY "audio_playlists_delete" ON public.audio_playlists
  FOR DELETE USING (
    user_id = (select auth.uid())
  );

-- ============================================================
-- 5. campaign_combat_sessions (1 policy: select)
-- ============================================================
DROP POLICY IF EXISTS "campaign_combat_sessions_select" ON public.campaign_combat_sessions;

CREATE POLICY "campaign_combat_sessions_select" ON public.campaign_combat_sessions
  FOR SELECT USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      WHERE c.dm_id = (select auth.uid())
    )
    OR campaign_id IN (
      SELECT cm.campaign_id FROM public.campaign_members cm
      WHERE cm.user_id = (select auth.uid())
    )
  );

-- ============================================================
-- 6. campaign_combatants (1 policy: select)
-- ============================================================
DROP POLICY IF EXISTS "campaign_combatants_select" ON public.campaign_combatants;

CREATE POLICY "campaign_combatants_select" ON public.campaign_combatants
  FOR SELECT USING (
    session_id IN (
      SELECT cs.id FROM public.campaign_combat_sessions cs
      WHERE cs.campaign_id IN (
        SELECT c.id FROM public.campaigns c
        WHERE c.dm_id = (select auth.uid())
      )
      OR cs.campaign_id IN (
        SELECT cm.campaign_id FROM public.campaign_members cm
        WHERE cm.user_id = (select auth.uid())
      )
    )
  );

-- ============================================================
-- 7. character_backups (3 policies: select, update, delete)
-- ============================================================
DROP POLICY IF EXISTS "character_backups_select" ON public.character_backups;
DROP POLICY IF EXISTS "character_backups_update" ON public.character_backups;
DROP POLICY IF EXISTS "character_backups_delete" ON public.character_backups;

CREATE POLICY "character_backups_select" ON public.character_backups
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );

CREATE POLICY "character_backups_update" ON public.character_backups
  FOR UPDATE USING (
    user_id = (select auth.uid())
  );

CREATE POLICY "character_backups_delete" ON public.character_backups
  FOR DELETE USING (
    user_id = (select auth.uid())
  );

-- ============================================================
-- 8. user_sourcebook_entitlements (2 policies: update, delete)
-- ============================================================
DROP POLICY IF EXISTS "user_sourcebook_entitlements_update" ON public.user_sourcebook_entitlements;
DROP POLICY IF EXISTS "user_sourcebook_entitlements_delete" ON public.user_sourcebook_entitlements;

CREATE POLICY "user_sourcebook_entitlements_update" ON public.user_sourcebook_entitlements
  FOR UPDATE USING (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );

CREATE POLICY "user_sourcebook_entitlements_delete" ON public.user_sourcebook_entitlements
  FOR DELETE USING (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );

-- ============================================================
-- 9. user_tool_states (2 policies: update, delete)
-- ============================================================
DROP POLICY IF EXISTS "user_tool_states_update" ON public.user_tool_states;
DROP POLICY IF EXISTS "user_tool_states_delete" ON public.user_tool_states;

CREATE POLICY "user_tool_states_update" ON public.user_tool_states
  FOR UPDATE USING (
    user_id = (select auth.uid())
  );

CREATE POLICY "user_tool_states_delete" ON public.user_tool_states
  FOR DELETE USING (
    user_id = (select auth.uid())
  );

-- ============================================================
-- 10. marketplace_downloads (2 policies: update, delete)
-- ============================================================
DROP POLICY IF EXISTS "marketplace_downloads_update" ON public.marketplace_downloads;
DROP POLICY IF EXISTS "marketplace_downloads_delete" ON public.marketplace_downloads;

CREATE POLICY "marketplace_downloads_update" ON public.marketplace_downloads
  FOR UPDATE USING (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );

CREATE POLICY "marketplace_downloads_delete" ON public.marketplace_downloads
  FOR DELETE USING (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );

-- ============================================================
-- 11. marketplace_reviews (2 policies: update, delete)
-- ============================================================
DROP POLICY IF EXISTS "marketplace_reviews_update" ON public.marketplace_reviews;
DROP POLICY IF EXISTS "marketplace_reviews_delete" ON public.marketplace_reviews;

CREATE POLICY "marketplace_reviews_update" ON public.marketplace_reviews
  FOR UPDATE USING (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );

CREATE POLICY "marketplace_reviews_delete" ON public.marketplace_reviews
  FOR DELETE USING (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );

-- ============================================================
-- 12. roll_history (2 policies: update, delete)
-- ============================================================
DROP POLICY IF EXISTS "roll_history_update" ON public.roll_history;
DROP POLICY IF EXISTS "roll_history_delete" ON public.roll_history;

CREATE POLICY "roll_history_update" ON public.roll_history
  FOR UPDATE USING (
    user_id = (select auth.uid())
    OR (
      campaign_id IS NOT NULL AND (
        EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.dm_id = (select auth.uid()))
      )
    )
  );

CREATE POLICY "roll_history_delete" ON public.roll_history
  FOR DELETE USING (
    user_id = (select auth.uid())
    OR (
      campaign_id IS NOT NULL AND (
        EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.dm_id = (select auth.uid()))
      )
    )
  );

-- ============================================================
-- 13. saved_searches (2 policies: update, delete)
-- ============================================================
DROP POLICY IF EXISTS "saved_searches_update" ON public.saved_searches;
DROP POLICY IF EXISTS "saved_searches_delete" ON public.saved_searches;

CREATE POLICY "saved_searches_update" ON public.saved_searches
  FOR UPDATE USING (
    user_id = (select auth.uid())
  );

CREATE POLICY "saved_searches_delete" ON public.saved_searches
  FOR DELETE USING (
    user_id = (select auth.uid())
  );

COMMIT;

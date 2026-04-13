-- ============================================================================
-- FIX: dm_id → warden_id cascade
--
-- Migration 20260329000000 renamed campaigns.dm_id to campaigns.warden_id
-- but never updated the SECURITY DEFINER helper functions or inline RLS
-- policies that reference the old column name. This caused every Warden-gated
-- operation to silently fail (is_campaign_dm always returned FALSE).
--
-- This migration fixes:
--   1. Helper functions: is_campaign_dm, is_campaign_system
--   2. All inline RLS policies referencing dm_id across ~15 tables
--   3. campaign_wiki_articles policies to also grant Warden access
-- ============================================================================


-- ============================================================================
-- SECTION 1: Fix SECURITY DEFINER helper functions
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
-- SECTION 2: Fix active_sessions — inline dm_id → warden_id
-- ============================================================================

DROP POLICY IF EXISTS "active_sessions_select" ON public.active_sessions;
CREATE POLICY "active_sessions_select" ON public.active_sessions
  FOR SELECT
  TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      WHERE c.warden_id = (select auth.uid())
    )
    OR campaign_id IN (
      SELECT cm.campaign_id FROM public.campaign_members cm
      WHERE cm.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "active_sessions_insert" ON public.active_sessions;
CREATE POLICY "active_sessions_insert" ON public.active_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.warden_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "active_sessions_update" ON public.active_sessions;
CREATE POLICY "active_sessions_update" ON public.active_sessions
  FOR UPDATE
  TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.warden_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "active_sessions_delete" ON public.active_sessions;
CREATE POLICY "active_sessions_delete" ON public.active_sessions
  FOR DELETE
  TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.warden_id = (select auth.uid())
    )
  );


-- ============================================================================
-- SECTION 3: Fix campaign_wiki_articles — Warden + members can access
-- ============================================================================

DROP POLICY IF EXISTS "Users can view wiki articles in their campaigns" ON public.campaign_wiki_articles;
DROP POLICY IF EXISTS "wiki_articles_select" ON public.campaign_wiki_articles;
CREATE POLICY "wiki_articles_select" ON public.campaign_wiki_articles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_wiki_articles.campaign_id
      AND c.warden_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.campaign_members
      WHERE campaign_members.campaign_id = campaign_wiki_articles.campaign_id
      AND campaign_members.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create wiki articles in their campaigns" ON public.campaign_wiki_articles;
DROP POLICY IF EXISTS "wiki_articles_insert" ON public.campaign_wiki_articles;
CREATE POLICY "wiki_articles_insert" ON public.campaign_wiki_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_wiki_articles.campaign_id
      AND c.warden_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.campaign_members
      WHERE campaign_members.campaign_id = campaign_wiki_articles.campaign_id
      AND campaign_members.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update their own or DM can update any wiki articles" ON public.campaign_wiki_articles;
DROP POLICY IF EXISTS "wiki_articles_update" ON public.campaign_wiki_articles;
CREATE POLICY "wiki_articles_update" ON public.campaign_wiki_articles
  FOR UPDATE
  TO authenticated
  USING (
    created_by = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_wiki_articles.campaign_id
      AND c.warden_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete their own or DM can delete any wiki articles" ON public.campaign_wiki_articles;
DROP POLICY IF EXISTS "wiki_articles_delete" ON public.campaign_wiki_articles;
CREATE POLICY "wiki_articles_delete" ON public.campaign_wiki_articles
  FOR DELETE
  TO authenticated
  USING (
    created_by = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_wiki_articles.campaign_id
      AND c.warden_id = (select auth.uid())
    )
  );


-- ============================================================================
-- SECTION 4: Fix VTT tables — inline dm_id → warden_id
-- ============================================================================

-- vtt_settings
DROP POLICY IF EXISTS "vtt_settings_select" ON public.vtt_settings;
CREATE POLICY "vtt_settings_select" ON public.vtt_settings
  FOR SELECT TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_settings_insert" ON public.vtt_settings;
CREATE POLICY "vtt_settings_insert" ON public.vtt_settings
  FOR INSERT TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_settings_update" ON public.vtt_settings;
CREATE POLICY "vtt_settings_update" ON public.vtt_settings
  FOR UPDATE TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_settings_delete" ON public.vtt_settings;
CREATE POLICY "vtt_settings_delete" ON public.vtt_settings
  FOR DELETE TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

-- vtt_tokens
DROP POLICY IF EXISTS "vtt_tokens_select" ON public.vtt_tokens;
CREATE POLICY "vtt_tokens_select" ON public.vtt_tokens
  FOR SELECT TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
    AND (visible_to_players = TRUE OR created_by = (select auth.uid()))
  );

DROP POLICY IF EXISTS "vtt_tokens_insert" ON public.vtt_tokens;
CREATE POLICY "vtt_tokens_insert" ON public.vtt_tokens
  FOR INSERT TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_tokens_update" ON public.vtt_tokens;
CREATE POLICY "vtt_tokens_update" ON public.vtt_tokens
  FOR UPDATE TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_tokens_delete" ON public.vtt_tokens;
CREATE POLICY "vtt_tokens_delete" ON public.vtt_tokens
  FOR DELETE TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

-- vtt_map_elements
DROP POLICY IF EXISTS "vtt_map_elements_select" ON public.vtt_map_elements;
CREATE POLICY "vtt_map_elements_select" ON public.vtt_map_elements
  FOR SELECT TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
    AND (visible_to_players = TRUE OR created_by = (select auth.uid()))
  );

DROP POLICY IF EXISTS "vtt_map_elements_insert" ON public.vtt_map_elements;
CREATE POLICY "vtt_map_elements_insert" ON public.vtt_map_elements
  FOR INSERT TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_map_elements_update" ON public.vtt_map_elements;
CREATE POLICY "vtt_map_elements_update" ON public.vtt_map_elements
  FOR UPDATE TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_map_elements_delete" ON public.vtt_map_elements;
CREATE POLICY "vtt_map_elements_delete" ON public.vtt_map_elements
  FOR DELETE TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

-- vtt_audio_tracks
DROP POLICY IF EXISTS "vtt_audio_tracks_select" ON public.vtt_audio_tracks;
CREATE POLICY "vtt_audio_tracks_select" ON public.vtt_audio_tracks
  FOR SELECT TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_audio_tracks_insert" ON public.vtt_audio_tracks;
CREATE POLICY "vtt_audio_tracks_insert" ON public.vtt_audio_tracks
  FOR INSERT TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_audio_tracks_update" ON public.vtt_audio_tracks;
CREATE POLICY "vtt_audio_tracks_update" ON public.vtt_audio_tracks
  FOR UPDATE TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_audio_tracks_delete" ON public.vtt_audio_tracks;
CREATE POLICY "vtt_audio_tracks_delete" ON public.vtt_audio_tracks
  FOR DELETE TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

-- vtt_audio_settings
DROP POLICY IF EXISTS "vtt_audio_settings_select" ON public.vtt_audio_settings;
CREATE POLICY "vtt_audio_settings_select" ON public.vtt_audio_settings
  FOR SELECT TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_audio_settings_insert" ON public.vtt_audio_settings;
CREATE POLICY "vtt_audio_settings_insert" ON public.vtt_audio_settings
  FOR INSERT TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_audio_settings_update" ON public.vtt_audio_settings;
CREATE POLICY "vtt_audio_settings_update" ON public.vtt_audio_settings
  FOR UPDATE TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "vtt_audio_settings_delete" ON public.vtt_audio_settings;
CREATE POLICY "vtt_audio_settings_delete" ON public.vtt_audio_settings
  FOR DELETE TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

-- vtt_fog_state
DROP POLICY IF EXISTS "vtt_fog_state_select" ON public.vtt_fog_state;
CREATE POLICY "vtt_fog_state_select" ON public.vtt_fog_state
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.warden_id = (select auth.uid()))
    OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = vtt_fog_state.campaign_id AND cm.user_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "vtt_fog_state_insert" ON public.vtt_fog_state;
CREATE POLICY "vtt_fog_state_insert" ON public.vtt_fog_state
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.warden_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "vtt_fog_state_update" ON public.vtt_fog_state;
CREATE POLICY "vtt_fog_state_update" ON public.vtt_fog_state
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.warden_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "vtt_fog_state_delete" ON public.vtt_fog_state;
CREATE POLICY "vtt_fog_state_delete" ON public.vtt_fog_state
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.warden_id = (select auth.uid()))
  );


-- ============================================================================
-- SECTION 5: Fix campaign support tables — inline dm_id → warden_id
-- ============================================================================

-- campaign_content
DROP POLICY IF EXISTS "campaign_content_select" ON public.campaign_content;
CREATE POLICY "campaign_content_select" ON public.campaign_content
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns cam
      WHERE cam.id = campaign_id
        AND (cam.warden_id = (select auth.uid())
             OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = cam.id AND cm.user_id = (select auth.uid())))
    )
  );

DROP POLICY IF EXISTS "campaign_content_insert" ON public.campaign_content;
CREATE POLICY "campaign_content_insert" ON public.campaign_content
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.campaigns cam WHERE cam.id = campaign_id AND cam.warden_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_content_update" ON public.campaign_content;
CREATE POLICY "campaign_content_update" ON public.campaign_content
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.campaigns cam WHERE cam.id = campaign_id AND cam.warden_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_content_delete" ON public.campaign_content;
CREATE POLICY "campaign_content_delete" ON public.campaign_content
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.campaigns cam WHERE cam.id = campaign_id AND cam.warden_id = (select auth.uid()))
  );

-- campaign_session_logs
DROP POLICY IF EXISTS "campaign_session_logs_select" ON public.campaign_session_logs;
CREATE POLICY "campaign_session_logs_select" ON public.campaign_session_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND (
      c.warden_id = (select auth.uid())
      OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = c.id AND cm.user_id = (select auth.uid()))
    ))
  );

DROP POLICY IF EXISTS "campaign_session_logs_insert" ON public.campaign_session_logs;
CREATE POLICY "campaign_session_logs_insert" ON public.campaign_session_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND (
      c.warden_id = (select auth.uid())
      OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = c.id AND cm.user_id = (select auth.uid()))
    ))
  );

DROP POLICY IF EXISTS "campaign_session_logs_update" ON public.campaign_session_logs;
CREATE POLICY "campaign_session_logs_update" ON public.campaign_session_logs
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.warden_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "campaign_session_logs_delete" ON public.campaign_session_logs;
CREATE POLICY "campaign_session_logs_delete" ON public.campaign_session_logs
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.warden_id = (select auth.uid()))
  );

-- roll_history
DROP POLICY IF EXISTS "roll_history_select" ON public.roll_history;
CREATE POLICY "roll_history_select" ON public.roll_history
  FOR SELECT TO authenticated
  USING (
    user_id = (select auth.uid())
    OR (
      campaign_id IS NOT NULL AND (
        EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.warden_id = (select auth.uid()))
        OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = roll_history.campaign_id AND cm.user_id = (select auth.uid()))
      )
    )
  );

DROP POLICY IF EXISTS "roll_history_update" ON public.roll_history;
CREATE POLICY "roll_history_update" ON public.roll_history
  FOR UPDATE TO authenticated
  USING (
    user_id = (select auth.uid())
    OR (
      campaign_id IS NOT NULL AND
      EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "roll_history_delete" ON public.roll_history;
CREATE POLICY "roll_history_delete" ON public.roll_history
  FOR DELETE TO authenticated
  USING (
    user_id = (select auth.uid())
    OR (
      campaign_id IS NOT NULL AND
      EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

-- vtt_chat_messages
DROP POLICY IF EXISTS "Campaign members can view chat messages" ON public.vtt_chat_messages;
DROP POLICY IF EXISTS "vtt_chat_messages_select" ON public.vtt_chat_messages;
CREATE POLICY "vtt_chat_messages_select" ON public.vtt_chat_messages
  FOR SELECT TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.warden_id = (select auth.uid())
    )
    OR campaign_id IN (
      SELECT cm.campaign_id FROM public.campaign_members cm WHERE cm.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Campaign members can send chat messages" ON public.vtt_chat_messages;
DROP POLICY IF EXISTS "vtt_chat_messages_insert" ON public.vtt_chat_messages;
CREATE POLICY "vtt_chat_messages_insert" ON public.vtt_chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.warden_id = (select auth.uid())
    )
    OR campaign_id IN (
      SELECT cm.campaign_id FROM public.campaign_members cm WHERE cm.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "DMs can delete chat messages" ON public.vtt_chat_messages;
DROP POLICY IF EXISTS "vtt_chat_messages_delete" ON public.vtt_chat_messages;
CREATE POLICY "vtt_chat_messages_delete" ON public.vtt_chat_messages
  FOR DELETE TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.warden_id = (select auth.uid())
    )
  );

-- campaign_combat_sessions
DROP POLICY IF EXISTS "campaign_combat_sessions_select" ON public.campaign_combat_sessions;
CREATE POLICY "campaign_combat_sessions_select" ON public.campaign_combat_sessions
  FOR SELECT TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c
      WHERE c.warden_id = (select auth.uid())
    )
    OR campaign_id IN (
      SELECT cm.campaign_id FROM public.campaign_members cm
      WHERE cm.user_id = (select auth.uid())
    )
  );

-- campaign_combatants
DROP POLICY IF EXISTS "campaign_combatants_select" ON public.campaign_combatants;
CREATE POLICY "campaign_combatants_select" ON public.campaign_combatants
  FOR SELECT TO authenticated
  USING (
    session_id IN (
      SELECT cs.id FROM public.campaign_combat_sessions cs
      WHERE cs.campaign_id IN (
        SELECT c.id FROM public.campaigns c
        WHERE c.warden_id = (select auth.uid())
      )
      OR cs.campaign_id IN (
        SELECT cm.campaign_id FROM public.campaign_members cm
        WHERE cm.user_id = (select auth.uid())
      )
    )
  );

-- combat_actions (SELECT uses active_sessions → campaigns)
DROP POLICY IF EXISTS "Users can view combat actions in their sessions" ON public.combat_actions;
CREATE POLICY "combat_actions_select" ON public.combat_actions
  FOR SELECT TO authenticated
  USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.warden_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
  );

-- campaign_roll_events
DROP POLICY IF EXISTS "campaign_roll_events_select" ON public.campaign_roll_events;
CREATE POLICY "campaign_roll_events_select" ON public.campaign_roll_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.campaign_id = campaign_roll_events.campaign_id
        AND cm.user_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_roll_events.campaign_id
        AND c.warden_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "campaign_roll_events_insert" ON public.campaign_roll_events;
CREATE POLICY "campaign_roll_events_insert" ON public.campaign_roll_events
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND (
      EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = campaign_roll_events.campaign_id AND cm.user_id = (select auth.uid()))
      OR EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_roll_events.campaign_id AND c.warden_id = (select auth.uid()))
    )
  );

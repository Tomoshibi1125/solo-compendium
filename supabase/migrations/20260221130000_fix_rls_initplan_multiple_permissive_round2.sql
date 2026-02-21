-- Round 2: Fix remaining auth_rls_initplan, multiple_permissive_policies, and duplicate_index warnings.
-- All auth.uid() calls wrapped in (select auth.uid()).
-- All FOR ALL + FOR SELECT overlaps split into per-action policies.
-- All duplicate policies consolidated into one per (table, action).

BEGIN;

-- ============================================================
-- 1. character_shadow_soldiers  (initplan: 2 missing policies)
--    Previous migration only fixed INSERT + DELETE.
--    Still need SELECT + UPDATE with (select auth.uid()).
-- ============================================================
DROP POLICY IF EXISTS "Users can view their own Umbral Legion"           ON public.character_shadow_soldiers;
DROP POLICY IF EXISTS "Users can update their own summoned soldiers"     ON public.character_shadow_soldiers;

CREATE POLICY "Users can view their own Umbral Legion" ON public.character_shadow_soldiers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can update their own summoned soldiers" ON public.character_shadow_soldiers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 2. saved_searches  (initplan)
-- ============================================================
DROP POLICY IF EXISTS "saved_searches_all" ON public.saved_searches;

CREATE POLICY "saved_searches_all" ON public.saved_searches
  FOR ALL USING (user_id = (select auth.uid()));

-- ============================================================
-- 3. character_journal  (initplan)
-- ============================================================
DROP POLICY IF EXISTS "character_journal_all" ON public.character_journal;

CREATE POLICY "character_journal_all" ON public.character_journal
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 4. roll_history  (initplan)
-- ============================================================
DROP POLICY IF EXISTS "roll_history_select" ON public.roll_history;
DROP POLICY IF EXISTS "roll_history_insert" ON public.roll_history;

CREATE POLICY "roll_history_select" ON public.roll_history
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR (
      campaign_id IS NOT NULL AND (
        EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.dm_id = (select auth.uid()))
        OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = roll_history.campaign_id AND cm.user_id = (select auth.uid()))
      )
    )
  );
CREATE POLICY "roll_history_insert" ON public.roll_history
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- ============================================================
-- 5. character_shadow_army  (initplan)
-- ============================================================
DROP POLICY IF EXISTS "Users can view their own Umbral Legion"   ON public.character_shadow_army;
DROP POLICY IF EXISTS "Users can insert their own Umbral Legion" ON public.character_shadow_army;
DROP POLICY IF EXISTS "Users can update their own Umbral Legion" ON public.character_shadow_army;
DROP POLICY IF EXISTS "Users can delete their own Umbral Legion" ON public.character_shadow_army;

CREATE POLICY "shadow_army_select" ON public.character_shadow_army
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "shadow_army_insert" ON public.character_shadow_army
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "shadow_army_update" ON public.character_shadow_army
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "shadow_army_delete" ON public.character_shadow_army
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 6. campaign_members  (initplan + multiple permissive)
--    Drop ALL named + shorthand policies, recreate consolidated set.
-- ============================================================
DROP POLICY IF EXISTS "DMs can add members to their campaigns"       ON public.campaign_members;
DROP POLICY IF EXISTS "DMs can remove members, users can leave"      ON public.campaign_members;
DROP POLICY IF EXISTS "Users can join campaigns via share code"      ON public.campaign_members;
DROP POLICY IF EXISTS "Users can view members of their campaigns"    ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_select"                      ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_insert"                      ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_update"                      ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_update_self"                 ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_update_dm"                   ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_delete"                      ON public.campaign_members;

CREATE POLICY "campaign_members_select" ON public.campaign_members
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_members_insert" ON public.campaign_members
  FOR INSERT WITH CHECK (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_members_update" ON public.campaign_members
  FOR UPDATE USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_members_delete" ON public.campaign_members
  FOR DELETE USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================
-- 7. campaign_messages  (initplan + multiple permissive)
-- ============================================================
DROP POLICY IF EXISTS "Users can view messages in their campaigns"                    ON public.campaign_messages;
DROP POLICY IF EXISTS "Users can send messages in their campaigns"                    ON public.campaign_messages;
DROP POLICY IF EXISTS "Users can edit their own messages"                             ON public.campaign_messages;
DROP POLICY IF EXISTS "Users can delete their own messages, DMs can delete any"       ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign_messages_select"                                      ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign_messages_insert"                                      ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign_messages_update"                                      ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign_messages_delete"                                      ON public.campaign_messages;

CREATE POLICY "campaign_messages_select" ON public.campaign_messages
  FOR SELECT USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_messages_insert" ON public.campaign_messages
  FOR INSERT WITH CHECK (
    user_id = (select auth.uid())
    AND (
      public.is_campaign_dm(campaign_id, (select auth.uid()))
      OR public.is_campaign_member(campaign_id, (select auth.uid()))
    )
  );
CREATE POLICY "campaign_messages_update" ON public.campaign_messages
  FOR UPDATE USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_messages_delete" ON public.campaign_messages
  FOR DELETE USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================
-- 8. campaign_notes  (initplan + multiple permissive)
-- ============================================================
DROP POLICY IF EXISTS "Users can view notes in their campaigns"                       ON public.campaign_notes;
DROP POLICY IF EXISTS "Users can create notes in their campaigns"                     ON public.campaign_notes;
DROP POLICY IF EXISTS "Users can edit their own notes, DMs can edit any"              ON public.campaign_notes;
DROP POLICY IF EXISTS "Users can delete their own notes, DMs can delete any"          ON public.campaign_notes;
DROP POLICY IF EXISTS "campaign_notes_select"                                         ON public.campaign_notes;
DROP POLICY IF EXISTS "campaign_notes_insert"                                         ON public.campaign_notes;
DROP POLICY IF EXISTS "campaign_notes_update"                                         ON public.campaign_notes;
DROP POLICY IF EXISTS "campaign_notes_delete"                                         ON public.campaign_notes;

CREATE POLICY "campaign_notes_select" ON public.campaign_notes
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR (
      is_shared = true AND (
        public.is_campaign_dm(campaign_id, (select auth.uid()))
        OR public.is_campaign_member(campaign_id, (select auth.uid()))
      )
    )
  );
CREATE POLICY "campaign_notes_insert" ON public.campaign_notes
  FOR INSERT WITH CHECK (
    user_id = (select auth.uid())
    AND (
      public.is_campaign_dm(campaign_id, (select auth.uid()))
      OR public.is_campaign_member(campaign_id, (select auth.uid()))
    )
  );
CREATE POLICY "campaign_notes_update" ON public.campaign_notes
  FOR UPDATE USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_notes_delete" ON public.campaign_notes
  FOR DELETE USING (
    user_id = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================
-- 9. campaign_character_shares  (initplan + multiple permissive)
-- ============================================================
DROP POLICY IF EXISTS "Users can view shared characters in their campaigns"  ON public.campaign_character_shares;
DROP POLICY IF EXISTS "Users can share their own characters"                 ON public.campaign_character_shares;
DROP POLICY IF EXISTS "Users can update their own shares"                    ON public.campaign_character_shares;
DROP POLICY IF EXISTS "Users can delete their own shares"                    ON public.campaign_character_shares;
DROP POLICY IF EXISTS "campaign_character_shares_select"                     ON public.campaign_character_shares;
DROP POLICY IF EXISTS "campaign_character_shares_insert"                     ON public.campaign_character_shares;
DROP POLICY IF EXISTS "campaign_character_shares_update"                     ON public.campaign_character_shares;
DROP POLICY IF EXISTS "campaign_character_shares_delete"                     ON public.campaign_character_shares;

CREATE POLICY "campaign_character_shares_select" ON public.campaign_character_shares
  FOR SELECT USING (
    shared_by = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_character_shares_insert" ON public.campaign_character_shares
  FOR INSERT WITH CHECK (
    shared_by = (select auth.uid())
    AND (
      public.is_campaign_dm(campaign_id, (select auth.uid()))
      OR public.is_campaign_member(campaign_id, (select auth.uid()))
    )
  );
CREATE POLICY "campaign_character_shares_update" ON public.campaign_character_shares
  FOR UPDATE USING (
    shared_by = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_character_shares_delete" ON public.campaign_character_shares
  FOR DELETE USING (
    shared_by = (select auth.uid())
    OR public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================
-- 10. campaign_sessions  (multiple permissive SELECT)
--     FOR ALL (manage) overlaps with FOR SELECT.
-- ============================================================
DROP POLICY IF EXISTS "campaign_sessions_select" ON public.campaign_sessions;
DROP POLICY IF EXISTS "campaign_sessions_manage" ON public.campaign_sessions;

CREATE POLICY "campaign_sessions_select" ON public.campaign_sessions
  FOR SELECT USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_sessions_insert" ON public.campaign_sessions
  FOR INSERT WITH CHECK (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_sessions_update" ON public.campaign_sessions
  FOR UPDATE USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_sessions_delete" ON public.campaign_sessions
  FOR DELETE USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================
-- 11. campaign_sourcebook_shares  (multiple permissive SELECT)
--     FOR ALL (manage) overlaps with FOR SELECT.
-- ============================================================
DROP POLICY IF EXISTS "campaign_sourcebook_shares_select" ON public.campaign_sourcebook_shares;
DROP POLICY IF EXISTS "campaign_sourcebook_shares_manage" ON public.campaign_sourcebook_shares;

CREATE POLICY "campaign_sourcebook_shares_select" ON public.campaign_sourcebook_shares
  FOR SELECT USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
    OR public.is_campaign_member(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_sourcebook_shares_insert" ON public.campaign_sourcebook_shares
  FOR INSERT WITH CHECK (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_sourcebook_shares_update" ON public.campaign_sourcebook_shares
  FOR UPDATE USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );
CREATE POLICY "campaign_sourcebook_shares_delete" ON public.campaign_sourcebook_shares
  FOR DELETE USING (
    public.is_campaign_dm(campaign_id, (select auth.uid()))
  );

-- ============================================================
-- 12. user_sourcebook_entitlements  (multiple permissive SELECT)
--     FOR ALL (manage) overlaps with FOR SELECT.
-- ============================================================
DROP POLICY IF EXISTS "user_sourcebook_entitlements_select" ON public.user_sourcebook_entitlements;
DROP POLICY IF EXISTS "user_sourcebook_entitlements_manage" ON public.user_sourcebook_entitlements;

CREATE POLICY "user_sourcebook_entitlements_select" ON public.user_sourcebook_entitlements
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );
CREATE POLICY "user_sourcebook_entitlements_insert" ON public.user_sourcebook_entitlements
  FOR INSERT WITH CHECK (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );
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
-- 13. user_profiles  (multiple permissive SELECT)
--     Use is_dm_or_admin() to avoid self-referencing RLS recursion.
-- ============================================================
DROP POLICY IF EXISTS "DMs can view all profiles"          ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile"   ON public.user_profiles;

CREATE POLICY "user_profiles_select" ON public.user_profiles
  FOR SELECT USING (
    id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );

-- ============================================================
-- 14. active_sessions  (multiple permissive SELECT)
--     FOR ALL (DM manage) overlaps with FOR SELECT.
-- ============================================================
DROP POLICY IF EXISTS "Users can view active sessions in their campaigns"   ON public.active_sessions;
DROP POLICY IF EXISTS "DMs can manage active sessions in their campaigns"   ON public.active_sessions;

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
CREATE POLICY "active_sessions_insert" ON public.active_sessions
  FOR INSERT WITH CHECK (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.dm_id = (select auth.uid())
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
-- 15. art_assets  (multiple permissive SELECT)
--     FOR ALL (authenticated manage) overlaps with FOR SELECT (public).
-- ============================================================
DROP POLICY IF EXISTS "Art assets are publicly readable"                  ON public.art_assets;
DROP POLICY IF EXISTS "Art assets manageable by authenticated users"      ON public.art_assets;

CREATE POLICY "art_assets_select" ON public.art_assets
  FOR SELECT USING (true);
CREATE POLICY "art_assets_insert" ON public.art_assets
  FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);
CREATE POLICY "art_assets_update" ON public.art_assets
  FOR UPDATE USING ((select auth.uid()) IS NOT NULL);
CREATE POLICY "art_assets_delete" ON public.art_assets
  FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- ============================================================
-- 16. assets  (multiple permissive SELECT)
--     FOR ALL (authenticated manage) overlaps with FOR SELECT (public).
-- ============================================================
DROP POLICY IF EXISTS "Assets are publicly readable"              ON public.assets;
DROP POLICY IF EXISTS "Authenticated users can manage assets"     ON public.assets;

CREATE POLICY "assets_select" ON public.assets
  FOR SELECT USING (true);
CREATE POLICY "assets_insert" ON public.assets
  FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);
CREATE POLICY "assets_update" ON public.assets
  FOR UPDATE USING ((select auth.uid()) IS NOT NULL);
CREATE POLICY "assets_delete" ON public.assets
  FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- ============================================================
-- 17. campaign_content  (multiple permissive SELECT)
--     FOR ALL (DM manage) overlaps with FOR SELECT (member view).
-- ============================================================
DROP POLICY IF EXISTS "Campaign members can view content"   ON public.campaign_content;
DROP POLICY IF EXISTS "DMs can manage campaign content"     ON public.campaign_content;

CREATE POLICY "campaign_content_select" ON public.campaign_content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.campaigns cam
      WHERE cam.id = campaign_id
        AND (cam.dm_id = (select auth.uid())
             OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = cam.id AND cm.user_id = (select auth.uid())))
    )
  );
CREATE POLICY "campaign_content_insert" ON public.campaign_content
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.campaigns cam WHERE cam.id = campaign_id AND cam.dm_id = (select auth.uid()))
  );
CREATE POLICY "campaign_content_update" ON public.campaign_content
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.campaigns cam WHERE cam.id = campaign_id AND cam.dm_id = (select auth.uid()))
  );
CREATE POLICY "campaign_content_delete" ON public.campaign_content
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.campaigns cam WHERE cam.id = campaign_id AND cam.dm_id = (select auth.uid()))
  );

-- ============================================================
-- 18. vtt_settings  (multiple permissive SELECT)
--     FOR ALL (DM manage) overlaps with FOR SELECT (user view).
-- ============================================================
DROP POLICY IF EXISTS "Users can view VTT settings in their sessions"      ON public.vtt_settings;
DROP POLICY IF EXISTS "DMs can manage VTT settings in their campaigns"     ON public.vtt_settings;

CREATE POLICY "vtt_settings_select" ON public.vtt_settings
  FOR SELECT USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_settings_insert" ON public.vtt_settings
  FOR INSERT WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_settings_update" ON public.vtt_settings
  FOR UPDATE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_settings_delete" ON public.vtt_settings
  FOR DELETE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );

-- ============================================================
-- 19. vtt_tokens  (multiple permissive SELECT)
-- ============================================================
DROP POLICY IF EXISTS "Users can view VTT tokens in their sessions"      ON public.vtt_tokens;
DROP POLICY IF EXISTS "DMs can manage VTT tokens in their campaigns"     ON public.vtt_tokens;

CREATE POLICY "vtt_tokens_select" ON public.vtt_tokens
  FOR SELECT USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
    AND (visible_to_players = TRUE OR created_by = (select auth.uid()))
  );
CREATE POLICY "vtt_tokens_insert" ON public.vtt_tokens
  FOR INSERT WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_tokens_update" ON public.vtt_tokens
  FOR UPDATE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_tokens_delete" ON public.vtt_tokens
  FOR DELETE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );

-- ============================================================
-- 20. vtt_map_elements  (multiple permissive SELECT)
-- ============================================================
DROP POLICY IF EXISTS "Users can view VTT map elements in their sessions"      ON public.vtt_map_elements;
DROP POLICY IF EXISTS "DMs can manage VTT map elements in their campaigns"     ON public.vtt_map_elements;

CREATE POLICY "vtt_map_elements_select" ON public.vtt_map_elements
  FOR SELECT USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
    AND (visible_to_players = TRUE OR created_by = (select auth.uid()))
  );
CREATE POLICY "vtt_map_elements_insert" ON public.vtt_map_elements
  FOR INSERT WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_map_elements_update" ON public.vtt_map_elements
  FOR UPDATE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_map_elements_delete" ON public.vtt_map_elements
  FOR DELETE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );

-- ============================================================
-- 21. vtt_audio_tracks  (multiple permissive SELECT)
-- ============================================================
DROP POLICY IF EXISTS "Users can view VTT audio tracks in their sessions"      ON public.vtt_audio_tracks;
DROP POLICY IF EXISTS "DMs can manage VTT audio tracks in their campaigns"     ON public.vtt_audio_tracks;

CREATE POLICY "vtt_audio_tracks_select" ON public.vtt_audio_tracks
  FOR SELECT USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_audio_tracks_insert" ON public.vtt_audio_tracks
  FOR INSERT WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_audio_tracks_update" ON public.vtt_audio_tracks
  FOR UPDATE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_audio_tracks_delete" ON public.vtt_audio_tracks
  FOR DELETE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );

-- ============================================================
-- 22. vtt_audio_settings  (multiple permissive SELECT)
-- ============================================================
DROP POLICY IF EXISTS "Users can view VTT audio settings in their sessions"      ON public.vtt_audio_settings;
DROP POLICY IF EXISTS "DMs can manage VTT audio settings in their campaigns"     ON public.vtt_audio_settings;

CREATE POLICY "vtt_audio_settings_select" ON public.vtt_audio_settings
  FOR SELECT USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_audio_settings_insert" ON public.vtt_audio_settings
  FOR INSERT WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_audio_settings_update" ON public.vtt_audio_settings
  FOR UPDATE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "vtt_audio_settings_delete" ON public.vtt_audio_settings
  FOR DELETE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );

-- ============================================================
-- 23. vtt_fog_state  (multiple permissive SELECT)
--     FOR ALL (DM manage) overlaps with FOR SELECT (view).
-- ============================================================
DROP POLICY IF EXISTS "View fog state for campaign" ON public.vtt_fog_state;
DROP POLICY IF EXISTS "DMs manage fog state"        ON public.vtt_fog_state;

CREATE POLICY "vtt_fog_state_select" ON public.vtt_fog_state
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.dm_id = (select auth.uid()))
    OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = vtt_fog_state.campaign_id AND cm.user_id = (select auth.uid()))
  );
CREATE POLICY "vtt_fog_state_insert" ON public.vtt_fog_state
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.dm_id = (select auth.uid()))
  );
CREATE POLICY "vtt_fog_state_update" ON public.vtt_fog_state
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.dm_id = (select auth.uid()))
  );
CREATE POLICY "vtt_fog_state_delete" ON public.vtt_fog_state
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.dm_id = (select auth.uid()))
  );

-- ============================================================
-- 24. Duplicate indexes
-- ============================================================
DROP INDEX IF EXISTS public.idx_campaigns_dm_id;
-- Both compendium_backgrounds indexes are constraint-backed; drop one as a constraint
ALTER TABLE public.compendium_backgrounds DROP CONSTRAINT IF EXISTS compendium_backgrounds_name_key;

COMMIT;

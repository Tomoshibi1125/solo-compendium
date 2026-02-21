-- Round 3: Fix remaining auth_rls_initplan warnings.
-- All bare auth.uid() calls wrapped in (select auth.uid()).

BEGIN;

-- ============================================================
-- 1. character_spell_slots (4 policies)
-- ============================================================
DROP POLICY IF EXISTS "Users can view their own character spell slots"   ON public.character_spell_slots;
DROP POLICY IF EXISTS "Users can insert their own character spell slots" ON public.character_spell_slots;
DROP POLICY IF EXISTS "Users can update their own character spell slots" ON public.character_spell_slots;
DROP POLICY IF EXISTS "Users can delete their own character spell slots" ON public.character_spell_slots;

CREATE POLICY "Users can view their own character spell slots" ON public.character_spell_slots
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can insert their own character spell slots" ON public.character_spell_slots
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can update their own character spell slots" ON public.character_spell_slots
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can delete their own character spell slots" ON public.character_spell_slots
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 2. profiles (INSERT + UPDATE)
-- ============================================================
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = (select auth.uid()));
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = (select auth.uid()));

-- ============================================================
-- 3. ai_generated_content (SELECT + INSERT)
-- ============================================================
DROP POLICY IF EXISTS "Users can view their own AI content"   ON public.ai_generated_content;
DROP POLICY IF EXISTS "Users can insert their own AI content" ON public.ai_generated_content;

CREATE POLICY "Users can view their own AI content" ON public.ai_generated_content
  FOR SELECT USING ((select auth.uid()) IS NOT NULL);
CREATE POLICY "Users can insert their own AI content" ON public.ai_generated_content
  FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

-- ============================================================
-- 4. ai_usage_logs (SELECT + INSERT)
-- ============================================================
DROP POLICY IF EXISTS "Users can view their own AI usage"  ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Service can insert AI usage logs"   ON public.ai_usage_logs;

CREATE POLICY "Users can view their own AI usage" ON public.ai_usage_logs
  FOR SELECT USING ((select auth.uid()) IS NULL OR user_id = (select auth.uid()));
CREATE POLICY "Service can insert AI usage logs" ON public.ai_usage_logs
  FOR INSERT WITH CHECK (user_id IS NULL OR user_id = (select auth.uid()));

-- ============================================================
-- 5. character_sheet_state (4 policies)
-- ============================================================
DROP POLICY IF EXISTS "Users can view their own sheet state"   ON public.character_sheet_state;
DROP POLICY IF EXISTS "Users can insert their own sheet state" ON public.character_sheet_state;
DROP POLICY IF EXISTS "Users can update their own sheet state" ON public.character_sheet_state;
DROP POLICY IF EXISTS "Users can delete their own sheet state" ON public.character_sheet_state;

CREATE POLICY "Users can view their own sheet state" ON public.character_sheet_state
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can insert their own sheet state" ON public.character_sheet_state
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can update their own sheet state" ON public.character_sheet_state
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can delete their own sheet state" ON public.character_sheet_state
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 6. user_tool_states (4 policies)
-- ============================================================
DROP POLICY IF EXISTS "user_tool_states_select" ON public.user_tool_states;
DROP POLICY IF EXISTS "user_tool_states_insert" ON public.user_tool_states;
DROP POLICY IF EXISTS "user_tool_states_update" ON public.user_tool_states;
DROP POLICY IF EXISTS "user_tool_states_delete" ON public.user_tool_states;

CREATE POLICY "user_tool_states_select" ON public.user_tool_states
  FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "user_tool_states_insert" ON public.user_tool_states
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "user_tool_states_update" ON public.user_tool_states
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "user_tool_states_delete" ON public.user_tool_states
  FOR DELETE USING (user_id = (select auth.uid()));

-- ============================================================
-- 7. compendium_notes (4 policies)
-- ============================================================
DROP POLICY IF EXISTS "compendium_notes_select" ON public.compendium_notes;
DROP POLICY IF EXISTS "compendium_notes_insert" ON public.compendium_notes;
DROP POLICY IF EXISTS "compendium_notes_update" ON public.compendium_notes;
DROP POLICY IF EXISTS "compendium_notes_delete" ON public.compendium_notes;

CREATE POLICY "compendium_notes_select" ON public.compendium_notes
  FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "compendium_notes_insert" ON public.compendium_notes
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "compendium_notes_update" ON public.compendium_notes
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "compendium_notes_delete" ON public.compendium_notes
  FOR DELETE USING (user_id = (select auth.uid()));

-- ============================================================
-- 8. vtt_journal_entries (INSERT only — select/update/delete use helper fns)
-- ============================================================
DROP POLICY IF EXISTS "vtt_journal_entries_insert" ON public.vtt_journal_entries;

CREATE POLICY "vtt_journal_entries_insert" ON public.vtt_journal_entries
  FOR INSERT WITH CHECK (
    public.is_campaign_system(campaign_id)
    AND user_id = (select auth.uid())
  );

-- ============================================================
-- 9. audio_tracks (4 policies)
-- ============================================================
DROP POLICY IF EXISTS "audio_tracks_select" ON public.audio_tracks;
DROP POLICY IF EXISTS "audio_tracks_insert" ON public.audio_tracks;
DROP POLICY IF EXISTS "audio_tracks_update" ON public.audio_tracks;
DROP POLICY IF EXISTS "audio_tracks_delete" ON public.audio_tracks;

CREATE POLICY "audio_tracks_select" ON public.audio_tracks
  FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "audio_tracks_insert" ON public.audio_tracks
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "audio_tracks_update" ON public.audio_tracks
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "audio_tracks_delete" ON public.audio_tracks
  FOR DELETE USING (user_id = (select auth.uid()));

-- ============================================================
-- 10. audio_playlists (4 policies)
-- ============================================================
DROP POLICY IF EXISTS "audio_playlists_select" ON public.audio_playlists;
DROP POLICY IF EXISTS "audio_playlists_insert" ON public.audio_playlists;
DROP POLICY IF EXISTS "audio_playlists_update" ON public.audio_playlists;
DROP POLICY IF EXISTS "audio_playlists_delete" ON public.audio_playlists;

CREATE POLICY "audio_playlists_select" ON public.audio_playlists
  FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "audio_playlists_insert" ON public.audio_playlists
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "audio_playlists_update" ON public.audio_playlists
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "audio_playlists_delete" ON public.audio_playlists
  FOR DELETE USING (user_id = (select auth.uid()));

-- ============================================================
-- 11. character_backups (4 policies)
-- ============================================================
DROP POLICY IF EXISTS "character_backups_select" ON public.character_backups;
DROP POLICY IF EXISTS "character_backups_insert" ON public.character_backups;
DROP POLICY IF EXISTS "character_backups_update" ON public.character_backups;
DROP POLICY IF EXISTS "character_backups_delete" ON public.character_backups;

CREATE POLICY "character_backups_select" ON public.character_backups
  FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "character_backups_insert" ON public.character_backups
  FOR INSERT WITH CHECK (
    user_id = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.characters
      WHERE id = character_id AND user_id = (select auth.uid())
    )
  );
CREATE POLICY "character_backups_update" ON public.character_backups
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "character_backups_delete" ON public.character_backups
  FOR DELETE USING (user_id = (select auth.uid()));

-- ============================================================
-- 12. user_profiles (INSERT + UPDATE)
-- ============================================================
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING ((select auth.uid()) = id);

-- ============================================================
-- 13. campaign_member_characters (INSERT + UPDATE + DELETE)
--     SELECT uses helper fns (no bare auth.uid).
-- ============================================================
DROP POLICY IF EXISTS "campaign_member_characters_insert" ON public.campaign_member_characters;
DROP POLICY IF EXISTS "campaign_member_characters_update" ON public.campaign_member_characters;
DROP POLICY IF EXISTS "campaign_member_characters_delete" ON public.campaign_member_characters;

CREATE POLICY "campaign_member_characters_insert" ON public.campaign_member_characters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaign_members mr
      WHERE mr.id = campaign_member_characters.campaign_member_id
        AND mr.user_id = (select auth.uid())
    )
    AND EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = campaign_member_characters.character_id
        AND c.user_id = (select auth.uid())
    )
  );
CREATE POLICY "campaign_member_characters_update" ON public.campaign_member_characters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members mr
      WHERE mr.id = campaign_member_characters.campaign_member_id
        AND mr.user_id = (select auth.uid())
    )
  );
CREATE POLICY "campaign_member_characters_delete" ON public.campaign_member_characters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members mr
      WHERE mr.id = campaign_member_characters.campaign_member_id
        AND mr.user_id = (select auth.uid())
    )
  );

-- ============================================================
-- 14. homebrew_content (4 policies)
--     Uses is_dm_or_admin() helper — wrap auth.uid() arg.
-- ============================================================
DROP POLICY IF EXISTS "homebrew_content_select" ON public.homebrew_content;
DROP POLICY IF EXISTS "homebrew_content_insert" ON public.homebrew_content;
DROP POLICY IF EXISTS "homebrew_content_update" ON public.homebrew_content;
DROP POLICY IF EXISTS "homebrew_content_delete" ON public.homebrew_content;

CREATE POLICY "homebrew_content_select" ON public.homebrew_content
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
    OR (status = 'published' AND (is_public OR visibility_scope = 'public'))
    OR (
      status = 'published'
      AND visibility_scope = 'campaign'
      AND EXISTS (
        SELECT 1 FROM public.campaign_members cm
        WHERE cm.user_id = (select auth.uid())
      )
    )
  );
CREATE POLICY "homebrew_content_insert" ON public.homebrew_content
  FOR INSERT WITH CHECK (
    user_id = (select auth.uid()) OR public.is_dm_or_admin((select auth.uid()))
  );
CREATE POLICY "homebrew_content_update" ON public.homebrew_content
  FOR UPDATE USING (
    user_id = (select auth.uid()) OR public.is_dm_or_admin((select auth.uid()))
  );
CREATE POLICY "homebrew_content_delete" ON public.homebrew_content
  FOR DELETE USING (
    user_id = (select auth.uid()) OR public.is_dm_or_admin((select auth.uid()))
  );

-- ============================================================
-- 15. homebrew_content_versions (SELECT + INSERT)
-- ============================================================
DROP POLICY IF EXISTS "homebrew_content_versions_select" ON public.homebrew_content_versions;
DROP POLICY IF EXISTS "homebrew_content_versions_insert" ON public.homebrew_content_versions;

CREATE POLICY "homebrew_content_versions_select" ON public.homebrew_content_versions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.homebrew_content WHERE id = homebrew_id AND (is_public OR user_id = (select auth.uid())))
  );
CREATE POLICY "homebrew_content_versions_insert" ON public.homebrew_content_versions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.homebrew_content WHERE id = homebrew_id AND user_id = (select auth.uid()))
  );

-- ============================================================
-- 16. marketplace_items (4 policies)
-- ============================================================
DROP POLICY IF EXISTS "marketplace_items_select" ON public.marketplace_items;
DROP POLICY IF EXISTS "marketplace_items_insert" ON public.marketplace_items;
DROP POLICY IF EXISTS "marketplace_items_update" ON public.marketplace_items;
DROP POLICY IF EXISTS "marketplace_items_delete" ON public.marketplace_items;

CREATE POLICY "marketplace_items_select" ON public.marketplace_items
  FOR SELECT USING (
    is_listed OR author_id = (select auth.uid()) OR public.is_dm_or_admin((select auth.uid()))
  );
CREATE POLICY "marketplace_items_insert" ON public.marketplace_items
  FOR INSERT WITH CHECK (
    author_id = (select auth.uid()) OR public.is_dm_or_admin((select auth.uid()))
  );
CREATE POLICY "marketplace_items_update" ON public.marketplace_items
  FOR UPDATE USING (
    author_id = (select auth.uid()) OR public.is_dm_or_admin((select auth.uid()))
  );
CREATE POLICY "marketplace_items_delete" ON public.marketplace_items
  FOR DELETE USING (
    author_id = (select auth.uid()) OR public.is_dm_or_admin((select auth.uid()))
  );

-- ============================================================
-- 17. marketplace_reviews (INSERT + UPDATE + DELETE)
--     SELECT uses USING(true) — no auth call.
-- ============================================================
DROP POLICY IF EXISTS "marketplace_reviews_insert" ON public.marketplace_reviews;
DROP POLICY IF EXISTS "marketplace_reviews_update" ON public.marketplace_reviews;
DROP POLICY IF EXISTS "marketplace_reviews_delete" ON public.marketplace_reviews;

CREATE POLICY "marketplace_reviews_insert" ON public.marketplace_reviews
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "marketplace_reviews_update" ON public.marketplace_reviews
  FOR UPDATE USING (
    user_id = (select auth.uid()) OR public.is_dm_or_admin((select auth.uid()))
  );
CREATE POLICY "marketplace_reviews_delete" ON public.marketplace_reviews
  FOR DELETE USING (
    user_id = (select auth.uid()) OR public.is_dm_or_admin((select auth.uid()))
  );

-- ============================================================
-- 18. marketplace_downloads (SELECT + INSERT)
-- ============================================================
DROP POLICY IF EXISTS "marketplace_downloads_select" ON public.marketplace_downloads;
DROP POLICY IF EXISTS "marketplace_downloads_insert" ON public.marketplace_downloads;

CREATE POLICY "marketplace_downloads_select" ON public.marketplace_downloads
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
    OR EXISTS (
      SELECT 1 FROM public.marketplace_items mi
      WHERE mi.id = item_id AND mi.author_id = (select auth.uid())
    )
  );
CREATE POLICY "marketplace_downloads_insert" ON public.marketplace_downloads
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- ============================================================
-- 19. campaign_roll_events (SELECT + INSERT)
-- ============================================================
DROP POLICY IF EXISTS "campaign_roll_events_select" ON public.campaign_roll_events;
DROP POLICY IF EXISTS "campaign_roll_events_insert" ON public.campaign_roll_events;

CREATE POLICY "campaign_roll_events_select" ON public.campaign_roll_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.campaign_id = campaign_roll_events.campaign_id
        AND cm.user_id = (select auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_roll_events.campaign_id
        AND c.dm_id = (select auth.uid())
    )
  );
CREATE POLICY "campaign_roll_events_insert" ON public.campaign_roll_events
  FOR INSERT WITH CHECK (
    user_id = (select auth.uid())
    AND (
      EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = campaign_roll_events.campaign_id AND cm.user_id = (select auth.uid()))
      OR EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_roll_events.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );

-- ============================================================
-- 20. campaign_session_logs (4 policies)
-- ============================================================
DROP POLICY IF EXISTS "campaign_session_logs_select" ON public.campaign_session_logs;
DROP POLICY IF EXISTS "campaign_session_logs_insert" ON public.campaign_session_logs;
DROP POLICY IF EXISTS "campaign_session_logs_update" ON public.campaign_session_logs;
DROP POLICY IF EXISTS "campaign_session_logs_delete" ON public.campaign_session_logs;

CREATE POLICY "campaign_session_logs_select" ON public.campaign_session_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND (
      c.dm_id = (select auth.uid())
      OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = c.id AND cm.user_id = (select auth.uid()))
    ))
  );
CREATE POLICY "campaign_session_logs_insert" ON public.campaign_session_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND (
      c.dm_id = (select auth.uid())
      OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = c.id AND cm.user_id = (select auth.uid()))
    ))
  );
CREATE POLICY "campaign_session_logs_update" ON public.campaign_session_logs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.dm_id = (select auth.uid()))
  );
CREATE POLICY "campaign_session_logs_delete" ON public.campaign_session_logs
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND c.dm_id = (select auth.uid()))
  );

-- ============================================================
-- 21. character_feature_choices (4 policies)
-- ============================================================
DROP POLICY IF EXISTS "character_feature_choices_select" ON public.character_feature_choices;
DROP POLICY IF EXISTS "character_feature_choices_insert" ON public.character_feature_choices;
DROP POLICY IF EXISTS "character_feature_choices_update" ON public.character_feature_choices;
DROP POLICY IF EXISTS "character_feature_choices_delete" ON public.character_feature_choices;

CREATE POLICY "character_feature_choices_select" ON public.character_feature_choices
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "character_feature_choices_insert" ON public.character_feature_choices
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "character_feature_choices_update" ON public.character_feature_choices
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "character_feature_choices_delete" ON public.character_feature_choices
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 22. combat_actions (SELECT + INSERT)
-- ============================================================
DROP POLICY IF EXISTS "Users can view combat actions in their sessions"      ON public.combat_actions;
DROP POLICY IF EXISTS "Users can add combat actions for their characters"    ON public.combat_actions;

CREATE POLICY "Users can view combat actions in their sessions" ON public.combat_actions
  FOR SELECT USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
  );
CREATE POLICY "Users can add combat actions for their characters" ON public.combat_actions
  FOR INSERT WITH CHECK (
    participant_id IN (
      SELECT cp.id FROM public.combat_participants cp
      WHERE cp.session_id = combat_actions.session_id
        AND cp.user_id = (select auth.uid())
    )
  );

-- ============================================================
-- 23. vtt_chat_messages (SELECT + INSERT + DELETE)
-- ============================================================
DROP POLICY IF EXISTS "Campaign members can view chat messages"  ON public.vtt_chat_messages;
DROP POLICY IF EXISTS "Campaign members can send chat messages"  ON public.vtt_chat_messages;
DROP POLICY IF EXISTS "DMs can delete chat messages"             ON public.vtt_chat_messages;

CREATE POLICY "Campaign members can view chat messages" ON public.vtt_chat_messages
  FOR SELECT USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.dm_id = (select auth.uid())
    )
    OR campaign_id IN (
      SELECT cm.campaign_id FROM public.campaign_members cm WHERE cm.user_id = (select auth.uid())
    )
  );
CREATE POLICY "Campaign members can send chat messages" ON public.vtt_chat_messages
  FOR INSERT WITH CHECK (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.dm_id = (select auth.uid())
    )
    OR campaign_id IN (
      SELECT cm.campaign_id FROM public.campaign_members cm WHERE cm.user_id = (select auth.uid())
    )
  );
CREATE POLICY "DMs can delete chat messages" ON public.vtt_chat_messages
  FOR DELETE USING (
    campaign_id IN (
      SELECT c.id FROM public.campaigns c WHERE c.dm_id = (select auth.uid())
    )
  );

COMMIT;

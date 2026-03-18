-- Migration: Remove Unused and Duplicate Indexes
-- This migration cleans up redundant indexes identified by the database linter.
-- It focuses on removing duplicates (added under different naming conventions)
-- and indexes that are covered by existing UNIQUE constraints or multi-column indexes.

DO $$
BEGIN
    --------------------------------------------------------------------------------
    -- 1. Remove Duplicate Indexes (Same column, different names)
    --------------------------------------------------------------------------------
    
    -- Table: public.compendium_notes
    DROP INDEX IF EXISTS public.idx_compendium_notes_user_id; -- Duplicate of compendium_notes_user_id_idx
    
    -- Table: public.character_backups
    DROP INDEX IF EXISTS public.idx_character_backups_user_id; -- Duplicate of character_backups_user_id_idx
    
    -- Table: public.audio_tracks
    DROP INDEX IF EXISTS public.idx_audio_tracks_user_id; -- Duplicate of audio_tracks_user_id_idx
    
    -- Table: public.audio_playlists
    DROP INDEX IF EXISTS public.idx_audio_playlists_user_id; -- Duplicate of audio_playlists_user_id_idx
    
    -- Table: public.user_tool_states
    DROP INDEX IF EXISTS public.idx_user_tool_states_user_id; -- Duplicate of user_tool_states_user_id_idx
    
    -- Table: public.campaign_tool_states
    DROP INDEX IF EXISTS public.idx_campaign_tool_states_campaign_id; -- Duplicate of campaign_tool_states_campaign_id_idx
    
    -- Table: public.ai_usage_logs
    DROP INDEX IF EXISTS public.idx_ai_usage_logs_user_id; -- Duplicate of idx_ai_usage_logs_user
    
    -- Table: public.campaign_invites
    DROP INDEX IF EXISTS public.idx_campaign_invites_campaign_id; -- Duplicate of campaign_invites_campaign_idx
    
    -- Table: public.campaign_rule_events
    DROP INDEX IF EXISTS public.idx_campaign_rule_events_campaign_id; -- Redundant (covered by multi-column campaign_rule_events_campaign_idx)
    
    -- Table: public.campaign_encounters
    DROP INDEX IF EXISTS public.idx_campaign_encounters_campaign_id; -- Redundant (covered by multi-column campaign_encounters_campaign_idx)
    
    -- Table: public.campaign_encounter_entries
    DROP INDEX IF EXISTS public.idx_campaign_encounter_entries_campaign_id; -- Duplicate of campaign_encounter_entries_campaign_idx
    DROP INDEX IF EXISTS public.idx_campaign_encounter_entries_encounter_id; -- Duplicate of campaign_encounter_entries_encounter_idx
    
    -- Table: public.campaign_combat_sessions
    DROP INDEX IF EXISTS public.idx_campaign_combat_sessions_campaign_id; -- Redundant (covered by multi-column campaign_combat_sessions_campaign_idx)
    
    -- Table: public.campaign_combatants
    DROP INDEX IF EXISTS public.idx_campaign_combatants_session_id; -- Duplicate of campaign_combatants_session_idx
    
    -- Table: public.campaign_loot_drops
    DROP INDEX IF EXISTS public.idx_campaign_loot_drops_campaign_id; -- Redundant (covered by multi-column campaign_loot_drops_campaign_idx)
    
    -- Table: public.campaign_relic_instances
    DROP INDEX IF EXISTS public.idx_campaign_relic_instances_campaign_id; -- Redundant (covered by multi-column campaign_relic_instances_campaign_idx)

    --------------------------------------------------------------------------------
    -- 2. Remove Redundant Prefix Indexes (Covered by UNIQUE or multi-column)
    --------------------------------------------------------------------------------
    
    -- Table: public.character_shares
    -- Covered by UNIQUE(character_id, user_id)
    DROP INDEX IF EXISTS public.idx_character_shares_character_id;
    
    -- Table: public.campaign_character_shares
    -- Covered by UNIQUE(campaign_id, character_id)
    DROP INDEX IF EXISTS public.idx_campaign_character_shares_campaign_id;
    DROP INDEX IF EXISTS public.campaign_character_shares_campaign_id_idx;
    
    -- Table: public.character_abilities
    -- Covered by UNIQUE(character_id, ability)
    DROP INDEX IF EXISTS public.idx_character_abilities_character_id;
    
    -- Table: public.campaign_members
    -- Covered by UNIQUE(campaign_id, user_id)
    DROP INDEX IF EXISTS public.idx_campaign_members_campaign_id;
    DROP INDEX IF EXISTS public.idx_campaign_members_user_id; -- Also covered by UNIQUE if user_id was first, but here campaign_id is first. 
    -- Wait, if UNIQUE(campaign_id, user_id), only campaign_id is covered as a prefix.
    -- However, there is already campaign_members_user_id_idx on user_id.
    DROP INDEX IF EXISTS public.idx_campaign_members_user_id; -- Duplicate of campaign_members_user_id_idx
    
    -- Table: public.session_participants
    -- Covered by UNIQUE(session_id, user_id)
    DROP INDEX IF EXISTS public.idx_session_participants_session_id;
    DROP INDEX IF EXISTS public.idx_session_participants_user_id; -- Duplicate of idx_session_participants_user_id (wait, check name)
    -- In 20260220000000_active_sessions.sql: idx_session_participants_user_id exists.
    -- The comprehensive one is same name, so no duplicate index created, just one. 
    -- So why is it flagged? Genuinely unused.

    --------------------------------------------------------------------------------
    -- 3. Additional Unused Indexes (Flagged by linter with 0 usage)
    --------------------------------------------------------------------------------
    
    -- These are specifically flagged and deemed non-critical for retention 
    -- if they don't cover essential FKs or if the table is small.
    
    -- active_sessions
    DROP INDEX IF EXISTS public.idx_active_sessions_created_by;
    DROP INDEX IF EXISTS public.idx_active_sessions_current_turn_player_id;

    -- marketplace_downloads
    DROP INDEX IF EXISTS public.idx_marketplace_downloads_user_id;
    
    -- marketplace_reviews
    DROP INDEX IF EXISTS public.idx_marketplace_reviews_user_id;

    -- quest_completions
    DROP INDEX IF EXISTS public.idx_quest_completions_user_id;

    -- session_quests
    DROP INDEX IF EXISTS public.idx_session_quests_created_by;

END $$;

-- Refresh statistics
ANALYZE;

-- Fix Supabase linter warnings: unindexed foreign keys + unused indexes
-- Date: 2026-02-21

------------------------------------------------------------------------
-- PART 1: Create missing indexes for unindexed foreign keys
-- These are required for performant CASCADE/SET NULL operations on the
-- referenced (parent) table and for JOIN lookups.
------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_active_sessions_campaign_id
  ON public.active_sessions (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_combat_sessions_campaign_id
  ON public.campaign_combat_sessions (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_combatants_session_id
  ON public.campaign_combatants (session_id);

CREATE INDEX IF NOT EXISTS idx_campaign_encounter_entries_campaign_id
  ON public.campaign_encounter_entries (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_encounter_entries_encounter_id
  ON public.campaign_encounter_entries (encounter_id);

CREATE INDEX IF NOT EXISTS idx_campaign_encounters_campaign_id
  ON public.campaign_encounters (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_invite_audit_logs_campaign_id
  ON public.campaign_invite_audit_logs (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_invite_audit_logs_invite_id
  ON public.campaign_invite_audit_logs (invite_id);

CREATE INDEX IF NOT EXISTS idx_campaign_invites_campaign_id
  ON public.campaign_invites (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_campaign_id
  ON public.campaign_loot_drops (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_relic_instances_campaign_id
  ON public.campaign_relic_instances (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_roll_events_campaign_id
  ON public.campaign_roll_events (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_rule_events_campaign_id
  ON public.campaign_rule_events (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_session_logs_campaign_id
  ON public.campaign_session_logs (campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_session_logs_session_id
  ON public.campaign_session_logs (session_id);

CREATE INDEX IF NOT EXISTS idx_campaign_sessions_campaign_id
  ON public.campaign_sessions (campaign_id);

CREATE INDEX IF NOT EXISTS idx_combat_actions_participant_id
  ON public.combat_actions (participant_id);

CREATE INDEX IF NOT EXISTS idx_combat_actions_session_id
  ON public.combat_actions (session_id);

CREATE INDEX IF NOT EXISTS idx_combat_participants_session_id
  ON public.combat_participants (session_id);

CREATE INDEX IF NOT EXISTS idx_daily_quest_instances_template_id
  ON public.daily_quest_instances (template_id);

CREATE INDEX IF NOT EXISTS idx_entity_assets_asset_id
  ON public.entity_assets (asset_id);

CREATE INDEX IF NOT EXISTS idx_homebrew_content_campaign_id
  ON public.homebrew_content (campaign_id);

CREATE INDEX IF NOT EXISTS idx_homebrew_content_updated_by
  ON public.homebrew_content (updated_by);

CREATE INDEX IF NOT EXISTS idx_homebrew_content_user_id
  ON public.homebrew_content (user_id);

CREATE INDEX IF NOT EXISTS idx_homebrew_content_versions_created_by
  ON public.homebrew_content_versions (created_by);

CREATE INDEX IF NOT EXISTS idx_marketplace_downloads_user_id
  ON public.marketplace_downloads (user_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_items_author_id
  ON public.marketplace_items (author_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_user_id
  ON public.marketplace_reviews (user_id);

CREATE INDEX IF NOT EXISTS idx_quest_completions_character_id
  ON public.quest_completions (character_id);

CREATE INDEX IF NOT EXISTS idx_quest_completions_user_id
  ON public.quest_completions (user_id);

CREATE INDEX IF NOT EXISTS idx_quest_rewards_log_character_id
  ON public.quest_rewards_log (character_id);

CREATE INDEX IF NOT EXISTS idx_roll_history_campaign_id
  ON public.roll_history (campaign_id);

CREATE INDEX IF NOT EXISTS idx_roll_history_character_id
  ON public.roll_history (character_id);

CREATE INDEX IF NOT EXISTS idx_saved_sovereigns_job_id
  ON public.saved_sovereigns (job_id);

CREATE INDEX IF NOT EXISTS idx_saved_sovereigns_monarch_a_id
  ON public.saved_sovereigns (monarch_a_id);

CREATE INDEX IF NOT EXISTS idx_saved_sovereigns_monarch_b_id
  ON public.saved_sovereigns (monarch_b_id);

CREATE INDEX IF NOT EXISTS idx_saved_sovereigns_path_id
  ON public.saved_sovereigns (path_id);

CREATE INDEX IF NOT EXISTS idx_session_participants_character_id
  ON public.session_participants (character_id);

CREATE INDEX IF NOT EXISTS idx_session_participants_user_id
  ON public.session_participants (user_id);

CREATE INDEX IF NOT EXISTS idx_session_quests_created_by
  ON public.session_quests (created_by);

CREATE INDEX IF NOT EXISTS idx_session_quests_session_id
  ON public.session_quests (session_id);

CREATE INDEX IF NOT EXISTS idx_user_marketplace_entitlements_granted_by
  ON public.user_marketplace_entitlements (granted_by);

CREATE INDEX IF NOT EXISTS idx_user_marketplace_entitlements_item_id
  ON public.user_marketplace_entitlements (item_id);

CREATE INDEX IF NOT EXISTS idx_user_sourcebook_entitlements_granted_by
  ON public.user_sourcebook_entitlements (granted_by);

CREATE INDEX IF NOT EXISTS idx_user_sourcebook_entitlements_sourcebook_id
  ON public.user_sourcebook_entitlements (sourcebook_id);

CREATE INDEX IF NOT EXISTS idx_vtt_audio_settings_created_by
  ON public.vtt_audio_settings (created_by);

CREATE INDEX IF NOT EXISTS idx_vtt_audio_tracks_created_by
  ON public.vtt_audio_tracks (created_by);

CREATE INDEX IF NOT EXISTS idx_vtt_audio_tracks_session_id
  ON public.vtt_audio_tracks (session_id);

CREATE INDEX IF NOT EXISTS idx_vtt_chat_messages_campaign_id
  ON public.vtt_chat_messages (campaign_id);

CREATE INDEX IF NOT EXISTS idx_vtt_chat_messages_user_id
  ON public.vtt_chat_messages (user_id);

CREATE INDEX IF NOT EXISTS idx_vtt_map_elements_created_by
  ON public.vtt_map_elements (created_by);

CREATE INDEX IF NOT EXISTS idx_vtt_map_elements_session_id
  ON public.vtt_map_elements (session_id);

CREATE INDEX IF NOT EXISTS idx_vtt_settings_created_by
  ON public.vtt_settings (created_by);

CREATE INDEX IF NOT EXISTS idx_vtt_tokens_created_by
  ON public.vtt_tokens (created_by);

CREATE INDEX IF NOT EXISTS idx_vtt_tokens_owned_by_user_id
  ON public.vtt_tokens (owned_by_user_id);

CREATE INDEX IF NOT EXISTS idx_vtt_tokens_session_id
  ON public.vtt_tokens (session_id);


------------------------------------------------------------------------
-- PART 2: Drop unused indexes on NON-FK filter/sort columns
-- These have zero recorded scans in pg_stat_user_indexes and do not
-- cover any foreign-key column, so they only cost write overhead.
-- They can be trivially re-created if future query patterns need them.
------------------------------------------------------------------------

DROP INDEX IF EXISTS public.idx_vtt_chat_messages_whisper;
DROP INDEX IF EXISTS public.idx_compendium_rules_category;
DROP INDEX IF EXISTS public.idx_compendium_skills_ability;
DROP INDEX IF EXISTS public.idx_character_powers_display_order;
DROP INDEX IF EXISTS public.idx_shadow_soldiers_rank;
DROP INDEX IF EXISTS public.idx_shadow_soldiers_type;
DROP INDEX IF EXISTS public.idx_shadow_soldiers_name;
DROP INDEX IF EXISTS public.idx_shadow_soldiers_search;
DROP INDEX IF EXISTS public.idx_character_templates_public;
DROP INDEX IF EXISTS public.idx_character_templates_share_code;
DROP INDEX IF EXISTS public.idx_character_shadow_army_active;
DROP INDEX IF EXISTS public.profiles_role_idx;
DROP INDEX IF EXISTS public.idx_characters_share_token;
DROP INDEX IF EXISTS public.idx_daily_quest_instances_character_date;
DROP INDEX IF EXISTS public.idx_daily_quest_instances_status;
DROP INDEX IF EXISTS public.idx_daily_quest_instances_expires_at;
DROP INDEX IF EXISTS public.idx_daily_quest_templates_tier;
DROP INDEX IF EXISTS public.idx_daily_quest_templates_category;
DROP INDEX IF EXISTS public.idx_daily_quest_templates_active;
DROP INDEX IF EXISTS public.idx_ai_generated_content_entity;
DROP INDEX IF EXISTS public.idx_ai_generated_content_type;
DROP INDEX IF EXISTS public.idx_art_assets_entity;
DROP INDEX IF EXISTS public.idx_art_assets_variant;
DROP INDEX IF EXISTS public.idx_art_assets_hash;
DROP INDEX IF EXISTS public.idx_art_assets_created_at;
DROP INDEX IF EXISTS public.idx_ai_usage_logs_service;
DROP INDEX IF EXISTS public.idx_ai_usage_logs_created;
DROP INDEX IF EXISTS public.user_tool_states_tool_key_idx;
DROP INDEX IF EXISTS public.campaign_tool_states_tool_key_idx;
DROP INDEX IF EXISTS public.campaigns_share_code_idx;


------------------------------------------------------------------------
-- PART 3: Retain unused FK-covering indexes (NO ACTION)
-- The following indexes are flagged as unused but cover foreign-key
-- columns. Postgres needs them for efficient CASCADE/SET NULL checks
-- when rows are deleted from the parent table. They show zero scans
-- because no parent-side DELETE/UPDATE has triggered an FK check yet.
-- Keeping them prevents future sequential scans on child tables.
--
-- Retained (do NOT drop):
--   idx_characters_user_id
--   idx_character_abilities_character_id
--   idx_character_features_character_id
--   idx_character_equipment_character_id
--   idx_character_powers_character_id
--   idx_character_spell_slots_character_id
--   idx_character_sheet_state_character_id
--   idx_quest_rewards_log_quest_id
--   idx_quest_rewards_log_user_id
--   idx_combat_participants_character_id
--   idx_combat_participants_user_id
--   idx_compendium_job_features_path_id
--   idx_compendium_paths_created_by
--   idx_compendium_shadow_soldier_abilities_shadow_soldier_id
--   idx_compendium_shadow_soldier_actions_shadow_soldier_id
--   idx_compendium_shadow_soldier_traits_shadow_soldier_id
--   idx_compendium_sovereigns_monarch_a_id
--   idx_compendium_sovereigns_monarch_b_id
--   idx_compendium_sovereigns_path_id
--   idx_daily_quest_configs_campaign_id
--   idx_daily_quest_configs_character_id
--   idx_user_favorites_user_id
--   idx_user_favorites_entry
--   campaign_messages_campaign_id_idx
--   campaign_messages_user_id_idx
--   campaign_notes_campaign_id_idx
--   campaign_notes_user_id_idx
--   campaign_character_shares_campaign_id_idx
--   campaign_character_shares_character_id_idx
--   campaigns_dm_id_idx
--   campaign_members_campaign_id_idx
--   campaign_members_user_id_idx
--   idx_character_templates_user
--   idx_character_shadow_army_character
--   user_tool_states_user_id_idx
--   campaign_tool_states_campaign_id_idx
--   compendium_notes_user_id_idx
--   compendium_notes_entry_idx
--   vtt_journal_entries_campaign_idx
--   vtt_journal_entries_user_idx
--   audio_tracks_user_id_idx
--   audio_playlists_user_id_idx
--   character_backups_user_id_idx
--   character_backups_character_id_idx
--   idx_ai_usage_logs_user
------------------------------------------------------------------------

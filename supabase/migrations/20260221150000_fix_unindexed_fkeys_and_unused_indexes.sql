-- Fix unindexed_foreign_keys (add covering indexes) and unused_index (drop unused).
-- The hardening migration's DO block failed silently; these are plain statements.

BEGIN;

-- ============================================================
-- PART 1: Create missing foreign key covering indexes
-- ============================================================

-- active_sessions
CREATE INDEX IF NOT EXISTS idx_active_sessions_created_by ON public.active_sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_active_sessions_current_turn_player_id ON public.active_sessions(current_turn_player_id);

-- campaign_combat_sessions
CREATE INDEX IF NOT EXISTS idx_campaign_combat_sessions_created_by ON public.campaign_combat_sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_combat_sessions_encounter_id ON public.campaign_combat_sessions(encounter_id);

-- campaign_combatants
CREATE INDEX IF NOT EXISTS idx_campaign_combatants_campaign_id ON public.campaign_combatants(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_combatants_member_id ON public.campaign_combatants(member_id);

-- campaign_content
CREATE INDEX IF NOT EXISTS idx_campaign_content_campaign_id ON public.campaign_content(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_content_created_by ON public.campaign_content(created_by);

-- campaign_encounter_entries
CREATE INDEX IF NOT EXISTS idx_campaign_encounter_entries_monster_id ON public.campaign_encounter_entries(monster_id);

-- campaign_encounters
CREATE INDEX IF NOT EXISTS idx_campaign_encounters_created_by ON public.campaign_encounters(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_encounters_updated_by ON public.campaign_encounters(updated_by);

-- campaign_invite_audit_logs
CREATE INDEX IF NOT EXISTS idx_campaign_invite_audit_logs_actor_id ON public.campaign_invite_audit_logs(actor_id);

-- campaign_invites
CREATE INDEX IF NOT EXISTS idx_campaign_invites_created_by ON public.campaign_invites(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_invites_revoked_by ON public.campaign_invites(revoked_by);

-- campaign_loot_drops
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_assigned_to_member_id ON public.campaign_loot_drops(assigned_to_member_id);
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_created_by ON public.campaign_loot_drops(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_encounter_id ON public.campaign_loot_drops(encounter_id);
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_session_id ON public.campaign_loot_drops(session_id);

-- campaign_member_characters
CREATE INDEX IF NOT EXISTS idx_campaign_member_characters_character_id ON public.campaign_member_characters(character_id);
CREATE INDEX IF NOT EXISTS idx_campaign_member_characters_created_by ON public.campaign_member_characters(created_by);

-- campaign_members
CREATE INDEX IF NOT EXISTS idx_campaign_members_character_id ON public.campaign_members(character_id);

-- campaign_relic_instances
CREATE INDEX IF NOT EXISTS idx_campaign_relic_instances_bound_to_member_id ON public.campaign_relic_instances(bound_to_member_id);
CREATE INDEX IF NOT EXISTS idx_campaign_relic_instances_created_by ON public.campaign_relic_instances(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_relic_instances_relic_id ON public.campaign_relic_instances(relic_id);

-- campaign_roll_events
CREATE INDEX IF NOT EXISTS idx_campaign_roll_events_character_id ON public.campaign_roll_events(character_id);

-- campaign_rule_events
CREATE INDEX IF NOT EXISTS idx_campaign_rule_events_created_by ON public.campaign_rule_events(created_by);

-- campaign_rules
CREATE INDEX IF NOT EXISTS idx_campaign_rules_created_by ON public.campaign_rules(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_rules_updated_by ON public.campaign_rules(updated_by);

-- campaign_session_logs
CREATE INDEX IF NOT EXISTS idx_campaign_session_logs_author_id ON public.campaign_session_logs(author_id);

-- campaign_sessions
CREATE INDEX IF NOT EXISTS idx_campaign_sessions_created_by ON public.campaign_sessions(created_by);

-- campaign_sourcebook_shares
CREATE INDEX IF NOT EXISTS idx_campaign_sourcebook_shares_shared_by ON public.campaign_sourcebook_shares(shared_by);
CREATE INDEX IF NOT EXISTS idx_campaign_sourcebook_shares_sourcebook_id ON public.campaign_sourcebook_shares(sourcebook_id);

-- campaign_tool_states
CREATE INDEX IF NOT EXISTS idx_campaign_tool_states_created_by ON public.campaign_tool_states(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_tool_states_updated_by ON public.campaign_tool_states(updated_by);

-- character_feature_choices
CREATE INDEX IF NOT EXISTS idx_character_feature_choices_feature_id ON public.character_feature_choices(feature_id);
CREATE INDEX IF NOT EXISTS idx_character_feature_choices_group_id ON public.character_feature_choices(group_id);
CREATE INDEX IF NOT EXISTS idx_character_feature_choices_option_id ON public.character_feature_choices(option_id);

-- character_journal
CREATE INDEX IF NOT EXISTS idx_character_journal_character_id ON public.character_journal(character_id);

-- character_monarch_unlocks
CREATE INDEX IF NOT EXISTS idx_character_monarch_unlocks_monarch_id ON public.character_monarch_unlocks(monarch_id);

-- character_rune_inscriptions
CREATE INDEX IF NOT EXISTS idx_character_rune_inscriptions_character_id ON public.character_rune_inscriptions(character_id);
CREATE INDEX IF NOT EXISTS idx_character_rune_inscriptions_equipment_id ON public.character_rune_inscriptions(equipment_id);
CREATE INDEX IF NOT EXISTS idx_character_rune_inscriptions_rune_id ON public.character_rune_inscriptions(rune_id);

-- character_rune_knowledge
CREATE INDEX IF NOT EXISTS idx_character_rune_knowledge_learned_from_character_id ON public.character_rune_knowledge(learned_from_character_id);
CREATE INDEX IF NOT EXISTS idx_character_rune_knowledge_rune_id ON public.character_rune_knowledge(rune_id);

-- character_shadow_army
CREATE INDEX IF NOT EXISTS idx_character_shadow_army_shadow_soldier_id ON public.character_shadow_army(shadow_soldier_id);

-- character_shadow_soldiers
CREATE INDEX IF NOT EXISTS idx_character_shadow_soldiers_soldier_id ON public.character_shadow_soldiers(soldier_id);

-- character_shares
CREATE INDEX IF NOT EXISTS idx_character_shares_created_by ON public.character_shares(created_by);

-- characters
CREATE INDEX IF NOT EXISTS idx_characters_active_sovereign_id ON public.characters(active_sovereign_id);
CREATE INDEX IF NOT EXISTS idx_characters_sovereign_id ON public.characters(sovereign_id);

-- combat_participants
CREATE INDEX IF NOT EXISTS idx_combat_participants_character_id ON public.combat_participants(character_id);
CREATE INDEX IF NOT EXISTS idx_combat_participants_user_id ON public.combat_participants(user_id);

-- compendium_job_features
CREATE INDEX IF NOT EXISTS idx_compendium_job_features_path_id ON public.compendium_job_features(path_id);

-- compendium_paths
CREATE INDEX IF NOT EXISTS idx_compendium_paths_created_by ON public.compendium_paths(created_by);

-- compendium_shadow_soldier_*
CREATE INDEX IF NOT EXISTS idx_compendium_shadow_soldier_abilities_shadow_soldier_id ON public.compendium_shadow_soldier_abilities(shadow_soldier_id);
CREATE INDEX IF NOT EXISTS idx_compendium_shadow_soldier_actions_shadow_soldier_id ON public.compendium_shadow_soldier_actions(shadow_soldier_id);
CREATE INDEX IF NOT EXISTS idx_compendium_shadow_soldier_traits_shadow_soldier_id ON public.compendium_shadow_soldier_traits(shadow_soldier_id);

-- compendium_sovereigns
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_monarch_a_id ON public.compendium_sovereigns(monarch_a_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_monarch_b_id ON public.compendium_sovereigns(monarch_b_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_path_id ON public.compendium_sovereigns(path_id);

-- daily_quest_configs
CREATE INDEX IF NOT EXISTS idx_daily_quest_configs_campaign_id ON public.daily_quest_configs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_daily_quest_configs_character_id ON public.daily_quest_configs(character_id);

-- ============================================================
-- PART 2: Drop unused indexes
-- Indexes reported as never used by the query planner.
-- Using DROP INDEX IF EXISTS for safety.
-- ============================================================

-- characters
DROP INDEX IF EXISTS public.idx_characters_name;

-- user_profiles
DROP INDEX IF EXISTS public.idx_user_profiles_role;
DROP INDEX IF EXISTS public.idx_user_profiles_email;

-- campaign_invites
DROP INDEX IF EXISTS public.campaign_invites_campaign_idx;
DROP INDEX IF EXISTS public.campaign_invites_token_idx;
DROP INDEX IF EXISTS public.campaign_invites_lifecycle_idx;

-- campaign_rule_events
DROP INDEX IF EXISTS public.campaign_rule_events_campaign_idx;

-- campaign_encounters
DROP INDEX IF EXISTS public.campaign_encounters_campaign_idx;

-- campaign_encounter_entries
DROP INDEX IF EXISTS public.campaign_encounter_entries_encounter_idx;
DROP INDEX IF EXISTS public.campaign_encounter_entries_campaign_idx;

-- campaign_combat_sessions
DROP INDEX IF EXISTS public.campaign_combat_sessions_campaign_idx;

-- campaign_combatants
DROP INDEX IF EXISTS public.campaign_combatants_session_idx;

-- campaign_loot_drops
DROP INDEX IF EXISTS public.campaign_loot_drops_campaign_idx;

-- campaign_relic_instances
DROP INDEX IF EXISTS public.campaign_relic_instances_campaign_idx;

-- campaign_invite_audit_logs
DROP INDEX IF EXISTS public.campaign_invite_audit_logs_campaign_idx;
DROP INDEX IF EXISTS public.campaign_invite_audit_logs_invite_idx;

-- campaign_member_characters
DROP INDEX IF EXISTS public.campaign_member_characters_campaign_member_idx;
DROP INDEX IF EXISTS public.campaign_member_characters_campaign_idx;

-- sourcebook_catalog
DROP INDEX IF EXISTS public.sourcebook_catalog_is_free_idx;

-- user_sourcebook_entitlements
DROP INDEX IF EXISTS public.user_sourcebook_entitlements_user_idx;
DROP INDEX IF EXISTS public.user_sourcebook_entitlements_sourcebook_idx;

-- campaign_sourcebook_shares
DROP INDEX IF EXISTS public.campaign_sourcebook_shares_campaign_idx;

-- homebrew_content
DROP INDEX IF EXISTS public.homebrew_content_user_idx;
DROP INDEX IF EXISTS public.homebrew_content_status_visibility_idx;
DROP INDEX IF EXISTS public.homebrew_content_campaign_idx;

-- homebrew_content_versions
DROP INDEX IF EXISTS public.homebrew_content_versions_homebrew_idx;

-- marketplace_items
DROP INDEX IF EXISTS public.marketplace_items_author_idx;
DROP INDEX IF EXISTS public.marketplace_items_listed_idx;

-- marketplace_reviews
DROP INDEX IF EXISTS public.marketplace_reviews_item_idx;

-- marketplace_downloads
DROP INDEX IF EXISTS public.marketplace_downloads_user_idx;

-- user_marketplace_entitlements
DROP INDEX IF EXISTS public.user_marketplace_entitlements_user_idx;

-- campaign_sessions
DROP INDEX IF EXISTS public.campaign_sessions_campaign_idx;

-- campaign_session_logs
DROP INDEX IF EXISTS public.campaign_session_logs_campaign_idx;
DROP INDEX IF EXISTS public.campaign_session_logs_session_idx;

-- campaign_roll_events
DROP INDEX IF EXISTS public.campaign_roll_events_campaign_idx;

-- vtt_fog_state
DROP INDEX IF EXISTS public.idx_vtt_fog_state_campaign_session;

-- compendium_feature_choice_groups
DROP INDEX IF EXISTS public.compendium_feature_choice_groups_feature_idx;

-- compendium_feature_choice_options
DROP INDEX IF EXISTS public.compendium_feature_choice_options_group_idx;

-- character_feature_choices
DROP INDEX IF EXISTS public.character_feature_choices_character_idx;

-- active_sessions
DROP INDEX IF EXISTS public.idx_active_sessions_campaign_id;
DROP INDEX IF EXISTS public.idx_active_sessions_status;

-- session_participants
DROP INDEX IF EXISTS public.idx_session_participants_session_id;
DROP INDEX IF EXISTS public.idx_session_participants_user_id;

-- combat_participants
DROP INDEX IF EXISTS public.idx_combat_participants_session_id;
DROP INDEX IF EXISTS public.idx_combat_participants_turn_order;

-- combat_actions
DROP INDEX IF EXISTS public.idx_combat_actions_session_id;
DROP INDEX IF EXISTS public.idx_combat_actions_participant_id;

-- session_quests
DROP INDEX IF EXISTS public.idx_session_quests_session_id;
DROP INDEX IF EXISTS public.idx_session_quests_status;

-- quest_completions
DROP INDEX IF EXISTS public.idx_quest_completions_quest_id;
DROP INDEX IF EXISTS public.idx_quest_completions_user_id;

-- vtt_settings
DROP INDEX IF EXISTS public.idx_vtt_settings_session_id;

-- vtt_tokens
DROP INDEX IF EXISTS public.idx_vtt_tokens_session_id;
DROP INDEX IF EXISTS public.idx_vtt_tokens_token_type;

-- vtt_map_elements
DROP INDEX IF EXISTS public.idx_vtt_map_elements_session_id;
DROP INDEX IF EXISTS public.idx_vtt_map_elements_type;

-- vtt_audio_tracks
DROP INDEX IF EXISTS public.idx_vtt_audio_tracks_session_id;
DROP INDEX IF EXISTS public.idx_vtt_audio_tracks_type;

-- vtt_audio_settings
DROP INDEX IF EXISTS public.idx_vtt_audio_settings_session_id;

-- vtt_chat_messages
DROP INDEX IF EXISTS public.idx_vtt_chat_messages_campaign;
DROP INDEX IF EXISTS public.idx_vtt_chat_messages_session;
DROP INDEX IF EXISTS public.idx_vtt_chat_messages_created;

-- compendium_regent_features
DROP INDEX IF EXISTS public.compendium_regent_features_monarch_id_idx;

COMMIT;

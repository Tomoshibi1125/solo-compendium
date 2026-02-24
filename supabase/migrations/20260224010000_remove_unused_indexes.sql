-- Remove unused indexes to improve database performance
-- These indexes have been identified as never being used and can be safely removed

-- Character-related unused indexes
DROP INDEX IF EXISTS idx_character_features_character_id;
DROP INDEX IF EXISTS idx_character_equipment_character_id;
DROP INDEX IF EXISTS idx_character_feature_choices_feature_id;
DROP INDEX IF EXISTS idx_character_feature_choices_group_id;
DROP INDEX IF EXISTS idx_character_feature_choices_option_id;
DROP INDEX IF EXISTS idx_character_monarch_unlocks_monarch_id;
DROP INDEX IF EXISTS idx_character_rune_inscriptions_rune_id;
DROP INDEX IF EXISTS idx_character_rune_knowledge_rune_id;
DROP INDEX IF EXISTS idx_character_shadow_army_shadow_soldier_id;
DROP INDEX IF EXISTS idx_character_shadow_soldiers_soldier_id;
DROP INDEX IF EXISTS idx_character_shares_created_by;
DROP INDEX IF EXISTS idx_characters_active_sovereign_id;
DROP INDEX IF EXISTS idx_characters_sovereign_id;

-- Quest-related unused indexes
DROP INDEX IF EXISTS idx_quest_rewards_log_quest_id;
DROP INDEX IF EXISTS idx_quest_rewards_log_user_id;

-- Compendium-related unused indexes
DROP INDEX IF EXISTS idx_compendium_monster_traits_monster_id;
DROP INDEX IF EXISTS idx_compendium_monster_actions_monster_id;
DROP INDEX IF EXISTS idx_monarch_features_monarch;
DROP INDEX IF EXISTS idx_sovereign_features_sovereign;
DROP INDEX IF EXISTS idx_compendium_job_features_path_id;
DROP INDEX IF EXISTS idx_compendium_paths_created_by;
DROP INDEX IF EXISTS idx_compendium_shadow_soldier_abilities_shadow_soldier_id;
DROP INDEX IF EXISTS idx_compendium_shadow_soldier_actions_shadow_soldier_id;
DROP INDEX IF EXISTS idx_compendium_shadow_soldier_traits_shadow_soldier_id;
DROP INDEX IF EXISTS idx_compendium_sovereigns_monarch_a_id;
DROP INDEX IF EXISTS idx_compendium_sovereigns_monarch_b_id;
DROP INDEX IF EXISTS idx_compendium_sovereigns_path_id;
DROP INDEX IF EXISTS idx_compendium_sovereigns_job_id;

-- Campaign-related unused indexes
DROP INDEX IF EXISTS idx_active_sessions_created_by;
DROP INDEX IF EXISTS idx_active_sessions_current_turn_player_id;
DROP INDEX IF EXISTS idx_campaign_combat_sessions_created_by;
DROP INDEX IF EXISTS idx_campaign_combat_sessions_encounter_id;
DROP INDEX IF EXISTS idx_campaign_combatants_campaign_id;
DROP INDEX IF EXISTS idx_campaign_combatants_member_id;
DROP INDEX IF EXISTS idx_campaign_content_campaign_id;
DROP INDEX IF EXISTS idx_campaign_content_created_by;
DROP INDEX IF EXISTS idx_campaign_encounter_entries_monster_id;
DROP INDEX IF EXISTS idx_campaign_encounters_created_by;
DROP INDEX IF EXISTS idx_campaign_encounters_updated_by;
DROP INDEX IF EXISTS idx_campaign_invite_audit_logs_actor_id;
DROP INDEX IF EXISTS idx_campaign_invites_created_by;
DROP INDEX IF EXISTS idx_campaign_invites_revoked_by;
DROP INDEX IF EXISTS idx_campaign_loot_drops_assigned_to_member_id;
DROP INDEX IF EXISTS idx_campaign_loot_drops_created_by;
DROP INDEX IF EXISTS idx_campaign_loot_drops_encounter_id;
DROP INDEX IF EXISTS idx_campaign_loot_drops_session_id;
DROP INDEX IF EXISTS idx_campaign_member_characters_created_by;
DROP INDEX IF EXISTS idx_campaign_relic_instances_bound_to_member_id;
DROP INDEX IF EXISTS idx_campaign_relic_instances_created_by;
DROP INDEX IF EXISTS idx_campaign_relic_instances_relic_id;
DROP INDEX IF EXISTS idx_campaign_rule_events_created_by;
DROP INDEX IF EXISTS idx_campaign_rules_created_by;
DROP INDEX IF EXISTS idx_campaign_rules_updated_by;
DROP INDEX IF EXISTS idx_campaign_session_logs_author_id;
DROP INDEX IF EXISTS idx_campaign_sessions_created_by;
DROP INDEX IF EXISTS idx_campaign_sourcebook_shares_shared_by;
DROP INDEX IF EXISTS idx_campaign_sourcebook_shares_sourcebook_id;
DROP INDEX IF EXISTS idx_campaign_tool_states_created_by;
DROP INDEX IF EXISTS idx_campaign_tool_states_updated_by;

-- Additional campaign-related indexes (from truncated list)
DROP INDEX IF EXISTS campaign_messages_campaign_id_idx;
DROP INDEX IF EXISTS campaign_messages_user_id_idx;
DROP INDEX IF EXISTS campaign_notes_campaign_id_idx;
DROP INDEX IF EXISTS campaign_notes_user_id_idx;
DROP INDEX IF EXISTS campaign_character_shares_campaign_id_idx;

-- User and other unused indexes
DROP INDEX IF EXISTS idx_user_favorites_user_id;
DROP INDEX IF EXISTS idx_combat_participants_user_id;
DROP INDEX IF EXISTS idx_daily_quest_configs_campaign_id;

-- VTT-related unused indexes
DROP INDEX IF EXISTS idx_vtt_map_elements_created_by;
DROP INDEX IF EXISTS idx_vtt_map_elements_session_id;
DROP INDEX IF EXISTS idx_vtt_settings_created_by;
DROP INDEX IF EXISTS idx_vtt_tokens_created_by;
DROP INDEX IF EXISTS idx_vtt_tokens_owned_by_user_id;
DROP INDEX IF EXISTS idx_vtt_tokens_session_id;
DROP INDEX IF EXISTS idx_vtt_chat_messages_whisper_to;

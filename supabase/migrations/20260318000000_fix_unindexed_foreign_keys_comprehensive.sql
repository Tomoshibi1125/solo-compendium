-- Migration: Comprehensive Fix for Unindexed Foreign Keys
-- This migration ensures all foreign keys identified by the database linter have covering indexes.
-- Using CREATE INDEX IF NOT EXISTS to avoid errors if some already exist.

-- Table: public.active_sessions
CREATE INDEX IF NOT EXISTS idx_active_sessions_campaign_id ON public.active_sessions (campaign_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_created_by ON public.active_sessions (created_by);
CREATE INDEX IF NOT EXISTS idx_active_sessions_current_turn_player_id ON public.active_sessions (current_turn_player_id);

-- Table: public.ai_usage_logs
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON public.ai_usage_logs (user_id);

-- Table: public.audio_playlists
CREATE INDEX IF NOT EXISTS idx_audio_playlists_user_id ON public.audio_playlists (user_id);

-- Table: public.audio_tracks
CREATE INDEX IF NOT EXISTS idx_audio_tracks_user_id ON public.audio_tracks (user_id);

-- Table: public.campaign_character_shares
CREATE INDEX IF NOT EXISTS idx_campaign_character_shares_character_id ON public.campaign_character_shares (character_id);

-- Table: public.campaign_combat_sessions
CREATE INDEX IF NOT EXISTS idx_campaign_combat_sessions_campaign_id ON public.campaign_combat_sessions (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_combat_sessions_created_by ON public.campaign_combat_sessions (created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_combat_sessions_encounter_id ON public.campaign_combat_sessions (encounter_id);

-- Table: public.campaign_combatants
CREATE INDEX IF NOT EXISTS idx_campaign_combatants_campaign_id ON public.campaign_combatants (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_combatants_member_id ON public.campaign_combatants (member_id);
CREATE INDEX IF NOT EXISTS idx_campaign_combatants_session_id ON public.campaign_combatants (session_id);

-- Table: public.campaign_content
CREATE INDEX IF NOT EXISTS idx_campaign_content_campaign_id ON public.campaign_content (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_content_created_by ON public.campaign_content (created_by);

-- Table: public.campaign_encounter_entries
CREATE INDEX IF NOT EXISTS idx_campaign_encounter_entries_campaign_id ON public.campaign_encounter_entries (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_encounter_entries_encounter_id ON public.campaign_encounter_entries (encounter_id);
CREATE INDEX IF NOT EXISTS idx_campaign_encounter_entries_monster_id ON public.campaign_encounter_entries (monster_id);

-- Table: public.campaign_encounters
CREATE INDEX IF NOT EXISTS idx_campaign_encounters_campaign_id ON public.campaign_encounters (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_encounters_created_by ON public.campaign_encounters (created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_encounters_updated_by ON public.campaign_encounters (updated_by);

-- Table: public.campaign_extras
CREATE INDEX IF NOT EXISTS idx_campaign_extras_campaign_id ON public.campaign_extras (campaign_id);

-- Table: public.campaign_inventory
CREATE INDEX IF NOT EXISTS idx_campaign_inventory_campaign_id ON public.campaign_inventory (campaign_id);

-- Table: public.campaign_invite_audit_logs
CREATE INDEX IF NOT EXISTS idx_campaign_invite_audit_logs_actor_id ON public.campaign_invite_audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_campaign_invite_audit_logs_campaign_id ON public.campaign_invite_audit_logs (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_invite_audit_logs_invite_id ON public.campaign_invite_audit_logs (invite_id);

-- Table: public.campaign_invites
CREATE INDEX IF NOT EXISTS idx_campaign_invites_campaign_id ON public.campaign_invites (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_invites_created_by ON public.campaign_invites (created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_invites_revoked_by ON public.campaign_invites (revoked_by);

-- Table: public.campaign_loot_drops
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_assigned_to_member_id ON public.campaign_loot_drops (assigned_to_member_id);
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_campaign_id ON public.campaign_loot_drops (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_created_by ON public.campaign_loot_drops (created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_encounter_id ON public.campaign_loot_drops (encounter_id);
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_session_id ON public.campaign_loot_drops (session_id);

-- Table: public.campaign_member_characters
CREATE INDEX IF NOT EXISTS idx_campaign_member_characters_character_id ON public.campaign_member_characters (character_id);
CREATE INDEX IF NOT EXISTS idx_campaign_member_characters_created_by ON public.campaign_member_characters (created_by);

-- Table: public.campaign_members
CREATE INDEX IF NOT EXISTS idx_campaign_members_character_id ON public.campaign_members (character_id);

-- Table: public.campaign_messages
CREATE INDEX IF NOT EXISTS idx_campaign_messages_campaign_id ON public.campaign_messages (campaign_id);

-- Table: public.campaign_notes
CREATE INDEX IF NOT EXISTS idx_campaign_notes_campaign_id ON public.campaign_notes (campaign_id);

-- Table: public.campaign_relic_instances
CREATE INDEX IF NOT EXISTS idx_campaign_relic_instances_bound_to_member_id ON public.campaign_relic_instances (bound_to_member_id);
CREATE INDEX IF NOT EXISTS idx_campaign_relic_instances_campaign_id ON public.campaign_relic_instances (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_relic_instances_created_by ON public.campaign_relic_instances (created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_relic_instances_relic_id ON public.campaign_relic_instances (relic_id);

-- Table: public.campaign_roll_events
CREATE INDEX IF NOT EXISTS idx_campaign_roll_events_campaign_id ON public.campaign_roll_events (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_roll_events_character_id ON public.campaign_roll_events (character_id);

-- Table: public.campaign_rule_events
CREATE INDEX IF NOT EXISTS idx_campaign_rule_events_campaign_id ON public.campaign_rule_events (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_rule_events_created_by ON public.campaign_rule_events (created_by);

-- Table: public.campaign_rules
CREATE INDEX IF NOT EXISTS idx_campaign_rules_created_by ON public.campaign_rules (created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_rules_updated_by ON public.campaign_rules (updated_by);

-- Table: public.campaign_session_logs
CREATE INDEX IF NOT EXISTS idx_campaign_session_logs_author_id ON public.campaign_session_logs (author_id);
CREATE INDEX IF NOT EXISTS idx_campaign_session_logs_campaign_id ON public.campaign_session_logs (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_session_logs_session_id ON public.campaign_session_logs (session_id);

-- Table: public.campaign_sessions
CREATE INDEX IF NOT EXISTS idx_campaign_sessions_campaign_id ON public.campaign_sessions (campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sessions_created_by ON public.campaign_sessions (created_by);

-- Table: public.campaign_sourcebook_shares
CREATE INDEX IF NOT EXISTS idx_campaign_sourcebook_shares_shared_by ON public.campaign_sourcebook_shares (shared_by);
CREATE INDEX IF NOT EXISTS idx_campaign_sourcebook_shares_sourcebook_id ON public.campaign_sourcebook_shares (sourcebook_id);

-- Table: public.campaign_tool_states
CREATE INDEX IF NOT EXISTS idx_campaign_tool_states_created_by ON public.campaign_tool_states (created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_tool_states_updated_by ON public.campaign_tool_states (updated_by);

-- Table: public.campaign_wiki_articles
CREATE INDEX IF NOT EXISTS idx_campaign_wiki_articles_campaign_id ON public.campaign_wiki_articles (campaign_id);

-- Table: public.character_active_spells
CREATE INDEX IF NOT EXISTS idx_character_active_spells_character_id ON public.character_active_spells (character_id);

-- Table: public.character_backups
CREATE INDEX IF NOT EXISTS idx_character_backups_character_id ON public.character_backups (character_id);
CREATE INDEX IF NOT EXISTS idx_character_backups_user_id ON public.character_backups (user_id);

-- Table: public.character_equipment
CREATE INDEX IF NOT EXISTS idx_character_equipment_character_id ON public.character_equipment (character_id);

-- Table: public.character_extras
CREATE INDEX IF NOT EXISTS idx_character_extras_character_id ON public.character_extras (character_id);

-- Table: public.character_feature_choices
CREATE INDEX IF NOT EXISTS idx_character_feature_choices_feature_id ON public.character_feature_choices (feature_id);
CREATE INDEX IF NOT EXISTS idx_character_feature_choices_group_id ON public.character_feature_choices (group_id);
CREATE INDEX IF NOT EXISTS idx_character_feature_choices_option_id ON public.character_feature_choices (option_id);

-- Table: public.character_features
CREATE INDEX IF NOT EXISTS idx_character_features_character_id ON public.character_features (character_id);

-- Table: public.character_journal
CREATE INDEX IF NOT EXISTS idx_character_journal_character_id ON public.character_journal (character_id);

-- Table: public.character_monarch_unlocks
CREATE INDEX IF NOT EXISTS idx_character_monarch_unlocks_monarch_id ON public.character_monarch_unlocks (monarch_id);

-- Table: public.character_powers
CREATE INDEX IF NOT EXISTS idx_character_powers_character_id ON public.character_powers (character_id);

-- Table: public.character_regents
CREATE INDEX IF NOT EXISTS idx_character_regents_character_id ON public.character_regents (character_id);

-- Table: public.character_rune_inscriptions
CREATE INDEX IF NOT EXISTS idx_character_rune_inscriptions_character_id ON public.character_rune_inscriptions (character_id);
CREATE INDEX IF NOT EXISTS idx_character_rune_inscriptions_equipment_id ON public.character_rune_inscriptions (equipment_id);
CREATE INDEX IF NOT EXISTS idx_character_rune_inscriptions_rune_id ON public.character_rune_inscriptions (rune_id);

-- Table: public.character_rune_knowledge
CREATE INDEX IF NOT EXISTS idx_character_rune_knowledge_learned_from_character_id ON public.character_rune_knowledge (learned_from_character_id);
CREATE INDEX IF NOT EXISTS idx_character_rune_knowledge_rune_id ON public.character_rune_knowledge (rune_id);

-- Table: public.character_shadow_army
CREATE INDEX IF NOT EXISTS idx_character_shadow_army_shadow_soldier_id ON public.character_shadow_army (shadow_soldier_id);

-- Table: public.character_shadow_soldiers
CREATE INDEX IF NOT EXISTS idx_character_shadow_soldiers_soldier_id ON public.character_shadow_soldiers (soldier_id);

-- Table: public.character_shares
CREATE INDEX IF NOT EXISTS idx_character_shares_character_id ON public.character_shares (character_id);
CREATE INDEX IF NOT EXISTS idx_character_shares_created_by ON public.character_shares (created_by);

-- Table: public.character_techniques
CREATE INDEX IF NOT EXISTS idx_character_techniques_technique_id ON public.character_techniques (technique_id);

-- Table: public.character_templates
CREATE INDEX IF NOT EXISTS idx_character_templates_user_id ON public.character_templates (user_id);

-- Table: public.characters
CREATE INDEX IF NOT EXISTS idx_characters_active_sovereign_id ON public.characters (active_sovereign_id);
CREATE INDEX IF NOT EXISTS idx_characters_sovereign_id ON public.characters (sovereign_id);
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON public.characters (user_id);

-- Table: public.combat_actions
CREATE INDEX IF NOT EXISTS idx_combat_actions_participant_id ON public.combat_actions (participant_id);
CREATE INDEX IF NOT EXISTS idx_combat_actions_session_id ON public.combat_actions (session_id);

-- Table: public.combat_participants
CREATE INDEX IF NOT EXISTS idx_combat_participants_character_id ON public.combat_participants (character_id);
CREATE INDEX IF NOT EXISTS idx_combat_participants_session_id ON public.combat_participants (session_id);
CREATE INDEX IF NOT EXISTS idx_combat_participants_user_id ON public.combat_participants (user_id);

-- Table: public.compendium_job_features
CREATE INDEX IF NOT EXISTS idx_compendium_job_features_job_id ON public.compendium_job_features (job_id);
CREATE INDEX IF NOT EXISTS idx_compendium_job_features_path_id ON public.compendium_job_features (path_id);

-- Table: public.compendium_monster_actions
CREATE INDEX IF NOT EXISTS idx_compendium_monster_actions_monster_id ON public.compendium_monster_actions (monster_id);

-- Table: public.compendium_monster_traits
CREATE INDEX IF NOT EXISTS idx_compendium_monster_traits_monster_id ON public.compendium_monster_traits (monster_id);

-- Table: public.compendium_notes
CREATE INDEX IF NOT EXISTS idx_compendium_notes_user_id ON public.compendium_notes (user_id);

-- Table: public.compendium_paths
CREATE INDEX IF NOT EXISTS idx_compendium_paths_created_by ON public.compendium_paths (created_by);

-- Table: public.compendium_shadow_soldier_abilities
CREATE INDEX IF NOT EXISTS idx_compendium_shadow_soldier_abilities_shadow_soldier_id ON public.compendium_shadow_soldier_abilities (shadow_soldier_id);

-- Table: public.compendium_shadow_soldier_actions
CREATE INDEX IF NOT EXISTS idx_compendium_shadow_soldier_actions_shadow_soldier_id ON public.compendium_shadow_soldier_actions (shadow_soldier_id);

-- Table: public.compendium_shadow_soldier_traits
CREATE INDEX IF NOT EXISTS idx_compendium_shadow_soldier_traits_shadow_soldier_id ON public.compendium_shadow_soldier_traits (shadow_soldier_id);

-- Table: public.compendium_sovereigns
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_job_id ON public.compendium_sovereigns (job_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_monarch_a_id ON public.compendium_sovereigns (monarch_a_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_monarch_b_id ON public.compendium_sovereigns (monarch_b_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_path_id ON public.compendium_sovereigns (path_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_regent_a_id ON public.compendium_sovereigns (regent_a_id);
CREATE INDEX IF NOT EXISTS idx_compendium_sovereigns_regent_b_id ON public.compendium_sovereigns (regent_b_id);

-- Table: public.daily_quest_configs
CREATE INDEX IF NOT EXISTS idx_daily_quest_configs_campaign_id ON public.daily_quest_configs (campaign_id);
CREATE INDEX IF NOT EXISTS idx_daily_quest_configs_character_id ON public.daily_quest_configs (character_id);

-- Table: public.daily_quest_instances
CREATE INDEX IF NOT EXISTS idx_daily_quest_instances_template_id ON public.daily_quest_instances (template_id);

-- Table: public.entity_assets
CREATE INDEX IF NOT EXISTS idx_entity_assets_asset_id ON public.entity_assets (asset_id);

-- Table: public.homebrew_content
CREATE INDEX IF NOT EXISTS idx_homebrew_content_campaign_id ON public.homebrew_content (campaign_id);
CREATE INDEX IF NOT EXISTS idx_homebrew_content_updated_by ON public.homebrew_content (updated_by);
CREATE INDEX IF NOT EXISTS idx_homebrew_content_user_id ON public.homebrew_content (user_id);

-- Table: public.homebrew_content_versions
CREATE INDEX IF NOT EXISTS idx_homebrew_content_versions_created_by ON public.homebrew_content_versions (created_by);

-- Table: public.marketplace_downloads
CREATE INDEX IF NOT EXISTS idx_marketplace_downloads_user_id ON public.marketplace_downloads (user_id);

-- Table: public.marketplace_items
CREATE INDEX IF NOT EXISTS idx_marketplace_items_author_id ON public.marketplace_items (author_id);

-- Table: public.marketplace_reviews
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_user_id ON public.marketplace_reviews (user_id);

-- Table: public.quest_completions
CREATE INDEX IF NOT EXISTS idx_quest_completions_character_id ON public.quest_completions (character_id);
CREATE INDEX IF NOT EXISTS idx_quest_completions_user_id ON public.quest_completions (user_id);

-- Table: public.quest_rewards_log
CREATE INDEX IF NOT EXISTS idx_quest_rewards_log_character_id ON public.quest_rewards_log (character_id);
CREATE INDEX IF NOT EXISTS idx_quest_rewards_log_quest_id ON public.quest_rewards_log (quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_rewards_log_user_id ON public.quest_rewards_log (user_id);

-- Table: public.roll_history
CREATE INDEX IF NOT EXISTS idx_roll_history_campaign_id ON public.roll_history (campaign_id);
CREATE INDEX IF NOT EXISTS idx_roll_history_character_id ON public.roll_history (character_id);

-- Table: public.saved_sovereigns
CREATE INDEX IF NOT EXISTS idx_saved_sovereigns_job_id ON public.saved_sovereigns (job_id);
CREATE INDEX IF NOT EXISTS idx_saved_sovereigns_monarch_a_id ON public.saved_sovereigns (monarch_a_id);
CREATE INDEX IF NOT EXISTS idx_saved_sovereigns_monarch_b_id ON public.saved_sovereigns (monarch_b_id);
CREATE INDEX IF NOT EXISTS idx_saved_sovereigns_path_id ON public.saved_sovereigns (path_id);

-- Table: public.session_participants
CREATE INDEX IF NOT EXISTS idx_session_participants_character_id ON public.session_participants (character_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_user_id ON public.session_participants (user_id);

-- Table: public.session_quests
CREATE INDEX IF NOT EXISTS idx_session_quests_created_by ON public.session_quests (created_by);
CREATE INDEX IF NOT EXISTS idx_session_quests_session_id ON public.session_quests (session_id);

-- Table: public.user_marketplace_entitlements
CREATE INDEX IF NOT EXISTS idx_user_marketplace_entitlements_granted_by ON public.user_marketplace_entitlements (granted_by);
CREATE INDEX IF NOT EXISTS idx_user_marketplace_entitlements_item_id ON public.user_marketplace_entitlements (item_id);

-- Table: public.user_sourcebook_entitlements
CREATE INDEX IF NOT EXISTS idx_user_sourcebook_entitlements_granted_by ON public.user_sourcebook_entitlements (granted_by);
CREATE INDEX IF NOT EXISTS idx_user_sourcebook_entitlements_sourcebook_id ON public.user_sourcebook_entitlements (sourcebook_id);

-- Table: public.vtt_audio_settings
CREATE INDEX IF NOT EXISTS idx_vtt_audio_settings_created_by ON public.vtt_audio_settings (created_by);

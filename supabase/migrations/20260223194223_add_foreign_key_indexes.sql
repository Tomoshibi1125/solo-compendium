-- Add missing indexes for foreign key constraints to improve query performance
-- This migration addresses all unindexed_foreign_keys warnings by creating covering indexes

-- ============================================================
-- 1. active_sessions foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_active_sessions_created_by 
ON public.active_sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_active_sessions_current_turn_player_id 
ON public.active_sessions(current_turn_player_id);

-- ============================================================
-- 2. campaign_combat_sessions foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_combat_sessions_created_by 
ON public.campaign_combat_sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_combat_sessions_encounter_id 
ON public.campaign_combat_sessions(encounter_id);

-- ============================================================
-- 3. campaign_combatants foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_combatants_campaign_id 
ON public.campaign_combatants(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_combatants_member_id 
ON public.campaign_combatants(member_id);

-- ============================================================
-- 4. campaign_content foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_content_campaign_id 
ON public.campaign_content(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_content_created_by 
ON public.campaign_content(created_by);

-- ============================================================
-- 5. campaign_encounter_entries foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_encounter_entries_monster_id 
ON public.campaign_encounter_entries(monster_id);

-- ============================================================
-- 6. campaign_encounters foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_encounters_created_by 
ON public.campaign_encounters(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_encounters_updated_by 
ON public.campaign_encounters(updated_by);

-- ============================================================
-- 7. campaign_invite_audit_logs foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_invite_audit_logs_actor_id 
ON public.campaign_invite_audit_logs(actor_id);

-- ============================================================
-- 8. campaign_invites foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_invites_created_by 
ON public.campaign_invites(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_invites_revoked_by 
ON public.campaign_invites(revoked_by);

-- ============================================================
-- 9. campaign_loot_drops foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_assigned_to_member_id 
ON public.campaign_loot_drops(assigned_to_member_id);
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_created_by 
ON public.campaign_loot_drops(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_encounter_id 
ON public.campaign_loot_drops(encounter_id);
CREATE INDEX IF NOT EXISTS idx_campaign_loot_drops_session_id 
ON public.campaign_loot_drops(session_id);

-- ============================================================
-- 10. campaign_member_characters foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_member_characters_created_by 
ON public.campaign_member_characters(created_by);

-- ============================================================
-- 11. campaign_messages foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_messages_campaign_id 
ON public.campaign_messages(campaign_id);

-- ============================================================
-- 12. campaign_notes foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_notes_campaign_id 
ON public.campaign_notes(campaign_id);

-- ============================================================
-- 13. campaign_relic_instances foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_relic_instances_bound_to_member_id 
ON public.campaign_relic_instances(bound_to_member_id);
CREATE INDEX IF NOT EXISTS idx_campaign_relic_instances_created_by 
ON public.campaign_relic_instances(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_relic_instances_relic_id 
ON public.campaign_relic_instances(relic_id);

-- ============================================================
-- 14. campaign_rule_events foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_rule_events_created_by 
ON public.campaign_rule_events(created_by);

-- ============================================================
-- 15. campaign_rules foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_rules_created_by 
ON public.campaign_rules(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_rules_updated_by 
ON public.campaign_rules(updated_by);

-- ============================================================
-- 16. campaign_session_logs foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_session_logs_author_id 
ON public.campaign_session_logs(author_id);

-- ============================================================
-- 17. campaign_sessions foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_sessions_created_by 
ON public.campaign_sessions(created_by);

-- ============================================================
-- 18. campaign_sourcebook_shares foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_sourcebook_shares_shared_by 
ON public.campaign_sourcebook_shares(shared_by);
CREATE INDEX IF NOT EXISTS idx_campaign_sourcebook_shares_sourcebook_id 
ON public.campaign_sourcebook_shares(sourcebook_id);

-- ============================================================
-- 19. campaign_tool_states foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaign_tool_states_created_by 
ON public.campaign_tool_states(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_tool_states_updated_by 
ON public.campaign_tool_states(updated_by);

-- ============================================================
-- 20. character_feature_choices foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_character_feature_choices_feature_id 
ON public.character_feature_choices(feature_id);
CREATE INDEX IF NOT EXISTS idx_character_feature_choices_group_id 
ON public.character_feature_choices(group_id);
CREATE INDEX IF NOT EXISTS idx_character_feature_choices_option_id 
ON public.character_feature_choices(option_id);

-- ============================================================
-- 21. character_monarch_unlocks foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_character_monarch_unlocks_monarch_id 
ON public.character_monarch_unlocks(monarch_id);

-- ============================================================
-- 22. character_rune_inscriptions foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_character_rune_inscriptions_rune_id 
ON public.character_rune_inscriptions(rune_id);

-- ============================================================
-- 23. character_rune_knowledge foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_character_rune_knowledge_rune_id 
ON public.character_rune_knowledge(rune_id);

-- ============================================================
-- 24. character_shadow_army foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_character_shadow_army_shadow_soldier_id 
ON public.character_shadow_army(shadow_soldier_id);

-- ============================================================
-- 25. character_shadow_soldiers foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_character_shadow_soldiers_soldier_id 
ON public.character_shadow_soldiers(soldier_id);

-- ============================================================
-- 26. character_shares foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_character_shares_created_by 
ON public.character_shares(created_by);

-- ============================================================
-- 27. characters foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_characters_active_sovereign_id 
ON public.characters(active_sovereign_id);
CREATE INDEX IF NOT EXISTS idx_characters_sovereign_id 
ON public.characters(sovereign_id);

-- ============================================================
-- 28. combat_participants foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_combat_participants_user_id 
ON public.combat_participants(user_id);

-- ============================================================
-- 29. compendium_job_features foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_compendium_job_features_path_id 
ON public.compendium_job_features(path_id);

-- ============================================================
-- 30. compendium_monster_actions foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_compendium_monster_actions_monster_id 
ON public.compendium_monster_actions(monster_id);

-- ============================================================
-- 31. compendium_monster_traits foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_compendium_monster_traits_monster_id 
ON public.compendium_monster_traits(monster_id);

-- ============================================================
-- 32. compendium_paths foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_compendium_paths_created_by 
ON public.compendium_paths(created_by);

-- ============================================================
-- 33. compendium_shadow_soldier_abilities foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_compendium_shadow_soldier_abilities_shadow_soldier_id 
ON public.compendium_shadow_soldier_abilities(shadow_soldier_id);

-- ============================================================
-- 34. compendium_shadow_soldier_actions foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_compendium_shadow_soldier_actions_shadow_soldier_id 
ON public.compendium_shadow_soldier_actions(shadow_soldier_id);

-- ============================================================
-- 35. compendium_shadow_soldier_traits foreign key indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_compendium_shadow_soldier_traits_shadow_soldier_id 
ON public.compendium_shadow_soldier_traits(shadow_soldier_id);

-- ============================================================
-- 36. Additional foreign key indexes (from truncated list)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_daily_quest_configs_campaign_id 
ON public.daily_quest_configs(campaign_id);

CREATE INDEX IF NOT EXISTS idx_quest_rewards_log_quest_id 
ON public.quest_rewards_log(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_rewards_log_user_id 
ON public.quest_rewards_log(user_id);

CREATE INDEX IF NOT EXISTS idx_vtt_chat_messages_whisper_to 
ON public.vtt_chat_messages(whisper_to);

CREATE INDEX IF NOT EXISTS idx_vtt_map_elements_created_by 
ON public.vtt_map_elements(created_by);
CREATE INDEX IF NOT EXISTS idx_vtt_map_elements_session_id 
ON public.vtt_map_elements(session_id);

CREATE INDEX IF NOT EXISTS idx_vtt_settings_created_by 
ON public.vtt_settings(created_by);

CREATE INDEX IF NOT EXISTS idx_vtt_tokens_created_by 
ON public.vtt_tokens(created_by);
CREATE INDEX IF NOT EXISTS idx_vtt_tokens_owned_by_user_id 
ON public.vtt_tokens(owned_by_user_id);
CREATE INDEX IF NOT EXISTS idx_vtt_tokens_session_id 
ON public.vtt_tokens(session_id);

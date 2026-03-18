-- Migration: Comprehensive Database Index Cleanup (Phase 2)
-- This migration removes redundant or unused indexes identified by the database linter.
-- It targets prefix redundancies, duplicate audit indexes, and low-performing junction indexes.

DO $$
BEGIN
    --------------------------------------------------------------------------------
    -- 1. Prefix Redundancies (Covered by UNIQUE constraints or multi-column indexes)
    --------------------------------------------------------------------------------
    
    -- campaign_members (campaign_id) is prefix of UNIQUE(campaign_id, user_id)
    DROP INDEX IF EXISTS public.campaign_members_campaign_id_idx;
    DROP INDEX IF EXISTS public.idx_campaign_members_campaign_id;
    
    -- compendium_feature_choice_groups (feature_id) is prefix of UNIQUE(feature_id, choice_key)
    DROP INDEX IF EXISTS public.compendium_feature_choice_groups_feature_idx;
    DROP INDEX IF EXISTS public.idx_compendium_feature_choice_groups_feature_id;

    -- compendium_feature_choice_options (group_id) is prefix of UNIQUE(group_id, option_key)
    DROP INDEX IF EXISTS public.compendium_feature_choice_options_group_idx;
    DROP INDEX IF EXISTS public.idx_compendium_feature_choice_options_group_id;

    -- character_feature_choices (character_id) is prefix of UNIQUE(character_id, group_id)
    -- Also has idx_character_feature_choices_character_id and character_feature_choices_character_idx
    DROP INDEX IF EXISTS public.character_feature_choices_character_idx;
    DROP INDEX IF EXISTS public.idx_character_feature_choices_character_id;
    DROP INDEX IF EXISTS public.idx_character_feature_choices_group_id; -- Also redundant with UNIQUE

    -- campaign_messages (campaign_id) is prefix of campaign_messages_campaign_id_idx (campaign_id, created_at DESC)
    DROP INDEX IF EXISTS public.idx_campaign_messages_campaign_id;

    -- campaign_notes (campaign_id) is prefix of campaign_notes_campaign_id_idx (campaign_id, created_at DESC)
    DROP INDEX IF EXISTS public.idx_campaign_notes_campaign_id;

    -- campaign_rule_events (campaign_id) is prefix of campaign_rule_events_campaign_idx (campaign_id, created_at DESC)
    DROP INDEX IF EXISTS public.idx_campaign_rule_events_campaign_id;

    -- campaign_encounters (campaign_id) is prefix of campaign_encounters_campaign_idx (campaign_id, created_at DESC)
    DROP INDEX IF EXISTS public.idx_campaign_encounters_campaign_id;

    -- campaign_combat_sessions (campaign_id) is prefix of campaign_combat_sessions_campaign_idx (campaign_id, created_at DESC)
    DROP INDEX IF EXISTS public.idx_campaign_combat_sessions_campaign_id;

    -- campaign_loot_drops (campaign_id) is prefix of campaign_loot_drops_campaign_idx (campaign_id, created_at DESC)
    DROP INDEX IF EXISTS public.idx_campaign_loot_drops_campaign_id;

    -- campaign_relic_instances (campaign_id) is prefix of campaign_relic_instances_campaign_idx (campaign_id, created_at DESC)
    DROP INDEX IF EXISTS public.idx_campaign_relic_instances_campaign_id;

    --------------------------------------------------------------------------------
    -- 2. Redundant Audit/Metadata Indexes (Flagged with 0 usage)
    --------------------------------------------------------------------------------
    
    DROP INDEX IF EXISTS public.idx_campaign_combat_sessions_created_by;
    DROP INDEX IF EXISTS public.idx_campaign_encounters_created_by;
    DROP INDEX IF EXISTS public.idx_campaign_encounters_updated_by;
    DROP INDEX IF EXISTS public.idx_campaign_invite_audit_logs_actor_id;
    DROP INDEX IF EXISTS public.idx_campaign_loot_drops_created_by;
    DROP INDEX IF EXISTS public.idx_campaign_member_characters_created_by;
    DROP INDEX IF EXISTS public.idx_campaign_relic_instances_created_by;
    DROP INDEX IF EXISTS public.idx_campaign_rule_events_created_by;
    DROP INDEX IF EXISTS public.idx_campaign_rules_created_by;
    DROP INDEX IF EXISTS public.idx_campaign_rules_updated_by;
    DROP INDEX IF EXISTS public.idx_campaign_sourcebook_shares_shared_by;
    DROP INDEX IF EXISTS public.idx_homebrew_content_updated_by;
    DROP INDEX IF EXISTS public.idx_homebrew_content_user_id;
    DROP INDEX IF EXISTS public.idx_user_marketplace_entitlements_granted_by;
    DROP INDEX IF EXISTS public.idx_user_sourcebook_entitlements_granted_by;
    DROP INDEX IF EXISTS public.idx_campaign_invites_created_by;
    DROP INDEX IF EXISTS public.idx_campaign_invites_revoked_by;
    DROP INDEX IF EXISTS public.idx_campaign_invite_audit_logs_actor_id;

    --------------------------------------------------------------------------------
    -- 3. Junction and Low-Perceived Benefit Indexes
    --------------------------------------------------------------------------------
    
    DROP INDEX IF EXISTS public.idx_campaign_combatants_campaign_id; -- Combatants joined usually via session_id
    DROP INDEX IF EXISTS public.idx_campaign_content_created_by;
    DROP INDEX IF EXISTS public.idx_campaign_encounter_entries_campaign_id;
    DROP INDEX IF EXISTS public.idx_campaign_inventory_campaign_id;
    DROP INDEX IF EXISTS public.idx_daily_quest_configs_campaign_id;
    DROP INDEX IF EXISTS public.idx_campaign_content_campaign_id;
    DROP INDEX IF EXISTS public.idx_campaign_extras_campaign_id;
    DROP INDEX IF EXISTS public.idx_campaign_invite_audit_logs_campaign_id;
    
    -- Marketplace/Review small table indexes
    DROP INDEX IF EXISTS public.idx_marketplace_downloads_user_id;
    DROP INDEX IF EXISTS public.idx_marketplace_reviews_user_id;
    
    -- VTT Specific Cleanup
    DROP INDEX IF EXISTS public.idx_vtt_audio_settings_created_by;
    DROP INDEX IF EXISTS public.idx_combat_participants_user_id; -- Usually filtered by character_id or session_id

END $$;

-- Refresh database statistics
ANALYZE;

CREATE INDEX idx_active_sessions_created_by ON public.active_sessions USING btree (created_by);

CREATE INDEX idx_active_sessions_current_turn_player_id ON public.active_sessions USING btree (current_turn_player_id);

CREATE INDEX idx_ai_usage_logs_user_id ON public.ai_usage_logs USING btree (user_id);

CREATE INDEX idx_audio_playlists_user_id ON public.audio_playlists USING btree (user_id);

CREATE INDEX idx_audio_tracks_user_id ON public.audio_tracks USING btree (user_id);

CREATE INDEX idx_campaign_combat_sessions_campaign_id ON public.campaign_combat_sessions USING btree (campaign_id);

CREATE INDEX idx_campaign_combat_sessions_created_by ON public.campaign_combat_sessions USING btree (created_by);

CREATE INDEX idx_campaign_combatants_campaign_id ON public.campaign_combatants USING btree (campaign_id);

CREATE INDEX idx_campaign_combatants_session_id ON public.campaign_combatants USING btree (session_id);

CREATE INDEX idx_campaign_content_campaign_id ON public.campaign_content USING btree (campaign_id);

CREATE INDEX idx_campaign_content_created_by ON public.campaign_content USING btree (created_by);

CREATE INDEX idx_campaign_encounter_entries_campaign_id ON public.campaign_encounter_entries USING btree (campaign_id);

CREATE INDEX idx_campaign_encounter_entries_encounter_id ON public.campaign_encounter_entries USING btree (encounter_id);

CREATE INDEX idx_campaign_encounters_campaign_id ON public.campaign_encounters USING btree (campaign_id);

CREATE INDEX idx_campaign_encounters_created_by ON public.campaign_encounters USING btree (created_by);

CREATE INDEX idx_campaign_encounters_updated_by ON public.campaign_encounters USING btree (updated_by);

CREATE INDEX idx_campaign_extras_campaign_id ON public.campaign_extras USING btree (campaign_id);

CREATE INDEX idx_campaign_inventory_campaign_id ON public.campaign_inventory USING btree (campaign_id);

CREATE INDEX idx_campaign_invite_audit_logs_actor_id ON public.campaign_invite_audit_logs USING btree (actor_id);

CREATE INDEX idx_campaign_invite_audit_logs_campaign_id ON public.campaign_invite_audit_logs USING btree (campaign_id);

CREATE INDEX idx_campaign_invites_campaign_id ON public.campaign_invites USING btree (campaign_id);

CREATE INDEX idx_campaign_invites_created_by ON public.campaign_invites USING btree (created_by);

CREATE INDEX idx_campaign_invites_revoked_by ON public.campaign_invites USING btree (revoked_by);

CREATE INDEX idx_campaign_loot_drops_campaign_id ON public.campaign_loot_drops USING btree (campaign_id);

CREATE INDEX idx_campaign_loot_drops_created_by ON public.campaign_loot_drops USING btree (created_by);

CREATE INDEX idx_campaign_member_characters_created_by ON public.campaign_member_characters USING btree (created_by);

CREATE INDEX idx_campaign_messages_campaign_id ON public.campaign_messages USING btree (campaign_id);

CREATE INDEX idx_campaign_notes_campaign_id ON public.campaign_notes USING btree (campaign_id);

CREATE INDEX idx_campaign_relic_instances_campaign_id ON public.campaign_relic_instances USING btree (campaign_id);

CREATE INDEX idx_campaign_relic_instances_created_by ON public.campaign_relic_instances USING btree (created_by);

CREATE INDEX idx_campaign_rule_events_campaign_id ON public.campaign_rule_events USING btree (campaign_id);

CREATE INDEX idx_campaign_rule_events_created_by ON public.campaign_rule_events USING btree (created_by);

CREATE INDEX idx_campaign_rules_created_by ON public.campaign_rules USING btree (created_by);

CREATE INDEX idx_campaign_rules_updated_by ON public.campaign_rules USING btree (updated_by);

CREATE INDEX idx_campaign_sourcebook_shares_shared_by ON public.campaign_sourcebook_shares USING btree (shared_by);

CREATE INDEX idx_character_backups_user_id ON public.character_backups USING btree (user_id);

CREATE INDEX idx_character_feature_choices_group_id ON public.character_feature_choices USING btree (group_id);

CREATE INDEX idx_character_shares_character_id ON public.character_shares USING btree (character_id);

CREATE INDEX idx_combat_participants_user_id ON public.combat_participants USING btree (user_id);

CREATE INDEX idx_compendium_notes_user_id ON public.compendium_notes USING btree (user_id);

CREATE INDEX idx_daily_quest_configs_campaign_id ON public.daily_quest_configs USING btree (campaign_id);

CREATE INDEX idx_homebrew_content_updated_by ON public.homebrew_content USING btree (updated_by);

CREATE INDEX idx_homebrew_content_user_id ON public.homebrew_content USING btree (user_id);

CREATE INDEX idx_marketplace_downloads_user_id ON public.marketplace_downloads USING btree (user_id);

CREATE INDEX idx_marketplace_reviews_user_id ON public.marketplace_reviews USING btree (user_id);

CREATE INDEX idx_quest_completions_user_id ON public.quest_completions USING btree (user_id);

CREATE INDEX idx_session_participants_user_id ON public.session_participants USING btree (user_id);

CREATE INDEX idx_session_quests_created_by ON public.session_quests USING btree (created_by);

CREATE INDEX idx_user_marketplace_entitlements_granted_by ON public.user_marketplace_entitlements USING btree (granted_by);

CREATE INDEX idx_user_sourcebook_entitlements_granted_by ON public.user_sourcebook_entitlements USING btree (granted_by);

CREATE INDEX idx_vtt_audio_settings_created_by ON public.vtt_audio_settings USING btree (created_by);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_character_xp(character_id uuid, xp_amount integer, campaign_id uuid DEFAULT NULL::uuid, reason text DEFAULT 'XP Reward'::text)
 RETURNS TABLE(success boolean, new_xp_total integer, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    current_xp INTEGER;
    new_xp INTEGER;
    character_name TEXT;
BEGIN
    -- Get current character data and validate ownership
    SELECT 
        c.experience,
        c.name
    INTO 
        current_xp,
        character_name
    FROM characters c
    WHERE c.id = character_id;
    
    -- Check if character exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0, 'Character not found'::TEXT;
        RETURN;
    END IF;
    
    -- Validate XP amount (must be positive)
    IF xp_amount <= 0 THEN
        RETURN QUERY SELECT false, current_xp, 'XP amount must be positive'::TEXT;
        RETURN;
    END IF;
    
    -- Calculate new XP total
    new_xp := current_xp + xp_amount;
    
    -- Update character XP
    UPDATE characters 
    SET experience = new_xp,
        updated_at = NOW()
    WHERE id = character_id;
    
    -- Log the XP award if campaign is provided
    IF campaign_id IS NOT NULL THEN
        -- Standardize on 'log_type' column as defined in campaign_session_logs schema
        INSERT INTO campaign_session_logs (
            campaign_id,
            author_id,
            log_type,
            title,
            content,
            metadata,
            created_at
        ) VALUES (
            campaign_id,
            auth.uid(), -- Set author to current user
            'reward',
            'XP Award',
            format('%s gained %s XP', character_name, xp_amount),
            json_build_object(
                'character_id', character_id,
                'xp_amount', xp_amount,
                'previous_xp', current_xp,
                'new_xp', new_xp,
                'reason', reason
            ),
            NOW()
        );
    END IF;
    
    -- Return success result
    RETURN QUERY SELECT 
        true, 
        new_xp, 
        format('%s gained %s XP (Total: %s)', character_name, xp_amount, new_xp)::TEXT;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT 
            false, 
            COALESCE(current_xp, 0), 
            'Error: ' || SQLERRM::TEXT;
END;
$function$
;



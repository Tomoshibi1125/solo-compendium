-- Hardening policies and helpers

-- 1) Profiles role check + safer email constraint path
-- Ensure email column exists before enforcing constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Initplan + multiple-permissive policy hardening
DO $$
BEGIN
  -- character_abilities (initplan: wrap auth calls)
  DROP POLICY IF EXISTS "Users can create abilities for their own characters" ON public.character_abilities;
  CREATE POLICY "Users can create abilities for their own characters" ON public.character_abilities
    FOR INSERT WITH CHECK (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can delete abilities of their own characters" ON public.character_abilities;
  CREATE POLICY "Users can delete abilities of their own characters" ON public.character_abilities
    FOR DELETE USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can update abilities of their own characters" ON public.character_abilities;
  CREATE POLICY "Users can update abilities of their own characters" ON public.character_abilities
    FOR UPDATE USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can view abilities of their own characters" ON public.character_abilities;
  CREATE POLICY "Users can view abilities of their own characters" ON public.character_abilities
    FOR SELECT USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );

  -- character_equipment (initplan)
  DROP POLICY IF EXISTS "Users can create equipment for their own characters" ON public.character_equipment;
  CREATE POLICY "Users can create equipment for their own characters" ON public.character_equipment
    FOR INSERT WITH CHECK (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can delete equipment of their own characters" ON public.character_equipment;
  CREATE POLICY "Users can delete equipment of their own characters" ON public.character_equipment
    FOR DELETE USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can update equipment of their own characters" ON public.character_equipment;
  CREATE POLICY "Users can update equipment of their own characters" ON public.character_equipment
    FOR UPDATE USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can view equipment of their own characters" ON public.character_equipment;
  CREATE POLICY "Users can view equipment of their own characters" ON public.character_equipment
    FOR SELECT USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );

  -- character_powers (initplan)
  DROP POLICY IF EXISTS "Users can create powers for their own characters" ON public.character_powers;
  CREATE POLICY "Users can create powers for their own characters" ON public.character_powers
    FOR INSERT WITH CHECK (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can delete powers of their own characters" ON public.character_powers;
  CREATE POLICY "Users can delete powers of their own characters" ON public.character_powers
    FOR DELETE USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can update powers of their own characters" ON public.character_powers;
  CREATE POLICY "Users can update powers of their own characters" ON public.character_powers
    FOR UPDATE USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can view powers of their own characters" ON public.character_powers;
  CREATE POLICY "Users can view powers of their own characters" ON public.character_powers
    FOR SELECT USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );

  -- character_features (initplan)
  DROP POLICY IF EXISTS "Users can create features for their own characters" ON public.character_features;
  CREATE POLICY "Users can create features for their own characters" ON public.character_features
    FOR INSERT WITH CHECK (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can delete features of their own characters" ON public.character_features;
  CREATE POLICY "Users can delete features of their own characters" ON public.character_features
    FOR DELETE USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can update features of their own characters" ON public.character_features;
  CREATE POLICY "Users can update features of their own characters" ON public.character_features
    FOR UPDATE USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can view features of their own characters" ON public.character_features;
  CREATE POLICY "Users can view features of their own characters" ON public.character_features
    FOR SELECT USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );

  -- characters (initplan)
  DROP POLICY IF EXISTS "DMs can view all characters" ON public.characters;
  CREATE POLICY "DMs can view all characters" ON public.characters
    FOR SELECT USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role IN ('dm','admin')
      )
    );
  DROP POLICY IF EXISTS "Users can create their own characters" ON public.characters;
  CREATE POLICY "Users can create their own characters" ON public.characters
    FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));
  DROP POLICY IF EXISTS "Users can delete their own characters" ON public.characters;
  CREATE POLICY "Users can delete their own characters" ON public.characters
    FOR DELETE USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));
  DROP POLICY IF EXISTS "Users can manage own characters" ON public.characters;
  CREATE POLICY "Users can manage own characters" ON public.characters
    FOR ALL USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));
  DROP POLICY IF EXISTS "Users can update their own characters" ON public.characters;
  CREATE POLICY "Users can update their own characters" ON public.characters
    FOR UPDATE USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));
  DROP POLICY IF EXISTS "Users can view own characters" ON public.characters;
  CREATE POLICY "Users can view own characters" ON public.characters
    FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));
  DROP POLICY IF EXISTS "Users can view their own characters" ON public.characters;
  CREATE POLICY "Users can view their own characters" ON public.characters
    FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));

  -- compendium_jobs (initplan + multiple perms)
  DROP POLICY IF EXISTS "DMs can manage jobs" ON public.compendium_jobs;
  CREATE POLICY "DMs can manage jobs" ON public.compendium_jobs
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role IN ('dm','admin')
      )
    );
  DROP POLICY IF EXISTS "Compendium jobs public read" ON public.compendium_jobs;
  CREATE POLICY "Compendium jobs public read" ON public.compendium_jobs
    FOR SELECT USING (true);

  -- saved_sovereigns (initplan)
  DROP POLICY IF EXISTS "Anyone can view public sovereigns" ON public.saved_sovereigns;
  CREATE POLICY "Anyone can view public sovereigns" ON public.saved_sovereigns
    FOR SELECT USING (is_public = TRUE);
  DROP POLICY IF EXISTS "Users can create their own sovereigns" ON public.saved_sovereigns;
  CREATE POLICY "Users can create their own sovereigns" ON public.saved_sovereigns
    FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND created_by = (SELECT auth.uid()));
  DROP POLICY IF EXISTS "Users can delete their own sovereigns" ON public.saved_sovereigns;
  CREATE POLICY "Users can delete their own sovereigns" ON public.saved_sovereigns
    FOR DELETE USING ((SELECT auth.uid()) IS NOT NULL AND created_by = (SELECT auth.uid()));
  DROP POLICY IF EXISTS "Users can update their own sovereigns" ON public.saved_sovereigns;
  CREATE POLICY "Users can update their own sovereigns" ON public.saved_sovereigns
    FOR UPDATE USING ((SELECT auth.uid()) IS NOT NULL AND created_by = (SELECT auth.uid()));

  -- character_monarch_unlocks (initplan)
  DROP POLICY IF EXISTS "Users can create monarch unlocks for their own characters" ON public.character_monarch_unlocks;
  CREATE POLICY "Users can create monarch unlocks for their own characters" ON public.character_monarch_unlocks
    FOR INSERT WITH CHECK (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can delete their own monarch unlocks" ON public.character_monarch_unlocks;
  CREATE POLICY "Users can delete their own monarch unlocks" ON public.character_monarch_unlocks
    FOR DELETE USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can update their own monarch unlocks" ON public.character_monarch_unlocks;
  CREATE POLICY "Users can update their own monarch unlocks" ON public.character_monarch_unlocks
    FOR UPDATE USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can view their own monarch unlocks" ON public.character_monarch_unlocks;
  CREATE POLICY "Users can view their own monarch unlocks" ON public.character_monarch_unlocks
    FOR SELECT USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );

  -- user_favorites (initplan)
  DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorites;
  CREATE POLICY "Users can delete their own favorites" ON public.user_favorites
    FOR DELETE USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));
  DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.user_favorites;
  CREATE POLICY "Users can insert their own favorites" ON public.user_favorites
    FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));
  DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;
  CREATE POLICY "Users can view their own favorites" ON public.user_favorites
    FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));
  DROP POLICY IF EXISTS "user_favorites_all" ON public.user_favorites;
  CREATE POLICY "user_favorites_all" ON public.user_favorites
    FOR SELECT USING ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()));

  -- character_shadow_soldiers (initplan)
  DROP POLICY IF EXISTS "Users can release their own Umbral Legion" ON public.character_shadow_soldiers;
  CREATE POLICY "Users can release their own Umbral Legion" ON public.character_shadow_soldiers
    FOR DELETE USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );
  DROP POLICY IF EXISTS "Users can summon soldiers for their own characters" ON public.character_shadow_soldiers;
  CREATE POLICY "Users can summon soldiers for their own characters" ON public.character_shadow_soldiers
    FOR INSERT WITH CHECK (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );

  -- Consolidate public read-only compendium policies (multiple permissive)
  DROP POLICY IF EXISTS "Anyone can view equipment" ON public.compendium_equipment;
  DROP POLICY IF EXISTS "Compendium equipment is publicly readable" ON public.compendium_equipment;
  CREATE POLICY "Compendium equipment public read" ON public.compendium_equipment
    FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Anyone can view feats" ON public.compendium_feats;
  DROP POLICY IF EXISTS "Compendium feats are publicly readable" ON public.compendium_feats;
  CREATE POLICY "Compendium feats public read" ON public.compendium_feats
    FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Anyone can view job features" ON public.compendium_job_features;
  DROP POLICY IF EXISTS "Compendium job features are publicly readable" ON public.compendium_job_features;
  CREATE POLICY "Compendium job features public read" ON public.compendium_job_features
    FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Anyone can view job paths" ON public.compendium_job_paths;
  DROP POLICY IF EXISTS "Compendium job paths are publicly readable" ON public.compendium_job_paths;
  CREATE POLICY "Compendium job paths public read" ON public.compendium_job_paths
    FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Anyone can view monarchs" ON public.compendium_monarchs;
  DROP POLICY IF EXISTS "Compendium monarchs are publicly readable" ON public.compendium_monarchs;
  CREATE POLICY "Compendium monarchs public read" ON public.compendium_monarchs
    FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Anyone can view monsters" ON public.compendium_monsters;
  DROP POLICY IF EXISTS "Compendium monsters are publicly readable" ON public.compendium_monsters;
  CREATE POLICY "Compendium monsters public read" ON public.compendium_monsters
    FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Anyone can view paths" ON public.compendium_paths;
  CREATE POLICY "Compendium paths public read" ON public.compendium_paths
    FOR SELECT USING (true);
  DROP POLICY IF EXISTS "DMs can manage paths" ON public.compendium_paths;
  CREATE POLICY "DMs can manage paths" ON public.compendium_paths
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role IN ('dm','admin')
      )
    );
END $$;

-- Indexes for linted foreign keys (performance)
DO $$
BEGIN
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

  -- characters

  -- combat_participants
  CREATE INDEX IF NOT EXISTS idx_combat_participants_character_id ON public.combat_participants(character_id);
  CREATE INDEX IF NOT EXISTS idx_combat_participants_user_id ON public.combat_participants(user_id);

  -- compendium_job_features
  CREATE INDEX IF NOT EXISTS idx_compendium_job_features_path_id ON public.compendium_job_features(path_id);

  -- compendium_paths
  CREATE INDEX IF NOT EXISTS idx_compendium_paths_created_by ON public.compendium_paths(created_by);

  -- compendium_shadow_soldiers
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
END $$;

-- 9) Enable RLS + policies for regent/vtt fog tables (lint: rls_disabled_in_public, sensitive columns)
DO $$
BEGIN
  -- vtt_fog_state: DM + campaign members can read; DM can manage
  ALTER TABLE public.vtt_fog_state ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "View fog state for campaign" ON public.vtt_fog_state;
  CREATE POLICY "View fog state for campaign" ON public.vtt_fog_state
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = vtt_fog_state.campaign_id AND dm_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = vtt_fog_state.campaign_id AND user_id = auth.uid())
    );
  DROP POLICY IF EXISTS "DMs manage fog state" ON public.vtt_fog_state;
  CREATE POLICY "DMs manage fog state" ON public.vtt_fog_state
    FOR ALL USING (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = vtt_fog_state.campaign_id AND dm_id = auth.uid())
    );

  -- compendium_regents: public read, dm/admin manage
  ALTER TABLE public.compendium_regents ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Anyone can view regents" ON public.compendium_regents;
  CREATE POLICY "Anyone can view regents" ON public.compendium_regents
    FOR SELECT USING (true);
  DROP POLICY IF EXISTS "DMs can manage regents" ON public.compendium_regents;
  CREATE POLICY "DMs can manage regents" ON public.compendium_regents
    FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('dm','admin'))
    );

  -- compendium_regent_features: public read, dm/admin manage
  ALTER TABLE public.compendium_regent_features ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Anyone can view regent features" ON public.compendium_regent_features;
  CREATE POLICY "Anyone can view regent features" ON public.compendium_regent_features
    FOR SELECT USING (true);
  DROP POLICY IF EXISTS "DMs can manage regent features" ON public.compendium_regent_features;
  CREATE POLICY "DMs can manage regent features" ON public.compendium_regent_features
    FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('dm','admin'))
    );

  -- character_regent_unlocks: only character owner can read/manage
  ALTER TABLE public.character_regent_unlocks ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Owners can read regent unlocks" ON public.character_regent_unlocks;
  CREATE POLICY "Owners can read regent unlocks" ON public.character_regent_unlocks
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.uid()
      )
    );
  DROP POLICY IF EXISTS "Owners can manage regent unlocks" ON public.character_regent_unlocks;
  CREATE POLICY "Owners can manage regent unlocks" ON public.character_regent_unlocks
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.uid()
      )
    );
END $$;

-- 10) Views: enforce invoker security (remove security definer lint)
ALTER VIEW public.user_characters SET (security_invoker = true);
ALTER VIEW public.campaign_details SET (security_invoker = true);

-- 8) Harden function search_path (lint: function_search_path_mutable)
-- Recreate flagged functions with explicit SET search_path = pg_catalog, public, extensions
CREATE OR REPLACE FUNCTION public.update_character_sheet_state_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_proficiency_bonus(level INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN GREATEST(2, FLOOR((level - 1) / 4) + 2);
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_character_hp(
  level INTEGER,
  constitution_score INTEGER,
  hit_dice TEXT DEFAULT 'd8'
)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  con_mod INTEGER;
  base_hp INTEGER;
BEGIN
  con_mod := FLOOR((constitution_score - 10) / 2);
  base_hp := CASE 
    WHEN hit_dice = 'd6' THEN 6
    WHEN hit_dice = 'd8' THEN 8
    WHEN hit_dice = 'd10' THEN 10
    WHEN hit_dice = 'd12' THEN 12
    ELSE 8
  END;
  RETURN base_hp + con_mod + ((level - 1) * (FLOOR((base_hp + 1) / 2) + con_mod));
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_compendium_data()
RETURNS void
LANGUAGE plpgsql
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RAISE NOTICE 'Compendium data sync function created. Static data remains in TypeScript files.';
END;
$$;

-- Active session helpers
CREATE OR REPLACE FUNCTION public.start_active_session(
    p_campaign_id UUID,
    p_title TEXT,
    p_description TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_session_id UUID;
    v_user_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns WHERE id = p_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can start active sessions';
    END IF;
    INSERT INTO public.active_sessions (
        campaign_id, title, description, status, created_by
    ) VALUES (
        p_campaign_id, p_title, p_description, 'active', v_user_id
    ) RETURNING id INTO v_session_id;
    INSERT INTO public.session_participants (session_id, user_id, is_dm)
    VALUES (v_session_id, v_user_id, TRUE);
    RETURN v_session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.end_active_session(
    p_session_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can end active sessions';
    END IF;
    UPDATE public.active_sessions
    SET status = 'completed', updated_at = NOW()
    WHERE id = p_session_id;
END;
$$;

-- Combat functions
CREATE OR REPLACE FUNCTION public.start_session_combat(
    p_session_id UUID,
    p_participants JSONB
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_campaign_id UUID;
    v_user_id UUID;
    v_participant JSONB;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can start combat';
    END IF;
    UPDATE public.active_sessions SET combat_status = 'active', updated_at = NOW() WHERE id = p_session_id;
    DELETE FROM public.combat_participants WHERE session_id = p_session_id;
    FOR v_participant IN SELECT * FROM jsonb_array_elements(p_participants)
    LOOP
        INSERT INTO public.combat_participants (
            session_id, character_id, user_id, name, initiative, current_hp, max_hp, ac, is_player, turn_order
        ) VALUES (
            p_session_id,
            (v_participant->>'character_id')::UUID,
            (v_participant->>'user_id')::UUID,
            v_participant->>'name',
            (v_participant->>'initiative')::INTEGER,
            (v_participant->>'current_hp')::INTEGER,
            (v_participant->>'max_hp')::INTEGER,
            (v_participant->>'ac')::INTEGER,
            (v_participant->>'is_player')::BOOLEAN,
            (v_participant->>'initiative')::INTEGER
        );
    END LOOP;
    UPDATE public.combat_participants
    SET turn_order = sub.row_num
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY initiative DESC) as row_num
        FROM public.combat_participants
        WHERE session_id = p_session_id
    ) sub
    WHERE combat_participants.id = sub.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.advance_combat_turn(
    p_session_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_min_turn INTEGER;
    v_max_turn INTEGER;
BEGIN
    SELECT MIN(turn_order), MAX(turn_order) INTO v_min_turn, v_max_turn
    FROM public.combat_participants
    WHERE session_id = p_session_id;

    IF v_min_turn IS NULL THEN
        RAISE EXCEPTION 'No combat participants for session';
    END IF;

    -- Rotate turn order: the current actor is the lowest turn_order (1-based). Move it to the end.
    UPDATE public.combat_participants
    SET turn_order = CASE
      WHEN turn_order = v_min_turn THEN v_max_turn
      ELSE turn_order - 1
    END
    WHERE session_id = p_session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.end_session_combat(
    p_session_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_campaign_id UUID;
    v_user_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can end combat';
    END IF;
    UPDATE public.active_sessions
    SET combat_status = 'completed', updated_at = NOW()
    WHERE id = p_session_id;
END;
$$;

-- Session quest functions
CREATE OR REPLACE FUNCTION public.create_session_quest(
    p_session_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_rewards JSONB,
    p_objectives JSONB DEFAULT '[]'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
    v_quest_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can create session quests';
    END IF;
    INSERT INTO public.session_quests (session_id, title, description, rewards, objectives)
    VALUES (p_session_id, p_title, p_description, p_rewards, p_objectives)
    RETURNING id INTO v_quest_id;
    RETURN v_quest_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_session_quest(
    p_quest_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_session_id UUID;
    v_campaign_id UUID;
    v_user_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    SELECT sq.session_id INTO v_session_id
    FROM public.session_quests sq
    JOIN public.active_sessions s ON s.id = sq.session_id
    WHERE sq.id = p_quest_id;
    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = v_session_id;
    IF NOT EXISTS (
        SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Only DM can complete session quests';
    END IF;
    UPDATE public.session_quests
    SET status = 'completed', updated_at = NOW()
    WHERE id = p_quest_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_quest_rewards(
    p_quest_id UUID,
    p_character_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_quest_record RECORD;
    v_xp_reward INTEGER;
    v_gold_reward INTEGER;
    v_item_rewards TEXT[];
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM public.characters WHERE id = p_character_id AND user_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Character does not belong to user';
    END IF;
    SELECT * INTO v_quest_record
    FROM public.session_quests
    WHERE id = p_quest_id AND status = 'completed';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Quest not found or not completed';
    END IF;
    IF EXISTS (
        SELECT 1 FROM public.quest_completions WHERE quest_id = p_quest_id AND user_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Rewards already claimed';
    END IF;
    v_xp_reward := (v_quest_record.rewards->>'xp')::INTEGER;
    v_gold_reward := (v_quest_record.rewards->>'gold')::INTEGER;
    v_item_rewards := ARRAY(SELECT jsonb_array_elements_text(v_quest_record.rewards->'items'));
    IF v_xp_reward > 0 THEN
        UPDATE public.characters SET experience = experience + v_xp_reward WHERE id = p_character_id;
    END IF;
    INSERT INTO public.quest_completions (quest_id, user_id, character_id, rewards_claimed)
    VALUES (p_quest_id, v_user_id, p_character_id, TRUE);
END;
$$;

-- VTT functions
CREATE OR REPLACE FUNCTION public.update_vtt_settings(
    p_session_id UUID,
    p_grid_size INTEGER DEFAULT NULL,
    p_grid_visible BOOLEAN DEFAULT NULL,
    p_fog_of_war_enabled BOOLEAN DEFAULT NULL,
    p_dynamic_lighting_enabled BOOLEAN DEFAULT NULL,
    p_background_image_url TEXT DEFAULT NULL,
    p_background_color TEXT DEFAULT NULL,
    p_snap_to_grid BOOLEAN DEFAULT NULL,
    p_zoom_level DECIMAL(4,2) DEFAULT NULL,
    p_pan_x INTEGER DEFAULT NULL,
    p_pan_y INTEGER DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Session not found';
    END IF;

    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;

    INSERT INTO public.vtt_settings (
        session_id, created_by,
        grid_size, grid_visible, fog_of_war_enabled, dynamic_lighting_enabled,
        background_image_url, background_color, snap_to_grid, zoom_level, pan_x, pan_y
    ) VALUES (
        p_session_id, v_user_id,
        COALESCE(p_grid_size, 50),
        COALESCE(p_grid_visible, TRUE),
        COALESCE(p_fog_of_war_enabled, FALSE),
        COALESCE(p_dynamic_lighting_enabled, FALSE),
        p_background_image_url,
        COALESCE(p_background_color, '#ffffff'),
        COALESCE(p_snap_to_grid, TRUE),
        COALESCE(p_zoom_level, 1.00),
        COALESCE(p_pan_x, 0),
        COALESCE(p_pan_y, 0)
    ) ON CONFLICT (session_id) DO UPDATE SET
        grid_size = COALESCE(p_grid_size, vtt_settings.grid_size),
        grid_visible = COALESCE(p_grid_visible, vtt_settings.grid_visible),
        fog_of_war_enabled = COALESCE(p_fog_of_war_enabled, vtt_settings.fog_of_war_enabled),
        dynamic_lighting_enabled = COALESCE(p_dynamic_lighting_enabled, vtt_settings.dynamic_lighting_enabled),
        background_image_url = COALESCE(p_background_image_url, vtt_settings.background_image_url),
        background_color = COALESCE(p_background_color, vtt_settings.background_color),
        snap_to_grid = COALESCE(p_snap_to_grid, vtt_settings.snap_to_grid),
        zoom_level = COALESCE(p_zoom_level, vtt_settings.zoom_level),
        pan_x = COALESCE(p_pan_x, vtt_settings.pan_x),
        pan_y = COALESCE(p_pan_y, vtt_settings.pan_y),
        updated_at = NOW();
END;
$$;

CREATE OR REPLACE FUNCTION public.create_vtt_token(
    p_session_id UUID,
    p_token_type TEXT,
    p_name TEXT,
    p_x INTEGER DEFAULT 0,
    p_y INTEGER DEFAULT 0,
    p_size INTEGER DEFAULT 1,
    p_color TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL,
    p_stats JSONB DEFAULT NULL,
    p_visible_to_players BOOLEAN DEFAULT TRUE,
    p_owned_by_user_id UUID DEFAULT NULL,
    p_is_dm_token BOOLEAN DEFAULT FALSE
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_token_id UUID;
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Session not found';
    END IF;

    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;

    INSERT INTO public.vtt_tokens (
        session_id, token_type, name, x, y, size, color, image_url, stats, visible_to_players, owned_by_user_id, is_dm_token, created_by
    ) VALUES (
        p_session_id, p_token_type, p_name, p_x, p_y, p_size, p_color, p_image_url, p_stats, p_visible_to_players, p_owned_by_user_id, p_is_dm_token, v_user_id
    ) RETURNING id INTO v_token_id;
    RETURN v_token_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_vtt_token(
    p_token_id UUID,
    p_session_id UUID,
    p_x INTEGER DEFAULT NULL,
    p_y INTEGER DEFAULT NULL,
    p_size INTEGER DEFAULT NULL,
    p_color TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL,
    p_stats JSONB DEFAULT NULL,
    p_visible_to_players BOOLEAN DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT a.campaign_id INTO v_campaign_id
    FROM public.vtt_tokens t
    JOIN public.active_sessions a ON a.id = t.session_id
    WHERE t.id = p_token_id AND t.session_id = p_session_id;

    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Token not found or access denied';
    END IF;

    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;

    UPDATE public.vtt_tokens SET
        x = COALESCE(p_x, x),
        y = COALESCE(p_y, y),
        size = COALESCE(p_size, size),
        color = COALESCE(p_color, color),
        image_url = COALESCE(p_image_url, image_url),
        stats = COALESCE(p_stats, stats),
        visible_to_players = COALESCE(p_visible_to_players, visible_to_players),
        updated_at = NOW()
    WHERE id = p_token_id AND session_id = p_session_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Token not found or access denied';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_vtt_token(
    p_token_id UUID,
    p_session_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT a.campaign_id INTO v_campaign_id
    FROM public.vtt_tokens t
    JOIN public.active_sessions a ON a.id = t.session_id
    WHERE t.id = p_token_id AND t.session_id = p_session_id;

    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Token not found or access denied';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
      RAISE EXCEPTION 'Only DM can delete token';
    END IF;

    DELETE FROM public.vtt_tokens WHERE id = p_token_id AND session_id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Token not found';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_vtt_map_element(
    p_session_id UUID,
    p_element_type TEXT,
    p_x INTEGER,
    p_y INTEGER,
    p_color TEXT,
    p_width INTEGER DEFAULT NULL,
    p_height INTEGER DEFAULT NULL,
    p_stroke_width INTEGER DEFAULT 2,
    p_opacity DECIMAL(3,2) DEFAULT 1.00,
    p_data JSONB DEFAULT '{}',
    p_visible_to_players BOOLEAN DEFAULT TRUE
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_element_id UUID;
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Session not found';
    END IF;

    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;

    INSERT INTO public.vtt_map_elements (
        session_id, element_type, x, y, color, width, height, stroke_width, opacity, data, visible_to_players, created_by
    ) VALUES (
        p_session_id, p_element_type, p_x, p_y, p_color, p_width, p_height, p_stroke_width, p_opacity, p_data, p_visible_to_players, v_user_id
    ) RETURNING id INTO v_element_id;
    RETURN v_element_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_vtt_map_element(
    p_element_id UUID,
    p_session_id UUID,
    p_x INTEGER DEFAULT NULL,
    p_y INTEGER DEFAULT NULL,
    p_width INTEGER DEFAULT NULL,
    p_height INTEGER DEFAULT NULL,
    p_color TEXT DEFAULT NULL,
    p_stroke_width INTEGER DEFAULT NULL,
    p_opacity DECIMAL(3,2) DEFAULT NULL,
    p_data JSONB DEFAULT NULL,
    p_visible_to_players BOOLEAN DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT a.campaign_id INTO v_campaign_id
    FROM public.vtt_map_elements e
    JOIN public.active_sessions a ON a.id = e.session_id
    WHERE e.id = p_element_id AND e.session_id = p_session_id;

    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Map element not found or access denied';
    END IF;

    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;

    UPDATE public.vtt_map_elements SET
        x = COALESCE(p_x, x),
        y = COALESCE(p_y, y),
        width = COALESCE(p_width, width),
        height = COALESCE(p_height, height),
        color = COALESCE(p_color, color),
        stroke_width = COALESCE(p_stroke_width, stroke_width),
        opacity = COALESCE(p_opacity, opacity),
        data = COALESCE(p_data, data),
        visible_to_players = COALESCE(p_visible_to_players, visible_to_players),
        updated_at = NOW()
    WHERE id = p_element_id AND session_id = p_session_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Map element not found or access denied';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_vtt_map_element(
    p_element_id UUID,
    p_session_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT a.campaign_id INTO v_campaign_id
    FROM public.vtt_map_elements e
    JOIN public.active_sessions a ON a.id = e.session_id
    WHERE e.id = p_element_id AND e.session_id = p_session_id;

    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Map element not found or access denied';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
      RAISE EXCEPTION 'Only DM can delete map element';
    END IF;

    DELETE FROM public.vtt_map_elements WHERE id = p_element_id AND session_id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Map element not found';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_vtt_audio_track(
    p_session_id UUID,
    p_name TEXT,
    p_url TEXT,
    p_volume INTEGER DEFAULT 100,
    p_loop BOOLEAN DEFAULT FALSE,
    p_category TEXT DEFAULT 'music'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_track_id UUID;
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT campaign_id INTO v_campaign_id FROM public.active_sessions WHERE id = p_session_id;
    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Session not found';
    END IF;

    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;

    INSERT INTO public.vtt_audio_tracks (
        session_id, name, url, volume, loop, category, created_by
    ) VALUES (
        p_session_id, p_name, p_url, p_volume, p_loop, p_category, v_user_id
    ) RETURNING id INTO v_track_id;
    RETURN v_track_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_vtt_audio_track(
    p_track_id UUID,
    p_session_id UUID,
    p_volume INTEGER DEFAULT NULL,
    p_loop BOOLEAN DEFAULT NULL,
    p_category TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT a.campaign_id INTO v_campaign_id
    FROM public.vtt_audio_tracks t
    JOIN public.active_sessions a ON a.id = t.session_id
    WHERE t.id = p_track_id AND t.session_id = p_session_id;

    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Audio track not found or access denied';
    END IF;

    IF NOT (
      EXISTS (SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id) OR
      EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = v_campaign_id AND user_id = v_user_id)
    ) THEN
      RAISE EXCEPTION 'Access denied';
    END IF;

    UPDATE public.vtt_audio_tracks SET
        volume = COALESCE(p_volume, volume),
        loop = COALESCE(p_loop, loop),
        category = COALESCE(p_category, category),
        updated_at = NOW()
    WHERE id = p_track_id AND session_id = p_session_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Audio track not found or access denied';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_vtt_audio_track(
    p_track_id UUID,
    p_session_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
    v_campaign_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT a.campaign_id INTO v_campaign_id
    FROM public.vtt_audio_tracks t
    JOIN public.active_sessions a ON a.id = t.session_id
    WHERE t.id = p_track_id AND t.session_id = p_session_id;

    IF v_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Audio track not found or access denied';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM public.campaigns WHERE id = v_campaign_id AND dm_id = v_user_id
    ) THEN
      RAISE EXCEPTION 'Only DM can delete audio track';
    END IF;

    DELETE FROM public.vtt_audio_tracks WHERE id = p_track_id AND session_id = p_session_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Audio track not found';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_vtt_audio_settings(
    p_session_id UUID,
    p_master_volume INTEGER DEFAULT NULL,
    p_music_volume INTEGER DEFAULT NULL,
    p_effects_volume INTEGER DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT auth.uid() INTO v_user_id;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    INSERT INTO public.vtt_audio_settings (
        session_id, created_by,
        master_volume, music_volume, effects_volume
    ) VALUES (
        p_session_id, v_user_id,
        COALESCE(p_master_volume, 100),
        COALESCE(p_music_volume, 100),
        COALESCE(p_effects_volume, 100)
    ) ON CONFLICT (session_id) DO UPDATE SET
        master_volume = COALESCE(p_master_volume, vtt_audio_settings.master_volume),
        music_volume = COALESCE(p_music_volume, vtt_audio_settings.music_volume),
        effects_volume = COALESCE(p_effects_volume, vtt_audio_settings.effects_volume),
        updated_at = NOW();
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_role_check CHECK (role IN ('player','dm','admin')) NOT VALID;
    ALTER TABLE public.profiles VALIDATE CONSTRAINT profiles_role_check;
  END IF;
END $$;

-- Ensure profiles.email not-null/unique only when data is clean
DO $$
DECLARE dup_count INT;
DECLARE null_count INT;
BEGIN
  SELECT COUNT(*) INTO null_count FROM public.profiles WHERE email IS NULL OR email = '';
  SELECT COUNT(*) INTO dup_count FROM (
    SELECT email FROM public.profiles WHERE email IS NOT NULL AND email <> '' GROUP BY email HAVING COUNT(*) > 1
  ) t;

  IF null_count = 0 AND dup_count = 0 THEN
    ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'profiles' AND indexname = 'profiles_email_key'
    ) THEN
      ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
    END IF;
  ELSE
    RAISE NOTICE 'Skipped enforcing profiles.email constraints due to % null and % dup emails', null_count, dup_count;
  END IF;
END $$;

-- 2) Fix campaign helper functions
CREATE OR REPLACE FUNCTION public.is_campaign_system(p_campaign_id UUID, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT p_user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.campaigns WHERE id = p_campaign_id AND dm_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_campaign_dm(p_campaign_id UUID, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT p_user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.campaigns WHERE id = p_campaign_id AND dm_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_campaign_member(p_campaign_id UUID, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT p_user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.campaign_members WHERE campaign_id = p_campaign_id AND user_id = p_user_id
  );
$$;

-- 3) Tighten campaign tables that used is_campaign_system
DO $$
BEGIN
  -- campaign_encounters
  DROP POLICY IF EXISTS "campaign_encounters_insert" ON public.campaign_encounters;
  CREATE POLICY "campaign_encounters_insert" ON public.campaign_encounters
    FOR INSERT WITH CHECK (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_encounters_update" ON public.campaign_encounters;
  CREATE POLICY "campaign_encounters_update" ON public.campaign_encounters
    FOR UPDATE USING (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_encounters_delete" ON public.campaign_encounters;
  CREATE POLICY "campaign_encounters_delete" ON public.campaign_encounters
    FOR DELETE USING (public.is_campaign_dm(campaign_id));

  -- campaign_encounter_entries
  DROP POLICY IF EXISTS "campaign_encounter_entries_insert" ON public.campaign_encounter_entries;
  CREATE POLICY "campaign_encounter_entries_insert" ON public.campaign_encounter_entries
    FOR INSERT WITH CHECK (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_encounter_entries_update" ON public.campaign_encounter_entries;
  CREATE POLICY "campaign_encounter_entries_update" ON public.campaign_encounter_entries
    FOR UPDATE USING (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_encounter_entries_delete" ON public.campaign_encounter_entries;
  CREATE POLICY "campaign_encounter_entries_delete" ON public.campaign_encounter_entries
    FOR DELETE USING (public.is_campaign_dm(campaign_id));

  -- campaign_combat_sessions
  DROP POLICY IF EXISTS "campaign_combat_sessions_insert" ON public.campaign_combat_sessions;
  CREATE POLICY "campaign_combat_sessions_insert" ON public.campaign_combat_sessions
    FOR INSERT WITH CHECK (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_combat_sessions_update" ON public.campaign_combat_sessions;
  CREATE POLICY "campaign_combat_sessions_update" ON public.campaign_combat_sessions
    FOR UPDATE USING (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_combat_sessions_delete" ON public.campaign_combat_sessions;
  CREATE POLICY "campaign_combat_sessions_delete" ON public.campaign_combat_sessions
    FOR DELETE USING (public.is_campaign_dm(campaign_id));

  -- campaign_combatants
  DROP POLICY IF EXISTS "campaign_combatants_insert" ON public.campaign_combatants;
  CREATE POLICY "campaign_combatants_insert" ON public.campaign_combatants
    FOR INSERT WITH CHECK (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_combatants_update" ON public.campaign_combatants;
  CREATE POLICY "campaign_combatants_update" ON public.campaign_combatants
    FOR UPDATE USING (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_combatants_delete" ON public.campaign_combatants;
  CREATE POLICY "campaign_combatants_delete" ON public.campaign_combatants
    FOR DELETE USING (public.is_campaign_dm(campaign_id));

  -- campaign_loot_drops
  DROP POLICY IF EXISTS "campaign_loot_drops_insert" ON public.campaign_loot_drops;
  CREATE POLICY "campaign_loot_drops_insert" ON public.campaign_loot_drops
    FOR INSERT WITH CHECK (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_loot_drops_update" ON public.campaign_loot_drops;
  CREATE POLICY "campaign_loot_drops_update" ON public.campaign_loot_drops
    FOR UPDATE USING (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_loot_drops_delete" ON public.campaign_loot_drops;
  CREATE POLICY "campaign_loot_drops_delete" ON public.campaign_loot_drops
    FOR DELETE USING (public.is_campaign_dm(campaign_id));

  -- campaign_rule_events
  DROP POLICY IF EXISTS "campaign_rule_events_insert" ON public.campaign_rule_events;
  CREATE POLICY "campaign_rule_events_insert" ON public.campaign_rule_events
    FOR INSERT WITH CHECK (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_rule_events_update" ON public.campaign_rule_events;
  CREATE POLICY "campaign_rule_events_update" ON public.campaign_rule_events
    FOR UPDATE USING (public.is_campaign_dm(campaign_id));
  DROP POLICY IF EXISTS "campaign_rule_events_delete" ON public.campaign_rule_events;
  CREATE POLICY "campaign_rule_events_delete" ON public.campaign_rule_events
    FOR DELETE USING (public.is_campaign_dm(campaign_id));
END $$;

-- 4) Roll history: allow DM view, guard null auth
DO $$
BEGIN
  DROP POLICY IF EXISTS "roll_history_select" ON public.roll_history;
  CREATE POLICY "roll_history_select" ON public.roll_history
    FOR SELECT USING (
      auth.uid() IS NOT NULL AND (
        user_id = auth.uid() OR
        (campaign_id IS NOT NULL AND (
          EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND dm_id = auth.uid()) OR
          EXISTS (SELECT 1 FROM public.campaign_members WHERE campaign_id = roll_history.campaign_id AND user_id = auth.uid())
        ))
      )
    );
  DROP POLICY IF EXISTS "roll_history_insert" ON public.roll_history;
  CREATE POLICY "roll_history_insert" ON public.roll_history
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
END $$;

-- 5) Storage policies: ownership scoping
DO $$
BEGIN
  -- Helper snippet: enforce foldername owner
  -- character-avatars
  DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
  CREATE POLICY "Users can upload their own avatars" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'character-avatars' AND
      array_length(storage.foldername(name),1) = 2 AND
      (storage.foldername(name))[1] = auth.uid()::text AND
      COALESCE((storage.foldername(name))[2], '') <> ''
    );

  -- homebrew-content
  DROP POLICY IF EXISTS "DMs can upload homebrew content" ON storage.objects;
  CREATE POLICY "DMs can upload homebrew content" ON storage.objects
    FOR ALL USING (
      bucket_id = 'homebrew-content' AND
      array_length(storage.foldername(name),1) = 2 AND
      (storage.foldername(name))[1] = auth.uid()::text
    ) WITH CHECK (
      bucket_id = 'homebrew-content' AND
      array_length(storage.foldername(name),1) = 2 AND
      (storage.foldername(name))[1] = auth.uid()::text
    );

  -- generated-art
  DROP POLICY IF EXISTS "Authenticated users can upload generated art" ON storage.objects;
  CREATE POLICY "Authenticated users can upload generated art" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'generated-art' AND
      auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND
      (storage.foldername(name))[1] = auth.uid()::text AND
      COALESCE((storage.foldername(name))[2], '') <> ''
    );
  DROP POLICY IF EXISTS "Authenticated users can update generated art" ON storage.objects;
  CREATE POLICY "Authenticated users can update generated art" ON storage.objects
    FOR UPDATE USING (
      bucket_id = 'generated-art' AND
      auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
  DROP POLICY IF EXISTS "Authenticated users can delete generated art" ON storage.objects;
  CREATE POLICY "Authenticated users can delete generated art" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'generated-art' AND
      auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND
      (storage.foldername(name))[1] = auth.uid()::text
    );

  -- custom-tokens
  DROP POLICY IF EXISTS "Authenticated users can upload custom tokens" ON storage.objects;
  CREATE POLICY "Authenticated users can upload custom tokens" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'custom-tokens' AND auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND (storage.foldername(name))[1] = auth.uid()::text AND COALESCE((storage.foldername(name))[2], '') <> ''
    );
  DROP POLICY IF EXISTS "Authenticated users can update custom tokens" ON storage.objects;
  CREATE POLICY "Authenticated users can update custom tokens" ON storage.objects
    FOR UPDATE USING (
      bucket_id = 'custom-tokens' AND auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND (storage.foldername(name))[1] = auth.uid()::text
    );
  DROP POLICY IF EXISTS "Authenticated users can delete custom tokens" ON storage.objects;
  CREATE POLICY "Authenticated users can delete custom tokens" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'custom-tokens' AND auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND (storage.foldername(name))[1] = auth.uid()::text
    );

  -- character-portraits
  DROP POLICY IF EXISTS "Authenticated users can upload character portraits" ON storage.objects;
  CREATE POLICY "Authenticated users can upload character portraits" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'character-portraits' AND auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND (storage.foldername(name))[1] = auth.uid()::text AND COALESCE((storage.foldername(name))[2], '') <> ''
    );
  DROP POLICY IF EXISTS "Authenticated users can update character portraits" ON storage.objects;
  CREATE POLICY "Authenticated users can update character portraits" ON storage.objects
    FOR UPDATE USING (
      bucket_id = 'character-portraits' AND auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND (storage.foldername(name))[1] = auth.uid()::text
    );
  DROP POLICY IF EXISTS "Authenticated users can delete character portraits" ON storage.objects;
  CREATE POLICY "Authenticated users can delete character portraits" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'character-portraits' AND auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND (storage.foldername(name))[1] = auth.uid()::text
    );

  -- audio-tracks
  DROP POLICY IF EXISTS "Public read access for audio tracks" ON storage.objects;
  CREATE POLICY "Public read access for audio tracks" ON storage.objects
    FOR SELECT USING (bucket_id = 'audio-tracks');
  DROP POLICY IF EXISTS "Authenticated users can upload audio tracks" ON storage.objects;
  CREATE POLICY "Authenticated users can upload audio tracks" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'audio-tracks' AND auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND (storage.foldername(name))[1] = auth.uid()::text AND COALESCE((storage.foldername(name))[2], '') <> ''
    );
  DROP POLICY IF EXISTS "Authenticated users can update audio tracks" ON storage.objects;
  CREATE POLICY "Authenticated users can update audio tracks" ON storage.objects
    FOR UPDATE USING (
      bucket_id = 'audio-tracks' AND auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND (storage.foldername(name))[1] = auth.uid()::text
    );
  DROP POLICY IF EXISTS "Authenticated users can delete audio tracks" ON storage.objects;
  CREATE POLICY "Authenticated users can delete audio tracks" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'audio-tracks' AND auth.role() = 'authenticated' AND
      array_length(storage.foldername(name),1) = 2 AND (storage.foldername(name))[1] = auth.uid()::text
    );

  -- compendium-images
  DROP POLICY IF EXISTS "Authenticated users can upload compendium images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update compendium images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete compendium images" ON storage.objects;
  CREATE POLICY "Admins/DMs can manage compendium images" ON storage.objects
    FOR ALL USING (
      bucket_id = 'compendium-images' AND auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('dm','admin')
      )
    ) WITH CHECK (
      bucket_id = 'compendium-images' AND auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('dm','admin')
      )
    );
END $$;

-- 6) VTT chat whisper tightening already enforced by message_type filter; ensure index exists for whisper_to
CREATE INDEX IF NOT EXISTS idx_vtt_chat_messages_whisper ON public.vtt_chat_messages(whisper_to);

SET search_path TO public, pg_temp;

-- 7) Runes system RLS policies (lint fix: RLS enabled without policies)
DO $$
BEGIN
  -- compendium_runes: anyone can read, only DMs/Admins manage (homebrew creation flows use dm/admin)
  DROP POLICY IF EXISTS "Anyone can view runes" ON public.compendium_runes;
  CREATE POLICY "Anyone can view runes" ON public.compendium_runes
    FOR SELECT USING (true);

  DROP POLICY IF EXISTS "DMs can manage runes" ON public.compendium_runes;
  CREATE POLICY "DMs can manage runes" ON public.compendium_runes
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('dm','admin')
      )
    );

  -- character_rune_inscriptions: only character owner can manage/select
  DROP POLICY IF EXISTS "Owners can read rune inscriptions" ON public.character_rune_inscriptions;
  CREATE POLICY "Owners can read rune inscriptions" ON public.character_rune_inscriptions
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.uid()
      )
    );

  DROP POLICY IF EXISTS "Owners can manage rune inscriptions" ON public.character_rune_inscriptions;
  CREATE POLICY "Owners can manage rune inscriptions" ON public.character_rune_inscriptions
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.uid()
      )
    );

  -- character_rune_knowledge: only character owner can read/manage
  DROP POLICY IF EXISTS "Owners can read rune knowledge" ON public.character_rune_knowledge;
  CREATE POLICY "Owners can read rune knowledge" ON public.character_rune_knowledge
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.uid()
      )
    );

  DROP POLICY IF EXISTS "Owners can manage rune knowledge" ON public.character_rune_knowledge;
  CREATE POLICY "Owners can manage rune knowledge" ON public.character_rune_knowledge
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = auth.uid()
      )
    );
END $$;

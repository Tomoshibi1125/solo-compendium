-- Fix all auth_rls_initplan and multiple_permissive_policies linter warnings.
-- Strategy:
--   initplan  → wrap every auth.uid() / auth.role() call inside (select ...)
--   multiple  → ensure at most ONE permissive policy per (role, action) per table
--              by replacing FOR ALL + FOR SELECT combos with per-action policies
--              and dropping duplicate SELECT policies.
-- Every section is idempotent: DROP POLICY IF EXISTS before CREATE POLICY.

BEGIN;

-- ============================================================
-- 1. character_abilities  (initplan)
-- ============================================================
DROP POLICY IF EXISTS "Users can create abilities for their own characters" ON public.character_abilities;
DROP POLICY IF EXISTS "Users can delete abilities of their own characters" ON public.character_abilities;
DROP POLICY IF EXISTS "Users can update abilities of their own characters" ON public.character_abilities;
DROP POLICY IF EXISTS "Users can view abilities of their own characters"   ON public.character_abilities;

CREATE POLICY "Users can create abilities for their own characters" ON public.character_abilities
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can delete abilities of their own characters" ON public.character_abilities
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can update abilities of their own characters" ON public.character_abilities
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can view abilities of their own characters" ON public.character_abilities
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 2. character_equipment  (initplan)
-- ============================================================
DROP POLICY IF EXISTS "Users can create equipment for their own characters" ON public.character_equipment;
DROP POLICY IF EXISTS "Users can delete equipment of their own characters" ON public.character_equipment;
DROP POLICY IF EXISTS "Users can update equipment of their own characters" ON public.character_equipment;
DROP POLICY IF EXISTS "Users can view equipment of their own characters"   ON public.character_equipment;

CREATE POLICY "Users can create equipment for their own characters" ON public.character_equipment
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can delete equipment of their own characters" ON public.character_equipment
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can update equipment of their own characters" ON public.character_equipment
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can view equipment of their own characters" ON public.character_equipment
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 3. character_powers  (initplan)
-- ============================================================
DROP POLICY IF EXISTS "Users can create powers for their own characters" ON public.character_powers;
DROP POLICY IF EXISTS "Users can delete powers of their own characters" ON public.character_powers;
DROP POLICY IF EXISTS "Users can update powers of their own characters" ON public.character_powers;
DROP POLICY IF EXISTS "Users can view powers of their own characters"   ON public.character_powers;

CREATE POLICY "Users can create powers for their own characters" ON public.character_powers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can delete powers of their own characters" ON public.character_powers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can update powers of their own characters" ON public.character_powers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can view powers of their own characters" ON public.character_powers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 4. character_features  (initplan)
-- ============================================================
DROP POLICY IF EXISTS "Users can create features for their own characters" ON public.character_features;
DROP POLICY IF EXISTS "Users can delete features of their own characters" ON public.character_features;
DROP POLICY IF EXISTS "Users can update features of their own characters" ON public.character_features;
DROP POLICY IF EXISTS "Users can view features of their own characters"   ON public.character_features;

CREATE POLICY "Users can create features for their own characters" ON public.character_features
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can delete features of their own characters" ON public.character_features
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can update features of their own characters" ON public.character_features
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can view features of their own characters" ON public.character_features
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 5. characters  (initplan + multiple permissive)
--    Drop ALL overlapping policies, recreate minimal set.
-- ============================================================
DROP POLICY IF EXISTS "DMs can view all characters"          ON public.characters;
DROP POLICY IF EXISTS "Users can create their own characters" ON public.characters;
DROP POLICY IF EXISTS "Users can delete their own characters" ON public.characters;
DROP POLICY IF EXISTS "Users can manage own characters"       ON public.characters;
DROP POLICY IF EXISTS "Users can update their own characters" ON public.characters;
DROP POLICY IF EXISTS "Users can view own characters"         ON public.characters;
DROP POLICY IF EXISTS "Users can view their own characters"   ON public.characters;

CREATE POLICY "characters_select" ON public.characters
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin')
    )
  );
CREATE POLICY "characters_insert" ON public.characters
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "characters_update" ON public.characters
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "characters_delete" ON public.characters
  FOR DELETE USING (user_id = (select auth.uid()));

-- ============================================================
-- 6. saved_sovereigns  (initplan)
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view public sovereigns"       ON public.saved_sovereigns;
DROP POLICY IF EXISTS "Users can create their own sovereigns"   ON public.saved_sovereigns;
DROP POLICY IF EXISTS "Users can delete their own sovereigns"   ON public.saved_sovereigns;
DROP POLICY IF EXISTS "Users can update their own sovereigns"   ON public.saved_sovereigns;

CREATE POLICY "Anyone can view public sovereigns" ON public.saved_sovereigns
  FOR SELECT USING (is_public = true OR created_by = (select auth.uid()));
CREATE POLICY "Users can create their own sovereigns" ON public.saved_sovereigns
  FOR INSERT WITH CHECK (created_by = (select auth.uid()));
CREATE POLICY "Users can delete their own sovereigns" ON public.saved_sovereigns
  FOR DELETE USING (created_by = (select auth.uid()));
CREATE POLICY "Users can update their own sovereigns" ON public.saved_sovereigns
  FOR UPDATE USING (created_by = (select auth.uid()));

-- ============================================================
-- 7. character_monarch_unlocks  (initplan)
-- ============================================================
DROP POLICY IF EXISTS "Users can create monarch unlocks for their own characters" ON public.character_monarch_unlocks;
DROP POLICY IF EXISTS "Users can delete their own monarch unlocks"                ON public.character_monarch_unlocks;
DROP POLICY IF EXISTS "Users can update their own monarch unlocks"                ON public.character_monarch_unlocks;
DROP POLICY IF EXISTS "Users can view their own monarch unlocks"                  ON public.character_monarch_unlocks;

CREATE POLICY "Users can create monarch unlocks for their own characters" ON public.character_monarch_unlocks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can delete their own monarch unlocks" ON public.character_monarch_unlocks
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can update their own monarch unlocks" ON public.character_monarch_unlocks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can view their own monarch unlocks" ON public.character_monarch_unlocks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 8. user_favorites  (initplan + multiple permissive)
--    Consolidate into single FOR ALL policy.
-- ============================================================
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can view their own favorites"   ON public.user_favorites;
DROP POLICY IF EXISTS "user_favorites_all"                   ON public.user_favorites;

CREATE POLICY "user_favorites_owner" ON public.user_favorites
  FOR ALL USING (user_id = (select auth.uid()));

-- ============================================================
-- 9. character_shadow_soldiers  (initplan)
-- ============================================================
DROP POLICY IF EXISTS "Users can release their own Umbral Legion"          ON public.character_shadow_soldiers;
DROP POLICY IF EXISTS "Users can summon soldiers for their own characters"  ON public.character_shadow_soldiers;

CREATE POLICY "Users can release their own Umbral Legion" ON public.character_shadow_soldiers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "Users can summon soldiers for their own characters" ON public.character_shadow_soldiers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 10. campaigns  (multiple permissive: INSERT/SELECT/UPDATE)
--     Drop all overlapping policies, create one per action.
-- ============================================================
DROP POLICY IF EXISTS "DMs can create campaigns"                           ON public.campaigns;
DROP POLICY IF EXISTS "DMs can manage own campaigns"                       ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_insert"                                   ON public.campaigns;
DROP POLICY IF EXISTS "Players can view campaigns they're in"              ON public.campaigns;
DROP POLICY IF EXISTS "Users can view campaigns they DM or are members of" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_select"                                   ON public.campaigns;
DROP POLICY IF EXISTS "DMs can update their own campaigns"                 ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_update"                                   ON public.campaigns;
DROP POLICY IF EXISTS "DMs can delete their own campaigns"                 ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_delete"                                   ON public.campaigns;

CREATE POLICY "campaigns_select" ON public.campaigns
  FOR SELECT USING (
    dm_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.campaign_id = id AND cm.user_id = (select auth.uid())
    )
  );
CREATE POLICY "campaigns_insert" ON public.campaigns
  FOR INSERT WITH CHECK (dm_id = (select auth.uid()));
CREATE POLICY "campaigns_update" ON public.campaigns
  FOR UPDATE USING (dm_id = (select auth.uid()));
CREATE POLICY "campaigns_delete" ON public.campaigns
  FOR DELETE USING (dm_id = (select auth.uid()));

-- ============================================================
-- 11. character_regent_unlocks  (multiple permissive SELECT)
--     "Owners can manage regent unlocks" FOR ALL overlaps with
--     "Owners can read regent unlocks" FOR SELECT.
--     Replace FOR ALL with INSERT/UPDATE/DELETE; keep one SELECT.
-- ============================================================
DROP POLICY IF EXISTS "Owners can manage regent unlocks" ON public.character_regent_unlocks;
DROP POLICY IF EXISTS "Owners can read regent unlocks"   ON public.character_regent_unlocks;

CREATE POLICY "regent_unlocks_select" ON public.character_regent_unlocks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "regent_unlocks_insert" ON public.character_regent_unlocks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "regent_unlocks_update" ON public.character_regent_unlocks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "regent_unlocks_delete" ON public.character_regent_unlocks
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );

-- ============================================================
-- 12. character_templates  (multiple permissive SELECT)
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view public templates" ON public.character_templates;
DROP POLICY IF EXISTS "Users can view own templates"     ON public.character_templates;
DROP POLICY IF EXISTS "Users can insert own templates"   ON public.character_templates;
DROP POLICY IF EXISTS "Users can update own templates"   ON public.character_templates;
DROP POLICY IF EXISTS "Users can delete own templates"   ON public.character_templates;

CREATE POLICY "character_templates_select" ON public.character_templates
  FOR SELECT USING (
    is_public = true OR user_id = (select auth.uid())
  );
CREATE POLICY "character_templates_insert" ON public.character_templates
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "character_templates_update" ON public.character_templates
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "character_templates_delete" ON public.character_templates
  FOR DELETE USING (user_id = (select auth.uid()));

-- ============================================================
-- 13. combat_participants  (multiple permissive SELECT)
--     FOR ALL (DM manage) overlaps with FOR SELECT (view).
-- ============================================================
DROP POLICY IF EXISTS "DMs can manage combat participants in their sessions" ON public.combat_participants;
DROP POLICY IF EXISTS "Users can view combat participants in their sessions" ON public.combat_participants;

CREATE POLICY "combat_participants_select" ON public.combat_participants
  FOR SELECT USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
  );
CREATE POLICY "combat_participants_insert" ON public.combat_participants
  FOR INSERT WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "combat_participants_update" ON public.combat_participants
  FOR UPDATE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "combat_participants_delete" ON public.combat_participants
  FOR DELETE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );

-- ============================================================
-- 14–17. Compendium tables — public read only (duplicate SELECT)
--        Drop both, create single public read.
-- ============================================================

-- compendium_backgrounds
DROP POLICY IF EXISTS "Anyone can view backgrounds"                    ON public.compendium_backgrounds;
DROP POLICY IF EXISTS "Compendium backgrounds are publicly readable"   ON public.compendium_backgrounds;
CREATE POLICY "compendium_backgrounds_select" ON public.compendium_backgrounds
  FOR SELECT USING (true);

-- compendium_conditions
DROP POLICY IF EXISTS "Anyone can view conditions"                     ON public.compendium_conditions;
DROP POLICY IF EXISTS "Compendium conditions are publicly readable"    ON public.compendium_conditions;
CREATE POLICY "compendium_conditions_select" ON public.compendium_conditions
  FOR SELECT USING (true);

-- compendium_equipment
DROP POLICY IF EXISTS "Anyone can view equipment"                      ON public.compendium_equipment;
DROP POLICY IF EXISTS "Compendium equipment is publicly readable"      ON public.compendium_equipment;
DROP POLICY IF EXISTS "Compendium equipment public read"               ON public.compendium_equipment;
CREATE POLICY "compendium_equipment_select" ON public.compendium_equipment
  FOR SELECT USING (true);

-- compendium_feats
DROP POLICY IF EXISTS "Anyone can view feats"                          ON public.compendium_feats;
DROP POLICY IF EXISTS "Compendium feats are publicly readable"         ON public.compendium_feats;
DROP POLICY IF EXISTS "Compendium feats public read"                   ON public.compendium_feats;
CREATE POLICY "compendium_feats_select" ON public.compendium_feats
  FOR SELECT USING (true);

-- compendium_job_features
DROP POLICY IF EXISTS "Anyone can view job features"                   ON public.compendium_job_features;
DROP POLICY IF EXISTS "Compendium job features are publicly readable"  ON public.compendium_job_features;
DROP POLICY IF EXISTS "Compendium job features public read"            ON public.compendium_job_features;
CREATE POLICY "compendium_job_features_select" ON public.compendium_job_features
  FOR SELECT USING (true);

-- compendium_job_paths
DROP POLICY IF EXISTS "Anyone can view job paths"                      ON public.compendium_job_paths;
DROP POLICY IF EXISTS "Compendium job paths are publicly readable"     ON public.compendium_job_paths;
DROP POLICY IF EXISTS "Compendium job paths public read"               ON public.compendium_job_paths;
CREATE POLICY "compendium_job_paths_select" ON public.compendium_job_paths
  FOR SELECT USING (true);

-- compendium_monarchs
DROP POLICY IF EXISTS "Anyone can view monarchs"                       ON public.compendium_monarchs;
DROP POLICY IF EXISTS "Compendium monarchs are publicly readable"      ON public.compendium_monarchs;
DROP POLICY IF EXISTS "Compendium monarchs public read"                ON public.compendium_monarchs;
CREATE POLICY "compendium_monarchs_select" ON public.compendium_monarchs
  FOR SELECT USING (true);

-- compendium_monsters
DROP POLICY IF EXISTS "Anyone can view monsters"                       ON public.compendium_monsters;
DROP POLICY IF EXISTS "Compendium monsters are publicly readable"      ON public.compendium_monsters;
DROP POLICY IF EXISTS "Compendium monsters public read"                ON public.compendium_monsters;
CREATE POLICY "compendium_monsters_select" ON public.compendium_monsters
  FOR SELECT USING (true);

-- compendium_powers
DROP POLICY IF EXISTS "Anyone can view powers"                         ON public.compendium_powers;
DROP POLICY IF EXISTS "Compendium powers are publicly readable"        ON public.compendium_powers;
CREATE POLICY "compendium_powers_select" ON public.compendium_powers
  FOR SELECT USING (true);

-- compendium_sovereigns
DROP POLICY IF EXISTS "Anyone can view sovereigns"                     ON public.compendium_sovereigns;
DROP POLICY IF EXISTS "Compendium sovereigns are publicly readable"    ON public.compendium_sovereigns;
CREATE POLICY "compendium_sovereigns_select" ON public.compendium_sovereigns
  FOR SELECT USING (true);

-- ============================================================
-- 18. compendium_skills  (3 duplicate SELECT policies)
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view skills"                         ON public.compendium_skills;
DROP POLICY IF EXISTS "Compendium skills are publicly readable"        ON public.compendium_skills;
DROP POLICY IF EXISTS "Skills are publicly readable"                   ON public.compendium_skills;
CREATE POLICY "compendium_skills_select" ON public.compendium_skills
  FOR SELECT USING (true);

-- ============================================================
-- 19–24. Compendium tables with DM manage (FOR ALL overlaps SELECT)
--        Replace FOR ALL with per-action INSERT/UPDATE/DELETE.
--        Keep single SELECT USING(true).
-- ============================================================

-- compendium_jobs
DROP POLICY IF EXISTS "Anyone can view jobs"                           ON public.compendium_jobs;
DROP POLICY IF EXISTS "Compendium jobs are publicly readable"          ON public.compendium_jobs;
DROP POLICY IF EXISTS "Compendium jobs public read"                    ON public.compendium_jobs;
DROP POLICY IF EXISTS "DMs can manage jobs"                            ON public.compendium_jobs;

CREATE POLICY "compendium_jobs_select" ON public.compendium_jobs
  FOR SELECT USING (true);
CREATE POLICY "compendium_jobs_insert" ON public.compendium_jobs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_jobs_update" ON public.compendium_jobs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_jobs_delete" ON public.compendium_jobs
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );

-- compendium_paths
DROP POLICY IF EXISTS "Anyone can view paths"           ON public.compendium_paths;
DROP POLICY IF EXISTS "Compendium paths public read"    ON public.compendium_paths;
DROP POLICY IF EXISTS "DMs can manage paths"            ON public.compendium_paths;

CREATE POLICY "compendium_paths_select" ON public.compendium_paths
  FOR SELECT USING (true);
CREATE POLICY "compendium_paths_insert" ON public.compendium_paths
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_paths_update" ON public.compendium_paths
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_paths_delete" ON public.compendium_paths
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );

-- compendium_regents
DROP POLICY IF EXISTS "Anyone can view regents"  ON public.compendium_regents;
DROP POLICY IF EXISTS "DMs can manage regents"   ON public.compendium_regents;

CREATE POLICY "compendium_regents_select" ON public.compendium_regents
  FOR SELECT USING (true);
CREATE POLICY "compendium_regents_insert" ON public.compendium_regents
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_regents_update" ON public.compendium_regents
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_regents_delete" ON public.compendium_regents
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );

-- compendium_regent_features
DROP POLICY IF EXISTS "Anyone can view regent features"  ON public.compendium_regent_features;
DROP POLICY IF EXISTS "DMs can manage regent features"   ON public.compendium_regent_features;

CREATE POLICY "compendium_regent_features_select" ON public.compendium_regent_features
  FOR SELECT USING (true);
CREATE POLICY "compendium_regent_features_insert" ON public.compendium_regent_features
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_regent_features_update" ON public.compendium_regent_features
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_regent_features_delete" ON public.compendium_regent_features
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );

-- compendium_relics
DROP POLICY IF EXISTS "Anyone can view relics"                    ON public.compendium_relics;
DROP POLICY IF EXISTS "Compendium relics are publicly readable"   ON public.compendium_relics;
DROP POLICY IF EXISTS "DMs can manage relics"                     ON public.compendium_relics;

CREATE POLICY "compendium_relics_select" ON public.compendium_relics
  FOR SELECT USING (true);
CREATE POLICY "compendium_relics_insert" ON public.compendium_relics
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_relics_update" ON public.compendium_relics
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_relics_delete" ON public.compendium_relics
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );

-- compendium_runes
DROP POLICY IF EXISTS "Compendium runes public read" ON public.compendium_runes;
DROP POLICY IF EXISTS "DMs can manage runes"         ON public.compendium_runes;

CREATE POLICY "compendium_runes_select" ON public.compendium_runes
  FOR SELECT USING (true);
CREATE POLICY "compendium_runes_insert" ON public.compendium_runes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_runes_update" ON public.compendium_runes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );
CREATE POLICY "compendium_runes_delete" ON public.compendium_runes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role IN ('dm','admin'))
  );

-- ============================================================
-- 25. daily_quest_configs  (multiple permissive: all 4 actions)
--     Two FOR ALL policies overlap. Consolidate into per-action.
-- ============================================================
DROP POLICY IF EXISTS "Quest configs manageable by campaign owner"   ON public.daily_quest_configs;
DROP POLICY IF EXISTS "Quest configs manageable by character owner"  ON public.daily_quest_configs;

CREATE POLICY "daily_quest_configs_select" ON public.daily_quest_configs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
    OR EXISTS (SELECT 1 FROM public.campaigns ca WHERE ca.id = campaign_id AND ca.dm_id = (select auth.uid()))
  );
CREATE POLICY "daily_quest_configs_insert" ON public.daily_quest_configs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
    OR EXISTS (SELECT 1 FROM public.campaigns ca WHERE ca.id = campaign_id AND ca.dm_id = (select auth.uid()))
  );
CREATE POLICY "daily_quest_configs_update" ON public.daily_quest_configs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
    OR EXISTS (SELECT 1 FROM public.campaigns ca WHERE ca.id = campaign_id AND ca.dm_id = (select auth.uid()))
  );
CREATE POLICY "daily_quest_configs_delete" ON public.daily_quest_configs
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
    OR EXISTS (SELECT 1 FROM public.campaigns ca WHERE ca.id = campaign_id AND ca.dm_id = (select auth.uid()))
  );

-- ============================================================
-- 26. daily_quest_instances  (multiple permissive SELECT)
--     FOR ALL (owner) overlaps with two FOR SELECT policies.
-- ============================================================
DROP POLICY IF EXISTS "Quest instances manageable by owner"            ON public.daily_quest_instances;
DROP POLICY IF EXISTS "Quest instances readable by campaign members"   ON public.daily_quest_instances;
DROP POLICY IF EXISTS "Quest instances readable by owner"              ON public.daily_quest_instances;

CREATE POLICY "daily_quest_instances_select" ON public.daily_quest_instances
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
    OR EXISTS (
      SELECT 1 FROM public.characters c
      JOIN public.campaign_members cm ON cm.user_id = c.user_id
      WHERE c.id = character_id
        AND cm.user_id = (select auth.uid())
    )
  );
CREATE POLICY "daily_quest_instances_insert" ON public.daily_quest_instances
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "daily_quest_instances_update" ON public.daily_quest_instances
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );
CREATE POLICY "daily_quest_instances_delete" ON public.daily_quest_instances
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (select auth.uid()))
  );



-- ============================================================
-- 28. profiles  (multiple permissive SELECT)
--     Use is_dm_or_admin() helper to avoid self-referencing RLS recursion.
-- ============================================================
DROP POLICY IF EXISTS "DMs can view all profiles"          ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile"   ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (
    id = (select auth.uid())
    OR public.is_dm_or_admin((select auth.uid()))
  );

-- ============================================================
-- 29. quest_completions  (multiple permissive SELECT)
--     FOR ALL overlaps with FOR SELECT. Replace with per-action.
-- ============================================================
DROP POLICY IF EXISTS "Users can manage their quest completions" ON public.quest_completions;
DROP POLICY IF EXISTS "Users can view their quest completions"   ON public.quest_completions;

CREATE POLICY "quest_completions_select" ON public.quest_completions
  FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "quest_completions_insert" ON public.quest_completions
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "quest_completions_update" ON public.quest_completions
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "quest_completions_delete" ON public.quest_completions
  FOR DELETE USING (user_id = (select auth.uid()));

-- ============================================================
-- 30. session_participants  (multiple permissive SELECT)
--     FOR ALL (own) overlaps with FOR SELECT (campaign members).
-- ============================================================
DROP POLICY IF EXISTS "Users can manage their own session participation" ON public.session_participants;
DROP POLICY IF EXISTS "Users can view session participants"              ON public.session_participants;

CREATE POLICY "session_participants_select" ON public.session_participants
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
  );
CREATE POLICY "session_participants_insert" ON public.session_participants
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "session_participants_update" ON public.session_participants
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "session_participants_delete" ON public.session_participants
  FOR DELETE USING (user_id = (select auth.uid()));

-- ============================================================
-- 31. session_quests  (multiple permissive SELECT)
--     FOR ALL (DM manage) overlaps with FOR SELECT (view).
-- ============================================================
DROP POLICY IF EXISTS "DMs can manage session quests in their campaigns"  ON public.session_quests;
DROP POLICY IF EXISTS "Users can view session quests in their campaigns"  ON public.session_quests;

CREATE POLICY "session_quests_select" ON public.session_quests
  FOR SELECT USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
         OR EXISTS (SELECT 1 FROM public.campaign_members cm WHERE cm.campaign_id = a.campaign_id AND cm.user_id = (select auth.uid()))
    )
  );
CREATE POLICY "session_quests_insert" ON public.session_quests
  FOR INSERT WITH CHECK (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "session_quests_update" ON public.session_quests
  FOR UPDATE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );
CREATE POLICY "session_quests_delete" ON public.session_quests
  FOR DELETE USING (
    session_id IN (
      SELECT a.id FROM public.active_sessions a
      WHERE EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = a.campaign_id AND c.dm_id = (select auth.uid()))
    )
  );

-- ============================================================
-- 32. sourcebook_catalog  (multiple permissive SELECT)
--     FOR ALL (admin manage) overlaps with FOR SELECT (public).
-- ============================================================
DROP POLICY IF EXISTS "sourcebook_catalog_manage" ON public.sourcebook_catalog;
DROP POLICY IF EXISTS "sourcebook_catalog_select" ON public.sourcebook_catalog;

CREATE POLICY "sourcebook_catalog_select" ON public.sourcebook_catalog
  FOR SELECT USING (true);
CREATE POLICY "sourcebook_catalog_insert" ON public.sourcebook_catalog
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role = 'admin')
  );
CREATE POLICY "sourcebook_catalog_update" ON public.sourcebook_catalog
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role = 'admin')
  );
CREATE POLICY "sourcebook_catalog_delete" ON public.sourcebook_catalog
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role = 'admin')
  );

-- ============================================================
-- 33. user_marketplace_entitlements  (multiple permissive SELECT)
--     FOR ALL (manage) overlaps with FOR SELECT.
-- ============================================================
DROP POLICY IF EXISTS "user_marketplace_entitlements_manage" ON public.user_marketplace_entitlements;
DROP POLICY IF EXISTS "user_marketplace_entitlements_select" ON public.user_marketplace_entitlements;

CREATE POLICY "user_marketplace_entitlements_select" ON public.user_marketplace_entitlements
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role = 'admin')
  );
CREATE POLICY "user_marketplace_entitlements_insert" ON public.user_marketplace_entitlements
  FOR INSERT WITH CHECK (
    user_id = (select auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role = 'admin')
  );
CREATE POLICY "user_marketplace_entitlements_update" ON public.user_marketplace_entitlements
  FOR UPDATE USING (
    user_id = (select auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role = 'admin')
  );
CREATE POLICY "user_marketplace_entitlements_delete" ON public.user_marketplace_entitlements
  FOR DELETE USING (
    user_id = (select auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (select auth.uid()) AND p.role = 'admin')
  );

COMMIT;

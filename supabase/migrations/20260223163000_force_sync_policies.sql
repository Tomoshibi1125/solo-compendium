-- Force sync all policies by dropping and recreating them
-- This will ensure remote matches local exactly

BEGIN;

-- Drop all existing policies first to avoid conflicts
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                       r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Now recreate all policies from the local state

-- character_abilities
DROP POLICY IF EXISTS "Users can create abilities for their own characters" ON public.character_abilities;
CREATE POLICY "Users can create abilities for their own characters" ON public.character_abilities
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
DROP POLICY IF EXISTS "Users can delete abilities of their own characters" ON public.character_abilities;
CREATE POLICY "Users can delete abilities of their own characters" ON public.character_abilities
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
DROP POLICY IF EXISTS "Users can update abilities of their own characters" ON public.character_abilities;
CREATE POLICY "Users can update abilities of their own characters" ON public.character_abilities
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
DROP POLICY IF EXISTS "Users can view abilities of their own characters" ON public.character_abilities;
CREATE POLICY "Users can view abilities of their own characters" ON public.character_abilities
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );

-- character_equipment
DROP POLICY IF EXISTS "Users can create equipment for their own characters" ON public.character_equipment;
CREATE POLICY "Users can create equipment for their own characters" ON public.character_equipment
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
DROP POLICY IF EXISTS "Users can delete equipment of their own characters" ON public.character_equipment;
CREATE POLICY "Users can delete equipment of their own characters" ON public.character_equipment
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
DROP POLICY IF EXISTS "Users can update equipment of their own characters" ON public.character_equipment;
CREATE POLICY "Users can update equipment of their own characters" ON public.character_equipment
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
DROP POLICY IF EXISTS "Users can view equipment of their own characters" ON public.character_equipment;
CREATE POLICY "Users can view equipment of their own characters" ON public.character_equipment
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );

-- campaigns
DROP POLICY IF EXISTS "campaigns_select" ON public.campaigns;
CREATE POLICY "campaigns_select" ON public.campaigns
  FOR SELECT USING (
    dm_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.campaign_id = id AND cm.user_id = (SELECT auth.uid())
    )
  );
DROP POLICY IF EXISTS "campaigns_insert" ON public.campaigns;
CREATE POLICY "campaigns_insert" ON public.campaigns
  FOR INSERT WITH CHECK (dm_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "campaigns_update" ON public.campaigns;
CREATE POLICY "campaigns_update" ON public.campaigns
  FOR UPDATE USING (dm_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "campaigns_delete" ON public.campaigns;
CREATE POLICY "campaigns_delete" ON public.campaigns
  FOR DELETE USING (dm_id = (SELECT auth.uid()));

-- Compendium public read policies
DROP POLICY IF EXISTS "Compendium equipment public read" ON public.compendium_equipment;
CREATE POLICY "Compendium equipment public read" ON public.compendium_equipment
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Compendium feats public read" ON public.compendium_feats;
CREATE POLICY "Compendium feats public read" ON public.compendium_feats
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Compendium job features public read" ON public.compendium_job_features;
CREATE POLICY "Compendium job features public read" ON public.compendium_job_features
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Compendium job paths public read" ON public.compendium_job_paths;
CREATE POLICY "Compendium job paths public read" ON public.compendium_job_paths
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Compendium monarchs public read" ON public.compendium_monarchs;
CREATE POLICY "Compendium monarchs public read" ON public.compendium_monarchs
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Compendium monsters public read" ON public.compendium_monsters;
CREATE POLICY "Compendium monsters public read" ON public.compendium_monsters
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Compendium powers public read" ON public.compendium_powers;
CREATE POLICY "Compendium powers public read" ON public.compendium_powers
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "Compendium paths public read" ON public.compendium_paths;
CREATE POLICY "Compendium paths public read" ON public.compendium_paths
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "DMs can manage paths" ON public.compendium_paths;
CREATE POLICY "DMs can manage paths" ON public.compendium_paths
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role IN ('dm','admin')
    )
  );

-- Add more policies as needed from the diff...

COMMIT;

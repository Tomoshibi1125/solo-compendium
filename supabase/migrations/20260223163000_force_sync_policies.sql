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
CREATE POLICY "Users can create abilities for their own characters" ON public.character_abilities
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Users can delete abilities of their own characters" ON public.character_abilities
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Users can update abilities of their own characters" ON public.character_abilities
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Users can view abilities of their own characters" ON public.character_abilities
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );

-- character_equipment
CREATE POLICY "Users can create equipment for their own characters" ON public.character_equipment
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Users can delete equipment of their own characters" ON public.character_equipment
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Users can update equipment of their own characters" ON public.character_equipment
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Users can view equipment of their own characters" ON public.character_equipment
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );

-- campaigns
CREATE POLICY "campaigns_select" ON public.campaigns
  FOR SELECT USING (
    dm_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.campaign_members cm
      WHERE cm.campaign_id = id AND cm.user_id = (SELECT auth.uid())
    )
  );
CREATE POLICY "campaigns_insert" ON public.campaigns
  FOR INSERT WITH CHECK (dm_id = (SELECT auth.uid()));
CREATE POLICY "campaigns_update" ON public.campaigns
  FOR UPDATE USING (dm_id = (SELECT auth.uid()));
CREATE POLICY "campaigns_delete" ON public.campaigns
  FOR DELETE USING (dm_id = (SELECT auth.uid()));

-- Compendium public read policies
CREATE POLICY "Compendium equipment public read" ON public.compendium_equipment
  FOR SELECT USING (true);
CREATE POLICY "Compendium feats public read" ON public.compendium_feats
  FOR SELECT USING (true);
CREATE POLICY "Compendium job features public read" ON public.compendium_job_features
  FOR SELECT USING (true);
CREATE POLICY "Compendium job paths public read" ON public.compendium_job_paths
  FOR SELECT USING (true);
CREATE POLICY "Compendium monarchs public read" ON public.compendium_monarchs
  FOR SELECT USING (true);
CREATE POLICY "Compendium monsters public read" ON public.compendium_monsters
  FOR SELECT USING (true);
CREATE POLICY "Compendium powers public read" ON public.compendium_powers
  FOR SELECT USING (true);
CREATE POLICY "Compendium paths public read" ON public.compendium_paths
  FOR SELECT USING (true);
CREATE POLICY "DMs can manage paths" ON public.compendium_paths
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role IN ('dm','admin')
    )
  );

-- Add more policies as needed from the diff...

COMMIT;

-- Supabase lint remediations: initplan-safe policies, missing RLS policies, search_path hardening

-- Add RLS policies for rune tables flagged as enabled-without-policies
DO $$
BEGIN
  -- character_rune_inscriptions: tie to character ownership
  DROP POLICY IF EXISTS "Users can manage their rune inscriptions" ON public.character_rune_inscriptions;
  CREATE POLICY "Users can manage their rune inscriptions" ON public.character_rune_inscriptions
    FOR ALL USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    ) WITH CHECK (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );

  -- character_rune_knowledge: tie to character ownership
  DROP POLICY IF EXISTS "Users can manage their rune knowledge" ON public.character_rune_knowledge;
  CREATE POLICY "Users can manage their rune knowledge" ON public.character_rune_knowledge
    FOR ALL USING (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    ) WITH CHECK (
      (SELECT auth.uid()) IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.characters c WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())
      )
    );

  -- compendium_runes: public read + DM/admin manage
  DROP POLICY IF EXISTS "Compendium runes public read" ON public.compendium_runes;
  CREATE POLICY "Compendium runes public read" ON public.compendium_runes
    FOR SELECT USING (true);
  DROP POLICY IF EXISTS "DMs can manage runes" ON public.compendium_runes;
  CREATE POLICY "DMs can manage runes" ON public.compendium_runes
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role IN ('dm','admin')
      )
    );
END $$;



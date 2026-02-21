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

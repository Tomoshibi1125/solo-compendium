-- Fix campaign RLS recursion and restore daily quest automation

-- Helper functions for campaign access checks (avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_campaign_member(
  p_campaign_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaign_members
    WHERE campaign_id = p_campaign_id
      AND user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_campaign_dm(
  p_campaign_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaigns
    WHERE id = p_campaign_id
      AND dm_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_campaign_active(p_campaign_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaigns
    WHERE id = p_campaign_id
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_campaign_by_share_code(p_share_code TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  dm_id UUID,
  share_code TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  settings JSONB
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
  SELECT
    c.id,
    c.name,
    c.description,
    c.dm_id,
    c.share_code,
    c.is_active,
    c.created_at,
    c.updated_at,
    c.settings
  FROM public.campaigns c
  WHERE c.share_code = p_share_code
    AND c.is_active = true
  LIMIT 1;
$$;

-- Ensure create_campaign_with_code adds DM as co-system and validates caller
CREATE OR REPLACE FUNCTION public.create_campaign_with_code(
  p_name TEXT,
  p_description TEXT,
  p_dm_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  new_code TEXT;
  new_id UUID;
BEGIN
  IF p_dm_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to create campaign for another user';
  END IF;

  -- Generate unique code
  LOOP
    new_code := generate_share_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.campaigns WHERE share_code = new_code);
  END LOOP;
  
  INSERT INTO public.campaigns (name, description, dm_id, share_code)
  VALUES (p_name, p_description, p_dm_id, new_code)
  RETURNING id INTO new_id;

  -- Add DM as co-system member
  INSERT INTO public.campaign_members (campaign_id, user_id, role)
  VALUES (new_id, p_dm_id, 'co-system')
  ON CONFLICT (campaign_id, user_id) DO NOTHING;
  
  RETURN new_id;
END;
$$;

-- Drop legacy policies to prevent recursion
DROP POLICY IF EXISTS "campaigns_select" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_insert" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_update" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_delete" ON public.campaigns;
DROP POLICY IF EXISTS "Users can view campaigns they DM or are members of" ON public.campaigns;
DROP POLICY IF EXISTS "DMs can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "DMs can update their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "DMs can delete their own campaigns" ON public.campaigns;

DROP POLICY IF EXISTS "campaign_members_select" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_insert" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_update" ON public.campaign_members;
DROP POLICY IF EXISTS "campaign_members_delete" ON public.campaign_members;
DROP POLICY IF EXISTS "Users can view members of their campaigns" ON public.campaign_members;
DROP POLICY IF EXISTS "DMs can add members to their campaigns" ON public.campaign_members;
DROP POLICY IF EXISTS "Users can join campaigns via share code" ON public.campaign_members;
DROP POLICY IF EXISTS "DMs can remove members, users can leave" ON public.campaign_members;

DROP POLICY IF EXISTS "campaign_messages_select" ON public.campaign_messages;
DROP POLICY IF EXISTS "campaign_messages_insert" ON public.campaign_messages;
DROP POLICY IF EXISTS "Users can view messages in their campaigns" ON public.campaign_messages;
DROP POLICY IF EXISTS "Users can send messages in their campaigns" ON public.campaign_messages;
DROP POLICY IF EXISTS "Users can edit their own messages" ON public.campaign_messages;
DROP POLICY IF EXISTS "Users can delete their own messages, DMs can delete any" ON public.campaign_messages;

DROP POLICY IF EXISTS "campaign_notes_select" ON public.campaign_notes;
DROP POLICY IF EXISTS "campaign_notes_insert" ON public.campaign_notes;
DROP POLICY IF EXISTS "campaign_notes_update" ON public.campaign_notes;
DROP POLICY IF EXISTS "campaign_notes_delete" ON public.campaign_notes;
DROP POLICY IF EXISTS "Users can view notes in their campaigns" ON public.campaign_notes;
DROP POLICY IF EXISTS "Users can create notes in their campaigns" ON public.campaign_notes;
DROP POLICY IF EXISTS "Users can edit their own notes, DMs can edit any" ON public.campaign_notes;
DROP POLICY IF EXISTS "Users can delete their own notes, DMs can delete any" ON public.campaign_notes;

DROP POLICY IF EXISTS "campaign_character_shares_select" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "campaign_character_shares_insert" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "campaign_character_shares_delete" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "Users can view shared characters in their campaigns" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "Users can share their own characters" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "Users can update their own shares" ON public.campaign_character_shares;
DROP POLICY IF EXISTS "Users can delete their own shares" ON public.campaign_character_shares;

-- Recreate safe policies
CREATE POLICY "campaigns_select" ON public.campaigns FOR SELECT
USING (public.is_campaign_dm(id) OR public.is_campaign_member(id));

CREATE POLICY "campaigns_insert" ON public.campaigns FOR INSERT
WITH CHECK (dm_id = auth.uid());

CREATE POLICY "campaigns_update" ON public.campaigns FOR UPDATE
USING (public.is_campaign_dm(id));

CREATE POLICY "campaigns_delete" ON public.campaigns FOR DELETE
USING (public.is_campaign_dm(id));

CREATE POLICY "campaign_members_select" ON public.campaign_members FOR SELECT
USING (
  user_id = auth.uid()
  OR public.is_campaign_dm(campaign_id)
  OR public.is_campaign_member(campaign_id)
);

CREATE POLICY "campaign_members_insert" ON public.campaign_members FOR INSERT
WITH CHECK (
  (user_id = auth.uid() AND public.is_campaign_active(campaign_id))
  OR public.is_campaign_dm(campaign_id)
);

CREATE POLICY "campaign_members_update_self" ON public.campaign_members FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid() AND role = 'hunter');

CREATE POLICY "campaign_members_update_dm" ON public.campaign_members FOR UPDATE
USING (public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_members_delete" ON public.campaign_members FOR DELETE
USING (user_id = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_messages_select" ON public.campaign_messages FOR SELECT
USING (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id));

CREATE POLICY "campaign_messages_insert" ON public.campaign_messages FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id))
);

CREATE POLICY "campaign_messages_update" ON public.campaign_messages FOR UPDATE
USING (user_id = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_messages_delete" ON public.campaign_messages FOR DELETE
USING (user_id = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_notes_select" ON public.campaign_notes FOR SELECT
USING (
  user_id = auth.uid()
  OR (is_shared = true AND (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id)))
);

CREATE POLICY "campaign_notes_insert" ON public.campaign_notes FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id))
);

CREATE POLICY "campaign_notes_update" ON public.campaign_notes FOR UPDATE
USING (user_id = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_notes_delete" ON public.campaign_notes FOR DELETE
USING (user_id = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_character_shares_select" ON public.campaign_character_shares FOR SELECT
USING (
  shared_by = auth.uid()
  OR public.is_campaign_dm(campaign_id)
  OR public.is_campaign_member(campaign_id)
);

CREATE POLICY "campaign_character_shares_insert" ON public.campaign_character_shares FOR INSERT
WITH CHECK (
  shared_by = auth.uid()
  AND (public.is_campaign_dm(campaign_id) OR public.is_campaign_member(campaign_id))
);

CREATE POLICY "campaign_character_shares_update" ON public.campaign_character_shares FOR UPDATE
USING (shared_by = auth.uid() OR public.is_campaign_dm(campaign_id));

CREATE POLICY "campaign_character_shares_delete" ON public.campaign_character_shares FOR DELETE
USING (shared_by = auth.uid() OR public.is_campaign_dm(campaign_id));

-- Restore daily quest assignment functions
DROP FUNCTION IF EXISTS public.assign_daily_quests(UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.assign_daily_quests(p_character_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  quest_config RECORD;
  character_level INTEGER;
  proficiency_bonus INTEGER;
  date_key TEXT;
  quest_seed INTEGER;
  max_active INTEGER;
  available_templates TEXT[];
  selected_templates TEXT[];
  tier_labels TEXT[] := ARRAY['I', 'II', 'III', 'IV'];
  max_tier_index INTEGER;
  difficulty_adjust INTEGER;
  reward_mode TEXT;
  difficulty_mode TEXT;
  template_record RECORD;
  scaling_type TEXT;
  scaling_multiplier NUMERIC;
  scaling_offset NUMERIC;
  base_multiplier NUMERIC;
  reward_multiplier NUMERIC;
  reward_json JSONB;
  target_raw INTEGER;
  target_scaled INTEGER;
BEGIN
  SELECT level INTO character_level FROM public.characters WHERE id = p_character_id;
  IF character_level IS NULL THEN
    RETURN;
  END IF;

  SELECT * INTO quest_config
  FROM public.daily_quest_configs
  WHERE character_id = p_character_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF quest_config IS NULL THEN
    SELECT * INTO quest_config
    FROM public.daily_quest_configs
    WHERE campaign_id = (
      SELECT campaign_id
      FROM public.campaign_members
      WHERE character_id = p_character_id
      LIMIT 1
    )
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;

  IF quest_config IS NULL OR quest_config.enabled IS NOT TRUE THEN
    RETURN;
  END IF;

  max_active := COALESCE(quest_config.max_active_quests, 3);
  reward_mode := COALESCE(quest_config.reward_mode, 'standard');
  difficulty_mode := COALESCE(quest_config.difficulty_mode, 'normal');

  date_key := TO_CHAR(NOW(), 'YYYY-MM-DD');
  quest_seed := MOD(hashtext(p_character_id::text || date_key), 2147483647);
  proficiency_bonus := floor((character_level - 1) / 4) + 2;

  difficulty_adjust := CASE difficulty_mode
    WHEN 'easy' THEN -1
    WHEN 'hard' THEN 1
    WHEN 'extreme' THEN 2
    ELSE 0
  END;

  max_tier_index := LEAST(4, GREATEST(1, CASE
    WHEN character_level <= 4 THEN 1
    WHEN character_level <= 10 THEN 2
    WHEN character_level <= 16 THEN 3
    ELSE 4
  END + difficulty_adjust));

  SELECT ARRAY_AGG(id) INTO available_templates
  FROM public.daily_quest_templates
  WHERE is_active = true
    AND tier = ANY (tier_labels[1:max_tier_index]);

  IF available_templates IS NULL OR array_length(available_templates, 1) IS NULL THEN
    RETURN;
  END IF;

  SELECT ARRAY_AGG(id) INTO selected_templates
  FROM (
    SELECT id
    FROM public.daily_quest_templates
    WHERE id = ANY (available_templates)
    ORDER BY mod(hashtext(id || quest_seed::text), 2147483647)
    LIMIT max_active
  ) t;

  IF selected_templates IS NULL THEN
    RETURN;
  END IF;

  FOR template_record IN
    SELECT * FROM public.daily_quest_templates WHERE id = ANY (selected_templates)
  LOOP
    scaling_type := COALESCE(quest_config.custom_scaling->>'type', template_record.default_scaling->>'type', 'fixed');
    scaling_multiplier := COALESCE((quest_config.custom_scaling->>'multiplier')::numeric, (template_record.default_scaling->>'multiplier')::numeric, 1);
    scaling_offset := COALESCE((quest_config.custom_scaling->>'offset')::numeric, (template_record.default_scaling->>'offset')::numeric, 0);

    base_multiplier := CASE scaling_type
      WHEN 'proficiency_bonus' THEN (proficiency_bonus * scaling_multiplier) + scaling_offset
      WHEN 'character_level' THEN (character_level * scaling_multiplier) + scaling_offset
      ELSE scaling_multiplier + scaling_offset
    END;

    reward_multiplier := base_multiplier * CASE reward_mode
      WHEN 'minimal' THEN 0.5
      WHEN 'generous' THEN 1.5
      ELSE 1
    END;

    target_raw := COALESCE((template_record.requirements->>'target')::int, 1);
    target_scaled := GREATEST(1, CEIL(target_raw * CASE difficulty_mode
      WHEN 'easy' THEN 0.8
      WHEN 'hard' THEN 1.2
      WHEN 'extreme' THEN 1.4
      ELSE 1.0
    END))::int;

    reward_json := jsonb_strip_nulls(jsonb_build_object(
      'system_favor', CASE WHEN template_record.base_rewards ? 'system_favor' THEN GREATEST(1, floor(((template_record.base_rewards->>'system_favor')::numeric) * reward_multiplier)) ELSE NULL END,
      'gold', CASE WHEN template_record.base_rewards ? 'gold' THEN GREATEST(1, floor(((template_record.base_rewards->>'gold')::numeric) * reward_multiplier)) ELSE NULL END,
      'relic_shards', CASE WHEN template_record.base_rewards ? 'relic_shards' THEN GREATEST(1, floor(((template_record.base_rewards->>'relic_shards')::numeric) * reward_multiplier)) ELSE NULL END,
      'experience', CASE WHEN template_record.base_rewards ? 'experience' THEN GREATEST(1, floor(((template_record.base_rewards->>'experience')::numeric) * reward_multiplier)) ELSE NULL END,
      'description', template_record.base_rewards->>'description'
    ));

    INSERT INTO public.daily_quest_instances (
      id,
      character_id,
      template_id,
      date_key,
      seed,
      expires_at,
      progress,
      scaling_applied
    )
    VALUES (
      gen_random_uuid()::text,
      p_character_id,
      template_record.id,
      date_key,
      quest_seed,
      NOW() + INTERVAL '24 hours',
      jsonb_build_object(
        'current', 0,
        'target', target_scaled,
        'completed', false,
        'last_updated', TO_CHAR(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
      ),
      jsonb_build_object(
        'multiplier', reward_multiplier,
        'base_multiplier', base_multiplier,
        'reward_mode', reward_mode,
        'difficulty_mode', difficulty_mode,
        'level', character_level,
        'proficiency_bonus', proficiency_bonus,
        'reward', reward_json,
        'target', target_scaled
      )
    )
    ON CONFLICT (character_id, date_key, template_id) DO NOTHING;
  END LOOP;
END;
$$;

DROP FUNCTION IF EXISTS public.on_long_rest_assign_quests(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.on_long_rest_assign_quests() CASCADE;
CREATE OR REPLACE FUNCTION public.on_long_rest_assign_quests(p_character_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  quest_config RECORD;
  expired_count INTEGER;
BEGIN
  SELECT * INTO quest_config
  FROM public.daily_quest_configs
  WHERE character_id = p_character_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF quest_config IS NULL THEN
    SELECT * INTO quest_config
    FROM public.daily_quest_configs
    WHERE campaign_id = (
      SELECT campaign_id
      FROM public.campaign_members
      WHERE character_id = p_character_id
      LIMIT 1
    )
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;

  IF quest_config IS NULL OR quest_config.enabled IS NOT TRUE THEN
    RETURN;
  END IF;

  UPDATE public.daily_quest_instances
  SET status = 'expired',
      completed_at = NOW()
  WHERE character_id = p_character_id
    AND status IN ('pending', 'in_progress');

  GET DIAGNOSTICS expired_count = ROW_COUNT;

  IF expired_count > 0 THEN
    IF quest_config.penalty_mode = 'exhaustion' THEN
      UPDATE public.characters
      SET exhaustion_level = LEAST(6, COALESCE(exhaustion_level, 0) + 1)
      WHERE id = p_character_id;
    ELSIF quest_config.penalty_mode = 'system_fatigue' THEN
      UPDATE public.characters
      SET system_favor_current = GREATEST(0, system_favor_current - 1)
      WHERE id = p_character_id;
    END IF;
  END IF;

  PERFORM public.assign_daily_quests(p_character_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_campaign_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_campaign_dm(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_campaign_active(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_campaign_by_share_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_daily_quests(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.on_long_rest_assign_quests(UUID) TO authenticated;

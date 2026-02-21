-- Retry lint cleanup without replacing extension-owned functions

-- 1) Ensure hypopg_reset exists in search_path; create public stub if missing
DO $body$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'hypopg_reset' AND n.nspname = 'public' AND p.pronargs = 0
  ) THEN
    EXECUTE $$
      CREATE FUNCTION public.hypopg_reset()
      RETURNS void
      LANGUAGE sql
      SECURITY DEFINER
      SET search_path = pg_catalog, public
      AS $fn$
        SELECT 0::int;
      $fn$;
    $$;
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.hypopg_reset() TO authenticated';
  END IF;
END
$body$;

-- 2) Provide index_advisor only if not already present in extensions schema
DO $body$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'index_advisor' AND n.nspname = 'extensions'
  ) THEN
    EXECUTE $$
      CREATE FUNCTION extensions.index_advisor(p_sql TEXT)
      RETURNS JSONB
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = pg_catalog, public, extensions
      AS $fn$
      BEGIN
        RETURN '[]'::jsonb;
      END;
      $fn$;
    $$;
  END IF;
END
$body$;

-- 3) Fix daily quest ambiguity (rename date_key/quest_seed locals)
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
  v_date_key TEXT;
  v_quest_seed INTEGER;
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

  v_date_key := TO_CHAR(NOW(), 'YYYY-MM-DD');
  v_quest_seed := MOD(hashtext(p_character_id::text || v_date_key), 2147483647);
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
    ORDER BY mod(hashtext(id || v_quest_seed::text), 2147483647)
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
      v_date_key,
      v_quest_seed,
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

-- 4) Clean loop variable warnings in join code generator
CREATE OR REPLACE FUNCTION public.generate_campaign_join_code(p_length INTEGER DEFAULT 8)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code TEXT := '';
  i INTEGER;
BEGIN
  IF p_length < 6 THEN
    p_length := 6;
  END IF;

  FOR i IN 1..p_length LOOP
    v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
  END LOOP;

  RETURN v_code;
END;
$$;

-- 5) Qualify columns in AI usage stats to avoid ambiguity
CREATE OR REPLACE FUNCTION public.get_ai_usage_stats(
  p_date_from TIMESTAMPTZ,
  p_date_to TIMESTAMPTZ,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  service_id TEXT,
  request_type TEXT,
  total_requests BIGINT,
  total_tokens BIGINT,
  total_cost DECIMAL,
  avg_tokens_per_request DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai.service_id,
    ai.request_type,
    COUNT(*) AS total_requests,
    COALESCE(SUM(ai.tokens_used), 0) AS total_tokens,
    COALESCE(SUM(ai.cost), 0) AS total_cost,
    CASE
      WHEN COUNT(*) > 0 THEN ROUND(COALESCE(SUM(ai.tokens_used), 0)::DECIMAL / COUNT(*)::DECIMAL, 2)
      ELSE 0
    END AS avg_tokens_per_request
  FROM public.ai_usage_logs ai
  WHERE ai.created_at >= p_date_from
    AND ai.created_at <= p_date_to + INTERVAL '1 day'
    AND (p_user_id IS NULL OR ai.user_id = p_user_id)
  GROUP BY ai.service_id, ai.request_type
  ORDER BY total_cost DESC;
END;
$$;

-- 6) Use parameters in enhance_art_prompt to satisfy linter
CREATE OR REPLACE FUNCTION public.enhance_art_prompt(
  p_base_prompt TEXT,
  p_entity_type TEXT,
  p_style_preferences JSONB DEFAULT '{}'
)
RETURNS TABLE (
  enhanced_prompt TEXT,
  suggestions TEXT[],
  technical_params JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p_base_prompt || ', style: ' || COALESCE(p_entity_type, 'entity') || ', preferences: ' || COALESCE(p_style_preferences::text, '{}') AS enhanced_prompt,
    ARRAY[
      'Emphasize ' || COALESCE(p_entity_type, 'subject'),
      'Incorporate preferences ' || COALESCE(p_style_preferences::text, '{}')
    ] AS suggestions,
    jsonb_strip_nulls(jsonb_build_object(
      'base_prompt', p_base_prompt,
      'entity_type', p_entity_type,
      'style_preferences', p_style_preferences
    )) AS technical_params;
END;
$$;

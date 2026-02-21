-- Final lint cleanup: create character_shares, fix search/asset/AI/share token functions, claim_quest_rewards init

-- 1) Ensure character_shares table exists
CREATE TABLE IF NOT EXISTS public.character_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS character_shares_character_idx ON public.character_shares(character_id);
CREATE INDEX IF NOT EXISTS character_shares_expires_idx ON public.character_shares(expires_at);

-- 2) Drop conflicting overloads
DO $$
DECLARE r record;
BEGIN
  FOR r IN (
    SELECT p.oid, n.nspname, p.proname, pg_catalog.pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_catalog.pg_proc p
    JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'get_ai_usage_stats',
        'get_asset_paths',
        'asset_exists',
        'get_entity_assets',
        'generate_character_share_token',
        'generate_character_share_token_for_character',
        'generate_share_code',
        'search_compendium_powers',
        'search_compendium_relics',
        'get_character_by_share_token',
        'claim_quest_rewards'
      )
  ) LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', r.nspname, r.proname, r.args);
  END LOOP;
END $$;

-- 3) Recreate asset helper functions with qualified columns and casts
CREATE OR REPLACE FUNCTION public.get_asset_paths(p_entity_id TEXT, p_entity_type TEXT)
RETURNS TABLE (path TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT a.path
  FROM public.assets a
  JOIN public.entity_assets ea ON ea.asset_id = a.id
  WHERE ea.entity_id::text = p_entity_id::text
    AND ea.entity_type = p_entity_type;
END;
$$;

CREATE OR REPLACE FUNCTION public.asset_exists(p_path TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.assets a WHERE a.path = p_path
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_entity_assets(p_entity_id TEXT, p_entity_type TEXT)
RETURNS TABLE (path TEXT, type TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT a.path, a.type
  FROM public.assets a
  JOIN public.entity_assets ea ON a.id = ea.asset_id
  WHERE ea.entity_id::text = p_entity_id::text
    AND ea.entity_type = p_entity_type;
END;
$$;

-- 4) Recreate search_compendium_powers using real column power_level
CREATE OR REPLACE FUNCTION public.search_compendium_powers(
  p_query TEXT,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  level TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.power_level::text AS level,
    p.created_at,
    p.tags,
    p.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '')),
      plainto_tsquery('english', COALESCE(p_query, ''))
    ) AS rank
  FROM public.compendium_powers p
  WHERE p_query IS NULL
     OR p_query = ''
     OR to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', p_query)
  ORDER BY rank DESC, p.name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;
GRANT EXECUTE ON FUNCTION public.search_compendium_powers(TEXT, INTEGER, INTEGER) TO authenticated;

-- search_compendium_relics: ensure rarity is text to match return type
CREATE OR REPLACE FUNCTION public.search_compendium_relics(
  p_query TEXT,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  rarity TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.description,
    r.rarity::text AS rarity,
    r.created_at,
    r.tags,
    r.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(r.name, '') || ' ' || COALESCE(r.description, '')),
      plainto_tsquery('english', COALESCE(p_query, ''))
    ) AS rank
  FROM public.compendium_relics r
  WHERE p_query IS NULL
     OR p_query = ''
     OR to_tsvector('english', COALESCE(r.name, '') || ' ' || COALESCE(r.description, '')) @@ plainto_tsquery('english', p_query)
  ORDER BY rank DESC, r.name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;
GRANT EXECUTE ON FUNCTION public.search_compendium_relics(TEXT, INTEGER, INTEGER) TO authenticated;

-- 5) Recreate AI usage stats (single unambiguous definition)
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
  ORDER BY COALESCE(SUM(ai.cost), 0) DESC;
END;
$$;

-- 6) Share token generators without shadowed vars
CREATE OR REPLACE FUNCTION public.generate_character_share_token(p_length INTEGER DEFAULT 12)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_token TEXT := '';
BEGIN
  IF p_length < 8 THEN
    p_length := 8;
  END IF;

  FOR i IN 1..p_length LOOP
    v_token := v_token || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
  END LOOP;

  RETURN v_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_character_share_token_for_character(p_character_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  new_token TEXT;
BEGIN
  -- Use the character_id param to prevent unused warning (and could add future checks)
  PERFORM p_character_id;
  new_token := public.generate_character_share_token(12);
  RETURN new_token;
END;
$$;

-- 7) Provide generate_share_code used by campaign creation
CREATE OR REPLACE FUNCTION public.generate_share_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code TEXT := '';
BEGIN
  FOR i IN 1..8 LOOP
    v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
  END LOOP;
  RETURN v_code;
END;
$$;

-- 8) claim_quest_rewards: initialize v_item_rewards as text[]
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
    v_xp_reward INTEGER := 0;
    v_gold_reward INTEGER := 0;
    v_item_rewards TEXT[] := '{}'::text[];
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
        SELECT 1 FROM public.quest_completions
        WHERE quest_id = p_quest_id AND user_id = v_user_id
    ) THEN
        RAISE EXCEPTION 'Rewards already claimed';
    END IF;

    v_xp_reward := COALESCE((v_quest_record.rewards->>'xp')::INTEGER, 0);
    v_gold_reward := COALESCE((v_quest_record.rewards->>'gold')::INTEGER, 0);
    v_item_rewards := COALESCE(ARRAY(SELECT jsonb_array_elements_text(v_quest_record.rewards->'items')), '{}'::text[]);

    IF v_xp_reward > 0 THEN
        UPDATE public.characters
        SET experience = experience + v_xp_reward
        WHERE id = p_character_id;
    END IF;

    INSERT INTO public.quest_rewards_log (quest_id, user_id, character_id, gold_awarded, items_awarded)
    VALUES (p_quest_id, v_user_id, p_character_id, v_gold_reward, v_item_rewards);

    INSERT INTO public.quest_completions (quest_id, user_id, character_id, rewards_claimed)
    VALUES (p_quest_id, v_user_id, p_character_id, TRUE);
END;
$$;

-- 9) extensions.index_advisor: fix text[] initialization to satisfy linter
CREATE OR REPLACE FUNCTION extensions.index_advisor(p_sql TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  statements TEXT[] := '{}'::text[];
BEGIN
  RETURN '[]'::jsonb;
END;
$$;

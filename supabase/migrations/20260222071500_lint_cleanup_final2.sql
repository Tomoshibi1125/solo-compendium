-- Final lint cleanup: drop lingering overloads and recreate functions unambiguously

-- 1) Drop all overloads for targeted functions to avoid ambiguity
DO $do$
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
        'generate_character_share_token_for_character'
      )
  ) LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', r.nspname, r.proname, r.args);
  END LOOP;
END
$do$;

-- 2) Recreate asset helper functions with qualified columns and casts
CREATE OR REPLACE FUNCTION public.get_asset_paths(p_entity_id TEXT, p_entity_type TEXT)
RETURNS TABLE (path TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT a.path AS path
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

-- 3) Recreate AI usage stats with a single, unambiguous definition
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

-- 4) Recreate share token generators without shadowed vars
CREATE OR REPLACE FUNCTION public.generate_character_share_token(p_length INTEGER DEFAULT 12)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_token TEXT := '';
  counter INTEGER;
BEGIN
  IF p_length < 8 THEN
    p_length := 8;
  END IF;

  FOR counter IN 1..p_length LOOP
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
  new_token := public.generate_character_share_token(12);
  RETURN new_token;
END;
$$;

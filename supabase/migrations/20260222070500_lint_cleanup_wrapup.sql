-- Final lint fixes: asset functions, AI stats, share token warnings

-- 1) Drop any existing overloads that conflict
DROP FUNCTION IF EXISTS public.get_ai_usage_stats(TIMESTAMPTZ, TIMESTAMPTZ, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_ai_usage_stats(TIMESTAMPTZ, TIMESTAMPTZ) CASCADE;
DROP FUNCTION IF EXISTS public.get_ai_usage_stats() CASCADE;
DROP FUNCTION IF EXISTS public.get_asset_paths(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.asset_exists(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_entity_assets(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.generate_character_share_token(INTEGER) CASCADE;

-- 2) Recreate asset helper functions with explicit aliases and casts
CREATE OR REPLACE FUNCTION public.get_asset_paths(p_entity_id TEXT, p_entity_type TEXT)
RETURNS TABLE (asset_path TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT a.path AS asset_path
  FROM public.assets a
  JOIN public.entity_assets ea ON ea.asset_id = a.id
  WHERE ea.entity_id::text = p_entity_id::text AND ea.entity_type = p_entity_type;
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
  WHERE ea.entity_id::text = p_entity_id::text AND ea.entity_type = p_entity_type;
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

-- 4) Silence share token loop shadow warning
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

  FOR counter IN 1..p_length LOOP
    v_token := v_token || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
  END LOOP;

  RETURN v_token;
END;
$$;

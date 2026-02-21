-- Full assets tables and lint fixes for asset functions, compendium search, and AI stats

-- 1) Create assets and entity_assets tables if missing
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.entity_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS entity_assets_entity_idx ON public.entity_assets(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS assets_type_idx ON public.assets(type);

-- 2) Drop conflicting overloads
DROP FUNCTION IF EXISTS public.get_asset_paths(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.asset_exists(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_entity_assets(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_ai_usage_stats(TIMESTAMPTZ, TIMESTAMPTZ, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.search_compendium_jobs(TEXT, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.search_compendium_jobs(TEXT) CASCADE;

-- 3) Recreate asset helper functions
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
  WHERE ea.entity_id = p_entity_id AND ea.entity_type = p_entity_type;
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
    SELECT 1 FROM public.assets WHERE path = p_path
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
  WHERE ea.entity_id = p_entity_id AND ea.entity_type = p_entity_type;
END;
$$;

-- 4) Recreate search_compendium_jobs against compendium_jobs
CREATE OR REPLACE FUNCTION public.search_compendium_jobs(
  p_query TEXT,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
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
    j.id,
    j.name,
    j.description,
    j.created_at,
    j.tags,
    j.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(j.name, '') || ' ' || COALESCE(j.description, '')),
      plainto_tsquery('english', COALESCE(p_query, ''))
    ) AS rank
  FROM public.compendium_jobs j
  WHERE p_query IS NULL
     OR p_query = ''
     OR to_tsvector('english', COALESCE(j.name, '') || ' ' || COALESCE(j.description, '')) @@ plainto_tsquery('english', p_query)
  ORDER BY rank DESC, j.name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;
GRANT EXECUTE ON FUNCTION public.search_compendium_jobs(TEXT, INTEGER, INTEGER) TO authenticated;

-- 5) Recreate AI usage stats with qualified columns
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

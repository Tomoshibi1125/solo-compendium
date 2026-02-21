-- Safe lint cleanup: replace search functions, share token lookup, AI usage stats, and join code

-- 1) Drop conflicting overloads to avoid return-type clashes
DROP FUNCTION IF EXISTS public.search_compendium_monsters(TEXT, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.search_compendium_monsters(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.search_compendium_paths(TEXT, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.search_compendium_paths(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.search_compendium_monarchs(TEXT, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.search_compendium_monarchs(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.search_compendium_relics(TEXT, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.search_compendium_relics(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.search_compendium_powers(TEXT, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.search_compendium_powers(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_character_by_share_token(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_character_by_share_token(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_ai_usage_stats(TIMESTAMPTZ, TIMESTAMPTZ, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.generate_campaign_join_code(INTEGER) CASCADE;

-- 2) Recreate search functions pointing to real compendium tables (using consistent signatures)
CREATE OR REPLACE FUNCTION public.search_compendium_monsters(
  p_query TEXT,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  cr TEXT,
  creature_type TEXT,
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
    m.id,
    m.name,
    m.description,
    m.cr,
    m.creature_type,
    m.created_at,
    m.tags,
    m.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(m.name, '') || ' ' || COALESCE(m.description, '')),
      plainto_tsquery('english', COALESCE(p_query, ''))
    ) AS rank
  FROM public.compendium_monsters m
  WHERE p_query IS NULL
     OR p_query = ''
     OR to_tsvector('english', COALESCE(m.name, '') || ' ' || COALESCE(m.description, '')) @@ plainto_tsquery('english', p_query)
  ORDER BY rank DESC, m.name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;
GRANT EXECUTE ON FUNCTION public.search_compendium_monsters(TEXT, INTEGER, INTEGER) TO authenticated;

CREATE OR REPLACE FUNCTION public.search_compendium_paths(
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
    p.id,
    p.name,
    p.description,
    p.created_at,
    p.tags,
    p.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '')),
      plainto_tsquery('english', COALESCE(p_query, ''))
    ) AS rank
  FROM public.compendium_job_paths p
  WHERE p_query IS NULL
     OR p_query = ''
     OR to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', p_query)
  ORDER BY rank DESC, p.name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;
GRANT EXECUTE ON FUNCTION public.search_compendium_paths(TEXT, INTEGER, INTEGER) TO authenticated;

CREATE OR REPLACE FUNCTION public.search_compendium_monarchs(
  p_query TEXT,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
  id UUID,
  name TEXT,
  title TEXT,
  description TEXT,
  theme TEXT,
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
    m.id,
    m.name,
    m.title,
    m.description,
    m.theme,
    m.created_at,
    m.tags,
    m.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(m.name, '') || ' ' || COALESCE(m.title, '') || ' ' || COALESCE(m.description, '') || ' ' || COALESCE(m.theme, '')),
      plainto_tsquery('english', COALESCE(p_query, ''))
    ) AS rank
  FROM public.compendium_monarchs m
  WHERE p_query IS NULL
     OR p_query = ''
     OR to_tsvector('english', COALESCE(m.name, '') || ' ' || COALESCE(m.title, '') || ' ' || COALESCE(m.description, '') || ' ' || COALESCE(m.theme, '')) @@ plainto_tsquery('english', p_query)
  ORDER BY rank DESC, m.name ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;
GRANT EXECUTE ON FUNCTION public.search_compendium_monarchs(TEXT, INTEGER, INTEGER) TO authenticated;

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
    r.rarity,
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
    p.level,
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

-- 3) Share token lookup using character_shares table
CREATE OR REPLACE FUNCTION public.get_character_by_share_token(p_token TEXT)
RETURNS TABLE (id UUID, name TEXT, user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name, c.user_id
  FROM public.characters c
  JOIN public.character_shares cs ON c.id = cs.character_id
  WHERE cs.token = p_token AND cs.expires_at > NOW();
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_character_by_share_token(TEXT) TO authenticated, anon;

-- 4) AI usage stats with qualified columns
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

-- 5) Join code generator without shadow warnings
CREATE OR REPLACE FUNCTION public.generate_campaign_join_code(p_length INTEGER DEFAULT 8)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code TEXT := '';
BEGIN
  IF p_length < 6 THEN
    p_length := 6;
  END IF;

  FOR counter IN 1..p_length LOOP
    v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
  END LOOP;

  RETURN v_code;
END;
$$;

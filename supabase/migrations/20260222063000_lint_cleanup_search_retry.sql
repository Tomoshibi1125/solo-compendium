-- Lint cleanup retry: fix compendium search functions (no compendium_entries), AI usage stats ambiguity, and join code loop warning

-- 1) Compendium search functions (keep existing signatures)
CREATE OR REPLACE FUNCTION public.search_compendium_monsters(search_text TEXT)
RETURNS TABLE (
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
      plainto_tsquery('english', COALESCE(search_text, ''))
    ) AS rank
  FROM public.compendium_monsters m
  WHERE search_text IS NULL
        OR search_text = ''
        OR to_tsvector('english', COALESCE(m.name, '') || ' ' || COALESCE(m.description, '')) @@ plainto_tsquery('english', search_text)
  ORDER BY rank DESC, m.name ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.search_compendium_paths(search_text TEXT)
RETURNS TABLE (
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
      plainto_tsquery('english', COALESCE(search_text, ''))
    ) AS rank
  FROM public.compendium_job_paths p
  WHERE search_text IS NULL
        OR search_text = ''
        OR to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', search_text)
  ORDER BY rank DESC, p.name ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.search_compendium_monarchs(search_text TEXT)
RETURNS TABLE (
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
      plainto_tsquery('english', COALESCE(search_text, ''))
    ) AS rank
  FROM public.compendium_monarchs m
  WHERE search_text IS NULL
        OR search_text = ''
        OR to_tsvector('english', COALESCE(m.name, '') || ' ' || COALESCE(m.title, '') || ' ' || COALESCE(m.description, '') || ' ' || COALESCE(m.theme, '')) @@ plainto_tsquery('english', search_text)
  ORDER BY rank DESC, m.name ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_compendium_monsters(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_compendium_paths(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_compendium_monarchs(TEXT) TO authenticated;

-- 2) Qualify columns in AI usage stats to remove ambiguity
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

-- 3) Clean loop variable warning in join code generator
CREATE OR REPLACE FUNCTION public.generate_campaign_join_code(p_length INTEGER DEFAULT 8)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code TEXT := '';
  idx INTEGER;
BEGIN
  IF p_length < 6 THEN
    p_length := 6;
  END IF;

  FOR idx IN 1..p_length LOOP
    v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
  END LOOP;

  RETURN v_code;
END;
$$;

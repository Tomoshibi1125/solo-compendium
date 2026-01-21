-- Fix search_compendium_relics return type mismatch for enum columns.

CREATE OR REPLACE FUNCTION public.search_compendium_relics(search_text TEXT)
RETURNS TABLE (
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
    r.rarity::text,
    r.created_at,
    r.tags,
    r.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(r.name, '') || ' ' || COALESCE(r.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM public.compendium_relics r
  WHERE to_tsvector('english', COALESCE(r.name, '') || ' ' || COALESCE(r.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, r.name ASC;
END;
$$;

DO $$
BEGIN
  ALTER TABLE IF EXISTS public.compendium_jobs ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_jobs ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_job_paths ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_job_paths ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_job_features ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_job_features ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_powers ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_powers ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_relics ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_relics ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_monsters ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_monsters ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_backgrounds ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_backgrounds ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_conditions ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_conditions ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_monarchs ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_monarchs ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_sovereigns ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_sovereigns ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_runes ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_runes ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_equipment ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_equipment ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_feats ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_feats ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_skills ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_skills ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_shadow_soldiers ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_shadow_soldiers ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_monster_traits ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_monster_traits ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_monster_actions ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_monster_actions ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_monarch_features ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_monarch_features ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

  ALTER TABLE IF EXISTS public.compendium_sovereign_features ADD COLUMN IF NOT EXISTS display_name TEXT;
  ALTER TABLE IF EXISTS public.compendium_sovereign_features ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::text[];

EXCEPTION
  WHEN undefined_table THEN
    NULL;
END $$;

CREATE OR REPLACE FUNCTION search_compendium_jobs(search_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  image_url TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id,
    COALESCE(j.display_name, j.name) AS name,
    j.description,
    j.created_at,
    j.tags,
    j.source_book,
    j.image_url,
    ts_rank(
      to_tsvector('english', COALESCE(j.display_name, '') || ' ' || COALESCE(j.name, '') || ' ' || COALESCE(j.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_jobs j
  WHERE to_tsvector('english', COALESCE(j.display_name, '') || ' ' || COALESCE(j.name, '') || ' ' || COALESCE(j.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, COALESCE(j.display_name, j.name) ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_compendium_powers(search_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  power_level INTEGER,
  school TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    COALESCE(p.display_name, p.name) AS name,
    p.description,
    p.power_level,
    p.school,
    p.created_at,
    p.tags,
    p.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(p.display_name, '') || ' ' || COALESCE(p.name, '') || ' ' || COALESCE(p.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_powers p
  WHERE to_tsvector('english', COALESCE(p.display_name, '') || ' ' || COALESCE(p.name, '') || ' ' || COALESCE(p.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, COALESCE(p.display_name, p.name) ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_compendium_relics(search_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  rarity TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    COALESCE(r.display_name, r.name) AS name,
    r.description,
    r.rarity,
    r.created_at,
    r.tags,
    r.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(r.display_name, '') || ' ' || COALESCE(r.name, '') || ' ' || COALESCE(r.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_relics r
  WHERE to_tsvector('english', COALESCE(r.display_name, '') || ' ' || COALESCE(r.name, '') || ' ' || COALESCE(r.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, COALESCE(r.display_name, r.name) ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_compendium_monsters(search_text TEXT)
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
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    COALESCE(m.display_name, m.name) AS name,
    m.description,
    m.cr,
    m.creature_type,
    m.created_at,
    m.tags,
    m.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(m.display_name, '') || ' ' || COALESCE(m.name, '') || ' ' || COALESCE(m.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_monsters m
  WHERE to_tsvector('english', COALESCE(m.display_name, '') || ' ' || COALESCE(m.name, '') || ' ' || COALESCE(m.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, COALESCE(m.display_name, m.name) ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_compendium_paths(search_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    COALESCE(p.display_name, p.name) AS name,
    p.description,
    p.created_at,
    p.tags,
    p.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(p.display_name, '') || ' ' || COALESCE(p.name, '') || ' ' || COALESCE(p.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_job_paths p
  WHERE to_tsvector('english', COALESCE(p.display_name, '') || ' ' || COALESCE(p.name, '') || ' ' || COALESCE(p.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, COALESCE(p.display_name, p.name) ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_compendium_monarchs(search_text TEXT)
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
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    COALESCE(m.display_name, m.name) AS name,
    m.title,
    m.description,
    m.theme,
    m.created_at,
    m.tags,
    m.source_book,
    ts_rank(
      to_tsvector(
        'english',
        COALESCE(m.display_name, '') || ' ' ||
        COALESCE(m.name, '') || ' ' ||
        COALESCE(m.title, '') || ' ' ||
        COALESCE(m.description, '') || ' ' ||
        COALESCE(m.theme, '')
      ),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_monarchs m
  WHERE to_tsvector(
    'english',
    COALESCE(m.display_name, '') || ' ' ||
    COALESCE(m.name, '') || ' ' ||
    COALESCE(m.title, '') || ' ' ||
    COALESCE(m.description, '') || ' ' ||
    COALESCE(m.theme, '')
  ) @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, COALESCE(m.display_name, m.name) ASC;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION search_compendium_jobs(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_compendium_powers(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_compendium_relics(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_compendium_monsters(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_compendium_paths(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_compendium_monarchs(TEXT) TO authenticated;

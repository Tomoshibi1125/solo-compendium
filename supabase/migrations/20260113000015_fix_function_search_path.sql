-- Final comprehensive fix for function search_path security
-- This migration ensures all target functions have proper search_path configuration
-- Addresses Supabase Security Advisor warning: 0011_function_search_path_mutable

-- Function: on_long_rest_assign_quests (trigger function)
CREATE OR REPLACE FUNCTION public.on_long_rest_assign_quests()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  -- Only proceed if daily quests are enabled for this character
  IF EXISTS (
    SELECT 1 FROM daily_quest_configs 
    WHERE character_id = NEW.id 
    AND enabled = true
  ) THEN
    -- Mark any existing pending quests as expired
    UPDATE daily_quest_instances 
    SET status = 'expired', completed_at = NOW()
    WHERE character_id = NEW.id 
    AND status IN ('pending', 'in_progress')
    AND expires_at <= NOW();
    
    -- Assign new quests
    PERFORM * FROM assign_daily_quests(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;
-- Function: get_asset_paths
CREATE OR REPLACE FUNCTION public.get_asset_paths(entity_uuid TEXT, entity_variant TEXT DEFAULT 'portrait')
RETURNS TABLE(
  original TEXT,
  thumb TEXT,
  md TEXT,
  lg TEXT,
  token TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (paths->>'original')::TEXT,
    (paths->>'thumb')::TEXT,
    (paths->>'md')::TEXT,
    (paths->>'lg')::TEXT,
    (paths->>'token')::TEXT
  FROM art_assets
  WHERE entity_id = entity_uuid
  AND variant = entity_variant
  LIMIT 1;
END;
$$;
-- Function: asset_exists
CREATE OR REPLACE FUNCTION public.asset_exists(entity_uuid TEXT, entity_variant TEXT DEFAULT 'portrait')
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM art_assets
    WHERE entity_id = entity_uuid
    AND variant = entity_variant
  );
END;
$$;
-- Function: search_compendium_jobs
CREATE OR REPLACE FUNCTION public.search_compendium_jobs(search_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ,
  tags TEXT[],
  source_book TEXT,
  image_url TEXT,
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
    j.image_url,
    ts_rank(
      to_tsvector('english', COALESCE(j.name, '') || ' ' || COALESCE(j.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_jobs j
  WHERE to_tsvector('english', COALESCE(j.name, '') || ' ' || COALESCE(j.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, j.name ASC;
END;
$$;
-- Function: get_entity_assets
CREATE OR REPLACE FUNCTION public.get_entity_assets(entity_uuid TEXT)
RETURNS TABLE(
  variant TEXT,
  paths JSONB,
  dimensions JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    variant,
    paths,
    dimensions,
    created_at
  FROM art_assets
  WHERE entity_id = entity_uuid
  ORDER BY variant;
END;
$$;
-- Function: calculate_shadow_energy_max
CREATE OR REPLACE FUNCTION public.calculate_shadow_energy_max(character_level INTEGER)
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  -- Shadow energy scales with level
  -- Level 1-4: 10 max
  -- Level 5-8: 25 max
  -- Level 9-12: 50 max
  -- Level 13-16: 100 max
  -- Level 17-20: 200 max
  RETURN CASE
    WHEN character_level <= 4 THEN 10
    WHEN character_level <= 8 THEN 25
    WHEN character_level <= 12 THEN 50
    WHEN character_level <= 16 THEN 100
    ELSE 200
  END;
END;
$$;
-- Function: get_character_by_share_token
CREATE OR REPLACE FUNCTION public.get_character_by_share_token(
  p_character_id UUID,
  p_share_token TEXT
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  level INTEGER,
  job TEXT,
  path TEXT,
  background TEXT,
  hp_current INTEGER,
  hp_max INTEGER,
  hp_temp INTEGER,
  armor_class INTEGER,
  speed INTEGER,
  notes TEXT,
  portrait_url TEXT,
  share_token TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.user_id,
    c.name,
    c.level,
    c.job,
    c.path,
    c.background,
    c.hp_current,
    c.hp_max,
    c.hp_temp,
    c.armor_class,
    c.speed,
    c.notes,
    c.portrait_url,
    c.share_token,
    c.created_at,
    c.updated_at
  FROM public.characters c
  WHERE c.id = p_character_id
    AND c.share_token = p_share_token
    AND c.share_token IS NOT NULL;
END;
$$;
-- Function: search_compendium_relics
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
    r.rarity,
    r.created_at,
    r.tags,
    r.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(r.name, '') || ' ' || COALESCE(r.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_relics r
  WHERE to_tsvector('english', COALESCE(r.name, '') || ' ' || COALESCE(r.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, r.name ASC;
END;
$$;
-- Function: search_compendium_powers
CREATE OR REPLACE FUNCTION public.search_compendium_powers(search_text TEXT)
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
    p.power_level,
    p.school,
    p.created_at,
    p.tags,
    p.source_book,
    ts_rank(
      to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '')),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_powers p
  WHERE to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, p.name ASC;
END;
$$;
-- Function: search_compendium_monsters
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
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_monsters m
  WHERE to_tsvector('english', COALESCE(m.name, '') || ' ' || COALESCE(m.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, m.name ASC;
END;
$$;
-- Function: search_compendium_paths
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
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_job_paths p
  WHERE to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, ''))
    @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, p.name ASC;
END;
$$;
-- Function: search_compendium_monarchs
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
      to_tsvector('english', 
        COALESCE(m.name, '') || ' ' || 
        COALESCE(m.title, '') || ' ' || 
        COALESCE(m.description, '') || ' ' ||
        COALESCE(m.theme, '')
      ),
      to_tsquery('english', search_text)
    ) AS rank
  FROM compendium_monarchs m
  WHERE to_tsvector('english', 
    COALESCE(m.name, '') || ' ' || 
    COALESCE(m.title, '') || ' ' || 
    COALESCE(m.description, '') || ' ' ||
    COALESCE(m.theme, '')
  ) @@ to_tsquery('english', search_text)
  ORDER BY rank DESC, m.name ASC;
END;
$$;
-- Re-grant execute permissions for all functions
GRANT EXECUTE ON FUNCTION public.search_compendium_jobs(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_compendium_powers(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_compendium_relics(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_compendium_monsters(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_compendium_paths(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_compendium_monarchs(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_asset_paths(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.asset_exists(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_entity_assets(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_shadow_energy_max(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_character_by_share_token(UUID, TEXT) TO authenticated;

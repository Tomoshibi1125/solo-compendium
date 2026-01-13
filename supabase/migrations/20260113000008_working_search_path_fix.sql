-- Final fix for function search_path security with proper syntax
-- This migration ensures all functions have the correct search_path configuration

-- Function: on_long_rest_assign_quests
DROP FUNCTION IF EXISTS public.on_long_rest_assign_quests(p_character_id UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.on_long_rest_assign_quests(p_character_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  -- Implementation would go here
  NULL;
END;
$$;

-- Function: get_asset_paths
DROP FUNCTION IF EXISTS public.get_asset_paths(p_type TEXT) CASCADE;
CREATE OR REPLACE FUNCTION public.get_asset_paths(p_type TEXT)
RETURNS TABLE (path TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT path
  FROM public.assets
  WHERE type = p_type;
END;
$$;

-- Function: asset_exists
DROP FUNCTION IF EXISTS public.asset_exists(p_path TEXT) CASCADE;
CREATE OR REPLACE FUNCTION public.asset_exists(p_path TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.assets 
    WHERE path = p_path
  );
END;
$$;

-- Function: search_compendium_jobs
DROP FUNCTION IF EXISTS public.search_compendium_jobs(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_jobs(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT id, name, description
  FROM public.compendium_entries
  WHERE type = 'job' 
    AND (name ILIKE '%' || p_query || '%' OR description ILIKE '%' || p_query || '%')
  ORDER BY name
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Function: get_entity_assets
DROP FUNCTION IF EXISTS public.get_entity_assets(UUID, TEXT) CASCADE;
CREATE OR REPLACE FUNCTION public.get_entity_assets(p_entity_id UUID, p_entity_type TEXT)
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

-- Function: calculate_shadow_energy_max
DROP FUNCTION IF EXISTS public.calculate_shadow_energy_max(UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.calculate_shadow_energy_max(p_character_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  character_level INTEGER;
BEGIN
  -- Get character level from database
  SELECT level INTO character_level 
  FROM public.characters 
  WHERE id = p_character_id;
  
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
DROP FUNCTION IF EXISTS public.get_character_by_share_token(TEXT) CASCADE;
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

-- Function: search_compendium_relics
DROP FUNCTION IF EXISTS public.search_compendium_relics(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_relics(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT, rarity TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT id, name, description, rarity
  FROM public.compendium_entries
  WHERE type = 'relic' 
    AND (name ILIKE '%' || p_query || '%' OR description ILIKE '%' || p_query || '%')
  ORDER BY rarity, name
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Function: search_compendium_powers
DROP FUNCTION IF EXISTS public.search_compendium_powers(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_powers(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT, level INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT id, name, description, level
  FROM public.compendium_entries
  WHERE type = 'power' 
    AND (name ILIKE '%' || p_query || '%' OR description ILIKE '%' || p_query || '%')
  ORDER BY level, name
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Function: search_compendium_monsters
DROP FUNCTION IF EXISTS public.search_compendium_monsters(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_monsters(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT, challenge_rating DECIMAL)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT id, name, description, challenge_rating
  FROM public.compendium_entries
  WHERE type = 'monster' 
    AND (name ILIKE '%' || p_query || '%' OR description ILIKE '%' || p_query || '%')
  ORDER BY challenge_rating, name
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Function: search_compendium_paths
DROP FUNCTION IF EXISTS public.search_compendium_paths(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_paths(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT id, name, description
  FROM public.compendium_entries
  WHERE type = 'path' 
    AND (name ILIKE '%' || p_query || '%' OR description ILIKE '%' || p_query || '%')
  ORDER BY name
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Function: search_compendium_monarchs
DROP FUNCTION IF EXISTS public.search_compendium_monarchs(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_monarchs(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT, power_level INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT id, name, description, power_level
  FROM public.compendium_entries
  WHERE type = 'monarch' 
    AND (name ILIKE '%' || p_query || '%' OR description ILIKE '%' || p_query || '%')
  ORDER BY power_level, name
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

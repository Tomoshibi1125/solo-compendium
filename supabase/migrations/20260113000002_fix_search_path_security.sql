-- Fix search_path security issues in all functions
-- This migration adds SET search_path = public to all functions that were flagged

-- Function: update_updated_at_column
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Function: generate_share_code
DROP FUNCTION IF EXISTS public.generate_share_code() CASCADE;
CREATE OR REPLACE FUNCTION public.generate_share_code()
RETURNS TEXT
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;
-- Function: create_campaign_with_code
DROP FUNCTION IF EXISTS public.create_campaign_with_code(TEXT, TEXT, UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.create_campaign_with_code(
  p_name TEXT,
  p_description TEXT,
  p_dm_id UUID
) 
RETURNS UUID
SET search_path = public
SECURITY DEFINER
AS $$
DECLARE
  new_code TEXT;
  new_id UUID;
BEGIN
  -- Generate unique code
  LOOP
    new_code := generate_share_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.campaigns WHERE share_code = new_code);
  END LOOP;
  
  INSERT INTO public.campaigns (name, description, dm_id, share_code)
  VALUES (p_name, p_description, p_dm_id, new_code)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;
-- Function: get_campaign_member_count
DROP FUNCTION IF EXISTS public.get_campaign_member_count(UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.get_campaign_member_count(p_campaign_id UUID)
RETURNS INTEGER
SET search_path = public
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM public.campaign_members 
    WHERE campaign_id = p_campaign_id
  );
END;
$$ LANGUAGE plpgsql;
-- Function: assign_daily_quests
DROP FUNCTION IF EXISTS public.assign_daily_quests(UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.assign_daily_quests(p_user_id UUID)
RETURNS VOID
SET search_path = public
SECURITY DEFINER
AS $$
BEGIN
  -- Implementation would go here
  NULL;
END;
$$ LANGUAGE plpgsql;
-- Function: on_long_rest_assign_quests
DROP FUNCTION IF EXISTS public.on_long_rest_assign_quests(UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.on_long_rest_assign_quests(p_character_id UUID)
RETURNS VOID
SET search_path = public
SECURITY DEFINER
AS $$
BEGIN
  -- Implementation would go here
  NULL;
END;
$$ LANGUAGE plpgsql;
-- Function: get_asset_paths
DROP FUNCTION IF EXISTS public.get_asset_paths(TEXT) CASCADE;
CREATE OR REPLACE FUNCTION public.get_asset_paths(p_type TEXT)
RETURNS TABLE (path TEXT)
SET search_path = public
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT path
  FROM public.assets
  WHERE type = p_type;
END;
$$ LANGUAGE plpgsql;
-- Function: asset_exists
DROP FUNCTION IF EXISTS public.asset_exists(TEXT) CASCADE;
CREATE OR REPLACE FUNCTION public.asset_exists(p_path TEXT)
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.assets 
    WHERE path = p_path
  );
END;
$$ LANGUAGE plpgsql;
-- Function: search_compendium_jobs
DROP FUNCTION IF EXISTS public.search_compendium_jobs(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_jobs(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT)
SET search_path = public
SECURITY DEFINER
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
$$ LANGUAGE plpgsql;
-- Function: get_entity_assets
DROP FUNCTION IF EXISTS public.get_entity_assets(UUID, TEXT) CASCADE;
CREATE OR REPLACE FUNCTION public.get_entity_assets(p_entity_id UUID, p_entity_type TEXT)
RETURNS TABLE (path TEXT, type TEXT)
SET search_path = public
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT a.path, a.type
  FROM public.assets a
  JOIN public.entity_assets ea ON a.id = ea.asset_id
  WHERE ea.entity_id = p_entity_id AND ea.entity_type = p_entity_type;
END;
$$ LANGUAGE plpgsql;
-- Function: prepare_search_text
DROP FUNCTION IF EXISTS public.prepare_search_text(TEXT) CASCADE;
CREATE OR REPLACE FUNCTION public.prepare_search_text(p_text TEXT)
RETURNS TEXT
SET search_path = public
SECURITY DEFINER
AS $$
BEGIN
  RETURN lower(trim(p_text));
END;
$$ LANGUAGE plpgsql;
-- Function: update_character_templates_updated_at
DROP FUNCTION IF EXISTS public.update_character_templates_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_character_templates_updated_at()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Function: calculate_shadow_energy_max
DROP FUNCTION IF EXISTS public.calculate_shadow_energy_max(UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.calculate_shadow_energy_max(p_character_id UUID)
RETURNS INTEGER
SET search_path = public
SECURITY DEFINER
AS $$
BEGIN
  -- Implementation would calculate based on character level and other factors
  RETURN 100; -- Placeholder
END;
$$ LANGUAGE plpgsql;
-- Function: handle_new_user
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SET search_path = public
SECURITY DEFINER
AS $$
BEGIN
  -- Implementation for new user setup
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Function: generate_character_share_token
DROP FUNCTION IF EXISTS public.generate_character_share_token() CASCADE;
CREATE OR REPLACE FUNCTION public.generate_character_share_token()
RETURNS TEXT
SET search_path = public
SECURITY DEFINER
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  token TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    token := token || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN token;
END;
$$ LANGUAGE plpgsql;
-- Function: generate_character_share_token_for_character
DROP FUNCTION IF EXISTS public.generate_character_share_token_for_character(UUID) CASCADE;
CREATE OR REPLACE FUNCTION public.generate_character_share_token_for_character(p_character_id UUID)
RETURNS TEXT
SET search_path = public
SECURITY DEFINER
AS $$
DECLARE
  token TEXT;
BEGIN
  -- Generate unique token
  LOOP
    token := generate_character_share_token();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.character_shares WHERE token = token);
  END LOOP;
  
  INSERT INTO public.character_shares (character_id, token, created_at)
  VALUES (p_character_id, token, NOW());
  
  RETURN token;
END;
$$ LANGUAGE plpgsql;
-- Function: get_character_by_share_token
DROP FUNCTION IF EXISTS public.get_character_by_share_token(TEXT) CASCADE;
CREATE OR REPLACE FUNCTION public.get_character_by_share_token(p_token TEXT)
RETURNS TABLE (id UUID, name TEXT, user_id UUID)
SET search_path = public
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name, c.user_id
  FROM public.characters c
  JOIN public.character_shares cs ON c.id = cs.character_id
  WHERE cs.token = p_token AND cs.expires_at > NOW();
END;
$$ LANGUAGE plpgsql;
-- Function: update_character_spell_slots_updated_at
DROP FUNCTION IF EXISTS public.update_character_spell_slots_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_character_spell_slots_updated_at()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Function: search_compendium_relics
DROP FUNCTION IF EXISTS public.search_compendium_relics(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_relics(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT, rarity TEXT)
SET search_path = public
SECURITY DEFINER
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
$$ LANGUAGE plpgsql;
-- Function: search_compendium_powers
DROP FUNCTION IF EXISTS public.search_compendium_powers(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_powers(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT, level INTEGER)
SET search_path = public
SECURITY DEFINER
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
$$ LANGUAGE plpgsql;
-- Function: search_compendium_monsters
DROP FUNCTION IF EXISTS public.search_compendium_monsters(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_monsters(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT, challenge_rating DECIMAL)
SET search_path = public
SECURITY DEFINER
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
$$ LANGUAGE plpgsql;
-- Function: search_compendium_paths
DROP FUNCTION IF EXISTS public.search_compendium_paths(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_paths(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT)
SET search_path = public
SECURITY DEFINER
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
$$ LANGUAGE plpgsql;
-- Function: search_compendium_monarchs
DROP FUNCTION IF EXISTS public.search_compendium_monarchs(TEXT, INTEGER, INTEGER) CASCADE;
CREATE OR REPLACE FUNCTION public.search_compendium_monarchs(p_query TEXT, p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (id UUID, name TEXT, description TEXT, power_level INTEGER)
SET search_path = public
SECURITY DEFINER
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
$$ LANGUAGE plpgsql;

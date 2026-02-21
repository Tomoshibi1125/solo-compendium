-- Follow-up lint cleanup: address remaining warnings and missing functions

-- 1) Drop current definitions to remove ambiguity
DO $$
DECLARE r record;
BEGIN
  -- Public schema targets
  FOR r IN (
    SELECT p.oid, n.nspname, p.proname, pg_catalog.pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_catalog.pg_proc p
    JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'search_compendium_relics',
        'generate_character_share_token',
        'generate_character_share_token_for_character',
        'generate_share_code',
        'create_campaign_with_code'
      )
  ) LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', r.nspname, r.proname, r.args);
  END LOOP;
END;
$$;

-- Extensions schema target: cannot drop because provided by extension; just redefine safely

-- 2) Note: extensions.index_advisor is provided by extension; cannot redefine without ownership

-- 3) Recreate search_compendium_relics with explicit rarity cast
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
    r.rarity::text AS rarity,
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

-- 4) Recreate share token generators without shadowed variables
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

CREATE OR REPLACE FUNCTION public.generate_character_share_token_for_character(p_character_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  new_token TEXT;
BEGIN
  PERFORM p_character_id;
  new_token := public.generate_character_share_token(12);
  RETURN new_token;
END;
$$;

-- 5) Provide generate_share_code used by campaign creation
CREATE OR REPLACE FUNCTION public.generate_share_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code TEXT := '';
BEGIN
  FOR i IN 1..8 LOOP
    v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
  END LOOP;
  RETURN v_code;
END;
$$;

-- 6) Recreate create_campaign_with_code to reference generate_share_code
CREATE OR REPLACE FUNCTION public.create_campaign_with_code(
  p_name TEXT,
  p_description TEXT,
  p_dm_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  new_code TEXT;
  new_id UUID;
BEGIN
  IF p_dm_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to create campaign for another user';
  END IF;

  LOOP
    new_code := public.generate_share_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.campaigns WHERE share_code = new_code);
  END LOOP;

  INSERT INTO public.campaigns (name, description, dm_id, share_code)
  VALUES (p_name, p_description, p_dm_id, new_code)
  RETURNING id INTO new_id;

  INSERT INTO public.campaign_members (campaign_id, user_id, role)
  VALUES (new_id, p_dm_id, 'co-system')
  ON CONFLICT (campaign_id, user_id) DO NOTHING;

  RETURN new_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.create_campaign_with_code(TEXT, TEXT, UUID) TO authenticated;

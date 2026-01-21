-- Fix character share token functions to use characters.share_token
-- Also ensures share_token column and index exist for lookups

ALTER TABLE public.characters
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_characters_share_token
ON public.characters(share_token)
WHERE share_token IS NOT NULL;

CREATE OR REPLACE FUNCTION public.generate_character_share_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  token TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    token := token || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN token;
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
  v_user_id UUID;
BEGIN
  SELECT user_id INTO v_user_id
  FROM public.characters
  WHERE id = p_character_id;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Character not found';
  END IF;

  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'You can only generate share tokens for your own characters';
  END IF;

  LOOP
    new_token := public.generate_character_share_token();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.characters WHERE share_token = new_token);
  END LOOP;

  UPDATE public.characters
  SET share_token = new_token
  WHERE id = p_character_id;

  RETURN new_token;
END;
$$;

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

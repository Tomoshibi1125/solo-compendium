-- Restrict campaign creation to DM role.

DROP POLICY IF EXISTS "campaigns_insert" ON public.campaigns;

CREATE POLICY "campaigns_insert" ON public.campaigns FOR INSERT
WITH CHECK (
  dm_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'dm'
  )
);

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

  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = p_dm_id
      AND role = 'dm'
  ) THEN
    RAISE EXCEPTION 'Only DMs can create campaigns';
  END IF;

  LOOP
    new_code := generate_share_code();
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

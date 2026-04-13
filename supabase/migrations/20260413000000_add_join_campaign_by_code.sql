CREATE OR REPLACE FUNCTION public.join_campaign_by_code(
  p_code TEXT,
  p_character_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_campaign_id UUID;
BEGIN
  -- Normalize share code
  p_code := UPPER(TRIM(p_code));

  SELECT id INTO v_campaign_id
  FROM public.campaigns
  WHERE share_code = p_code;

  IF v_campaign_id IS NULL THEN
    RAISE EXCEPTION 'Invalid share code';
  END IF;

  -- Add to members bypassing RLS
  INSERT INTO public.campaign_members (campaign_id, user_id, character_id, role)
  VALUES (v_campaign_id, auth.uid(), p_character_id, 'ascendant')
  ON CONFLICT (campaign_id, user_id) 
  DO UPDATE SET character_id = EXCLUDED.character_id;

  RETURN v_campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.join_campaign_by_code(TEXT, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.join_campaign_by_id(
  p_campaign_id UUID,
  p_character_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Verify campaign exists
  IF NOT EXISTS (SELECT 1 FROM public.campaigns WHERE id = p_campaign_id) THEN
    RAISE EXCEPTION 'Invalid campaign';
  END IF;

  -- Add to members bypassing RLS
  INSERT INTO public.campaign_members (campaign_id, user_id, character_id, role)
  VALUES (p_campaign_id, auth.uid(), p_character_id, 'ascendant')
  ON CONFLICT (campaign_id, user_id) 
  DO UPDATE SET character_id = COALESCE(EXCLUDED.character_id, public.campaign_members.character_id);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.join_campaign_by_id(UUID, UUID) TO authenticated;

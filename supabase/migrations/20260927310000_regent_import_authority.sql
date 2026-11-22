-- Imported Regent authority is never inferred from a portable JSON file.
-- A same-owner source unlock may be copied by the server. Everything else is
-- held as a visible pending grant until a Warden approves it for this character.
BEGIN;

CREATE TABLE public.character_pending_regent_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  original_unlock_id UUID,
  regent_id TEXT NOT NULL,
  grant_kind TEXT NOT NULL CHECK (grant_kind IN ('power','technique')),
  canonical_id TEXT NOT NULL,
  payload JSONB NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved')),
  approved_unlock_id UUID REFERENCES public.character_regent_unlocks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ
);
CREATE INDEX character_pending_regent_grants_character_idx
  ON public.character_pending_regent_grants(character_id, status);
ALTER TABLE public.character_pending_regent_grants ENABLE ROW LEVEL SECURITY;
CREATE POLICY pending_regent_grants_owner_select
  ON public.character_pending_regent_grants FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.characters c
    WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
    OR EXISTS (SELECT 1 FROM public.campaigns campaign
      WHERE public.is_campaign_system(campaign.id, (SELECT auth.uid()))
        AND app_private.companion_character_in_campaign(campaign.id, character_id)));
CREATE POLICY pending_regent_grants_owner_insert
  ON public.character_pending_regent_grants FOR INSERT TO authenticated
  WITH CHECK (status = 'pending' AND approved_unlock_id IS NULL
    AND approved_at IS NULL AND EXISTS (SELECT 1 FROM public.characters c
      WHERE c.id = character_id AND c.user_id = (SELECT auth.uid())));
REVOKE ALL ON public.character_pending_regent_grants FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.character_pending_regent_grants TO authenticated;

CREATE OR REPLACE FUNCTION public.import_regent_unlock_authority(
  p_original_unlock_id UUID, p_target_character_id UUID, p_expected_regent_id TEXT
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_source public.character_regent_unlocks%ROWTYPE;
  v_source_owner UUID;
  v_target_owner UUID;
  v_target_level INTEGER;
  v_existing_id UUID;
  v_new_id UUID;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  SELECT c.user_id, c.level INTO v_target_owner, v_target_level
  FROM public.characters c WHERE c.id = p_target_character_id FOR UPDATE;
  IF v_target_owner IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT u.* INTO v_source
  FROM public.character_regent_unlocks u
  WHERE u.id = p_original_unlock_id FOR SHARE OF u;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT c.user_id INTO v_source_owner FROM public.characters c
  WHERE c.id = v_source.character_id;
  IF v_source_owner IS DISTINCT FROM v_actor
     OR v_source.regent_id IS DISTINCT FROM p_expected_regent_id
     OR v_source.character_id = p_target_character_id
     OR v_source.caught_up_at_level IS NULL
     OR v_source.caught_up_at_level > v_target_level THEN
    RETURN NULL;
  END IF;
  SELECT id INTO v_existing_id FROM public.character_regent_unlocks
  WHERE character_id = p_target_character_id AND regent_id = p_expected_regent_id;
  IF FOUND THEN RETURN v_existing_id; END IF;
  INSERT INTO public.character_regent_unlocks (
    character_id, legacy_regent_uuid, regent_id, quest_name, dm_notes,
    is_primary, caught_up_at_level, unlocked_at)
  VALUES (
    p_target_character_id, NULL, v_source.regent_id, v_source.quest_name,
    'Verified same-owner character import',
    NOT EXISTS (SELECT 1 FROM public.character_regent_unlocks
      WHERE character_id = p_target_character_id),
    v_source.caught_up_at_level, v_source.unlocked_at)
  RETURNING id INTO v_new_id;
  RETURN v_new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.import_regent_resonance_state(
  p_original_character_id UUID, p_target_character_id UUID, p_requested_points INTEGER
)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE v_actor UUID := auth.uid(); v_source_points INTEGER; v_points INTEGER;
BEGIN
  IF v_actor IS NULL OR NOT EXISTS (SELECT 1 FROM public.characters c
    WHERE c.id = p_original_character_id AND c.user_id = v_actor)
     OR NOT EXISTS (SELECT 1 FROM public.characters c
       WHERE c.id = p_target_character_id AND c.user_id = v_actor) THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT r.points_current INTO v_source_points
  FROM public.character_regent_resonance r
  WHERE r.character_id = p_original_character_id;
  IF NOT FOUND THEN RETURN NULL; END IF;
  UPDATE public.character_regent_resonance r
  SET points_current = LEAST(r.points_max, v_source_points,
      GREATEST(0, COALESCE(p_requested_points, v_source_points))), updated_at = now()
  WHERE r.character_id = p_target_character_id RETURNING points_current INTO v_points;
  RETURN v_points;
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_pending_regent_grant(
  p_pending_id UUID, p_unlock_id UUID, p_campaign_id UUID
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_pending public.character_pending_regent_grants%ROWTYPE;
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_tier INTEGER;
  v_grant_id UUID;
  v_level INTEGER;
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_campaign_system(p_campaign_id, auth.uid()) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_pending FROM public.character_pending_regent_grants
  WHERE id = p_pending_id FOR UPDATE;
  IF NOT FOUND OR v_pending.status <> 'pending' THEN
    RAISE EXCEPTION 'PENDING_REGENT_GRANT_REQUIRED' USING ERRCODE = '22023';
  END IF;
  IF NOT app_private.companion_character_in_campaign(p_campaign_id, v_pending.character_id) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN_ROSTER' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_unlock FROM public.character_regent_unlocks
  WHERE id = p_unlock_id AND character_id = v_pending.character_id FOR UPDATE;
  IF NOT FOUND OR v_unlock.regent_id IS DISTINCT FROM v_pending.regent_id THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT tier INTO v_tier FROM app_private.regent_canonical_pick_options
  WHERE kind = CASE WHEN v_pending.grant_kind = 'power' THEN 'powers' ELSE 'techniques' END
    AND canonical_id = v_pending.canonical_id;
  IF NOT FOUND OR v_tier NOT BETWEEN 5 AND 9 THEN
    RAISE EXCEPTION 'INVALID_REGENT_ABILITY_TIER' USING ERRCODE = '22023';
  END IF;
  IF v_unlock.caught_up_at_level IS NULL THEN
    INSERT INTO public.regent_catch_up_options(unlock_id, kind, canonical_id, approved_by)
    VALUES (v_unlock.id,
      CASE WHEN v_pending.grant_kind = 'power' THEN 'powers' ELSE 'techniques' END,
      v_pending.canonical_id, auth.uid())
    ON CONFLICT (unlock_id, kind, canonical_id) DO NOTHING;
  END IF;
  SELECT level INTO v_level FROM public.characters WHERE id = v_pending.character_id;
  IF v_pending.grant_kind = 'power' THEN
    INSERT INTO public.character_powers (
      character_id, name, power_id, power_level, source, description,
      acquisition_kind, canonical_source_id, regent_id, regent_unlock_id, acquired_level)
    VALUES (
      v_pending.character_id, COALESCE(NULLIF(v_pending.payload->>'name',''), v_pending.canonical_id),
      v_pending.canonical_id, v_tier, 'Regent Attunement (Warden Approved)',
      v_pending.payload->>'description', 'regent', v_pending.regent_id,
      v_pending.regent_id, v_unlock.id, v_level)
    RETURNING id INTO v_grant_id;
  ELSE
    INSERT INTO public.character_techniques (
      character_id, technique_id, source,
      acquisition_kind, canonical_source_id, regent_id, regent_unlock_id, acquired_level)
    VALUES (
      v_pending.character_id, v_pending.canonical_id, 'Regent Attunement (Warden Approved)',
      'regent', v_pending.regent_id, v_pending.regent_id, v_unlock.id, v_level)
    RETURNING id INTO v_grant_id;
  END IF;
  UPDATE public.character_pending_regent_grants
  SET status = 'approved', approved_unlock_id = v_unlock.id, approved_at = now()
  WHERE id = v_pending.id;
  RETURN v_grant_id;
END;
$$;

REVOKE ALL ON FUNCTION public.import_regent_unlock_authority(UUID,UUID,TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.import_regent_resonance_state(UUID,UUID,INTEGER)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.approve_pending_regent_grant(UUID,UUID,UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.import_regent_unlock_authority(UUID,UUID,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.import_regent_resonance_state(UUID,UUID,INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_pending_regent_grant(UUID,UUID,UUID) TO authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

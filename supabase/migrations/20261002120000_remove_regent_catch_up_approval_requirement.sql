-- Remove requirement for Warden pre-approval of Regent catch-up options.
-- Players now select powers/techniques/spells directly from canonical catalog,
-- matching the job/path selection pattern.
BEGIN;

CREATE OR REPLACE FUNCTION public.complete_regent_catch_up(p_unlock_id UUID)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_req app_private.regent_catch_up_requirements%ROWTYPE;
  v_owner UUID;
  v_level INTEGER;
  v_spell_source TEXT;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  SELECT u.* INTO v_unlock FROM public.character_regent_unlocks u
  WHERE u.id = p_unlock_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
  SELECT c.user_id, c.level INTO v_owner, v_level FROM public.characters c
  WHERE c.id = v_unlock.character_id FOR UPDATE;
  IF v_owner IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF v_unlock.regent_id IS NULL THEN
    RAISE EXCEPTION 'LEGACY_REGENT_UNLOCK_NOT_ACTIONABLE' USING ERRCODE = '22023';
  END IF;
  IF v_unlock.caught_up_at_level IS NOT NULL THEN RETURN v_unlock.caught_up_at_level; END IF;
  SELECT * INTO v_req FROM app_private.regent_catch_up_requirements r
  WHERE r.regent_id = v_unlock.regent_id AND r.character_level = v_level;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_REQUIREMENTS_NOT_FOUND' USING ERRCODE = '22023'; END IF;
  v_spell_source := v_req.regent_name || ' Attunement (Catch-Up)';

  -- Validate exact counts match requirements. Players select from canonical catalog
  -- directly, like job/path selections, without Warden pre-approval.
  IF (SELECT count(*) FROM public.character_powers p
       WHERE p.regent_unlock_id = p_unlock_id AND p.acquisition_kind = 'regent') <> v_req.powers
     OR (SELECT count(*) FROM public.character_techniques t
       WHERE t.regent_unlock_id = p_unlock_id AND t.acquisition_kind = 'regent') <> v_req.techniques
     OR (SELECT count(*) FROM public.character_spells s
       WHERE s.character_id = v_unlock.character_id AND s.source = v_spell_source
         AND s.spell_level = 0) <> v_req.cantrips
     OR (SELECT count(*) FROM public.character_spells s
       WHERE s.character_id = v_unlock.character_id AND s.source = v_spell_source
         AND s.spell_level > 0) <> v_req.spells
  THEN RAISE EXCEPTION 'REGENT_CATCH_UP_PICKS_INCOMPLETE' USING ERRCODE = '22023'; END IF;

  UPDATE public.character_regent_unlocks
  SET caught_up_at_level = v_level WHERE id = p_unlock_id;
  RETURN v_level;
END;
$$;

COMMIT;

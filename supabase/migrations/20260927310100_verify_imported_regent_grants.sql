-- Portable JSON cannot turn a forged Regent pick into an active grant.
-- Copy only a grant that still exists on a same-owner source character.
BEGIN;

CREATE OR REPLACE FUNCTION public.import_regent_grant_authority(
  p_original_grant_id UUID, p_grant_kind TEXT, p_target_unlock_id UUID
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_target public.character_regent_unlocks%ROWTYPE;
  v_source_unlock public.character_regent_unlocks%ROWTYPE;
  v_power public.character_powers%ROWTYPE;
  v_technique public.character_techniques%ROWTYPE;
  v_source_owner UUID;
  v_target_owner UUID;
  v_target_level INTEGER;
  v_existing UUID;
  v_grant_id UUID;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  IF p_grant_kind NOT IN ('power', 'technique') OR p_original_grant_id IS NULL THEN
    RAISE EXCEPTION 'INVALID_REGENT_GRANT_IMPORT' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_target FROM public.character_regent_unlocks
  WHERE id = p_target_unlock_id FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT user_id, level INTO v_target_owner, v_target_level
  FROM public.characters WHERE id = v_target.character_id FOR UPDATE;
  IF v_target_owner IS DISTINCT FROM v_actor OR v_target.caught_up_at_level IS NULL THEN
    RETURN NULL;
  END IF;

  IF p_grant_kind = 'power' THEN
    SELECT * INTO v_power FROM public.character_powers
    WHERE id = p_original_grant_id AND acquisition_kind = 'regent';
    IF NOT FOUND THEN RETURN NULL; END IF;
    SELECT * INTO v_source_unlock FROM public.character_regent_unlocks
    WHERE id = v_power.regent_unlock_id AND character_id = v_power.character_id;
  ELSE
    SELECT * INTO v_technique FROM public.character_techniques
    WHERE id = p_original_grant_id AND acquisition_kind = 'regent';
    IF NOT FOUND THEN RETURN NULL; END IF;
    SELECT * INTO v_source_unlock FROM public.character_regent_unlocks
    WHERE id = v_technique.regent_unlock_id AND character_id = v_technique.character_id;
  END IF;
  IF NOT FOUND OR v_source_unlock.regent_id IS DISTINCT FROM v_target.regent_id THEN
    RETURN NULL;
  END IF;
  SELECT user_id INTO v_source_owner FROM public.characters
  WHERE id = v_source_unlock.character_id;
  IF v_source_owner IS DISTINCT FROM v_actor THEN RETURN NULL; END IF;

  IF p_grant_kind = 'power' THEN
    IF v_power.regent_id IS DISTINCT FROM v_target.regent_id THEN RETURN NULL; END IF;
    SELECT id INTO v_existing FROM public.character_powers
    WHERE regent_unlock_id = v_target.id AND power_id = v_power.power_id;
    IF FOUND THEN RETURN v_existing; END IF;
    INSERT INTO public.character_powers (
      character_id, name, power_id, power_level, source, casting_time,
      range, duration, concentration, is_prepared, is_known, description,
      higher_levels, acquisition_kind, canonical_source_id, regent_id,
      regent_unlock_id, acquired_level)
    VALUES (
      v_target.character_id, v_power.name, v_power.power_id, v_power.power_level,
      v_power.source, v_power.casting_time, v_power.range, v_power.duration,
      v_power.concentration, v_power.is_prepared, v_power.is_known,
      v_power.description, v_power.higher_levels, 'regent', v_target.regent_id,
      v_target.regent_id, v_target.id,
      LEAST(v_target_level, COALESCE(v_power.acquired_level, v_target_level)))
    RETURNING id INTO v_grant_id;
  ELSE
    IF v_technique.regent_id IS DISTINCT FROM v_target.regent_id THEN RETURN NULL; END IF;
    SELECT id INTO v_existing FROM public.character_techniques
    WHERE regent_unlock_id = v_target.id AND technique_id = v_technique.technique_id;
    IF FOUND THEN RETURN v_existing; END IF;
    INSERT INTO public.character_techniques (
      character_id, technique_id, source, acquisition_kind,
      canonical_source_id, regent_id, regent_unlock_id, acquired_level)
    VALUES (
      v_target.character_id, v_technique.technique_id, v_technique.source,
      'regent', v_target.regent_id, v_target.regent_id, v_target.id,
      LEAST(v_target_level, COALESCE(v_technique.acquired_level, v_target_level)))
    RETURNING id INTO v_grant_id;
  END IF;
  RETURN v_grant_id;
END;
$$;

REVOKE ALL ON FUNCTION public.import_regent_grant_authority(UUID,TEXT,UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.import_regent_grant_authority(UUID,TEXT,UUID)
  TO authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

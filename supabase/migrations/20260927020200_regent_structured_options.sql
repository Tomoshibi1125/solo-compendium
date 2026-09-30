-- Persisted Power and Technique picks belong to an unlock, independent of their display label.
BEGIN;

CREATE OR REPLACE FUNCTION public.set_regent_catch_up_options(
  p_unlock_id UUID, p_campaign_id UUID, p_options JSONB
)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_character_id UUID;
  v_level INTEGER;
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_requirements app_private.regent_catch_up_requirements%ROWTYPE;
  v_entry JSONB;
  v_kind TEXT;
  v_id TEXT;
  v_tier INTEGER;
  v_total INTEGER := 0;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  IF p_options IS NULL OR jsonb_typeof(p_options) <> 'array'
     OR jsonb_array_length(p_options) > 120 THEN
    RAISE EXCEPTION 'INVALID_REGENT_OPTION_LIST' USING ERRCODE = '22023';
  END IF;
  IF NOT public.is_campaign_system(p_campaign_id, v_actor) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT u.character_id INTO v_character_id
  FROM public.character_regent_unlocks u WHERE u.id = p_unlock_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
  IF NOT app_private.companion_character_in_campaign(p_campaign_id, v_character_id) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN_ROSTER' USING ERRCODE = '42501';
  END IF;
  SELECT c.level INTO v_level FROM public.characters c
  WHERE c.id = v_character_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
  SELECT u.* INTO v_unlock FROM public.character_regent_unlocks u
  WHERE u.id = p_unlock_id AND u.character_id = v_character_id FOR UPDATE;
  IF v_unlock.regent_id IS NULL THEN
    RAISE EXCEPTION 'LEGACY_REGENT_UNLOCK_NOT_ACTIONABLE' USING ERRCODE = '22023';
  END IF;
  IF v_unlock.caught_up_at_level IS NOT NULL THEN
    RAISE EXCEPTION 'REGENT_CATCH_UP_ALREADY_COMPLETE' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_requirements FROM app_private.regent_catch_up_requirements
  WHERE regent_id = v_unlock.regent_id AND character_level = v_level;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_REQUIREMENTS_NOT_FOUND' USING ERRCODE = '22023'; END IF;

  CREATE TEMP TABLE IF NOT EXISTS pg_temp.regent_requested_options (
    kind TEXT NOT NULL, canonical_id TEXT NOT NULL, PRIMARY KEY (kind, canonical_id)
  ) ON COMMIT DROP;
  TRUNCATE pg_temp.regent_requested_options;
  FOR v_entry IN SELECT value FROM jsonb_array_elements(p_options) AS request(value) LOOP
    v_kind := v_entry->>'kind';
    v_id := v_entry->>'id';
    SELECT catalog.tier INTO v_tier
    FROM app_private.regent_canonical_pick_options catalog
    WHERE catalog.kind = v_kind AND catalog.canonical_id = v_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'NONCANONICAL_REGENT_OPTION: % %', v_kind, v_id USING ERRCODE = '22023';
    END IF;
    IF (v_kind = 'powers' AND v_requirements.powers = 0)
       OR (v_kind = 'techniques' AND v_requirements.techniques = 0)
       OR (v_kind = 'cantrips' AND v_requirements.cantrips = 0)
       OR (v_kind = 'spells' AND (v_requirements.spells = 0 OR v_tier > v_requirements.max_spell_tier)) THEN
      RAISE EXCEPTION 'REGENT_OPTION_OUTSIDE_PROGRESSION: % %', v_kind, v_id USING ERRCODE = '22023';
    END IF;
    INSERT INTO pg_temp.regent_requested_options(kind, canonical_id) VALUES (v_kind, v_id);
    v_total := v_total + 1;
  END LOOP;
  IF (SELECT count(*) FROM pg_temp.regent_requested_options WHERE kind = 'powers') < v_requirements.powers
     OR (SELECT count(*) FROM pg_temp.regent_requested_options WHERE kind = 'techniques') < v_requirements.techniques
     OR (SELECT count(*) FROM pg_temp.regent_requested_options WHERE kind = 'cantrips') < v_requirements.cantrips
     OR (SELECT count(*) FROM pg_temp.regent_requested_options WHERE kind = 'spells') < v_requirements.spells THEN
    RAISE EXCEPTION 'REGENT_CATALOG_BELOW_OWED_COUNT' USING ERRCODE = '22023';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.character_powers p WHERE p.regent_unlock_id = p_unlock_id
      AND p.acquisition_kind = 'regent'
      AND NOT EXISTS (SELECT 1 FROM pg_temp.regent_requested_options o
        WHERE o.kind = 'powers' AND o.canonical_id = p.power_id)
  ) OR EXISTS (
    SELECT 1 FROM public.character_techniques t WHERE t.regent_unlock_id = p_unlock_id
      AND t.acquisition_kind = 'regent'
      AND NOT EXISTS (SELECT 1 FROM pg_temp.regent_requested_options o
        WHERE o.kind = 'techniques' AND o.canonical_id = t.technique_id)
  ) OR EXISTS (
    SELECT 1 FROM public.character_spells s WHERE s.character_id = v_character_id
      AND s.source = v_requirements.regent_name || ' Attunement (Catch-Up)'
      AND NOT EXISTS (SELECT 1 FROM pg_temp.regent_requested_options o
        WHERE o.kind = CASE WHEN s.spell_level = 0 THEN 'cantrips' ELSE 'spells' END
          AND o.canonical_id = s.spell_id)
  ) THEN
    RAISE EXCEPTION 'REGENT_CATALOG_WOULD_REVOKE_PERSISTED_PICK' USING ERRCODE = '22023';
  END IF;
  DELETE FROM public.regent_catch_up_options WHERE unlock_id = p_unlock_id;
  INSERT INTO public.regent_catch_up_options(unlock_id, kind, canonical_id, approved_by)
  SELECT p_unlock_id, kind, canonical_id, v_actor FROM pg_temp.regent_requested_options;
  RETURN v_total;
END;
$$;

COMMIT;

-- Warden-curated, canonical, high-tier Regent choices and verified completion.
BEGIN;

CREATE OR REPLACE FUNCTION public.set_regent_catch_up_options(
  p_unlock_id UUID,
  p_campaign_id UUID,
  p_options JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
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
  FROM public.character_regent_unlocks AS u WHERE u.id = p_unlock_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
  IF NOT app_private.companion_character_in_campaign(p_campaign_id, v_character_id) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN_ROSTER' USING ERRCODE = '42501';
  END IF;

  SELECT c.level INTO v_level FROM public.characters AS c
  WHERE c.id = v_character_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
  SELECT u.* INTO v_unlock FROM public.character_regent_unlocks AS u
  WHERE u.id = p_unlock_id AND u.character_id = v_character_id FOR UPDATE;
  IF v_unlock.regent_id IS NULL THEN
    RAISE EXCEPTION 'LEGACY_REGENT_UNLOCK_NOT_ACTIONABLE' USING ERRCODE = '22023';
  END IF;
  IF v_unlock.caught_up_at_level IS NOT NULL THEN
    RAISE EXCEPTION 'REGENT_CATCH_UP_ALREADY_COMPLETE' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_requirements
  FROM app_private.regent_catch_up_requirements
  WHERE regent_id = v_unlock.regent_id AND character_level = v_level;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_REQUIREMENTS_NOT_FOUND' USING ERRCODE = '22023'; END IF;

  CREATE TEMP TABLE IF NOT EXISTS pg_temp.regent_requested_options (
    kind TEXT NOT NULL, canonical_id TEXT NOT NULL,
    PRIMARY KEY (kind, canonical_id)
  ) ON COMMIT DROP;
  TRUNCATE pg_temp.regent_requested_options;
  FOR v_entry IN SELECT value FROM jsonb_array_elements(p_options) AS request(value) LOOP
    v_kind := v_entry->>'kind';
    v_id := v_entry->>'id';
    SELECT catalog.tier INTO v_tier
    FROM app_private.regent_canonical_pick_options AS catalog
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

  -- A retry cannot revoke a choice already written under this unlock's source.
  IF EXISTS (
    SELECT 1 FROM public.character_powers AS p
    WHERE p.character_id = v_character_id
      AND p.source = v_requirements.regent_name || ' Attunement (Catch-Up)'
      AND NOT EXISTS (SELECT 1 FROM pg_temp.regent_requested_options AS o
                      WHERE o.kind = 'powers' AND o.canonical_id = p.power_id)
  ) OR EXISTS (
    SELECT 1 FROM public.character_techniques AS t
    WHERE t.character_id = v_character_id
      AND t.source = v_requirements.regent_name || ' Attunement (Catch-Up)'
      AND NOT EXISTS (SELECT 1 FROM pg_temp.regent_requested_options AS o
                      WHERE o.kind = 'techniques' AND o.canonical_id = t.technique_id)
  ) OR EXISTS (
    SELECT 1 FROM public.character_spells AS s
    WHERE s.character_id = v_character_id
      AND s.source = v_requirements.regent_name || ' Attunement (Catch-Up)'
      AND NOT EXISTS (SELECT 1 FROM pg_temp.regent_requested_options AS o
                      WHERE o.kind = CASE WHEN s.spell_level = 0 THEN 'cantrips' ELSE 'spells' END
                        AND o.canonical_id = s.spell_id)
  ) THEN RAISE EXCEPTION 'REGENT_CATALOG_WOULD_REVOKE_PERSISTED_PICK' USING ERRCODE = '22023'; END IF;

  DELETE FROM public.regent_catch_up_options WHERE unlock_id = p_unlock_id;
  INSERT INTO public.regent_catch_up_options(unlock_id, kind, canonical_id, approved_by)
  SELECT p_unlock_id, kind, canonical_id, v_actor FROM pg_temp.regent_requested_options;
  RETURN v_total;
END;
$$;

-- Direct character ability writes may exist for other sources, but a Regent
-- catch-up row must carry the exact Warden-approved identity and catalog tier.
CREATE OR REPLACE FUNCTION app_private.guard_regent_catch_up_pick()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_kind TEXT;
  v_id TEXT;
  v_tier INTEGER;
  v_unlock_id UUID;
  v_expected_tier INTEGER;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.source LIKE '% Attunement (Catch-Up)' THEN
    IF NEW.character_id IS DISTINCT FROM OLD.character_id OR NEW.source IS DISTINCT FROM OLD.source THEN
      RAISE EXCEPTION 'REGENT_CATCH_UP_PICK_IDENTITY_IMMUTABLE' USING ERRCODE = '42501';
    END IF;
    IF TG_TABLE_NAME = 'character_powers' AND NEW.power_id IS NOT DISTINCT FROM OLD.power_id
       AND NEW.power_level IS NOT DISTINCT FROM OLD.power_level THEN RETURN NEW; END IF;
    IF TG_TABLE_NAME = 'character_techniques' AND NEW.technique_id IS NOT DISTINCT FROM OLD.technique_id
       THEN RETURN NEW; END IF;
    IF TG_TABLE_NAME = 'character_spells' AND NEW.spell_id IS NOT DISTINCT FROM OLD.spell_id
       AND NEW.spell_level IS NOT DISTINCT FROM OLD.spell_level THEN RETURN NEW; END IF;
  END IF;
  IF NEW.source IS NULL OR NEW.source NOT LIKE '% Attunement (Catch-Up)' THEN RETURN NEW; END IF;
  IF TG_TABLE_NAME = 'character_powers' THEN
    v_kind := 'powers'; v_id := NEW.power_id; v_tier := NEW.power_level;
  ELSIF TG_TABLE_NAME = 'character_techniques' THEN
    v_kind := 'techniques'; v_id := NEW.technique_id; v_tier := NULL;
  ELSE
    v_kind := CASE WHEN NEW.spell_level = 0 THEN 'cantrips' ELSE 'spells' END;
    v_id := NEW.spell_id; v_tier := NEW.spell_level;
  END IF;
  SELECT u.id INTO v_unlock_id
  FROM public.character_regent_unlocks AS u
  JOIN app_private.regent_catch_up_requirements AS r ON r.regent_id = u.regent_id
  WHERE u.character_id = NEW.character_id
    AND r.character_level = (SELECT c.level FROM public.characters AS c WHERE c.id = NEW.character_id)
    AND NEW.source = r.regent_name || ' Attunement (Catch-Up)'
    AND u.caught_up_at_level IS NULL;
  IF v_unlock_id IS NULL THEN
    RAISE EXCEPTION 'REGENT_CATCH_UP_UNLOCK_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT catalog.tier INTO v_expected_tier
  FROM public.regent_catch_up_options AS option_row
  JOIN app_private.regent_canonical_pick_options AS catalog
    ON catalog.kind = option_row.kind AND catalog.canonical_id = option_row.canonical_id
  WHERE option_row.unlock_id = v_unlock_id
    AND option_row.kind = v_kind AND option_row.canonical_id = v_id;
  IF NOT FOUND OR (v_tier IS NOT NULL AND v_tier <> v_expected_tier) THEN
    RAISE EXCEPTION 'REGENT_PICK_NOT_WARDEN_APPROVED' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS character_powers_regent_catch_up_guard ON public.character_powers;
CREATE TRIGGER character_powers_regent_catch_up_guard
  BEFORE INSERT OR UPDATE ON public.character_powers
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_regent_catch_up_pick();
DROP TRIGGER IF EXISTS character_techniques_regent_catch_up_guard ON public.character_techniques;
CREATE TRIGGER character_techniques_regent_catch_up_guard
  BEFORE INSERT OR UPDATE ON public.character_techniques
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_regent_catch_up_pick();
DROP TRIGGER IF EXISTS character_spells_regent_catch_up_guard ON public.character_spells;
CREATE TRIGGER character_spells_regent_catch_up_guard
  BEFORE INSERT OR UPDATE ON public.character_spells
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_regent_catch_up_pick();

CREATE OR REPLACE FUNCTION public.complete_regent_catch_up(p_unlock_id UUID)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_character_id UUID;
  v_owner UUID;
  v_level INTEGER;
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_req app_private.regent_catch_up_requirements%ROWTYPE;
  v_source TEXT;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  SELECT u.character_id INTO v_character_id FROM public.character_regent_unlocks AS u WHERE u.id = p_unlock_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
  SELECT c.user_id, c.level INTO v_owner, v_level FROM public.characters AS c
  WHERE c.id = v_character_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
  IF v_owner IS DISTINCT FROM v_actor THEN RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501'; END IF;
  SELECT u.* INTO v_unlock FROM public.character_regent_unlocks AS u
  WHERE u.id = p_unlock_id AND u.character_id = v_character_id FOR UPDATE;
  IF v_unlock.regent_id IS NULL THEN RAISE EXCEPTION 'LEGACY_REGENT_UNLOCK_NOT_ACTIONABLE' USING ERRCODE = '22023'; END IF;
  IF v_level NOT BETWEEN 1 AND 20 THEN RAISE EXCEPTION 'INVALID_CHARACTER_LEVEL' USING ERRCODE = '22023'; END IF;
  IF v_unlock.caught_up_at_level IS NOT NULL THEN RETURN v_unlock.caught_up_at_level; END IF;
  SELECT * INTO v_req FROM app_private.regent_catch_up_requirements
  WHERE regent_id = v_unlock.regent_id AND character_level = v_level;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_REQUIREMENTS_NOT_FOUND' USING ERRCODE = '22023'; END IF;
  v_source := v_req.regent_name || ' Attunement (Catch-Up)';

  IF (SELECT count(*) FROM public.character_powers AS p WHERE p.character_id = v_character_id AND p.source = v_source) <> v_req.powers
     OR (SELECT count(*) FROM public.character_techniques AS t WHERE t.character_id = v_character_id AND t.source = v_source) <> v_req.techniques
     OR (SELECT count(*) FROM public.character_spells AS s WHERE s.character_id = v_character_id AND s.source = v_source AND s.spell_level = 0) <> v_req.cantrips
     OR (SELECT count(*) FROM public.character_spells AS s WHERE s.character_id = v_character_id AND s.source = v_source AND s.spell_level > 0) <> v_req.spells
     OR EXISTS (SELECT 1 FROM public.character_powers AS p WHERE p.character_id = v_character_id AND p.source = v_source
                AND NOT EXISTS (SELECT 1 FROM public.regent_catch_up_options AS o WHERE o.unlock_id = p_unlock_id AND o.kind = 'powers' AND o.canonical_id = p.power_id))
     OR EXISTS (SELECT 1 FROM public.character_techniques AS t WHERE t.character_id = v_character_id AND t.source = v_source
                AND NOT EXISTS (SELECT 1 FROM public.regent_catch_up_options AS o WHERE o.unlock_id = p_unlock_id AND o.kind = 'techniques' AND o.canonical_id = t.technique_id))
     OR EXISTS (SELECT 1 FROM public.character_spells AS s WHERE s.character_id = v_character_id AND s.source = v_source
                AND NOT EXISTS (SELECT 1 FROM public.regent_catch_up_options AS o WHERE o.unlock_id = p_unlock_id
                  AND o.kind = CASE WHEN s.spell_level = 0 THEN 'cantrips' ELSE 'spells' END AND o.canonical_id = s.spell_id))
  THEN RAISE EXCEPTION 'REGENT_CATCH_UP_PICKS_INCOMPLETE' USING ERRCODE = '22023'; END IF;

  UPDATE public.character_regent_unlocks SET caught_up_at_level = v_level WHERE id = p_unlock_id;
  RETURN v_level;
END;
$$;

REVOKE ALL ON FUNCTION public.set_regent_catch_up_options(UUID, UUID, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_regent_catch_up_options(UUID, UUID, JSONB) TO authenticated;
REVOKE ALL ON FUNCTION app_private.guard_regent_catch_up_pick() FROM PUBLIC, anon, authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

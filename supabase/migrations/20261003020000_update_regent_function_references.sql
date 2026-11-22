-- Update all database functions to reference public.regent_catch_up_* tables
-- instead of app_private.regent_catch_up_* tables

BEGIN;

-- Update set_regent_catch_up_options function
CREATE OR REPLACE FUNCTION public.set_regent_catch_up_options(
  p_unlock_id UUID,
  p_options JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_character_id UUID;
  v_owner UUID;
  v_level INTEGER;
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_requirements public.regent_catch_up_requirements%ROWTYPE;
  v_entry JSONB;
  v_kind TEXT;
  v_id TEXT;
  v_tier INTEGER;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  
  SELECT character_id INTO v_character_id
  FROM public.character_regent_unlocks
  WHERE id = p_unlock_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;
  
  SELECT c.user_id, c.level INTO v_owner, v_level
  FROM public.characters AS c
  WHERE c.id = v_character_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;
  
  IF v_owner IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;
  
  SELECT * INTO v_unlock
  FROM public.character_regent_unlocks
  WHERE id = p_unlock_id AND character_id = v_character_id FOR UPDATE;
  
  IF v_unlock.regent_id IS NULL THEN
    RAISE EXCEPTION 'LEGACY_REGENT_UNLOCK_NOT_ACTIONABLE' USING ERRCODE = '22023';
  END IF;
  
  IF v_level NOT BETWEEN 1 AND 20 THEN
    RAISE EXCEPTION 'INVALID_CHARACTER_LEVEL' USING ERRCODE = '22023';
  END IF;
  
  SELECT * INTO v_requirements
  FROM public.regent_catch_up_requirements
  WHERE regent_id = v_unlock.regent_id AND character_level = v_level;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_REQUIREMENTS_NOT_FOUND' USING ERRCODE = '22023';
  END IF;

  DELETE FROM public.regent_catch_up_options WHERE unlock_id = p_unlock_id;

  FOR v_entry IN SELECT value FROM jsonb_array_elements(p_options) AS request(value) LOOP
    v_kind := v_entry->>'kind';
    v_id := v_entry->>'id';
    SELECT catalog.tier INTO v_tier
    FROM public.regent_canonical_pick_options AS catalog
    WHERE catalog.kind = v_kind AND catalog.canonical_id = v_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'REGENT_PICK_NOT_IN_CATALOG' USING ERRCODE = '22023';
    END IF;
    
    IF v_tier NOT BETWEEN 5 AND 9 THEN
      RAISE EXCEPTION 'REGENT_PICK_TIER_TOO_LOW' USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.regent_catch_up_options(unlock_id, kind, canonical_id, approved_by)
    VALUES (p_unlock_id, v_kind, v_id, v_actor);
  END LOOP;
END;
$$;

-- Update guard_regent_catch_up_pick function
CREATE OR REPLACE FUNCTION app_private.guard_regent_catch_up_pick()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_unlock_id UUID;
  v_kind TEXT;
  v_id TEXT;
  v_tier INTEGER;
  v_expected_tier INTEGER;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.source LIKE '% Attunement (Catch-Up)' THEN
    IF NEW.character_id IS DISTINCT FROM OLD.character_id OR NEW.source IS DISTINCT FROM OLD.source THEN
      RAISE EXCEPTION 'REGENT_CATCH_UP_PICK_IDENTITY_IMMUTABLE' USING ERRCODE = '42501';
    END IF;
    
    IF TG_TABLE_NAME = 'character_powers' AND NEW.power_id IS DISTINCT FROM OLD.power_id THEN
      RAISE EXCEPTION 'REGENT_CATCH_UP_PICK_IDENTITY_IMMUTABLE' USING ERRCODE = '42501';
    END IF;
    
    IF TG_TABLE_NAME = 'character_techniques' AND NEW.technique_id IS DISTINCT FROM OLD.technique_id THEN
      RAISE EXCEPTION 'REGENT_CATCH_UP_PICK_IDENTITY_IMMUTABLE' USING ERRCODE = '42501';
    END IF;
    
    IF TG_TABLE_NAME = 'character_spells' 
       AND (NEW.spell_id IS DISTINCT FROM OLD.spell_id OR NEW.spell_level IS DISTINCT FROM OLD.spell_level) THEN
      RETURN NEW;
    END IF;
  END IF;
  
  IF NEW.source IS NULL OR NEW.source NOT LIKE '% Attunement (Catch-Up)' THEN
    RETURN NEW;
  END IF;
  
  IF TG_TABLE_NAME = 'character_powers' THEN
    v_kind := 'powers';
    v_id := NEW.power_id;
    v_tier := NEW.power_level;
  ELSIF TG_TABLE_NAME = 'character_techniques' THEN
    v_kind := 'techniques';
    v_id := NEW.technique_id;
    v_tier := NULL;
  ELSIF TG_TABLE_NAME = 'character_spells' THEN
    v_kind := CASE WHEN NEW.spell_level = 0 THEN 'cantrips' ELSE 'spells' END;
    v_id := NEW.spell_id;
    v_tier := NEW.spell_level;
  END IF;

  SELECT u.id INTO v_unlock_id
  FROM public.character_regent_unlocks AS u
  JOIN public.regent_catch_up_requirements AS r ON r.regent_id = u.regent_id
  WHERE u.character_id = NEW.character_id
    AND r.character_level = (SELECT c.level FROM public.characters AS c WHERE c.id = NEW.character_id)
    AND NEW.source = r.regent_name || ' Attunement (Catch-Up)'
    AND u.caught_up_at_level IS NULL;
  
  IF v_unlock_id IS NULL THEN
    RAISE EXCEPTION 'REGENT_CATCH_UP_NOT_ACTIVE' USING ERRCODE = '42501';
  END IF;

  SELECT catalog.tier INTO v_expected_tier
  FROM public.regent_catch_up_options AS option_row
  JOIN public.regent_canonical_pick_options AS catalog
    ON catalog.kind = option_row.kind AND catalog.canonical_id = option_row.canonical_id
  WHERE option_row.unlock_id = v_unlock_id
    AND option_row.kind = v_kind
    AND option_row.canonical_id = v_id;
  
  IF v_expected_tier IS NULL THEN
    RAISE EXCEPTION 'REGENT_PICK_NOT_APPROVED' USING ERRCODE = '42501';
  END IF;
  
  IF v_tier IS NOT NULL AND v_tier <> v_expected_tier THEN
    RAISE EXCEPTION 'REGENT_PICK_TIER_MISMATCH' USING ERRCODE = '22023';
  END IF;

  RETURN NEW;
END;
$$;

-- Update complete_regent_catch_up function (already done in previous migration, but ensure it's correct)
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
  v_req public.regent_catch_up_requirements%ROWTYPE;
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
  
  SELECT * INTO v_req FROM public.regent_catch_up_requirements
  WHERE regent_id = v_unlock.regent_id AND character_level = v_level;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_REQUIREMENTS_NOT_FOUND' USING ERRCODE = '22023'; END IF;
  v_source := v_req.regent_name || ' Attunement (Catch-Up)';

  -- Validate that the correct number of abilities have been persisted with the catch-up source
  IF (SELECT count(*) FROM public.character_powers AS p WHERE p.character_id = v_character_id AND p.source = v_source) <> v_req.powers
     OR (SELECT count(*) FROM public.character_techniques AS t WHERE t.character_id = v_character_id AND t.source = v_source) <> v_req.techniques
     OR (SELECT count(*) FROM public.character_spells AS s WHERE s.character_id = v_character_id AND s.source = v_source AND s.spell_level = 0) <> v_req.cantrips
     OR (SELECT count(*) FROM public.character_spells AS s WHERE s.character_id = v_character_id AND s.source = v_source AND s.spell_level > 0) <> v_req.spells
  THEN RAISE EXCEPTION 'REGENT_CATCH_UP_PICKS_INCOMPLETE' USING ERRCODE = '22023'; END IF;

  -- Mark the catch-up as complete
  UPDATE public.character_regent_unlocks SET caught_up_at_level = v_level WHERE id = p_unlock_id;
  RETURN v_level;
END;
$$;

-- Update guard_regent_ability_provenance function
CREATE OR REPLACE FUNCTION app_private.guard_regent_ability_provenance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_level INTEGER;
  v_kind TEXT;
  v_canonical_id TEXT;
  v_allowed INTEGER;
  v_current_count INTEGER;
BEGIN
  IF TG_TABLE_NAME = 'character_powers' THEN
    IF NEW.acquisition_kind <> 'regent' OR NEW.regent_unlock_id IS NULL THEN
      RETURN NEW;
    END IF;
    v_kind := 'powers';
    v_canonical_id := NEW.power_id;
  ELSIF TG_TABLE_NAME = 'character_techniques' THEN
    IF NEW.acquisition_kind <> 'regent' OR NEW.regent_unlock_id IS NULL THEN
      RETURN NEW;
    END IF;
    v_kind := 'techniques';
    v_canonical_id := NEW.technique_id;
  END IF;

  PERFORM 1 FROM public.regent_canonical_pick_options o
  WHERE o.kind = v_kind AND o.canonical_id = v_canonical_id
    AND o.tier BETWEEN 5 AND 9;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_PICK_NOT_HIGH_TIER' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_unlock FROM public.character_regent_unlocks
  WHERE id = NEW.regent_unlock_id AND character_id = NEW.character_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_MISMATCH' USING ERRCODE = '22023';
  END IF;

  SELECT c.level INTO v_level FROM public.characters c WHERE c.id = NEW.character_id;
  
  SELECT CASE WHEN v_kind = 'powers' THEN r.powers ELSE r.techniques END
    INTO v_allowed
  FROM public.regent_catch_up_requirements r
  WHERE r.regent_id = v_unlock.regent_id AND r.character_level = v_level;
  
  IF v_allowed IS NULL OR v_allowed = 0 THEN
    RAISE EXCEPTION 'REGENT_NO_PICKS_AT_LEVEL' USING ERRCODE = '22023';
  END IF;

  IF v_kind = 'powers' THEN
    SELECT count(*) INTO v_current_count FROM public.character_powers
    WHERE character_id = NEW.character_id AND regent_unlock_id = NEW.regent_unlock_id;
  ELSE
    SELECT count(*) INTO v_current_count FROM public.character_techniques
    WHERE character_id = NEW.character_id AND regent_unlock_id = NEW.regent_unlock_id;
  END IF;

  IF TG_OP = 'INSERT' AND v_current_count >= v_allowed THEN
    RAISE EXCEPTION 'REGENT_PICK_LIMIT_EXCEEDED' USING ERRCODE = '22023';
  END IF;

  RETURN NEW;
END;
$$;

-- Update approve_pending_regent_grant function
CREATE OR REPLACE FUNCTION public.approve_pending_regent_grant(
  p_pending_id UUID,
  p_unlock_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_pending RECORD;
  v_unlock RECORD;
  v_tier INTEGER;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_pending FROM public.character_pending_regent_grants
  WHERE id = p_pending_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'PENDING_GRANT_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT * INTO v_unlock FROM public.character_regent_unlocks
  WHERE id = p_unlock_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_unlock.character_id <> v_pending.character_id THEN
    RAISE EXCEPTION 'CHARACTER_MISMATCH' USING ERRCODE = '42501';
  END IF;

  IF v_unlock.regent_id <> v_pending.regent_id THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT tier INTO v_tier FROM public.regent_canonical_pick_options
  WHERE kind = CASE WHEN v_pending.grant_kind = 'power' THEN 'powers' ELSE 'techniques' END
    AND canonical_id = v_pending.canonical_id;

  IF v_tier IS NULL OR v_tier < 5 THEN
    RAISE EXCEPTION 'IMPORT_NOT_HIGH_TIER' USING ERRCODE = '22023';
  END IF;

  IF v_pending.grant_kind = 'power' THEN
    INSERT INTO public.character_powers(
      character_id, power_id, name, power_level, source,
      acquisition_kind, canonical_source_id, regent_id, regent_unlock_id,
      is_prepared, is_known
    )
    VALUES (
      v_pending.character_id, v_pending.canonical_id, v_pending.ability_name, v_tier,
      'DDB Import (Regent)',
      'regent', v_unlock.regent_id, p_unlock_id,
      false, true
    );
  ELSIF v_pending.grant_kind = 'technique' THEN
    INSERT INTO public.character_techniques(
      character_id, technique_id, source,
      acquisition_kind, canonical_source_id, regent_id, regent_unlock_id
    )
    VALUES (
      v_pending.character_id, v_pending.canonical_id,
      'DDB Import (Regent)',
      'regent', v_unlock.regent_id, p_unlock_id
    );
  END IF;

  DELETE FROM public.character_pending_regent_grants WHERE id = p_pending_id;
END;
$$;

-- Update spend_regent_resonance function
CREATE OR REPLACE FUNCTION public.spend_regent_resonance(
  p_character_id UUID,
  p_grant_id UUID,
  p_grant_kind TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_owner UUID;
  v_cost INTEGER := 1;
  v_resonance public.character_regent_resonance%ROWTYPE;
  v_verified BOOLEAN := false;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT c.user_id INTO v_owner FROM public.characters c WHERE c.id = p_character_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;
  
  IF v_owner IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_grant_kind = 'power' THEN
    SELECT true INTO v_verified
    FROM public.character_powers p
    JOIN public.character_regent_unlocks u ON u.id = p.regent_unlock_id
      AND u.character_id = p.character_id AND u.regent_id = p.regent_id
    JOIN public.regent_canonical_pick_options o ON o.kind = 'powers'
      AND o.canonical_id = p.power_id
    WHERE p.id = p_grant_id AND p.character_id = p_character_id
      AND p.acquisition_kind = 'regent' AND o.tier BETWEEN 5 AND 9;
  ELSIF p_grant_kind = 'technique' THEN
    SELECT true INTO v_verified
    FROM public.character_techniques t
    JOIN public.character_regent_unlocks u ON u.id = t.regent_unlock_id
      AND u.character_id = t.character_id AND u.regent_id = t.regent_id
    JOIN public.regent_canonical_pick_options o ON o.kind = 'techniques'
      AND o.canonical_id = t.technique_id
    WHERE t.id = p_grant_id AND t.character_id = p_character_id
      AND t.acquisition_kind = 'regent' AND o.tier BETWEEN 5 AND 9;
  END IF;

  IF NOT COALESCE(v_verified, false) THEN
    RAISE EXCEPTION 'GRANT_NOT_REGENT_ABILITY' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_resonance FROM public.character_regent_resonance
  WHERE character_id = p_character_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'RESONANCE_NOT_INITIALIZED' USING ERRCODE = 'P0002';
  END IF;

  IF v_resonance.points_current < v_cost THEN
    RAISE EXCEPTION 'INSUFFICIENT_RESONANCE' USING ERRCODE = '22023';
  END IF;

  UPDATE public.character_regent_resonance
  SET points_current = points_current - v_cost
  WHERE character_id = p_character_id;
END;
$$;

COMMIT;

NOTIFY pgrst, 'reload schema';

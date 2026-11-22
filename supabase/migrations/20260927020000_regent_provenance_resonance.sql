-- Regent ability provenance and the one per-character Resonance economy.
BEGIN;

ALTER TABLE public.character_powers
  ADD COLUMN IF NOT EXISTS acquisition_kind TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS canonical_source_id TEXT,
  ADD COLUMN IF NOT EXISTS regent_id TEXT,
  ADD COLUMN IF NOT EXISTS regent_unlock_id UUID REFERENCES public.character_regent_unlocks(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS acquired_level INTEGER;
ALTER TABLE public.character_techniques
  ADD COLUMN IF NOT EXISTS acquisition_kind TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS canonical_source_id TEXT,
  ADD COLUMN IF NOT EXISTS regent_id TEXT,
  ADD COLUMN IF NOT EXISTS regent_unlock_id UUID REFERENCES public.character_regent_unlocks(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS acquired_level INTEGER;

ALTER TABLE public.character_powers
  ADD CONSTRAINT character_powers_acquisition_kind_check
  CHECK (acquisition_kind IN ('job','path','regent','rune','feature','manual','other'));
ALTER TABLE public.character_techniques
  ADD CONSTRAINT character_techniques_acquisition_kind_check
  CHECK (acquisition_kind IN ('job','path','regent','rune','feature','manual','other'));
ALTER TABLE public.character_powers
  ADD CONSTRAINT character_powers_acquired_level_check
  CHECK (acquired_level IS NULL OR acquired_level BETWEEN 1 AND 20);
ALTER TABLE public.character_techniques
  ADD CONSTRAINT character_techniques_acquired_level_check
  CHECK (acquired_level IS NULL OR acquired_level BETWEEN 1 AND 20);

-- The old technique constraint allowed only one row per canonical ability.
-- Different acquisition sources now own independent rows and use economies.
ALTER TABLE public.character_techniques
  DROP CONSTRAINT IF EXISTS character_techniques_character_id_technique_id_key;
CREATE UNIQUE INDEX character_techniques_acquisition_unique
  ON public.character_techniques (
    character_id, technique_id,
    COALESCE(regent_unlock_id::TEXT, canonical_source_id, source, 'manual')
  );
CREATE INDEX character_powers_regent_unlock_idx
  ON public.character_powers(regent_unlock_id) WHERE regent_unlock_id IS NOT NULL;
CREATE INDEX character_techniques_regent_unlock_idx
  ON public.character_techniques(regent_unlock_id) WHERE regent_unlock_id IS NOT NULL;

-- Only rows with an exact, approved pick and a single matching unlock are
-- backfilled. Ambiguous legacy rows retain native use behavior and appear in
-- the review view below.
WITH eligible AS (
  SELECT p.id, min(u.id::TEXT)::UUID AS unlock_id, min(u.regent_id) AS regent_id,
         count(DISTINCT u.id) AS matches
  FROM public.character_powers p
  JOIN public.character_regent_unlocks u ON u.character_id = p.character_id
  JOIN app_private.regent_catch_up_requirements r ON r.regent_id = u.regent_id
    AND p.source = r.regent_name || ' Attunement (Catch-Up)'
  JOIN public.regent_catch_up_options o ON o.unlock_id = u.id
    AND o.kind = 'powers' AND o.canonical_id = p.power_id
  GROUP BY p.id
)
UPDATE public.character_powers p SET acquisition_kind = 'regent',
  canonical_source_id = e.regent_id, regent_id = e.regent_id,
  regent_unlock_id = e.unlock_id,
  acquired_level = COALESCE(u.caught_up_at_level, c.level),
  uses_max = NULL, uses_current = NULL, recharge = NULL
FROM eligible e
JOIN public.character_regent_unlocks u ON u.id = e.unlock_id
JOIN public.characters c ON c.id = u.character_id
WHERE p.id = e.id AND e.matches = 1;

WITH eligible AS (
  SELECT t.id, min(u.id::TEXT)::UUID AS unlock_id, min(u.regent_id) AS regent_id,
         count(DISTINCT u.id) AS matches
  FROM public.character_techniques t
  JOIN public.character_regent_unlocks u ON u.character_id = t.character_id
  JOIN app_private.regent_catch_up_requirements r ON r.regent_id = u.regent_id
    AND t.source = r.regent_name || ' Attunement (Catch-Up)'
  JOIN public.regent_catch_up_options o ON o.unlock_id = u.id
    AND o.kind = 'techniques' AND o.canonical_id = t.technique_id
  GROUP BY t.id
)
UPDATE public.character_techniques t SET acquisition_kind = 'regent',
  canonical_source_id = e.regent_id, regent_id = e.regent_id,
  regent_unlock_id = e.unlock_id,
  acquired_level = COALESCE(u.caught_up_at_level, c.level),
  uses_max = NULL, uses_current = NULL, recharge = NULL
FROM eligible e
JOIN public.character_regent_unlocks u ON u.id = e.unlock_id
JOIN public.characters c ON c.id = u.character_id
WHERE t.id = e.id AND e.matches = 1;

CREATE VIEW public.regent_unresolved_ability_grants
WITH (security_invoker = true) AS
SELECT 'power'::TEXT AS kind, p.id, p.character_id, p.power_id AS canonical_id, p.source
FROM public.character_powers p
WHERE p.acquisition_kind <> 'regent' AND p.source LIKE '% Attunement (Catch-Up)'
UNION ALL
SELECT 'technique'::TEXT, t.id, t.character_id, t.technique_id, t.source
FROM public.character_techniques t
WHERE t.acquisition_kind <> 'regent' AND t.source LIKE '% Attunement (Catch-Up)';
GRANT SELECT ON public.regent_unresolved_ability_grants TO authenticated;

CREATE OR REPLACE FUNCTION app_private.guard_regent_ability_provenance()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_kind TEXT;
  v_canonical_id TEXT;
  v_tier INTEGER;
  v_level INTEGER;
  v_allowed INTEGER;
  v_existing INTEGER;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.acquisition_kind = 'regent' THEN
    IF NEW.character_id IS DISTINCT FROM OLD.character_id
       OR NEW.acquisition_kind IS DISTINCT FROM OLD.acquisition_kind
       OR NEW.regent_unlock_id IS DISTINCT FROM OLD.regent_unlock_id
       OR NEW.regent_id IS DISTINCT FROM OLD.regent_id
       OR NEW.canonical_source_id IS DISTINCT FROM OLD.canonical_source_id
       OR NEW.acquired_level IS DISTINCT FROM OLD.acquired_level
       OR NEW.source IS DISTINCT FROM OLD.source
       OR (TG_TABLE_NAME = 'character_powers' AND NEW.power_id IS DISTINCT FROM OLD.power_id)
       OR (TG_TABLE_NAME = 'character_techniques' AND NEW.technique_id IS DISTINCT FROM OLD.technique_id)
    THEN RAISE EXCEPTION 'REGENT_GRANT_IDENTITY_IMMUTABLE' USING ERRCODE = '42501'; END IF;
  END IF;

  IF NEW.acquisition_kind <> 'regent' THEN
    IF NEW.regent_unlock_id IS NOT NULL OR NEW.regent_id IS NOT NULL THEN
      RAISE EXCEPTION 'NONREGENT_GRANT_HAS_REGENT_AUTHORITY' USING ERRCODE = '22023';
    END IF;
    RETURN NEW;
  END IF;

  SELECT u.* INTO v_unlock FROM public.character_regent_unlocks u
  WHERE u.id = NEW.regent_unlock_id AND u.character_id = NEW.character_id
  FOR UPDATE;
  IF NOT FOUND OR v_unlock.regent_id IS DISTINCT FROM NEW.regent_id
     OR NEW.canonical_source_id IS DISTINCT FROM NEW.regent_id THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT level INTO v_level FROM public.characters WHERE id = NEW.character_id;
  IF NEW.acquired_level IS NULL THEN NEW.acquired_level := v_level; END IF;
  IF NEW.acquired_level > v_level THEN
    RAISE EXCEPTION 'REGENT_GRANT_FUTURE_LEVEL' USING ERRCODE = '22023';
  END IF;
  IF TG_TABLE_NAME = 'character_powers' THEN
    v_kind := 'powers'; v_canonical_id := NEW.power_id; v_tier := NEW.power_level;
  ELSE
    v_kind := 'techniques'; v_canonical_id := NEW.technique_id;
  END IF;
  PERFORM 1 FROM app_private.regent_canonical_pick_options o
  WHERE o.kind = v_kind AND o.canonical_id = v_canonical_id
    AND o.tier BETWEEN 5 AND 9
    AND (v_tier IS NULL OR o.tier = v_tier);
  IF NOT FOUND THEN RAISE EXCEPTION 'INVALID_REGENT_ABILITY_TIER' USING ERRCODE = '22023'; END IF;
  IF v_unlock.caught_up_at_level IS NULL THEN
    PERFORM 1 FROM public.regent_catch_up_options o
    WHERE o.unlock_id = v_unlock.id AND o.kind = v_kind
      AND o.canonical_id = v_canonical_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'REGENT_PICK_NOT_WARDEN_APPROVED' USING ERRCODE = '42501';
    END IF;
  END IF;
  SELECT CASE WHEN v_kind = 'powers' THEN r.powers ELSE r.techniques END
    INTO v_allowed
  FROM app_private.regent_catch_up_requirements r
  WHERE r.regent_id = v_unlock.regent_id AND r.character_level = v_level;
  IF v_allowed IS NULL OR v_allowed = 0 THEN
    RAISE EXCEPTION 'REGENT_ABILITY_CATEGORY_NOT_AVAILABLE' USING ERRCODE = '22023';
  END IF;
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'character_powers' THEN
      SELECT count(*) INTO v_existing FROM public.character_powers p
      WHERE p.regent_unlock_id = v_unlock.id AND p.acquisition_kind = 'regent';
      IF EXISTS (SELECT 1 FROM public.character_powers p
        WHERE p.regent_unlock_id = v_unlock.id AND p.power_id = NEW.power_id) THEN
        RAISE EXCEPTION 'REGENT_DUPLICATE_SOURCE_GRANT' USING ERRCODE = '23505';
      END IF;
    ELSE
      SELECT count(*) INTO v_existing FROM public.character_techniques t
      WHERE t.regent_unlock_id = v_unlock.id AND t.acquisition_kind = 'regent';
      IF EXISTS (SELECT 1 FROM public.character_techniques t
        WHERE t.regent_unlock_id = v_unlock.id AND t.technique_id = NEW.technique_id) THEN
        RAISE EXCEPTION 'REGENT_DUPLICATE_SOURCE_GRANT' USING ERRCODE = '23505';
      END IF;
    END IF;
    IF v_existing >= v_allowed THEN
      RAISE EXCEPTION 'REGENT_KNOWN_COUNT_REACHED' USING ERRCODE = '23514';
    END IF;
  END IF;
  -- Regent abilities use shared Resonance, never the native charge counter.
  NEW.uses_max := NULL; NEW.uses_current := NULL; NEW.recharge := NULL;
  RETURN NEW;
END;
$$;
CREATE TRIGGER character_powers_regent_provenance_guard
  BEFORE INSERT OR UPDATE ON public.character_powers
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_regent_ability_provenance();
CREATE TRIGGER character_techniques_regent_provenance_guard
  BEFORE INSERT OR UPDATE ON public.character_techniques
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_regent_ability_provenance();
REVOKE ALL ON FUNCTION app_private.guard_regent_ability_provenance() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION app_private.regent_resonance_max(p_level INTEGER)
RETURNS INTEGER LANGUAGE sql IMMUTABLE STRICT
SET search_path = pg_catalog AS $$
  SELECT (ARRAY[1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,8]::INTEGER[])[LEAST(20,GREATEST(1,p_level))]
$$;
CREATE TABLE public.character_regent_resonance (
  character_id UUID PRIMARY KEY REFERENCES public.characters(id) ON DELETE CASCADE,
  points_current INTEGER NOT NULL,
  points_max INTEGER NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (points_max BETWEEN 1 AND 8),
  CHECK (points_current BETWEEN 0 AND points_max)
);
ALTER TABLE public.character_regent_resonance ENABLE ROW LEVEL SECURITY;
CREATE POLICY character_regent_resonance_select ON public.character_regent_resonance
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.characters c
      WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
REVOKE ALL ON public.character_regent_resonance FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.character_regent_resonance TO authenticated;

INSERT INTO public.character_regent_resonance(character_id, points_current, points_max)
SELECT c.id, app_private.regent_resonance_max(c.level),
  app_private.regent_resonance_max(c.level)
FROM public.characters c
WHERE EXISTS (SELECT 1 FROM public.character_regent_unlocks u WHERE u.character_id = c.id);

CREATE OR REPLACE FUNCTION app_private.sync_regent_resonance_on_unlock()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE v_level INTEGER; v_max INTEGER;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT c.level INTO v_level FROM public.characters c WHERE c.id = NEW.character_id;
    v_max := app_private.regent_resonance_max(v_level);
    INSERT INTO public.character_regent_resonance(character_id, points_current, points_max)
    VALUES (NEW.character_id, v_max, v_max) ON CONFLICT (character_id) DO NOTHING;
    RETURN NEW;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.character_regent_unlocks u WHERE u.character_id = OLD.character_id) THEN
    DELETE FROM public.character_regent_resonance WHERE character_id = OLD.character_id;
  END IF;
  RETURN OLD;
END;
$$;
CREATE TRIGGER character_regent_unlock_resonance_insert
  AFTER INSERT ON public.character_regent_unlocks
  FOR EACH ROW EXECUTE FUNCTION app_private.sync_regent_resonance_on_unlock();
CREATE TRIGGER character_regent_unlock_resonance_delete
  AFTER DELETE ON public.character_regent_unlocks
  FOR EACH ROW EXECUTE FUNCTION app_private.sync_regent_resonance_on_unlock();

CREATE OR REPLACE FUNCTION app_private.sync_regent_resonance_on_level()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE v_max INTEGER;
BEGIN
  IF NEW.level IS DISTINCT FROM OLD.level THEN
    v_max := app_private.regent_resonance_max(NEW.level);
    UPDATE public.character_regent_resonance r
    SET points_current = LEAST(v_max, GREATEST(0, r.points_current + v_max - r.points_max)),
        points_max = v_max, updated_at = now()
    WHERE r.character_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER characters_regent_resonance_level
  AFTER UPDATE OF level ON public.characters
  FOR EACH ROW EXECUTE FUNCTION app_private.sync_regent_resonance_on_level();

CREATE TABLE public.character_regent_resonance_spends (
  request_id UUID PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  grant_kind TEXT NOT NULL CHECK (grant_kind IN ('power','technique')),
  grant_id UUID NOT NULL,
  cost INTEGER NOT NULL CHECK (cost BETWEEN 1 AND 3),
  points_after INTEGER NOT NULL,
  spent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX character_regent_resonance_spends_character_idx
  ON public.character_regent_resonance_spends(character_id);
ALTER TABLE public.character_regent_resonance_spends ENABLE ROW LEVEL SECURITY;
CREATE POLICY character_regent_resonance_spends_select ON public.character_regent_resonance_spends
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.characters c
      WHERE c.id = character_id AND c.user_id = (SELECT auth.uid()))
  );
REVOKE ALL ON public.character_regent_resonance_spends FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.character_regent_resonance_spends TO authenticated;

CREATE OR REPLACE FUNCTION public.spend_regent_resonance(
  p_character_id UUID, p_grant_kind TEXT, p_grant_id UUID, p_request_id UUID
)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE v_owner UUID; v_pool public.character_regent_resonance%ROWTYPE;
  v_previous public.character_regent_resonance_spends%ROWTYPE;
  v_tier INTEGER; v_cost INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  IF p_request_id IS NULL OR p_grant_kind NOT IN ('power','technique') THEN
    RAISE EXCEPTION 'INVALID_RESONANCE_REQUEST' USING ERRCODE = '22023';
  END IF;
  SELECT c.user_id INTO v_owner FROM public.characters c WHERE c.id = p_character_id;
  IF v_owner IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_pool FROM public.character_regent_resonance r
  WHERE r.character_id = p_character_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'REGENT_RESONANCE_UNAVAILABLE' USING ERRCODE = '22023'; END IF;
  SELECT * INTO v_previous FROM public.character_regent_resonance_spends s
  WHERE s.request_id = p_request_id;
  IF FOUND THEN
    IF v_previous.character_id <> p_character_id OR v_previous.grant_kind <> p_grant_kind
       OR v_previous.grant_id <> p_grant_id THEN
      RAISE EXCEPTION 'RESONANCE_REQUEST_CONFLICT' USING ERRCODE = '23505';
    END IF;
    RETURN v_previous.points_after;
  END IF;
  IF p_grant_kind = 'power' THEN
    SELECT o.tier INTO v_tier FROM public.character_powers p
    JOIN public.character_regent_unlocks u ON u.id = p.regent_unlock_id
      AND u.character_id = p.character_id AND u.regent_id = p.regent_id
    JOIN app_private.regent_canonical_pick_options o ON o.kind = 'powers'
      AND o.canonical_id = p.power_id
    WHERE p.id = p_grant_id AND p.character_id = p_character_id
      AND p.acquisition_kind = 'regent';
  ELSE
    SELECT o.tier INTO v_tier FROM public.character_techniques t
    JOIN public.character_regent_unlocks u ON u.id = t.regent_unlock_id
      AND u.character_id = t.character_id AND u.regent_id = t.regent_id
    JOIN app_private.regent_canonical_pick_options o ON o.kind = 'techniques'
      AND o.canonical_id = t.technique_id
    WHERE t.id = p_grant_id AND t.character_id = p_character_id
      AND t.acquisition_kind = 'regent';
  END IF;
  IF v_tier NOT BETWEEN 5 AND 9 THEN
    RAISE EXCEPTION 'REGENT_GRANT_NOT_ACTIVE' USING ERRCODE = '42501';
  END IF;
  v_cost := CASE WHEN v_tier = 5 THEN 1 WHEN v_tier <= 7 THEN 2 ELSE 3 END;
  IF v_pool.points_current < v_cost THEN
    RAISE EXCEPTION 'INSUFFICIENT_REGENT_RESONANCE' USING ERRCODE = '23514';
  END IF;
  UPDATE public.character_regent_resonance SET points_current = points_current - v_cost,
    updated_at = now() WHERE character_id = p_character_id;
  INSERT INTO public.character_regent_resonance_spends
    (request_id, character_id, grant_kind, grant_id, cost, points_after)
  VALUES (p_request_id, p_character_id, p_grant_kind, p_grant_id,
    v_cost, v_pool.points_current - v_cost);
  RETURN v_pool.points_current - v_cost;
END;
$$;

CREATE OR REPLACE FUNCTION public.refill_regent_resonance(p_character_id UUID)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE v_owner UUID; v_current INTEGER;
BEGIN
  SELECT c.user_id INTO v_owner FROM public.characters c WHERE c.id = p_character_id;
  IF v_owner IS DISTINCT FROM auth.uid() OR auth.uid() IS NULL THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;
  UPDATE public.character_regent_resonance
  SET points_current = points_max, updated_at = now()
  WHERE character_id = p_character_id RETURNING points_current INTO v_current;
  RETURN v_current;
END;
$$;
REVOKE ALL ON FUNCTION public.spend_regent_resonance(UUID,TEXT,UUID,UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refill_regent_resonance(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.spend_regent_resonance(UUID,TEXT,UUID,UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.refill_regent_resonance(UUID) TO authenticated;

-- Warden revocation removes only grants linked to the revoked unlock. The
-- existing removal RPC deletes the unlock; this trigger removes linked rows
-- first, while other Job/Path/Regent grants of the same ability survive.
CREATE OR REPLACE FUNCTION app_private.remove_regent_linked_grants()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
BEGIN
  DELETE FROM public.character_powers WHERE regent_unlock_id = OLD.id;
  DELETE FROM public.character_techniques WHERE regent_unlock_id = OLD.id;
  RETURN OLD;
END;
$$;
CREATE TRIGGER character_regent_unlock_remove_grants
  BEFORE DELETE ON public.character_regent_unlocks
  FOR EACH ROW EXECUTE FUNCTION app_private.remove_regent_linked_grants();

-- Helpers and trigger functions are internal; no client role executes them.
REVOKE ALL ON FUNCTION app_private.regent_resonance_max(INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.sync_regent_resonance_on_unlock() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.sync_regent_resonance_on_level() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.remove_regent_linked_grants() FROM PUBLIC, anon, authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

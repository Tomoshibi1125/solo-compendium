-- RA crafting canon: first-class source rank, typed input roles, four ordinary
-- disciplines, specialized procedures, and persistent research progression.
-- Historical M1/M3 migrations remain untouched.
BEGIN;

ALTER TABLE public.material_lots ADD COLUMN IF NOT EXISTS source_rank TEXT;
ALTER TABLE public.material_lots
  ADD CONSTRAINT material_lots_source_rank_check
  CHECK (source_rank IS NULL OR source_rank IN ('E','D','C','B','A','S'));

-- Only copy explicit rank provenance. Grade alone never proves source rank.
UPDATE public.material_lots
SET source_rank = provenance_metadata->>'sourceRank'
WHERE source_rank IS NULL
  AND provenance_metadata->>'sourceRank' IN ('E','D','C','B','A','S');

CREATE OR REPLACE FUNCTION app_private.material_lot_source_rank_sync()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = pg_catalog, public AS $$
DECLARE v_metadata_rank TEXT := NEW.provenance_metadata->>'sourceRank';
BEGIN
  IF NEW.source_rank IS NULL AND v_metadata_rank IN ('E','D','C','B','A','S') THEN
    NEW.source_rank := v_metadata_rank;
  END IF;
  IF NEW.source_rank IS NOT NULL AND v_metadata_rank IS NOT NULL
     AND NEW.source_rank <> v_metadata_rank THEN
    RAISE EXCEPTION 'MATERIAL_SOURCE_RANK_MISMATCH' USING ERRCODE = '22023';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS material_lot_source_rank_sync ON public.material_lots;
CREATE TRIGGER material_lot_source_rank_sync
  BEFORE INSERT OR UPDATE OF source_rank, provenance_metadata ON public.material_lots
  FOR EACH ROW EXECUTE FUNCTION app_private.material_lot_source_rank_sync();

ALTER TABLE public.craft_formulas_m3
  ADD COLUMN IF NOT EXISTS procedure_kind TEXT NOT NULL DEFAULT 'ordinary',
  ADD COLUMN IF NOT EXISTS ingredient_roles JSONB,
  ADD COLUMN IF NOT EXISTS recovery_policy JSONB NOT NULL DEFAULT '{"Incorporated":1,"Catalyst":1}'::jsonb,
  ADD COLUMN IF NOT EXISTS default_research_state TEXT NOT NULL DEFAULT 'Known';
ALTER TABLE public.craft_formulas_m3 ALTER COLUMN discipline DROP NOT NULL;
UPDATE public.craft_formulas_m3
SET procedure_kind = 'field_survival', discipline = NULL
WHERE id = 'recipe-residue-safe-rations';
UPDATE public.craft_formulas_m3 AS formula
SET ingredient_roles = (
  SELECT COALESCE(jsonb_object_agg(required.key, 'Consumed'), '{}'::jsonb)
  FROM jsonb_each(formula.requirement_snapshot) AS required(key, quantity)
)
WHERE ingredient_roles IS NULL;
ALTER TABLE public.craft_formulas_m3
  ALTER COLUMN ingredient_roles SET NOT NULL;
ALTER TABLE public.craft_formulas_m3
  ADD CONSTRAINT craft_formulas_m3_discipline_canon CHECK (
    discipline IS NULL OR discipline IN
      ('Blacksmithing','Alchemy','Enchanting','Field Engineering')
  ),
  ADD CONSTRAINT craft_formulas_m3_procedure_kind_check CHECK (
    procedure_kind IN ('ordinary','field_survival','inscription','research','biological_adaptation')
  ),
  ADD CONSTRAINT craft_formulas_m3_discipline_shape CHECK (
    (procedure_kind = 'ordinary' AND discipline IS NOT NULL)
    OR (procedure_kind <> 'ordinary' AND discipline IS NULL)
  ),
  ADD CONSTRAINT craft_formulas_m3_research_state_check CHECK (
    default_research_state IN ('Field Standard','Known')
  );

CREATE OR REPLACE FUNCTION app_private.validate_craft_formula_roles()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = pg_catalog, public AS $$
DECLARE v_key TEXT; v_role TEXT; v_fraction TEXT;
BEGIN
  IF jsonb_typeof(NEW.requirement_snapshot) <> 'object'
     OR jsonb_typeof(NEW.ingredient_roles) <> 'object'
     OR (SELECT count(*) FROM jsonb_object_keys(NEW.requirement_snapshot)) <>
        (SELECT count(*) FROM jsonb_object_keys(NEW.ingredient_roles)) THEN
    RAISE EXCEPTION 'INVALID_CRAFT_INGREDIENT_ROLES' USING ERRCODE = '22023';
  END IF;
  FOR v_key, v_role IN SELECT key, value FROM jsonb_each_text(NEW.ingredient_roles) LOOP
    IF NOT (NEW.requirement_snapshot ? v_key)
       OR v_role NOT IN ('Consumed','Incorporated','Catalyst') THEN
      RAISE EXCEPTION 'INVALID_CRAFT_INGREDIENT_ROLE: %', v_key USING ERRCODE = '22023';
    END IF;
  END LOOP;
  IF jsonb_typeof(NEW.recovery_policy) <> 'object' THEN
    RAISE EXCEPTION 'INVALID_CRAFT_RECOVERY_POLICY' USING ERRCODE = '22023';
  END IF;
  FOR v_key, v_fraction IN SELECT key, value FROM jsonb_each_text(NEW.recovery_policy) LOOP
    IF v_key NOT IN ('Incorporated','Catalyst')
       OR v_fraction !~ '^(0(\.[0-9]+)?|1(\.0+)?)$'
       OR v_fraction::NUMERIC NOT BETWEEN 0 AND 1 THEN
      RAISE EXCEPTION 'INVALID_CRAFT_RECOVERY_POLICY' USING ERRCODE = '22023';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS craft_formula_roles_guard ON public.craft_formulas_m3;
CREATE TRIGGER craft_formula_roles_guard
  BEFORE INSERT OR UPDATE OF requirement_snapshot, ingredient_roles, recovery_policy
  ON public.craft_formulas_m3 FOR EACH ROW
  EXECUTE FUNCTION app_private.validate_craft_formula_roles();

-- New projects pin the role map in their existing immutable formula snapshot.
CREATE OR REPLACE FUNCTION app_private.pin_craft_formula_roles()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = pg_catalog, public AS $$
DECLARE v_roles JSONB; v_kind TEXT; v_discipline TEXT; v_recovery JSONB;
  v_default_state TEXT; v_state TEXT; v_iteration INTEGER;
BEGIN
  SELECT ingredient_roles, procedure_kind, discipline, recovery_policy,
         default_research_state
  INTO v_roles, v_kind, v_discipline, v_recovery, v_default_state
  FROM public.craft_formulas_m3 WHERE id = NEW.formula_id;
  IF v_roles IS NULL THEN
    RAISE EXCEPTION 'CRAFT_FORMULA_NOT_FOUND' USING ERRCODE = '22023';
  END IF;
  SELECT state, iteration_bonus INTO v_state, v_iteration
  FROM public.craft_formula_research
  WHERE character_id = NEW.character_id AND formula_id = NEW.formula_id;
  NEW.formula_snapshot := NEW.formula_snapshot || jsonb_build_object(
    'ingredientRoles', v_roles, 'procedureKind', v_kind,
    'discipline', v_discipline, 'recoveryPolicy', v_recovery,
    'researchState', COALESCE(v_state, v_default_state),
    'iterationBonus', COALESCE(v_iteration, 0)
  );
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS craft_project_pin_roles ON public.craft_projects_m3;
CREATE TRIGGER craft_project_pin_roles
  BEFORE INSERT ON public.craft_projects_m3 FOR EACH ROW
  EXECUTE FUNCTION app_private.pin_craft_formula_roles();

ALTER TABLE public.material_lot_reservations
  ADD COLUMN IF NOT EXISTS usage_role TEXT NOT NULL DEFAULT 'Consumed';
ALTER TABLE public.material_lot_reservations
  ADD CONSTRAINT material_reservation_usage_role_check
  CHECK (usage_role IN ('Consumed','Incorporated','Catalyst'));

CREATE OR REPLACE FUNCTION app_private.pin_craft_reservation_role()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = pg_catalog, public AS $$
DECLARE v_role TEXT;
BEGIN
  IF NEW.reservation_kind <> 'craft-project-m3' THEN RETURN NEW; END IF;
  SELECT project.formula_snapshot->'ingredientRoles'->>lot.material_definition_id
  INTO v_role
  FROM public.craft_projects_m3 AS project
  JOIN public.material_lots AS lot ON lot.id = NEW.lot_id
  WHERE project.id = NEW.reference_id::UUID;
  NEW.usage_role := COALESCE(v_role, 'Consumed');
  IF NEW.usage_role NOT IN ('Consumed','Incorporated','Catalyst') THEN
    RAISE EXCEPTION 'INVALID_CRAFT_INGREDIENT_ROLE' USING ERRCODE = '22023';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS craft_reservation_role ON public.material_lot_reservations;
CREATE TRIGGER craft_reservation_role
  BEFORE INSERT ON public.material_lot_reservations FOR EACH ROW
  EXECUTE FUNCTION app_private.pin_craft_reservation_role();

CREATE TABLE IF NOT EXISTS public.craft_formula_research (
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  formula_id TEXT NOT NULL REFERENCES public.craft_formulas_m3(id),
  formula_revision TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('Field Standard','Known','Experimental','Proven')),
  iteration_bonus INTEGER NOT NULL DEFAULT 0 CHECK (iteration_bonus BETWEEN 0 AND 2),
  successful_productions INTEGER NOT NULL DEFAULT 0 CHECK (successful_productions >= 0),
  mastered BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, formula_id)
);
ALTER TABLE public.craft_formula_research ENABLE ROW LEVEL SECURITY;
CREATE POLICY craft_formula_research_read ON public.craft_formula_research
  FOR SELECT TO authenticated
  USING (app_private.actor_owns_character(character_id));
GRANT SELECT ON public.craft_formula_research TO authenticated;

-- Existing learned recipes are known, not experimental. Do not invent proof.
INSERT INTO public.craft_formula_research
  (character_id, formula_id, formula_revision, state)
SELECT recipe.character_id, formula.id, formula.revision, 'Known'
FROM public.character_recipes AS recipe
JOIN public.craft_formulas_m3 AS formula ON formula.recipe_id = recipe.recipe_id
ON CONFLICT (character_id, formula_id) DO NOTHING;

-- Trigger functions are internal; no client role executes them directly.
REVOKE ALL ON FUNCTION app_private.material_lot_source_rank_sync() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.validate_craft_formula_roles() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.pin_craft_formula_roles() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.pin_craft_reservation_role() FROM PUBLIC, anon, authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

-- M3's first executable formula. The older descriptive project table remains
-- readable, but it is not evidence that any inventory was reserved or spent.
-- Residue-Safe Rations is a specific 30-minute procedure: INT (Survival),
-- professional DC 12, with either listed kit. Its inputs are consumed during
-- work, including on failure; completion creates four ration servings.
BEGIN;

INSERT INTO public.material_definitions
  (id, name, family, unit, grade, source_revision, definition_metadata)
VALUES
  ('material-residue-safe-ration-serving', 'Residue-Safe Ration Serving',
   'Technical', 'serving', 'Quality', 'm3-rations-v1',
   '{"recipeId":"recipe-residue-safe-rations","effect":"Advantage on one save against exposure from spoiled supplies"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE public.craft_formulas_m3 (
  id TEXT PRIMARY KEY,
  revision TEXT NOT NULL,
  name TEXT NOT NULL,
  recipe_id TEXT NOT NULL,
  discipline TEXT NOT NULL,
  requirement_snapshot JSONB NOT NULL,
  output_definition_id TEXT NOT NULL REFERENCES public.material_definitions(id),
  output_quantity NUMERIC(20,6) NOT NULL CHECK (output_quantity > 0),
  work_minutes INTEGER NOT NULL CHECK (work_minutes > 0),
  ability TEXT NOT NULL,
  skill TEXT NOT NULL,
  dc INTEGER NOT NULL CHECK (dc BETWEEN 1 AND 40),
  tool_names TEXT[] NOT NULL,
  failure_policy TEXT NOT NULL CHECK (failure_policy IN ('consume-inputs')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.craft_formulas_m3
  (id, revision, name, recipe_id, discipline, requirement_snapshot,
   output_definition_id, output_quantity, work_minutes, ability, skill, dc,
   tool_names, failure_policy)
VALUES
  ('recipe-residue-safe-rations', 'm3-rations-v1', 'Residue-Safe Rations',
   'recipe-residue-safe-rations', 'Field Survival',
   '{"material-field-ration-base":2,"material-containment-foam":1}'::jsonb,
   'material-residue-safe-ration-serving', 4, 30, 'INT', 'Survival', 12,
   ARRAY['Cook''s utensils', 'survival kit'], 'consume-inputs');

CREATE TABLE public.craft_projects_m3 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  formula_id TEXT NOT NULL REFERENCES public.craft_formulas_m3(id),
  formula_revision TEXT NOT NULL,
  formula_snapshot JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'reserved'
    CHECK (status IN ('reserved', 'worked', 'completed', 'failed', 'cancelled')),
  row_version BIGINT NOT NULL DEFAULT 0,
  work_minutes INTEGER NOT NULL DEFAULT 0,
  roll INTEGER,
  ability_modifier INTEGER,
  proficiency_bonus INTEGER,
  total INTEGER,
  dc INTEGER,
  output_lot_id UUID REFERENCES public.material_lots(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  worked_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX craft_projects_m3_character_idx
  ON public.craft_projects_m3(character_id, created_at DESC);

ALTER TABLE public.craft_formulas_m3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.craft_projects_m3 ENABLE ROW LEVEL SECURITY;
CREATE POLICY craft_formulas_m3_read ON public.craft_formulas_m3
  FOR SELECT TO authenticated USING (true);
CREATE POLICY craft_projects_m3_read ON public.craft_projects_m3
  FOR SELECT TO authenticated
  USING (app_private.actor_owns_character(character_id));
GRANT SELECT ON public.craft_formulas_m3, public.craft_projects_m3 TO authenticated;

CREATE OR REPLACE FUNCTION app_private.craft_m3_tool_available(
  p_character_id UUID,
  p_tool_names TEXT[]
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.character_equipment AS equipment
    WHERE equipment.character_id = p_character_id
      AND equipment.quantity > 0
      AND lower(btrim(equipment.name)) = ANY (
        SELECT lower(btrim(tool_name)) FROM unnest(p_tool_names) AS tool_name
      )
  );
$$;

CREATE OR REPLACE FUNCTION app_private.craft_m3_actor_owns(p_character_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = p_character_id AND character_row.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.reserve_craft_project_m3(
  p_character_id UUID,
  p_formula_id TEXT,
  p_inputs JSONB,
  p_operation_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_formula public.craft_formulas_m3%ROWTYPE;
  v_lot public.material_lots%ROWTYPE;
  v_input JSONB;
  v_lot_id UUID;
  v_quantity NUMERIC;
  v_reserved NUMERIC;
  v_totals JSONB := '{}'::jsonb;
  v_project_id UUID := gen_random_uuid();
  v_fingerprint TEXT;
  v_prior JSONB;
  v_seen UUID[] := ARRAY[]::UUID[];
BEGIN
  IF v_actor IS NULL OR NOT app_private.craft_m3_actor_owns(p_character_id) THEN
    RAISE EXCEPTION 'CRAFT_CHARACTER_OWNER_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF length(COALESCE(p_operation_id, '')) NOT BETWEEN 8 AND 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;
  IF jsonb_typeof(p_inputs) <> 'array' OR jsonb_array_length(p_inputs) NOT BETWEEN 1 AND 20 THEN
    RAISE EXCEPTION 'INVALID_CRAFT_INPUTS' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(v_actor::TEXT || ':' || p_operation_id, 0));
  v_fingerprint := md5(jsonb_build_object(
    'character', p_character_id, 'formula', p_formula_id, 'inputs', p_inputs
  )::TEXT);
  v_prior := app_private.material_m1_receipt(v_actor, p_operation_id, 'craft-reserve-m3', v_fingerprint);
  IF v_prior IS NOT NULL THEN RETURN (v_prior->>'project_id')::UUID; END IF;

  SELECT * INTO v_formula FROM public.craft_formulas_m3 WHERE id = p_formula_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'CRAFT_FORMULA_NOT_FOUND' USING ERRCODE = '22023'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.character_recipes
    WHERE character_id = p_character_id AND recipe_id = v_formula.recipe_id
  ) THEN
    RAISE EXCEPTION 'CRAFT_FORMULA_NOT_KNOWN' USING ERRCODE = '42501';
  END IF;
  IF NOT app_private.craft_m3_tool_available(p_character_id, v_formula.tool_names) THEN
    RAISE EXCEPTION 'CRAFT_TOOL_REQUIRED' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.craft_projects_m3
    (id, character_id, formula_id, formula_revision, formula_snapshot)
  VALUES
    (v_project_id, p_character_id, v_formula.id, v_formula.revision,
     jsonb_build_object(
       'name', v_formula.name, 'requirements', v_formula.requirement_snapshot,
       'outputDefinitionId', v_formula.output_definition_id,
       'outputQuantity', v_formula.output_quantity,
       'workMinutes', v_formula.work_minutes, 'ability', v_formula.ability,
       'skill', v_formula.skill, 'dc', v_formula.dc,
       'toolNames', to_jsonb(v_formula.tool_names),
       'failurePolicy', v_formula.failure_policy
     ));

  FOR v_input IN
    SELECT value FROM jsonb_array_elements(p_inputs) ORDER BY value->>'lot_id'
  LOOP
    IF jsonb_typeof(v_input) <> 'object'
       OR v_input->>'lot_id' IS NULL
       OR v_input->>'quantity' IS NULL THEN
      RAISE EXCEPTION 'INVALID_CRAFT_INPUTS' USING ERRCODE = '22023';
    END IF;
    v_lot_id := (v_input->>'lot_id')::UUID;
    v_quantity := (v_input->>'quantity')::NUMERIC;
    IF v_quantity <= 0 OR v_quantity > 1000000 OR v_lot_id = ANY(v_seen) THEN
      RAISE EXCEPTION 'INVALID_CRAFT_INPUTS' USING ERRCODE = '22023';
    END IF;
    v_seen := array_append(v_seen, v_lot_id);
    SELECT * INTO v_lot FROM public.material_lots WHERE id = v_lot_id FOR UPDATE;
    IF NOT FOUND OR v_lot.owner_scope <> 'character'
       OR v_lot.owner_character_id <> p_character_id THEN
      RAISE EXCEPTION 'CRAFT_LOT_NOT_OWNED' USING ERRCODE = '42501';
    END IF;
    IF v_lot.unit IS DISTINCT FROM (
      SELECT unit FROM public.material_definitions WHERE id = v_lot.material_definition_id
    ) THEN
      RAISE EXCEPTION 'CRAFT_LOT_UNIT_MISMATCH' USING ERRCODE = '22023';
    END IF;
    SELECT COALESCE(sum(quantity), 0) INTO v_reserved
    FROM public.material_lot_reservations
    WHERE lot_id = v_lot.id AND status = 'active';
    IF v_lot.quantity - v_reserved < v_quantity THEN
      RAISE EXCEPTION 'CRAFT_LOT_UNAVAILABLE' USING ERRCODE = '22023';
    END IF;
    v_totals := jsonb_set(
      v_totals, ARRAY[v_lot.material_definition_id],
      to_jsonb(COALESCE((v_totals->>v_lot.material_definition_id)::NUMERIC, 0) + v_quantity),
      true
    );
    INSERT INTO public.material_lot_reservations
      (lot_id, quantity, reservation_kind, reference_id, created_by_user_id)
    VALUES (v_lot.id, v_quantity, 'craft-project-m3', v_project_id::TEXT, v_actor);
  END LOOP;
  IF v_totals <> v_formula.requirement_snapshot THEN
    RAISE EXCEPTION 'CRAFT_INPUT_REQUIREMENTS_MISMATCH' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.material_lot_operations
    (actor_user_id, operation_id, operation_kind, fingerprint, result)
  VALUES
    (v_actor, p_operation_id, 'craft-reserve-m3', v_fingerprint,
     jsonb_build_object('project_id', v_project_id));
  RETURN v_project_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.work_craft_project_m3(
  p_project_id UUID,
  p_expected_version BIGINT,
  p_operation_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_project public.craft_projects_m3%ROWTYPE;
  v_reservation public.material_lot_reservations%ROWTYPE;
  v_fingerprint TEXT;
  v_prior JSONB;
  v_result JSONB;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  IF length(COALESCE(p_operation_id, '')) NOT BETWEEN 8 AND 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(v_actor::TEXT || ':' || p_operation_id, 0));
  v_fingerprint := md5(jsonb_build_object(
    'project', p_project_id, 'expectedVersion', p_expected_version
  )::TEXT);
  v_prior := app_private.material_m1_receipt(v_actor, p_operation_id, 'craft-work-m3', v_fingerprint);
  IF v_prior IS NOT NULL THEN RETURN v_prior; END IF;

  SELECT * INTO v_project FROM public.craft_projects_m3
  WHERE id = p_project_id FOR UPDATE;
  IF NOT FOUND OR NOT app_private.craft_m3_actor_owns(v_project.character_id) THEN
    RAISE EXCEPTION 'CRAFT_PROJECT_OWNER_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF v_project.row_version <> p_expected_version THEN
    RAISE EXCEPTION 'STALE_CRAFT_PROJECT' USING ERRCODE = '40001';
  END IF;
  IF v_project.status <> 'reserved' THEN
    RAISE EXCEPTION 'CRAFT_PROJECT_NOT_RESERVED' USING ERRCODE = '22023';
  END IF;
  IF NOT app_private.craft_m3_tool_available(
    v_project.character_id,
    ARRAY(SELECT jsonb_array_elements_text(v_project.formula_snapshot->'toolNames'))
  ) THEN
    RAISE EXCEPTION 'CRAFT_TOOL_REQUIRED' USING ERRCODE = '22023';
  END IF;

  -- The reservation owns the exact lots; each debit and transition occurs in
  -- this same transaction. A failed debit rolls back every earlier input.
  FOR v_reservation IN
    SELECT * FROM public.material_lot_reservations
    WHERE reference_id = p_project_id::TEXT
      AND reservation_kind = 'craft-project-m3' AND status = 'active'
    ORDER BY lot_id FOR UPDATE
  LOOP
    UPDATE public.material_lot_reservations
    SET status = 'consumed', updated_at = now()
    WHERE id = v_reservation.id;
    UPDATE public.material_lots
    SET quantity = quantity - v_reservation.quantity,
        row_version = row_version + 1, updated_at = now()
    WHERE id = v_reservation.lot_id
      AND owner_character_id = v_project.character_id
      AND quantity >= v_reservation.quantity;
    IF NOT FOUND THEN RAISE EXCEPTION 'CRAFT_RESERVED_LOT_CHANGED' USING ERRCODE = '40001'; END IF;
  END LOOP;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CRAFT_RESERVATIONS_MISSING' USING ERRCODE = '22023';
  END IF;

  UPDATE public.craft_projects_m3
  SET status = 'worked', work_minutes = (formula_snapshot->>'workMinutes')::INTEGER,
      worked_at = now(), row_version = row_version + 1, updated_at = now()
  WHERE id = p_project_id RETURNING * INTO v_project;
  v_result := jsonb_build_object(
    'project_id', p_project_id, 'status', v_project.status,
    'row_version', v_project.row_version, 'work_minutes', v_project.work_minutes
  );
  INSERT INTO public.material_lot_operations
    (actor_user_id, operation_id, operation_kind, fingerprint, result)
  VALUES (v_actor, p_operation_id, 'craft-work-m3', v_fingerprint, v_result);
  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.resolve_craft_project_m3(
  p_project_id UUID,
  p_expected_version BIGINT,
  p_operation_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_project public.craft_projects_m3%ROWTYPE;
  v_character public.characters%ROWTYPE;
  v_score INTEGER;
  v_modifier INTEGER;
  v_proficiency INTEGER;
  v_roll INTEGER;
  v_total INTEGER;
  v_dc INTEGER;
  v_lot_id UUID;
  v_fingerprint TEXT;
  v_prior JSONB;
  v_result JSONB;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  IF length(COALESCE(p_operation_id, '')) NOT BETWEEN 8 AND 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(v_actor::TEXT || ':' || p_operation_id, 0));
  v_fingerprint := md5(jsonb_build_object(
    'project', p_project_id, 'expectedVersion', p_expected_version
  )::TEXT);
  v_prior := app_private.material_m1_receipt(v_actor, p_operation_id, 'craft-resolve-m3', v_fingerprint);
  IF v_prior IS NOT NULL THEN RETURN v_prior; END IF;

  SELECT * INTO v_project FROM public.craft_projects_m3
  WHERE id = p_project_id FOR UPDATE;
  IF NOT FOUND OR NOT app_private.craft_m3_actor_owns(v_project.character_id) THEN
    RAISE EXCEPTION 'CRAFT_PROJECT_OWNER_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF v_project.row_version <> p_expected_version THEN
    RAISE EXCEPTION 'STALE_CRAFT_PROJECT' USING ERRCODE = '40001';
  END IF;
  IF v_project.status <> 'worked' THEN
    RAISE EXCEPTION 'CRAFT_PROJECT_NOT_WORKED' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_character FROM public.characters WHERE id = v_project.character_id;
  SELECT score INTO v_score FROM public.character_abilities
  WHERE character_id = v_project.character_id
    AND ability = (v_project.formula_snapshot->>'ability')::public.ability_score;
  IF v_score IS NULL THEN RAISE EXCEPTION 'CRAFT_ABILITY_SCORE_REQUIRED' USING ERRCODE = '22023'; END IF;
  v_modifier := floor((v_score - 10)::NUMERIC / 2)::INTEGER;
  v_proficiency := CASE
    WHEN EXISTS (
      SELECT 1 FROM unnest(COALESCE(v_character.skill_expertise, ARRAY[]::TEXT[])) AS skill(value)
      WHERE lower(skill.value) = lower(v_project.formula_snapshot->>'skill')
    ) THEN 2 * v_character.proficiency_bonus
    WHEN EXISTS (
      SELECT 1 FROM unnest(COALESCE(v_character.skill_proficiencies, ARRAY[]::TEXT[])) AS skill(value)
      WHERE lower(skill.value) = lower(v_project.formula_snapshot->>'skill')
    ) THEN v_character.proficiency_bonus
    ELSE 0 END;
  v_roll := floor(random() * 20)::INTEGER + 1;
  v_total := v_roll + v_modifier + v_proficiency;
  v_dc := (v_project.formula_snapshot->>'dc')::INTEGER;
  IF v_total >= v_dc THEN
    INSERT INTO public.material_lots
      (material_definition_id, owner_scope, owner_character_id,
       quantity, unit, grade, provenance_status, provenance_metadata)
    SELECT v_project.formula_snapshot->>'outputDefinitionId', 'character',
      v_project.character_id, (v_project.formula_snapshot->>'outputQuantity')::NUMERIC,
      definition.unit, definition.grade, 'crafted-output',
      jsonb_build_object('craftProjectId', v_project.id,
                         'formulaRevision', v_project.formula_revision)
    FROM public.material_definitions AS definition
    WHERE definition.id = v_project.formula_snapshot->>'outputDefinitionId'
    RETURNING id INTO v_lot_id;
    IF v_lot_id IS NULL THEN RAISE EXCEPTION 'CRAFT_OUTPUT_DEFINITION_MISSING' USING ERRCODE = '22023'; END IF;
  END IF;
  UPDATE public.craft_projects_m3
  SET status = CASE WHEN v_total >= v_dc THEN 'completed' ELSE 'failed' END,
      roll = v_roll, ability_modifier = v_modifier,
      proficiency_bonus = v_proficiency, total = v_total, dc = v_dc,
      output_lot_id = v_lot_id, resolved_at = now(),
      row_version = row_version + 1, updated_at = now()
  WHERE id = p_project_id RETURNING * INTO v_project;
  v_result := jsonb_build_object(
    'project_id', p_project_id, 'status', v_project.status,
    'row_version', v_project.row_version, 'roll', v_roll,
    'ability_modifier', v_modifier, 'proficiency_bonus', v_proficiency,
    'total', v_total, 'dc', v_dc, 'output_lot_id', v_lot_id
  );
  INSERT INTO public.material_lot_operations
    (actor_user_id, operation_id, operation_kind, fingerprint, result)
  VALUES (v_actor, p_operation_id, 'craft-resolve-m3', v_fingerprint, v_result);
  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_craft_project_m3(
  p_project_id UUID,
  p_expected_version BIGINT,
  p_operation_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_project public.craft_projects_m3%ROWTYPE;
  v_fingerprint TEXT;
  v_prior JSONB;
  v_result JSONB;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  IF length(COALESCE(p_operation_id, '')) NOT BETWEEN 8 AND 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(v_actor::TEXT || ':' || p_operation_id, 0));
  v_fingerprint := md5(jsonb_build_object(
    'project', p_project_id, 'expectedVersion', p_expected_version
  )::TEXT);
  v_prior := app_private.material_m1_receipt(v_actor, p_operation_id, 'craft-cancel-m3', v_fingerprint);
  IF v_prior IS NOT NULL THEN RETURN v_prior; END IF;

  SELECT * INTO v_project FROM public.craft_projects_m3
  WHERE id = p_project_id FOR UPDATE;
  IF NOT FOUND OR NOT app_private.craft_m3_actor_owns(v_project.character_id) THEN
    RAISE EXCEPTION 'CRAFT_PROJECT_OWNER_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF v_project.row_version <> p_expected_version THEN
    RAISE EXCEPTION 'STALE_CRAFT_PROJECT' USING ERRCODE = '40001';
  END IF;
  IF v_project.status NOT IN ('reserved', 'worked') THEN
    RAISE EXCEPTION 'CRAFT_PROJECT_CANNOT_CANCEL' USING ERRCODE = '22023';
  END IF;
  IF v_project.status = 'reserved' THEN
    UPDATE public.material_lot_reservations
    SET status = 'released', updated_at = now()
    WHERE reference_id = p_project_id::TEXT
      AND reservation_kind = 'craft-project-m3' AND status = 'active';
  END IF;
  UPDATE public.craft_projects_m3
  SET status = 'cancelled', resolved_at = now(),
      row_version = row_version + 1, updated_at = now()
  WHERE id = p_project_id RETURNING * INTO v_project;
  v_result := jsonb_build_object(
    'project_id', p_project_id, 'status', 'cancelled',
    'row_version', v_project.row_version
  );
  INSERT INTO public.material_lot_operations
    (actor_user_id, operation_id, operation_kind, fingerprint, result)
  VALUES (v_actor, p_operation_id, 'craft-cancel-m3', v_fingerprint, v_result);
  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION app_private.craft_m3_tool_available(UUID, TEXT[])
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.craft_m3_actor_owns(UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reserve_craft_project_m3(UUID, TEXT, JSONB, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.work_craft_project_m3(UUID, BIGINT, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.resolve_craft_project_m3(UUID, BIGINT, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cancel_craft_project_m3(UUID, BIGINT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_craft_project_m3(UUID, TEXT, JSONB, TEXT)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.work_craft_project_m3(UUID, BIGINT, TEXT)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_craft_project_m3(UUID, BIGINT, TEXT)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_craft_project_m3(UUID, BIGINT, TEXT)
  TO authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

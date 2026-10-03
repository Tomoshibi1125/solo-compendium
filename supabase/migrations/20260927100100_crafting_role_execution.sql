-- Role-aware crafting execution and research resolution.
BEGIN;

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
    IF v_reservation.usage_role <> 'Consumed' THEN CONTINUE; END IF;
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
  v_reservation public.material_lot_reservations%ROWTYPE;
  v_research public.craft_formula_research%ROWTYPE;
  v_iteration_bonus INTEGER := 0;
  v_recovery NUMERIC;
  v_consumed NUMERIC;
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
  INSERT INTO public.craft_formula_research
    (character_id, formula_id, formula_revision, state)
  VALUES (v_project.character_id, v_project.formula_id,
    v_project.formula_revision,
    COALESCE(v_project.formula_snapshot->>'researchState', 'Known'))
  ON CONFLICT (character_id, formula_id) DO NOTHING;
  SELECT * INTO v_research FROM public.craft_formula_research
  WHERE character_id = v_project.character_id
    AND formula_id = v_project.formula_id FOR UPDATE;
  IF v_project.formula_snapshot->>'researchState' = 'Experimental' THEN
    v_dc := v_dc + 2;
    v_iteration_bonus := LEAST(2, GREATEST(0,
      COALESCE((v_project.formula_snapshot->>'iterationBonus')::INTEGER, 0)));
    v_total := v_total + v_iteration_bonus;
  END IF;

  -- Consumed inputs were spent at work. Incorporated inputs join a
  -- successful output; catalysts are retained. Procedure-specific fractions
  -- govern recovery of the retained roles after failure.
  FOR v_reservation IN
    SELECT * FROM public.material_lot_reservations
    WHERE reference_id = p_project_id::TEXT
      AND reservation_kind = 'craft-project-m3' AND status = 'active'
    ORDER BY lot_id FOR UPDATE
  LOOP
    IF v_total >= v_dc THEN
      v_consumed := CASE WHEN v_reservation.usage_role = 'Incorporated'
        THEN v_reservation.quantity ELSE 0 END;
    ELSE
      v_recovery := COALESCE(
        (v_project.formula_snapshot->'recoveryPolicy'->>v_reservation.usage_role)::NUMERIC,
        1);
      v_consumed := v_reservation.quantity * (1 - v_recovery);
    END IF;
    IF v_consumed > 0 THEN
      UPDATE public.material_lots
      SET quantity = quantity - v_consumed,
          row_version = row_version + 1, updated_at = now()
      WHERE id = v_reservation.lot_id
        AND owner_character_id = v_project.character_id
        AND quantity >= v_consumed;
      IF NOT FOUND THEN RAISE EXCEPTION 'CRAFT_RESERVED_LOT_CHANGED' USING ERRCODE = '40001'; END IF;
    END IF;
    UPDATE public.material_lot_reservations
    SET status = CASE WHEN v_consumed = v_reservation.quantity
      THEN 'consumed' ELSE 'released' END, updated_at = now()
    WHERE id = v_reservation.id;
  END LOOP;
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
  UPDATE public.craft_formula_research
  SET state = CASE WHEN v_total >= v_dc
      AND state = 'Experimental' THEN 'Proven' ELSE state END,
      iteration_bonus = CASE
        WHEN v_total >= v_dc THEN 0
        WHEN state = 'Experimental' THEN LEAST(2, iteration_bonus + 1)
        ELSE iteration_bonus END,
      successful_productions = successful_productions
        + CASE WHEN v_total >= v_dc THEN 1 ELSE 0 END,
      mastered = mastered OR
        (v_total >= v_dc AND successful_productions + 1 >= 3),
      formula_revision = v_project.formula_revision, updated_at = now()
  WHERE character_id = v_project.character_id
    AND formula_id = v_project.formula_id
  RETURNING * INTO v_research;
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
    'total', v_total, 'dc', v_dc, 'output_lot_id', v_lot_id,
    'iteration_bonus', v_iteration_bonus,
    'research_state', v_research.state, 'mastered', v_research.mastered
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
  IF v_project.status IN ('reserved', 'worked') THEN
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

-- A player may begin an unproven procedure without treating it as Proven.
-- The recipe row authorizes the existing reservation engine; this separate
-- research row records its actual proof state and iterative bonus.
CREATE OR REPLACE FUNCTION public.begin_craft_experiment_m4(
  p_character_id UUID, p_formula_id TEXT
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE v_formula public.craft_formulas_m3%ROWTYPE;
  v_research public.craft_formula_research%ROWTYPE;
BEGIN
  IF NOT app_private.craft_m3_actor_owns(p_character_id) THEN
    RAISE EXCEPTION 'CRAFT_CHARACTER_OWNER_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_formula FROM public.craft_formulas_m3
  WHERE id = p_formula_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'CRAFT_FORMULA_NOT_FOUND' USING ERRCODE = '22023'; END IF;
  INSERT INTO public.character_recipes(character_id, recipe_id, notes)
  VALUES (p_character_id, v_formula.recipe_id, 'Experimental procedure')
  ON CONFLICT (character_id, recipe_id) DO NOTHING;
  INSERT INTO public.craft_formula_research
    (character_id, formula_id, formula_revision, state)
  VALUES (p_character_id, p_formula_id, v_formula.revision, 'Experimental')
  ON CONFLICT (character_id, formula_id) DO NOTHING;
  SELECT * INTO v_research FROM public.craft_formula_research
  WHERE character_id = p_character_id AND formula_id = p_formula_id;
  RETURN jsonb_build_object('state', v_research.state,
    'iteration_bonus', v_research.iteration_bonus,
    'successful_productions', v_research.successful_productions,
    'mastered', v_research.mastered);
END;
$$;
REVOKE ALL ON FUNCTION public.begin_craft_experiment_m4(UUID,TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.begin_craft_experiment_m4(UUID,TEXT)
  TO authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

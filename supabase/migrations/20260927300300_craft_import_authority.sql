-- A character backup carries inventory in its portable envelope. Active and
-- historical project state is restored only from a same-owner server source.
BEGIN;

CREATE OR REPLACE FUNCTION public.import_craft_state_authority(
  p_original_character_id UUID,
  p_target_character_id UUID,
  p_lot_id_map JSONB,
  p_operation_id TEXT
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_pair RECORD;
  v_old_project public.craft_projects_m3%ROWTYPE;
  v_old_reservation public.material_lot_reservations%ROWTYPE;
  v_new_project_id UUID;
  v_new_lot_id UUID;
  v_new_output_id UUID;
  v_project_map JSONB := '{}'::jsonb;
  v_project_count INTEGER := 0;
  v_result JSONB;
  v_fingerprint TEXT;
BEGIN
  IF v_actor IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.characters
    WHERE id = p_original_character_id AND user_id = v_actor
  ) OR NOT EXISTS (
    SELECT 1 FROM public.characters
    WHERE id = p_target_character_id AND user_id = v_actor
  ) THEN RAISE EXCEPTION 'CRAFT_IMPORT_SAME_OWNER_REQUIRED' USING ERRCODE = '42501'; END IF;
  IF p_original_character_id = p_target_character_id
     OR jsonb_typeof(p_lot_id_map) IS DISTINCT FROM 'object'
     OR length(COALESCE(p_operation_id, '')) NOT BETWEEN 8 AND 200
  THEN RAISE EXCEPTION 'INVALID_CRAFT_IMPORT_REQUEST' USING ERRCODE = '22023'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(v_actor::TEXT || ':' || p_operation_id, 0));
  v_fingerprint := md5(jsonb_build_object(
    'original', p_original_character_id, 'target', p_target_character_id,
    'lots', p_lot_id_map)::TEXT);
  v_result := app_private.material_m1_receipt(
    v_actor, p_operation_id, 'import-craft-state', v_fingerprint);
  IF v_result IS NOT NULL THEN RETURN v_result; END IF;

  FOR v_pair IN SELECT key, value FROM jsonb_each_text(p_lot_id_map) LOOP
    IF NOT EXISTS (
      SELECT 1 FROM public.material_lots AS old_lot
      JOIN public.material_lots AS new_lot
        ON new_lot.id = v_pair.value::UUID
      WHERE old_lot.id = v_pair.key::UUID
        AND old_lot.owner_character_id = p_original_character_id
        AND new_lot.owner_character_id = p_target_character_id
        AND old_lot.material_definition_id = new_lot.material_definition_id
    ) THEN RAISE EXCEPTION 'CRAFT_IMPORT_LOT_MAP_UNVERIFIED' USING ERRCODE = '42501'; END IF;
  END LOOP;

  INSERT INTO public.craft_formula_research
    (character_id, formula_id, formula_revision, state,
     iteration_bonus, successful_productions, mastered, updated_at)
  SELECT p_target_character_id, formula_id, formula_revision, state,
    iteration_bonus, successful_productions, mastered, updated_at
  FROM public.craft_formula_research
  WHERE character_id = p_original_character_id
  ON CONFLICT (character_id, formula_id) DO NOTHING;

  FOR v_old_project IN
    SELECT * FROM public.craft_projects_m3
    WHERE character_id = p_original_character_id ORDER BY created_at, id
  LOOP
    v_new_output_id := NULL;
    IF v_old_project.output_lot_id IS NOT NULL THEN
      v_new_output_id := (p_lot_id_map->>v_old_project.output_lot_id::TEXT)::UUID;
      IF v_new_output_id IS NULL THEN
        RAISE EXCEPTION 'CRAFT_IMPORT_OUTPUT_LOT_MISSING' USING ERRCODE = '22023';
      END IF;
    END IF;
    INSERT INTO public.craft_projects_m3
      (character_id, formula_id, formula_revision, formula_snapshot,
       status, row_version, work_minutes, roll, ability_modifier,
       proficiency_bonus, total, dc, output_lot_id,
       started_at, worked_at, resolved_at, created_at, updated_at)
    VALUES (p_target_character_id, v_old_project.formula_id,
      v_old_project.formula_revision, v_old_project.formula_snapshot,
      v_old_project.status, v_old_project.row_version,
      v_old_project.work_minutes, v_old_project.roll,
      v_old_project.ability_modifier, v_old_project.proficiency_bonus,
      v_old_project.total, v_old_project.dc, v_new_output_id,
      v_old_project.started_at, v_old_project.worked_at,
      v_old_project.resolved_at, v_old_project.created_at,
      v_old_project.updated_at)
    RETURNING id INTO v_new_project_id;
    -- The insertion trigger supplies current defaults; the original snapshot
    -- remains the immutable authority for a project already in progress.
    UPDATE public.craft_projects_m3
    SET formula_snapshot = v_old_project.formula_snapshot
    WHERE id = v_new_project_id;

    FOR v_old_reservation IN
      SELECT * FROM public.material_lot_reservations
      WHERE reservation_kind = 'craft-project-m3'
        AND reference_id = v_old_project.id::TEXT
      ORDER BY created_at, id
    LOOP
      v_new_lot_id := (p_lot_id_map->>v_old_reservation.lot_id::TEXT)::UUID;
      IF v_new_lot_id IS NULL THEN
        RAISE EXCEPTION 'CRAFT_IMPORT_RESERVED_LOT_MISSING' USING ERRCODE = '22023';
      END IF;
      INSERT INTO public.material_lot_reservations
        (lot_id, quantity, reservation_kind, reference_id, status,
         created_by_user_id, created_at, updated_at, usage_role)
      VALUES (v_new_lot_id, v_old_reservation.quantity,
        'craft-project-m3', v_new_project_id::TEXT,
        v_old_reservation.status, v_actor,
        v_old_reservation.created_at, v_old_reservation.updated_at,
        v_old_reservation.usage_role);
    END LOOP;
    v_project_map := v_project_map || jsonb_build_object(
      v_old_project.id::TEXT, v_new_project_id);
    v_project_count := v_project_count + 1;
  END LOOP;

  v_result := jsonb_build_object('imported_projects', v_project_count,
    'project_id_map', v_project_map);
  INSERT INTO public.material_lot_operations
    (actor_user_id, operation_id, operation_kind, fingerprint, result)
  VALUES (v_actor, p_operation_id, 'import-craft-state', v_fingerprint, v_result);
  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.import_craft_state_authority(UUID, UUID, JSONB, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.import_craft_state_authority(UUID, UUID, JSONB, TEXT)
  TO authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

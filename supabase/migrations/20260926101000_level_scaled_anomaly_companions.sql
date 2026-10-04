-- Tamed anomaly companions and living mounts always derive combat numbers from
-- their handler's level. Frozen source stats remain provenance, never combat defaults.
BEGIN;

-- A Warden can inspect living character-owned companions on their campaign
-- roster before approving per-creature scaling. Other roster members do not
-- gain access to another player's character-owned companion row.
DROP POLICY IF EXISTS companion_instances_select ON public.companion_instances;
CREATE POLICY companion_instances_select ON public.companion_instances
FOR SELECT TO authenticated USING (
  (owner_character_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.characters AS c WHERE c.id = owner_character_id AND c.user_id = (SELECT auth.uid())
  ))
  OR (owner_campaign_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.campaign_members AS m
    WHERE m.campaign_id = owner_campaign_id AND m.user_id = (SELECT auth.uid())
  ))
  OR EXISTS (
    SELECT 1 FROM public.characters AS c
    WHERE c.id IN (primary_handler_character_id, combat_controller_character_id, rider_character_id)
      AND c.user_id = (SELECT auth.uid())
  )
  OR (owner_character_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.characters AS c
    JOIN public.campaign_members AS m ON m.user_id = c.user_id
    WHERE c.id = owner_character_id
      AND public.is_campaign_system(m.campaign_id, (SELECT auth.uid()))
  ))
);

CREATE OR REPLACE FUNCTION app_private.companion_level_for_scaling(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
  SELECT GREATEST(1, LEAST(20, COALESCE(c.level, 1)))
  FROM (SELECT COALESCE(p_instance.primary_handler_character_id,
                        p_instance.rider_character_id,
                        p_instance.owner_character_id) AS id) AS handler
  LEFT JOIN public.characters AS c ON c.id = handler.id;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_rank_tier(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
  SELECT CASE upper(COALESCE(
    NULLIF(p_instance.source_snapshot#>>'{sourceFields,rank}', ''),
    (SELECT source.rank FROM app_private.canonical_companion_sources AS source
     WHERE source.source_collection = p_instance.source_collection AND source.source_id = p_instance.source_id),
    'D'))
    WHEN 'E' THEN 0 WHEN 'D' THEN 1 WHEN 'C' THEN 2
    WHEN 'B' THEN 3 WHEN 'A' THEN 4 WHEN 'S' THEN 5 ELSE 1 END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_scaling_setting(
  p_instance public.companion_instances, p_key TEXT,
  p_default INTEGER, p_min INTEGER, p_max INTEGER
)
RETURNS INTEGER LANGUAGE sql STABLE
SET search_path = pg_catalog, public AS $$
  SELECT CASE
    WHEN app_private.companion_c3_number(p_instance.progression_profile#>ARRAY['scaling', p_key])
      BETWEEN p_min AND p_max
      AND trunc(app_private.companion_c3_number(p_instance.progression_profile#>ARRAY['scaling', p_key]))
        = app_private.companion_c3_number(p_instance.progression_profile#>ARRAY['scaling', p_key])
    THEN (p_instance.progression_profile#>>ARRAY['scaling', p_key])::INTEGER
    ELSE p_default END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_max_hp(p_instance public.companion_instances)
RETURNS NUMERIC LANGUAGE sql STABLE
SET search_path = pg_catalog, public AS $$
  SELECT CASE WHEN p_instance.source_collection = 'anomalies' OR p_instance.identity_kind = 'mount' THEN
    app_private.companion_scaling_setting(p_instance, 'hpBase', 8, 0, 500)
    + app_private.companion_level_for_scaling(p_instance)
      * app_private.companion_scaling_setting(p_instance, 'hpPerLevel',
          4 + 2 * app_private.companion_rank_tier(p_instance), 1, 50)
  ELSE COALESCE(
    app_private.companion_c3_number(p_instance.combat_state->'maxHp'),
    app_private.companion_c3_number(p_instance.stat_overrides->'hpMax'),
    app_private.companion_c3_number(p_instance.source_snapshot#>'{sourceFields,hpMax}'),
    app_private.companion_c3_number(p_instance.source_snapshot->'hpMax')) END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_ac(p_instance public.companion_instances)
RETURNS NUMERIC LANGUAGE sql STABLE
SET search_path = pg_catalog, public AS $$
  SELECT CASE WHEN p_instance.source_collection = 'anomalies' OR p_instance.identity_kind = 'mount' THEN
    app_private.companion_scaling_setting(p_instance, 'acBase',
      10 + app_private.companion_rank_tier(p_instance), 1, 30)
    + floor((app_private.companion_level_for_scaling(p_instance) - 1)::NUMERIC /
      app_private.companion_scaling_setting(p_instance, 'acEveryLevels', 4, 1, 20))
  ELSE COALESCE(
    app_private.companion_c3_number(p_instance.stat_overrides->'baseAc'),
    app_private.companion_c3_number(p_instance.source_snapshot#>'{sourceFields,baseAc}'),
    app_private.companion_c3_number(p_instance.source_snapshot->'baseAc')) END;
$$;

CREATE OR REPLACE FUNCTION app_private.normalize_scaled_companion_state()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_max INTEGER;
  v_hp INTEGER;
BEGIN
  IF NEW.source_collection <> 'anomalies' AND NEW.identity_kind <> 'mount' THEN RETURN NEW; END IF;
  v_max := floor(app_private.companion_c3_max_hp(NEW))::INTEGER;
  v_hp := floor(COALESCE(app_private.companion_c3_number(NEW.combat_state->'hp'), v_max))::INTEGER;
  NEW.combat_state := app_private.companion_c3_record(NEW.combat_state)
    || jsonb_build_object('hp', GREATEST(0, LEAST(v_max, v_hp)), 'maxHp', v_max);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS companion_scaled_combat_state ON public.companion_instances;
CREATE TRIGGER companion_scaled_combat_state
  BEFORE INSERT OR UPDATE OF combat_state, progression_profile, primary_handler_character_id,
    rider_character_id, source_snapshot, source_collection, identity_kind
  ON public.companion_instances FOR EACH ROW
  EXECUTE FUNCTION app_private.normalize_scaled_companion_state();

-- Warden-set coefficients are bounded and versioned; clients cannot update the
-- companion profile table directly. Empty JSON restores rank-and-level defaults.
CREATE OR REPLACE FUNCTION public.set_companion_scaling_profile(
  p_instance_id UUID, p_campaign_id UUID, p_scaling JSONB
)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_instance public.companion_instances%ROWTYPE;
  v_field RECORD;
  v_min INTEGER;
  v_max INTEGER;
  v_value NUMERIC;
BEGIN
  IF v_actor IS NULL OR NOT public.is_campaign_system(p_campaign_id, v_actor) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF p_scaling IS NULL OR jsonb_typeof(p_scaling) <> 'object' THEN
    RAISE EXCEPTION 'INVALID_SCALING_PROFILE' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_instance FROM public.companion_instances AS instance
  WHERE instance.id = p_instance_id FOR UPDATE;
  IF NOT FOUND OR NOT app_private.companion_c3_accessible_to_campaign(v_instance, p_campaign_id) THEN
    RAISE EXCEPTION 'COMPANION_NOT_AVAILABLE_TO_CAMPAIGN' USING ERRCODE = '42501';
  END IF;
  IF v_instance.source_collection <> 'anomalies' AND v_instance.identity_kind <> 'mount' THEN
    RAISE EXCEPTION 'COMPANION_NOT_LEVEL_SCALED' USING ERRCODE = '22023';
  END IF;
  FOR v_field IN SELECT key, value FROM jsonb_each(p_scaling) LOOP
    CASE v_field.key
      WHEN 'hpBase' THEN v_min := 0; v_max := 500;
      WHEN 'hpPerLevel' THEN v_min := 1; v_max := 50;
      WHEN 'acBase' THEN v_min := 1; v_max := 30;
      WHEN 'acEveryLevels' THEN v_min := 1; v_max := 20;
      WHEN 'attackBase' THEN v_min := 0; v_max := 20;
      WHEN 'saveBase' THEN v_min := 0; v_max := 30;
      WHEN 'damageDiceBase' THEN v_min := 1; v_max := 20;
      WHEN 'damageEveryLevels' THEN v_min := 1; v_max := 20;
      WHEN 'damageDie' THEN v_min := 4; v_max := 12;
      ELSE RAISE EXCEPTION 'UNKNOWN_SCALING_FIELD: %', v_field.key USING ERRCODE = '22023';
    END CASE;
    v_value := app_private.companion_c3_number(v_field.value);
    IF v_value IS NULL OR v_value <> trunc(v_value) OR v_value NOT BETWEEN v_min AND v_max
       OR (v_field.key = 'damageDie' AND v_value NOT IN (4, 6, 8, 10, 12)) THEN
      RAISE EXCEPTION 'INVALID_SCALING_VALUE: %', v_field.key USING ERRCODE = '22023';
    END IF;
  END LOOP;
  UPDATE public.companion_instances AS instance
  SET progression_profile = jsonb_set(instance.progression_profile, '{scaling}', p_scaling, true),
      profile_version = instance.profile_version + 1,
      updated_at = now()
  WHERE instance.id = p_instance_id
  RETURNING profile_version INTO v_max;
  RETURN v_max;
END;
$$;

REVOKE ALL ON FUNCTION public.set_companion_scaling_profile(UUID, UUID, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_companion_scaling_profile(UUID, UUID, JSONB) TO authenticated;
REVOKE ALL ON FUNCTION app_private.normalize_scaled_companion_state() FROM PUBLIC, anon, authenticated;

-- Existing roster rows can carry source-sized HP. Clamp them once to the new
-- level-scaled maximum while preserving wounds where possible.
UPDATE public.companion_instances AS instance
SET combat_state = app_private.companion_c3_record(instance.combat_state)
WHERE instance.source_collection = 'anomalies' OR instance.identity_kind = 'mount';

SELECT set_config('app.companion_c3_origin_sync', 'on', true);
UPDATE public.character_extras AS extra
SET hp_current = LEAST(extra.hp_current, floor(app_private.companion_c3_max_hp(instance))::INTEGER)
FROM public.companion_instances AS instance
WHERE instance.origin_table = 'character_extras' AND instance.origin_row_id = extra.id
  AND (instance.source_collection = 'anomalies' OR instance.identity_kind = 'mount')
  AND extra.hp_current > app_private.companion_c3_max_hp(instance);
UPDATE public.character_vehicles AS vehicle
SET current_hp = LEAST(vehicle.current_hp, floor(app_private.companion_c3_max_hp(instance))::INTEGER)
FROM public.companion_instances AS instance
WHERE instance.origin_table = 'character_vehicles' AND instance.origin_row_id = vehicle.id
  AND vehicle.current_hp > app_private.companion_c3_max_hp(instance);
UPDATE public.character_tamed_anomalies AS tamed
SET current_hp = LEAST(tamed.current_hp, floor(app_private.companion_c3_max_hp(instance))::INTEGER)
FROM public.companion_instances AS instance
WHERE instance.origin_table = 'character_tamed_anomalies' AND instance.origin_row_id = tamed.id
  AND tamed.current_hp > app_private.companion_c3_max_hp(instance);
UPDATE public.campaign_tamed_anomalies AS tamed
SET current_hp = LEAST(tamed.current_hp, floor(app_private.companion_c3_max_hp(instance))::INTEGER)
FROM public.companion_instances AS instance
WHERE instance.origin_table = 'campaign_tamed_anomalies' AND instance.origin_row_id = tamed.id
  AND tamed.current_hp > app_private.companion_c3_max_hp(instance);

COMMIT;
NOTIFY pgrst, 'reload schema';

-- RA-10 companion scaling (docs/canon/rift-ascendant-canon-locks.md).
--
-- Each species has one version, scaled to the level of the character that owns
-- it. An Anomaly companion, or a mount linked to an Anomaly, scales from that
-- stat block's Hit Die; a combat-capable catalog mount scales from its size
-- Hit Die. The catalog refresh (20260928090000) records both. Every other
-- companion keeps its saved stats.
--
--   Max HP     = L x Hit Die maximum (no VIT); a level-up does not heal.
--   AC         = 10 + rank tier + floor((L - 1) / 4)
--   Attack     = 2 + rank tier + PB, where PB = 2 + floor((L - 1) / 4)
--   Save DC    = 8 + rank tier + PB
--
-- Damage keeps each roll's die size and is resolved from the stat block by the
-- app; the server no longer records one shared damage string. This replaces the
-- rank-coefficient scaling of 20260926101000/101100 and removes Warden scaling
-- coefficients and their RPC.
BEGIN;

-- ---------------------------------------------------------------------------
-- Scaling inputs
-- ---------------------------------------------------------------------------

-- A companion scales with its owner, else its primary handler, else its combat
-- controller. A rider never changes a mount's level.
CREATE OR REPLACE FUNCTION app_private.companion_level_for_scaling(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
  SELECT GREATEST(1, LEAST(20, COALESCE((
    SELECT character_row.level FROM public.characters AS character_row
    WHERE character_row.id = COALESCE(
      p_instance.owner_character_id,
      p_instance.primary_handler_character_id,
      p_instance.combat_controller_character_id)
  ), 1)));
$$;

-- The species' catalog rank (a mount's own entry, even when linked to an
-- Anomaly), else the rank frozen in the snapshot. A missing rank counts as D.
CREATE OR REPLACE FUNCTION app_private.companion_rank_tier(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
  SELECT CASE upper(COALESCE(
    (SELECT NULLIF(btrim(source.rank), '')
     FROM app_private.canonical_companion_sources AS source
     WHERE source.source_collection = p_instance.source_collection
       AND source.source_id = p_instance.source_id),
    NULLIF(btrim(p_instance.source_snapshot#>>'{sourceFields,rank}'), ''),
    'D'))
    WHEN 'E' THEN 0 WHEN 'D' THEN 1 WHEN 'C' THEN 2
    WHEN 'B' THEN 3 WHEN 'A' THEN 4 WHEN 'S' THEN 5 ELSE 1 END;
$$;

-- The Hit Die a companion scales with, or NULL when it keeps its saved stats.
-- An Anomaly missing from the catalog rolls the Medium d8, as in the app.
CREATE OR REPLACE FUNCTION app_private.companion_scaling_hit_die(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
  SELECT CASE p_instance.source_collection
    WHEN 'anomalies' THEN COALESCE((
      SELECT source.hit_die FROM app_private.canonical_companion_sources AS source
      WHERE source.source_collection = 'anomalies'
        AND source.source_id = p_instance.source_id), 8)
    WHEN 'vehicles' THEN (
      SELECT source.hit_die FROM app_private.canonical_companion_sources AS source
      WHERE source.source_collection = 'vehicles'
        AND source.source_id = p_instance.source_id)
    ELSE NULL END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_proficiency_bonus(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SET search_path = pg_catalog, public AS $$
  SELECT 2 + (app_private.companion_level_for_scaling(p_instance) - 1) / 4;
$$;

-- ---------------------------------------------------------------------------
-- Scaled numbers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app_private.companion_c3_max_hp(p_instance public.companion_instances)
RETURNS NUMERIC LANGUAGE sql STABLE SET search_path = pg_catalog, public AS $$
  SELECT CASE WHEN app_private.companion_scaling_hit_die(p_instance) IS NOT NULL THEN
    (app_private.companion_level_for_scaling(p_instance)
      * app_private.companion_scaling_hit_die(p_instance))::NUMERIC
  ELSE COALESCE(
    app_private.companion_c3_number(p_instance.combat_state->'maxHp'),
    app_private.companion_c3_number(p_instance.stat_overrides->'hpMax'),
    app_private.companion_c3_number(p_instance.source_snapshot#>'{sourceFields,hpMax}'),
    app_private.companion_c3_number(p_instance.source_snapshot->'hpMax')) END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_ac(p_instance public.companion_instances)
RETURNS NUMERIC LANGUAGE sql STABLE SET search_path = pg_catalog, public AS $$
  SELECT CASE WHEN app_private.companion_scaling_hit_die(p_instance) IS NOT NULL THEN
    (10 + app_private.companion_rank_tier(p_instance)
      + (app_private.companion_level_for_scaling(p_instance) - 1) / 4)::NUMERIC
  ELSE COALESCE(
    app_private.companion_c3_number(p_instance.stat_overrides->'baseAc'),
    app_private.companion_c3_number(p_instance.source_snapshot#>'{sourceFields,baseAc}'),
    app_private.companion_c3_number(p_instance.source_snapshot->'baseAc')) END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_scaled_attack_bonus(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SET search_path = pg_catalog, public AS $$
  SELECT 2 + app_private.companion_rank_tier(p_instance)
    + app_private.companion_proficiency_bonus(p_instance);
$$;

CREATE OR REPLACE FUNCTION app_private.companion_scaled_save_dc(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SET search_path = pg_catalog, public AS $$
  SELECT 8 + app_private.companion_rank_tier(p_instance)
    + app_private.companion_proficiency_bonus(p_instance);
$$;

-- Scaled creatures carry their level-derived max HP; wounds are clamped to it
-- and a raised maximum never heals current HP.
CREATE OR REPLACE FUNCTION app_private.normalize_scaled_companion_state()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_max INTEGER;
  v_hp INTEGER;
BEGIN
  IF app_private.companion_scaling_hit_die(NEW) IS NULL THEN RETURN NEW; END IF;
  v_max := floor(app_private.companion_c3_max_hp(NEW))::INTEGER;
  v_hp := floor(COALESCE(app_private.companion_c3_number(NEW.combat_state->'hp'), v_max))::INTEGER;
  NEW.combat_state := app_private.companion_c3_record(NEW.combat_state)
    || jsonb_build_object('hp', GREATEST(0, LEAST(v_max, v_hp)), 'maxHp', v_max);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS companion_scaled_combat_state ON public.companion_instances;
CREATE TRIGGER companion_scaled_combat_state
  BEFORE INSERT OR UPDATE OF combat_state, owner_character_id,
    primary_handler_character_id, combat_controller_character_id,
    source_collection, source_id, source_snapshot
  ON public.companion_instances FOR EACH ROW
  EXECUTE FUNCTION app_private.normalize_scaled_companion_state();

-- ---------------------------------------------------------------------------
-- Saved sheet rows follow the scaled maximum
-- ---------------------------------------------------------------------------

-- A companion sheet row stores its scaled max HP and never exceeds it.
CREATE OR REPLACE FUNCTION app_private.clamp_scaled_companion_extra_hp()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_instance public.companion_instances%ROWTYPE;
  v_max INTEGER;
BEGIN
  IF NEW.companion_instance_id IS NULL THEN RETURN NEW; END IF;
  SELECT * INTO v_instance FROM public.companion_instances AS instance
  WHERE instance.id = NEW.companion_instance_id;
  IF NOT FOUND OR app_private.companion_scaling_hit_die(v_instance) IS NULL THEN
    RETURN NEW;
  END IF;
  v_max := floor(app_private.companion_c3_max_hp(v_instance))::INTEGER;
  NEW.hp_max := v_max;
  NEW.hp_current := GREATEST(0, LEAST(v_max, COALESCE(NEW.hp_current, v_max)));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS scaled_companion_extra_hp ON public.character_extras;
CREATE TRIGGER scaled_companion_extra_hp
  BEFORE INSERT OR UPDATE OF hp_current, hp_max, companion_instance_id
  ON public.character_extras FOR EACH ROW
  EXECUTE FUNCTION app_private.clamp_scaled_companion_extra_hp();

-- A newly registered living mount starts at full scaled HP; afterwards its HP
-- is clamped to the scaled maximum.
CREATE OR REPLACE FUNCTION app_private.clamp_scaled_companion_vehicle_hp()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_instance public.companion_instances%ROWTYPE;
  v_max INTEGER;
BEGIN
  IF NEW.companion_instance_id IS NULL THEN RETURN NEW; END IF;
  SELECT * INTO v_instance FROM public.companion_instances AS instance
  WHERE instance.id = NEW.companion_instance_id;
  IF NOT FOUND OR app_private.companion_scaling_hit_die(v_instance) IS NULL THEN
    RETURN NEW;
  END IF;
  v_max := floor(app_private.companion_c3_max_hp(v_instance))::INTEGER;
  IF TG_OP = 'UPDATE' AND OLD.companion_instance_id IS NULL THEN
    NEW.current_hp := v_max;
  ELSE
    NEW.current_hp := GREATEST(0, LEAST(v_max, NEW.current_hp));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS scaled_companion_vehicle_hp ON public.character_vehicles;
CREATE TRIGGER scaled_companion_vehicle_hp
  BEFORE INSERT OR UPDATE OF current_hp, companion_instance_id
  ON public.character_vehicles FOR EACH ROW
  EXECUTE FUNCTION app_private.clamp_scaled_companion_vehicle_hp();

-- ---------------------------------------------------------------------------
-- Active combat follows the owner's level
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app_private.refresh_scaled_companion_combat(p_instance_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_instance public.companion_instances%ROWTYPE;
  v_combatant_id UUID;
  v_max INTEGER;
  v_hp INTEGER;
BEGIN
  SELECT * INTO v_instance FROM public.companion_instances AS instance
  WHERE instance.id = p_instance_id FOR UPDATE;
  IF NOT FOUND OR app_private.companion_scaling_hit_die(v_instance) IS NULL THEN
    RETURN;
  END IF;

  -- The BEFORE trigger recomputes max HP and clamps wounds.
  UPDATE public.companion_instances AS instance
  SET combat_state = app_private.companion_c3_record(instance.combat_state)
  WHERE instance.id = p_instance_id
  RETURNING * INTO v_instance;
  PERFORM app_private.companion_c3_write_origin_state(v_instance, v_instance.combat_state);

  FOR v_combatant_id IN
    SELECT combatant.id FROM public.campaign_combatants AS combatant
    JOIN public.campaign_combat_sessions AS session_row ON session_row.id = combatant.session_id
    WHERE combatant.companion_instance_id = p_instance_id AND session_row.status = 'active'
    ORDER BY combatant.id FOR UPDATE OF combatant
  LOOP
    -- A prior combatant refresh may have advanced the durable state version.
    SELECT * INTO v_instance FROM public.companion_instances AS instance
    WHERE instance.id = p_instance_id FOR UPDATE;
    v_max := floor(app_private.companion_c3_max_hp(v_instance))::INTEGER;
    v_hp := GREATEST(0, LEAST(v_max,
      floor(COALESCE(app_private.companion_c3_number(v_instance.combat_state->'hp'), v_max))::INTEGER));

    -- Version fields do not invoke the C3 state trigger. The following stats
    -- update does, preserving its normal optimistic-concurrency checks.
    UPDATE public.campaign_combatants AS combatant
    SET companion_profile_version = v_instance.profile_version,
        companion_state_version = v_instance.combat_state_version
    WHERE combatant.id = v_combatant_id;
    UPDATE public.campaign_combatants AS combatant
    SET stats = (app_private.companion_c3_record(combatant.stats) - 'damage_dice')
          || jsonb_build_object(
            'hp', v_hp, 'max_hp', v_max,
            'ac', floor(app_private.companion_c3_ac(v_instance))::INTEGER,
            'proficiency_bonus', app_private.companion_proficiency_bonus(v_instance),
            'attack_bonus', app_private.companion_scaled_attack_bonus(v_instance),
            'save_dc', app_private.companion_scaled_save_dc(v_instance),
            'resources', app_private.companion_c3_record(v_instance.combat_state->'resources'),
            'downed', v_hp <= 0),
        conditions = app_private.companion_c3_array(v_instance.combat_state->'conditions'),
        flags = app_private.companion_c3_record(combatant.flags)
          || jsonb_build_object('profileVersion', v_instance.profile_version)
    WHERE combatant.id = v_combatant_id;
  END LOOP;
END;
$$;

-- Scaling follows ownership, not Warden coefficients.
DROP TRIGGER IF EXISTS companion_scaled_profile_refresh ON public.companion_instances;
DROP FUNCTION IF EXISTS app_private.refresh_scaled_companion_on_profile();

CREATE OR REPLACE FUNCTION app_private.refresh_scaled_companion_on_owner_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
BEGIN
  IF NEW.owner_character_id IS DISTINCT FROM OLD.owner_character_id
     OR NEW.primary_handler_character_id IS DISTINCT FROM OLD.primary_handler_character_id
     OR NEW.combat_controller_character_id IS DISTINCT FROM OLD.combat_controller_character_id THEN
    PERFORM app_private.refresh_scaled_companion_combat(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS companion_scaled_owner_refresh ON public.companion_instances;
CREATE TRIGGER companion_scaled_owner_refresh
AFTER UPDATE OF owner_character_id, primary_handler_character_id, combat_controller_character_id
ON public.companion_instances FOR EACH ROW
EXECUTE FUNCTION app_private.refresh_scaled_companion_on_owner_change();

CREATE OR REPLACE FUNCTION app_private.refresh_scaled_companions_on_level()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE v_id UUID;
BEGIN
  IF NEW.level IS NOT DISTINCT FROM OLD.level THEN RETURN NEW; END IF;
  FOR v_id IN SELECT instance.id FROM public.companion_instances AS instance
    WHERE COALESCE(instance.owner_character_id, instance.primary_handler_character_id,
                   instance.combat_controller_character_id) = NEW.id
      AND app_private.companion_scaling_hit_die(instance) IS NOT NULL
    ORDER BY instance.id
  LOOP
    PERFORM app_private.refresh_scaled_companion_combat(v_id);
  END LOOP;
  RETURN NEW;
END;
$$;

-- Warden coefficients and the shared damage string are retired.
DROP FUNCTION IF EXISTS public.set_companion_scaling_profile(UUID, UUID, JSONB);
DROP FUNCTION IF EXISTS app_private.companion_scaled_damage_dice(public.companion_instances);
DROP FUNCTION IF EXISTS app_private.companion_scaling_setting(
  public.companion_instances, TEXT, INTEGER, INTEGER, INTEGER);

UPDATE public.companion_instances AS instance
SET progression_profile = instance.progression_profile - 'scaling'
WHERE instance.progression_profile ? 'scaling';

-- ---------------------------------------------------------------------------
-- One-time move of existing creatures
-- ---------------------------------------------------------------------------

-- Old rule: every Anomaly companion and every mount scaled by rank
-- coefficients. New rule: only stat-block and combat-capable creatures scale.
-- As on a level-up, a raised maximum never heals: current HP is kept and
-- clamped to the new maximum. A creature that no longer scales returns to its
-- saved maximum.
DO $$
DECLARE
  v_instance public.companion_instances%ROWTYPE;
  v_now_scaled BOOLEAN;
  v_old_hp NUMERIC;
  v_new_max NUMERIC;
  v_new_hp INTEGER;
  v_combatant_id UUID;
BEGIN
  FOR v_instance IN
    SELECT * FROM public.companion_instances AS instance
    WHERE instance.source_collection IN ('anomalies', 'vehicles')
       OR instance.identity_kind = 'mount'
    ORDER BY instance.id
    FOR UPDATE
  LOOP
    v_now_scaled := app_private.companion_scaling_hit_die(v_instance) IS NOT NULL;
    v_old_hp := app_private.companion_c3_number(v_instance.combat_state->'hp');
    IF v_now_scaled THEN
      v_new_max := app_private.companion_c3_max_hp(v_instance);
    ELSE
      v_new_max := COALESCE(
        CASE v_instance.origin_table
          WHEN 'character_extras' THEN (
            SELECT NULLIF(extra.hp_max, 0)::NUMERIC FROM public.character_extras AS extra
            WHERE extra.id = v_instance.origin_row_id)
          WHEN 'character_vehicles' THEN (
            SELECT vehicle.max_hp_override::NUMERIC FROM public.character_vehicles AS vehicle
            WHERE vehicle.id = v_instance.origin_row_id)
        END,
        app_private.companion_c3_number(v_instance.stat_overrides->'hpMax'),
        app_private.companion_c3_number(v_instance.source_snapshot#>'{sourceFields,hpMax}'),
        app_private.companion_c3_number(v_instance.source_snapshot->'hpMax'));
    END IF;
    CONTINUE WHEN v_new_max IS NULL;
    v_new_hp := floor(GREATEST(0, LEAST(v_new_max, COALESCE(v_old_hp, v_new_max))))::INTEGER;

    UPDATE public.companion_instances AS instance
    SET combat_state = app_private.companion_c3_record(instance.combat_state)
          || jsonb_build_object('hp', v_new_hp, 'maxHp', floor(v_new_max)::INTEGER,
                                'downed', v_new_hp <= 0),
        updated_at = now()
    WHERE instance.id = v_instance.id
    RETURNING * INTO v_instance;
    PERFORM app_private.companion_c3_write_origin_state(v_instance, v_instance.combat_state);

    IF v_now_scaled THEN
      PERFORM app_private.refresh_scaled_companion_combat(v_instance.id);
    ELSE
      -- Rare: a creature in active combat that no longer scales drops its
      -- scaled combat numbers and takes its saved maximum.
      FOR v_combatant_id IN
        SELECT combatant.id FROM public.campaign_combatants AS combatant
        JOIN public.campaign_combat_sessions AS session_row ON session_row.id = combatant.session_id
        WHERE combatant.companion_instance_id = v_instance.id AND session_row.status = 'active'
        ORDER BY combatant.id FOR UPDATE OF combatant
      LOOP
        SELECT * INTO v_instance FROM public.companion_instances AS instance
        WHERE instance.id = v_instance.id FOR UPDATE;
        UPDATE public.campaign_combatants AS combatant
        SET companion_profile_version = v_instance.profile_version,
            companion_state_version = v_instance.combat_state_version
        WHERE combatant.id = v_combatant_id;
        UPDATE public.campaign_combatants AS combatant
        SET stats = (app_private.companion_c3_record(combatant.stats)
              - 'attack_bonus' - 'save_dc' - 'damage_dice' - 'proficiency_bonus')
              || jsonb_build_object('hp', v_new_hp, 'max_hp', floor(v_new_max)::INTEGER,
                                    'downed', v_new_hp <= 0)
              || jsonb_strip_nulls(jsonb_build_object(
                   'ac', floor(app_private.companion_c3_ac(v_instance))::INTEGER))
        WHERE combatant.id = v_combatant_id;
      END LOOP;
    END IF;
  END LOOP;
END;
$$;

-- ---------------------------------------------------------------------------
-- RA-17: the Holy Knight mount formerly called Sovereign Steed is the Pantheon
-- Steed. Its id is unchanged; saved default names and snapshots follow.
-- ---------------------------------------------------------------------------

SELECT set_config('app.companion_mapping_write', 'on', true);

UPDATE public.character_extras AS extra
SET name = CASE WHEN extra.name = 'Sovereign Steed' THEN 'Pantheon Steed' ELSE extra.name END,
    npc_data = CASE WHEN extra.npc_data#>>'{sourceFields,name}' = 'Sovereign Steed'
      THEN jsonb_set(extra.npc_data, '{sourceFields,name}', to_jsonb('Pantheon Steed'::TEXT))
      ELSE extra.npc_data END
WHERE extra.npc_data#>>'{provenance,canonicalId}' = 'mount-sovereign-steed'
  AND (extra.name = 'Sovereign Steed'
       OR extra.npc_data#>>'{sourceFields,name}' = 'Sovereign Steed');

UPDATE public.character_vehicles AS vehicle
SET nickname = CASE WHEN vehicle.nickname = 'Sovereign Steed' THEN 'Pantheon Steed' ELSE vehicle.nickname END,
    companion_source_snapshot = CASE
      WHEN vehicle.companion_source_snapshot#>>'{sourceFields,name}' = 'Sovereign Steed'
      THEN jsonb_set(vehicle.companion_source_snapshot, '{sourceFields,name}', to_jsonb('Pantheon Steed'::TEXT))
      ELSE vehicle.companion_source_snapshot END
WHERE vehicle.vehicle_id = 'mount-sovereign-steed'
  AND (vehicle.nickname = 'Sovereign Steed'
       OR vehicle.companion_source_snapshot#>>'{sourceFields,name}' = 'Sovereign Steed');

UPDATE public.campaign_vehicles AS vehicle
SET nickname = 'Pantheon Steed'
WHERE vehicle.vehicle_id = 'mount-sovereign-steed' AND vehicle.nickname = 'Sovereign Steed';

UPDATE public.companion_instances AS instance
SET source_snapshot = CASE
      WHEN instance.source_snapshot#>>'{sourceFields,name}' = 'Sovereign Steed'
      THEN jsonb_set(instance.source_snapshot, '{sourceFields,name}', to_jsonb('Pantheon Steed'::TEXT))
      ELSE instance.source_snapshot END,
    combat_state = CASE WHEN instance.combat_state->>'name' = 'Sovereign Steed'
      THEN jsonb_set(instance.combat_state, '{name}', to_jsonb('Pantheon Steed'::TEXT))
      ELSE instance.combat_state END
WHERE instance.source_collection = 'vehicles'
  AND instance.source_id = 'mount-sovereign-steed'
  AND (instance.source_snapshot#>>'{sourceFields,name}' = 'Sovereign Steed'
       OR instance.combat_state->>'name' = 'Sovereign Steed');

UPDATE public.campaign_combatants AS combatant
SET name = 'Pantheon Steed'
FROM public.companion_instances AS instance
WHERE instance.id = combatant.companion_instance_id
  AND instance.source_collection = 'vehicles'
  AND instance.source_id = 'mount-sovereign-steed'
  AND combatant.name = 'Sovereign Steed';

SELECT set_config('app.companion_mapping_write', 'off', true);
SELECT set_config('app.companion_c3_origin_sync', 'off', true);

-- ---------------------------------------------------------------------------
-- Internal helpers only
-- ---------------------------------------------------------------------------

REVOKE ALL ON FUNCTION app_private.companion_level_for_scaling(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_rank_tier(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_scaling_hit_die(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_proficiency_bonus(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_max_hp(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_ac(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_scaled_attack_bonus(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_scaled_save_dc(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.normalize_scaled_companion_state() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.clamp_scaled_companion_extra_hp() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.clamp_scaled_companion_vehicle_hp() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.refresh_scaled_companion_combat(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.refresh_scaled_companion_on_owner_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.refresh_scaled_companions_on_level() FROM PUBLIC, anon, authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

-- Keep active combat projections aligned with the living companion whenever
-- its handler level or Warden-approved profile changes.
BEGIN;

CREATE OR REPLACE FUNCTION app_private.companion_scaled_attack_bonus(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SET search_path = pg_catalog, public AS $$
  SELECT app_private.companion_scaling_setting(p_instance, 'attackBase',
    2 + app_private.companion_rank_tier(p_instance), 0, 20)
    + 2 + floor((app_private.companion_level_for_scaling(p_instance) - 1)::NUMERIC / 4)::INTEGER;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_scaled_save_dc(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SET search_path = pg_catalog, public AS $$
  SELECT app_private.companion_scaling_setting(p_instance, 'saveBase',
    8 + app_private.companion_rank_tier(p_instance), 0, 30)
    + 2 + floor((app_private.companion_level_for_scaling(p_instance) - 1)::NUMERIC / 4)::INTEGER;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_scaled_damage_dice(p_instance public.companion_instances)
RETURNS TEXT LANGUAGE sql STABLE SET search_path = pg_catalog, public AS $$
  SELECT (app_private.companion_scaling_setting(p_instance, 'damageDiceBase',
    1 + app_private.companion_rank_tier(p_instance), 1, 20)
    + floor((app_private.companion_level_for_scaling(p_instance) - 1)::NUMERIC /
      app_private.companion_scaling_setting(p_instance, 'damageEveryLevels', 4, 1, 20))::INTEGER)::TEXT
    || 'd' || app_private.companion_scaling_setting(p_instance, 'damageDie', 6, 4, 12)::TEXT;
$$;

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
  IF NOT FOUND OR (v_instance.source_collection <> 'anomalies' AND v_instance.identity_kind <> 'mount') THEN
    RETURN;
  END IF;

  -- The BEFORE trigger replaces any source-sized max HP and clamps wounds.
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
    SET stats = app_private.companion_c3_record(combatant.stats) || jsonb_build_object(
          'hp', v_hp, 'max_hp', v_max,
          'ac', floor(app_private.companion_c3_ac(v_instance))::INTEGER,
          'attack_bonus', app_private.companion_scaled_attack_bonus(v_instance),
          'save_dc', app_private.companion_scaled_save_dc(v_instance),
          'damage_dice', app_private.companion_scaled_damage_dice(v_instance),
          'resources', app_private.companion_c3_record(v_instance.combat_state->'resources'),
          'downed', v_hp <= 0),
        conditions = app_private.companion_c3_array(v_instance.combat_state->'conditions'),
        flags = app_private.companion_c3_record(combatant.flags)
          || jsonb_build_object('profileVersion', v_instance.profile_version)
    WHERE combatant.id = v_combatant_id;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.refresh_scaled_companion_on_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
BEGIN
  IF NEW.progression_profile IS DISTINCT FROM OLD.progression_profile
     OR NEW.primary_handler_character_id IS DISTINCT FROM OLD.primary_handler_character_id
     OR NEW.rider_character_id IS DISTINCT FROM OLD.rider_character_id
     OR NEW.owner_character_id IS DISTINCT FROM OLD.owner_character_id THEN
    PERFORM app_private.refresh_scaled_companion_combat(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS companion_scaled_profile_refresh ON public.companion_instances;
CREATE TRIGGER companion_scaled_profile_refresh
AFTER UPDATE OF progression_profile, primary_handler_character_id,
  rider_character_id, owner_character_id
ON public.companion_instances FOR EACH ROW
EXECUTE FUNCTION app_private.refresh_scaled_companion_on_profile();

CREATE OR REPLACE FUNCTION app_private.refresh_scaled_companions_on_level()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE v_id UUID;
BEGIN
  IF NEW.level IS NOT DISTINCT FROM OLD.level THEN RETURN NEW; END IF;
  FOR v_id IN SELECT instance.id FROM public.companion_instances AS instance
    WHERE instance.primary_handler_character_id = NEW.id
       OR (instance.primary_handler_character_id IS NULL AND instance.rider_character_id = NEW.id)
       OR (instance.primary_handler_character_id IS NULL AND instance.rider_character_id IS NULL
           AND instance.owner_character_id = NEW.id)
    ORDER BY instance.id
  LOOP
    PERFORM app_private.refresh_scaled_companion_combat(v_id);
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS characters_scaled_companion_level_refresh ON public.characters;
CREATE TRIGGER characters_scaled_companion_level_refresh
AFTER UPDATE OF level ON public.characters FOR EACH ROW
EXECUTE FUNCTION app_private.refresh_scaled_companions_on_level();

CREATE OR REPLACE FUNCTION app_private.refresh_new_scaled_companion_combatant()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
BEGIN
  IF NEW.companion_instance_id IS NOT NULL THEN
    PERFORM app_private.refresh_scaled_companion_combat(NEW.companion_instance_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS campaign_combatants_scaled_initial_refresh ON public.campaign_combatants;
CREATE TRIGGER campaign_combatants_scaled_initial_refresh
AFTER INSERT ON public.campaign_combatants FOR EACH ROW
WHEN (NEW.companion_instance_id IS NOT NULL)
EXECUTE FUNCTION app_private.refresh_new_scaled_companion_combatant();

REVOKE ALL ON FUNCTION app_private.companion_scaled_attack_bonus(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_scaled_save_dc(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_scaled_damage_dice(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.refresh_scaled_companion_combat(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.refresh_scaled_companion_on_profile() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.refresh_scaled_companions_on_level() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.refresh_new_scaled_companion_combatant() FROM PUBLIC, anon, authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

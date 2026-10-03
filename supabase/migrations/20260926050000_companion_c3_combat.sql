-- C3: persistent living-companion combat linkage, initiative/action profile
-- metadata, combat-state reconciliation, mounting guardrails and profile-driven
-- rests. C3 deliberately does not invent universal progression, healing,
-- rider-size, terrain, tack or training defaults: those are read only from the
-- versioned companion profiles when explicitly authored.

BEGIN;

ALTER TABLE public.companion_instances
  ADD COLUMN IF NOT EXISTS combat_state_version BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS combat_state JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.campaign_combatants
  ADD COLUMN IF NOT EXISTS companion_instance_id UUID,
  ADD COLUMN IF NOT EXISTS companion_profile_version INTEGER,
  ADD COLUMN IF NOT EXISTS companion_state_version BIGINT,
  ADD COLUMN IF NOT EXISTS initiative_mode TEXT,
  ADD COLUMN IF NOT EXISTS initiative_anchor_character_id UUID;

ALTER TABLE public.campaign_combatants
  DROP CONSTRAINT IF EXISTS campaign_combatants_companion_instance_id_fkey,
  ADD CONSTRAINT campaign_combatants_companion_instance_id_fkey
    FOREIGN KEY (companion_instance_id)
    REFERENCES public.companion_instances(id)
    ON DELETE RESTRICT,
  DROP CONSTRAINT IF EXISTS campaign_combatants_initiative_mode_check,
  ADD CONSTRAINT campaign_combatants_initiative_mode_check
    CHECK (initiative_mode IS NULL OR initiative_mode IN ('independent', 'linked')),
  DROP CONSTRAINT IF EXISTS campaign_combatants_companion_profile_version_check,
  ADD CONSTRAINT campaign_combatants_companion_profile_version_check
    CHECK (companion_profile_version IS NULL OR companion_profile_version >= 1),
  DROP CONSTRAINT IF EXISTS campaign_combatants_companion_state_version_check,
  ADD CONSTRAINT campaign_combatants_companion_state_version_check
    CHECK (companion_state_version IS NULL OR companion_state_version >= 0);

CREATE UNIQUE INDEX IF NOT EXISTS campaign_combatants_companion_once_per_session
  ON public.campaign_combatants(session_id, companion_instance_id)
  WHERE companion_instance_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS campaign_combatants_companion_instance_idx
  ON public.campaign_combatants(companion_instance_id)
  WHERE companion_instance_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS campaign_combatants_initiative_anchor_idx
  ON public.campaign_combatants(session_id, initiative_anchor_character_id)
  WHERE initiative_anchor_character_id IS NOT NULL;

-- Seed the registry from the compatibility projections that already own HP and
-- conditions. This is restart-safe and does not change the legacy rows.
UPDATE public.companion_instances AS instance
SET combat_state = jsonb_strip_nulls(jsonb_build_object(
      'hp', extra.hp_current,
      'maxHp', extra.hp_max,
      'conditions', COALESCE(extra.conditions, '[]'::jsonb),
      'resources', '{}'::jsonb,
      'downed', extra.hp_current <= 0
    )),
    updated_at = now()
FROM public.character_extras AS extra
WHERE instance.origin_table = 'character_extras'
  AND instance.origin_row_id = extra.id
  AND instance.combat_state = '{}'::jsonb;

UPDATE public.companion_instances AS instance
SET combat_state = jsonb_strip_nulls(jsonb_build_object(
      'hp', tamed.current_hp,
      'maxHp', tamed.max_hp_override,
      'conditions', COALESCE(tamed.conditions, '[]'::jsonb),
      'resources', '{}'::jsonb,
      'downed', tamed.current_hp <= 0
    )),
    updated_at = now()
FROM public.character_tamed_anomalies AS tamed
WHERE instance.origin_table = 'character_tamed_anomalies'
  AND instance.origin_row_id = tamed.id
  AND instance.combat_state = '{}'::jsonb;

UPDATE public.companion_instances AS instance
SET combat_state = jsonb_strip_nulls(jsonb_build_object(
      'hp', tamed.current_hp,
      'maxHp', tamed.max_hp_override,
      'conditions', COALESCE(tamed.conditions, '[]'::jsonb),
      'resources', '{}'::jsonb,
      'downed', tamed.current_hp <= 0
    )),
    updated_at = now()
FROM public.campaign_tamed_anomalies AS tamed
WHERE instance.origin_table = 'campaign_tamed_anomalies'
  AND instance.origin_row_id = tamed.id
  AND instance.combat_state = '{}'::jsonb;

UPDATE public.companion_instances AS instance
SET combat_state = jsonb_strip_nulls(jsonb_build_object(
      'hp', vehicle.current_hp,
      'maxHp', vehicle.max_hp_override,
      'conditions', COALESCE(vehicle.conditions, '[]'::jsonb),
      'conditionState', vehicle.condition_state,
      'resources', '{}'::jsonb,
      'downed', vehicle.current_hp <= 0
    )),
    updated_at = now()
FROM public.character_vehicles AS vehicle
WHERE instance.origin_table = 'character_vehicles'
  AND instance.origin_row_id = vehicle.id
  AND instance.combat_state = '{}'::jsonb;

CREATE OR REPLACE FUNCTION app_private.companion_c3_record(p_value JSONB)
RETURNS JSONB
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog
AS $$
  SELECT CASE WHEN jsonb_typeof(COALESCE(p_value, '{}'::jsonb)) = 'object'
    THEN COALESCE(p_value, '{}'::jsonb)
    ELSE '{}'::jsonb
  END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_array(p_value JSONB)
RETURNS JSONB
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog
AS $$
  SELECT CASE WHEN jsonb_typeof(COALESCE(p_value, '[]'::jsonb)) = 'array'
    THEN COALESCE(p_value, '[]'::jsonb)
    ELSE '[]'::jsonb
  END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_number(p_value JSONB)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
SET search_path = pg_catalog
AS $$
BEGIN
  IF p_value IS NULL OR jsonb_typeof(p_value) <> 'number' THEN RETURN NULL; END IF;
  RETURN (p_value #>> '{}')::NUMERIC;
EXCEPTION WHEN invalid_text_representation OR numeric_value_out_of_range THEN
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_name(
  p_instance public.companion_instances
)
RETURNS TEXT
LANGUAGE sql
STABLE
SET search_path = pg_catalog, public
AS $$
  SELECT COALESCE(
    NULLIF(p_instance.combat_state->>'name', ''),
    NULLIF(p_instance.source_snapshot#>>'{sourceFields,name}', ''),
    NULLIF(p_instance.source_snapshot->>'name', ''),
    NULLIF(p_instance.source_id, ''),
    'Companion'
  );
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_max_hp(
  p_instance public.companion_instances
)
RETURNS NUMERIC
LANGUAGE sql
STABLE
SET search_path = pg_catalog, public
AS $$
  SELECT COALESCE(
    app_private.companion_c3_number(p_instance.combat_state->'maxHp'),
    app_private.companion_c3_number(p_instance.stat_overrides->'hpMax'),
    app_private.companion_c3_number(p_instance.source_snapshot#>'{sourceFields,hpMax}'),
    app_private.companion_c3_number(p_instance.source_snapshot->'hpMax')
  );
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_ac(
  p_instance public.companion_instances
)
RETURNS NUMERIC
LANGUAGE sql
STABLE
SET search_path = pg_catalog, public
AS $$
  SELECT COALESCE(
    app_private.companion_c3_number(p_instance.stat_overrides->'baseAc'),
    app_private.companion_c3_number(p_instance.source_snapshot#>'{sourceFields,baseAc}'),
    app_private.companion_c3_number(p_instance.source_snapshot->'baseAc')
  );
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_accessible_to_campaign(
  p_instance public.companion_instances,
  p_campaign_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT CASE p_instance.owner_scope
    WHEN 'campaign' THEN p_instance.owner_campaign_id = p_campaign_id
    WHEN 'character' THEN p_instance.owner_character_id IS NOT NULL
      AND app_private.companion_character_in_campaign(
        p_campaign_id,
        p_instance.owner_character_id
      )
    ELSE false
  END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_write_origin_state(
  p_instance public.companion_instances,
  p_state JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_hp INTEGER;
  v_conditions JSONB := app_private.companion_c3_array(p_state->'conditions');
BEGIN
  BEGIN
    v_hp := floor(COALESCE(app_private.companion_c3_number(p_state->'hp'), 0))::INTEGER;
  EXCEPTION WHEN numeric_value_out_of_range THEN
    v_hp := 0;
  END;
  v_hp := GREATEST(v_hp, 0);

  PERFORM set_config('app.companion_c3_origin_sync', 'on', true);

  CASE p_instance.origin_table
    WHEN 'character_extras' THEN
      UPDATE public.character_extras
      SET hp_current = v_hp,
          conditions = v_conditions
      WHERE id = p_instance.origin_row_id;
    WHEN 'character_tamed_anomalies' THEN
      UPDATE public.character_tamed_anomalies
      SET current_hp = v_hp,
          conditions = v_conditions,
          updated_at = now()
      WHERE id = p_instance.origin_row_id;
    WHEN 'campaign_tamed_anomalies' THEN
      UPDATE public.campaign_tamed_anomalies
      SET current_hp = v_hp,
          conditions = v_conditions,
          updated_at = now()
      WHERE id = p_instance.origin_row_id;
    WHEN 'character_vehicles' THEN
      UPDATE public.character_vehicles
      SET current_hp = v_hp,
          conditions = v_conditions,
          updated_at = now()
      WHERE id = p_instance.origin_row_id;
    ELSE
      NULL;
  END CASE;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_origin_to_registry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_instance_id UUID;
  v_hp INTEGER;
  v_max_hp INTEGER;
  v_conditions JSONB := '[]'::jsonb;
  v_extra JSONB := '{}'::jsonb;
BEGIN
  IF current_setting('app.companion_c3_origin_sync', true) = 'on' THEN
    RETURN NEW;
  END IF;

  v_instance_id := NULLIF(to_jsonb(NEW)->>'companion_instance_id', '')::UUID;
  IF v_instance_id IS NULL THEN RETURN NEW; END IF;

  BEGIN
    v_hp := (to_jsonb(NEW)->>'hp_current')::INTEGER;
  EXCEPTION WHEN invalid_text_representation THEN
    BEGIN
      v_hp := (to_jsonb(NEW)->>'current_hp')::INTEGER;
    EXCEPTION WHEN invalid_text_representation THEN v_hp := NULL;
    END;
  END;
  IF v_hp IS NULL THEN
    BEGIN v_hp := (to_jsonb(NEW)->>'current_hp')::INTEGER;
    EXCEPTION WHEN invalid_text_representation THEN v_hp := 0;
    END;
  END IF;

  BEGIN
    v_max_hp := NULLIF(COALESCE(
      to_jsonb(NEW)->>'hp_max',
      to_jsonb(NEW)->>'max_hp_override'
    ), '')::INTEGER;
  EXCEPTION WHEN invalid_text_representation THEN v_max_hp := NULL;
  END;

  IF jsonb_typeof(to_jsonb(NEW)->'conditions') = 'array' THEN
    v_conditions := to_jsonb(NEW)->'conditions';
  END IF;
  IF to_jsonb(NEW) ? 'condition_state' THEN
    v_extra := jsonb_build_object('conditionState', to_jsonb(NEW)->>'condition_state');
  END IF;

  UPDATE public.companion_instances AS instance
  SET combat_state = app_private.companion_c3_record(instance.combat_state)
      || jsonb_strip_nulls(jsonb_build_object(
        'hp', GREATEST(COALESCE(v_hp, 0), 0),
        'maxHp', v_max_hp,
        'conditions', v_conditions,
        'downed', COALESCE(v_hp, 0) <= 0
      )) || v_extra,
      combat_state_version = instance.combat_state_version + 1,
      updated_at = now()
  WHERE instance.id = v_instance_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS character_extras_c3_state_sync ON public.character_extras;
CREATE TRIGGER character_extras_c3_state_sync
AFTER INSERT OR UPDATE OF hp_current, hp_max, conditions ON public.character_extras
FOR EACH ROW EXECUTE FUNCTION app_private.companion_c3_origin_to_registry();

DROP TRIGGER IF EXISTS character_tamed_c3_state_sync ON public.character_tamed_anomalies;
CREATE TRIGGER character_tamed_c3_state_sync
AFTER INSERT OR UPDATE OF current_hp, max_hp_override, conditions ON public.character_tamed_anomalies
FOR EACH ROW EXECUTE FUNCTION app_private.companion_c3_origin_to_registry();

DROP TRIGGER IF EXISTS campaign_tamed_c3_state_sync ON public.campaign_tamed_anomalies;
CREATE TRIGGER campaign_tamed_c3_state_sync
AFTER INSERT OR UPDATE OF current_hp, max_hp_override, conditions ON public.campaign_tamed_anomalies
FOR EACH ROW EXECUTE FUNCTION app_private.companion_c3_origin_to_registry();

DROP TRIGGER IF EXISTS character_vehicles_c3_state_sync ON public.character_vehicles;
CREATE TRIGGER character_vehicles_c3_state_sync
AFTER INSERT OR UPDATE OF current_hp, max_hp_override, conditions, condition_state ON public.character_vehicles
FOR EACH ROW EXECUTE FUNCTION app_private.companion_c3_origin_to_registry();

-- Build a durable combat projection. Repeat calls return the already-linked row
-- and never create a duplicate actor for one living instance in one session.
CREATE OR REPLACE FUNCTION public.add_companion_to_combat(
  p_session_id UUID,
  p_companion_instance_id UUID,
  p_initiative INTEGER DEFAULT NULL,
  p_initiative_mode TEXT DEFAULT NULL,
  p_anchor_character_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_session public.campaign_combat_sessions%ROWTYPE;
  v_instance public.companion_instances%ROWTYPE;
  v_existing UUID;
  v_mode TEXT;
  v_anchor_initiative INTEGER;
  v_name TEXT;
  v_hp NUMERIC;
  v_max_hp NUMERIC;
  v_ac NUMERIC;
  v_reaction_pool TEXT;
  v_id UUID;
BEGIN
  SELECT * INTO v_session
  FROM public.campaign_combat_sessions AS session
  WHERE session.id = p_session_id
  FOR UPDATE;
  IF NOT FOUND OR v_session.status <> 'active' THEN
    RAISE EXCEPTION 'ACTIVE_COMBAT_SESSION_REQUIRED' USING ERRCODE = '22023';
  END IF;
  IF auth.uid() IS NULL OR NOT public.is_campaign_system(v_session.campaign_id, auth.uid()) THEN
    RAISE EXCEPTION 'WARDEN_COMBAT_CONTROL_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_instance
  FROM public.companion_instances AS instance
  WHERE instance.id = p_companion_instance_id
  FOR UPDATE;
  IF NOT FOUND OR NOT app_private.companion_c3_accessible_to_campaign(v_instance, v_session.campaign_id) THEN
    RAISE EXCEPTION 'COMPANION_NOT_AVAILABLE_TO_CAMPAIGN' USING ERRCODE = '42501';
  END IF;

  SELECT combatant.id INTO v_existing
  FROM public.campaign_combatants AS combatant
  WHERE combatant.session_id = p_session_id
    AND combatant.companion_instance_id = p_companion_instance_id
  LIMIT 1;
  IF v_existing IS NOT NULL THEN RETURN v_existing; END IF;

  v_mode := COALESCE(
    NULLIF(p_initiative_mode, ''),
    NULLIF(v_instance.progression_profile#>>'{combat,initiativeMode}', ''),
    'independent'
  );
  IF v_mode NOT IN ('independent', 'linked') THEN
    RAISE EXCEPTION 'INVALID_COMPANION_INITIATIVE_MODE' USING ERRCODE = '22023';
  END IF;

  IF v_mode = 'linked' THEN
    IF p_anchor_character_id IS NULL
       OR NOT app_private.companion_character_in_campaign(v_session.campaign_id, p_anchor_character_id) THEN
      RAISE EXCEPTION 'LINKED_INITIATIVE_ANCHOR_REQUIRED' USING ERRCODE = '22023';
    END IF;
    SELECT combatant.initiative INTO v_anchor_initiative
    FROM public.campaign_combatants AS combatant
    JOIN public.campaign_members AS member_row ON member_row.id = combatant.member_id
    WHERE combatant.session_id = p_session_id
      AND member_row.character_id = p_anchor_character_id
    ORDER BY combatant.created_at ASC
    LIMIT 1;
    IF v_anchor_initiative IS NULL THEN
      RAISE EXCEPTION 'LINKED_INITIATIVE_ANCHOR_NOT_IN_COMBAT' USING ERRCODE = '22023';
    END IF;
  ELSIF p_initiative IS NULL THEN
    RAISE EXCEPTION 'INDEPENDENT_INITIATIVE_REQUIRED' USING ERRCODE = '22023';
  END IF;

  v_name := app_private.companion_c3_name(v_instance);
  v_hp := COALESCE(app_private.companion_c3_number(v_instance.combat_state->'hp'), app_private.companion_c3_max_hp(v_instance), 0);
  v_max_hp := app_private.companion_c3_max_hp(v_instance);
  v_ac := app_private.companion_c3_ac(v_instance);
  v_reaction_pool := COALESCE(NULLIF(v_instance.progression_profile#>>'{combat,reactionPool}', ''), 'separate');
  IF v_reaction_pool NOT IN ('separate', 'shared-rider') THEN
    RAISE EXCEPTION 'INVALID_COMPANION_REACTION_PROFILE' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.campaign_combatants (
    campaign_id, session_id, name, initiative, stats, conditions, flags,
    companion_instance_id, companion_profile_version, companion_state_version,
    initiative_mode, initiative_anchor_character_id
  ) VALUES (
    v_session.campaign_id,
    p_session_id,
    v_name,
    CASE WHEN v_mode = 'linked' THEN v_anchor_initiative ELSE p_initiative END,
    jsonb_strip_nulls(jsonb_build_object(
      'hp', floor(GREATEST(v_hp, 0))::INTEGER,
      'max_hp', CASE WHEN v_max_hp IS NULL THEN NULL ELSE floor(v_max_hp)::INTEGER END,
      'ac', CASE WHEN v_ac IS NULL THEN NULL ELSE floor(v_ac)::INTEGER END,
      'resources', app_private.companion_c3_record(v_instance.combat_state->'resources'),
      'downed', COALESCE((v_instance.combat_state->>'downed')::BOOLEAN, v_hp <= 0)
    )),
    app_private.companion_c3_array(v_instance.combat_state->'conditions'),
    jsonb_build_object(
      'actorKind', 'companion',
      'companionInstanceId', v_instance.id,
      'profileVersion', v_instance.profile_version,
      'reactionPool', v_reaction_pool,
      'reactionAvailable', true
    ),
    v_instance.id,
    v_instance.profile_version,
    v_instance.combat_state_version,
    v_mode,
    CASE WHEN v_mode = 'linked' THEN p_anchor_character_id ELSE NULL END
  )
  ON CONFLICT (session_id, companion_instance_id)
    WHERE companion_instance_id IS NOT NULL
  DO NOTHING
  RETURNING id INTO v_id;

  IF v_id IS NULL THEN
    SELECT id INTO v_id FROM public.campaign_combatants
    WHERE session_id = p_session_id
      AND companion_instance_id = p_companion_instance_id;
  END IF;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.companion_c3_combatant_sync()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_instance public.companion_instances%ROWTYPE;
  v_state JSONB;
  v_hp NUMERIC;
BEGIN
  IF NEW.companion_instance_id IS NULL THEN RETURN NEW; END IF;

  SELECT * INTO v_instance
  FROM public.companion_instances AS instance
  WHERE instance.id = NEW.companion_instance_id
  FOR UPDATE;
  IF NOT FOUND OR NOT app_private.companion_c3_accessible_to_campaign(v_instance, NEW.campaign_id) THEN
    RAISE EXCEPTION 'COMPANION_NOT_AVAILABLE_TO_CAMPAIGN' USING ERRCODE = '42501';
  END IF;

  IF NEW.companion_profile_version IS NULL THEN NEW.companion_profile_version := v_instance.profile_version; END IF;
  IF NEW.companion_profile_version <> v_instance.profile_version THEN
    RAISE EXCEPTION 'COMPANION_PROFILE_VERSION_MISMATCH' USING ERRCODE = '40001';
  END IF;

  IF TG_OP = 'UPDATE'
     AND OLD.companion_state_version IS NOT NULL
     AND OLD.companion_state_version <> v_instance.combat_state_version THEN
    RAISE EXCEPTION 'STALE_COMPANION_COMBAT_STATE' USING ERRCODE = '40001';
  END IF;

  IF NEW.initiative_mode = 'linked' THEN
    IF NEW.initiative_anchor_character_id IS NULL THEN
      RAISE EXCEPTION 'LINKED_INITIATIVE_ANCHOR_REQUIRED' USING ERRCODE = '22023';
    END IF;
    SELECT combatant.initiative INTO NEW.initiative
    FROM public.campaign_combatants AS combatant
    JOIN public.campaign_members AS member_row ON member_row.id = combatant.member_id
    WHERE combatant.session_id = NEW.session_id
      AND member_row.character_id = NEW.initiative_anchor_character_id
    ORDER BY combatant.created_at ASC
    LIMIT 1;
    IF NEW.initiative IS NULL THEN
      RAISE EXCEPTION 'LINKED_INITIATIVE_ANCHOR_NOT_IN_COMBAT' USING ERRCODE = '22023';
    END IF;
  END IF;

  v_hp := COALESCE(app_private.companion_c3_number(NEW.stats->'hp'), 0);
  v_state := app_private.companion_c3_record(v_instance.combat_state)
    || jsonb_build_object(
      'hp', floor(GREATEST(v_hp, 0))::INTEGER,
      'conditions', app_private.companion_c3_array(NEW.conditions),
      'resources', app_private.companion_c3_record(NEW.stats->'resources'),
      'downed', COALESCE((NEW.stats->>'downed')::BOOLEAN, v_hp <= 0)
    );

  UPDATE public.companion_instances AS instance
  SET combat_state = v_state,
      combat_state_version = instance.combat_state_version + 1,
      updated_at = now()
  WHERE instance.id = v_instance.id
  RETURNING combat_state_version INTO NEW.companion_state_version;

  PERFORM app_private.companion_c3_write_origin_state(v_instance, v_state);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS campaign_combatants_c3_companion_sync ON public.campaign_combatants;
CREATE TRIGGER campaign_combatants_c3_companion_sync
BEFORE INSERT OR UPDATE OF stats, conditions, initiative, initiative_mode,
  initiative_anchor_character_id, companion_instance_id
ON public.campaign_combatants
FOR EACH ROW EXECUTE FUNCTION app_private.companion_c3_combatant_sync();

-- When a linked character initiative changes, linked companions follow that
-- value. This keeps tracker and session views on one persisted turn order.
CREATE OR REPLACE FUNCTION app_private.companion_c3_follow_linked_initiative()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_character_id UUID;
BEGIN
  IF NEW.member_id IS NULL OR NEW.initiative IS NOT DISTINCT FROM OLD.initiative THEN RETURN NEW; END IF;
  SELECT member_row.character_id INTO v_character_id
  FROM public.campaign_members AS member_row
  WHERE member_row.id = NEW.member_id;
  IF v_character_id IS NULL THEN RETURN NEW; END IF;

  UPDATE public.campaign_combatants AS companion
  SET initiative = NEW.initiative
  WHERE companion.session_id = NEW.session_id
    AND companion.initiative_mode = 'linked'
    AND companion.initiative_anchor_character_id = v_character_id
    AND companion.companion_instance_id IS NOT NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS campaign_combatants_c3_linked_follow ON public.campaign_combatants;
CREATE TRIGGER campaign_combatants_c3_linked_follow
AFTER UPDATE OF initiative ON public.campaign_combatants
FOR EACH ROW EXECUTE FUNCTION app_private.companion_c3_follow_linked_initiative();

-- Profile-driven companion rests. Missing rules are a no-op by design. Supported
-- authored healing forms are none, full, and flat(amount). Conditions/resources
-- are changed only when the profile explicitly declares those operations.
CREATE OR REPLACE FUNCTION public.rest_companions_for_character(
  p_character_id UUID,
  p_rest_kind TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_instance public.companion_instances%ROWTYPE;
  v_rule JSONB;
  v_state JSONB;
  v_heal_kind TEXT;
  v_amount NUMERIC;
  v_hp NUMERIC;
  v_max_hp NUMERIC;
  v_count INTEGER := 0;
BEGIN
  IF p_rest_kind NOT IN ('short', 'long') THEN
    RAISE EXCEPTION 'INVALID_COMPANION_REST_KIND' USING ERRCODE = '22023';
  END IF;
  IF v_actor IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'CHARACTER_OWNER_REQUIRED' USING ERRCODE = '42501';
  END IF;

  FOR v_instance IN
    SELECT instance.*
    FROM public.companion_instances AS instance
    WHERE instance.primary_handler_character_id = p_character_id
       OR instance.owner_character_id = p_character_id
    ORDER BY instance.id
    FOR UPDATE
  LOOP
    v_rule := v_instance.progression_profile#>ARRAY['rest', p_rest_kind];
    IF jsonb_typeof(COALESCE(v_rule, 'null'::jsonb)) <> 'object' THEN CONTINUE; END IF;

    v_state := app_private.companion_c3_record(v_instance.combat_state);
    v_heal_kind := COALESCE(v_rule#>>'{heal,kind}', 'none');
    v_hp := COALESCE(app_private.companion_c3_number(v_state->'hp'), 0);
    v_max_hp := app_private.companion_c3_max_hp(v_instance);

    IF v_heal_kind = 'full' THEN
      IF v_max_hp IS NULL THEN
        RAISE EXCEPTION 'COMPANION_REST_MAX_HP_REQUIRED' USING ERRCODE = '22023';
      END IF;
      v_hp := v_max_hp;
    ELSIF v_heal_kind = 'flat' THEN
      v_amount := app_private.companion_c3_number(v_rule#>'{heal,amount}');
      IF v_amount IS NULL OR v_amount < 0 THEN
        RAISE EXCEPTION 'INVALID_COMPANION_REST_HEAL_AMOUNT' USING ERRCODE = '22023';
      END IF;
      v_hp := v_hp + v_amount;
      IF v_max_hp IS NOT NULL THEN v_hp := LEAST(v_hp, v_max_hp); END IF;
    ELSIF v_heal_kind <> 'none' THEN
      RAISE EXCEPTION 'UNSUPPORTED_COMPANION_REST_HEAL_RULE' USING ERRCODE = '22023';
    END IF;

    v_state := v_state || jsonb_build_object('hp', floor(GREATEST(v_hp, 0))::INTEGER);
    IF COALESCE((v_rule->>'clearDowned')::BOOLEAN, false) AND v_hp > 0 THEN
      v_state := v_state || jsonb_build_object('downed', false);
    END IF;
    IF v_rule ? 'conditions' THEN
      IF v_rule->>'conditions' = 'clear' THEN
        v_state := v_state || jsonb_build_object('conditions', '[]'::jsonb);
      ELSIF v_rule->>'conditions' <> 'preserve' THEN
        RAISE EXCEPTION 'UNSUPPORTED_COMPANION_REST_CONDITION_RULE' USING ERRCODE = '22023';
      END IF;
    END IF;
    IF v_rule ? 'resources' THEN
      IF jsonb_typeof(v_rule->'resources') <> 'object' THEN
        RAISE EXCEPTION 'INVALID_COMPANION_REST_RESOURCE_RULE' USING ERRCODE = '22023';
      END IF;
      v_state := v_state || jsonb_build_object('resources', v_rule->'resources');
    END IF;

    UPDATE public.companion_instances AS instance
    SET combat_state = v_state,
        combat_state_version = instance.combat_state_version + 1,
        updated_at = now()
    WHERE instance.id = v_instance.id;
    PERFORM app_private.companion_c3_write_origin_state(v_instance, v_state);
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

-- Mounting is an explicit relationship operation. C3 only enforces constraints
-- that are actually present in mount_profile; absent size/terrain/tack/training
-- policy remains Warden/manual rather than silently choosing a default.
CREATE OR REPLACE FUNCTION public.set_companion_rider(
  p_companion_instance_id UUID,
  p_rider_character_id UUID,
  p_rider_size TEXT DEFAULT NULL,
  p_terrain TEXT DEFAULT NULL,
  p_has_tack BOOLEAN DEFAULT NULL,
  p_is_trained BOOLEAN DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_instance public.companion_instances%ROWTYPE;
  v_profile JSONB;
  v_campaign UUID;
  v_rider_owner UUID;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_instance
  FROM public.companion_instances AS instance
  WHERE instance.id = p_companion_instance_id
  FOR UPDATE;
  IF NOT FOUND OR v_instance.mount_profile IS NULL THEN
    RAISE EXCEPTION 'MOUNT_PROFILE_REQUIRED' USING ERRCODE = '22023';
  END IF;

  SELECT user_id INTO v_rider_owner FROM public.characters WHERE id = p_rider_character_id;
  IF v_rider_owner IS NULL THEN RAISE EXCEPTION 'RIDER_NOT_FOUND' USING ERRCODE = '22023'; END IF;

  v_campaign := v_instance.owner_campaign_id;
  IF v_instance.owner_scope = 'character' THEN
    IF v_instance.owner_character_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM public.characters AS character_row
      WHERE character_row.id = v_instance.owner_character_id
        AND character_row.user_id = v_actor
    ) THEN
      RAISE EXCEPTION 'MOUNT_OWNER_REQUIRED' USING ERRCODE = '42501';
    END IF;
  ELSIF v_campaign IS NULL OR NOT public.is_campaign_system(v_campaign, v_actor) THEN
    RAISE EXCEPTION 'WARDEN_MOUNT_CONTROL_REQUIRED' USING ERRCODE = '42501';
  END IF;

  v_profile := v_instance.mount_profile;
  IF v_profile ? 'riderLimit' AND COALESCE((v_profile->>'riderLimit')::INTEGER, 0) < 1 THEN
    RAISE EXCEPTION 'MOUNT_RIDER_LIMIT_REJECTED' USING ERRCODE = '22023';
  END IF;
  IF v_profile ? 'allowedRiderSizes' THEN
    IF p_rider_size IS NULL OR NOT (v_profile->'allowedRiderSizes' ? p_rider_size) THEN
      RAISE EXCEPTION 'MOUNT_RIDER_SIZE_REJECTED' USING ERRCODE = '22023';
    END IF;
  END IF;
  IF v_profile ? 'allowedTerrain' THEN
    IF p_terrain IS NULL OR NOT (v_profile->'allowedTerrain' ? p_terrain) THEN
      RAISE EXCEPTION 'MOUNT_TERRAIN_REJECTED' USING ERRCODE = '22023';
    END IF;
  END IF;
  IF COALESCE((v_profile->>'requiresTack')::BOOLEAN, false) AND p_has_tack IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'MOUNT_TACK_REQUIRED' USING ERRCODE = '22023';
  END IF;
  IF COALESCE((v_profile->>'requiresTraining')::BOOLEAN, false) AND p_is_trained IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'MOUNT_TRAINING_REQUIRED' USING ERRCODE = '22023';
  END IF;

  UPDATE public.companion_instances
  SET rider_character_id = p_rider_character_id,
      updated_at = now()
  WHERE id = p_companion_instance_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.clear_companion_rider(
  p_companion_instance_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_instance public.companion_instances%ROWTYPE;
  v_rider_owner UUID;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_instance FROM public.companion_instances
  WHERE id = p_companion_instance_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'COMPANION_NOT_FOUND' USING ERRCODE = 'P0002'; END IF;
  SELECT user_id INTO v_rider_owner FROM public.characters
  WHERE id = v_instance.rider_character_id;
  IF v_actor IS DISTINCT FROM v_rider_owner
     AND NOT (
       v_instance.owner_scope = 'character' AND EXISTS (
         SELECT 1 FROM public.characters AS character_row
         WHERE character_row.id = v_instance.owner_character_id
           AND character_row.user_id = v_actor
       )
     )
     AND NOT (
       v_instance.owner_scope = 'campaign'
       AND public.is_campaign_system(v_instance.owner_campaign_id, v_actor)
     ) THEN
    RAISE EXCEPTION 'RIDER_OWNER_OR_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;
  UPDATE public.companion_instances
  SET rider_character_id = NULL, updated_at = now()
  WHERE id = p_companion_instance_id;
END;
$$;

REVOKE ALL ON FUNCTION app_private.companion_c3_record(JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_array(JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_number(JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_name(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_max_hp(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_ac(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_accessible_to_campaign(public.companion_instances, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_write_origin_state(public.companion_instances, JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_origin_to_registry() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_combatant_sync() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_c3_follow_linked_initiative() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.add_companion_to_combat(UUID, UUID, INTEGER, TEXT, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rest_companions_for_character(UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_companion_rider(UUID, UUID, TEXT, TEXT, BOOLEAN, BOOLEAN) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.clear_companion_rider(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.add_companion_to_combat(UUID, UUID, INTEGER, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rest_companions_for_character(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_companion_rider(UUID, UUID, TEXT, TEXT, BOOLEAN, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.clear_companion_rider(UUID) TO authenticated;

COMMENT ON COLUMN public.campaign_combatants.companion_instance_id IS
  'C3 stable living-instance link. Unique per combat session; source/name are never identity.';
COMMENT ON COLUMN public.companion_instances.combat_state IS
  'C3 durable HP/conditions/resources/downed state reconciled with existing companion projections.';
COMMENT ON COLUMN public.companion_instances.progression_profile IS
  'Versioned authored profile. C3 reads only explicit combat/rest/progression rules and does not invent missing defaults.';

COMMIT;
NOTIFY pgrst, 'reload schema';

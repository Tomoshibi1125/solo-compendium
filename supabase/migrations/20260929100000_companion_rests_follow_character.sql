-- RA-10 companion rests (docs/canon/rift-ascendant-canon-locks.md).
--
-- A companion rests with its character, by the character's rules:
--   Short Rest  Its owner may spend its Hit Dice. Each die heals one roll of
--               its Hit Die; no VIT is added, as with its maximum HP.
--   Long Rest   It regains all HP, and half its Hit Dice (minimum 1). Its
--               conditions end as a character's do.
-- A level-scaled companion has L Hit Dice of its scaling die. A companion that
-- keeps its saved stats has no authored Hit Dice; a Long Rest still restores
-- its HP.
--
-- This replaces the profile-driven rest rules of 20260926050000. No companion
-- carries such a rule, so resting used to change nothing.
BEGIN;

-- ---------------------------------------------------------------------------
-- Hit Dice
-- ---------------------------------------------------------------------------

-- L Hit Dice for a level-scaled companion; NULL when it keeps its saved stats.
CREATE OR REPLACE FUNCTION app_private.companion_hit_dice_max(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SET search_path = pg_catalog, public AS $$
  SELECT CASE WHEN app_private.companion_scaling_hit_die(p_instance) IS NULL THEN NULL
    ELSE app_private.companion_level_for_scaling(p_instance) END;
$$;

-- Dice spent since its last Long Rest, never more than it has.
CREATE OR REPLACE FUNCTION app_private.companion_hit_dice_spent(p_instance public.companion_instances)
RETURNS INTEGER LANGUAGE sql STABLE SET search_path = pg_catalog, public AS $$
  SELECT LEAST(
    COALESCE(app_private.companion_hit_dice_max(p_instance), 0),
    GREATEST(0, LEAST(20, COALESCE(floor(
      app_private.companion_c3_number(p_instance.combat_state->'hitDiceSpent')), 0)))::INTEGER);
$$;

-- ---------------------------------------------------------------------------
-- Conditions
-- ---------------------------------------------------------------------------

-- A Long Rest ends conditions as it does for a character (reduceConditionLifecycle
-- and restRemovesCondition in src/lib/conditionSystem.ts): a rest-length
-- duration always ends, and so does any condition whose rest policy is
-- remove-on-rest, remove-on-long-rest, or remove-on-short-rest. A plain
-- condition name has the default remove-on-long-rest policy. Persist, manual,
-- and unknown policies remain, as do entries already marked inactive.
CREATE OR REPLACE FUNCTION app_private.companion_conditions_after_long_rest(p_conditions JSONB)
RETURNS JSONB LANGUAGE sql IMMUTABLE SET search_path = pg_catalog AS $$
  SELECT COALESCE(jsonb_agg(item.condition ORDER BY item.ordinal), '[]'::jsonb)
  FROM jsonb_array_elements(app_private.companion_c3_array(p_conditions))
    WITH ORDINALITY AS item(condition, ordinal)
  WHERE jsonb_typeof(item.condition) = 'object'
    AND (item.condition->'isActive' = 'false'::jsonb
      OR (COALESCE(item.condition#>>'{duration,unit}', '') <> 'rest'
        AND COALESCE(item.condition->>'restPolicy', 'remove-on-long-rest')
          NOT IN ('remove-on-rest', 'remove-on-long-rest', 'remove-on-short-rest')));
$$;

-- ---------------------------------------------------------------------------
-- Rests
-- ---------------------------------------------------------------------------

-- Called after the character's own rest (src/lib/restSystem.ts) for every
-- active companion the character owns or handles. Returns how many rested.
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
  v_state JSONB;
  v_max_hp NUMERIC;
  v_hp INTEGER;
  v_dice INTEGER;
  v_count INTEGER := 0;
BEGIN
  IF p_rest_kind IS NULL OR p_rest_kind NOT IN ('short', 'long') THEN
    RAISE EXCEPTION 'INVALID_COMPANION_REST_KIND' USING ERRCODE = '22023';
  END IF;
  IF v_actor IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'CHARACTER_OWNER_REQUIRED' USING ERRCODE = '42501';
  END IF;

  -- A Short Rest changes nothing by itself: Hit Dice are spent by choice
  -- through spend_companion_hit_dice, as a character's are.
  IF p_rest_kind = 'short' THEN RETURN 0; END IF;

  FOR v_instance IN
    SELECT instance.*
    FROM public.companion_instances AS instance
    WHERE instance.lifecycle_status = 'active'
      AND (instance.owner_character_id = p_character_id
        OR instance.primary_handler_character_id = p_character_id)
    ORDER BY instance.id
    FOR UPDATE
  LOOP
    v_state := app_private.companion_c3_record(v_instance.combat_state);
    v_max_hp := app_private.companion_c3_max_hp(v_instance);
    v_hp := CASE WHEN v_max_hp IS NULL
      THEN floor(GREATEST(0, LEAST(2147483647,
        COALESCE(app_private.companion_c3_number(v_state->'hp'), 0))))::INTEGER
      ELSE floor(GREATEST(0, LEAST(2147483647, v_max_hp)))::INTEGER END;
    v_dice := app_private.companion_hit_dice_max(v_instance);

    v_state := v_state || jsonb_build_object(
      'hp', v_hp,
      'downed', v_hp <= 0,
      'conditions', app_private.companion_conditions_after_long_rest(v_state->'conditions'),
      'hitDiceSpent', CASE WHEN v_dice IS NULL THEN 0
        ELSE GREATEST(0, app_private.companion_hit_dice_spent(v_instance)
          - GREATEST(1, v_dice / 2)) END);

    UPDATE public.companion_instances AS instance
    SET combat_state = v_state,
        combat_state_version = instance.combat_state_version + 1,
        updated_at = now()
    WHERE instance.id = v_instance.id
    RETURNING * INTO v_instance;
    PERFORM app_private.companion_c3_write_origin_state(v_instance, v_instance.combat_state);
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

-- The Short Rest dialog rolls a companion's Hit Dice as it rolls the
-- character's, then spends them here. The server checks the dice are
-- available and that the healing fits them, heals up to the maximum, and
-- counts the dice as spent until a Long Rest.
CREATE OR REPLACE FUNCTION public.spend_companion_hit_dice(
  p_companion_instance_id UUID,
  p_dice INTEGER,
  p_hp_recovered INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_instance public.companion_instances%ROWTYPE;
  v_die INTEGER;
  v_dice INTEGER;
  v_spent INTEGER;
  v_max_hp INTEGER;
  v_hp INTEGER;
  v_state JSONB;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_instance
  FROM public.companion_instances AS instance
  WHERE instance.id = p_companion_instance_id
    AND instance.lifecycle_status = 'active'
  FOR UPDATE;
  IF NOT FOUND OR NOT EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.user_id = v_actor
      AND character_row.id IN (
        v_instance.owner_character_id, v_instance.primary_handler_character_id)
  ) THEN
    RAISE EXCEPTION 'COMPANION_OWNER_REQUIRED' USING ERRCODE = '42501';
  END IF;

  v_die := app_private.companion_scaling_hit_die(v_instance);
  v_dice := app_private.companion_hit_dice_max(v_instance);
  IF v_die IS NULL OR v_dice IS NULL THEN
    RAISE EXCEPTION 'COMPANION_HAS_NO_HIT_DICE' USING ERRCODE = '22023';
  END IF;
  v_spent := app_private.companion_hit_dice_spent(v_instance);
  IF p_dice IS NULL OR p_dice < 1 OR p_dice > v_dice - v_spent THEN
    RAISE EXCEPTION 'COMPANION_HIT_DICE_UNAVAILABLE' USING ERRCODE = '22023';
  END IF;
  IF p_hp_recovered IS NULL OR p_hp_recovered < 0 OR p_hp_recovered > p_dice * v_die THEN
    RAISE EXCEPTION 'INVALID_COMPANION_HIT_DICE_HEALING' USING ERRCODE = '22023';
  END IF;

  v_state := app_private.companion_c3_record(v_instance.combat_state);
  v_max_hp := floor(app_private.companion_c3_max_hp(v_instance))::INTEGER;
  v_hp := floor(GREATEST(0, LEAST(v_max_hp,
    COALESCE(app_private.companion_c3_number(v_state->'hp'), v_max_hp))))::INTEGER;
  v_hp := LEAST(v_max_hp, v_hp + p_hp_recovered);
  v_state := v_state || jsonb_build_object(
    'hp', v_hp,
    'downed', v_hp <= 0,
    'hitDiceSpent', v_spent + p_dice);

  UPDATE public.companion_instances AS instance
  SET combat_state = v_state,
      combat_state_version = instance.combat_state_version + 1,
      updated_at = now()
  WHERE instance.id = v_instance.id
  RETURNING * INTO v_instance;
  PERFORM app_private.companion_c3_write_origin_state(v_instance, v_instance.combat_state);

  RETURN jsonb_build_object(
    'hp', v_hp,
    'hpMax', v_max_hp,
    'hitDie', v_die,
    'hitDiceMax', v_dice,
    'hitDiceSpent', v_spent + p_dice);
END;
$$;

-- ---------------------------------------------------------------------------
-- Privileges
-- ---------------------------------------------------------------------------

REVOKE ALL ON FUNCTION app_private.companion_hit_dice_max(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_hit_dice_spent(public.companion_instances) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.companion_conditions_after_long_rest(JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rest_companions_for_character(UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.spend_companion_hit_dice(UUID, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rest_companions_for_character(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.spend_companion_hit_dice(UUID, INTEGER, INTEGER) TO authenticated;

COMMENT ON FUNCTION public.rest_companions_for_character(UUID, TEXT) IS
  'RA-10: companions rest with their character. A Long Rest restores all HP, half the Hit Dice (minimum 1), and ends conditions as for a character; a Short Rest changes nothing by itself.';
COMMENT ON FUNCTION public.spend_companion_hit_dice(UUID, INTEGER, INTEGER) IS
  'RA-10: the owner spends a level-scaled companion''s Hit Dice on a Short Rest. Each die heals one roll of its Hit Die, with no VIT.';

COMMIT;

-- C3 hardening: expose authored profile metadata on combat actors and close
-- rider-scope gaps without inventing missing progression/mount rules.

BEGIN;

CREATE OR REPLACE FUNCTION app_private.companion_c3_apply_profile_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_instance public.companion_instances%ROWTYPE;
  v_profile JSONB;
  v_combat JSONB;
  v_action_economy JSONB;
  v_progression JSONB;
  v_progression_mode TEXT;
  v_reaction_pool TEXT;
BEGIN
  IF NEW.companion_instance_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT * INTO v_instance
  FROM public.companion_instances AS instance
  WHERE instance.id = NEW.companion_instance_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'COMPANION_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  v_profile := app_private.companion_c3_record(v_instance.progression_profile);
  v_combat := app_private.companion_c3_record(v_profile->'combat');
  v_progression := app_private.companion_c3_record(v_profile->'progression');
  v_reaction_pool := COALESCE(NULLIF(v_combat->>'reactionPool', ''), 'separate');

  IF v_reaction_pool NOT IN ('separate', 'shared-rider') THEN
    RAISE EXCEPTION 'INVALID_COMPANION_REACTION_PROFILE' USING ERRCODE = '22023';
  END IF;

  IF v_combat ? 'actionEconomy' THEN
    IF jsonb_typeof(v_combat->'actionEconomy') <> 'object' THEN
      RAISE EXCEPTION 'INVALID_COMPANION_ACTION_ECONOMY_PROFILE' USING ERRCODE = '22023';
    END IF;
    v_action_economy := v_combat->'actionEconomy';
  END IF;

  v_progression_mode := NULLIF(v_progression->>'mode', '');
  IF v_progression_mode IS NOT NULL
     AND v_progression_mode NOT IN ('fixed', 'milestone', 'xp', 'manual') THEN
    RAISE EXCEPTION 'INVALID_COMPANION_PROGRESSION_MODE' USING ERRCODE = '22023';
  END IF;

  NEW.flags := app_private.companion_c3_record(NEW.flags)
    || jsonb_strip_nulls(jsonb_build_object(
      'actorKind', 'companion',
      'companionInstanceId', v_instance.id,
      'profileVersion', v_instance.profile_version,
      'reactionPool', v_reaction_pool,
      'reactionAvailable', COALESCE((NEW.flags->>'reactionAvailable')::BOOLEAN, true),
      'actionEconomy', v_action_economy,
      'progressionMode', v_progression_mode
    ));

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS campaign_combatants_c3_profile_metadata
  ON public.campaign_combatants;
CREATE TRIGGER campaign_combatants_c3_profile_metadata
BEFORE INSERT OR UPDATE OF companion_instance_id, flags
ON public.campaign_combatants
FOR EACH ROW
EXECUTE FUNCTION app_private.companion_c3_apply_profile_metadata();

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
  v_rider_limit INTEGER;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_instance
  FROM public.companion_instances AS instance
  WHERE instance.id = p_companion_instance_id
  FOR UPDATE;

  IF NOT FOUND OR v_instance.mount_profile IS NULL THEN
    RAISE EXCEPTION 'MOUNT_PROFILE_REQUIRED' USING ERRCODE = '22023';
  END IF;

  SELECT user_id INTO v_rider_owner
  FROM public.characters
  WHERE id = p_rider_character_id;
  IF v_rider_owner IS NULL THEN
    RAISE EXCEPTION 'RIDER_NOT_FOUND' USING ERRCODE = '22023';
  END IF;

  v_campaign := v_instance.owner_campaign_id;
  IF v_instance.owner_scope = 'character' THEN
    IF v_instance.owner_character_id IS NULL OR NOT EXISTS (
      SELECT 1
      FROM public.characters AS character_row
      WHERE character_row.id = v_instance.owner_character_id
        AND character_row.user_id = v_actor
    ) THEN
      RAISE EXCEPTION 'MOUNT_OWNER_REQUIRED' USING ERRCODE = '42501';
    END IF;

    -- A personal mount may be assigned only to another character belonging to
    -- the same authenticated owner. Cross-account riding requires a campaign
    -- scoped instance and Warden authority instead of silently crossing scope.
    IF v_rider_owner IS DISTINCT FROM v_actor THEN
      RAISE EXCEPTION 'PERSONAL_MOUNT_RIDER_OWNER_REQUIRED' USING ERRCODE = '42501';
    END IF;
  ELSE
    IF v_campaign IS NULL OR NOT public.is_campaign_system(v_campaign, v_actor) THEN
      RAISE EXCEPTION 'WARDEN_MOUNT_CONTROL_REQUIRED' USING ERRCODE = '42501';
    END IF;
    IF NOT app_private.companion_character_in_campaign(v_campaign, p_rider_character_id) THEN
      RAISE EXCEPTION 'RIDER_NOT_IN_CAMPAIGN' USING ERRCODE = '42501';
    END IF;
  END IF;

  v_profile := v_instance.mount_profile;

  IF v_profile ? 'riderLimit' THEN
    BEGIN
      v_rider_limit := (v_profile->>'riderLimit')::INTEGER;
    EXCEPTION WHEN invalid_text_representation OR numeric_value_out_of_range THEN
      RAISE EXCEPTION 'INVALID_MOUNT_RIDER_LIMIT' USING ERRCODE = '22023';
    END;

    IF v_rider_limit < 1 THEN
      RAISE EXCEPTION 'MOUNT_RIDER_LIMIT_REJECTED' USING ERRCODE = '22023';
    ELSIF v_rider_limit > 1 THEN
      -- Current C1 identity has one rider_character_id. Do not silently reduce
      -- a multi-rider authored profile to one rider.
      RAISE EXCEPTION 'MULTI_RIDER_PROFILE_UNSUPPORTED' USING ERRCODE = '22023';
    END IF;
  END IF;

  IF v_profile ? 'allowedRiderSizes' THEN
    IF jsonb_typeof(v_profile->'allowedRiderSizes') <> 'array' THEN
      RAISE EXCEPTION 'INVALID_MOUNT_RIDER_SIZE_PROFILE' USING ERRCODE = '22023';
    END IF;
    IF p_rider_size IS NULL OR NOT (v_profile->'allowedRiderSizes' ? p_rider_size) THEN
      RAISE EXCEPTION 'MOUNT_RIDER_SIZE_REJECTED' USING ERRCODE = '22023';
    END IF;
  END IF;

  IF v_profile ? 'allowedTerrain' THEN
    IF jsonb_typeof(v_profile->'allowedTerrain') <> 'array' THEN
      RAISE EXCEPTION 'INVALID_MOUNT_TERRAIN_PROFILE' USING ERRCODE = '22023';
    END IF;
    IF p_terrain IS NULL OR NOT (v_profile->'allowedTerrain' ? p_terrain) THEN
      RAISE EXCEPTION 'MOUNT_TERRAIN_REJECTED' USING ERRCODE = '22023';
    END IF;
  END IF;

  IF COALESCE((v_profile->>'requiresTack')::BOOLEAN, false)
     AND p_has_tack IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'MOUNT_TACK_REQUIRED' USING ERRCODE = '22023';
  END IF;

  IF COALESCE((v_profile->>'requiresTraining')::BOOLEAN, false)
     AND p_is_trained IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'MOUNT_TRAINING_REQUIRED' USING ERRCODE = '22023';
  END IF;

  UPDATE public.companion_instances
  SET rider_character_id = p_rider_character_id,
      updated_at = now()
  WHERE id = p_companion_instance_id;
END;
$$;

REVOKE ALL ON FUNCTION app_private.companion_c3_apply_profile_metadata()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_companion_rider(UUID, UUID, TEXT, TEXT, BOOLEAN, BOOLEAN)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_companion_rider(UUID, UUID, TEXT, TEXT, BOOLEAN, BOOLEAN)
  TO authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

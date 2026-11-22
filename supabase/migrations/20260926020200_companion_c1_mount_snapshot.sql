-- C1 follow-up: preserve living-mount source snapshots on character_vehicles so
-- the existing select(*) character export can reconstruct the companion
-- instance on import without exporting registry ownership rows directly.

BEGIN;

ALTER TABLE public.character_vehicles
  ADD COLUMN IF NOT EXISTS companion_source_snapshot JSONB;

CREATE OR REPLACE FUNCTION app_private.ensure_character_vehicle_companion_instance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_instance UUID := NEW.companion_instance_id;
  v_snapshot_valid BOOLEAN := false;
BEGIN
  -- Constructed vehicles intentionally carry no living companion mapping.
  IF v_instance IS NULL THEN
    NEW.companion_source_snapshot := NULL;
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.companion_instances AS instance
    WHERE instance.id = v_instance
      AND instance.owner_scope = 'character'
      AND instance.owner_character_id = NEW.character_id
  ) THEN
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.companion_instances AS instance WHERE instance.id = v_instance
  ) THEN
    -- Imported IDs are references, not authority. Never attach another user's
    -- living instance to the newly imported character.
    v_instance := gen_random_uuid();
  END IF;

  v_snapshot_valid := NEW.companion_source_snapshot IS NOT NULL
    AND NEW.companion_source_snapshot->>'kind' = 'canonical-compendium'
    AND NEW.companion_source_snapshot#>>'{provenance,canonicalType}' = 'vehicle'
    AND NEW.companion_source_snapshot#>>'{provenance,canonicalId}' = NEW.vehicle_id
    AND NEW.companion_source_snapshot#>>'{provenance,entryType}' = 'mount';

  INSERT INTO public.companion_instances (
    id, owner_scope, owner_character_id,
    primary_handler_character_id, combat_controller_character_id,
    identity_kind, source_kind, source_collection, source_id,
    source_policy, source_revision, source_snapshot,
    mount_profile, origin_table, origin_row_id
  ) VALUES (
    v_instance, 'character', NEW.character_id,
    NEW.character_id, NEW.character_id,
    'mount', 'canonical-mount', 'vehicles', NEW.vehicle_id,
    CASE WHEN v_snapshot_valid THEN 'snapshot' ELSE 'legacy-live' END,
    CASE WHEN v_snapshot_valid THEN 'canonical-snapshot-v1' ELSE 'imported-mount-ref-v1' END,
    CASE WHEN v_snapshot_valid THEN NEW.companion_source_snapshot ELSE
      jsonb_build_object(
        'kind', 'legacy-character-vehicle-mount',
        'version', 1,
        'vehicleId', NEW.vehicle_id,
        'currentHp', NEW.current_hp,
        'maxHpOverride', NEW.max_hp_override
      )
    END,
    '{}'::jsonb,
    'character_vehicles', NEW.id
  );

  NEW.companion_instance_id := v_instance;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ensure_character_vehicle_companion_instance
  ON public.character_vehicles;
CREATE TRIGGER ensure_character_vehicle_companion_instance
  BEFORE INSERT ON public.character_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION app_private.ensure_character_vehicle_companion_instance();

DROP TRIGGER IF EXISTS guard_character_vehicle_companion_mapping
  ON public.character_vehicles;
CREATE TRIGGER guard_character_vehicle_companion_mapping
  BEFORE UPDATE OF character_id, companion_instance_id, companion_source_snapshot
  ON public.character_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION app_private.guard_companion_mapping_and_owner();

CREATE OR REPLACE FUNCTION public.register_character_vehicle_mount(
  p_vehicle_link_id UUID,
  p_source_snapshot JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_vehicle public.character_vehicles%ROWTYPE;
  v_owner UUID;
  v_instance UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT vehicle_row.* INTO v_vehicle
  FROM public.character_vehicles AS vehicle_row
  WHERE vehicle_row.id = p_vehicle_link_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'VEHICLE_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT character_row.user_id INTO v_owner
  FROM public.characters AS character_row
  WHERE character_row.id = v_vehicle.character_id
  FOR UPDATE;
  IF v_owner IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_source_snapshot IS NULL
     OR p_source_snapshot->>'kind' IS DISTINCT FROM 'canonical-compendium'
     OR p_source_snapshot#>>'{provenance,canonicalType}' IS DISTINCT FROM 'vehicle'
     OR p_source_snapshot#>>'{provenance,canonicalId}' IS DISTINCT FROM v_vehicle.vehicle_id
     OR p_source_snapshot#>>'{provenance,entryType}' IS DISTINCT FROM 'mount'
  THEN
    RAISE EXCEPTION 'LIVING_MOUNT_SNAPSHOT_REQUIRED' USING ERRCODE = '22023';
  END IF;

  IF v_vehicle.companion_instance_id IS NOT NULL THEN
    -- Exact retry: keep the original identity but ensure the row also carries
    -- the frozen snapshot needed by portable character export/import.
    PERFORM set_config('app.companion_mapping_write', 'on', true);
    UPDATE public.character_vehicles
    SET companion_source_snapshot = COALESCE(companion_source_snapshot, p_source_snapshot)
    WHERE id = v_vehicle.id;
    RETURN v_vehicle.companion_instance_id;
  END IF;

  INSERT INTO public.companion_instances (
    owner_scope, owner_character_id,
    primary_handler_character_id, combat_controller_character_id,
    identity_kind, source_kind, source_collection, source_id,
    source_policy, source_revision, source_snapshot, mount_profile,
    origin_table, origin_row_id
  ) VALUES (
    'character', v_vehicle.character_id,
    v_vehicle.character_id, v_vehicle.character_id,
    'mount', 'canonical-mount', 'vehicles', v_vehicle.vehicle_id,
    'snapshot', 'canonical-snapshot-v1', p_source_snapshot, '{}'::jsonb,
    'character_vehicles', v_vehicle.id
  )
  RETURNING id INTO v_instance;

  PERFORM set_config('app.companion_mapping_write', 'on', true);
  UPDATE public.character_vehicles
  SET companion_instance_id = v_instance,
      companion_source_snapshot = p_source_snapshot
  WHERE id = v_vehicle.id;

  RETURN v_instance;
END;
$$;

REVOKE ALL ON FUNCTION app_private.ensure_character_vehicle_companion_instance()
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.register_character_vehicle_mount(UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_character_vehicle_mount(UUID, JSONB)
  TO authenticated;

COMMENT ON COLUMN public.character_vehicles.companion_source_snapshot IS
  'C1 frozen canonical source envelope for living mounts. Exported with the vehicle row; NULL for constructed vehicles.';

COMMIT;

NOTIFY pgrst, 'reload schema';

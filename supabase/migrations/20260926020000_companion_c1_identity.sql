-- C1: stable living-companion identity and legacy-store reconciliation.
--
-- This migration does not replace the existing character_extras,
-- character_tamed_anomalies, campaign_tamed_anomalies, or character_vehicles
-- stores. Instead it gives living creatures one stable identity/ownership
-- record and maps the existing stores onto it. Backfills never merge by name
-- or catalog id: every pre-existing row becomes a distinct living instance.
-- Constructed vehicles remain vehicles; character_vehicles only links to a
-- living instance when the row explicitly represents a mount.

BEGIN;

CREATE TABLE IF NOT EXISTS public.companion_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_scope TEXT NOT NULL,
  owner_character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
  owner_campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  primary_handler_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  combat_controller_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  rider_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  identity_kind TEXT NOT NULL,
  source_kind TEXT NOT NULL,
  source_collection TEXT,
  source_id TEXT,
  source_policy TEXT NOT NULL DEFAULT 'snapshot',
  source_revision TEXT NOT NULL,
  source_snapshot_version INTEGER NOT NULL DEFAULT 1,
  source_snapshot JSONB,
  profile_version INTEGER NOT NULL DEFAULT 1,
  progression_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  stat_overrides JSONB NOT NULL DEFAULT '{}'::jsonb,
  mount_profile JSONB,
  origin_table TEXT NOT NULL,
  origin_row_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT companion_instances_owner_scope_check
    CHECK (owner_scope IN ('character', 'campaign')),
  CONSTRAINT companion_instances_owner_shape_check
    CHECK (
      (owner_scope = 'character' AND owner_character_id IS NOT NULL AND owner_campaign_id IS NULL)
      OR
      (owner_scope = 'campaign' AND owner_campaign_id IS NOT NULL AND owner_character_id IS NULL)
    ),
  CONSTRAINT companion_instances_source_policy_check
    CHECK (source_policy IN ('snapshot', 'legacy-live', 'manual')),
  CONSTRAINT companion_instances_snapshot_version_check
    CHECK (source_snapshot_version >= 1),
  CONSTRAINT companion_instances_profile_version_check
    CHECK (profile_version >= 1),
  CONSTRAINT companion_instances_origin_unique UNIQUE (origin_table, origin_row_id)
);

CREATE INDEX IF NOT EXISTS companion_instances_owner_character_idx
  ON public.companion_instances(owner_character_id)
  WHERE owner_character_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS companion_instances_owner_campaign_idx
  ON public.companion_instances(owner_campaign_id)
  WHERE owner_campaign_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS companion_instances_handler_idx
  ON public.companion_instances(primary_handler_character_id)
  WHERE primary_handler_character_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS companion_instances_controller_idx
  ON public.companion_instances(combat_controller_character_id)
  WHERE combat_controller_character_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS companion_instances_rider_idx
  ON public.companion_instances(rider_character_id)
  WHERE rider_character_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS companion_instances_source_idx
  ON public.companion_instances(source_collection, source_id);

ALTER TABLE public.character_extras
  ADD COLUMN IF NOT EXISTS companion_instance_id UUID;
ALTER TABLE public.character_tamed_anomalies
  ADD COLUMN IF NOT EXISTS companion_instance_id UUID;
ALTER TABLE public.campaign_tamed_anomalies
  ADD COLUMN IF NOT EXISTS companion_instance_id UUID;
ALTER TABLE public.character_vehicles
  ADD COLUMN IF NOT EXISTS companion_instance_id UUID;

-- ---------------------------------------------------------------------------
-- Backfill: preserve every legacy row as a distinct instance.
-- ---------------------------------------------------------------------------

INSERT INTO public.companion_instances (
  owner_scope,
  owner_character_id,
  primary_handler_character_id,
  combat_controller_character_id,
  identity_kind,
  source_kind,
  source_collection,
  source_id,
  source_policy,
  source_revision,
  source_snapshot,
  mount_profile,
  origin_table,
  origin_row_id
)
SELECT
  'character',
  extra.character_id,
  extra.character_id,
  extra.character_id,
  extra.extra_type,
  CASE
    WHEN extra.npc_data->>'kind' = 'canonical-compendium'
      AND extra.npc_data#>>'{provenance,canonicalType}' = 'anomaly'
      THEN 'canonical-anomaly'
    WHEN extra.npc_data->>'kind' = 'canonical-compendium'
      AND extra.npc_data#>>'{provenance,canonicalType}' = 'vehicle'
      THEN 'canonical-mount'
    WHEN extra.npc_id IS NOT NULL THEN 'guild-ally'
    WHEN extra.monster_id IS NOT NULL THEN 'legacy-db-monster'
    ELSE 'manual-extra'
  END,
  CASE
    WHEN extra.npc_data->>'kind' = 'canonical-compendium'
      THEN extra.npc_data#>>'{provenance,canonicalCollection}'
    WHEN extra.monster_id IS NOT NULL THEN 'compendium_monsters'
    ELSE NULL
  END,
  COALESCE(
    extra.npc_data#>>'{provenance,canonicalId}',
    extra.npc_id,
    extra.monster_id::text
  ),
  CASE WHEN extra.npc_data IS NULL AND extra.monster_id IS NULL AND extra.npc_id IS NULL
    THEN 'manual' ELSE 'snapshot' END,
  CASE
    WHEN extra.npc_data->>'kind' = 'canonical-compendium' THEN 'canonical-snapshot-v1'
    WHEN extra.npc_id IS NOT NULL THEN 'guild-snapshot-v1'
    WHEN extra.monster_id IS NOT NULL THEN 'legacy-db-monster-v1'
    ELSE 'manual-snapshot-v1'
  END,
  COALESCE(
    extra.npc_data,
    jsonb_build_object(
      'kind', 'legacy-character-extra',
      'version', 1,
      'name', extra.name,
      'hpMax', extra.hp_max,
      'baseAc', COALESCE(extra.ac, 10),
      'speed', COALESCE(extra.speed, 30),
      'abilities', COALESCE(extra.abilities, '[]'::jsonb)
    )
  ),
  CASE WHEN extra.extra_type = 'mount' THEN '{}'::jsonb ELSE NULL END,
  'character_extras',
  extra.id
FROM public.character_extras AS extra
WHERE NOT EXISTS (
  SELECT 1 FROM public.companion_instances AS instance
  WHERE instance.origin_table = 'character_extras'
    AND instance.origin_row_id = extra.id
)
ON CONFLICT (origin_table, origin_row_id) DO NOTHING;

UPDATE public.character_extras AS extra
SET companion_instance_id = instance.id
FROM public.companion_instances AS instance
WHERE instance.origin_table = 'character_extras'
  AND instance.origin_row_id = extra.id
  AND extra.companion_instance_id IS DISTINCT FROM instance.id;

INSERT INTO public.companion_instances (
  owner_scope,
  owner_character_id,
  primary_handler_character_id,
  combat_controller_character_id,
  identity_kind,
  source_kind,
  source_collection,
  source_id,
  source_policy,
  source_revision,
  source_snapshot,
  stat_overrides,
  origin_table,
  origin_row_id
)
SELECT
  'character',
  tamed.character_id,
  tamed.character_id,
  tamed.character_id,
  'tamed-anomaly',
  'canonical-anomaly',
  'anomalies',
  tamed.anomaly_id,
  'legacy-live',
  'legacy-tamed-live-v1',
  jsonb_build_object(
    'kind', 'legacy-tamed-state',
    'version', 1,
    'anomalyId', tamed.anomaly_id,
    'currentHp', tamed.current_hp,
    'maxHpOverride', tamed.max_hp_override,
    'bondLevel', tamed.bond_level
  ),
  CASE WHEN tamed.max_hp_override IS NOT NULL
    THEN jsonb_build_object('hpMax', tamed.max_hp_override)
    ELSE '{}'::jsonb END,
  'character_tamed_anomalies',
  tamed.id
FROM public.character_tamed_anomalies AS tamed
WHERE NOT EXISTS (
  SELECT 1 FROM public.companion_instances AS instance
  WHERE instance.origin_table = 'character_tamed_anomalies'
    AND instance.origin_row_id = tamed.id
)
ON CONFLICT (origin_table, origin_row_id) DO NOTHING;

UPDATE public.character_tamed_anomalies AS tamed
SET companion_instance_id = instance.id
FROM public.companion_instances AS instance
WHERE instance.origin_table = 'character_tamed_anomalies'
  AND instance.origin_row_id = tamed.id
  AND tamed.companion_instance_id IS DISTINCT FROM instance.id;

INSERT INTO public.companion_instances (
  owner_scope,
  owner_campaign_id,
  primary_handler_character_id,
  combat_controller_character_id,
  identity_kind,
  source_kind,
  source_collection,
  source_id,
  source_policy,
  source_revision,
  source_snapshot,
  stat_overrides,
  origin_table,
  origin_row_id
)
SELECT
  'campaign',
  tamed.campaign_id,
  tamed.primary_handler_character_id,
  tamed.current_controller_character_id,
  'tamed-anomaly',
  'canonical-anomaly',
  'anomalies',
  tamed.anomaly_id,
  'legacy-live',
  'legacy-tamed-live-v1',
  jsonb_build_object(
    'kind', 'legacy-tamed-state',
    'version', 1,
    'anomalyId', tamed.anomaly_id,
    'currentHp', tamed.current_hp,
    'maxHpOverride', tamed.max_hp_override,
    'bondLevel', tamed.bond_level
  ),
  CASE WHEN tamed.max_hp_override IS NOT NULL
    THEN jsonb_build_object('hpMax', tamed.max_hp_override)
    ELSE '{}'::jsonb END,
  'campaign_tamed_anomalies',
  tamed.id
FROM public.campaign_tamed_anomalies AS tamed
WHERE NOT EXISTS (
  SELECT 1 FROM public.companion_instances AS instance
  WHERE instance.origin_table = 'campaign_tamed_anomalies'
    AND instance.origin_row_id = tamed.id
)
ON CONFLICT (origin_table, origin_row_id) DO NOTHING;

UPDATE public.campaign_tamed_anomalies AS tamed
SET companion_instance_id = instance.id
FROM public.companion_instances AS instance
WHERE instance.origin_table = 'campaign_tamed_anomalies'
  AND instance.origin_row_id = tamed.id
  AND tamed.companion_instance_id IS DISTINCT FROM instance.id;

ALTER TABLE public.character_extras
  ALTER COLUMN companion_instance_id SET NOT NULL;
ALTER TABLE public.character_tamed_anomalies
  ALTER COLUMN companion_instance_id SET NOT NULL;
ALTER TABLE public.campaign_tamed_anomalies
  ALTER COLUMN companion_instance_id SET NOT NULL;

ALTER TABLE public.character_extras
  DROP CONSTRAINT IF EXISTS character_extras_companion_instance_id_fkey,
  ADD CONSTRAINT character_extras_companion_instance_id_fkey
    FOREIGN KEY (companion_instance_id) REFERENCES public.companion_instances(id) ON DELETE RESTRICT;
ALTER TABLE public.character_tamed_anomalies
  DROP CONSTRAINT IF EXISTS character_tamed_anomalies_companion_instance_id_fkey,
  ADD CONSTRAINT character_tamed_anomalies_companion_instance_id_fkey
    FOREIGN KEY (companion_instance_id) REFERENCES public.companion_instances(id) ON DELETE RESTRICT;
ALTER TABLE public.campaign_tamed_anomalies
  DROP CONSTRAINT IF EXISTS campaign_tamed_anomalies_companion_instance_id_fkey,
  ADD CONSTRAINT campaign_tamed_anomalies_companion_instance_id_fkey
    FOREIGN KEY (companion_instance_id) REFERENCES public.companion_instances(id) ON DELETE RESTRICT;
ALTER TABLE public.character_vehicles
  DROP CONSTRAINT IF EXISTS character_vehicles_companion_instance_id_fkey,
  ADD CONSTRAINT character_vehicles_companion_instance_id_fkey
    FOREIGN KEY (companion_instance_id) REFERENCES public.companion_instances(id) ON DELETE RESTRICT;

CREATE UNIQUE INDEX IF NOT EXISTS character_extras_companion_instance_key
  ON public.character_extras(companion_instance_id);
CREATE UNIQUE INDEX IF NOT EXISTS character_tamed_anomalies_companion_instance_key
  ON public.character_tamed_anomalies(companion_instance_id);
CREATE UNIQUE INDEX IF NOT EXISTS campaign_tamed_anomalies_companion_instance_key
  ON public.campaign_tamed_anomalies(companion_instance_id);
CREATE UNIQUE INDEX IF NOT EXISTS character_vehicles_companion_instance_key
  ON public.character_vehicles(companion_instance_id)
  WHERE companion_instance_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Registry creation / mapping guards.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app_private.ensure_character_extra_companion_instance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_instance UUID := NEW.companion_instance_id;
BEGIN
  IF v_instance IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.companion_instances AS instance
    WHERE instance.id = v_instance
      AND instance.owner_scope = 'character'
      AND instance.owner_character_id = NEW.character_id
  ) THEN
    RETURN NEW;
  END IF;

  IF v_instance IS NULL OR EXISTS (
    SELECT 1 FROM public.companion_instances AS instance WHERE instance.id = v_instance
  ) THEN
    v_instance := gen_random_uuid();
  END IF;

  INSERT INTO public.companion_instances (
    id, owner_scope, owner_character_id,
    primary_handler_character_id, combat_controller_character_id,
    identity_kind, source_kind, source_collection, source_id,
    source_policy, source_revision, source_snapshot, mount_profile,
    origin_table, origin_row_id
  ) VALUES (
    v_instance, 'character', NEW.character_id,
    NEW.character_id, NEW.character_id,
    NEW.extra_type,
    CASE
      WHEN NEW.npc_data->>'kind' = 'canonical-compendium'
        AND NEW.npc_data#>>'{provenance,canonicalType}' = 'anomaly' THEN 'canonical-anomaly'
      WHEN NEW.npc_data->>'kind' = 'canonical-compendium'
        AND NEW.npc_data#>>'{provenance,canonicalType}' = 'vehicle' THEN 'canonical-mount'
      WHEN NEW.npc_id IS NOT NULL THEN 'guild-ally'
      WHEN NEW.monster_id IS NOT NULL THEN 'legacy-db-monster'
      ELSE 'manual-extra'
    END,
    CASE WHEN NEW.npc_data->>'kind' = 'canonical-compendium'
      THEN NEW.npc_data#>>'{provenance,canonicalCollection}'
      WHEN NEW.monster_id IS NOT NULL THEN 'compendium_monsters'
      ELSE NULL END,
    COALESCE(NEW.npc_data#>>'{provenance,canonicalId}', NEW.npc_id, NEW.monster_id::text),
    CASE WHEN NEW.npc_data IS NULL AND NEW.monster_id IS NULL AND NEW.npc_id IS NULL
      THEN 'manual' ELSE 'snapshot' END,
    CASE
      WHEN NEW.npc_data->>'kind' = 'canonical-compendium' THEN 'canonical-snapshot-v1'
      WHEN NEW.npc_id IS NOT NULL THEN 'guild-snapshot-v1'
      WHEN NEW.monster_id IS NOT NULL THEN 'legacy-db-monster-v1'
      ELSE 'manual-snapshot-v1'
    END,
    COALESCE(
      NEW.npc_data,
      jsonb_build_object(
        'kind', 'legacy-character-extra', 'version', 1,
        'name', NEW.name, 'hpMax', NEW.hp_max,
        'baseAc', COALESCE(NEW.ac, 10), 'speed', COALESCE(NEW.speed, 30),
        'abilities', COALESCE(NEW.abilities, '[]'::jsonb)
      )
    ),
    CASE WHEN NEW.extra_type = 'mount' THEN '{}'::jsonb ELSE NULL END,
    'character_extras', NEW.id
  );
  NEW.companion_instance_id := v_instance;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.ensure_character_tamed_companion_instance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_instance UUID := NEW.companion_instance_id;
BEGIN
  IF v_instance IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.companion_instances AS instance
    WHERE instance.id = v_instance
      AND instance.owner_scope = 'character'
      AND instance.owner_character_id = NEW.character_id
  ) THEN
    RETURN NEW;
  END IF;
  IF v_instance IS NULL OR EXISTS (
    SELECT 1 FROM public.companion_instances AS instance WHERE instance.id = v_instance
  ) THEN
    v_instance := gen_random_uuid();
  END IF;
  INSERT INTO public.companion_instances (
    id, owner_scope, owner_character_id,
    primary_handler_character_id, combat_controller_character_id,
    identity_kind, source_kind, source_collection, source_id,
    source_policy, source_revision, source_snapshot, stat_overrides,
    origin_table, origin_row_id
  ) VALUES (
    v_instance, 'character', NEW.character_id,
    NEW.character_id, NEW.character_id,
    'tamed-anomaly', 'canonical-anomaly', 'anomalies', NEW.anomaly_id,
    'legacy-live', 'legacy-tamed-live-v1',
    jsonb_build_object(
      'kind', 'legacy-tamed-state', 'version', 1,
      'anomalyId', NEW.anomaly_id, 'currentHp', NEW.current_hp,
      'maxHpOverride', NEW.max_hp_override, 'bondLevel', NEW.bond_level
    ),
    CASE WHEN NEW.max_hp_override IS NOT NULL
      THEN jsonb_build_object('hpMax', NEW.max_hp_override)
      ELSE '{}'::jsonb END,
    'character_tamed_anomalies', NEW.id
  );
  NEW.companion_instance_id := v_instance;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.ensure_campaign_tamed_companion_instance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_instance UUID := NEW.companion_instance_id;
BEGIN
  IF v_instance IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.companion_instances AS instance
    WHERE instance.id = v_instance
      AND instance.owner_scope = 'campaign'
      AND instance.owner_campaign_id = NEW.campaign_id
  ) THEN
    RETURN NEW;
  END IF;
  IF v_instance IS NULL OR EXISTS (
    SELECT 1 FROM public.companion_instances AS instance WHERE instance.id = v_instance
  ) THEN
    v_instance := gen_random_uuid();
  END IF;
  INSERT INTO public.companion_instances (
    id, owner_scope, owner_campaign_id,
    primary_handler_character_id, combat_controller_character_id,
    identity_kind, source_kind, source_collection, source_id,
    source_policy, source_revision, source_snapshot, stat_overrides,
    origin_table, origin_row_id
  ) VALUES (
    v_instance, 'campaign', NEW.campaign_id,
    NEW.primary_handler_character_id, NEW.current_controller_character_id,
    'tamed-anomaly', 'canonical-anomaly', 'anomalies', NEW.anomaly_id,
    'legacy-live', 'legacy-tamed-live-v1',
    jsonb_build_object(
      'kind', 'legacy-tamed-state', 'version', 1,
      'anomalyId', NEW.anomaly_id, 'currentHp', NEW.current_hp,
      'maxHpOverride', NEW.max_hp_override, 'bondLevel', NEW.bond_level
    ),
    CASE WHEN NEW.max_hp_override IS NOT NULL
      THEN jsonb_build_object('hpMax', NEW.max_hp_override)
      ELSE '{}'::jsonb END,
    'campaign_tamed_anomalies', NEW.id
  );
  NEW.companion_instance_id := v_instance;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.guard_companion_mapping_and_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  IF current_setting('app.companion_mapping_write', true) = 'on' THEN
    RETURN NEW;
  END IF;
  IF NEW.companion_instance_id IS DISTINCT FROM OLD.companion_instance_id THEN
    RAISE EXCEPTION 'COMPANION_MAPPING_IS_DERIVED' USING ERRCODE = '42501';
  END IF;
  IF TG_TABLE_NAME IN ('character_extras', 'character_tamed_anomalies', 'character_vehicles')
     AND NEW.character_id IS DISTINCT FROM OLD.character_id THEN
    RAISE EXCEPTION 'COMPANION_TRANSFER_RPC_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF TG_TABLE_NAME = 'campaign_tamed_anomalies'
     AND NEW.campaign_id IS DISTINCT FROM OLD.campaign_id THEN
    RAISE EXCEPTION 'COMPANION_TRANSFER_RPC_REQUIRED' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.sync_campaign_tamed_companion_relationships()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  UPDATE public.companion_instances AS instance
  SET primary_handler_character_id = NEW.primary_handler_character_id,
      combat_controller_character_id = NEW.current_controller_character_id,
      updated_at = now()
  WHERE instance.id = NEW.companion_instance_id;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.cleanup_companion_instance_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_instance UUID := OLD.companion_instance_id;
BEGIN
  IF v_instance IS NULL THEN RETURN NULL; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.character_extras WHERE companion_instance_id = v_instance)
     AND NOT EXISTS (SELECT 1 FROM public.character_tamed_anomalies WHERE companion_instance_id = v_instance)
     AND NOT EXISTS (SELECT 1 FROM public.campaign_tamed_anomalies WHERE companion_instance_id = v_instance)
     AND NOT EXISTS (SELECT 1 FROM public.character_vehicles WHERE companion_instance_id = v_instance)
  THEN
    DELETE FROM public.companion_instances WHERE id = v_instance;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS ensure_character_extra_companion_instance ON public.character_extras;
CREATE TRIGGER ensure_character_extra_companion_instance
  BEFORE INSERT ON public.character_extras
  FOR EACH ROW EXECUTE FUNCTION app_private.ensure_character_extra_companion_instance();
DROP TRIGGER IF EXISTS ensure_character_tamed_companion_instance ON public.character_tamed_anomalies;
CREATE TRIGGER ensure_character_tamed_companion_instance
  BEFORE INSERT ON public.character_tamed_anomalies
  FOR EACH ROW EXECUTE FUNCTION app_private.ensure_character_tamed_companion_instance();
DROP TRIGGER IF EXISTS ensure_campaign_tamed_companion_instance ON public.campaign_tamed_anomalies;
CREATE TRIGGER ensure_campaign_tamed_companion_instance
  BEFORE INSERT ON public.campaign_tamed_anomalies
  FOR EACH ROW EXECUTE FUNCTION app_private.ensure_campaign_tamed_companion_instance();

DROP TRIGGER IF EXISTS guard_character_extra_companion_mapping ON public.character_extras;
CREATE TRIGGER guard_character_extra_companion_mapping
  BEFORE UPDATE OF character_id, companion_instance_id ON public.character_extras
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_companion_mapping_and_owner();
DROP TRIGGER IF EXISTS guard_character_tamed_companion_mapping ON public.character_tamed_anomalies;
CREATE TRIGGER guard_character_tamed_companion_mapping
  BEFORE UPDATE OF character_id, companion_instance_id ON public.character_tamed_anomalies
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_companion_mapping_and_owner();
DROP TRIGGER IF EXISTS guard_campaign_tamed_companion_mapping ON public.campaign_tamed_anomalies;
CREATE TRIGGER guard_campaign_tamed_companion_mapping
  BEFORE UPDATE OF campaign_id, companion_instance_id ON public.campaign_tamed_anomalies
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_companion_mapping_and_owner();
DROP TRIGGER IF EXISTS guard_character_vehicle_companion_mapping ON public.character_vehicles;
CREATE TRIGGER guard_character_vehicle_companion_mapping
  BEFORE UPDATE OF character_id, companion_instance_id ON public.character_vehicles
  FOR EACH ROW EXECUTE FUNCTION app_private.guard_companion_mapping_and_owner();

DROP TRIGGER IF EXISTS sync_campaign_tamed_companion_relationships ON public.campaign_tamed_anomalies;
CREATE TRIGGER sync_campaign_tamed_companion_relationships
  AFTER UPDATE OF primary_handler_character_id, current_controller_character_id
  ON public.campaign_tamed_anomalies
  FOR EACH ROW EXECUTE FUNCTION app_private.sync_campaign_tamed_companion_relationships();

DROP TRIGGER IF EXISTS cleanup_character_extra_companion_instance ON public.character_extras;
CREATE TRIGGER cleanup_character_extra_companion_instance
  AFTER DELETE ON public.character_extras
  FOR EACH ROW EXECUTE FUNCTION app_private.cleanup_companion_instance_reference();
DROP TRIGGER IF EXISTS cleanup_character_tamed_companion_instance ON public.character_tamed_anomalies;
CREATE TRIGGER cleanup_character_tamed_companion_instance
  AFTER DELETE ON public.character_tamed_anomalies
  FOR EACH ROW EXECUTE FUNCTION app_private.cleanup_companion_instance_reference();
DROP TRIGGER IF EXISTS cleanup_campaign_tamed_companion_instance ON public.campaign_tamed_anomalies;
CREATE TRIGGER cleanup_campaign_tamed_companion_instance
  AFTER DELETE ON public.campaign_tamed_anomalies
  FOR EACH ROW EXECUTE FUNCTION app_private.cleanup_companion_instance_reference();
DROP TRIGGER IF EXISTS cleanup_character_vehicle_companion_instance ON public.character_vehicles;
CREATE TRIGGER cleanup_character_vehicle_companion_instance
  AFTER DELETE ON public.character_vehicles
  FOR EACH ROW EXECUTE FUNCTION app_private.cleanup_companion_instance_reference();

-- ---------------------------------------------------------------------------
-- Living mount registration. Constructed vehicles never get a companion id.
-- ---------------------------------------------------------------------------

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

  IF v_vehicle.companion_instance_id IS NOT NULL THEN
    RETURN v_vehicle.companion_instance_id;
  END IF;

  IF p_source_snapshot IS NULL
     OR p_source_snapshot->>'kind' IS DISTINCT FROM 'canonical-compendium'
     OR p_source_snapshot#>>'{provenance,canonicalType}' IS DISTINCT FROM 'vehicle'
     OR p_source_snapshot#>>'{provenance,canonicalId}' IS DISTINCT FROM v_vehicle.vehicle_id
     OR p_source_snapshot#>>'{provenance,entryType}' IS DISTINCT FROM 'mount'
  THEN
    RAISE EXCEPTION 'LIVING_MOUNT_SNAPSHOT_REQUIRED' USING ERRCODE = '22023';
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
  SET companion_instance_id = v_instance
  WHERE id = v_vehicle.id;

  RETURN v_instance;
END;
$$;

REVOKE ALL ON FUNCTION public.register_character_vehicle_mount(UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_character_vehicle_mount(UUID, JSONB)
  TO authenticated;

-- ---------------------------------------------------------------------------
-- Read scope. Registry writes are intentionally indirect through mapped stores
-- and actor-bound RPCs; there are no direct authenticated write policies.
-- ---------------------------------------------------------------------------

ALTER TABLE public.companion_instances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS companion_instances_select ON public.companion_instances;
CREATE POLICY companion_instances_select
  ON public.companion_instances
  FOR SELECT
  TO authenticated
  USING (
    (owner_character_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.characters AS character_row
      WHERE character_row.id = companion_instances.owner_character_id
        AND character_row.user_id = (SELECT auth.uid())
    ))
    OR
    (owner_campaign_id IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM public.campaign_members AS member_row
        WHERE member_row.campaign_id = companion_instances.owner_campaign_id
          AND member_row.user_id = (SELECT auth.uid())
      )
      OR EXISTS (
        SELECT 1 FROM public.campaigns AS campaign_row
        WHERE campaign_row.id = companion_instances.owner_campaign_id
          AND campaign_row.warden_id = (SELECT auth.uid())
      )
    ))
    OR EXISTS (
      SELECT 1 FROM public.characters AS character_row
      WHERE character_row.id IN (
        companion_instances.primary_handler_character_id,
        companion_instances.combat_controller_character_id,
        companion_instances.rider_character_id
      )
        AND character_row.user_id = (SELECT auth.uid())
    )
  );

REVOKE INSERT, UPDATE, DELETE ON public.companion_instances
  FROM anon, authenticated;
GRANT SELECT ON public.companion_instances TO authenticated;

REVOKE ALL ON FUNCTION app_private.ensure_character_extra_companion_instance()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.ensure_character_tamed_companion_instance()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.ensure_campaign_tamed_companion_instance()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.guard_companion_mapping_and_owner()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.sync_campaign_tamed_companion_relationships()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.cleanup_companion_instance_reference()
  FROM PUBLIC, anon, authenticated;

COMMENT ON TABLE public.companion_instances IS
  'C1 stable living-instance identity/ownership registry. Legacy stores remain compatibility projections; duplicate source ids/names do not imply the same creature.';
COMMENT ON COLUMN public.companion_instances.source_policy IS
  'snapshot freezes source data; legacy-live explicitly allows catalog fallback for unreconciled historical tamed rows; manual has no canonical catalog authority.';
COMMENT ON COLUMN public.character_vehicles.companion_instance_id IS
  'Nullable by design: only living mounts link to a companion instance; constructed vehicles do not.';

COMMIT;

NOTIFY pgrst, 'reload schema';

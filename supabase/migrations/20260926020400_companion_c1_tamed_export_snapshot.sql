-- C1 follow-up: personal tamed Anomalies are part of character export, so keep
-- their frozen source envelope on the mapped row just like living mounts.
-- Campaign rows carry the same envelope for symmetry/recovery, but campaign
-- ownership itself is never folded into a character export.

BEGIN;

ALTER TABLE public.character_tamed_anomalies
  ADD COLUMN IF NOT EXISTS companion_source_snapshot JSONB;
ALTER TABLE public.campaign_tamed_anomalies
  ADD COLUMN IF NOT EXISTS companion_source_snapshot JSONB;

-- Preserve any source that was already frozen by the C1 wrapper before this
-- additive column existed.
UPDATE public.character_tamed_anomalies AS tamed
SET companion_source_snapshot = instance.source_snapshot
FROM public.companion_instances AS instance
WHERE instance.id = tamed.companion_instance_id
  AND instance.source_policy = 'snapshot'
  AND tamed.companion_source_snapshot IS NULL;

UPDATE public.campaign_tamed_anomalies AS tamed
SET companion_source_snapshot = instance.source_snapshot
FROM public.companion_instances AS instance
WHERE instance.id = tamed.companion_instance_id
  AND instance.source_policy = 'snapshot'
  AND tamed.companion_source_snapshot IS NULL;

CREATE OR REPLACE FUNCTION app_private.ensure_character_tamed_companion_instance()
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

  v_snapshot_valid := NEW.companion_source_snapshot IS NOT NULL
    AND NEW.companion_source_snapshot->>'kind' = 'canonical-compendium'
    AND NEW.companion_source_snapshot#>>'{provenance,canonicalType}' = 'anomaly'
    AND NEW.companion_source_snapshot#>>'{provenance,canonicalId}' = NEW.anomaly_id;

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
    CASE WHEN v_snapshot_valid THEN 'snapshot' ELSE 'legacy-live' END,
    CASE WHEN v_snapshot_valid THEN 'canonical-snapshot-v1' ELSE 'legacy-tamed-live-v1' END,
    CASE WHEN v_snapshot_valid THEN NEW.companion_source_snapshot ELSE
      jsonb_build_object(
        'kind', 'legacy-tamed-state', 'version', 1,
        'anomalyId', NEW.anomaly_id, 'currentHp', NEW.current_hp,
        'maxHpOverride', NEW.max_hp_override, 'bondLevel', NEW.bond_level
      )
    END,
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
  v_snapshot_valid BOOLEAN := false;
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

  v_snapshot_valid := NEW.companion_source_snapshot IS NOT NULL
    AND NEW.companion_source_snapshot->>'kind' = 'canonical-compendium'
    AND NEW.companion_source_snapshot#>>'{provenance,canonicalType}' = 'anomaly'
    AND NEW.companion_source_snapshot#>>'{provenance,canonicalId}' = NEW.anomaly_id;

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
    CASE WHEN v_snapshot_valid THEN 'snapshot' ELSE 'legacy-live' END,
    CASE WHEN v_snapshot_valid THEN 'canonical-snapshot-v1' ELSE 'legacy-tamed-live-v1' END,
    CASE WHEN v_snapshot_valid THEN NEW.companion_source_snapshot ELSE
      jsonb_build_object(
        'kind', 'legacy-tamed-state', 'version', 1,
        'anomalyId', NEW.anomaly_id, 'currentHp', NEW.current_hp,
        'maxHpOverride', NEW.max_hp_override, 'bondLevel', NEW.bond_level
      )
    END,
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
DECLARE
  v_new JSONB := to_jsonb(NEW);
  v_old JSONB := to_jsonb(OLD);
BEGIN
  IF current_setting('app.companion_mapping_write', true) = 'on' THEN
    RETURN NEW;
  END IF;

  IF v_new->>'companion_instance_id' IS DISTINCT FROM v_old->>'companion_instance_id' THEN
    RAISE EXCEPTION 'COMPANION_MAPPING_IS_DERIVED' USING ERRCODE = '42501';
  END IF;

  IF v_new->'companion_source_snapshot' IS DISTINCT FROM v_old->'companion_source_snapshot' THEN
    RAISE EXCEPTION 'COMPANION_SOURCE_SNAPSHOT_IS_DERIVED' USING ERRCODE = '42501';
  END IF;

  IF TG_TABLE_NAME IN ('character_extras', 'character_tamed_anomalies', 'character_vehicles')
     AND v_new->>'character_id' IS DISTINCT FROM v_old->>'character_id' THEN
    RAISE EXCEPTION 'COMPANION_TRANSFER_RPC_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF TG_TABLE_NAME = 'campaign_tamed_anomalies'
     AND v_new->>'campaign_id' IS DISTINCT FROM v_old->>'campaign_id' THEN
    RAISE EXCEPTION 'COMPANION_TRANSFER_RPC_REQUIRED' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_character_tamed_companion_mapping
  ON public.character_tamed_anomalies;
CREATE TRIGGER guard_character_tamed_companion_mapping
  BEFORE UPDATE OF character_id, companion_instance_id, companion_source_snapshot
  ON public.character_tamed_anomalies
  FOR EACH ROW
  EXECUTE FUNCTION app_private.guard_companion_mapping_and_owner();

DROP TRIGGER IF EXISTS guard_campaign_tamed_companion_mapping
  ON public.campaign_tamed_anomalies;
CREATE TRIGGER guard_campaign_tamed_companion_mapping
  BEFORE UPDATE OF campaign_id, companion_instance_id, companion_source_snapshot
  ON public.campaign_tamed_anomalies
  FOR EACH ROW
  EXECUTE FUNCTION app_private.guard_companion_mapping_and_owner();

-- The vehicle trigger already watches companion_source_snapshot; keep it using
-- the hardened guard implementation above.

CREATE OR REPLACE FUNCTION public.attempt_taming_with_source(
  p_campaign_id UUID,
  p_character_id UUID,
  p_anomaly_id TEXT,
  p_roll_total INT,
  p_dc INT,
  p_initial_hp INT,
  p_source_snapshot JSONB,
  p_bond_initial INT DEFAULT 1,
  p_nickname TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_tamed_id UUID;
  v_instance_id UUID;
BEGIN
  IF p_source_snapshot IS NULL
     OR p_source_snapshot->>'kind' IS DISTINCT FROM 'canonical-compendium'
     OR p_source_snapshot#>>'{provenance,canonicalType}' IS DISTINCT FROM 'anomaly'
     OR p_source_snapshot#>>'{provenance,canonicalId}' IS DISTINCT FROM p_anomaly_id
  THEN
    RAISE EXCEPTION 'TAMING_SOURCE_SNAPSHOT_REQUIRED' USING ERRCODE = '22023';
  END IF;

  v_tamed_id := public.attempt_taming(
    p_campaign_id,
    p_character_id,
    p_anomaly_id,
    p_roll_total,
    p_dc,
    p_initial_hp,
    p_bond_initial,
    p_nickname
  );

  IF v_tamed_id IS NULL THEN
    RETURN NULL;
  END IF;

  PERFORM set_config('app.companion_mapping_write', 'on', true);

  IF p_campaign_id IS NULL THEN
    SELECT tamed.companion_instance_id
    INTO v_instance_id
    FROM public.character_tamed_anomalies AS tamed
    WHERE tamed.id = v_tamed_id;

    UPDATE public.character_tamed_anomalies
    SET companion_source_snapshot = p_source_snapshot
    WHERE id = v_tamed_id;
  ELSE
    SELECT tamed.companion_instance_id
    INTO v_instance_id
    FROM public.campaign_tamed_anomalies AS tamed
    WHERE tamed.id = v_tamed_id;

    UPDATE public.campaign_tamed_anomalies
    SET companion_source_snapshot = p_source_snapshot
    WHERE id = v_tamed_id;
  END IF;

  IF v_instance_id IS NULL THEN
    RAISE EXCEPTION 'TAMING_COMPANION_IDENTITY_MISSING' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.companion_instances AS instance
  SET source_policy = 'snapshot',
      source_revision = 'canonical-snapshot-v1',
      source_snapshot_version = 1,
      source_snapshot = p_source_snapshot,
      updated_at = now()
  WHERE instance.id = v_instance_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'TAMING_COMPANION_IDENTITY_MISSING' USING ERRCODE = 'P0001';
  END IF;

  RETURN v_tamed_id;
END;
$$;

REVOKE ALL ON FUNCTION app_private.ensure_character_tamed_companion_instance()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.ensure_campaign_tamed_companion_instance()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.guard_companion_mapping_and_owner()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.attempt_taming_with_source(
  UUID, UUID, TEXT, INT, INT, INT, JSONB, INT, TEXT
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.attempt_taming_with_source(
  UUID, UUID, TEXT, INT, INT, INT, JSONB, INT, TEXT
) TO authenticated;

COMMENT ON COLUMN public.character_tamed_anomalies.companion_source_snapshot IS
  'C1 portable frozen canonical source envelope. Export/import reconstructs the living instance without trusting a foreign registry id.';
COMMENT ON COLUMN public.campaign_tamed_anomalies.companion_source_snapshot IS
  'C1 frozen canonical source envelope for the campaign-owned living instance.';

COMMIT;

NOTIFY pgrst, 'reload schema';

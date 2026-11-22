-- C1 follow-up: successful new taming writes must freeze the canonical source
-- snapshot in the same transaction. Historical rows intentionally remain
-- legacy-live; this wrapper does not guess their past source revision.

BEGIN;

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

  IF p_campaign_id IS NULL THEN
    SELECT tamed.companion_instance_id
    INTO v_instance_id
    FROM public.character_tamed_anomalies AS tamed
    WHERE tamed.id = v_tamed_id;
  ELSE
    SELECT tamed.companion_instance_id
    INTO v_instance_id
    FROM public.campaign_tamed_anomalies AS tamed
    WHERE tamed.id = v_tamed_id;
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

-- C1 makes the source-bearing wrapper the supported application write boundary.
-- Its inner call remains available to the SECURITY DEFINER function owner but
-- cannot be invoked directly by an authenticated client to bypass snapshots.
REVOKE EXECUTE ON FUNCTION public.attempt_taming(
  UUID, UUID, TEXT, INT, INT, INT, INT, TEXT
) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.attempt_taming_with_source(
  UUID, UUID, TEXT, INT, INT, INT, JSONB, INT, TEXT
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.attempt_taming_with_source(
  UUID, UUID, TEXT, INT, INT, INT, JSONB, INT, TEXT
) TO authenticated;

COMMIT;

NOTIFY pgrst, 'reload schema';

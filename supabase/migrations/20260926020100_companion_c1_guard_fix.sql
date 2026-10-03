-- C1 follow-up: make the shared mapping/owner guard safe across tables whose
-- owner column names differ. Row JSON avoids referencing a field that does not
-- exist on another trigger target.

BEGIN;

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

REVOKE ALL ON FUNCTION app_private.guard_companion_mapping_and_owner()
  FROM PUBLIC, anon, authenticated;

COMMIT;

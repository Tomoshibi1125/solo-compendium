-- Follow-up hardening for the S2 projection trigger body. Keep DELETE/NEW return
-- paths explicit so the trigger is valid for every row operation in PostgreSQL.

BEGIN;

CREATE OR REPLACE FUNCTION app_private.guard_sovereign_feature_projection()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_allowed BOOLEAN := current_setting('app.sovereign_attachment', true) = 'on';
  v_source TEXT;
  v_definition UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_source := OLD.source;
    v_definition := OLD.sovereign_definition_id;
  ELSE
    v_source := NEW.source;
    v_definition := NEW.sovereign_definition_id;
  END IF;

  IF v_allowed THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;
    RETURN NEW;
  END IF;

  IF v_source LIKE 'Sovereign:%' OR v_definition IS NOT NULL THEN
    -- Character imports can contain rebuildable legacy Sovereign projection rows.
    -- Ignore those legacy inserts rather than trusting imported mechanics.
    IF TG_OP = 'INSERT' AND v_definition IS NULL THEN
      RETURN NULL;
    END IF;
    RAISE EXCEPTION 'SOVEREIGN_PROJECTION_RPC_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION app_private.guard_sovereign_feature_projection()
  FROM PUBLIC, anon, authenticated;

COMMIT;

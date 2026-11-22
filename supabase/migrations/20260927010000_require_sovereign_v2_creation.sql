-- New Sovereigns require complete validated v2 definitions. Existing v1 rows
-- remain readable and may be updated by archival maintenance.
BEGIN;

CREATE OR REPLACE FUNCTION app_private.require_new_sovereign_v2()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF NEW.schema_version IS DISTINCT FROM 2 THEN
    RAISE EXCEPTION 'NEW_SOVEREIGN_V2_REQUIRED' USING ERRCODE = '22023';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION app_private.require_new_sovereign_v2()
  FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS require_new_sovereign_v2 ON public.saved_sovereigns;
CREATE TRIGGER require_new_sovereign_v2
BEFORE INSERT ON public.saved_sovereigns
FOR EACH ROW EXECUTE FUNCTION app_private.require_new_sovereign_v2();

REVOKE EXECUTE ON FUNCTION public.save_legacy_sovereign_definition(JSONB, TEXT, BOOLEAN)
  FROM PUBLIC, anon, authenticated;

COMMIT;

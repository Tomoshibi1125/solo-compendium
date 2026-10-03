-- Biological adaptation has only the risks authored on its formula. A failed
-- project records that pinned consequence for Warden resolution; ordinary
-- procedures acquire no generic mutation or rejection outcome.
BEGIN;

ALTER TABLE public.craft_formulas_m3
  ADD COLUMN IF NOT EXISTS adaptation_risks JSONB;
ALTER TABLE public.craft_projects_m3
  ADD COLUMN IF NOT EXISTS risk_outcome JSONB;

CREATE OR REPLACE FUNCTION app_private.craft_adaptation_risks_valid(
  p_kind TEXT, p_risks JSONB
)
RETURNS BOOLEAN LANGUAGE plpgsql IMMUTABLE
SET search_path = pg_catalog, public AS $$
DECLARE v_failure JSONB;
BEGIN
  IF p_kind <> 'biological_adaptation' THEN RETURN p_risks IS NULL; END IF;
  IF jsonb_typeof(p_risks) IS DISTINCT FROM 'object' THEN RETURN false; END IF;
  v_failure := p_risks->'onFailure';
  IF jsonb_typeof(v_failure) IS DISTINCT FROM 'object'
     OR jsonb_typeof(v_failure->'label') IS DISTINCT FROM 'string'
     OR jsonb_typeof(v_failure->'effect') IS DISTINCT FROM 'string'
  THEN RETURN false; END IF;
  RETURN length(btrim(v_failure->>'label')) BETWEEN 1 AND 200
     AND length(btrim(v_failure->>'effect')) BETWEEN 1 AND 2000;
END;
$$;

ALTER TABLE public.craft_formulas_m3
  ADD CONSTRAINT craft_formula_adaptation_risks_check
  CHECK (app_private.craft_adaptation_risks_valid(
    procedure_kind, adaptation_risks));

CREATE OR REPLACE FUNCTION app_private.pin_craft_adaptation_risks()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = pg_catalog, public AS $$
DECLARE v_kind TEXT; v_risks JSONB;
BEGIN
  SELECT procedure_kind, adaptation_risks INTO v_kind, v_risks
  FROM public.craft_formulas_m3 WHERE id = NEW.formula_id;
  IF v_kind = 'biological_adaptation' THEN
    NEW.formula_snapshot := NEW.formula_snapshot ||
      jsonb_build_object('adaptationRisks', v_risks);
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER craft_project_pin_adaptation_risks
  BEFORE INSERT ON public.craft_projects_m3 FOR EACH ROW
  EXECUTE FUNCTION app_private.pin_craft_adaptation_risks();

CREATE OR REPLACE FUNCTION app_private.capture_craft_adaptation_risk()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = pg_catalog, public AS $$
BEGIN
  NEW.risk_outcome := CASE
    WHEN NEW.status = 'failed'
      AND NEW.formula_snapshot->>'procedureKind' = 'biological_adaptation'
    THEN NEW.formula_snapshot#>'{adaptationRisks,onFailure}'
    ELSE NULL END;
  RETURN NEW;
END;
$$;
CREATE TRIGGER craft_project_z_adaptation_risk_outcome
  BEFORE INSERT OR UPDATE OF status, formula_snapshot
  ON public.craft_projects_m3 FOR EACH ROW
  EXECUTE FUNCTION app_private.capture_craft_adaptation_risk();

REVOKE ALL ON FUNCTION app_private.craft_adaptation_risks_valid(TEXT, JSONB)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.pin_craft_adaptation_risks()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.capture_craft_adaptation_risk()
  FROM PUBLIC, anon, authenticated;

COMMIT;
NOTIFY pgrst, 'reload schema';

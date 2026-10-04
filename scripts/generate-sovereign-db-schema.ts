import { writeFileSync } from "node:fs";
import { z } from "zod";
import { SovereignV2DefinitionSchema } from "../src/lib/sovereign/sovereignV2Contract";

// Regenerate after changing the v2 Zod shape. The database adds semantic
// reference checks to this exact structural contract.
const schema = z.toJSONSchema(SovereignV2DefinitionSchema);
const compact = JSON.stringify(schema);
if (compact.includes("$sovereign_schema$")) {
	throw new Error(
		"The generated schema conflicts with its SQL quote delimiter.",
	);
}
writeFileSync(
	"supabase/sovereign_v2.schema.json",
	`${JSON.stringify(schema, null, 2)}\n`,
);

const migration = `-- Generated from sovereignV2Contract.ts by scripts/generate-sovereign-db-schema.ts.
-- pg_jsonschema enforces the complete structural shape at the saved-definition
-- boundary; the existing validator and the checks below enforce references.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pg_jsonschema WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS app_private.sovereign_v2_schemas (
  version INTEGER PRIMARY KEY,
  schema_json JSON NOT NULL
);
REVOKE ALL ON app_private.sovereign_v2_schemas FROM PUBLIC, anon, authenticated;
INSERT INTO app_private.sovereign_v2_schemas (version, schema_json)
VALUES (2, $sovereign_schema$${compact}$sovereign_schema$::json)
ON CONFLICT (version) DO UPDATE SET schema_json = EXCLUDED.schema_json;

CREATE OR REPLACE FUNCTION app_private.guard_sovereign_v2_json_schema()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_schema JSON;
  v_modifier JSONB;
  v_owner JSONB;
  v_ability JSONB;
BEGIN
  IF NEW.schema_version <> 2 THEN
    RETURN NEW;
  END IF;
  SELECT schema_json INTO v_schema
  FROM app_private.sovereign_v2_schemas WHERE version = 2;
  IF v_schema IS NULL OR NOT extensions.jsonb_matches_schema(v_schema, NEW.definition) THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_SCHEMA_INVALID' USING ERRCODE = '22023';
  END IF;

  FOR v_modifier IN SELECT value FROM jsonb_array_elements(NEW.definition->'modifiers') LOOP
    SELECT value INTO v_owner
    FROM jsonb_array_elements(
      NEW.definition->'traits' || NEW.definition->'features' || NEW.definition->'abilities'
    ) AS owner
    WHERE owner->>'id' = v_modifier->>'source_id';
    IF v_owner IS NULL
      OR v_owner->>'compatibility' <> 'native'
      OR NOT (v_owner->'modifier_ids' ? (v_modifier->>'id'))
    THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_MODIFIER_OWNER_INVALID' USING ERRCODE = '22023';
    END IF;
    v_owner := NULL;
  END LOOP;

  FOR v_owner IN SELECT value FROM jsonb_array_elements(
    NEW.definition->'traits' || NEW.definition->'features' || NEW.definition->'abilities'
  ) LOOP
    IF (SELECT count(*) FROM jsonb_array_elements_text(v_owner->'modifier_ids')) <>
       (SELECT count(DISTINCT value) FROM jsonb_array_elements_text(v_owner->'modifier_ids'))
    THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_DUPLICATE_MODIFIER_REFERENCE' USING ERRCODE = '22023';
    END IF;
  END LOOP;

  FOR v_ability IN SELECT value FROM jsonb_array_elements(NEW.definition->'abilities') LOOP
    IF (SELECT count(*) FROM jsonb_array_elements(v_ability->'resource_costs')) <>
       (SELECT count(DISTINCT cost->>'resource_id')
        FROM jsonb_array_elements(v_ability->'resource_costs') AS cost)
    THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_DUPLICATE_RESOURCE_COST' USING ERRCODE = '22023';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION app_private.guard_sovereign_v2_json_schema()
  FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS guard_sovereign_v2_json_schema ON public.saved_sovereigns;
CREATE TRIGGER guard_sovereign_v2_json_schema
BEFORE INSERT OR UPDATE OF definition, schema_version ON public.saved_sovereigns
FOR EACH ROW EXECUTE FUNCTION app_private.guard_sovereign_v2_json_schema();
COMMIT;
`;
writeFileSync(
	"supabase/migrations/20260926083000_sovereign_json_schema_guard.sql",
	migration,
);

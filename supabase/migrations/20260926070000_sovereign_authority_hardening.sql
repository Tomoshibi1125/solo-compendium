-- Repair the deployed v2 validator and attachment guards without rewriting prior migrations.
BEGIN;

CREATE OR REPLACE FUNCTION app_private.assert_sovereign_v2_definition(p_definition JSONB)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_levels INT[] := ARRAY[1,3,5,7,10,14,17,20];
  v_allowed_regents TEXT[] := ARRAY[
    'umbral_regent','radiant_regent','steel_regent','destruction_regent',
    'war_regent','frost_regent','beast_regent','plague_regent',
    'spatial_regent','mimic_regent','blood_regent','gravity_regent'
  ];
  v_allowed_abilities TEXT[] := ARRAY['STR','AGI','VIT','INT','SENSE','PRE'];
  v_job_source TEXT;
  v_path_source TEXT;
  v_regent_a TEXT;
  v_regent_b TEXT;
  v_job_id UUID;
  v_entries JSONB;
  v_modifier_owners JSONB;
  v_ability JSONB;
  v_entry JSONB;
  v_modifier JSONB;
  v_resource JSONB;
  v_reference TEXT;
  v_duplicate TEXT;
  v_source TEXT;
  v_index INT;
BEGIN
  IF p_definition IS NULL OR jsonb_typeof(p_definition) <> 'object'
    OR COALESCE((p_definition->>'schema_version')::int, 0) <> 2
  THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_SCHEMA_REQUIRED' USING ERRCODE = '22023';
  END IF;

  IF COALESCE(p_definition->>'id', '') !~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$' THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_INVALID_DEFINITION_ID' USING ERRCODE = '22023';
  END IF;

  IF jsonb_typeof(p_definition->'generation') <> 'object'
    OR jsonb_typeof(p_definition#>'{generation,source_ids}') <> 'object'
  THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_SOURCE_IDS_REQUIRED' USING ERRCODE = '22023';
  END IF;

  v_job_source := p_definition#>>'{generation,source_ids,job}';
  v_path_source := p_definition#>>'{generation,source_ids,path}';
  v_regent_a := p_definition#>>'{generation,source_ids,regent_a}';
  v_regent_b := p_definition#>>'{generation,source_ids,regent_b}';

  SELECT job_row.id INTO v_job_id
  FROM public.compendium_jobs AS job_row
  WHERE job_row.id::text = v_job_source;
  IF v_job_id IS NULL THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_UNKNOWN_JOB' USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.compendium_job_paths AS path_row
    WHERE path_row.id::text = v_path_source
      AND path_row.job_id = v_job_id
  ) THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_UNKNOWN_PATH' USING ERRCODE = '22023';
  END IF;

  IF NOT (v_regent_a = ANY(v_allowed_regents))
    OR NOT (v_regent_b = ANY(v_allowed_regents))
    OR v_regent_a = v_regent_b
  THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_INVALID_REGENT_PAIR' USING ERRCODE = '22023';
  END IF;

  IF jsonb_typeof(p_definition->'primary_abilities') <> 'array'
    OR jsonb_array_length(p_definition->'primary_abilities') NOT BETWEEN 1 AND 6
  THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_PRIMARY_ABILITIES_REQUIRED' USING ERRCODE = '22023';
  END IF;
  FOR v_reference IN SELECT jsonb_array_elements_text(p_definition->'primary_abilities') LOOP
    IF NOT (v_reference = ANY(v_allowed_abilities)) THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_INVALID_PRIMARY_ABILITY' USING ERRCODE = '22023';
    END IF;
  END LOOP;
  IF (
    SELECT count(*) FROM jsonb_array_elements_text(p_definition->'primary_abilities')
  ) <> (
    SELECT count(DISTINCT value) FROM jsonb_array_elements_text(p_definition->'primary_abilities')
  ) THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_DUPLICATE_PRIMARY_ABILITY' USING ERRCODE = '22023';
  END IF;

  IF jsonb_typeof(p_definition->'abilities') <> 'array'
    OR jsonb_array_length(p_definition->'abilities') <> 8
  THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_EIGHT_MILESTONES_REQUIRED' USING ERRCODE = '22023';
  END IF;

  FOR v_index IN 0..7 LOOP
    v_ability := p_definition->'abilities'->v_index;
    IF COALESCE((v_ability->>'level')::int, -1) <> v_levels[v_index + 1] THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_MILESTONE_ORDER_INVALID' USING ERRCODE = '22023';
    END IF;
    IF COALESCE((v_ability->>'is_capstone')::boolean, false)
      IS DISTINCT FROM (v_levels[v_index + 1] IN (17,20))
    THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_CAPSTONE_FLAG_INVALID' USING ERRCODE = '22023';
    END IF;
    IF NOT (v_ability->>'action_type' = ANY(ARRAY['action','bonus-action','reaction','passive'])) THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_ACTION_TYPE_INVALID' USING ERRCODE = '22023';
    END IF;
    IF v_ability->'recharge' IS DISTINCT FROM 'null'::jsonb
      AND NOT (v_ability->>'recharge' = ANY(ARRAY['at-will','short-rest','long-rest']))
    THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_RECHARGE_INVALID' USING ERRCODE = '22023';
    END IF;
    IF v_levels[v_index + 1] IN (17,20)
      AND NOT COALESCE(v_ability->'ancestry', '[]'::jsonb)
        @> '["job","path","regent-a","regent-b"]'::jsonb
    THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_CAPSTONE_ANCESTRY_REQUIRED' USING ERRCODE = '22023';
    END IF;
  END LOOP;

  v_entries :=
    COALESCE(p_definition->'affinities', '[]'::jsonb)
    || COALESCE(p_definition->'traits', '[]'::jsonb)
    || COALESCE(p_definition->'features', '[]'::jsonb)
    || COALESCE(p_definition->'abilities', '[]'::jsonb)
    || COALESCE(p_definition->'resources', '[]'::jsonb)
    || COALESCE(p_definition->'modifiers', '[]'::jsonb);

  FOR v_entry IN SELECT value FROM jsonb_array_elements(v_entries) LOOP
    IF COALESCE(v_entry->>'id', '') !~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$' THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_INVALID_ENTITY_ID' USING ERRCODE = '22023';
    END IF;
  END LOOP;

  SELECT lower(entry->>'id') INTO v_duplicate
  FROM jsonb_array_elements(v_entries) AS entry
  GROUP BY lower(entry->>'id')
  HAVING count(*) > 1
  LIMIT 1;
  IF v_duplicate IS NOT NULL THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_DUPLICATE_ENTITY_ID' USING ERRCODE = '22023';
  END IF;

  SELECT lower(entry->>'name') INTO v_duplicate
  FROM jsonb_array_elements(v_entries) AS entry
  WHERE entry ? 'name'
  GROUP BY lower(entry->>'name')
  HAVING count(*) > 1
  LIMIT 1;
  IF v_duplicate IS NOT NULL THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_DUPLICATE_ENTITY_NAME' USING ERRCODE = '22023';
  END IF;

  FOREACH v_source IN ARRAY ARRAY['job','path','regent-a','regent-b'] LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM jsonb_array_elements(v_entries) AS entity
      CROSS JOIN LATERAL jsonb_array_elements_text(
        COALESCE(entity->'ancestry', '[]'::jsonb)
      ) AS ancestry(value)
      WHERE ancestry.value = v_source
    ) THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_PACKAGE_ANCESTRY_INCOMPLETE' USING ERRCODE = '22023';
    END IF;
  END LOOP;

  v_modifier_owners :=
    COALESCE(p_definition->'traits', '[]'::jsonb)
    || COALESCE(p_definition->'features', '[]'::jsonb)
    || COALESCE(p_definition->'abilities', '[]'::jsonb);

  FOR v_modifier IN SELECT value FROM jsonb_array_elements(COALESCE(p_definition->'modifiers', '[]'::jsonb)) LOOP
    IF NOT (v_modifier->>'kind' = ANY(ARRAY[
      'resistance','advantage','proficiency','expertise','save-proficiency'
    ])) THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_UNSUPPORTED_MODIFIER' USING ERRCODE = '22023';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements(v_modifier_owners) AS owner
      WHERE owner->>'id' = v_modifier->>'source_id'
    ) THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_UNKNOWN_MODIFIER_OWNER' USING ERRCODE = '22023';
    END IF;
  END LOOP;

  FOR v_entry IN SELECT value FROM jsonb_array_elements(v_modifier_owners) LOOP
    IF COALESCE(v_entry->>'compatibility', 'automated') = 'manual-only'
      AND jsonb_array_length(COALESCE(v_entry->'modifier_ids', '[]'::jsonb)) > 0
    THEN
      RAISE EXCEPTION 'SOVEREIGN_V2_MANUAL_ENTITY_HAS_MODIFIERS' USING ERRCODE = '22023';
    END IF;
    FOR v_reference IN
      SELECT jsonb_array_elements_text(COALESCE(v_entry->'modifier_ids', '[]'::jsonb))
    LOOP
      SELECT modifier INTO v_modifier
      FROM jsonb_array_elements(COALESCE(p_definition->'modifiers', '[]'::jsonb)) AS modifier
      WHERE modifier->>'id' = v_reference
      LIMIT 1;
      IF v_modifier IS NULL OR v_modifier->>'source_id' <> v_entry->>'id' THEN
        RAISE EXCEPTION 'SOVEREIGN_V2_INVALID_MODIFIER_REFERENCE' USING ERRCODE = '22023';
      END IF;
      v_modifier := NULL;
    END LOOP;
  END LOOP;

  FOR v_resource IN SELECT value FROM jsonb_array_elements(COALESCE(p_definition->'resources', '[]'::jsonb)) LOOP
    PERFORM app_private.assert_sovereign_expression(v_resource->'maximum');
  END LOOP;

  FOR v_ability IN SELECT value FROM jsonb_array_elements(p_definition->'abilities') LOOP
    FOR v_reference IN
      SELECT cost->>'resource_id'
      FROM jsonb_array_elements(COALESCE(v_ability->'resource_costs', '[]'::jsonb)) AS cost
    LOOP
      IF NOT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(COALESCE(p_definition->'resources', '[]'::jsonb)) AS resource
        WHERE resource->>'id' = v_reference
      ) THEN
        RAISE EXCEPTION 'SOVEREIGN_V2_UNKNOWN_RESOURCE_REFERENCE' USING ERRCODE = '22023';
      END IF;
    END LOOP;
  END LOOP;
END;
$$;

-- A v2 definition is an immutable revision. The old trigger checked only
-- NEW.schema_version = 2, so an owner could downgrade a v2 row to v1 first.
CREATE OR REPLACE FUNCTION app_private.guard_saved_sovereign_revision()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF OLD.schema_version = 2 AND (
    NEW.schema_version IS DISTINCT FROM 2 OR
    (to_jsonb(NEW) - 'is_public' - 'likes_count')
      IS DISTINCT FROM (to_jsonb(OLD) - 'is_public' - 'likes_count')
  ) THEN
    RAISE EXCEPTION 'SOVEREIGN_REVISION_IMMUTABLE' USING ERRCODE = '55000';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_saved_sovereign_revision ON public.saved_sovereigns;
CREATE TRIGGER guard_saved_sovereign_revision
BEFORE UPDATE ON public.saved_sovereigns
FOR EACH ROW EXECUTE FUNCTION app_private.guard_saved_sovereign_revision();

-- Character imports retain the definition as an inactive archive. Normal
-- character writes cannot replace the attached definition or reactivate that
-- archive; only the attachment RPC can set the protected runtime fields.
CREATE OR REPLACE FUNCTION app_private.guard_character_sovereign_attachment()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_imported JSONB;
  v_key TEXT;
BEGIN
  IF current_setting('app.sovereign_attachment', true) = 'on' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.active_sovereign_id := NULL;
    IF jsonb_typeof(NEW.gemini_state) = 'object'
      AND NEW.gemini_state ?| ARRAY[
        'sovereignId', 'sovereignDefinition', 'definitionId', 'isActive'
      ]
    THEN
      v_imported := NEW.gemini_state->'sovereignDefinition';
      NEW.gemini_state :=
        (NEW.gemini_state - ARRAY[
          'sovereignId', 'definitionId', 'projectionRevision',
          'sovereignDefinition', 'features', 'traits', 'resources', 'modifiers',
          'sovereignName', 'regent1Id', 'regent2Id', 'fusionTheme',
          'powerMultiplier', 'fusionStability', 'compatibility'
        ])
        || jsonb_build_object('isActive', false, 'sovereignImportDetached', true)
        || CASE WHEN v_imported IS NULL THEN '{}'::jsonb
          ELSE jsonb_build_object('sovereignImportedDefinition', v_imported) END;
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.active_sovereign_id IS DISTINCT FROM OLD.active_sovereign_id THEN
    RAISE EXCEPTION 'SOVEREIGN_ATTACHMENT_RPC_REQUIRED' USING ERRCODE = '42501';
  END IF;

  FOREACH v_key IN ARRAY ARRAY[
    'storageSchemaVersion', 'definitionSchemaVersion', 'definitionId',
    'projectionRevision', 'sovereignId', 'sovereignName', 'isActive',
    'fusionTheme', 'fusionStability', 'powerMultiplier', 'regent1Id',
    'regent2Id', 'features', 'traits',
    'sovereignDefinition', 'compatibility', 'sovereignImportDetached'
  ] LOOP
    IF NEW.gemini_state->v_key IS DISTINCT FROM OLD.gemini_state->v_key THEN
      RAISE EXCEPTION 'SOVEREIGN_RUNTIME_RPC_REQUIRED' USING ERRCODE = '42501';
    END IF;
  END LOOP;
  -- Legacy Gemini state stores mutable condition data inside resources and
  -- uses a different modifier format. v2 resources/modifiers are definition
  -- projections and must remain identical to the attached revision.
  IF OLD.gemini_state->>'definitionSchemaVersion' = '2' AND (
    NEW.gemini_state->'resources' IS DISTINCT FROM OLD.gemini_state->'resources'
    OR NEW.gemini_state->'modifiers' IS DISTINCT FROM OLD.gemini_state->'modifiers'
  ) THEN
    RAISE EXCEPTION 'SOVEREIGN_RUNTIME_RPC_REQUIRED' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

-- Projection rows in a portable backup are rebuildable data, never an
-- attachment. Discard them on insert even when they carry a foreign v2 ID.
CREATE OR REPLACE FUNCTION app_private.guard_sovereign_feature_projection()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
DECLARE
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

  IF current_setting('app.sovereign_attachment', true) = 'on' THEN
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
    RETURN NEW;
  END IF;

  IF v_source LIKE 'Sovereign:%' OR v_definition IS NOT NULL THEN
    IF TG_OP = 'INSERT' THEN RETURN NULL; END IF;
    RAISE EXCEPTION 'SOVEREIGN_PROJECTION_RPC_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION app_private.assert_sovereign_v2_definition(JSONB)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.guard_saved_sovereign_revision()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.guard_character_sovereign_attachment()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.guard_sovereign_feature_projection()
  FROM PUBLIC, anon, authenticated;

COMMIT;

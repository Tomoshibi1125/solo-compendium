-- S2: authoritative Sovereign storage and atomic attachment
--
-- saved_sovereigns owns the immutable definition; characters.active_sovereign_id
-- owns attachment; characters.gemini_state owns runtime state; character_features
-- is a rebuildable projection. Attachment is one transaction with durable receipts.

BEGIN;

LOCK TABLE public.saved_sovereigns IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.characters IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.character_features IN SHARE ROW EXCLUSIVE MODE;

ALTER TABLE public.saved_sovereigns
  ADD COLUMN IF NOT EXISTS schema_version SMALLINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS definition_id TEXT,
  ADD COLUMN IF NOT EXISTS definition JSONB,
  ADD COLUMN IF NOT EXISTS ruleset_revision TEXT,
  ADD COLUMN IF NOT EXISTS canonical_source_revision TEXT,
  ADD COLUMN IF NOT EXISTS projection_revision TEXT NOT NULL DEFAULT 'legacy-v1',
  ADD COLUMN IF NOT EXISTS save_operation_id TEXT,
  ADD COLUMN IF NOT EXISTS save_fingerprint TEXT;

-- v2 does not define these two legacy display labels. Do not manufacture them.
ALTER TABLE public.saved_sovereigns
  ALTER COLUMN power_multiplier DROP NOT NULL,
  ALTER COLUMN fusion_stability DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'saved_sovereigns_schema_version_check'
      AND conrelid = 'public.saved_sovereigns'::regclass
  ) THEN
    ALTER TABLE public.saved_sovereigns
      ADD CONSTRAINT saved_sovereigns_schema_version_check
      CHECK (schema_version IN (1, 2));
  END IF;
END;
$$;

-- Preserve legacy rows exactly as legacy inputs. The compatibility envelope makes
-- unsupported mechanics explicit without inventing stable IDs or ancestry.
UPDATE public.saved_sovereigns AS sovereign_row
SET
  schema_version = 1,
  definition_id = NULL,
  projection_revision = 'legacy-v1',
  definition = jsonb_build_object(
    'schema_version', 1,
    'name', sovereign_row.name,
    'title', sovereign_row.title,
    'description', sovereign_row.description,
    'fusion_theme', sovereign_row.fusion_theme,
    'fusion_description', sovereign_row.fusion_description,
    'fusion_method', sovereign_row.fusion_method,
    'power_multiplier', sovereign_row.power_multiplier,
    'fusion_stability', sovereign_row.fusion_stability,
    'job_id', sovereign_row.job_id::text,
    'path_id', sovereign_row.path_id::text,
    'regent_a_id', sovereign_row.regent_a_id,
    'regent_b_id', sovereign_row.regent_b_id,
    'legacy_monarch_a_id', sovereign_row.monarch_a_id,
    'legacy_monarch_b_id', sovereign_row.monarch_b_id,
    'abilities', COALESCE(sovereign_row.abilities, '[]'::jsonb),
    'compatibility', jsonb_build_object(
      'status', 'legacy-visible',
      'unsupported', jsonb_build_array(
        'stable-entity-ids',
        'structured-mechanics',
        'declared-ancestry',
        'typed-resources'
      )
    )
  )
WHERE sovereign_row.definition IS NULL;

ALTER TABLE public.saved_sovereigns
  ALTER COLUMN definition SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS saved_sovereigns_creator_operation_key
  ON public.saved_sovereigns (created_by, save_operation_id)
  WHERE save_operation_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS saved_sovereigns_creator_definition_key
  ON public.saved_sovereigns (created_by, definition_id)
  WHERE schema_version = 2 AND definition_id IS NOT NULL;

ALTER TABLE public.character_features
  ADD COLUMN IF NOT EXISTS sovereign_definition_id UUID
    REFERENCES public.saved_sovereigns(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS sovereign_entity_id TEXT,
  ADD COLUMN IF NOT EXISTS sovereign_projection_revision TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS character_features_sovereign_entity_key
  ON public.character_features (
    character_id,
    sovereign_definition_id,
    sovereign_entity_id
  )
  WHERE sovereign_definition_id IS NOT NULL
    AND sovereign_entity_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.sovereign_attachment_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_id TEXT NOT NULL,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  sovereign_id UUID NOT NULL REFERENCES public.saved_sovereigns(id) ON DELETE RESTRICT,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT sovereign_attachment_operations_actor_operation_key
    UNIQUE (actor_id, operation_id),
  CONSTRAINT sovereign_attachment_operations_operation_id_check
    CHECK (char_length(operation_id) BETWEEN 8 AND 200)
);

ALTER TABLE public.sovereign_attachment_operations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sovereign_attachment_operations_select
  ON public.sovereign_attachment_operations;
CREATE POLICY sovereign_attachment_operations_select
  ON public.sovereign_attachment_operations
  FOR SELECT
  TO authenticated
  USING (actor_id = auth.uid());

REVOKE INSERT, UPDATE, DELETE ON public.sovereign_attachment_operations
  FROM anon, authenticated;
GRANT SELECT ON public.sovereign_attachment_operations TO authenticated;

CREATE OR REPLACE FUNCTION app_private.normalize_sovereign_action_type(p_value TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog
AS $$
  SELECT CASE lower(replace(btrim(COALESCE(p_value, '')), '_', '-'))
    WHEN 'action' THEN 'action'
    WHEN '1 action' THEN 'action'
    WHEN 'bonus-action' THEN 'bonus-action'
    WHEN 'bonus action' THEN 'bonus-action'
    WHEN '1 bonus action' THEN 'bonus-action'
    WHEN 'reaction' THEN 'reaction'
    WHEN '1 reaction' THEN 'reaction'
    WHEN 'passive' THEN 'passive'
    ELSE NULL
  END;
$$;

CREATE OR REPLACE FUNCTION app_private.normalize_sovereign_recharge(p_value TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog
AS $$
  SELECT CASE lower(replace(btrim(COALESCE(p_value, '')), '_', '-'))
    WHEN 'at will' THEN 'at-will'
    WHEN 'at-will' THEN 'at-will'
    WHEN 'short rest' THEN 'short-rest'
    WHEN 'short-rest' THEN 'short-rest'
    WHEN 'long rest' THEN 'long-rest'
    WHEN 'long-rest' THEN 'long-rest'
    ELSE NULL
  END;
$$;

CREATE OR REPLACE FUNCTION app_private.assert_sovereign_expression(p_expression JSONB)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_kind TEXT;
  v_term JSONB;
  v_number NUMERIC;
BEGIN
  IF p_expression IS NULL OR jsonb_typeof(p_expression) <> 'object' THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_INVALID_EXPRESSION' USING ERRCODE = '22023';
  END IF;

  v_kind := p_expression->>'kind';
  CASE v_kind
    WHEN 'constant' THEN
      IF jsonb_typeof(p_expression->'value') <> 'number' THEN
        RAISE EXCEPTION 'SOVEREIGN_V2_INVALID_CONSTANT' USING ERRCODE = '22023';
      END IF;
      v_number := (p_expression->>'value')::numeric;
      IF v_number <> trunc(v_number) OR abs(v_number) > 1000000 THEN
        RAISE EXCEPTION 'SOVEREIGN_V2_CONSTANT_OUT_OF_BOUNDS' USING ERRCODE = '22023';
      END IF;
    WHEN 'proficiency-bonus' THEN
      NULL;
    WHEN 'ability-modifier' THEN
      IF NOT (p_expression->>'ability' = ANY(ARRAY['STR','AGI','VIT','INT','SENSE','PRE'])) THEN
        RAISE EXCEPTION 'SOVEREIGN_V2_INVALID_ABILITY' USING ERRCODE = '22023';
      END IF;
    WHEN 'dice' THEN
      IF jsonb_typeof(p_expression->'count') <> 'number'
        OR jsonb_typeof(p_expression->'sides') <> 'number'
        OR (p_expression->>'count')::int NOT BETWEEN 1 AND 100
        OR (p_expression->>'sides')::int NOT BETWEEN 2 AND 1000
        OR (p_expression->>'count')::numeric <> trunc((p_expression->>'count')::numeric)
        OR (p_expression->>'sides')::numeric <> trunc((p_expression->>'sides')::numeric)
      THEN
        RAISE EXCEPTION 'SOVEREIGN_V2_INVALID_DICE' USING ERRCODE = '22023';
      END IF;
      IF p_expression ? 'bonus' AND jsonb_typeof(p_expression->'bonus') <> 'number' THEN
        RAISE EXCEPTION 'SOVEREIGN_V2_INVALID_DICE_BONUS' USING ERRCODE = '22023';
      END IF;
    WHEN 'sum' THEN
      IF jsonb_typeof(p_expression->'terms') <> 'array'
        OR jsonb_array_length(p_expression->'terms') NOT BETWEEN 1 AND 64
      THEN
        RAISE EXCEPTION 'SOVEREIGN_V2_INVALID_SUM' USING ERRCODE = '22023';
      END IF;
      FOR v_term IN SELECT value FROM jsonb_array_elements(p_expression->'terms') LOOP
        IF v_term->>'kind' = 'sum' THEN
          RAISE EXCEPTION 'SOVEREIGN_V2_NESTED_SUM_NOT_ALLOWED' USING ERRCODE = '22023';
        END IF;
        PERFORM app_private.assert_sovereign_expression(v_term);
      END LOOP;
    ELSE
      RAISE EXCEPTION 'SOVEREIGN_V2_UNKNOWN_EXPRESSION_KIND' USING ERRCODE = '22023';
  END CASE;
END;
$$;

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

  SELECT entry->>'id' INTO v_duplicate
  FROM jsonb_array_elements(v_entries) AS entry
  GROUP BY lower(entry->>'id')
  HAVING count(*) > 1
  LIMIT 1;
  IF v_duplicate IS NOT NULL THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_DUPLICATE_ENTITY_ID' USING ERRCODE = '22023';
  END IF;

  SELECT entry->>'name' INTO v_duplicate
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

CREATE OR REPLACE FUNCTION app_private.sync_saved_sovereign_definition()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_job UUID;
  v_path UUID;
BEGIN
  IF NEW.schema_version = 2 THEN
    IF TG_OP = 'UPDATE' AND OLD.schema_version = 2
      AND (
        OLD.definition IS DISTINCT FROM NEW.definition
        OR OLD.definition_id IS DISTINCT FROM NEW.definition_id
        OR OLD.job_id IS DISTINCT FROM NEW.job_id
        OR OLD.path_id IS DISTINCT FROM NEW.path_id
        OR OLD.regent_a_id IS DISTINCT FROM NEW.regent_a_id
        OR OLD.regent_b_id IS DISTINCT FROM NEW.regent_b_id
      )
    THEN
      RAISE EXCEPTION 'SOVEREIGN_REVISION_IMMUTABLE' USING ERRCODE = '55000';
    END IF;

    PERFORM app_private.assert_sovereign_v2_definition(NEW.definition);

    SELECT job_row.id INTO v_job
    FROM public.compendium_jobs AS job_row
    WHERE job_row.id::text = NEW.definition#>>'{generation,source_ids,job}';
    SELECT path_row.id INTO v_path
    FROM public.compendium_job_paths AS path_row
    WHERE path_row.id::text = NEW.definition#>>'{generation,source_ids,path}';

    NEW.definition_id := NEW.definition->>'id';
    NEW.name := NEW.definition#>>'{identity,name}';
    NEW.title := NEW.definition#>>'{identity,title}';
    NEW.description := NEW.definition->>'description';
    NEW.fusion_theme := NEW.definition->>'fusion_theme';
    NEW.fusion_description := NEW.definition->>'combat_doctrine';
    NEW.fusion_method := NEW.definition#>>'{generation,generator}';
    NEW.power_multiplier := NULL;
    NEW.fusion_stability := NULL;
    NEW.job_id := v_job;
    NEW.path_id := v_path;
    NEW.regent_a_id := NEW.definition#>>'{generation,source_ids,regent_a}';
    NEW.regent_b_id := NEW.definition#>>'{generation,source_ids,regent_b}';
    NEW.monarch_a_id := NULL;
    NEW.monarch_b_id := NULL;
    NEW.abilities := NEW.definition->'abilities';
    NEW.ruleset_revision := NEW.definition#>>'{generation,ruleset_revision}';
    NEW.canonical_source_revision := NEW.definition#>>'{generation,canonical_source_revision}';
    NEW.projection_revision := 'sovereign-projection-v1';
  ELSE
    NEW.schema_version := 1;
    NEW.definition_id := NULL;
    NEW.ruleset_revision := NULL;
    NEW.canonical_source_revision := NULL;
    NEW.projection_revision := COALESCE(NULLIF(NEW.projection_revision, ''), 'legacy-v1');
    NEW.definition := jsonb_build_object(
      'schema_version', 1,
      'name', NEW.name,
      'title', NEW.title,
      'description', NEW.description,
      'fusion_theme', NEW.fusion_theme,
      'fusion_description', NEW.fusion_description,
      'fusion_method', NEW.fusion_method,
      'power_multiplier', NEW.power_multiplier,
      'fusion_stability', NEW.fusion_stability,
      'job_id', NEW.job_id::text,
      'path_id', NEW.path_id::text,
      'regent_a_id', NEW.regent_a_id,
      'regent_b_id', NEW.regent_b_id,
      'legacy_monarch_a_id', NEW.monarch_a_id,
      'legacy_monarch_b_id', NEW.monarch_b_id,
      'abilities', COALESCE(NEW.abilities, '[]'::jsonb),
      'compatibility', jsonb_build_object(
        'status', 'legacy-visible',
        'unsupported', jsonb_build_array(
          'stable-entity-ids',
          'structured-mechanics',
          'declared-ancestry',
          'typed-resources'
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_saved_sovereign_definition ON public.saved_sovereigns;
CREATE TRIGGER sync_saved_sovereign_definition
BEFORE INSERT OR UPDATE ON public.saved_sovereigns
FOR EACH ROW
EXECUTE FUNCTION app_private.sync_saved_sovereign_definition();

CREATE OR REPLACE FUNCTION public.save_legacy_sovereign_definition(
  p_payload JSONB,
  p_operation_id TEXT,
  p_is_public BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_existing public.saved_sovereigns%ROWTYPE;
  v_job UUID;
  v_path UUID;
  v_regent_a TEXT := p_payload->>'regent_a_id';
  v_regent_b TEXT := p_payload->>'regent_b_id';
  v_allowed_regents TEXT[] := ARRAY[
    'umbral_regent','radiant_regent','steel_regent','destruction_regent',
    'war_regent','frost_regent','beast_regent','plague_regent',
    'spatial_regent','mimic_regent','blood_regent','gravity_regent'
  ];
  v_fingerprint TEXT := md5(COALESCE(p_payload, '{}'::jsonb)::text);
  v_levels INT[] := ARRAY[1,3,5,7,10,14,17,20];
  v_index INT;
  v_id UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF p_operation_id IS NULL OR char_length(p_operation_id) NOT BETWEEN 8 AND 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_actor::text || ':save:' || p_operation_id));

  SELECT * INTO v_existing
  FROM public.saved_sovereigns
  WHERE created_by = v_actor AND save_operation_id = p_operation_id
  FOR UPDATE;
  IF FOUND THEN
    IF v_existing.save_fingerprint IS DISTINCT FROM v_fingerprint THEN
      RAISE EXCEPTION 'SOVEREIGN_OPERATION_CONFLICT' USING ERRCODE = '23505';
    END IF;
    RETURN v_existing.id;
  END IF;

  IF p_payload IS NULL OR jsonb_typeof(p_payload) <> 'object' THEN
    RAISE EXCEPTION 'INVALID_SOVEREIGN_PAYLOAD' USING ERRCODE = '22023';
  END IF;

  SELECT job_row.id INTO v_job
  FROM public.compendium_jobs AS job_row
  WHERE job_row.id::text = p_payload->>'job_id';
  IF v_job IS NULL THEN
    RAISE EXCEPTION 'SOVEREIGN_UNKNOWN_JOB' USING ERRCODE = '22023';
  END IF;

  SELECT path_row.id INTO v_path
  FROM public.compendium_job_paths AS path_row
  WHERE path_row.id::text = p_payload->>'path_id'
    AND path_row.job_id = v_job;
  IF v_path IS NULL THEN
    RAISE EXCEPTION 'SOVEREIGN_UNKNOWN_PATH' USING ERRCODE = '22023';
  END IF;

  IF NOT (v_regent_a = ANY(v_allowed_regents))
    OR NOT (v_regent_b = ANY(v_allowed_regents))
    OR v_regent_a = v_regent_b
  THEN
    RAISE EXCEPTION 'SOVEREIGN_INVALID_REGENT_PAIR' USING ERRCODE = '22023';
  END IF;

  IF jsonb_typeof(p_payload->'abilities') <> 'array'
    OR jsonb_array_length(p_payload->'abilities') <> 8
  THEN
    RAISE EXCEPTION 'SOVEREIGN_EIGHT_MILESTONES_REQUIRED' USING ERRCODE = '22023';
  END IF;
  FOR v_index IN 0..7 LOOP
    IF COALESCE((p_payload->'abilities'->v_index->>'level')::int, -1) <> v_levels[v_index + 1] THEN
      RAISE EXCEPTION 'SOVEREIGN_MILESTONE_ORDER_INVALID' USING ERRCODE = '22023';
    END IF;
  END LOOP;

  IF COALESCE(btrim(p_payload->>'name'), '') = ''
    OR COALESCE(btrim(p_payload->>'title'), '') = ''
    OR COALESCE(btrim(p_payload->>'description'), '') = ''
    OR COALESCE(btrim(p_payload->>'fusion_theme'), '') = ''
    OR COALESCE(btrim(p_payload->>'fusion_description'), '') = ''
  THEN
    RAISE EXCEPTION 'SOVEREIGN_REQUIRED_TEXT_MISSING' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.saved_sovereigns (
    name, title, description, fusion_theme, fusion_description, fusion_method,
    power_multiplier, fusion_stability, job_id, path_id,
    monarch_a_id, monarch_b_id, regent_a_id, regent_b_id, abilities,
    created_by, is_public, schema_version, projection_revision,
    save_operation_id, save_fingerprint, definition
  ) VALUES (
    p_payload->>'name',
    p_payload->>'title',
    p_payload->>'description',
    p_payload->>'fusion_theme',
    p_payload->>'fusion_description',
    COALESCE(NULLIF(p_payload->>'fusion_method', ''), 'Gemini Protocol'),
    NULLIF(p_payload->>'power_multiplier', ''),
    NULLIF(p_payload->>'fusion_stability', ''),
    v_job,
    v_path,
    NULL,
    NULL,
    v_regent_a,
    v_regent_b,
    p_payload->'abilities',
    v_actor,
    COALESCE(p_is_public, true),
    1,
    'legacy-v1',
    p_operation_id,
    v_fingerprint,
    '{}'::jsonb
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.save_sovereign_v2_definition(
  p_definition JSONB,
  p_operation_id TEXT,
  p_is_public BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_existing public.saved_sovereigns%ROWTYPE;
  v_fingerprint TEXT := md5(COALESCE(p_definition, '{}'::jsonb)::text);
  v_definition_id TEXT;
  v_id UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF p_operation_id IS NULL OR char_length(p_operation_id) NOT BETWEEN 8 AND 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;

  PERFORM app_private.assert_sovereign_v2_definition(p_definition);
  v_definition_id := p_definition->>'id';

  PERFORM pg_advisory_xact_lock(hashtext(v_actor::text || ':save:' || p_operation_id));

  SELECT * INTO v_existing
  FROM public.saved_sovereigns
  WHERE created_by = v_actor
    AND (save_operation_id = p_operation_id OR definition_id = v_definition_id)
  ORDER BY (save_operation_id = p_operation_id) DESC
  LIMIT 1
  FOR UPDATE;
  IF FOUND THEN
    IF v_existing.save_fingerprint IS DISTINCT FROM v_fingerprint THEN
      RAISE EXCEPTION 'SOVEREIGN_OPERATION_CONFLICT' USING ERRCODE = '23505';
    END IF;
    RETURN v_existing.id;
  END IF;

  INSERT INTO public.saved_sovereigns (
    created_by, is_public, schema_version, definition,
    projection_revision, save_operation_id, save_fingerprint,
    name, title, description, fusion_theme, fusion_description, fusion_method,
    job_id, path_id, abilities
  ) VALUES (
    v_actor,
    COALESCE(p_is_public, false),
    2,
    p_definition,
    'sovereign-projection-v1',
    p_operation_id,
    v_fingerprint,
    '', '', '', '', '', '',
    (SELECT id FROM public.compendium_jobs WHERE id::text = p_definition#>>'{generation,source_ids,job}'),
    (SELECT id FROM public.compendium_job_paths WHERE id::text = p_definition#>>'{generation,source_ids,path}'),
    '[]'::jsonb
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.attach_saved_sovereign(
  p_character_id UUID,
  p_sovereign_id UUID,
  p_operation_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_character public.characters%ROWTYPE;
  v_sovereign public.saved_sovereigns%ROWTYPE;
  v_receipt public.sovereign_attachment_operations%ROWTYPE;
  v_entity JSONB;
  v_modifier JSONB;
  v_effect JSONB;
  v_modifiers JSONB;
  v_action_type TEXT;
  v_recharge TEXT;
  v_level INT;
  v_runtime_features JSONB := '[]'::jsonb;
  v_runtime JSONB;
  v_result JSONB;
  v_unlock_count INT;
  v_projection_revision TEXT;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF p_operation_id IS NULL OR char_length(p_operation_id) NOT BETWEEN 8 AND 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_actor::text || ':attach:' || p_operation_id));

  SELECT * INTO v_receipt
  FROM public.sovereign_attachment_operations
  WHERE actor_id = v_actor AND operation_id = p_operation_id
  FOR UPDATE;
  IF FOUND THEN
    IF v_receipt.character_id <> p_character_id OR v_receipt.sovereign_id <> p_sovereign_id THEN
      RAISE EXCEPTION 'SOVEREIGN_OPERATION_CONFLICT' USING ERRCODE = '23505';
    END IF;
    RETURN v_receipt.result;
  END IF;

  SELECT * INTO v_character
  FROM public.characters AS character_row
  WHERE character_row.id = p_character_id
  FOR UPDATE;
  IF NOT FOUND OR v_character.user_id IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_sovereign
  FROM public.saved_sovereigns AS sovereign_row
  WHERE sovereign_row.id = p_sovereign_id
  FOR UPDATE;
  IF NOT FOUND OR v_sovereign.created_by IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'SOVEREIGN_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF v_sovereign.schema_version = 2 THEN
    PERFORM app_private.assert_sovereign_v2_definition(v_sovereign.definition);
  ELSIF v_sovereign.schema_version <> 1 THEN
    RAISE EXCEPTION 'SOVEREIGN_SCHEMA_UNSUPPORTED' USING ERRCODE = '22023';
  END IF;

  IF v_sovereign.regent_a_id IS NULL OR v_sovereign.regent_b_id IS NULL
    OR v_sovereign.regent_a_id = v_sovereign.regent_b_id
  THEN
    RAISE EXCEPTION 'SOVEREIGN_CANONICAL_REGENT_MAPPING_REQUIRED' USING ERRCODE = '22023';
  END IF;

  IF v_character.job_id IS NULL OR v_character.path_id IS NULL THEN
    RAISE EXCEPTION 'SOVEREIGN_CHARACTER_CANONICAL_SOURCE_REQUIRED' USING ERRCODE = '22023';
  END IF;
  IF v_character.job_id <> v_sovereign.job_id OR v_character.path_id <> v_sovereign.path_id THEN
    RAISE EXCEPTION 'SOVEREIGN_CHARACTER_SOURCE_MISMATCH' USING ERRCODE = '42501';
  END IF;

  SELECT count(DISTINCT unlock_row.regent_id) INTO v_unlock_count
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.character_id = p_character_id
    AND unlock_row.regent_id IN (v_sovereign.regent_a_id, v_sovereign.regent_b_id);
  IF v_unlock_count <> 2 THEN
    RAISE EXCEPTION 'SOVEREIGN_REGENT_UNLOCKS_REQUIRED' USING ERRCODE = '42501';
  END IF;

  v_projection_revision := CASE
    WHEN v_sovereign.schema_version = 2 THEN 'sovereign-projection-v1'
    ELSE 'legacy-v1'
  END;

  PERFORM set_config('app.sovereign_attachment', 'on', true);

  DELETE FROM public.character_features AS feature_row
  WHERE feature_row.character_id = p_character_id
    AND (
      feature_row.sovereign_definition_id IS NOT NULL
      OR feature_row.source LIKE 'Sovereign:%'
    );

  IF v_sovereign.schema_version = 2 THEN
    FOR v_entity IN
      SELECT value
      FROM jsonb_array_elements(
        COALESCE(v_sovereign.definition->'traits', '[]'::jsonb)
        || COALESCE(v_sovereign.definition->'features', '[]'::jsonb)
        || COALESCE(v_sovereign.definition->'abilities', '[]'::jsonb)
      )
    LOOP
      v_modifiers := '[]'::jsonb;
      FOR v_modifier IN
        SELECT value
        FROM jsonb_array_elements(COALESCE(v_sovereign.definition->'modifiers', '[]'::jsonb))
      LOOP
        IF COALESCE(v_entity->'modifier_ids', '[]'::jsonb) ? (v_modifier->>'id') THEN
          v_effect := CASE v_modifier->>'kind'
            WHEN 'resistance' THEN jsonb_build_object(
              'kind', 'resistance', 'damageType', v_modifier->>'damage_type'
            )
            WHEN 'advantage' THEN jsonb_strip_nulls(jsonb_build_object(
              'kind', 'advantage', 'rollType', v_modifier->>'roll_type',
              'condition', v_modifier->>'condition'
            ))
            WHEN 'proficiency' THEN jsonb_build_object(
              'kind', 'proficiency',
              'proficiencyType', v_modifier->>'proficiency_type',
              'target', v_modifier->>'target'
            )
            WHEN 'expertise' THEN jsonb_build_object(
              'kind', 'expertise', 'skill', v_modifier->>'skill'
            )
            WHEN 'save-proficiency' THEN jsonb_build_object(
              'kind', 'save_proficiency', 'ability', v_modifier->>'ability'
            )
            ELSE NULL
          END;
          IF v_effect IS NOT NULL THEN
            v_modifiers := v_modifiers || jsonb_build_array(v_effect);
          END IF;
        END IF;
      END LOOP;

      v_level := CASE WHEN v_entity ? 'level' THEN (v_entity->>'level')::int ELSE 1 END;
      v_action_type := CASE
        WHEN v_entity ? 'level' THEN v_entity->>'action_type'
        ELSE 'passive'
      END;
      v_recharge := CASE
        WHEN v_entity ? 'level' THEN v_entity->>'recharge'
        ELSE NULL
      END;

      INSERT INTO public.character_features (
        character_id, name, source, level_acquired, description,
        action_type, recharge, is_active, modifiers, homebrew_id,
        sovereign_definition_id, sovereign_entity_id, sovereign_projection_revision
      ) VALUES (
        p_character_id,
        v_entity->>'name',
        'Sovereign: ' || v_sovereign.name,
        v_level,
        v_entity->>'description',
        v_action_type,
        v_recharge,
        v_action_type <> 'passive',
        v_modifiers,
        NULL,
        v_sovereign.id,
        v_entity->>'id',
        v_projection_revision
      );
    END LOOP;
  ELSE
    IF jsonb_typeof(v_sovereign.abilities) <> 'array'
      OR jsonb_array_length(v_sovereign.abilities) <> 8
    THEN
      RAISE EXCEPTION 'SOVEREIGN_LEGACY_MILESTONES_INVALID' USING ERRCODE = '22023';
    END IF;

    FOR v_entity IN SELECT value FROM jsonb_array_elements(v_sovereign.abilities) LOOP
      v_action_type := app_private.normalize_sovereign_action_type(v_entity->>'action_type');
      v_recharge := app_private.normalize_sovereign_recharge(v_entity->>'recharge');
      INSERT INTO public.character_features (
        character_id, name, source, level_acquired, description,
        action_type, recharge, is_active, modifiers, homebrew_id,
        sovereign_definition_id, sovereign_entity_id, sovereign_projection_revision
      ) VALUES (
        p_character_id,
        v_entity->>'name',
        'Sovereign: ' || v_sovereign.name,
        (v_entity->>'level')::int,
        v_entity->>'description',
        v_action_type,
        v_recharge,
        COALESCE(v_action_type, 'passive') <> 'passive',
        '[]'::jsonb,
        NULL,
        v_sovereign.id,
        NULL,
        v_projection_revision
      );
    END LOOP;
  END IF;

  SELECT COALESCE(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
    'name', ability->>'name',
    'description', ability->>'description',
    'type', CASE
      WHEN v_sovereign.schema_version = 2 THEN ability->>'action_type'
      ELSE app_private.normalize_sovereign_action_type(ability->>'action_type')
    END,
    'level', (ability->>'level')::int,
    'isSignature', COALESCE((ability->>'is_capstone')::boolean, false),
    'originSources', CASE
      WHEN v_sovereign.schema_version = 2 THEN ability->'ancestry'
      ELSE ability->'origin_sources'
    END
  ))), '[]'::jsonb)
  INTO v_runtime_features
  FROM jsonb_array_elements(COALESCE(v_sovereign.abilities, '[]'::jsonb)) AS ability;

  v_runtime := jsonb_strip_nulls(jsonb_build_object(
    'storageSchemaVersion', 2,
    'definitionSchemaVersion', v_sovereign.schema_version,
    'definitionId', v_sovereign.definition_id,
    'projectionRevision', v_projection_revision,
    'sovereignId', v_sovereign.id,
    'sovereignName', v_sovereign.name,
    'isActive', true,
    'fusionTheme', v_sovereign.fusion_theme,
    'fusionStability', v_sovereign.fusion_stability,
    'powerMultiplier', v_sovereign.power_multiplier,
    'regent1Id', v_sovereign.regent_a_id,
    'regent2Id', v_sovereign.regent_b_id,
    'features', v_runtime_features,
    'traits', CASE WHEN v_sovereign.schema_version = 2
      THEN COALESCE(v_sovereign.definition->'traits', '[]'::jsonb) ELSE '[]'::jsonb END,
    'resources', CASE WHEN v_sovereign.schema_version = 2
      THEN COALESCE(v_sovereign.definition->'resources', '[]'::jsonb) ELSE '[]'::jsonb END,
    'modifiers', CASE WHEN v_sovereign.schema_version = 2
      THEN COALESCE(v_sovereign.definition->'modifiers', '[]'::jsonb) ELSE '[]'::jsonb END,
    'sovereignDefinition', v_sovereign.definition,
    'compatibility', v_sovereign.definition->'compatibility'
  ));

  UPDATE public.characters
  SET
    active_sovereign_id = v_sovereign.id,
    gemini_state = COALESCE(v_character.gemini_state, '{}'::jsonb) || v_runtime
  WHERE id = p_character_id;

  v_result := jsonb_build_object(
    'character_id', p_character_id,
    'sovereign_id', v_sovereign.id,
    'definition_schema_version', v_sovereign.schema_version,
    'definition_id', v_sovereign.definition_id,
    'projection_revision', v_projection_revision
  );

  INSERT INTO public.sovereign_attachment_operations (
    actor_id, operation_id, character_id, sovereign_id, result
  ) VALUES (
    v_actor, p_operation_id, p_character_id, p_sovereign_id, v_result
  );

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.guard_character_sovereign_attachment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_allowed BOOLEAN := current_setting('app.sovereign_attachment', true) = 'on';
BEGIN
  IF v_allowed THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    -- Imported characters cannot inherit another account's saved-definition ID.
    NEW.active_sovereign_id := NULL;
    IF jsonb_typeof(NEW.gemini_state) = 'object' AND NEW.gemini_state ? 'sovereignId' THEN
      NEW.gemini_state := (
        NEW.gemini_state
        - 'sovereignId'
        - 'definitionId'
        - 'projectionRevision'
        - 'features'
        - 'traits'
        - 'resources'
        - 'modifiers'
      ) || jsonb_build_object(
        'isActive', false,
        'sovereignImportDetached', true
      );
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.active_sovereign_id IS DISTINCT FROM OLD.active_sovereign_id THEN
    RAISE EXCEPTION 'SOVEREIGN_ATTACHMENT_RPC_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF COALESCE(NEW.gemini_state->>'sovereignId', '')
      IS DISTINCT FROM COALESCE(OLD.gemini_state->>'sovereignId', '')
    OR COALESCE(NEW.gemini_state->>'definitionId', '')
      IS DISTINCT FROM COALESCE(OLD.gemini_state->>'definitionId', '')
    OR COALESCE(NEW.gemini_state->>'projectionRevision', '')
      IS DISTINCT FROM COALESCE(OLD.gemini_state->>'projectionRevision', '')
  THEN
    RAISE EXCEPTION 'SOVEREIGN_RUNTIME_IDENTITY_RPC_REQUIRED' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

-- Existing attachments remain attached, but receive an explicit portable
-- definition snapshot before the guard is installed. Character JSON export
-- already carries gemini_state, so this versions Sovereign exports additively.
UPDATE public.characters AS character_row
SET gemini_state = COALESCE(character_row.gemini_state, '{}'::jsonb)
  || jsonb_strip_nulls(jsonb_build_object(
    'storageSchemaVersion', 2,
    'definitionSchemaVersion', sovereign_row.schema_version,
    'definitionId', sovereign_row.definition_id,
    'projectionRevision', sovereign_row.projection_revision,
    'sovereignDefinition', sovereign_row.definition
  ))
FROM public.saved_sovereigns AS sovereign_row
WHERE character_row.active_sovereign_id = sovereign_row.id;

-- The older compendium sovereign_id is not evidence of a saved-definition
-- attachment. Preserve it as an explicit compatibility reference only.
UPDATE public.characters AS character_row
SET gemini_state = COALESCE(character_row.gemini_state, '{}'::jsonb)
  || jsonb_build_object(
    'legacySovereignId', character_row.sovereign_id::text,
    'legacySovereignCompatibility', 'unmapped-compendium-reference'
  )
WHERE character_row.sovereign_id IS NOT NULL
  AND character_row.active_sovereign_id IS NULL;

DROP TRIGGER IF EXISTS guard_character_sovereign_attachment ON public.characters;
CREATE TRIGGER guard_character_sovereign_attachment
BEFORE INSERT OR UPDATE OF active_sovereign_id, gemini_state ON public.characters
FOR EACH ROW
EXECUTE FUNCTION app_private.guard_character_sovereign_attachment();

CREATE OR REPLACE FUNCTION app_private.guard_sovereign_feature_projection()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_allowed BOOLEAN := current_setting('app.sovereign_attachment', true) = 'on';
  v_source TEXT := CASE WHEN TG_OP = 'DELETE' THEN OLD.source ELSE NEW.source END;
  v_definition UUID := CASE
    WHEN TG_OP = 'DELETE' THEN OLD.sovereign_definition_id
    ELSE NEW.sovereign_definition_id
  END;
BEGIN
  IF v_allowed THEN
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
  END IF;

  IF v_source LIKE 'Sovereign:%' OR v_definition IS NOT NULL THEN
    -- Legacy character imports may carry rebuildable Sovereign projection rows.
    -- Drop those inserts rather than trusting them; the authoritative definition
    -- remains in gemini_state and attachment must be rebuilt through the RPC.
    IF TG_OP = 'INSERT' AND v_definition IS NULL THEN
      RETURN NULL;
    END IF;
    RAISE EXCEPTION 'SOVEREIGN_PROJECTION_RPC_REQUIRED' USING ERRCODE = '42501';
  END IF;

  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

DROP TRIGGER IF EXISTS guard_sovereign_feature_projection ON public.character_features;
CREATE TRIGGER guard_sovereign_feature_projection
BEFORE INSERT OR UPDATE OR DELETE ON public.character_features
FOR EACH ROW
EXECUTE FUNCTION app_private.guard_sovereign_feature_projection();

REVOKE ALL ON FUNCTION app_private.normalize_sovereign_action_type(TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.normalize_sovereign_recharge(TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.assert_sovereign_expression(JSONB)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.assert_sovereign_v2_definition(JSONB)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.sync_saved_sovereign_definition()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.guard_character_sovereign_attachment()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.guard_sovereign_feature_projection()
  FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.save_legacy_sovereign_definition(JSONB, TEXT, BOOLEAN)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_legacy_sovereign_definition(JSONB, TEXT, BOOLEAN)
  TO authenticated;

REVOKE EXECUTE ON FUNCTION public.save_sovereign_v2_definition(JSONB, TEXT, BOOLEAN)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_sovereign_v2_definition(JSONB, TEXT, BOOLEAN)
  TO authenticated;

REVOKE EXECUTE ON FUNCTION public.attach_saved_sovereign(UUID, UUID, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.attach_saved_sovereign(UUID, UUID, TEXT)
  TO authenticated;

COMMENT ON COLUMN public.saved_sovereigns.definition IS
  'Authoritative versioned Sovereign definition. Legacy rows are preserved as schema_version 1 compatibility envelopes.';
COMMENT ON COLUMN public.saved_sovereigns.definition_id IS
  'Stable v2 definition ID. NULL for legacy rows; never fabricated during migration.';
COMMENT ON COLUMN public.character_features.sovereign_entity_id IS
  'Stable v2 entity ID for a rebuildable Sovereign mechanics projection. NULL for legacy projection rows.';
COMMENT ON TABLE public.sovereign_attachment_operations IS
  'Durable actor-bound idempotency receipts for atomic Sovereign attachment.';

COMMIT;

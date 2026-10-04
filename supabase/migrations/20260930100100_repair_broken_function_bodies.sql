-- Repair function bodies that no longer matched the schema. PL/pgSQL only
-- resolves tables, columns, and functions when a statement runs, so each of
-- these failed at run time, not at migration time. plpgsql_check found them;
-- supabase/tests/function_body_integrity.sql now fails on any new one.
--
--   * Sovereign authority looked Jobs and Paths up in the retired
--     compendium_jobs / compendium_job_paths UUID rows, but characters and the
--     app use canonical slugs ("striker", "striker--phantom-step"). Saving any
--     real definition raised SOVEREIGN_V2_UNKNOWN_JOB, and attaching compared
--     text to uuid. Authority now uses app_private.canonical_sovereign_sources
--     (20260930100000), and saved rows store the slugs.
--   * update_character_xp: unqualified parameters collided with column names,
--     so every campaign XP award raised "column reference is ambiguous".
--   * Marketplace download / review / gift called user_has_marketplace_access,
--     and downloads wrote marketplace_downloads; 20260725000000 dropped both.
--   * get_accessible_sourcebooks read the sourcebook tables that
--     20260725000000 dropped with the rest of the entitlement layer. The app
--     is free; the client no longer calls it. It is removed along with the
--     three updated_at trigger functions of those dropped tables.
--   * capture_homebrew_version_snapshot (20260222000000) read columns
--     homebrew_content never had, so every homebrew edit or publish failed.
--     It is restored to the 20260216000000 snapshot design.
--   * The Regent guards shared by several tables read NEW.power_id on
--     technique and spell rows (and NEW.technique_id on power rows), so every
--     UPDATE of a Regent-granted power, technique, or catch-up spell failed.
--   * start_active_session wrote session_participants.is_dm, now is_warden.
--   * save_legacy_sovereign_definition could no longer create anything
--     (EXECUTE revoked and v2 required on insert) and is removed.
BEGIN;

-- ── Sovereign ids ───────────────────────────────────────────────────────────
-- saved_sovereigns is empty in every environment (validation rejected every
-- real definition), so the type change moves no data.
ALTER TABLE public.saved_sovereigns
  DROP CONSTRAINT IF EXISTS saved_sovereigns_job_id_fkey,
  DROP CONSTRAINT IF EXISTS saved_sovereigns_path_id_fkey;
ALTER TABLE public.saved_sovereigns
  ALTER COLUMN job_id TYPE TEXT USING job_id::text,
  ALTER COLUMN path_id TYPE TEXT USING path_id::text;
ALTER TABLE public.saved_sovereigns
  ALTER COLUMN job_id SET NOT NULL,
  ALTER COLUMN path_id SET NOT NULL;

COMMENT ON COLUMN public.saved_sovereigns.job_id IS
  'Canonical Job id (static compendium slug, same as characters.job_id).';
COMMENT ON COLUMN public.saved_sovereigns.path_id IS
  'Canonical Path id (static compendium slug, same as characters.path_id).';

CREATE OR REPLACE FUNCTION app_private.assert_sovereign_v2_definition(p_definition JSONB)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_levels INT[] := ARRAY[1,3,5,7,10,14,17,20];
  v_allowed_abilities TEXT[] := ARRAY['STR','AGI','VIT','INT','SENSE','PRE'];
  v_job_source TEXT;
  v_path_source TEXT;
  v_regent_a TEXT;
  v_regent_b TEXT;
  v_entries JSONB;
  v_modifier_owners JSONB;
  v_ability JSONB;
  v_entry JSONB;
  v_modifier JSONB;
  v_resource JSONB;
  v_reference TEXT;
  v_duplicate TEXT;
  v_source TEXT;
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

  IF NOT EXISTS (
    SELECT 1 FROM app_private.canonical_sovereign_sources AS source
    WHERE source.kind = 'job' AND source.canonical_id = v_job_source
  ) THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_UNKNOWN_JOB' USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM app_private.canonical_sovereign_sources AS source
    WHERE source.kind = 'path'
      AND source.canonical_id = v_path_source
      AND source.job_id = v_job_source
  ) THEN
    RAISE EXCEPTION 'SOVEREIGN_V2_UNKNOWN_PATH' USING ERRCODE = '22023';
  END IF;

  IF v_regent_a IS NULL OR v_regent_b IS NULL OR v_regent_a = v_regent_b
    OR (
      SELECT count(*) FROM app_private.canonical_sovereign_sources AS source
      WHERE source.kind = 'regent'
        AND source.canonical_id IN (v_regent_a, v_regent_b)
    ) <> 2
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

CREATE OR REPLACE FUNCTION app_private.sync_saved_sovereign_definition()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
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

    NEW.definition_id := NEW.definition->>'id';
    NEW.name := NEW.definition#>>'{identity,name}';
    NEW.title := NEW.definition#>>'{identity,title}';
    NEW.description := NEW.definition->>'description';
    NEW.fusion_theme := NEW.definition->>'fusion_theme';
    NEW.fusion_description := NEW.definition->>'combat_doctrine';
    NEW.fusion_method := NEW.definition#>>'{generation,generator}';
    NEW.power_multiplier := NULL;
    NEW.fusion_stability := NULL;
    NEW.job_id := NEW.definition#>>'{generation,source_ids,job}';
    NEW.path_id := NEW.definition#>>'{generation,source_ids,path}';
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
      'job_id', NEW.job_id,
      'path_id', NEW.path_id,
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

  -- The sync trigger re-derives every projected column from the definition.
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
    p_definition#>>'{generation,source_ids,job}',
    p_definition#>>'{generation,source_ids,path}',
    '[]'::jsonb
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

DROP FUNCTION IF EXISTS public.save_legacy_sovereign_definition(JSONB, TEXT, BOOLEAN);

-- ── Campaign XP awards ──────────────────────────────────────────────────────
-- The client passes named arguments (character_id, xp_amount, campaign_id,
-- reason), so the parameter names stay; references are qualified instead.
CREATE OR REPLACE FUNCTION public.update_character_xp(
  character_id UUID,
  xp_amount INTEGER,
  campaign_id UUID DEFAULT NULL,
  reason TEXT DEFAULT 'XP Reward'
)
RETURNS TABLE(success BOOLEAN, new_xp_total INTEGER, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_character_id UUID := update_character_xp.character_id;
  v_campaign_id UUID := update_character_xp.campaign_id;
  v_xp_amount INTEGER := update_character_xp.xp_amount;
  v_current_xp INTEGER;
  v_new_xp INTEGER;
  v_character_name TEXT;
  v_character_owner UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF v_xp_amount IS NULL OR v_xp_amount <= 0 THEN
    RETURN QUERY SELECT false, 0, 'XP amount must be positive'::TEXT;
    RETURN;
  END IF;

  SELECT
    character_row.experience,
    character_row.name,
    character_row.user_id
  INTO
    v_current_xp,
    v_character_name,
    v_character_owner
  FROM public.characters AS character_row
  WHERE character_row.id = v_character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 'Character not found'::TEXT;
    RETURN;
  END IF;

  IF v_campaign_id IS NULL THEN
    IF v_character_owner IS DISTINCT FROM v_actor THEN
      RAISE EXCEPTION 'Character ownership validation failed' USING ERRCODE = '42501';
    END IF;
  ELSE
    IF NOT public.is_campaign_system(v_campaign_id, v_actor) THEN
      RAISE EXCEPTION 'Only campaign Wardens can award XP' USING ERRCODE = '42501';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM public.campaign_members AS member_row
      WHERE member_row.campaign_id = v_campaign_id
        AND member_row.character_id = v_character_id
    ) AND NOT EXISTS (
      SELECT 1
      FROM public.campaign_member_characters AS link_row
      JOIN public.campaign_members AS member_row
        ON member_row.id = link_row.campaign_member_id
      WHERE member_row.campaign_id = v_campaign_id
        AND link_row.character_id = v_character_id
    ) AND NOT EXISTS (
      SELECT 1
      FROM public.campaign_character_shares AS share_row
      WHERE share_row.campaign_id = v_campaign_id
        AND share_row.character_id = v_character_id
    ) THEN
      RAISE EXCEPTION 'Target character is not linked to this campaign'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  v_new_xp := COALESCE(v_current_xp, 0) + v_xp_amount;

  UPDATE public.characters AS character_row
  SET experience = v_new_xp,
      updated_at = now()
  WHERE character_row.id = v_character_id;

  IF v_campaign_id IS NOT NULL THEN
    INSERT INTO public.campaign_session_logs (
      campaign_id,
      author_id,
      log_type,
      title,
      content,
      metadata,
      created_at
    )
    VALUES (
      v_campaign_id,
      v_actor,
      'reward',
      'XP Award',
      format('%s gained %s XP', v_character_name, v_xp_amount),
      jsonb_build_object(
        'character_id', v_character_id,
        'xp_amount', v_xp_amount,
        'previous_xp', v_current_xp,
        'new_xp', v_new_xp,
        'reason', update_character_xp.reason
      ),
      now()
    );
  END IF;

  RETURN QUERY SELECT
    true,
    v_new_xp,
    format('%s gained %s XP (Total: %s)', v_character_name, v_xp_amount, v_new_xp)::TEXT;
END;
$$;

-- ── Marketplace ─────────────────────────────────────────────────────────────
-- Access rule unchanged from the dropped helper (and mirrored by the client):
-- free items, the author, or a current entitlement such as a gift.
CREATE OR REPLACE FUNCTION app_private.marketplace_item_access(
  p_item_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.marketplace_items AS item
    WHERE item.id = p_item_id
      AND (
        item.price_type = 'free'
        OR item.author_id = p_user_id
        OR EXISTS (
          SELECT 1
          FROM public.user_marketplace_entitlements AS entitlement
          WHERE entitlement.item_id = p_item_id
            AND entitlement.user_id = p_user_id
            AND (entitlement.expires_at IS NULL OR entitlement.expires_at > now())
        )
      )
  );
$$;
REVOKE ALL ON FUNCTION app_private.marketplace_item_access(UUID, UUID)
  FROM PUBLIC, anon, authenticated;

-- One row per user and item keeps downloads_count a count of people.
CREATE TABLE IF NOT EXISTS app_private.marketplace_downloads (
  item_id UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (item_id, user_id)
);
CREATE INDEX IF NOT EXISTS marketplace_downloads_user_id_idx
  ON app_private.marketplace_downloads (user_id);
REVOKE ALL ON app_private.marketplace_downloads FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.record_marketplace_download_unchecked(
  p_item_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF p_user_id IS DISTINCT FROM auth.uid()
    AND NOT public.is_dm_or_admin(auth.uid())
  THEN
    RAISE EXCEPTION 'MARKETPLACE_USER_CONTEXT_FORBIDDEN';
  END IF;

  IF NOT app_private.marketplace_item_access(p_item_id, p_user_id) THEN
    RAISE EXCEPTION 'MARKETPLACE_ACCESS_DENIED';
  END IF;

  INSERT INTO app_private.marketplace_downloads (item_id, user_id)
  VALUES (p_item_id, p_user_id)
  ON CONFLICT (item_id, user_id) DO NOTHING;

  UPDATE public.marketplace_items
  SET downloads_count = (
    SELECT count(*)::integer
    FROM app_private.marketplace_downloads AS download
    WHERE download.item_id = p_item_id
  ),
  updated_at = now()
  WHERE id = p_item_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_marketplace_review_unchecked(
  p_item_id UUID,
  p_rating INTEGER,
  p_comment TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_review_id UUID;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF p_user_id IS DISTINCT FROM auth.uid()
    AND NOT public.is_dm_or_admin(auth.uid())
  THEN
    RAISE EXCEPTION 'MARKETPLACE_USER_CONTEXT_FORBIDDEN';
  END IF;

  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'INVALID_RATING';
  END IF;

  INSERT INTO public.marketplace_reviews (item_id, user_id, rating, comment, verified_purchase)
  VALUES (
    p_item_id,
    p_user_id,
    p_rating,
    p_comment,
    app_private.marketplace_item_access(p_item_id, p_user_id)
  )
  ON CONFLICT (item_id, user_id)
  DO UPDATE SET
    rating = EXCLUDED.rating,
    comment = EXCLUDED.comment,
    verified_purchase = EXCLUDED.verified_purchase,
    updated_at = now()
  RETURNING id INTO v_review_id;

  UPDATE public.marketplace_items AS item
  SET rating_avg = COALESCE(agg.avg_rating, 0),
      rating_count = COALESCE(agg.rating_count, 0),
      updated_at = now()
  FROM (
    SELECT review.item_id,
           AVG(review.rating)::numeric(3,2) AS avg_rating,
           COUNT(*)::integer AS rating_count
    FROM public.marketplace_reviews AS review
    WHERE review.item_id = p_item_id
    GROUP BY review.item_id
  ) AS agg
  WHERE item.id = p_item_id;

  RETURN v_review_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.gift_marketplace_item(
  p_item_id UUID,
  p_recipient_user_id UUID,
  p_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_giver UUID := auth.uid();
  v_is_bundle BOOLEAN;
  v_bundled UUID[];
  v_new_entitlement UUID;
  v_child UUID;
BEGIN
  IF v_giver IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED';
  END IF;

  IF p_recipient_user_id IS NULL OR p_recipient_user_id = v_giver THEN
    RAISE EXCEPTION 'INVALID_RECIPIENT';
  END IF;

  -- The giver must hold the item: free, their own listing, or an entitlement.
  IF NOT app_private.marketplace_item_access(p_item_id, v_giver) THEN
    RAISE EXCEPTION 'GIFT_NOT_ENTITLED';
  END IF;

  SELECT item.is_bundle, item.bundled_item_ids
    INTO v_is_bundle, v_bundled
    FROM public.marketplace_items AS item
    WHERE item.id = p_item_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'ITEM_NOT_FOUND';
  END IF;

  INSERT INTO public.user_marketplace_entitlements (
    user_id, item_id, gifted_by, gift_message
  )
  VALUES (
    p_recipient_user_id, p_item_id, v_giver, NULLIF(TRIM(p_message), '')
  )
  ON CONFLICT (user_id, item_id) DO NOTHING
  RETURNING id INTO v_new_entitlement;

  IF v_is_bundle AND v_bundled IS NOT NULL THEN
    FOREACH v_child IN ARRAY v_bundled LOOP
      INSERT INTO public.user_marketplace_entitlements (
        user_id, item_id, gifted_by, gift_message
      )
      VALUES (
        p_recipient_user_id, v_child, v_giver, NULLIF(TRIM(p_message), '')
      )
      ON CONFLICT (user_id, item_id) DO NOTHING;
    END LOOP;
  END IF;

  RETURN COALESCE(v_new_entitlement, p_item_id);
END;
$$;

-- ── Retired sourcebook entitlements ─────────────────────────────────────────
-- The three trigger functions belonged to the dropped tables and fire nowhere.
DROP FUNCTION IF EXISTS public.get_accessible_sourcebooks(UUID, UUID);
DROP FUNCTION IF EXISTS public.update_sourcebook_catalog_updated_at();
DROP FUNCTION IF EXISTS public.update_user_sourcebook_entitlements_updated_at();
DROP FUNCTION IF EXISTS public.update_campaign_sourcebook_shares_updated_at();

-- ── Homebrew version snapshots ──────────────────────────────────────────────
-- Restores the 20260216000000 design: snapshot the previous row before a
-- content change, bump the version, and keep publish state consistent.
-- SECURITY DEFINER because API roles cannot insert version rows directly.
CREATE OR REPLACE FUNCTION public.capture_homebrew_version_snapshot()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF (
      NEW.name IS DISTINCT FROM OLD.name
      OR NEW.description IS DISTINCT FROM OLD.description
      OR NEW.data IS DISTINCT FROM OLD.data
      OR NEW.status IS DISTINCT FROM OLD.status
      OR NEW.visibility_scope IS DISTINCT FROM OLD.visibility_scope
      OR NEW.is_public IS DISTINCT FROM OLD.is_public
      OR NEW.tags IS DISTINCT FROM OLD.tags
      OR NEW.source_book IS DISTINCT FROM OLD.source_book
      OR NEW.campaign_id IS DISTINCT FROM OLD.campaign_id
    ) THEN
      INSERT INTO public.homebrew_content_versions (
        homebrew_id,
        version_number,
        snapshot,
        created_by,
        change_note
      ) VALUES (
        OLD.id,
        COALESCE(OLD.version, 1),
        to_jsonb(OLD),
        COALESCE(auth.uid(), NEW.updated_by, OLD.user_id),
        format('Snapshot before version %s', COALESCE(OLD.version, 1) + 1)
      )
      ON CONFLICT (homebrew_id, version_number) DO NOTHING;

      NEW.version := COALESCE(OLD.version, 1) + 1;
    END IF;

    IF NEW.status = 'published' AND OLD.status IS DISTINCT FROM 'published' THEN
      NEW.published_at := COALESCE(NEW.published_at, now());
      IF NEW.visibility_scope = 'private' THEN
        NEW.visibility_scope := 'public';
      END IF;
    ELSIF NEW.status <> 'published' AND OLD.status = 'published' THEN
      NEW.published_at := NULL;
    END IF;

    NEW.is_public := (NEW.status = 'published' AND NEW.visibility_scope = 'public');
    NEW.updated_at := now();
    NEW.updated_by := COALESCE(auth.uid(), NEW.updated_by, OLD.updated_by, OLD.user_id);
  END IF;

  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.capture_homebrew_version_snapshot()
  FROM PUBLIC, anon, authenticated;

-- ── Regent guards ───────────────────────────────────────────────────────────
-- One function guards character_powers and character_techniques. Fields only
-- one of those tables has are read through to_jsonb() so the body is valid
-- for both; a direct NEW.power_id on a technique row fails at run time.
CREATE OR REPLACE FUNCTION app_private.guard_regent_ability_provenance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_is_power BOOLEAN;
  v_id_field TEXT;
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_kind TEXT;
  v_canonical_id TEXT;
  v_tier INTEGER;
  v_level INTEGER;
  v_allowed INTEGER;
  v_existing INTEGER;
BEGIN
  v_is_power := TG_TABLE_NAME = 'character_powers';
  v_id_field := CASE WHEN v_is_power THEN 'power_id' ELSE 'technique_id' END;

  IF TG_OP = 'UPDATE' AND OLD.acquisition_kind = 'regent' THEN
    IF NEW.character_id IS DISTINCT FROM OLD.character_id
       OR NEW.acquisition_kind IS DISTINCT FROM OLD.acquisition_kind
       OR NEW.regent_unlock_id IS DISTINCT FROM OLD.regent_unlock_id
       OR NEW.regent_id IS DISTINCT FROM OLD.regent_id
       OR NEW.canonical_source_id IS DISTINCT FROM OLD.canonical_source_id
       OR NEW.acquired_level IS DISTINCT FROM OLD.acquired_level
       OR NEW.source IS DISTINCT FROM OLD.source
       OR (to_jsonb(NEW)->>v_id_field) IS DISTINCT FROM (to_jsonb(OLD)->>v_id_field)
    THEN RAISE EXCEPTION 'REGENT_GRANT_IDENTITY_IMMUTABLE' USING ERRCODE = '42501'; END IF;
  END IF;

  IF NEW.acquisition_kind <> 'regent' THEN
    IF NEW.regent_unlock_id IS NOT NULL OR NEW.regent_id IS NOT NULL THEN
      RAISE EXCEPTION 'NONREGENT_GRANT_HAS_REGENT_AUTHORITY' USING ERRCODE = '22023';
    END IF;
    RETURN NEW;
  END IF;

  SELECT u.* INTO v_unlock FROM public.character_regent_unlocks u
  WHERE u.id = NEW.regent_unlock_id AND u.character_id = NEW.character_id
  FOR UPDATE;
  IF NOT FOUND OR v_unlock.regent_id IS DISTINCT FROM NEW.regent_id
     OR NEW.canonical_source_id IS DISTINCT FROM NEW.regent_id THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT level INTO v_level FROM public.characters WHERE id = NEW.character_id;
  IF NEW.acquired_level IS NULL THEN NEW.acquired_level := v_level; END IF;
  IF NEW.acquired_level > v_level THEN
    RAISE EXCEPTION 'REGENT_GRANT_FUTURE_LEVEL' USING ERRCODE = '22023';
  END IF;

  v_canonical_id := to_jsonb(NEW)->>v_id_field;
  IF v_is_power THEN
    v_kind := 'powers';
    v_tier := (to_jsonb(NEW)->>'power_level')::integer;
  ELSE
    v_kind := 'techniques';
  END IF;
  PERFORM 1 FROM app_private.regent_canonical_pick_options o
  WHERE o.kind = v_kind AND o.canonical_id = v_canonical_id
    AND o.tier BETWEEN 5 AND 9
    AND (v_tier IS NULL OR o.tier = v_tier);
  IF NOT FOUND THEN RAISE EXCEPTION 'INVALID_REGENT_ABILITY_TIER' USING ERRCODE = '22023'; END IF;
  IF v_unlock.caught_up_at_level IS NULL THEN
    PERFORM 1 FROM public.regent_catch_up_options o
    WHERE o.unlock_id = v_unlock.id AND o.kind = v_kind
      AND o.canonical_id = v_canonical_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'REGENT_PICK_NOT_WARDEN_APPROVED' USING ERRCODE = '42501';
    END IF;
  END IF;
  SELECT CASE WHEN v_kind = 'powers' THEN r.powers ELSE r.techniques END
    INTO v_allowed
  FROM app_private.regent_catch_up_requirements r
  WHERE r.regent_id = v_unlock.regent_id AND r.character_level = v_level;
  IF v_allowed IS NULL OR v_allowed = 0 THEN
    RAISE EXCEPTION 'REGENT_ABILITY_CATEGORY_NOT_AVAILABLE' USING ERRCODE = '22023';
  END IF;
  IF TG_OP = 'INSERT' THEN
    IF v_is_power THEN
      SELECT count(*) INTO v_existing FROM public.character_powers p
      WHERE p.regent_unlock_id = v_unlock.id AND p.acquisition_kind = 'regent';
      IF EXISTS (SELECT 1 FROM public.character_powers p
        WHERE p.regent_unlock_id = v_unlock.id AND p.power_id = v_canonical_id) THEN
        RAISE EXCEPTION 'REGENT_DUPLICATE_SOURCE_GRANT' USING ERRCODE = '23505';
      END IF;
    ELSE
      SELECT count(*) INTO v_existing FROM public.character_techniques t
      WHERE t.regent_unlock_id = v_unlock.id AND t.acquisition_kind = 'regent';
      IF EXISTS (SELECT 1 FROM public.character_techniques t
        WHERE t.regent_unlock_id = v_unlock.id AND t.technique_id = v_canonical_id) THEN
        RAISE EXCEPTION 'REGENT_DUPLICATE_SOURCE_GRANT' USING ERRCODE = '23505';
      END IF;
    END IF;
    IF v_existing >= v_allowed THEN
      RAISE EXCEPTION 'REGENT_KNOWN_COUNT_REACHED' USING ERRCODE = '23514';
    END IF;
  END IF;
  -- Regent abilities use shared Resonance, never the native charge counter.
  NEW.uses_max := NULL; NEW.uses_current := NULL; NEW.recharge := NULL;
  RETURN NEW;
END;
$$;

-- Catch-up Powers and Techniques are guarded above (20260927020100 moved them);
-- this guard now fires only on character_spells.
CREATE OR REPLACE FUNCTION app_private.guard_regent_catch_up_pick()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_kind TEXT;
  v_unlock_id UUID;
  v_expected_tier INTEGER;
BEGIN
  IF TG_TABLE_NAME <> 'character_spells' THEN
    RAISE EXCEPTION 'guard_regent_catch_up_pick only guards character_spells'
      USING ERRCODE = '0A000';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.source LIKE '% Attunement (Catch-Up)' THEN
    IF NEW.character_id IS DISTINCT FROM OLD.character_id
       OR NEW.source IS DISTINCT FROM OLD.source THEN
      RAISE EXCEPTION 'REGENT_CATCH_UP_PICK_IDENTITY_IMMUTABLE' USING ERRCODE = '42501';
    END IF;
    IF NEW.spell_id IS NOT DISTINCT FROM OLD.spell_id
       AND NEW.spell_level IS NOT DISTINCT FROM OLD.spell_level THEN
      RETURN NEW;
    END IF;
  END IF;
  IF NEW.source IS NULL OR NEW.source NOT LIKE '% Attunement (Catch-Up)' THEN RETURN NEW; END IF;
  v_kind := CASE WHEN NEW.spell_level = 0 THEN 'cantrips' ELSE 'spells' END;
  SELECT u.id INTO v_unlock_id
  FROM public.character_regent_unlocks AS u
  JOIN app_private.regent_catch_up_requirements AS r ON r.regent_id = u.regent_id
  WHERE u.character_id = NEW.character_id
    AND r.character_level = (SELECT c.level FROM public.characters AS c WHERE c.id = NEW.character_id)
    AND NEW.source = r.regent_name || ' Attunement (Catch-Up)'
    AND u.caught_up_at_level IS NULL;
  IF v_unlock_id IS NULL THEN
    RAISE EXCEPTION 'REGENT_CATCH_UP_UNLOCK_REQUIRED' USING ERRCODE = '42501';
  END IF;
  SELECT catalog.tier INTO v_expected_tier
  FROM public.regent_catch_up_options AS option_row
  JOIN app_private.regent_canonical_pick_options AS catalog
    ON catalog.kind = option_row.kind AND catalog.canonical_id = option_row.canonical_id
  WHERE option_row.unlock_id = v_unlock_id
    AND option_row.kind = v_kind AND option_row.canonical_id = NEW.spell_id;
  IF NOT FOUND OR (NEW.spell_level IS NOT NULL AND NEW.spell_level <> v_expected_tier) THEN
    RAISE EXCEPTION 'REGENT_PICK_NOT_WARDEN_APPROVED' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

-- ── Retired session RPCs (still revoked from API roles) ─────────────────────
CREATE OR REPLACE FUNCTION public.start_active_session(
  p_campaign_id UUID,
  p_title TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_session_id UUID;
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.campaigns WHERE id = p_campaign_id AND warden_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Only DM can start active sessions';
  END IF;
  INSERT INTO public.active_sessions (
    campaign_id, title, description, status, created_by
  ) VALUES (
    p_campaign_id, p_title, p_description, 'active', v_user_id
  ) RETURNING id INTO v_session_id;
  INSERT INTO public.session_participants (session_id, user_id, is_warden)
  VALUES (v_session_id, v_user_id, TRUE);
  RETURN v_session_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.join_campaign_by_id(
  p_campaign_id UUID,
  p_character_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_member_id UUID;
  v_character_owner UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT public.is_campaign_active(p_campaign_id) THEN
    RAISE EXCEPTION 'Campaign inactive';
  END IF;

  IF p_character_id IS NOT NULL THEN
    SELECT c.user_id INTO v_character_owner
    FROM public.characters c
    WHERE c.id = p_character_id;

    IF v_character_owner IS NULL OR v_character_owner <> auth.uid() THEN
      RAISE EXCEPTION 'Character ownership validation failed';
    END IF;
  END IF;

  SELECT member_row.id
  INTO v_member_id
  FROM public.campaign_members member_row
  WHERE member_row.campaign_id = p_campaign_id
    AND member_row.user_id = auth.uid();

  IF v_member_id IS NULL THEN
    INSERT INTO public.campaign_members (campaign_id, user_id, character_id, role)
    VALUES (p_campaign_id, auth.uid(), p_character_id, 'ascendant')
    ON CONFLICT (campaign_id, user_id)
    DO UPDATE SET character_id = COALESCE(public.campaign_members.character_id, EXCLUDED.character_id)
    RETURNING campaign_members.id INTO v_member_id;
  END IF;

  IF p_character_id IS NOT NULL THEN
    PERFORM public.attach_campaign_member_character(p_campaign_id, v_member_id, p_character_id);
  END IF;

  RETURN p_campaign_id;
END;
$$;

COMMIT;

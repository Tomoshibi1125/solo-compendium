-- RA-9 (docs/canon/rift-ascendant-canon-locks.md): a tamed creature belongs to
-- the character who holds it. The campaign tamed roster and the per-character
-- tamed-anomaly table are retired. Each living creature moves onto a
-- character's companion sheet (character_extras) and keeps its companion
-- instance id, so combat, bond, and attempt history still point at it.
--
-- A campaign creature goes to its primary handler, else its current
-- controller, else its tamer. A creature with none of them stays behind as
-- campaign history and is reported. The old rows remain as read-only history.
BEGIN;

-- ---------------------------------------------------------------------------
-- History rows no longer own or steer the creature they recorded
-- ---------------------------------------------------------------------------

-- A history row can outlive its creature (for example, when the owning
-- character is deleted); it must never block that deletion. The check is
-- deferred because one character delete can first clear a history row's
-- handler or controller and only then delete the creature it names.
ALTER TABLE public.campaign_tamed_anomalies
  ALTER COLUMN companion_instance_id DROP NOT NULL,
  ALTER COLUMN companion_instance_id DROP DEFAULT;
ALTER TABLE public.campaign_tamed_anomalies
  DROP CONSTRAINT IF EXISTS campaign_tamed_anomalies_companion_instance_id_fkey,
  ADD CONSTRAINT campaign_tamed_anomalies_companion_instance_id_fkey
    FOREIGN KEY (companion_instance_id)
    REFERENCES public.companion_instances(id) ON DELETE SET NULL
    DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public.character_tamed_anomalies
  ALTER COLUMN companion_instance_id DROP NOT NULL,
  ALTER COLUMN companion_instance_id DROP DEFAULT;
ALTER TABLE public.character_tamed_anomalies
  DROP CONSTRAINT IF EXISTS character_tamed_anomalies_companion_instance_id_fkey,
  ADD CONSTRAINT character_tamed_anomalies_companion_instance_id_fkey
    FOREIGN KEY (companion_instance_id)
    REFERENCES public.companion_instances(id) ON DELETE SET NULL
    DEFERRABLE INITIALLY DEFERRED;

-- These triggers pushed roster edits (handler, controller, HP, conditions)
-- into the living instance, or built instances for new roster rows.
DROP TRIGGER IF EXISTS ensure_campaign_tamed_companion_instance ON public.campaign_tamed_anomalies;
DROP TRIGGER IF EXISTS guard_campaign_tamed_companion_mapping ON public.campaign_tamed_anomalies;
DROP TRIGGER IF EXISTS sync_campaign_tamed_companion_relationships ON public.campaign_tamed_anomalies;
DROP TRIGGER IF EXISTS campaign_tamed_c3_state_sync ON public.campaign_tamed_anomalies;
DROP TRIGGER IF EXISTS ensure_character_tamed_companion_instance ON public.character_tamed_anomalies;
DROP TRIGGER IF EXISTS guard_character_tamed_companion_mapping ON public.character_tamed_anomalies;
DROP TRIGGER IF EXISTS character_tamed_c3_state_sync ON public.character_tamed_anomalies;
DROP FUNCTION IF EXISTS app_private.ensure_campaign_tamed_companion_instance();
DROP FUNCTION IF EXISTS app_private.ensure_character_tamed_companion_instance();
DROP FUNCTION IF EXISTS app_private.sync_campaign_tamed_companion_relationships();

-- Removing a sheet row retires or deletes its creature. A retired roster row
-- is history: removing it never touches the creature it recorded.
CREATE OR REPLACE FUNCTION app_private.cleanup_companion_instance_reference()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_instance public.companion_instances%ROWTYPE;
BEGIN
  IF OLD.companion_instance_id IS NULL THEN RETURN NULL; END IF;
  SELECT * INTO v_instance FROM public.companion_instances AS instance
  WHERE instance.id = OLD.companion_instance_id;
  IF NOT FOUND THEN RETURN NULL; END IF;

  IF TG_TABLE_NAME IN ('campaign_tamed_anomalies', 'character_tamed_anomalies')
     AND (v_instance.origin_table IS DISTINCT FROM TG_TABLE_NAME
          OR v_instance.origin_row_id IS DISTINCT FROM OLD.id) THEN
    RETURN NULL;
  END IF;

  -- Another sheet projection (a mount's companion and vehicle rows) keeps it.
  IF EXISTS (SELECT 1 FROM public.character_extras WHERE companion_instance_id = v_instance.id)
     OR EXISTS (SELECT 1 FROM public.character_vehicles WHERE companion_instance_id = v_instance.id)
  THEN
    RETURN NULL;
  END IF;

  -- Bond, attempt, control, and roster history keep a retired identity.
  IF EXISTS (SELECT 1 FROM public.companion_bond_attempts WHERE companion_instance_id = v_instance.id)
     OR EXISTS (SELECT 1 FROM public.companion_bonds WHERE companion_instance_id = v_instance.id)
     OR EXISTS (SELECT 1 FROM public.companion_control_events WHERE companion_instance_id = v_instance.id)
     OR EXISTS (SELECT 1 FROM public.campaign_tamed_anomalies WHERE companion_instance_id = v_instance.id)
     OR EXISTS (SELECT 1 FROM public.character_tamed_anomalies WHERE companion_instance_id = v_instance.id)
  THEN
    UPDATE public.companion_bonds
    SET released_at = COALESCE(released_at, now()),
        release_reason = COALESCE(release_reason, 'companion-removed')
    WHERE companion_instance_id = v_instance.id AND released_at IS NULL;
    UPDATE public.companion_instances
    SET lifecycle_status = 'retired', retired_at = COALESCE(retired_at, now()),
        primary_handler_character_id = NULL,
        combat_controller_character_id = NULL,
        rider_character_id = NULL,
        updated_at = now()
    WHERE id = v_instance.id;
  ELSE
    DELETE FROM public.companion_instances WHERE id = v_instance.id;
  END IF;
  RETURN NULL;
END;
$$;

-- Nothing adds to the retired rosters.
CREATE OR REPLACE FUNCTION app_private.reject_retired_tamed_roster_insert()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
BEGIN
  RAISE EXCEPTION 'TAMED_ROSTER_RETIRED' USING ERRCODE = '0A000',
    HINT = 'Add the creature to a character sheet as a companion.';
END;
$$;

DROP TRIGGER IF EXISTS retired_tamed_roster_insert ON public.campaign_tamed_anomalies;
CREATE TRIGGER retired_tamed_roster_insert
  BEFORE INSERT ON public.campaign_tamed_anomalies
  FOR EACH ROW EXECUTE FUNCTION app_private.reject_retired_tamed_roster_insert();
DROP TRIGGER IF EXISTS retired_tamed_roster_insert ON public.character_tamed_anomalies;
CREATE TRIGGER retired_tamed_roster_insert
  BEFORE INSERT ON public.character_tamed_anomalies
  FOR EACH ROW EXECUTE FUNCTION app_private.reject_retired_tamed_roster_insert();

-- Clients read history; they no longer write it.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.campaign_tamed_anomalies FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.character_tamed_anomalies FROM anon, authenticated;

-- The roster, tame, bond, and retry-adjudication RPCs are retired.
REVOKE EXECUTE ON FUNCTION public.claim_anomaly_controller(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.release_anomaly_controller(UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_campaign_tamed_hp(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.remove_campaign_tamed_anomaly(UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.resolve_companion_tame_attempt_c2(
  UUID, UUID, TEXT, JSONB, INTEGER, INTEGER, UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.resolve_companion_bond_attempt_c2(
  UUID, UUID, UUID, TEXT, INTEGER, INTEGER, UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prepare_companion_attempt_adjudication(
  UUID, UUID, TEXT, TEXT, UUID, TEXT, TEXT, TEXT, UUID, TEXT) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Move every roster creature onto a character sheet
-- ---------------------------------------------------------------------------

-- A snapshot is usable when it is a complete canonical envelope for this species.
CREATE OR REPLACE FUNCTION app_private.canonical_anomaly_snapshot_or_null(
  p_snapshot JSONB, p_anomaly_id TEXT
)
RETURNS JSONB LANGUAGE sql IMMUTABLE SET search_path = pg_catalog AS $$
  SELECT CASE WHEN jsonb_typeof(p_snapshot) = 'object'
      AND p_snapshot->>'kind' = 'canonical-compendium'
      AND p_snapshot->'version' = '1'::jsonb
      AND p_snapshot#>>'{provenance,canonicalType}' = 'anomaly'
      AND p_snapshot#>>'{provenance,canonicalCollection}' = 'anomalies'
      AND p_snapshot#>>'{provenance,canonicalId}' = p_anomaly_id
      AND jsonb_typeof(p_snapshot#>'{sourceFields,name}') = 'string'
      AND jsonb_typeof(p_snapshot#>'{sourceFields,hpMax}') = 'number'
      AND jsonb_typeof(p_snapshot#>'{sourceFields,baseAc}') = 'number'
      AND jsonb_typeof(p_snapshot#>'{sourceFields,speed}') = 'number'
    THEN p_snapshot END;
$$;

-- Re-runnable: a row is converted only while it is still its creature's origin.
-- Returns what moved, which campaign rows had no one to move to, and failures.
CREATE OR REPLACE FUNCTION app_private.retire_tamed_companion_rosters()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public SET row_security = off AS $$
DECLARE
  v_prior_sync TEXT := COALESCE(current_setting('app.companion_c3_origin_sync', true), '');
  v_row RECORD;
  v_instance public.companion_instances%ROWTYPE;
  v_extra_id UUID;
  v_snapshot JSONB;
  v_revision TEXT;
  v_campaign_moved INTEGER := 0;
  v_character_moved INTEGER := 0;
  v_unassigned UUID[] := ARRAY[]::UUID[];
  v_failures JSONB := '[]'::jsonb;
BEGIN
  -- The creature's durable combat state is already current; its new sheet row
  -- must not echo it back and advance the combat state version.
  PERFORM set_config('app.companion_c3_origin_sync', 'on', true);

  FOR v_row IN
    SELECT 'campaign_tamed_anomalies'::TEXT AS origin, tamed.id, tamed.anomaly_id,
      tamed.nickname, tamed.current_hp, tamed.max_hp_override, tamed.conditions,
      tamed.notes, tamed.initiative, tamed.is_summoned, tamed.companion_source_snapshot,
      tamed.companion_instance_id,
      COALESCE(tamed.primary_handler_character_id, tamed.current_controller_character_id,
               tamed.tamed_by_character_id) AS target_character_id
    FROM public.campaign_tamed_anomalies AS tamed
    JOIN public.companion_instances AS instance ON instance.id = tamed.companion_instance_id
    WHERE instance.origin_table = 'campaign_tamed_anomalies'
      AND instance.origin_row_id = tamed.id
      AND instance.lifecycle_status = 'active'
    UNION ALL
    SELECT 'character_tamed_anomalies'::TEXT, tamed.id, tamed.anomaly_id,
      tamed.nickname, tamed.current_hp, tamed.max_hp_override, tamed.conditions,
      tamed.notes, tamed.initiative, tamed.is_summoned, tamed.companion_source_snapshot,
      tamed.companion_instance_id, tamed.character_id
    FROM public.character_tamed_anomalies AS tamed
    JOIN public.companion_instances AS instance ON instance.id = tamed.companion_instance_id
    WHERE instance.origin_table = 'character_tamed_anomalies'
      AND instance.origin_row_id = tamed.id
      AND instance.lifecycle_status = 'active'
    ORDER BY origin, id
  LOOP
    IF v_row.target_character_id IS NULL THEN
      v_unassigned := v_unassigned || v_row.id;
      CONTINUE;
    END IF;

    BEGIN
      SELECT * INTO v_instance FROM public.companion_instances AS instance
      WHERE instance.id = v_row.companion_instance_id FOR UPDATE;

      -- The frozen acquisition snapshot wins, then the server catalog, then
      -- the roster row's own fields.
      v_snapshot := COALESCE(
        app_private.canonical_anomaly_snapshot_or_null(v_row.companion_source_snapshot, v_row.anomaly_id),
        app_private.canonical_anomaly_snapshot_or_null(v_instance.source_snapshot, v_row.anomaly_id));
      v_revision := 'canonical-snapshot-v1';
      IF v_snapshot IS NULL THEN
        SELECT source.snapshot, source.source_revision INTO v_snapshot, v_revision
        FROM app_private.canonical_companion_sources AS source
        WHERE source.source_collection = 'anomalies' AND source.source_id = v_row.anomaly_id;
      END IF;
      IF v_snapshot IS NULL THEN
        v_snapshot := jsonb_build_object(
          'kind', 'canonical-compendium', 'version', 1,
          'provenance', jsonb_build_object(
            'canonicalId', v_row.anomaly_id, 'canonicalType', 'anomaly',
            'canonicalCollection', 'anomalies', 'entryType', 'anomaly',
            'source', NULL, 'sourceBook', NULL),
          'sourceFields', jsonb_build_object(
            'name', COALESCE(NULLIF(btrim(v_row.nickname), ''), v_row.anomaly_id),
            'hpMax', GREATEST(1, COALESCE(v_row.max_hp_override, v_row.current_hp, 1)),
            'baseAc', 10, 'speed', 30, 'rank', NULL));
        v_revision := 'retired-tamed-roster-v1';
      END IF;
      IF v_snapshot = v_instance.source_snapshot THEN
        v_revision := v_instance.source_revision;
      END IF;

      -- Re-point the creature first: the sheet insert keeps a supplied
      -- instance id only when that character already owns it.
      v_extra_id := gen_random_uuid();
      UPDATE public.companion_instances AS instance
      SET owner_scope = 'character',
          owner_character_id = v_row.target_character_id,
          owner_campaign_id = NULL,
          primary_handler_character_id = v_row.target_character_id,
          combat_controller_character_id = v_row.target_character_id,
          identity_kind = 'companion',
          source_policy = 'snapshot',
          source_revision = v_revision,
          source_snapshot = v_snapshot,
          origin_table = 'character_extras',
          origin_row_id = v_extra_id,
          updated_at = now()
      WHERE instance.id = v_row.companion_instance_id
      RETURNING * INTO v_instance;

      -- HP follows the creature's durable combat state; the sheet trigger
      -- sets the scaled maximum and clamps current HP to it.
      INSERT INTO public.character_extras (
        id, character_id, companion_instance_id, extra_type, name,
        hp_current, hp_max, ac, speed, npc_data,
        abilities, equipment, conditions, initiative, notes, is_active
      ) VALUES (
        v_extra_id, v_row.target_character_id, v_row.companion_instance_id, 'companion',
        COALESCE(NULLIF(btrim(v_row.nickname), ''), v_snapshot#>>'{sourceFields,name}', v_row.anomaly_id),
        GREATEST(0, floor(COALESCE(
          app_private.companion_c3_number(v_instance.combat_state->'hp'), v_row.current_hp, 0)))::INTEGER,
        GREATEST(0, floor(COALESCE(app_private.companion_c3_max_hp(v_instance), 1)))::INTEGER,
        floor(COALESCE(app_private.companion_c3_ac(v_instance), 10))::INTEGER,
        GREATEST(0, floor(COALESCE(
          app_private.companion_c3_number(v_snapshot#>'{sourceFields,speed}'), 30)))::INTEGER,
        v_snapshot,
        '[]'::jsonb, '[]'::jsonb,
        app_private.companion_c3_array(COALESCE(v_instance.combat_state->'conditions', v_row.conditions)),
        v_row.initiative, v_row.notes, COALESCE(v_row.is_summoned, false)
      );

      IF v_row.origin = 'campaign_tamed_anomalies' THEN
        v_campaign_moved := v_campaign_moved + 1;
      ELSE
        v_character_moved := v_character_moved + 1;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      -- The row stays as it was; the report names it for follow-up.
      v_failures := v_failures || jsonb_build_object(
        'table', v_row.origin, 'id', v_row.id, 'error', SQLERRM);
    END;
  END LOOP;

  PERFORM set_config('app.companion_c3_origin_sync', v_prior_sync, true);
  RETURN jsonb_build_object(
    'campaignMoved', v_campaign_moved,
    'characterMoved', v_character_moved,
    'unassigned', cardinality(v_unassigned),
    'unassignedRowIds', to_jsonb(v_unassigned),
    'failed', jsonb_array_length(v_failures),
    'failures', v_failures);
END;
$$;

REVOKE ALL ON FUNCTION app_private.cleanup_companion_instance_reference() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.reject_retired_tamed_roster_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.canonical_anomaly_snapshot_or_null(JSONB, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.retire_tamed_companion_rosters() FROM PUBLIC, anon, authenticated;

DO $$
DECLARE
  v_report JSONB := app_private.retire_tamed_companion_rosters();
BEGIN
  RAISE NOTICE 'Tamed rosters retired: % campaign and % personal creatures moved to character sheets.',
    v_report->>'campaignMoved', v_report->>'characterMoved';
  IF (v_report->>'unassigned')::INTEGER > 0 THEN
    RAISE WARNING '% campaign roster creature(s) have no handler, controller, or tamer and stay as campaign history: %',
      v_report->>'unassigned', v_report->'unassignedRowIds';
  END IF;
  IF (v_report->>'failed')::INTEGER > 0 THEN
    RAISE WARNING '% roster creature(s) could not move and stay as history: %',
      v_report->>'failed', v_report->'failures';
  END IF;
END;
$$;

COMMIT;
NOTIFY pgrst, 'reload schema';

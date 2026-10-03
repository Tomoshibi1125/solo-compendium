-- Use server-owned canonical source rows for tame DCs/stats and living mount identity.
BEGIN;

CREATE OR REPLACE FUNCTION public.resolve_companion_tame_attempt_c2(
  p_campaign_id UUID,
  p_character_id UUID,
  p_anomaly_id TEXT,
  p_source_snapshot JSONB,
  p_roll_primary INTEGER,
  p_roll_secondary INTEGER DEFAULT NULL,
  p_adjudication_id UUID DEFAULT NULL,
  p_nickname TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_latest public.companion_bond_attempts%ROWTYPE;
  v_adjudication public.companion_attempt_adjudications%ROWTYPE;
  v_canonical_snapshot JSONB;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'NOT_OWNER' USING ERRCODE = '42501';
  END IF;

  IF NOT app_private.companion_character_in_campaign(
    p_campaign_id,
    p_character_id
  ) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN' USING ERRCODE = '42501';
  END IF;

  SELECT source.snapshot INTO v_canonical_snapshot
  FROM app_private.canonical_companion_sources AS source
  WHERE source.source_collection = 'anomalies'
    AND source.source_id = p_anomaly_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CANONICAL_ANOMALY_NOT_FOUND' USING ERRCODE = '22023';
  END IF;
  IF p_source_snapshot IS NOT NULL
    AND p_source_snapshot#>>'{provenance,canonicalId}' IS DISTINCT FROM p_anomaly_id
  THEN
    RAISE EXCEPTION 'CANONICAL_SOURCE_ID_MISMATCH' USING ERRCODE = '22023';
  END IF;

  -- Only the most recent attempt for this character/source governs whether a
  -- retry gate is active. A prior success closes the old failure chain and
  -- permits a later attempt to represent a different creature of the same
  -- canonical species.
  SELECT * INTO v_latest
  FROM public.companion_bond_attempts AS attempt
  WHERE attempt.campaign_id = p_campaign_id
    AND attempt.character_id = p_character_id
    AND attempt.target_source_id = p_anomaly_id
    AND attempt.attempt_kind = 'tame'
  ORDER BY attempt.created_at DESC, attempt.id DESC
  LIMIT 1;

  IF FOUND AND v_latest.outcome IN ('failure', 'invalid') THEN
    IF p_adjudication_id IS NULL THEN
      RETURN jsonb_build_object(
        'valid', false,
        'success', NULL,
        'outcome', 'invalid',
        'reason', 'RETRY_ADJUDICATION_REQUIRED',
        'retry_of_attempt_id', v_latest.id,
        'attempt_chain_id', v_latest.attempt_chain_id,
        'companion_instance_id', NULL,
        'tamed_id', NULL,
        'roll_mode', 'normal'
      );
    END IF;

    SELECT * INTO v_adjudication
    FROM public.companion_attempt_adjudications AS adjudication
    WHERE adjudication.id = p_adjudication_id
    FOR UPDATE;

    IF NOT FOUND
       OR v_adjudication.consumed_at IS NOT NULL
       OR v_adjudication.campaign_id IS DISTINCT FROM p_campaign_id
       OR v_adjudication.character_id IS DISTINCT FROM p_character_id
       OR v_adjudication.target_source_id IS DISTINCT FROM p_anomaly_id
       OR v_adjudication.attempt_kind <> 'tame'
       OR v_adjudication.companion_instance_id IS NOT NULL
       OR v_adjudication.retry_of_attempt_id IS DISTINCT FROM v_latest.id THEN
      RAISE EXCEPTION 'RETRY_ADJUDICATION_REQUIRED' USING ERRCODE = '22023';
    END IF;
  END IF;

  RETURN public.resolve_companion_tame_attempt_c2_unchecked(
    p_campaign_id,
    p_character_id,
    p_anomaly_id,
    v_canonical_snapshot,
    p_roll_primary,
    p_roll_secondary,
    p_adjudication_id,
    p_nickname
  );
END;
$$;


CREATE OR REPLACE FUNCTION public.register_character_vehicle_mount(
  p_vehicle_link_id UUID,
  p_source_snapshot JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_vehicle public.character_vehicles%ROWTYPE;
  v_owner UUID;
  v_instance UUID;
  v_canonical_snapshot JSONB;
  v_source_revision TEXT;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT vehicle_row.* INTO v_vehicle
  FROM public.character_vehicles AS vehicle_row
  WHERE vehicle_row.id = p_vehicle_link_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'VEHICLE_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT character_row.user_id INTO v_owner
  FROM public.characters AS character_row
  WHERE character_row.id = v_vehicle.character_id
  FOR UPDATE;
  IF v_owner IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT source.snapshot, source.source_revision
  INTO v_canonical_snapshot, v_source_revision
  FROM app_private.canonical_companion_sources AS source
  WHERE source.source_collection = 'vehicles'
    AND source.source_id = v_vehicle.vehicle_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CANONICAL_LIVING_MOUNT_NOT_FOUND' USING ERRCODE = '22023';
  END IF;
  IF p_source_snapshot IS NOT NULL
    AND p_source_snapshot#>>'{provenance,canonicalId}' IS DISTINCT FROM v_vehicle.vehicle_id
  THEN
    RAISE EXCEPTION 'CANONICAL_SOURCE_ID_MISMATCH' USING ERRCODE = '22023';
  END IF;

  IF v_vehicle.companion_instance_id IS NOT NULL THEN
    -- Exact retry: keep the original identity but ensure the row also carries
    -- the frozen snapshot needed by portable character export/import.
    PERFORM set_config('app.companion_mapping_write', 'on', true);
    UPDATE public.character_vehicles
    SET companion_source_snapshot = COALESCE(companion_source_snapshot, v_canonical_snapshot)
    WHERE id = v_vehicle.id;
    RETURN v_vehicle.companion_instance_id;
  END IF;

  INSERT INTO public.companion_instances (
    owner_scope, owner_character_id,
    primary_handler_character_id, combat_controller_character_id,
    identity_kind, source_kind, source_collection, source_id,
    source_policy, source_revision, source_snapshot, mount_profile,
    origin_table, origin_row_id
  ) VALUES (
    'character', v_vehicle.character_id,
    v_vehicle.character_id, v_vehicle.character_id,
    'mount', 'canonical-mount', 'vehicles', v_vehicle.vehicle_id,
    'snapshot', v_source_revision, v_canonical_snapshot, '{}'::jsonb,
    'character_vehicles', v_vehicle.id
  )
  RETURNING id INTO v_instance;

  PERFORM set_config('app.companion_mapping_write', 'on', true);
  UPDATE public.character_vehicles
  SET companion_instance_id = v_instance,
      companion_source_snapshot = v_canonical_snapshot
  WHERE id = v_vehicle.id;

  RETURN v_instance;
END;
$$;


-- Portable character exports can contain an old vehicle link with a copied
-- companion_instance_id. The C1 insertion trigger reconstructs the instance,
-- so normalize its source before that trigger sees any client-supplied stats.
ALTER TABLE public.character_vehicles
  ADD COLUMN IF NOT EXISTS companion_imported_source_snapshot JSONB;

CREATE OR REPLACE FUNCTION app_private.canonicalize_imported_vehicle_mount()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_snapshot JSONB;
BEGIN
  IF NEW.companion_instance_id IS NULL THEN RETURN NEW; END IF;

  SELECT source.snapshot INTO v_snapshot
  FROM app_private.canonical_companion_sources AS source
  WHERE source.source_collection = 'vehicles'
    AND source.source_id = NEW.vehicle_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CANONICAL_LIVING_MOUNT_NOT_FOUND' USING ERRCODE = '22023';
  END IF;

  IF NEW.companion_source_snapshot IS NOT NULL
    AND NEW.companion_source_snapshot IS DISTINCT FROM v_snapshot
  THEN
    NEW.companion_imported_source_snapshot := NEW.companion_source_snapshot;
  END IF;
  NEW.companion_source_snapshot := v_snapshot;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS canonicalize_imported_vehicle_mount
  ON public.character_vehicles;
CREATE TRIGGER canonicalize_imported_vehicle_mount
BEFORE INSERT ON public.character_vehicles
FOR EACH ROW EXECUTE FUNCTION app_private.canonicalize_imported_vehicle_mount();

REVOKE ALL ON FUNCTION app_private.canonicalize_imported_vehicle_mount()
  FROM PUBLIC, anon, authenticated;

-- Bond DCs use the server-owned rank, including for legacy source snapshots.
CREATE OR REPLACE FUNCTION public.resolve_companion_bond_attempt_c2(
  p_campaign_id UUID,
  p_character_id UUID,
  p_companion_instance_id UUID,
  p_expected_source_id TEXT,
  p_roll_primary INTEGER,
  p_roll_secondary INTEGER DEFAULT NULL,
  p_adjudication_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_instance public.companion_instances%ROWTYPE;
  v_rank TEXT;
  v_roll_mode TEXT := 'normal';
  v_prof_mode TEXT := 'default';
  v_spec_mode TEXT := 'default';
  v_retry_id UUID;
  v_chain_id UUID := gen_random_uuid();
  v_adjudication public.companion_attempt_adjudications%ROWTYPE;
  v_prior public.companion_bond_attempts%ROWTYPE;
  v_latest_failure public.companion_bond_attempts%ROWTYPE;
  v_check JSONB;
  v_attempt_id UUID;
  v_outcome TEXT;
  v_bond_id UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = p_character_id AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'NOT_OWNER' USING ERRCODE = '42501';
  END IF;
  IF NOT app_private.companion_character_in_campaign(p_campaign_id, p_character_id) THEN
    RAISE EXCEPTION 'CHARACTER_NOT_IN_CAMPAIGN' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_instance
  FROM public.companion_instances AS instance
  WHERE instance.id = p_companion_instance_id
  FOR UPDATE;
  IF NOT FOUND
     OR v_instance.owner_scope <> 'campaign'
     OR v_instance.owner_campaign_id IS DISTINCT FROM p_campaign_id
     OR v_instance.source_id IS DISTINCT FROM p_expected_source_id THEN
    RAISE EXCEPTION 'COMPANION_SOURCE_MISMATCH' USING ERRCODE = '22023';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.companion_bonds AS bond
    WHERE bond.companion_instance_id = p_companion_instance_id
      AND bond.character_id = p_character_id
      AND bond.released_at IS NULL
  ) THEN
    SELECT bond.id INTO v_bond_id
    FROM public.companion_bonds AS bond
    WHERE bond.companion_instance_id = p_companion_instance_id
      AND bond.character_id = p_character_id
      AND bond.released_at IS NULL;
    RETURN jsonb_build_object(
      'valid', true, 'success', true, 'outcome', 'already-bonded',
      'bond_id', v_bond_id, 'companion_instance_id', p_companion_instance_id
    );
  END IF;

  SELECT source.rank INTO v_rank
  FROM app_private.canonical_companion_sources AS source
  WHERE source.source_collection = 'anomalies'
    AND source.source_id = v_instance.source_id;
  IF v_rank IS NULL THEN
    RAISE EXCEPTION 'CANONICAL_ANOMALY_NOT_FOUND' USING ERRCODE = '22023';
  END IF;

  IF p_adjudication_id IS NOT NULL THEN
    SELECT * INTO v_adjudication
    FROM public.companion_attempt_adjudications AS adjudication
    WHERE adjudication.id = p_adjudication_id
    FOR UPDATE;
    IF NOT FOUND
       OR v_adjudication.consumed_at IS NOT NULL
       OR v_adjudication.campaign_id IS DISTINCT FROM p_campaign_id
       OR v_adjudication.character_id IS DISTINCT FROM p_character_id
       OR v_adjudication.target_source_id IS DISTINCT FROM p_expected_source_id
       OR v_adjudication.attempt_kind <> 'bond'
       OR v_adjudication.companion_instance_id IS DISTINCT FROM p_companion_instance_id THEN
      RAISE EXCEPTION 'INVALID_OR_CONSUMED_ADJUDICATION' USING ERRCODE = '22023';
    END IF;
    v_roll_mode := v_adjudication.roll_mode;
    v_prof_mode := v_adjudication.proficiency_mode;
    v_spec_mode := v_adjudication.specialization_mode;
    v_retry_id := v_adjudication.retry_of_attempt_id;
    UPDATE public.companion_attempt_adjudications
    SET consumed_at = now()
    WHERE id = p_adjudication_id;
  END IF;

  SELECT * INTO v_latest_failure
  FROM public.companion_bond_attempts AS attempt
  WHERE attempt.campaign_id = p_campaign_id
    AND attempt.character_id = p_character_id
    AND attempt.companion_instance_id = p_companion_instance_id
    AND attempt.attempt_kind = 'bond'
  ORDER BY attempt.created_at DESC, attempt.id DESC
  LIMIT 1;

  IF v_retry_id IS NOT NULL AND (
    v_latest_failure.id IS DISTINCT FROM v_retry_id
    OR v_latest_failure.outcome NOT IN ('failure', 'invalid')
  ) THEN
    RAISE EXCEPTION 'INVALID_RETRY_REFERENCE' USING ERRCODE = '22023';
  END IF;

  IF v_latest_failure.outcome IN ('failure', 'invalid')
    AND v_retry_id IS NULL THEN
    v_check := jsonb_build_object(
      'valid', false,
      'reason', 'RETRY_ADJUDICATION_REQUIRED',
      'retry_of_attempt_id', v_latest_failure.id
    );
  ELSE
    IF v_retry_id IS NOT NULL THEN
      SELECT * INTO v_prior
      FROM public.companion_bond_attempts AS attempt
      WHERE attempt.id = v_retry_id;
      IF NOT FOUND
         OR v_prior.campaign_id IS DISTINCT FROM p_campaign_id
         OR v_prior.character_id IS DISTINCT FROM p_character_id
         OR v_prior.companion_instance_id IS DISTINCT FROM p_companion_instance_id
         OR v_prior.target_source_id IS DISTINCT FROM p_expected_source_id
         OR v_prior.attempt_kind <> 'bond'
         OR v_prior.outcome NOT IN ('failure', 'invalid') THEN
        RAISE EXCEPTION 'INVALID_RETRY_REFERENCE' USING ERRCODE = '22023';
      END IF;
      v_chain_id := v_prior.attempt_chain_id;
    END IF;

    v_check := app_private.companion_resolve_check(
      p_character_id, v_rank, v_roll_mode, p_roll_primary, p_roll_secondary,
      v_prof_mode, v_spec_mode
    );
  END IF;

  v_outcome := CASE
    WHEN COALESCE((v_check->>'valid')::BOOLEAN, false) = false THEN 'invalid'
    WHEN COALESCE((v_check->>'success')::BOOLEAN, false) THEN 'success'
    ELSE 'failure'
  END;

  INSERT INTO public.companion_bond_attempts (
    campaign_id, character_id, companion_instance_id, target_source_id,
    target_rank, attempt_kind, attempt_chain_id, retry_of_attempt_id,
    adjudication_id, roll_mode, roll_primary, roll_secondary, selected_roll,
    ability_modifier, proficiency_source_id, proficiency_bonus,
    specialization_source_id, specialization_bonus, dc, total,
    outcome, invalid_reason
  ) VALUES (
    p_campaign_id, p_character_id, p_companion_instance_id, p_expected_source_id,
    NULLIF(upper(btrim(COALESCE(v_rank, ''))), ''), 'bond', v_chain_id, v_retry_id,
    p_adjudication_id, v_roll_mode,
    CASE WHEN p_roll_primary BETWEEN 1 AND 20 THEN p_roll_primary ELSE NULL END,
    CASE WHEN p_roll_secondary BETWEEN 1 AND 20 THEN p_roll_secondary ELSE NULL END,
    NULLIF(v_check->>'selected_roll', '')::INTEGER,
    COALESCE(NULLIF(v_check->>'ability_modifier', '')::INTEGER, 0),
    NULLIF(v_check->>'proficiency_source_id', ''),
    COALESCE(NULLIF(v_check->>'proficiency_bonus', '')::INTEGER, 0),
    NULLIF(v_check->>'specialization_source_id', ''),
    COALESCE(NULLIF(v_check->>'specialization_bonus', '')::INTEGER, 0),
    NULLIF(v_check->>'dc', '')::INTEGER,
    NULLIF(v_check->>'total', '')::INTEGER,
    v_outcome,
    CASE WHEN v_outcome = 'invalid' THEN v_check->>'reason' ELSE NULL END
  ) RETURNING id INTO v_attempt_id;

  IF v_outcome = 'success' THEN
    INSERT INTO public.companion_bonds (
      campaign_id, companion_instance_id, character_id, created_by_attempt_id
    ) VALUES (
      p_campaign_id, p_companion_instance_id, p_character_id, v_attempt_id
    )
    ON CONFLICT (companion_instance_id, character_id) WHERE released_at IS NULL
    DO UPDATE SET created_by_attempt_id = EXCLUDED.created_by_attempt_id
    RETURNING id INTO v_bond_id;
  END IF;

  RETURN v_check || jsonb_build_object(
    'attempt_id', v_attempt_id,
    'attempt_chain_id', v_chain_id,
    'retry_of_attempt_id', v_retry_id,
    'outcome', v_outcome,
    'bond_id', v_bond_id,
    'companion_instance_id', p_companion_instance_id,
    'roll_mode', v_roll_mode
  );
END;
$$;

COMMIT;

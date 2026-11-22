-- C2 hardening: enforce tame retry adjudication at the RPC boundary and make
-- the +2 specialization depend on canonical Job/Path ids rather than mutable
-- display labels.
--
-- This is additive over 20260926040000_companion_c2_bonding.sql so already
-- applied environments can migrate safely without rewriting C2 history.

BEGIN;

-- Canonical specialization sources. Job ids are the canonical ids introduced
-- by the character canonical-id migration. Path ids are the exact authored
-- companion-oriented canonical paths present in the RA path catalog.
CREATE OR REPLACE FUNCTION app_private.companion_specialization_source(
  p_character_id UUID
)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_job_id TEXT;
  v_path_id TEXT;
BEGIN
  SELECT
    NULLIF(btrim(character_row.job_id::TEXT), ''),
    NULLIF(btrim(character_row.path_id::TEXT), '')
  INTO v_job_id, v_path_id
  FROM public.characters AS character_row
  WHERE character_row.id = p_character_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Exact canonical path ids; the paired Job id prevents a stale/mismatched
  -- path id from being treated as a valid specialization source.
  IF (v_job_id = 'stalker' AND v_path_id IN (
        'stalker--pack-leader',
        'stalker--hive-synchronist'
      ))
     OR (v_job_id = 'technomancer'
         AND v_path_id = 'technomancer--synchronist-binary-design') THEN
    RETURN v_path_id;
  END IF;

  -- These Jobs are themselves authored companion-specialization sources.
  IF v_job_id IN ('summoner', 'contractor', 'esper') THEN
    RETURN v_job_id;
  END IF;

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION app_private.companion_specialization_source(UUID)
  FROM PUBLIC, anon, authenticated;

-- Preserve the existing resolver as a private implementation and put the
-- retry guard in front of it. This prevents callers from starting a fresh
-- attempt chain after a failed/invalid tame simply by omitting an
-- adjudication id.
ALTER FUNCTION public.resolve_companion_tame_attempt_c2(
  UUID, UUID, TEXT, JSONB, INTEGER, INTEGER, UUID, TEXT
) RENAME TO resolve_companion_tame_attempt_c2_unchecked;

REVOKE ALL ON FUNCTION public.resolve_companion_tame_attempt_c2_unchecked(
  UUID, UUID, TEXT, JSONB, INTEGER, INTEGER, UUID, TEXT
) FROM PUBLIC, anon, authenticated;

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
    p_source_snapshot,
    p_roll_primary,
    p_roll_secondary,
    p_adjudication_id,
    p_nickname
  );
END;
$$;

REVOKE ALL ON FUNCTION public.resolve_companion_tame_attempt_c2(
  UUID, UUID, TEXT, JSONB, INTEGER, INTEGER, UUID, TEXT
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_companion_tame_attempt_c2(
  UUID, UUID, TEXT, JSONB, INTEGER, INTEGER, UUID, TEXT
) TO authenticated;

COMMENT ON FUNCTION public.resolve_companion_tame_attempt_c2(
  UUID, UUID, TEXT, JSONB, INTEGER, INTEGER, UUID, TEXT
) IS 'C2 authoritative tame boundary. Failed/invalid attempts require a matching one-shot Warden retry adjudication before another roll is accepted.';

COMMIT;

NOTIFY pgrst, 'reload schema';
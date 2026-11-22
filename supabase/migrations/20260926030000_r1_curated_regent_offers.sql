-- R1: curated Regent offers, legacy grant configuration, and bypass restrictions.
--
-- A Regent offer is Warden-authored and stores exactly three distinct canonical
-- candidate IDs. Players may consume only one stored candidate. Existing pending
-- generic credits remain visible but are intentionally non-actionable until a
-- Warden configures their three candidates. Consumed offers remain immutable.

BEGIN;

ALTER TABLE public.character_regent_unlock_grants
  ADD COLUMN IF NOT EXISTS candidate_regent_ids TEXT[],
  ADD COLUMN IF NOT EXISTS offer_version INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS configured_by UUID,
  ADD COLUMN IF NOT EXISTS configured_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS request_id UUID;

ALTER TABLE public.character_regent_unlock_grants
  DROP CONSTRAINT IF EXISTS character_regent_unlock_grants_candidates_check,
  DROP CONSTRAINT IF EXISTS character_regent_unlock_grants_configuration_check,
  DROP CONSTRAINT IF EXISTS character_regent_unlock_grants_offer_version_check;

ALTER TABLE public.character_regent_unlock_grants
  ADD CONSTRAINT character_regent_unlock_grants_candidates_check
    CHECK (
      candidate_regent_ids IS NULL
      OR (
        cardinality(candidate_regent_ids) = 3
        AND array_position(candidate_regent_ids, NULL::TEXT) IS NULL
        AND candidate_regent_ids <@ ARRAY[
          'umbral_regent', 'radiant_regent', 'steel_regent',
          'destruction_regent', 'war_regent', 'frost_regent',
          'beast_regent', 'plague_regent', 'spatial_regent',
          'mimic_regent', 'blood_regent', 'gravity_regent'
        ]::TEXT[]
        AND candidate_regent_ids[1] <> candidate_regent_ids[2]
        AND candidate_regent_ids[1] <> candidate_regent_ids[3]
        AND candidate_regent_ids[2] <> candidate_regent_ids[3]
      )
    ),
  ADD CONSTRAINT character_regent_unlock_grants_configuration_check
    CHECK (
      (candidate_regent_ids IS NULL AND configured_by IS NULL AND configured_at IS NULL)
      OR
      (candidate_regent_ids IS NOT NULL AND configured_by IS NOT NULL AND configured_at IS NOT NULL)
    ),
  ADD CONSTRAINT character_regent_unlock_grants_offer_version_check
    CHECK (offer_version >= 1);

ALTER TABLE public.character_regent_unlock_grants
  DROP CONSTRAINT IF EXISTS character_regent_unlock_grants_request_id_key;
ALTER TABLE public.character_regent_unlock_grants
  ADD CONSTRAINT character_regent_unlock_grants_request_id_key UNIQUE (request_id);

-- Task 8 allowed direct Warden INSERT/DELETE of generic credits. R1 removes that
-- bypass: all offer creation, configuration and revocation now use actor-bound
-- SECURITY DEFINER RPCs below. SELECT remains governed by the existing policy.
DROP POLICY IF EXISTS regent_unlock_grants_insert
  ON public.character_regent_unlock_grants;
DROP POLICY IF EXISTS regent_unlock_grants_delete
  ON public.character_regent_unlock_grants;
DROP POLICY IF EXISTS "regent_unlock_grants_insert"
  ON public.character_regent_unlock_grants;
DROP POLICY IF EXISTS "regent_unlock_grants_delete"
  ON public.character_regent_unlock_grants;

CREATE OR REPLACE FUNCTION public.create_regent_unlock_offer(
  p_character_id UUID,
  p_quest_id TEXT,
  p_quest_title TEXT,
  p_candidate_regent_ids TEXT[],
  p_request_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_existing public.character_regent_unlock_grants%ROWTYPE;
  v_created_id UUID;
  v_unlock_count INTEGER;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_request_id IS NULL THEN
    RAISE EXCEPTION 'REGENT_OFFER_REQUEST_ID_REQUIRED' USING ERRCODE = '22023';
  END IF;

  IF p_quest_title IS NULL OR btrim(p_quest_title) = '' THEN
    RAISE EXCEPTION 'REGENT_OFFER_QUEST_TITLE_REQUIRED' USING ERRCODE = '22023';
  END IF;

  IF p_candidate_regent_ids IS NULL
     OR cardinality(p_candidate_regent_ids) <> 3
     OR array_position(p_candidate_regent_ids, NULL::TEXT) IS NOT NULL
     OR NOT (p_candidate_regent_ids <@ ARRAY[
       'umbral_regent', 'radiant_regent', 'steel_regent',
       'destruction_regent', 'war_regent', 'frost_regent',
       'beast_regent', 'plague_regent', 'spatial_regent',
       'mimic_regent', 'blood_regent', 'gravity_regent'
     ]::TEXT[])
     OR p_candidate_regent_ids[1] = p_candidate_regent_ids[2]
     OR p_candidate_regent_ids[1] = p_candidate_regent_ids[3]
     OR p_candidate_regent_ids[2] = p_candidate_regent_ids[3] THEN
    RAISE EXCEPTION 'REGENT_OFFER_REQUIRES_THREE_CANONICAL_CANDIDATES'
      USING ERRCODE = '22023';
  END IF;

  -- Serialize all offer/unlock mutations for one character through the parent.
  PERFORM 1
  FROM public.characters AS character_row
  WHERE character_row.id = p_character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM (
      SELECT member_row.campaign_id
      FROM public.campaign_members AS member_row
      WHERE member_row.character_id = p_character_id
      UNION
      SELECT link_row.campaign_id
      FROM public.campaign_member_characters AS link_row
      WHERE link_row.character_id = p_character_id
      UNION
      SELECT share_row.campaign_id
      FROM public.campaign_character_shares AS share_row
      WHERE share_row.character_id = p_character_id
    ) AS linked_campaign
    WHERE public.is_campaign_system(linked_campaign.campaign_id, v_actor)
  ) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT grant_row.*
  INTO v_existing
  FROM public.character_regent_unlock_grants AS grant_row
  WHERE grant_row.request_id = p_request_id
  FOR UPDATE;

  IF FOUND THEN
    IF v_existing.character_id = p_character_id
       AND v_existing.granted_by = v_actor
       AND v_existing.quest_id IS NOT DISTINCT FROM p_quest_id
       AND v_existing.quest_title = p_quest_title
       AND v_existing.candidate_regent_ids = p_candidate_regent_ids THEN
      RETURN v_existing.id;
    END IF;
    RAISE EXCEPTION 'REGENT_OFFER_REQUEST_CONFLICT' USING ERRCODE = '23505';
  END IF;

  SELECT count(*)
  INTO v_unlock_count
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.character_id = p_character_id;

  IF v_unlock_count >= 2 THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_LIMIT_REACHED' USING ERRCODE = '23514';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.character_regent_unlocks AS unlock_row
    WHERE unlock_row.character_id = p_character_id
      AND unlock_row.regent_id = ANY (p_candidate_regent_ids)
  ) THEN
    RAISE EXCEPTION 'REGENT_OFFER_CANDIDATE_ALREADY_UNLOCKED'
      USING ERRCODE = '23505';
  END IF;

  INSERT INTO public.character_regent_unlock_grants (
    character_id,
    quest_id,
    quest_title,
    granted_by,
    candidate_regent_ids,
    offer_version,
    configured_by,
    configured_at,
    request_id
  )
  VALUES (
    p_character_id,
    p_quest_id,
    p_quest_title,
    v_actor,
    p_candidate_regent_ids,
    1,
    v_actor,
    now(),
    p_request_id
  )
  RETURNING id INTO v_created_id;

  RETURN v_created_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.configure_regent_unlock_offer(
  p_grant_id UUID,
  p_candidate_regent_ids TEXT[]
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_grant public.character_regent_unlock_grants%ROWTYPE;
  v_next_version INTEGER;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_candidate_regent_ids IS NULL
     OR cardinality(p_candidate_regent_ids) <> 3
     OR array_position(p_candidate_regent_ids, NULL::TEXT) IS NOT NULL
     OR NOT (p_candidate_regent_ids <@ ARRAY[
       'umbral_regent', 'radiant_regent', 'steel_regent',
       'destruction_regent', 'war_regent', 'frost_regent',
       'beast_regent', 'plague_regent', 'spatial_regent',
       'mimic_regent', 'blood_regent', 'gravity_regent'
     ]::TEXT[])
     OR p_candidate_regent_ids[1] = p_candidate_regent_ids[2]
     OR p_candidate_regent_ids[1] = p_candidate_regent_ids[3]
     OR p_candidate_regent_ids[2] = p_candidate_regent_ids[3] THEN
    RAISE EXCEPTION 'REGENT_OFFER_REQUIRES_THREE_CANONICAL_CANDIDATES'
      USING ERRCODE = '22023';
  END IF;

  SELECT grant_row.*
  INTO v_grant
  FROM public.character_regent_unlock_grants AS grant_row
  WHERE grant_row.id = p_grant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_GRANT_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  PERFORM 1
  FROM public.characters AS character_row
  WHERE character_row.id = v_grant.character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM (
      SELECT member_row.campaign_id
      FROM public.campaign_members AS member_row
      WHERE member_row.character_id = v_grant.character_id
      UNION
      SELECT link_row.campaign_id
      FROM public.campaign_member_characters AS link_row
      WHERE link_row.character_id = v_grant.character_id
      UNION
      SELECT share_row.campaign_id
      FROM public.campaign_character_shares AS share_row
      WHERE share_row.character_id = v_grant.character_id
    ) AS linked_campaign
    WHERE public.is_campaign_system(linked_campaign.campaign_id, v_actor)
  ) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF v_grant.consumed_at IS NOT NULL OR v_grant.consumed_unlock_id IS NOT NULL THEN
    RAISE EXCEPTION 'REGENT_OFFER_CONSUMED_IMMUTABLE' USING ERRCODE = '23514';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.character_regent_unlocks AS unlock_row
    WHERE unlock_row.character_id = v_grant.character_id
      AND unlock_row.regent_id = ANY (p_candidate_regent_ids)
  ) THEN
    RAISE EXCEPTION 'REGENT_OFFER_CANDIDATE_ALREADY_UNLOCKED'
      USING ERRCODE = '23505';
  END IF;

  v_next_version := v_grant.offer_version + 1;

  UPDATE public.character_regent_unlock_grants AS grant_row
  SET candidate_regent_ids = p_candidate_regent_ids,
      offer_version = v_next_version,
      configured_by = v_actor,
      configured_at = now()
  WHERE grant_row.id = v_grant.id;

  RETURN v_next_version;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_regent_unlock_offer(
  p_grant_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_grant public.character_regent_unlock_grants%ROWTYPE;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT grant_row.*
  INTO v_grant
  FROM public.character_regent_unlock_grants AS grant_row
  WHERE grant_row.id = p_grant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_GRANT_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  PERFORM 1
  FROM public.characters AS character_row
  WHERE character_row.id = v_grant.character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM (
      SELECT member_row.campaign_id
      FROM public.campaign_members AS member_row
      WHERE member_row.character_id = v_grant.character_id
      UNION
      SELECT link_row.campaign_id
      FROM public.campaign_member_characters AS link_row
      WHERE link_row.character_id = v_grant.character_id
      UNION
      SELECT share_row.campaign_id
      FROM public.campaign_character_shares AS share_row
      WHERE share_row.character_id = v_grant.character_id
    ) AS linked_campaign
    WHERE public.is_campaign_system(linked_campaign.campaign_id, v_actor)
  ) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF v_grant.consumed_at IS NOT NULL OR v_grant.consumed_unlock_id IS NOT NULL THEN
    RAISE EXCEPTION 'REGENT_OFFER_CONSUMED_IMMUTABLE' USING ERRCODE = '23514';
  END IF;

  DELETE FROM public.character_regent_unlock_grants AS grant_row
  WHERE grant_row.id = v_grant.id;

  RETURN v_grant.id;
END;
$$;

-- Replace Task 8 consumption with stored-offer enforcement. Exact committed
-- retries are resolved before candidate checks so legacy already-consumed rows
-- remain retry-compatible even though they have no candidate array.
CREATE OR REPLACE FUNCTION public.consume_regent_unlock_grant(
  p_grant_id UUID,
  p_regent_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_canonical_regent_id TEXT := p_regent_id;
  v_grant public.character_regent_unlock_grants%ROWTYPE;
  v_existing_unlock public.character_regent_unlocks%ROWTYPE;
  v_character_owner UUID;
  v_unlock_count INTEGER;
  v_is_primary BOOLEAN;
  v_unlock_id UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF v_canonical_regent_id IS NULL
     OR NOT (v_canonical_regent_id = ANY (ARRAY[
       'umbral_regent', 'radiant_regent', 'steel_regent',
       'destruction_regent', 'war_regent', 'frost_regent',
       'beast_regent', 'plague_regent', 'spatial_regent',
       'mimic_regent', 'blood_regent', 'gravity_regent'
     ]::TEXT[])) THEN
    RAISE EXCEPTION 'INVALID_REGENT_ID' USING ERRCODE = '22023';
  END IF;

  SELECT grant_row.*
  INTO v_grant
  FROM public.character_regent_unlock_grants AS grant_row
  WHERE grant_row.id = p_grant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_GRANT_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT character_row.user_id
  INTO v_character_owner
  FROM public.characters AS character_row
  WHERE character_row.id = v_grant.character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_character_owner IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF v_grant.consumed_unlock_id IS NOT NULL THEN
    SELECT unlock_row.*
    INTO v_existing_unlock
    FROM public.character_regent_unlocks AS unlock_row
    WHERE unlock_row.id = v_grant.consumed_unlock_id
      AND unlock_row.character_id = v_grant.character_id;

    IF NOT FOUND
       OR v_existing_unlock.regent_id IS DISTINCT FROM v_canonical_regent_id THEN
      RAISE EXCEPTION 'REGENT_UNLOCK_GRANT_ALREADY_CONSUMED'
        USING ERRCODE = '23505';
    END IF;

    RETURN v_existing_unlock.id;
  END IF;

  IF v_grant.candidate_regent_ids IS NULL THEN
    RAISE EXCEPTION 'LEGACY_REGENT_OFFER_REQUIRES_WARDEN_CONFIGURATION'
      USING ERRCODE = '23514';
  END IF;

  IF NOT (v_canonical_regent_id = ANY (v_grant.candidate_regent_ids)) THEN
    RAISE EXCEPTION 'REGENT_NOT_IN_OFFER' USING ERRCODE = '42501';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.character_regent_unlocks AS unlock_row
    WHERE unlock_row.character_id = v_grant.character_id
      AND unlock_row.regent_id = v_canonical_regent_id
  ) THEN
    RAISE EXCEPTION 'REGENT_ALREADY_UNLOCKED' USING ERRCODE = '23505';
  END IF;

  SELECT count(*)
  INTO v_unlock_count
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.character_id = v_grant.character_id;

  IF v_unlock_count >= 2 THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_LIMIT_REACHED' USING ERRCODE = '23514';
  END IF;

  v_is_primary := NOT EXISTS (
    SELECT 1
    FROM public.character_regent_unlocks AS unlock_row
    WHERE unlock_row.character_id = v_grant.character_id
      AND unlock_row.is_primary
  );

  INSERT INTO public.character_regent_unlocks (
    character_id,
    legacy_regent_uuid,
    regent_id,
    quest_name,
    dm_notes,
    is_primary,
    caught_up_at_level
  )
  VALUES (
    v_grant.character_id,
    NULL,
    v_canonical_regent_id,
    v_grant.quest_title,
    NULL,
    v_is_primary,
    NULL
  )
  RETURNING id INTO v_unlock_id;

  UPDATE public.character_regent_unlock_grants AS grant_row
  SET consumed_at = now(),
      consumed_unlock_id = v_unlock_id
  WHERE grant_row.id = v_grant.id;

  RETURN v_unlock_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_regent_unlock_offer(UUID, TEXT, TEXT, TEXT[], UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.configure_regent_unlock_offer(UUID, TEXT[])
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.revoke_regent_unlock_offer(UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.consume_regent_unlock_grant(UUID, TEXT)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_regent_unlock_offer(UUID, TEXT, TEXT, TEXT[], UUID)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.configure_regent_unlock_offer(UUID, TEXT[])
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_regent_unlock_offer(UUID)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.consume_regent_unlock_grant(UUID, TEXT)
  TO authenticated;

COMMIT;

NOTIFY pgrst, 'reload schema';

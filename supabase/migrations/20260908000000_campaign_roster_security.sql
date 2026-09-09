-- Campaign roster visibility and Warden read-only sheet access.
--
-- This migration intentionally keeps profile rows and raw character rows
-- private to their owners. Campaign participants use a narrow roster DTO;
-- primary and co-Wardens gain read-only RLS access to characters that are
-- actually linked to one of their campaigns.

BEGIN;

-- ---------------------------------------------------------------------------
-- Private authorization helper
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app_private.can_read_campaign_character(
  p_character_id UUID,
  p_actor UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT p_actor IS NOT NULL
    AND p_actor = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.campaigns AS campaign_row
      WHERE public.is_campaign_system(campaign_row.id, p_actor)
        AND (
          EXISTS (
            SELECT 1
            FROM public.campaign_members AS member_row
            WHERE member_row.campaign_id = campaign_row.id
              AND member_row.character_id = p_character_id
          )
          OR EXISTS (
            SELECT 1
            FROM public.campaign_member_characters AS member_character_row
            JOIN public.campaign_members AS member_row
              ON member_row.id = member_character_row.campaign_member_id
            WHERE member_row.campaign_id = campaign_row.id
              AND member_character_row.character_id = p_character_id
          )
          OR EXISTS (
            SELECT 1
            FROM public.campaign_character_shares AS share_row
            WHERE share_row.campaign_id = campaign_row.id
              AND share_row.character_id = p_character_id
          )
        )
    );
$$;

REVOKE ALL ON FUNCTION app_private.can_read_campaign_character(UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.can_read_campaign_character(UUID, UUID)
  TO authenticated;

-- ---------------------------------------------------------------------------
-- Minimal campaign roster projection
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_campaign_roster(p_campaign_id UUID)
RETURNS TABLE (
  campaign_member_id UUID,
  user_id UUID,
  display_name TEXT,
  role TEXT,
  joined_at TIMESTAMPTZ,
  character_id UUID,
  character_name TEXT,
  character_level INTEGER,
  character_job TEXT,
  portrait_url TEXT,
  is_shared BOOLEAN
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
BEGIN
  IF v_actor IS NULL
     OR NOT (
       public.is_campaign_member(p_campaign_id, v_actor)
       OR public.is_campaign_system(p_campaign_id, v_actor)
     ) THEN
    RAISE EXCEPTION 'CAMPAIGN_ROSTER_FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  WITH member_character_links AS (
    SELECT
      member_row.id AS campaign_member_id,
      member_row.campaign_id,
      member_row.user_id,
      member_row.role,
      member_row.joined_at,
      member_row.character_id
    FROM public.campaign_members AS member_row
    WHERE member_row.campaign_id = p_campaign_id
      AND member_row.character_id IS NOT NULL

    UNION

    SELECT
      member_row.id AS campaign_member_id,
      member_row.campaign_id,
      member_row.user_id,
      member_row.role,
      member_row.joined_at,
      member_character_row.character_id
    FROM public.campaign_members AS member_row
    JOIN public.campaign_member_characters AS member_character_row
      ON member_character_row.campaign_member_id = member_row.id
    WHERE member_row.campaign_id = p_campaign_id
  ),
  member_rows AS (
    SELECT
      member_row.id AS campaign_member_id,
      member_row.user_id,
      member_row.role,
      member_row.joined_at,
      linked_row.character_id
    FROM public.campaign_members AS member_row
    LEFT JOIN member_character_links AS linked_row
      ON linked_row.campaign_member_id = member_row.id
    WHERE member_row.campaign_id = p_campaign_id
  ),
  unlinked_shared_rows AS (
    SELECT
      NULL::UUID AS campaign_member_id,
      character_row.user_id,
      'ascendant'::TEXT AS role,
      share_row.shared_at AS joined_at,
      share_row.character_id
    FROM public.campaign_character_shares AS share_row
    JOIN public.characters AS character_row
      ON character_row.id = share_row.character_id
    WHERE share_row.campaign_id = p_campaign_id
      AND NOT EXISTS (
        SELECT 1
        FROM member_character_links AS linked_row
        WHERE linked_row.character_id = share_row.character_id
      )
  ),
  roster_rows AS (
    SELECT * FROM member_rows
    UNION ALL
    SELECT * FROM unlinked_shared_rows
  )
  SELECT
    roster_row.campaign_member_id,
    roster_row.user_id,
    profile_row.display_name,
    roster_row.role,
    roster_row.joined_at,
    roster_row.character_id,
    character_row.name,
    character_row.level,
    character_row.job,
    character_row.portrait_url,
    EXISTS (
      SELECT 1
      FROM public.campaign_character_shares AS share_row
      WHERE share_row.campaign_id = p_campaign_id
        AND share_row.character_id = roster_row.character_id
    )
  FROM roster_rows AS roster_row
  LEFT JOIN public.profiles AS profile_row
    ON profile_row.id = roster_row.user_id
  LEFT JOIN public.characters AS character_row
    ON character_row.id = roster_row.character_id
  ORDER BY roster_row.joined_at NULLS LAST, character_row.name NULLS LAST;
END;
$$;

REVOKE ALL ON FUNCTION public.get_campaign_roster(UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_campaign_roster(UUID) TO authenticated;

-- ---------------------------------------------------------------------------
-- Actor-bound campaign roster management
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_campaign_member_role(
  p_campaign_id UUID,
  p_member_id UUID,
  p_role TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_primary_warden_id UUID;
  v_target public.campaign_members%ROWTYPE;
  v_previous_role TEXT;
BEGIN
  IF v_actor IS NULL OR NOT public.is_campaign_system(p_campaign_id, v_actor) THEN
    RAISE EXCEPTION 'CAMPAIGN_MANAGER_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_role NOT IN ('ascendant', 'co-warden') THEN
    RAISE EXCEPTION 'INVALID_CAMPAIGN_MEMBER_ROLE' USING ERRCODE = '22023';
  END IF;

  SELECT campaign_row.warden_id
  INTO v_primary_warden_id
  FROM public.campaigns AS campaign_row
  WHERE campaign_row.id = p_campaign_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CAMPAIGN_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT member_row.*
  INTO v_target
  FROM public.campaign_members AS member_row
  WHERE member_row.id = p_member_id
    AND member_row.campaign_id = p_campaign_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CAMPAIGN_MEMBER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_target.user_id = v_primary_warden_id OR v_target.role = 'warden' THEN
    RAISE EXCEPTION 'PRIMARY_WARDEN_IMMUTABLE' USING ERRCODE = '42501';
  END IF;

  v_previous_role := v_target.role;

  UPDATE public.campaign_members
  SET role = p_role
  WHERE id = v_target.id;

  INSERT INTO public.campaign_invite_audit_logs (
    campaign_id,
    actor_id,
    invite_id,
    action,
    details
  )
  VALUES (
    p_campaign_id,
    v_actor,
    NULL,
    'member_role_updated',
    jsonb_build_object(
      'member_id', v_target.id,
      'target_user_id', v_target.user_id,
      'previous_role', v_previous_role,
      'next_role', p_role
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_campaign_member(
  p_campaign_id UUID,
  p_member_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_primary_warden_id UUID;
  v_target public.campaign_members%ROWTYPE;
BEGIN
  IF v_actor IS NULL OR NOT public.is_campaign_system(p_campaign_id, v_actor) THEN
    RAISE EXCEPTION 'CAMPAIGN_MANAGER_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT campaign_row.warden_id
  INTO v_primary_warden_id
  FROM public.campaigns AS campaign_row
  WHERE campaign_row.id = p_campaign_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CAMPAIGN_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT member_row.*
  INTO v_target
  FROM public.campaign_members AS member_row
  WHERE member_row.id = p_member_id
    AND member_row.campaign_id = p_campaign_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CAMPAIGN_MEMBER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_target.user_id = v_primary_warden_id OR v_target.role = 'warden' THEN
    RAISE EXCEPTION 'PRIMARY_WARDEN_IMMUTABLE' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.campaign_invite_audit_logs (
    campaign_id,
    actor_id,
    invite_id,
    action,
    details
  )
  VALUES (
    p_campaign_id,
    v_actor,
    NULL,
    'member_removed',
    jsonb_build_object(
      'member_id', v_target.id,
      'target_user_id', v_target.user_id
    )
  );

  DELETE FROM public.campaign_member_characters
  WHERE campaign_member_id = v_target.id;

  -- Shares created by the removed account are campaign-scoped access grants
  -- and must not outlive its membership. Warden-created NPC shares remain.
  DELETE FROM public.campaign_character_shares
  WHERE campaign_id = p_campaign_id
    AND shared_by = v_target.user_id;

  DELETE FROM public.campaign_members
  WHERE id = v_target.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.detach_campaign_member_character(
  p_campaign_id UUID,
  p_member_id UUID,
  p_character_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_primary_warden_id UUID;
  v_target public.campaign_members%ROWTYPE;
  v_detached BOOLEAN := false;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT campaign_row.warden_id
  INTO v_primary_warden_id
  FROM public.campaigns AS campaign_row
  WHERE campaign_row.id = p_campaign_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CAMPAIGN_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT member_row.*
  INTO v_target
  FROM public.campaign_members AS member_row
  WHERE member_row.id = p_member_id
    AND member_row.campaign_id = p_campaign_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CAMPAIGN_MEMBER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_target.user_id IS DISTINCT FROM v_actor
     AND NOT public.is_campaign_system(p_campaign_id, v_actor) THEN
    RAISE EXCEPTION 'CAMPAIGN_MANAGER_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF v_target.user_id = v_primary_warden_id
     AND v_target.user_id IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'PRIMARY_WARDEN_IMMUTABLE' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.campaign_member_characters
  WHERE campaign_member_id = v_target.id
    AND character_id = p_character_id;
  v_detached := FOUND;

  UPDATE public.campaign_members
  SET character_id = NULL
  WHERE id = v_target.id
    AND character_id = p_character_id;
  v_detached := v_detached OR FOUND;

  IF NOT v_detached THEN
    RAISE EXCEPTION 'CAMPAIGN_CHARACTER_LINK_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  DELETE FROM public.campaign_character_shares
  WHERE campaign_id = p_campaign_id
    AND character_id = p_character_id
    AND shared_by = v_target.user_id;

  INSERT INTO public.campaign_invite_audit_logs (
    campaign_id,
    actor_id,
    invite_id,
    action,
    details
  )
  VALUES (
    p_campaign_id,
    v_actor,
    NULL,
    'member_character_detached',
    jsonb_build_object(
      'member_id', v_target.id,
      'target_user_id', v_target.user_id,
      'character_id', p_character_id
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.set_campaign_member_role(UUID, UUID, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.remove_campaign_member(UUID, UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.detach_campaign_member_character(UUID, UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_campaign_member_role(UUID, UUID, TEXT)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_campaign_member(UUID, UUID)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.detach_campaign_member_character(UUID, UUID, UUID)
  TO authenticated;

-- Browser clients no longer need direct INSERT/UPDATE access to campaign
-- membership. Leaving remains a self-service operation, except for the
-- primary Warden, whose ownership must remain stable.
DO $$
DECLARE
  policy_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'campaign_members'
      AND cmd IN ('INSERT', 'UPDATE', 'DELETE')
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.campaign_members',
      policy_row.policyname
    );
  END LOOP;
END;
$$;

CREATE POLICY campaign_members_leave_self
  ON public.campaign_members
  FOR DELETE
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND NOT public.is_campaign_warden(campaign_id, (SELECT auth.uid()))
  );

-- ---------------------------------------------------------------------------
-- Read-only Warden access to linked character sheets
-- ---------------------------------------------------------------------------

CREATE POLICY campaign_managers_read_linked_characters
  ON public.characters
  FOR SELECT
  TO authenticated
  USING (
    app_private.can_read_campaign_character(id, (SELECT auth.uid()))
  );

DO $$
DECLARE
  target_table TEXT;
  policy_name TEXT;
  target_tables CONSTANT TEXT[] := ARRAY[
    'character_abilities',
    'character_active_spells',
    'character_crafting_projects',
    'character_equipment',
    'character_extras',
    'character_feature_choices',
    'character_features',
    'character_journal',
    'character_materials',
    'character_monarch_unlocks',
    'character_powers',
    'character_recipes',
    'character_regent_unlock_grants',
    'character_regent_unlocks',
    'character_regents',
    'character_requisition_profiles',
    'character_rune_inscriptions',
    'character_rune_knowledge',
    'character_shadow_army',
    'character_sheet_state',
    'character_sigil_inscriptions',
    'character_spell_slots',
    'character_spells',
    'character_tamed_anomalies',
    'character_tattoos',
    'character_techniques',
    'character_umbral_legionnaires',
    'character_vehicles'
  ];
BEGIN
  FOREACH target_table IN ARRAY target_tables
  LOOP
    IF to_regclass(format('public.%I', target_table)) IS NULL THEN
      RAISE EXCEPTION 'Expected character sheet table is missing: %', target_table;
    END IF;

    policy_name := format('campaign_managers_read_%s', target_table);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (app_private.can_read_campaign_character(character_id, (SELECT auth.uid())))',
      policy_name,
      target_table
    );
  END LOOP;
END;
$$;

COMMIT;

NOTIFY pgrst, 'reload schema';

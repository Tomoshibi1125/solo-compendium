-- Supabase API security hardening.
--
-- This is intentionally one forward-only migration. It establishes an opt-in
-- function surface, narrows anonymous previews, binds privileged mutations to
-- auth.uid(), separates account administration from the gameplay Warden role,
-- and removes broad object-listing policies while retaining public asset URLs.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Private helpers and account-administrator authority
-- ---------------------------------------------------------------------------

CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC, anon, authenticated;
REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated;

-- PostgreSQL grants EXECUTE on new functions to PUBLIC by default. Make future
-- functions opt-in for the role that owns migrations in hosted Supabase.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA app_private
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;

-- app_metadata is writable only through a trusted Admin API/service-role path.
-- Read the canonical auth.users value instead of trusting user_metadata,
-- profiles.role, a caller-supplied UUID, or a potentially stale browser flag.
CREATE OR REPLACE FUNCTION app_private.is_account_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users AS auth_user
    WHERE auth_user.id = auth.uid()
      AND auth_user.raw_app_meta_data ->> 'account_role' = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION app_private.is_account_admin() FROM PUBLIC, anon, authenticated;

-- Rebuild profile/audit visibility so a self-selected gameplay Warden cannot
-- enumerate or administer accounts. Drop every existing permissive policy for
-- the affected command before creating the canonical policy.
DO $$
DECLARE
  policy_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND cmd IN ('SELECT', 'UPDATE')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', policy_row.policyname);
  END LOOP;

  IF to_regclass('public.user_profiles') IS NOT NULL THEN
    FOR policy_row IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'user_profiles'
        AND cmd = 'SELECT'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', policy_row.policyname);
    END LOOP;
  END IF;

  IF to_regclass('public.admin_audit_log') IS NOT NULL THEN
    FOR policy_row IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'admin_audit_log'
        AND cmd = 'SELECT'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_audit_log', policy_row.policyname);
    END LOOP;
  END IF;
END;
$$;

CREATE POLICY profiles_select
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    id = (SELECT auth.uid())
    OR app_private.is_account_admin()
  );

CREATE POLICY profiles_update_self
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (
    id = (SELECT auth.uid())
    AND role IN ('warden', 'ascendant')
  );

DO $$
BEGIN
  IF to_regclass('public.user_profiles') IS NOT NULL THEN
    EXECUTE $policy$
      CREATE POLICY user_profiles_select
        ON public.user_profiles
        FOR SELECT
        TO authenticated
        USING (
          id = (SELECT auth.uid())
          OR app_private.is_account_admin()
        )
    $policy$;
  END IF;

  IF to_regclass('public.admin_audit_log') IS NOT NULL THEN
    EXECUTE $policy$
      CREATE POLICY account_admins_view_audit_log
        ON public.admin_audit_log
        FOR SELECT
        TO authenticated
        USING (app_private.is_account_admin())
    $policy$;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  p_target UUID,
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
  v_old TEXT;
BEGIN
  IF v_actor IS NULL OR NOT app_private.is_account_admin() THEN
    RAISE EXCEPTION 'Not authorized to manage users' USING ERRCODE = '42501';
  END IF;

  IF p_role NOT IN ('warden', 'ascendant') THEN
    RAISE EXCEPTION 'Invalid role' USING ERRCODE = '22023';
  END IF;

  SELECT profile_row.role
  INTO v_old
  FROM public.profiles AS profile_row
  WHERE profile_row.id = p_target
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.profiles
  SET role = p_role,
      updated_at = now()
  WHERE id = p_target;

  INSERT INTO public.admin_audit_log (
    actor_user_id,
    action,
    target_user_id,
    details
  )
  VALUES (
    v_actor,
    'set_role',
    p_target,
    jsonb_build_object('from', v_old, 'to', p_role)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_user_ban(
  p_target UUID,
  p_banned BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
BEGIN
  IF v_actor IS NULL OR NOT app_private.is_account_admin() THEN
    RAISE EXCEPTION 'Not authorized to manage users' USING ERRCODE = '42501';
  END IF;

  IF p_banned AND p_target = v_actor THEN
    RAISE EXCEPTION 'Cannot suspend your own account' USING ERRCODE = '22023';
  END IF;

  UPDATE public.profiles
  SET banned_at = CASE WHEN p_banned THEN now() ELSE NULL END,
      updated_at = now()
  WHERE id = p_target;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.admin_audit_log (
    actor_user_id,
    action,
    target_user_id,
    details
  )
  VALUES (
    v_actor,
    CASE WHEN p_banned THEN 'ban_user' ELSE 'unban_user' END,
    p_target,
    '{}'::jsonb
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Actor-bound creation and privileged gameplay mutations
-- ---------------------------------------------------------------------------

-- Preserve the rollout-compatible signature, but treat p_warden_id only as an
-- assertion about the authenticated actor. It is never the persisted authority.
CREATE OR REPLACE FUNCTION public.create_campaign_with_code(
  p_name TEXT,
  p_description TEXT,
  p_warden_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_campaign_id UUID;
  v_share_code TEXT;
  v_attempts INTEGER := 0;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF p_warden_id IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'Actor mismatch' USING ERRCODE = '42501';
  END IF;

  IF NULLIF(btrim(p_name), '') IS NULL THEN
    RAISE EXCEPTION 'Campaign name is required' USING ERRCODE = '22023';
  END IF;

  LOOP
    v_share_code := public.generate_share_code();
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.campaigns AS campaign_row
      WHERE campaign_row.share_code = v_share_code
    );

    v_attempts := v_attempts + 1;
    IF v_attempts >= 10 THEN
      RAISE EXCEPTION 'Unable to allocate campaign share code';
    END IF;
  END LOOP;

  INSERT INTO public.campaigns (name, description, warden_id, share_code)
  VALUES (btrim(p_name), NULLIF(btrim(p_description), ''), v_actor, v_share_code)
  RETURNING id INTO v_campaign_id;

  INSERT INTO public.campaign_members (campaign_id, user_id, role)
  VALUES (v_campaign_id, v_actor, 'warden');

  RETURN v_campaign_id;
END;
$$;

-- Preserve the six-argument signature used by current and transitional clients.
CREATE OR REPLACE FUNCTION public.create_guild_with_code(
  p_name TEXT,
  p_description TEXT,
  p_motto TEXT,
  p_leader_user_id UUID,
  p_campaign_id UUID DEFAULT NULL,
  p_character_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_guild_id UUID;
  v_share_code TEXT;
  v_attempts INTEGER := 0;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF p_leader_user_id IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'Actor mismatch' USING ERRCODE = '42501';
  END IF;

  IF NULLIF(btrim(p_name), '') IS NULL THEN
    RAISE EXCEPTION 'Guild name is required' USING ERRCODE = '22023';
  END IF;

  IF p_character_id IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'Character ownership validation failed' USING ERRCODE = '42501';
  END IF;

  IF p_campaign_id IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM public.campaign_members AS member_row
    WHERE member_row.campaign_id = p_campaign_id
      AND member_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'Campaign membership required' USING ERRCODE = '42501';
  END IF;

  LOOP
    v_share_code := public.generate_share_code();
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.guilds AS guild_row
      WHERE guild_row.share_code = v_share_code
    );

    v_attempts := v_attempts + 1;
    IF v_attempts >= 10 THEN
      RAISE EXCEPTION 'Unable to allocate guild share code';
    END IF;
  END LOOP;

  INSERT INTO public.guilds (
    name,
    description,
    motto,
    leader_user_id,
    campaign_id,
    share_code
  )
  VALUES (
    btrim(p_name),
    NULLIF(btrim(p_description), ''),
    NULLIF(btrim(p_motto), ''),
    v_actor,
    p_campaign_id,
    v_share_code
  )
  RETURNING id INTO v_guild_id;

  INSERT INTO public.guild_members (
    guild_id,
    user_id,
    character_id,
    role
  )
  VALUES (v_guild_id, v_actor, p_character_id, 'leader');

  RETURN v_guild_id;
END;
$$;

-- The trigger is not an RPC. Serialize per-user inserts to prevent concurrent
-- requests from both observing five characters and inserting a seventh.
CREATE OR REPLACE FUNCTION public.enforce_character_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF NEW.user_id IS NOT NULL
     AND (NEW.notes IS NULL OR NEW.notes NOT LIKE '%[SANDBOX_NPC]%') THEN
    PERFORM pg_advisory_xact_lock(hashtextextended(NEW.user_id::text, 0));

    IF (
      SELECT count(*)
      FROM public.characters AS character_row
      WHERE character_row.user_id = NEW.user_id
        AND (
          character_row.notes IS NULL
          OR character_row.notes NOT LIKE '%[SANDBOX_NPC]%'
        )
    ) >= 6 THEN
      RAISE EXCEPTION 'Character limit reached: a user may have at most 6 characters'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_character_xp(
  character_id UUID,
  xp_amount INTEGER,
  campaign_id UUID DEFAULT NULL,
  reason TEXT DEFAULT 'XP Reward'
)
RETURNS TABLE (
  success BOOLEAN,
  new_xp_total INTEGER,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_current_xp INTEGER;
  v_new_xp INTEGER;
  v_character_name TEXT;
  v_character_owner UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF xp_amount IS NULL OR xp_amount <= 0 THEN
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
  WHERE character_row.id = character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 'Character not found'::TEXT;
    RETURN;
  END IF;

  IF campaign_id IS NULL THEN
    IF v_character_owner IS DISTINCT FROM v_actor THEN
      RAISE EXCEPTION 'Character ownership validation failed' USING ERRCODE = '42501';
    END IF;
  ELSE
    IF NOT public.is_campaign_system(campaign_id, v_actor) THEN
      RAISE EXCEPTION 'Only campaign Wardens can award XP' USING ERRCODE = '42501';
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM public.campaign_members AS member_row
      WHERE member_row.campaign_id = campaign_id
        AND member_row.character_id = character_id
    ) AND NOT EXISTS (
      SELECT 1
      FROM public.campaign_member_characters AS link_row
      JOIN public.campaign_members AS member_row
        ON member_row.id = link_row.campaign_member_id
      WHERE member_row.campaign_id = campaign_id
        AND link_row.character_id = character_id
    ) AND NOT EXISTS (
      SELECT 1
      FROM public.campaign_character_shares AS share_row
      WHERE share_row.campaign_id = campaign_id
        AND share_row.character_id = character_id
    ) THEN
      RAISE EXCEPTION 'Target character is not linked to this campaign'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  v_new_xp := COALESCE(v_current_xp, 0) + xp_amount;

  UPDATE public.characters AS character_row
  SET experience = v_new_xp,
      updated_at = now()
  WHERE character_row.id = character_id;

  IF campaign_id IS NOT NULL THEN
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
      campaign_id,
      v_actor,
      'reward',
      'XP Award',
      format('%s gained %s XP', v_character_name, xp_amount),
      jsonb_build_object(
        'character_id', character_id,
        'xp_amount', xp_amount,
        'previous_xp', v_current_xp,
        'new_xp', v_new_xp,
        'reason', reason
      ),
      now()
    );
  END IF;

  RETURN QUERY SELECT
    true,
    v_new_xp,
    format('%s gained %s XP (Total: %s)', v_character_name, xp_amount, v_new_xp)::TEXT;
END;
$$;

-- This function already validates campaign Warden/co-Warden authority and target
-- membership. Tighten its execution environment without replacing its body.
ALTER FUNCTION public.warden_grant_character_equipment(UUID, JSONB)
  SET search_path TO pg_catalog, public, extensions;

-- ---------------------------------------------------------------------------
-- 3. Anonymous campaign and invite preview contracts
-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.get_campaign_by_share_code(TEXT);
CREATE FUNCTION public.get_campaign_by_share_code(p_share_code TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  share_code TEXT,
  is_active BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT
    campaign_row.id,
    campaign_row.name,
    campaign_row.description,
    campaign_row.share_code,
    campaign_row.is_active
  FROM public.campaigns AS campaign_row
  WHERE campaign_row.share_code = upper(btrim(COALESCE(p_share_code, '')))
    AND campaign_row.is_active = true
  LIMIT 1;
$$;

DROP FUNCTION IF EXISTS public.get_campaign_invite_by_token(TEXT);
CREATE FUNCTION public.get_campaign_invite_by_token(p_token TEXT)
RETURNS TABLE (
  campaign_id UUID,
  campaign_name TEXT,
  campaign_description TEXT,
  role TEXT,
  expires_at TIMESTAMPTZ,
  status TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_key TEXT := btrim(COALESCE(p_token, ''));
  v_key_hash TEXT;
BEGIN
  IF v_key = '' THEN
    RETURN;
  END IF;

  v_key_hash := public.hash_campaign_invite_token(v_key);

  RETURN QUERY
  SELECT
    campaign_row.id,
    campaign_row.name,
    campaign_row.description,
    CASE invite_row.role
      WHEN 'co-system' THEN 'co-warden'
      WHEN 'hunter' THEN 'ascendant'
      ELSE invite_row.role
    END,
    invite_row.expires_at,
    CASE
      WHEN invite_row.revoked_at IS NOT NULL THEN 'revoked'
      WHEN invite_row.expires_at IS NOT NULL AND invite_row.expires_at < now() THEN 'expired'
      WHEN invite_row.max_uses IS NOT NULL AND invite_row.used_count >= invite_row.max_uses THEN 'used_up'
      ELSE 'active'
    END
  FROM public.campaign_invites AS invite_row
  JOIN public.campaigns AS campaign_row
    ON campaign_row.id = invite_row.campaign_id
  WHERE campaign_row.is_active = true
    AND (
      invite_row.join_code = upper(v_key)
      OR invite_row.token_hash = v_key_hash
    )
  ORDER BY invite_row.created_at DESC
  LIMIT 1;
END;
$$;

-- Internal invite helpers stay in place for compatibility between database
-- functions, but are no longer executable by API roles after the global revoke.
ALTER FUNCTION public.resolve_campaign_invite(TEXT)
  SET search_path TO pg_catalog, public, extensions;

-- ---------------------------------------------------------------------------
-- 4. Public Storage delivery without public object enumeration
-- ---------------------------------------------------------------------------

UPDATE storage.buckets
SET public = true
WHERE id IN (
  'audio-tracks',
  'character-avatars',
  'character-portraits',
  'custom-tokens',
  'generated-art'
);

DROP POLICY IF EXISTS "Public read access for audio tracks" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for character portraits" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for custom tokens" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for generated art" ON storage.objects;
DROP POLICY IF EXISTS "Owners can select their public assets" ON storage.objects;

-- Remove drifted broad SELECT policies by behavior as well as by historical
-- name. Owner-scoped policies containing auth.uid() are deliberately retained.
DO $$
DECLARE
  policy_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND cmd = 'SELECT'
      AND COALESCE(qual, '') NOT LIKE '%auth.uid()%'
      AND (
        COALESCE(qual, '') LIKE '%audio-tracks%'
        OR COALESCE(qual, '') LIKE '%character-avatars%'
        OR COALESCE(qual, '') LIKE '%character-portraits%'
        OR COALESCE(qual, '') LIKE '%custom-tokens%'
        OR COALESCE(qual, '') LIKE '%generated-art%'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_row.policyname);
  END LOOP;
END;
$$;

-- Public delivery uses /object/public/... and does not require this SELECT
-- policy. This narrow policy exists only so authenticated owners can perform
-- Storage update workflows that require selecting their known object first.
CREATE POLICY "Owners can select their public assets"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id IN (
      'audio-tracks',
      'character-avatars',
      'character-portraits',
      'custom-tokens',
      'generated-art'
    )
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::TEXT
  );

-- ---------------------------------------------------------------------------
-- 5. Opt-in function execution grants
-- ---------------------------------------------------------------------------

-- Arbitrary SQL has no valid client or maintenance use; privileged operators
-- already have direct SQL access. Do not retain it as an RPC.
DROP FUNCTION IF EXISTS public.exec_sql(TEXT);

REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA app_private FROM PUBLIC, anon, authenticated;

-- RLS policies can execute this helper, but app_private is not an exposed
-- PostgREST schema, so it cannot be reached as an RPC.
GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.is_account_admin() TO authenticated;

-- The only intentional anonymous RPC exceptions.
GRANT EXECUTE ON FUNCTION public.get_campaign_by_share_code(TEXT)
  TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_campaign_invite_by_token(TEXT)
  TO anon, authenticated;

-- Reviewed authenticated compatibility surface. Exact OIDs/signatures are
-- granted at migration time; names are listed so source review remains concise,
-- while stale functions outside this list stay revoked. Transitional overloads
-- under an approved name must still satisfy the authorization checks documented
-- in the security exception register.
DO $$
DECLARE
  function_row RECORD;
  approved_names CONSTANT TEXT[] := ARRAY[
    'accept_bureau_contract',
    'add_ascendant_character_to_campaign',
    'add_campaign_session_log',
    'add_player_character_to_campaign',
    'add_user_notification',
    'admin_set_user_ban',
    'admin_set_user_role',
    'advance_combat_turn',
    'approve_guild_join_request',
    'assign_campaign_loot',
    'assign_campaign_relic',
    'assign_daily_quests',
    'attempt_taming',
    'bureau_guild_leaderboard',
    'can_manage_homebrew_content',
    'can_view_homebrew_content',
    'claim_anomaly_controller',
    'claim_quest_rewards',
    'complete_session_quest',
    'create_campaign_invite',
    'create_campaign_with_code',
    'create_guild_with_code',
    'create_session_quest',
    'deploy_campaign_encounter',
    'end_active_session',
    'end_session_combat',
    'export_campaign_bundle',
    'generate_character_share_token_for_character',
    'get_accessible_sourcebooks',
    'get_campaign_by_share_code',
    'get_campaign_invite_by_token',
    'get_campaign_linked_characters',
    'get_character_by_share_token',
    'gift_marketplace_item',
    'guild_member_role',
    'is_campaign_active',
    'is_campaign_dm',
    'is_campaign_member',
    'is_campaign_system',
    'is_campaign_warden',
    'is_dm_or_admin',
    'is_warden_or_admin',
    'join_campaign_by_code',
    'join_campaign_by_id',
    'mark_user_notification_read',
    'on_long_rest_assign_quests',
    'record_marketplace_download',
    'redeem_campaign_invite',
    'release_anomaly_controller',
    'request_to_join_guild',
    'resolve_guild_quest',
    'revoke_campaign_invite',
    'save_campaign_encounter',
    'search_compendium_jobs',
    'search_compendium_monarchs',
    'search_compendium_monsters',
    'search_compendium_paths',
    'search_compendium_powers',
    'search_compendium_relics',
    'set_homebrew_content_status',
    'share_campaign_sourcebook',
    'start_active_session',
    'start_session_combat',
    'update_character_xp',
    'upsert_campaign_session',
    'upsert_marketplace_review',
    'upsert_user_sourcebook_entitlement',
    'user_has_sourcebook_access',
    'validate_level_gate',
    'warden_grant_character_equipment'
  ];
BEGIN
  FOR function_row IN
    SELECT function_row_oid.oid
    FROM pg_proc AS function_row_oid
    JOIN pg_namespace AS namespace_row
      ON namespace_row.oid = function_row_oid.pronamespace
    WHERE namespace_row.nspname = 'public'
      AND function_row_oid.prokind = 'f'
      AND function_row_oid.proname = ANY(approved_names)
  LOOP
    EXECUTE format(
      'GRANT EXECUTE ON FUNCTION %s TO authenticated',
      function_row.oid::regprocedure
    );
  END LOOP;
END;
$$;

-- ---------------------------------------------------------------------------
-- 5a. Reviewed compatibility wrappers and exact-signature execution boundary
-- ---------------------------------------------------------------------------

-- The legacy name-based grant above preserves compatibility while this migration
-- is being assembled against drifted catalogs. The final grant reset below is
-- authoritative: stale overloads, internal wrappers, and unreviewed functions
-- remain inaccessible to API roles.

-- Broken legacy quest overloads reference columns removed by the campaign-scoped
-- quest migration. Keeping them would also make default-argument resolution
-- ambiguous, so remove them rather than merely hiding them.
DROP FUNCTION IF EXISTS public.complete_session_quest(UUID);
DROP FUNCTION IF EXISTS public.create_session_quest(UUID, TEXT, TEXT, JSONB, TEXT[]);

-- The application uses the newer campaign-combat model. The old active-session
-- turn RPC has no actor check and is intentionally left without an API grant.
REVOKE EXECUTE ON FUNCTION public.advance_combat_turn(UUID)
  FROM PUBLIC, anon, authenticated;

-- Campaign-session writes must pass a positive Warden/co-Warden check before the
-- compatibility body runs. This closes the legacy NULL/NOT IN authorization gap.
ALTER FUNCTION public.upsert_campaign_session(
  UUID, UUID, TEXT, TEXT, TIMESTAMPTZ, TEXT, TEXT, TEXT, UUID
) RENAME TO upsert_campaign_session_unchecked;

CREATE FUNCTION public.upsert_campaign_session(
  p_campaign_id UUID,
  p_session_id UUID DEFAULT NULL,
  p_title TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_scheduled_for TIMESTAMPTZ DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_recurrence_rule TEXT DEFAULT NULL,
  p_recurrence_parent_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF NOT public.is_campaign_system(p_campaign_id, v_actor) THEN
    RAISE EXCEPTION 'CAMPAIGN_SESSION_FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  RETURN public.upsert_campaign_session_unchecked(
    p_campaign_id,
    p_session_id,
    p_title,
    p_description,
    p_scheduled_for,
    p_status,
    p_location,
    p_recurrence_rule,
    p_recurrence_parent_id
  );
END;
$$;

-- Cross-user notifications are allowed only for a concrete campaign
-- relationship carried in payload.campaign_id. Self-targeted notifications
-- remain available to every authenticated caller.
ALTER FUNCTION public.add_user_notification(
  UUID, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TIMESTAMPTZ
) RENAME TO add_user_notification_unchecked;

CREATE FUNCTION public.add_user_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_priority TEXT DEFAULT 'normal',
  p_category TEXT DEFAULT NULL,
  p_payload JSONB DEFAULT '{}'::JSONB,
  p_link TEXT DEFAULT NULL,
  p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_campaign_text TEXT := COALESCE(p_payload, '{}'::JSONB) ->> 'campaign_id';
  v_campaign_id UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_user_id IS DISTINCT FROM v_actor THEN
    IF p_type NOT IN ('mention', 'campaign_invite')
       OR v_campaign_text IS NULL
       OR v_campaign_text !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN
      RAISE EXCEPTION 'NOTIFICATION_TARGET_FORBIDDEN' USING ERRCODE = '42501';
    END IF;

    v_campaign_id := v_campaign_text::UUID;

    IF NOT (
      public.is_campaign_member(v_campaign_id, v_actor)
      OR public.is_campaign_warden(v_campaign_id, v_actor)
    ) THEN
      RAISE EXCEPTION 'NOTIFICATION_TARGET_FORBIDDEN' USING ERRCODE = '42501';
    END IF;

    IF p_type = 'mention' AND NOT (
      public.is_campaign_member(v_campaign_id, p_user_id)
      OR public.is_campaign_warden(v_campaign_id, p_user_id)
    ) THEN
      RAISE EXCEPTION 'NOTIFICATION_TARGET_FORBIDDEN' USING ERRCODE = '42501';
    END IF;

    IF p_type = 'campaign_invite' AND NOT EXISTS (
      SELECT 1
      FROM public.campaigns AS campaign_row
      WHERE campaign_row.id = v_campaign_id
        AND campaign_row.warden_id = p_user_id
    ) THEN
      RAISE EXCEPTION 'NOTIFICATION_TARGET_FORBIDDEN' USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN public.add_user_notification_unchecked(
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_priority,
    p_category,
    p_payload,
    p_link,
    p_expires_at
  );
END;
$$;

-- Daily-quest generation and long-rest penalties mutate a character. Keep the
-- legacy algorithms behind owner-bound wrappers instead of exposing actor-free
-- definer routines.
ALTER FUNCTION public.assign_daily_quests(UUID)
  RENAME TO assign_daily_quests_unchecked;

CREATE FUNCTION public.assign_daily_quests(p_character_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
BEGIN
  IF v_actor IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  PERFORM public.assign_daily_quests_unchecked(p_character_id);
END;
$$;

ALTER FUNCTION public.on_long_rest_assign_quests(UUID)
  RENAME TO on_long_rest_assign_quests_unchecked;

CREATE FUNCTION public.on_long_rest_assign_quests(p_character_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
BEGIN
  IF v_actor IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  PERFORM public.on_long_rest_assign_quests_unchecked(p_character_id);
END;
$$;

-- Restore the character-sharing contract: only the owner can rotate a token,
-- the token is persisted, and lookup requires both the character id and token.
CREATE OR REPLACE FUNCTION public.generate_character_share_token_for_character(
  p_character_id UUID
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_token TEXT;
BEGIN
  IF v_actor IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  LOOP
    v_token := public.generate_character_share_token(12);
    EXIT WHEN NOT EXISTS (
      SELECT 1
      FROM public.characters AS character_row
      WHERE character_row.share_token = v_token
    ) AND NOT EXISTS (
      SELECT 1
      FROM public.character_shares AS share_row
      WHERE share_row.token = v_token
    );
  END LOOP;

  UPDATE public.characters
  SET share_token = v_token,
      updated_at = now()
  WHERE id = p_character_id;

  RETURN v_token;
END;
$$;

DROP FUNCTION IF EXISTS public.get_character_by_share_token(TEXT);
DROP FUNCTION IF EXISTS public.get_character_by_share_token(UUID, TEXT);
CREATE FUNCTION public.get_character_by_share_token(
  p_character_id UUID,
  p_share_token TEXT
)
RETURNS SETOF public.characters
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT character_row.*
  FROM public.characters AS character_row
  WHERE character_row.id = p_character_id
    AND character_row.share_token = NULLIF(btrim(p_share_token), '');
$$;

-- Browser marketplace mutations are always self-scoped. Administrative
-- backfills require a separate trusted service path, never a gameplay role.
ALTER FUNCTION public.record_marketplace_download(UUID, UUID)
  RENAME TO record_marketplace_download_unchecked;

CREATE FUNCTION public.record_marketplace_download(
  p_item_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  IF auth.uid() IS NULL OR p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'MARKETPLACE_USER_CONTEXT_FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  PERFORM public.record_marketplace_download_unchecked(p_item_id, p_user_id);
END;
$$;

ALTER FUNCTION public.upsert_marketplace_review(UUID, INTEGER, TEXT, UUID)
  RENAME TO upsert_marketplace_review_unchecked;

CREATE FUNCTION public.upsert_marketplace_review(
  p_item_id UUID,
  p_rating INTEGER,
  p_comment TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  IF auth.uid() IS NULL OR p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'MARKETPLACE_USER_CONTEXT_FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  RETURN public.upsert_marketplace_review_unchecked(
    p_item_id,
    p_rating,
    p_comment,
    p_user_id
  );
END;
$$;

-- Global homebrew moderation uses the service-controlled account-admin claim.
-- Campaign Wardens may moderate only content already attached to their campaign;
-- ordinary owners retain control of their own content.
CREATE OR REPLACE FUNCTION public.set_homebrew_content_status(
  p_homebrew_id UUID,
  p_status TEXT,
  p_visibility_scope TEXT DEFAULT NULL,
  p_campaign_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_owner UUID;
  v_visibility_scope TEXT;
  v_existing_campaign_id UUID;
  v_target_campaign_id UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_status NOT IN ('draft', 'published', 'archived') THEN
    RAISE EXCEPTION 'INVALID_HOMEBREW_STATUS' USING ERRCODE = '22023';
  END IF;

  SELECT
    content_row.user_id,
    COALESCE(p_visibility_scope, content_row.visibility_scope),
    content_row.campaign_id
  INTO
    v_owner,
    v_visibility_scope,
    v_existing_campaign_id
  FROM public.homebrew_content AS content_row
  WHERE content_row.id = p_homebrew_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'HOMEBREW_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_owner IS DISTINCT FROM v_actor
     AND NOT app_private.is_account_admin()
     AND NOT (
       v_existing_campaign_id IS NOT NULL
       AND public.is_campaign_system(v_existing_campaign_id, v_actor)
     ) THEN
    RAISE EXCEPTION 'HOMEBREW_FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  IF v_visibility_scope NOT IN ('private', 'campaign', 'public') THEN
    RAISE EXCEPTION 'INVALID_VISIBILITY_SCOPE' USING ERRCODE = '22023';
  END IF;

  IF p_status = 'published' AND v_visibility_scope = 'private' THEN
    v_visibility_scope := 'public';
  END IF;

  v_target_campaign_id := COALESCE(p_campaign_id, v_existing_campaign_id);

  IF v_visibility_scope = 'campaign' AND v_target_campaign_id IS NULL THEN
    RAISE EXCEPTION 'CAMPAIGN_ID_REQUIRED_FOR_CAMPAIGN_VISIBILITY'
      USING ERRCODE = '22023';
  END IF;

  IF v_visibility_scope = 'campaign'
     AND NOT app_private.is_account_admin()
     AND NOT (
       public.is_campaign_member(v_target_campaign_id, v_actor)
       OR public.is_campaign_system(v_target_campaign_id, v_actor)
     ) THEN
    RAISE EXCEPTION 'CAMPAIGN_VISIBILITY_FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  UPDATE public.homebrew_content
  SET status = p_status,
      visibility_scope = v_visibility_scope,
      campaign_id = CASE
        WHEN v_visibility_scope = 'campaign' THEN v_target_campaign_id
        ELSE NULL
      END,
      updated_by = v_actor,
      updated_at = now()
  WHERE id = p_homebrew_id;

  RETURN p_homebrew_id;
END;
$$;

-- Quest rewards require both caller membership and a character linked to the
-- quest's campaign before the legacy transactional award body runs.
ALTER FUNCTION public.claim_quest_rewards(UUID, UUID)
  RENAME TO claim_quest_rewards_unchecked;

CREATE FUNCTION public.claim_quest_rewards(
  p_quest_id UUID,
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
  v_campaign_id UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT quest_row.campaign_id
  INTO v_campaign_id
  FROM public.session_quests AS quest_row
  WHERE quest_row.id = p_quest_id
    AND quest_row.status = 'completed';

  IF v_campaign_id IS NULL THEN
    RAISE EXCEPTION 'QUEST_NOT_FOUND_OR_NOT_COMPLETED' USING ERRCODE = 'P0002';
  END IF;

  IF NOT (
    public.is_campaign_member(v_campaign_id, v_actor)
    OR public.is_campaign_warden(v_campaign_id, v_actor)
  ) THEN
    RAISE EXCEPTION 'QUEST_CAMPAIGN_MEMBERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) OR NOT (
    EXISTS (
      SELECT 1
      FROM public.campaign_members AS member_row
      WHERE member_row.campaign_id = v_campaign_id
        AND member_row.character_id = p_character_id
    )
    OR EXISTS (
      SELECT 1
      FROM public.campaign_member_characters AS link_row
      JOIN public.campaign_members AS member_row
        ON member_row.id = link_row.campaign_member_id
      WHERE member_row.campaign_id = v_campaign_id
        AND link_row.character_id = p_character_id
    )
    OR EXISTS (
      SELECT 1
      FROM public.campaign_character_shares AS share_row
      WHERE share_row.campaign_id = v_campaign_id
        AND share_row.character_id = p_character_id
    )
  ) THEN
    RAISE EXCEPTION 'QUEST_CHARACTER_LINK_REQUIRED' USING ERRCODE = '42501';
  END IF;

  PERFORM public.claim_quest_rewards_unchecked(p_quest_id, p_character_id);
END;
$$;

-- Taming remains a player action, but derived DC/HP values must match the
-- canonical anomaly row and the selected character must be linked to the target
-- campaign. The roll itself remains a gameplay input and is range-checked.
ALTER FUNCTION public.attempt_taming(
  UUID, UUID, TEXT, INTEGER, INTEGER, INTEGER, INTEGER, TEXT
) RENAME TO attempt_taming_unchecked;

CREATE FUNCTION public.attempt_taming(
  p_campaign_id UUID,
  p_character_id UUID,
  p_anomaly_id TEXT,
  p_roll_total INTEGER,
  p_dc INTEGER,
  p_initial_hp INTEGER,
  p_bond_initial INTEGER DEFAULT 1,
  p_nickname TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_expected_hp INTEGER;
  v_rank TEXT;
  v_expected_dc INTEGER;
BEGIN
  IF v_actor IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_anomaly_id IS NULL
     OR p_anomaly_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
     OR p_roll_total NOT BETWEEN 1 AND 100
     OR p_bond_initial NOT BETWEEN 1 AND 10 THEN
    RAISE EXCEPTION 'INVALID_TAMING_INPUT' USING ERRCODE = '22023';
  END IF;

  SELECT
    anomaly_row.hit_points_average,
    COALESCE(anomaly_row.gate_rank, anomaly_row.rank, 'D')
  INTO
    v_expected_hp,
    v_rank
  FROM public."compendium_Anomalies" AS anomaly_row
  WHERE anomaly_row.id = p_anomaly_id::UUID;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'ANOMALY_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  v_expected_dc := CASE upper(v_rank)
    WHEN 'E' THEN 10
    WHEN 'D' THEN 12
    WHEN 'C' THEN 14
    WHEN 'B' THEN 16
    WHEN 'A' THEN 18
    WHEN 'S' THEN 20
    ELSE 13
  END;

  IF p_dc IS DISTINCT FROM v_expected_dc
     OR p_initial_hp IS DISTINCT FROM GREATEST(1, v_expected_hp) THEN
    RAISE EXCEPTION 'TAMING_DERIVED_VALUE_MISMATCH' USING ERRCODE = '22023';
  END IF;

  IF p_campaign_id IS NOT NULL AND NOT (
    EXISTS (
      SELECT 1
      FROM public.campaign_members AS member_row
      WHERE member_row.campaign_id = p_campaign_id
        AND member_row.character_id = p_character_id
        AND member_row.user_id = v_actor
    )
    OR EXISTS (
      SELECT 1
      FROM public.campaign_member_characters AS link_row
      JOIN public.campaign_members AS member_row
        ON member_row.id = link_row.campaign_member_id
      WHERE member_row.campaign_id = p_campaign_id
        AND member_row.user_id = v_actor
        AND link_row.character_id = p_character_id
    )
    OR EXISTS (
      SELECT 1
      FROM public.campaign_character_shares AS share_row
      WHERE share_row.campaign_id = p_campaign_id
        AND share_row.character_id = p_character_id
        AND share_row.shared_by = v_actor
    )
  ) THEN
    RAISE EXCEPTION 'TAMING_CHARACTER_LINK_REQUIRED' USING ERRCODE = '42501';
  END IF;

  RETURN public.attempt_taming_unchecked(
    p_campaign_id,
    p_character_id,
    p_anomaly_id,
    p_roll_total,
    p_dc,
    p_initial_hp,
    p_bond_initial,
    p_nickname
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_anomaly_controller(
  p_tamed_id UUID,
  p_character_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_campaign_id UUID;
BEGIN
  IF v_actor IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT tamed_row.campaign_id
  INTO v_campaign_id
  FROM public.campaign_tamed_anomalies AS tamed_row
  WHERE tamed_row.id = p_tamed_id;

  IF v_campaign_id IS NULL THEN
    RAISE EXCEPTION 'TAMED_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF NOT (
    EXISTS (
      SELECT 1
      FROM public.campaign_members AS member_row
      WHERE member_row.campaign_id = v_campaign_id
        AND member_row.user_id = v_actor
        AND member_row.character_id = p_character_id
    )
    OR EXISTS (
      SELECT 1
      FROM public.campaign_member_characters AS link_row
      JOIN public.campaign_members AS member_row
        ON member_row.id = link_row.campaign_member_id
      WHERE member_row.campaign_id = v_campaign_id
        AND member_row.user_id = v_actor
        AND link_row.character_id = p_character_id
    )
    OR EXISTS (
      SELECT 1
      FROM public.campaign_character_shares AS share_row
      WHERE share_row.campaign_id = v_campaign_id
        AND share_row.character_id = p_character_id
        AND share_row.shared_by = v_actor
    )
  ) THEN
    RAISE EXCEPTION 'CONTROLLER_CHARACTER_LINK_REQUIRED' USING ERRCODE = '42501';
  END IF;

  UPDATE public.campaign_tamed_anomalies AS tamed_row
  SET current_controller_character_id = p_character_id,
      updated_at = now()
  WHERE tamed_row.id = p_tamed_id
    AND (
      tamed_row.current_controller_character_id IS NULL
      OR tamed_row.current_controller_character_id = p_character_id
      OR NOT (
        EXISTS (
          SELECT 1
          FROM public.campaign_members AS member_row
          WHERE member_row.campaign_id = tamed_row.campaign_id
            AND member_row.character_id = tamed_row.current_controller_character_id
        )
        OR EXISTS (
          SELECT 1
          FROM public.campaign_member_characters AS link_row
          JOIN public.campaign_members AS member_row
            ON member_row.id = link_row.campaign_member_id
          WHERE member_row.campaign_id = tamed_row.campaign_id
            AND link_row.character_id = tamed_row.current_controller_character_id
        )
        OR EXISTS (
          SELECT 1
          FROM public.campaign_character_shares AS share_row
          WHERE share_row.campaign_id = tamed_row.campaign_id
            AND share_row.character_id = tamed_row.current_controller_character_id
        )
      )
    );

  RETURN FOUND;
END;
$$;

-- Serialize invite redemption and reject exhausted invites for every caller who
-- has not already accepted that exact invite. Existing campaign membership alone
-- is not proof of prior consumption.
ALTER FUNCTION public.redeem_campaign_invite(TEXT, UUID)
  RENAME TO redeem_campaign_invite_unchecked;

CREATE FUNCTION public.redeem_campaign_invite(
  p_token TEXT,
  p_character_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_key TEXT := btrim(COALESCE(p_token, ''));
  v_hash TEXT;
  v_invite_id UUID;
  v_max_uses INTEGER;
  v_used_count INTEGER;
  v_existing_acceptance BOOLEAN;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF v_key = '' THEN
    RAISE EXCEPTION 'INVITE_TOKEN_REQUIRED' USING ERRCODE = '22023';
  END IF;

  v_hash := public.hash_campaign_invite_token(v_key);

  SELECT invite_row.id, invite_row.max_uses, invite_row.used_count
  INTO v_invite_id, v_max_uses, v_used_count
  FROM public.campaign_invites AS invite_row
  WHERE invite_row.join_code = upper(v_key)
     OR invite_row.token_hash = v_hash
  ORDER BY invite_row.created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF v_invite_id IS NULL THEN
    RAISE EXCEPTION 'INVITE_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.campaign_invite_audit_logs AS audit_row
    WHERE audit_row.invite_id = v_invite_id
      AND audit_row.actor_id = v_actor
      AND audit_row.action = 'invite_accepted'
  ) INTO v_existing_acceptance;

  IF v_max_uses IS NOT NULL
     AND v_used_count >= v_max_uses
     AND NOT v_existing_acceptance THEN
    RAISE EXCEPTION 'INVITE_ALREADY_USED' USING ERRCODE = '42501';
  END IF;

  RETURN public.redeem_campaign_invite_unchecked(p_token, p_character_id);
END;
$$;

-- Lock guild quests before reward resolution so concurrent calls cannot credit
-- the same quest twice. Negative reward minting is rejected at this boundary.
ALTER FUNCTION public.resolve_guild_quest(UUID, BOOLEAN)
  RENAME TO resolve_guild_quest_unchecked;

CREATE FUNCTION public.resolve_guild_quest(
  p_quest_id UUID,
  p_success BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_quest public.guild_quests%ROWTYPE;
BEGIN
  SELECT *
  INTO v_quest
  FROM public.guild_quests AS quest_row
  WHERE quest_row.id = p_quest_id
  FOR UPDATE;

  IF NOT FOUND OR v_quest.status <> 'active' THEN
    RAISE EXCEPTION 'QUEST_NOT_FOUND_OR_ALREADY_RESOLVED' USING ERRCODE = 'P0002';
  END IF;

  IF NOT (
    EXISTS (
      SELECT 1
      FROM public.guilds AS guild_row
      WHERE guild_row.id = v_quest.guild_id
        AND guild_row.leader_user_id = auth.uid()
    )
    OR public.guild_member_role(v_quest.guild_id, auth.uid())
       IN ('leader', 'vice_master', 'officer')
  ) THEN
    RAISE EXCEPTION 'GUILD_OFFICER_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF COALESCE((v_quest.rewards ->> 'funds')::INTEGER, 0) < 0
     OR COALESCE((v_quest.rewards ->> 'contribution')::INTEGER, 0) < 0 THEN
    RAISE EXCEPTION 'INVALID_GUILD_QUEST_REWARDS' USING ERRCODE = '22023';
  END IF;

  PERFORM public.resolve_guild_quest_unchecked(p_quest_id, p_success);
END;
$$;

-- Optional reward references must belong to the campaign, and item values must
-- be nonnegative before the legacy ledger body computes totals.
ALTER FUNCTION public.assign_campaign_loot(UUID, JSONB, UUID, UUID, UUID)
  RENAME TO assign_campaign_loot_unchecked;

CREATE FUNCTION public.assign_campaign_loot(
  p_campaign_id UUID,
  p_items JSONB,
  p_encounter_id UUID DEFAULT NULL,
  p_session_id UUID DEFAULT NULL,
  p_assigned_to_member_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  IF NOT public.is_campaign_system(p_campaign_id, auth.uid()) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF jsonb_typeof(p_items) <> 'array' OR EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_items) AS item
    WHERE COALESCE((item ->> 'quantity')::NUMERIC, 1) <= 0
       OR COALESCE((item ->> 'value_credits')::NUMERIC, (item ->> 'value')::NUMERIC, 0) < 0
  ) THEN
    RAISE EXCEPTION 'INVALID_LOOT_ITEMS' USING ERRCODE = '22023';
  END IF;

  IF p_encounter_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.campaign_encounters
    WHERE id = p_encounter_id AND campaign_id = p_campaign_id
  ) THEN
    RAISE EXCEPTION 'LOOT_ENCOUNTER_MISMATCH' USING ERRCODE = '22023';
  END IF;

  IF p_session_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.campaign_sessions
    WHERE id = p_session_id AND campaign_id = p_campaign_id
  ) THEN
    RAISE EXCEPTION 'LOOT_SESSION_MISMATCH' USING ERRCODE = '22023';
  END IF;

  IF p_assigned_to_member_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.campaign_members
    WHERE id = p_assigned_to_member_id AND campaign_id = p_campaign_id
  ) THEN
    RAISE EXCEPTION 'LOOT_MEMBER_MISMATCH' USING ERRCODE = '22023';
  END IF;

  RETURN public.assign_campaign_loot_unchecked(
    p_campaign_id,
    p_items,
    p_encounter_id,
    p_session_id,
    p_assigned_to_member_id
  );
END;
$$;

ALTER FUNCTION public.assign_campaign_relic(
  UUID, UUID, TEXT, TEXT, JSONB, NUMERIC, UUID, BOOLEAN
) RENAME TO assign_campaign_relic_unchecked;

CREATE FUNCTION public.assign_campaign_relic(
  p_campaign_id UUID,
  p_relic_id UUID DEFAULT NULL,
  p_name TEXT DEFAULT NULL,
  p_rarity TEXT DEFAULT NULL,
  p_properties JSONB DEFAULT '{}'::JSONB,
  p_value_credits NUMERIC DEFAULT NULL,
  p_bound_to_member_id UUID DEFAULT NULL,
  p_tradeable BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  IF NOT public.is_campaign_system(p_campaign_id, auth.uid()) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_value_credits IS NOT NULL AND p_value_credits < 0 THEN
    RAISE EXCEPTION 'INVALID_RELIC_VALUE' USING ERRCODE = '22023';
  END IF;

  IF p_bound_to_member_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.campaign_members
    WHERE id = p_bound_to_member_id AND campaign_id = p_campaign_id
  ) THEN
    RAISE EXCEPTION 'RELIC_MEMBER_MISMATCH' USING ERRCODE = '22023';
  END IF;

  RETURN public.assign_campaign_relic_unchecked(
    p_campaign_id,
    p_relic_id,
    p_name,
    p_rarity,
    p_properties,
    p_value_credits,
    p_bound_to_member_id,
    p_tradeable
  );
END;
$$;

-- XP awards are first-class campaign log events. The hardened award RPC uses
-- this value, so keep the table contract aligned with the reviewed function.
ALTER TABLE public.campaign_session_logs
  DROP CONSTRAINT IF EXISTS campaign_session_logs_log_type_check;

ALTER TABLE public.campaign_session_logs
  ADD CONSTRAINT campaign_session_logs_log_type_check
  CHECK (log_type IN ('session', 'recap', 'loot', 'event', 'note', 'reward'));

-- Return entitlement data through one actor-bound projection. The legacy
-- user_has_sourcebook_access definer remains internal: granting it would expose
-- an arbitrary-user entitlement oracle and would make this invoker fail after
-- the exact ACL reset.
CREATE OR REPLACE FUNCTION public.get_accessible_sourcebooks(
  p_campaign_id UUID DEFAULT NULL,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  sourcebook_id TEXT,
  access_type TEXT,
  shared_by UUID,
  expires_at TIMESTAMPTZ
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
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_user_id IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'SOURCEBOOK_USER_CONTEXT_FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  IF p_campaign_id IS NOT NULL AND NOT (
    public.is_campaign_member(p_campaign_id, v_actor)
    OR public.is_campaign_warden(p_campaign_id, v_actor)
  ) THEN
    RAISE EXCEPTION 'SOURCEBOOK_CAMPAIGN_ACCESS_FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT DISTINCT
    accessible.sourcebook_id,
    accessible.access_type,
    accessible.shared_by,
    accessible.expires_at
  FROM (
    SELECT
      catalog_row.id AS sourcebook_id,
      'free'::TEXT AS access_type,
      NULL::UUID AS shared_by,
      NULL::TIMESTAMPTZ AS expires_at
    FROM public.sourcebook_catalog AS catalog_row
    WHERE catalog_row.is_free

    UNION ALL

    SELECT
      entitlement_row.sourcebook_id,
      entitlement_row.entitlement_type,
      entitlement_row.user_id,
      entitlement_row.expires_at
    FROM public.user_sourcebook_entitlements AS entitlement_row
    WHERE entitlement_row.user_id = v_actor
      AND (
        entitlement_row.expires_at IS NULL
        OR entitlement_row.expires_at > now()
      )

    UNION ALL

    SELECT
      share_row.sourcebook_id,
      'campaign-share'::TEXT,
      share_row.shared_by,
      NULL::TIMESTAMPTZ
    FROM public.campaign_sourcebook_shares AS share_row
    JOIN public.user_sourcebook_entitlements AS grantor_entitlement
      ON grantor_entitlement.user_id = share_row.shared_by
     AND grantor_entitlement.sourcebook_id = share_row.sourcebook_id
     AND (
       grantor_entitlement.expires_at IS NULL
       OR grantor_entitlement.expires_at > now()
     )
    WHERE p_campaign_id IS NOT NULL
      AND share_row.campaign_id = p_campaign_id
  ) AS accessible;
END;
$$;

-- Reset the intermediate name-based grants, then opt in exact reviewed
-- signatures only. This prevents drifted overloads from becoming callable.
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA app_private FROM PUBLIC, anon, authenticated;

GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.is_account_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_campaign_by_share_code(TEXT)
  TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_campaign_invite_by_token(TEXT)
  TO anon, authenticated;

DO $$
DECLARE
  v_signature TEXT;
  v_function REGPROCEDURE;
  approved_signatures CONSTANT TEXT[] := ARRAY[
    'public.accept_bureau_contract(uuid,uuid)',
    'public.add_ascendant_character_to_campaign(uuid,uuid,text)',
    'public.add_campaign_session_log(uuid,uuid,text,text,text,jsonb,boolean)',
    'public.add_player_character_to_campaign(uuid,uuid,text)',
    'public.add_user_notification(uuid,text,text,text,text,text,jsonb,text,timestamptz)',
    'public.admin_set_user_ban(uuid,boolean)',
    'public.admin_set_user_role(uuid,text)',
    'public.approve_guild_join_request(uuid,text)',
    'public.assign_campaign_loot(uuid,jsonb,uuid,uuid,uuid)',
    'public.assign_campaign_relic(uuid,uuid,text,text,jsonb,numeric,uuid,boolean)',
    'public.assign_daily_quests(uuid)',
    'public.attempt_taming(uuid,uuid,text,integer,integer,integer,integer,text)',
    'public.bureau_guild_leaderboard()',
    'public.can_manage_homebrew_content(uuid,uuid)',
    'public.can_view_homebrew_content(uuid,uuid)',
    'public.claim_anomaly_controller(uuid,uuid)',
    'public.claim_quest_rewards(uuid,uuid)',
    'public.complete_session_quest(uuid,text)',
    'public.create_campaign_invite(uuid,text,timestamptz,integer,text)',
    'public.create_campaign_with_code(text,text,uuid)',
    'public.create_guild_with_code(text,text,text,uuid,uuid,uuid)',
    'public.create_session_quest(uuid,text,text,text[],jsonb)',
    'public.deploy_campaign_encounter(uuid)',
    'public.export_campaign_bundle(uuid)',
    'public.generate_character_share_token_for_character(uuid)',
    'public.get_accessible_sourcebooks(uuid,uuid)',
    'public.get_campaign_linked_characters(uuid)',
    'public.get_character_by_share_token(uuid,text)',
    'public.gift_marketplace_item(uuid,uuid,text)',
    'public.guild_member_role(uuid,uuid)',
    'public.is_campaign_active(uuid)',
    'public.is_campaign_dm(uuid,uuid)',
    'public.is_campaign_member(uuid,uuid)',
    'public.is_campaign_system(uuid,uuid)',
    'public.is_campaign_warden(uuid,uuid)',
    'public.is_dm_or_admin(uuid)',
    'public.is_warden_or_admin(uuid)',
    'public.join_campaign_by_code(text,uuid)',
    'public.mark_user_notification_read(uuid)',
    'public.on_long_rest_assign_quests(uuid)',
    'public.record_marketplace_download(uuid,uuid)',
    'public.redeem_campaign_invite(text,uuid)',
    'public.release_anomaly_controller(uuid)',
    'public.request_to_join_guild(text,uuid,text)',
    'public.resolve_guild_quest(uuid,boolean)',
    'public.revoke_campaign_invite(uuid,text)',
    'public.save_campaign_encounter(uuid,uuid,text,text,jsonb,jsonb,jsonb)',
    'public.search_compendium_jobs(text,integer,integer)',
    'public.search_compendium_monarchs(text,integer,integer)',
    'public.search_compendium_monsters(text,integer,integer)',
    'public.search_compendium_paths(text,integer,integer)',
    'public.search_compendium_powers(text,integer,integer)',
    'public.search_compendium_relics(text,integer,integer)',
    'public.set_homebrew_content_status(uuid,text,text,uuid)',
    'public.update_character_xp(uuid,integer,uuid,text)',
    'public.upsert_campaign_session(uuid,uuid,text,text,timestamptz,text,text,text,uuid)',
    'public.upsert_marketplace_review(uuid,integer,text,uuid)',
    'public.warden_grant_character_equipment(uuid,jsonb)'
  ];
BEGIN
  FOREACH v_signature IN ARRAY approved_signatures
  LOOP
    v_function := to_regprocedure(v_signature);
    IF v_function IS NULL THEN
      RAISE EXCEPTION 'Expected reviewed function is missing: %', v_signature;
    END IF;

    EXECUTE format(
      'GRANT EXECUTE ON FUNCTION %s TO authenticated',
      v_function
    );
  END LOOP;
END;
$$;

-- Explicitly keep internal/dangerous routines outside the client surface even
-- if a future compatibility list is edited carelessly.
DO $$
DECLARE
  function_row RECORD;
BEGIN
  FOR function_row IN
    SELECT function_row_oid.oid
    FROM pg_proc AS function_row_oid
    JOIN pg_namespace AS namespace_row
      ON namespace_row.oid = function_row_oid.pronamespace
    WHERE function_row_oid.proname IN (
      'attach_campaign_member_character',
      'enforce_character_limit',
      'generate_campaign_join_code',
      'generate_share_code',
      'hash_campaign_invite_token',
      'hypopg_reset',
      'log_campaign_invite_event',
      'normalize_campaign_invite_role',
      'prepare_search_text',
      'resolve_campaign_invite',
      'rls_auto_enable',
      'sync_compendium_data'
    )
      AND namespace_row.nspname NOT IN ('pg_catalog', 'information_schema')
  LOOP
    EXECUTE format(
      'REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated',
      function_row.oid::regprocedure
    );
  END LOOP;
END;
$$;

-- Ensure every non-extension application function has a stable resolution
-- environment. Existing explicitly configured paths are retained; missing paths
-- receive the least disruptive fixed path compatible with legacy bodies.
DO $$
DECLARE
  function_row RECORD;
BEGIN
  FOR function_row IN
    SELECT function_row_oid.oid
    FROM pg_proc AS function_row_oid
    JOIN pg_namespace AS namespace_row
      ON namespace_row.oid = function_row_oid.pronamespace
    WHERE namespace_row.nspname IN ('public', 'app_private')
      AND function_row_oid.prokind = 'f'
      AND NOT EXISTS (
        SELECT 1
        FROM pg_depend AS extension_dependency
        WHERE extension_dependency.classid = 'pg_proc'::regclass
          AND extension_dependency.objid = function_row_oid.oid
          AND extension_dependency.deptype = 'e'
      )
      AND NOT EXISTS (
        SELECT 1
        FROM unnest(COALESCE(function_row_oid.proconfig, ARRAY[]::TEXT[])) AS setting
        WHERE setting LIKE 'search_path=%'
      )
  LOOP
    EXECUTE format(
      'ALTER FUNCTION %s SET search_path TO pg_catalog, public, extensions',
      function_row.oid::regprocedure
    );
  END LOOP;
END;
$$;

COMMIT;

NOTIFY pgrst, 'reload schema';

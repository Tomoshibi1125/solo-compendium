BEGIN;

-- pgTAP lives in the extensions schema on hosted Supabase; SET LOCAL keeps
-- this visible for the test transaction only and rolls back with it.
SET LOCAL search_path = extensions, public, pg_catalog;

SELECT plan(21);

SELECT ok(
  to_regprocedure('public.get_campaign_roster(uuid)') IS NOT NULL
  AND to_regprocedure('public.set_campaign_member_role(uuid,uuid,text)') IS NOT NULL
  AND to_regprocedure('public.remove_campaign_member(uuid,uuid)') IS NOT NULL
  AND to_regprocedure('public.detach_campaign_member_character(uuid,uuid,uuid)') IS NOT NULL,
  'the reviewed campaign roster and management RPC signatures exist'
);

SELECT is(
  pg_get_function_result('public.get_campaign_roster(uuid)'::regprocedure),
  'TABLE(campaign_member_id uuid, user_id uuid, display_name text, role text, joined_at timestamp with time zone, character_id uuid, character_name text, character_level integer, character_job text, portrait_url text, is_shared boolean)',
  'campaign roster returns only the reviewed minimal DTO'
);

SELECT ok(
  (SELECT prosecdef FROM pg_proc WHERE oid = 'public.get_campaign_roster(uuid)'::regprocedure)
  AND (SELECT prosecdef FROM pg_proc WHERE oid = 'public.set_campaign_member_role(uuid,uuid,text)'::regprocedure)
  AND (SELECT prosecdef FROM pg_proc WHERE oid = 'public.remove_campaign_member(uuid,uuid)'::regprocedure)
  AND (SELECT prosecdef FROM pg_proc WHERE oid = 'public.detach_campaign_member_character(uuid,uuid,uuid)'::regprocedure),
  'API campaign RPCs retain their reviewed SECURITY DEFINER boundary'
);

SELECT is(
  (
    SELECT count(*)
    FROM pg_proc AS function_row
    JOIN pg_namespace AS namespace_row ON namespace_row.oid = function_row.pronamespace
    CROSS JOIN LATERAL aclexplode(COALESCE(function_row.proacl, acldefault('f', function_row.proowner))) AS acl
    WHERE namespace_row.nspname IN ('public', 'app_private')
      AND function_row.oid IN (
        'public.get_campaign_roster(uuid)'::regprocedure,
        'public.set_campaign_member_role(uuid,uuid,text)'::regprocedure,
        'public.remove_campaign_member(uuid,uuid)'::regprocedure,
        'public.detach_campaign_member_character(uuid,uuid,uuid)'::regprocedure,
        'app_private.can_read_campaign_character(uuid,uuid)'::regprocedure
      )
      AND acl.grantee = 0
      AND acl.privilege_type = 'EXECUTE'
  ),
  0::bigint,
  'new public and private campaign functions never inherit PUBLIC execution'
);

SELECT ok(
  has_function_privilege('authenticated', 'public.get_campaign_roster(uuid)'::regprocedure, 'EXECUTE')
  AND has_function_privilege('authenticated', 'public.set_campaign_member_role(uuid,uuid,text)'::regprocedure, 'EXECUTE')
  AND has_function_privilege('authenticated', 'public.remove_campaign_member(uuid,uuid)'::regprocedure, 'EXECUTE')
  AND has_function_privilege('authenticated', 'public.detach_campaign_member_character(uuid,uuid,uuid)'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('anon', 'public.get_campaign_roster(uuid)'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('anon', 'public.set_campaign_member_role(uuid,uuid,text)'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('anon', 'public.remove_campaign_member(uuid,uuid)'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('anon', 'public.detach_campaign_member_character(uuid,uuid,uuid)'::regprocedure, 'EXECUTE'),
  'only authenticated callers can execute the reviewed campaign API signatures'
);

SELECT is(
  (
    SELECT count(*)
    FROM pg_proc AS function_row
    JOIN pg_namespace AS namespace_row ON namespace_row.oid = function_row.pronamespace
    WHERE namespace_row.nspname IN ('public', 'app_private')
      AND function_row.prosecdef
      AND has_function_privilege('authenticated', function_row.oid, 'EXECUTE')
      AND function_row.proname IN (
        'get_campaign_roster',
        'set_campaign_member_role',
        'remove_campaign_member',
        'detach_campaign_member_character'
      )
  ),
  4::bigint,
  'the new API definer surface is the four exact reviewed campaign signatures'
);

SELECT alike(
  pg_get_functiondef('public.get_campaign_roster(uuid)'::regprocedure),
  '%CAMPAIGN_ROSTER_FORBIDDEN%',
  'the roster fails closed for a caller outside the campaign'
);

SELECT unalike(
  pg_get_functiondef('public.get_campaign_roster(uuid)'::regprocedure),
  '%email%',
  'the roster DTO does not project account email'
);

SELECT unalike(
  pg_get_functiondef('public.get_campaign_roster(uuid)'::regprocedure),
  '%share_token%',
  'the roster DTO does not project character share tokens'
);

SELECT throws_ok(
  $$
    SELECT * FROM public.get_campaign_roster(
      '22222222-2222-4222-8222-222222222222'::uuid
    )
  $$,
  '42501',
  'CAMPAIGN_ROSTER_FORBIDDEN',
  'an outsider cannot read a campaign roster'
);

SELECT ok(
  (SELECT prosecdef FROM pg_proc WHERE oid = 'app_private.can_read_campaign_character(uuid,uuid)'::regprocedure)
  AND has_function_privilege('authenticated', 'app_private.can_read_campaign_character(uuid,uuid)'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('anon', 'app_private.can_read_campaign_character(uuid,uuid)'::regprocedure, 'EXECUTE'),
  'the campaign-character helper is private-schema and authenticated-policy only'
);

SELECT alike(
  pg_get_functiondef('app_private.can_read_campaign_character(uuid,uuid)'::regprocedure),
  '%p_actor = auth.uid()%',
  'character read access is actor-bound rather than caller-supplied'
);

SELECT alike(
  pg_get_functiondef('app_private.can_read_campaign_character(uuid,uuid)'::regprocedure),
  '%is_campaign_system%',
  'only primary and co-Wardens satisfy the cross-user sheet read helper'
);

SELECT is(
  (
    SELECT count(*)
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'characters'
      AND policyname = 'campaign_managers_read_linked_characters'
      AND cmd = 'SELECT'
      AND COALESCE(qual, '') LIKE '%can_read_campaign_character%'
  ),
  1::bigint,
  'character rows add Warden/co-Warden read access only'
);

SELECT is(
  (
    SELECT count(*)
    FROM pg_policies
    WHERE schemaname = 'public'
      AND policyname LIKE 'campaign_managers_read_character\_%' ESCAPE '\'
      AND cmd = 'SELECT'
  ),
  28::bigint,
  'all reviewed character-sheet child tables use read-only campaign policies'
);

SELECT is(
  (
    SELECT count(*)
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'campaign_members'
      AND cmd IN ('INSERT', 'UPDATE')
  ),
  0::bigint,
  'direct browser membership inserts and role updates are removed'
);

SELECT is(
  (
    SELECT count(*)
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'campaign_members'
      AND policyname = 'campaign_members_leave_self'
      AND cmd = 'DELETE'
  ),
  1::bigint,
  'non-primary members retain only self-service leave access'
);

SELECT alike(
  pg_get_functiondef('public.set_campaign_member_role(uuid,uuid,text)'::regprocedure),
  '%PRIMARY_WARDEN_IMMUTABLE%',
  'a primary Warden cannot be demoted'
);

SELECT alike(
  pg_get_functiondef('public.remove_campaign_member(uuid,uuid)'::regprocedure),
  '%PRIMARY_WARDEN_IMMUTABLE%',
  'a primary Warden cannot be removed'
);

SELECT alike(
  pg_get_functiondef('public.detach_campaign_member_character(uuid,uuid,uuid)'::regprocedure),
  '%PRIMARY_WARDEN_IMMUTABLE%',
  'a primary Warden cannot be detached by another manager'
);

SELECT is(
  (
    SELECT count(*)
    FROM pg_proc AS function_row
    JOIN pg_namespace AS namespace_row ON namespace_row.oid = function_row.pronamespace
    WHERE namespace_row.nspname IN ('public', 'app_private')
      AND function_row.prosecdef
      AND NOT EXISTS (
        SELECT 1
        FROM unnest(COALESCE(function_row.proconfig, ARRAY[]::text[])) AS setting
        WHERE setting LIKE 'search_path=%'
      )
  ),
  0::bigint,
  'every reviewed definer, including the new signatures, has a fixed search path'
);

SELECT * FROM finish();
ROLLBACK;

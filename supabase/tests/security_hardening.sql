BEGIN;

SELECT plan(31);

SELECT set_eq(
  $$
    SELECT n.nspname || '.' || p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')'
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
      AND has_function_privilege('anon', p.oid, 'EXECUTE')
  $$,
  ARRAY[
    'public.get_campaign_by_share_code(p_share_code text)',
    'public.get_campaign_invite_by_token(p_token text)'
  ],
  'anon can execute exactly the two reviewed preview RPCs'
);

SELECT is(
  (
    SELECT count(*)
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    CROSS JOIN LATERAL aclexplode(COALESCE(p.proacl, acldefault('f', p.proowner))) acl
    WHERE n.nspname IN ('public', 'app_private')
      AND acl.grantee = 0
      AND acl.privilege_type = 'EXECUTE'
  ),
  0::bigint,
  'PUBLIC has no execution privilege on application functions'
);

SELECT ok(
  to_regprocedure('public.exec_sql(text)') IS NULL,
  'exec_sql is removed from the database surface'
);

SELECT ok(
  NOT COALESCE((
    SELECT bool_or(
      has_function_privilege('anon', p.oid, 'EXECUTE')
      OR has_function_privilege('authenticated', p.oid, 'EXECUTE')
    )
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'hypopg_reset'
  ), false),
  'hypopg_reset is unavailable to API roles'
);

SELECT ok(
  NOT COALESCE((
    SELECT bool_or(
      has_function_privilege('anon', p.oid, 'EXECUTE')
      OR has_function_privilege('authenticated', p.oid, 'EXECUTE')
    )
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'rls_auto_enable'
  ), false),
  'rls_auto_enable is unavailable to API roles'
);

SELECT ok(
  NOT has_function_privilege('anon', 'public.enforce_character_limit()'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('authenticated', 'public.enforce_character_limit()'::regprocedure, 'EXECUTE'),
  'the character-limit trigger function is not client-callable'
);

SELECT is(
  (
    SELECT count(*)
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.prosecdef
      AND n.nspname IN ('public', 'app_private')
      AND NOT EXISTS (
        SELECT 1
        FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) setting
        WHERE setting LIKE 'search_path=%'
      )
  ),
  0::bigint,
  'every application SECURITY DEFINER function has a fixed search_path'
);

SELECT is(
  pg_get_function_result('public.get_campaign_by_share_code(text)'::regprocedure),
  'TABLE(id uuid, name text, description text, share_code text, is_active boolean)',
  'campaign preview exposes only its public DTO'
);

SELECT is(
  pg_get_function_result('public.get_campaign_invite_by_token(text)'::regprocedure),
  'TABLE(campaign_id uuid, campaign_name text, campaign_description text, role text, expires_at timestamp with time zone, status text)',
  'invite preview exposes only join-relevant fields'
);

SELECT is(
  (
    SELECT count(*)
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
  ),
  0::bigint,
  'no asset-bucket SELECT policy permits unauthenticated enumeration'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Owners can select their public assets'
      AND cmd = 'SELECT'
      AND 'authenticated' = ANY(roles)
      AND COALESCE(qual, '') LIKE '%audio-tracks%'
      AND COALESCE(qual, '') LIKE '%character-avatars%'
      AND COALESCE(qual, '') LIKE '%character-portraits%'
      AND COALESCE(qual, '') LIKE '%custom-tokens%'
      AND COALESCE(qual, '') LIKE '%generated-art%'
      AND COALESCE(qual, '') LIKE '%auth.uid()%'
  ),
  'owners retain authenticated listing access to known owner-prefixed objects'
);

SELECT is(
  (
    SELECT count(*)
    FROM storage.buckets
    WHERE id IN (
      'audio-tracks',
      'character-avatars',
      'character-portraits',
      'custom-tokens',
      'generated-art'
    )
      AND public
  ),
  5::bigint,
  'the five known-URL asset buckets remain public'
);

SELECT ok(
  NOT has_schema_privilege('anon', 'app_private', 'USAGE')
  AND NOT has_function_privilege('anon', 'app_private.is_account_admin()'::regprocedure, 'EXECUTE')
  AND has_schema_privilege('authenticated', 'app_private', 'USAGE')
  AND has_function_privilege('authenticated', 'app_private.is_account_admin()'::regprocedure, 'EXECUTE'),
  'the account-admin helper is executable only by authenticated RLS callers'
);

SELECT ok(
  has_function_privilege('authenticated', 'public.admin_set_user_role(uuid,text)'::regprocedure, 'EXECUTE')
  AND has_function_privilege('authenticated', 'public.admin_set_user_ban(uuid,boolean)'::regprocedure, 'EXECUTE'),
  'authenticated callers can reach guarded account-admin RPCs'
);

SELECT ok(
  has_function_privilege('authenticated', 'public.create_campaign_with_code(text,text,uuid)'::regprocedure, 'EXECUTE'),
  'the compatible campaign creation signature remains available'
);

SELECT ok(
  has_function_privilege('authenticated', 'public.create_guild_with_code(text,text,text,uuid,uuid,uuid)'::regprocedure, 'EXECUTE'),
  'the compatible guild creation signature remains available'
);

SELECT set_eq(
  $$
    SELECT pg_get_function_identity_arguments(p.oid)
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'create_campaign_with_code'
  $$,
  ARRAY['p_name text, p_description text, p_warden_id uuid'],
  'campaign creation exposes only the reviewed compatibility overload'
);

SELECT set_eq(
  $$
    SELECT pg_get_function_identity_arguments(p.oid)
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'create_guild_with_code'
  $$,
  ARRAY['p_name text, p_description text, p_motto text, p_leader_user_id uuid, p_campaign_id uuid, p_character_id uuid'],
  'guild creation exposes only the reviewed compatibility overload'
);

DO $$
BEGIN
  PERFORM set_config(
    'request.jwt.claim.sub',
    '11111111-1111-4111-8111-111111111111',
    true
  );
END;
$$;

SELECT throws_ok(
  $$
    SELECT public.create_campaign_with_code(
      'Mismatch Campaign',
      '',
      '22222222-2222-4222-8222-222222222222'::uuid
    )
  $$,
  '42501',
  'Actor mismatch',
  'campaign creation rejects a caller-supplied actor mismatch'
);

SELECT throws_ok(
  $$
    SELECT public.create_guild_with_code(
      'Mismatch Guild',
      '',
      '',
      '22222222-2222-4222-8222-222222222222'::uuid,
      NULL,
      NULL
    )
  $$,
  '42501',
  'Actor mismatch',
  'guild creation rejects a caller-supplied actor mismatch'
);

SELECT is(
  (
    SELECT count(*)
    FROM pg_default_acl default_acl
    CROSS JOIN LATERAL aclexplode(default_acl.defaclacl) acl
    JOIN pg_namespace namespace_row ON namespace_row.oid = default_acl.defaclnamespace
    WHERE default_acl.defaclobjtype = 'f'
      AND namespace_row.nspname IN ('public', 'app_private')
      AND acl.grantee = 0
      AND acl.privilege_type = 'EXECUTE'
  ),
  0::bigint,
  'new application functions do not default to PUBLIC execution'
);

SELECT ok(
  to_regprocedure('public.complete_session_quest(uuid)') IS NULL
  AND to_regprocedure('public.create_session_quest(uuid,text,text,jsonb,text[])') IS NULL,
  'stale quest overloads are removed'
);

SELECT ok(
  NOT has_function_privilege('authenticated', 'public.join_campaign_by_id(uuid,uuid)'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('authenticated', 'public.advance_combat_turn(uuid)'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('authenticated', 'public.start_active_session(uuid,text,text)'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('authenticated', 'public.end_active_session(uuid)'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('authenticated', 'public.start_session_combat(uuid,jsonb)'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('authenticated', 'public.end_session_combat(uuid)'::regprocedure, 'EXECUTE'),
  'legacy open-join and active-session combat entry points are not client-callable'
);

SELECT ok(
  has_function_privilege('authenticated', 'public.join_campaign_by_code(text,uuid)'::regprocedure, 'EXECUTE')
  AND has_function_privilege('authenticated', 'public.create_session_quest(uuid,text,text,text[],jsonb)'::regprocedure, 'EXECUTE')
  AND has_function_privilege('authenticated', 'public.complete_session_quest(uuid,text)'::regprocedure, 'EXECUTE'),
  'canonical capability-bearing join and quest signatures remain available'
);

SELECT is(
  (
    SELECT count(*)
    FROM pg_proc function_row
    JOIN pg_namespace namespace_row ON namespace_row.oid = function_row.pronamespace
    WHERE namespace_row.nspname = 'public'
      AND function_row.proname LIKE '%\_unchecked' ESCAPE '\'
      AND (
        has_function_privilege('anon', function_row.oid, 'EXECUTE')
        OR has_function_privilege('authenticated', function_row.oid, 'EXECUTE')
      )
  ),
  0::bigint,
  'legacy compatibility bodies are not executable by API roles'
);

SELECT throws_ok(
  $$
    SELECT public.add_user_notification(
      '22222222-2222-4222-8222-222222222222'::uuid,
      'mention',
      'Unauthorized target',
      NULL,
      'normal',
      'campaign',
      '{}'::jsonb,
      NULL,
      NULL
    )
  $$,
  '42501',
  'NOTIFICATION_TARGET_FORBIDDEN',
  'cross-user notifications require a verified campaign relationship'
);

SELECT throws_ok(
  $$
    SELECT public.assign_daily_quests(
      '22222222-2222-4222-8222-222222222222'::uuid
    )
  $$,
  '42501',
  'CHARACTER_OWNERSHIP_REQUIRED',
  'daily quest assignment is bound to an owned character'
);

SELECT throws_ok(
  $$
    SELECT public.upsert_campaign_session(
      '22222222-2222-4222-8222-222222222222'::uuid,
      NULL,
      'Unauthorized session',
      NULL,
      NULL,
      'planned',
      NULL,
      NULL,
      NULL
    )
  $$,
  '42501',
  'CAMPAIGN_SESSION_FORBIDDEN',
  'campaign session upsert fails closed for a nonmember'
);

SELECT ok(
  (
    SELECT function_row.prosecdef
    FROM pg_proc AS function_row
    WHERE function_row.oid = 'public.get_accessible_sourcebooks(uuid,uuid)'::regprocedure
  )
  AND has_function_privilege(
    'authenticated',
    'public.get_accessible_sourcebooks(uuid,uuid)'::regprocedure,
    'EXECUTE'
  )
  AND NOT has_function_privilege(
    'anon',
    'public.get_accessible_sourcebooks(uuid,uuid)'::regprocedure,
    'EXECUTE'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM pg_proc AS legacy_helper
    JOIN pg_namespace AS legacy_namespace
      ON legacy_namespace.oid = legacy_helper.pronamespace
    WHERE legacy_namespace.nspname = 'public'
      AND legacy_helper.proname = 'user_has_sourcebook_access'
      AND has_function_privilege('authenticated', legacy_helper.oid, 'EXECUTE')
  ),
  'sourcebook access uses only the guarded authenticated projection'
);

SELECT throws_ok(
  $$
    SELECT *
    FROM public.get_accessible_sourcebooks(
      NULL,
      '22222222-2222-4222-8222-222222222222'::uuid
    )
  $$,
  '42501',
  'SOURCEBOOK_USER_CONTEXT_FORBIDDEN',
  'sourcebook access rejects a caller-supplied actor mismatch'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_constraint AS constraint_row
    WHERE constraint_row.conrelid = 'public.campaign_session_logs'::regclass
      AND constraint_row.contype = 'c'
      AND pg_get_constraintdef(constraint_row.oid) LIKE '%log_type%reward%'
  ),
  'campaign session logs accept the reviewed XP reward event type'
);

SELECT * FROM finish();
ROLLBACK;

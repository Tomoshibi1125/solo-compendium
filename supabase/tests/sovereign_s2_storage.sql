BEGIN;

SET LOCAL search_path = extensions, public, pg_catalog;

SELECT plan(13);

SELECT ok(
  to_regprocedure('public.save_legacy_sovereign_definition(jsonb,text,boolean)') IS NOT NULL
  AND to_regprocedure('public.save_sovereign_v2_definition(jsonb,text,boolean)') IS NOT NULL
  AND to_regprocedure('public.attach_saved_sovereign(uuid,uuid,text)') IS NOT NULL,
  'S2 exposes the three reviewed Sovereign RPCs'
);

SELECT ok(
  has_function_privilege(
    'authenticated',
    'public.attach_saved_sovereign(uuid,uuid,text)'::regprocedure,
    'EXECUTE'
  )
  AND NOT has_function_privilege(
    'anon',
    'public.attach_saved_sovereign(uuid,uuid,text)'::regprocedure,
    'EXECUTE'
  ),
  'attachment is reachable only by authenticated API callers'
);

SELECT ok(
  has_function_privilege(
    'authenticated',
    'public.save_sovereign_v2_definition(jsonb,text,boolean)'::regprocedure,
    'EXECUTE'
  )
  AND NOT has_function_privilege(
    'anon',
    'public.save_sovereign_v2_definition(jsonb,text,boolean)'::regprocedure,
    'EXECUTE'
  ),
  'v2 save is reachable only by authenticated API callers'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'saved_sovereigns'
      AND column_name = 'definition'
      AND data_type = 'jsonb'
  )
  AND EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'saved_sovereigns'
      AND column_name = 'schema_version'
  ),
  'saved_sovereigns has versioned definition authority'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'character_features'
      AND column_name = 'sovereign_definition_id'
  )
  AND EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'character_features'
      AND column_name = 'sovereign_entity_id'
  ),
  'character_features records rebuildable Sovereign projection identity'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgrelid = 'public.characters'::regclass
      AND tgname = 'guard_character_sovereign_attachment'
      AND NOT tgisinternal
  ),
  'characters has an attachment identity guard'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgrelid = 'public.character_features'::regclass
      AND tgname = 'guard_sovereign_feature_projection'
      AND NOT tgisinternal
  ),
  'character_features has a Sovereign projection guard'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'sovereign_attachment_operations'
      AND policyname = 'sovereign_attachment_operations_select'
      AND cmd = 'SELECT'
      AND 'authenticated' = ANY(roles)
      AND COALESCE(qual, '') LIKE '%auth.uid()%'
  ),
  'attachment receipts are readable only through actor-bound RLS'
);

SELECT ok(
  pg_get_functiondef('public.attach_saved_sovereign(uuid,uuid,text)'::regprocedure)
    LIKE '%pg_advisory_xact_lock%'
  AND pg_get_functiondef('public.attach_saved_sovereign(uuid,uuid,text)'::regprocedure)
    LIKE '%FOR UPDATE%'
  AND pg_get_functiondef('public.attach_saved_sovereign(uuid,uuid,text)'::regprocedure)
    LIKE '%RETURN v_receipt.result%'
  AND pg_get_functiondef('public.attach_saved_sovereign(uuid,uuid,text)'::regprocedure)
    LIKE '%INSERT INTO public.sovereign_attachment_operations%'
  ,
  'live attachment RPC serializes competing calls and persists retry receipts'
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
    SELECT public.attach_saved_sovereign(
      '22222222-2222-4222-8222-222222222222'::uuid,
      '33333333-3333-4333-8333-333333333333'::uuid,
      's2-unauthorized-character'
    )
  $$,
  '42501',
  'CHARACTER_OWNERSHIP_REQUIRED',
  'an authenticated actor cannot attach to an absent or unowned character'
);

SELECT is(
  (
    SELECT count(*)
    FROM public.sovereign_attachment_operations
    WHERE actor_id = '11111111-1111-4111-8111-111111111111'::uuid
      AND operation_id = 's2-unauthorized-character'
  ),
  0::bigint,
  'a failed attachment rolls back without leaving a success receipt'
);

-- Seed one intentionally dangling receipt with FK triggers disabled inside this
-- test transaction. This isolates replay semantics: exact retries must return the
-- durable result before re-running character/definition mutations.
SET LOCAL session_replication_role = replica;
INSERT INTO public.sovereign_attachment_operations (
  actor_id,
  operation_id,
  character_id,
  sovereign_id,
  result
) VALUES (
  '11111111-1111-4111-8111-111111111111'::uuid,
  's2-replay-operation',
  '22222222-2222-4222-8222-222222222222'::uuid,
  '33333333-3333-4333-8333-333333333333'::uuid,
  '{"replayed":true}'::jsonb
);
SET LOCAL session_replication_role = origin;

SELECT is(
  public.attach_saved_sovereign(
    '22222222-2222-4222-8222-222222222222'::uuid,
    '33333333-3333-4333-8333-333333333333'::uuid,
    's2-replay-operation'
  ),
  '{"replayed":true}'::jsonb,
  'an exact retry replays its durable result without duplicating work'
);

SELECT throws_ok(
  $$
    SELECT public.attach_saved_sovereign(
      '44444444-4444-4444-8444-444444444444'::uuid,
      '33333333-3333-4333-8333-333333333333'::uuid,
      's2-replay-operation'
    )
  $$,
  '23505',
  'SOVEREIGN_OPERATION_CONFLICT',
  'reusing an operation ID for different attachment parameters is rejected'
);

SELECT * FROM finish();
ROLLBACK;

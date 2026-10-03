BEGIN;

SET LOCAL search_path = extensions, public, pg_catalog;

SELECT plan(3);

SELECT ok(
  to_regprocedure('public.save_legacy_sovereign_definition(jsonb,text,boolean)') IS NULL,
  'the legacy Sovereign save RPC no longer exists'
);

SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgrelid = 'public.saved_sovereigns'::regclass
      AND tgname = 'require_new_sovereign_v2'
      AND NOT tgisinternal
  ),
  'saved Sovereigns have an insert guard requiring v2'
);

SELECT throws_ok(
  $$INSERT INTO public.saved_sovereigns (schema_version) VALUES (1)$$,
  '22023',
  'NEW_SOVEREIGN_V2_REQUIRED',
  'direct inserts cannot create a new v1 Sovereign'
);

SELECT * FROM finish();
ROLLBACK;

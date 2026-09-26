BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

-- All fixtures and their resulting lots roll back at the end of this test.
INSERT INTO auth.users (id, email) VALUES
  ('11111111-1111-4111-8111-111111111111', 'm2-warden@example.test'),
  ('22222222-2222-4222-8222-222222222222', 'm2-co-warden@example.test'),
  ('33333333-3333-4333-8333-333333333333', 'm2-owner@example.test'),
  ('44444444-4444-4444-8444-444444444444', 'm2-outsider@example.test');

INSERT INTO public.campaigns (id, name, warden_id, share_code)
VALUES (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'M2 test campaign',
  '11111111-1111-4111-8111-111111111111',
  'M2TEST01'
);
INSERT INTO public.campaign_members (campaign_id, user_id, role) VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '22222222-2222-4222-8222-222222222222', 'co-warden'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33333333-3333-4333-8333-333333333333', 'ascendant');
INSERT INTO public.characters (
  id, user_id, name, proficiency_bonus, skill_expertise
) VALUES (
  '55555555-5555-4555-8555-555555555555',
  '33333333-3333-4333-8333-333333333333',
  'M2 test character', 4, ARRAY['Medicine']::text[]
);
INSERT INTO public.character_abilities (character_id, ability, score)
VALUES ('55555555-5555-4555-8555-555555555555', 'INT', 30);
INSERT INTO public.material_definitions (id, name, family, grade) VALUES
  ('m2-test-quality', 'M2 quality sample', 'Anomaly Biological', 'Quality'),
  ('m2-test-regent', 'M2 Regent sample', 'Anomaly Biological', 'Regent');

SELECT plan(19);

SELECT ok(
  has_function_privilege('authenticated', 'public.approve_harvest_yield_m2(uuid,uuid,text,text,text,text,text,text,numeric,integer,text,text,integer,text)'::regprocedure, 'EXECUTE')
  AND has_function_privilege('authenticated', 'public.resolve_harvest_attempt_m2(uuid,text,text)'::regprocedure, 'EXECUTE')
  AND NOT has_function_privilege('anon', 'public.resolve_harvest_attempt_m2(uuid,text,text)'::regprocedure, 'EXECUTE'),
  'only authenticated callers can use the harvest RPCs'
);
SELECT ok(
  NOT has_table_privilege('authenticated', 'public.harvest_authorizations_m2', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.harvest_attempts_m2', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.material_lots', 'INSERT'),
  'browser roles cannot bypass approval, check, or lot issuance with direct inserts'
);

SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '44444444-4444-4444-8444-444444444444', true); END $$;
SELECT throws_ok(
  $$SELECT public.approve_harvest_yield_m2(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '55555555-5555-4555-8555-555555555555',
    'canonical-anomaly',
    'anomaly-0006',
    'D', 'An available source', 'core', 'm2-test-quality', 2, 1,
    'harvesting-kit', 'Verified owned kit', NULL, 'm2-outsider-approval'
  )$$,
  '42501', 'WARDEN_HARVEST_APPROVAL_REQUIRED',
  'an outsider cannot approve a yield'
);

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true); END $$;
SELECT throws_ok(
  $$SELECT public.approve_harvest_yield_m2(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '55555555-5555-4555-8555-555555555555',
    'canonical-anomaly',
    'anomaly-0006',
    'S', 'An available source', 'core', 'm2-test-quality', 2, 1,
    'harvesting-kit', 'Verified owned kit', NULL, 'm2-forged-rank'
  )$$,
  '22023', 'HARVEST_RANK_MISMATCH',
  'the Warden cannot replace canonical source rank with a client rank'
);
SELECT throws_ok(
  $$SELECT public.approve_harvest_yield_m2(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '55555555-5555-4555-8555-555555555555',
    'canonical-anomaly',
    'anomaly-0006',
    'D', 'An available source', 'bulk', 'm2-test-quality', 2, 30,
    'harvesting-kit', 'Verified owned kit', 21, 'm2-forged-fixed-dc'
  )$$,
  '22023', 'HARVEST_FIXED_DC_MISMATCH',
  'a fixed bulk DC cannot be replaced with a Warden DC'
);
SELECT lives_ok(
  $$SELECT public.approve_harvest_yield_m2(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '55555555-5555-4555-8555-555555555555',
    'canonical-anomaly',
    'anomaly-0006',
    NULL, 'An available source', 'core', 'm2-test-quality', 2, 1,
    'harvesting-kit', 'Verified owned kit', NULL, 'm2-core-approval'
  )$$,
  'a Warden can approve a source-backed core extraction'
);
SELECT is(
  (SELECT dc FROM public.harvest_authorizations_m2 WHERE approval_operation_id = 'm2-core-approval'),
  15,
  'core extraction persists its fixed DC 15'
);
DO $$
BEGIN
  PERFORM set_config('test.m2_core_authorization', (
    SELECT id::text FROM public.harvest_authorizations_m2
    WHERE approval_operation_id = 'm2-core-approval'
  ), true);
END;
$$;
SELECT is(
  public.approve_harvest_yield_m2(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '55555555-5555-4555-8555-555555555555',
    'canonical-anomaly',
    'anomaly-0006',
    NULL, 'An available source', 'core', 'm2-test-quality', 2, 1,
    'harvesting-kit', 'Verified owned kit', NULL, 'm2-core-approval'
  ),
  (SELECT id FROM public.harvest_authorizations_m2 WHERE approval_operation_id = 'm2-core-approval'),
  'a repeated approval operation returns its original authorization'
);
SELECT throws_ok(
  $$SELECT public.approve_harvest_yield_m2(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '55555555-5555-4555-8555-555555555555',
    'canonical-anomaly',
    'anomaly-0006',
    NULL, 'An available source', 'core', 'm2-test-quality', 3, 1,
    'harvesting-kit', 'Verified owned kit', NULL, 'm2-core-approval'
  )$$,
  '22023', 'HARVEST_APPROVAL_OPERATION_CONFLICT',
  'an approval operation ID cannot be reused with a different yield'
);

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', true); END $$;
SELECT lives_ok(
  $$SELECT public.approve_harvest_yield_m2(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '55555555-5555-4555-8555-555555555555',
    'warden-source', 'm2-s-source', 'S', 'Explicit Regent source',
    'precision', 'm2-test-regent', 1, 60,
    'approved-equivalent', 'Verified equivalent tool', 100, 'm2-co-warden-approval'
  )$$,
  'a co-Warden can approve a 21+ procedure with an explicit DC'
);
SELECT is(
  (SELECT dc FROM public.harvest_authorizations_m2 WHERE approval_operation_id = 'm2-co-warden-approval'),
  100,
  'the Warden-defined 21+ DC is stored exactly'
);

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '44444444-4444-4444-8444-444444444444', true); END $$;
SELECT throws_ok(
  $$SELECT public.resolve_harvest_attempt_m2(
    current_setting('test.m2_core_authorization')::uuid,
    'Medicine', 'm2-outsider-attempt'
  )$$,
  '42501', 'HARVEST_CHARACTER_OWNER_REQUIRED',
  'a non-owner cannot use a known approved yield ID'
);

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '33333333-3333-4333-8333-333333333333', true); END $$;
SELECT lives_ok(
  $$SELECT public.resolve_harvest_attempt_m2(
    (SELECT id FROM public.harvest_authorizations_m2 WHERE approval_operation_id = 'm2-core-approval'),
    'Medicine', 'm2-owner-core-attempt'
  )$$,
  'the character owner can resolve one approved harvest'
);
SELECT ok(
  (SELECT success FROM public.harvest_attempts_m2 WHERE operation_id = 'm2-owner-core-attempt')
  AND (SELECT proficiency_bonus FROM public.harvest_attempts_m2 WHERE operation_id = 'm2-owner-core-attempt') = 8,
  'the server resolves a guaranteed success and counts expertise exactly twice'
);
SELECT is(
  (SELECT count(*) FROM public.material_lots WHERE owner_character_id = '55555555-5555-4555-8555-555555555555'),
  1::bigint,
  'successful extraction creates exactly one lot'
);
SELECT is(
  public.resolve_harvest_attempt_m2(
    (SELECT id FROM public.harvest_authorizations_m2 WHERE approval_operation_id = 'm2-core-approval'),
    'Medicine', 'm2-owner-core-attempt'
  )->>'lot_id',
  (SELECT lot_id::text FROM public.harvest_attempts_m2 WHERE operation_id = 'm2-owner-core-attempt'),
  'a lost-response retry returns the original lot identity'
);
SELECT throws_ok(
  $$SELECT public.resolve_harvest_attempt_m2(
    (SELECT id FROM public.harvest_authorizations_m2 WHERE approval_operation_id = 'm2-core-approval'),
    'Medicine', 'm2-second-core-attempt'
  )$$,
  '22023', 'HARVEST_AUTHORIZATION_UNAVAILABLE',
  'one authorization cannot issue a second lot with a fresh operation ID'
);
SELECT lives_ok(
  $$SELECT public.resolve_harvest_attempt_m2(
    (SELECT id FROM public.harvest_authorizations_m2 WHERE approval_operation_id = 'm2-co-warden-approval'),
    'Survival', 'm2-owner-failed-attempt'
  )$$,
  'an approved high-DC check resolves as a recorded failure'
);
SELECT ok(
  NOT (SELECT success FROM public.harvest_attempts_m2 WHERE operation_id = 'm2-owner-failed-attempt')
  AND (SELECT count(*) FROM public.material_lots WHERE owner_character_id = '55555555-5555-4555-8555-555555555555') = 1,
  'failure records the attempt without issuing a lot'
);

SELECT * FROM finish();
ROLLBACK;

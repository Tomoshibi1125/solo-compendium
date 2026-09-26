BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('1010aaaa-1010-4010-8010-101010101010', 'c2-source-warden@example.test'),
  ('2020bbbb-2020-4020-8020-202020202020', 'c2-source-owner@example.test'),
  ('3030cccc-3030-4030-8030-303030303030', 'c2-source-outsider@example.test');
INSERT INTO public.campaigns (id, name, warden_id, share_code)
VALUES ('4040dddd-4040-4040-8040-404040404040', 'C2 source authority',
        '1010aaaa-1010-4010-8010-101010101010', 'C2SRC001');
INSERT INTO public.characters (id, user_id, name)
VALUES ('5050eeee-5050-4050-8050-505050505050',
        '2020bbbb-2020-4020-8020-202020202020', 'C2 source handler');
INSERT INTO public.campaign_members (campaign_id, user_id, role, character_id)
VALUES ('4040dddd-4040-4040-8040-404040404040',
        '2020bbbb-2020-4020-8020-202020202020', 'ascendant',
        '5050eeee-5050-4050-8050-505050505050');

SELECT plan(8);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '3030cccc-3030-4030-8030-303030303030', true); END $$;
SELECT throws_ok(
  $$SELECT public.resolve_companion_tame_attempt_c2(
    '4040dddd-4040-4040-8040-404040404040',
    '5050eeee-5050-4050-8050-505050505050',
    'anomaly-0006', NULL, 20)$$,
  '42501', 'NOT_OWNER', 'an outsider cannot tame for another character');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '2020bbbb-2020-4020-8020-202020202020', true); END $$;
SELECT throws_ok(
  $$SELECT public.resolve_companion_tame_attempt_c2(
    '4040dddd-4040-4040-8040-404040404040',
    '5050eeee-5050-4050-8050-505050505050',
    'not-a-canonical-anomaly', NULL, 20)$$,
  '22023', 'CANONICAL_ANOMALY_NOT_FOUND',
  'an unknown text source cannot be acquired');
SELECT throws_ok(
  $$SELECT public.resolve_companion_tame_attempt_c2(
    '4040dddd-4040-4040-8040-404040404040',
    '5050eeee-5050-4050-8050-505050505050',
    'anomaly-0006',
    '{"provenance":{"canonicalId":"anomaly-0007"}}'::jsonb, 20)$$,
  '22023', 'CANONICAL_SOURCE_ID_MISMATCH',
  'a snapshot naming a different source is rejected');
SELECT lives_ok($$DO $body$
DECLARE v_result JSONB;
BEGIN
  v_result := public.resolve_companion_tame_attempt_c2(
    '4040dddd-4040-4040-8040-404040404040',
    '5050eeee-5050-4050-8050-505050505050',
    'anomaly-0006',
    '{"provenance":{"canonicalId":"anomaly-0006"},
      "sourceFields":{"rank":"S","hpMax":999999,"name":"Forged"}}'::jsonb,
    20);
  PERFORM set_config('test.c2_source_instance', v_result->>'companion_instance_id', true);
END $body$;$$,
  'the server resolves a known source despite forged client rank and HP fields');
SELECT is(
  (SELECT source_snapshot#>>'{sourceFields,rank}' FROM public.companion_instances
   WHERE id = current_setting('test.c2_source_instance')::UUID), 'D',
  'stored source rank comes from the server catalog');
SELECT is(
  (SELECT (source_snapshot#>>'{sourceFields,hpMax}')::INTEGER
   FROM public.companion_instances
   WHERE id = current_setting('test.c2_source_instance')::UUID), 12,
  'stored HP comes from the server catalog');
SELECT is(
  (SELECT dc FROM public.companion_bond_attempts
   WHERE companion_instance_id = current_setting('test.c2_source_instance')::UUID
     AND attempt_kind = 'tame' ORDER BY created_at DESC LIMIT 1), 12,
  'the tame check uses the canonical D-rank DC');
SELECT is(
  (SELECT count(*) FROM public.campaign_tamed_anomalies
   WHERE companion_instance_id = current_setting('test.c2_source_instance')::UUID),
  1::bigint, 'one successful tame creates one linked roster entry');

SELECT * FROM finish();
ROLLBACK;

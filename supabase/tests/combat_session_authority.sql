BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('11110000-1111-4111-8111-111111111111', 'combat-warden@example.test'),
  ('22220000-2222-4222-8222-222222222222', 'combat-member@example.test'),
  ('33330000-3333-4333-8333-333333333333', 'combat-outsider@example.test');
INSERT INTO public.campaigns (id, name, warden_id, share_code)
VALUES ('44440000-4444-4444-8444-444444444444', 'Combat authority',
        '11110000-1111-4111-8111-111111111111', 'COMBAT01');
INSERT INTO public.campaign_members (id, campaign_id, user_id, role)
VALUES ('55550000-5555-4555-8555-555555555555',
        '44440000-4444-4444-8444-444444444444',
        '22220000-2222-4222-8222-222222222222', 'ascendant');
INSERT INTO public.characters (id, user_id, name)
VALUES ('66660000-6666-4666-8666-666666666666',
        '22220000-2222-4222-8222-222222222222', 'Combat companion handler');
UPDATE public.campaign_members SET character_id = '66660000-6666-4666-8666-666666666666'
WHERE id = '55550000-5555-4555-8555-555555555555';
INSERT INTO public.campaign_combat_sessions (id, campaign_id, created_by)
VALUES ('77770000-7777-4777-8777-777777777777',
        '44440000-4444-4444-8444-444444444444',
        '11110000-1111-4111-8111-111111111111');
INSERT INTO public.campaign_combatants
  (id, campaign_id, session_id, name, initiative, stats, member_id)
VALUES
  ('88880000-8888-4888-8888-888888888888',
   '44440000-4444-4444-8444-444444444444',
   '77770000-7777-4777-8777-777777777777',
   'Handler', 14, '{"hp":12}', '55550000-5555-4555-8555-555555555555');
INSERT INTO public.campaign_tamed_anomalies
  (id, campaign_id, anomaly_id, current_hp, tamed_by_character_id,
   primary_handler_character_id)
VALUES
  ('99990000-9999-4999-8999-999999999999',
   '44440000-4444-4444-8444-444444444444',
   'aaaa0000-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 11,
   '66660000-6666-4666-8666-666666666666',
   '66660000-6666-4666-8666-666666666666');

SELECT plan(13);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '33330000-3333-4333-8333-333333333333', true); END $$;
SELECT is((SELECT count(*) FROM public.campaign_combat_sessions), 0::bigint,
          'an outsider cannot read another campaign combat session');
SELECT is((SELECT count(*) FROM public.campaign_combatants), 0::bigint,
          'an outsider cannot read another campaign combat roster');
SELECT throws_ok(
  $$INSERT INTO public.campaign_combatants
      (campaign_id, session_id, name) VALUES
      ('44440000-4444-4444-8444-444444444444',
       '77770000-7777-4777-8777-777777777777', 'Forged')$$,
  '42501', 'new row violates row-level security policy for table "campaign_combatants"',
  'an outsider cannot add a combatant');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '22220000-2222-4222-8222-222222222222', true); END $$;
SELECT is((SELECT count(*) FROM public.campaign_combat_sessions), 1::bigint,
          'a campaign member can read the active session');
SELECT is((SELECT count(*) FROM public.campaign_combatants), 1::bigint,
          'a campaign member can read combatants');
SELECT throws_ok(
  $$INSERT INTO public.campaign_combatants
      (campaign_id, session_id, name) VALUES
      ('44440000-4444-4444-8444-444444444444',
       '77770000-7777-4777-8777-777777777777', 'Member write')$$,
  '42501', 'new row violates row-level security policy for table "campaign_combatants"',
  'a player cannot add a combatant');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '11110000-1111-4111-8111-111111111111', true); END $$;
SELECT lives_ok(
  $$INSERT INTO public.campaign_combatants
      (id, campaign_id, session_id, name) VALUES
      ('bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
       '44440000-4444-4444-8444-444444444444',
       '77770000-7777-4777-8777-777777777777', 'Warden actor')$$,
  'a Warden can add a generic combatant');
SELECT throws_ok(
  $$UPDATE public.campaign_combatants
    SET session_id = 'cccc0000-cccc-4ccc-8ccc-cccccccccccc'
    WHERE id = 'bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb'$$,
  '22023', 'COMBATANT_IDENTITY_IMMUTABLE',
  'combatant identity cannot be rewritten');
SELECT throws_ok(
  $$INSERT INTO public.campaign_combatants
      (campaign_id, session_id, name) VALUES
      ('dddd0000-dddd-4ddd-8ddd-dddddddddddd',
       '77770000-7777-4777-8777-777777777777', 'Cross campaign')$$,
  '22023', 'COMBATANT_SESSION_CAMPAIGN_MISMATCH',
  'a combatant cannot claim another campaign');
SELECT lives_ok(
  $$SELECT public.add_companion_to_combat(
    '77770000-7777-4777-8777-777777777777',
    (SELECT companion_instance_id FROM public.campaign_tamed_anomalies
      WHERE id = '99990000-9999-4999-8999-999999999999'), 10)$$,
  'Warden companion handoff persists through the C3 RPC');
SELECT is(
  (SELECT count(*) FROM public.campaign_combatants WHERE companion_instance_id IS NOT NULL),
  1::bigint, 'a companion has one persisted actor');
SELECT lives_ok(
  $$SELECT public.add_companion_to_combat(
    '77770000-7777-4777-8777-777777777777',
    (SELECT companion_instance_id FROM public.campaign_tamed_anomalies
      WHERE id = '99990000-9999-4999-8999-999999999999'), 10)$$,
  'repeated handoff is safe');
SELECT is(
  (SELECT count(*) FROM public.campaign_combatants WHERE companion_instance_id IS NOT NULL),
  1::bigint, 'repeated handoff does not create another actor');

SELECT * FROM finish();
ROLLBACK;

BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('12120000-1212-4212-8212-121212121212', 'r1-warden@example.test'),
  ('23230000-2323-4232-8232-232323232323', 'r1-owner@example.test'),
  ('34340000-3434-4343-8343-343434343434', 'r1-outsider@example.test');
INSERT INTO public.campaigns (id, name, warden_id, share_code)
VALUES ('45450000-4545-4454-8454-454545454545', 'R1 test campaign',
        '12120000-1212-4212-8212-121212121212', 'R1TEST01');
INSERT INTO public.characters (id, user_id, name)
VALUES ('56560000-5656-4565-8565-565656565656',
        '23230000-2323-4232-8232-232323232323', 'R1 test character');
INSERT INTO public.campaign_members (campaign_id, user_id, role, character_id)
VALUES ('45450000-4545-4454-8454-454545454545',
        '23230000-2323-4232-8232-232323232323', 'ascendant',
        '56560000-5656-4565-8565-565656565656');

SELECT plan(15);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '34340000-3434-4343-8343-343434343434', true); END $$;
SELECT throws_ok(
  $$SELECT public.create_regent_unlock_offer(
    '56560000-5656-4565-8565-565656565656', 'quest-r1', 'R1 reward',
    ARRAY['umbral_regent','radiant_regent','steel_regent'],
    '67670000-6767-4676-8676-676767676767')$$,
  '42501', 'CAMPAIGN_WARDEN_REQUIRED',
  'an outsider cannot issue a Regent offer');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '12120000-1212-4212-8212-121212121212', true); END $$;
SELECT throws_ok(
  $$SELECT public.create_regent_unlock_offer(
    '56560000-5656-4565-8565-565656565656', 'quest-r1', 'R1 reward',
    ARRAY['umbral_regent','radiant_regent','steel_regent','war_regent'],
    '67670000-6767-4676-8676-676767676767')$$,
  '22023', 'REGENT_OFFER_REQUIRES_THREE_CANONICAL_CANDIDATES',
  'the server rejects a four-candidate offer');
SELECT throws_ok(
  $$SELECT public.create_regent_unlock_offer(
    '56560000-5656-4565-8565-565656565656', 'quest-r1', 'R1 reward',
    ARRAY['umbral_regent','umbral_regent','steel_regent'],
    '67670000-6767-4676-8676-676767676767')$$,
  '22023', 'REGENT_OFFER_REQUIRES_THREE_CANONICAL_CANDIDATES',
  'the server rejects duplicate candidates');
SELECT lives_ok($$DO $body$
BEGIN
  PERFORM set_config('test.r1_offer', public.create_regent_unlock_offer(
    '56560000-5656-4565-8565-565656565656', 'quest-r1', 'R1 reward',
    ARRAY['umbral_regent','radiant_regent','steel_regent'],
    '67670000-6767-4676-8676-676767676767')::TEXT, true);
END $body$;$$, 'the Warden creates an exact three-candidate offer');
SELECT is(
  public.create_regent_unlock_offer(
    '56560000-5656-4565-8565-565656565656', 'quest-r1', 'R1 reward',
    ARRAY['umbral_regent','radiant_regent','steel_regent'],
    '67670000-6767-4676-8676-676767676767')::TEXT,
  current_setting('test.r1_offer'),
  'offer creation retry returns the same grant');
SELECT is((SELECT count(*) FROM public.character_regent_unlock_grants), 1::bigint,
          'offer creation retry does not duplicate a grant');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '23230000-2323-4232-8232-232323232323', true); END $$;
SELECT is((SELECT count(*) FROM public.character_regent_unlock_grants), 1::bigint,
          'the character owner can read their stored offer');
SELECT throws_ok(
  $$SELECT public.consume_regent_unlock_grant(
    current_setting('test.r1_offer')::UUID, 'war_regent')$$,
  '42501', 'REGENT_NOT_IN_OFFER',
  'a forged fourth Regent is rejected');
SELECT lives_ok($$DO $body$
BEGIN
  PERFORM set_config('test.r1_unlock', public.consume_regent_unlock_grant(
    current_setting('test.r1_offer')::UUID, 'radiant_regent')::TEXT, true);
END $body$;$$, 'the owner consumes a stored candidate');
SELECT is(
  public.consume_regent_unlock_grant(
    current_setting('test.r1_offer')::UUID, 'radiant_regent')::TEXT,
  current_setting('test.r1_unlock'),
  'a lost consume response returns the same unlock');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '12120000-1212-4212-8212-121212121212', true); END $$;
SELECT throws_ok(
  $$SELECT public.configure_regent_unlock_offer(
    current_setting('test.r1_offer')::UUID,
    ARRAY['war_regent','frost_regent','beast_regent'])$$,
  '23514', 'REGENT_OFFER_CONSUMED_IMMUTABLE',
  'consumed offers cannot be edited');
SELECT lives_ok($$DO $body$
BEGIN
  PERFORM set_config('test.r1_second', public.create_regent_unlock_offer(
    '56560000-5656-4565-8565-565656565656', 'quest-r1-second', 'Second reward',
    ARRAY['war_regent','frost_regent','beast_regent'],
    '78780000-7878-4787-8787-787878787878')::TEXT, true);
END $body$;$$, 'the Warden can issue a second offer');
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '23230000-2323-4232-8232-232323232323', true); END $$;
SELECT lives_ok(
  $$SELECT public.consume_regent_unlock_grant(
    current_setting('test.r1_second')::UUID, 'war_regent')$$,
  'the owner can resolve a second distinct Regent');
SELECT is((SELECT count(DISTINCT regent_id) FROM public.character_regent_unlocks
           WHERE character_id = '56560000-5656-4565-8565-565656565656'),
          2::bigint, 'two distinct canonical Regents are resolved');
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '12120000-1212-4212-8212-121212121212', true); END $$;
SELECT throws_ok(
  $$SELECT public.create_regent_unlock_offer(
    '56560000-5656-4565-8565-565656565656', 'quest-r1-third', 'Third reward',
    ARRAY['frost_regent','beast_regent','plague_regent'],
    '89890000-8989-4898-8898-898989898989')$$,
  '23514', 'REGENT_UNLOCK_LIMIT_REACHED',
  'the Warden cannot issue another offer after two resolved Regents');

SELECT * FROM finish();
ROLLBACK;

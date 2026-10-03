BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users(id, email) VALUES
  ('c1110000-1111-4111-8111-111111111111', 'resonance-owner@example.test'),
  ('c2220000-2222-4222-8222-222222222222', 'resonance-other@example.test');
INSERT INTO public.characters(id, user_id, name, level) VALUES
  ('c3330000-3333-4333-8333-333333333333',
   'c1110000-1111-4111-8111-111111111111', 'Resonance owner', 10);
INSERT INTO public.character_regent_unlocks
  (id, character_id, regent_id, quest_name, is_primary, caught_up_at_level)
VALUES ('c4440000-4444-4444-8444-444444444444',
  'c3330000-3333-4333-8333-333333333333', 'beast_regent', 'Approved quest', true, 10);
INSERT INTO public.character_powers
  (id, character_id, power_id, name, power_level, source,
   acquisition_kind, canonical_source_id, regent_id, regent_unlock_id, acquired_level)
VALUES ('c5550000-5555-4555-8555-555555555555',
  'c3330000-3333-4333-8333-333333333333',
  'power-sup-5-48-apex-predator', 'Killing Tempo', 5, 'Regent',
  'regent', 'beast_regent', 'beast_regent',
  'c4440000-4444-4444-8444-444444444444', 10);
INSERT INTO public.character_techniques
  (id, character_id, technique_id, source,
   acquisition_kind, canonical_source_id, regent_id, regent_unlock_id, acquired_level)
VALUES ('c6660000-6666-4666-8666-666666666666',
  'c3330000-3333-4333-8333-333333333333',
  'tech-sup-6-97-summoner-s-bond-strike', 'Regent',
  'regent', 'beast_regent', 'beast_regent',
  'c4440000-4444-4444-8444-444444444444', 10);
INSERT INTO public.character_powers
  (character_id, power_id, name, power_level, source,
   acquisition_kind, canonical_source_id)
VALUES ('c3330000-3333-4333-8333-333333333333',
  'power-sup-5-48-apex-predator', 'Killing Tempo', 5, 'Job', 'job', 'test-job');

SELECT plan(15);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub',
  'c1110000-1111-4111-8111-111111111111', true); END $$;
SELECT is((SELECT points_max FROM public.character_regent_resonance
  WHERE character_id = 'c3330000-3333-4333-8333-333333333333'), 4,
  'one shared level-ten pool starts at four');
SELECT is(public.spend_regent_resonance(
  'c3330000-3333-4333-8333-333333333333', 'power',
  'c5550000-5555-4555-8555-555555555555',
  'c7770000-7777-4777-8777-777777777777'), 3,
  'tier-five power costs one');
SELECT is(public.spend_regent_resonance(
  'c3330000-3333-4333-8333-333333333333', 'power',
  'c5550000-5555-4555-8555-555555555555',
  'c7770000-7777-4777-8777-777777777777'), 3,
  'retrying the same request cannot spend twice');
SELECT throws_ok($$SELECT public.spend_regent_resonance(
  'c3330000-3333-4333-8333-333333333333', 'technique',
  'c6660000-6666-4666-8666-666666666666',
  'c7770000-7777-4777-8777-777777777777')$$,
  '23505', 'RESONANCE_REQUEST_CONFLICT', 'request key cannot be reused for another grant');
SELECT is(public.spend_regent_resonance(
  'c3330000-3333-4333-8333-333333333333', 'technique',
  'c6660000-6666-4666-8666-666666666666',
  'c8880000-8888-4888-8888-888888888888'), 1,
  'tier-six technique costs two from the same pool');
SELECT throws_ok($$SELECT public.spend_regent_resonance(
  'c3330000-3333-4333-8333-333333333333', 'technique',
  'c6660000-6666-4666-8666-666666666666',
  'c9990000-9999-4999-8999-999999999999')$$,
  '23514', 'INSUFFICIENT_REGENT_RESONANCE', 'pool refuses overspend');
SELECT ok(NOT has_table_privilege('authenticated',
  'public.character_regent_resonance', 'UPDATE'),
  'client cannot edit the pool directly');
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub',
  'c2220000-2222-4222-8222-222222222222', true); END $$;
SELECT throws_ok($$SELECT public.spend_regent_resonance(
  'c3330000-3333-4333-8333-333333333333', 'power',
  'c5550000-5555-4555-8555-555555555555',
  'caaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')$$,
  '42501', 'CHARACTER_OWNERSHIP_REQUIRED', 'another user cannot spend this pool');
RESET ROLE;
UPDATE public.characters SET level = 11
WHERE id = 'c3330000-3333-4333-8333-333333333333';
SELECT is((SELECT points_current FROM public.character_regent_resonance
  WHERE character_id = 'c3330000-3333-4333-8333-333333333333'), 1,
  'level eleven adds no points when maximum stays four');
UPDATE public.characters SET level = 12
WHERE id = 'c3330000-3333-4333-8333-333333333333';
SELECT is((SELECT points_current FROM public.character_regent_resonance
  WHERE character_id = 'c3330000-3333-4333-8333-333333333333'), 2,
  'level twelve adds only the one-point maximum increase');
INSERT INTO public.character_powers
  (id, character_id, power_id, name, power_level, source,
   acquisition_kind, canonical_source_id, regent_id, regent_unlock_id, acquired_level)
VALUES ('cbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'c3330000-3333-4333-8333-333333333333',
  'power-sup-8-120-entropic-avatar', 'Entropic Avatar', 8, 'Regent',
  'regent', 'beast_regent', 'beast_regent',
  'c4440000-4444-4444-8444-444444444444', 12);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub',
  'c1110000-1111-4111-8111-111111111111', true); END $$;
SELECT throws_ok($$SELECT public.spend_regent_resonance(
  'c3330000-3333-4333-8333-333333333333', 'power',
  'cbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc')$$,
  '23514', 'INSUFFICIENT_REGENT_RESONANCE', 'tier-eight power needs three points');
SELECT is(public.refill_regent_resonance(
  'c3330000-3333-4333-8333-333333333333'), 5,
  'long rest refills the current maximum');
SELECT is(public.spend_regent_resonance(
  'c3330000-3333-4333-8333-333333333333', 'power',
  'cbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'cddddddd-dddd-4ddd-8ddd-dddddddddddd'), 2,
  'tier-eight power costs three');
RESET ROLE;
DELETE FROM public.character_regent_unlocks
WHERE id = 'c4440000-4444-4444-8444-444444444444';
SELECT is((SELECT count(*) FROM public.character_powers
  WHERE character_id = 'c3330000-3333-4333-8333-333333333333'
    AND power_id = 'power-sup-5-48-apex-predator'), 1::bigint,
  'revocation removes the Regent grant but preserves the Job grant');
SELECT is((SELECT count(*) FROM public.character_techniques
  WHERE id = 'c6660000-6666-4666-8666-666666666666'), 0::bigint,
  'revocation removes the linked technique');
SELECT * FROM finish();
ROLLBACK;

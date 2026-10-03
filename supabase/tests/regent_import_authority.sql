BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users(id, email) VALUES
  ('d1110000-1111-4111-8111-111111111111', 'import-owner@example.test'),
  ('d2220000-2222-4222-8222-222222222222', 'import-other@example.test');
INSERT INTO public.characters(id, user_id, name, level) VALUES
  ('d3330000-3333-4333-8333-333333333333',
   'd1110000-1111-4111-8111-111111111111', 'Original', 5),
  ('d4440000-4444-4444-8444-444444444444',
   'd1110000-1111-4111-8111-111111111111', 'Imported', 5),
  ('d5550000-5555-4555-8555-555555555555',
   'd2220000-2222-4222-8222-222222222222', 'Other', 5),
  ('deee0000-eeee-4eee-8eee-eeeeeeeeeeee',
   'd1110000-1111-4111-8111-111111111111', 'Incomplete', 5);
INSERT INTO public.character_regent_unlocks
  (id, character_id, regent_id, quest_name, is_primary, caught_up_at_level)
VALUES ('d6660000-6666-4666-8666-666666666666',
  'd3330000-3333-4333-8333-333333333333', 'beast_regent',
  'Original quest', true, 5);
INSERT INTO public.character_regent_unlocks
  (id, character_id, regent_id, quest_name, is_primary)
VALUES ('dfff0000-ffff-4fff-8fff-ffffffffffff',
  'deee0000-eeee-4eee-8eee-eeeeeeeeeeee', 'beast_regent',
  'Incomplete quest', true);
INSERT INTO public.character_powers
  (id, character_id, power_id, name, power_level, source,
   acquisition_kind, canonical_source_id, regent_id, regent_unlock_id, acquired_level)
VALUES ('d7770000-7777-4777-8777-777777777777',
  'd3330000-3333-4333-8333-333333333333',
  'power-sup-5-48-apex-predator', 'Killing Tempo', 5, 'Original Regent',
  'regent', 'beast_regent', 'beast_regent',
  'd6660000-6666-4666-8666-666666666666', 5);

SELECT plan(9);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub',
  'd1110000-1111-4111-8111-111111111111', true); END $$;
SELECT is(public.import_regent_unlock_authority(
  'd9990000-9999-4999-8999-999999999999',
  'd4440000-4444-4444-8444-444444444444', 'beast_regent'), NULL::uuid,
  'a fabricated original unlock grants no authority');
SELECT is(public.import_regent_unlock_authority(
  'd6660000-6666-4666-8666-666666666666',
  'd4440000-4444-4444-8444-444444444444', 'war_regent'), NULL::uuid,
  'a mismatched Regent identity grants no authority');
SELECT is(public.import_regent_unlock_authority(
  'dfff0000-ffff-4fff-8fff-ffffffffffff',
  'd4440000-4444-4444-8444-444444444444', 'beast_regent'), NULL::uuid,
  'an incomplete source unlock grants no authority');
DO $$ BEGIN PERFORM set_config('test.import_target_unlock',
  public.import_regent_unlock_authority(
    'd6660000-6666-4666-8666-666666666666',
    'd4440000-4444-4444-8444-444444444444', 'beast_regent')::text, true);
END $$;
SELECT ok(current_setting('test.import_target_unlock')::uuid IS NOT NULL,
  'server copies a completed same-owner unlock');
SELECT is(public.import_regent_grant_authority(
  'd8880000-8888-4888-8888-888888888888', 'power',
  current_setting('test.import_target_unlock')::uuid), NULL::uuid,
  'fabricated original grant stays pending');
SELECT ok(public.import_regent_grant_authority(
  'd7770000-7777-4777-8777-777777777777', 'power',
  current_setting('test.import_target_unlock')::uuid) IS NOT NULL,
  'server copies an original same-owner Regent grant');
SELECT is((SELECT count(*) FROM public.character_powers
  WHERE character_id = 'd4440000-4444-4444-8444-444444444444'
    AND power_id = 'power-sup-5-48-apex-predator'
    AND acquisition_kind = 'regent'), 1::bigint,
  'copied grant has the target unlock provenance');
SELECT ok(public.import_regent_grant_authority(
  'd7770000-7777-4777-8777-777777777777', 'power',
  current_setting('test.import_target_unlock')::uuid) IS NOT NULL,
  'retry returns the existing target grant');
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub',
  'd2220000-2222-4222-8222-222222222222', true); END $$;
SELECT is(public.import_regent_unlock_authority(
  'd6660000-6666-4666-8666-666666666666',
  'd5550000-5555-4555-8555-555555555555', 'beast_regent'), NULL::uuid,
  'another owner cannot copy the original unlock');
SELECT * FROM finish();
ROLLBACK;

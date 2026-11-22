BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('b1110000-1111-4111-8111-111111111111', 'catchup-warden@example.test'),
  ('b2220000-2222-4222-8222-222222222222', 'catchup-owner@example.test');
INSERT INTO public.campaigns (id, name, warden_id, share_code) VALUES
  ('b3330000-3333-4333-8333-333333333333', 'Beast Regent catch-up',
   'b1110000-1111-4111-8111-111111111111', 'REGCAT01');
INSERT INTO public.characters (id, user_id, name, level) VALUES
  ('b4440000-4444-4444-8444-444444444444',
   'b2220000-2222-4222-8222-222222222222', 'Beast Regent handler', 3);
INSERT INTO public.campaign_members (campaign_id, user_id, role, character_id) VALUES
  ('b3330000-3333-4333-8333-333333333333',
   'b2220000-2222-4222-8222-222222222222', 'ascendant',
   'b4440000-4444-4444-8444-444444444444');
INSERT INTO public.character_regent_unlocks
  (id, character_id, regent_id, quest_name, is_primary) VALUES
  ('b5550000-5555-4555-8555-555555555555',
   'b4440000-4444-4444-8444-444444444444', 'beast_regent', 'Beast quest', true);

SELECT plan(21);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'b2220000-2222-4222-8222-222222222222', true); END $$;
SELECT throws_ok($$SELECT public.set_regent_catch_up_options(
  'b5550000-5555-4555-8555-555555555555',
  'b3330000-3333-4333-8333-333333333333', '[]'::jsonb)$$,
  '42501', 'CAMPAIGN_WARDEN_REQUIRED', 'only the Warden curates Regent options');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'b1110000-1111-4111-8111-111111111111', true); END $$;
SELECT throws_ok($$SELECT public.set_regent_catch_up_options(
  'b5550000-5555-4555-8555-555555555555',
  'b3330000-3333-4333-8333-333333333333', '[]'::jsonb)$$,
  '22023', 'REGENT_CATALOG_BELOW_OWED_COUNT',
  'Warden cannot approve a short catalog for Beast Regent level 3');
SELECT throws_ok($$SELECT public.set_regent_catch_up_options(
  'b5550000-5555-4555-8555-555555555555',
  'b3330000-3333-4333-8333-333333333333',
  '[{"kind":"powers","id":"power-sup-5-48-apex-predator"},
    {"kind":"powers","id":"power-sup-5-48-apex-predator"}]'::jsonb)$$,
  '23505', 'DUPLICATE_REGENT_OPTION: powers power-sup-5-48-apex-predator',
  'a catalog cannot list the same option twice');
SELECT is(public.set_regent_catch_up_options(
  'b5550000-5555-4555-8555-555555555555',
  'b3330000-3333-4333-8333-333333333333',
  '[{"kind":"powers","id":"power-sup-5-48-apex-predator"},
    {"kind":"powers","id":"power-arch-5-17-titan-blow"},
    {"kind":"powers","id":"power-sup-5-45-thousand-fists"},
    {"kind":"techniques","id":"tech-sup-5-29-predator-s-leap"},
    {"kind":"techniques","id":"tech-arch-5-51-killer-instinct"},
    {"kind":"techniques","id":"tech-sup-6-97-summoner-s-bond-strike"}]'::jsonb), 6,
  'Warden approves six canonical Regent-caliber choices');
SELECT is((SELECT count(*) FROM public.regent_catch_up_options
  WHERE unlock_id = 'b5550000-5555-4555-8555-555555555555'), 6::bigint,
  'Warden can read the approved catalog through the campaign roster');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'b2220000-2222-4222-8222-222222222222', true); END $$;
SELECT is((SELECT count(*) FROM public.regent_catch_up_options
  WHERE unlock_id = 'b5550000-5555-4555-8555-555555555555'), 6::bigint,
  'player can read approved options for their unlock');
SELECT throws_ok($$SELECT public.complete_regent_catch_up(
  'b5550000-5555-4555-8555-555555555555')$$,
  '22023', 'REGENT_CATCH_UP_PICKS_INCOMPLETE',
  'server refuses to complete before exact picks persist');
SELECT throws_ok($$INSERT INTO public.character_powers
  (character_id, power_id, name, power_level, source,
   acquisition_kind, canonical_source_id, regent_id, regent_unlock_id, acquired_level) VALUES
  ('b4440000-4444-4444-8444-444444444444',
   'power-sup-9-97-s-rank-smite', 'S-Rank Smite', 9,
   'Any display label', 'regent', 'beast_regent', 'beast_regent',
   'b5550000-5555-4555-8555-555555555555', 3)$$,
  '42501', 'REGENT_PICK_NOT_WARDEN_APPROVED',
  'an unapproved high-tier pick is rejected');

INSERT INTO public.character_powers
  (character_id, power_id, name, power_level, source,
   acquisition_kind, canonical_source_id, regent_id, regent_unlock_id, acquired_level)
SELECT 'b4440000-4444-4444-8444-444444444444', pick.id, pick.name,
  5, 'Renamed Regent display label', 'regent', 'beast_regent', 'beast_regent',
  'b5550000-5555-4555-8555-555555555555', 3
FROM (VALUES
  ('power-sup-5-48-apex-predator', 'Killing Tempo'),
  ('power-arch-5-17-titan-blow', 'Titan Blow'),
  ('power-sup-5-45-thousand-fists', 'Thousand Fists')
) AS pick(id, name);
INSERT INTO public.character_techniques
  (character_id, technique_id, source,
   acquisition_kind, canonical_source_id, regent_id, regent_unlock_id, acquired_level)
SELECT 'b4440000-4444-4444-8444-444444444444', pick.id,
  'Renamed Regent display label', 'regent', 'beast_regent', 'beast_regent',
  'b5550000-5555-4555-8555-555555555555', 3
FROM (VALUES
  ('tech-sup-5-29-predator-s-leap'),
  ('tech-arch-5-51-killer-instinct'),
  ('tech-sup-6-97-summoner-s-bond-strike')
) AS pick(id);
SELECT is((SELECT count(*) FROM public.character_powers
  WHERE regent_unlock_id = 'b5550000-5555-4555-8555-555555555555'
    AND acquisition_kind = 'regent'), 3::bigint,
  'all three Regent powers persist');
SELECT is((SELECT count(*) FROM public.character_techniques
  WHERE regent_unlock_id = 'b5550000-5555-4555-8555-555555555555'
    AND acquisition_kind = 'regent'), 3::bigint,
  'all three Regent techniques persist');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'b1110000-1111-4111-8111-111111111111', true); END $$;
SELECT throws_ok($$SELECT public.set_regent_catch_up_options(
  'b5550000-5555-4555-8555-555555555555',
  'b3330000-3333-4333-8333-333333333333',
  '[{"kind":"powers","id":"power-arch-5-24-surge-stride"},
    {"kind":"powers","id":"power-arch-5-17-titan-blow"},
    {"kind":"powers","id":"power-sup-5-45-thousand-fists"},
    {"kind":"techniques","id":"tech-sup-5-29-predator-s-leap"},
    {"kind":"techniques","id":"tech-arch-5-51-killer-instinct"},
    {"kind":"techniques","id":"tech-sup-6-97-summoner-s-bond-strike"}]'::jsonb)$$,
  '22023', 'REGENT_CATALOG_WOULD_REVOKE_PERSISTED_PICK',
  'Warden cannot drop an option the player already picked');
SELECT is(public.set_regent_catch_up_options(
  'b5550000-5555-4555-8555-555555555555',
  'b3330000-3333-4333-8333-333333333333',
  '[{"kind":"powers","id":"power-sup-5-48-apex-predator"},
    {"kind":"powers","id":"power-arch-5-17-titan-blow"},
    {"kind":"powers","id":"power-sup-5-45-thousand-fists"},
    {"kind":"techniques","id":"tech-sup-5-29-predator-s-leap"},
    {"kind":"techniques","id":"tech-arch-5-51-killer-instinct"},
    {"kind":"techniques","id":"tech-sup-6-97-summoner-s-bond-strike"}]'::jsonb), 6,
  'Warden can re-approve the same catalog after picks persist');
SELECT is((SELECT count(*) FROM public.regent_catch_up_options
  WHERE unlock_id = 'b5550000-5555-4555-8555-555555555555'), 6::bigint,
  're-approval replaces the catalog without duplicating rows');
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'b2220000-2222-4222-8222-222222222222', true); END $$;
INSERT INTO public.character_powers
  (character_id, power_id, name, power_level, source, acquisition_kind, canonical_source_id)
VALUES ('b4440000-4444-4444-8444-444444444444',
  'power-sup-5-48-apex-predator', 'Killing Tempo', 5, 'Job progression', 'job', 'test-job');
SELECT is((SELECT count(*) FROM public.character_powers
  WHERE character_id = 'b4440000-4444-4444-8444-444444444444'
    AND power_id = 'power-sup-5-48-apex-predator'), 2::bigint,
  'the same canonical power may have separate Regent and Job grants');
INSERT INTO public.character_powers
  (character_id, power_id, name, power_level, source, acquisition_kind, canonical_source_id)
VALUES ('b4440000-4444-4444-8444-444444444444',
  'power-sup-5-48-apex-predator', 'Killing Tempo', 5, 'Path progression', 'path', 'test-path');
SELECT is((SELECT count(*) FROM public.character_powers
  WHERE character_id = 'b4440000-4444-4444-8444-444444444444'
    AND power_id = 'power-sup-5-48-apex-predator'), 3::bigint,
  'the same canonical power may have separate Job, Path, and Regent grants');
INSERT INTO public.character_techniques
  (character_id, technique_id, source, acquisition_kind, canonical_source_id)
VALUES
  ('b4440000-4444-4444-8444-444444444444',
   'tech-sup-5-29-predator-s-leap', 'Job progression', 'job', 'test-job'),
  ('b4440000-4444-4444-8444-444444444444',
   'tech-sup-5-29-predator-s-leap', 'Path progression', 'path', 'test-path');
SELECT is((SELECT count(*) FROM public.character_techniques
  WHERE character_id = 'b4440000-4444-4444-8444-444444444444'
    AND technique_id = 'tech-sup-5-29-predator-s-leap'), 3::bigint,
  'the same canonical technique may have separate Job, Path, and Regent grants');
SELECT is(public.complete_regent_catch_up('b5550000-5555-4555-8555-555555555555'), 3,
  'server completes catch-up at the confirmed level');
SELECT is((SELECT caught_up_at_level FROM public.character_regent_unlocks
  WHERE id = 'b5550000-5555-4555-8555-555555555555'), 3,
  'completion stamp is durable only after exact picks');

-- One guard serves both tables; it must not read the other table's columns.
SELECT lives_ok(
  $$UPDATE public.character_powers SET is_prepared = true
    WHERE regent_unlock_id = 'b5550000-5555-4555-8555-555555555555'
      AND acquisition_kind = 'regent'$$,
  'the owner can update a Regent-granted power');
SELECT lives_ok(
  $$UPDATE public.character_techniques SET learned_at = learned_at
    WHERE regent_unlock_id = 'b5550000-5555-4555-8555-555555555555'
      AND acquisition_kind = 'regent'$$,
  'the owner can update a Regent-granted technique');
SELECT throws_ok(
  $$UPDATE public.character_powers SET power_id = 'power-arch-5-24-surge-stride'
    WHERE regent_unlock_id = 'b5550000-5555-4555-8555-555555555555'
      AND power_id = 'power-sup-5-48-apex-predator'
      AND acquisition_kind = 'regent'$$,
  '42501', 'REGENT_GRANT_IDENTITY_IMMUTABLE',
  'a Regent grant cannot be swapped for a different ability');

SELECT * FROM finish();
ROLLBACK;

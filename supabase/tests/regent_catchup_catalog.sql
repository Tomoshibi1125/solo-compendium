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

SELECT plan(11);
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
  (character_id, power_id, name, power_level, source) VALUES
  ('b4440000-4444-4444-8444-444444444444',
   'power-sup-9-97-s-rank-smite', 'S-Rank Smite', 9,
   'Beast Regent Attunement (Catch-Up)')$$,
  '42501', 'REGENT_PICK_NOT_WARDEN_APPROVED',
  'an unapproved high-tier pick is rejected');

INSERT INTO public.character_powers
  (character_id, power_id, name, power_level, source) VALUES
  ('b4440000-4444-4444-8444-444444444444', 'power-sup-5-48-apex-predator', 'Killing Tempo', 5, 'Beast Regent Attunement (Catch-Up)'),
  ('b4440000-4444-4444-8444-444444444444', 'power-arch-5-17-titan-blow', 'Titan Blow', 5, 'Beast Regent Attunement (Catch-Up)'),
  ('b4440000-4444-4444-8444-444444444444', 'power-sup-5-45-thousand-fists', 'Thousand Fists', 5, 'Beast Regent Attunement (Catch-Up)');
INSERT INTO public.character_techniques
  (character_id, technique_id, source) VALUES
  ('b4440000-4444-4444-8444-444444444444', 'tech-sup-5-29-predator-s-leap', 'Beast Regent Attunement (Catch-Up)'),
  ('b4440000-4444-4444-8444-444444444444', 'tech-arch-5-51-killer-instinct', 'Beast Regent Attunement (Catch-Up)'),
  ('b4440000-4444-4444-8444-444444444444', 'tech-sup-6-97-summoner-s-bond-strike', 'Beast Regent Attunement (Catch-Up)');
SELECT is((SELECT count(*) FROM public.character_powers
  WHERE source = 'Beast Regent Attunement (Catch-Up)' AND character_id = 'b4440000-4444-4444-8444-444444444444'), 3::bigint,
  'all three Regent powers persist');
SELECT is((SELECT count(*) FROM public.character_techniques
  WHERE source = 'Beast Regent Attunement (Catch-Up)' AND character_id = 'b4440000-4444-4444-8444-444444444444'), 3::bigint,
  'all three Regent techniques persist');
SELECT is(public.complete_regent_catch_up('b5550000-5555-4555-8555-555555555555'), 3,
  'server completes catch-up at the confirmed level');
SELECT is((SELECT caught_up_at_level FROM public.character_regent_unlocks
  WHERE id = 'b5550000-5555-4555-8555-555555555555'), 3,
  'completion stamp is durable only after exact picks');

SELECT * FROM finish();
ROLLBACK;

BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('a1110000-1111-4111-8111-111111111111', 'scaled-warden@example.test'),
  ('a2220000-2222-4222-8222-222222222222', 'scaled-handler@example.test');
INSERT INTO public.campaigns (id, name, warden_id, share_code) VALUES
  ('a3330000-3333-4333-8333-333333333333', 'Scaled companions',
   'a1110000-1111-4111-8111-111111111111', 'SCALE001');
INSERT INTO public.campaign_members (id, campaign_id, user_id, role) VALUES
  ('a4440000-4444-4444-8444-444444444444',
   'a3330000-3333-4333-8333-333333333333',
   'a2220000-2222-4222-8222-222222222222', 'ascendant');
INSERT INTO public.characters (id, user_id, name) VALUES
  ('a5550000-5555-4555-8555-555555555555',
   'a2220000-2222-4222-8222-222222222222', 'Mount handler');
UPDATE public.campaign_members SET character_id = 'a5550000-5555-4555-8555-555555555555'
WHERE id = 'a4440000-4444-4444-8444-444444444444';
INSERT INTO public.campaign_combat_sessions (id, campaign_id, created_by) VALUES
  ('a6660000-6666-4666-8666-666666666666',
   'a3330000-3333-4333-8333-333333333333',
   'a1110000-1111-4111-8111-111111111111');
INSERT INTO public.companion_instances (
  id, owner_scope, owner_character_id, primary_handler_character_id,
  identity_kind, source_kind, source_collection, source_id,
  source_revision, source_snapshot, origin_table, origin_row_id, combat_state
) VALUES (
  'a7770000-7777-4777-8777-777777777777', 'character',
  'a5550000-5555-4555-8555-555555555555',
  'a5550000-5555-4555-8555-555555555555',
  'mount', 'canonical-mount', 'vehicles', 'mount-bonded-eternal-void-beast',
  'fixture-v1', '{"sourceFields":{"name":"Bonded Eternal Void Beast","rank":"C","hpMax":87,"baseAc":19,"speed":50}}',
  'test_fixture', 'a8880000-8888-4888-8888-888888888888',
  '{"hp":99,"maxHp":87}'
);

SELECT plan(19);
-- The linked Eternal Void Beast is 13d8: one maximum d8 at owner level 1.
SELECT is((SELECT combat_state->>'maxHp' FROM public.companion_instances
  WHERE id = 'a7770000-7777-4777-8777-777777777777'), '8',
  'a bonded mount scales from its linked Anomaly Hit Die, not its source HP');
SELECT is((SELECT combat_state->>'hp' FROM public.companion_instances
  WHERE id = 'a7770000-7777-4777-8777-777777777777'), '8',
  'source-sized current HP is clamped to scaled max HP');
SELECT is((SELECT app_private.companion_c3_ac(instance)::INTEGER FROM public.companion_instances AS instance
  WHERE id = 'a7770000-7777-4777-8777-777777777777'), 12,
  'source AC is superseded by rank-and-level AC');
SELECT is((SELECT count(*) FROM public.regent_catch_up_requirements
  WHERE regent_id = 'beast_regent' AND character_level = 3 AND powers = 3 AND techniques = 3), 1::bigint,
  'Beast Regent level 3 retains its complete owed count');
SELECT ok((SELECT count(*) FROM public.regent_canonical_pick_options WHERE kind = 'powers' AND tier >= 5) >= 10
  AND (SELECT count(*) FROM public.regent_canonical_pick_options WHERE kind = 'techniques' AND tier >= 5) >= 10,
  'Warden curation has a canonical high-tier power and technique pool');
SELECT is((SELECT count(*) FROM public.regent_catch_up_requirements), 240::bigint,
  'all twelve Regents have exact requirements at levels 1 through 20');
SELECT ok(NOT EXISTS (
  SELECT 1 FROM public.regent_catch_up_requirements AS req
  WHERE req.powers > (SELECT count(*) FROM public.regent_canonical_pick_options WHERE kind = 'powers')
     OR req.techniques > (SELECT count(*) FROM public.regent_canonical_pick_options WHERE kind = 'techniques')
     OR req.cantrips > (SELECT count(*) FROM public.regent_canonical_pick_options WHERE kind = 'cantrips')
     OR req.spells > (SELECT count(*) FROM public.regent_canonical_pick_options
                      WHERE kind = 'spells' AND tier <= req.max_spell_tier)
), 'each Regent level has enough canonical options for every owed bucket');
SELECT ok(NOT EXISTS (
  SELECT 1 FROM public.regent_catch_up_requirements
  WHERE spells > 0 AND max_spell_tier = 0
), 'spellcasting Regents have an actionable spell tier when spells are owed');

SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'a1110000-1111-4111-8111-111111111111', true); END $$;
SELECT ok((SELECT count(*) FROM public.companion_instances
  WHERE id = 'a7770000-7777-4777-8777-777777777777') = 1,
  'campaign Warden can inspect a roster character-owned mount');
SELECT ok(public.add_companion_to_combat(
  'a6660000-6666-4666-8666-666666666666',
  'a7770000-7777-4777-8777-777777777777', 12) IS NOT NULL,
  'Warden adds the living mount to campaign combat');
SELECT is((SELECT stats->>'max_hp' FROM public.campaign_combatants
  WHERE companion_instance_id = 'a7770000-7777-4777-8777-777777777777'), '8',
  'initial combatant uses level-scaled HP');
-- Rank C (tier 2) at level 1: attack 2 + 2 + PB 2, save DC 8 + 2 + PB 2.
SELECT is((SELECT stats->>'attack_bonus' FROM public.campaign_combatants
  WHERE companion_instance_id = 'a7770000-7777-4777-8777-777777777777'), '6',
  'combatant records the scaled attack bonus');
SELECT is((SELECT stats->>'save_dc' FROM public.campaign_combatants
  WHERE companion_instance_id = 'a7770000-7777-4777-8777-777777777777'), '12',
  'combatant records the scaled save DC');
SELECT ok((SELECT NOT (stats ? 'damage_dice') FROM public.campaign_combatants
  WHERE companion_instance_id = 'a7770000-7777-4777-8777-777777777777'),
  'damage is resolved per authored roll, not one shared damage string');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'a2220000-2222-4222-8222-222222222222', true); END $$;
UPDATE public.characters SET level = 5 WHERE id = 'a5550000-5555-4555-8555-555555555555';
SELECT is((SELECT stats->>'max_hp' FROM public.campaign_combatants
  WHERE companion_instance_id = 'a7770000-7777-4777-8777-777777777777'), '40',
  'owner level-up refreshes active combat max HP');
SELECT is((SELECT stats->>'hp' FROM public.campaign_combatants
  WHERE companion_instance_id = 'a7770000-7777-4777-8777-777777777777'), '8',
  'a raised maximum does not heal current HP');
SELECT is((SELECT stats->>'ac' FROM public.campaign_combatants
  WHERE companion_instance_id = 'a7770000-7777-4777-8777-777777777777'), '13',
  'owner level-up refreshes active combat AC');
SELECT is((SELECT stats->>'attack_bonus' FROM public.campaign_combatants
  WHERE companion_instance_id = 'a7770000-7777-4777-8777-777777777777'), '7',
  'owner level-up refreshes attack proficiency');

SELECT ok(to_regprocedure('public.set_companion_scaling_profile(uuid,uuid,jsonb)') IS NULL,
  'Warden scaling coefficients are retired');

SELECT * FROM finish();
ROLLBACK;

-- The server catalog, not a client snapshot, decides a living companion's
-- species, rank, and scaled numbers.
BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('2020bbbb-2020-4020-8020-202020202020', 'c2-source-owner@example.test'),
  ('3030cccc-3030-4030-8030-303030303030', 'c2-source-outsider@example.test');
INSERT INTO public.characters (id, user_id, name)
VALUES ('5050eeee-5050-4050-8050-505050505050',
        '2020bbbb-2020-4020-8020-202020202020', 'C2 source handler');
INSERT INTO public.character_vehicles (id, character_id, vehicle_id, current_hp) VALUES
  ('6060ffff-6060-4060-8060-606060606060', '5050eeee-5050-4050-8050-505050505050',
   'mount-mana-touched-wolf', 999),
  ('7070aaaa-7070-4070-8070-707070707070', '5050eeee-5050-4050-8050-505050505050',
   'not-a-catalog-mount', 10);

SELECT plan(8);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '3030cccc-3030-4030-8030-303030303030', true); END $$;
SELECT throws_ok(
  $$SELECT public.register_character_vehicle_mount('6060ffff-6060-4060-8060-606060606060', NULL)$$,
  '42501', 'CHARACTER_OWNERSHIP_REQUIRED',
  'an outsider cannot register another character''s mount');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '2020bbbb-2020-4020-8020-202020202020', true); END $$;
SELECT throws_ok(
  $$SELECT public.register_character_vehicle_mount('7070aaaa-7070-4070-8070-707070707070', NULL)$$,
  '22023', 'CANONICAL_LIVING_MOUNT_NOT_FOUND',
  'an unknown mount cannot become a living companion');
SELECT throws_ok(
  $$SELECT public.register_character_vehicle_mount('6060ffff-6060-4060-8060-606060606060',
    '{"provenance":{"canonicalId":"mount-bureau-warhorse"}}'::jsonb)$$,
  '22023', 'CANONICAL_SOURCE_ID_MISMATCH',
  'a snapshot naming a different source is rejected');
SELECT lives_ok($$DO $body$
BEGIN
  PERFORM set_config('test.c2_mount_instance', public.register_character_vehicle_mount(
    '6060ffff-6060-4060-8060-606060606060',
    '{"provenance":{"canonicalId":"mount-mana-touched-wolf"},
      "sourceFields":{"rank":"S","hpMax":999999,"name":"Forged"}}'::jsonb)::TEXT, true);
END $body$;$$,
  'the server resolves a known mount despite forged client rank and HP fields');
SELECT lives_ok(
  $$INSERT INTO public.character_extras
      (id, character_id, name, extra_type, hp_current, hp_max, ac, npc_data)
    VALUES ('8080bbbb-8080-4080-8080-808080808080', '5050eeee-5050-4050-8050-505050505050',
      'Forged dragon', 'companion', 999999, 999999, 30,
      '{"kind":"canonical-compendium","version":1,"provenance":{"canonicalId":"anomaly-0006","canonicalType":"anomaly","canonicalCollection":"anomalies","entryType":"anomaly","source":null,"sourceBook":null},"sourceFields":{"name":"Forged","hpMax":999999,"baseAc":30,"speed":30,"rank":"S"}}')$$,
  'the owner saves a companion sheet with forged stat fields');
RESET ROLE;

SELECT is(
  (SELECT row(source_snapshot#>>'{sourceFields,rank}', (source_snapshot#>>'{sourceFields,hpMax}')::INTEGER)::TEXT
   FROM public.companion_instances
   WHERE id = current_setting('test.c2_mount_instance')::UUID),
  row('D', 24)::TEXT,
  'the stored mount snapshot comes from the server catalog');
SELECT is(
  (SELECT current_hp FROM public.character_vehicles WHERE id = '6060ffff-6060-4060-8060-606060606060'),
  8, 'the living mount starts at its scaled maximum, one d8 at level 1');
SELECT is(
  (SELECT row(extra.hp_current, extra.hp_max, app_private.companion_c3_ac(instance)::INTEGER)::TEXT
   FROM public.character_extras AS extra
   JOIN public.companion_instances AS instance ON instance.id = extra.companion_instance_id
   WHERE extra.id = '8080bbbb-8080-4080-8080-808080808080'),
  row(10, 10, 11)::TEXT,
  'a forged sheet still scales from the catalog Hit Die and rank');

SELECT * FROM finish();
ROLLBACK;

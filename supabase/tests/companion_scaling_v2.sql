-- RA-10: one scaled version per species at its owner's level.
BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('d1110000-1111-4111-8111-111111111111', 'ra10-owner@example.test'),
  ('d1220000-2222-4222-8222-222222222222', 'ra10-rider@example.test');
INSERT INTO public.characters (id, user_id, name, level) VALUES
  ('d2110000-1111-4111-8111-111111111111', 'd1110000-1111-4111-8111-111111111111', 'RA-10 owner', 5),
  ('d2220000-2222-4222-8222-222222222222', 'd1220000-2222-4222-8222-222222222222', 'RA-10 rider', 20);

-- Saved as the Add Companion catalog saves them; the snapshot keeps wild stats.
INSERT INTO public.character_extras (id, character_id, name, extra_type, hp_current, hp_max, ac, speed, npc_data, is_active)
VALUES
  ('d3000000-0000-4000-8000-000000000001', 'd2110000-1111-4111-8111-111111111111',
   'Eternal Ancient Dragon', 'companion', 999, 12, 13, 30,
   '{"kind":"canonical-compendium","version":1,"provenance":{"canonicalId":"anomaly-0006","canonicalType":"anomaly","canonicalCollection":"anomalies","entryType":"Elemental","source":null,"sourceBook":null},"sourceFields":{"name":"Eternal Ancient Dragon","hpMax":12,"baseAc":13,"speed":30,"rank":"D"}}',
   false),
  ('d3000000-0000-4000-8000-000000000002', 'd2110000-1111-4111-8111-111111111111',
   'Mana-Touched Wolf', 'mount', 24, 24, 13, 50,
   '{"kind":"canonical-compendium","version":1,"provenance":{"canonicalId":"mount-mana-touched-wolf","canonicalType":"vehicle","canonicalCollection":"vehicles","entryType":"mount","source":null,"sourceBook":"Rift Ascendant Canon"},"sourceFields":{"name":"Mana-Touched Wolf","hpMax":24,"baseAc":13,"speed":50,"rank":"D"}}',
   false),
  ('d3000000-0000-4000-8000-000000000003', 'd2110000-1111-4111-8111-111111111111',
   'Bureau Riding Horse', 'mount', 13, 13, 10, 60,
   '{"kind":"canonical-compendium","version":1,"provenance":{"canonicalId":"mount-bureau-riding-horse","canonicalType":"vehicle","canonicalCollection":"vehicles","entryType":"mount","source":null,"sourceBook":"Rift Ascendant Canon"},"sourceFields":{"name":"Bureau Riding Horse","hpMax":13,"baseAc":10,"speed":60,"rank":"D"}}',
   false);

SELECT plan(16);

-- Catalog inputs mirror the app's resolver.
SELECT is((SELECT count(*) FROM app_private.canonical_companion_sources
  WHERE source_collection = 'anomalies' AND scaling_kind = 'stat-block'
    AND scaling_anomaly_id = source_id),
  (SELECT count(*) FROM app_private.canonical_companion_sources WHERE source_collection = 'anomalies'),
  'every Anomaly companion scales from its own stat block');
SELECT is((SELECT count(*) FROM app_private.canonical_companion_sources
  WHERE source_collection = 'vehicles' AND scaling_kind = 'stat-block'), 10::bigint,
  'the ten linked mounts scale from their Anomaly');
SELECT is((SELECT string_agg(source_id || ':' || hit_die, ',' ORDER BY source_id)
  FROM app_private.canonical_companion_sources
  WHERE source_collection = 'vehicles' AND scaling_kind = 'size'),
  'mount-bureau-k9-mastiff:8,mount-bureau-warhorse:10,mount-mana-touched-wolf:8,mount-mountain-patrol-bear:10,mount-sovereign-steed:10',
  'exactly the five combat-capable mounts scale by size');
SELECT ok((SELECT snapshot#>>'{sourceFields,name}' = 'Pantheon Steed'
  FROM app_private.canonical_companion_sources
  WHERE source_collection = 'vehicles' AND source_id = 'mount-sovereign-steed')
  AND NOT EXISTS (SELECT 1 FROM app_private.canonical_companion_sources
    WHERE snapshot::TEXT ILIKE '%sovereign steed%'),
  'the Holy Knight mount is the Pantheon Steed');

-- Hit points: L maximum Hit Dice with no VIT.
SELECT is((SELECT array[hp_current, hp_max] FROM public.character_extras
  WHERE id = 'd3000000-0000-4000-8000-000000000001'), array[50, 50],
  'a d10 Anomaly has 50 HP at level 5 and its sheet cannot exceed it');
SELECT is((SELECT (instance.combat_state->>'maxHp')::INTEGER
  FROM public.character_extras AS extra
  JOIN public.companion_instances AS instance ON instance.id = extra.companion_instance_id
  WHERE extra.id = 'd3000000-0000-4000-8000-000000000001'), 50,
  'the living instance carries the same scaled maximum');
SELECT is((SELECT app_private.companion_c3_ac(instance)::INTEGER
  FROM public.character_extras AS extra
  JOIN public.companion_instances AS instance ON instance.id = extra.companion_instance_id
  WHERE extra.id = 'd3000000-0000-4000-8000-000000000001'), 12,
  'AC is 10 + rank tier + floor((L - 1) / 4)');
SELECT is((SELECT hp_max FROM public.character_extras
  WHERE id = 'd3000000-0000-4000-8000-000000000002'), 40,
  'a Mana-Touched Wolf has 40 HP at level 5');
SELECT ok((SELECT extra.hp_max = 13
    AND app_private.companion_scaling_hit_die(instance) IS NULL
    AND app_private.companion_c3_max_hp(instance) = 13
  FROM public.character_extras AS extra
  JOIN public.companion_instances AS instance ON instance.id = extra.companion_instance_id
  WHERE extra.id = 'd3000000-0000-4000-8000-000000000003'),
  'a utility mount keeps its saved stats');

-- Level-ups raise the maximum without healing; HP never exceeds it.
UPDATE public.characters SET level = 6 WHERE id = 'd2110000-1111-4111-8111-111111111111';
SELECT is((SELECT array[hp_current, hp_max] FROM public.character_extras
  WHERE id = 'd3000000-0000-4000-8000-000000000001'), array[50, 60],
  'a level-up raises maximum HP without healing current HP');
UPDATE public.character_extras SET hp_current = 999
WHERE id = 'd3000000-0000-4000-8000-000000000001';
SELECT is((SELECT hp_current FROM public.character_extras
  WHERE id = 'd3000000-0000-4000-8000-000000000001'), 60,
  'healing stops at the scaled maximum');

-- A rider never changes a mount's level.
UPDATE public.companion_instances AS instance
SET rider_character_id = 'd2220000-2222-4222-8222-222222222222'
FROM public.character_extras AS extra
WHERE extra.id = 'd3000000-0000-4000-8000-000000000002'
  AND instance.id = extra.companion_instance_id;
SELECT is((SELECT app_private.companion_c3_max_hp(instance)::INTEGER
  FROM public.character_extras AS extra
  JOIN public.companion_instances AS instance ON instance.id = extra.companion_instance_id
  WHERE extra.id = 'd3000000-0000-4000-8000-000000000002'), 48,
  'a mount scales with its owner, not a higher-level rider');

-- A newly registered living mount starts at full scaled HP.
INSERT INTO public.character_vehicles (id, character_id, vehicle_id, current_hp)
VALUES ('d4000000-0000-4000-8000-000000000001', 'd2110000-1111-4111-8111-111111111111',
  'mount-mountain-patrol-bear', 34);
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', 'd1110000-1111-4111-8111-111111111111', true);
SELECT ok(public.register_character_vehicle_mount(
  'd4000000-0000-4000-8000-000000000001', NULL) IS NOT NULL,
  'the owner registers the living mount');
RESET ROLE;
SELECT is((SELECT current_hp FROM public.character_vehicles
  WHERE id = 'd4000000-0000-4000-8000-000000000001'), 60,
  'a Mountain Patrol Bear starts at 6d10 maximum HP');

-- The scaling helpers are internal.
SELECT is((SELECT count(*) FROM pg_proc AS p
  JOIN pg_namespace AS n ON n.oid = p.pronamespace
  CROSS JOIN LATERAL aclexplode(COALESCE(p.proacl, acldefault('f', p.proowner))) AS acl
  WHERE n.nspname = 'app_private'
    AND p.proname IN ('companion_level_for_scaling', 'companion_rank_tier',
      'companion_scaling_hit_die', 'companion_proficiency_bonus',
      'clamp_scaled_companion_extra_hp', 'clamp_scaled_companion_vehicle_hp',
      'refresh_scaled_companion_on_owner_change')
    AND acl.grantee = 0 AND acl.privilege_type = 'EXECUTE'), 0::bigint,
  'PUBLIC cannot execute the scaling helpers');
SELECT ok(NOT has_function_privilege('authenticated',
  'app_private.companion_scaling_hit_die(public.companion_instances)', 'EXECUTE'),
  'clients cannot call the scaling helpers directly');

SELECT * FROM finish();
ROLLBACK;

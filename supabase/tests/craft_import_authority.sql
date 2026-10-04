BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('d1100000-1111-4111-8111-111111111111', 'craft-import-owner@example.test'),
  ('d1200000-1111-4111-8111-111111111111', 'craft-import-outsider@example.test');
INSERT INTO public.characters (id, user_id, name) VALUES
  ('d2100000-1111-4111-8111-111111111111',
   'd1100000-1111-4111-8111-111111111111', 'Original maker'),
  ('d2200000-1111-4111-8111-111111111111',
   'd1100000-1111-4111-8111-111111111111', 'Imported maker'),
  ('d2300000-1111-4111-8111-111111111111',
   'd1200000-1111-4111-8111-111111111111', 'Unrelated maker');
INSERT INTO public.material_lots
  (id, material_definition_id, owner_scope, owner_character_id,
   quantity, unit, provenance_status) VALUES
  ('d3100000-1111-4111-8111-111111111111', 'material-field-ration-base',
   'character', 'd2100000-1111-4111-8111-111111111111', 4, 'kit', 'manual'),
  ('d3200000-1111-4111-8111-111111111111', 'material-field-ration-base',
   'character', 'd2200000-1111-4111-8111-111111111111', 4, 'kit', 'manual');
INSERT INTO public.craft_projects_m3
  (id, character_id, formula_id, formula_revision, formula_snapshot)
VALUES ('d4100000-1111-4111-8111-111111111111',
  'd2100000-1111-4111-8111-111111111111',
  'recipe-residue-safe-rations', 'm3-rations-v1', '{}'::jsonb);
INSERT INTO public.material_lot_reservations
  (lot_id, quantity, reservation_kind, reference_id,
   created_by_user_id, usage_role)
VALUES ('d3100000-1111-4111-8111-111111111111', 2,
  'craft-project-m3', 'd4100000-1111-4111-8111-111111111111',
  'd1100000-1111-4111-8111-111111111111', 'Consumed');

SELECT plan(5);
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', 'd1100000-1111-4111-8111-111111111111', true);
SELECT lives_ok($$SELECT public.import_craft_state_authority(
  'd2100000-1111-4111-8111-111111111111',
  'd2200000-1111-4111-8111-111111111111',
  '{"d3100000-1111-4111-8111-111111111111":"d3200000-1111-4111-8111-111111111111"}'::jsonb,
  'craft-import-operation-001')$$,
  'same-owner project state is restored');
SELECT is((SELECT count(*) FROM public.craft_projects_m3
  WHERE character_id = 'd2200000-1111-4111-8111-111111111111'), 1::bigint,
  'the import creates one target project');
SELECT is((SELECT count(*) FROM public.material_lot_reservations r
  JOIN public.craft_projects_m3 p ON r.reference_id = p.id::TEXT
  WHERE p.character_id = 'd2200000-1111-4111-8111-111111111111'
    AND r.lot_id = 'd3200000-1111-4111-8111-111111111111'
    AND r.status = 'active'), 1::bigint,
  'active reservation points to the remapped target lot');
SELECT is((public.import_craft_state_authority(
  'd2100000-1111-4111-8111-111111111111',
  'd2200000-1111-4111-8111-111111111111',
  '{"d3100000-1111-4111-8111-111111111111":"d3200000-1111-4111-8111-111111111111"}'::jsonb,
  'craft-import-operation-001')->>'imported_projects')::INTEGER, 1,
  'retry returns the existing receipt');
SELECT throws_ok($$SELECT public.import_craft_state_authority(
  'd2300000-1111-4111-8111-111111111111',
  'd2200000-1111-4111-8111-111111111111', '{}'::jsonb,
  'craft-import-operation-002')$$,
  '42501', 'CRAFT_IMPORT_SAME_OWNER_REQUIRED',
  'a different owner cannot provide project history');

SELECT * FROM finish();
ROLLBACK;

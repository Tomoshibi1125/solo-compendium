BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('1111aaaa-1111-4111-8111-111111111111', 'm3-owner@example.test'),
  ('2222bbbb-2222-4222-8222-222222222222', 'm3-outsider@example.test');
INSERT INTO public.characters (id, user_id, name)
VALUES ('3333cccc-3333-4333-8333-333333333333',
        '1111aaaa-1111-4111-8111-111111111111', 'M3 maker');
INSERT INTO public.character_abilities (character_id, ability, score)
VALUES ('3333cccc-3333-4333-8333-333333333333', 'INT', 12);
INSERT INTO public.character_equipment
  (character_id, name, item_type, quantity)
VALUES ('3333cccc-3333-4333-8333-333333333333',
        'survival kit', 'gear', 1);
INSERT INTO public.character_recipes (character_id, recipe_id)
VALUES ('3333cccc-3333-4333-8333-333333333333',
        'recipe-residue-safe-rations');
INSERT INTO public.material_lots
  (id, material_definition_id, owner_scope, owner_character_id,
   quantity, unit, provenance_status)
VALUES
  ('4444dddd-4444-4444-8444-444444444444',
   'material-field-ration-base', 'character',
   '3333cccc-3333-4333-8333-333333333333', 4, 'kit', 'manual'),
  ('5555eeee-5555-4555-8555-555555555555',
   'material-containment-foam', 'character',
   '3333cccc-3333-4333-8333-333333333333', 2, 'canister', 'manual');
UPDATE public.craft_formulas_m3 SET dc = 1
WHERE id = 'recipe-residue-safe-rations';

SELECT plan(29);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '1111aaaa-1111-4111-8111-111111111111', true); END $$;

SELECT lives_ok($$DO $body$
BEGIN
  PERFORM set_config('test.m3_success', public.reserve_craft_project_m3(
    '3333cccc-3333-4333-8333-333333333333',
    'recipe-residue-safe-rations',
    '[{"lot_id":"4444dddd-4444-4444-8444-444444444444","quantity":2},
      {"lot_id":"5555eeee-5555-4555-8555-555555555555","quantity":1}]'::jsonb,
    'm3-reserve-success-001'
  )::TEXT, true);
END $body$;$$, 'the owner can reserve exact known-formula inputs');
SELECT is(
  public.reserve_craft_project_m3(
    '3333cccc-3333-4333-8333-333333333333', 'recipe-residue-safe-rations',
    '[{"lot_id":"4444dddd-4444-4444-8444-444444444444","quantity":2},
      {"lot_id":"5555eeee-5555-4555-8555-555555555555","quantity":1}]'::jsonb,
    'm3-reserve-success-001')::TEXT,
  current_setting('test.m3_success'),
  'a lost reserve response returns the same project');
SELECT is((SELECT count(*) FROM public.material_lot_reservations
           WHERE reference_id = current_setting('test.m3_success')), 2::bigint,
          'reserve retry does not duplicate reservations');
SELECT throws_ok(
  $$SELECT public.reserve_craft_project_m3(
      '3333cccc-3333-4333-8333-333333333333', 'recipe-residue-safe-rations',
      '[{"lot_id":"4444dddd-4444-4444-8444-444444444444","quantity":1}]'::jsonb,
      'm3-reserve-success-001')$$,
  '22023', 'MATERIAL_OPERATION_ID_CONFLICT',
  'an operation id cannot be reused for different inputs');
SELECT is((SELECT quantity FROM public.material_lots
           WHERE id = '4444dddd-4444-4444-8444-444444444444'), 4::NUMERIC,
          'reservation does not debit a lot before work');

RESET ROLE;
UPDATE public.craft_formulas_m3 SET dc = 40
WHERE id = 'recipe-residue-safe-rations';
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '1111aaaa-1111-4111-8111-111111111111', true); END $$;
SELECT lives_ok($$DO $body$
BEGIN
  PERFORM set_config('test.m3_failure', public.reserve_craft_project_m3(
    '3333cccc-3333-4333-8333-333333333333',
    'recipe-residue-safe-rations',
    '[{"lot_id":"4444dddd-4444-4444-8444-444444444444","quantity":2},
      {"lot_id":"5555eeee-5555-4555-8555-555555555555","quantity":1}]'::jsonb,
    'm3-reserve-failure-001'
  )::TEXT, true);
END $body$;$$, 'a second project can reserve the remaining quantities');
SELECT throws_ok(
  $$SELECT public.reserve_craft_project_m3(
      '3333cccc-3333-4333-8333-333333333333', 'recipe-residue-safe-rations',
      '[{"lot_id":"4444dddd-4444-4444-8444-444444444444","quantity":2},
        {"lot_id":"5555eeee-5555-4555-8555-555555555555","quantity":1}]'::jsonb,
      'm3-reserve-overbook-001')$$,
  '22023', 'CRAFT_LOT_UNAVAILABLE',
  'competing projects cannot reserve already held quantity');
SELECT is((SELECT formula_snapshot->>'dc' FROM public.craft_projects_m3
           WHERE id = current_setting('test.m3_success')::UUID), '1',
          'the first project keeps its original formula DC snapshot');

SELECT lives_ok(
  $$SELECT public.work_craft_project_m3(
      current_setting('test.m3_success')::UUID, 0, 'm3-work-success-001')$$,
  'work atomically spends the exact reserved inputs');
SELECT is((SELECT quantity FROM public.material_lots
           WHERE id = '4444dddd-4444-4444-8444-444444444444'), 2::NUMERIC,
          'work debits the ration base once');
SELECT is((SELECT quantity FROM public.material_lots
           WHERE id = '5555eeee-5555-4555-8555-555555555555'), 1::NUMERIC,
          'work debits the containment foam once');
SELECT lives_ok(
  $$SELECT public.work_craft_project_m3(
      current_setting('test.m3_success')::UUID, 0, 'm3-work-success-001')$$,
  'a lost work response returns its receipt');
SELECT is((SELECT quantity FROM public.material_lots
           WHERE id = '4444dddd-4444-4444-8444-444444444444'), 2::NUMERIC,
          'work retry cannot spend again');
SELECT throws_ok(
  $$SELECT public.work_craft_project_m3(
      current_setting('test.m3_failure')::UUID, 7, 'm3-work-stale-001')$$,
  '40001', 'STALE_CRAFT_PROJECT', 'stale project writes are rejected');
SELECT lives_ok(
  $$SELECT public.resolve_craft_project_m3(
      current_setting('test.m3_success')::UUID, 1, 'm3-resolve-success-001')$$,
  'the first project resolves from its pinned low DC');
SELECT is((SELECT status FROM public.craft_projects_m3
           WHERE id = current_setting('test.m3_success')::UUID), 'completed',
          'success completes the project');
SELECT is((SELECT quantity FROM public.material_lots
           WHERE id = (SELECT output_lot_id FROM public.craft_projects_m3
                       WHERE id = current_setting('test.m3_success')::UUID)),
          4::NUMERIC, 'success creates exactly four output servings');
SELECT lives_ok(
  $$SELECT public.resolve_craft_project_m3(
      current_setting('test.m3_success')::UUID, 1, 'm3-resolve-success-001')$$,
  'a lost resolution response returns the stored result');
SELECT is((SELECT count(*) FROM public.material_lots
           WHERE provenance_metadata->>'craftProjectId' = current_setting('test.m3_success')),
          1::bigint, 'resolution retry cannot duplicate output');
SELECT lives_ok(
  $$SELECT public.work_craft_project_m3(
      current_setting('test.m3_failure')::UUID, 0, 'm3-work-failure-001')$$,
  'the second project can spend its reserved inputs');
SELECT lives_ok(
  $$SELECT public.resolve_craft_project_m3(
      current_setting('test.m3_failure')::UUID, 1, 'm3-resolve-failure-001')$$,
  'the high-DC attempt resolves as a failure');
SELECT is((SELECT status FROM public.craft_projects_m3
           WHERE id = current_setting('test.m3_failure')::UUID), 'failed',
          'failed work records failure and creates no output');

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '2222bbbb-2222-4222-8222-222222222222', true); END $$;
SELECT is((SELECT count(*) FROM public.craft_projects_m3), 0::bigint,
          'an unrelated account cannot read a project');
SELECT throws_ok(
  $$SELECT public.cancel_craft_project_m3(
      current_setting('test.m3_success')::UUID, 2, 'm3-outsider-cancel-001')$$,
  '42501', 'CRAFT_PROJECT_OWNER_REQUIRED',
  'an unrelated account cannot cancel another maker project');

RESET ROLE;
INSERT INTO public.material_lots
  (id, material_definition_id, owner_scope, owner_character_id,
   quantity, unit, provenance_status)
VALUES
  ('6666ffff-6666-4666-8666-666666666666',
   'material-field-ration-base', 'character',
   '3333cccc-3333-4333-8333-333333333333', 2, 'kit', 'manual'),
  ('7777aaaa-7777-4777-8777-777777777777',
   'material-containment-foam', 'character',
   '3333cccc-3333-4333-8333-333333333333', 1, 'canister', 'manual');
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '1111aaaa-1111-4111-8111-111111111111', true); END $$;
SELECT lives_ok($$DO $body$
BEGIN
  PERFORM set_config('test.m3_cancel', public.reserve_craft_project_m3(
    '3333cccc-3333-4333-8333-333333333333',
    'recipe-residue-safe-rations',
    '[{"lot_id":"6666ffff-6666-4666-8666-666666666666","quantity":2},
      {"lot_id":"7777aaaa-7777-4777-8777-777777777777","quantity":1}]'::jsonb,
    'm3-reserve-cancel-001'
  )::TEXT, true);
END $body$;$$, 'a new project can reserve a different pair of lots');
SELECT lives_ok(
  $$SELECT public.cancel_craft_project_m3(
      current_setting('test.m3_cancel')::UUID, 0, 'm3-cancel-001')$$,
  'cancellation releases the reserved lots');
SELECT is((SELECT count(*) FROM public.material_lot_reservations
           WHERE reference_id = current_setting('test.m3_cancel') AND status = 'active'),
          0::bigint, 'cancellation leaves no active reservation');
SELECT is((SELECT quantity FROM public.material_lots
           WHERE id = '6666ffff-6666-4666-8666-666666666666'), 2::NUMERIC,
          'cancellation before work keeps inputs intact');
SELECT lives_ok(
  $$SELECT public.cancel_craft_project_m3(
      current_setting('test.m3_cancel')::UUID, 0, 'm3-cancel-001')$$,
  'cancellation retry returns the same receipt');

SELECT * FROM finish();
ROLLBACK;

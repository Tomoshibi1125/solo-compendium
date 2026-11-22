BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

SELECT plan(8);
SELECT ok(app_private.craft_adaptation_risks_valid(
  'biological_adaptation',
  '{"onFailure":{"label":"Tissue rejection","effect":"The graft rejects; the Warden records the formula-specific recovery procedure."}}'::jsonb),
  'an authored biological failure consequence is valid');
SELECT ok(NOT app_private.craft_adaptation_risks_valid(
  'biological_adaptation', NULL),
  'a biological formula cannot omit its risk');
SELECT ok(NOT app_private.craft_adaptation_risks_valid(
  'biological_adaptation', '{"onFailure":{"label":"Tissue rejection"}}'::jsonb),
  'a biological risk must describe its effect');
SELECT ok(app_private.craft_adaptation_risks_valid('ordinary', NULL),
  'an ordinary formula has no universal biological risk');

INSERT INTO auth.users (id, email) VALUES
  ('e1100000-1111-4111-8111-111111111111', 'adaptation-owner@example.test');
INSERT INTO public.characters (id, user_id, name) VALUES
  ('e2100000-1111-4111-8111-111111111111',
   'e1100000-1111-4111-8111-111111111111', 'Adaptation maker');
INSERT INTO public.craft_formulas_m3
  (id, revision, name, recipe_id, discipline, procedure_kind,
   requirement_snapshot, ingredient_roles, output_definition_id,
   output_quantity, work_minutes, ability, skill, dc, tool_names,
   failure_policy, adaptation_risks)
SELECT 'test-biological-adaptation', 'v1', 'Authored graft',
  'test-biological-adaptation', NULL, 'biological_adaptation',
  requirement_snapshot, ingredient_roles, output_definition_id,
  output_quantity, work_minutes, ability, skill, dc, tool_names,
  failure_policy,
  '{"onFailure":{"label":"Tissue rejection","effect":"Apply the authored rejection protocol."}}'::jsonb
FROM public.craft_formulas_m3 WHERE id = 'recipe-residue-safe-rations';
INSERT INTO public.craft_projects_m3
  (id, character_id, formula_id, formula_revision, formula_snapshot,
   status)
VALUES ('e3100000-1111-4111-8111-111111111111',
  'e2100000-1111-4111-8111-111111111111',
  'test-biological-adaptation', 'v1', '{}'::jsonb, 'worked');
SELECT is((SELECT formula_snapshot#>>'{adaptationRisks,onFailure,effect}'
  FROM public.craft_projects_m3
  WHERE id = 'e3100000-1111-4111-8111-111111111111'),
  'Apply the authored rejection protocol.',
  'the project pins its own formula risk before work');

UPDATE public.craft_formulas_m3
SET adaptation_risks =
  '{"onFailure":{"label":"Revised risk","effect":"A later formula revision."}}'::jsonb
WHERE id = 'test-biological-adaptation';
UPDATE public.craft_projects_m3 SET status = 'failed'
WHERE id = 'e3100000-1111-4111-8111-111111111111';
SELECT is((SELECT risk_outcome->>'effect' FROM public.craft_projects_m3
  WHERE id = 'e3100000-1111-4111-8111-111111111111'),
  'Apply the authored rejection protocol.',
  'failed adaptation records the risk pinned to its original formula');
SELECT isnt((SELECT risk_outcome->>'effect' FROM public.craft_projects_m3
  WHERE id = 'e3100000-1111-4111-8111-111111111111'),
  'A later formula revision.',
  'later formula edits do not rewrite a resolved biological outcome');

INSERT INTO public.craft_projects_m3
  (id, character_id, formula_id, formula_revision, formula_snapshot,
   status)
VALUES ('e3200000-1111-4111-8111-111111111111',
  'e2100000-1111-4111-8111-111111111111',
  'recipe-residue-safe-rations', 'm3-rations-v1', '{}'::jsonb, 'worked');
UPDATE public.craft_projects_m3 SET status = 'failed'
WHERE id = 'e3200000-1111-4111-8111-111111111111';
SELECT ok((SELECT risk_outcome IS NULL FROM public.craft_projects_m3
  WHERE id = 'e3200000-1111-4111-8111-111111111111'),
  'ordinary failed crafting has no invented biological outcome');

SELECT * FROM finish();
ROLLBACK;

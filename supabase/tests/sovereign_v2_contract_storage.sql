BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email)
VALUES ('77777777-7777-4777-8777-777777777777', 'sovereign-v2-test@example.test');

DO $$
DECLARE
  v_job TEXT;
  v_path TEXT;
  v_abilities JSONB := '[]'::jsonb;
  v_level INTEGER;
  v_definition JSONB;
BEGIN
  SELECT job_id::text, id::text INTO v_job, v_path
  FROM public.compendium_job_paths
  ORDER BY id LIMIT 1;
  IF v_job IS NULL OR v_path IS NULL THEN
    RAISE EXCEPTION 'Sovereign fixture requires canonical job and path rows';
  END IF;
  FOREACH v_level IN ARRAY ARRAY[1,3,5,7,10,14,17,20] LOOP
    v_abilities := v_abilities || jsonb_build_array(jsonb_build_object(
      'id', 'ability.test-' || v_level,
      'name', 'Test milestone ' || v_level,
      'description', 'A complete test milestone.',
      'level', v_level,
      'action_type', 'action',
      'recharge', NULL,
      'is_capstone', v_level IN (17,20),
      'ancestry', jsonb_build_array('job','path','regent-a','regent-b'),
      'modifier_ids', '[]'::jsonb,
      'resource_costs', '[]'::jsonb,
      'compatibility', 'native'
    ));
  END LOOP;
  v_definition := jsonb_build_object(
    'schema_version', 2,
    'id', 'sovereign.test-v2',
    'identity', jsonb_build_object(
      'name', 'Test Sovereign',
      'title', 'The Test Title',
      'epithet', 'The Verified One'
    ),
    'description', 'A complete test definition.',
    'manifestation', 'A visible test manifestation.',
    'fusion_theme', 'Four source synthesis',
    'combat_doctrine', 'A documented test doctrine.',
    'primary_abilities', jsonb_build_array('STR'),
    'affinities', '[]'::jsonb,
    'traits', '[]'::jsonb,
    'features', '[]'::jsonb,
    'abilities', v_abilities,
    'resources', '[]'::jsonb,
    'modifiers', '[]'::jsonb,
    'generation', jsonb_build_object(
      'contract_revision', 2,
      'ruleset_revision', 'rules.test',
      'canonical_source_revision', 'canon.test',
      'generator', 'database-test',
      'generated_at', '2026-09-26T00:00:00.000Z',
      'operation_id', 'operation.test-v2',
      'source_ids', jsonb_build_object(
        'job', v_job, 'path', v_path,
        'regent_a', 'umbral_regent', 'regent_b', 'frost_regent'
      )
    ),
    'compatibility', jsonb_build_object('status', 'native', 'notes', '[]'::jsonb)
  );
  PERFORM set_config('test.sovereign_v2_definition', v_definition::text, true);
END;
$$;

SELECT plan(12);
SELECT ok(
  extensions.jsonb_matches_schema(
    (SELECT schema_json FROM app_private.sovereign_v2_schemas WHERE version = 2),
    current_setting('test.sovereign_v2_definition')::jsonb
  ),
  'the database accepts a complete structural v2 fixture'
);
SELECT ok(
  NOT extensions.jsonb_matches_schema(
    (SELECT schema_json FROM app_private.sovereign_v2_schemas WHERE version = 2),
    current_setting('test.sovereign_v2_definition')::jsonb - 'identity'
  ),
  'the database rejects a v2 definition missing identity'
);
SELECT ok(
  NOT extensions.jsonb_matches_schema(
    (SELECT schema_json FROM app_private.sovereign_v2_schemas WHERE version = 2),
    jsonb_set(
      current_setting('test.sovereign_v2_definition')::jsonb,
      '{resources}',
      '[{"id":"resource.test","name":"Unsafe Dice","description":"Oversized dice","ancestry":["job"],"maximum":{"kind":"dice","count":101,"sides":1001},"recharge":"long-rest"}]'::jsonb
    )
  ),
  'the database applies the same bounded dice shape as the client'
);
SELECT ok(
  extensions.jsonb_matches_schema(
    (SELECT schema_json FROM app_private.sovereign_v2_schemas WHERE version = 2),
    jsonb_set(current_setting('test.sovereign_v2_definition')::jsonb,
      '{abilities,0,mechanics}',
      '{"kind":"attack","ability":"STR","range_ft":30,"damage":{"count":1,"sides":8,"type":"cold"}}'::jsonb)
  ),
  'the database accepts bounded typed combat mechanics'
);
SELECT ok(
  NOT extensions.jsonb_matches_schema(
    (SELECT schema_json FROM app_private.sovereign_v2_schemas WHERE version = 2),
    jsonb_set(current_setting('test.sovereign_v2_definition')::jsonb,
      '{abilities,0,mechanics}',
      '{"kind":"attack","ability":"STR","range_ft":600,"damage":{"count":9,"sides":20,"type":"unknown"}}'::jsonb)
  ),
  'the database rejects unbounded typed combat mechanics'
);

SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '77777777-7777-4777-8777-777777777777', true); END $$;
SELECT lives_ok(
  $$SELECT public.save_sovereign_v2_definition(
    current_setting('test.sovereign_v2_definition')::jsonb,
    's2-v2-valid-save', false
  )$$,
  'a complete v2 definition saves through the authorized RPC'
);
SELECT throws_ok(
  $$SELECT public.save_sovereign_v2_definition(
    jsonb_set(
      current_setting('test.sovereign_v2_definition')::jsonb - 'identity',
      '{id}', '"sovereign.test-invalid"'::jsonb
    ),
    's2-v2-missing-identity', false
  )$$,
  '22023', 'SOVEREIGN_V2_SCHEMA_INVALID',
  'direct RPC callers cannot save a structurally incomplete v2 definition'
);

RESET ROLE;
SELECT is(
  (SELECT count(*) FROM public.saved_sovereigns WHERE created_by = '77777777-7777-4777-8777-777777777777'),
  1::bigint,
  'a rejected v2 definition leaves no extra saved row'
);
SELECT is(
  (SELECT definition->>'id' FROM public.saved_sovereigns WHERE created_by = '77777777-7777-4777-8777-777777777777'),
  'sovereign.test-v2',
  'the saved definition remains the authoritative v2 revision'
);
SELECT ok(
  has_table_privilege('authenticated', 'public.saved_sovereigns', 'SELECT'),
  'the authenticated client can read saved Sovereigns through RLS'
);
SET LOCAL ROLE authenticated;
SELECT is(
  (SELECT count(*) FROM public.saved_sovereigns),
  1::bigint,
  'the creator can read the private saved definition'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '66666666-6666-4666-8666-666666666666', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.saved_sovereigns),
  0::bigint,
  'an unrelated authenticated user cannot read that private definition'
);

SELECT * FROM finish();
ROLLBACK;

-- Removing a companion from its sheet must not erase its bond, attempt, and
-- control history: the identity is retired instead of deleted.
BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('88888888-8888-4888-8888-888888888888', 'c2-history-warden@example.test'),
  ('99999999-9999-4999-8999-999999999999', 'c2-history-owner@example.test');
INSERT INTO public.campaigns (id, name, warden_id, share_code)
VALUES (
  'aaaa0000-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'C2 history campaign',
  '88888888-8888-4888-8888-888888888888',
  'C2HIST01'
);
INSERT INTO public.campaign_members (campaign_id, user_id, role)
VALUES (
  'aaaa0000-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '99999999-9999-4999-8999-999999999999',
  'ascendant'
);
INSERT INTO public.characters (id, user_id, name)
VALUES (
  'bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '99999999-9999-4999-8999-999999999999',
  'C2 history character'
);
INSERT INTO public.character_extras (id, character_id, name, extra_type, hp_current, hp_max, npc_data)
VALUES (
  'cccc0000-cccc-4ccc-8ccc-cccccccccccc',
  'bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'History companion', 'companion', 12, 12,
  '{"kind":"canonical-compendium","version":1,"provenance":{"canonicalId":"anomaly-0006","canonicalType":"anomaly","canonicalCollection":"anomalies","entryType":"anomaly","source":null,"sourceBook":null},"sourceFields":{"name":"Eternal Ancient Dragon","hpMax":12,"baseAc":13,"speed":30,"rank":"D"}}'
);

DO $$
BEGIN
  PERFORM set_config('test.c2_instance', (
    SELECT companion_instance_id::text
    FROM public.character_extras
    WHERE id = 'cccc0000-cccc-4ccc-8ccc-cccccccccccc'
  ), true);
END;
$$;

INSERT INTO public.companion_bond_attempts (
  id, campaign_id, character_id, companion_instance_id,
  target_source_id, attempt_kind, roll_mode, outcome
) VALUES (
  'eeee0000-eeee-4eee-8eee-eeeeeeeeeeee',
  'aaaa0000-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  current_setting('test.c2_instance')::uuid,
  'anomaly-0006', 'bond', 'normal', 'success'
);
INSERT INTO public.companion_bonds (
  campaign_id, companion_instance_id, character_id, created_by_attempt_id
) VALUES (
  'aaaa0000-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  current_setting('test.c2_instance')::uuid,
  'bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'eeee0000-eeee-4eee-8eee-eeeeeeeeeeee'
);
INSERT INTO public.companion_control_events (
  campaign_id, companion_instance_id,
  actor_user_id, actor_character_id, event_type,
  next_controller_character_id
) VALUES (
  'aaaa0000-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  current_setting('test.c2_instance')::uuid,
  '99999999-9999-4999-8999-999999999999',
  'bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'claim', 'bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
);

SELECT plan(11);
SELECT is(
  (SELECT lifecycle_status FROM public.companion_instances WHERE id = current_setting('test.c2_instance')::uuid),
  'active',
  'a character companion starts active'
);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '77777777-7777-4777-8777-777777777777', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.companion_instances WHERE id = current_setting('test.c2_instance')::uuid),
  0::bigint,
  'an unrelated authenticated user cannot read the companion'
);
SELECT lives_ok(
  $$DELETE FROM public.character_extras WHERE id = 'cccc0000-cccc-4ccc-8ccc-cccccccccccc'$$,
  'an outsider delete finds nothing it may remove'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '88888888-8888-4888-8888-888888888888', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.companion_instances WHERE id = current_setting('test.c2_instance')::uuid),
  1::bigint,
  'the Warden of the owner''s campaign can read the companion'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '99999999-9999-4999-8999-999999999999', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.character_extras WHERE id = 'cccc0000-cccc-4ccc-8ccc-cccccccccccc'),
  1::bigint,
  'the outsider did not remove the owner''s companion'
);
SELECT lives_ok(
  $$DELETE FROM public.character_extras WHERE id = 'cccc0000-cccc-4ccc-8ccc-cccccccccccc'$$,
  'the owner removes the companion from the sheet'
);
RESET ROLE;
SELECT is(
  (SELECT lifecycle_status FROM public.companion_instances WHERE id = current_setting('test.c2_instance')::uuid),
  'retired',
  'removal retires a companion with history rather than deleting identity'
);
SELECT ok(
  (SELECT retired_at IS NOT NULL FROM public.companion_instances WHERE id = current_setting('test.c2_instance')::uuid),
  'retirement has a durable timestamp'
);
SELECT is(
  (SELECT count(*) FROM public.companion_bond_attempts WHERE companion_instance_id = current_setting('test.c2_instance')::uuid),
  1::bigint,
  'the bond attempt remains linked to the retired identity'
);
SELECT ok(
  (SELECT companion_instance_id = current_setting('test.c2_instance')::uuid
   FROM public.companion_control_events LIMIT 1),
  'control history survives'
);
SELECT ok(
  (SELECT released_at IS NOT NULL AND release_reason = 'companion-removed'
   FROM public.companion_bonds WHERE companion_instance_id = current_setting('test.c2_instance')::uuid),
  'an active bond is explicitly released when its companion is removed'
);

SELECT * FROM finish();
ROLLBACK;

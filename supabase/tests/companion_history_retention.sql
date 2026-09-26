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
INSERT INTO public.campaign_tamed_anomalies (
  id, campaign_id, anomaly_id, current_hp, tamed_by_character_id,
  primary_handler_character_id
) VALUES (
  'cccc0000-cccc-4ccc-8ccc-cccccccccccc',
  'aaaa0000-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'dddd0000-dddd-4ddd-8ddd-dddddddddddd',
  12,
  'bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
);

DO $$
BEGIN
  PERFORM set_config('test.c2_instance', (
    SELECT companion_instance_id::text
    FROM public.campaign_tamed_anomalies
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
  'anomaly-history-fixture', 'bond', 'normal', 'success'
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
  campaign_id, tamed_anomaly_id, companion_instance_id,
  actor_user_id, actor_character_id, event_type,
  next_controller_character_id
) VALUES (
  'aaaa0000-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'cccc0000-cccc-4ccc-8ccc-cccccccccccc',
  current_setting('test.c2_instance')::uuid,
  '99999999-9999-4999-8999-999999999999',
  'bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'claim', 'bbbb0000-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
);

SELECT plan(10);
SELECT is(
  (SELECT lifecycle_status FROM public.companion_instances WHERE id = current_setting('test.c2_instance')::uuid),
  'active',
  'a linked companion starts active'
);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '77777777-7777-4777-8777-777777777777', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.campaign_tamed_anomalies),
  0::bigint,
  'an unrelated authenticated user cannot read the campaign tame roster'
);
SELECT throws_ok(
  $$SELECT public.remove_campaign_tamed_anomaly('cccc0000-cccc-4ccc-8ccc-cccccccccccc')$$,
  '42501', 'WARDEN_TAMED_REMOVAL_REQUIRED',
  'an outsider cannot remove a campaign tame'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '88888888-8888-4888-8888-888888888888', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.campaign_tamed_anomalies),
  1::bigint,
  'the Warden can read the campaign tame roster'
);
SELECT lives_ok(
  $$SELECT public.remove_campaign_tamed_anomaly('cccc0000-cccc-4ccc-8ccc-cccccccccccc')$$,
  'the Warden removes the roster row through the audited RPC'
);
RESET ROLE;
SELECT is(
  (SELECT lifecycle_status FROM public.companion_instances WHERE id = current_setting('test.c2_instance')::uuid),
  'retired',
  'roster removal retires a companion with history rather than deleting identity'
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
  (SELECT tamed_anomaly_id IS NULL AND companion_instance_id = current_setting('test.c2_instance')::uuid
   FROM public.companion_control_events LIMIT 1),
  'control history survives with a detached roster reference'
);
SELECT ok(
  (SELECT released_at IS NOT NULL AND release_reason = 'companion-roster-removed'
   FROM public.companion_bonds WHERE companion_instance_id = current_setting('test.c2_instance')::uuid),
  'an active bond is explicitly released when its roster entry is removed'
);

SELECT * FROM finish();
ROLLBACK;

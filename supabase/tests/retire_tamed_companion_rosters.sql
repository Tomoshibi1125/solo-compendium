-- RA-9: the tamed rosters are retired. Each creature moves to a character's
-- companion sheet with its instance id; the old rows stay as history.
BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('f1000000-0000-4000-8000-000000000001', 'retire-warden@example.test'),
  ('f1000000-0000-4000-8000-000000000002', 'retire-handler@example.test'),
  ('f1000000-0000-4000-8000-000000000003', 'retire-controller@example.test');
INSERT INTO public.campaigns (id, name, warden_id, share_code) VALUES
  ('f2000000-0000-4000-8000-000000000001', 'Retired roster',
   'f1000000-0000-4000-8000-000000000001', 'RETIRE01');
INSERT INTO public.characters (id, user_id, name, level) VALUES
  ('f3000000-0000-4000-8000-00000000000a', 'f1000000-0000-4000-8000-000000000002', 'Handler A', 5),
  ('f3000000-0000-4000-8000-00000000000b', 'f1000000-0000-4000-8000-000000000003', 'Controller B', 3);
INSERT INTO public.campaign_members (campaign_id, user_id, role, character_id) VALUES
  ('f2000000-0000-4000-8000-000000000001', 'f1000000-0000-4000-8000-000000000002',
   'ascendant', 'f3000000-0000-4000-8000-00000000000a');

-- Pre-retirement state: campaign-owned creatures and one personal tame.
INSERT INTO public.companion_instances (
  id, owner_scope, owner_campaign_id, owner_character_id,
  primary_handler_character_id, combat_controller_character_id,
  identity_kind, source_kind, source_collection, source_id,
  source_policy, source_revision, source_snapshot,
  origin_table, origin_row_id, combat_state
) VALUES
  ('f4000000-0000-4000-8000-000000000001', 'campaign', 'f2000000-0000-4000-8000-000000000001', NULL,
   'f3000000-0000-4000-8000-00000000000a', 'f3000000-0000-4000-8000-00000000000b',
   'tamed-anomaly', 'canonical-anomaly', 'anomalies', 'anomaly-0006',
   'snapshot', 'canonical-snapshot-v1',
   '{"kind":"canonical-compendium","version":1,"provenance":{"canonicalId":"anomaly-0006","canonicalType":"anomaly","canonicalCollection":"anomalies","entryType":"anomaly","source":null,"sourceBook":null},"sourceFields":{"name":"Eternal Ancient Dragon","hpMax":12,"baseAc":13,"speed":30,"rank":"D"}}',
   'campaign_tamed_anomalies', 'f5000000-0000-4000-8000-000000000001',
   '{"hp":7,"conditions":[{"id":"cond-1","name":"Frightened"}]}'),
  ('f4000000-0000-4000-8000-000000000002', 'campaign', 'f2000000-0000-4000-8000-000000000001', NULL,
   NULL, 'f3000000-0000-4000-8000-00000000000b',
   'tamed-anomaly', 'canonical-anomaly', 'anomalies', 'anomaly-0011',
   'legacy-live', 'legacy-tamed-live-v1',
   '{"kind":"legacy-tamed-state","version":1,"anomalyId":"anomaly-0011"}',
   'campaign_tamed_anomalies', 'f5000000-0000-4000-8000-000000000002', '{"hp":20}'),
  ('f4000000-0000-4000-8000-000000000003', 'campaign', 'f2000000-0000-4000-8000-000000000001', NULL,
   NULL, NULL,
   'tamed-anomaly', 'canonical-anomaly', 'anomalies', 'anomaly-0016',
   'legacy-live', 'legacy-tamed-live-v1',
   '{"kind":"legacy-tamed-state","version":1,"anomalyId":"anomaly-0016"}',
   'campaign_tamed_anomalies', 'f5000000-0000-4000-8000-000000000003', '{"hp":5}'),
  ('f4000000-0000-4000-8000-000000000004', 'campaign', 'f2000000-0000-4000-8000-000000000001', NULL,
   NULL, NULL,
   'tamed-anomaly', 'canonical-anomaly', 'anomalies', 'anomaly-0021',
   'legacy-live', 'legacy-tamed-live-v1',
   '{"kind":"legacy-tamed-state","version":1,"anomalyId":"anomaly-0021"}',
   'campaign_tamed_anomalies', 'f5000000-0000-4000-8000-000000000004', '{"hp":4}'),
  ('f4000000-0000-4000-8000-000000000005', 'character', NULL, 'f3000000-0000-4000-8000-00000000000b',
   'f3000000-0000-4000-8000-00000000000b', 'f3000000-0000-4000-8000-00000000000b',
   'tamed-anomaly', 'canonical-anomaly', 'anomalies', 'anomaly-0006',
   'snapshot', 'canonical-snapshot-v1',
   '{"kind":"canonical-compendium","version":1,"provenance":{"canonicalId":"anomaly-0006","canonicalType":"anomaly","canonicalCollection":"anomalies","entryType":"anomaly","source":null,"sourceBook":null},"sourceFields":{"name":"Eternal Ancient Dragon","hpMax":12,"baseAc":13,"speed":30,"rank":"D"}}',
   'character_tamed_anomalies', 'f6000000-0000-4000-8000-000000000001', '{"hp":9}');

ALTER TABLE public.campaign_tamed_anomalies DISABLE TRIGGER retired_tamed_roster_insert;
ALTER TABLE public.character_tamed_anomalies DISABLE TRIGGER retired_tamed_roster_insert;
INSERT INTO public.campaign_tamed_anomalies (
  id, campaign_id, anomaly_id, nickname, current_hp, conditions, notes,
  primary_handler_character_id, current_controller_character_id, tamed_by_character_id,
  is_summoned, companion_source_snapshot, companion_instance_id
) VALUES
  -- Handler first.
  ('f5000000-0000-4000-8000-000000000001', 'f2000000-0000-4000-8000-000000000001',
   'anomaly-0006', 'Ember', 7, '[{"id":"cond-1","name":"Frightened"}]', 'Found in the Rift',
   'f3000000-0000-4000-8000-00000000000a', 'f3000000-0000-4000-8000-00000000000b',
   'f3000000-0000-4000-8000-00000000000b', true,
   '{"kind":"canonical-compendium","version":1,"provenance":{"canonicalId":"anomaly-0006","canonicalType":"anomaly","canonicalCollection":"anomalies","entryType":"anomaly","source":null,"sourceBook":null},"sourceFields":{"name":"Eternal Ancient Dragon","hpMax":12,"baseAc":13,"speed":30,"rank":"D"}}',
   'f4000000-0000-4000-8000-000000000001'),
  -- No handler: the current controller.
  ('f5000000-0000-4000-8000-000000000002', 'f2000000-0000-4000-8000-000000000001',
   'anomaly-0011', NULL, 20, '[]', NULL,
   NULL, 'f3000000-0000-4000-8000-00000000000b', 'f3000000-0000-4000-8000-00000000000a',
   false, NULL, 'f4000000-0000-4000-8000-000000000002'),
  -- Only the tamer, and no canonical snapshot.
  ('f5000000-0000-4000-8000-000000000003', 'f2000000-0000-4000-8000-000000000001',
   'anomaly-0016', NULL, 5, '[]', NULL,
   NULL, NULL, 'f3000000-0000-4000-8000-00000000000a',
   false, NULL, 'f4000000-0000-4000-8000-000000000003'),
  -- No one to receive it.
  ('f5000000-0000-4000-8000-000000000004', 'f2000000-0000-4000-8000-000000000001',
   'anomaly-0021', 'Stray', 4, '[]', NULL, NULL, NULL, NULL,
   false, NULL, 'f4000000-0000-4000-8000-000000000004');
INSERT INTO public.character_tamed_anomalies (
  id, character_id, anomaly_id, nickname, current_hp, companion_source_snapshot, companion_instance_id
) VALUES (
  'f6000000-0000-4000-8000-000000000001', 'f3000000-0000-4000-8000-00000000000b',
  'anomaly-0006', 'Cinder', 9,
  '{"kind":"canonical-compendium","version":1,"provenance":{"canonicalId":"anomaly-0006","canonicalType":"anomaly","canonicalCollection":"anomalies","entryType":"anomaly","source":null,"sourceBook":null},"sourceFields":{"name":"Eternal Ancient Dragon","hpMax":12,"baseAc":13,"speed":30,"rank":"D"}}',
  'f4000000-0000-4000-8000-000000000005');
-- Run the deferred history checks now so the fixture tables can be altered.
SET CONSTRAINTS public.campaign_tamed_anomalies_companion_instance_id_fkey,
  public.character_tamed_anomalies_companion_instance_id_fkey IMMEDIATE;
ALTER TABLE public.campaign_tamed_anomalies ENABLE TRIGGER retired_tamed_roster_insert;
ALTER TABLE public.character_tamed_anomalies ENABLE TRIGGER retired_tamed_roster_insert;
SET CONSTRAINTS public.campaign_tamed_anomalies_companion_instance_id_fkey,
  public.character_tamed_anomalies_companion_instance_id_fkey DEFERRED;

INSERT INTO public.companion_bond_attempts (
  id, campaign_id, character_id, companion_instance_id,
  target_source_id, attempt_kind, roll_mode, outcome
) VALUES (
  'f8000000-0000-4000-8000-000000000001', 'f2000000-0000-4000-8000-000000000001',
  'f3000000-0000-4000-8000-00000000000a', 'f4000000-0000-4000-8000-000000000001',
  'anomaly-0006', 'bond', 'normal', 'success');
INSERT INTO public.companion_bonds (
  campaign_id, companion_instance_id, character_id, created_by_attempt_id
) VALUES (
  'f2000000-0000-4000-8000-000000000001', 'f4000000-0000-4000-8000-000000000001',
  'f3000000-0000-4000-8000-00000000000a', 'f8000000-0000-4000-8000-000000000001');

-- The handler's creature is in an active encounter when the roster retires.
INSERT INTO public.campaign_combat_sessions (id, campaign_id, created_by) VALUES
  ('f7000000-0000-4000-8000-000000000001', 'f2000000-0000-4000-8000-000000000001',
   'f1000000-0000-4000-8000-000000000001');
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', 'f1000000-0000-4000-8000-000000000001', true);
SELECT public.add_companion_to_combat(
  'f7000000-0000-4000-8000-000000000001', 'f4000000-0000-4000-8000-000000000001', 12);
RESET ROLE;

CREATE TEMP TABLE retire_report ON COMMIT DROP AS
  SELECT app_private.retire_tamed_companion_rosters() AS report;

SELECT plan(22);

SELECT is((SELECT report->>'campaignMoved' FROM retire_report), '3',
  'three campaign creatures move to character sheets');
SELECT is((SELECT report->>'characterMoved' FROM retire_report), '1',
  'the personal tame moves to its character sheet');
SELECT is((SELECT report->'unassignedRowIds' FROM retire_report),
  '["f5000000-0000-4000-8000-000000000004"]'::jsonb,
  'a creature with no handler, controller, or tamer is reported');
SELECT is((SELECT report->>'failed' FROM retire_report), '0', 'no creature fails to move');

SELECT is(
  (SELECT row(extra.character_id, extra.name, extra.hp_current, extra.hp_max, extra.is_active,
              extra.notes, extra.conditions->0->>'name')::TEXT
   FROM public.character_extras AS extra
   WHERE extra.companion_instance_id = 'f4000000-0000-4000-8000-000000000001'),
  row('f3000000-0000-4000-8000-00000000000a'::UUID, 'Ember', 7, 50, true,
      'Found in the Rift', 'Frightened')::TEXT,
  'the primary handler receives the creature with its name, wounds, notes, and conditions');
SELECT ok(
  (SELECT instance.owner_scope = 'character'
      AND instance.owner_character_id = 'f3000000-0000-4000-8000-00000000000a'
      AND instance.owner_campaign_id IS NULL
      AND instance.combat_controller_character_id = 'f3000000-0000-4000-8000-00000000000a'
      AND instance.identity_kind = 'companion'
      AND instance.origin_table = 'character_extras'
      AND instance.origin_row_id = extra.id
   FROM public.companion_instances AS instance
   JOIN public.character_extras AS extra ON extra.companion_instance_id = instance.id
   WHERE instance.id = 'f4000000-0000-4000-8000-000000000001'),
  'the creature keeps its instance id and now belongs to the character');
SELECT is(
  (SELECT row(extra.character_id, extra.hp_current, extra.hp_max)::TEXT
   FROM public.character_extras AS extra
   WHERE extra.companion_instance_id = 'f4000000-0000-4000-8000-000000000002'),
  row('f3000000-0000-4000-8000-00000000000b'::UUID, 20, 30)::TEXT,
  'without a handler the current controller receives it, scaled to that level');
SELECT ok(
  (SELECT extra.character_id = 'f3000000-0000-4000-8000-00000000000a'
      AND extra.name = 'Eternal Ancient Lich'
      AND extra.hp_current = 5 AND extra.hp_max = 40
      AND instance.source_policy = 'snapshot'
      AND instance.source_snapshot#>>'{sourceFields,name}' = 'Eternal Ancient Lich'
   FROM public.character_extras AS extra
   JOIN public.companion_instances AS instance ON instance.id = extra.companion_instance_id
   WHERE extra.companion_instance_id = 'f4000000-0000-4000-8000-000000000003'),
  'otherwise the tamer receives it, with its species from the server catalog');
SELECT ok(
  (SELECT instance.owner_scope = 'campaign' AND instance.origin_table = 'campaign_tamed_anomalies'
   FROM public.companion_instances AS instance
   WHERE instance.id = 'f4000000-0000-4000-8000-000000000004')
  AND NOT EXISTS (SELECT 1 FROM public.character_extras
    WHERE companion_instance_id = 'f4000000-0000-4000-8000-000000000004'),
  'an unassigned creature stays as campaign history');
SELECT is(
  (SELECT row(extra.character_id, extra.name, extra.hp_current, extra.hp_max)::TEXT
   FROM public.character_extras AS extra
   WHERE extra.companion_instance_id = 'f4000000-0000-4000-8000-000000000005'),
  row('f3000000-0000-4000-8000-00000000000b'::UUID, 'Cinder', 9, 30)::TEXT,
  'a personal tame becomes a companion on the same character');
SELECT is(
  (SELECT count(*) FROM public.campaign_tamed_anomalies AS tamed
   JOIN public.companion_instances AS instance ON instance.id = tamed.companion_instance_id)
  + (SELECT count(*) FROM public.character_tamed_anomalies AS tamed
     JOIN public.companion_instances AS instance ON instance.id = tamed.companion_instance_id),
  5::bigint, 'every history row still names the creature it recorded');
SELECT ok(
  (SELECT count(*) = 1 FROM public.companion_bond_attempts
   WHERE companion_instance_id = 'f4000000-0000-4000-8000-000000000001')
  AND (SELECT count(*) = 1 FROM public.companion_bonds
       WHERE companion_instance_id = 'f4000000-0000-4000-8000-000000000001'),
  'bond and attempt history stay linked to the creature');

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', 'f1000000-0000-4000-8000-000000000001', true);
SELECT lives_ok(
  $$UPDATE public.campaign_combatants SET stats = stats || '{"hp":5}'::jsonb
    WHERE companion_instance_id = 'f4000000-0000-4000-8000-000000000001'$$,
  'the encounter keeps running on the moved creature');
RESET ROLE;
SELECT is(
  (SELECT hp_current FROM public.character_extras
   WHERE companion_instance_id = 'f4000000-0000-4000-8000-000000000001'), 5,
  'combat damage lands on the companion sheet');

SELECT is(
  app_private.retire_tamed_companion_rosters() - 'unassignedRowIds' - 'failures',
  '{"campaignMoved":0,"characterMoved":0,"unassigned":1,"failed":0}'::jsonb,
  'running the retirement again changes nothing');

SELECT throws_ok(
  $$INSERT INTO public.campaign_tamed_anomalies (campaign_id, anomaly_id, current_hp)
    VALUES ('f2000000-0000-4000-8000-000000000001', 'anomaly-0006', 1)$$,
  '0A000', 'TAMED_ROSTER_RETIRED', 'the campaign roster accepts no new creatures');
SELECT throws_ok(
  $$INSERT INTO public.character_tamed_anomalies (character_id, anomaly_id, current_hp)
    VALUES ('f3000000-0000-4000-8000-00000000000a', 'anomaly-0006', 1)$$,
  '0A000', 'TAMED_ROSTER_RETIRED', 'the personal tame table accepts no new creatures');
SELECT ok(
  NOT has_table_privilege('authenticated', 'public.campaign_tamed_anomalies', 'INSERT, UPDATE, DELETE')
  AND NOT has_table_privilege('authenticated', 'public.character_tamed_anomalies', 'INSERT, UPDATE, DELETE')
  AND has_table_privilege('authenticated', 'public.campaign_tamed_anomalies', 'SELECT'),
  'clients can read the history but not write it');
SELECT ok(
  NOT (SELECT bool_or(has_function_privilege('authenticated', fn::regprocedure, 'EXECUTE'))
    FROM unnest(ARRAY[
      'public.claim_anomaly_controller(uuid,uuid)',
      'public.release_anomaly_controller(uuid)',
      'public.set_campaign_tamed_hp(uuid,integer)',
      'public.remove_campaign_tamed_anomaly(uuid)',
      'public.resolve_companion_tame_attempt_c2(uuid,uuid,text,jsonb,integer,integer,uuid,text)',
      'public.resolve_companion_bond_attempt_c2(uuid,uuid,uuid,text,integer,integer,uuid)',
      'public.prepare_companion_attempt_adjudication(uuid,uuid,text,text,uuid,text,text,text,uuid,text)'
    ]) AS fn),
  'the roster, tame, bond, and retry RPCs are retired');

SELECT lives_ok(
  $$DELETE FROM public.characters WHERE id = 'f3000000-0000-4000-8000-00000000000b'$$,
  'history rows never block deleting the character that now owns the creature');
SELECT lives_ok($$SET CONSTRAINTS ALL IMMEDIATE$$,
  'the deferred history checks pass as they would at commit');
SELECT ok(
  NOT EXISTS (SELECT 1 FROM public.companion_instances
    WHERE id = 'f4000000-0000-4000-8000-000000000002')
  AND (SELECT companion_instance_id IS NULL FROM public.campaign_tamed_anomalies
       WHERE id = 'f5000000-0000-4000-8000-000000000002'),
  'the history row survives, detached from the deleted creature');

SELECT * FROM finish();
ROLLBACK;

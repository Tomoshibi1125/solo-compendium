BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('a1110000-1111-4111-8111-111111111111', 'ra-guild-leader@example.test'),
  ('a2220000-2222-4222-8222-222222222222', 'ra-guild-vice@example.test'),
  ('a3330000-3333-4333-8333-333333333333', 'ra-guild-officer@example.test'),
  ('a4440000-4444-4444-8444-444444444444', 'ra-guild-member@example.test'),
  ('a5550000-5555-4555-8555-555555555555', 'ra-guild-applicant@example.test'),
  ('a6660000-6666-4666-8666-666666666666', 'ra-guild-outsider@example.test');

INSERT INTO public.campaigns (id, name, warden_id, share_code) VALUES
  ('c1110000-1111-4111-8111-111111111111', 'Authority Campaign',
   'a1110000-1111-4111-8111-111111111111', 'RAAUTH01');

INSERT INTO public.characters (id, user_id, name) VALUES
  ('d1110000-1111-4111-8111-111111111111', 'a1110000-1111-4111-8111-111111111111', 'Leader'),
  ('d2220000-2222-4222-8222-222222222222', 'a2220000-2222-4222-8222-222222222222', 'Vice'),
  ('d3330000-3333-4333-8333-333333333333', 'a3330000-3333-4333-8333-333333333333', 'Officer'),
  ('d4440000-4444-4444-8444-444444444444', 'a4440000-4444-4444-8444-444444444444', 'Member'),
  ('d4550000-4444-4444-8444-444444444444', 'a4440000-4444-4444-8444-444444444444', 'Secondary Member Character'),
  ('d4660000-4444-4444-8444-444444444444', 'a4440000-4444-4444-8444-444444444444', 'Unlinked Member Character'),
  ('d5550000-5555-4555-8555-555555555555', 'a5550000-5555-4555-8555-555555555555', 'Applicant');

INSERT INTO public.campaign_members (id, campaign_id, user_id, role, character_id) VALUES
  ('e4440000-4444-4444-8444-444444444444',
   'c1110000-1111-4111-8111-111111111111',
   'a4440000-4444-4444-8444-444444444444', 'ascendant',
   'd4440000-4444-4444-8444-444444444444');
INSERT INTO public.campaign_member_characters
  (campaign_id, campaign_member_id, character_id, created_by)
VALUES
  ('c1110000-1111-4111-8111-111111111111',
   'e4440000-4444-4444-8444-444444444444',
   'd4550000-4444-4444-8444-444444444444',
   'a4440000-4444-4444-8444-444444444444');

INSERT INTO public.guilds (id, name, leader_user_id, campaign_id, share_code, funds) VALUES
  ('b1110000-1111-4111-8111-111111111111', 'Authority Guild',
   'a1110000-1111-4111-8111-111111111111',
   'c1110000-1111-4111-8111-111111111111', 'GUILDRA1', '{"gate":50}');
INSERT INTO public.guild_members (id, guild_id, user_id, character_id, role) VALUES
  ('b2110000-1111-4111-8111-111111111111', 'b1110000-1111-4111-8111-111111111111', 'a1110000-1111-4111-8111-111111111111', 'd1110000-1111-4111-8111-111111111111', 'leader'),
  ('b2220000-2222-4222-8222-222222222222', 'b1110000-1111-4111-8111-111111111111', 'a2220000-2222-4222-8222-222222222222', 'd2220000-2222-4222-8222-222222222222', 'vice_master'),
  ('b3330000-3333-4333-8333-333333333333', 'b1110000-1111-4111-8111-111111111111', 'a3330000-3333-4333-8333-333333333333', 'd3330000-3333-4333-8333-333333333333', 'officer'),
  ('b4440000-4444-4444-8444-444444444444', 'b1110000-1111-4111-8111-111111111111', 'a4440000-4444-4444-8444-444444444444', 'd4440000-4444-4444-8444-444444444444', 'member');
INSERT INTO public.guild_join_requests (id, guild_id, user_id, character_id, character_name)
VALUES ('f5550000-5555-4555-8555-555555555555',
  'b1110000-1111-4111-8111-111111111111',
  'a5550000-5555-4555-8555-555555555555',
  'd5550000-5555-4555-8555-555555555555', 'Applicant');

INSERT INTO public.character_pending_regent_grants (
  id, character_id, regent_id, grant_kind, canonical_id, payload
) VALUES (
  'f6660000-6666-4666-8666-666666666666',
  'd4660000-4444-4444-8444-444444444444',
  'umbral_regent', 'power', 'test-power', '{"name":"Test Power"}'::jsonb
);
INSERT INTO public.character_regent_unlocks (
  id, character_id, legacy_regent_uuid, regent_id, quest_name, is_primary
) VALUES (
  'e7770000-7777-4777-8777-777777777777',
  'd4550000-4444-4444-8444-444444444444',
  NULL, 'umbral_regent', 'Secondary Trial', true
);
INSERT INTO public.character_pending_regent_grants (
  id, character_id, regent_id, grant_kind, canonical_id, payload
)
SELECT
  'f7770000-7777-4777-8777-777777777777',
  'd4550000-4444-4444-8444-444444444444',
  'umbral_regent', 'power', option_row.canonical_id,
  jsonb_build_object('name', option_row.name)
FROM public.regent_canonical_pick_options AS option_row
WHERE option_row.kind = 'powers' AND option_row.tier BETWEEN 5 AND 9
ORDER BY option_row.canonical_id
LIMIT 1;

SELECT plan(40);

SELECT ok(
  to_regprocedure('public.guild_admin_action(uuid,text,jsonb)') IS NOT NULL
  AND to_regprocedure('public.warden_deliver_campaign_inventory(uuid,text,text,text,integer,numeric,boolean)') IS NOT NULL
  AND to_regprocedure('public.warden_grant_character_equipment(uuid,jsonb)') IS NOT NULL,
  'guarded guild and Warden item RPC signatures exist'
);

SELECT ok(
  (SELECT prosecdef FROM pg_proc WHERE oid = 'public.guild_admin_action(uuid,text,jsonb)'::regprocedure)
  AND (SELECT prosecdef FROM pg_proc WHERE oid = 'public.warden_deliver_campaign_inventory(uuid,text,text,text,integer,numeric,boolean)'::regprocedure)
  AND (SELECT prosecdef FROM pg_proc WHERE oid = 'public.warden_grant_character_equipment(uuid,jsonb)'::regprocedure),
  'guild and Warden item mutations run through SECURITY DEFINER functions'
);

SELECT is(
  (SELECT count(*)
   FROM pg_proc AS p
   CROSS JOIN LATERAL aclexplode(COALESCE(p.proacl, acldefault('f', p.proowner))) AS acl
   WHERE p.oid IN (
     'public.guild_admin_action(uuid,text,jsonb)'::regprocedure,
     'public.warden_deliver_campaign_inventory(uuid,text,text,text,integer,numeric,boolean)'::regprocedure,
     'public.warden_grant_character_equipment(uuid,jsonb)'::regprocedure
   ) AND acl.grantee = 0 AND acl.privilege_type = 'EXECUTE'),
  0::bigint,
  'new RPCs do not inherit PUBLIC execution'
);

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.guilds', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.guild_members', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.guild_members', 'UPDATE')
  AND NOT has_table_privilege('authenticated', 'public.guild_members', 'DELETE')
  AND NOT has_table_privilege('authenticated', 'public.guild_quests', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.guild_quests', 'UPDATE')
  AND NOT has_table_privilege('authenticated', 'public.guild_quests', 'DELETE')
  AND NOT has_table_privilege('authenticated', 'public.guild_join_requests', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.guild_join_requests', 'UPDATE')
  AND NOT has_table_privilege('authenticated', 'public.guild_join_requests', 'DELETE')
  AND NOT has_table_privilege('authenticated', 'public.guilds', 'UPDATE')
  AND NOT has_table_privilege('authenticated', 'public.guilds', 'DELETE'),
  'authenticated clients cannot mutate guild tables directly'
);

SELECT is(
  (SELECT count(*) FROM pg_policies
   WHERE schemaname = 'public'
     AND tablename IN ('guilds', 'guild_members', 'guild_quests', 'guild_join_requests')
     AND cmd IN ('ALL', 'INSERT', 'UPDATE', 'DELETE')),
  0::bigint,
  'guild tables expose no direct write policies'
);

SELECT ok(
  NOT has_table_privilege('authenticated', 'public.character_regent_unlocks', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.character_regent_unlocks', 'UPDATE')
  AND NOT has_table_privilege('authenticated', 'public.character_regent_unlocks', 'DELETE')
  AND NOT has_table_privilege('authenticated', 'public.character_regent_unlock_grants', 'INSERT')
  AND NOT has_table_privilege('authenticated', 'public.character_regent_unlock_grants', 'UPDATE')
  AND NOT has_table_privilege('authenticated', 'public.character_regent_unlock_grants', 'DELETE'),
  'Regent unlock and grant mutations stay on guarded RPCs'
);

SELECT is(
  (SELECT count(*) FROM pg_policies
   WHERE schemaname = 'public'
     AND tablename IN ('character_regent_unlocks', 'character_regent_unlock_grants')
     AND cmd IN ('ALL', 'INSERT', 'UPDATE', 'DELETE')),
  0::bigint,
  'Regent unlock tables have no direct mutation policies'
);

SET LOCAL ROLE authenticated;

SELECT set_config('request.jwt.claim.sub', 'a6660000-6666-4666-8666-666666666666', true);
SELECT throws_ok(
  $$INSERT INTO public.guild_members (guild_id, user_id, role)
    VALUES ('b1110000-1111-4111-8111-111111111111',
            'a6660000-6666-4666-8666-666666666666', 'member')$$,
  '42501', NULL, 'direct guild member insertion is rejected by table privileges');

SELECT set_config('request.jwt.claim.sub', 'a3330000-3333-4333-8333-333333333333', true);
SELECT throws_ok(
  $$SELECT public.guild_admin_action(
    'b1110000-1111-4111-8111-111111111111', 'disband_guild', '{}'::jsonb)$$,
  '42501', 'GUILD_LEADER_REQUIRED', 'officers cannot disband guilds');
SELECT throws_ok(
  $$SELECT public.guild_admin_action(
    'b1110000-1111-4111-8111-111111111111', 'change_member_role',
    '{"member_id":"b4440000-4444-4444-8444-444444444444","role":"officer"}'::jsonb)$$,
  '42501', 'GUILD_ROLE_CHANGE_FORBIDDEN', 'officers cannot change guild roles');

SELECT set_config('request.jwt.claim.sub', 'a4440000-4444-4444-8444-444444444444', true);
SELECT throws_ok(
  $$SELECT public.approve_guild_join_request(
    'f5550000-5555-4555-8555-555555555555', 'member')$$,
  '42501', 'GUILD_JOIN_REVIEW_FORBIDDEN', 'officers cannot approve join requests');

SELECT set_config('request.jwt.claim.sub', 'a2220000-2222-4222-8222-222222222222', true);
SELECT throws_ok(
  $$SELECT public.guild_admin_action(
    'b1110000-1111-4111-8111-111111111111', 'change_member_role',
    '{"member_id":"b4440000-4444-4444-8444-444444444444","role":"vice_master"}'::jsonb)$$,
  '42501', 'GUILD_ROLE_HIERARCHY_VIOLATION', 'vice masters cannot promote peers');
SELECT lives_ok(
  $$SELECT public.guild_admin_action(
    'b1110000-1111-4111-8111-111111111111', 'change_member_role',
    '{"member_id":"b4440000-4444-4444-8444-444444444444","role":"officer"}'::jsonb)$$,
  'vice masters can promote lower-ranked members to officer');
SELECT set_config('request.jwt.claim.sub', 'a4440000-4444-4444-8444-444444444444', true);
SELECT is(
  public.guild_member_role('b1110000-1111-4111-8111-111111111111',
    'a4440000-4444-4444-8444-444444444444'),
  'officer', 'the role read reflects the committed mutation');
SELECT is(
  public.guild_member_role('b1110000-1111-4111-8111-111111111111',
    'a3330000-3333-4333-8333-333333333333'),
  NULL, 'the role helper cannot query another user’s membership');
SELECT set_config('request.jwt.claim.sub', 'a2220000-2222-4222-8222-222222222222', true);
SELECT throws_ok(
  $$SELECT public.approve_guild_join_request(
    'f5550000-5555-4555-8555-555555555555', 'vice_master')$$,
  '42501', 'INVALID_ROLE_FOR_APPROVER', 'join approval cannot assign the leader-only role');
SELECT lives_ok(
  $$SELECT public.approve_guild_join_request(
    'f5550000-5555-4555-8555-555555555555', 'officer')$$,
  'vice masters can atomically approve a lower-ranked officer role');
SELECT is(
  (SELECT status FROM public.guild_join_requests
   WHERE id = 'f5550000-5555-4555-8555-555555555555'),
  'approved', 'successful approval resolves the request');
SELECT is(
  (SELECT role FROM public.guild_members
   WHERE guild_id = 'b1110000-1111-4111-8111-111111111111'
     AND user_id = 'a5550000-5555-4555-8555-555555555555'),
  'officer', 'the approved role is persisted on the new member');
SELECT throws_ok(
  $$SELECT public.guild_admin_action(
    'b1110000-1111-4111-8111-111111111111', 'transfer_leadership',
    '{"new_leader_user_id":"a3330000-3333-4333-8333-333333333333"}'::jsonb)$$,
  '42501', 'GUILD_LEADER_REQUIRED', 'vice masters cannot transfer leadership');

SELECT set_config('request.jwt.claim.sub', 'a1110000-1111-4111-8111-111111111111', true);
SELECT lives_ok(
  $$SELECT public.guild_admin_action(
    'b1110000-1111-4111-8111-111111111111', 'transfer_leadership',
    '{"new_leader_user_id":"a2220000-2222-4222-8222-222222222222"}'::jsonb)$$,
  'the guild leader transfers leadership in one atomic mutation');
SELECT is(
  (SELECT leader_user_id FROM public.guilds
   WHERE id = 'b1110000-1111-4111-8111-111111111111'),
  'a2220000-2222-4222-8222-222222222222'::uuid,
  'the transferred leader is stored on the guild');
SELECT is(
  public.guild_member_role('b1110000-1111-4111-8111-111111111111',
    'a1110000-1111-4111-8111-111111111111'),
  'vice_master', 'the former Guild Master becomes Vice-Master');

SELECT set_config('request.jwt.claim.sub', 'a6660000-6666-4666-8666-666666666666', true);
SELECT throws_ok(
  $$SELECT public.warden_grant_character_equipment(
    'c1110000-1111-4111-8111-111111111111',
    '[{"character_id":"d4440000-4444-4444-8444-444444444444","name":"Ration","item_type":"item"}]'::jsonb)$$,
  '42501', 'CAMPAIGN_WARDEN_REQUIRED', 'an outsider cannot issue direct inventory grants');
SELECT throws_ok(
  $$SELECT public.warden_deliver_campaign_inventory(
    'c1110000-1111-4111-8111-111111111111', 'Ration')$$,
  '42501', 'CAMPAIGN_WARDEN_REQUIRED', 'an outsider cannot deliver to Party Stash');
SELECT throws_ok(
  $$SELECT public.assign_campaign_loot(
    'c1110000-1111-4111-8111-111111111111',
    '[{"name":"Ration","quantity":1}]'::jsonb)$$,
  '42501', 'CAMPAIGN_WARDEN_REQUIRED', 'an outsider cannot assign campaign loot');

SELECT set_config('request.jwt.claim.sub', 'a1110000-1111-4111-8111-111111111111', true);
SELECT is(
  app_private.campaign_character_is_linked(
    'c1110000-1111-4111-8111-111111111111',
    'd4550000-4444-4444-8444-444444444444'),
  true, 'the Warden can validate a secondary linked character');
SELECT is(
  (SELECT count(*) FROM public.character_regent_unlocks
   WHERE id = 'e7770000-7777-4777-8777-777777777777'),
  1::bigint, 'the Warden can read Regent unlocks for a secondary linked character');
SELECT is(
  (SELECT count(*) FROM public.character_pending_regent_grants
   WHERE character_id IN (
     'd4550000-4444-4444-8444-444444444444',
     'd4660000-4444-4444-8444-444444444444')),
  1::bigint, 'the Warden can read pending grants only for explicitly linked characters');
SELECT is(
  app_private.campaign_character_is_linked(
    'c1110000-1111-4111-8111-111111111111',
    'd4660000-4444-4444-8444-444444444444'),
  false, 'a member-owned but unlinked character is outside the roster');
SELECT throws_ok(
  $$SELECT public.approve_pending_regent_grant(
    'f6660000-6666-4666-8666-666666666666',
    '00000000-0000-4000-8000-000000000000',
    'c1110000-1111-4111-8111-111111111111')$$,
  '42501', 'CHARACTER_NOT_IN_CAMPAIGN_ROSTER',
  'a Warden cannot approve a pending Regent grant for an unlinked character');
SELECT lives_ok(
  $$SELECT public.approve_pending_regent_grant(
    'f7770000-7777-4777-8777-777777777777',
    'e7770000-7777-4777-8777-777777777777',
    'c1110000-1111-4111-8111-111111111111')$$,
  'a Warden can approve a Regent grant for a secondary linked character');
SELECT ok(
  (SELECT status = 'approved' AND approved_unlock_id = 'e7770000-7777-4777-8777-777777777777'::uuid
   FROM public.character_pending_regent_grants
   WHERE id = 'f7770000-7777-4777-8777-777777777777')
  AND EXISTS (
    SELECT 1 FROM public.character_powers
    WHERE character_id = 'd4550000-4444-4444-8444-444444444444'
      AND regent_unlock_id = 'e7770000-7777-4777-8777-777777777777'
      AND acquisition_kind = 'regent'
  ),
  'approved Regent ability and unlock reference persist on the linked character'
);
SELECT lives_ok(
  $$SELECT public.assign_campaign_loot(
    'c1110000-1111-4111-8111-111111111111',
    '[{"name":"Ration","quantity":1}]'::jsonb)$$,
  'a Warden can assign loot through the guarded campaign RPC');
SELECT is(
  (SELECT count(*) FROM public.campaign_loot_drops
   WHERE campaign_id = 'c1110000-1111-4111-8111-111111111111'),
  1::bigint, 'the assigned loot row persists');
SELECT lives_ok(
  $$SELECT public.warden_grant_character_equipment(
    'c1110000-1111-4111-8111-111111111111',
    '[{"character_id":"d4550000-4444-4444-8444-444444444444","item_id":"ration-canonical","name":"Ration","item_type":"item","quantity":2}]'::jsonb)$$,
  'a Warden can grant items to a secondary linked character');
SELECT is(
  (SELECT quantity FROM public.character_equipment
   WHERE character_id = 'd4550000-4444-4444-8444-444444444444'
     AND item_id = 'ration-canonical'),
  2, 'the secondary-character grant persists');
SELECT throws_ok(
  $$SELECT public.warden_grant_character_equipment(
    'c1110000-1111-4111-8111-111111111111',
    '[{"character_id":"d4660000-4444-4444-8444-444444444444","name":"Ration","item_type":"item"}]'::jsonb)$$,
  '42501', 'CHARACTER_NOT_IN_CAMPAIGN_ROSTER',
  'ownership by a campaign member alone does not authorize a grant');
SELECT lives_ok(
  $$SELECT public.warden_deliver_campaign_inventory(
    'c1110000-1111-4111-8111-111111111111', 'Ration', 'item', 'Travel food', 3, 1.5, true)$$,
  'a Warden can deliver an item to the shared Party Stash');
SELECT is(
  (SELECT quantity FROM public.campaign_inventory
   WHERE campaign_id = 'c1110000-1111-4111-8111-111111111111'
     AND name = 'Ration'),
  3, 'the atomic stash delivery persists its quantity');

SELECT * FROM finish();
ROLLBACK;

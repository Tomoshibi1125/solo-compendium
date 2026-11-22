-- Direct Data API access restored or tightened in 20260930110100 and
-- 20260930120000, run under the production-equivalent grants of
-- 20260930110000. Each area checks the intended caller, another signed-in
-- user, and signed-out access. The app has two roles, Warden and Ascendant.
BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

-- Owner A is a member of campaign C (Warden W); B is an outsider; X carries
-- the old account_role 'admin' app metadata, which grants nothing; E has no
-- profile row yet.
INSERT INTO auth.users (id, email, raw_app_meta_data) VALUES
  ('e1110000-1111-4111-8111-111111111111', 'rls-owner@example.test', '{}'),
  ('e2220000-2222-4222-8222-222222222222', 'rls-other@example.test', '{}'),
  ('e3330000-3333-4333-8333-333333333333', 'rls-warden@example.test', '{}'),
  ('e4440000-4444-4444-8444-444444444444', 'rls-metadata@example.test', '{"account_role":"admin"}'),
  ('e5550000-5555-4555-8555-555555555555', 'rls-new@example.test', '{}');
DELETE FROM public.profiles WHERE id = 'e5550000-5555-4555-8555-555555555555';

INSERT INTO public.campaigns (id, name, warden_id, share_code) VALUES
  ('e6660000-6666-4666-8666-666666666666', 'RLS checks',
   'e3330000-3333-4333-8333-333333333333', 'RLSCHK01');
INSERT INTO public.characters (id, user_id, name) VALUES
  ('e7770000-7777-4777-8777-777777777777', 'e1110000-1111-4111-8111-111111111111', 'Owner hero'),
  ('e8880000-8888-4888-8888-888888888888', 'e2220000-2222-4222-8222-222222222222', 'Outsider hero');
INSERT INTO public.campaign_members (id, campaign_id, user_id, role, character_id) VALUES
  ('e9990000-9999-4999-8999-999999999999', 'e6660000-6666-4666-8666-666666666666',
   'e1110000-1111-4111-8111-111111111111', 'ascendant',
   'e7770000-7777-4777-8777-777777777777');

-- Reference rows the sheet tables point at.
INSERT INTO public.compendium_jobs (id, name, description) VALUES
  ('ea000000-0000-4000-8000-00000000000a', 'RLS Probe Job', 'Probe job.');
INSERT INTO public.compendium_job_features (id, job_id, name, level, description) VALUES
  ('eb000000-0000-4000-8000-00000000000b', 'ea000000-0000-4000-8000-00000000000a',
   'Probe Feature', 1, 'Probe feature.');
INSERT INTO public.compendium_feature_choice_groups (id, feature_id, choice_key) VALUES
  ('ec000000-0000-4000-8000-00000000000c', 'eb000000-0000-4000-8000-00000000000b', 'probe');
INSERT INTO public.compendium_feature_choice_options (id, group_id, option_key, name) VALUES
  ('ed000000-0000-4000-8000-00000000000d', 'ec000000-0000-4000-8000-00000000000c',
   'probe-a', 'Probe A');
INSERT INTO public.compendium_shadow_soldiers (id, name, title, rank, description) VALUES
  ('ee000000-0000-4000-8000-00000000000e', 'Probe Shade', 'Probe', 'E', 'Probe soldier.');
INSERT INTO public.character_equipment (id, character_id, name, item_type) VALUES
  ('ef000000-0000-4000-8000-00000000000f', 'e7770000-7777-4777-8777-777777777777',
   'Probe Blade', 'weapon');

-- Warden-side campaign rows.
INSERT INTO public.campaign_invites (id, campaign_id, token, join_code, token_hash) VALUES
  ('f6000000-0000-4000-8000-000000000006', 'e6660000-6666-4666-8666-666666666666',
   'rls-probe-token', 'RLSJWN23', 'rls-probe-hash');
INSERT INTO public.campaign_invite_audit_logs (campaign_id, action) VALUES
  ('e6660000-6666-4666-8666-666666666666', 'created');
INSERT INTO public.campaign_loot_drops (campaign_id) VALUES
  ('e6660000-6666-4666-8666-666666666666');
INSERT INTO public.campaign_member_characters (campaign_id, campaign_member_id, character_id) VALUES
  ('e6660000-6666-4666-8666-666666666666', 'e9990000-9999-4999-8999-999999999999',
   'e7770000-7777-4777-8777-777777777777');

-- B's listing, and a review by A on it.
INSERT INTO public.marketplace_items
  (id, author_id, title, description, item_type) VALUES
  ('fb000000-0000-4000-8000-00000000000b', 'e2220000-2222-4222-8222-222222222222',
   'Shared module', 'A shared module.', 'module');
INSERT INTO public.marketplace_reviews (item_id, user_id, rating) VALUES
  ('fb000000-0000-4000-8000-00000000000b', 'e1110000-1111-4111-8111-111111111111', 3);

SELECT plan(91);

-- ── Character sheet rows ────────────────────────────────────────────────────
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
SELECT lives_ok(
  $$INSERT INTO public.character_spell_slots (id, character_id, spell_level, slots_max, slots_current)
    VALUES ('f1000000-0000-4000-8000-000000000001', 'e7770000-7777-4777-8777-777777777777', 1, 4, 4)$$,
  'the owner adds a spell slot'
);
SELECT lives_ok(
  $$UPDATE public.character_spell_slots SET slots_current = 3
    WHERE id = 'f1000000-0000-4000-8000-000000000001'$$,
  'the owner spends a spell slot'
);
SELECT is(
  (SELECT slots_current FROM public.character_spell_slots WHERE id = 'f1000000-0000-4000-8000-000000000001'),
  3,
  'the owner reads the spent slot'
);
SELECT lives_ok(
  $$INSERT INTO public.character_journal (id, character_id, title)
    VALUES ('f2000000-0000-4000-8000-000000000002', 'e7770000-7777-4777-8777-777777777777', 'Day one')$$,
  'the owner writes a journal entry'
);
SELECT lives_ok(
  $$INSERT INTO public.character_feature_choices (character_id, feature_id, group_id, option_id)
    VALUES ('e7770000-7777-4777-8777-777777777777', 'eb000000-0000-4000-8000-00000000000b',
            'ec000000-0000-4000-8000-00000000000c', 'ed000000-0000-4000-8000-00000000000d')$$,
  'the owner records a feature choice'
);
SELECT lives_ok(
  $$INSERT INTO public.character_techniques (id, character_id, technique_id)
    VALUES ('f3000000-0000-4000-8000-000000000003', 'e7770000-7777-4777-8777-777777777777', 'probe-technique')$$,
  'the owner learns a technique'
);
SELECT lives_ok(
  $$UPDATE public.character_techniques SET uses_current = 1
    WHERE id = 'f3000000-0000-4000-8000-000000000003'$$,
  'the owner edits a technique'
);
SELECT lives_ok(
  $$INSERT INTO public.character_rune_knowledge (character_id, rune_key)
    VALUES ('e7770000-7777-4777-8777-777777777777', 'probe-rune')$$,
  'the owner imports rune knowledge'
);
SELECT lives_ok(
  $$INSERT INTO public.character_rune_inscriptions (character_id, equipment_id, rune_key)
    VALUES ('e7770000-7777-4777-8777-777777777777', 'ef000000-0000-4000-8000-00000000000f', 'probe-rune')$$,
  'the owner imports a rune inscription'
);
SELECT lives_ok(
  $$INSERT INTO public.character_shadow_army (character_id, shadow_soldier_id)
    VALUES ('e7770000-7777-4777-8777-777777777777', 'ee000000-0000-4000-8000-00000000000e')$$,
  'the owner imports a shadow army row'
);
SELECT lives_ok(
  $$INSERT INTO public.character_umbral_legionnaires (id, character_id, soldier_id, current_hp)
    VALUES ('f4000000-0000-4000-8000-000000000004', 'e7770000-7777-4777-8777-777777777777',
            'ee000000-0000-4000-8000-00000000000e', 10)$$,
  'the owner summons a legionnaire'
);
SELECT lives_ok(
  $$UPDATE public.character_umbral_legionnaires SET current_hp = 7
    WHERE id = 'f4000000-0000-4000-8000-000000000004'$$,
  'the owner updates a legionnaire'
);
SELECT is(
  (SELECT (SELECT count(*) FROM public.character_journal WHERE character_id = 'e7770000-7777-4777-8777-777777777777')
        + (SELECT count(*) FROM public.character_feature_choices WHERE character_id = 'e7770000-7777-4777-8777-777777777777')
        + (SELECT count(*) FROM public.character_rune_knowledge WHERE character_id = 'e7770000-7777-4777-8777-777777777777')
        + (SELECT count(*) FROM public.character_rune_inscriptions WHERE character_id = 'e7770000-7777-4777-8777-777777777777')
        + (SELECT count(*) FROM public.character_shadow_army WHERE character_id = 'e7770000-7777-4777-8777-777777777777')
        + (SELECT count(*) FILTER (WHERE current_hp = 7) FROM public.character_umbral_legionnaires WHERE character_id = 'e7770000-7777-4777-8777-777777777777')),
  6::bigint,
  'the owner reads every sheet row back'
);

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e2220000-2222-4222-8222-222222222222', true); END $$;
SELECT is(
  (SELECT (SELECT count(*) FROM public.character_spell_slots WHERE character_id = 'e7770000-7777-4777-8777-777777777777')
        + (SELECT count(*) FROM public.character_journal WHERE character_id = 'e7770000-7777-4777-8777-777777777777')
        + (SELECT count(*) FROM public.character_feature_choices WHERE character_id = 'e7770000-7777-4777-8777-777777777777')
        + (SELECT count(*) FROM public.character_techniques WHERE character_id = 'e7770000-7777-4777-8777-777777777777')
        + (SELECT count(*) FROM public.character_rune_knowledge WHERE character_id = 'e7770000-7777-4777-8777-777777777777')
        + (SELECT count(*) FROM public.character_umbral_legionnaires WHERE character_id = 'e7770000-7777-4777-8777-777777777777')),
  0::bigint,
  'another user sees none of the owner''s sheet rows'
);
SELECT throws_ok(
  $$INSERT INTO public.character_spell_slots (character_id, spell_level)
    VALUES ('e7770000-7777-4777-8777-777777777777', 2)$$,
  '42501', NULL,
  'another user cannot add a spell slot to the owner''s character'
);
SELECT throws_ok(
  $$INSERT INTO public.character_techniques (character_id, technique_id)
    VALUES ('e7770000-7777-4777-8777-777777777777', 'forged-technique')$$,
  '42501', NULL,
  'another user cannot add a technique to the owner''s character'
);
UPDATE public.character_spell_slots SET slots_current = 0
  WHERE id = 'f1000000-0000-4000-8000-000000000001';
DELETE FROM public.character_journal WHERE id = 'f2000000-0000-4000-8000-000000000002';

DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e3330000-3333-4333-8333-333333333333', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.character_spell_slots WHERE character_id = 'e7770000-7777-4777-8777-777777777777'),
  1::bigint,
  'the linked Warden still reads the character''s spell slots'
);
SELECT throws_ok(
  $$INSERT INTO public.character_techniques (character_id, technique_id)
    VALUES ('e7770000-7777-4777-8777-777777777777', 'warden-technique')$$,
  '42501', NULL,
  'the linked Warden cannot write techniques onto a player''s character'
);
UPDATE public.character_spell_slots SET slots_current = 0
  WHERE id = 'f1000000-0000-4000-8000-000000000001';

SET LOCAL ROLE anon;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.character_spell_slots WHERE character_id = 'e7770000-7777-4777-8777-777777777777'),
  0::bigint,
  'signed-out callers see no sheet rows'
);
RESET ROLE;
SELECT is(
  (SELECT slots_current || '/' || (SELECT count(*) FROM public.character_journal
     WHERE id = 'f2000000-0000-4000-8000-000000000002')
   FROM public.character_spell_slots WHERE id = 'f1000000-0000-4000-8000-000000000001'),
  '3/1',
  'other users'' updates and deletes changed nothing'
);

SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
DELETE FROM public.character_spell_slots WHERE id = 'f1000000-0000-4000-8000-000000000001';
DELETE FROM public.character_techniques WHERE id = 'f3000000-0000-4000-8000-000000000003';
RESET ROLE;
SELECT is(
  (SELECT count(*) FROM public.character_spell_slots WHERE id = 'f1000000-0000-4000-8000-000000000001')
    + (SELECT count(*) FROM public.character_techniques WHERE id = 'f3000000-0000-4000-8000-000000000003'),
  0::bigint,
  'the owner deletes their spell slot and technique'
);

-- ── Campaign chat ───────────────────────────────────────────────────────────
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
SELECT lives_ok(
  $$INSERT INTO public.campaign_messages (id, campaign_id, user_id, content)
    VALUES ('f5000000-0000-4000-8000-000000000005', 'e6660000-6666-4666-8666-666666666666',
            'e1110000-1111-4111-8111-111111111111', 'Hello party')$$,
  'a member posts to campaign chat'
);
SELECT lives_ok(
  $$INSERT INTO public.campaign_messages (id, campaign_id, user_id, content, message_type)
    VALUES ('f5000000-0000-4000-8000-000000000015', 'e6660000-6666-4666-8666-666666666666',
            'e1110000-1111-4111-8111-111111111111', 'The Rift stirs', 'rift')$$,
  'a member posts a rift announcement'
);
SELECT throws_ok(
  $$INSERT INTO public.campaign_messages (campaign_id, user_id, content)
    VALUES ('e6660000-6666-4666-8666-666666666666', 'e3330000-3333-4333-8333-333333333333', 'Spoofed')$$,
  '42501', NULL,
  'a member cannot post as someone else'
);
SELECT throws_ok(
  $$INSERT INTO public.campaign_messages (campaign_id, user_id, content, message_type)
    VALUES ('e6660000-6666-4666-8666-666666666666', 'e1110000-1111-4111-8111-111111111111', 'Fake', 'system')$$,
  '42501', NULL,
  'system messages stay server-written'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e2220000-2222-4222-8222-222222222222', true); END $$;
SELECT throws_ok(
  $$INSERT INTO public.campaign_messages (campaign_id, user_id, content)
    VALUES ('e6660000-6666-4666-8666-666666666666', 'e2220000-2222-4222-8222-222222222222', 'Let me in')$$,
  '42501', NULL,
  'an outsider cannot post to campaign chat'
);
DELETE FROM public.campaign_messages WHERE id = 'f5000000-0000-4000-8000-000000000005';
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e3330000-3333-4333-8333-333333333333', true); END $$;
DELETE FROM public.campaign_messages WHERE id = 'f5000000-0000-4000-8000-000000000015';
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
DELETE FROM public.campaign_messages WHERE id = 'f5000000-0000-4000-8000-000000000005';
RESET ROLE;
SELECT is(
  (SELECT string_agg(id::text, ',') FROM public.campaign_messages
   WHERE id IN ('f5000000-0000-4000-8000-000000000005', 'f5000000-0000-4000-8000-000000000015')),
  NULL,
  'the Warden removes a member''s message, the author removes their own, an outsider removes nothing'
);

-- ── Campaign rules and the rule log ─────────────────────────────────────────
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
SELECT throws_ok(
  $$INSERT INTO public.campaign_rules (campaign_id, rules)
    VALUES ('e6660000-6666-4666-8666-666666666666', '{"economy_max_relic_value": 1}')$$,
  '42501', NULL,
  'a player cannot set campaign rules'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e3330000-3333-4333-8333-333333333333', true); END $$;
SELECT lives_ok(
  $$INSERT INTO public.campaign_rules (campaign_id, rules, updated_by)
    VALUES ('e6660000-6666-4666-8666-666666666666', '{"economy_max_relic_value": 5000}',
            'e3330000-3333-4333-8333-333333333333')
    ON CONFLICT (campaign_id) DO UPDATE SET rules = EXCLUDED.rules$$,
  'the Warden saves campaign rules'
);
SELECT lives_ok(
  $$INSERT INTO public.campaign_rule_events (campaign_id, created_by, kind)
    VALUES ('e6660000-6666-4666-8666-666666666666', 'e3330000-3333-4333-8333-333333333333', 'rules_updated')$$,
  'the Warden logs a rule event'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.campaign_rules WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666'),
  1::bigint,
  'a member reads the campaign rules'
);
SELECT is(
  (SELECT count(*) FROM public.campaign_rule_events WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666'),
  0::bigint,
  'the rule log is Warden-only'
);
UPDATE public.campaign_rules SET rules = '{}' WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666';
SELECT throws_ok(
  $$INSERT INTO public.campaign_rule_events (campaign_id, created_by, kind)
    VALUES ('e6660000-6666-4666-8666-666666666666', 'e1110000-1111-4111-8111-111111111111', 'forged')$$,
  '42501', NULL,
  'a player cannot write the rule log'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e2220000-2222-4222-8222-222222222222', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.campaign_rules WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666'),
  0::bigint,
  'an outsider cannot read the campaign rules'
);
RESET ROLE;
SELECT is(
  (SELECT rules ->> 'economy_max_relic_value' FROM public.campaign_rules
   WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666'),
  '5000',
  'a player''s rules update changed nothing'
);

-- ── Campaign relic vault ────────────────────────────────────────────────────
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e3330000-3333-4333-8333-333333333333', true); END $$;
SELECT lives_ok(
  $$SELECT public.assign_campaign_relic(
    'e6660000-6666-4666-8666-666666666666', 'frost-axe', 'Frost Axe', 'very_rare',
    '{"unique": true}'::jsonb, 1100)$$,
  'the Warden adds a catalog relic by its slug'
);
SELECT throws_ok(
  $$SELECT public.assign_campaign_relic(
    'e6660000-6666-4666-8666-666666666666', 'skywyrms-gauntlet', 'Gauntlet', 'mythic',
    '{}'::jsonb, 9000)$$,
  'P0001', 'ECONOMY_RULE_VIOLATION: relic value exceeds limit',
  'the relic RPC applies the campaign economy cap'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
SELECT is(
  (SELECT relic_id FROM public.campaign_relic_instances
   WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666'),
  'frost-axe',
  'the party sees the relic with its canonical slug'
);
SELECT throws_ok(
  $$SELECT public.assign_campaign_relic(
    'e6660000-6666-4666-8666-666666666666', 'frost-axe', 'Frost Axe', 'very_rare', '{}'::jsonb, 10)$$,
  '42501', 'CAMPAIGN_WARDEN_REQUIRED',
  'a player cannot add relics'
);
SELECT throws_ok(
  $$INSERT INTO public.campaign_relic_instances (campaign_id, name)
    VALUES ('e6660000-6666-4666-8666-666666666666', 'Smuggled relic')$$,
  '42501', NULL,
  'the vault has no direct insert'
);
DELETE FROM public.campaign_relic_instances WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666';
RESET ROLE;
SELECT is(
  (SELECT count(*) FROM public.campaign_relic_instances WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666'),
  1::bigint,
  'a player cannot remove a relic'
);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e3330000-3333-4333-8333-333333333333', true); END $$;
DELETE FROM public.campaign_relic_instances WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666';
RESET ROLE;
SELECT is(
  (SELECT count(*) FROM public.campaign_relic_instances WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666'),
  0::bigint,
  'the Warden removes a relic'
);

-- ── Warden views, party links, and character shares ─────────────────────────
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e3330000-3333-4333-8333-333333333333', true); END $$;
SELECT is(
  (SELECT (SELECT count(*) FROM public.campaign_invites WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666')
        + (SELECT count(*) FROM public.campaign_invite_audit_logs WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666')
        + (SELECT count(*) FROM public.campaign_loot_drops WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666')
        + (SELECT count(*) FROM public.campaign_member_characters WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666')),
  4::bigint,
  'the Warden reads invites, the invite log, loot, and character links'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
SELECT is(
  (SELECT (SELECT count(*) FROM public.campaign_invites WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666')
        + (SELECT count(*) FROM public.campaign_invite_audit_logs WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666')
        + (SELECT count(*) FROM public.campaign_loot_drops WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666')),
  0::bigint,
  'invites, the invite log, and loot analytics stay Warden-only'
);
SELECT is(
  (SELECT count(*) FROM public.campaign_member_characters
   WHERE campaign_member_id = 'e9990000-9999-4999-8999-999999999999'),
  1::bigint,
  'a member reads their own character link'
);
SELECT lives_ok(
  $$INSERT INTO public.campaign_character_shares (campaign_id, character_id, shared_by)
    VALUES ('e6660000-6666-4666-8666-666666666666', 'e7770000-7777-4777-8777-777777777777',
            'e1110000-1111-4111-8111-111111111111')$$,
  'a member shares their own character into the campaign'
);
SELECT throws_ok(
  $$INSERT INTO public.campaign_character_shares (campaign_id, character_id, shared_by)
    VALUES ('e6660000-6666-4666-8666-666666666666', 'e8880000-8888-4888-8888-888888888888',
            'e1110000-1111-4111-8111-111111111111')$$,
  '42501', NULL,
  'a member cannot share someone else''s character'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e2220000-2222-4222-8222-222222222222', true); END $$;
SELECT throws_ok(
  $$INSERT INTO public.campaign_character_shares (campaign_id, character_id, shared_by)
    VALUES ('e6660000-6666-4666-8666-666666666666', 'e8880000-8888-4888-8888-888888888888',
            'e2220000-2222-4222-8222-222222222222')$$,
  '42501', NULL,
  'an outsider cannot share a character into the campaign'
);
SELECT is(
  (SELECT count(*) FROM public.campaign_member_characters
   WHERE campaign_id = 'e6660000-6666-4666-8666-666666666666'),
  0::bigint,
  'an outsider cannot read the party''s character links'
);

-- ── Homebrew ────────────────────────────────────────────────────────────────
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
SELECT is(
  (SELECT confrelid::regclass::text FROM pg_constraint
   WHERE conrelid = 'public.homebrew_content'::regclass
     AND conname = 'homebrew_content_user_id_fkey'),
  'profiles',
  'homebrew owners reference profiles, not the empty legacy user_profiles'
);
SELECT lives_ok(
  $$INSERT INTO public.homebrew_content (id, user_id, content_type, name, description, data)
    VALUES ('f9000000-0000-4000-8000-000000000009', 'e1110000-1111-4111-8111-111111111111',
            'item', 'Probe Relic', 'A draft.', '{}')$$,
  'the owner creates a homebrew draft'
);
SELECT lives_ok(
  $$UPDATE public.homebrew_content SET name = 'Probe Relic II'
    WHERE id = 'f9000000-0000-4000-8000-000000000009'$$,
  'the owner edits their draft'
);
SELECT is(
  (SELECT count(*) FROM public.homebrew_content_versions
   WHERE homebrew_id = 'f9000000-0000-4000-8000-000000000009'),
  1::bigint,
  'the owner reads the draft''s version history'
);
SELECT throws_ok(
  $$UPDATE public.homebrew_content SET user_id = 'e2220000-2222-4222-8222-222222222222'
    WHERE id = 'f9000000-0000-4000-8000-000000000009'$$,
  '42501', NULL,
  'the owner cannot hand their homebrew to another account'
);
SELECT lives_ok(
  $$INSERT INTO public.homebrew_content (id, user_id, content_type, name, description, data, campaign_id)
    VALUES ('f9100000-0000-4000-8000-000000000019', 'e1110000-1111-4111-8111-111111111111',
            'item', 'Party Relic', 'For the campaign.', '{}', 'e6660000-6666-4666-8666-666666666666')$$,
  'a member attaches homebrew to their campaign'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e2220000-2222-4222-8222-222222222222', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.homebrew_content
   WHERE id IN ('f9000000-0000-4000-8000-000000000009', 'f9100000-0000-4000-8000-000000000019')),
  0::bigint,
  'another user cannot see drafts'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e4440000-4444-4444-8444-444444444444', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.homebrew_content
   WHERE id IN ('f9000000-0000-4000-8000-000000000009', 'f9100000-0000-4000-8000-000000000019')),
  0::bigint,
  'the old admin app metadata reveals no drafts'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e2220000-2222-4222-8222-222222222222', true); END $$;
SELECT throws_ok(
  $$INSERT INTO public.homebrew_content (user_id, content_type, name, description, data, campaign_id)
    VALUES ('e2220000-2222-4222-8222-222222222222', 'item', 'Intruder', 'x', '{}',
            'e6660000-6666-4666-8666-666666666666')$$,
  '42501', NULL,
  'homebrew cannot be attached to a campaign the author is not in'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
SELECT lives_ok(
  $$SELECT public.set_homebrew_content_status(
    'f9000000-0000-4000-8000-000000000009', 'published', 'public', NULL)$$,
  'the owner publishes publicly'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e2220000-2222-4222-8222-222222222222', true); END $$;
SELECT is(
  (SELECT (SELECT count(*) FROM public.homebrew_content WHERE id = 'f9000000-0000-4000-8000-000000000009')
     || '/' ||
     (SELECT count(*) FROM public.homebrew_content_versions WHERE homebrew_id = 'f9000000-0000-4000-8000-000000000009')),
  '1/0',
  'published content is visible to others; its drafts are not'
);
UPDATE public.homebrew_content SET name = 'Vandalized'
  WHERE id = 'f9000000-0000-4000-8000-000000000009';
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e3330000-3333-4333-8333-333333333333', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.homebrew_content WHERE id = 'f9100000-0000-4000-8000-000000000019'),
  1::bigint,
  'the campaign''s Warden sees homebrew attached to the campaign'
);
SELECT throws_ok(
  $$UPDATE public.homebrew_content SET user_id = 'e3330000-3333-4333-8333-333333333333'
    WHERE id = 'f9100000-0000-4000-8000-000000000019'$$,
  '42501', 'HOMEBREW_OWNER_READ_ONLY',
  'a managing Warden cannot take ownership'
);
SET LOCAL ROLE anon;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '', true); END $$;
SELECT is(
  (SELECT (SELECT count(*) FROM public.homebrew_content) + (SELECT count(*) FROM public.homebrew_content_versions)),
  0::bigint,
  'signed-out callers see no homebrew or version history'
);
RESET ROLE;
SELECT is(
  (SELECT name FROM public.homebrew_content WHERE id = 'f9000000-0000-4000-8000-000000000009'),
  'Probe Relic II',
  'another user''s edit changed nothing'
);

-- ── Marketplace ─────────────────────────────────────────────────────────────
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
SELECT lives_ok(
  $$INSERT INTO public.marketplace_items
      (id, author_id, title, description, item_type, downloads_count, rating_avg, rating_count, is_verified, is_featured)
    VALUES ('fa000000-0000-4000-8000-00000000000a', 'e1110000-1111-4111-8111-111111111111',
            'Probe Map', 'A listed map.', 'map', 99, 5, 10, true, true)$$,
  'an author lists an item'
);
SELECT lives_ok(
  $$UPDATE public.marketplace_items SET title = 'Probe Map II', downloads_count = 50, is_verified = true
    WHERE id = 'fa000000-0000-4000-8000-00000000000a'$$,
  'the author edits the listing'
);
SELECT throws_ok(
  $$UPDATE public.marketplace_items SET author_id = 'e2220000-2222-4222-8222-222222222222'
    WHERE id = 'fa000000-0000-4000-8000-00000000000a'$$,
  '42501', NULL,
  'authorship cannot move'
);
SELECT ok(
  to_regclass('public.user_marketplace_entitlements') IS NULL
  AND to_regprocedure('public.gift_marketplace_item(uuid,uuid,text)') IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'marketplace_items'
      AND column_name IN ('price_type', 'price_amount', 'price_currency', 'is_listed', 'is_bundle')
  ),
  'the marketplace is free and public: no prices, entitlements, gifts, or hidden listings'
);
UPDATE public.marketplace_reviews SET rating = 5
  WHERE item_id = 'fb000000-0000-4000-8000-00000000000b';
SELECT is(
  (SELECT count(*) FROM public.marketplace_items WHERE id = 'fb000000-0000-4000-8000-00000000000b'),
  1::bigint,
  'every listing is visible to other users'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e2220000-2222-4222-8222-222222222222', true); END $$;
UPDATE public.marketplace_items SET title = 'Hijacked' WHERE id = 'fa000000-0000-4000-8000-00000000000a';
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e4440000-4444-4444-8444-444444444444', true); END $$;
UPDATE public.marketplace_items SET title = 'Metadata edit' WHERE id = 'fa000000-0000-4000-8000-00000000000a';
SELECT throws_ok(
  $$INSERT INTO public.marketplace_items (author_id, title, description, item_type)
    VALUES ('e1110000-1111-4111-8111-111111111111', 'Posted for someone else', 'x', 'map')$$,
  '42501', NULL,
  'no one can list an item under another author'
);
SET LOCAL ROLE anon;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '', true); END $$;
SELECT is(
  (SELECT string_agg(title, ',' ORDER BY title) FROM public.marketplace_items
   WHERE id IN ('fa000000-0000-4000-8000-00000000000a', 'fb000000-0000-4000-8000-00000000000b')),
  'Probe Map II,Shared module',
  'signed-out callers browse every listing, and other users'' edits changed nothing'
);
RESET ROLE;
SELECT is(
  (SELECT downloads_count || '/' || rating_count || '/' || rating_avg::text || '/'
     || is_verified::text || '/' || is_featured::text
   FROM public.marketplace_items WHERE id = 'fa000000-0000-4000-8000-00000000000a'),
  '0/0/0.00/false/false',
  'authors cannot set counters, ratings, or moderation flags'
);
SELECT is(
  (SELECT rating FROM public.marketplace_reviews
   WHERE item_id = 'fb000000-0000-4000-8000-00000000000b'),
  3,
  'reviews cannot be rewritten directly'
);

-- ── Personal data ───────────────────────────────────────────────────────────
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e1110000-1111-4111-8111-111111111111', true); END $$;
SELECT lives_ok(
  $$INSERT INTO public.compendium_notes (user_id, entry_type, entry_id, content)
    VALUES ('e1110000-1111-4111-8111-111111111111', 'spell', 'probe-spell', 'Private note')$$,
  'a user writes a compendium note'
);
SELECT lives_ok(
  $$INSERT INTO public.user_tool_states (user_id, tool_key, state)
    VALUES ('e1110000-1111-4111-8111-111111111111', 'probe-tool', '{"open": true}')
    ON CONFLICT (user_id, tool_key) DO UPDATE SET state = EXCLUDED.state$$,
  'a user saves tool state'
);
SELECT lives_ok(
  $$INSERT INTO public.roll_history (user_id, character_id, campaign_id, roll_type, dice_formula, result, rolls)
    VALUES ('e1110000-1111-4111-8111-111111111111', 'e7770000-7777-4777-8777-777777777777',
            'e6660000-6666-4666-8666-666666666666', 'check', '1d20', 12, ARRAY[12])$$,
  'a member records a campaign roll for their character'
);
SELECT throws_ok(
  $$INSERT INTO public.roll_history (user_id, character_id, roll_type, dice_formula, result, rolls)
    VALUES ('e1110000-1111-4111-8111-111111111111', 'e8880000-8888-4888-8888-888888888888',
            'check', '1d20', 20, ARRAY[20])$$,
  '42501', NULL,
  'a roll cannot claim someone else''s character'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e2220000-2222-4222-8222-222222222222', true); END $$;
SELECT is(
  (SELECT (SELECT count(*) FROM public.compendium_notes WHERE user_id = 'e1110000-1111-4111-8111-111111111111')
        + (SELECT count(*) FROM public.user_tool_states WHERE user_id = 'e1110000-1111-4111-8111-111111111111')),
  0::bigint,
  'notes and tool state are private to their owner'
);
SELECT throws_ok(
  $$INSERT INTO public.roll_history (user_id, campaign_id, roll_type, dice_formula, result, rolls)
    VALUES ('e2220000-2222-4222-8222-222222222222', 'e6660000-6666-4666-8666-666666666666',
            'check', '1d20', 20, ARRAY[20])$$,
  '42501', NULL,
  'an outsider cannot record a roll in the campaign'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e3330000-3333-4333-8333-333333333333', true); END $$;
SELECT lives_ok(
  $$INSERT INTO public.roll_history (user_id, character_id, campaign_id, roll_type, dice_formula, result, rolls)
    VALUES ('e3330000-3333-4333-8333-333333333333', 'e7770000-7777-4777-8777-777777777777',
            'e6660000-6666-4666-8666-666666666666', 'save', '1d20', 8, ARRAY[8])$$,
  'the Warden records a roll for a linked character'
);
SET LOCAL ROLE anon;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '', true); END $$;
SELECT is(
  (SELECT (SELECT count(*) FROM public.compendium_notes) + (SELECT count(*) FROM public.user_tool_states)),
  0::bigint,
  'signed-out callers see no notes or tool state'
);

-- ── Profiles ────────────────────────────────────────────────────────────────
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e2220000-2222-4222-8222-222222222222', true); END $$;
SELECT lives_ok(
  $$UPDATE public.profiles SET display_name = 'Renamed' WHERE id = 'e2220000-2222-4222-8222-222222222222'$$,
  'a user edits their own profile'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e4440000-4444-4444-8444-444444444444', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.profiles),
  1::bigint,
  'the old admin app metadata reveals no one else''s profile'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e5550000-5555-4555-8555-555555555555', true); END $$;
SELECT throws_ok(
  $$INSERT INTO public.profiles (id, email, role)
    VALUES ('e5550000-5555-4555-8555-555555555555', 'rls-new@example.test', 'admin')$$,
  '42501', NULL,
  'a self-created profile cannot claim the admin role'
);
SELECT lives_ok(
  $$INSERT INTO public.profiles (id, email, role)
    VALUES ('e5550000-5555-4555-8555-555555555555', 'rls-new@example.test', 'ascendant')$$,
  'a user without a profile row creates their own'
);
RESET ROLE;
INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES
  ('e5560000-5555-4555-8555-555555555556', 'rls-claims-admin@example.test', '{"role":"admin"}');
SELECT is(
  (SELECT role FROM public.profiles WHERE id = 'e5560000-5555-4555-8555-555555555556'),
  'ascendant',
  'sign-up metadata cannot claim the admin profile role'
);
SELECT throws_ok(
  $$UPDATE public.profiles SET role = 'admin' WHERE id = 'e5560000-5555-4555-8555-555555555556'$$,
  '23514', NULL,
  'the only profile roles are Warden and Ascendant'
);

-- ── Compendium catalog ──────────────────────────────────────────────────────
SET LOCAL ROLE anon;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', '', true); END $$;
SELECT is(
  (SELECT count(*) FROM public.compendium_feature_choice_options
   WHERE group_id = 'ec000000-0000-4000-8000-00000000000c'),
  1::bigint,
  'the feature-choice catalog is readable like the rest of the compendium'
);
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e3330000-3333-4333-8333-333333333333', true); END $$;
SELECT throws_ok(
  $$INSERT INTO public.compendium_spells (name, description) VALUES ('Vandal Spell', 'x')$$,
  '42501', NULL,
  'signed-in users cannot write compendium spells'
);
SELECT throws_ok(
  $$INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key)
    VALUES ('eb000000-0000-4000-8000-00000000000b', 'warden-edit')$$,
  '42501', NULL,
  'Wardens cannot edit the shared feature-choice catalog'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'e4440000-4444-4444-8444-444444444444', true); END $$;
SELECT throws_ok(
  $$INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key)
    VALUES ('eb000000-0000-4000-8000-00000000000b', 'metadata-edit')$$,
  '42501', NULL,
  'the old admin app metadata grants no compendium writes'
);
RESET ROLE;

SELECT * FROM finish();
ROLLBACK;

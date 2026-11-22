-- Behavior checks for the function bodies repaired in 20260930100100. Each of
-- these calls failed at run time before the repair.
BEGIN;
SET LOCAL search_path = extensions, public, pg_catalog;

INSERT INTO auth.users (id, email) VALUES
  ('c1110000-1111-4111-8111-111111111111', 'repair-warden@example.test'),
  ('c2220000-2222-4222-8222-222222222222', 'repair-player@example.test'),
  ('c3330000-3333-4333-8333-333333333333', 'repair-author@example.test'),
  ('c4440000-4444-4444-8444-444444444444', 'repair-recipient@example.test');
INSERT INTO public.campaigns (id, name, warden_id, share_code) VALUES
  ('c5550000-5555-4555-8555-555555555555', 'Repair checks',
   'c1110000-1111-4111-8111-111111111111', 'REPAIR01');
INSERT INTO public.characters (id, user_id, name, level, experience) VALUES
  ('c6660000-6666-4666-8666-666666666666',
   'c2220000-2222-4222-8222-222222222222', 'Repair player', 3, 0);
INSERT INTO public.campaign_members (campaign_id, user_id, role, character_id) VALUES
  ('c5550000-5555-4555-8555-555555555555',
   'c2220000-2222-4222-8222-222222222222', 'ascendant',
   'c6660000-6666-4666-8666-666666666666');
INSERT INTO public.marketplace_items
  (id, author_id, title, description, item_type) VALUES
  ('c7770000-7777-4777-8777-777777777777', 'c3330000-3333-4333-8333-333333333333',
   'Shared map', 'A shared map.', 'map');
INSERT INTO public.homebrew_content
  (id, user_id, content_type, name, description, data, status, visibility_scope) VALUES
  ('c9990000-9999-4999-8999-999999999999', 'c3330000-3333-4333-8333-333333333333',
   'item', 'Probe Relic', 'A relic for the repair checks.', '{}'::jsonb, 'draft', 'private');

-- A Regent catch-up spell, inserted with row triggers off to isolate UPDATE.
SET LOCAL session_replication_role = replica;
INSERT INTO public.character_spells
  (id, character_id, spell_id, name, spell_level, source, is_prepared, is_known) VALUES
  ('caaa0000-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'c6660000-6666-4666-8666-666666666666',
   'spell-probe', 'Probe Spell', 1, 'Frost Regent Attunement (Catch-Up)', false, true);
SET LOCAL session_replication_role = origin;

SELECT plan(15);

-- Campaign XP award (unqualified parameters used to collide with columns).
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'c1110000-1111-4111-8111-111111111111', true); END $$;
SELECT is(
  (SELECT success FROM public.update_character_xp(
    'c6660000-6666-4666-8666-666666666666', 150,
    'c5550000-5555-4555-8555-555555555555', 'Repair check')),
  true,
  'the Warden awards XP to a campaign character'
);
RESET ROLE;
SELECT is(
  (SELECT experience FROM public.characters WHERE id = 'c6660000-6666-4666-8666-666666666666'),
  150,
  'the award reaches the character'
);
SELECT is(
  (SELECT count(*) FROM public.campaign_session_logs
   WHERE campaign_id = 'c5550000-5555-4555-8555-555555555555' AND log_type = 'reward'),
  1::bigint,
  'the award is logged to the campaign'
);

-- Marketplace downloads and reviews (every listing is free).
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'c2220000-2222-4222-8222-222222222222', true); END $$;
SELECT lives_ok(
  $$SELECT public.record_marketplace_download('c7770000-7777-4777-8777-777777777777')$$,
  'a player records a download'
);
SELECT lives_ok(
  $$SELECT public.record_marketplace_download('c7770000-7777-4777-8777-777777777777')$$,
  'a repeat download is idempotent'
);
SELECT throws_ok(
  $$SELECT public.record_marketplace_download('c8880000-8888-4888-8888-888888888888')$$,
  'P0001', 'MARKETPLACE_ITEM_NOT_FOUND',
  'a download of a missing listing fails'
);
SELECT lives_ok(
  $$SELECT public.upsert_marketplace_review('c7770000-7777-4777-8777-777777777777', 4, 'Solid map')$$,
  'a player reviews a listing'
);
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'c4440000-4444-4444-8444-444444444444', true); END $$;
SELECT lives_ok(
  $$SELECT public.record_marketplace_download('c7770000-7777-4777-8777-777777777777')$$,
  'another player records a download'
);
RESET ROLE;
SELECT is(
  (SELECT downloads_count || '/' || rating_count || '/' || rating_avg::text
   FROM public.marketplace_items WHERE id = 'c7770000-7777-4777-8777-777777777777'),
  '2/1/4.00',
  'downloads count people once and reviews update the rating'
);

-- Homebrew edits and publishing (the snapshot trigger read absent columns).
-- The edit runs as the table owner so it checks the trigger body, not RLS.
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'c3330000-3333-4333-8333-333333333333', true); END $$;
SELECT lives_ok(
  $$UPDATE public.homebrew_content SET name = 'Probe Relic II'
    WHERE id = 'c9990000-9999-4999-8999-999999999999'$$,
  'a homebrew edit runs the version snapshot trigger'
);
SET LOCAL ROLE authenticated;
SELECT lives_ok(
  $$SELECT public.set_homebrew_content_status(
    'c9990000-9999-4999-8999-999999999999', 'published', 'public', NULL)$$,
  'the owner can publish their homebrew'
);
RESET ROLE;
SELECT is(
  (SELECT version || '/' || is_public::text || '/' || (published_at IS NOT NULL)::text
   FROM public.homebrew_content WHERE id = 'c9990000-9999-4999-8999-999999999999'),
  '3/true/true',
  'each change bumps the version and publishing sets public visibility'
);
SELECT is(
  (SELECT string_agg(version_number || ':' || (snapshot->>'name'), ', ' ORDER BY version_number)
   FROM public.homebrew_content_versions WHERE homebrew_id = 'c9990000-9999-4999-8999-999999999999'),
  '1:Probe Relic, 2:Probe Relic II',
  'every change keeps a snapshot of the previous version'
);

-- Regent catch-up spells (the shared guard read power columns on spell rows).
SET LOCAL ROLE authenticated;
DO $$ BEGIN PERFORM set_config('request.jwt.claim.sub', 'c2220000-2222-4222-8222-222222222222', true); END $$;
SELECT lives_ok(
  $$UPDATE public.character_spells SET is_prepared = true
    WHERE id = 'caaa0000-aaaa-4aaa-8aaa-aaaaaaaaaaaa'$$,
  'the owner can prepare a Regent catch-up spell'
);
RESET ROLE;

-- Retired session RPC (still revoked from API roles) and the dropped
-- sourcebook entitlement projection.
-- The call runs in its own statement so the check below can see its rows.
DO $$
BEGIN
  PERFORM set_config('request.jwt.claim.sub', 'c1110000-1111-4111-8111-111111111111', true);
  PERFORM set_config('test.session_id', public.start_active_session(
    'c5550000-5555-4555-8555-555555555555', 'Repair session', NULL)::text, true);
END
$$;
SELECT is(
  (SELECT participant.is_warden FROM public.session_participants AS participant
   WHERE participant.session_id = current_setting('test.session_id')::uuid),
  true,
  'starting an active session records the Warden as a Warden participant'
);

SELECT * FROM finish();
ROLLBACK;

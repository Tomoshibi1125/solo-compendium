BEGIN;

SELECT plan(9);

SELECT ok(to_regclass('public.vtt_journal_entries') IS NULL, 'VTT journal table is absent');
SELECT ok(to_regclass('public.discord_command_audit') IS NULL, 'Discord audit table is absent');
SELECT ok(to_regclass('public.discord_account_links') IS NULL, 'Discord account-link table is absent');

SELECT is(
  (SELECT count(*) FROM pg_attribute WHERE attrelid = 'public.campaigns'::regclass AND attname IN ('discord_webhook_url', 'discord_app_id', 'discord_public_key') AND NOT attisdropped),
  0::bigint,
  'campaigns has no Discord columns'
);

SELECT is(
  (SELECT count(*) FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('vtt_journal_entries', 'discord_command_audit', 'discord_account_links')),
  0::bigint,
  'retired tables have no policies'
);

SELECT is(
  (SELECT count(*) FROM pg_trigger t JOIN pg_class c ON c.oid = t.tgrelid JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname IN ('vtt_journal_entries', 'discord_command_audit', 'discord_account_links') AND NOT t.tgisinternal),
  0::bigint,
  'retired tables have no triggers'
);

SELECT is(
  (SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND lower(p.proname) LIKE '%discord%'),
  0::bigint,
  'Discord database routines are absent'
);

SELECT ok(to_regclass('public.campaign_sessions') IS NOT NULL, 'campaign sessions remain available');
SELECT ok(to_regclass('public.campaign_session_logs') IS NOT NULL, 'campaign session logs remain available');

SELECT * FROM finish();

ROLLBACK;

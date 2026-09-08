-- Canonical Companion cleanup: remove deprecated external and VTT storage.
-- This is forward-only. It intentionally destroys legacy handouts, Discord
-- audit/link data, and campaign credentials rather than migrating them.

BEGIN;

-- `campaign_details` selects `cam.*`, so rebuild it after removing columns.
DROP VIEW IF EXISTS public.campaign_details;

DROP TABLE IF EXISTS public.vtt_journal_entries CASCADE;
DROP TABLE IF EXISTS public.discord_command_audit CASCADE;
DROP TABLE IF EXISTS public.discord_account_links CASCADE;

ALTER TABLE public.campaigns
	DROP COLUMN IF EXISTS discord_webhook_url,
	DROP COLUMN IF EXISTS discord_app_id,
	DROP COLUMN IF EXISTS discord_public_key;

CREATE VIEW public.campaign_details WITH (security_invoker = on) AS
SELECT
	cam.*,
	cam.warden_id AS dm_id,
	up.email AS warden_email,
	up.email AS dm_email,
	up.display_name AS warden_name,
	up.display_name AS dm_name
FROM public.campaigns cam
JOIN public.profiles up ON cam.warden_id = up.id;

COMMIT;

NOTIFY pgrst, 'reload schema';

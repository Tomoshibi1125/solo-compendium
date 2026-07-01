-- P5: remove VTT-only and Comm-Net/LiveKit database residue.
-- `vtt_journal_entries` is intentionally retained for the current Campaign
-- Handouts implementation until it is renamed/migrated.

DO $$
DECLARE
	routine_name TEXT;
	drop_sql TEXT;
BEGIN
	FOREACH routine_name IN ARRAY ARRAY[
		'create_vtt_audio_track',
		'create_vtt_map_element',
		'create_vtt_token',
		'delete_vtt_audio_track',
		'delete_vtt_map_element',
		'delete_vtt_token',
		'update_vtt_audio_settings',
		'update_vtt_audio_track',
		'update_vtt_map_element',
		'update_vtt_settings',
		'update_vtt_token'
	]
	LOOP
		SELECT
			string_agg(
				format(
					'DROP %s IF EXISTS %s CASCADE',
					CASE WHEN p.prokind = 'p' THEN 'PROCEDURE' ELSE 'FUNCTION' END,
					p.oid::regprocedure
				),
				'; '
			)
		INTO drop_sql
		FROM pg_proc p
		JOIN pg_namespace n ON n.oid = p.pronamespace
		WHERE n.nspname = 'public'
			AND p.proname = routine_name;

		IF drop_sql IS NOT NULL THEN
			EXECUTE drop_sql;
		END IF;
	END LOOP;
END $$;

DROP TABLE IF EXISTS public.vtt_audio_settings CASCADE;
DROP TABLE IF EXISTS public.vtt_audio_tracks CASCADE;
DROP TABLE IF EXISTS public.vtt_chat_messages CASCADE;
DROP TABLE IF EXISTS public.vtt_fog_state CASCADE;
DROP TABLE IF EXISTS public.vtt_map_elements CASCADE;
DROP TABLE IF EXISTS public.vtt_settings CASCADE;
DROP TABLE IF EXISTS public.vtt_tokens CASCADE;

-- `campaign_details` is defined as `SELECT cam.*` so it depends on every
-- column of `campaigns` (including the VTT/LiveKit ones). Drop the view first,
-- remove the columns, then recreate it verbatim — `cam.*` now simply excludes
-- the dropped columns. Definition mirrors 20260427000000 (warden_* + legacy dm_* aliases).
DROP VIEW IF EXISTS public.campaign_details;

ALTER TABLE public.campaigns
	DROP COLUMN IF EXISTS livekit_url,
	DROP COLUMN IF EXISTS livekit_api_key,
	DROP COLUMN IF EXISTS livekit_api_secret,
	DROP COLUMN IF EXISTS vtt_session_status,
	DROP COLUMN IF EXISTS vtt_settings;

CREATE VIEW public.campaign_details WITH (security_invoker = on) AS
SELECT
	cam.*,
	cam.warden_id   AS dm_id,
	up.email        AS warden_email,
	up.email        AS dm_email,
	up.display_name AS warden_name,
	up.display_name AS dm_name
FROM public.campaigns cam
JOIN public.profiles up ON cam.warden_id = up.id;

-- ============================================================================
-- Secret / hidden rolls for the campaign Game Log (D&D Beyond parity).
--
-- DDB's Game Log lets a roller make a secret roll that only they (and the DM)
-- can see. We add a `visibility` column to `campaign_roll_events` and make the
-- SELECT policy visibility-aware:
--   • public   → any campaign member or the DM (unchanged behaviour, default)
--   • dm_only  → only the roller (user_id) or the campaign DM (dm_id)
--
-- Additive + backward-compatible: existing rows default to 'public', and
-- currently-deployed client code that never sets `visibility` keeps working.
-- Realtime respects RLS, so a player never receives a dm_only INSERT they
-- aren't allowed to read.
-- ============================================================================

ALTER TABLE public.campaign_roll_events
	ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public'
	CHECK (visibility IN ('public', 'dm_only'));

DROP POLICY IF EXISTS campaign_roll_events_select ON public.campaign_roll_events;
CREATE POLICY campaign_roll_events_select ON public.campaign_roll_events
	FOR SELECT USING (
		-- Public rolls: any campaign member or the DM.
		(
			visibility = 'public'
			AND (
				EXISTS (
					SELECT 1 FROM public.campaign_members cm
					WHERE cm.campaign_id = campaign_roll_events.campaign_id
						AND cm.user_id = auth.uid()
				)
				OR EXISTS (
					SELECT 1 FROM public.campaigns c
					WHERE c.id = campaign_roll_events.campaign_id
						AND c.dm_id = auth.uid()
				)
			)
		)
		OR
		-- Secret rolls: only the roller or the campaign DM.
		(
			visibility = 'dm_only'
			AND (
				campaign_roll_events.user_id = auth.uid()
				OR EXISTS (
					SELECT 1 FROM public.campaigns c
					WHERE c.id = campaign_roll_events.campaign_id
						AND c.dm_id = auth.uid()
				)
			)
		)
	);

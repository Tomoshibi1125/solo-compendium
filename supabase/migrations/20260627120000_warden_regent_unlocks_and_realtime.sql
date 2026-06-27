-- Warden control over regent unlocks + realtime propagation.
--
-- Problem: character_regent_unlocks RLS was owner-only
-- (c.user_id = auth.uid()), so when a Warden used CampaignRegentOversight to
-- unlock a regent for a *player's* character the INSERT was silently rejected.
-- This replaces the owner-only policies with owner-OR-warden policies so a
-- Warden (or co-warden) can grant regents to the characters linked to their
-- campaign, while the character's owner keeps full control of their own rows.
--
-- It also adds campaign_members, character_regent_unlocks and character_equipment
-- to the supabase_realtime publication so the Warden roster and the player's
-- sheet update live (mirrors campaign_messages, which is already published).

-- Owner OR campaign-warden predicate is inlined into each policy below. A row is
-- manageable when the current user owns the linked character, OR is the warden
-- of (or a warden/co-warden member of) a campaign that character belongs to.

DROP POLICY IF EXISTS "regent_unlocks_select" ON public.character_regent_unlocks;
DROP POLICY IF EXISTS "Owners can read regent unlocks" ON public.character_regent_unlocks;
DROP POLICY IF EXISTS "regent_unlocks_insert" ON public.character_regent_unlocks;
DROP POLICY IF EXISTS "regent_unlocks_update" ON public.character_regent_unlocks;
DROP POLICY IF EXISTS "regent_unlocks_delete" ON public.character_regent_unlocks;
DROP POLICY IF EXISTS "Owners can manage regent unlocks" ON public.character_regent_unlocks;

CREATE POLICY "regent_unlocks_select" ON public.character_regent_unlocks
	FOR SELECT USING (
		EXISTS (
			SELECT 1 FROM public.characters c
			WHERE c.id = character_id AND c.user_id = (select auth.uid())
		)
		OR EXISTS (
			SELECT 1
			FROM public.campaign_members cm
			JOIN public.campaigns ca ON ca.id = cm.campaign_id
			WHERE cm.character_id = character_regent_unlocks.character_id
				AND (
					ca.warden_id = (select auth.uid())
					OR EXISTS (
						SELECT 1 FROM public.campaign_members w
						WHERE w.campaign_id = cm.campaign_id
							AND w.user_id = (select auth.uid())
							AND w.role IN ('warden', 'co-warden')
					)
				)
		)
	);

CREATE POLICY "regent_unlocks_insert" ON public.character_regent_unlocks
	FOR INSERT WITH CHECK (
		EXISTS (
			SELECT 1 FROM public.characters c
			WHERE c.id = character_id AND c.user_id = (select auth.uid())
		)
		OR EXISTS (
			SELECT 1
			FROM public.campaign_members cm
			JOIN public.campaigns ca ON ca.id = cm.campaign_id
			WHERE cm.character_id = character_regent_unlocks.character_id
				AND (
					ca.warden_id = (select auth.uid())
					OR EXISTS (
						SELECT 1 FROM public.campaign_members w
						WHERE w.campaign_id = cm.campaign_id
							AND w.user_id = (select auth.uid())
							AND w.role IN ('warden', 'co-warden')
					)
				)
		)
	);

CREATE POLICY "regent_unlocks_update" ON public.character_regent_unlocks
	FOR UPDATE USING (
		EXISTS (
			SELECT 1 FROM public.characters c
			WHERE c.id = character_id AND c.user_id = (select auth.uid())
		)
		OR EXISTS (
			SELECT 1
			FROM public.campaign_members cm
			JOIN public.campaigns ca ON ca.id = cm.campaign_id
			WHERE cm.character_id = character_regent_unlocks.character_id
				AND (
					ca.warden_id = (select auth.uid())
					OR EXISTS (
						SELECT 1 FROM public.campaign_members w
						WHERE w.campaign_id = cm.campaign_id
							AND w.user_id = (select auth.uid())
							AND w.role IN ('warden', 'co-warden')
					)
				)
		)
	);

CREATE POLICY "regent_unlocks_delete" ON public.character_regent_unlocks
	FOR DELETE USING (
		EXISTS (
			SELECT 1 FROM public.characters c
			WHERE c.id = character_id AND c.user_id = (select auth.uid())
		)
		OR EXISTS (
			SELECT 1
			FROM public.campaign_members cm
			JOIN public.campaigns ca ON ca.id = cm.campaign_id
			WHERE cm.character_id = character_regent_unlocks.character_id
				AND (
					ca.warden_id = (select auth.uid())
					OR EXISTS (
						SELECT 1 FROM public.campaign_members w
						WHERE w.campaign_id = cm.campaign_id
							AND w.user_id = (select auth.uid())
							AND w.role IN ('warden', 'co-warden')
					)
				)
		)
	);

-- Realtime publication: add tables whose live changes drive the campaign UI.
-- Guarded so re-running is safe (ADD TABLE errors if already a member).
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_publication_tables
		WHERE pubname = 'supabase_realtime'
			AND schemaname = 'public' AND tablename = 'campaign_members'
	) THEN
		ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_members;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_publication_tables
		WHERE pubname = 'supabase_realtime'
			AND schemaname = 'public' AND tablename = 'character_regent_unlocks'
	) THEN
		ALTER PUBLICATION supabase_realtime ADD TABLE public.character_regent_unlocks;
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'character_equipment'
	) AND NOT EXISTS (
		SELECT 1 FROM pg_publication_tables
		WHERE pubname = 'supabase_realtime'
			AND schemaname = 'public' AND tablename = 'character_equipment'
	) THEN
		ALTER PUBLICATION supabase_realtime ADD TABLE public.character_equipment;
	END IF;
END $$;

-- Ensure UPDATE/DELETE realtime payloads carry identifying columns.
ALTER TABLE public.campaign_members REPLICA IDENTITY FULL;
ALTER TABLE public.character_regent_unlocks REPLICA IDENTITY FULL;

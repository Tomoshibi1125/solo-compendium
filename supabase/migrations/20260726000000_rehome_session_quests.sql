-- ============================================================================
-- Re-home session_quests onto campaigns + repair the broken quest RPCs.
-- ============================================================================
-- The quest subsystem was never usable: (1) session_quests.session_id is a
-- NOT-NULL FK into the legacy active_sessions table, and (2) its RLS policies
-- and create/complete RPCs reference campaigns.dm_id, which was renamed to
-- warden_id (migration 20260329). SECURITY DEFINER function bodies are stored
-- as text and were NOT auto-rewritten by the rename, so the RPCs error.
--
-- This migration decouples quests from active_sessions (campaign-scoped now)
-- and rebuilds the RLS + RPCs on campaign_id + warden_id. The quest tables are
-- empty on prod, so the restructure is lossless.
-- ============================================================================

-- 1. Structure: campaign-scoped, drop the active_sessions coupling. ----------
ALTER TABLE public.session_quests
	ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
	ADD COLUMN IF NOT EXISTS completion_notes TEXT;

-- Backfill from active_sessions for any legacy rows (empty in practice).
UPDATE public.session_quests sq
	SET campaign_id = s.campaign_id
	FROM public.active_sessions s
	WHERE sq.session_id = s.id AND sq.campaign_id IS NULL;

-- Any row still without a campaign is unusable — remove, then require it.
DELETE FROM public.session_quests WHERE campaign_id IS NULL;
ALTER TABLE public.session_quests ALTER COLUMN campaign_id SET NOT NULL;

-- 2. RLS: drop every session_id-dependent policy BEFORE dropping the column,
--    then rebuild on campaign_id + warden_id. --------------------------------
-- Original names (20260220) + the granular set a later hardening pass added.
DROP POLICY IF EXISTS "Users can view session quests in their campaigns" ON public.session_quests;
DROP POLICY IF EXISTS "DMs can manage session quests in their campaigns" ON public.session_quests;
DROP POLICY IF EXISTS session_quests_select ON public.session_quests;
DROP POLICY IF EXISTS session_quests_insert ON public.session_quests;
DROP POLICY IF EXISTS session_quests_update ON public.session_quests;
DROP POLICY IF EXISTS session_quests_delete ON public.session_quests;

-- Now the legacy session coupling can be dropped.
ALTER TABLE public.session_quests DROP COLUMN IF EXISTS session_id;

CREATE INDEX IF NOT EXISTS idx_session_quests_campaign_id
	ON public.session_quests(campaign_id);

CREATE POLICY "quests_select_members" ON public.session_quests
	FOR SELECT USING (
		campaign_id IN (
			SELECT id FROM public.campaigns WHERE warden_id = auth.uid()
			UNION
			SELECT campaign_id FROM public.campaign_members WHERE user_id = auth.uid()
		)
	);

CREATE POLICY "quests_warden_manage" ON public.session_quests
	FOR ALL USING (
		campaign_id IN (
			SELECT id FROM public.campaigns WHERE warden_id = auth.uid()
		)
	);

-- 3. RPCs: rewrite create/complete on campaign_id + warden_id. ---------------
-- (claim_quest_rewards is unchanged — it never referenced dm_id/active_sessions.)
DROP FUNCTION IF EXISTS public.create_session_quest(UUID, TEXT, TEXT, TEXT[], JSONB);
CREATE FUNCTION public.create_session_quest(
	p_campaign_id UUID,
	p_title TEXT,
	p_description TEXT,
	p_objectives TEXT[],
	p_rewards JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_quest_id UUID;
	v_user UUID := auth.uid();
BEGIN
	IF v_user IS NULL THEN
		RAISE EXCEPTION 'Not authenticated';
	END IF;
	IF NOT EXISTS (
		SELECT 1 FROM public.campaigns
			WHERE id = p_campaign_id AND warden_id = v_user
	) THEN
		RAISE EXCEPTION 'Only the Warden can create quests';
	END IF;
	INSERT INTO public.session_quests (
		campaign_id, title, description, objectives, rewards, created_by
	) VALUES (
		p_campaign_id, p_title, p_description,
		COALESCE(p_objectives, '{}'), COALESCE(p_rewards, '{}'), v_user
	) RETURNING id INTO v_quest_id;
	RETURN v_quest_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.create_session_quest(UUID, TEXT, TEXT, TEXT[], JSONB)
	TO authenticated;

CREATE OR REPLACE FUNCTION public.complete_session_quest(
	p_quest_id UUID,
	p_completion_notes TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_user UUID := auth.uid();
	v_campaign UUID;
BEGIN
	IF v_user IS NULL THEN
		RAISE EXCEPTION 'Not authenticated';
	END IF;
	SELECT campaign_id INTO v_campaign
		FROM public.session_quests WHERE id = p_quest_id;
	IF NOT EXISTS (
		SELECT 1 FROM public.campaigns
			WHERE id = v_campaign AND warden_id = v_user
	) THEN
		RAISE EXCEPTION 'Only the Warden can complete quests';
	END IF;
	UPDATE public.session_quests
		SET status = 'completed',
			completion_notes = COALESCE(p_completion_notes, completion_notes),
			updated_at = NOW()
		WHERE id = p_quest_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.complete_session_quest(UUID, TEXT)
	TO authenticated;

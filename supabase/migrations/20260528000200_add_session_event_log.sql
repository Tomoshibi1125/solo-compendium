-- ============================================================================
-- Misty Pearl H4 — Session recording / replay
-- ============================================================================
-- Persistent log of VTT realtime events so Wardens can scrub through a
-- past session (Bureau Field Recorder). Players replay locally — the
-- canvas reconstructs by feeding events back through the existing
-- scene-state reducers.
--
-- Volume: a 4-hour session typically emits 5–15k events, mostly token
-- moves. We aggressively keep the row size small (jsonb payload only,
-- no joins). Old sessions can be archived to cold storage; RLS lets
-- only campaign members read.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.campaign_session_events (
	id BIGSERIAL PRIMARY KEY,
	campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
	session_id UUID REFERENCES public.campaign_sessions(id) ON DELETE SET NULL,
	actor_id UUID,
	kind TEXT NOT NULL,
	payload JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_session_events_session
	ON public.campaign_session_events (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_campaign_session_events_campaign_kind
	ON public.campaign_session_events (campaign_id, kind, created_at DESC);

ALTER TABLE public.campaign_session_events ENABLE ROW LEVEL SECURITY;

-- Members of the campaign can read.
CREATE POLICY "Campaign members can read session events"
	ON public.campaign_session_events
	FOR SELECT
	TO authenticated
	USING (
		EXISTS (
			SELECT 1 FROM public.campaign_members
			WHERE campaign_members.campaign_id = campaign_session_events.campaign_id
				AND campaign_members.user_id = auth.uid()
		)
		OR EXISTS (
			SELECT 1 FROM public.campaigns
			WHERE campaigns.id = campaign_session_events.campaign_id
				AND campaigns.warden_id = auth.uid()
		)
	);

-- Wardens / co-Wardens / owners can insert.
CREATE POLICY "Wardens can write session events"
	ON public.campaign_session_events
	FOR INSERT
	TO authenticated
	WITH CHECK (
		EXISTS (
			SELECT 1 FROM public.campaign_members
			WHERE campaign_members.campaign_id = campaign_session_events.campaign_id
				AND campaign_members.user_id = auth.uid()
				AND campaign_members.role IN ('warden', 'co-warden', 'system')
		)
		OR EXISTS (
			SELECT 1 FROM public.campaigns
			WHERE campaigns.id = campaign_session_events.campaign_id
				AND campaigns.warden_id = auth.uid()
		)
	);

COMMENT ON TABLE public.campaign_session_events IS
	'Misty Pearl H4 — Bureau Field Recorder. Persistent log of VTT realtime events for scrub / replay. Player view reconstructs by feeding rows back through the scene-state reducers.';

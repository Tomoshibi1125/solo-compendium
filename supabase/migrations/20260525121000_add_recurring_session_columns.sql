-- F4 of May 2026 remediation plan: recurring session scheduling.
-- Closes the Session Planner 🟡 finding from
-- docs/warden-tools-vtt-audit.md:62 ("no calendar UI, no recurring sessions").
--
-- Schema additions are minimal — client generates the series via
-- src/lib/sessionRecurrence.ts and inserts each occurrence as its own
-- row, linked back to the seed via `recurrence_parent_id`. No RPC
-- changes required.

ALTER TABLE public.campaign_sessions
	ADD COLUMN IF NOT EXISTS recurrence_rule TEXT,
	ADD COLUMN IF NOT EXISTS recurrence_parent_id UUID REFERENCES public.campaign_sessions(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.campaign_sessions.recurrence_rule IS
	'Subset of RFC 5545 RRULE — format: FREQ=weekly|biweekly|monthly;COUNT=N. Parsed by src/lib/sessionRecurrence.ts.';
COMMENT ON COLUMN public.campaign_sessions.recurrence_parent_id IS
	'For generated instances: points to the seed session row that owns the recurrence rule. Null on standalone sessions and on the seed itself.';

CREATE INDEX IF NOT EXISTS campaign_sessions_recurrence_parent_idx
	ON public.campaign_sessions(recurrence_parent_id)
	WHERE recurrence_parent_id IS NOT NULL;

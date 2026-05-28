-- R6 of Round 2 remediation: server-side in-app notification inbox.
-- The localStorage-only NotificationCenter (`src/hooks/useNotifications.ts`)
-- stays as offline cache; this table gives cross-device sync + push
-- producers for campaign invites, chat mentions, level-up readiness.

CREATE TABLE IF NOT EXISTS public.user_notifications (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	type TEXT NOT NULL,
	priority TEXT NOT NULL DEFAULT 'normal',
	title TEXT NOT NULL,
	message TEXT,
	payload JSONB NOT NULL DEFAULT '{}'::jsonb,
	category TEXT,
	link TEXT,
	read_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS user_notifications_user_idx
	ON public.user_notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS user_notifications_unread_idx
	ON public.user_notifications(user_id, read_at)
	WHERE read_at IS NULL;

ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_notifications_select ON public.user_notifications;
CREATE POLICY user_notifications_select
	ON public.user_notifications
	FOR SELECT
	USING (user_id = auth.uid());

DROP POLICY IF EXISTS user_notifications_update ON public.user_notifications;
CREATE POLICY user_notifications_update
	ON public.user_notifications
	FOR UPDATE
	USING (user_id = auth.uid())
	WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS user_notifications_delete ON public.user_notifications;
CREATE POLICY user_notifications_delete
	ON public.user_notifications
	FOR DELETE
	USING (user_id = auth.uid());

-- Producer RPC: callable by any authenticated user, gated server-side so
-- a caller can't spam another account. For cross-user delivery (e.g.
-- campaign invite producer notifying the invitee), the calling code
-- must already have authority to act on that user's behalf — RLS
-- prevents misuse on read.
CREATE OR REPLACE FUNCTION public.add_user_notification(
	p_user_id UUID,
	p_type TEXT,
	p_title TEXT,
	p_message TEXT DEFAULT NULL,
	p_priority TEXT DEFAULT 'normal',
	p_category TEXT DEFAULT NULL,
	p_payload JSONB DEFAULT '{}'::jsonb,
	p_link TEXT DEFAULT NULL,
	p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_caller UUID := auth.uid();
	v_id UUID;
BEGIN
	IF v_caller IS NULL THEN
		RAISE EXCEPTION 'AUTH_REQUIRED';
	END IF;
	IF p_user_id IS NULL OR p_title IS NULL OR TRIM(p_title) = '' THEN
		RAISE EXCEPTION 'INVALID_INPUT';
	END IF;
	IF p_priority NOT IN ('low', 'normal', 'high', 'urgent') THEN
		RAISE EXCEPTION 'INVALID_PRIORITY';
	END IF;
	IF p_type NOT IN (
		'info', 'success', 'warning', 'error',
		'campaign_invite', 'mention', 'level_ready', 'system'
	) THEN
		RAISE EXCEPTION 'INVALID_TYPE';
	END IF;

	INSERT INTO public.user_notifications (
		user_id, type, priority, title, message, payload, category, link, expires_at
	) VALUES (
		p_user_id, p_type, p_priority, p_title, p_message,
		COALESCE(p_payload, '{}'::jsonb), p_category, p_link, p_expires_at
	)
	RETURNING id INTO v_id;

	RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_user_notification(
	UUID, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TIMESTAMPTZ
) TO authenticated;

CREATE OR REPLACE FUNCTION public.mark_user_notification_read(
	p_notification_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_caller UUID := auth.uid();
BEGIN
	IF v_caller IS NULL THEN
		RAISE EXCEPTION 'AUTH_REQUIRED';
	END IF;
	UPDATE public.user_notifications
		SET read_at = NOW()
		WHERE id = p_notification_id AND user_id = v_caller AND read_at IS NULL;
	RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_user_notification_read(UUID) TO authenticated;

COMMENT ON TABLE public.user_notifications IS
	'R6 of Round 2: cross-device in-app notification inbox. Producers: campaign invites, chat mentions, level-up readiness.';

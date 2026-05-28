-- R5 of Round 2 remediation: persist recurrence_rule + recurrence_parent_id
-- through the upsert_campaign_session RPC. The columns already exist from
-- `20260525121000_add_recurring_session_columns.sql`, but the RPC's
-- signature never grew to accept them — the client was silently dropping
-- the rule string.
--
-- This migration replaces the existing function body to add two optional
-- params. Function signature changes use DROP + CREATE per Supabase guidance.

DROP FUNCTION IF EXISTS public.upsert_campaign_session(
	uuid, uuid, text, text, timestamptz, text, text
);

CREATE OR REPLACE FUNCTION public.upsert_campaign_session(
	p_campaign_id uuid,
	p_session_id uuid DEFAULT NULL,
	p_title text DEFAULT NULL,
	p_description text DEFAULT NULL,
	p_scheduled_for timestamptz DEFAULT NULL,
	p_status text DEFAULT NULL,
	p_location text DEFAULT NULL,
	p_recurrence_rule text DEFAULT NULL,
	p_recurrence_parent_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_caller uuid := auth.uid();
	v_role text;
	v_session_id uuid;
	v_status text;
BEGIN
	IF v_caller IS NULL THEN
		RAISE EXCEPTION 'AUTH_REQUIRED';
	END IF;

	-- Caller must be a Warden / co-Warden / owner on the campaign.
	SELECT role INTO v_role
		FROM public.campaign_members
		WHERE campaign_id = p_campaign_id AND user_id = v_caller
		LIMIT 1;
	IF v_role NOT IN ('warden', 'co-warden', 'system') AND
		NOT EXISTS (
			SELECT 1 FROM public.campaigns
				WHERE id = p_campaign_id AND owner_id = v_caller
		)
	THEN
		RAISE EXCEPTION 'CAMPAIGN_SESSION_FORBIDDEN';
	END IF;

	IF p_status IS NOT NULL
		AND p_status NOT IN ('planned', 'in_progress', 'completed', 'cancelled')
	THEN
		RAISE EXCEPTION 'INVALID_SESSION_STATUS';
	END IF;

	IF p_session_id IS NULL THEN
		-- INSERT
		IF p_title IS NULL OR TRIM(p_title) = '' THEN
			RAISE EXCEPTION 'SESSION_TITLE_REQUIRED';
		END IF;
		v_status := COALESCE(p_status, 'planned');
		INSERT INTO public.campaign_sessions (
			campaign_id, title, description, scheduled_for, status,
			location, created_by, recurrence_rule, recurrence_parent_id
		) VALUES (
			p_campaign_id, p_title, p_description, p_scheduled_for, v_status,
			p_location, v_caller, p_recurrence_rule, p_recurrence_parent_id
		)
		RETURNING id INTO v_session_id;
	ELSE
		-- UPDATE
		IF NOT EXISTS (
			SELECT 1 FROM public.campaign_sessions
				WHERE id = p_session_id AND campaign_id = p_campaign_id
		) THEN
			RAISE EXCEPTION 'SESSION_NOT_FOUND';
		END IF;
		UPDATE public.campaign_sessions
		SET
			title = COALESCE(p_title, title),
			description = COALESCE(p_description, description),
			scheduled_for = COALESCE(p_scheduled_for, scheduled_for),
			status = COALESCE(p_status, status),
			location = COALESCE(p_location, location),
			recurrence_rule = COALESCE(p_recurrence_rule, recurrence_rule),
			recurrence_parent_id = COALESCE(p_recurrence_parent_id, recurrence_parent_id),
			updated_at = NOW()
		WHERE id = p_session_id AND campaign_id = p_campaign_id;
		v_session_id := p_session_id;
	END IF;

	RETURN v_session_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_campaign_session(
	uuid, uuid, text, text, timestamptz, text, text, text, uuid
) TO authenticated;

COMMENT ON FUNCTION public.upsert_campaign_session IS
	'Create / update a campaign session. R5: now persists optional recurrence_rule + recurrence_parent_id added by 20260525121000. Errors: AUTH_REQUIRED, CAMPAIGN_SESSION_FORBIDDEN, INVALID_SESSION_STATUS, SESSION_TITLE_REQUIRED, SESSION_NOT_FOUND.';

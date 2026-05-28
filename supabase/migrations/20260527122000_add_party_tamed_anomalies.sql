-- Q6 of Round 3 remediation: universal taming substrate.
-- Any character can attempt to tame a `tameable` anomaly. Tamed anomalies
-- belong to the party (campaign-scoped); any party member may take
-- control. Solo-guest path mirrors via character_tamed_anomalies.
--
-- Path bonuses (Pack Leader / Summoner / Contractor / Esper / Synchronist
-- / Hive) layer onto whoever ends up controlling — handled client-side
-- by `src/lib/taming.ts:getControllerBonuses`.

CREATE TABLE IF NOT EXISTS public.campaign_tamed_anomalies (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
	anomaly_id TEXT NOT NULL,
	nickname TEXT,
	current_hp INT NOT NULL,
	max_hp_override INT,
	bond_level INT NOT NULL DEFAULT 1,
	conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
	notes TEXT,
	primary_handler_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
	current_controller_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
	initiative INT,
	tamed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	tamed_by_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
	is_summoned BOOLEAN NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS campaign_tamed_anomalies_campaign_idx
	ON public.campaign_tamed_anomalies(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_tamed_anomalies_controller_idx
	ON public.campaign_tamed_anomalies(current_controller_character_id);

ALTER TABLE public.campaign_tamed_anomalies ENABLE ROW LEVEL SECURITY;

-- SELECT: any campaign member can see the party's tamed anomalies.
DROP POLICY IF EXISTS cta_select ON public.campaign_tamed_anomalies;
CREATE POLICY cta_select
	ON public.campaign_tamed_anomalies
	FOR SELECT
	USING (
		EXISTS (
			SELECT 1 FROM public.campaign_members cm
				WHERE cm.campaign_id = campaign_tamed_anomalies.campaign_id
					AND cm.user_id = auth.uid()
		)
		OR EXISTS (
			SELECT 1 FROM public.campaigns c
				WHERE c.id = campaign_tamed_anomalies.campaign_id
					AND c.warden_id = auth.uid()
		)
	);

-- UPDATE: current controller, primary handler, or campaign Warden may
-- write. Insert / delete handled by RPCs only.
DROP POLICY IF EXISTS cta_update ON public.campaign_tamed_anomalies;
CREATE POLICY cta_update
	ON public.campaign_tamed_anomalies
	FOR UPDATE
	USING (
		(
			current_controller_character_id IS NOT NULL
			AND EXISTS (
				SELECT 1 FROM public.characters ch
					WHERE ch.id = campaign_tamed_anomalies.current_controller_character_id
						AND ch.user_id = auth.uid()
			)
		)
		OR (
			primary_handler_character_id IS NOT NULL
			AND EXISTS (
				SELECT 1 FROM public.characters ch
					WHERE ch.id = campaign_tamed_anomalies.primary_handler_character_id
						AND ch.user_id = auth.uid()
			)
		)
		OR EXISTS (
			SELECT 1 FROM public.campaigns c
				WHERE c.id = campaign_tamed_anomalies.campaign_id
					AND c.warden_id = auth.uid()
		)
	);

-- Solo / guest mirror — character-scoped.
CREATE TABLE IF NOT EXISTS public.character_tamed_anomalies (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
	anomaly_id TEXT NOT NULL,
	nickname TEXT,
	current_hp INT NOT NULL,
	max_hp_override INT,
	bond_level INT NOT NULL DEFAULT 1,
	conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
	notes TEXT,
	initiative INT,
	tamed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	is_summoned BOOLEAN NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS character_tamed_anomalies_character_idx
	ON public.character_tamed_anomalies(character_id);

ALTER TABLE public.character_tamed_anomalies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cha_ta_select ON public.character_tamed_anomalies;
CREATE POLICY cha_ta_select
	ON public.character_tamed_anomalies
	FOR SELECT
	USING (
		EXISTS (
			SELECT 1 FROM public.characters ch
				WHERE ch.id = character_tamed_anomalies.character_id
					AND ch.user_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS cha_ta_write ON public.character_tamed_anomalies;
CREATE POLICY cha_ta_write
	ON public.character_tamed_anomalies
	FOR ALL
	USING (
		EXISTS (
			SELECT 1 FROM public.characters ch
				WHERE ch.id = character_tamed_anomalies.character_id
					AND ch.user_id = auth.uid()
		)
	);

-- RPC: attempt_taming -------------------------------------------------
-- Returns the new tamed-anomaly row id on success, NULL on failure.
-- Caller passes the roll total + DC (validated client-side via
-- src/lib/taming.ts to keep server-side schema small).

CREATE OR REPLACE FUNCTION public.attempt_taming(
	p_campaign_id UUID,
	p_character_id UUID,
	p_anomaly_id TEXT,
	p_roll_total INT,
	p_dc INT,
	p_initial_hp INT,
	p_bond_initial INT DEFAULT 1,
	p_nickname TEXT DEFAULT NULL
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
	IF p_anomaly_id IS NULL OR TRIM(p_anomaly_id) = '' THEN
		RAISE EXCEPTION 'INVALID_INPUT';
	END IF;
	-- Caller must own the character.
	IF NOT EXISTS (
		SELECT 1 FROM public.characters ch
			WHERE ch.id = p_character_id AND ch.user_id = v_caller
	) THEN
		RAISE EXCEPTION 'NOT_OWNER';
	END IF;

	IF p_roll_total < p_dc THEN
		RETURN NULL;
	END IF;

	IF p_campaign_id IS NULL THEN
		INSERT INTO public.character_tamed_anomalies (
			character_id, anomaly_id, current_hp, bond_level,
			nickname, tamed_at
		)
		VALUES (
			p_character_id, p_anomaly_id, p_initial_hp,
			COALESCE(p_bond_initial, 1), p_nickname, NOW()
		)
		RETURNING id INTO v_id;
	ELSE
		-- Verify the character is on the campaign.
		IF NOT EXISTS (
			SELECT 1 FROM public.campaign_members cm
				WHERE cm.campaign_id = p_campaign_id
					AND cm.user_id = v_caller
		) AND NOT EXISTS (
			SELECT 1 FROM public.campaigns c
				WHERE c.id = p_campaign_id AND c.warden_id = v_caller
		) THEN
			RAISE EXCEPTION 'NOT_CAMPAIGN_MEMBER';
		END IF;

		INSERT INTO public.campaign_tamed_anomalies (
			campaign_id, anomaly_id, current_hp, bond_level,
			nickname, tamed_at, tamed_by_character_id,
			primary_handler_character_id, current_controller_character_id
		)
		VALUES (
			p_campaign_id, p_anomaly_id, p_initial_hp,
			COALESCE(p_bond_initial, 1), p_nickname, NOW(),
			p_character_id, p_character_id, p_character_id
		)
		RETURNING id INTO v_id;
	END IF;

	RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.attempt_taming(
	UUID, UUID, TEXT, INT, INT, INT, INT, TEXT
) TO authenticated;

-- RPC: claim_anomaly_controller --------------------------------------
-- Atomic compare-and-set — succeeds when controller is null OR was set
-- by a character no longer in the campaign.

CREATE OR REPLACE FUNCTION public.claim_anomaly_controller(
	p_tamed_id UUID,
	p_character_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_caller UUID := auth.uid();
	v_campaign_id UUID;
BEGIN
	IF v_caller IS NULL THEN
		RAISE EXCEPTION 'AUTH_REQUIRED';
	END IF;
	-- Caller must own the character.
	IF NOT EXISTS (
		SELECT 1 FROM public.characters ch
			WHERE ch.id = p_character_id AND ch.user_id = v_caller
	) THEN
		RAISE EXCEPTION 'NOT_OWNER';
	END IF;

	SELECT campaign_id INTO v_campaign_id
		FROM public.campaign_tamed_anomalies
		WHERE id = p_tamed_id;
	IF v_campaign_id IS NULL THEN
		RAISE EXCEPTION 'TAMED_NOT_FOUND';
	END IF;

	-- Caller's character must be on the campaign.
	IF NOT EXISTS (
		SELECT 1 FROM public.campaign_members cm
			WHERE cm.campaign_id = v_campaign_id
				AND cm.user_id = v_caller
	) AND NOT EXISTS (
		SELECT 1 FROM public.campaigns c
			WHERE c.id = v_campaign_id AND c.warden_id = v_caller
	) THEN
		RAISE EXCEPTION 'NOT_CAMPAIGN_MEMBER';
	END IF;

	UPDATE public.campaign_tamed_anomalies
		SET current_controller_character_id = p_character_id,
				updated_at = NOW()
		WHERE id = p_tamed_id;

	RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_anomaly_controller(UUID, UUID)
	TO authenticated;

CREATE OR REPLACE FUNCTION public.release_anomaly_controller(
	p_tamed_id UUID
)
RETURNS VOID
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
	UPDATE public.campaign_tamed_anomalies
		SET current_controller_character_id = NULL,
				updated_at = NOW()
		WHERE id = p_tamed_id
			AND (
				current_controller_character_id IN (
					SELECT id FROM public.characters
						WHERE user_id = v_caller
				)
				OR EXISTS (
					SELECT 1 FROM public.campaigns c
						WHERE c.id = campaign_tamed_anomalies.campaign_id
							AND c.warden_id = v_caller
				)
			);
END;
$$;

GRANT EXECUTE ON FUNCTION public.release_anomaly_controller(UUID)
	TO authenticated;

COMMENT ON TABLE public.campaign_tamed_anomalies IS
	'Q6 of Round 3: party-scoped tamed anomalies. Any campaign member may take control via claim_anomaly_controller. Path bonuses layer client-side.';

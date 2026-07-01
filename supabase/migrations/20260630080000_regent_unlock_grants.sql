-- Warden-granted Regent-unlock opportunities ("credits").
--
-- Canon model: a Regent unlocks only when the WARDEN confirms the character
-- completed a generic regent-tagged quest (not tied to any specific Regent).
-- The grant creates an opportunity; the PLAYER then chooses one of three
-- stat-ranked Regents (RegentUnlocksPanel) to consume it, which writes the
-- actual character_regent_unlocks row.
--
-- Enforcement: only a campaign Warden/co-warden may INSERT a grant (players
-- cannot self-grant → cannot self-unlock). The character owner may UPDATE a
-- grant to mark it consumed when they pick their Regent. Owner + Warden may read.
--
-- Idempotent / re-runnable: guards on table, index, policies, and publication.

CREATE TABLE IF NOT EXISTS public.character_regent_unlock_grants (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
	-- The regent-tagged quest the Warden completed to award this grant.
	quest_id TEXT,
	quest_title TEXT NOT NULL,
	granted_by UUID,
	granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	-- NULL until the player spends the grant on a chosen Regent.
	consumed_at TIMESTAMPTZ,
	consumed_unlock_id UUID
);

-- Fast lookup of a character's available (unconsumed) credits.
CREATE INDEX IF NOT EXISTS idx_regent_unlock_grants_char_open
	ON public.character_regent_unlock_grants(character_id)
	WHERE consumed_at IS NULL;

ALTER TABLE public.character_regent_unlock_grants ENABLE ROW LEVEL SECURITY;

-- Warden-of-campaign predicate (matches character_regent_unlocks policies):
-- the current user is the warden of, or a warden/co-warden member of, a
-- campaign the grant's character belongs to.
DROP POLICY IF EXISTS "regent_unlock_grants_select" ON public.character_regent_unlock_grants;
DROP POLICY IF EXISTS "regent_unlock_grants_insert" ON public.character_regent_unlock_grants;
DROP POLICY IF EXISTS "regent_unlock_grants_update" ON public.character_regent_unlock_grants;
DROP POLICY IF EXISTS "regent_unlock_grants_delete" ON public.character_regent_unlock_grants;

-- SELECT: owner OR warden.
CREATE POLICY "regent_unlock_grants_select" ON public.character_regent_unlock_grants
	FOR SELECT USING (
		EXISTS (
			SELECT 1 FROM public.characters c
			WHERE c.id = character_id AND c.user_id = (select auth.uid())
		)
		OR EXISTS (
			SELECT 1
			FROM public.campaign_members cm
			JOIN public.campaigns ca ON ca.id = cm.campaign_id
			WHERE cm.character_id = character_regent_unlock_grants.character_id
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

-- INSERT: WARDEN ONLY. Players cannot grant themselves an unlock.
CREATE POLICY "regent_unlock_grants_insert" ON public.character_regent_unlock_grants
	FOR INSERT WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.campaign_members cm
			JOIN public.campaigns ca ON ca.id = cm.campaign_id
			WHERE cm.character_id = character_regent_unlock_grants.character_id
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

-- UPDATE: owner OR warden (owner consumes; warden may revoke/adjust).
CREATE POLICY "regent_unlock_grants_update" ON public.character_regent_unlock_grants
	FOR UPDATE USING (
		EXISTS (
			SELECT 1 FROM public.characters c
			WHERE c.id = character_id AND c.user_id = (select auth.uid())
		)
		OR EXISTS (
			SELECT 1
			FROM public.campaign_members cm
			JOIN public.campaigns ca ON ca.id = cm.campaign_id
			WHERE cm.character_id = character_regent_unlock_grants.character_id
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

-- DELETE: WARDEN ONLY (rescind an unspent grant).
CREATE POLICY "regent_unlock_grants_delete" ON public.character_regent_unlock_grants
	FOR DELETE USING (
		EXISTS (
			SELECT 1
			FROM public.campaign_members cm
			JOIN public.campaigns ca ON ca.id = cm.campaign_id
			WHERE cm.character_id = character_regent_unlock_grants.character_id
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

-- Track a one-time retroactive catch-up: when a Regent is unlocked mid-game the
-- character is owed every regent pick for tiers 1..currentLevel at once. Stamp
-- the level at which the catch-up picker was completed so it fires only once.
ALTER TABLE public.character_regent_unlocks
	ADD COLUMN IF NOT EXISTS caught_up_at_level INTEGER;

-- The wizard/grant choice wiring reads characters.regent_overlays, which was
-- created uuid[] but in practice holds canonical string ids ("umbral_regent").
-- Widen to text[] so the bridge can write the canonical id. The `user_characters`
-- view (SELECT c.*, …) depends on the column, so drop + recreate it around the
-- ALTER (it is a simple security-invoker view; default privileges re-apply).
DO $$
BEGIN
	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'characters'
			AND column_name = 'regent_overlays'
			AND udt_name = '_uuid'
	) THEN
		DROP VIEW IF EXISTS public.user_characters;
		ALTER TABLE public.characters
			ALTER COLUMN regent_overlays TYPE text[] USING regent_overlays::text[];
		CREATE VIEW public.user_characters WITH (security_invoker = on) AS
		SELECT
			c.*,
			up.email AS user_email,
			up.display_name AS user_name,
			up.role AS user_role
		FROM public.characters c
		JOIN public.profiles up ON c.user_id = up.id;
	END IF;
END $$;

-- Realtime: the player's sheet must see a Warden grant appear without refresh,
-- and the Warden roster must see consumption. Guarded so re-running is safe.
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_publication_tables
		WHERE pubname = 'supabase_realtime'
			AND schemaname = 'public' AND tablename = 'character_regent_unlock_grants'
	) THEN
		ALTER PUBLICATION supabase_realtime ADD TABLE public.character_regent_unlock_grants;
	END IF;
END $$;

ALTER TABLE public.character_regent_unlock_grants REPLICA IDENTITY FULL;

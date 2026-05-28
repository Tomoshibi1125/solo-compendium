-- Q7 of Round 3: vehicle ownership tables (character-scoped and
-- campaign-scoped). Mirror the shadow-soldier pattern; persistence is
-- minimal — full stats hydrate from the canonical compendium entry.

CREATE TABLE IF NOT EXISTS public.character_vehicles (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
	vehicle_id TEXT NOT NULL,
	nickname TEXT,
	current_hp INT NOT NULL,
	max_hp_override INT,
	conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
	notes TEXT,
	is_active BOOLEAN NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS character_vehicles_character_idx
	ON public.character_vehicles(character_id);
ALTER TABLE public.character_vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS character_vehicles_select ON public.character_vehicles;
CREATE POLICY character_vehicles_select
	ON public.character_vehicles
	FOR SELECT
	USING (
		EXISTS (
			SELECT 1 FROM public.characters ch
				WHERE ch.id = character_vehicles.character_id
					AND ch.user_id = auth.uid()
		)
	);
DROP POLICY IF EXISTS character_vehicles_write ON public.character_vehicles;
CREATE POLICY character_vehicles_write
	ON public.character_vehicles
	FOR ALL
	USING (
		EXISTS (
			SELECT 1 FROM public.characters ch
				WHERE ch.id = character_vehicles.character_id
					AND ch.user_id = auth.uid()
		)
	);

CREATE TABLE IF NOT EXISTS public.campaign_vehicles (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
	vehicle_id TEXT NOT NULL,
	nickname TEXT,
	current_hp INT NOT NULL,
	max_hp_override INT,
	conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
	notes TEXT,
	crew_assignments JSONB NOT NULL DEFAULT '{}'::jsonb,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS campaign_vehicles_campaign_idx
	ON public.campaign_vehicles(campaign_id);
ALTER TABLE public.campaign_vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS campaign_vehicles_select ON public.campaign_vehicles;
CREATE POLICY campaign_vehicles_select
	ON public.campaign_vehicles
	FOR SELECT
	USING (
		EXISTS (
			SELECT 1 FROM public.campaign_members cm
				WHERE cm.campaign_id = campaign_vehicles.campaign_id
					AND cm.user_id = auth.uid()
		)
		OR EXISTS (
			SELECT 1 FROM public.campaigns c
				WHERE c.id = campaign_vehicles.campaign_id
					AND c.owner_id = auth.uid()
		)
	);

DROP POLICY IF EXISTS campaign_vehicles_write ON public.campaign_vehicles;
CREATE POLICY campaign_vehicles_write
	ON public.campaign_vehicles
	FOR ALL
	USING (
		EXISTS (
			SELECT 1 FROM public.campaigns c
				WHERE c.id = campaign_vehicles.campaign_id
					AND c.owner_id = auth.uid()
		)
	);

COMMENT ON TABLE public.character_vehicles IS
	'Q7 of Round 3: character-owned mounts/vehicles. vehicle_id references the canonical compendium entry in src/data/compendium/vehicles.ts.';
COMMENT ON TABLE public.campaign_vehicles IS
	'Q7 of Round 3: campaign-owned vehicles available to the whole party. crew_assignments JSON maps seat-id → character-id.';

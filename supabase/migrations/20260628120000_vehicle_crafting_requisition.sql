-- P4: vehicle requisition, mods, condition tracks, and character crafting.

ALTER TABLE public.character_vehicles
	ADD COLUMN IF NOT EXISTS condition_state TEXT NOT NULL DEFAULT 'operational',
	ADD COLUMN IF NOT EXISTS installed_mod_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
	ADD COLUMN IF NOT EXISTS vrp_cost_paid INT NOT NULL DEFAULT 0;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'character_vehicles_condition_state_check'
	) THEN
		ALTER TABLE public.character_vehicles
			ADD CONSTRAINT character_vehicles_condition_state_check
			CHECK (
				condition_state IN (
					'operational',
					'strained',
					'damaged',
					'crippled',
					'dead',
					'calm',
					'uneasy',
					'panicked',
					'injured',
					'broken'
				)
			);
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'character_vehicles_vrp_cost_paid_check'
	) THEN
		ALTER TABLE public.character_vehicles
			ADD CONSTRAINT character_vehicles_vrp_cost_paid_check
			CHECK (vrp_cost_paid >= 0);
	END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.character_requisition_profiles (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	character_id UUID NOT NULL UNIQUE REFERENCES public.characters(id) ON DELETE CASCADE,
	total_vrp INT NOT NULL DEFAULT 3,
	spent_vrp INT NOT NULL DEFAULT 0,
	available_vrp INT GENERATED ALWAYS AS (total_vrp - spent_vrp) STORED,
	notes TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT character_requisition_profiles_vrp_check
		CHECK (total_vrp >= 0 AND spent_vrp >= 0 AND spent_vrp <= total_vrp)
);

CREATE INDEX IF NOT EXISTS character_requisition_profiles_character_idx
	ON public.character_requisition_profiles(character_id);

ALTER TABLE public.character_requisition_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS character_requisition_profiles_owner ON public.character_requisition_profiles;
CREATE POLICY character_requisition_profiles_owner
	ON public.character_requisition_profiles
	FOR ALL
	USING (
		EXISTS (
			SELECT 1 FROM public.characters ch
			WHERE ch.id = character_requisition_profiles.character_id
				AND ch.user_id = auth.uid()
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1 FROM public.characters ch
			WHERE ch.id = character_requisition_profiles.character_id
				AND ch.user_id = auth.uid()
		)
	);

CREATE TABLE IF NOT EXISTS public.character_recipes (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
	recipe_id TEXT NOT NULL,
	learned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	notes TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (character_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS character_recipes_character_idx
	ON public.character_recipes(character_id);

ALTER TABLE public.character_recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS character_recipes_owner ON public.character_recipes;
CREATE POLICY character_recipes_owner
	ON public.character_recipes
	FOR ALL
	USING (
		EXISTS (
			SELECT 1 FROM public.characters ch
			WHERE ch.id = character_recipes.character_id
				AND ch.user_id = auth.uid()
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1 FROM public.characters ch
			WHERE ch.id = character_recipes.character_id
				AND ch.user_id = auth.uid()
		)
	);

CREATE TABLE IF NOT EXISTS public.character_materials (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
	material_id TEXT NOT NULL,
	quantity INT NOT NULL DEFAULT 0,
	notes TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (character_id, material_id),
	CONSTRAINT character_materials_quantity_check CHECK (quantity >= 0)
);

CREATE INDEX IF NOT EXISTS character_materials_character_idx
	ON public.character_materials(character_id);

ALTER TABLE public.character_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS character_materials_owner ON public.character_materials;
CREATE POLICY character_materials_owner
	ON public.character_materials
	FOR ALL
	USING (
		EXISTS (
			SELECT 1 FROM public.characters ch
			WHERE ch.id = character_materials.character_id
				AND ch.user_id = auth.uid()
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1 FROM public.characters ch
			WHERE ch.id = character_materials.character_id
				AND ch.user_id = auth.uid()
		)
	);

CREATE TABLE IF NOT EXISTS public.character_crafting_projects (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
	recipe_id TEXT NOT NULL,
	name TEXT,
	status TEXT NOT NULL DEFAULT 'active',
	progress INT NOT NULL DEFAULT 0,
	progress_required INT NOT NULL DEFAULT 1,
	materials_committed JSONB NOT NULL DEFAULT '[]'::jsonb,
	notes TEXT,
	started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	completed_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT character_crafting_projects_status_check
		CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
	CONSTRAINT character_crafting_projects_progress_check
		CHECK (progress >= 0 AND progress_required > 0)
);

CREATE INDEX IF NOT EXISTS character_crafting_projects_character_idx
	ON public.character_crafting_projects(character_id);

ALTER TABLE public.character_crafting_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS character_crafting_projects_owner ON public.character_crafting_projects;
CREATE POLICY character_crafting_projects_owner
	ON public.character_crafting_projects
	FOR ALL
	USING (
		EXISTS (
			SELECT 1 FROM public.characters ch
			WHERE ch.id = character_crafting_projects.character_id
				AND ch.user_id = auth.uid()
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1 FROM public.characters ch
			WHERE ch.id = character_crafting_projects.character_id
				AND ch.user_id = auth.uid()
		)
	);

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_trigger
		WHERE tgname = 'update_character_requisition_profiles_updated_at'
	) THEN
		CREATE TRIGGER update_character_requisition_profiles_updated_at
			BEFORE UPDATE ON public.character_requisition_profiles
			FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_trigger
		WHERE tgname = 'update_character_recipes_updated_at'
	) THEN
		CREATE TRIGGER update_character_recipes_updated_at
			BEFORE UPDATE ON public.character_recipes
			FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_trigger
		WHERE tgname = 'update_character_materials_updated_at'
	) THEN
		CREATE TRIGGER update_character_materials_updated_at
			BEFORE UPDATE ON public.character_materials
			FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_trigger
		WHERE tgname = 'update_character_crafting_projects_updated_at'
	) THEN
		CREATE TRIGGER update_character_crafting_projects_updated_at
			BEFORE UPDATE ON public.character_crafting_projects
			FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
	END IF;
END $$;

DO $$
BEGIN
	IF EXISTS (
		SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
	) THEN
		IF NOT EXISTS (
			SELECT 1 FROM pg_publication_tables
			WHERE pubname = 'supabase_realtime'
				AND schemaname = 'public' AND tablename = 'character_vehicles'
		) THEN
			ALTER PUBLICATION supabase_realtime ADD TABLE public.character_vehicles;
		END IF;

		IF NOT EXISTS (
			SELECT 1 FROM pg_publication_tables
			WHERE pubname = 'supabase_realtime'
				AND schemaname = 'public' AND tablename = 'character_requisition_profiles'
		) THEN
			ALTER PUBLICATION supabase_realtime ADD TABLE public.character_requisition_profiles;
		END IF;

		IF NOT EXISTS (
			SELECT 1 FROM pg_publication_tables
			WHERE pubname = 'supabase_realtime'
				AND schemaname = 'public' AND tablename = 'character_recipes'
		) THEN
			ALTER PUBLICATION supabase_realtime ADD TABLE public.character_recipes;
		END IF;

		IF NOT EXISTS (
			SELECT 1 FROM pg_publication_tables
			WHERE pubname = 'supabase_realtime'
				AND schemaname = 'public' AND tablename = 'character_materials'
		) THEN
			ALTER PUBLICATION supabase_realtime ADD TABLE public.character_materials;
		END IF;

		IF NOT EXISTS (
			SELECT 1 FROM pg_publication_tables
			WHERE pubname = 'supabase_realtime'
				AND schemaname = 'public' AND tablename = 'character_crafting_projects'
		) THEN
			ALTER PUBLICATION supabase_realtime ADD TABLE public.character_crafting_projects;
		END IF;
	END IF;
END $$;

ALTER TABLE public.character_vehicles REPLICA IDENTITY FULL;
ALTER TABLE public.character_requisition_profiles REPLICA IDENTITY FULL;
ALTER TABLE public.character_recipes REPLICA IDENTITY FULL;
ALTER TABLE public.character_materials REPLICA IDENTITY FULL;
ALTER TABLE public.character_crafting_projects REPLICA IDENTITY FULL;

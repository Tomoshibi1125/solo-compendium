-- Fix character_techniques.technique_id.
--
-- It was defined as `UUID NOT NULL REFERENCES public.compendium_techniques(id)`
-- (see 20260223180000_comprehensive_choice_parity.sql), but the technique
-- catalog the app lists/adds is STATIC string-ID canonical data
-- (e.g. 'back-alley-strike'), NOT rows in compendium_techniques. Inserting a
-- static id therefore threw a raw Postgres error (uuid type / FK violation),
-- which surfaced in the UI as the fallback toast "Failed to add technique."
--
-- character_powers.power_id and character_spells.spell_id are already plain
-- TEXT columns with no FK; this brings techniques to the same model so the
-- learned technique_id can hold the static canonical id and hydrate by id.
--
-- Self-applying / idempotent: safe to re-run. The UNIQUE(character_id,
-- technique_id) constraint is on the columns and survives the type change.

DO $$
BEGIN
	-- Drop the FK to compendium_techniques if it still exists.
	IF EXISTS (
		SELECT 1 FROM information_schema.table_constraints
		WHERE constraint_schema = 'public'
			AND table_name = 'character_techniques'
			AND constraint_name = 'character_techniques_technique_id_fkey'
	) THEN
		ALTER TABLE public.character_techniques
			DROP CONSTRAINT character_techniques_technique_id_fkey;
	END IF;

	-- Convert technique_id UUID -> TEXT (no-op if already text).
	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'character_techniques'
			AND column_name = 'technique_id'
			AND data_type = 'uuid'
	) THEN
		ALTER TABLE public.character_techniques
			ALTER COLUMN technique_id TYPE TEXT USING technique_id::text;
	END IF;
END $$;

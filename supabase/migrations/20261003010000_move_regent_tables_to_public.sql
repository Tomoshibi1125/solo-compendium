-- Move regent catch-up tables from app_private to public schema
-- Rationale: These tables contain auto-generated data from regent definitions,
-- not warden-curated choices. Since wardens only offer regents (not individual
-- ability choices), this data should be publicly accessible.

BEGIN;

-- Create tables in public schema with same structure
CREATE TABLE IF NOT EXISTS public.regent_canonical_pick_options (
  kind TEXT NOT NULL CHECK (kind IN ('powers', 'techniques', 'cantrips', 'spells')),
  canonical_id TEXT NOT NULL,
  name TEXT NOT NULL,
  tier INTEGER NOT NULL CHECK (tier BETWEEN 0 AND 9),
  PRIMARY KEY (kind, canonical_id),
  CHECK ((kind = 'cantrips') = (tier = 0))
);

CREATE TABLE IF NOT EXISTS public.regent_catch_up_requirements (
  regent_id TEXT NOT NULL,
  regent_name TEXT NOT NULL,
  character_level INTEGER NOT NULL CHECK (character_level BETWEEN 1 AND 20),
  powers INTEGER NOT NULL CHECK (powers >= 0),
  techniques INTEGER NOT NULL CHECK (techniques >= 0),
  cantrips INTEGER NOT NULL CHECK (cantrips >= 0),
  spells INTEGER NOT NULL CHECK (spells >= 0),
  max_spell_tier INTEGER NOT NULL CHECK (max_spell_tier BETWEEN 0 AND 9),
  PRIMARY KEY (regent_id, character_level)
);

-- Migrate data from app_private to public (if app_private tables exist)
DO $$
BEGIN
  -- Check if app_private tables exist and have data
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'app_private' 
    AND table_name = 'regent_canonical_pick_options'
  ) THEN
    INSERT INTO public.regent_canonical_pick_options (kind, canonical_id, name, tier)
    SELECT kind, canonical_id, name, tier
    FROM app_private.regent_canonical_pick_options
    ON CONFLICT (kind, canonical_id) DO UPDATE SET
      name = EXCLUDED.name,
      tier = EXCLUDED.tier;
  END IF;

  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'app_private' 
    AND table_name = 'regent_catch_up_requirements'
  ) THEN
    INSERT INTO public.regent_catch_up_requirements (regent_id, regent_name, character_level, powers, techniques, cantrips, spells, max_spell_tier)
    SELECT regent_id, regent_name, character_level, powers, techniques, cantrips, spells, max_spell_tier
    FROM app_private.regent_catch_up_requirements
    ON CONFLICT (regent_id, character_level) DO UPDATE SET
      regent_name = EXCLUDED.regent_name,
      powers = EXCLUDED.powers,
      techniques = EXCLUDED.techniques,
      cantrips = EXCLUDED.cantrips,
      spells = EXCLUDED.spells,
      max_spell_tier = EXCLUDED.max_spell_tier;
  END IF;
END $$;

-- Update foreign key in public.regent_catch_up_options to reference new table
ALTER TABLE public.regent_catch_up_options
  DROP CONSTRAINT IF EXISTS regent_catch_up_options_kind_canonical_id_fkey;

ALTER TABLE public.regent_catch_up_options
  ADD CONSTRAINT regent_catch_up_options_kind_canonical_id_fkey
  FOREIGN KEY (kind, canonical_id)
  REFERENCES public.regent_canonical_pick_options(kind, canonical_id);

-- Add RLS policies for public read access
ALTER TABLE public.regent_canonical_pick_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regent_catch_up_requirements ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read the canonical options and requirements
CREATE POLICY regent_canonical_pick_options_select 
  ON public.regent_canonical_pick_options
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY regent_catch_up_requirements_select
  ON public.regent_catch_up_requirements
  FOR SELECT TO authenticated
  USING (true);

-- Drop old app_private tables (only after successful migration)
DO $$
BEGIN
  -- Verify data was migrated successfully before dropping
  IF (SELECT COUNT(*) FROM public.regent_catch_up_requirements) >= 240 THEN
    DROP TABLE IF EXISTS app_private.regent_canonical_pick_options CASCADE;
    DROP TABLE IF EXISTS app_private.regent_catch_up_requirements CASCADE;
    RAISE NOTICE 'Successfully migrated regent tables to public schema and dropped app_private tables';
  ELSE
    RAISE WARNING 'Migration incomplete - app_private tables preserved. Expected at least 240 rows in public.regent_catch_up_requirements';
  END IF;
END $$;

COMMIT;

NOTIFY pgrst, 'reload schema';

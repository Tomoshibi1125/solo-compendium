-- Migration to align compendium_jobs and compendium_paths with the newly updated canonical StaticData schemas

-- Add new columns to compendium_jobs
ALTER TABLE public.compendium_jobs
ADD COLUMN IF NOT EXISTS spellbook BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS powers_known JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS techniques_known JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS level_choices JSONB DEFAULT '[]'::jsonb;

-- Add new columns to compendium_paths
ALTER TABLE public.compendium_paths
ADD COLUMN IF NOT EXISTS abilities JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS path_type TEXT,
ADD COLUMN IF NOT EXISTS job_name TEXT,
ADD COLUMN IF NOT EXISTS tier INTEGER;

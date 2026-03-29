-- Add columns to match the 1.4-trillion combination generator output

-- Items
ALTER TABLE public.compendium_items ADD COLUMN IF NOT EXISTS attunement BOOLEAN DEFAULT false;
ALTER TABLE public.compendium_items ADD COLUMN IF NOT EXISTS properties JSONB;
ALTER TABLE public.compendium_items ADD COLUMN IF NOT EXISTS stats JSONB;
ALTER TABLE public.compendium_items ADD COLUMN IF NOT EXISTS effects JSONB;
ALTER TABLE public.compendium_items ADD COLUMN IF NOT EXISTS mechanics JSONB;
ALTER TABLE public.compendium_items ADD COLUMN IF NOT EXISTS limitations JSONB;
ALTER TABLE public.compendium_items ADD COLUMN IF NOT EXISTS flavor TEXT;
ALTER TABLE public.compendium_items ADD COLUMN IF NOT EXISTS lore TEXT;
-- Items already had tags from previous migrations, but we ensure it exits.
ALTER TABLE public.compendium_items ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';


-- Backgrounds
ALTER TABLE public.compendium_backgrounds ADD COLUMN IF NOT EXISTS mechanics JSONB;
ALTER TABLE public.compendium_backgrounds ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE public.compendium_backgrounds ADD COLUMN IF NOT EXISTS flavor TEXT;
ALTER TABLE public.compendium_backgrounds ADD COLUMN IF NOT EXISTS lore TEXT;


-- Jobs
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS mechanics JSONB;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS flavor TEXT;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS lore TEXT;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';


-- Paths
ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS job_id TEXT;
ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS mechanics JSONB;
ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS flavor TEXT;
ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS lore TEXT;
ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';


-- Regents
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS mechanics JSONB;
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS effects JSONB;
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS flavor TEXT;
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS lore TEXT;
ALTER TABLE public.compendium_regents ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';


-- Conditions
ALTER TABLE public.compendium_conditions ADD COLUMN IF NOT EXISTS mechanics JSONB;
ALTER TABLE public.compendium_conditions ADD COLUMN IF NOT EXISTS flavor TEXT;
ALTER TABLE public.compendium_conditions ADD COLUMN IF NOT EXISTS lore TEXT;


-- Skills
ALTER TABLE public.compendium_skills ADD COLUMN IF NOT EXISTS mechanics JSONB;
ALTER TABLE public.compendium_skills ADD COLUMN IF NOT EXISTS flavor TEXT;
ALTER TABLE public.compendium_skills ADD COLUMN IF NOT EXISTS lore TEXT;


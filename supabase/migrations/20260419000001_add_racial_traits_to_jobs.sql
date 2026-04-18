-- Add racial_traits JSONB column to compendium_jobs
ALTER TABLE public.compendium_jobs
  ADD COLUMN IF NOT EXISTS racial_traits JSONB NOT NULL DEFAULT '[]'::jsonb;

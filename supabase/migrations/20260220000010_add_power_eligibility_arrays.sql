-- Add explicit eligibility arrays for union power access (idempotent)

ALTER TABLE public.compendium_powers
ADD COLUMN IF NOT EXISTS path_names TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS regent_names TEXT[] DEFAULT '{}';

-- Add image_url and image_generated_at columns to compendium tables
-- This migration adds support for storing image URLs and tracking image generation timestamps

-- Monsters
ALTER TABLE public.compendium_monsters
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- Equipment
ALTER TABLE public.compendium_equipment
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- Relics
ALTER TABLE public.compendium_relics
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- Jobs
ALTER TABLE public.compendium_jobs
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- Job Paths (optional - for future use)
ALTER TABLE public.compendium_job_paths
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- Powers (optional - for future use)
ALTER TABLE public.compendium_powers
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- Add comments for documentation
COMMENT ON COLUMN public.compendium_monsters.image_url IS 'URL to the image stored in Supabase Storage';
COMMENT ON COLUMN public.compendium_monsters.image_generated_at IS 'Timestamp when the image was generated';
COMMENT ON COLUMN public.compendium_equipment.image_url IS 'URL to the image stored in Supabase Storage';
COMMENT ON COLUMN public.compendium_equipment.image_generated_at IS 'Timestamp when the image was generated';
COMMENT ON COLUMN public.compendium_relics.image_url IS 'URL to the image stored in Supabase Storage';
COMMENT ON COLUMN public.compendium_relics.image_generated_at IS 'Timestamp when the image was generated';
COMMENT ON COLUMN public.compendium_jobs.image_url IS 'URL to the image stored in Supabase Storage';
COMMENT ON COLUMN public.compendium_jobs.image_generated_at IS 'Timestamp when the image was generated';


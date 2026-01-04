-- Complete Setup: Base Tables + Image Columns + Storage
-- Run this in Supabase SQL Editor to set up everything for image generation
-- This matches the workspace migrations and adds image support

-- =============================================
-- PART 0: CREATE CUSTOM TYPES (if needed)
-- =============================================

-- Ability Score enum (from workspace migrations)
DO $$ BEGIN
    CREATE TYPE ability_score AS ENUM ('STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Rarity enum (from workspace migrations)
DO $$ BEGIN
    CREATE TYPE rarity AS ENUM ('common', 'uncommon', 'rare', 'very_rare', 'legendary');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Relic Tier enum (from workspace migrations)
DO $$ BEGIN
    CREATE TYPE relic_tier AS ENUM ('E', 'D', 'C', 'B', 'A', 'S', 'SS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- PART 1: CREATE BASE TABLES (if needed)
-- =============================================

-- Monsters (matching workspace schema exactly)
CREATE TABLE IF NOT EXISTS public.compendium_monsters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  size TEXT NOT NULL DEFAULT 'medium',
  creature_type TEXT NOT NULL,
  alignment TEXT,
  cr TEXT NOT NULL,
  xp INTEGER,
  armor_class INTEGER NOT NULL,
  armor_type TEXT,
  hit_points_average INTEGER NOT NULL,
  hit_points_formula TEXT NOT NULL,
  speed_walk INTEGER DEFAULT 30,
  speed_fly INTEGER,
  speed_swim INTEGER,
  speed_climb INTEGER,
  speed_burrow INTEGER,
  str INTEGER NOT NULL DEFAULT 10,
  agi INTEGER NOT NULL DEFAULT 10,
  vit INTEGER NOT NULL DEFAULT 10,
  int INTEGER NOT NULL DEFAULT 10,
  sense INTEGER NOT NULL DEFAULT 10,
  pre INTEGER NOT NULL DEFAULT 10,
  saving_throws JSONB DEFAULT '{}',
  skills JSONB DEFAULT '{}',
  damage_resistances TEXT[] DEFAULT '{}',
  damage_immunities TEXT[] DEFAULT '{}',
  damage_vulnerabilities TEXT[] DEFAULT '{}',
  condition_immunities TEXT[] DEFAULT '{}',
  senses JSONB DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  description TEXT,
  lore TEXT,
  gate_rank TEXT,
  is_boss BOOLEAN NOT NULL DEFAULT false,
  source_book TEXT DEFAULT 'MM',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Equipment (matching workspace schema exactly)
CREATE TABLE IF NOT EXISTS public.compendium_equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  cost_credits INTEGER,
  weight NUMERIC,
  properties TEXT[],
  damage TEXT,
  damage_type TEXT,
  armor_class INTEGER,
  description TEXT,
  source_book TEXT DEFAULT 'SRD',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Relics (matching workspace schema exactly)
CREATE TABLE IF NOT EXISTS public.compendium_relics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  rarity rarity NOT NULL DEFAULT 'common',
  relic_tier relic_tier,
  item_type TEXT NOT NULL,
  requires_attunement BOOLEAN NOT NULL DEFAULT false,
  attunement_requirements TEXT,
  description TEXT NOT NULL,
  properties TEXT[] DEFAULT '{}',
  quirks TEXT[] DEFAULT '{}',
  corruption_risk TEXT,
  value_credits INTEGER,
  source_book TEXT DEFAULT 'PHB',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Jobs (matching workspace schema exactly)
CREATE TABLE IF NOT EXISTS public.compendium_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  flavor_text TEXT,
  primary_abilities ability_score[] NOT NULL DEFAULT '{}',
  secondary_abilities ability_score[] DEFAULT '{}',
  hit_die INTEGER NOT NULL DEFAULT 8,
  armor_proficiencies TEXT[] DEFAULT '{}',
  weapon_proficiencies TEXT[] DEFAULT '{}',
  tool_proficiencies TEXT[] DEFAULT '{}',
  saving_throw_proficiencies ability_score[] NOT NULL DEFAULT '{}',
  skill_choices TEXT[] DEFAULT '{}',
  skill_choice_count INTEGER NOT NULL DEFAULT 2,
  source_book TEXT DEFAULT 'PHB',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job Paths (matching workspace schema exactly)
CREATE TABLE IF NOT EXISTS public.compendium_job_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.compendium_jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  flavor_text TEXT,
  path_level INTEGER NOT NULL DEFAULT 3,
  source_book TEXT DEFAULT 'PHB',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (job_id, name)
);

-- Powers (matching workspace schema exactly)
CREATE TABLE IF NOT EXISTS public.compendium_powers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  power_level INTEGER NOT NULL DEFAULT 0 CHECK (power_level >= 0 AND power_level <= 9),
  school TEXT,
  casting_time TEXT NOT NULL,
  range TEXT NOT NULL,
  duration TEXT NOT NULL,
  components TEXT,
  concentration BOOLEAN NOT NULL DEFAULT false,
  ritual BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL,
  higher_levels TEXT,
  job_names TEXT[] DEFAULT '{}',
  source_book TEXT DEFAULT 'PHB',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- PART 2: ADD IMAGE COLUMNS
-- =============================================

ALTER TABLE public.compendium_monsters
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.compendium_equipment
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.compendium_relics
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.compendium_jobs
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.compendium_job_paths
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.compendium_powers
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_generated_at TIMESTAMP WITH TIME ZONE;

-- =============================================
-- PART 3: CREATE STORAGE BUCKET
-- =============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'compendium-images',
  'compendium-images',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PART 4: STORAGE POLICIES
-- =============================================

-- Public read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access for compendium images'
  ) THEN
    CREATE POLICY "Public read access for compendium images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'compendium-images');
  END IF;
END $$;

-- Authenticated upload
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload compendium images'
  ) THEN
    CREATE POLICY "Authenticated users can upload compendium images"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'compendium-images' AND
      auth.role() = 'authenticated'
    );
  END IF;
END $$;

-- Authenticated update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update compendium images'
  ) THEN
    CREATE POLICY "Authenticated users can update compendium images"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'compendium-images' AND
      auth.role() = 'authenticated'
    );
  END IF;
END $$;

-- =============================================
-- PART 5: ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.compendium_monsters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_relics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_jobs ENABLE ROW LEVEL SECURITY;

-- Public read policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Compendium monsters is publicly readable') THEN
    CREATE POLICY "Compendium monsters is publicly readable" 
    ON public.compendium_monsters FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Compendium equipment is publicly readable') THEN
    CREATE POLICY "Compendium equipment is publicly readable" 
    ON public.compendium_equipment FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Compendium relics is publicly readable') THEN
    CREATE POLICY "Compendium relics is publicly readable" 
    ON public.compendium_relics FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Compendium jobs is publicly readable') THEN
    CREATE POLICY "Compendium jobs is publicly readable" 
    ON public.compendium_jobs FOR SELECT USING (true);
  END IF;
END $$;

-- Success message
SELECT 'Complete setup successful! Tables created, image columns added, and storage configured.' as status;


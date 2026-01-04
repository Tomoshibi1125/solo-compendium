-- Create base compendium tables if they don't exist
-- This creates the minimal schema needed for image generation
-- Run this BEFORE applying image migrations

-- =============================================
-- CREATE MONSTERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.compendium_monsters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  size TEXT DEFAULT 'medium',
  creature_type TEXT,
  alignment TEXT,
  cr TEXT,
  xp INTEGER,
  armor_class INTEGER,
  armor_type TEXT,
  hit_points_average INTEGER,
  hit_points_formula TEXT,
  speed_walk INTEGER DEFAULT 30,
  gate_rank TEXT,
  is_boss BOOLEAN DEFAULT false,
  description TEXT,
  lore TEXT,
  source_book TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- CREATE EQUIPMENT TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.compendium_equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  equipment_type TEXT,
  cost_credits INTEGER,
  weight NUMERIC,
  properties TEXT[],
  damage TEXT,
  damage_type TEXT,
  armor_class INTEGER,
  description TEXT,
  rarity TEXT,
  source_book TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- CREATE RELICS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.compendium_relics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rarity TEXT,
  description TEXT,
  properties TEXT[],
  source_book TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- CREATE JOBS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.compendium_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  hit_die INTEGER DEFAULT 8,
  source_book TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- CREATE JOB PATHS TABLE (optional)
-- =============================================
CREATE TABLE IF NOT EXISTS public.compendium_job_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  job_id UUID REFERENCES public.compendium_jobs(id),
  description TEXT,
  source_book TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- CREATE POWERS TABLE (optional)
-- =============================================
CREATE TABLE IF NOT EXISTS public.compendium_powers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  power_level INTEGER,
  description TEXT,
  source_book TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY (Basic)
-- =============================================
ALTER TABLE public.compendium_monsters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_relics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_job_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_powers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
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
SELECT 'Base compendium tables created successfully! Now apply image migrations.' as status;


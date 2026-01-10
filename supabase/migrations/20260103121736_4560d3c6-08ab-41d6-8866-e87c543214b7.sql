-- Create compendium tables for Solo Leveling 5e
-- These are public read-only tables for browsing game content

-- Jobs (Hunter classes)
CREATE TABLE IF NOT EXISTS public.compendium_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  flavor_text TEXT,
  
  -- Primary and secondary abilities
  primary_abilities ability_score[] NOT NULL DEFAULT '{}',
  secondary_abilities ability_score[] DEFAULT '{}',
  
  -- Hit die and proficiencies
  hit_die INTEGER NOT NULL DEFAULT 8,
  armor_proficiencies TEXT[] DEFAULT '{}',
  weapon_proficiencies TEXT[] DEFAULT '{}',
  tool_proficiencies TEXT[] DEFAULT '{}',
  saving_throw_proficiencies ability_score[] NOT NULL DEFAULT '{}',
  
  -- Skill choices
  skill_choices TEXT[] DEFAULT '{}',
  skill_choice_count INTEGER NOT NULL DEFAULT 2,
  
  -- Metadata
  source_book TEXT DEFAULT 'PHB',
  tags TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job Paths (subclasses) - must be created before job_features
CREATE TABLE IF NOT EXISTS public.compendium_job_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.compendium_jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  flavor_text TEXT,
  
  -- Level when path is chosen
  path_level INTEGER NOT NULL DEFAULT 3,
  
  -- Metadata
  source_book TEXT DEFAULT 'PHB',
  tags TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE (job_id, name)
);

-- Job Features (features gained at each level)
CREATE TABLE IF NOT EXISTS public.compendium_job_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.compendium_jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 20),
  description TEXT NOT NULL,
  
  -- Action economy
  action_type TEXT,
  
  -- Usage
  uses_formula TEXT,
  recharge TEXT,
  
  -- Prerequisites
  prerequisites TEXT,
  
  -- Is this a path feature or core job feature?
  is_path_feature BOOLEAN NOT NULL DEFAULT false,
  path_id UUID REFERENCES public.compendium_job_paths(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Powers (spells, techniques, abilities)
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

-- Relics (magic items)
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

-- Monsters (creatures and bosses)
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

-- Monster Traits
CREATE TABLE IF NOT EXISTS public.compendium_monster_traits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  monster_id UUID NOT NULL REFERENCES public.compendium_monsters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Monster Actions
CREATE TABLE IF NOT EXISTS public.compendium_monster_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  monster_id UUID NOT NULL REFERENCES public.compendium_monsters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  action_type TEXT NOT NULL DEFAULT 'action',
  attack_bonus INTEGER,
  damage TEXT,
  damage_type TEXT,
  recharge TEXT,
  legendary_cost INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Backgrounds
CREATE TABLE IF NOT EXISTS public.compendium_backgrounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  skill_proficiencies TEXT[] DEFAULT '{}',
  tool_proficiencies TEXT[] DEFAULT '{}',
  language_count INTEGER DEFAULT 0,
  starting_equipment TEXT,
  starting_credits INTEGER,
  feature_name TEXT,
  feature_description TEXT,
  personality_traits TEXT[] DEFAULT '{}',
  ideals TEXT[] DEFAULT '{}',
  bonds TEXT[] DEFAULT '{}',
  flaws TEXT[] DEFAULT '{}',
  source_book TEXT DEFAULT 'PHB',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Conditions reference
CREATE TABLE IF NOT EXISTS public.compendium_conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  effects TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.compendium_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.compendium_job_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.compendium_job_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.compendium_powers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.compendium_relics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.compendium_monsters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.compendium_monster_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.compendium_monster_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.compendium_backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.compendium_conditions ENABLE ROW LEVEL SECURITY;

-- Public read access policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'compendium_jobs'
      AND policyname = 'Compendium jobs are publicly readable'
  ) THEN
    CREATE POLICY "Compendium jobs are publicly readable" ON public.compendium_jobs FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'compendium_job_features'
      AND policyname = 'Compendium job features are publicly readable'
  ) THEN
    CREATE POLICY "Compendium job features are publicly readable" ON public.compendium_job_features FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'compendium_job_paths'
      AND policyname = 'Compendium job paths are publicly readable'
  ) THEN
    CREATE POLICY "Compendium job paths are publicly readable" ON public.compendium_job_paths FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'compendium_powers'
      AND policyname = 'Compendium powers are publicly readable'
  ) THEN
    CREATE POLICY "Compendium powers are publicly readable" ON public.compendium_powers FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'compendium_relics'
      AND policyname = 'Compendium relics are publicly readable'
  ) THEN
    CREATE POLICY "Compendium relics are publicly readable" ON public.compendium_relics FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'compendium_monsters'
      AND policyname = 'Compendium monsters are publicly readable'
  ) THEN
    CREATE POLICY "Compendium monsters are publicly readable" ON public.compendium_monsters FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'compendium_monster_traits'
      AND policyname = 'Compendium monster traits are publicly readable'
  ) THEN
    CREATE POLICY "Compendium monster traits are publicly readable" ON public.compendium_monster_traits FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'compendium_monster_actions'
      AND policyname = 'Compendium monster actions are publicly readable'
  ) THEN
    CREATE POLICY "Compendium monster actions are publicly readable" ON public.compendium_monster_actions FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'compendium_backgrounds'
      AND policyname = 'Compendium backgrounds are publicly readable'
  ) THEN
    CREATE POLICY "Compendium backgrounds are publicly readable" ON public.compendium_backgrounds FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'compendium_conditions'
      AND policyname = 'Compendium conditions are publicly readable'
  ) THEN
    CREATE POLICY "Compendium conditions are publicly readable" ON public.compendium_conditions FOR SELECT USING (true);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_compendium_job_features_job_id ON public.compendium_job_features(job_id);
CREATE INDEX IF NOT EXISTS idx_compendium_job_features_level ON public.compendium_job_features(level);
CREATE INDEX IF NOT EXISTS idx_compendium_job_paths_job_id ON public.compendium_job_paths(job_id);
CREATE INDEX IF NOT EXISTS idx_compendium_powers_level ON public.compendium_powers(power_level);
CREATE INDEX IF NOT EXISTS idx_compendium_powers_school ON public.compendium_powers(school);
CREATE INDEX IF NOT EXISTS idx_compendium_relics_rarity ON public.compendium_relics(rarity);
CREATE INDEX IF NOT EXISTS idx_compendium_relics_type ON public.compendium_relics(item_type);
CREATE INDEX IF NOT EXISTS idx_compendium_monsters_cr ON public.compendium_monsters(cr);
CREATE INDEX IF NOT EXISTS idx_compendium_monsters_type ON public.compendium_monsters(creature_type);
CREATE INDEX IF NOT EXISTS idx_compendium_monsters_gate_rank ON public.compendium_monsters(gate_rank);
CREATE INDEX IF NOT EXISTS idx_compendium_monster_traits_monster_id ON public.compendium_monster_traits(monster_id);
CREATE INDEX IF NOT EXISTS idx_compendium_monster_actions_monster_id ON public.compendium_monster_actions(monster_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_compendium_jobs_search ON public.compendium_jobs USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_compendium_powers_search ON public.compendium_powers USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_compendium_relics_search ON public.compendium_relics USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_compendium_monsters_search ON public.compendium_monsters USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));
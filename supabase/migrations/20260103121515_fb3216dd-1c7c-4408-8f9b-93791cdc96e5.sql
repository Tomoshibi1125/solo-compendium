-- Create enum types for System Ascendant 5e SRD
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'ability_score'
  ) THEN
    CREATE TYPE public.ability_score AS ENUM ('STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'rarity'
  ) THEN
    CREATE TYPE public.rarity AS ENUM ('common', 'uncommon', 'rare', 'very_rare', 'legendary');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'relic_tier'
  ) THEN
    CREATE TYPE public.relic_tier AS ENUM ('dormant', 'awakened', 'resonant');
  END IF;
END $$;
-- Create characters table
CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 20),
  job TEXT,
  path TEXT,
  background TEXT,
  
  -- Derived stats (calculated but stored for quick access)
  proficiency_bonus INTEGER NOT NULL DEFAULT 2,
  armor_class INTEGER NOT NULL DEFAULT 10,
  speed INTEGER NOT NULL DEFAULT 30,
  initiative INTEGER NOT NULL DEFAULT 0,
  
  -- Hit Points
  hp_current INTEGER NOT NULL DEFAULT 10,
  hp_max INTEGER NOT NULL DEFAULT 10,
  hp_temp INTEGER NOT NULL DEFAULT 0,
  
  -- Hit Dice
  hit_dice_current INTEGER NOT NULL DEFAULT 1,
  hit_dice_max INTEGER NOT NULL DEFAULT 1,
  hit_dice_size INTEGER NOT NULL DEFAULT 8,
  
  -- System Favor (Reawakened Ascendant resource)
  system_favor_current INTEGER NOT NULL DEFAULT 3,
  system_favor_max INTEGER NOT NULL DEFAULT 3,
  system_favor_die INTEGER NOT NULL DEFAULT 4,
  
  -- Proficiencies (stored as arrays)
  saving_throw_proficiencies ability_score[] DEFAULT '{}',
  skill_proficiencies TEXT[] DEFAULT '{}',
  skill_expertise TEXT[] DEFAULT '{}',
  armor_proficiencies TEXT[] DEFAULT '{}',
  weapon_proficiencies TEXT[] DEFAULT '{}',
  tool_proficiencies TEXT[] DEFAULT '{}',
  
  -- Conditions and status
  conditions TEXT[] DEFAULT '{}',
  exhaustion_level INTEGER NOT NULL DEFAULT 0 CHECK (exhaustion_level >= 0 AND exhaustion_level <= 6),
  
  -- Notes and flavor
  notes TEXT,
  appearance TEXT,
  backstory TEXT,
  portrait_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Create character_abilities table (6 ability scores per character)
CREATE TABLE public.character_abilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  ability ability_score NOT NULL,
  score INTEGER NOT NULL DEFAULT 10 CHECK (score >= 1 AND score <= 30),
  
  -- Ensure one entry per ability per character
  UNIQUE (character_id, ability)
);
-- Create character_features table (job/path/background features)
CREATE TABLE public.character_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source TEXT NOT NULL, -- e.g., "Job: Striker", "Path: Umbral Monarch", "Background: Former E-Rank"
  level_acquired INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  
  -- Usage tracking
  uses_current INTEGER,
  uses_max INTEGER,
  recharge TEXT, -- 'short-rest', 'long-rest', 'encounter', null for passive
  
  -- Action type
  action_type TEXT, -- 'action', 'bonus-action', 'reaction', 'passive'
  
  -- Is it currently active?
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Create character_equipment table (items, relics, gear)
CREATE TABLE public.character_equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'weapon', 'armor', 'relic', 'consumable', 'gear', 'currency'
  
  -- Rarity and tier (for relics)
  rarity rarity,
  relic_tier relic_tier,
  
  -- Attunement
  requires_attunement BOOLEAN NOT NULL DEFAULT false,
  is_attuned BOOLEAN NOT NULL DEFAULT false,
  
  -- Quantity and charges
  quantity INTEGER NOT NULL DEFAULT 1,
  charges_current INTEGER,
  charges_max INTEGER,
  
  -- Equipment status
  is_equipped BOOLEAN NOT NULL DEFAULT false,
  
  -- Description and properties
  description TEXT,
  properties TEXT[] DEFAULT '{}',
  
  -- Weight and value
  weight DECIMAL,
  value_credits INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Create character_powers table (spells, techniques, abilities)
CREATE TABLE public.character_powers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  power_level INTEGER NOT NULL DEFAULT 0, -- 0 for cantrips/at-will
  source TEXT, -- 'Job', 'Path', 'Relic', etc.
  
  -- Casting info
  casting_time TEXT,
  range TEXT,
  duration TEXT,
  concentration BOOLEAN NOT NULL DEFAULT false,
  
  -- Preparation
  is_prepared BOOLEAN NOT NULL DEFAULT true,
  is_known BOOLEAN NOT NULL DEFAULT true, -- false if from a relic/item
  
  description TEXT,
  higher_levels TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable Row Level Security on all tables
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_powers ENABLE ROW LEVEL SECURITY;
-- RLS Policies for characters table
CREATE POLICY "Users can view their own characters"
  ON public.characters FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own characters"
  ON public.characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own characters"
  ON public.characters FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own characters"
  ON public.characters FOR DELETE
  USING (auth.uid() = user_id);
-- RLS Policies for character_abilities (access via character ownership)
CREATE POLICY "Users can view abilities of their own characters"
  ON public.character_abilities FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_abilities.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can create abilities for their own characters"
  ON public.character_abilities FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_abilities.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can update abilities of their own characters"
  ON public.character_abilities FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_abilities.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete abilities of their own characters"
  ON public.character_abilities FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_abilities.character_id
    AND characters.user_id = auth.uid()
  ));
-- RLS Policies for character_features
CREATE POLICY "Users can view features of their own characters"
  ON public.character_features FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_features.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can create features for their own characters"
  ON public.character_features FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_features.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can update features of their own characters"
  ON public.character_features FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_features.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete features of their own characters"
  ON public.character_features FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_features.character_id
    AND characters.user_id = auth.uid()
  ));
-- RLS Policies for character_equipment
CREATE POLICY "Users can view equipment of their own characters"
  ON public.character_equipment FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_equipment.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can create equipment for their own characters"
  ON public.character_equipment FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_equipment.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can update equipment of their own characters"
  ON public.character_equipment FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_equipment.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete equipment of their own characters"
  ON public.character_equipment FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_equipment.character_id
    AND characters.user_id = auth.uid()
  ));
-- RLS Policies for character_powers
CREATE POLICY "Users can view powers of their own characters"
  ON public.character_powers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_powers.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can create powers for their own characters"
  ON public.character_powers FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_powers.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can update powers of their own characters"
  ON public.character_powers FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_powers.character_id
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete powers of their own characters"
  ON public.character_powers FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.characters
    WHERE characters.id = character_powers.character_id
    AND characters.user_id = auth.uid()
  ));
-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create trigger for automatic timestamp updates on characters
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- Create indexes for better query performance
CREATE INDEX idx_characters_user_id ON public.characters(user_id);
CREATE INDEX idx_character_abilities_character_id ON public.character_abilities(character_id);
CREATE INDEX idx_character_features_character_id ON public.character_features(character_id);
CREATE INDEX idx_character_equipment_character_id ON public.character_equipment(character_id);
CREATE INDEX idx_character_powers_character_id ON public.character_powers(character_id);


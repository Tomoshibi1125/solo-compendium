-- Sync Database Schema with Application Types (TypeScript Interfaces)
-- Migration to add missing columns to existing tables and create compendium_spells.

-- 1. Characters: Add base_class and core stats
ALTER TABLE public.characters 
  ADD COLUMN IF NOT EXISTS base_class TEXT,
  ADD COLUMN IF NOT EXISTS str INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS agi INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS vit INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS int INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS sense INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS pre INTEGER DEFAULT 10;

COMMENT ON COLUMN public.characters.base_class IS 'The core or base class of the character (e.g. Fighter, Mage)';
COMMENT ON COLUMN public.characters.str IS 'Core strength stat of the character';
COMMENT ON COLUMN public.characters.agi IS 'Core agility stat of the character';
COMMENT ON COLUMN public.characters.vit IS 'Core vitality stat of the character';
COMMENT ON COLUMN public.characters.int IS 'Core intelligence stat of the character';
COMMENT ON COLUMN public.characters.sense IS 'Core sense stat of the character';
COMMENT ON COLUMN public.characters.pre IS 'Core presence stat of the character';

-- 2. Create compendium_spells table
CREATE TABLE IF NOT EXISTS public.compendium_spells (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    spell_level INTEGER,
    school TEXT,
    casting_time TEXT,
    range JSONB,
    components JSONB,
    duration JSONB,
    concentration BOOLEAN DEFAULT FALSE,
    ritual BOOLEAN DEFAULT FALSE,
    spell_type TEXT,
    rank TEXT,
    image TEXT,
    effect TEXT,
    at_higher_levels TEXT,
    classes TEXT[],
    spell_attack JSONB,
    activation JSONB,
    effects JSONB,
    mechanics JSONB,
    limitations JSONB,
    flavor TEXT,
    higher_levels TEXT,
    saving_throw JSONB,
    area JSONB,
    source_book TEXT,
    tags TEXT[] DEFAULT '{}',
    theme_tags TEXT[] DEFAULT '{}'
);

-- Row Level Security (RLS) for compendium_spells
ALTER TABLE public.compendium_spells ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.compendium_spells FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.compendium_spells FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.compendium_spells FOR UPDATE TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS compendium_spells_name_idx ON public.compendium_spells (name);
CREATE INDEX IF NOT EXISTS compendium_spells_level_idx ON public.compendium_spells (spell_level);
CREATE INDEX IF NOT EXISTS compendium_spells_school_idx ON public.compendium_spells (school);

-- 3. Compendium Relics: Add missing fields
ALTER TABLE public.compendium_relics
  ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS image TEXT;

COMMENT ON COLUMN public.compendium_relics.stats IS 'A JSON object mapping stat keys to numerical modifiers (e.g., {"str": 2})';
COMMENT ON COLUMN public.compendium_relics.image IS 'URL to the relic image';

-- 4. Compendium Powers: Add missing image field
ALTER TABLE public.compendium_powers
  ADD COLUMN IF NOT EXISTS image TEXT;

COMMENT ON COLUMN public.compendium_powers.image IS 'URL to the power image';

-- 5. Compendium Feats: Add missing core data fields
ALTER TABLE public.compendium_feats
  ADD COLUMN IF NOT EXISTS prerequisites JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS flavor TEXT,
  ADD COLUMN IF NOT EXISTS image TEXT;

COMMENT ON COLUMN public.compendium_feats.prerequisites IS 'A JSON object defining requirements like level, scores, etc.';
COMMENT ON COLUMN public.compendium_feats.mechanics IS 'A JSON object characterizing mechanical triggers like frequency, ability, dc';
COMMENT ON COLUMN public.compendium_feats.flavor IS 'Flavor text for the feat';
COMMENT ON COLUMN public.compendium_feats.image IS 'URL to the feat image';

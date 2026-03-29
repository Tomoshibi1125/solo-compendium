-- Align Supabase Schema to Local App TypeScript (System Ascendant Lore/Mechanics Override)

-- 1. compendium_spells
ALTER TABLE public.compendium_spells 
  ADD COLUMN IF NOT EXISTS lore TEXT,
  ADD COLUMN IF NOT EXISTS limitations JSONB DEFAULT '{}'::jsonb;

-- 2. compendium_powers
ALTER TABLE public.compendium_powers 
  ADD COLUMN IF NOT EXISTS lore TEXT,
  ADD COLUMN IF NOT EXISTS effects JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS limitations JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS flavor TEXT;

-- 3. compendium_techniques
ALTER TABLE public.compendium_techniques 
  ADD COLUMN IF NOT EXISTS lore TEXT,
  ADD COLUMN IF NOT EXISTS effects JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS limitations JSONB DEFAULT '{}'::jsonb;

-- 4. compendium_feats
ALTER TABLE public.compendium_feats 
  ADD COLUMN IF NOT EXISTS lore TEXT,
  ADD COLUMN IF NOT EXISTS effects JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS limitations JSONB DEFAULT '{}'::jsonb;

-- 5. compendium_relics
ALTER TABLE public.compendium_relics 
  ADD COLUMN IF NOT EXISTS lore TEXT,
  ADD COLUMN IF NOT EXISTS effects JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS limitations JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS flavor TEXT;

-- 6. compendium_monsters
ALTER TABLE public.compendium_monsters 
  ADD COLUMN IF NOT EXISTS lore TEXT,
  ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS flavor TEXT;

-- 7. Items (if there's a compendium_items table, else we skip)
-- Typically items are under equipment or simply not explicitly synchronized unless called compendium_equipment

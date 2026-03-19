-- =============================================
-- SIGILS SYSTEM - SYSTEM ASCENDANT GEAR ENHANCEMENTS
-- =============================================
-- Sigils are magical markers inscribed on gear to provide bonuses
-- =============================================

-- Sigils Compendium Table
CREATE TABLE IF NOT EXISTS public.compendium_sigils (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  effect_description TEXT NOT NULL,
  
  -- Sigil Classification
  rune_type TEXT NOT NULL, -- 'martial', 'caster', 'hybrid', 'utility', 'defensive', 'offensive'
  rune_category TEXT NOT NULL, -- 'weapon', 'armor', 'accessory', 'universal'
  
  -- Level/Power
  rune_level INTEGER NOT NULL DEFAULT 1,
  rarity TEXT NOT NULL DEFAULT 'common',
  effect_type TEXT DEFAULT 'passive', -- 'active', 'passive', 'both'
  
  -- Requirements
  requires_level INTEGER DEFAULT 1,
  
  -- Bonuses
  passive_bonuses JSONB DEFAULT '{}',
  
  -- Integration
  can_inscribe_on TEXT[] DEFAULT ARRAY['weapon', 'armor', 'accessory'],
  inscription_difficulty INTEGER DEFAULT 10,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  image TEXT,
  source_book TEXT DEFAULT 'SL',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.compendium_sigils ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'compendium_sigils'
      AND policyname = 'Compendium sigils are publicly readable'
  ) THEN
    CREATE POLICY "Compendium sigils are publicly readable" 
    ON public.compendium_sigils 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

-- Add updated_at trigger
CREATE TRIGGER update_sigils_updated_at
BEFORE UPDATE ON public.compendium_sigils
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- ITEMS TABLE (Generic items, consumables)
-- =============================================
CREATE TABLE IF NOT EXISTS public.compendium_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  item_type TEXT NOT NULL, -- consumable, material, quest, miscellaneous
  rarity TEXT NOT NULL DEFAULT 'common',
  description TEXT,
  weight NUMERIC DEFAULT 0,
  value INTEGER DEFAULT 0,
  image TEXT,
  source_book TEXT DEFAULT 'SRD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.compendium_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'compendium_items'
      AND policyname = 'Compendium items are publicly readable'
  ) THEN
    CREATE POLICY "Compendium items are publicly readable" 
    ON public.compendium_items 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

-- Add updated_at trigger
CREATE TRIGGER update_items_updated_at
BEFORE UPDATE ON public.compendium_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

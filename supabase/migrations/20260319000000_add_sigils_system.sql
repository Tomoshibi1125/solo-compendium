-- Sigils system: compendium + equipment socketing

-- 1) Compendium table
CREATE TABLE IF NOT EXISTS public.compendium_sigils (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,

  -- Classification
  sigil_type TEXT NOT NULL, -- e.g. 'offensive', 'defensive', etc.
  sigil_category TEXT NOT NULL, -- e.g. 'Combat', 'Defense', etc.

  -- Power
  sigil_level INTEGER NOT NULL DEFAULT 1 CHECK (sigil_level >= 1 AND sigil_level <= 10),
  rarity rarity NOT NULL DEFAULT 'common',

  -- Effect
  effect_type TEXT NOT NULL, -- 'active' | 'passive' | 'both'
  requires_level INTEGER DEFAULT 1,
  passive_bonuses JSONB DEFAULT '{}'::jsonb,

  -- Socketing rules
  can_inscribe_on TEXT[] DEFAULT ARRAY['weapon', 'armor', 'shield', 'accessory'],
  inscription_difficulty INTEGER DEFAULT 10,

  -- Text
  description TEXT NOT NULL,
  effect_description TEXT NOT NULL,

  -- System integration
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  source_book TEXT DEFAULT 'SA',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Add sigil slot metadata to character equipment
ALTER TABLE public.character_equipment
ADD COLUMN IF NOT EXISTS sigil_slots_base INTEGER NOT NULL DEFAULT 0;

-- 3) Sigil inscriptions on character equipment
CREATE TABLE IF NOT EXISTS public.character_sigil_inscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES public.character_equipment(id) ON DELETE CASCADE,
  sigil_id UUID NOT NULL REFERENCES public.compendium_sigils(id) ON DELETE CASCADE,

  -- Which slot this sigil occupies (0-based). Not strictly required, but helps UI.
  slot_index INTEGER NOT NULL DEFAULT 0,

  inscription_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  inscribed_by TEXT,
  inscription_quality INTEGER DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (equipment_id, slot_index)
);

CREATE INDEX IF NOT EXISTS character_sigil_inscriptions_character_idx
  ON public.character_sigil_inscriptions(character_id, equipment_id);

CREATE INDEX IF NOT EXISTS character_sigil_inscriptions_equipment_idx
  ON public.character_sigil_inscriptions(equipment_id);

CREATE INDEX IF NOT EXISTS character_sigil_inscriptions_sigil_idx
  ON public.character_sigil_inscriptions(sigil_id);

-- 4) RLS
ALTER TABLE public.compendium_sigils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_sigil_inscriptions ENABLE ROW LEVEL SECURITY;

-- Public read for sigil compendium
DROP POLICY IF EXISTS "Compendium sigils public read" ON public.compendium_sigils;
CREATE POLICY "Compendium sigils public read" ON public.compendium_sigils
  FOR SELECT USING (true);

-- Character-owned CRUD for inscriptions (mirror character_equipment policies)
DROP POLICY IF EXISTS "Users can view sigil inscriptions of their own characters" ON public.character_sigil_inscriptions;
CREATE POLICY "Users can view sigil inscriptions of their own characters" ON public.character_sigil_inscriptions
  FOR SELECT USING (
    (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = character_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create sigil inscriptions for their own characters" ON public.character_sigil_inscriptions;
CREATE POLICY "Users can create sigil inscriptions for their own characters" ON public.character_sigil_inscriptions
  FOR INSERT WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = character_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update sigil inscriptions of their own characters" ON public.character_sigil_inscriptions;
CREATE POLICY "Users can update sigil inscriptions of their own characters" ON public.character_sigil_inscriptions
  FOR UPDATE USING (
    (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = character_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete sigil inscriptions of their own characters" ON public.character_sigil_inscriptions;
CREATE POLICY "Users can delete sigil inscriptions of their own characters" ON public.character_sigil_inscriptions
  FOR DELETE USING (
    (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = character_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

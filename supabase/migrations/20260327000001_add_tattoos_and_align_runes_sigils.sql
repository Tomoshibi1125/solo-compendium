-- Align Runes, Sigils, and create Tattoos table to match local TypeScript interfaces

-- 1. compendium_sigils: Add lore/flavor/mechanics columns
ALTER TABLE public.compendium_sigils
  ADD COLUMN IF NOT EXISTS lore TEXT,
  ADD COLUMN IF NOT EXISTS flavor TEXT,
  ADD COLUMN IF NOT EXISTS effects JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS limitations JSONB DEFAULT '{}'::jsonb;

-- 2. compendium_runes: Ensure lore/flavor exist
ALTER TABLE public.compendium_runes
  ADD COLUMN IF NOT EXISTS flavor TEXT,
  ADD COLUMN IF NOT EXISTS effects JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS limitations JSONB DEFAULT '{}'::jsonb;

-- 3. Create compendium_tattoos table
CREATE TABLE IF NOT EXISTS public.compendium_tattoos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    rarity TEXT,
    attunement BOOLEAN DEFAULT FALSE,
    body_part TEXT,
    effects JSONB DEFAULT '{}'::jsonb,
    mechanics JSONB DEFAULT '{}'::jsonb,
    limitations JSONB DEFAULT '{}'::jsonb,
    lore TEXT,
    flavor TEXT,
    image TEXT,
    source TEXT DEFAULT 'System Ascendant Canon',
    tags TEXT[] DEFAULT '{}',
    theme_tags TEXT[] DEFAULT '{}'
);

-- Row Level Security (RLS) for compendium_tattoos
ALTER TABLE public.compendium_tattoos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.compendium_tattoos FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.compendium_tattoos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.compendium_tattoos FOR UPDATE TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS compendium_tattoos_name_idx ON public.compendium_tattoos (name);
CREATE INDEX IF NOT EXISTS compendium_tattoos_rarity_idx ON public.compendium_tattoos (rarity);
CREATE INDEX IF NOT EXISTS compendium_tattoos_body_part_idx ON public.compendium_tattoos (body_part);

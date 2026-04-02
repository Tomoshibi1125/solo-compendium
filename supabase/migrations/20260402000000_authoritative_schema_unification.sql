-- === Authoritative Global Parity Schema Fixes ===
-- Objective: Ensure all compendium tables have the 100% parity fields (mechanics, flavor, lore, tags, image_url, display_name)
-- and create the Artifacts and Equipment tables if they are somehow missing or incomplete.

-- 1. Artifacts (Modern)
CREATE TABLE IF NOT EXISTS public.compendium_artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    rarity TEXT NOT NULL DEFAULT 'legendary',
    attunement BOOLEAN DEFAULT false,
    requirements JSONB DEFAULT '{}',
    properties JSONB DEFAULT '{}',
    abilities JSONB DEFAULT '{}',
    lore JSONB DEFAULT '{}',
    mechanics JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    source_book TEXT DEFAULT 'System Ascendant Canon',
    image_url TEXT,
    display_name TEXT
);

-- 2. Equipment (Ensure modern columns)
CREATE TABLE IF NOT EXISTS public.compendium_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    equipment_type TEXT NOT NULL,
    rarity TEXT NOT NULL DEFAULT 'Common',
    attunement BOOLEAN DEFAULT false,
    properties JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{}',
    effects JSONB DEFAULT '{}',
    limitations JSONB DEFAULT '{}',
    cost_credits INTEGER DEFAULT 0,
    weight FLOAT DEFAULT 0,
    mechanics JSONB DEFAULT '{}',
    flavor TEXT,
    lore JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure item_type exists for backward compatibility if needed, but equipment_type is authoritative
ALTER TABLE public.compendium_equipment ADD COLUMN IF NOT EXISTS equipment_type TEXT;

-- 3. Monsters (Ensure parity)
ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS flavor TEXT;
ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS lore JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'D';
ALTER TABLE public.compendium_monsters ADD COLUMN IF NOT EXISTS is_boss BOOLEAN DEFAULT false;

-- 4. Spells
ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS flavor TEXT;
ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS lore JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.compendium_spells ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'D';

-- 5. Jobs & Paths
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS flavor TEXT;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS lore JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_jobs ADD COLUMN IF NOT EXISTS display_name TEXT;

ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS flavor TEXT;
ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS lore JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.compendium_paths ADD COLUMN IF NOT EXISTS display_name TEXT;

-- 6. All other tables to match Base Fields
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT table_name 
             FROM information_schema.tables 
             WHERE table_schema = 'public' AND table_name LIKE 'compendium_%'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT ''{}''::jsonb', t);
        EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS flavor TEXT', t);
        EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS lore JSONB DEFAULT ''{}''::jsonb', t);
        EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ''{}''', t);
        EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS image_url TEXT', t);
        EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS display_name TEXT', t);
    END LOOP;
END $$;

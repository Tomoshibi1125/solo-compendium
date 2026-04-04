-- Terminology purge: Rename compendium_monsters to compendium_Anomalies
-- And add compendium_pantheon table for Eternal/Exarch data

BEGIN;

-- 1. Full rename: compendium_monsters -> compendium_Anomalies
-- We use "compendium_Anomalies" with a capital A for exact matching with types and sync script expectations.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'compendium_monsters') THEN
        ALTER TABLE public.compendium_monsters RENAME TO "compendium_Anomalies";
    END IF;
END $$;

-- 2. Create compendium_pantheon table
CREATE TABLE IF NOT EXISTS public.compendium_pantheon (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_name TEXT,
    rank TEXT,
    directive TEXT,
    portfolio TEXT[] DEFAULT '{}',
    sigil TEXT,
    manifestation TEXT,
    specializations TEXT[] DEFAULT '{}',
    description TEXT,
    lore TEXT,
    dogma TEXT[] DEFAULT '{}',
    worshippers TEXT,
    temples TEXT,
    home_realm TEXT,
    relationships JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for pantheon
ALTER TABLE public.compendium_pantheon ENABLE ROW LEVEL SECURITY;

-- Check if policy exists before creating to avoid errors on reapplied migrations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'compendium_pantheon' 
        AND policyname = 'Allow public read access to compendium_pantheon'
    ) THEN
        CREATE POLICY "Allow public read access to compendium_pantheon"
            ON public.compendium_pantheon FOR SELECT
            USING (true);
    END IF;
END $$;

COMMIT;

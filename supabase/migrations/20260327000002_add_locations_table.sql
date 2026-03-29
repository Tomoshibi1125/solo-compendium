-- Add the missing locations table for the compendium sync.

CREATE TABLE IF NOT EXISTS public.compendium_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT,
    mechanics JSONB,
    flavor TEXT,
    lore TEXT,
    tags TEXT[] DEFAULT '{}',
    source_book TEXT,
    image TEXT
);

-- Row Level Security (RLS)
ALTER TABLE public.compendium_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.compendium_locations FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.compendium_locations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.compendium_locations FOR UPDATE TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS compendium_locations_name_idx ON public.compendium_locations (name);

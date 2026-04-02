-- Migration: Add missing compendium tables for orphaned files
-- Creates `compendium_tattoos` and ensures all fields for other tables are up to date.

CREATE TABLE IF NOT EXISTS public.compendium_tattoos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    display_name text,
    image_url text,
    flavor text,
    lore text,
    source_book text,
    tags text[],
    system_interaction text,
    mechanics jsonb,
    rarity text,
    attunement boolean DEFAULT false,
    body_part text,
    effects jsonb,
    limitations jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compendium_tattoos ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated and anon users
CREATE POLICY "Allow public read access to compendium_tattoos"
    ON public.compendium_tattoos
    FOR SELECT
    USING (true);

-- Allow service role full access
CREATE POLICY "Allow service_role full access to compendium_tattoos"
    ON public.compendium_tattoos
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Track changes
CREATE TRIGGER set_compendium_tattoos_updated_at
    BEFORE UPDATE ON public.compendium_tattoos
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

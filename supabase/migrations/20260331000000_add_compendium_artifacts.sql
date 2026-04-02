-- Add the missing artifacts table for the compendium sync.
-- God-tier items and legendary artifacts with unique ability structures.

CREATE TABLE IF NOT EXISTS public.compendium_artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- weapon, armor, accessory, consumable, tool, relic
    rarity TEXT NOT NULL DEFAULT 'legendary', -- legendary, mythic, divine
    attunement BOOLEAN DEFAULT false,
    
    -- Hierarchical/Complex metadata
    requirements JSONB DEFAULT '{}',
    properties JSONB DEFAULT '{}',
    abilities JSONB DEFAULT '{}', -- primary, secondary, tertiary, ultimate mappings
    lore JSONB DEFAULT '{}',
    mechanics JSONB DEFAULT '{}',
    
    tags TEXT[] DEFAULT '{}',
    source_book TEXT DEFAULT 'System Ascendant Canon',
    image_url TEXT,
    
    CONSTRAINT compendium_artifacts_name_unique UNIQUE (name)
);

-- Row Level Security (RLS)
ALTER TABLE public.compendium_artifacts ENABLE ROW LEVEL SECURITY;

-- Note: In a production "Zero Legacy" environment, we typically have a single "read all" policy
-- for compendium tables to ensure the VTT and Character Sheet have full access.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.compendium_artifacts;
CREATE POLICY "Enable read access for all users" ON public.compendium_artifacts FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS compendium_artifacts_name_idx ON public.compendium_artifacts (name);
CREATE INDEX IF NOT EXISTS compendium_artifacts_type_idx ON public.compendium_artifacts (type);
CREATE INDEX IF NOT EXISTS compendium_artifacts_rarity_idx ON public.compendium_artifacts (rarity);

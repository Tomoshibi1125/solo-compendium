CREATE TABLE IF NOT EXISTS public.character_extras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    monster_id UUID REFERENCES public.compendium_monsters(id) ON DELETE SET NULL,
    extra_type TEXT NOT NULL, -- 'familiar', 'companion', 'mount', 'wildshape', 'sidekick'
    name TEXT NOT NULL,
    hp_current INTEGER NOT NULL DEFAULT 0,
    hp_max INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.character_extras ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
CREATE POLICY "Users can manage their own character extras"
    ON public.character_extras
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.characters
            WHERE characters.id = character_extras.character_id
            AND characters.user_id = auth.uid()
        )
    );

-- Add updated_at trigger
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.character_extras
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add Indexes
CREATE INDEX IF NOT EXISTS idx_character_extras_character_id ON public.character_extras(character_id);

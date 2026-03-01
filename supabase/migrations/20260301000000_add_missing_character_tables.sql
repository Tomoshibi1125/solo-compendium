-- Migration to add missing character_regents and character_active_spells tables

-- 1. character_regents
CREATE TABLE IF NOT EXISTS public.character_regents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    regent_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for character_regents
ALTER TABLE public.character_regents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view regents for characters they own or are in a shared campaign
CREATE POLICY "Users can view character regents"
    ON public.character_regents
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.characters c
            WHERE c.id = character_regents.character_id
            AND (
                c.user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.campaign_character_shares ccs
                    WHERE ccs.character_id = c.id
                )
            )
        )
    );

-- Policy: Users can insert regents for characters they own
CREATE POLICY "Users can insert character regents for own characters"
    ON public.character_regents
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.characters c
            WHERE c.id = character_regents.character_id
            AND c.user_id = auth.uid()
        )
    );

-- Policy: Users can update regents for characters they own
CREATE POLICY "Users can update character regents for own characters"
    ON public.character_regents
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.characters c
            WHERE c.id = character_regents.character_id
            AND c.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.characters c
            WHERE c.id = character_regents.character_id
            AND c.user_id = auth.uid()
        )
    );

-- Policy: Users can delete regents for characters they own
CREATE POLICY "Users can delete character regents for own characters"
    ON public.character_regents
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.characters c
            WHERE c.id = character_regents.character_id
            AND c.user_id = auth.uid()
        )
    );

-- Add indexes for character_regents
CREATE INDEX IF NOT EXISTS character_regents_character_id_idx ON public.character_regents(character_id);

-- 2. character_active_spells
CREATE TABLE IF NOT EXISTS public.character_active_spells (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    spell_id TEXT NOT NULL,
    spell_name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    concentration BOOLEAN NOT NULL DEFAULT false,
    duration_type TEXT,
    duration_value INTEGER,
    effects JSONB[] DEFAULT '{}'::JSONB[],
    cast_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for character_active_spells
ALTER TABLE public.character_active_spells ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view active spells for characters they own or are in a shared campaign
CREATE POLICY "Users can view character active spells"
    ON public.character_active_spells
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.characters c
            WHERE c.id = character_active_spells.character_id
            AND (
                c.user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.campaign_character_shares ccs
                    WHERE ccs.character_id = c.id
                )
            )
        )
    );

-- Policy: Users can insert active spells for characters they own
CREATE POLICY "Users can insert character active spells for own characters"
    ON public.character_active_spells
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.characters c
            WHERE c.id = character_active_spells.character_id
            AND c.user_id = auth.uid()
        )
    );

-- Policy: Users can update active spells for characters they own
CREATE POLICY "Users can update character active spells for own characters"
    ON public.character_active_spells
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.characters c
            WHERE c.id = character_active_spells.character_id
            AND c.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.characters c
            WHERE c.id = character_active_spells.character_id
            AND c.user_id = auth.uid()
        )
    );

-- Policy: Users can delete active spells for characters they own
CREATE POLICY "Users can delete character active spells for own characters"
    ON public.character_active_spells
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.characters c
            WHERE c.id = character_active_spells.character_id
            AND c.user_id = auth.uid()
        )
    );

-- Add indexes for character_active_spells
CREATE INDEX IF NOT EXISTS idx_character_active_spells_character_id ON public.character_active_spells(character_id);

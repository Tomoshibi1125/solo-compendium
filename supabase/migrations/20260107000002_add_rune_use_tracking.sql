-- Add rune use tracking to character_rune_inscriptions
-- This migration adds fields to track current and maximum uses for runes

-- Add uses_current and uses_max fields
ALTER TABLE public.character_rune_inscriptions
ADD COLUMN IF NOT EXISTS uses_current INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS uses_max INTEGER DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN public.character_rune_inscriptions.uses_current IS 'Current uses remaining before recharge (resets on rest based on recharge type)';
COMMENT ON COLUMN public.character_rune_inscriptions.uses_max IS 'Maximum uses per rest period (calculated from rune.uses_per_rest when inscribed or on first rest)';

-- Initialize uses_max for existing inscriptions based on their rune's uses_per_rest
-- This function will be called when resetting uses
-- For now, we'll set a default and let the application handle initialization

-- Update existing inscriptions to have uses_max = 0 (will be calculated on next rest)
UPDATE public.character_rune_inscriptions
SET uses_max = 0, uses_current = 0
WHERE uses_max IS NULL OR uses_max = 0;


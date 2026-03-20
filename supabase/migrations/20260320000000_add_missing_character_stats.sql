-- Migration to add missing core D&D 5e character statistics for 100% data fidelity
-- Adds dedicated columns for death saves, senses, and defenses (resistances/immunities)

ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS death_save_successes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS death_save_failures INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS stable BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS senses TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS resistances TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS immunities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS vulnerabilities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS condition_immunities TEXT[] DEFAULT '{}';

-- Add comment for clarity
COMMENT ON COLUMN public.characters.death_save_successes IS 'Count of successful death saving throws (0-3)';
COMMENT ON COLUMN public.characters.death_save_failures IS 'Count of failed death saving throws (0-3)';
COMMENT ON COLUMN public.characters.stable IS 'Whether the character is currently stable at 0 HP';
COMMENT ON COLUMN public.characters.senses IS 'Array of special senses (e.g., ["Darkvision 60ft", "Blindsight 30ft"])';
COMMENT ON COLUMN public.characters.resistances IS 'Array of damage types the character is resistant to';
COMMENT ON COLUMN public.characters.immunities IS 'Array of damage types the character is immune to';
COMMENT ON COLUMN public.characters.vulnerabilities IS 'Array of damage types the character is vulnerable to';
COMMENT ON COLUMN public.characters.condition_immunities IS 'Array of conditions the character is immune to';

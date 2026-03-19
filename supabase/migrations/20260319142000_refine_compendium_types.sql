-- Migration: Refine Compendium Types
-- Date: 2026-03-19

-- Add image column to compendium_runes if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='compendium_runes' AND column_name='image') THEN
        ALTER TABLE compendium_runes ADD COLUMN image TEXT;
    END IF;
END $$;

-- Add missing columns to compendium_powers to support combat actions
ALTER TABLE compendium_powers 
ADD COLUMN IF NOT EXISTS power_type TEXT DEFAULT 'Power',
ADD COLUMN IF NOT EXISTS activation_time TEXT,
ADD COLUMN IF NOT EXISTS target TEXT,
ADD COLUMN IF NOT EXISTS has_attack_roll BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_save BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS save_ability TEXT,
ADD COLUMN IF NOT EXISTS damage_roll TEXT,
ADD COLUMN IF NOT EXISTS damage_type TEXT,
ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '{}'::jsonb;

-- Ensure requires_attunement is in compendium_relics (fixing potential type sync issues)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='compendium_relics' AND column_name='requires_attunement') THEN
        ALTER TABLE compendium_relics ADD COLUMN requires_attunement BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

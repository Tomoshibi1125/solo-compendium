-- Migration: Add advanced inventory fields

ALTER TABLE character_equipment
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ignore_contents_weight BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_modifiers JSONB DEFAULT NULL;

-- Ensure is_container is defined if it was missed previously
ALTER TABLE character_equipment
ADD COLUMN IF NOT EXISTS is_container BOOLEAN DEFAULT false;

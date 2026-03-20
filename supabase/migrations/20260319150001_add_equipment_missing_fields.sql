-- Add missing columns to compendium_equipment for type alignment
ALTER TABLE IF EXISTS public.compendium_equipment 
ADD COLUMN IF NOT EXISTS requires_attunement BOOLEAN DEFAULT FALSE;

-- Add other common fields if missing (based on static data and type requirements)
ALTER TABLE IF EXISTS public.compendium_equipment
ADD COLUMN IF NOT EXISTS cost_credits INTEGER,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add rarity column to compendium_equipment
ALTER TABLE public.compendium_equipment ADD COLUMN IF NOT EXISTS rarity public.rarity DEFAULT 'common'::public.rarity;

-- Update existing equipment to have appropriate rarity if possible, or leave as 'common'
-- (Optional: logic to map equipment_type to rarity if needed, but 'common' is a safe default)

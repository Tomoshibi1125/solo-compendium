-- Add display_order column to character_equipment and character_powers
-- This allows users to customize the order of items in their lists

ALTER TABLE public.character_equipment
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.character_powers
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.character_features
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_character_equipment_display_order 
ON public.character_equipment(character_id, display_order);
CREATE INDEX IF NOT EXISTS idx_character_powers_display_order 
ON public.character_powers(character_id, display_order);
CREATE INDEX IF NOT EXISTS idx_character_features_display_order 
ON public.character_features(character_id, display_order);
-- Initialize display_order for existing records
-- Equipment: order by item_type, then name
UPDATE public.character_equipment
SET display_order = sub.row_num
FROM (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY character_id ORDER BY item_type, name) as row_num
  FROM public.character_equipment
) sub
WHERE public.character_equipment.id = sub.id;
-- Powers: order by power_level, then name
UPDATE public.character_powers
SET display_order = sub.row_num
FROM (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY character_id ORDER BY power_level, name) as row_num
  FROM public.character_powers
) sub
WHERE public.character_powers.id = sub.id;
-- Features: order by level_acquired, then name
UPDATE public.character_features
SET display_order = sub.row_num
FROM (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY character_id ORDER BY level_acquired, name) as row_num
  FROM public.character_features
) sub
WHERE public.character_features.id = sub.id;

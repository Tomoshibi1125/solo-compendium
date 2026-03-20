-- Add active_feature column to compendium_sigils
ALTER TABLE public.compendium_sigils 
ADD COLUMN IF NOT EXISTS active_feature JSONB DEFAULT NULL;

-- Add sigil_slots_base column to compendium_equipment
ALTER TABLE public.compendium_equipment 
ADD COLUMN IF NOT EXISTS sigil_slots_base INTEGER DEFAULT 0;

-- Comment on columns for documentation
COMMENT ON COLUMN public.compendium_sigils.active_feature IS 'Structured data for active abilities granted by the sigil';
COMMENT ON COLUMN public.compendium_equipment.sigil_slots_base IS 'Base number of sigil slots this equipment provides';

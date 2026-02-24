-- Fix unindexed foreign key on character_techniques
-- Adds covering index for character_techniques_technique_id_fkey to improve query performance

CREATE INDEX IF NOT EXISTS idx_character_techniques_character_id_technique_id 
ON public.character_techniques (character_id, technique_id);

-- Add index on technique_id alone for foreign key constraint performance
CREATE INDEX IF NOT EXISTS idx_character_techniques_technique_id 
ON public.character_techniques (technique_id);

COMMENT ON INDEX idx_character_techniques_character_id_technique_id IS 'Covering index for character techniques queries including foreign key performance';
COMMENT ON INDEX idx_character_techniques_technique_id IS 'Foreign key performance index for technique_id';

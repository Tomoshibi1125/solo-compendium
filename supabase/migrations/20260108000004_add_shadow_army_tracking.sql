-- Add Shadow Energy and Shadow Army tracking to characters
-- This allows characters to track their shadow energy resource and summoned shadows

-- Add shadow energy fields to characters table
ALTER TABLE public.characters
ADD COLUMN IF NOT EXISTS shadow_energy_current INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS shadow_energy_max INTEGER NOT NULL DEFAULT 0;
-- Create shadow army table (tracks summoned shadows for a character)
CREATE TABLE IF NOT EXISTS public.character_shadow_army (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  shadow_soldier_id UUID NOT NULL REFERENCES public.compendium_shadow_soldiers(id) ON DELETE CASCADE,
  
  -- Instance tracking
  instance_name TEXT, -- Optional custom name for this instance
  hp_current INTEGER, -- Current HP of this shadow instance
  hp_max INTEGER, -- Max HP of this shadow instance
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true, -- Is this shadow currently summoned?
  is_dismissed BOOLEAN NOT NULL DEFAULT false, -- Has this shadow been dismissed?
  
  -- Metadata
  summoned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  dismissed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique active shadows per character (based on max_summoned)
  UNIQUE (character_id, shadow_soldier_id, instance_name)
);
-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_character_shadow_army_character ON public.character_shadow_army(character_id);
CREATE INDEX IF NOT EXISTS idx_character_shadow_army_active ON public.character_shadow_army(character_id, is_active) WHERE is_active = true;
-- Enable RLS
ALTER TABLE public.character_shadow_army ENABLE ROW LEVEL SECURITY;
-- RLS Policies
CREATE POLICY "Users can view their own shadow army" ON public.character_shadow_army
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_shadow_army.character_id
      AND characters.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert their own shadow army" ON public.character_shadow_army
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_shadow_army.character_id
      AND characters.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update their own shadow army" ON public.character_shadow_army
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_shadow_army.character_id
      AND characters.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete their own shadow army" ON public.character_shadow_army
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_shadow_army.character_id
      AND characters.user_id = auth.uid()
    )
  );
-- Function to calculate shadow energy max based on level
-- Shadow Monarchs gain shadow energy as they level up
CREATE OR REPLACE FUNCTION calculate_shadow_energy_max(character_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Shadow energy scales with level
  -- Level 1-4: 10 max
  -- Level 5-8: 25 max
  -- Level 9-12: 50 max
  -- Level 13-16: 100 max
  -- Level 17-20: 200 max
  RETURN CASE
    WHEN character_level <= 4 THEN 10
    WHEN character_level <= 8 THEN 25
    WHEN character_level <= 12 THEN 50
    WHEN character_level <= 16 THEN 100
    ELSE 200
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

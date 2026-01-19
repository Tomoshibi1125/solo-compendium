-- Spell Slot Tracking System
-- Tracks spell slots per level for each character

CREATE TABLE IF NOT EXISTS public.character_spell_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  spell_level INTEGER NOT NULL CHECK (spell_level >= 1 AND spell_level <= 9),
  slots_max INTEGER NOT NULL DEFAULT 0,
  slots_current INTEGER NOT NULL DEFAULT 0,
  slots_recovered_on_short_rest INTEGER NOT NULL DEFAULT 0,
  slots_recovered_on_long_rest INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(character_id, spell_level)
);
-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_character_spell_slots_character_id ON public.character_spell_slots(character_id);
-- Enable RLS
ALTER TABLE public.character_spell_slots ENABLE ROW LEVEL SECURITY;
-- RLS Policies
CREATE POLICY "Users can view their own character spell slots"
  ON public.character_spell_slots FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.characters 
    WHERE characters.id = character_spell_slots.character_id 
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can insert their own character spell slots"
  ON public.character_spell_slots FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.characters 
    WHERE characters.id = character_spell_slots.character_id 
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can update their own character spell slots"
  ON public.character_spell_slots FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.characters 
    WHERE characters.id = character_spell_slots.character_id 
    AND characters.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete their own character spell slots"
  ON public.character_spell_slots FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.characters 
    WHERE characters.id = character_spell_slots.character_id 
    AND characters.user_id = auth.uid()
  ));
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_character_spell_slots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger to auto-update updated_at
CREATE TRIGGER update_character_spell_slots_updated_at
  BEFORE UPDATE ON public.character_spell_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_character_spell_slots_updated_at();

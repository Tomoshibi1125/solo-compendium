-- Create character_sheet_state table for persistent sheet resources and custom modifiers
CREATE TABLE IF NOT EXISTS public.character_sheet_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  resources JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_modifiers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (character_id)
);

CREATE INDEX IF NOT EXISTS idx_character_sheet_state_character_id
  ON public.character_sheet_state(character_id);

ALTER TABLE public.character_sheet_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sheet state"
  ON public.character_sheet_state
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_sheet_state.character_id
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own sheet state"
  ON public.character_sheet_state
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_sheet_state.character_id
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own sheet state"
  ON public.character_sheet_state
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_sheet_state.character_id
      AND characters.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_sheet_state.character_id
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own sheet state"
  ON public.character_sheet_state
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.characters
      WHERE characters.id = character_sheet_state.character_id
      AND characters.user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION update_character_sheet_state_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_character_sheet_state_updated_at
  BEFORE UPDATE ON public.character_sheet_state
  FOR EACH ROW
  EXECUTE FUNCTION update_character_sheet_state_updated_at();

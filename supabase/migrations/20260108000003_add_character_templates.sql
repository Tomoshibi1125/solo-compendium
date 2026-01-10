-- Create character_templates table for saving and sharing character templates
CREATE TABLE IF NOT EXISTS public.character_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  character_data JSONB NOT NULL, -- Stores character configuration as JSON
  is_public BOOLEAN NOT NULL DEFAULT false,
  share_code TEXT UNIQUE, -- For sharing public templates
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for public templates
CREATE INDEX IF NOT EXISTS idx_character_templates_public ON public.character_templates(is_public, created_at DESC) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_character_templates_user ON public.character_templates(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_character_templates_share_code ON public.character_templates(share_code) WHERE share_code IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.character_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own templates
CREATE POLICY "Users can view own templates"
  ON public.character_templates
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view public templates
CREATE POLICY "Anyone can view public templates"
  ON public.character_templates
  FOR SELECT
  USING (is_public = true);

-- Users can insert their own templates
CREATE POLICY "Users can insert own templates"
  ON public.character_templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own templates
CREATE POLICY "Users can update own templates"
  ON public.character_templates
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates"
  ON public.character_templates
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_character_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_character_templates_updated_at
  BEFORE UPDATE ON public.character_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_character_templates_updated_at();


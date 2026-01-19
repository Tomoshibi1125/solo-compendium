-- Add user favorites system for compendium entries
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('jobs', 'paths', 'powers', 'relics', 'monsters', 'backgrounds', 'conditions', 'monarchs', 'feats', 'skills', 'equipment')),
  entry_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one favorite per user per entry
  UNIQUE (user_id, entry_type, entry_id)
);
-- Index for quick lookups
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_entry ON public.user_favorites(entry_type, entry_id);
-- Enable RLS
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
-- RLS Policies: Users can only see/modify their own favorites
CREATE POLICY "Users can view their own favorites"
  ON public.user_favorites
  FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites"
  ON public.user_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites"
  ON public.user_favorites
  FOR DELETE
  USING (auth.uid() = user_id);
COMMENT ON TABLE public.user_favorites IS 'User bookmarks/favorites for compendium entries';

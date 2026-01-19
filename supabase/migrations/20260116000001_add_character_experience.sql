-- Add experience tracking to characters for progression and quest rewards
ALTER TABLE public.characters
ADD COLUMN IF NOT EXISTS experience INTEGER NOT NULL DEFAULT 0;

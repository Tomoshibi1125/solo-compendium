-- Allow favorites to store non-UUID compendium entry IDs.
ALTER TABLE public.user_favorites
  ALTER COLUMN entry_id TYPE TEXT
  USING entry_id::text;

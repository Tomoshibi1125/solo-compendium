-- Add unique constraint to the locations table for the UPSERT constraint
ALTER TABLE public.compendium_locations ADD CONSTRAINT compendium_locations_name_key UNIQUE (name);

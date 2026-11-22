-- Character owners already have row policies for these stores. Restore table
-- privileges so approved catch-up picks can be persisted through the API.
BEGIN;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_powers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_techniques TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_spells TO authenticated;
COMMIT;

-- Per-user character constraints:
--   * at most 6 characters per user (enforced by a BEFORE INSERT trigger);
--   * every character of a user must have a unique name (case-insensitive unique index).
-- App-side guards mirror these for friendly errors; these are the authoritative backstops.

-- 1. Max 6 characters per user.
CREATE OR REPLACE FUNCTION public.enforce_character_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.user_id IS NOT NULL
     AND (SELECT COUNT(*) FROM public.characters WHERE user_id = NEW.user_id) >= 6 THEN
    RAISE EXCEPTION 'Character limit reached: a user may have at most 6 characters'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_character_limit_trigger ON public.characters;
CREATE TRIGGER enforce_character_limit_trigger
  BEFORE INSERT ON public.characters
  FOR EACH ROW EXECUTE FUNCTION public.enforce_character_limit();

-- 2. Unique character name per user (case-insensitive). Pre-existing duplicate names
--    (if any) must be renamed before this migration can apply.
CREATE UNIQUE INDEX IF NOT EXISTS characters_unique_name_per_user
  ON public.characters(user_id, lower(name));

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

-- 2. Unique character name per user (case-insensitive).
-- 2a. First heal any pre-existing case-insensitive duplicates so the unique
--     index below can be created. Keep the lowest-id row's name; append
--     " (2)", " (3)", ... to later duplicates within the same (user, lower(name)).
WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY user_id, lower(name)
      ORDER BY id
    ) AS rn
  FROM public.characters
  WHERE user_id IS NOT NULL
)
UPDATE public.characters c
SET name = c.name || ' (' || r.rn || ')'
FROM ranked r
WHERE c.id = r.id
  AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS characters_unique_name_per_user
  ON public.characters(user_id, lower(name));

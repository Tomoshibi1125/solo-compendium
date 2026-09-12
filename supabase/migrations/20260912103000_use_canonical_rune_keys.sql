-- The canonical compendium is static TypeScript data.  Its rune ids are
-- stable text keys (for example `rune-spell-fireball`), not UUIDs from the
-- legacy compendium_runes table.  Persist the canonical key instead of
-- attempting to put it into the legacy UUID foreign key.

BEGIN;

ALTER TABLE public.character_rune_knowledge
  ADD COLUMN IF NOT EXISTS rune_key TEXT;

ALTER TABLE public.character_rune_knowledge
  ALTER COLUMN rune_id DROP NOT NULL;

ALTER TABLE public.character_rune_knowledge
  DROP CONSTRAINT IF EXISTS character_rune_knowledge_character_id_rune_key_key;

ALTER TABLE public.character_rune_knowledge
  ADD CONSTRAINT character_rune_knowledge_character_id_rune_key_key
  UNIQUE (character_id, rune_key);

CREATE INDEX IF NOT EXISTS idx_character_rune_knowledge_rune_key
  ON public.character_rune_knowledge (rune_key)
  WHERE rune_key IS NOT NULL;

-- Existing UUID-backed rows are intentionally retained.  They remain
-- readable as legacy records while the client uses rune_key for all new
-- canonical rune knowledge.  Do not manufacture a text key from a UUID: it
-- would make an unrecoverable row look like a valid canonical rune.

ALTER TABLE public.character_rune_inscriptions
  ADD COLUMN IF NOT EXISTS rune_key TEXT;

ALTER TABLE public.character_rune_inscriptions
  ALTER COLUMN rune_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_character_rune_inscriptions_rune_key
  ON public.character_rune_inscriptions (rune_key)
  WHERE rune_key IS NOT NULL;

-- A discover operation is owner-checked and idempotent.  This avoids relying
-- on a client-side upsert against two incompatible identity systems and makes
-- the result available to the UI before it reports success.
CREATE OR REPLACE FUNCTION public.discover_character_rune(
  p_character_id UUID,
  p_rune_key TEXT,
  p_is_mastered BOOLEAN DEFAULT FALSE,
  p_learned_from TEXT DEFAULT 'discovered'
)
RETURNS public.character_rune_knowledge
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_knowledge public.character_rune_knowledge;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication is required to discover a rune'
      USING ERRCODE = '28000';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.characters
    WHERE id = p_character_id
      AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'You do not own this character'
      USING ERRCODE = '42501';
  END IF;

  IF p_rune_key IS NULL OR p_rune_key !~ '^rune-[a-z0-9]+(?:-[a-z0-9]+)*$' THEN
    RAISE EXCEPTION 'Invalid canonical rune key'
      USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.character_rune_knowledge (
    character_id,
    rune_id,
    rune_key,
    mastery_level,
    can_teach,
    learned_from
  ) VALUES (
    p_character_id,
    NULL,
    p_rune_key,
    CASE WHEN p_is_mastered THEN 5 ELSE 1 END,
    p_is_mastered,
    p_learned_from
  )
  ON CONFLICT (character_id, rune_key) DO UPDATE
  SET mastery_level = GREATEST(
        character_rune_knowledge.mastery_level,
        EXCLUDED.mastery_level
      ),
      can_teach = character_rune_knowledge.can_teach OR EXCLUDED.can_teach,
      learned_from = COALESCE(
        character_rune_knowledge.learned_from,
        EXCLUDED.learned_from
      )
  RETURNING * INTO v_knowledge;

  RETURN v_knowledge;
END;
$$;

REVOKE ALL ON FUNCTION public.discover_character_rune(UUID, TEXT, BOOLEAN, TEXT)
  FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.discover_character_rune(UUID, TEXT, BOOLEAN, TEXT)
  TO authenticated;

COMMIT;

NOTIFY pgrst, 'reload schema';

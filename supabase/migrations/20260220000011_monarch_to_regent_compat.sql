-- Regent migration (backwards-compatible): Monarch system reworked into Regents
-- We keep old monarch tables/columns for compatibility but introduce canonical regent tables/columns.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'compendium_regents'
  ) THEN
    CREATE TABLE public.compendium_regents (LIKE public.compendium_monarchs INCLUDING ALL);
    INSERT INTO public.compendium_regents SELECT * FROM public.compendium_monarchs;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'compendium_regent_features'
  ) THEN
    CREATE TABLE public.compendium_regent_features (LIKE public.compendium_monarch_features INCLUDING ALL);

    -- Rename FK column for regents
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'compendium_regent_features'
        AND column_name = 'monarch_id'
    ) THEN
      ALTER TABLE public.compendium_regent_features RENAME COLUMN monarch_id TO regent_id;
    END IF;

    INSERT INTO public.compendium_regent_features
    SELECT
      f.id,
      f.monarch_id AS regent_id,
      f.name,
      f.description,
      f.level,
      f.is_signature,
      f.action_type,
      f.uses_formula,
      f.recharge,
      f.prerequisites,
      f.created_at,
      f.display_name,
      f.aliases,
      f.generated_reason,
      f.license_note,
      f.source_kind,
      f.source_name,
      f.theme_tags
    FROM public.compendium_monarch_features f;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'character_regent_unlocks'
  ) THEN
    CREATE TABLE public.character_regent_unlocks (LIKE public.character_monarch_unlocks INCLUDING ALL);

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'character_regent_unlocks'
        AND column_name = 'monarch_id'
    ) THEN
      ALTER TABLE public.character_regent_unlocks RENAME COLUMN monarch_id TO regent_id;
    END IF;

    INSERT INTO public.character_regent_unlocks
    SELECT
      u.id,
      u.character_id,
      u.monarch_id AS regent_id,
      u.unlocked_at,
      u.quest_name,
      u.dm_notes,
      u.is_primary
    FROM public.character_monarch_unlocks u;
  END IF;

  -- Characters: add regent_overlays and backfill from monarch_overlays
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'characters'
      AND column_name = 'regent_overlays'
  ) THEN
    ALTER TABLE public.characters ADD COLUMN regent_overlays UUID[] DEFAULT '{}';

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'characters'
        AND column_name = 'monarch_overlays'
    ) THEN
      UPDATE public.characters
      SET regent_overlays = COALESCE(regent_overlays, monarch_overlays)
      WHERE (regent_overlays IS NULL OR regent_overlays = '{}')
        AND monarch_overlays IS NOT NULL;
    END IF;
  END IF;
END $$;

-- Power eligibility arrays: canonicalize to regent_names
ALTER TABLE public.compendium_powers
ADD COLUMN IF NOT EXISTS regent_names TEXT[] DEFAULT '{}';

UPDATE public.compendium_powers
SET regent_names = COALESCE(regent_names, '{}') || COALESCE(monarch_names, '{}')
WHERE (regent_names IS NULL OR regent_names = '{}')
  AND monarch_names IS NOT NULL
  AND monarch_names <> '{}';

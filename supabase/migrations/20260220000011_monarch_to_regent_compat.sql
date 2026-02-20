-- Regent migration (backwards-compatible): Monarch system reworked into Regents
-- We keep old monarch tables/columns for compatibility but introduce canonical regent tables/columns.
-- All data-copy operations use EXECUTE to defer type checking to runtime.

DO $$
BEGIN
  -- 1. compendium_regents (mirror of compendium_monarchs)
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='compendium_regents') THEN
    CREATE TABLE public.compendium_regents (LIKE public.compendium_monarchs INCLUDING ALL);
    EXECUTE 'INSERT INTO public.compendium_regents SELECT * FROM public.compendium_monarchs';
  END IF;

  -- 2. compendium_regent_features (mirror of compendium_monarch_features, FK renamed)
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='compendium_regent_features') THEN
    CREATE TABLE public.compendium_regent_features (LIKE public.compendium_monarch_features INCLUDING ALL);
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='compendium_regent_features' AND column_name='monarch_id') THEN
      ALTER TABLE public.compendium_regent_features RENAME COLUMN monarch_id TO regent_id;
    END IF;
    EXECUTE 'INSERT INTO public.compendium_regent_features SELECT * FROM public.compendium_monarch_features';
  END IF;

  -- 3. character_regent_unlocks (mirror of character_monarch_unlocks, FK renamed)
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='character_regent_unlocks') THEN
    CREATE TABLE public.character_regent_unlocks (LIKE public.character_monarch_unlocks INCLUDING ALL);
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='character_regent_unlocks' AND column_name='monarch_id') THEN
      ALTER TABLE public.character_regent_unlocks RENAME COLUMN monarch_id TO regent_id;
    END IF;
    EXECUTE 'INSERT INTO public.character_regent_unlocks SELECT * FROM public.character_monarch_unlocks';
  END IF;

  -- 4. Characters: add regent_overlays column and backfill from monarch_overlays
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='characters' AND column_name='regent_overlays') THEN
    ALTER TABLE public.characters ADD COLUMN regent_overlays UUID[] DEFAULT '{}';
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='characters' AND column_name='monarch_overlays') THEN
      EXECUTE 'UPDATE public.characters SET regent_overlays = COALESCE(regent_overlays, monarch_overlays) WHERE (regent_overlays IS NULL OR regent_overlays = ''{}'') AND monarch_overlays IS NOT NULL';
    END IF;
  END IF;
END $$;

-- Power eligibility arrays: canonicalize to regent_names
ALTER TABLE public.compendium_powers
ADD COLUMN IF NOT EXISTS regent_names TEXT[] DEFAULT '{}';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='compendium_powers' AND column_name='monarch_names') THEN
    EXECUTE 'UPDATE public.compendium_powers SET regent_names = COALESCE(regent_names, ''{}'') || COALESCE(monarch_names, ''{}'') WHERE (regent_names IS NULL OR regent_names = ''{}'') AND monarch_names IS NOT NULL AND monarch_names <> ''{}''';
  END IF;
END $$;

-- Task 8: canonical Regent unlock workflow and database/type boundary.
--
-- The legacy compatibility migration cloned UUID-backed Monarch columns. This
-- migration preserves those UUID values verbatim, introduces the canonical
-- text identity boundary, makes unlocks the sole authority for projections,
-- and moves all player mutations behind actor-bound transactional RPCs.
--
-- Historical UUIDs are deliberately NOT resolved through names or catalog
-- rows. Any incompatible data is reported before constraints or policies are
-- changed so an operator can remediate it explicitly.

BEGIN;

-- Keep the preflight and schema cutover stable while application traffic is
-- active. These locks block writes but continue to allow ordinary reads.
LOCK TABLE public.character_regent_unlock_grants IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.characters IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.character_regent_unlocks IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.character_regents IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.saved_sovereigns IN SHARE ROW EXCLUSIVE MODE;

-- ---------------------------------------------------------------------------
-- 1. Preserve the UUID identity and introduce the canonical text boundary
-- ---------------------------------------------------------------------------

DO $migration$
DECLARE
  v_regent_type TEXT;
  v_legacy_type TEXT;
BEGIN
  SELECT column_row.udt_name
  INTO v_regent_type
  FROM information_schema.columns AS column_row
  WHERE column_row.table_schema = 'public'
    AND column_row.table_name = 'character_regent_unlocks'
    AND column_row.column_name = 'regent_id';

  SELECT column_row.udt_name
  INTO v_legacy_type
  FROM information_schema.columns AS column_row
  WHERE column_row.table_schema = 'public'
    AND column_row.table_name = 'character_regent_unlocks'
    AND column_row.column_name = 'legacy_regent_uuid';

  IF v_legacy_type IS NULL THEN
    IF v_regent_type IS DISTINCT FROM 'uuid' THEN
      RAISE EXCEPTION
        'TASK8_SCHEMA_CONFLICT: expected character_regent_unlocks.regent_id to be uuid, found %',
        COALESCE(v_regent_type, '<missing>')
        USING ERRCODE = 'P0001';
    END IF;

    ALTER TABLE public.character_regent_unlocks
      RENAME COLUMN regent_id TO legacy_regent_uuid;
  ELSIF v_legacy_type <> 'uuid' THEN
    RAISE EXCEPTION
      'TASK8_SCHEMA_CONFLICT: character_regent_unlocks.legacy_regent_uuid must be uuid, found %',
      v_legacy_type
      USING ERRCODE = 'P0001';
  ELSIF v_regent_type IS NOT NULL AND v_regent_type <> 'text' THEN
    RAISE EXCEPTION
      'TASK8_SCHEMA_CONFLICT: canonical character_regent_unlocks.regent_id must be text, found %',
      v_regent_type
      USING ERRCODE = 'P0001';
  END IF;

  ALTER TABLE public.character_regent_unlocks
    ALTER COLUMN legacy_regent_uuid DROP NOT NULL;

  ALTER TABLE public.character_regent_unlocks
    ADD COLUMN IF NOT EXISTS regent_id TEXT;

  SELECT column_row.udt_name
  INTO v_regent_type
  FROM information_schema.columns AS column_row
  WHERE column_row.table_schema = 'public'
    AND column_row.table_name = 'character_regent_unlocks'
    AND column_row.column_name = 'regent_id';

  IF v_regent_type <> 'text' THEN
    RAISE EXCEPTION
      'TASK8_SCHEMA_CONFLICT: canonical character_regent_unlocks.regent_id must be text, found %',
      COALESCE(v_regent_type, '<missing>')
      USING ERRCODE = 'P0001';
  END IF;
END;
$migration$;

ALTER TABLE public.saved_sovereigns
  ADD COLUMN IF NOT EXISTS regent_a_id TEXT,
  ADD COLUMN IF NOT EXISTS regent_b_id TEXT;

-- New canonical Sovereigns no longer need placeholder UUIDs. Existing UUIDs,
-- indexes, and Monarch foreign keys remain intact and are never rewritten.
ALTER TABLE public.saved_sovereigns
  ALTER COLUMN monarch_a_id DROP NOT NULL,
  ALTER COLUMN monarch_b_id DROP NOT NULL;

-- Projection storage must already be safely text-capable before any trigger can
-- synchronize canonical IDs into it. The earlier Regent-grant migration performs
-- the only supported uuid[] -> text[] conversion around user_characters.
DO $migration$
DECLARE
  v_overlay_type TEXT;
  v_projection_type TEXT;
  v_saved_a_type TEXT;
  v_saved_b_type TEXT;
  v_monarch_a_type TEXT;
  v_monarch_b_type TEXT;
BEGIN
  SELECT column_row.udt_name
  INTO v_overlay_type
  FROM information_schema.columns AS column_row
  WHERE column_row.table_schema = 'public'
    AND column_row.table_name = 'characters'
    AND column_row.column_name = 'regent_overlays';

  SELECT column_row.udt_name
  INTO v_projection_type
  FROM information_schema.columns AS column_row
  WHERE column_row.table_schema = 'public'
    AND column_row.table_name = 'character_regents'
    AND column_row.column_name = 'regent_id';

  SELECT column_row.udt_name
  INTO v_saved_a_type
  FROM information_schema.columns AS column_row
  WHERE column_row.table_schema = 'public'
    AND column_row.table_name = 'saved_sovereigns'
    AND column_row.column_name = 'regent_a_id';

  SELECT column_row.udt_name
  INTO v_saved_b_type
  FROM information_schema.columns AS column_row
  WHERE column_row.table_schema = 'public'
    AND column_row.table_name = 'saved_sovereigns'
    AND column_row.column_name = 'regent_b_id';

  SELECT column_row.udt_name
  INTO v_monarch_a_type
  FROM information_schema.columns AS column_row
  WHERE column_row.table_schema = 'public'
    AND column_row.table_name = 'saved_sovereigns'
    AND column_row.column_name = 'monarch_a_id';

  SELECT column_row.udt_name
  INTO v_monarch_b_type
  FROM information_schema.columns AS column_row
  WHERE column_row.table_schema = 'public'
    AND column_row.table_name = 'saved_sovereigns'
    AND column_row.column_name = 'monarch_b_id';

  IF v_overlay_type IS DISTINCT FROM '_text' THEN
    RAISE EXCEPTION
      'TASK8_SCHEMA_CONFLICT: characters.regent_overlays must be text[], found %',
      COALESCE(v_overlay_type, '<missing>')
      USING ERRCODE = 'P0001';
  END IF;

  IF v_projection_type IS DISTINCT FROM 'text' THEN
    RAISE EXCEPTION
      'TASK8_SCHEMA_CONFLICT: character_regents.regent_id must be text, found %',
      COALESCE(v_projection_type, '<missing>')
      USING ERRCODE = 'P0001';
  END IF;

  IF v_saved_a_type IS DISTINCT FROM 'text'
     OR v_saved_b_type IS DISTINCT FROM 'text' THEN
    RAISE EXCEPTION
      'TASK8_SCHEMA_CONFLICT: saved_sovereigns canonical Regent columns must be text'
      USING ERRCODE = 'P0001';
  END IF;

  IF v_monarch_a_type IS DISTINCT FROM 'uuid'
     OR v_monarch_b_type IS DISTINCT FROM 'uuid' THEN
    RAISE EXCEPTION
      'TASK8_SCHEMA_CONFLICT: saved_sovereigns legacy Monarch columns must remain uuid'
      USING ERRCODE = 'P0001';
  END IF;
END;
$migration$;

-- ---------------------------------------------------------------------------
-- 2. Fail closed on conflicts; never infer, delete, merge, or reassign data
-- ---------------------------------------------------------------------------

DO $preflight$
DECLARE
  v_conflict TEXT;
  v_allowed CONSTANT TEXT[] := ARRAY[
    'umbral_regent',
    'radiant_regent',
    'steel_regent',
    'destruction_regent',
    'war_regent',
    'frost_regent',
    'beast_regent',
    'plague_regent',
    'spatial_regent',
    'mimic_regent',
    'blood_regent',
    'gravity_regent'
  ]::TEXT[];
BEGIN
  SELECT format('unlock %s has neither or both Regent identities', unlock_row.id)
  INTO v_conflict
  FROM public.character_regent_unlocks AS unlock_row
  WHERE num_nonnulls(unlock_row.legacy_regent_uuid, unlock_row.regent_id) <> 1
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format('unlock %s has unsupported canonical id %s', unlock_row.id, unlock_row.regent_id)
  INTO v_conflict
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.regent_id IS NOT NULL
    AND NOT (unlock_row.regent_id = ANY (v_allowed))
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format('unlock %s references missing character %s', unlock_row.id, unlock_row.character_id)
  INTO v_conflict
  FROM public.character_regent_unlocks AS unlock_row
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.characters AS character_row
    WHERE character_row.id = unlock_row.character_id
  )
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format(
    'unlock %s has legacy Regent UUID %s absent from compendium_regents',
    unlock_row.id,
    unlock_row.legacy_regent_uuid
  )
  INTO v_conflict
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.legacy_regent_uuid IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.compendium_regents AS regent_row
      WHERE regent_row.id = unlock_row.legacy_regent_uuid
    )
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format(
    'character %s has %s unlocks (maximum is two)',
    grouped.character_id,
    grouped.unlock_count
  )
  INTO v_conflict
  FROM (
    SELECT unlock_row.character_id, count(*) AS unlock_count
    FROM public.character_regent_unlocks AS unlock_row
    GROUP BY unlock_row.character_id
    HAVING count(*) > 2
  ) AS grouped
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format(
    'character %s has duplicate canonical Regent %s',
    grouped.character_id,
    grouped.regent_id
  )
  INTO v_conflict
  FROM (
    SELECT unlock_row.character_id, unlock_row.regent_id
    FROM public.character_regent_unlocks AS unlock_row
    WHERE unlock_row.regent_id IS NOT NULL
    GROUP BY unlock_row.character_id, unlock_row.regent_id
    HAVING count(*) > 1
  ) AS grouped
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format(
    'character %s has %s primary Regents across %s unlocks (exactly one is required)',
    grouped.character_id,
    grouped.primary_count,
    grouped.unlock_count
  )
  INTO v_conflict
  FROM (
    SELECT
      unlock_row.character_id,
      count(*) AS unlock_count,
      count(*) FILTER (WHERE unlock_row.is_primary) AS primary_count
    FROM public.character_regent_unlocks AS unlock_row
    GROUP BY unlock_row.character_id
    HAVING count(*) FILTER (WHERE unlock_row.is_primary) <> 1
  ) AS grouped
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format(
    'unlock %s has caught_up_at_level %s outside 1..20',
    unlock_row.id,
    unlock_row.caught_up_at_level
  )
  INTO v_conflict
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.caught_up_at_level IS NOT NULL
    AND unlock_row.caught_up_at_level NOT BETWEEN 1 AND 20
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format('grant %s has an incoherent consumed timestamp/backlink pair', grant_row.id)
  INTO v_conflict
  FROM public.character_regent_unlock_grants AS grant_row
  WHERE (grant_row.consumed_at IS NULL) <> (grant_row.consumed_unlock_id IS NULL)
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format(
    'unlock %s is referenced by more than one consumed grant',
    grouped.consumed_unlock_id
  )
  INTO v_conflict
  FROM (
    SELECT grant_row.consumed_unlock_id
    FROM public.character_regent_unlock_grants AS grant_row
    WHERE grant_row.consumed_unlock_id IS NOT NULL
    GROUP BY grant_row.consumed_unlock_id
    HAVING count(*) > 1
  ) AS grouped
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format(
    'grant %s backlink %s is missing or belongs to another character',
    grant_row.id,
    grant_row.consumed_unlock_id
  )
  INTO v_conflict
  FROM public.character_regent_unlock_grants AS grant_row
  WHERE grant_row.consumed_unlock_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.character_regent_unlocks AS unlock_row
      WHERE unlock_row.id = grant_row.consumed_unlock_id
        AND unlock_row.character_id = grant_row.character_id
    )
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format('character %s has an invalid Regent overlay value', character_row.id)
  INTO v_conflict
  FROM public.characters AS character_row
  WHERE EXISTS (
    SELECT 1
    FROM unnest(COALESCE(character_row.regent_overlays, ARRAY[]::TEXT[])) AS overlay(regent_id)
    WHERE overlay.regent_id IS NULL
       OR NOT (overlay.regent_id = ANY (v_allowed))
  )
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_PROJECTION_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format('character %s has duplicate Regent overlays', character_row.id)
  INTO v_conflict
  FROM public.characters AS character_row
  WHERE cardinality(COALESCE(character_row.regent_overlays, ARRAY[]::TEXT[])) <>
    (
      SELECT count(DISTINCT overlay.regent_id)
      FROM unnest(COALESCE(character_row.regent_overlays, ARRAY[]::TEXT[])) AS overlay(regent_id)
    )
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_PROJECTION_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format('character %s Regent overlays do not match canonical unlock authority', character_row.id)
  INTO v_conflict
  FROM public.characters AS character_row
  WHERE ARRAY(
      SELECT overlay.regent_id
      FROM unnest(COALESCE(character_row.regent_overlays, ARRAY[]::TEXT[])) AS overlay(regent_id)
      ORDER BY overlay.regent_id
    ) IS DISTINCT FROM ARRAY(
      SELECT unlock_row.regent_id
      FROM public.character_regent_unlocks AS unlock_row
      WHERE unlock_row.character_id = character_row.id
        AND unlock_row.regent_id IS NOT NULL
      ORDER BY unlock_row.regent_id
    )
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_PROJECTION_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format('character_regents row %s has unsupported canonical id %s', projection_row.id, projection_row.regent_id)
  INTO v_conflict
  FROM public.character_regents AS projection_row
  WHERE NOT (projection_row.regent_id = ANY (v_allowed))
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_PROJECTION_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format(
    'character %s has duplicate character_regents projection %s',
    grouped.character_id,
    grouped.regent_id
  )
  INTO v_conflict
  FROM (
    SELECT projection_row.character_id, projection_row.regent_id
    FROM public.character_regents AS projection_row
    GROUP BY projection_row.character_id, projection_row.regent_id
    HAVING count(*) > 1
  ) AS grouped
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_PROJECTION_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT conflict.character_id::TEXT
  INTO v_conflict
  FROM (
    (
      SELECT projection_row.character_id, projection_row.regent_id
      FROM public.character_regents AS projection_row
      EXCEPT
      SELECT unlock_row.character_id, unlock_row.regent_id
      FROM public.character_regent_unlocks AS unlock_row
      WHERE unlock_row.regent_id IS NOT NULL
    )

    UNION ALL

    (
      SELECT unlock_row.character_id, unlock_row.regent_id
      FROM public.character_regent_unlocks AS unlock_row
      WHERE unlock_row.regent_id IS NOT NULL
      EXCEPT
      SELECT projection_row.character_id, projection_row.regent_id
      FROM public.character_regents AS projection_row
    )
  ) AS conflict
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION
      'TASK8_PROJECTION_CONFLICT: character % character_regents rows do not match canonical unlock authority',
      v_conflict
      USING ERRCODE = 'P0001';
  END IF;

  SELECT format('saved Sovereign %s has an unsupported canonical Regent id', sovereign_row.id)
  INTO v_conflict
  FROM public.saved_sovereigns AS sovereign_row
  WHERE (sovereign_row.regent_a_id IS NOT NULL AND NOT (sovereign_row.regent_a_id = ANY (v_allowed)))
     OR (sovereign_row.regent_b_id IS NOT NULL AND NOT (sovereign_row.regent_b_id = ANY (v_allowed)))
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format('saved Sovereign %s has an incomplete or self-paired canonical Regent pair', sovereign_row.id)
  INTO v_conflict
  FROM public.saved_sovereigns AS sovereign_row
  WHERE (sovereign_row.regent_a_id IS NULL) <> (sovereign_row.regent_b_id IS NULL)
     OR (
       sovereign_row.regent_a_id IS NOT NULL
       AND sovereign_row.regent_a_id = sovereign_row.regent_b_id
     )
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format('saved Sovereign %s has an incomplete legacy Monarch pair', sovereign_row.id)
  INTO v_conflict
  FROM public.saved_sovereigns AS sovereign_row
  WHERE (sovereign_row.monarch_a_id IS NULL) <> (sovereign_row.monarch_b_id IS NULL)
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;

  SELECT format('saved Sovereign %s has no canonical or legacy Regent pair', sovereign_row.id)
  INTO v_conflict
  FROM public.saved_sovereigns AS sovereign_row
  WHERE sovereign_row.regent_a_id IS NULL
    AND sovereign_row.monarch_a_id IS NULL
  LIMIT 1;
  IF v_conflict IS NOT NULL THEN
    RAISE EXCEPTION 'TASK8_DATA_CONFLICT: %', v_conflict USING ERRCODE = 'P0001';
  END IF;
END;
$preflight$;

-- ---------------------------------------------------------------------------
-- 3. Declarative invariants and defensive foreign-key reconstruction
-- ---------------------------------------------------------------------------

ALTER TABLE public.character_regent_unlocks
  DROP CONSTRAINT IF EXISTS character_regent_unlocks_identity_check,
  DROP CONSTRAINT IF EXISTS character_regent_unlocks_canonical_id_check,
  DROP CONSTRAINT IF EXISTS character_regent_unlocks_caught_up_level_check;

ALTER TABLE public.character_regent_unlocks
  ADD CONSTRAINT character_regent_unlocks_identity_check
    CHECK (num_nonnulls(legacy_regent_uuid, regent_id) = 1),
  ADD CONSTRAINT character_regent_unlocks_canonical_id_check
    CHECK (
      regent_id IS NULL
      OR regent_id = ANY (ARRAY[
        'umbral_regent', 'radiant_regent', 'steel_regent',
        'destruction_regent', 'war_regent', 'frost_regent',
        'beast_regent', 'plague_regent', 'spatial_regent',
        'mimic_regent', 'blood_regent', 'gravity_regent'
      ]::TEXT[])
    ),
  ADD CONSTRAINT character_regent_unlocks_caught_up_level_check
    CHECK (caught_up_at_level IS NULL OR caught_up_at_level BETWEEN 1 AND 20);

CREATE UNIQUE INDEX IF NOT EXISTS character_regent_unlocks_character_regent_key
  ON public.character_regent_unlocks(character_id, regent_id);

CREATE UNIQUE INDEX IF NOT EXISTS character_regent_unlocks_id_character_key
  ON public.character_regent_unlocks(id, character_id);

CREATE UNIQUE INDEX IF NOT EXISTS character_regent_unlocks_one_primary_key
  ON public.character_regent_unlocks(character_id)
  WHERE is_primary;

ALTER TABLE public.character_regent_unlock_grants
  DROP CONSTRAINT IF EXISTS character_regent_unlock_grants_consumed_pair_check;

ALTER TABLE public.character_regent_unlock_grants
  ADD CONSTRAINT character_regent_unlock_grants_consumed_pair_check
    CHECK ((consumed_at IS NULL) = (consumed_unlock_id IS NULL));

CREATE UNIQUE INDEX IF NOT EXISTS character_regent_unlock_grants_consumed_unlock_key
  ON public.character_regent_unlock_grants(consumed_unlock_id)
  WHERE consumed_unlock_id IS NOT NULL;

ALTER TABLE public.character_regents
  DROP CONSTRAINT IF EXISTS character_regents_canonical_id_check;

ALTER TABLE public.character_regents
  ADD CONSTRAINT character_regents_canonical_id_check
    CHECK (
      regent_id = ANY (ARRAY[
        'umbral_regent', 'radiant_regent', 'steel_regent',
        'destruction_regent', 'war_regent', 'frost_regent',
        'beast_regent', 'plague_regent', 'spatial_regent',
        'mimic_regent', 'blood_regent', 'gravity_regent'
      ]::TEXT[])
    );

CREATE UNIQUE INDEX IF NOT EXISTS character_regents_character_regent_key
  ON public.character_regents(character_id, regent_id);

ALTER TABLE public.characters
  DROP CONSTRAINT IF EXISTS characters_regent_overlays_canonical_check;

ALTER TABLE public.characters
  ADD CONSTRAINT characters_regent_overlays_canonical_check
    CHECK (
      regent_overlays IS NULL
      OR (
        array_position(regent_overlays, NULL::TEXT) IS NULL
        AND regent_overlays <@ ARRAY[
          'umbral_regent', 'radiant_regent', 'steel_regent',
          'destruction_regent', 'war_regent', 'frost_regent',
          'beast_regent', 'plague_regent', 'spatial_regent',
          'mimic_regent', 'blood_regent', 'gravity_regent'
        ]::TEXT[]
      )
    );

ALTER TABLE public.saved_sovereigns
  DROP CONSTRAINT IF EXISTS saved_sovereigns_canonical_regent_a_check,
  DROP CONSTRAINT IF EXISTS saved_sovereigns_canonical_regent_b_check,
  DROP CONSTRAINT IF EXISTS saved_sovereigns_regent_pair_check;

ALTER TABLE public.saved_sovereigns
  ADD CONSTRAINT saved_sovereigns_canonical_regent_a_check
    CHECK (
      regent_a_id IS NULL
      OR regent_a_id = ANY (ARRAY[
        'umbral_regent', 'radiant_regent', 'steel_regent',
        'destruction_regent', 'war_regent', 'frost_regent',
        'beast_regent', 'plague_regent', 'spatial_regent',
        'mimic_regent', 'blood_regent', 'gravity_regent'
      ]::TEXT[])
    ),
  ADD CONSTRAINT saved_sovereigns_canonical_regent_b_check
    CHECK (
      regent_b_id IS NULL
      OR regent_b_id = ANY (ARRAY[
        'umbral_regent', 'radiant_regent', 'steel_regent',
        'destruction_regent', 'war_regent', 'frost_regent',
        'beast_regent', 'plague_regent', 'spatial_regent',
        'mimic_regent', 'blood_regent', 'gravity_regent'
      ]::TEXT[])
    ),
  ADD CONSTRAINT saved_sovereigns_regent_pair_check
    CHECK (
      (regent_a_id IS NULL) = (regent_b_id IS NULL)
      AND (monarch_a_id IS NULL) = (monarch_b_id IS NULL)
      AND (regent_a_id IS NOT NULL OR monarch_a_id IS NOT NULL)
      AND (regent_a_id IS NULL OR regent_a_id <> regent_b_id)
    );

CREATE INDEX IF NOT EXISTS idx_saved_sovereigns_regent_a_id
  ON public.saved_sovereigns(regent_a_id)
  WHERE regent_a_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_saved_sovereigns_regent_b_id
  ON public.saved_sovereigns(regent_b_id)
  WHERE regent_b_id IS NOT NULL;

-- LIKE INCLUDING ALL did not copy the source foreign keys. Reconstruct the
-- intended relationships by column identity rather than assuming historical
-- constraint names. Existing equivalent/drifted constraints are replaced.
DO $foreign_keys$
DECLARE
  constraint_row RECORD;
BEGIN
  FOR constraint_row IN
    SELECT constraint_def.oid, constraint_def.conname
    FROM pg_constraint AS constraint_def
    WHERE constraint_def.conrelid = 'public.character_regent_unlocks'::REGCLASS
      AND constraint_def.contype = 'f'
      AND EXISTS (
        SELECT 1
        FROM unnest(constraint_def.conkey) AS key_column(attnum)
        JOIN pg_attribute AS attribute_row
          ON attribute_row.attrelid = constraint_def.conrelid
         AND attribute_row.attnum = key_column.attnum
        WHERE attribute_row.attname IN ('character_id', 'legacy_regent_uuid')
      )
  LOOP
    EXECUTE format(
      'ALTER TABLE public.character_regent_unlocks DROP CONSTRAINT %I',
      constraint_row.conname
    );
  END LOOP;

  ALTER TABLE public.character_regent_unlocks
    ADD CONSTRAINT character_regent_unlocks_character_id_fkey
      FOREIGN KEY (character_id)
      REFERENCES public.characters(id)
      ON DELETE CASCADE,
    ADD CONSTRAINT character_regent_unlocks_legacy_regent_uuid_fkey
      FOREIGN KEY (legacy_regent_uuid)
      REFERENCES public.compendium_regents(id)
      ON DELETE RESTRICT;

  FOR constraint_row IN
    SELECT constraint_def.oid, constraint_def.conname
    FROM pg_constraint AS constraint_def
    WHERE constraint_def.conrelid = 'public.character_regent_unlock_grants'::REGCLASS
      AND constraint_def.contype = 'f'
      AND EXISTS (
        SELECT 1
        FROM unnest(constraint_def.conkey) AS key_column(attnum)
        JOIN pg_attribute AS attribute_row
          ON attribute_row.attrelid = constraint_def.conrelid
         AND attribute_row.attnum = key_column.attnum
        WHERE attribute_row.attname = 'consumed_unlock_id'
      )
  LOOP
    EXECUTE format(
      'ALTER TABLE public.character_regent_unlock_grants DROP CONSTRAINT %I',
      constraint_row.conname
    );
  END LOOP;

  ALTER TABLE public.character_regent_unlock_grants
    ADD CONSTRAINT character_regent_unlock_grants_consumed_unlock_fkey
      FOREIGN KEY (consumed_unlock_id, character_id)
      REFERENCES public.character_regent_unlocks(id, character_id)
      ON DELETE RESTRICT;

  FOR constraint_row IN
    SELECT constraint_def.oid, constraint_def.conname
    FROM pg_constraint AS constraint_def
    WHERE constraint_def.conrelid = 'public.character_regents'::REGCLASS
      AND constraint_def.contype = 'f'
      AND EXISTS (
        SELECT 1
        FROM unnest(constraint_def.conkey) AS key_column(attnum)
        JOIN pg_attribute AS attribute_row
          ON attribute_row.attrelid = constraint_def.conrelid
         AND attribute_row.attnum = key_column.attnum
        WHERE attribute_row.attname = 'regent_id'
      )
  LOOP
    EXECUTE format(
      'ALTER TABLE public.character_regents DROP CONSTRAINT %I',
      constraint_row.conname
    );
  END LOOP;

  ALTER TABLE public.character_regents
    ADD CONSTRAINT character_regents_unlock_projection_fkey
      FOREIGN KEY (character_id, regent_id)
      REFERENCES public.character_regent_unlocks(character_id, regent_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE;
END;
$foreign_keys$;

-- ---------------------------------------------------------------------------
-- 4. Concurrency limit and authoritative transactional projections
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app_private.enforce_character_regent_unlock_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_existing_count INTEGER;
BEGIN
  -- The parent-row lock serializes every insert/move for one character. A plain
  -- count/check trigger without this lock would allow concurrent third unlocks.
  PERFORM 1
  FROM public.characters AS character_row
  WHERE character_row.id = NEW.character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT count(*)
  INTO v_existing_count
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.character_id = NEW.character_id
    AND unlock_row.id IS DISTINCT FROM NEW.id;

  IF v_existing_count >= 2 THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_LIMIT_REACHED' USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

-- A partial unique index enforces at most one primary. This deferred final-state
-- check enforces the matching lower bound while allowing set/remove RPCs to
-- transition through zero primary rows inside one transaction.
CREATE OR REPLACE FUNCTION app_private.enforce_character_regent_primary()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_character_ids UUID[];
  v_character_id UUID;
  v_unlock_count INTEGER;
  v_primary_count INTEGER;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_character_ids := ARRAY[NEW.character_id];
  ELSIF TG_OP = 'DELETE' THEN
    v_character_ids := ARRAY[OLD.character_id];
  ELSE
    v_character_ids := ARRAY[OLD.character_id, NEW.character_id];
  END IF;

  FOREACH v_character_id IN ARRAY v_character_ids
  LOOP
    CONTINUE WHEN v_character_id IS NULL;

    SELECT
      count(*),
      count(*) FILTER (WHERE unlock_row.is_primary)
    INTO v_unlock_count, v_primary_count
    FROM public.character_regent_unlocks AS unlock_row
    WHERE unlock_row.character_id = v_character_id;

    IF v_unlock_count > 0 AND v_primary_count <> 1 THEN
      RAISE EXCEPTION 'REGENT_PRIMARY_REQUIRED' USING ERRCODE = '23514';
    END IF;
  END LOOP;

  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.sync_character_regent_projection(
  p_character_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_expected TEXT[];
BEGIN
  SELECT COALESCE(
    array_agg(
      unlock_row.regent_id
      ORDER BY unlock_row.is_primary DESC, unlock_row.unlocked_at, unlock_row.id
    ),
    ARRAY[]::TEXT[]
  )
  INTO v_expected
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.character_id = p_character_id
    AND unlock_row.regent_id IS NOT NULL;

  UPDATE public.characters AS character_row
  SET regent_overlays = v_expected
  WHERE character_row.id = p_character_id
    AND COALESCE(character_row.regent_overlays, ARRAY[]::TEXT[])
        IS DISTINCT FROM v_expected;

  DELETE FROM public.character_regents AS projection_row
  WHERE projection_row.character_id = p_character_id
    AND NOT EXISTS (
      SELECT 1
      FROM public.character_regent_unlocks AS unlock_row
      WHERE unlock_row.character_id = projection_row.character_id
        AND unlock_row.regent_id = projection_row.regent_id
    );

  INSERT INTO public.character_regents (character_id, regent_id)
  SELECT unlock_row.character_id, unlock_row.regent_id
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.character_id = p_character_id
    AND unlock_row.regent_id IS NOT NULL
  ON CONFLICT (character_id, regent_id) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.sync_character_regent_projection_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM app_private.sync_character_regent_projection(OLD.character_id);
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.character_id IS DISTINCT FROM NEW.character_id THEN
      PERFORM app_private.sync_character_regent_projection(OLD.character_id);
    END IF;
    PERFORM app_private.sync_character_regent_projection(NEW.character_id);
  ELSE
    PERFORM app_private.sync_character_regent_projection(NEW.character_id);
  END IF;

  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION app_private.enforce_character_regent_overlay_projection()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_expected TEXT[];
BEGIN
  SELECT COALESCE(
    array_agg(
      unlock_row.regent_id
      ORDER BY unlock_row.is_primary DESC, unlock_row.unlocked_at, unlock_row.id
    ),
    ARRAY[]::TEXT[]
  )
  INTO v_expected
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.character_id = NEW.id
    AND unlock_row.regent_id IS NOT NULL;

  IF COALESCE(NEW.regent_overlays, ARRAY[]::TEXT[]) IS DISTINCT FROM v_expected THEN
    RAISE EXCEPTION 'REGENT_OVERLAY_IS_DERIVED' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION app_private.enforce_character_regent_unlock_limit()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.enforce_character_regent_primary()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.sync_character_regent_projection(UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.sync_character_regent_projection_trigger()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.enforce_character_regent_overlay_projection()
  FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS enforce_character_regent_unlock_limit
  ON public.character_regent_unlocks;
CREATE TRIGGER enforce_character_regent_unlock_limit
  BEFORE INSERT OR UPDATE OF character_id
  ON public.character_regent_unlocks
  FOR EACH ROW
  EXECUTE FUNCTION app_private.enforce_character_regent_unlock_limit();

DROP TRIGGER IF EXISTS enforce_character_regent_primary
  ON public.character_regent_unlocks;
CREATE CONSTRAINT TRIGGER enforce_character_regent_primary
  AFTER INSERT OR UPDATE OR DELETE
  ON public.character_regent_unlocks
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW
  EXECUTE FUNCTION app_private.enforce_character_regent_primary();

DROP TRIGGER IF EXISTS sync_character_regent_projection
  ON public.character_regent_unlocks;
CREATE TRIGGER sync_character_regent_projection
  AFTER INSERT OR UPDATE OR DELETE
  ON public.character_regent_unlocks
  FOR EACH ROW
  EXECUTE FUNCTION app_private.sync_character_regent_projection_trigger();

DROP TRIGGER IF EXISTS enforce_character_regent_overlay_projection
  ON public.characters;
CREATE TRIGGER enforce_character_regent_overlay_projection
  BEFORE INSERT OR UPDATE OF regent_overlays
  ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION app_private.enforce_character_regent_overlay_projection();

-- Projection rows are trigger-maintained. Authenticated users may read them but
-- cannot create a second source of truth.
DO $policies$
DECLARE
  policy_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT policy_def.policyname
    FROM pg_policies AS policy_def
    WHERE policy_def.schemaname = 'public'
      AND policy_def.tablename = 'character_regents'
      AND policy_def.cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.character_regents',
      policy_row.policyname
    );
  END LOOP;
END;
$policies$;

-- ---------------------------------------------------------------------------
-- 5. RLS cutover: reads and Warden credits remain direct; mutations use RPCs
-- ---------------------------------------------------------------------------

ALTER TABLE public.character_regent_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_regent_unlock_grants ENABLE ROW LEVEL SECURITY;

DO $policies$
DECLARE
  policy_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT policy_def.policyname
    FROM pg_policies AS policy_def
    WHERE policy_def.schemaname = 'public'
      AND policy_def.tablename = 'character_regent_unlocks'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.character_regent_unlocks',
      policy_row.policyname
    );
  END LOOP;

  FOR policy_row IN
    SELECT policy_def.policyname
    FROM pg_policies AS policy_def
    WHERE policy_def.schemaname = 'public'
      AND policy_def.tablename = 'character_regent_unlock_grants'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.character_regent_unlock_grants',
      policy_row.policyname
    );
  END LOOP;
END;
$policies$;

CREATE POLICY regent_unlocks_select
  ON public.character_regent_unlocks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.characters AS character_row
      WHERE character_row.id = character_regent_unlocks.character_id
        AND character_row.user_id = (SELECT auth.uid())
    )
    OR EXISTS (
      SELECT 1
      FROM (
        SELECT member_row.campaign_id
        FROM public.campaign_members AS member_row
        WHERE member_row.character_id = character_regent_unlocks.character_id
        UNION
        SELECT link_row.campaign_id
        FROM public.campaign_member_characters AS link_row
        WHERE link_row.character_id = character_regent_unlocks.character_id
        UNION
        SELECT share_row.campaign_id
        FROM public.campaign_character_shares AS share_row
        WHERE share_row.character_id = character_regent_unlocks.character_id
      ) AS linked_campaign
      WHERE public.is_campaign_system(
        linked_campaign.campaign_id,
        (SELECT auth.uid())
      )
    )
  );

CREATE POLICY regent_unlock_grants_select
  ON public.character_regent_unlock_grants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.characters AS character_row
      WHERE character_row.id = character_regent_unlock_grants.character_id
        AND character_row.user_id = (SELECT auth.uid())
    )
    OR EXISTS (
      SELECT 1
      FROM (
        SELECT member_row.campaign_id
        FROM public.campaign_members AS member_row
        WHERE member_row.character_id = character_regent_unlock_grants.character_id
        UNION
        SELECT link_row.campaign_id
        FROM public.campaign_member_characters AS link_row
        WHERE link_row.character_id = character_regent_unlock_grants.character_id
        UNION
        SELECT share_row.campaign_id
        FROM public.campaign_character_shares AS share_row
        WHERE share_row.character_id = character_regent_unlock_grants.character_id
      ) AS linked_campaign
      WHERE public.is_campaign_system(
        linked_campaign.campaign_id,
        (SELECT auth.uid())
      )
    )
  );

CREATE POLICY regent_unlock_grants_insert
  ON public.character_regent_unlock_grants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    consumed_at IS NULL
    AND consumed_unlock_id IS NULL
    AND (granted_by IS NULL OR granted_by = (SELECT auth.uid()))
    AND EXISTS (
      SELECT 1
      FROM (
        SELECT member_row.campaign_id
        FROM public.campaign_members AS member_row
        WHERE member_row.character_id = character_regent_unlock_grants.character_id
        UNION
        SELECT link_row.campaign_id
        FROM public.campaign_member_characters AS link_row
        WHERE link_row.character_id = character_regent_unlock_grants.character_id
        UNION
        SELECT share_row.campaign_id
        FROM public.campaign_character_shares AS share_row
        WHERE share_row.character_id = character_regent_unlock_grants.character_id
      ) AS linked_campaign
      WHERE public.is_campaign_system(
        linked_campaign.campaign_id,
        (SELECT auth.uid())
      )
    )
  );

CREATE POLICY regent_unlock_grants_delete
  ON public.character_regent_unlock_grants
  FOR DELETE
  TO authenticated
  USING (
    consumed_at IS NULL
    AND EXISTS (
      SELECT 1
      FROM (
        SELECT member_row.campaign_id
        FROM public.campaign_members AS member_row
        WHERE member_row.character_id = character_regent_unlock_grants.character_id
        UNION
        SELECT link_row.campaign_id
        FROM public.campaign_member_characters AS link_row
        WHERE link_row.character_id = character_regent_unlock_grants.character_id
        UNION
        SELECT share_row.campaign_id
        FROM public.campaign_character_shares AS share_row
        WHERE share_row.character_id = character_regent_unlock_grants.character_id
      ) AS linked_campaign
      WHERE public.is_campaign_system(
        linked_campaign.campaign_id,
        (SELECT auth.uid())
      )
    )
  );

-- There are intentionally no direct INSERT/UPDATE/DELETE policies on unlocks
-- and no UPDATE policy on grants. SECURITY DEFINER RPCs below are the only
-- authenticated mutation boundary.

-- ---------------------------------------------------------------------------
-- 6. Actor-bound transactional workflow RPCs
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.consume_regent_unlock_grant(
  p_grant_id UUID,
  p_regent_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_candidate TEXT := p_regent_id;
  v_canonical_regent_id TEXT;
  v_grant public.character_regent_unlock_grants%ROWTYPE;
  v_existing_unlock public.character_regent_unlocks%ROWTYPE;
  v_character_owner UUID;
  v_unlock_count INTEGER;
  v_is_primary BOOLEAN;
  v_unlock_id UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  v_canonical_regent_id := CASE v_candidate
    WHEN 'umbral_regent' THEN 'umbral_regent'
    WHEN 'radiant_regent' THEN 'radiant_regent'
    WHEN 'steel_regent' THEN 'steel_regent'
    WHEN 'destruction_regent' THEN 'destruction_regent'
    WHEN 'war_regent' THEN 'war_regent'
    WHEN 'frost_regent' THEN 'frost_regent'
    WHEN 'beast_regent' THEN 'beast_regent'
    WHEN 'plague_regent' THEN 'plague_regent'
    WHEN 'spatial_regent' THEN 'spatial_regent'
    WHEN 'mimic_regent' THEN 'mimic_regent'
    WHEN 'blood_regent' THEN 'blood_regent'
    WHEN 'gravity_regent' THEN 'gravity_regent'
    WHEN 'shadow_regent' THEN 'umbral_regent'
    WHEN 'dragon_regent' THEN 'destruction_regent'
    WHEN 'titan_regent' THEN 'steel_regent'
    WHEN 'architect_regent' THEN 'spatial_regent'
    ELSE NULL
  END;

  IF v_canonical_regent_id IS NULL THEN
    RAISE EXCEPTION 'INVALID_REGENT_ID' USING ERRCODE = '22023';
  END IF;

  SELECT grant_row.*
  INTO v_grant
  FROM public.character_regent_unlock_grants AS grant_row
  WHERE grant_row.id = p_grant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_GRANT_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT character_row.user_id
  INTO v_character_owner
  FROM public.characters AS character_row
  WHERE character_row.id = v_grant.character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_character_owner IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  -- A committed exact retry returns the same unlock. A different Regent choice
  -- for an already-consumed grant is a conflict, never a reassignment.
  IF v_grant.consumed_unlock_id IS NOT NULL THEN
    SELECT unlock_row.*
    INTO v_existing_unlock
    FROM public.character_regent_unlocks AS unlock_row
    WHERE unlock_row.id = v_grant.consumed_unlock_id
      AND unlock_row.character_id = v_grant.character_id;

    IF NOT FOUND
       OR v_existing_unlock.regent_id IS DISTINCT FROM v_canonical_regent_id THEN
      RAISE EXCEPTION 'REGENT_UNLOCK_GRANT_ALREADY_CONSUMED'
        USING ERRCODE = '23505';
    END IF;

    RETURN v_existing_unlock.id;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.character_regent_unlocks AS unlock_row
    WHERE unlock_row.character_id = v_grant.character_id
      AND unlock_row.regent_id = v_canonical_regent_id
  ) THEN
    RAISE EXCEPTION 'REGENT_ALREADY_UNLOCKED' USING ERRCODE = '23505';
  END IF;

  SELECT count(*)
  INTO v_unlock_count
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.character_id = v_grant.character_id;

  IF v_unlock_count >= 2 THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_LIMIT_REACHED' USING ERRCODE = '23514';
  END IF;

  v_is_primary := NOT EXISTS (
    SELECT 1
    FROM public.character_regent_unlocks AS unlock_row
    WHERE unlock_row.character_id = v_grant.character_id
      AND unlock_row.is_primary
  );

  INSERT INTO public.character_regent_unlocks (
    character_id,
    legacy_regent_uuid,
    regent_id,
    quest_name,
    dm_notes,
    is_primary,
    caught_up_at_level
  )
  VALUES (
    v_grant.character_id,
    NULL,
    v_canonical_regent_id,
    v_grant.quest_title,
    NULL,
    v_is_primary,
    NULL
  )
  RETURNING id INTO v_unlock_id;

  UPDATE public.character_regent_unlock_grants AS grant_row
  SET consumed_at = now(),
      consumed_unlock_id = v_unlock_id
  WHERE grant_row.id = v_grant.id;

  RETURN v_unlock_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_regent_catch_up(
  p_unlock_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_character_id UUID;
  v_character_owner UUID;
  v_character_level INTEGER;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  -- Resolve without a row lock, then serialize on the parent before locking
  -- the target unlock. Every Task 8 RPC follows this character-before-unlock
  -- hierarchy to prevent cross-workflow deadlocks.
  SELECT unlock_row.character_id
  INTO v_character_id
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.id = p_unlock_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT character_row.user_id, character_row.level
  INTO v_character_owner, v_character_level
  FROM public.characters AS character_row
  WHERE character_row.id = v_character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_character_owner IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT unlock_row.*
  INTO v_unlock
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.id = p_unlock_id
    AND unlock_row.character_id = v_character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_unlock.regent_id IS NULL THEN
    RAISE EXCEPTION 'LEGACY_REGENT_UNLOCK_NOT_ACTIONABLE' USING ERRCODE = '22023';
  END IF;

  IF v_character_level NOT BETWEEN 1 AND 20 THEN
    RAISE EXCEPTION 'INVALID_CHARACTER_LEVEL' USING ERRCODE = '22023';
  END IF;

  IF v_unlock.caught_up_at_level IS NOT NULL THEN
    RETURN v_unlock.caught_up_at_level;
  END IF;

  UPDATE public.character_regent_unlocks AS unlock_row
  SET caught_up_at_level = v_character_level
  WHERE unlock_row.id = v_unlock.id;

  RETURN v_character_level;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_primary_regent_unlock(
  p_unlock_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_character_id UUID;
  v_character_owner UUID;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT unlock_row.character_id
  INTO v_character_id
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.id = p_unlock_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT character_row.user_id
  INTO v_character_owner
  FROM public.characters AS character_row
  WHERE character_row.id = v_character_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_character_owner IS DISTINCT FROM v_actor THEN
    RAISE EXCEPTION 'CHARACTER_OWNERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  -- Primary switching can update a sibling. Lock every unlock for the serialized
  -- character in a stable order before reading or changing either row.
  PERFORM unlock_row.id
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.character_id = v_character_id
  ORDER BY unlock_row.id
  FOR UPDATE;

  SELECT unlock_row.*
  INTO v_unlock
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.id = p_unlock_id
    AND unlock_row.character_id = v_character_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_unlock.is_primary THEN
    RETURN v_unlock.id;
  END IF;

  UPDATE public.character_regent_unlocks AS unlock_row
  SET is_primary = false
  WHERE unlock_row.character_id = v_unlock.character_id
    AND unlock_row.is_primary;

  UPDATE public.character_regent_unlocks AS unlock_row
  SET is_primary = true
  WHERE unlock_row.id = v_unlock.id;

  RETURN v_unlock.id;
END;
$$;

-- CampaignRegentOversight contains a real Warden removal workflow. Keep that
-- capability narrow: only a Warden/co-Warden for a linked campaign may remove
-- one unlock. Its consumed grant is revoked first, and a remaining unlock is
-- promoted only when the removed row was primary.
CREATE OR REPLACE FUNCTION public.remove_regent_unlock(
  p_unlock_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_unlock public.character_regent_unlocks%ROWTYPE;
  v_character_id UUID;
  v_character_exists BOOLEAN;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  -- The shared hierarchy is grant (when present), character, then all affected
  -- unlocks in stable ID order. A legacy/manual unlock may have no grant.
  PERFORM 1
  FROM public.character_regent_unlock_grants AS grant_row
  WHERE grant_row.consumed_unlock_id = p_unlock_id
  FOR UPDATE;

  SELECT unlock_row.character_id
  INTO v_character_id
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.id = p_unlock_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  SELECT true
  INTO v_character_exists
  FROM public.characters AS character_row
  WHERE character_row.id = v_character_id
  FOR UPDATE;

  IF NOT COALESCE(v_character_exists, false) THEN
    RAISE EXCEPTION 'REGENT_CHARACTER_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM (
      SELECT member_row.campaign_id
      FROM public.campaign_members AS member_row
      WHERE member_row.character_id = v_character_id
      UNION
      SELECT link_row.campaign_id
      FROM public.campaign_member_characters AS link_row
      WHERE link_row.character_id = v_character_id
      UNION
      SELECT share_row.campaign_id
      FROM public.campaign_character_shares AS share_row
      WHERE share_row.character_id = v_character_id
    ) AS linked_campaign
    WHERE public.is_campaign_system(linked_campaign.campaign_id, v_actor)
  ) THEN
    RAISE EXCEPTION 'CAMPAIGN_WARDEN_REQUIRED' USING ERRCODE = '42501';
  END IF;

  PERFORM unlock_row.id
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.character_id = v_character_id
  ORDER BY unlock_row.id
  FOR UPDATE;

  SELECT unlock_row.*
  INTO v_unlock
  FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.id = p_unlock_id
    AND unlock_row.character_id = v_character_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'REGENT_UNLOCK_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  DELETE FROM public.character_regent_unlock_grants AS grant_row
  WHERE grant_row.consumed_unlock_id = v_unlock.id;

  DELETE FROM public.character_regent_unlocks AS unlock_row
  WHERE unlock_row.id = v_unlock.id;

  IF v_unlock.is_primary THEN
    UPDATE public.character_regent_unlocks AS unlock_row
    SET is_primary = true
    WHERE unlock_row.id = (
      SELECT remaining_row.id
      FROM public.character_regent_unlocks AS remaining_row
      WHERE remaining_row.character_id = v_unlock.character_id
      ORDER BY remaining_row.unlocked_at, remaining_row.id
      LIMIT 1
    )
      AND NOT EXISTS (
        SELECT 1
        FROM public.character_regent_unlocks AS primary_row
        WHERE primary_row.character_id = v_unlock.character_id
          AND primary_row.is_primary
      );
  END IF;

  RETURN v_unlock.id;
END;
$$;

-- The post-hardening function surface is opt-in. These are authenticated-only
-- RPCs; helpers remain non-executable and no anonymous compatibility grant is
-- retained.
REVOKE EXECUTE ON FUNCTION public.consume_regent_unlock_grant(UUID, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.complete_regent_catch_up(UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_primary_regent_unlock(UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.remove_regent_unlock(UUID)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.consume_regent_unlock_grant(UUID, TEXT)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_regent_catch_up(UUID)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_primary_regent_unlock(UUID)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_regent_unlock(UUID)
  TO authenticated;

COMMIT;

NOTIFY pgrst, 'reload schema';

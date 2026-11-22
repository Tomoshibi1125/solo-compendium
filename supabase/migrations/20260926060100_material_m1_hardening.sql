-- M1 follow-up: keep read policies self-contained and refuse fractional
-- inventory mutations until explicit unit/fraction rules are authored.

BEGIN;

DROP POLICY IF EXISTS material_lots_read ON public.material_lots;
CREATE POLICY material_lots_read
  ON public.material_lots FOR SELECT TO authenticated
  USING (
    (
      owner_scope = 'character'
      AND EXISTS (
        SELECT 1 FROM public.characters AS character_row
        WHERE character_row.id = material_lots.owner_character_id
          AND character_row.user_id = auth.uid()
      )
    )
    OR
    (
      owner_scope = 'campaign'
      AND (
        EXISTS (
          SELECT 1 FROM public.campaign_members AS member_row
          WHERE member_row.campaign_id = material_lots.owner_campaign_id
            AND member_row.user_id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM public.campaigns AS campaign_row
          WHERE campaign_row.id = material_lots.owner_campaign_id
            AND campaign_row.warden_id = auth.uid()
        )
      )
    )
  );

DROP POLICY IF EXISTS material_lot_discoveries_read ON public.material_lot_discoveries;
CREATE POLICY material_lot_discoveries_read
  ON public.material_lot_discoveries FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters AS character_row
      WHERE character_row.id = material_lot_discoveries.character_id
        AND character_row.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1
      FROM public.material_lots AS lot
      WHERE lot.id = material_lot_discoveries.lot_id
        AND (
          (
            lot.owner_scope = 'character'
            AND EXISTS (
              SELECT 1 FROM public.characters AS owner_character
              WHERE owner_character.id = lot.owner_character_id
                AND owner_character.user_id = auth.uid()
            )
          )
          OR
          (
            lot.owner_scope = 'campaign'
            AND (
              EXISTS (
                SELECT 1 FROM public.campaign_members AS member_row
                WHERE member_row.campaign_id = lot.owner_campaign_id
                  AND member_row.user_id = auth.uid()
              )
              OR EXISTS (
                SELECT 1 FROM public.campaigns AS campaign_row
                WHERE campaign_row.id = lot.owner_campaign_id
                  AND campaign_row.warden_id = auth.uid()
              )
            )
          )
        )
    )
  );

DROP POLICY IF EXISTS material_lot_reservations_read ON public.material_lot_reservations;
CREATE POLICY material_lot_reservations_read
  ON public.material_lot_reservations FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.material_lots AS lot
      WHERE lot.id = material_lot_reservations.lot_id
        AND (
          (
            lot.owner_scope = 'character'
            AND EXISTS (
              SELECT 1 FROM public.characters AS owner_character
              WHERE owner_character.id = lot.owner_character_id
                AND owner_character.user_id = auth.uid()
            )
          )
          OR
          (
            lot.owner_scope = 'campaign'
            AND (
              EXISTS (
                SELECT 1 FROM public.campaign_members AS member_row
                WHERE member_row.campaign_id = lot.owner_campaign_id
                  AND member_row.user_id = auth.uid()
              )
              OR EXISTS (
                SELECT 1 FROM public.campaigns AS campaign_row
                WHERE campaign_row.id = lot.owner_campaign_id
                  AND campaign_row.warden_id = auth.uid()
              )
            )
          )
        )
    )
  );

-- Do not silently define fractional semantics. The storage type is future-safe,
-- but M1 public operations accept whole quantities only until units are resolved.
ALTER TABLE public.material_lots
  DROP CONSTRAINT IF EXISTS material_lots_m1_whole_quantity_check;
ALTER TABLE public.material_lots
  ADD CONSTRAINT material_lots_m1_whole_quantity_check
  CHECK (quantity = trunc(quantity));

CREATE OR REPLACE FUNCTION app_private.material_m1_validate_whole_quantity(p_value NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
IMMUTABLE
SET search_path = pg_catalog
AS $$
BEGIN
  IF p_value IS NULL OR p_value <> trunc(p_value) THEN
    RAISE EXCEPTION 'MATERIAL_FRACTION_RULE_UNRESOLVED' USING ERRCODE = '22023';
  END IF;
END;
$$;

-- Wrap the existing public functions with entry guards by renaming the first
-- implementation to private implementation functions. This preserves their
-- transactional/idempotency behavior without duplicating it.
ALTER FUNCTION public.create_material_lot_m1(UUID, TEXT, NUMERIC, TEXT, TEXT)
  RENAME TO create_material_lot_m1_unchecked;
ALTER FUNCTION public.adjust_material_lot_m1(UUID, NUMERIC, BIGINT, TEXT)
  RENAME TO adjust_material_lot_m1_unchecked;
ALTER FUNCTION public.import_material_lots_m1(UUID, JSONB, JSONB, JSONB, TEXT)
  RENAME TO import_material_lots_m1_unchecked;

CREATE OR REPLACE FUNCTION public.create_material_lot_m1(
  p_character_id UUID,
  p_material_definition_id TEXT,
  p_quantity NUMERIC,
  p_operation_id TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  PERFORM app_private.material_m1_validate_whole_quantity(p_quantity);
  RETURN public.create_material_lot_m1_unchecked(
    p_character_id, p_material_definition_id, p_quantity, p_operation_id, p_notes
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.adjust_material_lot_m1(
  p_lot_id UUID,
  p_delta NUMERIC,
  p_expected_version BIGINT,
  p_operation_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  PERFORM app_private.material_m1_validate_whole_quantity(p_delta);
  RETURN public.adjust_material_lot_m1_unchecked(
    p_lot_id, p_delta, p_expected_version, p_operation_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.import_material_lots_m1(
  p_character_id UUID,
  p_definitions JSONB,
  p_lots JSONB,
  p_discoveries JSONB,
  p_operation_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_lot JSONB;
BEGIN
  IF length(COALESCE(p_operation_id, '')) < 8 OR length(p_operation_id) > 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;
  IF jsonb_typeof(COALESCE(p_lots, '[]'::jsonb)) <> 'array' THEN
    RAISE EXCEPTION 'INVALID_MATERIAL_IMPORT_PAYLOAD' USING ERRCODE = '22023';
  END IF;
  FOR v_lot IN SELECT value FROM jsonb_array_elements(COALESCE(p_lots, '[]'::jsonb))
  LOOP
    PERFORM app_private.material_m1_validate_whole_quantity((v_lot->>'quantity')::NUMERIC);
  END LOOP;
  RETURN public.import_material_lots_m1_unchecked(
    p_character_id, p_definitions, p_lots, p_discoveries, p_operation_id
  );
END;
$$;

REVOKE ALL ON FUNCTION app_private.material_m1_validate_whole_quantity(NUMERIC)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_material_lot_m1_unchecked(UUID, TEXT, NUMERIC, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.adjust_material_lot_m1_unchecked(UUID, NUMERIC, BIGINT, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.import_material_lots_m1_unchecked(UUID, JSONB, JSONB, JSONB, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_material_lot_m1(UUID, TEXT, NUMERIC, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.adjust_material_lot_m1(UUID, NUMERIC, BIGINT, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.import_material_lots_m1(UUID, JSONB, JSONB, JSONB, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_material_lot_m1(UUID, TEXT, NUMERIC, TEXT, TEXT)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_material_lot_m1(UUID, NUMERIC, BIGINT, TEXT)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.import_material_lots_m1(UUID, JSONB, JSONB, JSONB, TEXT)
  TO authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'material_lots'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.material_lots;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'material_lot_discoveries'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.material_lot_discoveries;
    END IF;
  END IF;
END $$;

ALTER TABLE public.material_lots REPLICA IDENTITY FULL;
ALTER TABLE public.material_lot_discoveries REPLICA IDENTITY FULL;

COMMIT;
NOTIFY pgrst, 'reload schema';

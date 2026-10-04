-- M1: material definitions/lots, scoped ownership, legacy aggregate backfill,
-- discovery metadata, durable operation receipts, and portable import support.
--
-- This migration deliberately does NOT define harvesting, crafting consumption,
-- grade inference, fraction/unit conversion, or research outcomes. Unknown legacy
-- provenance/grade remains unknown. Regulation metadata is descriptive only and
-- never blocks inventory mechanics.

BEGIN;

CREATE TABLE IF NOT EXISTS public.material_definitions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  family TEXT,
  unit TEXT,
  grade TEXT,
  rarity TEXT,
  source_revision TEXT NOT NULL DEFAULT 'm1-v1',
  regulation_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  definition_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT material_definitions_family_check CHECK (
    family IS NULL OR family IN (
      'Anomaly Biological',
      'Essence',
      'Rift Botanical',
      'Rift Mineral',
      'Relic Material',
      'Technical'
    )
  )
);

-- Seed only facts already present in the authored crafting catalog. Rift
-- Salvage remains family=NULL because the old material_type does not prove one
-- of the six new families.
INSERT INTO public.material_definitions (
  id, name, family, unit, rarity, source_revision, definition_metadata
) VALUES
  ('material-rift-salvage', 'Rift Salvage', NULL, 'bundle', 'common', 'crafting-catalog-v1', jsonb_build_object('legacyMaterialType', 'rift_salvage')),
  ('material-anomaly-tissue', 'Anomaly Tissue', 'Anomaly Biological', 'sample', 'uncommon', 'crafting-catalog-v1', jsonb_build_object('legacyMaterialType', 'anomaly_material')),
  ('material-relic-fragment', 'Relic Fragment', 'Relic Material', 'fragment', 'rare', 'crafting-catalog-v1', jsonb_build_object('legacyMaterialType', 'relic_fragment')),
  ('material-essence-capacitor', 'Essence Capacitor', 'Essence', 'cell', 'uncommon', 'crafting-catalog-v1', jsonb_build_object('legacyMaterialType', 'essence_component')),
  ('material-rune-fuse', 'Rune Fuse', 'Technical', 'fuse', 'common', 'crafting-catalog-v1', jsonb_build_object('legacyMaterialType', 'field_part')),
  ('material-containment-foam', 'Containment Foam', 'Technical', 'canister', 'common', 'crafting-catalog-v1', jsonb_build_object('legacyMaterialType', 'field_part')),
  ('material-warded-thread', 'Warded Thread', 'Essence', 'spool', 'uncommon', 'crafting-catalog-v1', jsonb_build_object('legacyMaterialType', 'essence_component')),
  ('material-field-ration-base', 'Field Ration Base', 'Technical', 'kit', 'common', 'crafting-catalog-v1', jsonb_build_object('legacyMaterialType', 'field_part'))
ON CONFLICT (id) DO NOTHING;

-- Every pre-M1 material id gets a compatibility definition. No family, unit,
-- rarity, grade, or provenance is guessed for unknown ids.
INSERT INTO public.material_definitions (
  id, name, family, unit, grade, rarity, source_revision, definition_metadata
)
SELECT DISTINCT
  legacy.material_id,
  legacy.material_id,
  NULL,
  NULL,
  NULL,
  NULL,
  'legacy-aggregate-v1',
  jsonb_build_object('compatibility', 'unmapped-legacy-material')
FROM public.character_materials AS legacy
WHERE NOT EXISTS (
  SELECT 1 FROM public.material_definitions AS definition
  WHERE definition.id = legacy.material_id
)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.material_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_definition_id TEXT NOT NULL REFERENCES public.material_definitions(id),
  owner_scope TEXT NOT NULL,
  owner_character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
  owner_campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  quantity NUMERIC(20,6) NOT NULL DEFAULT 0,
  unit TEXT,
  grade TEXT,
  provenance_status TEXT NOT NULL DEFAULT 'manual',
  provenance_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  regulation_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  row_version BIGINT NOT NULL DEFAULT 0,
  legacy_character_material_id UUID UNIQUE REFERENCES public.character_materials(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT material_lots_owner_scope_check CHECK (owner_scope IN ('character', 'campaign')),
  CONSTRAINT material_lots_owner_shape_check CHECK (
    (owner_scope = 'character' AND owner_character_id IS NOT NULL AND owner_campaign_id IS NULL)
    OR
    (owner_scope = 'campaign' AND owner_campaign_id IS NOT NULL AND owner_character_id IS NULL)
  ),
  CONSTRAINT material_lots_quantity_check CHECK (quantity >= 0),
  CONSTRAINT material_lots_provenance_status_check CHECK (
    provenance_status IN ('canonical', 'legacy-unknown', 'manual', 'harvested', 'crafted-output', 'imported')
  )
);

CREATE INDEX IF NOT EXISTS material_lots_character_idx
  ON public.material_lots(owner_character_id, material_definition_id)
  WHERE owner_scope = 'character';
CREATE INDEX IF NOT EXISTS material_lots_campaign_idx
  ON public.material_lots(owner_campaign_id, material_definition_id)
  WHERE owner_scope = 'campaign';
CREATE INDEX IF NOT EXISTS material_lots_definition_idx
  ON public.material_lots(material_definition_id);

CREATE TABLE IF NOT EXISTS public.material_lot_discoveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID NOT NULL REFERENCES public.material_lots(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  discovered_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  discovery_revision BIGINT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (lot_id, character_id)
);

CREATE INDEX IF NOT EXISTS material_lot_discoveries_character_idx
  ON public.material_lot_discoveries(character_id, lot_id);

-- Reservations exist in M1 so M3 can reserve exact provenance-bearing lots
-- without adding another inventory representation. M1 does not yet create or
-- resolve reservations.
CREATE TABLE IF NOT EXISTS public.material_lot_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID NOT NULL REFERENCES public.material_lots(id) ON DELETE CASCADE,
  quantity NUMERIC(20,6) NOT NULL,
  reservation_kind TEXT NOT NULL DEFAULT 'project',
  reference_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_by_user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT material_lot_reservations_quantity_check CHECK (quantity > 0),
  CONSTRAINT material_lot_reservations_status_check CHECK (status IN ('active', 'released', 'consumed'))
);

CREATE INDEX IF NOT EXISTS material_lot_reservations_lot_idx
  ON public.material_lot_reservations(lot_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS material_lot_reservations_active_reference_idx
  ON public.material_lot_reservations(lot_id, reservation_kind, reference_id)
  WHERE status = 'active';

CREATE TABLE IF NOT EXISTS public.material_lot_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID NOT NULL,
  operation_id TEXT NOT NULL,
  operation_kind TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (actor_user_id, operation_id)
);

-- One old aggregate row becomes one distinct lot. We intentionally do not
-- merge by material id beyond the existing aggregate row and never infer grade
-- or acquisition provenance.
INSERT INTO public.material_lots (
  material_definition_id,
  owner_scope,
  owner_character_id,
  quantity,
  unit,
  grade,
  provenance_status,
  provenance_metadata,
  notes,
  legacy_character_material_id,
  created_at,
  updated_at
)
SELECT
  legacy.material_id,
  'character',
  legacy.character_id,
  legacy.quantity::NUMERIC,
  definition.unit,
  NULL,
  'legacy-unknown',
  jsonb_build_object(
    'legacyTable', 'character_materials',
    'legacyRowId', legacy.id,
    'legacyMaterialId', legacy.material_id
  ),
  legacy.notes,
  legacy.id,
  legacy.created_at,
  legacy.updated_at
FROM public.character_materials AS legacy
JOIN public.material_definitions AS definition
  ON definition.id = legacy.material_id
WHERE NOT EXISTS (
  SELECT 1 FROM public.material_lots AS lot
  WHERE lot.legacy_character_material_id = legacy.id
);

CREATE OR REPLACE FUNCTION app_private.material_m1_can_read_lot(p_lot public.material_lots)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT CASE p_lot.owner_scope
    WHEN 'character' THEN EXISTS (
      SELECT 1 FROM public.characters AS character_row
      WHERE character_row.id = p_lot.owner_character_id
        AND character_row.user_id = auth.uid()
    )
    WHEN 'campaign' THEN EXISTS (
      SELECT 1 FROM public.campaign_members AS member_row
      WHERE member_row.campaign_id = p_lot.owner_campaign_id
        AND member_row.user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.campaigns AS campaign_row
      WHERE campaign_row.id = p_lot.owner_campaign_id
        AND campaign_row.warden_id = auth.uid()
    )
    ELSE false
  END;
$$;

CREATE OR REPLACE FUNCTION app_private.material_m1_can_mutate_lot(p_lot public.material_lots)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
  SELECT CASE p_lot.owner_scope
    WHEN 'character' THEN EXISTS (
      SELECT 1 FROM public.characters AS character_row
      WHERE character_row.id = p_lot.owner_character_id
        AND character_row.user_id = auth.uid()
    )
    WHEN 'campaign' THEN p_lot.owner_campaign_id IS NOT NULL
      AND public.is_campaign_system(p_lot.owner_campaign_id, auth.uid())
    ELSE false
  END;
$$;

CREATE OR REPLACE FUNCTION app_private.material_m1_sync_character_aggregate(
  p_character_id UUID,
  p_material_id TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_quantity NUMERIC;
BEGIN
  SELECT COALESCE(sum(lot.quantity), 0)
  INTO v_quantity
  FROM public.material_lots AS lot
  WHERE lot.owner_scope = 'character'
    AND lot.owner_character_id = p_character_id
    AND lot.material_definition_id = p_material_id;

  INSERT INTO public.character_materials (character_id, material_id, quantity)
  VALUES (p_character_id, p_material_id, floor(v_quantity)::INTEGER)
  ON CONFLICT (character_id, material_id)
  DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION app_private.material_m1_sync_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') AND OLD.owner_scope = 'character' THEN
    PERFORM app_private.material_m1_sync_character_aggregate(
      OLD.owner_character_id,
      OLD.material_definition_id
    );
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') AND NEW.owner_scope = 'character' THEN
    PERFORM app_private.material_m1_sync_character_aggregate(
      NEW.owner_character_id,
      NEW.material_definition_id
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS material_lots_sync_legacy_aggregate ON public.material_lots;
CREATE TRIGGER material_lots_sync_legacy_aggregate
AFTER INSERT OR UPDATE OR DELETE ON public.material_lots
FOR EACH ROW EXECUTE FUNCTION app_private.material_m1_sync_trigger();

CREATE OR REPLACE FUNCTION app_private.material_m1_receipt(
  p_actor UUID,
  p_operation_id TEXT,
  p_operation_kind TEXT,
  p_fingerprint TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = off
AS $$
DECLARE
  v_existing public.material_lot_operations%ROWTYPE;
BEGIN
  SELECT * INTO v_existing
  FROM public.material_lot_operations AS operation
  WHERE operation.actor_user_id = p_actor
    AND operation.operation_id = p_operation_id
  FOR UPDATE;

  IF FOUND THEN
    IF v_existing.operation_kind IS DISTINCT FROM p_operation_kind
       OR v_existing.fingerprint IS DISTINCT FROM p_fingerprint THEN
      RAISE EXCEPTION 'MATERIAL_OPERATION_ID_CONFLICT' USING ERRCODE = '22023';
    END IF;
    RETURN v_existing.result;
  END IF;
  RETURN NULL;
END;
$$;

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
DECLARE
  v_actor UUID := auth.uid();
  v_definition public.material_definitions%ROWTYPE;
  v_lot_id UUID;
  v_fingerprint TEXT;
  v_prior JSONB;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF length(COALESCE(p_operation_id, '')) < 8 OR length(p_operation_id) > 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;
  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'INVALID_MATERIAL_QUANTITY' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'NOT_OWNER' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_definition
  FROM public.material_definitions AS definition
  WHERE definition.id = p_material_definition_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'MATERIAL_DEFINITION_NOT_FOUND' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(v_actor::TEXT || ':' || p_operation_id, 0));
  v_fingerprint := md5(jsonb_build_object(
    'characterId', p_character_id,
    'materialDefinitionId', p_material_definition_id,
    'quantity', p_quantity,
    'notes', NULLIF(btrim(COALESCE(p_notes, '')), '')
  )::TEXT);
  v_prior := app_private.material_m1_receipt(v_actor, p_operation_id, 'create-lot', v_fingerprint);
  IF v_prior IS NOT NULL THEN
    RETURN (v_prior->>'lot_id')::UUID;
  END IF;

  INSERT INTO public.material_lots (
    material_definition_id, owner_scope, owner_character_id,
    quantity, unit, grade, provenance_status, provenance_metadata,
    regulation_metadata, notes
  ) VALUES (
    v_definition.id, 'character', p_character_id,
    p_quantity, v_definition.unit, NULL, 'manual',
    jsonb_build_object('createdBy', 'manual-inventory'),
    v_definition.regulation_metadata,
    NULLIF(btrim(COALESCE(p_notes, '')), '')
  ) RETURNING id INTO v_lot_id;

  INSERT INTO public.material_lot_operations (
    actor_user_id, operation_id, operation_kind, fingerprint, result
  ) VALUES (
    v_actor, p_operation_id, 'create-lot', v_fingerprint,
    jsonb_build_object('lot_id', v_lot_id)
  );

  RETURN v_lot_id;
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
DECLARE
  v_actor UUID := auth.uid();
  v_lot public.material_lots%ROWTYPE;
  v_next NUMERIC;
  v_fingerprint TEXT;
  v_prior JSONB;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF p_delta IS NULL OR p_delta = 0 THEN
    RAISE EXCEPTION 'INVALID_MATERIAL_DELTA' USING ERRCODE = '22023';
  END IF;
  IF length(COALESCE(p_operation_id, '')) < 8 OR length(p_operation_id) > 200 THEN
    RAISE EXCEPTION 'INVALID_OPERATION_ID' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(v_actor::TEXT || ':' || p_operation_id, 0));
  v_fingerprint := md5(jsonb_build_object(
    'lotId', p_lot_id,
    'delta', p_delta,
    'expectedVersion', p_expected_version
  )::TEXT);
  v_prior := app_private.material_m1_receipt(v_actor, p_operation_id, 'adjust-lot', v_fingerprint);
  IF v_prior IS NOT NULL THEN
    RETURN v_prior;
  END IF;

  SELECT * INTO v_lot
  FROM public.material_lots AS lot
  WHERE lot.id = p_lot_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'MATERIAL_LOT_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;
  IF NOT app_private.material_m1_can_mutate_lot(v_lot) THEN
    RAISE EXCEPTION 'MATERIAL_LOT_WRITE_FORBIDDEN' USING ERRCODE = '42501';
  END IF;
  IF v_lot.row_version IS DISTINCT FROM p_expected_version THEN
    RAISE EXCEPTION 'STALE_MATERIAL_LOT' USING ERRCODE = '40001';
  END IF;

  v_next := v_lot.quantity + p_delta;
  IF v_next < 0 THEN
    RAISE EXCEPTION 'INSUFFICIENT_MATERIAL_LOT_QUANTITY' USING ERRCODE = '22023';
  END IF;

  UPDATE public.material_lots
  SET quantity = v_next,
      row_version = row_version + 1,
      updated_at = now()
  WHERE id = p_lot_id
  RETURNING * INTO v_lot;

  v_prior := jsonb_build_object(
    'lot_id', v_lot.id,
    'quantity', v_lot.quantity,
    'row_version', v_lot.row_version
  );
  INSERT INTO public.material_lot_operations (
    actor_user_id, operation_id, operation_kind, fingerprint, result
  ) VALUES (v_actor, p_operation_id, 'adjust-lot', v_fingerprint, v_prior);

  RETURN v_prior;
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
  v_actor UUID := auth.uid();
  v_fingerprint TEXT;
  v_prior JSONB;
  v_definition JSONB;
  v_lot JSONB;
  v_discovery JSONB;
  v_new_lot UUID;
  v_old_lot TEXT;
  v_map JSONB := '{}'::jsonb;
  v_count INTEGER := 0;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.characters AS character_row
    WHERE character_row.id = p_character_id
      AND character_row.user_id = v_actor
  ) THEN
    RAISE EXCEPTION 'NOT_OWNER' USING ERRCODE = '42501';
  END IF;
  IF jsonb_typeof(COALESCE(p_definitions, '[]'::jsonb)) <> 'array'
     OR jsonb_typeof(COALESCE(p_lots, '[]'::jsonb)) <> 'array'
     OR jsonb_typeof(COALESCE(p_discoveries, '[]'::jsonb)) <> 'array' THEN
    RAISE EXCEPTION 'INVALID_MATERIAL_IMPORT_PAYLOAD' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(v_actor::TEXT || ':' || p_operation_id, 0));
  v_fingerprint := md5(jsonb_build_object(
    'characterId', p_character_id,
    'definitions', COALESCE(p_definitions, '[]'::jsonb),
    'lots', COALESCE(p_lots, '[]'::jsonb),
    'discoveries', COALESCE(p_discoveries, '[]'::jsonb)
  )::TEXT);
  v_prior := app_private.material_m1_receipt(v_actor, p_operation_id, 'import-lots', v_fingerprint);
  IF v_prior IS NOT NULL THEN
    RETURN v_prior;
  END IF;

  FOR v_definition IN SELECT value FROM jsonb_array_elements(COALESCE(p_definitions, '[]'::jsonb))
  LOOP
    IF NULLIF(btrim(v_definition->>'id'), '') IS NULL
       OR NULLIF(btrim(v_definition->>'name'), '') IS NULL THEN
      RAISE EXCEPTION 'INVALID_MATERIAL_DEFINITION_IMPORT' USING ERRCODE = '22023';
    END IF;
    IF v_definition->>'family' IS NOT NULL
       AND v_definition->>'family' NOT IN (
         'Anomaly Biological', 'Essence', 'Rift Botanical',
         'Rift Mineral', 'Relic Material', 'Technical'
       ) THEN
      RAISE EXCEPTION 'INVALID_MATERIAL_FAMILY_IMPORT' USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.material_definitions (
      id, name, family, unit, grade, rarity, source_revision,
      regulation_metadata, definition_metadata
    ) VALUES (
      v_definition->>'id',
      v_definition->>'name',
      NULLIF(v_definition->>'family', ''),
      NULLIF(v_definition->>'unit', ''),
      NULLIF(v_definition->>'grade', ''),
      NULLIF(v_definition->>'rarity', ''),
      COALESCE(NULLIF(v_definition->>'source_revision', ''), 'imported-v1'),
      COALESCE(v_definition->'regulation_metadata', '{}'::jsonb),
      COALESCE(v_definition->'definition_metadata', '{}'::jsonb)
    ) ON CONFLICT (id) DO NOTHING;
  END LOOP;

  FOR v_lot IN SELECT value FROM jsonb_array_elements(COALESCE(p_lots, '[]'::jsonb))
  LOOP
    IF NULLIF(btrim(v_lot->>'material_definition_id'), '') IS NULL
       OR NOT EXISTS (
         SELECT 1 FROM public.material_definitions AS definition
         WHERE definition.id = v_lot->>'material_definition_id'
       ) THEN
      RAISE EXCEPTION 'MATERIAL_DEFINITION_NOT_FOUND' USING ERRCODE = '22023';
    END IF;
    IF (v_lot->>'quantity')::NUMERIC < 0 THEN
      RAISE EXCEPTION 'INVALID_MATERIAL_QUANTITY' USING ERRCODE = '22023';
    END IF;
    IF COALESCE(v_lot->>'provenance_status', 'imported') NOT IN (
      'canonical', 'legacy-unknown', 'manual', 'harvested', 'crafted-output', 'imported'
    ) THEN
      RAISE EXCEPTION 'INVALID_MATERIAL_PROVENANCE_STATUS' USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.material_lots (
      material_definition_id, owner_scope, owner_character_id, quantity,
      unit, grade, provenance_status, provenance_metadata,
      regulation_metadata, notes
    ) VALUES (
      v_lot->>'material_definition_id', 'character', p_character_id,
      (v_lot->>'quantity')::NUMERIC,
      NULLIF(v_lot->>'unit', ''),
      NULLIF(v_lot->>'grade', ''),
      COALESCE(NULLIF(v_lot->>'provenance_status', ''), 'imported'),
      COALESCE(v_lot->'provenance_metadata', '{}'::jsonb),
      COALESCE(v_lot->'regulation_metadata', '{}'::jsonb),
      NULLIF(v_lot->>'notes', '')
    ) RETURNING id INTO v_new_lot;

    v_old_lot := NULLIF(v_lot->>'id', '');
    IF v_old_lot IS NOT NULL THEN
      v_map := v_map || jsonb_build_object(v_old_lot, v_new_lot);
    END IF;
    v_count := v_count + 1;
  END LOOP;

  FOR v_discovery IN SELECT value FROM jsonb_array_elements(COALESCE(p_discoveries, '[]'::jsonb))
  LOOP
    v_old_lot := NULLIF(v_discovery->>'lot_id', '');
    IF v_old_lot IS NULL OR NOT (v_map ? v_old_lot) THEN
      CONTINUE;
    END IF;
    INSERT INTO public.material_lot_discoveries (
      lot_id, character_id, discovered_metadata, discovery_revision, notes
    ) VALUES (
      (v_map->>v_old_lot)::UUID,
      p_character_id,
      COALESCE(v_discovery->'discovered_metadata', '{}'::jsonb),
      GREATEST(COALESCE((v_discovery->>'discovery_revision')::BIGINT, 0), 0),
      NULLIF(v_discovery->>'notes', '')
    ) ON CONFLICT (lot_id, character_id) DO NOTHING;
  END LOOP;

  v_prior := jsonb_build_object('imported_lots', v_count, 'lot_id_map', v_map);
  INSERT INTO public.material_lot_operations (
    actor_user_id, operation_id, operation_kind, fingerprint, result
  ) VALUES (v_actor, p_operation_id, 'import-lots', v_fingerprint, v_prior);

  RETURN v_prior;
END;
$$;

ALTER TABLE public.material_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_lot_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_lot_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_lot_operations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS material_definitions_read ON public.material_definitions;
CREATE POLICY material_definitions_read
  ON public.material_definitions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS material_lots_read ON public.material_lots;
CREATE POLICY material_lots_read
  ON public.material_lots FOR SELECT TO authenticated
  USING (app_private.material_m1_can_read_lot(material_lots));

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
      SELECT 1 FROM public.material_lots AS lot
      WHERE lot.id = material_lot_discoveries.lot_id
        AND app_private.material_m1_can_read_lot(lot)
    )
  );

DROP POLICY IF EXISTS material_lot_reservations_read ON public.material_lot_reservations;
CREATE POLICY material_lot_reservations_read
  ON public.material_lot_reservations FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.material_lots AS lot
      WHERE lot.id = material_lot_reservations.lot_id
        AND app_private.material_m1_can_read_lot(lot)
    )
  );

DROP POLICY IF EXISTS material_lot_operations_read ON public.material_lot_operations;
CREATE POLICY material_lot_operations_read
  ON public.material_lot_operations FOR SELECT TO authenticated
  USING (actor_user_id = auth.uid());

GRANT SELECT ON public.material_definitions TO authenticated;
GRANT SELECT ON public.material_lots TO authenticated;
GRANT SELECT ON public.material_lot_discoveries TO authenticated;
GRANT SELECT ON public.material_lot_reservations TO authenticated;
GRANT SELECT ON public.material_lot_operations TO authenticated;

REVOKE INSERT, UPDATE, DELETE ON public.material_definitions FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.material_lots FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.material_lot_discoveries FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.material_lot_reservations FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.material_lot_operations FROM PUBLIC, anon, authenticated;

-- The aggregate table remains readable for old project/UI compatibility but is
-- no longer a writable inventory authority after M1.
REVOKE INSERT, UPDATE, DELETE ON public.character_materials FROM authenticated;
GRANT SELECT ON public.character_materials TO authenticated;

REVOKE ALL ON FUNCTION app_private.material_m1_can_read_lot(public.material_lots) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.material_m1_can_mutate_lot(public.material_lots) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.material_m1_sync_character_aggregate(UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.material_m1_sync_trigger() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION app_private.material_m1_receipt(UUID, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.create_material_lot_m1(UUID, TEXT, NUMERIC, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.adjust_material_lot_m1(UUID, NUMERIC, BIGINT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.import_material_lots_m1(UUID, JSONB, JSONB, JSONB, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_material_lot_m1(UUID, TEXT, NUMERIC, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_material_lot_m1(UUID, NUMERIC, BIGINT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.import_material_lots_m1(UUID, JSONB, JSONB, JSONB, TEXT) TO authenticated;

COMMENT ON TABLE public.material_lots IS
  'M1 provenance-bearing inventory authority. Legacy aggregate rows are compatibility projections only.';
COMMENT ON TABLE public.material_lot_discoveries IS
  'Character-specific discovered knowledge kept separate from actual lot identity/provenance.';
COMMENT ON COLUMN public.material_lots.regulation_metadata IS
  'Descriptive regulatory metadata. M1 inventory mechanics never gate on this field.';

COMMIT;
NOTIFY pgrst, 'reload schema';

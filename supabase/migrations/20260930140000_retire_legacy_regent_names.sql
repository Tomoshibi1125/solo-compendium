-- Retired Regent names are not aliases and active text uses the canonical
-- names (RA-27): Shadow → Umbral, Flame → Radiant, Titan → Steel, Dragon →
-- Destruction, Architect → Spatial, and Transfiguration → Mimic Regent, and
-- Frost Sovereign → Frost Regent. The static compendium makes the same change.
--
-- Four legacy database compendium rows still carry a retired name (checked
-- 2026-09-30): Shadow Regent's Mantle in compendium_artifacts and
-- compendium_equipment, Sigil of the Shadow Regent in compendium_sigils, and
-- the Flame Regent Trials unlock requirement in compendium_regents. No
-- character, campaign, or marketplace row uses a retired Regent name.
BEGIN;

DO $$
DECLARE
  v_pair TEXT[];
  v_column RECORD;
  v_pairs TEXT[][] := ARRAY[
    ARRAY['Shadow Regent', 'Umbral Regent'],
    ARRAY['Flame Regent', 'Radiant Regent'],
    ARRAY['Titan Regent', 'Steel Regent'],
    ARRAY['Dragon Regent', 'Destruction Regent'],
    ARRAY['Architect Regent', 'Spatial Regent'],
    ARRAY['Transfiguration Regent', 'Mimic Regent'],
    ARRAY['Frost Sovereign', 'Frost Regent']
  ];
BEGIN
  FOR v_column IN
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN (
        'compendium_artifacts',
        'compendium_equipment',
        'compendium_sigils',
        'compendium_regents'
      )
      AND data_type IN ('text', 'jsonb')
  LOOP
    FOREACH v_pair SLICE 1 IN ARRAY v_pairs LOOP
      IF v_column.data_type = 'text' THEN
        EXECUTE format(
          'UPDATE public.%I SET %I = replace(%I, $1, $2) WHERE %I LIKE ''%%'' || $1 || ''%%''',
          v_column.table_name, v_column.column_name, v_column.column_name, v_column.column_name
        ) USING v_pair[1], v_pair[2];
      ELSE
        EXECUTE format(
          'UPDATE public.%I SET %I = replace(%I::text, $1, $2)::jsonb WHERE %I::text LIKE ''%%'' || $1 || ''%%''',
          v_column.table_name, v_column.column_name, v_column.column_name, v_column.column_name
        ) USING v_pair[1], v_pair[2];
      END IF;
    END LOOP;
  END LOOP;
END;
$$;

COMMIT;

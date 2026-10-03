-- Regent Projection Repair Script
-- Fixes character_regents table and regent_overlays array mismatches
-- Run with: npx supabase db execute --file scripts/repair-regent-projections.sql
-- Purpose: Synchronize projection tables with character_regent_unlocks authority

\echo '========================================='
\echo 'REPAIRING REGENT PROJECTIONS'
\echo '========================================='
\echo ''

\echo 'Step 1: Identifying characters with regent unlocks...'
SELECT 
  COUNT(DISTINCT character_id) as characters_with_unlocks
FROM public.character_regent_unlocks 
WHERE regent_id IS NOT NULL;

\echo ''
\echo 'Step 2: Syncing all character regent projections...'

DO $$
DECLARE
  v_character_id UUID;
  v_synced_count INTEGER := 0;
  v_error_count INTEGER := 0;
BEGIN
  FOR v_character_id IN 
    SELECT DISTINCT character_id 
    FROM public.character_regent_unlocks 
    WHERE regent_id IS NOT NULL
  LOOP
    BEGIN
      PERFORM app_private.sync_character_regent_projection(v_character_id);
      v_synced_count := v_synced_count + 1;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to sync character %: %', v_character_id, SQLERRM;
      v_error_count := v_error_count + 1;
    END;
  END LOOP;
  
  RAISE NOTICE 'Successfully synced % character regent projections', v_synced_count;
  IF v_error_count > 0 THEN
    RAISE NOTICE 'Failed to sync % characters (see warnings above)', v_error_count;
  END IF;
END $$;

\echo ''
\echo 'Step 3: Verifying character_regents projection consistency...'
WITH unlock_authority AS (
  SELECT 
    character_id,
    array_agg(regent_id ORDER BY is_primary DESC, unlocked_at, id) as expected_regents
  FROM public.character_regent_unlocks
  WHERE regent_id IS NOT NULL
  GROUP BY character_id
),
projection_state AS (
  SELECT 
    character_id,
    array_agg(regent_id ORDER BY regent_id) as projected_regents
  FROM public.character_regents
  GROUP BY character_id
)
SELECT 
  COUNT(*) as remaining_mismatches
FROM unlock_authority u
FULL OUTER JOIN projection_state p ON u.character_id = p.character_id
WHERE u.expected_regents IS DISTINCT FROM p.projected_regents
   OR u.expected_regents IS NULL
   OR p.projected_regents IS NULL;

\echo ''
\echo 'Step 4: Verifying regent_overlays array consistency...'
WITH unlock_authority AS (
  SELECT 
    character_id,
    array_agg(regent_id ORDER BY is_primary DESC, unlocked_at, id) as expected_overlays
  FROM public.character_regent_unlocks
  WHERE regent_id IS NOT NULL
  GROUP BY character_id
)
SELECT 
  COUNT(*) as remaining_overlay_mismatches
FROM public.characters c
LEFT JOIN unlock_authority u ON u.character_id = c.id
WHERE COALESCE(c.regent_overlays, ARRAY[]::TEXT[]) IS DISTINCT FROM COALESCE(u.expected_overlays, ARRAY[]::TEXT[]);

\echo ''
\echo '========================================='
\echo 'PROJECTION REPAIR COMPLETE'
\echo '========================================='
\echo ''
\echo 'If mismatches remain above 0, there may be data integrity issues.'
\echo 'Next step: Run scripts/validate-regent-workflow.sql'

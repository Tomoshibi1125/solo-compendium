-- Regent Workflow Validation Script
-- Verifies the complete regent catch-up system is operational
-- Run with: npx supabase db execute --file scripts/validate-regent-workflow.sql
-- Purpose: Confirm all repairs were successful and system is healthy

\echo '========================================='
\echo 'REGENT WORKFLOW VALIDATION'
\echo '========================================='
\echo ''

\echo 'Test 1: All regents have complete requirements (12 regents × 20 levels = 240 rows)...'
SELECT 
  CASE 
    WHEN COUNT(*) = 240 THEN '✓ PASS - All 240 requirement rows present'
    ELSE '✗ FAIL - Expected 240 rows, got ' || COUNT(*)::TEXT
  END as test_result
FROM app_private.regent_catch_up_requirements;

\echo ''
\echo 'Test 2: Each regent has exactly 20 level entries...'
WITH regent_counts AS (
  SELECT regent_id, COUNT(*) as level_count
  FROM app_private.regent_catch_up_requirements
  GROUP BY regent_id
)
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ PASS - All regents have 20 levels'
    ELSE '✗ FAIL - ' || COUNT(*)::TEXT || ' regents have incorrect level coverage'
  END as test_result
FROM regent_counts
WHERE level_count != 20;

\echo ''
\echo 'Test 3: No character_regents projection mismatches...'
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
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ PASS - All projections match unlock authority'
    ELSE '✗ FAIL - ' || COUNT(*)::TEXT || ' characters have projection mismatches'
  END as test_result
FROM unlock_authority u
FULL OUTER JOIN projection_state p ON u.character_id = p.character_id
WHERE u.expected_regents IS DISTINCT FROM p.projected_regents;

\echo ''
\echo 'Test 4: No regent_overlays array mismatches...'
WITH unlock_authority AS (
  SELECT 
    character_id,
    array_agg(regent_id ORDER BY is_primary DESC, unlocked_at, id) as expected_overlays
  FROM public.character_regent_unlocks
  WHERE regent_id IS NOT NULL
  GROUP BY character_id
)
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ PASS - All overlay arrays match unlock authority'
    ELSE '✗ FAIL - ' || COUNT(*)::TEXT || ' characters have overlay mismatches'
  END as test_result
FROM public.characters c
LEFT JOIN unlock_authority u ON u.character_id = c.id
WHERE COALESCE(c.regent_overlays, ARRAY[]::TEXT[]) IS DISTINCT FROM COALESCE(u.expected_overlays, ARRAY[]::TEXT[]);

\echo ''
\echo 'Test 5: All pending catch-ups can find their requirements...'
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ PASS - All pending catch-ups have requirements available'
    ELSE '✗ FAIL - ' || COUNT(*)::TEXT || ' pending catch-ups have no requirements'
  END as test_result
FROM public.character_regent_unlocks u
JOIN public.characters c ON c.id = u.character_id
LEFT JOIN app_private.regent_catch_up_requirements req 
  ON req.regent_id = u.regent_id 
  AND req.character_level = c.level
WHERE u.caught_up_at_level IS NULL
  AND u.regent_id IS NOT NULL
  AND req.regent_id IS NULL;

\echo ''
\echo 'Test 6: canonical_pick_options table has data...'
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ PASS - ' || COUNT(*)::TEXT || ' pick options available'
    ELSE '✗ FAIL - No pick options found'
  END as test_result
FROM app_private.regent_canonical_pick_options;

\echo ''
\echo 'Test 7: All expected regents are present...'
WITH expected_regents AS (
  SELECT unnest(ARRAY[
    'umbral_regent', 'radiant_regent', 'steel_regent',
    'destruction_regent', 'war_regent', 'frost_regent',
    'beast_regent', 'plague_regent', 'spatial_regent',
    'mimic_regent', 'blood_regent', 'gravity_regent'
  ]) AS regent_id
),
existing_regents AS (
  SELECT DISTINCT regent_id
  FROM app_private.regent_catch_up_requirements
)
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ PASS - All 12 regents have requirements'
    ELSE '✗ FAIL - ' || COUNT(*)::TEXT || ' regents are missing'
  END as test_result
FROM expected_regents e
LEFT JOIN existing_regents ex ON e.regent_id = ex.regent_id
WHERE ex.regent_id IS NULL;

\echo ''
\echo '========================================='
\echo 'VALIDATION SUMMARY'
\echo '========================================='

WITH test_results AS (
  -- Test 1: Requirements count
  SELECT CASE WHEN COUNT(*) = 240 THEN 1 ELSE 0 END as passed
  FROM app_private.regent_catch_up_requirements
  
  UNION ALL
  
  -- Test 2: Level coverage
  SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE 0 END
  FROM (
    SELECT regent_id FROM app_private.regent_catch_up_requirements
    GROUP BY regent_id HAVING COUNT(*) != 20
  ) sub
  
  UNION ALL
  
  -- Test 3: Projection consistency
  SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE 0 END
  FROM (
    SELECT u.character_id
    FROM (
      SELECT character_id, array_agg(regent_id ORDER BY is_primary DESC, unlocked_at, id) as expected_regents
      FROM public.character_regent_unlocks WHERE regent_id IS NOT NULL GROUP BY character_id
    ) u
    FULL OUTER JOIN (
      SELECT character_id, array_agg(regent_id ORDER BY regent_id) as projected_regents
      FROM public.character_regents GROUP BY character_id
    ) p ON u.character_id = p.character_id
    WHERE u.expected_regents IS DISTINCT FROM p.projected_regents
  ) sub
  
  UNION ALL
  
  -- Test 4: Overlay consistency
  SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE 0 END
  FROM (
    SELECT c.id
    FROM public.characters c
    LEFT JOIN (
      SELECT character_id, array_agg(regent_id ORDER BY is_primary DESC, unlocked_at, id) as expected_overlays
      FROM public.character_regent_unlocks WHERE regent_id IS NOT NULL GROUP BY character_id
    ) u ON u.character_id = c.id
    WHERE COALESCE(c.regent_overlays, ARRAY[]::TEXT[]) IS DISTINCT FROM COALESCE(u.expected_overlays, ARRAY[]::TEXT[])
  ) sub
  
  UNION ALL
  
  -- Test 5: Pending requirements
  SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE 0 END
  FROM (
    SELECT u.id
    FROM public.character_regent_unlocks u
    JOIN public.characters c ON c.id = u.character_id
    LEFT JOIN app_private.regent_catch_up_requirements req 
      ON req.regent_id = u.regent_id AND req.character_level = c.level
    WHERE u.caught_up_at_level IS NULL AND u.regent_id IS NOT NULL AND req.regent_id IS NULL
  ) sub
  
  UNION ALL
  
  -- Test 6: Pick options
  SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END
  FROM app_private.regent_canonical_pick_options
  
  UNION ALL
  
  -- Test 7: All regents present
  SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE 0 END
  FROM (
    SELECT e.regent_id
    FROM (
      SELECT unnest(ARRAY['umbral_regent','radiant_regent','steel_regent','destruction_regent',
                           'war_regent','frost_regent','beast_regent','plague_regent',
                           'spatial_regent','mimic_regent','blood_regent','gravity_regent']) AS regent_id
    ) e
    LEFT JOIN (SELECT DISTINCT regent_id FROM app_private.regent_catch_up_requirements) ex 
      ON e.regent_id = ex.regent_id
    WHERE ex.regent_id IS NULL
  ) sub
)
SELECT 
  SUM(passed) as tests_passed,
  COUNT(*) as total_tests,
  CASE 
    WHEN SUM(passed) = COUNT(*) THEN '✓✓✓ ALL TESTS PASSED - SYSTEM HEALTHY ✓✓✓'
    ELSE '✗✗✗ ' || (COUNT(*) - SUM(passed))::TEXT || ' TEST(S) FAILED ✗✗✗'
  END as overall_status
FROM test_results;

\echo ''
\echo 'If all tests passed, players should now be able to complete regent catch-up!'
\echo 'If tests failed, review the diagnostic output and re-run repairs.'

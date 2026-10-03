-- Regent Catch-Up Diagnostic Script
-- Run with: npx supabase db execute --file scripts/diagnose-regent-catchup.sql
-- Purpose: Identify missing regent_catch_up_requirements and affected characters

\echo '========================================='
\echo 'REGENT CATCH-UP SYSTEM DIAGNOSTIC'
\echo '========================================='
\echo ''

-- 1. Check if requirements table exists and has data
\echo '1. Checking app_private.regent_catch_up_requirements table...'
SELECT 
  COUNT(DISTINCT regent_id) as regent_count,
  COUNT(*) as total_rows,
  MIN(character_level) as min_level,
  MAX(character_level) as max_level
FROM app_private.regent_catch_up_requirements;

\echo ''
\echo '2. Checking which regents are missing requirements...'
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
  e.regent_id,
  CASE WHEN ex.regent_id IS NULL THEN 'MISSING' ELSE 'OK' END as status
FROM expected_regents e
LEFT JOIN existing_regents ex ON e.regent_id = ex.regent_id
ORDER BY e.regent_id;

\echo ''
\echo '3. Checking for incomplete level coverage (should be 1-20 for each regent)...'
SELECT 
  regent_id,
  COUNT(*) as levels_present,
  array_agg(character_level ORDER BY character_level) as level_array
FROM app_private.regent_catch_up_requirements
GROUP BY regent_id
HAVING COUNT(*) < 20
ORDER BY regent_id;

\echo ''
\echo '4. Checking character_regent_unlocks pending catch-up...'
SELECT 
  COUNT(*) as pending_catchup_count,
  COUNT(DISTINCT character_id) as affected_characters
FROM public.character_regent_unlocks
WHERE caught_up_at_level IS NULL 
  AND regent_id IS NOT NULL;

\echo ''
\echo '5. Identifying affected characters and their regents...'
SELECT 
  u.id as unlock_id,
  u.character_id,
  c.name as character_name,
  c.level as character_level,
  u.regent_id,
  u.is_primary,
  CASE 
    WHEN req.regent_id IS NULL THEN 'NO REQUIREMENTS'
    ELSE 'Requirements exist'
  END as requirements_status
FROM public.character_regent_unlocks u
JOIN public.characters c ON c.id = u.character_id
LEFT JOIN app_private.regent_catch_up_requirements req 
  ON req.regent_id = u.regent_id 
  AND req.character_level = c.level
WHERE u.caught_up_at_level IS NULL
  AND u.regent_id IS NOT NULL
ORDER BY c.name, u.is_primary DESC;

\echo ''
\echo '6. Checking character_regents projection consistency...'
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
  COALESCE(u.character_id, p.character_id) as character_id,
  u.expected_regents,
  p.projected_regents,
  CASE 
    WHEN u.expected_regents IS DISTINCT FROM p.projected_regents THEN 'MISMATCH'
    ELSE 'OK'
  END as status
FROM unlock_authority u
FULL OUTER JOIN projection_state p ON u.character_id = p.character_id
WHERE u.expected_regents IS DISTINCT FROM p.projected_regents
   OR u.expected_regents IS NULL
   OR p.projected_regents IS NULL;

\echo ''
\echo '7. Checking characters.regent_overlays projection consistency...'
WITH unlock_authority AS (
  SELECT 
    character_id,
    array_agg(regent_id ORDER BY is_primary DESC, unlocked_at, id) as expected_overlays
  FROM public.character_regent_unlocks
  WHERE regent_id IS NOT NULL
  GROUP BY character_id
)
SELECT 
  c.id as character_id,
  c.name,
  u.expected_overlays,
  c.regent_overlays as actual_overlays,
  CASE 
    WHEN COALESCE(c.regent_overlays, ARRAY[]::TEXT[]) IS DISTINCT FROM COALESCE(u.expected_overlays, ARRAY[]::TEXT[]) 
    THEN 'MISMATCH'
    ELSE 'OK'
  END as status
FROM public.characters c
LEFT JOIN unlock_authority u ON u.character_id = c.id
WHERE COALESCE(c.regent_overlays, ARRAY[]::TEXT[]) IS DISTINCT FROM COALESCE(u.expected_overlays, ARRAY[]::TEXT[])
   OR (u.expected_overlays IS NOT NULL AND c.regent_overlays IS NULL)
   OR (u.expected_overlays IS NULL AND c.regent_overlays IS NOT NULL AND cardinality(c.regent_overlays) > 0);

\echo ''
\echo '8. Checking regent_catch_up_options initialization...'
SELECT 
  u.id as unlock_id,
  u.regent_id,
  c.level as character_level,
  COUNT(o.canonical_id) as options_configured,
  req.powers + req.techniques + req.cantrips + req.spells as total_required
FROM public.character_regent_unlocks u
JOIN public.characters c ON c.id = u.character_id
LEFT JOIN public.regent_catch_up_options o ON o.unlock_id = u.id
LEFT JOIN app_private.regent_catch_up_requirements req 
  ON req.regent_id = u.regent_id 
  AND req.character_level = c.level
WHERE u.caught_up_at_level IS NULL
  AND u.regent_id IS NOT NULL
GROUP BY u.id, u.regent_id, c.level, req.powers, req.techniques, req.cantrips, req.spells
HAVING COUNT(o.canonical_id) = 0;

\echo ''
\echo '========================================='
\echo 'DIAGNOSTIC COMPLETE'
\echo '========================================='
\echo ''
\echo 'Next steps:'
\echo '1. If requirements are missing: Run scripts/repair-regent-requirements.sql'
\echo '2. If projections have mismatches: Run scripts/repair-regent-projections.sql'
\echo '3. After repairs: Run scripts/validate-regent-workflow.sql'

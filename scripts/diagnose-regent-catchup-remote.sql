-- Regent Catch-Up Diagnostic Script (Remote Compatible)
-- Run with: npx supabase db query --linked --file scripts/diagnose-regent-catchup-remote.sql

-- 1. Check requirements table
SELECT 
  'Requirements Table Status' as check_name,
  COUNT(DISTINCT regent_id) as regent_count,
  COUNT(*) as total_rows,
  MIN(character_level) as min_level,
  MAX(character_level) as max_level
FROM public.regent_catch_up_requirements;

-- 2. Check which regents are missing
WITH expected_regents AS (
  SELECT unnest(ARRAY[
    'umbral_regent', 'radiant_regent', 'steel_regent',
    'destruction_regent', 'war_regent', 'frost_regent',
    'beast_regent', 'plague_regent', 'spatial_regent',
    'mimic_regent', 'blood_regent', 'gravity_regent'
  ]) AS regent_id
),
existing_regents AS (
  SELECT DISTINCT regent_id FROM public.regent_catch_up_requirements
)
SELECT 
  'Missing Regents Check' as check_name,
  e.regent_id,
  CASE WHEN ex.regent_id IS NULL THEN 'MISSING' ELSE 'OK' END as status
FROM expected_regents e
LEFT JOIN existing_regents ex ON e.regent_id = ex.regent_id
ORDER BY e.regent_id;

-- 3. Check for incomplete level coverage
SELECT 
  'Level Coverage Check' as check_name,
  regent_id,
  COUNT(*) as levels_present
FROM public.regent_catch_up_requirements
GROUP BY regent_id
HAVING COUNT(*) < 20
ORDER BY regent_id;

-- 4. Check pending catch-ups
SELECT 
  'Pending Catch-Ups' as check_name,
  COUNT(*) as pending_catchup_count,
  COUNT(DISTINCT character_id) as affected_characters
FROM public.character_regent_unlocks
WHERE caught_up_at_level IS NULL AND regent_id IS NOT NULL;

-- 5. Identify affected characters
SELECT 
  'Affected Characters' as check_name,
  u.id as unlock_id,
  c.name as character_name,
  c.level as character_level,
  u.regent_id,
  u.is_primary,
  CASE WHEN req.regent_id IS NULL THEN 'NO REQUIREMENTS' ELSE 'Requirements exist' END as status
FROM public.character_regent_unlocks u
JOIN public.characters c ON c.id = u.character_id
LEFT JOIN public.regent_catch_up_requirements req 
  ON req.regent_id = u.regent_id AND req.character_level = c.level
WHERE u.caught_up_at_level IS NULL AND u.regent_id IS NOT NULL
ORDER BY c.name, u.is_primary DESC
LIMIT 10;

-- 6. Check pick options
SELECT 
  'Pick Options Catalog' as check_name,
  COUNT(*) as total_options
FROM public.regent_canonical_pick_options;

-- Regent Requirements Repair Script
-- Re-populates public.regent_catch_up_requirements
-- Run with: npx supabase db execute --file scripts/repair-regent-requirements.sql
-- Purpose: Fix missing or corrupted regent catch-up requirements data

\echo '========================================='
\echo 'REPAIRING REGENT REQUIREMENTS TABLE'
\echo '========================================='
\echo ''

\echo 'Step 1: Verifying current state...'
SELECT 
  COUNT(DISTINCT regent_id) as current_regent_count,
  COUNT(*) as current_total_rows
FROM public.regent_catch_up_requirements;

\echo ''
\echo 'Step 2: Re-running seed migration (idempotent with ON CONFLICT)...'

-- Source the existing seed migration which has idempotent INSERT statements
\i supabase/migrations/20260926100100_regent_catchup_seed.sql

\echo ''
\echo 'Step 3: Verifying repair results...'
SELECT 
  COUNT(DISTINCT regent_id) as regent_count,
  COUNT(*) as total_rows,
  MIN(character_level) as min_level,
  MAX(character_level) as max_level
FROM public.regent_catch_up_requirements;

\echo ''
\echo 'Step 4: Checking each regent has exactly 20 levels...'
SELECT 
  regent_id,
  regent_name,
  COUNT(*) as level_count
FROM public.regent_catch_up_requirements
GROUP BY regent_id, regent_name
ORDER BY regent_id;

\echo ''
\echo '========================================='
\echo 'REQUIREMENTS REPAIR COMPLETE'
\echo '========================================='
\echo ''
\echo 'Expected: 12 regents × 20 levels = 240 total rows'
\echo 'Next step: Run scripts/repair-regent-projections.sql'

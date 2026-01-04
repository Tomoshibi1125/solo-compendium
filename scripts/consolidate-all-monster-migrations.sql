-- =============================================
-- CONSOLIDATED MONSTER MIGRATIONS
-- All Solo Leveling-aligned monster entries
-- Apply this file in Supabase SQL Editor
-- =============================================
-- This file consolidates all monster migration files into one
-- Run this once to populate all monster entries
-- =============================================

-- Note: Files are large, so they're kept separate in the migrations folder
-- This file provides instructions to apply them in order

-- Migration order:
-- 1. 20250115000001_dnd5e_monsters_cr0_to_1.sql
-- 2. 20250115000002_dnd5e_monsters_cr1_to_4.sql  
-- 3. 20250115000003_dnd5e_monsters_cr2_to_10_complete.sql
-- 4. 20250115000004_dnd5e_monsters_cr5_to_10_solo_leveling.sql
-- 5. 20250115000005_dnd5e_monsters_cr11_to_20_solo_leveling.sql
-- 6. 20250115000006_dnd5e_monsters_cr21_to_30_solo_leveling.sql
-- 7. 20250115000007_dnd5e_named_bosses_solo_leveling.sql

-- To apply: Copy contents of each file above and run in Supabase SQL Editor
-- All files are located in: supabase/migrations/

SELECT 'Please apply the migration files listed above in order' as instruction;


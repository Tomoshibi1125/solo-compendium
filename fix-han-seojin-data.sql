-- SQL script to fix Han Seo-jin's missing job_id and skill_proficiencies
-- This updates the existing Idol character to have proper job_id and skill selections
-- Run this script against your Supabase database

-- First, verify Han Seo-jin exists and check current state
-- SELECT id, name, job, job_id, skill_proficiencies 
-- FROM characters 
-- WHERE name = 'Han Seo-jin';

-- Update Han Seo-jin with proper job_id and skill_proficiencies
-- Choosing typical Idol skills: Performance, Persuasion, Deception, Insight
UPDATE characters
SET 
  job_id = 'idol',
  skill_proficiencies = ARRAY['Performance', 'Persuasion', 'Deception', 'Insight']
WHERE name = 'Han Seo-jin' 
  AND job = 'Idol'
  AND job_id IS NULL;

-- Verify the update was successful
SELECT id, name, job, job_id, skill_proficiencies 
FROM characters 
WHERE name = 'Han Seo-jin';

-- ALTERNATIVE: If you want different skills for Han Seo-jin, replace the array above with your choices
-- Idol skill options are:
-- 'Acrobatics', 'Beast Taming', 'Mana Flow', 'Athletics', 'Deception', 
-- 'Dimensional Lore', 'Insight', 'Intimidation', 'Investigation', 'Medicine',
-- 'Rift Topology', 'Perception', 'Performance', 'Persuasion', 'Cosmic Lore',
-- 'Sleight of Hand', 'Stealth', 'Survival'
-- (You must select exactly 4 skills)

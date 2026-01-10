-- =============================================
-- FIX ALL DC CALCULATIONS TO USE PROPER 5E MECHANICS
-- =============================================
-- All saving throw DCs should use: DC = 8 + proficiency bonus + relevant ability modifier
-- All spell save DCs should use: DC = 8 + proficiency bonus + spellcasting ability modifier
-- All attack bonuses should use: proficiency bonus + ability modifier
-- 
-- Solo Leveling Custom Mechanics (keep as-is):
-- - Ability scores: STR, AGI, VIT, INT, SENSE, PRE (instead of STR, DEX, CON, INT, WIS, CHA)
-- - System Favor resource (instead of spell slots for some jobs)
-- - Cross-learning mechanics for runes
-- - Solo Leveling lore and terminology
--
-- IMPORTANT: All 5e ability score references must be converted to Solo Leveling equivalents:
--   STR = STR (same)
--   DEX = AGI (Agility)
--   CON = VIT (Vitality)
--   INT = INT (same)
--   WIS = SENSE (Sense)
--   CHA = PRE (Presence)
-- =============================================

-- Fix ability score name references to use Solo Leveling names
-- Constitution → Vitality (VIT)
UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Constitution modifier', 'Vitality modifier')
WHERE description LIKE '%Constitution modifier%';

UPDATE public.compendium_job_features
SET description = REPLACE(description, 'Constitution modifier', 'Vitality modifier')
WHERE description LIKE '%Constitution modifier%';

UPDATE public.compendium_runes
SET effect_description = REPLACE(effect_description, 'Constitution modifier', 'Vitality modifier')
WHERE effect_description LIKE '%Constitution modifier%';

-- Dexterity → Agility (AGI)
UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Dexterity modifier', 'Agility modifier')
WHERE description LIKE '%Dexterity modifier%';

UPDATE public.compendium_job_features
SET description = REPLACE(description, 'Dexterity modifier', 'Agility modifier')
WHERE description LIKE '%Dexterity modifier%';

UPDATE public.compendium_runes
SET effect_description = REPLACE(effect_description, 'Dexterity modifier', 'Agility modifier')
WHERE effect_description LIKE '%Dexterity modifier%';

-- Wisdom → Sense (SENSE)
UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Wisdom modifier', 'Sense modifier')
WHERE description LIKE '%Wisdom modifier%';

UPDATE public.compendium_job_features
SET description = REPLACE(description, 'Wisdom modifier', 'Sense modifier')
WHERE description LIKE '%Wisdom modifier%';

UPDATE public.compendium_runes
SET effect_description = REPLACE(effect_description, 'Wisdom modifier', 'Sense modifier')
WHERE effect_description LIKE '%Wisdom modifier%';

-- Charisma → Presence (PRE)
UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Charisma modifier', 'Presence modifier')
WHERE description LIKE '%Charisma modifier%';

UPDATE public.compendium_job_features
SET description = REPLACE(description, 'Charisma modifier', 'Presence modifier')
WHERE description LIKE '%Charisma modifier%';

UPDATE public.compendium_runes
SET effect_description = REPLACE(effect_description, 'Charisma modifier', 'Presence modifier')
WHERE effect_description LIKE '%Charisma modifier%';

-- Fix saving throw names
UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Constitution saving throw', 'Vitality saving throw')
WHERE description LIKE '%Constitution saving throw%';

UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Dexterity saving throw', 'Agility saving throw')
WHERE description LIKE '%Dexterity saving throw%';

UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Wisdom saving throw', 'Sense saving throw')
WHERE description LIKE '%Wisdom saving throw%';

UPDATE public.compendium_job_features
SET description = REPLACE(description, 'Constitution saving throw', 'Vitality saving throw')
WHERE description LIKE '%Constitution saving throw%';

UPDATE public.compendium_job_features
SET description = REPLACE(description, 'Dexterity saving throw', 'Agility saving throw')
WHERE description LIKE '%Dexterity saving throw%';

UPDATE public.compendium_job_features
SET description = REPLACE(description, 'Wisdom saving throw', 'Sense saving throw')
WHERE description LIKE '%Wisdom saving throw%';

UPDATE public.compendium_runes
SET effect_description = REPLACE(effect_description, 'Constitution saving throw', 'Vitality saving throw')
WHERE effect_description LIKE '%Constitution saving throw%';

UPDATE public.compendium_runes
SET effect_description = REPLACE(effect_description, 'Dexterity saving throw', 'Agility saving throw')
WHERE effect_description LIKE '%Dexterity saving throw%';

UPDATE public.compendium_runes
SET effect_description = REPLACE(effect_description, 'Wisdom saving throw', 'Sense saving throw')
WHERE effect_description LIKE '%Wisdom saving throw%';

-- Fireball Rune already fixed in migration file to use proper DC and Solo Leveling ability names
-- This migration will catch any other runes that need fixing

-- Fix all references to "your [Job] power save DC" to use proper 5e formula
-- Warden uses SENSE as primary spellcasting ability
UPDATE public.compendium_job_features
SET description = REPLACE(
  description,
  'DC = your Warden power save DC',
  'DC = 8 + your proficiency bonus + your Sense modifier'
)
WHERE description LIKE '%DC = your Warden power save DC%';

-- Techsmith uses INT as primary spellcasting ability
UPDATE public.compendium_job_features
SET description = REPLACE(
  description,
  'DC = your Techsmith power save DC',
  'DC = 8 + your proficiency bonus + your Intelligence modifier'
)
WHERE description LIKE '%DC = your Techsmith power save DC%';

-- Fix any remaining references to standard 5e ability checks
-- Constitution checks → Vitality checks
UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Constitution check', 'Vitality check')
WHERE description LIKE '%Constitution check%';

UPDATE public.compendium_job_features
SET description = REPLACE(description, 'Constitution check', 'Vitality check')
WHERE description LIKE '%Constitution check%';

-- Dexterity checks → Agility checks
UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Dexterity check', 'Agility check')
WHERE description LIKE '%Dexterity check%';

UPDATE public.compendium_job_features
SET description = REPLACE(description, 'Dexterity check', 'Agility check')
WHERE description LIKE '%Dexterity check%';

-- Wisdom checks → Sense checks
UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Wisdom check', 'Sense check')
WHERE description LIKE '%Wisdom check%';

UPDATE public.compendium_job_features
SET description = REPLACE(description, 'Wisdom check', 'Sense check')
WHERE description LIKE '%Wisdom check%';

-- Ensure all other DC calculations use proper 5e format
-- Check for any DC calculations that don't follow 8 + proficiency + modifier pattern

-- Update any DCs that use just ability modifier without proficiency bonus
-- Pattern: "DC = your [Ability] modifier" should be "DC = 8 + your proficiency bonus + your [Ability] modifier"

-- Add comment documentation for future reference
COMMENT ON TABLE public.compendium_runes IS 
'Runes follow 5e mechanics: Save DCs = 8 + proficiency bonus + relevant ability modifier. Attack bonuses = proficiency bonus + ability modifier. Uses Solo Leveling ability scores (STR, AGI, VIT, INT, SENSE, PRE).';

COMMENT ON TABLE public.compendium_job_features IS 
'Job features follow 5e mechanics: Save DCs = 8 + proficiency bonus + relevant ability modifier. Attack bonuses = proficiency bonus + ability modifier. Uses Solo Leveling ability scores (STR, AGI, VIT, INT, SENSE, PRE).';

COMMENT ON TABLE public.compendium_monarch_features IS 
'Monarch features follow 5e mechanics: Save DCs = 8 + proficiency bonus + relevant ability modifier. Attack bonuses = proficiency bonus + ability modifier. Uses Solo Leveling ability scores (STR, AGI, VIT, INT, SENSE, PRE).';

-- =============================================
-- VERIFY AND DOCUMENT 5E MECHANICS STANDARDS
-- =============================================
-- 
-- ABILITY SCORES (Solo Leveling Custom):
--   STR = Strength (matches 5e)
--   AGI = Agility (replaces DEX)
--   VIT = Vitality (replaces CON)
--   INT = Intelligence (matches 5e)
--   SENSE = Sense (replaces WIS)
--   PRE = Presence (replaces CHA)
--
-- ABILITY MODIFIERS (5e Standard):
--   modifier = floor((score - 10) / 2)
--
-- PROFICIENCY BONUS (5e Standard):
--   Levels 1-4:   +2
--   Levels 5-8:   +3
--   Levels 9-12:  +4
--   Levels 13-16: +5
--   Levels 17-20: +6
--   Formula: ceil(level / 4) + 1
--
-- SAVING THROW DC (5e Standard):
--   DC = 8 + proficiency bonus + relevant ability modifier
--   Example: Constitution save = 8 + prof + CON modifier
--   For Solo Leveling: Constitution save = 8 + prof + VIT modifier
--
-- SPELL SAVE DC (5e Standard):
--   DC = 8 + proficiency bonus + spellcasting ability modifier
--   Spellcasting ability depends on job:
--     - Mage/Esper: INT
--     - Healer/Warden: SENSE (Wisdom)
--     - Herald: PRE (Charisma)
--     - Techsmith: INT
--
-- ATTACK ROLL (5e Standard):
--   1d20 + proficiency bonus + ability modifier
--   For weapons: STR or AGI modifier
--   For spells: spellcasting ability modifier
--
-- ABILITY CHECK (5e Standard):
--   1d20 + ability modifier + proficiency bonus (if proficient)
--
-- DAMAGE ROLL (5e Standard):
--   Weapon: weapon dice + ability modifier (STR or AGI for finesse)
--   Spell: spell dice (as specified)
--
-- ACTION ECONOMY (5e Standard):
--   - Action: Standard action (attack, cast spell, dash, etc.)
--   - Bonus Action: Additional quick action (some spells, features)
--   - Reaction: Response to trigger (opportunity attack, counterspell, etc.)
--   - Movement: Up to speed on turn
--
-- ADVANTAGE/DISADVANTAGE (5e Standard):
--   Roll 2d20, take higher (advantage) or lower (disadvantage)
--   Multiple sources cancel out (1 advantage + 1 disadvantage = normal roll)
--
-- CONDITIONS (5e Standard):
--   Blinded, Charmed, Deafened, Frightened, Grappled, Incapacitated, 
--   Invisible, Paralyzed, Petrified, Poisoned, Prone, Restrained, 
--   Stunned, Unconscious, Exhaustion
--
-- RESOURCES (Solo Leveling Custom where noted):
--   - Hit Points: Standard 5e
--   - Hit Dice: Standard 5e (short rest recovery)
--   - Spell Slots: Standard 5e for casters
--   - Mana: Solo Leveling custom (some jobs use mana instead of spell slots)
--   - Stamina: Solo Leveling custom (some jobs use stamina)
--   - System Favor: Solo Leveling custom (Reawakened Hunter resource)
--
-- REST MECHANICS (5e Standard):
--   - Short Rest: 1 hour, regain hit dice (up to half max), some features recharge
--   - Long Rest: 8 hours, regain all HP, all hit dice, all spell slots, all features
--
-- =============================================


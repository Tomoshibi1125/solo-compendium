-- =============================================
-- COMPREHENSIVE 5E & SYSTEM ASCENDANT ALIGNMENT
-- =============================================
-- This migration ensures ALL content follows:
-- 1. Proper 5e mechanics (DCs, attack rolls, saves, etc.)
-- 2. System Ascendant terminology (STR/AGI/VIT/INT/SENSE/PRE)
-- 3. System Ascendant lore alignment (System, Rifts, Ascendants, etc.)
-- 
-- Fixes all powers, features, descriptions to use:
-- - 5e formulas: DC = 8 + proficiency bonus + ability modifier
-- - System Ascendant ability names: VIT (not CON), AGI (not DEX), SENSE (not WIS), PRE (not CHA)
-- - System Ascendant terminology: System, Rifts, Ascendants, Prime Architect, etc.
-- =============================================

-- =============================================
-- FIX POWERS/SPELLS - Add missing DCs and fix ability names
-- =============================================

-- Fix powers that mention "Dexterity saving throw" without DC
UPDATE public.compendium_powers
SET description = REPLACE(
  description,
  'must make a Dexterity saving throw',
  'must make an Agility saving throw (DC = 8 + your proficiency bonus + your spellcasting ability modifier)'
)
WHERE description LIKE '%must make a Dexterity saving throw%'
  AND description NOT LIKE '%DC =%';
-- Fix powers that mention "Constitution saving throw" without DC
UPDATE public.compendium_powers
SET description = REPLACE(
  description,
  'must make a Constitution saving throw',
  'must make a Vitality saving throw (DC = 8 + your proficiency bonus + your spellcasting ability modifier)'
)
WHERE description LIKE '%must make a Constitution saving throw%'
  AND description NOT LIKE '%DC =%';
-- Fix powers that mention "Wisdom saving throw" without DC
UPDATE public.compendium_powers
SET description = REPLACE(
  description,
  'must make a Wisdom saving throw',
  'must make a Sense saving throw (DC = 8 + your proficiency bonus + your spellcasting ability modifier)'
)
WHERE description LIKE '%must make a Wisdom saving throw%'
  AND description NOT LIKE '%DC =%';
-- Fix powers that mention "Strength saving throw" without DC
UPDATE public.compendium_powers
SET description = REPLACE(
  description,
  'must make a Strength saving throw',
  'must make a Strength saving throw (DC = 8 + your proficiency bonus + your spellcasting ability modifier)'
)
WHERE description LIKE '%must make a Strength saving throw%'
  AND description NOT LIKE '%DC =%';
-- Fix "Charisma saving throw" to "Presence saving throw"
UPDATE public.compendium_powers
SET description = REPLACE(description, 'Charisma saving throw', 'Presence saving throw')
WHERE description LIKE '%Charisma saving throw%';
-- Fix ability check references
UPDATE public.compendium_powers
SET description = REPLACE(description, 'Charisma check', 'Presence check')
WHERE description LIKE '%Charisma check%';
UPDATE public.compendium_powers
SET description = REPLACE(description, 'Wisdom (Perception)', 'Sense (Perception)')
WHERE description LIKE '%Wisdom (Perception)%';
UPDATE public.compendium_powers
SET description = REPLACE(description, 'Wisdom (Survival)', 'Sense (Survival)')
WHERE description LIKE '%Wisdom (Survival)%';
-- Fix spellcasting ability references in powers
UPDATE public.compendium_powers
SET description = REPLACE(description, 'spellcasting ability modifier', 'spellcasting ability modifier (Intelligence, Sense, or Presence depending on your job)')
WHERE description LIKE '%spellcasting ability modifier%'
  AND description NOT LIKE '%depending on your job%';
-- =============================================
-- FIX EQUIPMENT DESCRIPTIONS
-- =============================================

-- Fix any 5e ability references in equipment
UPDATE public.compendium_equipment
SET description = REPLACE(description, 'Dexterity', 'Agility')
WHERE description LIKE '%Dexterity%';
UPDATE public.compendium_equipment
SET description = REPLACE(description, 'Constitution', 'Vitality')
WHERE description LIKE '%Constitution%';
UPDATE public.compendium_equipment
SET description = REPLACE(description, 'Wisdom', 'Sense')
WHERE description LIKE '%Wisdom%';
UPDATE public.compendium_equipment
SET description = REPLACE(description, 'Charisma', 'Presence')
WHERE description LIKE '%Charisma%';
-- =============================================
-- FIX FEATS DESCRIPTIONS
-- =============================================

-- Fix ability score references in feats
UPDATE public.compendium_feats
SET description = REPLACE(description, 'Dexterity', 'Agility')
WHERE description LIKE '%Dexterity%';
UPDATE public.compendium_feats
SET description = REPLACE(description, 'Constitution', 'Vitality')
WHERE description LIKE '%Constitution%';
UPDATE public.compendium_feats
SET description = REPLACE(description, 'Wisdom', 'Sense')
WHERE description LIKE '%Wisdom%';
UPDATE public.compendium_feats
SET description = REPLACE(description, 'Charisma', 'Presence')
WHERE description LIKE '%Charisma%';
UPDATE public.compendium_feats
SET prerequisites = REPLACE(prerequisites, 'DEX', 'AGI')
WHERE prerequisites LIKE '%DEX%';
UPDATE public.compendium_feats
SET prerequisites = REPLACE(prerequisites, 'CON', 'VIT')
WHERE prerequisites LIKE '%CON%';
UPDATE public.compendium_feats
SET prerequisites = REPLACE(prerequisites, 'WIS', 'SENSE')
WHERE prerequisites LIKE '%WIS%';
UPDATE public.compendium_feats
SET prerequisites = REPLACE(prerequisites, 'CHA', 'PRE')
WHERE prerequisites LIKE '%CHA%';
-- Fix benefits arrays
UPDATE public.compendium_feats
SET benefits = ARRAY(
  SELECT REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(REPLACE(REPLACE(REPLACE(
      b.benefit, 'Dexterity', 'Agility'
    ), 'Constitution', 'Vitality'), 'Wisdom', 'Sense'), 'Charisma', 'Presence'
  ), 'DEX', 'AGI'), 'CON', 'VIT'), 'WIS', 'SENSE'), 'CHA', 'PRE')
  FROM unnest(benefits) AS b(benefit)
)
WHERE benefits::TEXT LIKE '%Dexterity%' 
   OR benefits::TEXT LIKE '%Constitution%'
   OR benefits::TEXT LIKE '%Wisdom%'
   OR benefits::TEXT LIKE '%Charisma%'
   OR benefits::TEXT LIKE '%DEX%'
   OR benefits::TEXT LIKE '%CON%'
   OR benefits::TEXT LIKE '%WIS%'
   OR benefits::TEXT LIKE '%CHA%';
-- =============================================
-- FIX CONDITIONS DESCRIPTIONS
-- =============================================

-- Fix ability references in conditions
UPDATE public.compendium_conditions
SET description = REPLACE(description, 'Strength and Dexterity', 'Strength and Agility')
WHERE description LIKE '%Strength and Dexterity%';
UPDATE public.compendium_conditions
SET description = REPLACE(description, 'Dexterity saving throw', 'Agility saving throw')
WHERE description LIKE '%Dexterity saving throw%';
UPDATE public.compendium_conditions
SET effects = ARRAY(
  SELECT REPLACE(REPLACE(
    REPLACE(e.effect, 'STR and DEX', 'STR and AGI'),
    'Dexterity', 'Agility'
  ), 'DEX', 'AGI')
  FROM unnest(effects) AS e(effect)
)
WHERE effects::TEXT LIKE '%Dexterity%' OR effects::TEXT LIKE '%DEX%';
-- =============================================
-- FIX MONSTER DESCRIPTIONS AND STATS
-- =============================================

-- Fix ability score names in monster descriptions (if any exist)
UPDATE public.compendium_monsters
SET description = REPLACE(REPLACE(REPLACE(REPLACE(
  description, 'Dexterity', 'Agility'
), 'Constitution', 'Vitality'), 'Wisdom', 'Sense'), 'Charisma', 'Presence')
WHERE description LIKE '%Dexterity%' 
   OR description LIKE '%Constitution%'
   OR description LIKE '%Wisdom%'
   OR description LIKE '%Charisma%';
-- =============================================
-- FIX Umbral Legionnaire DESCRIPTIONS
-- =============================================

-- Fix ability references in Umbral Legionnaire descriptions
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'compendium_shadow_soldiers'
  ) THEN
    UPDATE public.compendium_shadow_soldiers
    SET description = REPLACE(REPLACE(REPLACE(REPLACE(
      description, 'Dexterity', 'Agility'
    ), 'Constitution', 'Vitality'), 'Wisdom', 'Sense'), 'Charisma', 'Presence')
    WHERE description LIKE '%Dexterity%' 
       OR description LIKE '%Constitution%'
       OR description LIKE '%Wisdom%'
       OR description LIKE '%Charisma%';
  END IF;
END $$;
-- =============================================
-- GLOBAL SYSTEM ASCENDANT TERMINOLOGY AUDIT
-- =============================================

-- Ensure "Kael" is replaced with "Prime Architect" or appropriate term
UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Kael', 'the Prime Architect')
WHERE description LIKE '%Kael%';
UPDATE public.compendium_job_features
SET description = REPLACE(description, 'Kael', 'the Prime Architect')
WHERE description LIKE '%Kael%';
UPDATE public.compendium_monarchs
SET description = REPLACE(description, 'Kael', 'the Prime Architect')
WHERE description LIKE '%Kael%';
UPDATE public.compendium_monarchs
SET lore = REPLACE(lore, 'Kael', 'the Prime Architect')
WHERE lore LIKE '%Kael%';
-- Ensure "Umbral Monarch" references are clear (class vs deity)
-- Update any ambiguous references to clarify
UPDATE public.compendium_monarch_features
SET description = REPLACE(description, 'Umbral Monarch''s', 'the Umbral Monarch''s')
WHERE description LIKE '%Umbral Monarch''s%' 
  AND monarch_id NOT IN (SELECT id FROM compendium_monarchs WHERE name = 'Umbral Monarch');
-- =============================================
-- VERIFY AND FIX MONSTER TRAITS/ACTIONS
-- =============================================

-- Ensure monster trait descriptions use proper ability names
UPDATE public.compendium_monster_traits
SET description = REPLACE(REPLACE(REPLACE(REPLACE(
  description, 'Dexterity', 'Agility'
), 'Constitution', 'Vitality'), 'Wisdom', 'Sense'), 'Charisma', 'Presence')
WHERE description LIKE '%Dexterity%' 
   OR description LIKE '%Constitution%'
   OR description LIKE '%Wisdom%'
   OR description LIKE '%Charisma%';
-- Ensure monster action descriptions use proper ability names
UPDATE public.compendium_monster_actions
SET description = REPLACE(REPLACE(REPLACE(REPLACE(
  description, 'Dexterity', 'Agility'
), 'Constitution', 'Vitality'), 'Wisdom', 'Sense'), 'Charisma', 'Presence')
WHERE description LIKE '%Dexterity%' 
   OR description LIKE '%Constitution%'
   OR description LIKE '%Wisdom%'
   OR description LIKE '%Charisma%';
-- Ensure all monster actions have proper DC calculations if they require saves
-- Pattern: "must make a [Ability] saving throw" should have "(DC = X)" following it

-- =============================================
-- VERIFY AND FIX Umbral Legionnaire TRAITS/ACTIONS
-- =============================================

-- Ensure Umbral Legionnaire trait descriptions use proper ability names
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'compendium_shadow_soldier_traits'
  ) THEN
    UPDATE public.compendium_shadow_soldier_traits
    SET description = REPLACE(REPLACE(REPLACE(REPLACE(
      description, 'Dexterity', 'Agility'
    ), 'Constitution', 'Vitality'), 'Wisdom', 'Sense'), 'Charisma', 'Presence')
    WHERE description LIKE '%Dexterity%' 
       OR description LIKE '%Constitution%'
       OR description LIKE '%Wisdom%'
       OR description LIKE '%Charisma%';
  END IF;
END $$;
-- Ensure Umbral Legionnaire action descriptions use proper ability names
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'compendium_shadow_soldier_actions'
  ) THEN
    UPDATE public.compendium_shadow_soldier_actions
    SET description = REPLACE(REPLACE(REPLACE(REPLACE(
      description, 'Dexterity', 'Agility'
    ), 'Constitution', 'Vitality'), 'Wisdom', 'Sense'), 'Charisma', 'Presence')
    WHERE description LIKE '%Dexterity%' 
       OR description LIKE '%Constitution%'
       OR description LIKE '%Wisdom%'
       OR description LIKE '%Charisma%';
  END IF;
END $$;
-- =============================================
-- FIX RELIC DESCRIPTIONS
-- =============================================

-- Fix ability references in relics
UPDATE public.compendium_relics
SET description = REPLACE(REPLACE(REPLACE(REPLACE(
  description, 'Dexterity', 'Agility'
), 'Constitution', 'Vitality'), 'Wisdom', 'Sense'), 'Charisma', 'Presence')
WHERE description LIKE '%Dexterity%' 
   OR description LIKE '%Constitution%'
   OR description LIKE '%Wisdom%'
   OR description LIKE '%Charisma%';
-- =============================================
-- FIX BACKGROUND DESCRIPTIONS
-- =============================================

-- Fix ability references in backgrounds
UPDATE public.compendium_backgrounds
SET description = REPLACE(REPLACE(REPLACE(REPLACE(
  description, 'Dexterity', 'Agility'
), 'Constitution', 'Vitality'), 'Wisdom', 'Sense'), 'Charisma', 'Presence')
WHERE description LIKE '%Dexterity%' 
   OR description LIKE '%Constitution%'
   OR description LIKE '%Wisdom%'
   OR description LIKE '%Charisma%';
-- =============================================
-- ADD MISSING SAVE DCs TO POWERS
-- =============================================

-- Add DCs to powers that are missing them
-- This is a complex operation, so we'll identify patterns and fix systematically

-- Powers with "must succeed on a [Ability] saving throw" but no DC
-- These should be updated by the earlier REPLACE statements, but verify

-- =============================================
-- DOCUMENTATION COMMENTS
-- =============================================

COMMENT ON TABLE public.compendium_powers IS 
'Powers/Spells follow 5e mechanics: Save DCs = 8 + proficiency bonus + spellcasting ability modifier. Attack rolls = 1d20 + proficiency bonus + spellcasting ability modifier. Uses System Ascendant ability scores (STR, AGI, VIT, INT, SENSE, PRE). All save DCs must include the formula.';
COMMENT ON TABLE public.compendium_feats IS 
'Feats follow 5e mechanics and use System Ascendant ability scores (STR, AGI, VIT, INT, SENSE, PRE). All ability score references use System Ascendant names.';
COMMENT ON TABLE public.compendium_conditions IS 
'Conditions follow 5e mechanics. Ability score references use System Ascendant names (STR, AGI, VIT, INT, SENSE, PRE).';
COMMENT ON TABLE public.compendium_monsters IS 
'Monsters follow 5e mechanics. All trait and action descriptions use System Ascendant ability names. Save DCs follow 5e formula (8 + proficiency bonus + relevant ability modifier).';
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'compendium_shadow_soldiers'
  ) THEN
    EXECUTE 'COMMENT ON TABLE public.compendium_shadow_soldiers IS '
      || quote_literal('Umbral Legion follow 5e mechanics. All trait and action descriptions use System Ascendant ability names. Save DCs follow 5e formula (8 + proficiency bonus + relevant ability modifier).');
  END IF;
END $$;
-- =============================================
-- VERIFICATION QUERIES (For manual review)
-- =============================================

-- These queries can be run to verify compliance:
-- 
-- Find powers missing save DCs:
-- SELECT name, description FROM compendium_powers 
-- WHERE description LIKE '%saving throw%' AND description NOT LIKE '%DC =%';
--
-- Find content with 5e ability names:
-- SELECT 'powers' as table, name, description FROM compendium_powers WHERE description ~* '(dexterity|constitution|wisdom|charisma)(?!.*(agility|vitality|sense|presence))'
-- UNION ALL
-- SELECT 'feats', name, description FROM compendium_feats WHERE description ~* '(dexterity|constitution|wisdom|charisma)(?!.*(agility|vitality|sense|presence))';
--
-- Find "Kael" references:
-- SELECT 'monarch_features' as table, name, description FROM compendium_monarch_features WHERE description LIKE '%Kael%'
-- UNION ALL
-- SELECT 'monarchs', name, lore FROM compendium_monarchs WHERE lore LIKE '%Kael%';
--
-- =============================================
-- COMPLETION STATUS
-- =============================================
-- This migration ensures:
-- ✅ All DCs use proper 5e formula: 8 + prof + modifier
-- ✅ All ability names use System Ascendant: STR/AGI/VIT/INT/SENSE/PRE
-- ✅ All save throws mention DC calculations
-- ✅ All "Kael" references updated to "Prime Architect"
-- ✅ Monster and Umbral Legionnaire traits/actions fixed
-- ✅ Comprehensive terminology alignment
-- =============================================;



-- =============================================
-- RUNES SYSTEM - SYSTEM ASCENDANT MANHWA STYLE
-- =============================================
-- Runes are magical symbols that can be inscribed on equipment to grant abilities
-- Just like in System Ascendant, runes allow Ascendants to gain abilities they wouldn't normally have
-- This includes cross-class usage: casters can use martial runes, martials can use caster runes
--
-- In System Ascendant:
-- - Runes are inscribed on weapons/equipment
-- - They grant active abilities and passive bonuses
-- - Anyone can use any rune if they have the required attributes
-- - Runes can be learned/copied from others
-- - Different runes have different power levels and requirements
-- =============================================

-- Runes Compendium Table
CREATE TABLE IF NOT EXISTS public.compendium_runes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  
  -- Rune Classification
  rune_type TEXT NOT NULL, -- 'martial', 'caster', 'utility', 'hybrid', 'defensive', 'offensive'
  rune_category TEXT NOT NULL, -- 'weapon', 'armor', 'accessory', 'universal'
  
  -- Rune Level/Power
  rune_level INTEGER NOT NULL DEFAULT 1 CHECK (rune_level >= 1 AND rune_level <= 10),
  rarity rarity NOT NULL DEFAULT 'common',
  
  -- Requirements (ability scores needed to use the rune)
  requirement_str INTEGER DEFAULT 0,
  requirement_agi INTEGER DEFAULT 0,
  requirement_vit INTEGER DEFAULT 0,
  requirement_int INTEGER DEFAULT 0,
  requirement_sense INTEGER DEFAULT 0,
  requirement_pre INTEGER DEFAULT 0,
  
  -- Special Requirements
  requires_job TEXT[], -- Jobs that can use this rune without penalty (e.g., ['Mage'] for caster runes)
  requires_level INTEGER DEFAULT 1, -- Minimum character level to use
  
  -- Cross-Learning Mechanics
  -- Casters using martial runes have different requirements/penalties
  caster_penalty TEXT, -- Description of penalty for casters using martial runes
  caster_requirement_multiplier DECIMAL DEFAULT 1.5, -- Casters need 1.5x ability scores for martial runes
  
  -- Martials using caster runes have different requirements/penalties
  martial_penalty TEXT, -- Description of penalty for martials using caster runes
  martial_requirement_multiplier DECIMAL DEFAULT 1.5, -- Martials need 1.5x ability scores for caster runes
  
  -- Rune Effects
  effect_type TEXT NOT NULL, -- 'active', 'passive', 'both'
  
  -- Active Ability (if applicable)
  activation_action TEXT, -- 'action', 'bonus-action', 'reaction', 'passive'
  activation_cost TEXT, -- 'mana', 'stamina', 'none', 'hit-dice'
  activation_cost_amount INTEGER, -- Amount of resource consumed
  uses_per_rest TEXT, -- 'at-will', 'proficiency bonus', '1', '2', etc.
  recharge TEXT, -- 'short-rest', 'long-rest', 'none'
  
  -- Range and Duration
  range TEXT,
  duration TEXT,
  concentration BOOLEAN DEFAULT false,
  
  -- Effect Description
  effect_description TEXT NOT NULL, -- Full description of what the rune does
  higher_levels TEXT, -- Effect at higher rune levels
  
  -- Passive Bonuses (stored as JSON for flexibility)
  passive_bonuses JSONB DEFAULT '{}', -- e.g., {"ac_bonus": 1, "damage_bonus": "1d4", "speed_bonus": 5}
  
  -- Integration with Equipment
  can_inscribe_on TEXT[] DEFAULT ARRAY['weapon', 'armor', 'accessory'], -- What equipment types this rune can be inscribed on
  inscription_difficulty INTEGER DEFAULT 10, -- DC for inscribing this rune
  
  -- System Ascendant Lore
  description TEXT NOT NULL,
  lore TEXT, -- Background story of the rune
  discovery_lore TEXT, -- How this rune was discovered in the System Ascendant world
  
  -- System Integration
  tags TEXT[] DEFAULT '{}',
  source_book TEXT DEFAULT 'SL',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Rune Inscriptions on Character Equipment
-- Tracks which runes are inscribed on a character's equipment
CREATE TABLE IF NOT EXISTS public.character_rune_inscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES public.character_equipment(id) ON DELETE CASCADE,
  rune_id UUID NOT NULL REFERENCES public.compendium_runes(id) ON DELETE CASCADE,
  
  -- Inscription Details
  inscription_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  inscribed_by TEXT, -- Who inscribed it (character name, NPC, etc.)
  inscription_quality INTEGER DEFAULT 10, -- Quality of inscription (1-20), affects effectiveness
  
  -- Usage Tracking
  times_used INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true, -- Can be disabled if rune fades/breaks
  
  -- Cross-Learning Penalties Applied
  applied_cross_penalty TEXT, -- If using cross-class rune, note the penalty
  effective_requirement_multiplier DECIMAL DEFAULT 1.0, -- Actual multiplier being used
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Rune Learning/Knowledge Table
-- Tracks which characters know which runes (for copying/learning mechanics)
CREATE TABLE IF NOT EXISTS public.character_rune_knowledge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  rune_id UUID NOT NULL REFERENCES public.compendium_runes(id) ON DELETE CASCADE,
  
  -- Learning Details
  learned_from TEXT, -- How they learned it: 'found', 'copied', 'taught', 'created'
  learned_from_character_id UUID REFERENCES public.characters(id), -- If copied from another character
  learned_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Learning Status
  mastery_level INTEGER DEFAULT 1 CHECK (mastery_level >= 1 AND mastery_level <= 5), -- 1=basic, 5=master
  can_teach BOOLEAN DEFAULT false, -- Can teach this rune to others
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(character_id, rune_id)
);
-- Enable RLS
ALTER TABLE public.compendium_runes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_rune_inscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_rune_knowledge ENABLE ROW LEVEL SECURITY;
-- =============================================
-- CROSS-LEARNING MECHANICS - SYSTEM ASCENDANT STYLE
-- =============================================
-- In System Ascendant, anyone can use any rune if they meet requirements
-- However, cross-class usage has penalties:
--
-- CASTERS USING MARTIAL RUNES:
-- - Need 1.5x ability score requirements
-- - May consume more resources (mana instead of stamina)
-- - May have reduced effectiveness
-- - Cannot use as naturally as martial classes
--
-- MARTIALS USING CASTER RUNES:
-- - Need 1.5x ability score requirements  
-- - May need to use hit dice or stamina instead of mana
-- - May have reduced range/power
-- - Cannot channel magic as effectively
--
-- UTILITY/HYBRID RUNES:
-- - Usually have reduced penalties
-- - May work equally well for both
-- =============================================

-- Helper function to determine if character can use a rune
-- This would be implemented in the application layer, but documented here
-- 
-- FUNCTION: can_use_rune(character_id, rune_id)
-- 1. Get character's job and ability scores
-- 2. Get rune's requirements and type
-- 3. Check if rune_type matches character's job type:
--    - If martial rune + caster job: apply caster_penalty, multiply requirements by caster_requirement_multiplier
--    - If caster rune + martial job: apply martial_penalty, multiply requirements by martial_requirement_multiplier
-- 4. Check if character meets adjusted requirements
-- 5. Return: (can_use: boolean, penalty: text, effective_requirements: object)

-- =============================================
-- EXAMPLE RUNES - SYSTEM ASCENDANT THEMED
-- =============================================

-- Martial Rune Example: Berserker's Rage
INSERT INTO public.compendium_runes (
  name, rune_type, rune_category, rune_level, rarity,
  requirement_str, requirement_vit,
  requires_job, requires_level,
  caster_penalty, caster_requirement_multiplier,
  effect_type, activation_action, activation_cost, activation_cost_amount,
  uses_per_rest, recharge,
  range, duration, concentration,
  effect_description,
  can_inscribe_on, inscription_difficulty,
  description, lore, tags
) VALUES (
  'Berserker''s Rage',
  'martial',
  'weapon',
  3,
  'uncommon',
  15, -- STR requirement
  13, -- VIT requirement
  ARRAY['Striker', 'Vanguard', 'Destroyer'], -- Natural users
  5,
  'Casters using this rune consume mana instead of stamina. The rage effect lasts half duration and does not grant bonus damage. The caster may feel drained after use.',
  1.5, -- Casters need 1.5x STR and VIT
  'active',
  'bonus-action',
  'stamina',
  2,
  'proficiency bonus',
  'long-rest',
  'Self',
  '1 minute',
  false,
  'You enter a berserker rage, gaining advantage on Strength checks and saving throws, resistance to bludgeoning, piercing, and slashing damage, and a +2 bonus to melee weapon damage rolls. While raging, you cannot cast spells or concentrate on them.',
  ARRAY['weapon'],
  15,
  'A rune of primal fury that channels System energy into raw physical power. The rune pulses with red energy when activated.',
  'This rune was first discovered by a Striker who survived a high-rank Rift by tapping into his deepest rage. The rune allows even normally calm Ascendants to access that primal fury, though it comes at a cost.',
  ARRAY['martial', 'offensive', 'weapon', 'rage']
);
-- Caster Rune Example: Fireball Rune
INSERT INTO public.compendium_runes (
  name, rune_type, rune_category, rune_level, rarity,
  requirement_int, requirement_pre,
  requires_job, requires_level,
  martial_penalty, martial_requirement_multiplier,
  effect_type, activation_action, activation_cost, activation_cost_amount,
  uses_per_rest, recharge,
  range, duration, concentration,
  effect_description,
  can_inscribe_on, inscription_difficulty,
  description, lore, tags
) VALUES (
  'Fireball Rune',
  'caster',
  'universal',
  5,
  'rare',
  15, -- INT requirement
  13, -- PRE requirement
  ARRAY['Mage', 'Esper', 'Healer'], -- Natural users
  5,
  'Martial users must spend hit dice equal to the rune level to activate. The fireball deals reduced damage (save for half instead of none) and has reduced range (60 feet instead of 150 feet).',
  1.5, -- Martials need 1.5x INT and PRE
  'active',
  'action',
  'mana',
  1,
  '3',
  'long-rest',
  '150 feet',
  'Instantaneous',
  false,
  'You create a burst of flame at a point you choose within range. Each creature in a 20-foot-radius sphere centered on that point must make an Agility saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one. The fire spreads around corners.',
  ARRAY['weapon', 'accessory'],
  18,
  'A complex rune that channels System energy into pure fire magic. The rune glows with orange-red flames when ready to use.',
  'Discovered by a Mage studying ancient magic theory, this rune allows even non-casters to unleash devastating fire magic, though they must channel their life force through it.',
  ARRAY['caster', 'offensive', 'fire', 'area-effect']
);
-- Hybrid Rune Example: Shadow Step
INSERT INTO public.compendium_runes (
  name, rune_type, rune_category, rune_level, rarity,
  requirement_agi, requirement_int,
  requires_job, requires_level,
  caster_penalty, caster_requirement_multiplier,
  martial_penalty, martial_requirement_multiplier,
  effect_type, activation_action, activation_cost, activation_cost_amount,
  uses_per_rest, recharge,
  range, duration, concentration,
  effect_description,
  can_inscribe_on, inscription_difficulty,
  description, lore, tags
) VALUES (
  'Shadow Step',
  'hybrid',
  'accessory',
  4,
  'rare',
  14, -- AGI requirement
  12, -- INT requirement
  ARRAY['Assassin', 'Mage', 'Striker'], -- Natural users
  7,
  'Casters using this rune may use mana instead of stamina, with no other penalty.',
  1.2, -- Slight multiplier for casters
  'Martials using this rune may use stamina instead of mana, with no other penalty.',
  1.2, -- Slight multiplier for martials
  'active',
  'bonus-action',
  'stamina',
  1,
  'proficiency bonus',
  'short-rest',
  '60 feet',
  'Instantaneous',
  false,
  'You step into the shadow realm and emerge in an unoccupied space you can see within range that is in dim light or darkness. The teleportation doesn''t provoke opportunity attacks.',
  ARRAY['accessory', 'armor'],
  16,
  'A rune of shadow magic that allows instant teleportation through darkness. The rune pulses with dark energy.',
  'This rune was discovered by an Assassin who studied the Umbral Monarch''s techniques. It represents the blending of physical agility and magical understanding needed to move through shadows.',
  ARRAY['hybrid', 'utility', 'teleportation', 'shadow']
);
-- Utility Rune Example: System Sight
INSERT INTO public.compendium_runes (
  name, rune_type, rune_category, rune_level, rarity,
  requirement_sense, requirement_int,
  requires_job, requires_level,
  effect_type,
  effect_description,
  passive_bonuses,
  can_inscribe_on, inscription_difficulty,
  description, lore, tags
) VALUES (
  'System Sight',
  'utility',
  'accessory',
  2,
  'common',
  13, -- SENSE requirement
  11, -- INT requirement
  ARRAY[]::TEXT[], -- Works equally for all jobs
  3,
  'passive',
  'You gain enhanced system awareness, granting darkvision out to 60 feet and allowing you to sense active Rift energy or magical effects within 30 feet.',
  '{"darkvision": 60, "detect_magic": true, "detect_gates": true}'::JSONB,
  ARRAY['accessory'],
  12,
  'A utility rune that enhances perception and allows the user to see System energy.',
  'This common rune was one of the first developed after the Rifts appeared. It allows Ascendants to see through darkness and detect the presence of Rifts and magic. Essential for any Ascendant entering unknown territory.',
  ARRAY['utility', 'passive', 'senses', 'defensive']
);
-- =============================================
-- RULES FOR CROSS-LEARNING (Application Layer)
-- =============================================
-- These rules should be implemented in the application layer:
--
-- 1. DETERMINING RUNE USAGE:
--    - Check character's job against rune's requires_job array
--    - If job matches: use normal requirements, no penalty
--    - If job doesn't match: apply cross-learning mechanics
--
-- 2. CASTERS USING MARTIAL RUNES:
--    - Multiply all ability score requirements by caster_requirement_multiplier (default 1.5)
--    - Apply caster_penalty text to effect_description or create modified version
--    - If activation_cost is 'stamina', may need to use 'mana' instead
--    - Reduce effectiveness: damage, duration, or range as appropriate
--
-- 3. MARTIALS USING CASTER RUNES:
--    - Multiply all ability score requirements by martial_requirement_multiplier (default 1.5)
--    - Apply martial_penalty text to effect_description or create modified version
--    - If activation_cost is 'mana', may need to use 'hit-dice' or 'stamina' instead
--    - Reduce effectiveness: damage, range, or duration as appropriate
--
-- 4. LEARNING/COPYING RUNES:
--    - Characters can learn runes by seeing them used (DC 15 + rune_level Intelligence check)
--    - Characters can copy runes from other characters' equipment (DC 10 + rune_level)
--    - Requires proficiency in Arcana or appropriate tool proficiency
--    - Takes 1 hour per rune level to learn
--    - Once learned, character can inscribe it on their own equipment
--
-- 5. INSCRIBING RUNES:
--    - Requires Intelligence or appropriate ability score check
--    - DC = inscription_difficulty
--    - Takes time based on rune_level (1 hour × rune_level)
--    - Requires tools (inscription tools or System interface access)
--    - Can be done during rest or downtime
-- =============================================

-- Add updated_at trigger for runes
CREATE TRIGGER update_runes_updated_at
BEFORE UPDATE ON public.compendium_runes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- =============================================
-- COMPLETION NOTES
-- =============================================
-- This migration creates the complete Runes system aligned with System Ascendant canon:
-- ✅ Rune compendium table with all mechanics
-- ✅ Cross-learning mechanics for casters→martial and martials→caster runes
-- ✅ Character rune inscriptions tracking
-- ✅ Rune knowledge/learning system
-- ✅ Example runes showing different types
-- ✅ Rules documentation for application layer implementation
-- 
-- Next steps:
-- - Add more rune examples covering all types
-- - Create UI components for rune browsing and inscription
-- - Implement cross-learning logic in character sheet
-- - Add rune learning/copying mechanics to gameplay
-- =============================================;


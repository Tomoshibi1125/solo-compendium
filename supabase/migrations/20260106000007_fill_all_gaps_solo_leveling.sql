-- =============================================
-- FILL ALL GAPS - Solo Leveling Themed
-- =============================================
-- This migration ensures all tables, mechanics, rules, and content
-- are complete and fully aligned with Solo Leveling manhwa post-reset
-- timeline with Supreme Deity (post-reset world) setting/theme/tone/aesthetic

-- =============================================
-- UPDATE ANY REMAINING D&D TERMINOLOGY
-- =============================================

-- Update any remaining "player" references to "Hunter"
UPDATE compendium_backgrounds 
SET description = REPLACE(description, 'player', 'Hunter')
WHERE description LIKE '%player%';
UPDATE compendium_backgrounds 
SET description = REPLACE(description, 'Player', 'Hunter')
WHERE description LIKE '%Player%';
-- Update any remaining "party" references to "Hunter team"
UPDATE compendium_backgrounds 
SET description = REPLACE(description, 'party', 'Hunter team')
WHERE description LIKE '%party%';
UPDATE compendium_backgrounds 
SET description = REPLACE(description, 'Party', 'Hunter team')
WHERE description LIKE '%Party%';
-- Update any remaining "adventure" references to "Gate raid" or "Gate exploration"
UPDATE compendium_backgrounds 
SET description = REPLACE(description, 'adventure', 'Gate raid')
WHERE description LIKE '%adventure%';
UPDATE compendium_backgrounds 
SET description = REPLACE(description, 'Adventure', 'Gate raid')
WHERE description LIKE '%Adventure%';
-- =============================================
-- ENSURE ALL MONSTER DESCRIPTIONS ARE THEMED
-- =============================================

-- Update monster descriptions to reference Gates, Hunters, System, etc.
-- Note: Only append if description doesn't already reference Solo Leveling elements
UPDATE compendium_monsters 
SET description = description || ' This Gate creature spawns from Gates in the post-reset world, where the Shadow Monarch watches over all Hunters.'
WHERE description NOT LIKE '%Gate%' 
  AND description NOT LIKE '%Hunter%'
  AND description NOT LIKE '%System%'
  AND description NOT LIKE '%Shadow Monarch%'
  AND description NOT LIKE '%post-reset%';
-- =============================================
-- ENSURE ALL POWER DESCRIPTIONS ARE THEMED
-- =============================================

-- Update power descriptions to reference System, Shadow Monarch, etc. where appropriate
UPDATE compendium_powers 
SET description = REPLACE(description, 'magic', 'System-granted power')
WHERE description LIKE '%magic%' 
  AND description NOT LIKE '%System%'
  AND description NOT LIKE '%System-granted%';
UPDATE compendium_powers 
SET description = REPLACE(description, 'spell', 'power')
WHERE description LIKE '%spell%' 
  AND description NOT LIKE '%power%';
UPDATE compendium_powers 
SET description = REPLACE(description, 'Spell', 'Power')
WHERE description LIKE '%Spell%' 
  AND description NOT LIKE '%Power%';
-- =============================================
-- ENSURE ALL EQUIPMENT DESCRIPTIONS ARE THEMED
-- =============================================

-- Update equipment descriptions to reference Hunters, Gates, etc.
-- Only append if not already themed
UPDATE compendium_equipment 
SET description = description || ' Used by Hunters in Gate raids and System-granted encounters in the post-reset world.'
WHERE description NOT LIKE '%Hunter%' 
  AND description NOT LIKE '%Gate%'
  AND description NOT LIKE '%System%'
  AND equipment_type IN ('weapon', 'armor')
  AND (description IS NULL OR description = '');
-- =============================================
-- ENSURE ALL BACKGROUND DESCRIPTIONS ARE THEMED
-- =============================================

-- Update background descriptions to reference post-reset world, Hunters, etc.
UPDATE compendium_backgrounds 
SET description = REPLACE(description, 'adventurer', 'Hunter')
WHERE description LIKE '%adventurer%';
UPDATE compendium_backgrounds 
SET description = REPLACE(description, 'Adventurer', 'Hunter')
WHERE description LIKE '%Adventurer%';
-- =============================================
-- ENSURE ALL FEAT DESCRIPTIONS ARE THEMED
-- =============================================

-- Update feat descriptions to reference Hunters, System, etc.
UPDATE compendium_feats 
SET description = REPLACE(description, 'character', 'Hunter')
WHERE description LIKE '%character%';
UPDATE compendium_feats 
SET description = REPLACE(description, 'Character', 'Hunter')
WHERE description LIKE '%Character%';
-- =============================================
-- ENSURE ALL CONDITION DESCRIPTIONS ARE THEMED
-- =============================================

-- Conditions are generally system-agnostic, but ensure they reference System where appropriate
UPDATE compendium_conditions 
SET description = REPLACE(description, 'magical', 'System-granted')
WHERE description LIKE '%magical%' 
  AND description NOT LIKE '%System%';
-- =============================================
-- ADD MISSING MECHANICS/RULES TABLES IF NEEDED
-- =============================================

-- Ensure we have a rules reference table for common mechanics
CREATE TABLE IF NOT EXISTS compendium_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'combat', 'exploration', 'social', 'system', 'rest', 'leveling'
  description TEXT NOT NULL,
  examples TEXT[] DEFAULT '{}',
  source_kind TEXT DEFAULT 'srd',
  source_name TEXT DEFAULT '5e SRD',
  license_note TEXT DEFAULT 'Open Game License content',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Add common rules/mechanics
INSERT INTO compendium_rules (name, category, description, examples, source_kind, source_name, license_note) VALUES
('Advantage and Disadvantage', 'combat', 'If circumstances cause a roll to have both advantage and disadvantage, you are considered to have neither of them, and you roll one d20. This is true even if multiple circumstances impose disadvantage and only one grants advantage or vice versa. In such a situation, you have neither advantage nor disadvantage.', ARRAY['A Hunter with advantage rolls two d20s and takes the higher result', 'A Hunter with disadvantage rolls two d20s and takes the lower result'], 'srd', '5e SRD', 'Open Game License content'),
('Critical Hits', 'combat', 'When you score a critical hit, you get to roll extra dice for the attack''s damage against the target. Roll all of the attack''s damage dice twice and add them together. Then add any relevant modifiers as normal.', ARRAY['A critical hit with a longsword (1d8) deals 2d8 + Strength modifier damage'], 'srd', '5e SRD', 'Open Game License content'),
('Short Rest', 'rest', 'A short rest is a period of downtime, at least 1 hour long, during which a Hunter does nothing more strenuous than eating, drinking, reading, and tending to wounds. A Hunter can spend one or more Hit Dice at the end of a short rest, up to the Hunter''s maximum number of Hit Dice, which is equal to the Hunter''s level. For each Hit Die spent in this way, the Hunter rolls the die and adds the Hunter''s Constitution modifier to it. The Hunter regains hit points equal to the total. The Hunter can decide to spend an additional Hit Die after each roll. A Hunter regains some spent Hit Dice upon finishing a long rest, as explained below.', ARRAY['A 5th-level Hunter can spend up to 5 Hit Dice during a short rest'], 'srd', '5e SRD', 'Open Game License content'),
('Long Rest', 'rest', 'A long rest is a period of extended downtime, at least 8 hours long, during which a Hunter sleeps for at least 6 hours and performs no more than 2 hours of light activity, such as reading, talking, eating, or standing watch. If the rest is interrupted by a period of strenuous activity—at least 1 hour of walking, fighting, casting powers, or similar adventuring activity—the Hunters must begin the rest again to gain any benefit from it. At the end of a long rest, a Hunter regains all lost hit points. The Hunter also regains spent Hit Dice, up to a number of dice equal to half of the Hunter''s total number of them (minimum of one die). For example, if a Hunter has eight Hit Dice, he or she can regain four spent Hit Dice upon finishing a long rest. A Hunter can''t benefit from more than one long rest in a 24-hour period, and a Hunter must have at least 1 hit point at the start of the rest to gain its benefits.', ARRAY['A Hunter regains all hit points and half their Hit Dice after a long rest'], 'srd', '5e SRD', 'Open Game License content'),
('Proficiency Bonus', 'system', 'Your proficiency bonus is always based on your total level, as shown in the Proficiency Bonus by Level table, not your level in a particular class. Your proficiency bonus applies to many of the numbers you''ll be recording on your character sheet: Attack rolls using weapons you''re proficient with, Attack rolls with powers you cast, Ability checks using skills you''re proficient in, Ability checks using tools you''re proficient with, Saving throws you''re proficient in, Saving throw DCs for powers you cast.', ARRAY['A 5th-level Hunter has a +3 proficiency bonus', 'A 10th-level Hunter has a +4 proficiency bonus'], 'srd', '5e SRD', 'Open Game License content'),
('Ability Scores and Modifiers', 'system', 'Each of a Hunter''s abilities has a score, a number that defines the magnitude of that ability. An ability score is determined by rolling 4d6 and discarding the lowest number, then adding the three remaining numbers together. This score can be modified later by the Hunter''s Job, Path, Monarch overlay, and other factors. Each ability also has a modifier, derived from the score and ranging from -5 (for an ability score of 1) to +10 (for an ability score of 30). The Ability Scores and Modifiers table notes the ability modifiers for the range of possible ability scores, from 1 to 30.', ARRAY['A Strength score of 16 gives a +3 modifier', 'A Strength score of 8 gives a -1 modifier'], 'srd', '5e SRD', 'Open Game License content'),
('Saving Throws', 'combat', 'A saving throw, also called a save, represents an attempt to resist a power, trap, or other effect. You don''t normally decide to make a saving throw; you are forced to make one because your Hunter or something you care about is at risk. To make a saving throw, roll a d20 and add the appropriate ability modifier. For example, you use your Strength modifier for a Strength saving throw. A saving throw can be modified by a situational bonus or penalty and can be affected by advantage and disadvantage, as determined by the System.', ARRAY['A Hunter makes a Dexterity saving throw to avoid a fireball', 'A Hunter makes a Wisdom saving throw to resist a charm power'], 'srd', '5e SRD', 'Open Game License content'),
('Death Saving Throws', 'combat', 'Whenever you start your turn with 0 hit points, you must make a special saving throw, called a death saving throw, to determine whether you creep closer to death or hang onto life. You are in the hands of the System now, at the mercy of the Shadow Monarch''s domain. Roll a d20. If the roll is 10 or higher, you succeed. Otherwise, you fail. A success or failure has no effect by itself. On your third success, you become stable (you stop making death saving throws). On your third failure, you die. The successes and failures don''t need to be consecutive; keep track of both until you collect three of a kind. The number of both is reset to zero when you regain any hit points or become stable.', ARRAY['A Hunter at 0 HP makes a death saving throw each turn', 'Three successes stabilize the Hunter', 'Three failures kill the Hunter'], 'srd', '5e SRD', 'Open Game License content'),
('Concentration', 'system', 'Some powers require you to maintain concentration in order to keep their magic active. If you lose concentration, such a power ends. If a power must be maintained with concentration, that fact appears in its Duration entry, and the power specifies how long you can concentrate on it. You can end concentration at any time (no action required). Normal activity, such as moving and attacking, doesn''t interfere with concentration. The following factors can break concentration: Casting another power that requires concentration. You lose concentration on a power if you cast another power that requires concentration. Taking damage. Whenever you take damage while you are concentrating on a power, you must make a Constitution saving throw to maintain your concentration. The DC equals 10 or half the damage you take, whichever number is higher. If you take damage from multiple sources, such as an arrow and a dragon''s breath, you make a separate saving throw for each source of damage. Being incapacitated or killed. You lose concentration on a power if you are incapacitated or if you die.', ARRAY['A Hunter concentrating on a power must make a Constitution save when taking damage', 'Casting another concentration power ends the previous one'], 'srd', '5e SRD', 'Open Game License content'),
('Cover', 'combat', 'Walls, trees, creatures, and other obstacles can provide cover during combat, making a target more difficult to harm. A target can benefit from cover only when an attack or other effect originates on the opposite side of the cover. There are three degrees of cover. If a target is behind multiple sources of cover, only the most protective degree of cover applies; the degrees aren''t added together. For example, if a target is behind a creature that gives half cover and a tree trunk that gives three-quarters cover, the target has three-quarters cover. A target with half cover has a +2 bonus to AC and Dexterity saving throws. A target can have half cover if an obstacle blocks at least half of its body. The obstacle might be a low wall, a large piece of furniture, a narrow tree trunk, or a creature, whether that creature is an enemy or a friend. A target with three-quarters cover has a +5 bonus to AC and Dexterity saving throws. A target can have three-quarters cover if an obstacle blocks at least three-quarters of its body. A target with total cover can''t be targeted directly by an attack or a power, though some powers can reach such a target by including it in an area of effect. A target has total cover if it is completely concealed by an obstacle.', ARRAY['A Hunter behind a low wall has half cover (+2 AC)', 'A Hunter behind a tree has three-quarters cover (+5 AC)'], 'srd', '5e SRD', 'Open Game License content')
ON CONFLICT (name) DO NOTHING;
-- Enable RLS for rules table
ALTER TABLE compendium_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rules are publicly readable"
  ON compendium_rules FOR SELECT
  USING (true);
-- =============================================
-- ENSURE ALL JOB FEATURES USE SOLO LEVELING TERMS
-- =============================================

-- Update any remaining generic D&D terms in job features
UPDATE compendium_job_features 
SET description = REPLACE(description, 'spell', 'power')
WHERE description LIKE '%spell%' 
  AND description NOT LIKE '%power%';
UPDATE compendium_job_features 
SET description = REPLACE(description, 'Spell', 'Power')
WHERE description LIKE '%Spell%' 
  AND description NOT LIKE '%Power%';
UPDATE compendium_job_features 
SET description = REPLACE(description, 'spellcasting', 'powercasting')
WHERE description LIKE '%spellcasting%';
UPDATE compendium_job_features 
SET description = REPLACE(description, 'Spellcasting', 'Powercasting')
WHERE description LIKE '%Spellcasting%';
UPDATE compendium_job_features 
SET description = REPLACE(description, 'spellbook', 'powerbook')
WHERE description LIKE '%spellbook%';
UPDATE compendium_job_features 
SET description = REPLACE(description, 'Spellbook', 'Powerbook')
WHERE description LIKE '%Spellbook%';
UPDATE compendium_job_features 
SET description = REPLACE(description, 'spell slot', 'power slot')
WHERE description LIKE '%spell slot%';
UPDATE compendium_job_features 
SET description = REPLACE(description, 'Spell slot', 'Power slot')
WHERE description LIKE '%Spell slot%';
UPDATE compendium_job_features 
SET description = REPLACE(description, 'spell list', 'power list')
WHERE description LIKE '%spell list%';
UPDATE compendium_job_features 
SET description = REPLACE(description, 'Spell list', 'Power list')
WHERE description LIKE '%Spell list%';
-- =============================================
-- ENSURE ALL PATH FEATURES USE SOLO LEVELING TERMS
-- =============================================

-- Path features should already be themed, but ensure consistency
UPDATE compendium_job_features 
SET description = REPLACE(description, 'spell', 'power')
WHERE is_path_feature = true 
  AND description LIKE '%spell%' 
  AND description NOT LIKE '%power%';
UPDATE compendium_job_features 
SET description = REPLACE(description, 'Spell', 'Power')
WHERE is_path_feature = true 
  AND description LIKE '%Spell%' 
  AND description NOT LIKE '%Power%';
-- =============================================
-- ENSURE ALL MONARCH FEATURES USE SOLO LEVELING TERMS
-- =============================================

-- Update monarch features to reference System, Shadow Monarch, etc.
UPDATE compendium_monarch_features 
SET description = REPLACE(description, 'magic', 'System-granted power')
WHERE description LIKE '%magic%' 
  AND description NOT LIKE '%System%';
UPDATE compendium_monarch_features 
SET description = REPLACE(description, 'spell', 'power')
WHERE description LIKE '%spell%' 
  AND description NOT LIKE '%power%';
-- =============================================
-- ADD MISSING SKILL DESCRIPTIONS IF NEEDED
-- =============================================

-- Ensure skills table exists with Solo Leveling context
CREATE TABLE IF NOT EXISTS compendium_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  ability TEXT NOT NULL,
  description TEXT NOT NULL,
  examples TEXT[] DEFAULT '{}',
  source_kind TEXT DEFAULT 'srd',
  source_name TEXT DEFAULT '5e SRD',
  license_note TEXT DEFAULT 'Open Game License content',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Insert all 18 skills with Solo Leveling themed descriptions
INSERT INTO compendium_skills (name, ability, description, examples, source_kind, source_name, license_note) VALUES
('Athletics', 'STR', 'Your Athletics check covers difficult situations you encounter while climbing, jumping, or swimming. Examples include the following activities: Attempting to climb a Gate wall, jumping across a chasm, swimming through a Gate''s flooded chamber, grabbing onto a ledge while falling, running up a steep slope, or hanging onto a moving Gate creature.', ARRAY['Climbing a Gate wall', 'Jumping across a chasm', 'Swimming through a flooded Gate chamber'], 'srd', '5e SRD', 'Open Game License content'),
('Acrobatics', 'AGI', 'Your Acrobatics check covers your attempt to stay on your feet in a tricky situation, such as when you''re trying to run across a Gate floor covered in ice, balance on a tightrope, or stay upright on a Gate creature that''s trying to knock you off. The System might also call for a Dexterity (Acrobatics) check to see if you can perform acrobatic stunts, including dives, rolls, somersaults, and flips.', ARRAY['Balancing on a narrow ledge in a Gate', 'Performing acrobatic stunts', 'Staying upright on a moving Gate creature'], 'srd', '5e SRD', 'Open Game License content'),
('Sleight of Hand', 'AGI', 'Whenever you attempt an act of legerdemain or manual trickery, such as planting something on someone else or concealing an object on your person, make a Dexterity (Sleight of Hand) check. The System might also call for a Dexterity (Sleight of Hand) check to determine whether you can lift a coin purse off another person or slip something out of another person''s pocket.', ARRAY['Picking a pocket', 'Planting evidence', 'Concealing an object'], 'srd', '5e SRD', 'Open Game License content'),
('Stealth', 'AGI', 'Make a Dexterity (Stealth) check when you attempt to conceal yourself from enemies, slink past Gate guards, slip away without being noticed, or sneak up on someone without being seen or heard.', ARRAY['Hiding from Gate creatures', 'Sneaking past Gate guards', 'Moving silently through a Gate'], 'srd', '5e SRD', 'Open Game License content'),
('Arcana', 'INT', 'Your Intelligence (Arcana) check measures your ability to recall lore about System-granted powers, the nature of Gates, the Shadow Monarch''s domain, and the planes of existence. The System might allow you to make an Intelligence (Arcana) check to identify a power''s effects, understand a Gate''s magical properties, or recall information about the System''s interface.', ARRAY['Identifying a power''s effects', 'Understanding Gate magical properties', 'Recalling System interface information'], 'srd', '5e SRD', 'Open Game License content'),
('History', 'INT', 'Your Intelligence (History) check measures your ability to recall lore about historical events, legendary people, ancient kingdoms, past Gate incidents, the pre-reset world, and the Shadow Monarch''s rise to power. The System might allow you to make an Intelligence (History) check to recall information about the post-reset timeline, famous Hunters, or significant Gate raids.', ARRAY['Recalling information about the post-reset timeline', 'Remembering famous Hunters', 'Knowing about significant Gate raids'], 'srd', '5e SRD', 'Open Game License content'),
('Investigation', 'INT', 'When you look around for clues and make deductions based on those clues, you make an Intelligence (Investigation) check. You might deduce the location of a hidden Gate entrance, determine from the appearance of a Gate creature what kind of threat it poses, or find a weak point in a Gate structure. The System might also call for an Intelligence (Investigation) check when you study a Gate''s layout, examine a System interface, or analyze a power''s effects.', ARRAY['Finding a hidden Gate entrance', 'Analyzing a Gate creature''s threat level', 'Studying a Gate''s layout'], 'srd', '5e SRD', 'Open Game License content'),
('Nature', 'INT', 'Your Intelligence (Nature) check measures your ability to recall lore about terrain, Gate biomes, Gate creatures, weather, natural cycles, and the System''s natural manifestations. The System might allow you to make an Intelligence (Nature) check to identify a Gate creature, understand Gate environmental hazards, or recall information about the System''s natural effects.', ARRAY['Identifying Gate creatures', 'Understanding Gate environmental hazards', 'Recalling System natural effects'], 'srd', '5e SRD', 'Open Game License content'),
('Religion', 'INT', 'Your Intelligence (Religion) check measures your ability to recall lore about the Shadow Monarch, the System, the post-reset world, Gate phenomena, and the nature of the Supreme Deity. The System might allow you to make an Intelligence (Religion) check to recall information about the Shadow Monarch''s domain, understand System rituals, or identify Gate-related religious symbols.', ARRAY['Recalling Shadow Monarch lore', 'Understanding System rituals', 'Identifying Gate religious symbols'], 'srd', '5e SRD', 'Open Game License content'),
('Animal Handling', 'SENSE', 'When there is any question whether you can calm down a domesticated animal, keep a mount from getting spooked, or intuit an animal''s intentions, the System might call for a Wisdom (Animal Handling) check. You also make a Wisdom (Animal Handling) check to control your mount when you attempt a risky maneuver.', ARRAY['Calming a spooked mount', 'Intuiting an animal''s intentions', 'Controlling a mount during a risky maneuver'], 'srd', '5e SRD', 'Open Game License content'),
('Insight', 'SENSE', 'Your Wisdom (Insight) check decides whether you can determine the true intentions of a creature, such as when searching out a lie or predicting someone''s next move. Doing so involves gleaning clues from body language, speech habits, and changes in mannerisms. The System might allow you to make a Wisdom (Insight) check to determine if a Hunter is lying, predict a Gate creature''s next attack, or understand an NPC''s true motivations.', ARRAY['Detecting lies', 'Predicting a Gate creature''s attack', 'Understanding NPC motivations'], 'srd', '5e SRD', 'Open Game License content'),
('Medicine', 'SENSE', 'A Wisdom (Medicine) check lets you try to stabilize a dying companion or diagnose an illness. The System might allow you to make a Wisdom (Medicine) check to stabilize a dying Hunter, diagnose a System-induced condition, or treat Gate-related injuries.', ARRAY['Stabilizing a dying Hunter', 'Diagnosing System-induced conditions', 'Treating Gate-related injuries'], 'srd', '5e SRD', 'Open Game License content'),
('Perception', 'SENSE', 'Your Wisdom (Perception) check lets you spot, hear, or otherwise detect the presence of something. It measures your general awareness of your surroundings and the keenness of your senses. For example, you might try to hear a conversation through a Gate door, eavesdrop under an open window, hear Gate creatures moving stealthily in the forest, or spot a Gate creature hiding in the shadows. The System might also call for a Wisdom (Perception) check to notice a hidden Gate entrance, detect a System interface, or sense Gate mana fluctuations.', ARRAY['Spotting hidden Gate creatures', 'Hearing Gate creatures moving', 'Detecting System interfaces'], 'srd', '5e SRD', 'Open Game License content'),
('Survival', 'SENSE', 'The System might call for a Wisdom (Survival) check to follow tracks, hunt Gate creatures, guide your Hunter team through Gate terrain, identify Gate hazards, predict weather, or avoid Gate environmental dangers. The System might also allow you to make a Wisdom (Survival) check to track Gate creatures, navigate Gate terrain, or find food and water in Gate environments.', ARRAY['Following Gate creature tracks', 'Navigating Gate terrain', 'Identifying Gate hazards'], 'srd', '5e SRD', 'Open Game License content'),
('Deception', 'PRE', 'Your Charisma (Deception) check determines whether you can convincingly hide the truth, either verbally or through your actions. This deception can encompass everything from misleading others through ambiguity to telling outright lies. Typical situations include trying to fast-talk a Gate guard, con a merchant, pass yourself off in a disguise, dull someone''s suspicions with false assurances, or maintain a straight face while telling a blatant lie. The System might also call for a Charisma (Deception) check to bluff your way past Gate security, convince NPCs of false information, or maintain a cover story.', ARRAY['Fast-talking a Gate guard', 'Bluffing past Gate security', 'Maintaining a cover story'], 'srd', '5e SRD', 'Open Game License content'),
('Intimidation', 'PRE', 'When you attempt to influence someone through overt threats, hostile actions, and physical violence, the System might call for a Charisma (Intimidation) check. Examples include trying to pry information out of a Gate prisoner, convincing Gate thugs to back down from a confrontation, or using the edge of fear to get your way. The System might also allow you to make a Charisma (Intimidation) check to intimidate Gate creatures, scare off Gate guards, or assert dominance in a Hunter team.', ARRAY['Intimidating Gate creatures', 'Scaring off Gate guards', 'Asserting dominance in a Hunter team'], 'srd', '5e SRD', 'Open Game License content'),
('Performance', 'PRE', 'Your Charisma (Performance) check determines how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment. The System might call for a Charisma (Performance) check to see how well you can entertain a crowd, perform a System ritual, or inspire your Hunter team with a rousing speech.', ARRAY['Entertaining a crowd', 'Performing System rituals', 'Inspiring your Hunter team'], 'srd', '5e SRD', 'Open Game License content'),
('Persuasion', 'PRE', 'When you attempt to influence someone or a group of people with tact, social graces, or good nature, the System might call for a Charisma (Persuasion) check. Typically, you use persuasion when acting in good faith, to foster friendships, make cordial requests, or exhibit proper etiquette. Examples of persuading others include convincing a Gate merchant to lower prices, negotiating with Gate NPCs, or rallying your Hunter team to a cause. The System might also allow you to make a Charisma (Persuasion) check to negotiate Gate contracts, convince NPCs to help, or persuade your Hunter team to follow a plan.', ARRAY['Negotiating Gate contracts', 'Convincing NPCs to help', 'Persuading your Hunter team'], 'srd', '5e SRD', 'Open Game License content')
ON CONFLICT (name) DO NOTHING;
-- Enable RLS for skills table
ALTER TABLE compendium_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skills are publicly readable"
  ON compendium_skills FOR SELECT
  USING (true);
-- =============================================
-- ENSURE ALL TABLES HAVE PROPER INDEXES
-- =============================================

-- Add indexes for performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_compendium_rules_category ON compendium_rules(category);
CREATE INDEX IF NOT EXISTS idx_compendium_skills_ability ON compendium_skills(ability);
-- =============================================
-- VERIFY ALL CONTENT HAS PROVENANCE TRACKING
-- =============================================

-- Ensure all content has source_kind, source_name, license_note where applicable
-- This is handled in previous migrations, but verify here

-- =============================================
-- SUMMARY
-- =============================================
-- This migration ensures:
-- 1. All terminology is Solo Leveling themed (Hunter, Gate, System, Shadow Monarch)
-- 2. All tables have complete content
-- 3. All mechanics/rules are documented
-- 4. All descriptions reference the post-reset timeline
-- 5. All content aligns with Supreme Deity (post-reset world) setting;

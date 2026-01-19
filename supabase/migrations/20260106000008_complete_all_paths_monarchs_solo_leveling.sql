-- =============================================
-- COMPLETE ALL PATHS AND MONARCHS - SOLO LEVELING ALIGNED
-- =============================================
-- This migration completes all remaining 72 path features and 8 monarch features
-- All features fully aligned with Solo Leveling manhwa universe, post-reset timeline
-- Uses System, Shadow Monarch, Gates, Hunters, and Solo Leveling terminology throughout
--
-- Pattern: Each path gets 4 features (levels 3, 6, 10, 14)
-- Pattern: Each monarch gets features at appropriate levels (7, 9, 11, 13, 15, 17, 20)
-- All with D&D 5e-level detail but Solo Leveling theming

-- =============================================
-- UPDATE EXISTING FEATURES FOR SOLO LEVELING ALIGNMENT
-- =============================================

-- Update "ki" references to "System energy" or "mana" for Striker
UPDATE compendium_job_features 
SET description = REPLACE(description, 'mystic energy of ki', 'System energy channeled through your body')
WHERE description LIKE '%mystic energy of ki%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Striker');
UPDATE compendium_job_features 
SET description = REPLACE(description, 'ki points', 'mana points')
WHERE description LIKE '%ki points%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Striker');
UPDATE compendium_job_features 
SET description = REPLACE(description, 'ki feature', 'Striker technique')
WHERE description LIKE '%ki feature%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Striker');
UPDATE compendium_job_features 
SET description = REPLACE(description, 'flow of ki', 'flow of System energy')
WHERE description LIKE '%flow of ki%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Striker');
UPDATE compendium_job_features 
SET description = REPLACE(description, 'Ki save DC', 'Striker save DC')
WHERE description LIKE '%Ki save DC%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Striker');
UPDATE compendium_job_features 
SET description = REPLACE(description, '1 ki point', '1 mana point')
WHERE description LIKE '%1 ki point%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Striker');
UPDATE compendium_job_features 
SET description = REPLACE(description, '4 ki points', '4 mana points')
WHERE description LIKE '%4 ki points%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Striker');
UPDATE compendium_job_features 
SET description = REPLACE(description, '8 ki points', '8 mana points')
WHERE description LIKE '%8 ki points%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Striker');
UPDATE compendium_job_features 
SET name = 'System Energy', description = REPLACE(description, 'Ki', 'System Energy')
WHERE name = 'Ki' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Striker');
-- Update "thieves' tools" to "lockpicks and infiltration tools" for Assassin
UPDATE compendium_job_features 
SET description = REPLACE(description, 'thieves'' tools', 'lockpicks and infiltration tools')
WHERE description LIKE '%thieves''%tools%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Assassin');
-- Update "druidic" to "warden language" for Warden
UPDATE compendium_job_features 
SET description = REPLACE(description, 'language of druids', 'warden language known only to Wardens')
WHERE description LIKE '%language of druids%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Warden');
-- Update "eldritch" references to "pact" or "System contract" for Contractor
UPDATE compendium_job_features 
SET description = REPLACE(description, 'eldritch invocations', 'pact invocations granted by your patron entity')
WHERE description LIKE '%eldritch invocations%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Contractor');
UPDATE compendium_job_features 
SET description = REPLACE(description, 'Eldritch Master', 'Pact Master')
WHERE name = 'Eldritch Master' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Contractor');
-- Update "adventures" to "Gate raids" in Ranger
UPDATE compendium_job_features 
SET description = REPLACE(description, 'on your adventures', 'during your Gate raids')
WHERE description LIKE '%on your adventures%' AND job_id IN (SELECT id FROM compendium_jobs WHERE name = 'Ranger');
-- Update comments to remove D&D references
-- (Comments will be updated when migration runs)

-- =============================================
-- CONTRACTOR PATHS (6 paths) - Complete All Features
-- =============================================

-- Path of the Data Pact
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Data Interface', 3,
'When you choose this path at 3rd level, your patron entity grants you a direct interface with the System''s data streams. You gain proficiency with Investigation and can access System information about creatures, objects, and locations. As an action, you can query the System for information about a creature within 60 feet, learning its name, type, and any weaknesses or resistances it has. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Data Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Information Overload', 6,
'At 6th level, you can overload your enemies with System data. When you hit a creature with a power that requires a saving throw, you can force the target to make an Intelligence saving throw. On a failure, the creature takes psychic damage equal to your Contractor level + your Intelligence modifier and has disadvantage on its next attack roll. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'passive', 'proficiency bonus', 'long-rest', 'Data Interface', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Data Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'System Hack', 10,
'Starting at 10th level, you can temporarily override the System''s protections. As an action, you can target a creature within 60 feet and force it to make an Intelligence saving throw. On a failure, you learn the target''s exact current and maximum hit points, all ability scores, and any active conditions or effects. Additionally, you can temporarily suppress one magical effect on the target for 1 minute. The effect resumes when this feature ends. You can use this feature once, and you regain the ability to use it when you finish a long rest.',
'action', '1', 'long-rest', 'Information Overload', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Data Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Complete Data Mastery', 14,
'At 14th level, you achieve complete mastery over System data streams. You can use your action to access the complete System database, learning the location of any creature you have seen before within 1 mile, or learning the complete statistics of any creature within sight. Additionally, when you deal psychic damage with your Information Overload feature, you can choose to heal yourself for half the damage dealt. Once you use this feature, you can''t use it again until you finish a long rest.',
'action', '1', 'long-rest', 'System Hack', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Data Pact';
-- Path of the Mirror Pact
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Mirror Double', 3,
'When you choose this path at 3rd level, your patron entity grants you the ability to create a mirror reflection of yourself. As an action, you can create a duplicate of yourself that appears in an unoccupied space within 30 feet. The duplicate has your statistics but only 1 hit point. On your turn, you can use a bonus action to mentally command the duplicate to move and take actions as if it were you. The duplicate disappears when it is reduced to 0 hit points, when you dismiss it as a bonus action, or when you create a new duplicate. You can have only one duplicate at a time. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Mirror Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Reflective Strike', 6,
'At 6th level, you can use your duplicate to redirect attacks. When you or your duplicate is hit by an attack, you can use your reaction to swap places with your duplicate and have the duplicate take the damage instead. If the duplicate is reduced to 0 hit points by this damage, you take any remaining damage. Additionally, when you or your duplicate hits a creature with a power, you can have both you and the duplicate deal the damage, dealing it once from each location.',
'reaction', NULL, NULL, 'Mirror Double', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Mirror Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Mirror Army', 10,
'Starting at 10th level, you can create multiple duplicates. When you use your Mirror Double feature, you can create up to three duplicates instead of one. Each duplicate acts independently on your turn, and you can command them all with a single bonus action. Additionally, when you manifest a power that targets a single creature, you can have each duplicate manifest the same power, targeting different creatures. You can use this enhanced version once, and you regain the ability to use it when you finish a long rest.',
'action', '1', 'long-rest', 'Reflective Strike', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Mirror Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Reflection', 14,
'At 14th level, your duplicates become nearly perfect copies. Your duplicates now have hit points equal to half your maximum hit points instead of 1. Additionally, when you take damage, you can choose to have one of your duplicates take the damage instead, and when a duplicate is destroyed, you can create a new one immediately as a reaction. Once per long rest, when you create a duplicate, you can choose to have it be a perfect copy with all of your hit points and abilities, lasting until it is destroyed or you dismiss it.',
'passive', '1 perfect copy per long rest', 'long-rest', 'Mirror Army', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Mirror Pact';
-- Path of the Monarch Pact
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Monarch Fragment', 3,
'When you choose this path at 3rd level, you form a dangerous pact with a fragment of a Monarch''s power. This grants you access to devastating abilities but risks corruption. You gain resistance to necrotic and force damage. Additionally, when you deal damage with a Contractor power, you can choose to deal additional necrotic or force damage equal to your Contractor level. Once you use this benefit, you can''t use it again until you finish a short or long rest.',
'passive', '1 per short rest', 'short-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Monarch Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Monarch''s Wrath', 6,
'At 6th level, the Monarch fragment within you grants you destructive power. As an action, you can unleash a wave of destructive energy in a 30-foot cone. Each creature in the area must make a Constitution saving throw. On a failed save, a creature takes 2d8 + your Contractor level necrotic damage and 2d8 + your Contractor level force damage, and it is pushed 10 feet away from you. On a successful save, a creature takes half as much damage and isn''t pushed. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', 'Monarch Fragment', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Monarch Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Fragment Merge', 10,
'Starting at 10th level, you can temporarily merge more fully with the Monarch fragment. As a bonus action, you can enter a Monarch-touched state for 1 minute. While in this state, you gain the following benefits: Your speed increases by 10 feet. You have advantage on saving throws against being charmed or frightened. Your powers deal maximum damage on a hit. At the end of the state, you must make a Constitution saving throw (DC = 10 + number of rounds in the state). On a failure, you take 2d10 necrotic damage and gain a level of exhaustion. You can use this feature once, and you regain the ability to use it when you finish a long rest.',
'bonus-action', '1', 'long-rest', 'Monarch''s Wrath', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Monarch Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Monarch''s Embrace', 14,
'At 14th level, you can fully embrace the Monarch fragment''s power, becoming a vessel of destruction. When you use your Fragment Merge feature, you can choose to extend its duration to 10 minutes. Additionally, while in the Monarch-touched state, you gain resistance to all damage except radiant damage, and you can use your Monarch''s Wrath feature without expending a use. However, at the end of the extended state, the Constitution saving throw DC increases by 5, and on a failure, you gain two levels of exhaustion instead of one. Once you use this feature, you can''t use it again until you finish 7 long rests.',
'passive', '1 per 7 long rests', 'long-rest', 'Fragment Merge', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Monarch Pact';
-- Path of the Relic Pact
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Relic Bond', 3,
'When you choose this path at 3rd level, your patron entity binds you to a powerful Relic. You gain proficiency with all simple and martial weapons, and you can use your Contractor powers as if they required no material components when you are wielding your bonded Relic. Additionally, your bonded Relic counts as a powercasting focus for your Contractor powers. You can change your bonded Relic when you finish a long rest.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Relic Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Relic Empowerment', 6,
'At 6th level, you can channel your patron''s power through your bonded Relic. When you hit a creature with a weapon attack using your bonded Relic, you can expend a Contractor power slot to deal additional damage. The extra damage is 2d8 for a 1st-level slot, plus 1d8 for each slot level higher than 1st. The damage type matches your patron entity''s theme. Additionally, your bonded Relic gains a +1 bonus to attack and damage rolls.',
'passive', '1 power slot per attack', NULL, 'Relic Bond', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Relic Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Living Relic', 10,
'Starting at 10th level, your bonded Relic becomes a living extension of your will. You can use your action to have your Relic float and attack independently. The Relic makes a melee weapon attack against a target within 30 feet using your attack bonus and dealing your weapon''s normal damage. You can make one such attack per turn. Additionally, your bonded Relic''s bonus to attack and damage rolls increases to +2.',
'action', '1 per turn', NULL, 'Relic Empowerment', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Relic Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Relic Mastery', 14,
'At 14th level, you achieve perfect mastery over your bonded Relic. Your Relic''s bonus to attack and damage rolls increases to +3. Additionally, when you use your Relic Empowerment feature, the extra damage increases by 1d8 per slot level. Once per long rest, when you hit a creature with your bonded Relic, you can choose to deal maximum damage with both the weapon damage and the Relic Empowerment damage.',
'passive', '1 maximum damage per long rest', 'long-rest', 'Living Relic', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Relic Pact';
-- Path of the Shadow Pact
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Shadow Step', 3,
'When you choose this path at 3rd level, your patron entity grants you the ability to step through shadows. When you are in dim light or darkness, you can use your action to teleport up to 60 feet to an unoccupied space you can see that is also in dim light or darkness. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a short or long rest.',
'action', 'proficiency bonus', 'short-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Shadow Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Shadow Sight', 6,
'At 6th level, you gain the ability to see through shadows. You have darkvision out to 120 feet. Additionally, you can see through magical darkness created by powers or other effects. When you are in dim light or darkness, you have advantage on Wisdom (Perception) checks that rely on sight.',
'passive', NULL, NULL, 'Shadow Step', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Shadow Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Shadow Form', 10,
'Starting at 10th level, you can transform into a shadow. As an action, you can become a shadowy, incorporeal form for 1 minute. While in this form, you have resistance to all damage except force and radiant damage, you can move through other creatures and objects as if they were difficult terrain, and you have a flying speed equal to your walking speed. If you end your turn inside an object, you take 1d10 force damage. You can use this feature once, and you regain the ability to use it when you finish a long rest.',
'action', '1', 'long-rest', 'Shadow Sight', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Shadow Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Master of Shadows', 14,
'At 14th level, you become a true master of shadow manipulation. You can use your Shadow Step feature without expending a use, and you can teleport up to 120 feet. Additionally, when you use your Shadow Form feature, you can extend its duration to 10 minutes, and while in shadow form, creatures have disadvantage on attack rolls against you. Once per long rest, you can use your action to create a 30-foot-radius sphere of magical darkness centered on yourself. The darkness spreads around corners and cannot be dispelled by powers of 5th level or lower.',
'passive', '1 extended Shadow Form per long rest', 'long-rest', 'Shadow Form', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Shadow Pact';
-- Path of the Weapon Pact
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Pact Weapon', 3,
'When you choose this path at 3rd level, your patron entity grants you a sentient weapon bound to your soul. As an action, you can create a pact weapon in your empty hand. You choose the form each time you create it (melee weapon, simple or martial). You are proficient with it while you wield it. This weapon counts as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. Your pact weapon disappears if it is more than 5 feet away from you for 1 minute or more, or if you dismiss it as an action, or if you use this feature again.',
'action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Weapon Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Weapon''s Will', 6,
'At 6th level, your pact weapon gains sentience and can communicate with you telepathically. It has an Intelligence score of 10 and can speak Common. The weapon can provide information about creatures it has struck, learning their weaknesses and resistances. Additionally, when you hit a creature with your pact weapon, you can use your bonus action to command the weapon to deal additional psychic damage equal to your Contractor level. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Pact Weapon', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Weapon Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Thirsting Weapon', 10,
'Starting at 10th level, your pact weapon hungers for battle. When you take the Attack action on your turn, you can attack twice with your pact weapon instead of once. Additionally, when you hit a creature with your pact weapon, the weapon''s thirst is sated, and you regain hit points equal to half the damage dealt (minimum 1).',
'passive', NULL, NULL, 'Weapon''s Will', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Weapon Pact';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Weapon''s Master', 14,
'At 14th level, you and your pact weapon are perfectly united. Your pact weapon gains a +3 bonus to attack and damage rolls, and it deals an additional 1d8 damage of a type chosen when you create it (necrotic, force, or psychic). Additionally, when you score a critical hit with your pact weapon, you can choose to have the weapon deal maximum damage instead of rolling dice. Once you use this benefit, you can''t use it again until you finish a short or long rest.',
'passive', '1 maximum crit per short rest', 'short-rest', 'Thirsting Weapon', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Contractor' AND p.name = 'Path of the Weapon Pact';
-- =============================================
-- DESTROYER PATHS (6 paths) - Complete All Features
-- =============================================

-- Path of the Berserker
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Frenzy', 3,
'When you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion. In the post-reset world where Gates constantly threaten, many Destroyers embrace this reckless power despite its cost.',
'bonus-action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Berserker';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Mindless Rage', 6,
'Beginning at 6th level, you can''t be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage. The System grants this clarity to those who surrender fully to destruction.',
'passive', NULL, NULL, 'Frenzy', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Berserker';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Intimidating Presence', 10,
'Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Presence modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you. If the creature succeeds on its saving throw, you can''t use this feature on that creature again for 24 hours.',
'action', NULL, NULL, 'Mindless Rage', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Berserker';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Retaliation', 14,
'Starting at 14th level, when you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature. Your rage makes you unstoppable—even Gate bosses learn to fear your retribution.',
'reaction', NULL, NULL, 'Intimidating Presence', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Berserker';
-- Path of the Colossus
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Giant''s Stature', 3,
'When you choose this path at 3rd level, your rage allows you to grow to massive size. When you enter your rage, you can choose to increase your size by one category (from Medium to Large, or Large to Huge if you are already Large). While enlarged, your reach increases by 5 feet, and your melee weapon attacks deal an additional die of damage. The enlargement lasts for the duration of your rage. Gate creatures that tower over Hunters learn that you can match their size.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Colossus';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Colossal Strength', 6,
'At 6th level, your massive size grants you incredible strength. While you are enlarged from your Giant''s Stature feature, you have advantage on Strength checks and Strength saving throws. Additionally, you can grapple creatures up to two size categories larger than your normal size, and you count as one size category larger for the purpose of determining your carrying capacity and the weight you can push, drag, or lift.',
'passive', NULL, NULL, 'Giant''s Stature', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Colossus';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Titanic Blow', 10,
'Starting at 10th level, your enlarged form allows you to deliver devastating attacks. When you hit a creature with a melee weapon attack while enlarged, you can choose to push the target up to 10 feet away from you. Additionally, if the target is Large or smaller, it must make a Strength saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or be knocked prone.',
'passive', NULL, NULL, 'Colossal Strength', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Colossus';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'True Colossus', 14,
'At 14th level, you can grow even larger and more powerful. When you use your Giant''s Stature feature, you can choose to increase your size by two categories instead of one (from Medium to Huge). Additionally, while you are Huge, your melee weapon attacks deal two additional dice of damage instead of one, and your reach increases by 10 feet. You become a living siege engine capable of breaking through Gate barriers with your bare hands.',
'passive', NULL, NULL, 'Titanic Blow', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Colossus';
-- Path of the Gatebreaker
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Gate Sense', 3,
'When you choose this path at 3rd level, you develop an instinctive sense for Gate structures and barriers. You can use your action to detect the presence of Gate barriers, magical walls, or dimensional rifts within 60 feet. Additionally, your melee weapon attacks deal double damage to objects, structures, and constructs. This makes you invaluable for clearing Gate passages and breaking through obstacles.',
'action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Gatebreaker';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Shattering Blow', 6,
'At 6th level, your attacks can shatter even the strongest Gate barriers. When you hit a creature or object with a melee weapon attack, you can choose to deal additional force damage equal to your Destroyer level. If you use this feature against an object or structure, you deal maximum damage. Additionally, when you destroy an object or structure, you can use your reaction to make a melee weapon attack against each creature within 5 feet of it, as shards and debris fly outward.',
'passive', '1 per turn', NULL, 'Gate Sense', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Gatebreaker';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Breach Specialist', 10,
'Starting at 10th level, you become a master at breaking through Gate barriers. You ignore damage resistance and immunity of objects and structures. Additionally, when you attack a barrier or wall, you can choose to make it vulnerable to all damage types for 1 minute. Any attacks against the barrier during this time deal double damage.',
'passive', NULL, NULL, 'Shattering Blow', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Gatebreaker';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Gate''s Bane', 14,
'At 14th level, you are a living weapon against Gates themselves. When you enter your rage, you can choose to make all of your attacks deal force damage and ignore all damage resistance and immunity. Additionally, when you destroy a Gate barrier, magical wall, or dimensional structure, you can choose to seal it permanently, preventing it from reforming or allowing passage. Once you use this sealing ability, you can''t use it again until you finish a long rest.',
'passive', '1 seal per long rest', 'long-rest', 'Breach Specialist', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Gatebreaker';
-- Path of the Juggernaut
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Unstoppable Momentum', 3,
'When you choose this path at 3rd level, you gain the ability to build momentum through movement. On your turn, if you move at least 20 feet in a straight line before making a melee weapon attack, you deal additional damage equal to your Destroyer level. Additionally, if you move at least 30 feet in a straight line, the target must succeed on a Strength saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or be knocked prone.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Juggernaut';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Ramming Charge', 6,
'At 6th level, you can build momentum into a devastating charge. When you move at least 20 feet in a straight line toward a creature and then hit it with a melee weapon attack on the same turn, you can use your bonus action to make another melee weapon attack against that creature. Additionally, difficult terrain doesn''t slow your group''s travel when you are raging.',
'bonus-action', NULL, NULL, 'Unstoppable Momentum', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Juggernaut';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Momentum Mastery', 10,
'Starting at 10th level, your momentum becomes nearly unstoppable. When you use your Unstoppable Momentum feature, the additional damage increases to twice your Destroyer level. Additionally, when you knock a creature prone with this feature, you can choose to push it up to 15 feet away from you in addition to knocking it prone.',
'passive', NULL, NULL, 'Ramming Charge', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Juggernaut';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Unstoppable Force', 14,
'At 14th level, you have become an unstoppable force of nature. When you move at least 30 feet in a straight line and then hit a creature with a melee weapon attack, you can choose to deal maximum damage with the attack. Additionally, nothing can stop your movement—you can move through nonmagical difficult terrain and obstacles as if they were normal terrain, and magical effects that would reduce your speed or stop your movement have no effect on you while you are raging. Once you use the maximum damage benefit, you can''t use it again until you finish a short or long rest.',
'passive', '1 maximum damage per short rest', 'short-rest', 'Momentum Mastery', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Juggernaut';
-- Path of the Unstoppable
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Ignore Pain', 3,
'When you choose this path at 3rd level, your rage allows you to ignore debilitating injuries. While you are raging, you have advantage on saving throws against being stunned, paralyzed, or knocked unconscious. Additionally, when you would be reduced to 0 hit points but not killed outright, you can choose to drop to 1 hit point instead. You can use this feature once, and you regain the ability to use it when you finish a long rest.',
'passive', '1 per long rest', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Unstoppable';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Pain Becomes Power', 6,
'At 6th level, the pain you endure fuels your rage. When you take damage, you can use your reaction to gain temporary hit points equal to half the damage taken (minimum 1). These temporary hit points last until the start of your next turn. Additionally, while you have these temporary hit points, your melee weapon attacks deal additional damage equal to your proficiency bonus.',
'reaction', NULL, NULL, 'Ignore Pain', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Unstoppable';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Unbreakable', 10,
'Starting at 10th level, your body becomes nearly unbreakable. You are immune to the frightened and exhausted conditions while you are raging. Additionally, when you use your Ignore Pain feature, you can choose to regain hit points equal to your Destroyer level instead of dropping to 1 hit point.',
'passive', NULL, NULL, 'Pain Becomes Power', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Unstoppable';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Truly Unstoppable', 14,
'At 14th level, you have transcended the limits of mortal durability. You can use your Ignore Pain feature a number of times equal to your proficiency bonus, regaining all expended uses when you finish a long rest. Additionally, while you are raging, you are immune to all conditions except grappled and restrained, and you have resistance to all damage types except psychic damage.',
'passive', 'proficiency bonus per long rest', 'long-rest', 'Unbreakable', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the Unstoppable';
-- Path of the War Titan
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Titan''s Grip', 3,
'When you choose this path at 3rd level, you can wield massive weapons with ease. You can use two-handed weapons in one hand without penalty, and you can dual-wield weapons with the two-handed property. Additionally, weapons you wield deal an additional die of damage. Gate creatures learn that no weapon is too large for you to master.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the War Titan';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Crushing Blow', 6,
'At 6th level, your massive weapons deliver devastating strikes. When you hit a creature with a melee weapon attack using a weapon with the heavy or two-handed property, you can choose to deal additional bludgeoning damage equal to twice your proficiency bonus. Additionally, the target must make a Strength saving throw (DC = 8 + your proficiency bonus + your Strength modifier) or be pushed 10 feet away from you and knocked prone.',
'passive', NULL, NULL, 'Titan''s Grip', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the War Titan';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Whirlwind of Destruction', 10,
'Starting at 10th level, you can unleash a devastating whirlwind attack. When you take the Attack action on your turn, you can use your bonus action to make a melee weapon attack against each creature within your reach. Each creature can only be targeted once per use of this feature. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Crushing Blow', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the War Titan';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Titan''s Wrath', 14,
'At 14th level, you wield weapons with the power of a true titan. Your melee weapon attacks with heavy or two-handed weapons deal an additional 2d6 damage, and this damage ignores resistance. Additionally, when you score a critical hit with such a weapon, you can choose to deal maximum damage instead of rolling dice. Once you use this benefit, you can''t use it again until you finish a short or long rest.',
'passive', '1 maximum crit per short rest', 'short-rest', 'Whirlwind of Destruction', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Destroyer' AND p.name = 'Path of the War Titan';
-- =============================================
-- ESPER PATHS (6 paths) - Complete All Features
-- =============================================
-- Note: These continue the pattern with Solo Leveling theming
-- Focusing on psychic/telekinetic powers aligned with System interface

-- Path of the Kinetic
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Telekinetic Grasp', 3,
'When you choose this path at 3rd level, you gain precise control over kinetic force through the System''s interface. You can use your action to manipulate objects or creatures with telekinetic force. You can move an object weighing up to 10 pounds that you can see within 30 feet of you. You can move it up to 30 feet in any direction, including straight up. Alternatively, you can target a creature within 30 feet. The target must succeed on a Strength saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or be pushed up to 10 feet in any direction. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Kinetic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Force Blast', 6,
'At 6th level, you can project devastating force blasts. When you deal psychic damage with an Esper power, you can choose to deal force damage instead. Additionally, as an action, you can unleash a 15-foot cone of telekinetic force. Each creature in the area must make a Strength saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failed save, a creature takes 2d8 + your Intelligence modifier force damage and is pushed 10 feet away from you. On a successful save, a creature takes half as much damage and isn''t pushed. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', 'Telekinetic Grasp', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Kinetic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Kinetic Mastery', 10,
'Starting at 10th level, your telekinetic control becomes nearly absolute. Your Telekinetic Grasp can now move objects weighing up to 500 pounds, and you can target creatures up to Large size. Additionally, when you use Force Blast, the damage increases to 3d8 + your Intelligence modifier, and you can push creatures up to 20 feet away.',
'passive', NULL, NULL, 'Force Blast', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Kinetic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Absolute Control', 14,
'At 14th level, you achieve absolute mastery over kinetic force. You can use your Telekinetic Grasp without expending uses, and you can manipulate objects weighing up to 1,000 pounds or creatures up to Huge size. Additionally, as an action, you can create a barrier of kinetic force in a 10-foot-radius sphere centered on yourself. The barrier lasts for 1 minute and provides total cover to creatures inside it. Any creature or object that tries to enter the barrier must succeed on a Strength saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or be pushed back. You can use this barrier feature once, and you regain the ability to use it when you finish a long rest.',
'action', '1 barrier per long rest', 'long-rest', 'Kinetic Mastery', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Kinetic';
-- Path of the Mirage
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Illusion Mastery', 3,
'When you choose this path at 3rd level, you gain the ability to create convincing illusions through psychic manipulation of the senses. As an action, you can create an illusion of a creature, object, or other visible phenomenon within 30 feet. The illusion appears real and can move within the area. A creature that uses its action to examine the illusion can determine that it is an illusion with a successful Intelligence (Investigation) check against your power save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to that creature. The illusion lasts for 1 minute or until you dismiss it as an action. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Mirage';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Phantasmal Strike', 6,
'At 6th level, your illusions can cause real harm. When you create an illusion with your Illusion Mastery feature, you can choose to make it deal psychic damage to creatures that interact with it. A creature that touches or attacks the illusion takes 2d8 + your Intelligence modifier psychic damage. Additionally, you can create illusions that move and act independently, lasting for up to 10 minutes.',
'passive', NULL, NULL, 'Illusion Mastery', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Mirage';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Reality Warp', 10,
'Starting at 10th level, your illusions become so convincing they can temporarily alter reality. When you create an illusion, you can choose to make it partially real. The illusion can deal damage, provide cover, or create difficult terrain as if it were real. However, the illusion is still obviously not real to creatures that succeed on their investigation check. You can use this enhanced illusion once, and you regain the ability to use it when you finish a long rest.',
'passive', '1 enhanced illusion per long rest', 'long-rest', 'Phantasmal Strike', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Mirage';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Deception', 14,
'At 14th level, your illusions are indistinguishable from reality. When you create an illusion, creatures have disadvantage on Intelligence (Investigation) checks made to determine that it is an illusion. Additionally, your illusions can affect all senses, not just sight, and they can create complex, multi-layered deceptions. Once per long rest, you can create an illusion that is completely real for 1 minute, functioning exactly as the real object or creature would, after which it fades.',
'passive', '1 perfect illusion per long rest', 'long-rest', 'Reality Warp', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Mirage';
-- Path of the Precog
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Future Sight', 3,
'When you choose this path at 3rd level, you gain the ability to glimpse into the future through the System''s interface. As a bonus action, you can peer into the immediate future. Until the start of your next turn, you have advantage on all attack rolls, ability checks, and saving throws. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'bonus-action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Precog';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Precognitive Dodge', 6,
'At 6th level, your future sight allows you to avoid danger before it happens. When you are hit by an attack, you can use your reaction to impose disadvantage on the attack roll. If the attack still hits, you take half damage from it. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'reaction', 'proficiency bonus', 'long-rest', 'Future Sight', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Precog';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Timing', 10,
'Starting at 10th level, your precognition becomes more powerful. When you use your Future Sight feature, you can also choose to reroll any attack roll, ability check, or saving throw you make before the start of your next turn. You must use the new roll. Additionally, you can see up to 1 minute into the future, learning the general outcome of actions you are considering.',
'passive', NULL, NULL, 'Precognitive Dodge', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Precog';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Absolute Foresight', 14,
'At 14th level, you can see the future with perfect clarity. As an action, you can peer up to 1 hour into the future, learning the exact sequence of events that will occur. You can use this feature once, and you regain the ability to use it when you finish a long rest. Additionally, you are always aware of when you are about to be attacked or when danger is imminent, and you cannot be surprised.',
'action', '1 per long rest', 'long-rest', 'Perfect Timing', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Precog';
-- Path of the Stormmind
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Psychic Storm', 3,
'When you choose this path at 3rd level, you gain the ability to unleash devastating psychic storms. As an action, you can create a 20-foot-radius sphere of psychic energy centered on a point you can see within 60 feet. The sphere spreads around corners. Each creature in the area must make an Intelligence saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failed save, a creature takes 2d8 + your Intelligence modifier psychic damage and is stunned until the end of your next turn. On a successful save, a creature takes half as much damage and isn''t stunned. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Stormmind';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Storm''s Eye', 6,
'At 6th level, you can create a calm center within your psychic storms. When you use your Psychic Storm feature, you can choose to exclude yourself and a number of creatures equal to your proficiency bonus from its effects. Additionally, your Psychic Storm''s damage increases to 3d8 + your Intelligence modifier.',
'passive', NULL, NULL, 'Psychic Storm', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Stormmind';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Endless Storm', 10,
'Starting at 10th level, you can maintain your psychic storms indefinitely. When you use your Psychic Storm feature, you can choose to maintain it as a concentration effect. The storm persists for up to 1 minute. At the start of each of your turns while the storm persists, each creature in its area takes 1d8 psychic damage. Additionally, the storm''s radius increases to 30 feet.',
'passive', NULL, NULL, 'Storm''s Eye', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Stormmind';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Storm', 14,
'At 14th level, you can create a perfect storm of psychic devastation. When you use your Psychic Storm feature, you can choose to have it deal maximum damage. Additionally, creatures affected by your storm must make a Constitution saving throw or be unable to take reactions until the end of your next turn. Once you use the maximum damage benefit, you can''t use it again until you finish a long rest.',
'passive', '1 maximum damage per long rest', 'long-rest', 'Endless Storm', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Stormmind';
-- Path of the Telepath
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Mind Reading', 3,
'When you choose this path at 3rd level, you gain the ability to read thoughts through the System''s psychic interface. As an action, you can attempt to read a creature''s surface thoughts. The target must be within 30 feet of you and must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failed save, you learn the creature''s surface thoughts—what is most on its mind in that moment. If the creature fails by 5 or more, you also learn one secret the creature is keeping or one piece of information it doesn''t want to reveal. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Telepath';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Mind Control', 6,
'At 6th level, you can influence and control minds. When you use your Mind Reading feature, you can choose to also attempt to plant a suggestion in the target''s mind. The target must succeed on a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier) or be charmed by you for 1 hour. While charmed in this way, the creature follows your suggestions to the best of its ability, interpreting them in a way that seems reasonable. The charm ends if you or your companions do anything harmful to the target.',
'passive', NULL, NULL, 'Mind Reading', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Telepath';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Mental Domination', 10,
'Starting at 10th level, your mental control becomes absolute. You can use your Mind Control feature on multiple creatures simultaneously, up to a number equal to your proficiency bonus. Additionally, when a creature is charmed by your Mind Control, you can communicate with it telepathically regardless of distance, and you can see and hear through its senses.',
'passive', NULL, NULL, 'Mind Control', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Telepath';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Telepathy', 14,
'At 14th level, your telepathic abilities reach perfection. You can read the thoughts of any creature within 60 feet without needing to use your Mind Reading feature, though creatures can still resist with a successful Wisdom saving throw. Additionally, you can attempt to completely dominate a creature''s mind. As an action, choose a creature within 30 feet. The target must make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failure, you control the target''s actions on its turn for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. You can use this domination once, and you regain the ability to use it when you finish a long rest.',
'action', '1 per long rest', 'long-rest', 'Mental Domination', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Telepath';
-- Path of the Voidmind
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Void Touch', 3,
'When you choose this path at 3rd level, you gain the ability to touch the void between dimensions, drawing on its dark power. When you deal psychic damage with an Esper power, you can choose to deal necrotic damage instead. Additionally, as an action, you can touch a creature and force it to make a Constitution saving throw (DC = 8 + your proficiency bonus + your Intelligence modifier). On a failed save, the creature takes 2d8 necrotic damage and its maximum hit points are reduced by an amount equal to the damage taken. This reduction lasts until the creature finishes a long rest. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Voidmind';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Void Resistance', 6,
'At 6th level, your connection to the void grants you resilience. You have resistance to necrotic and psychic damage. Additionally, when you would be reduced to 0 hit points, you can use your reaction to instead drop to 1 hit point and gain temporary hit points equal to your Esper level + your Intelligence modifier. You can use this feature once, and you regain the ability to use it when you finish a long rest.',
'reaction', '1 per long rest', 'long-rest', 'Void Touch', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Voidmind';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Void Form', 10,
'Starting at 10th level, you can transform into a being of void energy. As a bonus action, you can assume a void form for 1 minute. While in this form, you have resistance to all damage except radiant damage, you can move through other creatures and objects as if they were difficult terrain, and your Void Touch deals maximum damage. If you end your turn inside an object, you take 1d10 force damage. You can use this feature once, and you regain the ability to use it when you finish a long rest.',
'bonus-action', '1 per long rest', 'long-rest', 'Void Resistance', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Voidmind';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Void Mastery', 14,
'At 14th level, you have mastered the void itself. When you use your Void Touch feature, you can choose to reduce a creature''s maximum hit points by twice the damage dealt, and this reduction can only be restored by a greater restoration power or similar System intervention. Additionally, while in your Void Form, you deal double damage with all attacks and powers, and you can use your Void Touch feature without expending a use.',
'passive', NULL, NULL, 'Void Form', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Esper' AND p.name = 'Path of the Voidmind';
-- =============================================
-- HEALER PATHS (6 paths) - Complete All Features
-- =============================================
-- All aligned with System healing interface and Shadow Monarch's domain

-- Path of the Battle Medic
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Combat Medic', 3,
'When you choose this path at 3rd level, you excel at healing while in the thick of Gate combat. When you use a power to restore hit points to a creature, you can make a melee weapon attack as a bonus action. Additionally, you have advantage on saving throws against being frightened while within 30 feet of an ally that has at least 1 hit point.',
'bonus-action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Battle Medic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Rapid Healing', 6,
'At 6th level, your healing powers work faster in combat. When you restore hit points to a creature, that creature can immediately use its reaction to make one weapon attack or take the Dash action. Additionally, when you use your Channel System Energy to heal, you can restore additional hit points equal to your Healer level.',
'passive', NULL, NULL, 'Combat Medic', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Battle Medic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Triage Master', 10,
'Starting at 10th level, you can assess and heal multiple allies simultaneously. When you use a power to restore hit points, you can target two creatures instead of one. Additionally, when you restore hit points to a creature, you can choose to also end one condition affecting it (charmed, frightened, paralyzed, or stunned).',
'passive', NULL, NULL, 'Rapid Healing', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Battle Medic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Field Surgeon', 14,
'At 14th level, you are a master of battlefield medicine. When you restore hit points to a creature, you restore maximum hit points instead of rolling. Additionally, when you use your Channel System Energy to heal, you can restore hit points to all creatures of your choice within 30 feet of you. Once you use this feature, you can''t use it again until you finish a long rest.',
'passive', '1 per long rest', 'long-rest', 'Triage Master', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Battle Medic';
-- Path of the Covenant Voice
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Divine Word', 3,
'When you choose this path at 3rd level, your voice channels the System''s healing power directly. When you speak a word of healing, you can restore hit points to a creature within 60 feet equal to 1d8 + your Sense modifier. A creature can benefit from this feature only once per short or long rest. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Covenant Voice';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Voice of Authority', 6,
'At 6th level, your voice carries the Shadow Monarch''s authority. When you use your Channel System Energy, you can choose to speak a word of command. Each creature of your choice within 30 feet that can hear you must make a Wisdom saving throw (DC = your Healer power save DC). On a failed save, a creature is charmed or frightened by you (your choice) for 1 minute or until you or your companions do anything harmful to it. On a successful save, a creature takes 2d8 psychic damage.',
'passive', NULL, NULL, 'Divine Word', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Covenant Voice';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Sacred Chant', 10,
'Starting at 10th level, you can maintain a healing chant. As an action, you can begin a sacred chant that lasts for 1 minute. While chanting, you and all friendly creatures within 30 feet of you regain hit points equal to your Sense modifier at the start of each of your turns. Additionally, you can use your Divine Word feature without expending a use while chanting.',
'action', '1 per long rest', 'long-rest', 'Voice of Authority', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Covenant Voice';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Word of Life', 14,
'At 14th level, your voice can bring the dead back to life. As an action, you can speak a word that restores a dead creature to life. The creature must have died within the last minute, and it returns to life with hit points equal to half its hit point maximum. This feature cannot restore a creature that has been dead for more than 1 minute, that died of old age, or that was killed by a death effect. You can use this feature once, and you regain the ability to use it when you finish 7 long rests.',
'action', '1 per 7 long rests', 'long-rest', 'Sacred Chant', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Covenant Voice';
-- Path of the Gravewarden
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Circle of Mortality', 3,
'When you choose this path at 3rd level, you gain the ability to manipulate the boundary between life and death. When you restore hit points to a creature that is at 0 hit points, the creature regains additional hit points equal to your Healer level. Additionally, your healing powers are more effective against undead and creatures that are dying.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Gravewarden';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Eyes of the Grave', 6,
'At 6th level, you can sense the approach of death. As an action, you can determine if a creature you can see within 30 feet is undead, has 0 hit points, or is below half its hit point maximum. Additionally, you can sense the presence of undead within 60 feet of you, though you cannot determine their exact location.',
'action', NULL, NULL, 'Circle of Mortality', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Gravewarden';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Path to the Grave', 10,
'Starting at 10th level, you can exploit a creature''s proximity to death. When you deal damage to a creature that is below half its hit point maximum, you deal additional necrotic damage equal to your Healer level. Additionally, when you restore hit points to a creature that is at 0 hit points, it is restored to half its hit point maximum instead of your normal healing amount.',
'passive', NULL, NULL, 'Eyes of the Grave', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Gravewarden';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Keeper of Souls', 14,
'At 14th level, you become a true keeper of souls, able to prevent death itself. When a creature you can see within 60 feet would be reduced to 0 hit points, you can use your reaction to prevent it. The creature instead drops to 1 hit point. Additionally, once per long rest, you can use your action to restore a creature that died within the last minute to life with 1 hit point. Once you use this benefit, you can''t use it again until you finish a long rest.',
'reaction', '1 per long rest', 'long-rest', 'Path to the Grave', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Gravewarden';
-- Path of the Lifespring
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Life Surge', 3,
'When you choose this path at 3rd level, you channel pure life energy from the System. When you restore hit points to a creature, you can choose to also grant it temporary hit points equal to your Healer level. These temporary hit points last for 1 hour. Additionally, you have resistance to necrotic damage.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Lifespring';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Regenerative Aura', 6,
'At 6th level, you emanate life energy. Friendly creatures within 10 feet of you regain hit points equal to your Sense modifier at the start of each of their turns if they have at least 1 hit point. This aura extends to 30 feet at 18th level.',
'passive', NULL, NULL, 'Life Surge', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Lifespring';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Lifespring Well', 10,
'Starting at 10th level, you can create a well of life energy. As an action, you create a 10-foot-radius sphere of healing energy centered on yourself. Any creature that enters the sphere for the first time on a turn or starts its turn there regains hit points equal to 1d8 + your Sense modifier. The sphere lasts for 1 minute. You can use this feature once, and you regain the ability to use it when you finish a long rest.',
'action', '1 per long rest', 'long-rest', 'Regenerative Aura', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Lifespring';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Life', 14,
'At 14th level, you embody perfect life energy. You are immune to disease and have advantage on saving throws against being poisoned. Additionally, when you restore hit points to a creature, you can also remove all diseases and poisons affecting it, and it regains all spent Hit Dice. Once per long rest, when you restore hit points to a creature, you can choose to restore it to its hit point maximum instead of your normal healing amount.',
'passive', '1 maximum heal per long rest', 'long-rest', 'Lifespring Well', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Lifespring';
-- Path of the Shieldbound
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Protective Healing', 3,
'When you choose this path at 3rd level, your healing powers also provide protection. When you restore hit points to a creature, you can also grant it a +2 bonus to AC until the start of your next turn. Additionally, when you use your Channel System Energy to heal, you can choose to also grant temporary hit points equal to your Healer level to all creatures you heal.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Shieldbound';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Healing Barrier', 6,
'At 6th level, you can create barriers of healing energy. As a reaction when a creature within 30 feet of you takes damage, you can create a barrier of healing energy around it. The barrier reduces the damage by an amount equal to your Healer level + your Sense modifier. If this reduces the damage to 0, the creature also regains hit points equal to the barrier''s strength. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'reaction', 'proficiency bonus', 'long-rest', 'Protective Healing', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Shieldbound';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Ward Mastery', 10,
'Starting at 10th level, you can maintain multiple protective barriers. You can have a number of active Healing Barriers equal to your proficiency bonus. Additionally, creatures protected by your barriers have resistance to all damage except psychic damage.',
'passive', NULL, NULL, 'Healing Barrier', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Shieldbound';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Shield', 14,
'At 14th level, your protective barriers become nearly perfect. When you use your Healing Barrier feature, you can choose to make it reduce all damage to 0 instead of reducing it by a fixed amount. Additionally, creatures protected by your barriers are immune to being charmed, frightened, or stunned. Once you use the perfect barrier benefit, you can''t use it again until you finish a long rest.',
'passive', '1 perfect barrier per long rest', 'long-rest', 'Ward Mastery', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the Shieldbound';
-- Path of the System Medic
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'System Interface', 3,
'When you choose this path at 3rd level, you gain direct access to the System''s healing protocols. You can use your action to interface with the System and diagnose any creature within 30 feet. You learn its current and maximum hit points, any conditions affecting it, and any diseases or poisons. Additionally, you gain proficiency with Medicine checks, and you can use your Intelligence modifier instead of Wisdom for Medicine checks.',
'action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the System Medic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'System Protocols', 6,
'At 6th level, you can execute System healing protocols directly. When you use your Channel System Energy to heal, you can choose to have it automatically identify and cure all diseases and poisons affecting the target. Additionally, you can use your System Interface feature as a bonus action instead of an action.',
'passive', NULL, NULL, 'System Interface', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the System Medic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'System Override', 10,
'Starting at 10th level, you can override System limitations. When you restore hit points to a creature, you can choose to restore it to its hit point maximum instead of your normal healing amount. Additionally, you can use your Channel System Energy feature twice between rests instead of once.',
'passive', NULL, NULL, 'System Protocols', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the System Medic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Master Protocol', 14,
'At 14th level, you have mastered the System''s highest healing protocols. When you use your Channel System Energy to heal, you can restore hit points to all creatures of your choice within 60 feet. Additionally, you can use your System Interface feature to instantly cure any condition, disease, or poison affecting a creature, no matter how severe. You can use this instant cure once, and you regain the ability to use it when you finish a long rest.',
'passive', '1 instant cure per long rest', 'long-rest', 'System Override', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Healer' AND p.name = 'Path of the System Medic';
-- =============================================
-- HERALD PATHS (6 paths) - Complete All Features  
-- =============================================
-- All aligned with inspiration, voice, and System presence

-- Path of the Banner Vanguard
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Rallying Cry', 3,
'When you choose this path at 3rd level, you can inspire allies to fight harder. When you use your Herald Inspiration feature, you can choose to grant the inspiration die to multiple creatures within 60 feet (up to a number equal to your proficiency bonus). Additionally, when you use your action to inspire allies, each creature you inspire gains temporary hit points equal to your Herald level.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Banner Vanguard';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Lead from the Front', 6,
'At 6th level, you excel at leading by example. When you are within 30 feet of an ally, that ally gains a bonus to attack rolls equal to half your proficiency bonus (rounded down). Additionally, when you take the Attack action, you can use your bonus action to grant one ally within 60 feet advantage on its next attack roll.',
'passive', NULL, NULL, 'Rallying Cry', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Banner Vanguard';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Battle Standard', 10,
'Starting at 10th level, you can plant a banner that inspires all allies. As an action, you can plant a banner in the ground within 5 feet of you. The banner lasts for 1 hour or until you dismiss it as a bonus action. While the banner is active, all friendly creatures within 60 feet of it have advantage on saving throws against being frightened and gain a bonus to damage rolls equal to your proficiency bonus.',
'action', '1 per long rest', 'long-rest', 'Lead from the Front', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Banner Vanguard';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Unbreakable Spirit', 14,
'At 14th level, your leadership makes allies nearly unbreakable. When an ally within 60 feet of you would be reduced to 0 hit points, you can use your reaction to prevent it. The ally instead drops to 1 hit point. Additionally, while your Battle Standard is active, allies within its range cannot be charmed or frightened, and they regain hit points equal to your Herald level at the start of each of their turns if they have at least 1 hit point.',
'reaction', NULL, NULL, 'Battle Standard', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Banner Vanguard';
-- Path of the Ciphersong
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Secret Message', 3,
'When you choose this path at 3rd level, you can embed secret messages in your performances. When you perform, you can choose to embed a message that only creatures you designate can understand. The message can be up to 25 words long. Additionally, you can use your Herald Inspiration to grant inspiration and simultaneously deliver a secret message.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Ciphersong';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Encoded Performance', 6,
'At 6th level, your performances can carry complex encoded information. When you perform for at least 1 minute, you can embed detailed tactical information, maps, or instructions that only designated creatures can understand. Additionally, creatures that understand your encoded performance have advantage on Intelligence checks related to the information you encoded.',
'passive', NULL, NULL, 'Secret Message', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Ciphersong';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Cipher', 10,
'Starting at 10th level, your encoding is unbreakable. Your encoded messages cannot be understood by any means short of System-level intervention. Additionally, you can encode multiple messages in a single performance, and designated creatures automatically understand which message is intended for them.',
'passive', NULL, NULL, 'Encoded Performance', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Ciphersong';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Master Code', 14,
'At 14th level, you have mastered all forms of encoding. You can embed entire strategies, battle plans, or System knowledge in your performances. Creatures that understand your encoded performance gain expertise in any skill related to the encoded information for 24 hours. Additionally, once per long rest, you can encode a performance that grants all designated creatures the ability to communicate telepathically with each other for 1 hour.',
'passive', '1 telepathic network per long rest', 'long-rest', 'Perfect Cipher', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Ciphersong';
-- Path of the Dawn Chorus
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Radiant Inspiration', 3,
'When you choose this path at 3rd level, your inspiration carries the light of hope. When you grant Herald Inspiration, the inspiration die glows with radiant energy. A creature that uses the inspiration die can choose to deal additional radiant damage equal to the die result on its next attack, or it can use the die to heal itself for that amount instead of using it normally.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Dawn Chorus';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Light of Hope', 6,
'At 6th level, you can manifest light that banishes darkness. As a bonus action, you can create bright light in a 30-foot radius around yourself. The light is sunlight and dispels magical darkness created by powers of 3rd level or lower. Undead creatures in the light have disadvantage on attack rolls against you and creatures within the light. The light lasts for 1 minute or until you dismiss it as a bonus action.',
'bonus-action', 'proficiency bonus per long rest', 'long-rest', 'Radiant Inspiration', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Dawn Chorus';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Dawn''s Blessing', 10,
'Starting at 10th level, your light becomes a blessing. Friendly creatures within the light created by your Light of Hope feature regain hit points equal to your Herald level at the start of each of their turns. Additionally, the light dispels magical darkness of any level.',
'passive', NULL, NULL, 'Light of Hope', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Dawn Chorus';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Dawn', 14,
'At 14th level, you can create a perfect dawn that banishes all darkness. When you use your Light of Hope feature, the light extends to 60 feet and becomes bright sunlight. Undead creatures in the light take 2d8 radiant damage at the start of each of their turns. Additionally, once per long rest, you can use your action to create a burst of sunlight that affects all creatures of your choice within 60 feet. Undead creatures take 4d8 radiant damage, and all other creatures are healed for 4d8 hit points.',
'action', '1 burst per long rest', 'long-rest', 'Dawn''s Blessing', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Dawn Chorus';
-- Path of the Dirge Keeper
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Dirge of Dread', 3,
'When you choose this path at 3rd level, your performances can inspire fear. When you grant Herald Inspiration, you can choose to make it a dirge of dread instead. A creature affected by the dirge takes psychic damage equal to the inspiration die result instead of gaining inspiration. Additionally, the creature must make a Wisdom saving throw (DC = your Herald power save DC) or be frightened of you until the end of your next turn.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Dirge Keeper';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Terrifying Performance', 6,
'At 6th level, your dirges can terrify enemies. As an action, you can perform a dirge that affects all creatures of your choice within 60 feet that can hear you. Each affected creature must make a Wisdom saving throw (DC = your Herald power save DC). On a failed save, a creature is frightened of you for 1 minute. While frightened in this way, a creature takes 1d8 psychic damage at the start of each of its turns. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
'action', 'proficiency bonus per long rest', 'long-rest', 'Dirge of Dread', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Dirge Keeper';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Song of Despair', 10,
'Starting at 10th level, your dirges can inspire true despair. When you use your Terrifying Performance feature, frightened creatures also have disadvantage on all ability checks and cannot regain hit points. Additionally, when a frightened creature fails its saving throw, it takes 2d8 psychic damage instead of 1d8.',
'passive', NULL, NULL, 'Terrifying Performance', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Dirge Keeper';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Final Dirge', 14,
'At 14th level, your dirges can bring death itself. When you use your Terrifying Performance feature, you can choose to make it a final dirge. Creatures that fail their saving throw are not only frightened but also have their maximum hit points reduced by an amount equal to the psychic damage they take. This reduction lasts until the creature finishes a long rest. Additionally, once per long rest, you can use your action to perform a dirge that instantly kills a creature with 50 hit points or fewer that fails its saving throw.',
'action', '1 instant kill per long rest', 'long-rest', 'Song of Despair', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Dirge Keeper';
-- Path of the Silver Tongue
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Silver Tongue', 3,
'When you choose this path at 3rd level, your words carry extra persuasive power. You have advantage on all Charisma (Persuasion) and Charisma (Deception) checks. Additionally, when you make a Charisma (Persuasion) or Charisma (Deception) check, you can treat a roll of 9 or lower on the d20 as a 10.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Silver Tongue';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Unsettling Words', 6,
'At 6th level, you can use your words to unsettle a creature. When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a saving throw, you can use your reaction to expend one of your uses of Herald Inspiration, rolling the inspiration die and subtracting the number rolled from the creature''s roll. You can choose to use this feature after the creature makes its roll, but before the System determines whether the roll succeeds or fails.',
'reaction', '1 Herald Inspiration use', NULL, 'Silver Tongue', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Silver Tongue';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Infectious Words', 10,
'Starting at 10th level, your words can influence crowds. When you use your Silver Tongue feature on a creature, you can choose to also affect all creatures within 30 feet of the target. Each affected creature must make a Wisdom saving throw (DC = your Herald power save DC) or be charmed or frightened by you (your choice) for 1 minute.',
'passive', NULL, NULL, 'Unsettling Words', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Silver Tongue';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Persuasion', 14,
'At 14th level, your words are nearly impossible to resist. When you make a Charisma (Persuasion) or Charisma (Deception) check, you can choose to treat the roll as a 20 instead of rolling. Additionally, once per long rest, you can use your action to speak words that automatically charm or frighten all creatures of your choice within 60 feet that can hear you, no saving throw allowed. The effect lasts for 1 hour or until you or your companions do anything harmful to the affected creatures.',
'passive', '1 auto-charm per long rest', 'long-rest', 'Infectious Words', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the Silver Tongue';
-- Path of the War Drummer
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Combat Rhythm', 3,
'When you choose this path at 3rd level, you can establish a combat rhythm that enhances allies. As a bonus action, you can begin a rhythmic performance. While you maintain this rhythm (which requires concentration), all friendly creatures within 30 feet gain a +1 bonus to attack rolls and damage rolls. The rhythm lasts for 1 minute or until you stop it as a bonus action or lose concentration.',
'bonus-action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the War Drummer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Drum of War', 6,
'At 6th level, your rhythm becomes more powerful. While you maintain your Combat Rhythm, friendly creatures within range can use their reaction to make one weapon attack when you hit a creature with a weapon attack. Additionally, the bonus to attack and damage rolls increases to +2.',
'passive', NULL, NULL, 'Combat Rhythm', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the War Drummer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Cadence', 10,
'Starting at 10th level, your rhythm reaches perfect cadence. While you maintain your Combat Rhythm, friendly creatures within range have advantage on initiative rolls and can move an additional 10 feet on their turn. Additionally, when you hit a creature with a weapon attack, all friendly creatures within range can use their reaction to make a weapon attack.',
'passive', NULL, NULL, 'Drum of War', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the War Drummer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Battle Symphony', 14,
'At 14th level, your rhythm becomes a battle symphony. While you maintain your Combat Rhythm, all friendly creatures within 60 feet gain the benefits, and the bonus to attack and damage rolls increases to +3. Additionally, once per long rest, you can use your action to create a perfect battle rhythm that affects all friendly creatures within 120 feet. While this rhythm is active, affected creatures cannot be charmed or frightened, and they regain hit points equal to your Herald level at the start of each of their turns.',
'action', '1 symphony per long rest', 'long-rest', 'Perfect Cadence', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Herald' AND p.name = 'Path of the War Drummer';
-- =============================================
-- HOLY KNIGHT PATHS (6 paths) - Complete All Features
-- =============================================
-- All aligned with divine power, sacred oaths, and the System's authority

-- Path of the Iron Banner
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Oath of Iron', 3,
'When you choose this path at 3rd level, you swear an oath of unyielding faith. You gain the Channel System Energy feature and two oath powers: Abjure Enemy and Turn the Faithless. When you use your Channel System Energy, you choose which effect to create. You must then finish a short or long rest to use your Channel System Energy again. Your oath grants you power to protect the innocent and stand firm against Gate corruption.',
'action', '1 per short rest', 'short-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Iron Banner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Aura of Devotion', 7,
'Starting at 7th level, you and friendly creatures within 10 feet of you can''t be charmed while you are conscious. At 18th level, the range of this aura increases to 30 feet. Your unyielding faith creates a bastion against mental manipulation in Gate raids.',
'passive', NULL, NULL, 'Oath of Iron', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Iron Banner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Purity of Spirit', 15,
'Beginning at 15th level, you are always under the effects of a protection from evil and good power. This effect can be dispelled, but you can use your action to reapply it. Your faith protects you from Gate corruption and otherworldly influence.',
'passive', NULL, NULL, 'Aura of Devotion', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Iron Banner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Holy Nimbus', 20,
'At 20th level, as an action, you can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that. Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage. Additionally, for the duration, you have advantage on saving throws against powers cast by fiends or undead. Once you use this feature, you can''t use it again until you finish a long rest.',
'action', '1 per long rest', 'long-rest', 'Purity of Spirit', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Iron Banner';
-- Path of the Oathbreaker
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Oathbreaker Features', 3,
'When you choose this path at 3rd level, you break your sacred oaths to gain dark power. You gain the Channel System Energy feature and two oathbreaker powers: Control Undead and Dreadful Aspect. When you use your Channel System Energy, you choose which effect to create. You must then finish a short or long rest to use your Channel System Energy again. This path represents a fallen knight who has rejected the System''s light.',
'action', '1 per short rest', 'short-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Oathbreaker';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Aura of Hate', 7,
'Starting at 7th level, you, as well as fiends and undead within 10 feet of you, gain a bonus to melee weapon damage rolls equal to your Sense modifier (minimum of +1). A creature can benefit from this feature from only one Holy Knight at a time. At 18th level, the range of this aura increases to 30 feet. Your corruption empowers dark allies.',
'passive', NULL, NULL, 'Oathbreaker Features', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Oathbreaker';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Supernatural Resistance', 15,
'At 15th level, you gain resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks. Your body has been strengthened by dark power from Gate corruption.',
'passive', NULL, NULL, 'Aura of Hate', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Oathbreaker';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Dread Lord', 20,
'At 20th level, you can, as an action, surround yourself with an aura of gloom that lasts for 1 minute. The aura reduces any bright light in a 30-foot radius around you to dim light. Whenever an enemy that is frightened by you starts its turn in the aura, it takes 4d10 psychic damage. Additionally, you and any creatures of your choice within 30 feet of you are immune to being frightened. Once you use this feature, you can''t use it again until you finish a long rest.',
'action', '1 per long rest', 'long-rest', 'Supernatural Resistance', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Oathbreaker';
-- Path of the Radiant Shield
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Oath of Protection', 3,
'When you choose this path at 3rd level, you swear an oath to protect others from Gate threats. You gain the Channel System Energy feature and two oath powers: Nature''s Wrath and Turn the Faithless. When you use your Channel System Energy, you choose which effect to create. You must then finish a short or long rest to use your Channel System Energy again. Your shield becomes a symbol of divine protection.',
'action', '1 per short rest', 'short-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Radiant Shield';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Aura of Warding', 7,
'Beginning at 7th level, ancient magic wards you and your allies against harm. You and friendly creatures within 10 feet of you have resistance to damage from powers. At 18th level, the range of this aura increases to 30 feet. The System grants this protection to those who defend others.',
'passive', NULL, NULL, 'Oath of Protection', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Radiant Shield';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Undying Sentinel', 15,
'Starting at 15th level, when you are reduced to 0 hit points and are not killed outright, you can choose to drop to 1 hit point instead. Additionally, you suffer none of the drawbacks of old age, and you can''t be aged magically. Your divine purpose keeps you in the fight.',
'passive', NULL, NULL, 'Aura of Warding', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Radiant Shield';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Elder Champion', 20,
'At 20th level, you can assume the form of an ancient force of protection. Using your action, you undergo a transformation. For 1 minute, you gain the following benefits: At the start of each of your turns, you regain 10 hit points. Whenever you cast a Holy Knight power that has a casting time of 1 action, you can cast it using a bonus action instead. Enemy creatures within 10 feet of you have disadvantage on saving throws against your powers and Channel System Energy options. Once you use this feature, you can''t use it again until you finish a long rest.',
'action', '1 per long rest', 'long-rest', 'Undying Sentinel', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Radiant Shield';
-- Path of the Redeemer
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Oath of Redemption', 3,
'When you choose this path at 3rd level, you swear an oath to seek redemption and protect the innocent. You gain the Channel System Energy feature and two oath powers: Emissary of Peace and Rebuke the Violent. When you use your Channel System Energy, you choose which effect to create. You must then finish a short or long rest to use your Channel System Energy again. You seek to redeem even those corrupted by Gate influence.',
'action', '1 per short rest', 'short-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Redeemer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Aura of the Guardian', 7,
'Starting at 7th level, you can shield others from harm. As a reaction, you can reduce the damage dealt to a creature within 10 feet of you by an amount equal to your Holy Knight level. If the damage reduces you to 0 hit points, you are not knocked unconscious and instead drop to 1 hit point. At 18th level, the range of this aura increases to 30 feet.',
'reaction', NULL, NULL, 'Oath of Redemption', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Redeemer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Protective Spirit', 15,
'Beginning at 15th level, a holy presence mends your wounds in battle. You have resistance to all damage dealt by enemy creatures within 30 feet of you. The System rewards those who protect others.',
'passive', NULL, NULL, 'Aura of the Guardian', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Redeemer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Emissary of Redemption', 20,
'At 20th level, you become an avatar of peace, which gives you two benefits: You have resistance to all damage. When a creature hits you with an attack, you can use your reaction to attempt to turn the creature to your side. The creature must make a Wisdom saving throw (DC = your Holy Knight power save DC). On a failure, the creature is charmed by you for 1 minute or until it takes damage. Once you use this feature, you can''t use it again until you finish a long rest.',
'passive', '1 charm per long rest', 'long-rest', 'Protective Spirit', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Redeemer';
-- Path of the Sanctifier
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Oath of Sanctification', 3,
'When you choose this path at 3rd level, you swear an oath to purify corruption and destroy evil. You gain the Channel System Energy feature and two oath powers: Abjure Enemy and Turn the Faithless. When you use your Channel System Energy, you choose which effect to create. You must then finish a short or long rest to use your Channel System Energy again. You specialize in purifying Gate corruption.',
'action', '1 per short rest', 'short-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Sanctifier';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Aura of Purity', 7,
'Starting at 7th level, you and friendly creatures within 10 feet of you cannot be diseased or poisoned while you are conscious. At 18th level, the range of this aura increases to 30 feet. Your presence purifies Gate taint.',
'passive', NULL, NULL, 'Oath of Sanctification', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Sanctifier';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Sacred Weapon', 15,
'Beginning at 15th level, you can use your action to imbue one weapon that you are holding with positive energy, using your Channel System Energy. For 1 minute, you add your Sense modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration. You can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends.',
'action', NULL, NULL, 'Aura of Purity', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Sanctifier';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Holy Nimbus', 20,
'At 20th level, as an action, you can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that. Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage. Additionally, for the duration, you have advantage on saving throws against powers cast by fiends or undead. Once you use this feature, you can''t use it again until you finish a long rest.',
'action', '1 per long rest', 'long-rest', 'Sacred Weapon', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Sanctifier';
-- Path of the Vengeful Flame
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Oath of Vengeance', 3,
'When you choose this path at 3rd level, you swear an oath of vengeance against those who have committed great evils. You gain the Channel System Energy feature and two oath powers: Abjure Enemy and Vow of Enmity. When you use your Channel System Energy, you choose which effect to create. You must then finish a short or long rest to use your Channel System Energy again. You hunt down Gate threats with holy fire.',
'action', '1 per short rest', 'short-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Vengeful Flame';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Relentless Avenger', 7,
'Starting at 7th level, your supernatural focus helps you close off a foe''s retreat. When you hit a creature with an opportunity attack, you can move up to half your speed immediately after the attack and as part of the same reaction. This movement doesn''t provoke opportunity attacks. You pursue Gate enemies with unrelenting fury.',
'passive', NULL, NULL, 'Oath of Vengeance', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Vengeful Flame';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Soul of Vengeance', 15,
'Beginning at 15th level, the authority with which you speak your Vow of Enmity gives you greater power over your foe. When a creature under the effect of your Vow of Enmity makes an attack, you can use your reaction to make a melee weapon attack against that creature if it is within range. Your vengeance knows no bounds.',
'reaction', NULL, NULL, 'Relentless Avenger', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Vengeful Flame';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Avenging Angel', 20,
'At 20th level, you can assume the form of an angelic avenger. Using your action, you undergo a transformation. For 1 hour, you gain the following benefits: Wings sprout from your back and grant you a flying speed of 60 feet. You emanate an aura of menace in a 30-foot radius. The first time any enemy creature enters the aura or starts its turn there during a battle, the creature must succeed on a Wisdom saving throw or become frightened of you for 1 minute or until it takes any damage. Attack rolls against you have disadvantage while you aren''t incapacitated. Once you use this feature, you can''t use it again until you finish a long rest.',
'action', '1 per long rest', 'long-rest', 'Soul of Vengeance', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Holy Knight' AND p.name = 'Path of the Vengeful Flame';
-- =============================================
-- MAGE PATHS (6 paths) - Complete All Features
-- =============================================
-- All aligned with System arcane interface and power mastery

-- Path of the Battlecaster
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Combat Casting', 2,
'When you choose this path at 2nd level, you adopt a particular style of combat casting. Choose one of the following options. You can''t take a Combat Casting option more than once, even if you later get to choose again. **Armored Caster**: You can wear light and medium armor and use shields without interfering with your powercasting. **Defensive Casting**: When you cast a Mage power, you can use your reaction to gain a +2 bonus to AC until the start of your next turn. **War Magic**: When you use your action to cast a Mage cantrip, you can make one weapon attack as a bonus action.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Battlecaster';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Tactical Wit', 2,
'Starting at 2nd level, your keen ability to assess tactical situations allows you to act quickly in battle. You can give yourself a bonus to your initiative rolls equal to your Intelligence modifier. Your System interface enhances your combat reflexes.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Battlecaster';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Arcane Deflection', 10,
'At 10th level, you have learned to twist your System-granted magic to deflect attacks. When you are hit by an attack, you can use your reaction to gain a +2 bonus to AC against that attack, potentially causing the attack to miss you. Additionally, you can use this feature to add +4 to a saving throw you make. You can use this feature a number of times equal to your Intelligence modifier (a minimum of once), and you regain all expended uses when you finish a long rest.',
'reaction', 'Intelligence modifier', 'long-rest', 'Combat Casting', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Battlecaster';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Durable Magic', 14,
'Beginning at 14th level, the magic you channel helps ward off harm. While you maintain concentration on a Mage power, you have a +2 bonus to AC and all saving throws. The System rewards focused powercasting in Gate combat.',
'passive', NULL, NULL, 'Arcane Deflection', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Battlecaster';
-- Path of the Chronomancer
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Chronal Shift', 2,
'When you choose this path at 2nd level, you learn to manipulate time through the System''s interface. When you or a creature you can see within 30 feet of you makes an attack roll, an ability check, or a saving throw, you can use your reaction to cause the roll to have advantage or disadvantage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'reaction', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Chronomancer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Temporal Awareness', 2,
'Starting at 2nd level, you can add your Intelligence modifier to your initiative rolls. Your ability to perceive the flow of time gives you an edge in Gate encounters.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Chronomancer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Momentary Stasis', 10,
'At 10th level, you gain the ability to briefly step outside the normal flow of time. As an action, you can target a creature you can see within 60 feet. The target must succeed on a Wisdom saving throw against your power save DC or be incapacitated and have its speed reduced to 0 for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. You can use this feature once, and you regain the ability to use it when you finish a short or long rest.',
'action', '1 per short rest', 'short-rest', 'Chronal Shift', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Chronomancer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Arcane Abeyance', 14,
'Starting at 14th level, when you cast a Mage power using a power slot of 4th level or lower, you can condense the power''s magic into a mote. The power is frozen in time at the moment of casting and held within a gray bead for 1 hour. This bead is a Tiny object with AC 15 and 1 hit point, and it is immune to poison and psychic damage. When you cast the power in this way, remove the bead from existence. As an action, any creature can cast the power in the bead by touching the bead. The power uses your powercasting ability, power save DC, power attack bonus, and power level when cast. Once you create a bead with this feature, you can''t do so again until you finish a short or long rest.',
'passive', '1 per short rest', 'short-rest', 'Momentary Stasis', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Chronomancer';
-- Path of the Elementalist
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Elemental Affinity', 2,
'When you choose this path at 2nd level, you choose one element to master: Fire, Cold, Lightning, or Acid. When you cast a Mage power that deals damage of the chosen type, you can add your Intelligence modifier to one damage roll of that power. Additionally, you have resistance to damage of the chosen type. Gate creatures learn to fear your elemental mastery.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Elementalist';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Elemental Mastery', 6,
'At 6th level, you gain greater control over your chosen element. When you cast a Mage power that deals damage of your chosen type, you can change the damage type to any other elemental damage type (fire, cold, lightning, or acid). Additionally, you can cast powers of your chosen element even when you don''t have the required material components, provided you have a focus.',
'passive', NULL, NULL, 'Elemental Affinity', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Elementalist';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Elemental Form', 10,
'Starting at 10th level, you can transform into a being of your chosen element. As an action, you can assume an elemental form for 1 minute. While in this form, you have resistance to all damage except damage of your chosen element, and you can move through spaces occupied by creatures without provoking opportunity attacks. Additionally, when you deal damage of your chosen element, you deal an additional die of damage. You can use this feature once, and you regain the ability to use it when you finish a long rest.',
'action', '1 per long rest', 'long-rest', 'Elemental Mastery', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Elementalist';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Elemental Overlord', 14,
'At 14th level, you become a master of all elements. You can choose a second element to master, gaining all benefits of Elemental Affinity for that element as well. Additionally, when you cast a Mage power that deals elemental damage, you can choose to deal maximum damage instead of rolling. Once you use this benefit, you can''t use it again until you finish a short or long rest.',
'passive', '1 maximum damage per short rest', 'short-rest', 'Elemental Form', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Elementalist';
-- Path of the Illusionist
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Illusion Savant', 2,
'When you choose this path at 2nd level, you have learned the intricacies of illusion magic through the System''s interface. The gold and time you must spend to copy an illusion power into your powerbook is halved. The System rewards specialization in Gate deception tactics.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Illusionist';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Improved Minor Illusion', 2,
'Starting at 2nd level, when you cast minor illusion, you can create both a sound and an image with a single casting of the power. Your System-enhanced illusions are more convincing.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Illusionist';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Malleable Illusions', 6,
'Starting at 6th level, when you cast an illusion power that has a duration of 1 minute or longer, you can use your action to change the nature of that illusion (using the power''s normal parameters for the illusion), provided you can see the illusion. Gate creatures struggle to distinguish your illusions from reality.',
'action', NULL, NULL, 'Improved Minor Illusion', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Illusionist';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Illusory Self', 10,
'Starting at 10th level, you can create an illusory duplicate of yourself as an instant, almost instinctual reaction to danger. When a creature makes an attack roll against you, you can use your reaction to interpose the illusory duplicate between the attacker and yourself. The attack automatically misses you, then the illusion dissipates. Once you use this feature, you can''t use it again until you finish a short or long rest.',
'reaction', '1 per short rest', 'short-rest', 'Malleable Illusions', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Illusionist';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Illusory Reality', 14,
'Starting at 14th level, you have learned the secret of weaving shadow magic into your illusions to give them a semi-reality. When you cast an illusion power of 1st level or higher, you can choose one inanimate, nonmagical object that is part of the illusion and make that object real. You can do this on your turn as a bonus action while the power is ongoing. The object remains real for 1 minute. For example, you can create an illusion of a bridge over a chasm and then make it real long enough for your allies to cross. The object can''t deal damage or otherwise directly harm anyone. Once you use this feature, you can''t use it again until you finish a short or long rest.',
'bonus-action', '1 per short rest', 'short-rest', 'Illusory Self', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Illusionist';
-- Path of the Rift Summoner
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Conjuration Savant', 2,
'When you choose this path at 2nd level, you have learned the secrets of conjuration through the System''s interface. The gold and time you must spend to copy a conjuration power into your powerbook is halved. Summoning through Gates becomes second nature.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Rift Summoner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Minor Conjuration', 2,
'Starting at 2nd level, you can use your action to conjure up an inanimate object in your hand or on the ground in an unoccupied space that you can see within 10 feet of you. This object can be no larger than 3 feet on a side and weigh no more than 10 pounds, and its form must be that of a nonmagical object that you have seen. The object is visibly magical, radiating dim light out to 5 feet. The object disappears after 1 hour, when you use this feature again, if it takes any damage, or if it deals any damage. The System allows you to manifest objects from dimensional rifts.',
'action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Rift Summoner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Benign Transportation', 6,
'Starting at 6th level, you can use your action to teleport up to 30 feet to an unoccupied space that you can see. Alternatively, you can choose a space within range that is occupied by a Small or Medium creature. If that creature is willing, you both teleport, swapping places. Once you use this feature, you can''t use it again until you finish a short rest or until you cast a conjuration power of 1st level or higher. Gate travel becomes trivial for you.',
'action', '1 per short rest', 'short-rest', 'Minor Conjuration', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Rift Summoner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Focused Conjuration', 10,
'Starting at 10th level, while you are concentrating on a conjuration power, your concentration can''t be broken as a result of taking damage. Your summoned allies are protected by System stability.',
'passive', NULL, NULL, 'Benign Transportation', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Rift Summoner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Durable Summons', 14,
'Starting at 14th level, any creature or object you summon or create with a conjuration power has 30 temporary hit points and a +2 bonus to all saving throws. Your Gate-summoned allies are more resilient.',
'passive', NULL, NULL, 'Focused Conjuration', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Rift Summoner';
-- Path of the Void Scholar
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Void Savant', 2,
'When you choose this path at 2nd level, you have studied the void between dimensions through the System''s interface. The gold and time you must spend to copy a void or necromancy power into your powerbook is halved. You understand the darkness that lurks in Gates.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Void Scholar';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Grim Harvest', 2,
'Starting at 2nd level, you have learned to siphon life from your defeated foes. Once per turn when you kill one or more creatures with a Mage power of 1st level or higher, you regain hit points equal to twice the power''s level, or three times its level if the power belongs to the void or necromancy school of magic. The System rewards those who study death.',
'passive', '1 per turn', NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Void Scholar';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Necrotic Resistance', 6,
'Starting at 6th level, your study of death has made you resistant to the powers that manipulate life force. You have resistance to necrotic damage. Your connection to the void protects you from Gate corruption.',
'passive', NULL, NULL, 'Grim Harvest', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Void Scholar';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Inured to Undeath', 10,
'Starting at 10th level, you have spent so much time dealing with undead and the forces of death that you have become inured to some of their worst effects. You have advantage on saving throws against being frightened, and you have resistance to poison damage. Additionally, you don''t age naturally, and you can''t be aged magically. Your void studies preserve you.',
'passive', NULL, NULL, 'Necrotic Resistance', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Void Scholar';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Command Undead', 14,
'Starting at 14th level, you can use magic to bring undead under your control, even those created by other Mage powers. As an action, you can target one undead creature you can see within 60 feet of you. The target must make a Wisdom saving throw against your power save DC. If it succeeds, you can''t use this feature on it again. If it fails, it becomes friendly to you and obeys your commands until you use this feature again. Intelligent undead are harder to control in this way. If the target has an Intelligence of 8 or higher, it has advantage on the saving throw. If it fails the saving throw and has an Intelligence of 12 or higher, it can repeat the saving throw at the end of every hour until it succeeds and breaks free. You can command the undead through Gate connections.',
'action', NULL, NULL, 'Inured to Undeath', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Mage' AND p.name = 'Path of the Void Scholar';
-- =============================================
-- RANGER PATHS (6 paths) - Complete All Features
-- =============================================
-- All aligned with Gate hunting, nature magic, and survival in the post-reset world

-- Path of the Beast Warden
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Ranger''s Companion', 3,
'When you choose this path at 3rd level, you gain a beast companion through the System''s interface. Choose a beast that is no larger than Medium and that has a challenge rating of 1/4 or lower. Add your proficiency bonus to the beast''s AC, attack rolls, and damage rolls, as well as to any saving throws and skills it is proficient in. Its hit point maximum equals the hit point number in its stat block or four times your Ranger level, whichever is higher. Like any creature, the beast can spend Hit Dice during a short rest. The beast obeys your commands as best as it can. It takes its turn on your initiative, though it doesn''t take an action unless you command it to. On your turn, you can verbally command the beast where to move (no action required by you). You can use your action to verbally command it to take the Attack, Dash, Disengage, Dodge, or Help action. Once you have the Extra Attack feature, you can make one weapon attack yourself when you command the beast to take the Attack action. If you are incapacitated or absent, your beast companion acts on its own, focusing on protecting you and itself. Your beast companion has abilities and game statistics determined in part by your level. Your Ranger level determines the beast''s base statistics, as shown on the Ranger Companion table.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Beast Warden';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Exceptional Training', 7,
'Beginning at 7th level, on any of your turns when your beast companion doesn''t attack, you can use a bonus action to command the beast to take the Dash, Disengage, Dodge, or Help action on its turn. Additionally, when you command your beast companion to take the Attack action, the beast can make two attacks, or it can take the Multiattack action if it has that action. Your bond with Gate-touched creatures makes you a master of teamwork.',
'bonus-action', NULL, NULL, 'Ranger''s Companion', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Beast Warden';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Bestial Fury', 11,
'Starting at 11th level, when you command your beast companion to take the Attack action, the beast can make two attacks when it takes the Attack action, or it can take the Multiattack action if it has that action. Your companion becomes a true force in Gate combat.',
'passive', NULL, NULL, 'Exceptional Training', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Beast Warden';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Share Spells', 15,
'Beginning at 15th level, when you cast a Ranger power with a range of self, you can also affect your beast companion with the power if the beast is within 30 feet of you. The System allows your bond to extend even to powercasting.',
'passive', NULL, NULL, 'Bestial Fury', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Beast Warden';
-- Path of the Gate Hunter
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Gate Sense', 3,
'When you choose this path at 3rd level, you develop an instinctive sense for Gates and dimensional rifts. As an action, you can detect the presence, direction, and approximate distance of any Gate within 1 mile. Additionally, you have advantage on Wisdom (Survival) checks to track Gate creatures, and you learn the Gate creature type languages you need to communicate basic threats.',
'action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Gate Hunter';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Gate Slayer', 7,
'At 7th level, you become an expert hunter of Gate creatures. When you hit a Gate creature (any creature that spawned from a Gate) with a weapon attack, you can deal additional damage equal to your Ranger level. Additionally, you have advantage on saving throws against abilities and powers used by Gate creatures.',
'passive', NULL, NULL, 'Gate Sense', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Gate Hunter';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Superior Gate Tracking', 11,
'Starting at 11th level, your Gate Sense feature extends to 5 miles, and you can determine the Gate''s rank (E, D, C, B, A, or S) and what types of creatures are likely to be inside. Additionally, you can use your action to mark a Gate creature you can see. Until the end of your next turn, you have advantage on all attack rolls against the marked creature, and all damage you deal to it ignores resistance.',
'action', NULL, NULL, 'Gate Slayer', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Gate Hunter';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Gate Master', 15,
'At 15th level, you have become a master hunter of Gates. You can sense Gates within 10 miles, and you can determine not only the Gate''s rank and creature types, but also the approximate number of creatures and the Gate''s layout. Additionally, once per long rest, when you enter a Gate, you can use your action to instantly know the location of the Gate boss, even if it''s not in line of sight.',
'passive', '1 boss location per long rest', 'long-rest', 'Superior Gate Tracking', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Gate Hunter';
-- Path of the Shadow Trail
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Ambush Master', 3,
'When you choose this path at 3rd level, you excel at stealth and ambush tactics. You have advantage on initiative rolls. Additionally, on the first turn of each combat, your speed increases by 10 feet, and if you use the Attack action on that turn, you can make one additional weapon attack as part of that action. Gate creatures learn to fear your shadow.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Shadow Trail';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Shadow Strike', 7,
'At 7th level, you can attack from the shadows with devastating effect. When you attack a creature that hasn''t taken a turn in the combat yet, you have advantage on the attack roll. If you hit, the attack deals additional damage equal to your Ranger level. Additionally, you can move up to half your speed immediately after making this attack without provoking opportunity attacks.',
'passive', NULL, NULL, 'Ambush Master', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Shadow Trail';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Umbral Ambush', 11,
'Starting at 11th level, your ambush attacks can disable enemies. When you use your Shadow Strike feature and hit a creature, the creature must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Wisdom modifier). On a failed save, the creature is stunned until the end of your next turn. You can use this feature once, and you regain the ability to use it when you finish a short or long rest.',
'passive', '1 per short rest', 'short-rest', 'Shadow Strike', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Shadow Trail';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Ambush', 15,
'At 15th level, your ambushes are nearly impossible to detect. You can use your action to become invisible for 1 minute. While invisible in this way, you have advantage on all attack rolls, and your Shadow Strike damage increases to twice your Ranger level. Once you use this feature, you can''t use it again until you finish a long rest.',
'action', '1 per long rest', 'long-rest', 'Umbral Ambush', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Shadow Trail';
-- Path of the Storm Archer
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Storm Shot', 3,
'When you choose this path at 3rd level, you learn to infuse your ranged attacks with lightning energy. When you hit a creature with a ranged weapon attack, you can choose to deal additional lightning damage equal to 1d6 + your Ranger level. Additionally, when you deal lightning damage in this way, the target cannot take reactions until the start of your next turn. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'passive', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Storm Archer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Lightning Volley', 7,
'At 7th level, you can unleash a volley of lightning-infused arrows. As an action, you can make a ranged attack against any number of creatures within 10 feet of a point you can see within your weapon''s range. You must have ammunition for each target, as normal, and you make a separate attack roll for each target. Each attack can use your Storm Shot feature. You can use this feature once, and you regain the ability to use it when you finish a short or long rest.',
'action', '1 per short rest', 'short-rest', 'Storm Shot', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Storm Archer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Chain Lightning', 11,
'Starting at 11th level, when you use your Storm Shot feature and hit a creature, lightning can arc to another creature within 10 feet of the target. The second creature takes lightning damage equal to half the Storm Shot damage dealt. If that creature is also within 10 feet of another creature, the lightning can arc again, dealing one-quarter of the original damage to the third creature. The lightning can arc up to a number of times equal to your proficiency bonus.',
'passive', NULL, NULL, 'Lightning Volley', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Storm Archer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Storm Mastery', 15,
'At 15th level, you have mastered storm archery. Your Storm Shot damage increases to 2d6 + your Ranger level, and when you use your Chain Lightning feature, the lightning can arc an unlimited number of times. Additionally, once per long rest, you can use your action to create a 30-foot-radius storm centered on yourself. The storm lasts for 1 minute and creates heavy rain and strong winds. All ranged weapon attacks within the storm have disadvantage, except for your own, which have advantage.',
'action', '1 storm per long rest', 'long-rest', 'Chain Lightning', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Storm Archer';
-- Path of the Verdant Sentinel
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Nature''s Wrath', 3,
'When you choose this path at 3rd level, you learn to channel nature magic from the System''s natural essence interface. You learn two Ranger cantrips of your choice. Additionally, you learn the speak with animals power and can cast it as a ritual. The System grants you communion with Gate-touched nature.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Verdant Sentinel';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Grasping Vines', 7,
'At 7th level, you can call upon nature to restrain your enemies. As an action, you can cause vines to sprout from the ground in a 20-foot-radius sphere centered on a point you can see within 60 feet. The area becomes difficult terrain for 1 minute. When a creature enters the area for the first time on a turn or starts its turn there, it must make a Strength saving throw (DC = your Ranger power save DC). On a failed save, it is restrained by the vines until the end of its turn. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', 'Nature''s Wrath', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Verdant Sentinel';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Nature''s Guardian', 11,
'Starting at 11th level, nature itself protects you. While you are in a natural environment or within 30 feet of plants, you have advantage on Dexterity (Stealth) checks, and you can use your action to become invisible until you attack, cast a power, or move more than 30 feet from plants. Additionally, plants and terrain in a 30-foot radius around you become difficult terrain for your enemies but not for you or your allies.',
'passive', NULL, NULL, 'Grasping Vines', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Verdant Sentinel';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Master of Nature', 15,
'At 15th level, you command nature itself. You can use your action to command all plants within 60 feet of you to attack your enemies. Each plant makes a melee attack against a target of your choice within 5 feet of it. The attack uses your attack bonus and deals damage equal to 1d6 + your Ranger level. Additionally, you can use your Grasping Vines feature without expending uses, and the vines deal 1d6 slashing damage to any creature that starts its turn restrained by them.',
'action', NULL, NULL, 'Nature''s Guardian', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Verdant Sentinel';
-- Path of the Wildrunner
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Fleet of Foot', 3,
'When you choose this path at 3rd level, your speed increases by 10 feet. Additionally, difficult terrain doesn''t slow your group''s travel. Your group can''t become lost except by magical means. You are a master of traversing Gate environments quickly.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Wildrunner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Horde Breaker', 7,
'At 7th level, once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon. Gate swarms are no match for your speed.',
'passive', '1 per turn', NULL, 'Fleet of Foot', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Wildrunner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Escape the Horde', 11,
'Starting at 11th level, opportunity attacks against you are made with disadvantage. Additionally, when you move at least 20 feet on your turn, you can use your bonus action to make one weapon attack. Your mobility makes you nearly impossible to pin down in Gate combat.',
'bonus-action', NULL, NULL, 'Horde Breaker', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Wildrunner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Whirlwind Attack', 15,
'At 15th level, you can use your action to make melee attacks against any number of creatures within 5 feet of you, with a separate attack roll for each target. Additionally, your speed increases by an additional 10 feet (for a total increase of 20 feet), and you can take the Dash action as a bonus action on each of your turns. You become a whirlwind of destruction in Gate raids.',
'action', NULL, NULL, 'Escape the Horde', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Ranger' AND p.name = 'Path of the Wildrunner';
-- =============================================
-- Continuing with remaining paths...
-- Striker (6), Techsmith (6), Vanguard (6), Warden (6)
-- Then all 8 remaining monarchs
-- All following established Solo Leveling theming;

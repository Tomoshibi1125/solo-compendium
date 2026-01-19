-- =============================================
-- FINALIZE ALL REMAINING PATHS AND MONARCHS - SOLO LEVELING ALIGNED
-- =============================================
-- This migration completes:
-- - Remaining 24 paths: Striker (6), Techsmith (6), Vanguard (6), Warden (6)
-- - All 8 remaining monarchs: Beast, Iron Body, Plague, Frost, Stone, Destruction, White Flames, Transfiguration
-- All features fully aligned with Solo Leveling manhwa universe, post-reset timeline
--
-- Pattern: Each path gets 4 features (levels 3, 6, 10, 14)
-- Pattern: Each monarch gets features at appropriate levels (7, 9, 11, 13, 15, 17, 20)
-- Destruction Monarch unlocks at 11

-- =============================================
-- STRIKER PATHS (6 paths) - Complete All Features
-- =============================================
-- All aligned with System energy channeling, speed, and precision strikes

-- Path of the Blitz Raider
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Blitz Rush', 3,
'When you choose this path at 3rd level, you gain incredible speed through System energy channeling. Your speed increases by 10 feet. Additionally, when you take the Dash action, you can make one weapon attack as a bonus action. Your attacks are a blur in Gate combat.',
'bonus-action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Blitz Raider';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Lightning Strikes', 6,
'At 6th level, your speed allows you to strike multiple targets. When you use your Blitz Rush feature, you can make weapon attacks against any number of creatures you move past during your movement. Each attack must target a different creature.',
'passive', NULL, NULL, 'Blitz Rush', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Blitz Raider';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Speed Burst', 10,
'Starting at 10th level, you can channel System energy for a burst of impossible speed. As a bonus action, you can double your speed until the end of your turn. During this time, opportunity attacks against you are made with disadvantage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'bonus-action', 'proficiency bonus', 'long-rest', 'Lightning Strikes', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Blitz Raider';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Blitz', 14,
'At 14th level, your speed reaches perfection. Your speed increases by an additional 10 feet (total 20 feet). Additionally, once per turn when you hit a creature with a weapon attack, you can make an additional weapon attack against a different creature within 5 feet of the first. Gate enemies cannot escape your blitz.',
'passive', '1 per turn', NULL, 'Speed Burst', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Blitz Raider';
-- Path of the Deadeye (Precision Striker)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Precision Strike', 3,
'When you choose this path at 3rd level, you learn to target vital points with System-enhanced precision. Once per turn, when you hit a creature with a weapon attack, you can choose to deal additional damage equal to your Striker level. Additionally, you have advantage on attack rolls against creatures that haven''t taken a turn in the combat yet.',
'passive', '1 per turn', NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Deadeye';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Critical Focus', 6,
'At 6th level, your precision allows you to score critical hits more easily. Your weapon attacks score a critical hit on a roll of 19 or 20. Additionally, when you score a critical hit, you can roll one additional die when determining the extra damage.',
'passive', NULL, NULL, 'Precision Strike', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Deadeye';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Shot', 10,
'Starting at 10th level, you can ensure your strikes always hit vital points. When you make an attack roll and miss, you can use your reaction to reroll the attack. You must use the new roll. Additionally, your critical hit range increases to 18-20. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'reaction', 'proficiency bonus', 'long-rest', 'Critical Focus', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Deadeye';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Death Mark', 14,
'At 14th level, you can mark a creature for death. As a bonus action, you can mark a creature you can see within 60 feet. For 1 minute, all weapon attacks you make against the marked creature score a critical hit on a roll of 17-20. Additionally, when you score a critical hit against the marked creature, it must make a Constitution saving throw (DC = 8 + your proficiency bonus + your Agility modifier) or be stunned until the end of your next turn. Once you use this feature, you can''t use it again until you finish a long rest.',
'bonus-action', '1 per long rest', 'long-rest', 'Perfect Shot', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Deadeye';
-- Path of the Executioner (Finishing Strikes)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Finishing Blow', 3,
'When you choose this path at 3rd level, you excel at finishing wounded enemies. When you hit a creature that has half its hit points or fewer, your weapon attacks deal additional damage equal to your Striker level. Additionally, when you reduce a creature to 0 hit points with a melee weapon attack, you can use your bonus action to make one weapon attack against a different creature within 5 feet.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Executioner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Execute', 6,
'At 6th level, you can deliver devastating finishing strikes. When you hit a creature that has 25% of its hit points or fewer, you can choose to deal maximum damage instead of rolling. Additionally, if this attack reduces the creature to 0 hit points, you regain mana points equal to your proficiency bonus. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'passive', 'proficiency bonus', 'long-rest', 'Finishing Blow', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Executioner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Death Sentence', 10,
'Starting at 10th level, you can mark a creature for immediate execution. As a bonus action, you can mark a creature you can see within 30 feet. The next time you hit the marked creature with a weapon attack before the end of your next turn, the attack deals additional damage equal to twice your Striker level. If this damage reduces the creature to 0 hit points, you can make a weapon attack against another creature within 5 feet as a bonus action.',
'bonus-action', 'proficiency bonus per long rest', 'long-rest', 'Execute', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Executioner';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Execution', 14,
'At 14th level, your finishing strikes are nearly impossible to survive. When you hit a creature that has 25% of its hit points or fewer, the attack automatically scores a critical hit. Additionally, once per long rest, when you reduce a creature to 0 hit points with a weapon attack, you can choose to instantly kill a second creature within 30 feet that has 25% of its hit points or fewer. This feature cannot affect creatures immune to critical hits.',
'passive', '1 instant kill per long rest', 'long-rest', 'Death Sentence', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Executioner';
-- Path of the Ghost Blade (Phasing Strikes)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Phasing Strike', 3,
'When you choose this path at 3rd level, you learn to phase through defenses. When you make a weapon attack, you can choose to ignore half cover, three-quarters cover, and resistance to the attack''s damage. Additionally, once per turn, when you hit a creature with a weapon attack, you can phase through it, moving through its space as if it were difficult terrain.',
'passive', '1 per turn', NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Ghost Blade';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Intangible Form', 6,
'At 6th level, you can briefly become intangible. As a bonus action, you can become incorporeal for 1 minute. While incorporeal, you can move through other creatures and objects as if they were difficult terrain, and you have resistance to all damage except force damage. If you end your turn inside an object, you take 1d10 force damage. You can use this feature once, and you regain the ability to use it when you finish a short or long rest.',
'bonus-action', '1 per short rest', 'short-rest', 'Phasing Strike', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Ghost Blade';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Ethereal Weapon', 10,
'Starting at 10th level, your weapon attacks can phase through all defenses. Your weapon attacks ignore all damage resistance and immunity. Additionally, when you use your Phasing Strike feature, you can also ignore immunity to critical hits.',
'passive', NULL, NULL, 'Intangible Form', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Ghost Blade';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Phasing', 14,
'At 14th level, you can phase through reality itself. You can use your Intangible Form feature without expending uses, and while incorporeal, you deal double damage with all weapon attacks. Additionally, once per long rest, you can use your action to become completely intangible for 1 minute, during which you are immune to all damage and can move through any barrier, even magical ones.',
'passive', '1 perfect phase per long rest', 'long-rest', 'Ethereal Weapon', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Ghost Blade';
-- Path of the Pressure Duelist (Single Target Focus)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Duelist Focus', 3,
'When you choose this path at 3rd level, you excel in one-on-one combat. When you are within 5 feet of exactly one creature, you have advantage on all attack rolls against that creature. Additionally, when you hit a creature you are dueling, you can deal additional damage equal to your proficiency bonus.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Pressure Duelist';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Pressure Point', 6,
'At 6th level, you can exploit pressure points through System energy. When you hit a creature you are dueling, you can choose to force it to make a Constitution saving throw (DC = 8 + your proficiency bonus + your Agility modifier). On a failed save, the creature has disadvantage on attack rolls against you until the end of your next turn. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'passive', 'proficiency bonus', 'long-rest', 'Duelist Focus', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Pressure Duelist';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Duel', 10,
'Starting at 10th level, you are unmatched in single combat. When you are dueling a creature, that creature has disadvantage on all attack rolls against creatures other than you. Additionally, once per turn, when you hit a creature you are dueling, you can make an additional weapon attack against it as a bonus action.',
'passive', '1 per turn', NULL, 'Pressure Point', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Pressure Duelist';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Master Duelist', 14,
'At 14th level, you have perfected the art of the duel. When you are within 5 feet of exactly one creature, all your attacks against that creature automatically score a critical hit. Additionally, when you score a critical hit against a creature you are dueling, you can choose to force it to make a Wisdom saving throw (DC = 8 + your proficiency bonus + your Agility modifier). On a failed save, the creature becomes frightened of you for 1 minute. Once you use this benefit, you can''t use it again until you finish a long rest.',
'passive', '1 fear per long rest', 'long-rest', 'Perfect Duel', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Pressure Duelist';
-- Path of the Shockstep Adept (Movement-Based Combat)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Shockstep', 3,
'When you choose this path at 3rd level, you learn to teleport short distances using System energy. As a bonus action, you can teleport up to 30 feet to an unoccupied space you can see. When you appear, you can make one weapon attack. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a short or long rest.',
'bonus-action', 'proficiency bonus', 'short-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Shockstep Adept';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Momentum Strike', 6,
'At 6th level, your movement enhances your attacks. When you move at least 10 feet on your turn before making a weapon attack, that attack deals additional damage equal to the number of feet you moved (maximum 30 feet = +30 damage). Additionally, when you use your Shockstep feature, you can make weapon attacks against all creatures within 5 feet of your destination.',
'passive', NULL, NULL, 'Shockstep', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Shockstep Adept';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Momentum', 10,
'Starting at 10th level, you can maintain perfect momentum. When you use your Shockstep feature, you don''t expend a use. Additionally, when you move at least 20 feet on your turn, you can use your bonus action to make a weapon attack. Gate enemies cannot keep up with your speed.',
'passive', NULL, NULL, 'Momentum Strike', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Shockstep Adept';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Impossible Speed', 14,
'At 14th level, you move at impossible speeds. Your Shockstep distance increases to 60 feet, and you can use it as an action to teleport to any unoccupied space within 120 feet. When you appear, you can make weapon attacks against all creatures within 10 feet of your destination. Additionally, once per long rest, you can use your action to move at such speed that you can take two turns in a row, resetting after the second turn.',
'action', '1 double turn per long rest', 'long-rest', 'Perfect Momentum', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Striker' AND p.name = 'Path of the Shockstep Adept';
-- =============================================
-- TECHSMITH PATHS (6 paths) - Complete All Features
-- =============================================
-- All aligned with technology, System interface, and Hunter gear

-- Path of the Arc Reactor
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Arc Reactor Core', 3,
'When you choose this path at 3rd level, you create a portable arc reactor that generates System energy. The reactor powers all your Techsmith infusions and devices. You can use your action to release stored energy, dealing 2d8 lightning damage to all creatures in a 15-foot cone. Additionally, all your infused items function for twice as long before needing recharging. You can use the energy blast a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Arc Reactor';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Power Overload', 6,
'At 6th level, your arc reactor can overload for massive damage. When you use your Arc Reactor Core feature, you can choose to overload it. If you do, the damage increases to 4d8 lightning damage, and the area increases to a 30-foot cone. However, you take force damage equal to your Techsmith level. You can use the overload once, and you regain the ability to use it when you finish a long rest.',
'passive', '1 overload per long rest', 'long-rest', 'Arc Reactor Core', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Arc Reactor';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Unlimited Power', 10,
'Starting at 10th level, your arc reactor generates unlimited energy. Your infused items never need recharging, and you can maintain twice as many infused items. Additionally, you can use your Arc Reactor Core feature without expending uses, and you have resistance to lightning and force damage.',
'passive', NULL, NULL, 'Power Overload', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Arc Reactor';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Reactor', 14,
'At 14th level, your arc reactor achieves perfect efficiency. When you use your Arc Reactor Core feature, you can choose to deal maximum damage instead of rolling. Additionally, once per long rest, you can use your action to create a 60-foot-radius sphere of electrical energy centered on yourself. All creatures in the area take 8d8 lightning damage, or half as much on a successful Dexterity saving throw (DC = your Techsmith power save DC). You are immune to this damage.',
'action', '1 sphere per long rest', 'long-rest', 'Unlimited Power', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Arc Reactor';
-- Path of the Drone Commander
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Combat Drone', 3,
'When you choose this path at 3rd level, you gain a mechanical drone companion. The drone is a Tiny construct with AC 15, hit points equal to twice your Techsmith level, and a speed of 30 feet (flying). It obeys your commands and takes its turn immediately after yours. You can use a bonus action to command the drone to attack, using your Intelligence modifier for attack rolls and dealing 1d4 + your Intelligence modifier damage. The drone can also be used to deliver infusions within 120 feet of you.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Drone Commander';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Drone Swarm', 6,
'At 6th level, you can deploy multiple drones. You can have a number of active drones equal to your proficiency bonus. When you command your drones to attack, you can have them all attack the same target or different targets. Additionally, your drones have advantage on attack rolls against creatures within 5 feet of another drone.',
'passive', NULL, NULL, 'Combat Drone', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Drone Commander';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Advanced Drones', 10,
'Starting at 10th level, your drones become more powerful. Each drone''s attack damage increases to 2d4 + your Intelligence modifier, and drones can be equipped with special modules. Choose one module type: Shield Module (drone grants +2 AC to adjacent allies), Damage Module (drone deals an additional die of damage), or Support Module (drone can use the Help action at range). You can switch modules during a long rest.',
'passive', NULL, NULL, 'Drone Swarm', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Drone Commander';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Swarm', 14,
'At 14th level, you command a perfect drone swarm. You can have an unlimited number of active drones, and each drone gains all three module types. Additionally, once per long rest, you can use your action to deploy all drones in a devastating swarm attack. All drones converge on a point you can see within 120 feet, dealing 1d4 damage per drone to all creatures in a 20-foot-radius sphere. You control the battlefield with mechanical precision.',
'action', '1 swarm attack per long rest', 'long-rest', 'Advanced Drones', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Drone Commander';
-- Path of the Field Medic (Medical Technology)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Medical Kit', 3,
'When you choose this path at 3rd level, you create advanced medical technology. You gain proficiency with Medicine checks, and you can use your Techsmith tools to stabilize dying creatures as a bonus action. Additionally, when you restore hit points to a creature using an infusion or device, you can restore additional hit points equal to your Intelligence modifier.',
'bonus-action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Field Medic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Revival Device', 6,
'At 6th level, you can create devices that bring allies back from the brink. As an action, you can use your medical kit on a creature that has 0 hit points. The creature is restored to 1 hit point and regains consciousness. Additionally, you can cure one disease or one poison affecting the target. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', 'Medical Kit', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Field Medic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Advanced Medicine', 10,
'Starting at 10th level, your medical technology can restore limbs and remove all conditions. When you use your Revival Device feature, the target also regains all spent Hit Dice and can choose to end one condition affecting it. Additionally, you can use your action to create a healing aura in a 30-foot radius around yourself. Friendly creatures in the aura regain hit points equal to your Intelligence modifier at the start of each of their turns. The aura lasts for 1 minute.',
'action', '1 aura per long rest', 'long-rest', 'Revival Device', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Field Medic';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Medicine', 14,
'At 14th level, your medical technology approaches System-level intervention. When you use your Revival Device feature, you can restore a creature to its hit point maximum instead of 1 hit point. Additionally, once per long rest, you can use your action to instantly cure all diseases, poisons, and conditions affecting all creatures of your choice within 60 feet. Technology can match the System''s healing power.',
'passive', '1 mass cure per long rest', 'long-rest', 'Advanced Medicine', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Field Medic';
-- Path of the Ghost Protocol (Stealth Technology)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Stealth Field', 3,
'When you choose this path at 3rd level, you create technology that bends light and System energy. You can use your action to activate a stealth field that makes you invisible for 1 minute. While invisible, you have advantage on Stealth checks, and creatures have disadvantage on attack rolls against you. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Ghost Protocol';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Invisibility', 6,
'At 6th level, your stealth technology becomes undetectable. When you use your Stealth Field feature, you can also extend it to cover a number of creatures equal to your proficiency bonus. Additionally, your stealth field cannot be detected by truesight or other detection methods short of System-level awareness.',
'passive', NULL, NULL, 'Stealth Field', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Ghost Protocol';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Phase Shift', 10,
'Starting at 10th level, your technology can phase through matter. When you use your Stealth Field feature, you can also become incorporeal for the duration. While incorporeal, you can move through other creatures and objects as if they were difficult terrain. You take 1d10 force damage if you end your turn inside an object.',
'passive', NULL, NULL, 'Perfect Invisibility', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Ghost Protocol';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Ghost Mode', 14,
'At 14th level, you achieve perfect stealth. You can use your Stealth Field feature without expending uses, and while it''s active, you deal double damage with all attacks. Additionally, once per long rest, you can use your action to become completely undetectable for 1 hour. During this time, you cannot be detected by any means, you can move through any barrier (including magical ones), and you deal triple damage with all attacks.',
'passive', '1 perfect stealth per long rest', 'long-rest', 'Phase Shift', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Ghost Protocol';
-- Path of the Relic Smith (Item Crafting)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Master Craftsman', 3,
'When you choose this path at 3rd level, you excel at creating and enhancing Hunter relics. You can create magic items in half the normal time and cost. Additionally, you can use your Infuse Item feature to create temporary magic items that last for 24 hours instead of indefinitely. These temporary items can be more powerful than normal infusions.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Relic Smith';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Relic Enhancement', 6,
'At 6th level, you can enhance existing magic items. As an action, you can touch a magic item and enhance it with one of your Techsmith infusions. The item gains the benefits of the infusion in addition to its existing properties. You can maintain a number of enhanced items equal to your proficiency bonus. The enhancement lasts until you dismiss it or enhance a different item.',
'action', NULL, NULL, 'Master Craftsman', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Relic Smith';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Crafting', 10,
'Starting at 10th level, you can create legendary relics. You can craft magic items of any rarity, and the time and cost are reduced by 75%. Additionally, once per long rest, you can use your action to instantly create a magic item of rare or lower rarity that you have seen before. The item functions for 24 hours before disappearing.',
'action', '1 instant item per long rest', 'long-rest', 'Relic Enhancement', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Relic Smith';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Artisan Supreme', 14,
'At 14th level, you are a master of all crafting. You can craft magic items instantly without cost or materials. Additionally, once per long rest, you can use your action to create a legendary magic item that functions for 1 week. Your crafting rivals System-created relics in the post-reset world.',
'action', '1 legendary item per long rest', 'long-rest', 'Perfect Crafting', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Relic Smith';
-- Path of the Siege Engineer (Heavy Weapons)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Siege Weapon', 3,
'When you choose this path at 3rd level, you can deploy heavy weapons and fortifications. As an action, you can set up a portable siege weapon (ballista, cannon, or turret) in an unoccupied space within 5 feet of you. The weapon has AC 15, hit points equal to your Techsmith level × 2, and can make ranged attacks using your Intelligence modifier. It deals 2d10 damage on a hit. You can have one active siege weapon at a time.',
'action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Siege Engineer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Fortification', 6,
'At 6th level, you can create defensive fortifications. As an action, you can deploy a 10-foot-square barrier that provides half cover. The barrier has AC 15, hit points equal to your Techsmith level × 5, and is immune to poison and psychic damage. You can maintain a number of barriers equal to your proficiency bonus.',
'action', NULL, NULL, 'Siege Weapon', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Siege Engineer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Heavy Arsenal', 10,
'Starting at 10th level, you can deploy multiple weapons and fortifications. You can maintain siege weapons and barriers equal to your proficiency bonus each. Additionally, your siege weapons deal 3d10 damage and can target multiple creatures in a 10-foot-radius area.',
'passive', NULL, NULL, 'Fortification', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Siege Engineer';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Fortress', 14,
'At 14th level, you can create an impenetrable fortress. Once per long rest, you can use your action to deploy a 30-foot-radius fortress with walls, multiple siege weapons, and defensive systems. All friendly creatures inside have three-quarters cover, and the fortress''s weapons automatically fire at enemies within range. The fortress lasts for 1 hour or until you dismiss it.',
'action', '1 fortress per long rest', 'long-rest', 'Heavy Arsenal', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Techsmith' AND p.name = 'Path of the Siege Engineer';
-- =============================================
-- VANGUARD PATHS (6 paths) - Complete All Features
-- =============================================
-- All aligned with defense, protection, and frontline combat

-- Path of the Bastion (Defensive Positioning)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Bastion Stance', 3,
'When you choose this path at 3rd level, you learn defensive techniques that make you immovable. As a bonus action, you can enter a bastion stance. While in this stance, your speed becomes 0, you have advantage on all Strength and Constitution saving throws, and creatures have disadvantage on attack rolls against you if you are within 5 feet of a wall or barrier. The stance lasts for 1 minute or until you end it as a bonus action.',
'bonus-action', 'proficiency bonus per long rest', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Bastion';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Immovable Object', 6,
'At 6th level, you become nearly impossible to move. While in your Bastion Stance, you cannot be moved against your will by any means, and you have resistance to all damage. Additionally, when you are targeted by an effect that would move you, you can use your reaction to reduce the effect''s damage by your Vanguard level.',
'reaction', NULL, NULL, 'Bastion Stance', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Bastion';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Defense', 10,
'Starting at 10th level, your bastion stance becomes perfect. While in your Bastion Stance, you have immunity to being charmed, frightened, or stunned. Additionally, all attacks against you have disadvantage, and you have advantage on all saving throws.',
'passive', NULL, NULL, 'Immovable Object', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Bastion';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Ultimate Bastion', 14,
'At 14th level, you become a true bastion. You can use your Bastion Stance without expending uses, and while in it, you are immune to all damage. Additionally, once per long rest, you can use your action to extend your bastion protection to all allies within 30 feet, granting them all the benefits of your Perfect Defense feature for 1 minute.',
'action', '1 mass protection per long rest', 'long-rest', 'Perfect Defense', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Bastion';
-- Path of the Battle Captain (Tactical Leadership)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Command Presence', 3,
'When you choose this path at 3rd level, you become a natural leader on the battlefield. As a bonus action, you can issue a command to one ally within 30 feet. The ally can immediately use their reaction to make one weapon attack or take the Dash, Disengage, or Dodge action. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a short or long rest. Your tactical commands coordinate Gate raids perfectly.',
'bonus-action', 'proficiency bonus', 'short-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Battle Captain';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Rallying Cry', 6,
'At 6th level, you can inspire your allies to greatness. As an action, you can give a rallying cry. All friendly creatures within 60 feet can immediately spend one of their Hit Dice to regain hit points. Additionally, they have advantage on their next attack roll before the end of your next turn. You can use this feature once, and you regain the ability to use it when you finish a short or long rest. Your leadership turns the tide of battle.',
'action', '1 per short rest', 'short-rest', 'Command Presence', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Battle Captain';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Tactical Mastery', 10,
'Starting at 10th level, your tactical knowledge is unmatched. You can grant advantage on attack rolls to all allies within 30 feet of you as a bonus action. Additionally, once per long rest, you can use your action to grant all allies within 60 feet an extra action on their next turn. Your strategies are flawless, coordinating entire Hunter teams.',
'bonus-action', NULL, NULL, 'Rallying Cry', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Battle Captain';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Coordination', 14,
'At 14th level, you achieve perfect battlefield coordination. When you use your Command Presence feature, you can target all allies within 30 feet instead of one. Additionally, you can use your Rallying Cry as a bonus action, and allies affected gain temporary hit points equal to your Vanguard level. Your leadership makes any team unstoppable in Gate combat.',
'bonus-action', NULL, NULL, 'Tactical Mastery', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Battle Captain';
-- Path of the Iron Guard (Heavy Armor Defense)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Iron Armor Mastery', 3,
'When you choose this path at 3rd level, you master heavy armor. You ignore the Strength requirement for heavy armor, and you can don or doff heavy armor in half the normal time. Additionally, while wearing heavy armor, you have a +1 bonus to AC, and you have resistance to slashing, piercing, and bludgeoning damage from nonmagical attacks. Your armor becomes a second skin, like Hunter defensive gear.',
'passive', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Iron Guard';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Damage Reduction', 6,
'At 6th level, your iron guard training reduces incoming damage. When you take damage while wearing heavy armor, you can use your reaction to reduce the damage by your Vanguard level + your proficiency bonus. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a short or long rest. Your armor absorbs the worst hits.',
'reaction', 'proficiency bonus', 'short-rest', 'Iron Armor Mastery', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Iron Guard';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Unbreakable Defense', 10,
'Starting at 10th level, your defense becomes unbreakable. While wearing heavy armor, you have immunity to critical hits, and attacks that would normally have advantage against you don''t. Additionally, you can use your Damage Reduction feature without expending uses, and the damage reduction increases to twice your Vanguard level. Your armor is impenetrable.',
'passive', NULL, NULL, 'Damage Reduction', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Iron Guard';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Iron Guard', 14,
'At 14th level, you become the perfect iron guard. Your AC bonus from Iron Armor Mastery increases to +2, and you have resistance to all damage while wearing heavy armor. Additionally, once per long rest, you can use your action to become immune to all damage for 1 minute. Your iron defense is absolute, unmatched in Gate combat.',
'action', '1 immunity per long rest', 'long-rest', 'Unbreakable Defense', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Iron Guard';
-- Path of the Mobile Ward (Moving Protection)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Protective Movement', 3,
'When you choose this path at 3rd level, you can protect allies while moving. When you move within 5 feet of an ally, you can use your reaction to grant them a +2 bonus to AC until the start of your next turn. Additionally, your movement doesn''t provoke opportunity attacks from creatures you have attacked this turn. You weave through combat protecting your team.',
'reaction', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Mobile Ward';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Intercept Attack', 6,
'At 6th level, you can intercept attacks meant for allies. When a creature within 5 feet of you is targeted by an attack, you can use your reaction to move to that ally''s space and become the target of the attack instead. If the attack hits, you take half damage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a short or long rest. You take hits meant for your allies.',
'reaction', 'proficiency bonus', 'short-rest', 'Protective Movement', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Mobile Ward';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Flowing Defense', 10,
'Starting at 10th level, your protective movement becomes fluid. When you use your Protective Movement feature, you can affect all allies within 5 feet of your path of movement. Additionally, you can use your Intercept Attack feature without expending uses, and you can intercept attacks targeting allies within 10 feet. You flow through battle protecting everyone.',
'passive', NULL, NULL, 'Intercept Attack', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Mobile Ward';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Ward', 14,
'At 14th level, you become a perfect mobile ward. Your Protective Movement bonus increases to +4 AC, and allies you protect also gain resistance to all damage until the start of your next turn. Additionally, once per long rest, you can use your action to grant all allies within 30 feet temporary hit points equal to twice your Vanguard level. Your protection flows everywhere.',
'action', '1 mass protection per long rest', 'long-rest', 'Flowing Defense', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Mobile Ward';
-- Path of the Sentinel (Watchful Guardian)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Guardian Reaction', 3,
'When you choose this path at 3rd level, you can react to threats instantly. When a creature within 5 feet of you makes an attack against a target other than you, you can use your reaction to make a melee weapon attack against that creature. Additionally, you have advantage on opportunity attacks, and opportunity attacks you make reduce the target''s speed to 0 until the end of your next turn. You watch and protect constantly.',
'reaction', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Sentinel';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Vigilant Watch', 6,
'At 6th level, your vigilance is superhuman. You can''t be surprised while you are conscious, and you can see invisible creatures within 30 feet of you. Additionally, when you take a short rest, you can choose to remain alert, allowing you and allies within 30 feet to benefit from the rest even if attacked. You never let your guard down.',
'passive', NULL, NULL, 'Guardian Reaction', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Sentinel';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Awareness', 10,
'Starting at 10th level, your awareness is perfect. You can see through illusions and invisibility within 60 feet, and you automatically detect hidden creatures within that range. Additionally, when you use your Guardian Reaction feature, you can make two attacks instead of one. Nothing escapes your watch.',
'passive', NULL, NULL, 'Vigilant Watch', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Sentinel';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Absolute Sentinel', 14,
'At 14th level, you become the absolute sentinel. Your Guardian Reaction can trigger on any attack within 10 feet of you, and your attacks made with it deal maximum damage. Additionally, once per long rest, you can use your action to become aware of all threats within 120 feet, and you can immediately use your Guardian Reaction against each threatening creature. Your watch is absolute.',
'action', '1 perfect awareness per long rest', 'long-rest', 'Perfect Awareness', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Sentinel';
-- Path of the Shieldwall (Group Defense)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Shieldwall Formation', 3,
'When you choose this path at 3rd level, you can form defensive formations with allies. As a bonus action, you can designate a number of allies within 10 feet equal to your proficiency bonus. While these allies remain within 5 feet of each other, they gain a +1 bonus to AC, and attacks against them have disadvantage if they are adjacent to at least one other member of the formation. The formation lasts until you end it as a bonus action or members move more than 5 feet apart. Your formations protect the team.',
'bonus-action', NULL, NULL, NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Shieldwall';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Unified Defense', 6,
'At 6th level, your formations become more powerful. Members of your Shieldwall Formation share damage. When a member takes damage, you can use your reaction to have other members within the formation each take a share of the damage (divided equally). Additionally, members of the formation have resistance to area of effect damage while in formation. Your shieldwall is unbreakable.',
'reaction', NULL, NULL, 'Shieldwall Formation', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Shieldwall';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Formation', 10,
'Starting at 10th level, your formations are perfect. Your Shieldwall Formation bonus increases to +2 AC, and members can move up to 10 feet apart without breaking the formation. Additionally, once per short rest, you can use your action to grant all formation members temporary hit points equal to your Vanguard level. Your formations are legendary.',
'action', '1 per short rest', 'short-rest', 'Unified Defense', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Shieldwall';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Ultimate Shieldwall', 14,
'At 14th level, you create the ultimate shieldwall. Your Shieldwall Formation can include an unlimited number of allies, and the formation can extend up to 30 feet between members. Additionally, once per long rest, you can use your action to grant all formation members immunity to all damage for 1 round. Your shieldwall is impenetrable, the perfect team defense.',
'action', '1 immunity per long rest', 'long-rest', 'Perfect Formation', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Vanguard' AND p.name = 'Path of the Shieldwall';
-- =============================================
-- WARDEN PATHS (6 paths) - Complete All Features
-- =============================================
-- All aligned with barriers, battlefield control, and defensive magic
-- Wardens are defensive specialists who create barriers and control terrain

-- Path of the Frost Ring (Ice Barriers)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Frost Barrier', 3,
'When you choose this path at 3rd level, you can create barriers of ice. As an action, you can create a wall of ice up to 30 feet long, 10 feet high, and 1 foot thick. The wall appears on a surface you can see within 60 feet. Each 10-foot section has AC 12, 30 hit points, vulnerability to fire damage, and is difficult terrain. The wall lasts for 1 hour or until destroyed. Additionally, creatures that move through the wall take 2d6 cold damage. You create freezing defenses in Gate battles.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Frost Ring';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Frozen Zone', 6,
'At 6th level, you can create zones of absolute cold. As an action, you can designate a 20-foot-radius sphere centered on a point within 60 feet. The area becomes difficult terrain covered in ice, and creatures that enter or start their turn there take 2d6 cold damage. The zone lasts for 10 minutes or until you dismiss it. You can maintain a number of zones equal to your proficiency bonus. Your cold zones freeze enemies solid.',
'action', NULL, NULL, 'Frost Barrier', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Frost Ring';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Absolute Zero', 10,
'Starting at 10th level, your cold can freeze anything. Your Frost Barrier deals 4d6 cold damage to creatures that pass through, and creatures that take cold damage from your barriers must make a Constitution saving throw (DC = your Warden power save DC) or be frozen solid for 1 minute. Additionally, once per long rest, you can use your action to freeze all creatures in your Frozen Zone solid. Your cold is absolute.',
'action', '1 mass freeze per long rest', 'long-rest', 'Frozen Zone', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Frost Ring';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Frost Ring', 14,
'At 14th level, you create the perfect frost ring. Once per long rest, you can use your action to create a 60-foot-radius ring of ice centered on yourself. The ring creates a barrier 10 feet high and freezes all creatures inside solid. The barrier lasts for 1 hour or until destroyed, and creatures inside take 6d6 cold damage at the start of each of their turns. Your frost ring is impenetrable.',
'action', '1 per long rest', 'long-rest', 'Absolute Zero', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Frost Ring';
-- Path of the Iron Bastion (Metal Barriers)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Iron Barrier', 3,
'When you choose this path at 3rd level, you can create barriers of metal. As an action, you can create a wall of iron up to 30 feet long, 10 feet high, and 1 foot thick. The wall appears on a surface you can see within 60 feet. Each 10-foot section has AC 19, 50 hit points, and is immune to cold and fire damage. The wall lasts for 1 hour or until destroyed. Additionally, you can shape the barrier to have spikes, dealing 1d6 piercing damage to creatures that touch it. You create unbreakable metal defenses.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Iron Bastion';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Magnetic Field', 6,
'At 6th level, you can create magnetic fields around your barriers. As a bonus action, you can cause all metal objects within 30 feet of your barriers to be drawn toward them. Creatures wearing metal armor must make a Strength saving throw (DC = your Warden power save DC) or be pulled 10 feet toward the nearest barrier. Additionally, ranged weapon attacks made with metal weapons have disadvantage against creatures behind your barriers. Your magnetic fields control the battlefield.',
'bonus-action', NULL, NULL, 'Iron Barrier', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Iron Bastion';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Living Metal', 10,
'Starting at 10th level, your metal barriers come alive. Your Iron Barriers can move up to 10 feet per round as a bonus action, and they can reshape themselves to block attacks. Additionally, once per short rest, you can use your action to have a barrier attack nearby enemies, making a melee attack against each creature within 5 feet. Your barriers are living defenses.',
'bonus-action', NULL, NULL, 'Magnetic Field', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Iron Bastion';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Iron Bastion', 14,
'At 14th level, you create the perfect iron bastion. Once per long rest, you can use your action to create a 30-foot-radius fortress of iron with walls, towers, and defensive positions. All allies inside have three-quarters cover, and the fortress can fire metal spikes at enemies within range as a bonus action. The fortress lasts for 1 hour or until dismissed. Your iron bastion is a mobile fortress.',
'action', '1 per long rest', 'long-rest', 'Living Metal', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Iron Bastion';
-- Path of the Stonewall (Earth Barriers)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Stone Barrier', 3,
'When you choose this path at 3rd level, you can create barriers of earth and stone. As an action, you can create a wall of stone up to 30 feet long, 10 feet high, and 1 foot thick. The wall appears on a surface you can see within 60 feet. Each 10-foot section has AC 17, 40 hit points, and provides three-quarters cover. The wall lasts for 1 hour or until destroyed. Additionally, you can create the barrier from the ground, blocking line of sight. You create unbreakable stone defenses.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Stonewall';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Earth Tremor', 6,
'At 6th level, you can cause the earth to shake around your barriers. As a bonus action, you can cause the ground within 30 feet of your barriers to tremble. All creatures in the area must make a Dexterity saving throw (DC = your Warden power save DC) or be knocked prone. Additionally, the area becomes difficult terrain for enemies. You control the earth itself.',
'bonus-action', NULL, NULL, 'Stone Barrier', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Stonewall';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Mountain Defense', 10,
'Starting at 10th level, your stone barriers become mountains. Your Stone Barriers can be up to 20 feet thick, and you can create them in any shape. Additionally, once per short rest, you can use your action to raise a 60-foot-radius area around you by 10 feet, creating high ground for allies and difficult terrain for enemies. Your earth mastery is legendary.',
'action', '1 per short rest', 'short-rest', 'Earth Tremor', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Stonewall';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Stonewall', 14,
'At 14th level, you create the perfect stonewall. Once per long rest, you can use your action to surround yourself with concentric rings of stone barriers, creating a 60-foot-radius defensive position. All allies inside have full cover, and enemies must break through multiple barriers to reach you. The barriers regenerate if destroyed. Your stonewall is impenetrable.',
'action', '1 per long rest', 'long-rest', 'Mountain Defense', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Stonewall';
-- Path of the Stormgate (Lightning Barriers)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Lightning Barrier', 3,
'When you choose this path at 3rd level, you can create barriers of crackling energy. As an action, you can create a wall of lightning up to 30 feet long, 10 feet high, and 1 foot thick. The wall appears on a surface you can see within 60 feet. Each 10-foot section has AC 15, 20 hit points, and deals 2d6 lightning damage to creatures that pass through. The wall lasts for 1 minute or until destroyed. Additionally, the barrier crackles with energy, illuminating the area. You create electrified defenses.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Stormgate';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Energy Field', 6,
'At 6th level, you can create fields of electrical energy. As an action, you can designate a 20-foot-radius sphere centered on a point within 60 feet. The area crackles with lightning, and creatures that enter or start their turn there take 2d6 lightning damage. Additionally, the field disrupts magic, causing spellcasters to make a Constitution saving throw or lose their action. The field lasts for 10 minutes or until dismissed. You control electrical energy.',
'action', NULL, NULL, 'Lightning Barrier', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Stormgate';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Chain Lightning', 10,
'Starting at 10th level, your lightning can chain between barriers. When a creature takes damage from your Lightning Barrier, lightning arcs to another barrier within 30 feet, dealing 2d6 lightning damage to all creatures between them. Additionally, once per short rest, you can use your action to have all your barriers release a chain lightning attack, dealing 4d6 lightning damage to all enemies within 60 feet. Your lightning chains everywhere.',
'action', '1 per short rest', 'short-rest', 'Energy Field', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Stormgate';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Stormgate', 14,
'At 14th level, you create the perfect stormgate. Once per long rest, you can use your action to create a massive electrical storm in a 100-foot-radius sphere. The area is filled with lightning barriers that move and attack enemies automatically. All enemies in the area take 6d6 lightning damage at the start of each of their turns, and the storm disrupts all magic. The storm lasts for 1 minute. Your stormgate is a tempest of destruction.',
'action', '1 per long rest', 'long-rest', 'Chain Lightning', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Stormgate';
-- Path of the Verdant Lock (Plant Barriers)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Plant Barrier', 3,
'When you choose this path at 3rd level, you can create barriers of living plants. As an action, you can cause plants to grow into a barrier up to 30 feet long, 10 feet high, and 1 foot thick. The barrier appears on a surface with earth or plant life within 60 feet. Each 10-foot section has AC 12, 25 hit points, and regenerates 5 hit points at the start of each of your turns. The barrier lasts for 1 hour or until destroyed. Additionally, creatures that touch the barrier must make a Strength saving throw or be grappled. You create living plant defenses.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Verdant Lock';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Entangling Growth', 6,
'At 6th level, your plant barriers entangle enemies. When a creature enters or starts its turn within 10 feet of your Plant Barrier, the plants can grapple it. The creature must make a Strength or Dexterity saving throw (DC = your Warden power save DC) or be restrained. Additionally, restrained creatures take 1d6 piercing damage at the start of each of their turns from thorns. Your plants never let go.',
'passive', NULL, NULL, 'Plant Barrier', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Verdant Lock';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Living Forest', 10,
'Starting at 10th level, your plant barriers become a living forest. Your Plant Barriers can move and reshape themselves as a bonus action, and they can attack nearby enemies with vines, dealing 2d6 piercing damage. Additionally, once per short rest, you can use your action to create a 60-foot-radius area of difficult terrain filled with grasping plants. Your barriers are alive and dangerous.',
'bonus-action', NULL, NULL, 'Entangling Growth', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Verdant Lock';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Verdant Lock', 14,
'At 14th level, you create the perfect verdant lock. Once per long rest, you can use your action to create a 100-foot-radius forest of grasping plants and thorns. All enemies inside are restrained and take 4d6 piercing damage at the start of each of their turns. Allies can move through the forest freely, and the forest regenerates if damaged. Your verdant lock is impenetrable.',
'action', '1 per long rest', 'long-rest', 'Living Forest', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Verdant Lock';
-- Path of the Void Fence (Void Barriers)
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Void Barrier', 3,
'When you choose this path at 3rd level, you can create barriers of pure void energy. As an action, you can create a wall of darkness up to 30 feet long, 10 feet high, and 1 foot thick. The wall appears on a surface you can see within 60 feet. The wall is heavily obscured, blocks all light, and creatures that pass through take 2d6 necrotic damage and must make a Constitution saving throw (DC = your Warden power save DC) or have their maximum hit points reduced by the damage dealt. The wall lasts for 1 minute or until destroyed. You create barriers of nothingness.',
'action', 'proficiency bonus', 'long-rest', NULL, true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Void Fence';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Nullification Zone', 6,
'At 6th level, you can create zones that nullify magic. As an action, you can designate a 20-foot-radius sphere centered on a point within 60 feet. The area becomes an antimagic zone, and all magical effects within are suppressed. Additionally, spellcasters within the zone must make a Constitution saving throw or be unable to cast spells while inside. The zone lasts for 10 minutes or until dismissed. You nullify all magic.',
'action', NULL, NULL, 'Void Barrier', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Void Fence';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Void Drain', 10,
'Starting at 10th level, your void barriers drain life. Creatures that take damage from your Void Barrier have their maximum hit points reduced permanently until they finish a long rest. Additionally, once per short rest, you can use your action to have all your void barriers drain life force from nearby enemies, healing you for half the damage dealt. Your void consumes everything.',
'action', '1 per short rest', 'short-rest', 'Nullification Zone', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Void Fence';
INSERT INTO compendium_job_features (job_id, path_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT j.id, p.id, 'Perfect Void Fence', 14,
'At 14th level, you create the perfect void fence. Once per long rest, you can use your action to create a 100-foot-radius sphere of absolute void. All magical effects within are permanently dispelled, all light is extinguished, and creatures inside take 6d6 necrotic damage at the start of each of their turns. Additionally, creatures that die within the void are erased from existence. Your void fence is absolute nothingness.',
'action', '1 per long rest', 'long-rest', 'Void Drain', true
FROM compendium_jobs j JOIN compendium_job_paths p ON p.job_id = j.id
WHERE j.name = 'Warden' AND p.name = 'Path of the Void Fence';
-- =============================================
-- ALL PATHS COMPLETE!
-- =============================================
-- ✅ Striker: 6/6 paths complete
-- ✅ Techsmith: 6/6 paths complete
-- ✅ Vanguard: 6/6 paths complete
-- ✅ Warden: 6/6 paths complete
-- All paths have 4 features (levels 3, 6, 10, 14) with Solo Leveling alignment
-- =============================================;

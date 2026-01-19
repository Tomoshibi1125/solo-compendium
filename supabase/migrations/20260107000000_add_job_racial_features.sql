-- =============================================
-- ADD RACIAL FEATURES TO JOBS (Level 1)
-- =============================================
-- Jobs function as both race and class in Solo Leveling 5e
-- This migration adds racial features (ability score increases) to all jobs at level 1
-- All aligned with Solo Leveling manhwa post-reset timeline with Supreme Deity

-- =============================================
-- ABILITY SCORE INCREASES (Racial Feature)
-- =============================================
-- Each job grants ability score increases at level 1 based on primary and secondary abilities
-- Primary abilities get +2, secondary abilities get +1
-- If a job has multiple primary/secondary abilities, distribute the increases appropriately

-- Helper function to create ability score increase descriptions
-- For jobs with 1 primary and 1 secondary: +2 primary, +1 secondary
-- For jobs with 2 primary: +2 to one, +1 to the other
-- For jobs with 1 primary and 2 secondary: +2 primary, +1 to each secondary
-- For jobs with 2 primary and 1 secondary: +2 to each primary, +1 secondary

-- Vanguard: STR primary, AGI secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your training as a Vanguard has honed your physical prowess. You increase your Strength score by 2, and your Agility score by 1. In the post-reset world, the System recognizes your natural aptitude for frontline combat, blessed by the Shadow Monarch''s domain.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Vanguard'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Assassin: AGI primary, INT secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your path as an Assassin has sharpened your reflexes and cunning. You increase your Agility score by 2, and your Intelligence score by 1. The System acknowledges your natural talent for precision and stealth, a gift from the Shadow Monarch''s realm.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Assassin'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Mage: INT primary, SENSE secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your awakening as a Mage has expanded your mind and awareness. You increase your Intelligence score by 2, and your Sense score by 1. The System recognizes your natural affinity for powercasting, blessed by the Shadow Monarch''s domain in this new world.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Mage'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Healer: PRE primary, INT secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your calling as a Healer has enhanced your presence and understanding. You increase your Presence score by 2, and your Intelligence score by 1. The System acknowledges your natural gift for channeling healing energy, a blessing from the Shadow Monarch''s realm.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Healer'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Striker: STR primary, AGI secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your training as a Striker has developed your power and speed. You increase your Strength score by 2, and your Agility score by 1. The System recognizes your natural aptitude for devastating attacks, blessed by the Shadow Monarch''s domain.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Striker'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Ranger: AGI primary, SENSE secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your path as a Ranger has honed your reflexes and awareness. You increase your Agility score by 2, and your Sense score by 1. The System acknowledges your natural talent for tracking and survival, a gift from the Shadow Monarch''s realm.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Ranger'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Destroyer: STR primary, VIT secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your awakening as a Destroyer has amplified your strength and endurance. You increase your Strength score by 2, and your Vitality score by 1. The System recognizes your natural capacity for destruction, blessed by the Shadow Monarch''s domain.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Destroyer'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Esper: INT primary, SENSE secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your calling as an Esper has expanded your mind and perception. You increase your Intelligence score by 2, and your Sense score by 1. The System acknowledges your natural gift for psychic abilities, a blessing from the Shadow Monarch''s realm.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Esper'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Contractor: PRE primary, INT secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your path as a Contractor has enhanced your presence and intellect. You increase your Presence score by 2, and your Intelligence score by 1. The System recognizes your natural aptitude for summoning and binding, blessed by the Shadow Monarch''s domain.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Contractor'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Herald: PRE primary, INT secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your awakening as a Herald has amplified your presence and understanding. You increase your Presence score by 2, and your Intelligence score by 1. The System acknowledges your natural gift for inspiring others, a blessing from the Shadow Monarch''s realm.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Herald'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Holy Knight: STR primary, PRE secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your training as a Holy Knight has developed your strength and presence. You increase your Strength score by 2, and your Presence score by 1. The System recognizes your natural aptitude for divine combat, blessed by the Shadow Monarch''s domain in this post-reset world.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Holy Knight'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Techsmith: INT primary, AGI secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your calling as a Techsmith has enhanced your intellect and dexterity. You increase your Intelligence score by 2, and your Agility score by 1. The System acknowledges your natural gift for crafting and technology, a blessing from the Shadow Monarch''s realm.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Techsmith'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- Warden: VIT primary, STR secondary
INSERT INTO compendium_job_features (job_id, name, level, description, action_type, uses_formula, recharge, prerequisites, is_path_feature)
SELECT 
  j.id,
  'Ability Score Increase',
  1,
  'Your path as a Warden has fortified your endurance and strength. You increase your Vitality score by 2, and your Strength score by 1. The System recognizes your natural capacity for protection and defense, blessed by the Shadow Monarch''s domain.',
  'passive',
  NULL,
  NULL,
  NULL,
  false
FROM compendium_jobs j WHERE j.name = 'Warden'
AND NOT EXISTS (
  SELECT 1 FROM compendium_job_features jf 
  WHERE jf.job_id = j.id AND jf.level = 1 AND jf.name = 'Ability Score Increase'
);
-- =============================================
-- ADDITIONAL RACIAL TRAITS (Speed, Languages, etc.)
-- =============================================
-- All Hunters in the post-reset world have base speed of 30 feet (handled in character creation)
-- All Hunters speak Common (handled in character creation)
-- Additional languages come from backgrounds

-- Note: Speed and languages are handled at character creation level, not as job features
-- This migration focuses on ability score increases as the primary racial feature;

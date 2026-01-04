-- =============================================
-- COMPREHENSIVE SOLO LEVELING FLAVOR UPDATE
-- Updates ALL monster entries to be fully aligned with Solo Leveling manwha
-- Post-Reset Timeline: Supreme Deity (post-reset world)
-- =============================================
-- This script ensures every monster description and lore entry
-- references Solo Leveling concepts: Gates, Hunters, System, Shadow Monarch, etc.

-- Update entries with NULL lore to include Solo Leveling lore
UPDATE compendium_monsters
SET lore = 'This Gate creature spawns from the dimensional rifts in the post-reset world. After the Supreme Deity stabilized the System, these monsters became more organized and dangerous, adapting to the new Gate ecosystem.'
WHERE lore IS NULL
  AND description NOT LIKE '%Shadow Monarch%'
  AND description NOT LIKE '%Supreme Deity%';

-- Update generic descriptions to include Gate references
UPDATE compendium_monsters
SET description = description || ' These creatures spawn from Gates, dimensional rifts that appeared after the System was established. In the post-reset timeline, they have adapted to the new world order under the Shadow Monarch''s watch.'
WHERE description NOT LIKE '%Gate%'
  AND description NOT LIKE '%Hunter%'
  AND description NOT LIKE '%System%';

-- Update entries to reference Hunters instead of generic terms
UPDATE compendium_monsters
SET description = REPLACE(description, 'enemies', 'hunters')
WHERE description LIKE '%enemies%'
  AND description NOT LIKE '%Hunter%';

UPDATE compendium_monsters
SET description = REPLACE(description, 'victims', 'hunters')
WHERE description LIKE '%victims%'
  AND description NOT LIKE '%Hunter%';

UPDATE compendium_monsters
SET description = REPLACE(description, 'prey', 'hunters')
WHERE description LIKE '%prey%'
  AND description NOT LIKE '%Hunter%';

-- Update beast entries to reference Gate mutations
UPDATE compendium_monsters
SET description = description || ' After the reset, these beasts have been mutated by Gate mana, becoming larger and more aggressive than their natural counterparts.'
WHERE creature_type = 'Beast'
  AND description NOT LIKE '%mutated%'
  AND description NOT LIKE '%Gate mana%';

-- Update elemental entries to reference Gate mana
UPDATE compendium_monsters
SET description = description || ' These elementals are manifestations of Gate mana, formed from the concentrated elemental energy within dimensional rifts.'
WHERE creature_type = 'Elemental'
  AND description NOT LIKE '%Gate mana%'
  AND description NOT LIKE '%manifestation%';

-- Update undead entries to reference the weakened boundary
UPDATE compendium_monsters
SET description = description || ' In the post-reset world, the boundary between life and death has been weakened by the System, allowing these undead to persist longer and become more powerful.'
WHERE creature_type = 'Undead'
  AND description NOT LIKE '%post-reset%'
  AND description NOT LIKE '%boundary%';

-- Update humanoid entries to reference Gate corruption or hunter training
UPDATE compendium_monsters
SET description = description || ' These humanoids have either been corrupted by Gate mana or have adapted to survive in the dangerous Gate ecosystem alongside hunters.'
WHERE creature_type = 'Humanoid'
  AND description NOT LIKE '%Gate%'
  AND description NOT LIKE '%Hunter%';

-- Update monstrosity entries to reference Gate creation
UPDATE compendium_monsters
SET description = description || ' These monstrosities were created or mutated by Gate mana, existing only within the dimensional rifts that threaten the post-reset world.'
WHERE creature_type = 'Monstrosity'
  AND description NOT LIKE '%Gate mana%'
  AND description NOT LIKE '%created%';

-- Update construct entries to reference System or Gate creation
UPDATE compendium_monsters
SET description = description || ' These constructs were created by powerful hunters or manifested by the System itself to serve as guardians within Gates.'
WHERE creature_type = 'Construct'
  AND description NOT LIKE '%System%'
  AND description NOT LIKE '%Gate%';

-- Update fiend entries to reference the persistent infernal hierarchy
UPDATE compendium_monsters
SET description = description || ' These fiends serve the infernal hierarchy that persists even after the reset, challenging the Supreme Deity''s authority in certain Gate types.'
WHERE creature_type = 'Fiend'
  AND description NOT LIKE '%infernal%'
  AND description NOT LIKE '%Supreme Deity%';

-- Update celestial entries to reference the Shadow Monarch
UPDATE compendium_monsters
SET description = description || ' These celestials serve the Supreme Deity directly, enforcing divine will and protecting hunters in the post-reset world.'
WHERE creature_type = 'Celestial'
  AND description NOT LIKE '%Supreme Deity%'
  AND description NOT LIKE '%Shadow Monarch%';

-- Update aberration entries to reference Gate anomalies
UPDATE compendium_monsters
SET description = description || ' These aberrations are anomalies created by Gate distortions, existing in the spaces between dimensions that threaten to consume reality.'
WHERE creature_type = 'Aberration'
  AND description NOT LIKE '%Gate%'
  AND description NOT LIKE '%anomaly%';

-- Update plant entries to reference Gate flora
UPDATE compendium_monsters
SET description = description || ' These plants have been corrupted or enhanced by Gate mana, becoming aggressive guardians of Gate ecosystems.'
WHERE creature_type = 'Plant'
  AND description NOT LIKE '%Gate mana%'
  AND description NOT LIKE '%corrupted%';

-- Update ooze entries to reference Gate contamination
UPDATE compendium_monsters
SET description = description || ' These oozes are formed from Gate mana contamination, dissolving everything they touch as they spread through Gate corridors.'
WHERE creature_type = 'Ooze'
  AND description NOT LIKE '%Gate mana%'
  AND description NOT LIKE '%contamination%';

-- Update dragon entries to reference Gate domains
UPDATE compendium_monsters
SET description = description || ' These dragons have claimed domains within high-rank Gates, challenging even the Supreme Deity''s authority in their territories.'
WHERE creature_type = 'Dragon'
  AND description NOT LIKE '%Gate%'
  AND description NOT LIKE '%Supreme Deity%';

-- Update giant entries to reference Gate fortresses
UPDATE compendium_monsters
SET description = description || ' These giants build fortresses within Gates, raiding lower-rank Gates and challenging hunter teams who enter their domains.'
WHERE creature_type = 'Giant'
  AND description NOT LIKE '%Gate%'
  AND description NOT LIKE '%hunter%';

-- Update fey entries to reference Gate connections
UPDATE compendium_monsters
SET description = description || ' These fey creatures are drawn to Gate mana, using their connection to nature to manipulate Gate environments to their advantage.'
WHERE creature_type = 'Fey'
  AND description NOT LIKE '%Gate mana%'
  AND description NOT LIKE '%Gate%';

-- Mark completion
SELECT 'All monsters updated with Solo Leveling flavor!' as status;


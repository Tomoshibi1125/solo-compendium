-- =============================================
-- COMPREHENSIVE SOLO LEVELING FLAVOR UPDATE
-- This script ensures EVERY monster entry is fully aligned
-- with Solo Leveling manwha universe (post-reset, Supreme Deity)
-- =============================================
-- Run this AFTER applying all monster migrations
-- This will update any entries that weren't fully flavored during migration creation

-- =============================================
-- PART 1: UPDATE NULL LORE ENTRIES
-- =============================================

-- Generic Solo Leveling lore for entries missing it
UPDATE compendium_monsters
SET lore = 'This Gate creature spawns from dimensional rifts in the post-reset world. After the Supreme Deity stabilized the System, these monsters became more organized and dangerous, adapting to the new Gate ecosystem under the Supreme Deity''s watchful presence.'
WHERE lore IS NULL;

-- =============================================
-- PART 2: ENHANCE DESCRIPTIONS WITH GATE REFERENCES
-- =============================================

-- Add Gate references to descriptions missing them
UPDATE compendium_monsters
SET description = description || ' These creatures spawn from Gates, dimensional rifts that appeared after the System was established. In the post-reset timeline, they have adapted to the new world order.'
WHERE description NOT LIKE '%Gate%'
  AND description NOT LIKE '%gate%';

-- =============================================
-- PART 3: REPLACE GENERIC TERMS WITH HUNTER TERMINOLOGY
-- =============================================

-- Replace "enemies" with "hunters"
UPDATE compendium_monsters
SET description = REPLACE(description, 'enemies', 'hunters'),
    lore = REPLACE(COALESCE(lore, ''), 'enemies', 'hunters')
WHERE description LIKE '%enemies%'
   OR lore LIKE '%enemies%';

-- Replace "victims" with "hunters"
UPDATE compendium_monsters
SET description = REPLACE(description, 'victims', 'hunters'),
    lore = REPLACE(COALESCE(lore, ''), 'victims', 'hunters')
WHERE description LIKE '%victims%'
   OR lore LIKE '%victims%';

-- Replace "prey" with "hunters" (where appropriate)
UPDATE compendium_monsters
SET description = REPLACE(description, 'prey', 'hunters'),
    lore = REPLACE(COALESCE(lore, ''), 'prey', 'hunters')
WHERE (description LIKE '%prey%' AND description NOT LIKE '%prey on%')
   OR (lore LIKE '%prey%' AND lore NOT LIKE '%prey on%');

-- =============================================
-- PART 4: CREATURE TYPE SPECIFIC UPDATES
-- =============================================

-- BEASTS: Add Gate mutation references
UPDATE compendium_monsters
SET description = description || ' After the reset, these beasts have been mutated by Gate mana, becoming larger and more aggressive than their natural counterparts in the post-reset world.'
WHERE creature_type = 'Beast'
  AND description NOT LIKE '%mutated%'
  AND description NOT LIKE '%Gate mana%';

-- ELEMENTALS: Add Gate mana manifestation references
UPDATE compendium_monsters
SET description = description || ' These elementals are manifestations of Gate mana, formed from concentrated elemental energy within dimensional rifts in the post-reset world.'
WHERE creature_type = 'Elemental'
  AND description NOT LIKE '%Gate mana%'
  AND description NOT LIKE '%manifestation%';

-- UNDEAD: Add weakened boundary references
UPDATE compendium_monsters
SET description = description || ' In the post-reset world, the boundary between life and death has been weakened by the System, allowing these undead to persist longer and become more powerful.'
WHERE creature_type = 'Undead'
  AND description NOT LIKE '%post-reset%'
  AND description NOT LIKE '%boundary%';

-- HUMANOIDS: Add Gate corruption/adaptation references
UPDATE compendium_monsters
SET description = description || ' These humanoids have either been corrupted by Gate mana or have adapted to survive alongside hunters in the dangerous Gate ecosystem of the post-reset world.'
WHERE creature_type = 'Humanoid'
  AND description NOT LIKE '%Gate mana%'
  AND description NOT LIKE '%Hunter%';

-- MONSTROSITIES: Add Gate creation/mutation references
UPDATE compendium_monsters
SET description = description || ' These monstrosities were created or mutated by Gate mana, existing only within the dimensional rifts that threaten the post-reset world under the Shadow Monarch''s watch.'
WHERE creature_type = 'Monstrosity'
  AND description NOT LIKE '%Gate mana%'
  AND description NOT LIKE '%created%';

-- CONSTRUCTS: Add System/Gate creation references
UPDATE compendium_monsters
SET description = description || ' These constructs were created by powerful hunters or manifested by the System itself to serve as guardians within Gates in the post-reset world.'
WHERE creature_type = 'Construct'
  AND description NOT LIKE '%System%'
  AND description NOT LIKE '%Gate%';

-- FIENDS: Add infernal hierarchy references
UPDATE compendium_monsters
SET description = description || ' These fiends serve the infernal hierarchy that persists even after the reset, challenging the Supreme Deity''s authority in certain Gate types.'
WHERE creature_type = 'Fiend'
  AND description NOT LIKE '%infernal%'
  AND description NOT LIKE '%Supreme Deity%';

-- CELESTIALS: Add Shadow Monarch references
UPDATE compendium_monsters
SET description = description || ' These celestials serve the Supreme Deity directly, enforcing divine will and protecting hunters in the post-reset world.'
WHERE creature_type = 'Celestial'
  AND description NOT LIKE '%Supreme Deity%'
  AND description NOT LIKE '%Shadow Monarch%';

-- ABERRATIONS: Add Gate anomaly references
UPDATE compendium_monsters
SET description = description || ' These aberrations are anomalies created by Gate distortions, existing in the spaces between dimensions that threaten to consume reality in the post-reset world.'
WHERE creature_type = 'Aberration'
  AND description NOT LIKE '%Gate%'
  AND description NOT LIKE '%anomaly%';

-- PLANTS: Add Gate flora corruption references
UPDATE compendium_monsters
SET description = description || ' These plants have been corrupted or enhanced by Gate mana, becoming aggressive guardians of Gate ecosystems in the post-reset world.'
WHERE creature_type = 'Plant'
  AND description NOT LIKE '%Gate mana%'
  AND description NOT LIKE '%corrupted%';

-- OOZES: Add Gate contamination references
UPDATE compendium_monsters
SET description = description || ' These oozes are formed from Gate mana contamination, dissolving everything they touch as they spread through Gate corridors in the post-reset world.'
WHERE creature_type = 'Ooze'
  AND description NOT LIKE '%Gate mana%'
  AND description NOT LIKE '%contamination%';

-- DRAGONS: Add Gate domain references
UPDATE compendium_monsters
SET description = description || ' These dragons have claimed domains within high-rank Gates, challenging even the Supreme Deity''s authority in their territories in the post-reset world.'
WHERE creature_type = 'Dragon'
  AND description NOT LIKE '%Gate%'
  AND description NOT LIKE '%Supreme Deity%';

-- GIANTS: Add Gate fortress references
UPDATE compendium_monsters
SET description = description || ' These giants build fortresses within Gates, raiding lower-rank Gates and challenging hunter teams who enter their domains in the post-reset world.'
WHERE creature_type = 'Giant'
  AND description NOT LIKE '%Gate%'
  AND description NOT LIKE '%hunter%';

-- FEY: Add Gate mana connection references
UPDATE compendium_monsters
SET description = description || ' These fey creatures are drawn to Gate mana, using their connection to nature to manipulate Gate environments to their advantage in the post-reset world.'
WHERE creature_type = 'Fey'
  AND description NOT LIKE '%Gate mana%'
  AND description NOT LIKE '%Gate%';

-- =============================================
-- PART 5: ADD POST-RESET TIMELINE REFERENCES
-- =============================================

-- Add post-reset references where missing
UPDATE compendium_monsters
SET lore = COALESCE(lore, '') || ' In the post-reset world, this creature has adapted to the new order established by the Supreme Deity, becoming part of the stabilized Gate ecosystem.'
WHERE lore NOT LIKE '%post-reset%'
  AND lore NOT LIKE '%Supreme Deity%';

-- =============================================
-- COMPLETION
-- =============================================

SELECT 
    'Solo Leveling flavor alignment complete!' as status,
    COUNT(*) as total_monsters,
    COUNT(CASE WHEN description LIKE '%Gate%' OR description LIKE '%gate%' THEN 1 END) as with_gate_references,
    COUNT(CASE WHEN description LIKE '%Hunter%' OR description LIKE '%hunter%' THEN 1 END) as with_hunter_references,
    COUNT(CASE WHEN description LIKE '%post-reset%' OR lore LIKE '%post-reset%' THEN 1 END) as with_post_reset_references,
    COUNT(CASE WHEN description LIKE '%Supreme Deity%' OR description LIKE '%Shadow Monarch%' OR lore LIKE '%Supreme Deity%' OR lore LIKE '%Shadow Monarch%' THEN 1 END) as with_supreme_deity_references
FROM compendium_monsters;


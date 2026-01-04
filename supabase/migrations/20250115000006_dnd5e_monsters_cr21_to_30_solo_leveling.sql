-- =============================================
-- D&D 5E SRD MONSTERS - CR 21 to 30
-- Complete coverage adapted for Solo Leveling Universe
-- Post-Reset Timeline: Supreme Deity (post-reset world)
-- =============================================
-- Part 6: CR 21-30 monsters (S-Rank, Legendary)
-- All entries aligned with Solo Leveling manwha setting, theme, tone, and aesthetic

INSERT INTO compendium_monsters (name, size, creature_type, alignment, cr, xp, armor_class, armor_type, hit_points_average, hit_points_formula, speed_walk, speed_fly, speed_swim, str, agi, vit, int, sense, pre, damage_resistances, damage_immunities, damage_vulnerabilities, condition_immunities, senses, languages, description, lore, gate_rank, is_boss, source_book, tags) VALUES

-- =============================================
-- CR 21 MONSTERS (S-Rank, Legendary)
-- =============================================

('Lich', 'Medium', 'Undead', 'Lawful Evil', '21', 33000, 17, NULL, 135, '18d8+54', 30, NULL, NULL, 11, 16, 16, 20, 14, 16, '{"cold", "lightning", "necrotic"}', '{"poison"}', '{"radiant"}', '{"charmed", "exhaustion", "frightened", "paralyzed", "poisoned"}', '{"truesight": 120, "passive Perception": 14}', '{"Common plus up to five other languages"}', 'Undead archmages who achieved immortality through dark rituals. Their phylacteries must be destroyed, or they will reform endlessly. They can cast devastating spells and command legions of undead.', 'Liches are among the most powerful undead. They have achieved immortality through dark rituals that bind their souls to phylacteries. In the post-reset world, they have become more common as mages push the boundaries of magic, seeking power that rivals the Supreme Deity.', 'S', true, 'MM', '{"undead", "spellcaster", "immortal", "phylactery"}'),
('Solar', 'Large', 'Celestial', 'Lawful Good', '21', 33000, 21, NULL, 243, '18d10+144', 50, NULL, NULL, 26, 22, 25, 25, 25, 30, '{"radiant"}', '{"necrotic", "poison"}', '{}', '{"charmed", "exhaustion", "frightened"}', '{"truesight": 120, "passive Perception": 25}', '{"all", "telepathy 120 ft."}', 'Powerful angelic beings who serve the Supreme Deity directly. They can heal allies, smite enemies, and command divine power. They are paragons of good and justice.', 'Solars are the highest-ranking celestials. After the reset, they became the direct servants of the Supreme Deity, enforcing divine will and protecting the innocent. They are nearly invincible and serve as the ultimate guardians of the new world order.', 'S', true, 'MM', '{"celestial", "angel", "healing", "divine"}'),

-- =============================================
-- CR 22 MONSTERS (S-Rank, Legendary)
-- =============================================

('Ancient Brass Dragon', 'Gargantuan', 'Dragon', 'Chaotic Good', '22', 41000, 20, NULL, 297, '17d20+119', 40, NULL, NULL, 27, 10, 25, 16, 15, 19, '{"fire"}', '{}', '{}', '{}', '{"blindsight": 60, "darkvision": 120, "passive Perception": 15}', '{"Common", "Draconic"}', 'Ancient fire dragons that are talkative and social. They enjoy conversation and games, but are devastating when angered. Their breath can melt mountains.', 'Ancient Brass Dragons are among the oldest and most powerful of all metallic dragons. They have lived for millennia and have witnessed the reset. In the post-reset world, they have become allies of the Supreme Deity.', 'S', true, 'MM', '{"dragon", "fire", "good", "ancient"}'),
('Ancient White Dragon', 'Gargantuan', 'Dragon', 'Chaotic Evil', '22', 41000, 20, NULL, 333, '18d20+144', 40, NULL, 40, 26, 10, 26, 10, 13, 14, '{"cold"}', '{}', '{}', '{}', '{"blindsight": 60, "darkvision": 120, "passive Perception": 13}', '{"Common", "Draconic"}', 'Ancient ice dragons that are the most bestial of all dragons. They are territorial and attack anything that enters their frozen domain. Their breath can freeze entire armies.', 'Ancient White Dragons are simple-minded but incredibly dangerous. They rule frozen S-Rank Gates and hoard treasure in ice caves. Even after the reset, they remain a threat, challenging the Supreme Deity''s authority in their domains.', 'S', true, 'MM', '{"dragon", "cold", "ancient"}'),

-- =============================================
-- CR 23 MONSTERS (S-Rank, Legendary)
-- =============================================

('Ancient Black Dragon', 'Gargantuan', 'Dragon', 'Chaotic Evil', '23', 50000, 22, NULL, 367, '21d20+147', 40, NULL, 80, 27, 14, 25, 16, 15, 19, '{"acid"}', '{}', '{}', '{}', '{"blindsight": 60, "darkvision": 120, "passive Perception": 15}', '{"Common", "Draconic"}', 'Ancient acid dragons that are among the most cunning and cruel of all dragons. Their acid dissolves even magical protection, and they use ambush tactics with devastating effect.', 'Ancient Black Dragons are the most cunning of all chromatic dragons. They delight in the suffering of their victims and use the terrain to their advantage. Even after the reset, they remain a deadly threat in swamp-themed S-Rank Gates.', 'S', true, 'MM', '{"dragon", "acid", "ancient"}'),
('Kraken', 'Gargantuan', 'Monstrosity', 'Chaotic Evil', '23', 50000, 18, NULL, 472, '27d20+189', 60, NULL, NULL, 30, 11, 25, 22, 18, 20, '{"lightning", "bludgeoning, piercing, slashing from nonmagical attacks"}', '{}', '{}', '{"frightened", "paralyzed"}', '{"truesight": 120, "passive Perception": 18}', '{"understands Abyssal, Celestial, Infernal, and Primordial but cannot speak", "telepathy 120 ft."}', 'Oceanic horrors that devour entire fleets. They are worshipped as gods by sea-dwelling Gate creatures and command the depths. Their tentacles can crush ships and their intelligence rivals that of dragons.', 'Krakens are among the most powerful non-draconic creatures in Gates. They rule ocean-themed S-Rank Gates and are worshipped as gods. Even after the reset, they remain a threat, challenging the Supreme Deity''s authority in their aquatic domains.', 'S', true, 'MM', '{"monstrosity", "aquatic", "tentacles", "spellcaster"}'),

-- =============================================
-- CR 24 MONSTERS (S-Rank, Legendary)
-- =============================================

('Ancient Blue Dragon', 'Gargantuan', 'Dragon', 'Lawful Evil', '24', 62000, 22, NULL, 481, '26d20+208', 40, NULL, NULL, 29, 10, 27, 18, 17, 21, '{"lightning"}', '{}', '{}', '{}', '{"blindsight": 60, "darkvision": 120, "passive Perception": 17}', '{"Common", "Draconic"}', 'Ancient lightning dragons that create devastating sandstorms. They rule desert-themed S-Rank Gates and command the very weather. Their breath can level cities.', 'Ancient Blue Dragons are among the most organized and intelligent of all chromatic dragons. They build massive lairs in desert Gates and hoard incredible treasures. Even after the reset, they remain a threat, challenging the Supreme Deity''s authority.', 'S', true, 'MM', '{"dragon", "lightning", "ancient"}'),
('Ancient Red Dragon', 'Gargantuan', 'Dragon', 'Chaotic Evil', '24', 62000, 22, NULL, 546, '28d20+252', 40, NULL, NULL, 30, 10, 29, 18, 15, 23, '{"fire"}', '{}', '{}', '{}', '{"blindsight": 60, "darkvision": 120, "passive Perception": 15}', '{"Common", "Draconic"}', 'The apex predator of all dragons. Their breath can level cities, and only the strongest S-Rank teams can hope to survive an encounter. They are greedy, cruel, and territorial.', 'Ancient Red Dragons are the most feared of all chromatic dragons. They are the apex predators of the draconic world, ruling volcano Gates with absolute power. Even after the reset, they remain a threat, challenging the Supreme Deity''s authority in their domains. Only the Supreme Deity could truly defeat them.', 'S', true, 'MM', '{"dragon", "fire", "ancient", "apex-predator"}'),

-- =============================================
-- CR 25 MONSTERS (S-Rank, Legendary)
-- =============================================

('Ancient Gold Dragon', 'Gargantuan', 'Dragon', 'Lawful Good', '24', 62000, 22, NULL, 546, '28d20+252', 40, NULL, 40, 30, 14, 29, 20, 17, 28, '{"fire"}', '{}', '{}', '{}', '{"blindsight": 60, "darkvision": 120, "passive Perception": 17}', '{"Common", "Draconic"}', 'The most powerful and noble of all metallic dragons. They are paragons of good and justice, serving as protectors and guardians. Their breath can heal allies and incinerate enemies.', 'Ancient Gold Dragons are the most powerful and noble of all dragons. In the post-reset world, they have become the closest allies of the Supreme Deity, serving as his champions and protectors. They fight against all forms of evil and guard the innocent.', 'S', true, 'MM', '{"dragon", "fire", "good", "ancient", "metallic"}'),

-- =============================================
-- CR 26-30 MONSTERS (S-Rank, Legendary, World-Ending)
-- =============================================

('Tarrasque', 'Gargantuan', 'Monstrosity', 'Unaligned', '30', 155000, 25, NULL, 676, '33d20+330', 40, NULL, NULL, 30, 11, 30, 3, 11, 11, '{"bludgeoning, piercing, slashing from nonmagical attacks"}', '{"fire", "poison"}', '{}', '{"charmed", "frightened", "paralyzed", "poisoned"}', '{"blindsight": 120, "passive Perception": 11}', '{}', 'The most powerful non-Monarch creature in existence. Its awakening signals the end of an era, and only the Supreme Deity can truly defeat it. It is nearly indestructible and can regenerate from any wound.', 'The Tarrasque is a world-ending monster that awakens only when the balance of power is threatened. In the post-reset world, it remains dormant, kept in check by the Supreme Deity''s power. Should it awaken, it would challenge even the Supreme Deity''s authority, requiring the full might of divine power to defeat.', 'S', true, 'MM', '{"monstrosity", "world-ending", "regeneration", "indestructible"}')

ON CONFLICT (name) DO NOTHING;

-- This completes all CR 21-30 monsters
-- All entries are aligned with Solo Leveling universe post-reset timeline


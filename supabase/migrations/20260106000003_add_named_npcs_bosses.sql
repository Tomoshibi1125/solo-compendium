-- =============================================
-- NAMED NPCS AND BOSSES FROM SOLO LEVELING UNIVERSE
-- =============================================
-- Post-reset timeline with Jinwoo as Supreme Deity
-- Includes major characters, guild masters, and named bosses

-- =============================================
-- NAMED NPCs (STORED AS MONSTERS WITH SPECIAL TAGS)
-- =============================================
-- These are major characters from the Solo Leveling universe
-- Stored as monsters but tagged as 'named-npc' for filtering

INSERT INTO compendium_monsters (name, size, creature_type, cr, armor_class, hit_points_average, hit_points_formula, speed_walk, str, agi, vit, int, sense, pre, gate_rank, is_boss, description, lore, source_book, source_kind, source_name, tags) VALUES

-- =============================================
-- S-RANK HUNTERS (Post-Reset Timeline)
-- =============================================

('Cha Hae-In', 'Medium', 'Humanoid', '18', 20, 195, '17d12+85', 40, 18, 22, 16, 14, 18, 16, 'S', false, 'The wife of the Shadow Monarch and one of the strongest S-Rank Hunters. Her exceptional sense allows her to detect Gate creatures and mana fluctuations with incredible precision. Wields a legendary sword blessed by the System.', 'Once known as the "Hunter with the Best Senses," Cha Hae-In now serves as a guardian of the post-reset world. Her connection to the Shadow Monarch grants her unique abilities, and she leads elite Gate-clearing operations.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['named-npc', 's-rank', 'humanoid', 'hunter', 'legendary']),

('Baek Yoonho', 'Medium', 'Humanoid', '17', 19, 178, '17d10+85', 40, 20, 18, 18, 12, 16, 14, 'S', false, 'The White Tiger Guild Master and one of the original S-Rank Hunters. A shapeshifter who can transform into a massive white tiger. Known for his leadership and tactical brilliance.', 'Baek Yoonho survived the reset and continues to lead the White Tiger Guild. His transformation ability makes him a formidable combatant, and his experience makes him one of the most respected Hunters in the world.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['named-npc', 's-rank', 'humanoid', 'hunter', 'guild-master', 'shapeshifter']),

('Choi Jong-In', 'Medium', 'Humanoid', '17', 18, 178, '17d10+85', 30, 14, 16, 16, 20, 14, 18, 'S', false, 'The Fire Guild Master and master pyromancer. His fire magic can incinerate entire Gate floors. Known for his calm demeanor and devastating offensive power.', 'Choi Jong-In''s mastery over fire mana is legendary. In the post-reset world, he serves as a key advisor to the Shadow Monarch and leads the Fire Guild in clearing high-rank Gates.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['named-npc', 's-rank', 'humanoid', 'hunter', 'guild-master', 'spellcaster']),

('Yoo Jinho', 'Medium', 'Humanoid', '12', 16, 142, '15d8+60', 30, 16, 18, 14, 14, 16, 18, 'A', false, 'Former A-Rank Hunter and close friend of the Shadow Monarch. Now serves as a key administrator in the Hunter Association. His leadership skills and connections make him invaluable.', 'Yoo Jinho was the first to recognize the Shadow Monarch''s true power. In the post-reset timeline, he coordinates Gate-clearing operations and manages relations between Hunters and the System.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['named-npc', 'a-rank', 'humanoid', 'hunter', 'administrator']),

('Sung Jinah', 'Small', 'Humanoid', '8', 14, 95, '11d8+33', 30, 10, 16, 12, 16, 14, 18, 'B', false, 'The younger sister of the Shadow Monarch. A talented B-Rank Hunter with exceptional mana sensitivity. Her connection to the System is unusually strong, allowing her to sense Gate anomalies.', 'Sung Jinah awakened as a Hunter after the reset. Though not as powerful as her brother, her unique System connection and determination make her a rising star in the Hunter community.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['named-npc', 'b-rank', 'humanoid', 'hunter', 'system-touched']),

-- =============================================
-- NAMED BOSSES FROM SOLO LEVELING
-- =============================================

('Kamish', 'Gargantuan', 'Dragon', '28', 24, 630, '28d20+420', 80, 30, 14, 31, 22, 20, 24, 'S', true, 'The legendary dragon that nearly destroyed humanity before the reset. A creature of immense power that required the combined efforts of all S-Rank Hunters to defeat. Its scales are nearly indestructible, and its breath weapon can level cities.', 'Kamish was the greatest threat humanity faced before the Shadow Monarch''s ascension. In the post-reset timeline, its memory serves as a reminder of the power that once threatened the world. Some believe fragments of its power still exist in high-rank Gates.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'dragon', 'gate-creature', 'legendary', 'named-boss', 'kamish']),

('Antares', 'Huge', 'Fiend', '26', 22, 567, '27d12+378', 40, 28, 18, 26, 24, 20, 22, 'S', true, 'The Monarch of Destruction. A being of pure chaos and power who sought to destroy all worlds. His mere presence warps reality, and his attacks can shatter dimensions.', 'Antares was one of the most powerful Monarchs, second only to the Shadow Monarch. Defeated in the final battle before the reset, his essence was absorbed by the Shadow Monarch. In the post-reset timeline, his power lives on through the System.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'fiend', 'gate-creature', 'legendary', 'named-boss', 'monarch', 'antares']),

('Baran', 'Huge', 'Dragon', '24', 21, 525, '25d12+350', 80, 27, 16, 28, 20, 18, 20, 'S', true, 'The Monarch of White Flames. A dragon of pure fire mana who commanded legions of flame creatures. His white flames burn hotter than any natural fire and can incinerate even magical defenses.', 'Baran was a powerful Monarch defeated by the Shadow Monarch. His white flames were legendary, capable of burning through any defense. In the post-reset world, his power has been integrated into the System, and some Gates manifest with his signature white flames.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'dragon', 'gate-creature', 'legendary', 'named-boss', 'monarch', 'baran']),

('Legia', 'Huge', 'Fiend', '23', 21, 504, '24d12+336', 50, 26, 20, 25, 22, 19, 21, 'S', true, 'The Monarch of Frost. A being of absolute cold who could freeze entire dimensions. His ice magic is so powerful that it can stop time itself in localized areas.', 'Legia was the Monarch of Frost, defeated in the great war. His power over ice and cold was absolute. In the post-reset timeline, Gates with frost themes often manifest his power, creating deadly frozen labyrinths.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'fiend', 'gate-creature', 'legendary', 'named-boss', 'monarch', 'legia']),

('Querehsha', 'Huge', 'Fiend', '22', 20, 483, '23d12+322', 40, 25, 18, 24, 21, 18, 20, 'S', true, 'The Monarch of Plagues. A being of disease and corruption who could spread plagues across dimensions. His touch corrupts mana itself, turning it into a deadly poison.', 'Querehsha was a Monarch whose power over disease and corruption made him one of the most feared. Defeated before the reset, his essence now manifests in Gates with poison and disease themes, creating deadly contaminated zones.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'fiend', 'gate-creature', 'legendary', 'named-boss', 'monarch', 'querehsha']),

('Tarmiel', 'Huge', 'Fiend', '21', 20, 462, '22d12+308', 40, 24, 17, 23, 20, 17, 19, 'S', true, 'The Monarch of Beasts. A shapeshifter who could transform into any creature. His power over beasts allowed him to command legions of monsters.', 'Tarmiel was the Monarch of Beasts, able to transform into any creature and command all beasts. His defeat marked a turning point in the war. In the post-reset world, his power manifests in Gates with beast themes.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'fiend', 'gate-creature', 'legendary', 'named-boss', 'monarch', 'tarmiel']),

('Rakan', 'Large', 'Fiend', '20', 19, 420, '21d12+252', 30, 22, 16, 22, 18, 16, 18, 'S', true, 'The Monarch of Iron Body. A being of pure physical power whose body was harder than any metal. His physical attacks could shatter mountains.', 'Rakan was known for his incredible physical strength and durability. His body was said to be harder than any material in existence. Defeated by the Shadow Monarch, his essence now strengthens the System''s physical enhancements.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'fiend', 'gate-creature', 'legendary', 'named-boss', 'monarch', 'rakan']),

-- =============================================
-- NAMED GATE BOSSES (From Major Gates)
-- =============================================

('Cerberus, Gate Guardian', 'Huge', 'Monstrosity', '19', 19, 378, '20d12+240', 50, 26, 18, 24, 12, 18, 14, 'S', true, 'A three-headed hound that guards the deepest levels of high-rank Gates. Each head has different elemental powers: fire, ice, and lightning. Its howl can shatter stone and disorient Hunters.', 'Cerberus is a legendary Gate Guardian that appears in S-Rank Gates. It is said to be a remnant of the old world, a creature that existed before the reset. Only the strongest Hunter teams can hope to defeat it.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'monstrosity', 'gate-creature', 'legendary', 'named-boss', 'gate-guardian', 'cerberus']),

('The Architect', 'Large', 'Construct', '18', 20, 357, '19d12+247', 30, 18, 12, 22, 24, 20, 22, 'S', true, 'An ancient construct that designs and maintains Gate structures. It can reshape Gate layouts at will and create deadly traps. Its knowledge of Gate mechanics is absolute.', 'The Architect is a mysterious entity that appears in the deepest Gates. Some believe it was created by the System itself to maintain Gate structures. It speaks in riddles and tests Hunters with complex puzzles.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'construct', 'gate-creature', 'legendary', 'named-boss', 'gate-guardian', 'architect']),

('Shadow Revenant', 'Large', 'Undead', '17', 19, 315, '18d12+198', 40, 20, 20, 20, 18, 19, 20, 'S', true, 'A powerful undead created from the essence of defeated Monarchs. It wields shadow magic and can phase through reality. Its presence drains life force from all nearby creatures.', 'The Shadow Revenant is a rare boss that appears in Gates with strong shadow mana. It is believed to be a fragment of the Shadow Monarch''s power that gained sentience. Defeating it grants unique shadow-based rewards.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'undead', 'gate-creature', 'legendary', 'named-boss', 'shadow-touched']),

('Mana Tyrant', 'Huge', 'Elemental', '16', 18, 294, '17d12+187', 30, 22, 14, 22, 26, 18, 20, 'A', true, 'A massive elemental being formed from pure Gate mana. It can manipulate all forms of mana and create devastating magical attacks. Its body constantly shifts between different elemental forms.', 'The Mana Tyrant is a unique boss that appears in Gates with unstable mana. It represents the raw, untamed power of Gates. Hunters who defeat it gain exceptional mana control abilities.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'elemental', 'gate-creature', 'legendary', 'named-boss', 'mana-entity']),

('The Collector', 'Medium', 'Humanoid', '15', 17, 270, '16d12+192', 30, 16, 20, 18, 22, 20, 24, 'A', true, 'A mysterious figure that collects powerful artifacts and abilities from defeated Hunters. It appears in Gates to test Hunters and reward the worthy. Its true nature is unknown.', 'The Collector is an enigmatic boss that seems to exist outside normal Gate mechanics. It challenges Hunters with unique trials and rewards those who prove themselves. Some believe it serves the Shadow Monarch directly.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['boss', 'humanoid', 'gate-creature', 'legendary', 'named-boss', 'mysterious']),

-- =============================================
-- NAMED NPCs (Guild Members, Important Characters)
-- =============================================

('Goto Ryuji', 'Medium', 'Humanoid', '16', 18, 256, '19d12+133', 30, 18, 20, 16, 14, 16, 16, 'S', false, 'Former S-Rank Hunter from Japan. A master swordsman known for his incredible speed and precision. His katana techniques are legendary among Hunters.', 'Goto Ryuji was one of the strongest S-Rank Hunters before the reset. In the post-reset timeline, he continues to serve as a key figure in international Gate-clearing operations, coordinating efforts across nations.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['named-npc', 's-rank', 'humanoid', 'hunter', 'swordsman']),

('Thomas Andre', 'Large', 'Humanoid', '17', 19, 262, '21d12+126', 40, 24, 16, 20, 12, 14, 14, 'S', false, 'The Scavenger Guild Master and one of the strongest physical Hunters. His raw strength is unmatched, and he can shatter Gates with his bare hands.', 'Thomas Andre is known for his incredible physical power and aggressive Gate-clearing style. In the post-reset world, he leads the Scavenger Guild in taking on the most dangerous Gates.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['named-npc', 's-rank', 'humanoid', 'hunter', 'guild-master', 'physical']),

('Liu Zhigang', 'Medium', 'Humanoid', '16', 18, 256, '19d12+133', 30, 18, 20, 16, 14, 16, 16, 'S', false, 'The strongest S-Rank Hunter from China. A master of martial arts and internal energy manipulation. His techniques combine physical combat with mana control.', 'Liu Zhigang represents the pinnacle of Chinese Hunter techniques. His mastery of combining physical and magical combat makes him one of the most versatile S-Rank Hunters in the world.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['named-npc', 's-rank', 'humanoid', 'hunter', 'martial-artist']),

('Sidney', 'Medium', 'Humanoid', '15', 17, 225, '18d12+108', 30, 16, 18, 16, 16, 18, 20, 'A', false, 'An A-Rank Hunter with exceptional leadership skills. Known for coordinating large-scale Gate-clearing operations. Her tactical mind makes her invaluable.', 'Sidney is a rising star in the Hunter community. Her ability to coordinate teams and manage complex Gate-clearing operations has made her a key figure in the post-reset Hunter Association.', 'Solo Leveling', 'homebrew', 'Solo Compendium Homebrew', ARRAY['named-npc', 'a-rank', 'humanoid', 'hunter', 'leader', 'tactician'])

ON CONFLICT (name) DO NOTHING;

-- =============================================
-- UPDATE XP VALUES FOR NAMED NPCS AND BOSSES
-- =============================================
UPDATE compendium_monsters SET xp = CASE cr
  WHEN '8' THEN 3900
  WHEN '12' THEN 8400
  WHEN '15' THEN 13000
  WHEN '16' THEN 15000
  WHEN '17' THEN 18000
  WHEN '18' THEN 20000
  WHEN '19' THEN 22000
  WHEN '20' THEN 25000
  WHEN '21' THEN 33000
  WHEN '22' THEN 41000
  WHEN '23' THEN 50000
  WHEN '24' THEN 62000
  WHEN '26' THEN 90000
  WHEN '28' THEN 120000
  ELSE xp
END
WHERE name IN ('Cha Hae-In', 'Baek Yoonho', 'Choi Jong-In', 'Yoo Jinho', 'Sung Jinah', 'Kamish', 'Antares', 'Baran', 'Legia', 'Querehsha', 'Tarmiel', 'Rakan', 'Cerberus, Gate Guardian', 'The Architect', 'Shadow Revenant', 'Mana Tyrant', 'The Collector', 'Goto Ryuji', 'Thomas Andre', 'Liu Zhigang', 'Sidney')
AND xp IS NULL;


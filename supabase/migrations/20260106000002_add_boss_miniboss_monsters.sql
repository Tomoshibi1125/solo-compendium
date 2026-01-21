-- =============================================
-- BOSS AND MINI-BOSS MONSTERS
-- =============================================
-- This migration adds boss and mini-boss variants of existing monsters
-- Mini-Bosses: Enhanced versions (+1-2 CR, better stats)
-- Bosses: Significantly enhanced versions (+3-5 CR, legendary actions)

-- Helper function to calculate enhanced CR
-- Mini-Boss: +1-2 CR
-- Boss: +3-5 CR (capped at CR 30)

-- =============================================
-- E-RANK MINI-BOSSES (CR 1/2 - 1)
-- =============================================
INSERT INTO compendium_monsters (name, size, creature_type, cr, armor_class, hit_points_average, hit_points_formula, speed_walk, str, agi, vit, int, sense, pre, gate_rank, is_boss, description, source_book, source_kind, source_name, tags) VALUES
('Rift Goblin Chieftain', 'Small', 'Humanoid', '1', 15, 18, '4d6+4', 30, 12, 16, 12, 12, 10, 10, 'E', false, 'A larger, more cunning Rift Goblin that leads war parties. Wields a crude but effective weapon and commands lesser goblins with tactical precision.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'humanoid', 'gate-creature']),
('Kobold War Chief', 'Small', 'Humanoid', '1', 14, 16, '3d6+6', 30, 9, 17, 12, 10, 10, 10, 'E', false, 'An elite Kobold that has survived countless Rift raids. Sets deadly traps and coordinates ambushes with military efficiency.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'humanoid', 'gate-creature']),

-- =============================================
-- D-RANK MINI-BOSSES (CR 2-3)
-- =============================================
('Rift Hound Alpha', 'Medium', 'Beast', '2', 15, 32, '5d8+10', 50, 16, 16, 14, 5, 14, 8, 'D', false, 'The pack leader of Rift Hounds. Larger and more ferocious, it coordinates pack tactics and never retreats from a fight.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'beast', 'gate-creature']),
('Stone Sentinel Captain', 'Medium', 'Construct', '3', 16, 45, '6d8+18', 30, 16, 10, 18, 3, 12, 3, 'D', false, 'An elite stone guardian that commands other sentinels. Its strikes crack armor and its presence bolsters nearby constructs.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'construct', 'gate-creature']),
('Venomfang Matriarch', 'Large', 'Beast', '3', 16, 45, '6d10+12', 40, 16, 18, 14, 4, 13, 6, 'D', false, 'A massive spider that has consumed countless ascendants. Its venom can kill in seconds, and it weaves webs that trap entire teams.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'beast', 'gate-creature']),
('Rift Orc Warlord', 'Medium', 'Humanoid', '2', 15, 32, '5d8+10', 30, 18, 14, 16, 9, 13, 12, 'D', false, 'A battle-scarred Orc that has claimed dozens of ascendant lives. Wields a massive greataxe and leads war bands with brutal efficiency.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'humanoid', 'gate-creature']),

-- =============================================
-- C-RANK MINI-BOSSES (CR 5-6)
-- =============================================
('Rift Ogre Chieftain', 'Large', 'Giant', '5', 13, 85, '10d10+30', 40, 21, 10, 18, 7, 9, 9, 'C', false, 'A massive Ogre that has grown fat on ascendant flesh. Its club is carved from the bones of its victims, and it commands lesser ogres.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'giant', 'gate-creature']),
('Wraith Knight Commander', 'Medium', 'Undead', '5', 17, 78, '12d8+24', 30, 16, 18, 16, 14, 14, 10, 'C', false, 'An elite undead warrior that once served a Monarch. Its spectral blade drains life force and it commands legions of undead.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'undead', 'gate-creature']),
('Minotaur Labyrinth Lord', 'Large', 'Monstrosity', '5', 16, 95, '11d10+33', 40, 20, 13, 18, 8, 18, 11, 'C', false, 'The master of a Rift labyrinth. It knows every corridor and uses hit-and-run tactics to exhaust ascendants before the final confrontation.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'monstrosity', 'gate-creature']),
('Shadow Panther Alpha', 'Large', 'Monstrosity', '5', 17, 78, '10d10+20', 60, 19, 20, 16, 5, 16, 8, 'C', false, 'A massive panther that has mastered shadow phasing. It strikes from complete darkness and can phase through solid matter.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'monstrosity', 'gate-creature']),

-- =============================================
-- B-RANK MINI-BOSSES (CR 9-10)
-- =============================================
('Rift Giant Chieftain', 'Huge', 'Giant', '9', 16, 189, '14d12+98', 40, 25, 12, 23, 12, 14, 14, 'B', false, 'A colossal Giant that rules entire Rift regions. Its thrown boulders can destroy buildings, and it commands armies of lesser giants.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'giant', 'gate-creature']),
('Vampire Lord', 'Medium', 'Undead', '9', 17, 123, '13d8+52', 30, 18, 18, 18, 13, 12, 14, 'B', false, 'An ancient vampire that has survived for centuries. It commands spawn and uses powerful blood magic to drain life from entire teams.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'undead', 'gate-creature']),
('Young Black Dragon Tyrant', 'Large', 'Dragon', '9', 20, 178, '17d10+85', 80, 21, 16, 19, 14, 13, 17, 'B', false, 'A cunning dragon that has claimed a Rift as its domain. Its acid breath dissolves armor, and it uses the terrain to its advantage.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'dragon', 'gate-creature']),
('Chain Devil Warden', 'Medium', 'Fiend', '10', 18, 127, '15d8+60', 30, 20, 17, 20, 13, 14, 16, 'B', false, 'A devil that has tortured countless souls. Its chains are animated extensions of its will, and it delights in prolonged suffering.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'fiend', 'gate-creature']),

-- =============================================
-- A-RANK MINI-BOSSES (CR 13-14)
-- =============================================
('Bone Devil General', 'Large', 'Fiend', '13', 21, 199, '19d10+95', 40, 20, 18, 20, 15, 16, 18, 'A', false, 'A high-ranking devil that commands legions of the damned. Its stinger injects soul-rending poison, and it fights with tactical brilliance.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'fiend', 'gate-creature']),
('Stone Golem Warden', 'Large', 'Construct', '13', 19, 267, '21d10+147', 30, 24, 11, 22, 5, 13, 3, 'A', false, 'An ancient golem that has guarded a Rift for millennia. Its fists crack mountains, and it is nearly immune to all forms of damage.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'construct', 'gate-creature']),
('Young Red Dragon Overlord', 'Large', 'Dragon', '13', 20, 225, '18d10+108', 80, 25, 12, 23, 16, 13, 21, 'A', false, 'A fire dragon that has incinerated entire ascendant teams. Its breath weapon melts steel, and it rules its domain with absolute power.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'dragon', 'gate-creature']),
('Horned Devil Archduke', 'Large', 'Fiend', '14', 20, 225, '19d10+114', 30, 24, 19, 23, 14, 18, 19, 'A', false, 'An elite devil that serves as a general in hell''s armies. Its infernal flames burn souls, and it commands lesser devils with absolute authority.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['mini-boss', 'fiend', 'gate-creature']),

-- =============================================
-- E-RANK BOSSES (CR 2-3)
-- =============================================
('Rift Goblin King', 'Medium', 'Humanoid', '3', 17, 45, '6d8+18', 30, 14, 18, 14, 14, 12, 12, 'E', true, 'The absolute ruler of an E-Rank Rift. This massive goblin has consumed the power of countless lesser goblins and wields a cursed blade that drains life.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'humanoid', 'gate-creature', 'legendary']),
('Kobold Shadow Master', 'Medium', 'Humanoid', '3', 16, 39, '6d8+12', 30, 11, 19, 14, 12, 12, 12, 'E', true, 'A Kobold that has mastered shadow magic through Rift corruption. It phases through walls, sets impossible traps, and commands darkness itself.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'humanoid', 'gate-creature', 'legendary']),

-- =============================================
-- D-RANK BOSSES (CR 4-5)
-- =============================================
('Rift Hound Pack Lord', 'Large', 'Beast', '5', 17, 68, '8d10+24', 60, 18, 18, 16, 7, 16, 10, 'D', true, 'The alpha of all Rift Hounds. This massive canine has survived countless battles and can summon spectral pack members to fight alongside it.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'beast', 'gate-creature', 'legendary']),
('Stone Sentinel Prime', 'Large', 'Construct', '5', 18, 85, '10d10+40', 30, 18, 11, 20, 5, 14, 5, 'D', true, 'The first and most powerful Stone Sentinel ever created. It has guarded its Rift for centuries and can animate the very walls around it.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'construct', 'gate-creature', 'legendary']),
('Venomfang Queen', 'Huge', 'Beast', '5', 18, 85, '10d10+30', 50, 18, 20, 16, 6, 15, 8, 'D', true, 'A colossal spider that has laid claim to an entire Rift. Its webs cover entire chambers, and its venom can kill S-Rank ascendants in minutes.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'beast', 'gate-creature', 'legendary']),
('Rift Orc Overlord', 'Large', 'Humanoid', '5', 17, 78, '12d8+24', 30, 20, 16, 18, 11, 15, 14, 'D', true, 'A massive Orc that has united all war bands in its Rift. It wields a weapon forged from ascendant bones and commands absolute loyalty.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'humanoid', 'gate-creature', 'legendary']),

-- =============================================
-- C-RANK BOSSES (CR 7-9)
-- =============================================
('Rift Ogre Tyrant', 'Huge', 'Giant', '8', 15, 142, '15d12+60', 40, 23, 12, 20, 9, 11, 11, 'C', true, 'The absolute ruler of a C-Rank Rift. This massive Ogre has consumed the power of a hundred ascendants and wields a weapon that shatters reality.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'giant', 'gate-creature', 'legendary']),
('Wraith Knight Archon', 'Large', 'Undead', '8', 19, 142, '15d8+60', 30, 18, 20, 18, 16, 16, 12, 'C', true, 'An undead warrior that once served a Monarch directly. Its blade drains souls, and it can command the dead to rise and fight for it.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'undead', 'gate-creature', 'legendary']),
('Minotaur Labyrinth King', 'Huge', 'Monstrosity', '9', 18, 178, '17d12+85', 40, 22, 15, 20, 10, 20, 13, 'C', true, 'The master of the most complex Rift labyrinth ever discovered. It can reshape the maze at will and appears from nowhere to strike.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'monstrosity', 'gate-creature', 'legendary']),
('Shadow Panther Monarch', 'Huge', 'Monstrosity', '9', 19, 178, '17d10+68', 70, 21, 22, 18, 7, 18, 10, 'C', true, 'A massive panther that has become one with shadow itself. It can phase through dimensions and strikes from impossible angles.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'monstrosity', 'gate-creature', 'legendary']),

-- =============================================
-- B-RANK BOSSES (CR 11-13)
-- =============================================
('Rift Giant Emperor', 'Gargantuan', 'Giant', '13', 18, 252, '18d12+126', 40, 27, 14, 25, 14, 16, 16, 'B', true, 'A colossal Giant that rules an entire Rift dimension. Its thrown boulders create craters, and it commands armies of giants and monsters.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'giant', 'gate-creature', 'legendary']),
('Vampire Archduke', 'Medium', 'Undead', '12', 19, 195, '17d8+102', 30, 20, 20, 20, 15, 14, 16, 'B', true, 'An ancient vampire that predates the reset. It commands legions of spawn and uses blood magic that can drain life from entire cities.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'undead', 'gate-creature', 'legendary']),
('Young Black Dragon Alpha', 'Huge', 'Dragon', '13', 22, 225, '18d10+108', 80, 23, 18, 21, 16, 15, 19, 'B', true, 'A dragon that has claimed a Rift as its personal domain. Its acid breath dissolves everything, and it uses the Rift''s mana to enhance its power.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'dragon', 'gate-creature', 'legendary']),
('Chain Devil Overlord', 'Large', 'Fiend', '13', 20, 178, '17d8+102', 30, 22, 19, 22, 15, 16, 18, 'B', true, 'A devil that has tortured souls for millennia. Its chains are extensions of its will, and it can bind entire teams in unbreakable bonds.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'fiend', 'gate-creature', 'legendary']),

-- =============================================
-- A-RANK BOSSES (CR 16-18)
-- =============================================
('Bone Devil Archduke', 'Huge', 'Fiend', '17', 23, 315, '21d12+168', 40, 22, 20, 22, 17, 18, 20, 'A', true, 'A high-ranking devil that commands entire legions of the damned. Its stinger injects soul-rending poison, and it fights with infernal tactics.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'fiend', 'gate-creature', 'legendary']),
('Stone Golem Prime', 'Huge', 'Construct', '17', 21, 357, '23d12+207', 30, 26, 13, 24, 7, 15, 5, 'A', true, 'The first and most powerful Stone Golem ever created. It has guarded its Rift since before the reset and is nearly indestructible.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'construct', 'gate-creature', 'legendary']),
('Young Red Dragon Emperor', 'Huge', 'Dragon', '17', 22, 315, '21d12+168', 80, 27, 14, 25, 18, 15, 23, 'A', true, 'A fire dragon that has incinerated entire S-Rank teams. Its breath weapon melts everything, and it rules its domain with absolute power.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'dragon', 'gate-creature', 'legendary']),
('Horned Devil Archfiend', 'Huge', 'Fiend', '18', 22, 357, '23d12+207', 30, 26, 21, 25, 16, 20, 21, 'A', true, 'An elite devil that serves as a general in hell''s armies. Its infernal flames burn souls, and it commands lesser devils with absolute authority.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'fiend', 'gate-creature', 'legendary']),

-- =============================================
-- S-RANK BOSSES (CR 20-30)
-- =============================================
('Adult Red Dragon Monarch', 'Gargantuan', 'Dragon', '22', 23, 420, '24d20+240', 80, 29, 12, 27, 18, 15, 25, 'S', true, 'A legendary fire dragon that rules volcano Rifts. Its breath can level cities, and only the strongest S-Rank teams can hope to survive.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'dragon', 'gate-creature', 'legendary']),
('Adult Black Dragon Alpha', 'Gargantuan', 'Dragon', '20', 23, 378, '22d20+198', 80, 25, 16, 23, 16, 15, 19, 'S', true, 'A cunning acid dragon that rules swamp Rifts. Its acid dissolves even magical protection, and it uses ambush tactics with devastating effect.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'dragon', 'gate-creature', 'legendary']),
('Adult Blue Dragon Overlord', 'Gargantuan', 'Dragon', '21', 23, 399, '23d20+207', 80, 27, 12, 25, 18, 17, 21, 'S', true, 'A lightning dragon that creates devastating sandstorms. It rules desert-themed S-Rank Rifts and commands the very weather.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'dragon', 'gate-creature', 'legendary']),
('Iron Golem Prime', 'Huge', 'Construct', '20', 22, 315, '21d10+210', 30, 26, 11, 22, 5, 13, 3, 'S', true, 'The most powerful Iron Golem ever created. It is nearly indestructible and exhales poison gas that can kill entire teams instantly.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'construct', 'gate-creature', 'legendary']),
('Balor Archfiend', 'Gargantuan', 'Fiend', '23', 21, 420, '24d12+240', 40, 28, 17, 24, 22, 18, 24, 'S', true, 'A demon lord of flame and shadow. Its death explosion can kill ascendants who survive the battle, and it commands legions of demons.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'fiend', 'gate-creature', 'legendary']),
('Pit Fiend Archduke', 'Huge', 'Fiend', '24', 21, 450, '25d10+250', 30, 28, 16, 26, 24, 16, 26, 'S', true, 'The general of hell''s armies. It wields flaming maces and commands devastating infernal magic that can destroy entire teams.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'fiend', 'gate-creature', 'legendary']),
('Ancient Red Dragon Overlord', 'Gargantuan', 'Dragon', '27', 24, 630, '28d20+420', 80, 32, 12, 31, 20, 17, 25, 'S', true, 'The apex predator of all dragons. Only the strongest S-Rank teams can hope to survive an encounter with this legendary creature.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'dragon', 'gate-creature', 'legendary']),
('Lich Archmage', 'Medium', 'Undead', '25', 19, 270, '20d8+180', 30, 13, 18, 18, 22, 16, 18, 'S', true, 'An undead archmage who achieved immortality through dark rituals. Its phylactery must be destroyed, or it will reform endlessly.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'undead', 'gate-creature', 'legendary']),
('Kraken Leviathan', 'Gargantuan', 'Monstrosity', '26', 20, 567, '27d20+378', 60, 32, 13, 27, 24, 20, 22, 'S', true, 'An oceanic horror that devours entire fleets. It is worshipped as a god by sea-dwelling Rift creatures and commands the depths.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'monstrosity', 'gate-creature', 'legendary']),
('Tarrasque World Eater', 'Gargantuan', 'Monstrosity', '30', 27, 810, '33d20+660', 40, 30, 13, 30, 5, 13, 13, 'S', true, 'The most powerful non-Monarch creature in existence. Its awakening signals the end of an era, and only the Umbral Monarch can truly defeat it.', 'SRD', 'homebrew', 'System Ascendant Homebrew', ARRAY['boss', 'monstrosity', 'gate-creature', 'legendary'])
ON CONFLICT (name) DO NOTHING;
-- =============================================
-- ADD LEGENDARY ACTIONS TO BOSSES
-- =============================================
-- Note: Legendary actions are stored in compendium_monster_actions table
-- These will be added via a separate script or manually
-- Bosses typically have 3 legendary actions per turn

-- =============================================
-- UPDATE XP VALUES FOR BOSSES AND MINI-BOSSES
-- =============================================
-- XP values based on CR (using standard 5e XP table)
UPDATE compendium_monsters SET xp = CASE cr
  WHEN '0' THEN 0
  WHEN '1/8' THEN 25
  WHEN '1/4' THEN 50
  WHEN '1/2' THEN 100
  WHEN '1' THEN 200
  WHEN '2' THEN 450
  WHEN '3' THEN 700
  WHEN '4' THEN 1100
  WHEN '5' THEN 1800
  WHEN '6' THEN 2300
  WHEN '7' THEN 2900
  WHEN '8' THEN 3900
  WHEN '9' THEN 5000
  WHEN '10' THEN 5900
  WHEN '11' THEN 7200
  WHEN '12' THEN 8400
  WHEN '13' THEN 10000
  WHEN '14' THEN 11500
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
  WHEN '25' THEN 75000
  WHEN '26' THEN 90000
  WHEN '27' THEN 105000
  WHEN '28' THEN 120000
  WHEN '29' THEN 135000
  WHEN '30' THEN 155000
  ELSE xp
END
WHERE xp IS NULL;



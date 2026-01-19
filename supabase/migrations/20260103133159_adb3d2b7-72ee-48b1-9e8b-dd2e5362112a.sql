-- =============================================
-- EXPAND MONSTERS (SRD Monsters → Solo Leveling Gate Creatures)
-- =============================================
INSERT INTO compendium_monsters (name, size, creature_type, cr, armor_class, hit_points_average, hit_points_formula, speed_walk, str, agi, vit, int, sense, pre, gate_rank, description, source_book) VALUES
-- E-Rank Gate Monsters (CR 0-1/4)
('Gate Rat', 'Small', 'Beast', '0', 10, 1, '1d4-1', 30, 2, 11, 9, 2, 10, 4, 'E', 'Common pests that spawn in low-level Gates. They swarm in numbers and can overwhelm unprepared E-Rank hunters.', 'SRD'),
('Gate Crawler', 'Small', 'Beast', '0', 11, 3, '1d6', 30, 4, 13, 10, 1, 10, 2, 'E', 'Spider-like creatures that skitter along Gate walls and ceilings. Their weak venom causes mild discomfort.', 'SRD'),
('Mana Sprite', 'Tiny', 'Elemental', '0', 12, 2, '1d4', 30, 1, 14, 10, 4, 12, 6, 'E', 'Tiny manifestations of raw mana. Mostly harmless but can startle hunters with bright flashes.', 'SRD'),
('Shadow Wisp', 'Tiny', 'Undead', '0', 13, 3, '1d4+1', 30, 1, 15, 10, 2, 10, 1, 'E', 'Weak undead spirits that materialize in Gates with necromantic energy. They dissipate quickly when struck.', 'SRD'),
('Gate Goblin', 'Small', 'Humanoid', '1/4', 13, 7, '2d6', 30, 8, 14, 10, 10, 8, 8, 'E', 'The most common humanoid monster in low-rank Gates. They use crude weapons and attack in groups.', 'SRD'),
('Kobold Lurker', 'Small', 'Humanoid', '1/8', 12, 5, '2d6-2', 30, 7, 15, 9, 8, 8, 8, 'E', 'Cunning reptilian creatures that set traps in Gate corridors. Pack tactics make them dangerous in numbers.', 'SRD'),

-- D-Rank Gate Monsters (CR 1/4-1)
('Gate Hound', 'Medium', 'Beast', '1/4', 13, 11, '2d8+2', 40, 13, 14, 12, 3, 12, 6, 'D', 'Twisted canines that hunt in packs within D-Rank Gates. Their keen senses make them excellent trackers.', 'SRD'),
('Stone Sentinel', 'Medium', 'Construct', '1/2', 14, 22, '3d8+9', 25, 14, 9, 16, 1, 10, 1, 'D', 'Animated stone guardians that protect Gate cores. They move slowly but hit hard.', 'SRD'),
('Gate Skeleton', 'Medium', 'Undead', '1/4', 13, 13, '2d8+4', 30, 10, 14, 15, 6, 8, 5, 'D', 'Skeletal warriors animated by Gate mana. They wield rusted weapons with surprising skill.', 'SRD'),
('Venomfang Spider', 'Large', 'Beast', '1', 14, 26, '4d10+4', 30, 14, 16, 12, 2, 11, 4, 'D', 'Giant arachnids with potent venom. A single bite can incapacitate an unprepared D-Rank hunter.', 'SRD'),
('Gate Orc', 'Medium', 'Humanoid', '1/2', 13, 15, '2d8+6', 30, 16, 12, 16, 7, 11, 10, 'D', 'Brutish humanoids that dominate D-Rank Gates. They are strong but lack tactical sophistication.', 'SRD'),
('Mana Slime', 'Medium', 'Ooze', '1/2', 8, 22, '4d8+4', 10, 12, 6, 14, 1, 6, 2, 'D', 'Amorphous creatures of condensed Gate mana. They dissolve organic matter on contact.', 'SRD'),
('Shadow Stalker', 'Medium', 'Undead', '1', 14, 27, '5d8+5', 30, 8, 16, 12, 7, 14, 6, 'D', 'Stealthy undead that ambush hunters from the shadows. Their incorporeal touch drains life force.', 'SRD'),
('Gate Wolf', 'Medium', 'Beast', '1/4', 13, 11, '2d8+2', 40, 12, 15, 12, 3, 12, 6, 'D', 'Corrupted wolves with glowing eyes. They coordinate attacks with eerie precision.', 'SRD'),

-- C-Rank Gate Monsters (CR 2-4)
('Gate Ogre', 'Large', 'Giant', '2', 11, 59, '7d10+21', 40, 19, 8, 16, 5, 7, 7, 'C', 'Massive brutes that guard C-Rank Gate corridors. One swing of their clubs can crush armor.', 'SRD'),
('Ice Elemental', 'Medium', 'Elemental', '2', 14, 39, '6d8+12', 25, 14, 10, 14, 5, 10, 8, 'C', 'Manifestations of frozen Gate mana. Their touch freezes flesh and slows movement.', 'SRD'),
('Fire Elemental', 'Medium', 'Elemental', '5', 13, 102, '12d8+48', 50, 10, 17, 16, 6, 10, 7, 'C', 'Blazing entities of pure fire mana. They ignite everything they touch.', 'SRD'),
('Wraith Knight', 'Medium', 'Undead', '3', 15, 52, '8d8+16', 30, 14, 16, 14, 12, 12, 8, 'C', 'Elite undead warriors clad in spectral armor. They command lesser undead within their domain.', 'SRD'),
('Gate Troll', 'Large', 'Giant', '5', 15, 84, '8d10+40', 30, 18, 13, 20, 7, 9, 7, 'C', 'Regenerating horrors that must be killed with fire or acid. Their wounds close within seconds.', 'SRD'),
('Minotaur Guardian', 'Large', 'Monstrosity', '3', 14, 76, '9d10+27', 40, 18, 11, 16, 6, 16, 9, 'C', 'Bull-headed warriors that patrol Gate labyrinths. They charge with devastating force.', 'SRD'),
('Shadow Panther', 'Large', 'Monstrosity', '3', 15, 52, '7d10+14', 50, 17, 18, 14, 3, 14, 6, 'C', 'Sleek predators that phase through shadows. They strike without warning and vanish.', 'SRD'),
('Gargoyle Sentinel', 'Medium', 'Elemental', '2', 15, 52, '7d8+21', 30, 15, 11, 16, 6, 11, 7, 'C', 'Stone creatures that animate when intruders enter their territory. Nearly impervious to mundane weapons.', 'SRD'),

-- B-Rank Gate Monsters (CR 5-8)
('Gate Giant', 'Huge', 'Giant', '7', 14, 126, '11d12+55', 40, 23, 10, 21, 10, 12, 12, 'B', 'Towering humanoids that shake the ground with each step. Their thrown boulders devastate formations.', 'SRD'),
('Vampire Spawn', 'Medium', 'Undead', '5', 15, 82, '11d8+33', 30, 16, 16, 16, 11, 10, 12, 'B', 'Lesser vampires that serve the Gate''s master. They drain blood to heal their wounds.', 'SRD'),
('Wyvern', 'Large', 'Dragon', '6', 13, 110, '13d10+39', 80, 19, 10, 16, 5, 12, 6, 'B', 'Venomous flying dragons that nest in high-altitude Gates. Their tail stingers inject deadly poison.', 'SRD'),
('Young Black Dragon', 'Large', 'Dragon', '7', 18, 127, '15d10+45', 80, 19, 14, 17, 12, 11, 15, 'B', 'Acid-breathing dragons that rule swamp-themed Gates. Their ambush tactics are legendary.', 'SRD'),
('Chain Devil', 'Medium', 'Fiend', '8', 16, 85, '10d8+40', 30, 18, 15, 18, 11, 12, 14, 'B', 'Devils wrapped in animate chains. They entangle and torture their victims.', 'SRD'),
('Spirit Naga', 'Large', 'Monstrosity', '8', 15, 75, '10d10+20', 40, 18, 17, 14, 16, 15, 16, 'B', 'Serpentine spellcasters that reform after death. They must be permanently destroyed or they return.', 'SRD'),
('Chimera', 'Large', 'Monstrosity', '6', 14, 114, '12d10+48', 30, 19, 11, 19, 3, 14, 10, 'B', 'Three-headed monstrosities with lion, goat, and dragon heads. Each head attacks independently.', 'SRD'),
('Frost Giant', 'Huge', 'Giant', '8', 15, 138, '12d12+60', 40, 23, 9, 21, 9, 10, 12, 'B', 'Ice-wielding giants that rule frozen Gates. Their greataxes are carved from glacial ice.', 'SRD'),

-- A-Rank Gate Monsters (CR 9-12)
('Bone Devil', 'Large', 'Fiend', '9', 19, 142, '15d10+60', 40, 18, 16, 18, 13, 14, 16, 'A', 'Skeletal devils that command legions of the damned. Their stingers inject soul-rending poison.', 'SRD'),
('Stone Golem', 'Large', 'Construct', '10', 17, 178, '17d10+85', 30, 22, 9, 20, 3, 11, 1, 'A', 'Animated stone warriors immune to most magic. Only the strongest attacks can crack their forms.', 'SRD'),
('Young Red Dragon', 'Large', 'Dragon', '10', 18, 178, '17d10+85', 80, 23, 10, 21, 14, 11, 19, 'A', 'Fire-breathing dragons of terrible power. Their flames melt steel and incinerate hunters.', 'SRD'),
('Efreeti', 'Large', 'Elemental', '11', 17, 200, '16d10+112', 40, 22, 12, 24, 16, 15, 16, 'A', 'Fire genies of immense power. They grant twisted wishes and wield devastating flame magic.', 'SRD'),
('Horned Devil', 'Large', 'Fiend', '11', 18, 178, '17d10+85', 30, 22, 17, 21, 12, 16, 17, 'A', 'Elite devils with massive horns and infernal flames. They are among hell''s finest warriors.', 'SRD'),
('Remorhaz', 'Huge', 'Monstrosity', '11', 17, 195, '17d12+85', 30, 24, 13, 21, 4, 10, 5, 'A', 'Centipede-like monsters that generate intense internal heat. Attacking them burns the attacker.', 'SRD'),
('Behir', 'Huge', 'Monstrosity', '11', 17, 168, '16d12+64', 50, 23, 16, 18, 7, 14, 12, 'A', 'Lightning-breathing serpents with multiple legs. They swallow prey whole and digest them alive.', 'SRD'),

-- S-Rank Gate Monsters (CR 13+)
('Adult Red Dragon', 'Huge', 'Dragon', '17', 19, 256, '19d12+133', 80, 27, 10, 25, 16, 13, 21, 'S', 'Legendary fire dragons that rule volcano Gates. Their breath can level city blocks.', 'SRD'),
('Adult Black Dragon', 'Huge', 'Dragon', '14', 19, 195, '17d12+85', 80, 23, 14, 21, 14, 13, 17, 'S', 'Cunning acid dragons that ambush from murky waters. Their acid dissolves even magical protection.', 'SRD'),
('Adult Blue Dragon', 'Huge', 'Dragon', '16', 19, 225, '18d12+108', 80, 25, 10, 23, 16, 15, 19, 'S', 'Lightning dragons that create devastating sandstorms. They rule desert-themed S-Rank Gates.', 'SRD'),
('Iron Golem', 'Large', 'Construct', '16', 20, 210, '20d10+100', 30, 24, 9, 20, 3, 11, 1, 'S', 'Nearly indestructible iron automatons. They exhale poison gas and shrug off magical attacks.', 'SRD'),
('Balor', 'Huge', 'Fiend', '19', 19, 262, '21d12+126', 40, 26, 15, 22, 20, 16, 22, 'S', 'Demon lords of flame and shadow. Their death explosion can kill hunters who survive the battle.', 'SRD'),
('Pit Fiend', 'Large', 'Fiend', '20', 19, 300, '24d10+168', 30, 26, 14, 24, 22, 14, 24, 'S', 'The generals of hell. They wield flaming maces and command devastating infernal magic.', 'SRD'),
('Ancient Red Dragon', 'Gargantuan', 'Dragon', '24', 22, 546, '28d20+252', 80, 30, 10, 29, 18, 15, 23, 'S', 'The apex predator of all dragons. Only the strongest S-Rank teams can hope to survive an encounter.', 'SRD'),
('Lich', 'Medium', 'Undead', '21', 17, 135, '18d8+54', 30, 11, 16, 16, 20, 14, 16, 'S', 'Undead archmages who achieved immortality through dark rituals. Their phylacteries must be destroyed.', 'SRD'),
('Kraken', 'Gargantuan', 'Monstrosity', '23', 18, 472, '27d20+189', 60, 30, 11, 25, 22, 18, 20, 'S', 'Oceanic horrors that devour ships. They are worshipped as gods by sea-dwelling Gate creatures.', 'SRD'),
('Tarrasque', 'Gargantuan', 'Monstrosity', '30', 25, 676, '33d20+330', 40, 30, 11, 30, 3, 11, 11, 'S', 'The most powerful non-Monarch creature in existence. Its awakening signals the end of an era.', 'SRD')
ON CONFLICT DO NOTHING;

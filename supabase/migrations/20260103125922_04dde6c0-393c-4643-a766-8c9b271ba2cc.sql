-- Remove incorrect jobs
DELETE FROM compendium_jobs WHERE name IN ('Fighter', 'Necromancer', 'Summoner', 'Tank');

-- Add missing jobs
INSERT INTO compendium_jobs (name, description, hit_die, primary_abilities, saving_throw_proficiencies) VALUES
('Herald', 'Masters of inspiration and battlefield control through voice and presence.', 8, ARRAY['PRE', 'AGI']::ability_score[], ARRAY['PRE', 'AGI']::ability_score[]),
('Holy Knight', 'Divine warriors who channel sacred power through martial prowess.', 10, ARRAY['STR', 'PRE']::ability_score[], ARRAY['SENSE', 'PRE']::ability_score[]),
('Techsmith', 'Ingenious inventors who blend technology with Hunter abilities.', 8, ARRAY['INT', 'AGI']::ability_score[], ARRAY['INT', 'VIT']::ability_score[]),
('Warden', 'Defensive specialists who create barriers and control the battlefield.', 10, ARRAY['VIT', 'SENSE']::ability_score[], ARRAY['VIT', 'SENSE']::ability_score[]);

-- Insert all 78 paths
INSERT INTO compendium_job_paths (job_id, name, description) VALUES
-- Assassin paths
((SELECT id FROM compendium_jobs WHERE name = 'Assassin'), 'Path of the Distant Needle', 'Masters of ranged assassination and precision strikes from afar.'),
((SELECT id FROM compendium_jobs WHERE name = 'Assassin'), 'Path of the Masked Ghost', 'Specialists in disguise and identity manipulation.'),
((SELECT id FROM compendium_jobs WHERE name = 'Assassin'), 'Path of the Night Venom', 'Experts in poisons and debilitating toxins.'),
((SELECT id FROM compendium_jobs WHERE name = 'Assassin'), 'Path of the Red Sigil', 'Blood magic assassins who mark their targets.'),
((SELECT id FROM compendium_jobs WHERE name = 'Assassin'), 'Path of the Shadow Net', 'Network operatives who coordinate strikes.'),
((SELECT id FROM compendium_jobs WHERE name = 'Assassin'), 'Path of the Silent Knife', 'Classic silent killers focused on stealth kills.'),

-- Contractor paths
((SELECT id FROM compendium_jobs WHERE name = 'Contractor'), 'Path of the Data Pact', 'Digital contracts with information spirits.'),
((SELECT id FROM compendium_jobs WHERE name = 'Contractor'), 'Path of the Mirror Pact', 'Pacts with reflection entities for duplication.'),
((SELECT id FROM compendium_jobs WHERE name = 'Contractor'), 'Path of the Monarch Pact', 'Dangerous contracts with Monarch fragments.'),
((SELECT id FROM compendium_jobs WHERE name = 'Contractor'), 'Path of the Relic Pact', 'Bindings with ancient artifact spirits.'),
((SELECT id FROM compendium_jobs WHERE name = 'Contractor'), 'Path of the Shadow Pact', 'Contracts with shadow realm entities.'),
((SELECT id FROM compendium_jobs WHERE name = 'Contractor'), 'Path of the Weapon Pact', 'Bonds with sentient weapon spirits.'),

-- Destroyer paths
((SELECT id FROM compendium_jobs WHERE name = 'Destroyer'), 'Path of the Berserker', 'Rage-fueled destruction without restraint.'),
((SELECT id FROM compendium_jobs WHERE name = 'Destroyer'), 'Path of the Colossus', 'Growing to massive size for devastating attacks.'),
((SELECT id FROM compendium_jobs WHERE name = 'Destroyer'), 'Path of the Gatebreaker', 'Specialized in destroying Gate structures.'),
((SELECT id FROM compendium_jobs WHERE name = 'Destroyer'), 'Path of the Juggernaut', 'Unstoppable momentum-based combat.'),
((SELECT id FROM compendium_jobs WHERE name = 'Destroyer'), 'Path of the Unstoppable', 'Ignoring damage to keep fighting.'),
((SELECT id FROM compendium_jobs WHERE name = 'Destroyer'), 'Path of the War Titan', 'Wielding massive weapons with ease.'),

-- Esper paths
((SELECT id FROM compendium_jobs WHERE name = 'Esper'), 'Path of the Kinetic', 'Telekinetic manipulation and force projection.'),
((SELECT id FROM compendium_jobs WHERE name = 'Esper'), 'Path of the Mirage', 'Illusion creation and sensory manipulation.'),
((SELECT id FROM compendium_jobs WHERE name = 'Esper'), 'Path of the Precog', 'Precognition and future sight abilities.'),
((SELECT id FROM compendium_jobs WHERE name = 'Esper'), 'Path of the Stormmind', 'Psychic storms and mental area attacks.'),
((SELECT id FROM compendium_jobs WHERE name = 'Esper'), 'Path of the Telepath', 'Mind reading and mental communication.'),
((SELECT id FROM compendium_jobs WHERE name = 'Esper'), 'Path of the Voidmind', 'Accessing the void for dark psychic power.'),

-- Healer paths
((SELECT id FROM compendium_jobs WHERE name = 'Healer'), 'Path of the Battle Medic', 'Combat healing while fighting.'),
((SELECT id FROM compendium_jobs WHERE name = 'Healer'), 'Path of the Covenant Voice', 'Divine healing through sacred words.'),
((SELECT id FROM compendium_jobs WHERE name = 'Healer'), 'Path of the Gravewarden', 'Death-touched healing and resurrection.'),
((SELECT id FROM compendium_jobs WHERE name = 'Healer'), 'Path of the Lifespring', 'Pure life energy and regeneration.'),
((SELECT id FROM compendium_jobs WHERE name = 'Healer'), 'Path of the Shieldbound', 'Protective healing and barriers.'),
((SELECT id FROM compendium_jobs WHERE name = 'Healer'), 'Path of the System Medic', 'Using System interface for healing.'),

-- Herald paths
((SELECT id FROM compendium_jobs WHERE name = 'Herald'), 'Path of the Banner Vanguard', 'Leading from the front with inspiring presence.'),
((SELECT id FROM compendium_jobs WHERE name = 'Herald'), 'Path of the Ciphersong', 'Encoded messages and secret communications.'),
((SELECT id FROM compendium_jobs WHERE name = 'Herald'), 'Path of the Dawn Chorus', 'Light-based inspiration and hope.'),
((SELECT id FROM compendium_jobs WHERE name = 'Herald'), 'Path of the Dirge Keeper', 'Dark inspiration through fear and dread.'),
((SELECT id FROM compendium_jobs WHERE name = 'Herald'), 'Path of the Silver Tongue', 'Persuasion and diplomatic manipulation.'),
((SELECT id FROM compendium_jobs WHERE name = 'Herald'), 'Path of the War Drummer', 'Rhythm-based combat enhancement.'),

-- Holy Knight paths
((SELECT id FROM compendium_jobs WHERE name = 'Holy Knight'), 'Path of the Iron Banner', 'Unyielding faith and martial discipline.'),
((SELECT id FROM compendium_jobs WHERE name = 'Holy Knight'), 'Path of the Oathbreaker', 'Fallen knights wielding dark power.'),
((SELECT id FROM compendium_jobs WHERE name = 'Holy Knight'), 'Path of the Radiant Shield', 'Divine protection and light barriers.'),
((SELECT id FROM compendium_jobs WHERE name = 'Holy Knight'), 'Path of the Redeemer', 'Seeking redemption through righteous combat.'),
((SELECT id FROM compendium_jobs WHERE name = 'Holy Knight'), 'Path of the Sanctifier', 'Purifying corruption and evil.'),
((SELECT id FROM compendium_jobs WHERE name = 'Holy Knight'), 'Path of the Vengeful Flame', 'Holy fire and divine retribution.'),

-- Mage paths
((SELECT id FROM compendium_jobs WHERE name = 'Mage'), 'Path of the Battlecaster', 'Combat-focused spell warfare.'),
((SELECT id FROM compendium_jobs WHERE name = 'Mage'), 'Path of the Chronomancer', 'Time manipulation magic.'),
((SELECT id FROM compendium_jobs WHERE name = 'Mage'), 'Path of the Elementalist', 'Mastery over elemental forces.'),
((SELECT id FROM compendium_jobs WHERE name = 'Mage'), 'Path of the Illusionist', 'Deception and illusion magic.'),
((SELECT id FROM compendium_jobs WHERE name = 'Mage'), 'Path of the Rift Summoner', 'Opening portals and summoning.'),
((SELECT id FROM compendium_jobs WHERE name = 'Mage'), 'Path of the Void Scholar', 'Studying and wielding void magic.'),

-- Ranger paths
((SELECT id FROM compendium_jobs WHERE name = 'Ranger'), 'Path of the Beast Warden', 'Animal companions and beast mastery.'),
((SELECT id FROM compendium_jobs WHERE name = 'Ranger'), 'Path of the Gate Hunter', 'Specialized Gate tracking and hunting.'),
((SELECT id FROM compendium_jobs WHERE name = 'Ranger'), 'Path of the Shadow Trail', 'Stealth tracking and ambush tactics.'),
((SELECT id FROM compendium_jobs WHERE name = 'Ranger'), 'Path of the Storm Archer', 'Lightning-infused ranged combat.'),
((SELECT id FROM compendium_jobs WHERE name = 'Ranger'), 'Path of the Verdant Sentinel', 'Nature magic and plant manipulation.'),
((SELECT id FROM compendium_jobs WHERE name = 'Ranger'), 'Path of the Wildrunner', 'Speed and mobility through terrain.'),

-- Striker paths
((SELECT id FROM compendium_jobs WHERE name = 'Striker'), 'Path of the Blitz Raider', 'Lightning-fast hit and run tactics.'),
((SELECT id FROM compendium_jobs WHERE name = 'Striker'), 'Path of the Deadeye', 'Precision targeting and critical hits.'),
((SELECT id FROM compendium_jobs WHERE name = 'Striker'), 'Path of the Executioner', 'Finishing wounded enemies efficiently.'),
((SELECT id FROM compendium_jobs WHERE name = 'Striker'), 'Path of the Ghost Blade', 'Phasing attacks and intangibility.'),
((SELECT id FROM compendium_jobs WHERE name = 'Striker'), 'Path of the Pressure Duelist', 'One-on-one combat dominance.'),
((SELECT id FROM compendium_jobs WHERE name = 'Striker'), 'Path of the Shockstep Adept', 'Movement-based combat techniques.'),

-- Techsmith paths
((SELECT id FROM compendium_jobs WHERE name = 'Techsmith'), 'Path of the Arc Reactor', 'Energy generation and power systems.'),
((SELECT id FROM compendium_jobs WHERE name = 'Techsmith'), 'Path of the Drone Commander', 'Controlling swarms of drones.'),
((SELECT id FROM compendium_jobs WHERE name = 'Techsmith'), 'Path of the Field Medic', 'Medical technology and healing devices.'),
((SELECT id FROM compendium_jobs WHERE name = 'Techsmith'), 'Path of the Ghost Protocol', 'Stealth technology and invisibility.'),
((SELECT id FROM compendium_jobs WHERE name = 'Techsmith'), 'Path of the Relic Smith', 'Crafting and enhancing magical items.'),
((SELECT id FROM compendium_jobs WHERE name = 'Techsmith'), 'Path of the Siege Engineer', 'Heavy weapons and fortifications.'),

-- Vanguard paths
((SELECT id FROM compendium_jobs WHERE name = 'Vanguard'), 'Path of the Bastion', 'Immovable defensive positioning.'),
((SELECT id FROM compendium_jobs WHERE name = 'Vanguard'), 'Path of the Battle Captain', 'Tactical leadership and commands.'),
((SELECT id FROM compendium_jobs WHERE name = 'Vanguard'), 'Path of the Iron Guard', 'Heavy armor and damage reduction.'),
((SELECT id FROM compendium_jobs WHERE name = 'Vanguard'), 'Path of the Mobile Ward', 'Moving protection for allies.'),
((SELECT id FROM compendium_jobs WHERE name = 'Vanguard'), 'Path of the Sentinel', 'Watchful guardian and reactions.'),
((SELECT id FROM compendium_jobs WHERE name = 'Vanguard'), 'Path of the Shieldwall', 'Group defensive formations.'),

-- Warden paths
((SELECT id FROM compendium_jobs WHERE name = 'Warden'), 'Path of the Frost Ring', 'Ice barriers and cold zones.'),
((SELECT id FROM compendium_jobs WHERE name = 'Warden'), 'Path of the Iron Bastion', 'Metal barriers and magnetic fields.'),
((SELECT id FROM compendium_jobs WHERE name = 'Warden'), 'Path of the Stonewall', 'Earth and stone fortifications.'),
((SELECT id FROM compendium_jobs WHERE name = 'Warden'), 'Path of the Stormgate', 'Lightning barriers and energy fields.'),
((SELECT id FROM compendium_jobs WHERE name = 'Warden'), 'Path of the Verdant Lock', 'Plant-based barriers and entanglement.'),
((SELECT id FROM compendium_jobs WHERE name = 'Warden'), 'Path of the Void Fence', 'Void energy barriers and nullification.');
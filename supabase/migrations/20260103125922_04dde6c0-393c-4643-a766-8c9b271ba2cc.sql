-- Remove incorrect jobs
DELETE FROM compendium_jobs WHERE name IN ('Fighter', 'Necromancer', 'Summoner', 'Tank');

-- Add missing jobs
INSERT INTO compendium_jobs (name, description, hit_die, primary_abilities, saving_throw_proficiencies) VALUES
('Assassin', 'Stealth specialists who eliminate high-value targets with lethal precision.', 8, ARRAY['AGI', 'SENSE']::ability_score[], ARRAY['AGI', 'SENSE']::ability_score[]),
('Contractor', 'Hunters who form binding contracts with entities, relic spirits, or fragments of greater powers.', 8, ARRAY['PRE', 'INT']::ability_score[], ARRAY['PRE', 'INT']::ability_score[]),
('Destroyer', 'Brutal frontliners who specialize in overwhelming force and breaking enemy formations.', 12, ARRAY['STR', 'VIT']::ability_score[], ARRAY['STR', 'VIT']::ability_score[]),
('Esper', 'Psychic hunters who wield mental force, telekinesis, and perception beyond human limits.', 8, ARRAY['INT', 'SENSE']::ability_score[], ARRAY['INT', 'SENSE']::ability_score[]),
('Healer', 'Support specialists who restore allies and counter hostile effects amid Gate combat.', 8, ARRAY['PRE', 'SENSE']::ability_score[], ARRAY['PRE', 'SENSE']::ability_score[]),
('Herald', 'Masters of inspiration and battlefield control through voice and presence.', 8, ARRAY['PRE', 'AGI']::ability_score[], ARRAY['PRE', 'AGI']::ability_score[]),
('Holy Knight', 'Divine warriors who channel sacred power through martial prowess.', 10, ARRAY['STR', 'PRE']::ability_score[], ARRAY['SENSE', 'PRE']::ability_score[]),
('Mage', 'Arcane specialists who manipulate mana through spells, sigils, and forbidden lore.', 6, ARRAY['INT', 'PRE']::ability_score[], ARRAY['INT', 'PRE']::ability_score[]),
('Ranger', 'Skirmishers and trackers who excel at ranged combat and Gate navigation.', 10, ARRAY['AGI', 'SENSE']::ability_score[], ARRAY['AGI', 'SENSE']::ability_score[]),
('Striker', 'Mobile melee specialists who rely on speed, precision, and burst damage.', 10, ARRAY['AGI', 'STR']::ability_score[], ARRAY['AGI', 'SENSE']::ability_score[]),
('Techsmith', 'Ingenious inventors who blend technology with Hunter abilities.', 8, ARRAY['INT', 'AGI']::ability_score[], ARRAY['INT', 'VIT']::ability_score[]),
('Vanguard', 'Frontline warriors who lead the charge and hold the line in Gate combat.', 10, ARRAY['STR', 'VIT']::ability_score[], ARRAY['STR', 'VIT']::ability_score[]),
('Warden', 'Defensive specialists who create barriers and control the battlefield.', 10, ARRAY['VIT', 'SENSE']::ability_score[], ARRAY['VIT', 'SENSE']::ability_score[])
ON CONFLICT (name) DO NOTHING;

-- Insert all 78 paths
WITH paths(job_name, name, description) AS (
  VALUES
  -- Assassin paths
  ('Assassin', 'Path of the Distant Needle', 'Masters of ranged assassination and precision strikes from afar.'),
  ('Assassin', 'Path of the Masked Ghost', 'Specialists in disguise and identity manipulation.'),
  ('Assassin', 'Path of the Night Venom', 'Experts in poisons and debilitating toxins.'),
  ('Assassin', 'Path of the Red Sigil', 'Blood magic assassins who mark their targets.'),
  ('Assassin', 'Path of the Shadow Net', 'Network operatives who coordinate strikes.'),
  ('Assassin', 'Path of the Silent Knife', 'Classic silent killers focused on stealth kills.'),

  -- Contractor paths
  ('Contractor', 'Path of the Data Pact', 'Digital contracts with information spirits.'),
  ('Contractor', 'Path of the Mirror Pact', 'Pacts with reflection entities for duplication.'),
  ('Contractor', 'Path of the Monarch Pact', 'Dangerous contracts with Monarch fragments.'),
  ('Contractor', 'Path of the Relic Pact', 'Bindings with ancient artifact spirits.'),
  ('Contractor', 'Path of the Shadow Pact', 'Contracts with shadow realm entities.'),
  ('Contractor', 'Path of the Weapon Pact', 'Bonds with sentient weapon spirits.'),

  -- Destroyer paths
  ('Destroyer', 'Path of the Berserker', 'Rage-fueled destruction without restraint.'),
  ('Destroyer', 'Path of the Colossus', 'Growing to massive size for devastating attacks.'),
  ('Destroyer', 'Path of the Gatebreaker', 'Specialized in destroying Gate structures.'),
  ('Destroyer', 'Path of the Juggernaut', 'Unstoppable momentum-based combat.'),
  ('Destroyer', 'Path of the Unstoppable', 'Ignoring damage to keep fighting.'),
  ('Destroyer', 'Path of the War Titan', 'Wielding massive weapons with ease.'),

  -- Esper paths
  ('Esper', 'Path of the Kinetic', 'Telekinetic manipulation and force projection.'),
  ('Esper', 'Path of the Mirage', 'Illusion creation and sensory manipulation.'),
  ('Esper', 'Path of the Precog', 'Precognition and future sight abilities.'),
  ('Esper', 'Path of the Stormmind', 'Psychic storms and mental area attacks.'),
  ('Esper', 'Path of the Telepath', 'Mind reading and mental communication.'),
  ('Esper', 'Path of the Voidmind', 'Accessing the void for dark psychic power.'),

  -- Healer paths
  ('Healer', 'Path of the Battle Medic', 'Combat healing while fighting.'),
  ('Healer', 'Path of the Covenant Voice', 'Divine healing through sacred words.'),
  ('Healer', 'Path of the Gravewarden', 'Death-touched healing and resurrection.'),
  ('Healer', 'Path of the Lifespring', 'Pure life energy and regeneration.'),
  ('Healer', 'Path of the Shieldbound', 'Protective healing and barriers.'),
  ('Healer', 'Path of the System Medic', 'Using System interface for healing.'),

  -- Herald paths
  ('Herald', 'Path of the Banner Vanguard', 'Leading from the front with inspiring presence.'),
  ('Herald', 'Path of the Ciphersong', 'Encoded messages and secret communications.'),
  ('Herald', 'Path of the Dawn Chorus', 'Light-based inspiration and hope.'),
  ('Herald', 'Path of the Dirge Keeper', 'Dark inspiration through fear and dread.'),
  ('Herald', 'Path of the Silver Tongue', 'Persuasion and diplomatic manipulation.'),
  ('Herald', 'Path of the War Drummer', 'Rhythm-based combat enhancement.'),

  -- Holy Knight paths
  ('Holy Knight', 'Path of the Iron Banner', 'Unyielding faith and martial discipline.'),
  ('Holy Knight', 'Path of the Oathbreaker', 'Fallen knights wielding dark power.'),
  ('Holy Knight', 'Path of the Radiant Shield', 'Divine protection and light barriers.'),
  ('Holy Knight', 'Path of the Redeemer', 'Seeking redemption through righteous combat.'),
  ('Holy Knight', 'Path of the Sanctifier', 'Purifying corruption and evil.'),
  ('Holy Knight', 'Path of the Vengeful Flame', 'Holy fire and divine retribution.'),

  -- Mage paths
  ('Mage', 'Path of the Battlecaster', 'Combat-focused spell warfare.'),
  ('Mage', 'Path of the Chronomancer', 'Time manipulation magic.'),
  ('Mage', 'Path of the Elementalist', 'Mastery over elemental forces.'),
  ('Mage', 'Path of the Illusionist', 'Deception and illusion magic.'),
  ('Mage', 'Path of the Rift Summoner', 'Opening portals and summoning.'),
  ('Mage', 'Path of the Void Scholar', 'Studying and wielding void magic.'),

  -- Ranger paths
  ('Ranger', 'Path of the Beast Warden', 'Animal companions and beast mastery.'),
  ('Ranger', 'Path of the Gate Hunter', 'Specialized Gate tracking and hunting.'),
  ('Ranger', 'Path of the Shadow Trail', 'Stealth tracking and ambush tactics.'),
  ('Ranger', 'Path of the Storm Archer', 'Lightning-infused ranged combat.'),
  ('Ranger', 'Path of the Verdant Sentinel', 'Nature magic and plant manipulation.'),
  ('Ranger', 'Path of the Wildrunner', 'Speed and mobility through terrain.'),

  -- Striker paths
  ('Striker', 'Path of the Blitz Raider', 'Lightning-fast hit and run tactics.'),
  ('Striker', 'Path of the Deadeye', 'Precision targeting and critical hits.'),
  ('Striker', 'Path of the Executioner', 'Finishing wounded enemies efficiently.'),
  ('Striker', 'Path of the Ghost Blade', 'Phasing attacks and intangibility.'),
  ('Striker', 'Path of the Pressure Duelist', 'One-on-one combat dominance.'),
  ('Striker', 'Path of the Shockstep Adept', 'Movement-based combat techniques.'),

  -- Techsmith paths
  ('Techsmith', 'Path of the Arc Reactor', 'Energy generation and power systems.'),
  ('Techsmith', 'Path of the Drone Commander', 'Controlling swarms of drones.'),
  ('Techsmith', 'Path of the Field Medic', 'Medical technology and healing devices.'),
  ('Techsmith', 'Path of the Ghost Protocol', 'Stealth technology and invisibility.'),
  ('Techsmith', 'Path of the Relic Smith', 'Crafting and enhancing magical items.'),
  ('Techsmith', 'Path of the Siege Engineer', 'Heavy weapons and fortifications.'),

  -- Vanguard paths
  ('Vanguard', 'Path of the Bastion', 'Immovable defensive positioning.'),
  ('Vanguard', 'Path of the Battle Captain', 'Tactical leadership and commands.'),
  ('Vanguard', 'Path of the Iron Guard', 'Heavy armor and damage reduction.'),
  ('Vanguard', 'Path of the Mobile Ward', 'Moving protection for allies.'),
  ('Vanguard', 'Path of the Sentinel', 'Watchful guardian and reactions.'),
  ('Vanguard', 'Path of the Shieldwall', 'Group defensive formations.'),

  -- Warden paths
  ('Warden', 'Path of the Frost Ring', 'Ice barriers and cold zones.'),
  ('Warden', 'Path of the Iron Bastion', 'Metal barriers and magnetic fields.'),
  ('Warden', 'Path of the Stonewall', 'Earth and stone fortifications.'),
  ('Warden', 'Path of the Stormgate', 'Lightning barriers and energy fields.'),
  ('Warden', 'Path of the Verdant Lock', 'Plant-based barriers and entanglement.'),
  ('Warden', 'Path of the Void Fence', 'Void energy barriers and nullification.')
)
INSERT INTO compendium_job_paths (job_id, name, description)
SELECT j.id, p.name, p.description
FROM paths p
JOIN compendium_jobs j ON j.name = p.job_name
ON CONFLICT (job_id, name) DO NOTHING;
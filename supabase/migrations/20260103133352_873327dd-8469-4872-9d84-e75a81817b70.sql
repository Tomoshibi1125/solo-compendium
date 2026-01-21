-- =============================================
-- CREATE SKILLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.compendium_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  ability TEXT NOT NULL, -- STR, AGI, VIT, INT, SENSE, PRE
  description TEXT NOT NULL,
  examples TEXT[],
  source_book TEXT DEFAULT 'SRD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.compendium_skills ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'compendium_skills'
      AND policyname = 'Compendium skills are publicly readable'
  ) THEN
    CREATE POLICY "Compendium skills are publicly readable" 
    ON public.compendium_skills 
    FOR SELECT 
    USING (true);
  END IF;
END $$;
-- Insert all 18 skills adapted to System Ascendant
INSERT INTO compendium_skills (name, ability, description, examples, source_book) VALUES
-- Strength Skills
('Athletics', 'STR', 'Your Strength (Athletics) check covers difficult situations you encounter while climbing, jumping, or swimming. Examples include scaling a Rift wall, leaping across a chasm, or swimming against a strong current.', ARRAY['Climbing a sheer or slippery cliff', 'Avoiding hazards while scaling a wall', 'Clinging to a surface while something is trying to knock you off', 'Trying to jump an unusually long distance', 'Struggling to swim against a powerful current'], 'SRD'),

-- Agility Skills
('Acrobatics', 'AGI', 'Your Agility (Acrobatics) check covers your attempt to stay on your feet in a tricky situation, such as when you''re trying to run across a sheet of ice, balance on a tightrope, or stay upright on a rocking surface.', ARRAY['Staying on your feet in difficult terrain', 'Landing safely after a fall', 'Performing a diving roll', 'Running across a crumbling bridge'], 'SRD'),
('Sleight of Hand', 'AGI', 'Whenever you attempt an act of legerdemain or manual trickery, such as planting something on someone or concealing an object on your person, make an Agility (Sleight of Hand) check.', ARRAY['Picking a pocket', 'Planting a tracking device', 'Palming a small object', 'Cheating at a game of chance'], 'SRD'),
('Stealth', 'AGI', 'Make an Agility (Stealth) check when you attempt to conceal yourself from enemies, slink past guards, slip away without being noticed, or sneak up on someone without being seen or heard.', ARRAY['Hiding in shadows during a Rift raid', 'Moving silently past monsters', 'Evading security systems', 'Tailing a target unnoticed'], 'SRD'),

-- Intellect Skills
('Arcana', 'INT', 'Your Intellect (Arcana) check measures your ability to recall lore about powers, relics, magical symbols, and Rift phenomena. In System Ascendant, this also covers knowledge about the System.', ARRAY['Identifying magical effects', 'Understanding Rift phenomena', 'Deciphering System messages', 'Recognizing relic properties'], 'SRD'),
('History', 'INT', 'Your Intellect (History) check measures your ability to recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, and lost civilizations.', ARRAY['Recalling Rift outbreak history', 'Knowing famous ascendant achievements', 'Understanding guild politics', 'Remembering Monarch lore'], 'SRD'),
('Investigation', 'INT', 'When you look around for clues and make deductions based on those clues, you make an Intellect (Investigation) check. You might deduce the location of a hidden object or determine what kind of weapon dealt a wound.', ARRAY['Analyzing a crime scene', 'Finding hidden compartments', 'Determining cause of death', 'Locating Rift cores'], 'SRD'),
('Nature', 'INT', 'Your Intellect (Nature) check measures your ability to recall lore about terrain, plants, animals, and weather. In Rifts, this extends to understanding the ecosystem of Rift realms.', ARRAY['Identifying Rift flora and fauna', 'Predicting weather patterns', 'Understanding animal behavior', 'Recognizing natural hazards'], 'SRD'),
('Religion', 'INT', 'Your Intellect (Religion) check measures your ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults.', ARRAY['Understanding Monarch worship', 'Recognizing cult symbols', 'Knowing about divine entities', 'Identifying religious artifacts'], 'SRD'),

-- Sense Skills  
('Animal Handling', 'SENSE', 'When there is any question whether you can calm down a domesticated animal, keep a mount from getting spooked, or intuit an animal''s intentions, the DM might call for a Sense (Animal Handling) check.', ARRAY['Calming a frightened mount', 'Training a beast companion', 'Reading animal body language', 'Controlling summoned creatures'], 'SRD'),
('Insight', 'SENSE', 'Your Sense (Insight) check decides whether you can determine the true intentions of a creature, such as when searching out a lie or predicting someone''s next move.', ARRAY['Detecting lies', 'Reading body language', 'Anticipating enemy tactics', 'Understanding hidden motives'], 'SRD'),
('Medicine', 'SENSE', 'A Sense (Medicine) check lets you try to stabilize a dying companion or diagnose an illness. In System Ascendant, this also covers treating mana-related conditions.', ARRAY['Stabilizing a dying ascendant', 'Diagnosing mana poisoning', 'Treating Rift-inflicted wounds', 'Identifying diseases'], 'SRD'),
('Perception', 'SENSE', 'Your Sense (Perception) check lets you spot, hear, or otherwise detect the presence of something. It measures your general awareness of your surroundings and the keenness of your senses.', ARRAY['Spotting hidden enemies', 'Hearing approaching monsters', 'Noticing traps', 'Detecting ambushes'], 'SRD'),
('Survival', 'SENSE', 'The DM might ask you to make a Sense (Survival) check to follow tracks, hunt wild game, guide your group through frozen wastelands, identify signs that owlbears live nearby, or navigate through a Rift.', ARRAY['Tracking creatures', 'Navigating Rifts', 'Finding food and water', 'Predicting weather', 'Identifying monster signs'], 'SRD'),

-- Presence Skills
('Deception', 'PRE', 'Your Presence (Deception) check determines whether you can convincingly hide the truth, either verbally or through your actions. This includes misleading others through ambiguity or telling outright lies.', ARRAY['Fast-talking guards', 'Creating false identities', 'Maintaining a poker face', 'Covering your tracks'], 'SRD'),
('Intimidation', 'PRE', 'When you attempt to influence someone through overt threats, hostile actions, and physical violence, the DM might ask you to make a Presence (Intimidation) check.', ARRAY['Threatening enemies for information', 'Scaring off weaker foes', 'Establishing dominance', 'Breaking enemy morale'], 'SRD'),
('Performance', 'PRE', 'Your Presence (Performance) check determines how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment.', ARRAY['Public speaking', 'Entertaining crowds', 'Inspiring allies', 'Creating distractions'], 'SRD'),
('Persuasion', 'PRE', 'When you attempt to influence someone or a group of people with tact, social graces, or good nature, the DM might ask you to make a Presence (Persuasion) check.', ARRAY['Negotiating contracts', 'Convincing officials', 'Building alliances', 'Bargaining for better rates'], 'SRD')
ON CONFLICT DO NOTHING;
-- =============================================
-- CREATE EQUIPMENT TABLE (Standard gear, weapons, armor)
-- =============================================
CREATE TABLE IF NOT EXISTS public.compendium_equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  equipment_type TEXT NOT NULL, -- weapon, armor, gear, tool, consumable
  cost_credits INTEGER,
  weight NUMERIC,
  properties TEXT[],
  damage TEXT,
  damage_type TEXT,
  armor_class INTEGER,
  description TEXT,
  source_book TEXT DEFAULT 'SRD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.compendium_equipment ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'compendium_equipment'
      AND policyname = 'Compendium equipment is publicly readable'
  ) THEN
    CREATE POLICY "Compendium equipment is publicly readable" 
    ON public.compendium_equipment 
    FOR SELECT 
    USING (true);
  END IF;
END $$;
-- Insert weapons
INSERT INTO compendium_equipment (name, equipment_type, cost_credits, weight, properties, damage, damage_type, description, source_book) VALUES
-- Simple Melee Weapons
('Combat Knife', 'weapon', 200, 1, ARRAY['Finesse', 'Light', 'Thrown (20/60)'], '1d4', 'piercing', 'A standard-issue combat knife used by ascendants for close-quarters combat.', 'SRD'),
('Club', 'weapon', 10, 2, ARRAY['Light'], '1d4', 'bludgeoning', 'A simple wooden or metal club.', 'SRD'),
('Greatclub', 'weapon', 20, 10, ARRAY['Two-Handed'], '1d8', 'bludgeoning', 'A large, heavy club requiring two hands to wield effectively.', 'SRD'),
('Handaxe', 'weapon', 500, 2, ARRAY['Light', 'Thrown (20/60)'], '1d6', 'slashing', 'A small axe designed for one-handed use and throwing.', 'SRD'),
('Javelin', 'weapon', 50, 2, ARRAY['Thrown (30/120)'], '1d6', 'piercing', 'A light spear designed primarily for throwing.', 'SRD'),
('Light Hammer', 'weapon', 200, 2, ARRAY['Light', 'Thrown (20/60)'], '1d4', 'bludgeoning', 'A small hammer useful for both combat and utility work.', 'SRD'),
('Mace', 'weapon', 500, 4, NULL, '1d6', 'bludgeoning', 'A metal club with a flanged or spiked head.', 'SRD'),
('Quarterstaff', 'weapon', 20, 4, ARRAY['Versatile (1d8)'], '1d6', 'bludgeoning', 'A simple wooden staff that can be used with one or two hands.', 'SRD'),
('Sickle', 'weapon', 100, 2, ARRAY['Light'], '1d4', 'slashing', 'A curved blade traditionally used for farming but effective in combat.', 'SRD'),
('Spear', 'weapon', 100, 3, ARRAY['Thrown (20/60)', 'Versatile (1d8)'], '1d6', 'piercing', 'A shaft with a pointed metal head, versatile for melee and ranged combat.', 'SRD'),

-- Simple Ranged Weapons
('Crossbow, Light', 'weapon', 2500, 5, ARRAY['Ammunition (80/320)', 'Loading', 'Two-Handed'], '1d8', 'piercing', 'A mechanical bow that fires bolts, easy to operate.', 'SRD'),
('Shortbow', 'weapon', 2500, 2, ARRAY['Ammunition (80/320)', 'Two-Handed'], '1d6', 'piercing', 'A compact bow suitable for medium-range combat.', 'SRD'),
('Sling', 'weapon', 10, 0, ARRAY['Ammunition (30/120)'], '1d4', 'bludgeoning', 'A simple projectile weapon using stones or bullets.', 'SRD'),

-- Martial Melee Weapons
('Battleaxe', 'weapon', 1000, 4, ARRAY['Versatile (1d10)'], '1d8', 'slashing', 'A heavy axe designed for combat, usable one or two-handed.', 'SRD'),
('Flail', 'weapon', 1000, 2, NULL, '1d8', 'bludgeoning', 'A spiked ball attached to a handle by a chain.', 'SRD'),
('Glaive', 'weapon', 2000, 6, ARRAY['Heavy', 'Reach', 'Two-Handed'], '1d10', 'slashing', 'A pole weapon with a large blade at the end.', 'SRD'),
('Greataxe', 'weapon', 3000, 7, ARRAY['Heavy', 'Two-Handed'], '1d12', 'slashing', 'A massive two-handed axe favored by Destroyers.', 'SRD'),
('Greatsword', 'weapon', 5000, 6, ARRAY['Heavy', 'Two-Handed'], '2d6', 'slashing', 'A large two-handed sword requiring significant strength to wield.', 'SRD'),
('Halberd', 'weapon', 2000, 6, ARRAY['Heavy', 'Reach', 'Two-Handed'], '1d10', 'slashing', 'A versatile pole weapon combining axe and spear.', 'SRD'),
('Lance', 'weapon', 1000, 6, ARRAY['Reach', 'Special'], '1d12', 'piercing', 'A long weapon designed for mounted combat.', 'SRD'),
('Longsword', 'weapon', 1500, 3, ARRAY['Versatile (1d10)'], '1d8', 'slashing', 'The standard weapon of many ascendants, balanced and reliable.', 'SRD'),
('Maul', 'weapon', 1000, 10, ARRAY['Heavy', 'Two-Handed'], '2d6', 'bludgeoning', 'A massive hammer that crushes armor and bone.', 'SRD'),
('Morningstar', 'weapon', 1500, 4, NULL, '1d8', 'piercing', 'A mace with a spiked head for piercing armor.', 'SRD'),
('Pike', 'weapon', 500, 18, ARRAY['Heavy', 'Reach', 'Two-Handed'], '1d10', 'piercing', 'An extremely long spear used for keeping enemies at bay.', 'SRD'),
('Rapier', 'weapon', 2500, 2, ARRAY['Finesse'], '1d8', 'piercing', 'A thin, agile blade favored by Assassins and duelists.', 'SRD'),
('Scimitar', 'weapon', 2500, 3, ARRAY['Finesse', 'Light'], '1d6', 'slashing', 'A curved blade designed for swift, sweeping cuts.', 'SRD'),
('Shortsword', 'weapon', 1000, 2, ARRAY['Finesse', 'Light'], '1d6', 'piercing', 'A short blade ideal for dual-wielding and quick strikes.', 'SRD'),
('Trident', 'weapon', 500, 4, ARRAY['Thrown (20/60)', 'Versatile (1d8)'], '1d6', 'piercing', 'A three-pronged spear effective in melee and at range.', 'SRD'),
('War Pick', 'weapon', 500, 2, NULL, '1d8', 'piercing', 'A military pick designed to penetrate armor.', 'SRD'),
('Warhammer', 'weapon', 1500, 2, ARRAY['Versatile (1d10)'], '1d8', 'bludgeoning', 'A hammer designed for war, effective against armored foes.', 'SRD'),
('Whip', 'weapon', 200, 3, ARRAY['Finesse', 'Reach'], '1d4', 'slashing', 'A flexible weapon with extended reach.', 'SRD'),

-- Martial Ranged Weapons
('Crossbow, Hand', 'weapon', 7500, 3, ARRAY['Ammunition (30/120)', 'Light', 'Loading'], '1d6', 'piercing', 'A compact crossbow that can be fired with one hand.', 'SRD'),
('Crossbow, Heavy', 'weapon', 5000, 18, ARRAY['Ammunition (100/400)', 'Heavy', 'Loading', 'Two-Handed'], '1d10', 'piercing', 'A powerful crossbow with exceptional range and damage.', 'SRD'),
('Longbow', 'weapon', 5000, 2, ARRAY['Ammunition (150/600)', 'Heavy', 'Two-Handed'], '1d8', 'piercing', 'A large bow with impressive range, favored by Rangers.', 'SRD'),
('Net', 'weapon', 100, 3, ARRAY['Special', 'Thrown (5/15)'], NULL, NULL, 'A mesh used to restrain enemies rather than damage them.', 'SRD'),

-- Modern Weapons (System Ascendant additions)
('Combat Pistol', 'weapon', 15000, 3, ARRAY['Ammunition (50/150)', 'Light', 'Loading'], '2d6', 'piercing', 'A modern sidearm effective against low-rank monsters.', 'SL'),
('Assault Rifle', 'weapon', 50000, 8, ARRAY['Ammunition (100/400)', 'Two-Handed', 'Burst Fire'], '2d8', 'piercing', 'Military-grade automatic rifle used by ascendant support teams.', 'SL'),
('Mana-Infused Blade', 'weapon', 100000, 3, ARRAY['Finesse', 'Magic'], '1d8+2', 'force', 'A blade enhanced with crystallized mana, effective against magical creatures.', 'SL')
ON CONFLICT DO NOTHING;
-- Insert armor
INSERT INTO compendium_equipment (name, equipment_type, cost_credits, weight, properties, armor_class, description, source_book) VALUES
-- Light Armor
('Padded Armor', 'armor', 500, 8, ARRAY['Disadvantage on Stealth'], 11, 'Quilted layers of cloth and batting, offering minimal protection.', 'SRD'),
('Leather Armor', 'armor', 1000, 10, NULL, 11, 'Soft, supple leather armor that doesn''t impede movement.', 'SRD'),
('Studded Leather', 'armor', 4500, 13, NULL, 12, 'Leather armor reinforced with metal studs for added protection.', 'SRD'),
('Ascendant''s Vest', 'armor', 10000, 6, NULL, 12, 'Lightweight tactical vest worn by modern ascendants, includes utility pouches.', 'SL'),

-- Medium Armor
('Hide Armor', 'armor', 1000, 12, NULL, 12, 'Crude armor made from thick hides, often from Rift creatures.', 'SRD'),
('Chain Shirt', 'armor', 5000, 20, NULL, 13, 'A shirt of interlocking metal rings worn under clothes.', 'SRD'),
('Scale Mail', 'armor', 5000, 45, ARRAY['Disadvantage on Stealth'], 14, 'Overlapping metal scales like fish or dragon hide.', 'SRD'),
('Breastplate', 'armor', 40000, 20, NULL, 14, 'A fitted metal chest piece that leaves limbs free.', 'SRD'),
('Half Plate', 'armor', 75000, 40, ARRAY['Disadvantage on Stealth'], 15, 'Shaped metal plates covering vital areas with chain underneath.', 'SRD'),
('Tactical Armor', 'armor', 50000, 15, NULL, 14, 'Modern body armor designed for ascendant operations. Includes trauma plates.', 'SL'),

-- Heavy Armor
('Ring Mail', 'armor', 3000, 40, ARRAY['Disadvantage on Stealth'], 14, 'Leather armor with heavy rings sewn into it.', 'SRD'),
('Chain Mail', 'armor', 7500, 55, ARRAY['Disadvantage on Stealth', 'Str 13'], 16, 'Full-body armor made of interlocking metal rings.', 'SRD'),
('Splint Armor', 'armor', 20000, 60, ARRAY['Disadvantage on Stealth', 'Str 15'], 17, 'Metal strips riveted to a leather backing.', 'SRD'),
('Plate Armor', 'armor', 150000, 65, ARRAY['Disadvantage on Stealth', 'Str 15'], 18, 'Full plate armor offering maximum protection.', 'SRD'),
('Powered Armor', 'armor', 500000, 35, ARRAY['Str 15', 'Powered'], 18, 'Advanced armor with servo-motors to assist movement. Used by elite ascendants.', 'SL'),

-- Shields
('Shield', 'armor', 1000, 6, NULL, 2, 'A standard shield adding +2 to AC when wielded.', 'SRD'),
('Tower Shield', 'armor', 3000, 15, ARRAY['Heavy'], 3, 'A massive shield offering superior protection but limiting mobility.', 'SL')
ON CONFLICT DO NOTHING;


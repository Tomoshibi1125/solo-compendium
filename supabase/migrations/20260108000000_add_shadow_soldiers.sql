-- Create Umbral Legion compendium tables
-- Umbral Legion are the Umbral Monarch's summoned army

-- Umbral Legion main table (aligned with character sheet usage)
CREATE TABLE IF NOT EXISTS public.compendium_shadow_soldiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  rank TEXT NOT NULL,
  description TEXT NOT NULL,
  lore TEXT,
  str INTEGER NOT NULL DEFAULT 10,
  agi INTEGER NOT NULL DEFAULT 10,
  vit INTEGER NOT NULL DEFAULT 10,
  int INTEGER NOT NULL DEFAULT 10,
  sense INTEGER NOT NULL DEFAULT 10,
  pre INTEGER NOT NULL DEFAULT 10,
  armor_class INTEGER NOT NULL DEFAULT 14,
  hit_points INTEGER NOT NULL DEFAULT 50,
  speed INTEGER NOT NULL DEFAULT 30,
  damage_immunities TEXT[] DEFAULT '{}',
  condition_immunities TEXT[] DEFAULT '{}',
  abilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  summon_requirements TEXT,
  shadow_type TEXT NOT NULL DEFAULT 'soldier',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Umbral Legionnaire Traits
CREATE TABLE IF NOT EXISTS public.compendium_shadow_soldier_traits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shadow_soldier_id UUID NOT NULL REFERENCES public.compendium_shadow_soldiers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Umbral Legionnaire Actions
CREATE TABLE IF NOT EXISTS public.compendium_shadow_soldier_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shadow_soldier_id UUID NOT NULL REFERENCES public.compendium_shadow_soldiers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  action_type TEXT NOT NULL DEFAULT 'action',
  attack_bonus INTEGER,
  damage TEXT,
  damage_type TEXT,
  recharge TEXT,
  legendary_cost INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Umbral Legionnaire Abilities (special powers)
CREATE TABLE IF NOT EXISTS public.compendium_shadow_soldier_abilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shadow_soldier_id UUID NOT NULL REFERENCES public.compendium_shadow_soldiers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  ability_type TEXT NOT NULL DEFAULT 'passive', -- passive, active, reaction, bonus
  uses_per_day INTEGER,
  recharge TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.compendium_shadow_soldiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_shadow_soldier_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_shadow_soldier_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compendium_shadow_soldier_abilities ENABLE ROW LEVEL SECURITY;
-- Public read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'compendium_shadow_soldiers'
      AND policyname = 'Umbral Legion are publicly readable'
  ) THEN
    CREATE POLICY "Umbral Legion are publicly readable"
      ON public.compendium_shadow_soldiers
      FOR SELECT
      USING (true);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'compendium_shadow_soldier_traits'
      AND policyname = 'Umbral Legionnaire traits are publicly readable'
  ) THEN
    CREATE POLICY "Umbral Legionnaire traits are publicly readable"
      ON public.compendium_shadow_soldier_traits
      FOR SELECT
      USING (true);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'compendium_shadow_soldier_actions'
      AND policyname = 'Umbral Legionnaire actions are publicly readable'
  ) THEN
    CREATE POLICY "Umbral Legionnaire actions are publicly readable"
      ON public.compendium_shadow_soldier_actions
      FOR SELECT
      USING (true);
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'compendium_shadow_soldier_abilities'
      AND policyname = 'Umbral Legionnaire abilities are publicly readable'
  ) THEN
    CREATE POLICY "Umbral Legionnaire abilities are publicly readable"
      ON public.compendium_shadow_soldier_abilities
      FOR SELECT
      USING (true);
  END IF;
END $$;
-- Indexes
CREATE INDEX IF NOT EXISTS idx_shadow_soldiers_rank ON public.compendium_shadow_soldiers(rank);
CREATE INDEX IF NOT EXISTS idx_shadow_soldiers_type ON public.compendium_shadow_soldiers(shadow_type);
CREATE INDEX IF NOT EXISTS idx_shadow_soldiers_name ON public.compendium_shadow_soldiers(name);
CREATE INDEX IF NOT EXISTS idx_shadow_soldiers_search ON public.compendium_shadow_soldiers USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(lore, '')));
-- Insert Umbral Legion Roster
-- Based on System Ascendant's Umbral Monarch's army

-- Umbral Legionnaire roster (schema aligned with compendium_shadow_soldiers)
INSERT INTO public.compendium_shadow_soldiers (
  name, title, rank, description, lore, str, agi, vit, int, sense, pre,
  armor_class, hit_points, speed, damage_immunities, condition_immunities,
  abilities, shadow_type, summon_requirements
) VALUES
(
  'Umbral Legionnaire',
  'Basic Shadow',
  'Soldier Grade',
  'A basic Umbral Legionnaire summoned from the Umbral Monarch''s domain. These are the most common soldiers in the Umbral Legion, serving as the backbone of the undead forces.',
  'Umbral Legion are the first shadows that the Umbral Monarch can summon. They are created from the souls of defeated enemies, bound to serve their master for eternity. Though individually weak, they fight with unwavering loyalty and can overwhelm enemies through sheer numbers.',
  12, 14, 13, 6, 10, 8,
  13, 7, 30,
  ARRAY['necrotic', 'poison'],
  ARRAY['charmed', 'frightened'],
  '[{"name":"Shadow Strike","description":"Melee Weapon Attack: +4 to hit, reach 5 ft. Hit: 1d6+2 slashing damage plus 1d4 necrotic damage.","action_type":"action"},{"name":"Unyielding Obedience","description":"The Umbral Legionnaire has advantage on saving throws against being turned or banished.","action_type":"passive"}]'::jsonb,
  'soldier',
  'Umbral Monarch unlock + Shadow-themed Sovereign + Level 1+'
),
(
  'Shadow Knight',
  'Shadow Knight',
  'Knight Grade',
  'A more powerful Umbral Legionnaire, clad in dark armor and wielding shadow-forged weapons. Shadow Knights serve as commanders among the basic shadows.',
  'Shadow Knights are the elite warriors of the Umbral Legion. They retain more of their combat prowess from life, making them formidable fighters. Their armor is forged from shadow energy itself, providing superior protection.',
  16, 14, 16, 10, 12, 14,
  16, 45, 30,
  ARRAY['necrotic', 'poison'],
  ARRAY['charmed', 'frightened'],
  '[{"name":"Shadow Blade","description":"Melee Weapon Attack: +6 to hit, reach 10 ft. Hit: 2d8+4 slashing damage plus 1d6 necrotic damage.","action_type":"action"},{"name":"Command Presence","description":"Allied Umbral Legion within 30 feet gain +2 to attack rolls.","action_type":"passive"}]'::jsonb,
  'knight',
  'Umbral Monarch unlock + Shadow-themed Sovereign + Level 3+'
),
(
  'Shadow Marshal',
  'Shadow Marshal',
  'Elite Knight Grade',
  'A high-ranking shadow officer capable of commanding other shadows. Shadow Marshals are powerful enough to lead entire battalions of Umbral Legion.',
  'Shadow Marshals are the generals of the Umbral Legion. They possess tactical knowledge and can coordinate multiple shadow units in battle. Their presence on the battlefield significantly increases the effectiveness of nearby shadows.',
  18, 16, 18, 12, 14, 16,
  17, 78, 30,
  ARRAY['necrotic', 'poison'],
  ARRAY['charmed', 'frightened'],
  '[{"name":"Tactical Command","description":"As a bonus action, the shadow marshal can command up to three Umbral Legion within 60 feet to immediately make one attack.","action_type":"bonus-action"},{"name":"Shadow Aura","description":"Allied shadows within 30 feet gain resistance to radiant damage.","action_type":"passive"}]'::jsonb,
  'knight',
  'Umbral Monarch unlock + Shadow-themed Sovereign + Level 7+'
),
(
  'Kaisel',
  'Shadow Dragon',
  'General Grade',
  'A dragon-like shadow, one of the Umbral Monarch''s most powerful named shadows. Kaisel combines the power of a dragon with shadow energy, capable of devastating area attacks and aerial dominance.',
  'Kaisel represents the pinnacle of shadow summoning. This dragon shadow retains the majesty and power of its draconic nature while gaining the benefits of shadow transformation. Kaisel can rain down shadow fire and dominate the skies, making it a force of destruction on the battlefield.',
  22, 18, 22, 14, 16, 18,
  19, 200, 80,
  ARRAY['necrotic', 'poison'],
  ARRAY['charmed', 'frightened', 'exhaustion'],
  '[{"name":"Shadow Flame","description":"Kaisel exhales shadow fire in a 60-foot cone. Creatures in the area make a DC 18 Agility save, taking 6d10 fire damage plus 3d10 necrotic damage on a failure, or half on a success.","action_type":"action"},{"name":"Aerial Dominance","description":"Kaisel has advantage on attack rolls against creatures that cannot fly.","action_type":"passive"}]'::jsonb,
  'dragon',
  'Umbral Monarch unlock + Shadow-themed Sovereign + Level 15+'
);
-- Add traits for each Umbral Legionnaire
-- Umbral Legionnaire traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'The Umbral Legionnaire is immune to being charmed, frightened, or exhausted. It does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Umbral Legionnaire';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Undead Fortitude', 'If damage reduces the Umbral Legionnaire to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the Umbral Legionnaire drops to 1 hit point instead.'
FROM public.compendium_shadow_soldiers WHERE name = 'Umbral Legionnaire';
-- Shadow Knight traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'The shadow knight is immune to being charmed, frightened, or exhausted. It does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Knight';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Armor', 'The shadow knight''s armor is forged from shadow energy, providing resistance to non-magical bludgeoning, piercing, and slashing damage.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Knight';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Command Presence', 'Other Umbral Legion within 30 feet of the shadow knight have advantage on attack rolls.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Knight';
-- Shadow Marshal traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'The shadow marshal is immune to being charmed, frightened, or exhausted. It does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Marshal';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Tactical Command', 'As a bonus action, the shadow marshal can command up to three Umbral Legion within 60 feet. Each commanded shadow can immediately make one weapon attack.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Marshal';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Aura', 'Umbral Legion within 30 feet of the shadow marshal have resistance to radiant damage.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Marshal';
-- Crimson Knight traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'Crimson Knight is immune to being charmed, frightened, or exhausted. He does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Crimson Knight';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Master Swordsman', 'Crimson Knight has advantage on all melee weapon attacks. When he hits with a melee weapon attack, he can make an additional attack as a bonus action.'
FROM public.compendium_shadow_soldiers WHERE name = 'Crimson Knight';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Blade', 'Crimson Knight''s greatsword is forged from pure shadow energy. It deals an additional 1d8 necrotic damage on a hit.'
FROM public.compendium_shadow_soldiers WHERE name = 'Crimson Knight';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Army Commander', 'All Umbral Legion within 120 feet of Crimson Knight have advantage on saving throws and add Crimson Knight''s proficiency bonus to their attack rolls.'
FROM public.compendium_shadow_soldiers WHERE name = 'Crimson Knight';
-- Gilded Reaper traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'Gilded Reaper is immune to being charmed, frightened, or exhausted. He does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Gilded Reaper';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Massive Frame', 'Gilded Reaper''s size and strength allow him to grapple creatures up to Huge size. He has advantage on Strength checks and saving throws.'
FROM public.compendium_shadow_soldiers WHERE name = 'Gilded Reaper';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Crushing Mandibles', 'When Gilded Reaper hits a creature with his bite attack, the target must succeed on a Strength saving throw (DC 18) or be grappled. While grappled, the target takes 2d6 bludgeoning damage at the start of each of Gilded Reaper''s turns.'
FROM public.compendium_shadow_soldiers WHERE name = 'Gilded Reaper';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Flight', 'Gilded Reaper can hover and move through the air with shadow energy. His flight speed is 60 feet.'
FROM public.compendium_shadow_soldiers WHERE name = 'Gilded Reaper';
-- Tank traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'Tank is immune to being charmed, frightened, or exhausted. He does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Tank';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Unbreakable', 'Tank has resistance to all damage except radiant damage. When Tank takes damage, he can use his reaction to reduce the damage by 1d10 + his Constitution modifier.'
FROM public.compendium_shadow_soldiers WHERE name = 'Tank';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Guardian Stance', 'As a bonus action, Tank can enter a defensive stance. While in this stance, Tank has +2 AC and all allies within 10 feet have half cover.'
FROM public.compendium_shadow_soldiers WHERE name = 'Tank';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Massive Presence', 'Creatures within 15 feet of Tank have disadvantage on attack rolls against targets other than Tank.'
FROM public.compendium_shadow_soldiers WHERE name = 'Tank';
-- Kaisel traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'Kaisel is immune to being charmed, frightened, or exhausted. He does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Legendary Resistance (3/Day)', 'If Kaisel fails a saving throw, he can choose to succeed instead.'
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Dragon', 'Kaisel has immunity to necrotic damage and resistance to all other damage types except radiant damage.'
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
-- Add actions for each Umbral Legionnaire
-- Umbral Legionnaire actions
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Shadow Blade', 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage plus 3 (1d6) necrotic damage.', 'action', 4, '1d6 + 2 slashing plus 1d6 necrotic', 'slashing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Umbral Legionnaire';
-- Shadow Knight actions
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Shadow Greatsword', 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage plus 7 (2d6) necrotic damage.', 'action', 6, '2d6 + 4 slashing plus 2d6 necrotic', 'slashing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Knight';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Multiattack', 'The shadow knight makes two greatsword attacks.', 'action', NULL, NULL, NULL
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Knight';
-- Shadow Marshal actions
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Shadow Blade', 'Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage plus 10 (2d10) necrotic damage.', 'action', 8, '2d8 + 4 slashing plus 2d10 necrotic', 'slashing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Marshal';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Multiattack', 'The shadow marshal makes three blade attacks.', 'action', NULL, NULL, NULL
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Marshal';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, recharge)
SELECT id, 'Shadow Command', 'The shadow marshal issues a command to all Umbral Legion within 60 feet. Each Umbral Legionnaire can immediately use its reaction to make one weapon attack.', 'action', '5-6'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Marshal';
-- Crimson Knight actions
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Shadow Greatsword', 'Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 18 (3d6 + 8) slashing damage plus 9 (2d8) necrotic damage.', 'action', 11, '3d6 + 8 slashing plus 2d8 necrotic', 'slashing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Crimson Knight';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Multiattack', 'Crimson Knight makes four greatsword attacks.', 'action', NULL, NULL, NULL
FROM public.compendium_shadow_soldiers WHERE name = 'Crimson Knight';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, recharge)
SELECT id, 'Shadow Slash', 'Crimson Knight makes a sweeping attack with his greatsword. All creatures within 10 feet must make a Dexterity saving throw (DC 18) or take 21 (6d6) slashing damage plus 14 (4d6) necrotic damage, or half as much on a successful save.', 'action', '5-6'
FROM public.compendium_shadow_soldiers WHERE name = 'Crimson Knight';
-- Gilded Reaper actions
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Bite', 'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 22 (3d10 + 6) piercing damage plus 14 (4d6) necrotic damage. If the target is a Medium or smaller creature, it is grappled (escape DC 18).', 'action', 11, '3d10 + 6 piercing plus 4d6 necrotic', 'piercing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Gilded Reaper';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Claw', 'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 18 (3d6 + 6) slashing damage plus 10 (3d6) necrotic damage.', 'action', 11, '3d6 + 6 slashing plus 3d6 necrotic', 'slashing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Gilded Reaper';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Multiattack', 'Gilded Reaper makes one bite attack and two claw attacks.', 'action', NULL, NULL, NULL
FROM public.compendium_shadow_soldiers WHERE name = 'Gilded Reaper';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, recharge)
SELECT id, 'Shadow Breath', 'Gilded Reaper exhales a 30-foot cone of shadow energy. Each creature in that area must make a Dexterity saving throw (DC 18), taking 35 (10d6) necrotic damage on a failed save, or half as much on a successful one.', 'action', '5-6'
FROM public.compendium_shadow_soldiers WHERE name = 'Gilded Reaper';
-- Tank actions
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Massive Fist', 'Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 21 (3d8 + 7) bludgeoning damage plus 14 (4d6) necrotic damage.', 'action', 12, '3d8 + 7 bludgeoning plus 4d6 necrotic', 'bludgeoning, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Tank';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Multiattack', 'Tank makes two fist attacks.', 'action', NULL, NULL, NULL
FROM public.compendium_shadow_soldiers WHERE name = 'Tank';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, recharge)
SELECT id, 'Ground Slam', 'Tank slams the ground with tremendous force. All creatures within 15 feet must make a Strength saving throw (DC 20) or be knocked prone and take 28 (8d6) bludgeoning damage plus 14 (4d6) necrotic damage, or half as much on a successful save.', 'action', '5-6'
FROM public.compendium_shadow_soldiers WHERE name = 'Tank';
-- Kaisel actions
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Bite', 'Melee Weapon Attack: +12 to hit, reach 15 ft., one target. Hit: 24 (4d8 + 6) piercing damage plus 21 (6d6) necrotic damage.', 'action', 12, '4d8 + 6 piercing plus 6d6 necrotic', 'piercing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Claw', 'Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 20 (3d8 + 6) slashing damage plus 14 (4d6) necrotic damage.', 'action', 12, '3d8 + 6 slashing plus 4d6 necrotic', 'slashing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Tail', 'Melee Weapon Attack: +12 to hit, reach 15 ft., one target. Hit: 18 (2d10 + 6) bludgeoning damage plus 14 (4d6) necrotic damage.', 'action', 12, '2d10 + 6 bludgeoning plus 4d6 necrotic', 'bludgeoning, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Multiattack', 'Kaisel can use his Frightful Presence. He then makes three attacks: one with his bite and two with his claws.', 'action', NULL, NULL, NULL
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, recharge)
SELECT id, 'Shadow Fire Breath', 'Kaisel exhales shadow fire in a 60-foot cone. Each creature in that area must make a Dexterity saving throw (DC 20), taking 56 (16d6) necrotic damage on a failed save, or half as much on a successful one.', 'action', '5-6'
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type)
SELECT id, 'Frightful Presence', 'Each creature of Kaisel''s choice within 120 feet of him and aware of him must succeed on a Wisdom saving throw (DC 18) or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.', 'action'
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
-- Legendary actions for Kaisel
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, legendary_cost)
SELECT id, 'Attack', 'Kaisel makes one claw attack.', 'legendary', 1
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, legendary_cost)
SELECT id, 'Wing Attack (Costs 2 Actions)', 'Kaisel beats his wings. Each creature within 10 feet must succeed on a Dexterity saving throw (DC 20) or take 14 (2d6 + 6) bludgeoning damage and be knocked prone. Kaisel can then fly up to half his flying speed.', 'legendary', 2
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, legendary_cost)
SELECT id, 'Shadow Roar (Costs 3 Actions)', 'Kaisel unleashes a devastating roar. All creatures within 60 feet must make a Constitution saving throw (DC 20) or take 21 (6d6) thunder damage and be deafened for 1 minute.', 'legendary', 3
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
-- Add special abilities
-- Crimson Knight abilities
INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type)
SELECT id, 'Shadow Step', 'As a bonus action, Crimson Knight can teleport up to 30 feet to an unoccupied space he can see. This movement does not provoke opportunity attacks.', 'bonus'
FROM public.compendium_shadow_soldiers WHERE name = 'Crimson Knight';
INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type)
SELECT id, 'Loyalty Beyond Death', 'Crimson Knight will never betray the Umbral Monarch. He has advantage on all saving throws against effects that would control or command him.', 'passive'
FROM public.compendium_shadow_soldiers WHERE name = 'Crimson Knight';
-- Gilded Reaper abilities
INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type)
SELECT id, 'Shadow Regeneration', 'At the start of each of his turns, Gilded Reaper regains 10 hit points if he has at least 1 hit point remaining.', 'passive'
FROM public.compendium_shadow_soldiers WHERE name = 'Gilded Reaper';
INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type, recharge)
SELECT id, 'Shadow Burst', 'As a reaction when Gilded Reaper takes damage, he can release a burst of shadow energy. All creatures within 10 feet must make a Dexterity saving throw (DC 18) or take 14 (4d6) necrotic damage.', 'reaction', '5-6'
FROM public.compendium_shadow_soldiers WHERE name = 'Gilded Reaper';
-- Tank abilities
INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type)
SELECT id, 'Damage Absorption', 'When Tank takes damage, he can use his reaction to reduce the damage by 1d10 + his Constitution modifier (minimum 1).', 'reaction'
FROM public.compendium_shadow_soldiers WHERE name = 'Tank';
INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type)
SELECT id, 'Protective Aura', 'Allies within 15 feet of Tank have resistance to necrotic damage and advantage on death saving throws.', 'passive'
FROM public.compendium_shadow_soldiers WHERE name = 'Tank';
-- Kaisel abilities
INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type)
SELECT id, 'Shadow Flight', 'Kaisel can hover and fly with shadow energy. His flight speed is 80 feet.', 'passive'
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';
INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type)
SELECT id, 'Legendary Resistance', 'If Kaisel fails a saving throw, he can choose to succeed instead. He can use this ability three times per day.', 'passive'
FROM public.compendium_shadow_soldiers WHERE name = 'Kaisel';



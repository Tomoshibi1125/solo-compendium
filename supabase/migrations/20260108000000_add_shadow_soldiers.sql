-- Create Shadow Soldiers compendium tables
-- Shadow Soldiers are the Shadow Monarch's summoned army

-- Shadow Soldiers main table
CREATE TABLE IF NOT EXISTS public.compendium_shadow_soldiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  rank TEXT NOT NULL, -- e.g., "Elite Shadow", "Shadow Knight", "Shadow Marshal"
  tier INTEGER NOT NULL DEFAULT 1, -- 1-5, representing power level
  size TEXT NOT NULL DEFAULT 'medium',
  creature_type TEXT NOT NULL DEFAULT 'undead',
  alignment TEXT DEFAULT 'neutral',
  
  -- Combat stats
  cr TEXT NOT NULL,
  xp INTEGER,
  armor_class INTEGER NOT NULL,
  armor_type TEXT,
  hit_points_average INTEGER NOT NULL,
  hit_points_formula TEXT NOT NULL,
  
  -- Movement
  speed_walk INTEGER DEFAULT 30,
  speed_fly INTEGER,
  speed_swim INTEGER,
  speed_climb INTEGER,
  speed_burrow INTEGER,
  
  -- Ability scores
  str INTEGER NOT NULL DEFAULT 10,
  agi INTEGER NOT NULL DEFAULT 10,
  vit INTEGER NOT NULL DEFAULT 10,
  int INTEGER NOT NULL DEFAULT 10,
  sense INTEGER NOT NULL DEFAULT 10,
  pre INTEGER NOT NULL DEFAULT 10,
  
  -- Proficiencies
  saving_throws JSONB DEFAULT '{}',
  skills JSONB DEFAULT '{}',
  
  -- Defenses
  damage_resistances TEXT[] DEFAULT '{}',
  damage_immunities TEXT[] DEFAULT '{}',
  damage_vulnerabilities TEXT[] DEFAULT '{}',
  condition_immunities TEXT[] DEFAULT '{}',
  
  -- Senses and communication
  senses JSONB DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  
  -- Description and lore
  description TEXT,
  lore TEXT,
  summoning_lore TEXT, -- Special lore about how they're summoned
  
  -- Shadow-specific properties
  shadow_energy INTEGER, -- Shadow energy cost to summon
  max_summoned INTEGER DEFAULT 1, -- Maximum that can be summoned at once
  summoning_requirement TEXT, -- Prerequisites for summoning
  
  -- Metadata
  gate_rank TEXT,
  is_elite BOOLEAN NOT NULL DEFAULT false,
  is_named BOOLEAN NOT NULL DEFAULT false, -- Named shadows like Igris, Beru, etc.
  source_book TEXT DEFAULT 'SL',
  tags TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Shadow Soldier Traits
CREATE TABLE IF NOT EXISTS public.compendium_shadow_soldier_traits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shadow_soldier_id UUID NOT NULL REFERENCES public.compendium_shadow_soldiers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Shadow Soldier Actions
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

-- Shadow Soldier Abilities (special powers)
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
CREATE POLICY "Shadow soldiers are publicly readable" ON public.compendium_shadow_soldiers FOR SELECT USING (true);
CREATE POLICY "Shadow soldier traits are publicly readable" ON public.compendium_shadow_soldier_traits FOR SELECT USING (true);
CREATE POLICY "Shadow soldier actions are publicly readable" ON public.compendium_shadow_soldier_actions FOR SELECT USING (true);
CREATE POLICY "Shadow soldier abilities are publicly readable" ON public.compendium_shadow_soldier_abilities FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_shadow_soldiers_tier ON public.compendium_shadow_soldiers(tier);
CREATE INDEX idx_shadow_soldiers_rank ON public.compendium_shadow_soldiers(rank);
CREATE INDEX idx_shadow_soldiers_cr ON public.compendium_shadow_soldiers(cr);
CREATE INDEX idx_shadow_soldiers_is_named ON public.compendium_shadow_soldiers(is_named);
CREATE INDEX idx_shadow_soldiers_search ON public.compendium_shadow_soldiers USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(lore, '')));

-- Insert Shadow Army Roster
-- Based on Solo Leveling's Shadow Monarch's army

-- Tier 1: Basic Shadows
INSERT INTO public.compendium_shadow_soldiers (
  name, rank, tier, size, creature_type, cr, armor_class, hit_points_average, hit_points_formula,
  speed_walk, str, agi, vit, int, sense, pre,
  description, lore, summoning_lore, shadow_energy, max_summoned,
  gate_rank, is_elite, is_named, tags
) VALUES
(
  'Shadow Soldier',
  'Basic Shadow',
  1,
  'medium',
  'undead',
  '1/4',
  13,
  7,
  '1d8 + 3',
  30,
  12,
  14,
  13,
  6,
  10,
  8,
  'A basic shadow soldier summoned from the Shadow Monarch''s domain. These are the most common soldiers in the Shadow Army, serving as the backbone of the undead forces.',
  'Shadow Soldiers are the first shadows that the Shadow Monarch can summon. They are created from the souls of defeated enemies, bound to serve their master for eternity. Though individually weak, they fight with unwavering loyalty and can overwhelm enemies through sheer numbers.',
  'The Shadow Monarch raises a hand, and dark energy coalesces into a humanoid form. The shadow materializes from the ground, rising like smoke given form. "ARISE," the command echoes, and the shadow soldier stands ready.',
  10,
  10,
  'E',
  false,
  false,
  ARRAY['shadow', 'undead', 'summoned', 'tier-1']
),
(
  'Shadow Knight',
  'Elite Shadow',
  2,
  'medium',
  'undead',
  '3',
  16,
  45,
  '6d8 + 18',
  30,
  16,
  14,
  16,
  10,
  12,
  14,
  'A more powerful shadow soldier, clad in dark armor and wielding shadow-forged weapons. Shadow Knights serve as commanders among the basic shadows.',
  'Shadow Knights are the elite warriors of the Shadow Army. They retain more of their combat prowess from life, making them formidable fighters. Their armor is forged from shadow energy itself, providing superior protection.',
  'Dark energy swirls more intensely as the Shadow Monarch commands, "ARISE." A larger, more imposing figure emerges, clad in shadow armor that seems to drink the light around it.',
  50,
  5,
  'D',
  true,
  false,
  ARRAY['shadow', 'undead', 'summoned', 'tier-2', 'elite']
),
(
  'Shadow Marshal',
  'High Shadow',
  3,
  'medium',
  'undead',
  '5',
  17,
  78,
  '12d8 + 24',
  30,
  18,
  16,
  18,
  12,
  14,
  16,
  'A high-ranking shadow officer capable of commanding other shadows. Shadow Marshals are powerful enough to lead entire battalions of shadow soldiers.',
  'Shadow Marshals are the generals of the Shadow Army. They possess tactical knowledge and can coordinate multiple shadow units in battle. Their presence on the battlefield significantly increases the effectiveness of nearby shadows.',
  'The ground cracks with dark energy as the Shadow Monarch''s power intensifies. "ARISE," the command booms, and a figure of authority emerges, its presence commanding respect even among the undead.',
  100,
  3,
  'C',
  true,
  false,
  ARRAY['shadow', 'undead', 'summoned', 'tier-3', 'commander']
);

-- Named Shadows (Tier 4-5)
INSERT INTO public.compendium_shadow_soldiers (
  name, rank, tier, size, creature_type, cr, armor_class, hit_points_average, hit_points_formula,
  speed_walk, speed_fly, str, agi, vit, int, sense, pre,
  description, lore, summoning_lore, shadow_energy, max_summoned,
  gate_rank, is_elite, is_named, tags
) VALUES
(
  'Igris',
  'Shadow Marshal',
  4,
  'medium',
  'undead',
  '8',
  19,
  136,
  '16d8 + 64',
  40,
  0,
  20,
  18,
  20,
  14,
  16,
  18,
  'The first and most loyal of the Shadow Monarch''s named shadows. Igris is a master swordsman who wields a massive greatsword forged from shadow energy. He serves as the Shadow Monarch''s right hand and primary commander.',
  'Igris was once a powerful warrior in life, and his combat prowess has only increased in undeath. He is the Shadow Monarch''s most trusted lieutenant, having been with him since the earliest days. Igris fights with a combination of raw power and refined technique, making him a deadly opponent.',
  'The air itself seems to darken as the Shadow Monarch calls upon his most trusted servant. "ARISE, IGRIS." The ground trembles, and a figure clad in dark armor materializes, a massive shadow blade already in hand. The very presence of this shadow marshal causes lesser shadows to bow in respect.',
  200,
  1,
  'B',
  true,
  true,
  ARRAY['shadow', 'undead', 'summoned', 'tier-4', 'named', 'commander', 'igris']
),
(
  'Beru',
  'Shadow Marshal',
  4,
  'large',
  'undead',
  '9',
  18,
  153,
  '18d8 + 72',
  40,
  60,
  22,
  16,
  22,
  10,
  14,
  16,
  'A massive ant-like shadow creature, one of the Shadow Monarch''s most powerful named shadows. Beru combines incredible physical strength with the ability to fly, making him a versatile and devastating combatant.',
  'Beru was once a powerful ant-type monster, and his transformation into a shadow has only amplified his natural abilities. His exoskeleton provides natural armor, and his massive mandibles can crush even the strongest defenses. Beru''s loyalty to the Shadow Monarch is absolute.',
  'The ground erupts as a massive form begins to emerge. "ARISE, BERU." The command echoes with power, and a colossal ant-like shadow rises, its dark carapace gleaming. Wings of shadow energy unfurl, and the creature lets out a roar that shakes the very foundations.',
  250,
  1,
  'A',
  true,
  true,
  ARRAY['shadow', 'undead', 'summoned', 'tier-4', 'named', 'beru', 'flying']
),
(
  'Tank',
  'Shadow Marshal',
  4,
  'large',
  'undead',
  '8',
  20,
  170,
  '20d8 + 80',
  30,
  0,
  24,
  12,
  24,
  8,
  12,
  14,
  'A massive defensive shadow, designed to absorb damage and protect the Shadow Monarch. Tank is nearly indestructible, with incredible vitality and natural armor.',
  'Tank was created specifically to serve as an unbreakable shield. His massive frame and incredible durability make him the perfect guardian. Tank can withstand attacks that would destroy lesser shadows, and his presence on the battlefield provides a mobile fortress.',
  'The earth itself seems to groan as something massive begins to rise. "ARISE, TANK." A colossal figure emerges, its form so large it blocks out the light. This shadow was built for one purpose: to be an unbreakable wall.',
  200,
  1,
  'B',
  true,
  true,
  ARRAY['shadow', 'undead', 'summoned', 'tier-4', 'named', 'tank', 'defensive']
),
(
  'Kaisel',
  'Shadow Marshal',
  5,
  'huge',
  'undead',
  '12',
  19,
  200,
  '24d8 + 96',
  40,
  80,
  22,
  18,
  22,
  14,
  16,
  18,
  'A dragon-like shadow, one of the Shadow Monarch''s most powerful named shadows. Kaisel combines the power of a dragon with shadow energy, capable of devastating area attacks and aerial dominance.',
  'Kaisel represents the pinnacle of shadow summoning. This dragon shadow retains the majesty and power of its draconic nature while gaining the benefits of shadow transformation. Kaisel can rain down shadow fire and dominate the skies, making it a force of destruction on the battlefield.',
  'The sky darkens as shadow clouds gather. "ARISE, KAISEL." The command echoes across the battlefield, and a massive shadow dragon materializes, its wingspan blocking out the sun. Shadow fire burns in its eyes, and its roar is a promise of destruction.',
  500,
  1,
  'S',
  true,
  true,
  ARRAY['shadow', 'undead', 'summoned', 'tier-5', 'named', 'kaisel', 'dragon', 'flying']
);

-- Add XP values
UPDATE public.compendium_shadow_soldiers SET xp = CASE cr
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
  ELSE 0
END;

-- Add traits for each shadow soldier
-- Shadow Soldier traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'The shadow soldier is immune to being charmed, frightened, or exhausted. It does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Soldier';

INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Undead Fortitude', 'If damage reduces the shadow soldier to 0 hit points, it must make a Constitution saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the shadow soldier drops to 1 hit point instead.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Soldier';

-- Shadow Knight traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'The shadow knight is immune to being charmed, frightened, or exhausted. It does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Knight';

INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Armor', 'The shadow knight''s armor is forged from shadow energy, providing resistance to non-magical bludgeoning, piercing, and slashing damage.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Knight';

INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Command Presence', 'Other shadow soldiers within 30 feet of the shadow knight have advantage on attack rolls.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Knight';

-- Shadow Marshal traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'The shadow marshal is immune to being charmed, frightened, or exhausted. It does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Marshal';

INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Tactical Command', 'As a bonus action, the shadow marshal can command up to three shadow soldiers within 60 feet. Each commanded shadow can immediately make one weapon attack.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Marshal';

INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Aura', 'Shadow soldiers within 30 feet of the shadow marshal have resistance to radiant damage.'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Marshal';

-- Igris traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'Igris is immune to being charmed, frightened, or exhausted. He does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Igris';

INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Master Swordsman', 'Igris has advantage on all melee weapon attacks. When he hits with a melee weapon attack, he can make an additional attack as a bonus action.'
FROM public.compendium_shadow_soldiers WHERE name = 'Igris';

INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Blade', 'Igris''s greatsword is forged from pure shadow energy. It deals an additional 1d8 necrotic damage on a hit.'
FROM public.compendium_shadow_soldiers WHERE name = 'Igris';

INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Army Commander', 'All shadow soldiers within 120 feet of Igris have advantage on saving throws and add Igris''s proficiency bonus to their attack rolls.'
FROM public.compendium_shadow_soldiers WHERE name = 'Igris';

-- Beru traits
INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Form', 'Beru is immune to being charmed, frightened, or exhausted. He does not need to eat, drink, or breathe.'
FROM public.compendium_shadow_soldiers WHERE name = 'Beru';

INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Massive Frame', 'Beru''s size and strength allow him to grapple creatures up to Huge size. He has advantage on Strength checks and saving throws.'
FROM public.compendium_shadow_soldiers WHERE name = 'Beru';

INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Crushing Mandibles', 'When Beru hits a creature with his bite attack, the target must succeed on a Strength saving throw (DC 18) or be grappled. While grappled, the target takes 2d6 bludgeoning damage at the start of each of Beru''s turns.'
FROM public.compendium_shadow_soldiers WHERE name = 'Beru';

INSERT INTO public.compendium_shadow_soldier_traits (shadow_soldier_id, name, description)
SELECT id, 'Shadow Flight', 'Beru can hover and move through the air with shadow energy. His flight speed is 60 feet.'
FROM public.compendium_shadow_soldiers WHERE name = 'Beru';

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

-- Add actions for each shadow soldier
-- Shadow Soldier actions
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Shadow Blade', 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage plus 3 (1d6) necrotic damage.', 'action', 4, '1d6 + 2 slashing plus 1d6 necrotic', 'slashing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Soldier';

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
SELECT id, 'Shadow Command', 'The shadow marshal issues a command to all shadow soldiers within 60 feet. Each shadow soldier can immediately use its reaction to make one weapon attack.', 'action', '5-6'
FROM public.compendium_shadow_soldiers WHERE name = 'Shadow Marshal';

-- Igris actions
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Shadow Greatsword', 'Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 18 (3d6 + 8) slashing damage plus 9 (2d8) necrotic damage.', 'action', 11, '3d6 + 8 slashing plus 2d8 necrotic', 'slashing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Igris';

INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Multiattack', 'Igris makes four greatsword attacks.', 'action', NULL, NULL, NULL
FROM public.compendium_shadow_soldiers WHERE name = 'Igris';

INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, recharge)
SELECT id, 'Shadow Slash', 'Igris makes a sweeping attack with his greatsword. All creatures within 10 feet must make a Dexterity saving throw (DC 18) or take 21 (6d6) slashing damage plus 14 (4d6) necrotic damage, or half as much on a successful save.', 'action', '5-6'
FROM public.compendium_shadow_soldiers WHERE name = 'Igris';

-- Beru actions
INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Bite', 'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 22 (3d10 + 6) piercing damage plus 14 (4d6) necrotic damage. If the target is a Medium or smaller creature, it is grappled (escape DC 18).', 'action', 11, '3d10 + 6 piercing plus 4d6 necrotic', 'piercing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Beru';

INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Claw', 'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 18 (3d6 + 6) slashing damage plus 10 (3d6) necrotic damage.', 'action', 11, '3d6 + 6 slashing plus 3d6 necrotic', 'slashing, necrotic'
FROM public.compendium_shadow_soldiers WHERE name = 'Beru';

INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, attack_bonus, damage, damage_type)
SELECT id, 'Multiattack', 'Beru makes one bite attack and two claw attacks.', 'action', NULL, NULL, NULL
FROM public.compendium_shadow_soldiers WHERE name = 'Beru';

INSERT INTO public.compendium_shadow_soldier_actions (shadow_soldier_id, name, description, action_type, recharge)
SELECT id, 'Shadow Breath', 'Beru exhales a 30-foot cone of shadow energy. Each creature in that area must make a Dexterity saving throw (DC 18), taking 35 (10d6) necrotic damage on a failed save, or half as much on a successful one.', 'action', '5-6'
FROM public.compendium_shadow_soldiers WHERE name = 'Beru';

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
-- Igris abilities
INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type)
SELECT id, 'Shadow Step', 'As a bonus action, Igris can teleport up to 30 feet to an unoccupied space he can see. This movement does not provoke opportunity attacks.', 'bonus'
FROM public.compendium_shadow_soldiers WHERE name = 'Igris';

INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type)
SELECT id, 'Loyalty Beyond Death', 'Igris will never betray the Shadow Monarch. He has advantage on all saving throws against effects that would control or command him.', 'passive'
FROM public.compendium_shadow_soldiers WHERE name = 'Igris';

-- Beru abilities
INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type)
SELECT id, 'Shadow Regeneration', 'At the start of each of his turns, Beru regains 10 hit points if he has at least 1 hit point remaining.', 'passive'
FROM public.compendium_shadow_soldiers WHERE name = 'Beru';

INSERT INTO public.compendium_shadow_soldier_abilities (shadow_soldier_id, name, description, ability_type, recharge)
SELECT id, 'Shadow Burst', 'As a reaction when Beru takes damage, he can release a burst of shadow energy. All creatures within 10 feet must make a Dexterity saving throw (DC 18) or take 14 (4d6) necrotic damage.', 'reaction', '5-6'
FROM public.compendium_shadow_soldiers WHERE name = 'Beru';

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


-- =============================================
-- Sovereign Templates + Monster Actions/Traits
-- =============================================
-- This migration fills compendium gaps for sovereigns and adds
-- baseline actions/traits for every monster to support automation.

-- ---------------------------------------------
-- Baseline monster actions (generic melee strike)
-- ---------------------------------------------
WITH base AS (
  SELECT id, name, str, agi
  FROM compendium_monsters
),
calc AS (
  SELECT
    id,
    name,
    GREATEST((str - 10) / 2, (agi - 10) / 2) AS mod
  FROM base
),
attack AS (
  SELECT
    id,
    name,
    mod,
    mod + 2 AS attack_bonus,
    CASE
      WHEN mod >= 0 THEN '1d8 + ' || mod
      ELSE '1d8 - ' || ABS(mod)
    END AS damage
  FROM calc
)
INSERT INTO compendium_monster_actions (
  monster_id,
  name,
  description,
  action_type,
  attack_bonus,
  damage,
  damage_type
)
SELECT
  attack.id,
  'Basic Attack',
  attack.name || ' makes a basic attack. Melee Weapon Attack: +' || attack.attack_bonus ||
    ' to hit, reach 5 ft., one target. Hit: ' || attack.damage || ' slashing damage.',
  'action',
  attack.attack_bonus,
  attack.damage,
  'slashing'
FROM attack
WHERE NOT EXISTS (
  SELECT 1
  FROM compendium_monster_actions a
  WHERE a.monster_id = attack.id AND a.name = 'Basic Attack'
);
-- ---------------------------------------------
-- Baseline monster traits (gate adaptation)
-- ---------------------------------------------
INSERT INTO compendium_monster_traits (monster_id, name, description)
SELECT
  m.id,
  'Rift Adaptation',
  m.name || ' is acclimated to Rift mana and has advantage on saving throws against environmental hazards while within a Rift.'
FROM compendium_monsters m
WHERE NOT EXISTS (
  SELECT 1
  FROM compendium_monster_traits t
  WHERE t.monster_id = m.id AND t.name = 'Rift Adaptation'
);
-- ---------------------------------------------
-- Sovereign templates (Gemini Protocol)
-- ---------------------------------------------
WITH monarchs AS (
  SELECT
    (SELECT id FROM compendium_monarchs WHERE name = 'Umbral Monarch') AS shadow_id,
    (SELECT id FROM compendium_monarchs WHERE name = 'White Flames Monarch') AS flame_id,
    (SELECT id FROM compendium_monarchs WHERE name = 'Frost Monarch') AS frost_id,
    (SELECT id FROM compendium_monarchs WHERE name = 'Beast Monarch') AS beast_id,
    (SELECT id FROM compendium_monarchs WHERE name = 'Stone Monarch') AS stone_id,
    (SELECT id FROM compendium_monarchs WHERE name = 'Plague Monarch') AS plague_id,
    (SELECT id FROM compendium_monarchs WHERE name = 'Transfiguration Monarch') AS trans_id,
    (SELECT id FROM compendium_monarchs WHERE name = 'Destruction Monarch') AS destruction_id
), sovereign_rows AS (
  SELECT
    'Eclipse Sovereign'::text AS name,
    'A fusion of shadow and white flame, channeling twilight energy that burns both body and soul.'::text AS description,
    shadow_id AS monarch_a_id,
    flame_id AS monarch_b_id,
    'Eclipse'::text AS fusion_theme,
    'Shadowfire coils around the sovereign, alternating between freezing darkness and searing white flame.'::text AS fusion_description,
    17::integer AS unlock_level,
    'Requires Umbral Monarch and White Flames Monarch overlays.'::text AS prerequisites,
    true AS is_template,
    'SL'::text AS source_book,
    ARRAY['gemini-protocol', 'shadow', 'fire']::text[] AS tags
  FROM monarchs
  WHERE shadow_id IS NOT NULL AND flame_id IS NOT NULL

  UNION ALL

  SELECT
    'Frostfang Sovereign'::text,
    'A predatory fusion that combines ruthless pack instincts with glacial control.'::text,
    frost_id,
    beast_id,
    'Frostfang'::text,
    'Icy mana hardens into spectral claws and fangs, turning every hunt into a blizzard.'::text,
    17::integer,
    'Requires Frost Monarch and Beast Monarch overlays.'::text,
    true,
    'SL'::text,
    ARRAY['gemini-protocol', 'frost', 'beast']::text[]
  FROM monarchs
  WHERE frost_id IS NOT NULL AND beast_id IS NOT NULL

  UNION ALL

  SELECT
    'Gravestone Sovereign'::text,
    'A fusion of stone and plague, turning the battlefield into a crumbling mausoleum of decay.'::text,
    stone_id,
    plague_id,
    'Gravestone'::text,
    'Stone plates fracture and ooze with corrosive mana, spreading decay with every impact.'::text,
    17::integer,
    'Requires Stone Monarch and Plague Monarch overlays.'::text,
    true,
    'SL'::text,
    ARRAY['gemini-protocol', 'stone', 'decay']::text[]
  FROM monarchs
  WHERE stone_id IS NOT NULL AND plague_id IS NOT NULL

  UNION ALL

  SELECT
    'Mirrorbreak Sovereign'::text,
    'A volatile fusion of transformation and destruction, able to shatter forms and rebuild them anew.'::text,
    trans_id,
    destruction_id,
    'Mirrorbreak'::text,
    'Reality fractures like glass, letting the sovereign rewrite matter in the space between shards.'::text,
    17::integer,
    'Requires Transfiguration Monarch and Destruction Monarch overlays.'::text,
    true,
    'SL'::text,
    ARRAY['gemini-protocol', 'transformation', 'destruction']::text[]
  FROM monarchs
  WHERE trans_id IS NOT NULL AND destruction_id IS NOT NULL
)
INSERT INTO compendium_sovereigns (
  name,
  description,
  monarch_a_id,
  monarch_b_id,
  fusion_theme,
  fusion_description,
  unlock_level,
  prerequisites,
  is_template,
  source_book,
  tags
)
SELECT
  name,
  description,
  monarch_a_id,
  monarch_b_id,
  fusion_theme,
  fusion_description,
  unlock_level,
  prerequisites,
  is_template,
  source_book,
  tags
FROM sovereign_rows
ON CONFLICT (name) DO NOTHING;
-- ---------------------------------------------
-- Sovereign features
-- ---------------------------------------------
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'Eclipse Mantle',
  'You wreathe yourself in shadowfire, gaining resistance to fire and necrotic damage and dealing 1d6 necrotic damage to creatures that hit you in melee.',
  ARRAY['Umbral Monarch: Shadow Domain', 'White Flames Monarch: White Fire'],
  17,
  false,
  'passive',
  NULL,
  NULL
FROM compendium_sovereigns s
WHERE s.name = 'Eclipse Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'Shadowflame Surge',
  'As an action, unleash a 30-foot line of shadowfire. Creatures in the line make an Agility save (DC = 8 + proficiency bonus + PRE modifier) or take 6d8 fire damage plus 6d8 necrotic damage, half on success.',
  ARRAY['Umbral Monarch: Shadow Extraction', 'White Flames Monarch: White Pyre'],
  18,
  false,
  'action',
  'proficiency bonus',
  'long-rest'
FROM compendium_sovereigns s
WHERE s.name = 'Eclipse Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'Twilight Dominion',
  'Once per long rest, you create a 30-foot-radius twilight field for 1 minute. Enemies inside have disadvantage on saving throws against your powers, and allies gain temporary hit points equal to your level at the start of their turns.',
  ARRAY['Umbral Monarch: Shadow Realm', 'White Flames Monarch: Radiant Dominion'],
  20,
  true,
  'action',
  '1',
  'long-rest'
FROM compendium_sovereigns s
WHERE s.name = 'Eclipse Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'Predator of Winter',
  'You gain proficiency in Stealth and Survival. While in cold environments, your speed increases by 10 feet and you have advantage on initiative rolls.',
  ARRAY['Frost Monarch: Absolute Cold', 'Beast Monarch: Apex Instinct'],
  17,
  false,
  'passive',
  NULL,
  NULL
FROM compendium_sovereigns s
WHERE s.name = 'Frostfang Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'Frost Hunt',
  'As a bonus action, choose one creature you can see. Until the end of your next turn, your first hit against that creature deals an extra 3d6 cold damage and reduces its speed by 10 feet.',
  ARRAY['Frost Monarch: Icebound Chains', 'Beast Monarch: Pack Tactics'],
  18,
  false,
  'bonus-action',
  'proficiency bonus',
  'short-rest'
FROM compendium_sovereigns s
WHERE s.name = 'Frostfang Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'Whiteout Apex',
  'Once per long rest, you call a blizzard in a 20-foot-radius sphere for 1 minute. Enemies in the area are blinded until they leave the sphere and take 4d6 cold damage at the start of each of their turns.',
  ARRAY['Frost Monarch: Winter''s End', 'Beast Monarch: Apex Roar'],
  20,
  true,
  'action',
  '1',
  'long-rest'
FROM compendium_sovereigns s
WHERE s.name = 'Frostfang Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'Gravebinding',
  'Your attacks inflict lingering decay. Once per turn, when you hit a creature, it takes an extra 1d8 necrotic damage and cannot regain hit points until the start of its next turn.',
  ARRAY['Stone Monarch: Earth Bind', 'Plague Monarch: Virulent Touch'],
  17,
  false,
  'passive',
  NULL,
  NULL
FROM compendium_sovereigns s
WHERE s.name = 'Gravestone Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'Stonebloom Rot',
  'As an action, you erupt jagged stone in a 15-foot cone. Creatures in the cone make a Vitality save or take 4d6 bludgeoning damage and 4d6 poison damage, half on success.',
  ARRAY['Stone Monarch: Earthspike', 'Plague Monarch: Corrupting Wave'],
  18,
  false,
  'action',
  'proficiency bonus',
  'short-rest'
FROM compendium_sovereigns s
WHERE s.name = 'Gravestone Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'Epitaph Collapse',
  'Once per long rest, you raise a 30-foot-radius field of crushing stone and decay for 1 minute. Enemies in the area have their speed halved and take 3d10 necrotic damage at the end of their turns.',
  ARRAY['Stone Monarch: Cataclysm', 'Plague Monarch: Ruin'],
  20,
  true,
  'action',
  '1',
  'long-rest'
FROM compendium_sovereigns s
WHERE s.name = 'Gravestone Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'Fractured Self',
  'You can project a mirrored echo of yourself within 30 feet. The echo lasts 1 minute and grants advantage on the first attack you make each turn while it persists.',
  ARRAY['Transfiguration Monarch: Mirrorcraft', 'Destruction Monarch: Ruinous Edge'],
  17,
  false,
  'bonus-action',
  'proficiency bonus',
  'short-rest'
FROM compendium_sovereigns s
WHERE s.name = 'Mirrorbreak Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'Shatterform',
  'As an action, you unravel a creature''s form. The target makes a Perception saving throw or takes 5d8 force damage and has disadvantage on attack rolls until the end of its next turn.',
  ARRAY['Transfiguration Monarch: Mutable Form', 'Destruction Monarch: Obliterate'],
  18,
  false,
  'action',
  'proficiency bonus',
  'short-rest'
FROM compendium_sovereigns s
WHERE s.name = 'Mirrorbreak Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;
INSERT INTO compendium_sovereign_features (
  sovereign_id,
  name,
  description,
  origin_sources,
  level,
  is_capstone,
  action_type,
  uses_formula,
  recharge
)
SELECT
  s.id,
  'End of Reflections',
  'Once per long rest, you fracture reality in a 20-foot-radius sphere for 1 minute. Enemies in the area take 4d10 force damage at the start of their turns and cannot use reactions.',
  ARRAY['Transfiguration Monarch: Rewrite', 'Destruction Monarch: Final Ruin'],
  20,
  true,
  'action',
  '1',
  'long-rest'
FROM compendium_sovereigns s
WHERE s.name = 'Mirrorbreak Sovereign'
ON CONFLICT (sovereign_id, name) DO NOTHING;


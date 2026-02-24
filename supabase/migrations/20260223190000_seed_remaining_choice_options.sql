-- Comprehensive Choice Options Seeding
-- Seeds all remaining hardcoded choice options for fighting styles, maneuvers, and specializations

-- 1. FIGHTING STYLE OPTIONS (Groups already created in previous migrations)
WITH fs_groups AS (
  SELECT id AS group_id FROM public.compendium_feature_choice_groups 
  WHERE choice_key = 'fighting_style'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  o.option_key,
  o.name,
  o.description,
  o.grants
FROM fs_groups g
CROSS JOIN (
  VALUES
    ('archery', 'Archery', 'You gain a +2 bonus to attack rolls you make with ranged weapons.', '[{"type":"feature","name":"Fighting Style: Archery","description":"+2 bonus to attack rolls with ranged weapons."}]'::jsonb),
    ('defense', 'Defense', 'While wearing armor, your Armor Class increases by 1.', '[{"type":"feature","name":"Fighting Style: Defense","description":"+1 bonus to AC while wearing armor."}]'::jsonb),
    ('dueling', 'Dueling', 'When wielding a melee weapon in one hand and no other weapons, you gain +2 damage with that weapon.', '[{"type":"feature","name":"Fighting Style: Dueling","description":"+2 bonus to damage rolls with one-handed melee weapons."}]'::jsonb),
    ('great_weapon_fighting', 'Great Weapon Fighting', 'Reroll 1 or 2 on damage dice for two-handed melee weapons.', '[{"type":"feature","name":"Fighting Style: Great Weapon Fighting","description":"Reroll 1 or 2 on damage dice for two-handed melee weapons."}]'::jsonb),
    ('protection', 'Protection', 'Impose disadvantage on an attack against an ally within 5 feet using your shield.', '[{"type":"feature","name":"Fighting Style: Protection","description":"Reaction to impose disadvantage on attacks against nearby allies."}]'::jsonb),
    ('two_weapon_fighting', 'Two-Weapon Fighting', 'Add your ability modifier to the damage of your second attack.', '[{"type":"feature","name":"Fighting Style: Two-Weapon Fighting","description":"Add ability modifier to off-hand attack damage."}]'::jsonb)
) AS o(option_key, name, description, grants)
ON CONFLICT (group_id, option_key) DO NOTHING;

-- 2. TACTICAL CHARGE / MANEUVER OPTIONS
-- Destroyer - Path of the Tactician
WITH tactical_groups AS (
  SELECT id AS group_id FROM public.compendium_feature_choice_groups 
  WHERE choice_key = 'tactical_charge' OR choice_key = 'maneuvers'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  o.option_key,
  o.name,
  o.description,
  o.grants
FROM tactical_groups g
CROSS JOIN (
  VALUES
    ('commander_strike', 'Commander''s Strike', 'Ally can use reaction to make a weapon attack.', '[{"type":"feature","name":"Maneuver: Commander''s Strike"}]'::jsonb),
    ('disarming_attack', 'Disarming Attack', 'Target must drop one item of your choice.', '[{"type":"feature","name":"Maneuver: Disarming Attack"}]'::jsonb),
    ('distracting_strike', 'Distracting Strike', 'Next attack roll against the target has advantage.', '[{"type":"feature","name":"Maneuver: Distracting Strike"}]'::jsonb),
    ('evasive_footwork', 'Evasive Footwork', 'Add superiority die to your AC until you stop moving.', '[{"type":"feature","name":"Maneuver: Evasive Footwork"}]'::jsonb),
    ('feinting_attack', 'Feinting Attack', 'Advantage on next attack roll against the target.', '[{"type":"feature","name":"Maneuver: Feinting Attack"}]'::jsonb),
    ('goading_attack', 'Goading Attack', 'Target has disadvantage on attacks against others.', '[{"type":"feature","name":"Maneuver: Goading Attack"}]'::jsonb),
    ('lunging_attack', 'Lunging Attack', 'Increase reach for one melee attack by 5 feet.', '[{"type":"feature","name":"Maneuver: Lunging Attack"}]'::jsonb),
    ('maneuvering_attack', 'Maneuvering Attack', 'Ally can use reaction to move up to half speed.', '[{"type":"feature","name":"Maneuver: Maneuvering Attack"}]'::jsonb),
    ('parry', 'Parry', 'Reduce damage from a melee attack.', '[{"type":"feature","name":"Maneuver: Parry"}]'::jsonb),
    ('precision_attack', 'Precision Attack', 'Add superiority die to the attack roll.', '[{"type":"feature","name":"Maneuver: Precision Attack"}]'::jsonb),
    ('pushing_attack', 'Pushing Attack', 'Push target up to 15 feet away.', '[{"type":"feature","name":"Maneuver: Pushing Attack"}]'::jsonb),
    ('rally', 'Rally', 'Ally gains temporary hit points.', '[{"type":"feature","name":"Maneuver: Rally"}]'::jsonb),
    ('riposte', 'Riposte', 'Reaction to make a melee attack when a creature misses you.', '[{"type":"feature","name":"Maneuver: Riposte"}]'::jsonb),
    ('sweeping_attack', 'Sweeping Attack', 'Damage another creature within 5 feet of original target.', '[{"type":"feature","name":"Maneuver: Sweeping Attack"}]'::jsonb),
    ('trip_attack', 'Trip Attack', 'Knock the target prone.', '[{"type":"feature","name":"Maneuver: Trip Attack"}]'::jsonb)
) AS o(option_key, name, description, grants)
ON CONFLICT (group_id, option_key) DO NOTHING;

-- 3. ELDRITCH INVOCATIONS
-- Contractor job
WITH invocation_groups AS (
  SELECT id AS group_id FROM public.compendium_feature_choice_groups 
  WHERE choice_key = 'invocations'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  o.option_key,
  o.name,
  o.description,
  o.grants
FROM invocation_groups g
CROSS JOIN (
  VALUES
    ('agonizing_blast', 'Agonizing Blast', 'Add PRE mod to primary bolt damage.', '[{"type":"feature","name":"Invocation: Agonizing Blast"}]'::jsonb),
    ('armor_of_shadows', 'Armor of Shadows', 'Cast Mage Armor at will without a slot.', '[{"type":"feature","name":"Invocation: Armor of Shadows"}]'::jsonb),
    ('beast_speech', 'Beast Speech', 'Speak with Animals at will without a slot.', '[{"type":"feature","name":"Invocation: Beast Speech"}]'::jsonb),
    ('beguiling_influence', 'Beguiling Influence', 'Proficiency in Deception and Persuasion.', '[{"type":"skill_proficiency","name":"Deception"},{"type":"skill_proficiency","name":"Persuasion"}]'::jsonb),
    ('devil_sight', 'Devil''s Sight', 'See normally in darkness, both magical and nonmagical.', '[{"type":"feature","name":"Invocation: Devil''s Sight"}]'::jsonb),
    ('eldritch_sight', 'Eldritch Sight', 'Detect Magic at will without a slot.', '[{"type":"feature","name":"Invocation: Eldritch Sight"}]'::jsonb),
    ('eldritch_spear', 'Eldritch Spear', 'Primary bolt range increases to 300 feet.', '[{"type":"feature","name":"Invocation: Eldritch Spear"}]'::jsonb),
    ('eyes_of_rune_keeper', 'Eyes of the Rune Keeper', 'Read all writing.', '[{"type":"feature","name":"Invocation: Eyes of the Rune Keeper"}]'::jsonb),
    ('fiendish_vigor', 'Fiendish Vigor', 'False Life at will without a slot.', '[{"type":"feature","name":"Invocation: Fiendish Vigor"}]'::jsonb),
    ('mask_of_many_faces', 'Mask of Many Faces', 'Disguise Self at will without a slot.', '[{"type":"feature","name":"Invocation: Mask of Many Faces"}]'::jsonb),
    ('misty_visions', 'Misty Visions', 'Silent Image at will without a slot.', '[{"type":"feature","name":"Invocation: Misty Visions"}]'::jsonb),
    ('repelling_blast', 'Repelling Blast', 'Hit with primary bolt pushes target 10 feet.', '[{"type":"feature","name":"Invocation: Repelling Blast"}]'::jsonb)
) AS o(option_key, name, description, grants)
ON CONFLICT (group_id, option_key) DO NOTHING;

-- 4. HUNTER'S PREY / DEFENSIVE TACTICS
-- Stalker - Path of the Specialist Hunter
WITH stalker_groups AS (
  SELECT id AS group_id FROM public.compendium_feature_choice_groups 
  WHERE choice_key = 'hunters_prey' OR choice_key = 'defensive_tactics'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  o.option_key,
  o.name,
  o.description,
  o.grants
FROM stalker_groups g
CROSS JOIN (
  VALUES
    ('colossus_slayer', 'Colossus Slayer', '1d8 extra damage vs creature below max HP.', '[{"type":"feature","name":"Stalker Prey: Colossus Slayer"}]'::jsonb),
    ('giant_killer', 'Giant Killer', 'Reaction attack vs Large+ attacker.', '[{"type":"feature","name":"Stalker Prey: Giant Killer"}]'::jsonb),
    ('horde_breaker', 'Horde Breaker', 'Extra attack on nearby different target.', '[{"type":"feature","name":"Stalker Prey: Horde Breaker"}]'::jsonb),
    ('escape_the_horde', 'Escape the Horde', 'OAs vs you have disadvantage.', '[{"type":"feature","name":"Stalker Defense: Escape the Horde"}]'::jsonb),
    ('multiattack_defense', 'Multiattack Defense', '+4 AC after being hit until end of turn.', '[{"type":"feature","name":"Stalker Defense: Multiattack Defense"}]'::jsonb),
    ('steel_will', 'Steel Will', 'Advantage on saves vs frightened.', '[{"type":"feature","name":"Stalker Defense: Steel Will"}]'::jsonb)
) AS o(option_key, name, description, grants)
ON CONFLICT (group_id, option_key) DO NOTHING;

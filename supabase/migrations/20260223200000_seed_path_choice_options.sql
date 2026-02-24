-- Path Specialization and Aspect Choice Options Seeding
-- Seeds options for features in paths.ts that require specific choices

-- 1. STALKER - PATH OF THE SPECIALIST HUNTER (Hunter's Prey & Defensive Tactics)
WITH stalker_hunter_prey AS (
  SELECT g.id AS group_id FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE f.name = 'Hunter''s Prey' AND g.choice_key = 'hunters_prey'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  o.option_key,
  o.name,
  o.description,
  o.grants
FROM stalker_hunter_prey g
CROSS JOIN (
  VALUES
    ('colossus_slayer', 'Colossus Slayer', '1d8 extra damage vs creature below max HP.', '[{"type":"feature","name":"Stalker Prey: Colossus Slayer"}]'::jsonb),
    ('giant_killer', 'Giant Killer', 'Reaction attack vs Large+ attacker.', '[{"type":"feature","name":"Stalker Prey: Giant Killer"}]'::jsonb),
    ('horde_breaker', 'Horde Breaker', 'Extra attack on nearby different target.', '[{"type":"feature","name":"Stalker Prey: Horde Breaker"}]'::jsonb)
) AS o(option_key, name, description, grants)
ON CONFLICT (group_id, option_key) DO NOTHING;

WITH stalker_def_tactics AS (
  SELECT g.id AS group_id FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE f.name = 'Defensive Tactics' AND g.choice_key = 'defensive_tactics'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  o.option_key,
  o.name,
  o.description,
  o.grants
FROM stalker_def_tactics g
CROSS JOIN (
  VALUES
    ('escape_the_horde', 'Escape the Horde', 'OAs vs you have disadvantage.', '[{"type":"feature","name":"Stalker Defense: Escape the Horde"}]'::jsonb),
    ('multiattack_defense', 'Multiattack Defense', '+4 AC after being hit until end of turn.', '[{"type":"feature","name":"Stalker Defense: Multiattack Defense"}]'::jsonb),
    ('steel_will', 'Steel Will', 'Advantage on saves vs frightened.', '[{"type":"feature","name":"Stalker Defense: Steel Will"}]'::jsonb)
) AS o(option_key, name, description, grants)
ON CONFLICT (group_id, option_key) DO NOTHING;

-- 2. BERSERKER - PATH OF THE GATE BEAST (Bonded Aspect)
WITH gate_beast_aspect AS (
  SELECT g.id AS group_id FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE f.name = 'Bonded Aspect' AND g.choice_key = 'gate_beast_aspect'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  o.option_key,
  o.name,
  o.description,
  o.grants
FROM gate_beast_aspect g
CROSS JOIN (
  VALUES
    ('tank_beast', 'Tank-Beast', 'Resist all damage except psychic in Overload.', '[{"type":"feature","name":"Aspect: Tank-Beast"}]'::jsonb),
    ('raptor', 'Raptor', 'OAs have disadvantage, Dash as bonus in Overload.', '[{"type":"feature","name":"Aspect: Raptor"}]'::jsonb),
    ('pack_leader', 'Pack-Leader', 'Allies have advantage on melee vs nearby enemies.', '[{"type":"feature","name":"Aspect: Pack-Leader"}]'::jsonb)
) AS o(option_key, name, description, grants)
ON CONFLICT (group_id, option_key) DO NOTHING;

-- 3. DESTROYER - PATH OF THE APEX PREDATOR (Secondary Discipline)
WITH secondary_discipline AS (
  SELECT g.id AS group_id FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE f.name = 'Secondary Discipline' AND g.choice_key = 'destroyer_secondary_discipline'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  o.option_key,
  o.name,
  o.description,
  o.grants
FROM secondary_discipline g
CROSS JOIN (
  VALUES
    ('heavy_ordnance', 'Heavy Ordnance', 'Proficiency with heavy weapons and explosives.', '[{"type":"feature","name":"Discipline: Heavy Ordnance"}]'::jsonb),
    ('tactical_recon', 'Tactical Recon', 'Advantage on initiative and perception.', '[{"type":"feature","name":"Discipline: Tactical Recon"}]'::jsonb),
    ('siege_master', 'Siege Master', 'Double damage to structures and constructs.', '[{"type":"feature","name":"Discipline: Siege Master"}]'::jsonb)
) AS o(option_key, name, description, grants)
ON CONFLICT (group_id, option_key) DO NOTHING;

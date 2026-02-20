-- Auto-seed additional D&D Beyond-style feature choice metadata (idempotent)
-- Extends the earlier best-effort seed by covering ALL matching compendium_job_features rows.

-- Fighting Style (pick 1)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT
  f.id AS feature_id,
  'fighting_style' AS choice_key,
  1 AS choice_count,
  'Select a Fighting Style' AS prompt
FROM public.compendium_job_features f
WHERE lower(f.name) LIKE '%fighting style%'
ON CONFLICT (feature_id, choice_key) DO NOTHING;

WITH fighting_style_groups AS (
  SELECT g.id AS group_id
  FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE g.choice_key = 'fighting_style'
    AND lower(f.name) LIKE '%fighting style%'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  o.option_key,
  o.name,
  o.description,
  o.grants
FROM fighting_style_groups g
CROSS JOIN (
  VALUES
    (
      'defense',
      'Defense',
      'While wearing armor, your Armor Class increases by 1.',
      '[{"type":"feature","name":"Fighting Style: Defense","description":"While wearing armor, your Armor Class increases by 1."}]'::jsonb
    ),
    (
      'dueling',
      'Dueling',
      'When wielding a melee weapon in one hand and no other weapons, you gain +2 damage with that weapon.',
      '[{"type":"feature","name":"Fighting Style: Dueling","description":"When wielding a melee weapon in one hand and no other weapons, you gain +2 damage with that weapon."}]'::jsonb
    ),
    (
      'great_weapon_fighting',
      'Great Weapon Fighting',
      'When you roll 1 or 2 on a damage die for an attack you make with a melee weapon you are wielding with two hands, you can reroll the die.',
      '[{"type":"feature","name":"Fighting Style: Great Weapon Fighting","description":"When you roll 1 or 2 on a damage die for an attack you make with a melee weapon you are wielding with two hands, you can reroll the die."}]'::jsonb
    ),
    (
      'archery',
      'Archery',
      'You gain a +2 bonus to attack rolls you make with ranged weapons.',
      '[{"type":"feature","name":"Fighting Style: Archery","description":"You gain a +2 bonus to attack rolls you make with ranged weapons."}]'::jsonb
    )
) AS o(option_key, name, description, grants)
ON CONFLICT (group_id, option_key) DO NOTHING;

-- Eldritch Invocations (pick 2 at first unlock; best-effort)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT
  f.id AS feature_id,
  'invocations' AS choice_key,
  2 AS choice_count,
  'Select your Invocations' AS prompt
FROM public.compendium_job_features f
WHERE lower(f.name) LIKE '%invocation%'
ON CONFLICT (feature_id, choice_key) DO NOTHING;

WITH invocation_groups AS (
  SELECT g.id AS group_id
  FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE g.choice_key = 'invocations'
    AND lower(f.name) LIKE '%invocation%'
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
    (
      'agonizing_blast',
      'Agonizing Blast',
      'Add your spellcasting ability modifier to the damage of your primary bolt/beam power.',
      '[{"type":"feature","name":"Invocation: Agonizing Blast","description":"Add your spellcasting ability modifier to the damage of your primary bolt/beam power."}]'::jsonb
    ),
    (
      'repelling_blast',
      'Repelling Blast',
      'When you hit a creature with your primary bolt/beam power, you can push it away from you.',
      '[{"type":"feature","name":"Invocation: Repelling Blast","description":"When you hit a creature with your primary bolt/beam power, you can push it away from you."}]'::jsonb
    )
) AS o(option_key, name, description, grants)
ON CONFLICT (group_id, option_key) DO NOTHING;

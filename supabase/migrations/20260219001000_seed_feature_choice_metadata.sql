-- Seed initial D&D Beyond-style feature choice metadata for common 5e choice points.
-- This is intentionally best-effort: it only inserts when matching compendium_job_features rows exist.

DO $$
DECLARE
  v_feature_id uuid;
  v_group_id uuid;
BEGIN
  -- Fighting Style (pick 1)
  SELECT id INTO v_feature_id
  FROM public.compendium_job_features
  WHERE lower(name) LIKE '%fighting style%'
  ORDER BY level ASC
  LIMIT 1;

  IF v_feature_id IS NOT NULL THEN
    INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
    VALUES (v_feature_id, 'fighting_style', 1, 'Select a Fighting Style')
    ON CONFLICT (feature_id, choice_key) DO NOTHING;

    SELECT id INTO v_group_id
    FROM public.compendium_feature_choice_groups
    WHERE feature_id = v_feature_id AND choice_key = 'fighting_style';

    IF v_group_id IS NOT NULL THEN
      INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
      VALUES
        (v_group_id, 'defense', 'Defense', 'While wearing armor, your Armor Class increases by 1.', '[{"type":"feature","name":"Fighting Style: Defense","description":"While wearing armor, your Armor Class increases by 1."}]'::jsonb),
        (v_group_id, 'dueling', 'Dueling', 'When wielding a melee weapon in one hand and no other weapons, you gain +2 damage with that weapon.', '[{"type":"feature","name":"Fighting Style: Dueling","description":"When wielding a melee weapon in one hand and no other weapons, you gain +2 damage with that weapon."}]'::jsonb),
        (v_group_id, 'great_weapon_fighting', 'Great Weapon Fighting', 'When you roll 1 or 2 on a damage die for an attack you make with a melee weapon you are wielding with two hands, you can reroll the die.', '[{"type":"feature","name":"Fighting Style: Great Weapon Fighting","description":"When you roll 1 or 2 on a damage die for an attack you make with a melee weapon you are wielding with two hands, you can reroll the die."}]'::jsonb),
        (v_group_id, 'archery', 'Archery', 'You gain a +2 bonus to attack rolls you make with ranged weapons.', '[{"type":"feature","name":"Fighting Style: Archery","description":"You gain a +2 bonus to attack rolls you make with ranged weapons."}]'::jsonb)
      ON CONFLICT (group_id, option_key) DO NOTHING;
    END IF;
  END IF;

  -- Eldritch Invocations (pick 2 at first unlock; best-effort)
  SELECT id INTO v_feature_id
  FROM public.compendium_job_features
  WHERE lower(name) LIKE '%invocation%'
  ORDER BY level ASC
  LIMIT 1;

  IF v_feature_id IS NOT NULL THEN
    INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
    VALUES (v_feature_id, 'invocations', 2, 'Select your Invocations')
    ON CONFLICT (feature_id, choice_key) DO NOTHING;

    SELECT id INTO v_group_id
    FROM public.compendium_feature_choice_groups
    WHERE feature_id = v_feature_id AND choice_key = 'invocations';

    IF v_group_id IS NOT NULL THEN
      INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
      VALUES
        (v_group_id, 'agonizing_blast', 'Agonizing Blast', 'Add your spellcasting ability modifier to the damage of your primary bolt/beam power.', '[{"type":"feature","name":"Invocation: Agonizing Blast","description":"Add your spellcasting ability modifier to the damage of your primary bolt/beam power."}]'::jsonb),
        (v_group_id, 'repelling_blast', 'Repelling Blast', 'When you hit a creature with your primary bolt/beam power, you can push it away from you.', '[{"type":"feature","name":"Invocation: Repelling Blast","description":"When you hit a creature with your primary bolt/beam power, you can push it away from you."}]'::jsonb)
      ON CONFLICT (group_id, option_key) DO NOTHING;
    END IF;
  END IF;
END $$;

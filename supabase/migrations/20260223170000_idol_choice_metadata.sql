-- Add Choice Group metadata for Broad-Spectrum Awakening and Specialist Training across all jobs
-- This enables the selection UI for these features during character creation and level up

-- Broad-Spectrum Awakening (Idol Level 1)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT 
  f.id, 
  'broad_spectrum_awakening_proficiencies', 
  2, 
  'Select two additional skill proficiencies from your frequency attunement.'
FROM public.compendium_job_features f
JOIN public.compendium_jobs j ON f.job_id = j.id
WHERE j.name = 'Idol' AND f.name = 'Broad-Spectrum Awakening' AND f.level = 1
ON CONFLICT (feature_id, choice_key) DO UPDATE SET choice_count = 2;

-- Specialist Training (Idol Level 3)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT 
  f.id, 
  'specialist_training_expertise', 
  2, 
  'Select two skill proficiencies to receive double proficiency (Expertise).'
FROM public.compendium_job_features f
JOIN public.compendium_jobs j ON f.job_id = j.id
WHERE j.name = 'Idol' AND f.name = 'Specialist Training' AND f.level = 3
ON CONFLICT (feature_id, choice_key) DO UPDATE SET choice_count = 2;

-- Specialist Training (Assassin Level 1)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT 
  f.id, 
  'assassin_specialist_training_expertise', 
  2, 
  'Select two skill or tool proficiencies to receive double proficiency (Expertise).'
FROM public.compendium_job_features f
JOIN public.compendium_jobs j ON f.job_id = j.id
WHERE j.name = 'Assassin' AND f.name = 'Specialist Training' AND f.level = 1
ON CONFLICT (feature_id, choice_key) DO UPDATE SET choice_count = 2;

-- Specialist Training (Technomancer Level 3)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT 
  f.id, 
  'technomancer_specialist_training_expertise', 
  2, 
  'Select two skill or tool proficiencies to receive double proficiency (Expertise).'
FROM public.compendium_job_features f
JOIN public.compendium_jobs j ON f.job_id = j.id
WHERE j.name = 'Technomancer' AND f.name = 'Specialist Training' AND f.level = 3
ON CONFLICT (feature_id, choice_key) DO UPDATE SET choice_count = 2;

-- Secondary Discipline (Destroyer Level 10)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT 
  f.id, 
  'destroyer_secondary_discipline', 
  1, 
  'Select an additional Combat Discipline protocol.'
FROM public.compendium_job_features f
JOIN public.compendium_jobs j ON f.job_id = j.id
WHERE j.name = 'Destroyer' AND f.name = 'Secondary Discipline' AND f.level = 10
ON CONFLICT (feature_id, choice_key) DO UPDATE SET choice_count = 1;

-- Matrix Combat Casting (Destroyer Level 3 - Path of the Spell Breaker)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT 
  f.id, 
  'spell_breaker_matrix_cantrips', 
  2, 
  'Select two Mage cantrips to integrate into your weapon bond.'
FROM public.compendium_job_features f
JOIN public.compendium_job_paths p ON f.path_id = p.id
WHERE p.name = 'Path of the Spell Breaker' AND f.name = 'Matrix Combat Casting' AND f.level = 3
ON CONFLICT (feature_id, choice_key) DO UPDATE SET choice_count = 2;

-- Bonded Aspect (Berserker Level 3 - Path of the Gate Beast)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT 
  f.id, 
  'gate_beast_aspect', 
  1, 
  'Select a gate beast aspect to bond with (Tank-beast, Raptor, or Pack-leader).'
FROM public.compendium_job_features f
JOIN public.compendium_job_paths p ON f.path_id = p.id
WHERE p.name = 'Path of the Gate Beast' AND f.name = 'Bonded Aspect' AND f.level = 3
ON CONFLICT (feature_id, choice_key) DO UPDATE SET choice_count = 1;

-- Shadow Impulse (Striker Level 3 - Path of the Phantom Step)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT 
  f.id, 
  'phantom_step_spells', 
  2, 
  'Select two shadow-frequency nerve cluster spells (Darkness, Darkvision, Pass without Trace, or Silence).'
FROM public.compendium_job_features f
JOIN public.compendium_job_paths p ON f.path_id = p.id
WHERE p.name = 'Path of the Phantom Step' AND f.name = 'Shadow Impulse' AND f.level = 3
ON CONFLICT (feature_id, choice_key) DO UPDATE SET choice_count = 2;

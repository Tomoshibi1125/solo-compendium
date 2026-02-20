-- Auto-seed compendium-backed selection protocols (idempotent)
-- This file seeds choice groups + options only when we can source options from an authoritative compendium table.

-- Helper note: we intentionally require explicit choice language to reduce false positives.

-- =============================================
-- SKILL PROFICIENCY CHOICES (compendium_skills)
-- =============================================
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT
  f.id,
  'skill_proficiency' AS choice_key,
  1 AS choice_count,
  'Select a skill proficiency' AS prompt
FROM public.compendium_job_features f
WHERE lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(choose|select|pick)'
  AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(skill proficiency|skill proficienc|skill)'
ON CONFLICT (feature_id, choice_key) DO NOTHING;

WITH skill_groups AS (
  SELECT g.id AS group_id
  FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE g.choice_key = 'skill_proficiency'
    AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(choose|select|pick)'
    AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(skill proficiency|skill proficienc|skill)'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  sg.group_id,
  'skill_' || regexp_replace(lower(s.name), '[^a-z0-9]+', '_', 'g') AS option_key,
  s.name,
  s.description,
  jsonb_build_array(jsonb_build_object('type','skill_proficiency','name',s.name)) AS grants
FROM skill_groups sg
CROSS JOIN public.compendium_skills s
ON CONFLICT (group_id, option_key) DO NOTHING;

-- =============================================
-- RUNE LEARNING CHOICES (compendium_runes)
-- =============================================
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT
  f.id,
  'rune' AS choice_key,
  1 AS choice_count,
  'Select a rune' AS prompt
FROM public.compendium_job_features f
WHERE lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(choose|select|pick)'
  AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '\\brune\\b'
ON CONFLICT (feature_id, choice_key) DO NOTHING;

WITH rune_groups AS (
  SELECT g.id AS group_id
  FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE g.choice_key = 'rune'
    AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(choose|select|pick)'
    AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '\\brune\\b'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  rg.group_id,
  'rune_' || regexp_replace(lower(r.name), '[^a-z0-9]+', '_', 'g') AS option_key,
  r.name,
  r.description,
  jsonb_build_array(jsonb_build_object('type','rune','name',r.name)) AS grants
FROM rune_groups rg
CROSS JOIN public.compendium_runes r
ON CONFLICT (group_id, option_key) DO NOTHING;

-- =============================================
-- CANTRIP CHOICES (compendium_powers power_level=0)
-- =============================================
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT
  f.id,
  'cantrip' AS choice_key,
  1 AS choice_count,
  'Select a cantrip' AS prompt
FROM public.compendium_job_features f
WHERE lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(choose|select|pick)'
  AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ 'cantrip'
ON CONFLICT (feature_id, choice_key) DO NOTHING;

WITH cantrip_groups AS (
  SELECT g.id AS group_id
  FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE g.choice_key = 'cantrip'
    AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(choose|select|pick)'
    AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ 'cantrip'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  cg.group_id,
  'cantrip_' || regexp_replace(lower(p.name), '[^a-z0-9]+', '_', 'g') AS option_key,
  p.name,
  p.description,
  jsonb_build_array(jsonb_build_object('type','power','name',p.name)) AS grants
FROM cantrip_groups cg
CROSS JOIN public.compendium_powers p
WHERE p.power_level = 0
ON CONFLICT (group_id, option_key) DO NOTHING;

-- =============================================
-- RELIC CHOICES (compendium_relics)
-- =============================================
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT
  f.id,
  'relic' AS choice_key,
  1 AS choice_count,
  'Select a relic' AS prompt
FROM public.compendium_job_features f
WHERE lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(choose|select|pick)'
  AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '\\brelic\\b'
ON CONFLICT (feature_id, choice_key) DO NOTHING;

WITH relic_groups AS (
  SELECT g.id AS group_id
  FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE g.choice_key = 'relic'
    AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(choose|select|pick)'
    AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '\\brelic\\b'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  rg.group_id,
  'relic_' || regexp_replace(lower(r.name), '[^a-z0-9]+', '_', 'g') AS option_key,
  r.name,
  r.description,
  jsonb_build_array(jsonb_build_object('type','equipment','name',r.name)) AS grants
FROM relic_groups rg
CROSS JOIN public.compendium_relics r
ON CONFLICT (group_id, option_key) DO NOTHING;

-- Auto-seed ASI / Feat choice-point metadata (5e-style Ability Score Improvement)
-- Idempotent: safe to run multiple times.

-- 1) Create choice groups for every matching compendium_job_features row.
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT
  f.id AS feature_id,
  'asi_or_feat' AS choice_key,
  1 AS choice_count,
  'Choose an enhancement protocol.' AS prompt
FROM public.compendium_job_features f
WHERE (
  lower(f.name) ~ '(ability score improvement|\\basi\\b)'
  OR lower(coalesce(f.description, '')) ~ '(ability score improvement|\\basi\\b)'
  OR lower(coalesce(f.prerequisites, '')) ~ '(ability score improvement|\\basi\\b)'
)
ON CONFLICT (feature_id, choice_key) DO NOTHING;

-- 2) Seed options for all ASI groups.
WITH asi_groups AS (
  SELECT g.id AS group_id
  FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE g.choice_key = 'asi_or_feat'
    AND (
      lower(f.name) ~ '(ability score improvement|\\basi\\b)'
      OR lower(coalesce(f.description, '')) ~ '(ability score improvement|\\basi\\b)'
      OR lower(coalesce(f.prerequisites, '')) ~ '(ability score improvement|\\basi\\b)'
    )
),
abilities AS (
  SELECT unnest(ARRAY['STR','AGI','VIT','INT','SENSE','PRE']) AS ability
),
ability_pairs AS (
  SELECT a1.ability AS a, a2.ability AS b
  FROM abilities a1
  JOIN abilities a2 ON a2.ability > a1.ability
)
-- +2 single ability
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  'asi_' || lower(ab.ability) || '_2' AS option_key,
  '+2 ' || ab.ability AS name,
  NULL AS description,
  jsonb_build_array(
    jsonb_build_object('type','ability_increase','ability',ab.ability,'amount',2)
  ) AS grants
FROM asi_groups g
CROSS JOIN abilities ab
ON CONFLICT (group_id, option_key) DO NOTHING;

-- +1/+1 split
WITH asi_groups AS (
  SELECT g.id AS group_id
  FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE g.choice_key = 'asi_or_feat'
    AND (
      lower(f.name) ~ '(ability score improvement|\\basi\\b)'
      OR lower(coalesce(f.description, '')) ~ '(ability score improvement|\\basi\\b)'
      OR lower(coalesce(f.prerequisites, '')) ~ '(ability score improvement|\\basi\\b)'
    )
),
abilities AS (
  SELECT unnest(ARRAY['STR','AGI','VIT','INT','SENSE','PRE']) AS ability
),
ability_pairs AS (
  SELECT a1.ability AS a, a2.ability AS b
  FROM abilities a1
  JOIN abilities a2 ON a2.ability > a1.ability
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  'asi_' || lower(p.a) || '_' || lower(p.b) || '_1_1' AS option_key,
  '+1 ' || p.a || ' / +1 ' || p.b AS name,
  NULL AS description,
  jsonb_build_array(
    jsonb_build_object('type','ability_increase','ability',p.a,'amount',1),
    jsonb_build_object('type','ability_increase','ability',p.b,'amount',1)
  ) AS grants
FROM asi_groups g
CROSS JOIN ability_pairs p
ON CONFLICT (group_id, option_key) DO NOTHING;

-- Feat choices (1 option per compendium_feats row)
WITH asi_groups AS (
  SELECT g.id AS group_id
  FROM public.compendium_feature_choice_groups g
  JOIN public.compendium_job_features f ON f.id = g.feature_id
  WHERE g.choice_key = 'asi_or_feat'
    AND (
      lower(f.name) ~ '(ability score improvement|\\basi\\b)'
      OR lower(coalesce(f.description, '')) ~ '(ability score improvement|\\basi\\b)'
      OR lower(coalesce(f.prerequisites, '')) ~ '(ability score improvement|\\basi\\b)'
    )
),
feat_keys AS (
  SELECT
    name,
    regexp_replace(regexp_replace(lower(name), '[^a-z0-9]+', '_', 'g'), '^_+|_+$', '', 'g') AS key
  FROM public.compendium_feats
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  g.group_id,
  'feat_' || coalesce(nullif(fk.key, ''), 'option') AS option_key,
  'Feat: ' || fk.name AS name,
  NULL AS description,
  jsonb_build_array(
    jsonb_build_object('type','feat','name',fk.name)
  ) AS grants
FROM asi_groups g
CROSS JOIN feat_keys fk
ON CONFLICT (group_id, option_key) DO NOTHING;

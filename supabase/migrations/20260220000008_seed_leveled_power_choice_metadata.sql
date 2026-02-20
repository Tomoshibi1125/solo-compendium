-- Auto-seed leveled power selection protocols (idempotent)
-- Seeds choice groups + options for features that offer a leveled power/spell choice,
-- restricted by job progression (max power level unlocked) and by compendium_powers.job_names.

ALTER TABLE public.compendium_powers
ADD COLUMN IF NOT EXISTS path_names TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS regent_names TEXT[] DEFAULT '{}';

WITH eligible_features AS (
  SELECT
    f.id AS feature_id,
    j.name AS job_name,
    jp.name AS path_name,
    f.level AS feature_level,
    CASE
      WHEN lower(j.name) IN (
        'mage',
        'necromancer',
        'technomancer',
        'oracle',
        'resonant',
        'invoker'
      ) THEN
        CASE
          WHEN f.level >= 17 THEN 9
          WHEN f.level >= 15 THEN 8
          WHEN f.level >= 13 THEN 7
          WHEN f.level >= 11 THEN 6
          WHEN f.level >= 9 THEN 5
          WHEN f.level >= 7 THEN 4
          WHEN f.level >= 5 THEN 3
          WHEN f.level >= 3 THEN 2
          ELSE 1
        END
      WHEN lower(j.name) IN ('crusader', 'stalker') THEN
        CASE
          WHEN f.level >= 17 THEN 5
          WHEN f.level >= 13 THEN 4
          WHEN f.level >= 9 THEN 3
          WHEN f.level >= 5 THEN 2
          WHEN f.level >= 2 THEN 1
          ELSE 0
        END
      WHEN lower(j.name) IN ('contractor') THEN
        CASE
          WHEN f.level >= 9 THEN 5
          WHEN f.level >= 7 THEN 4
          WHEN f.level >= 5 THEN 3
          WHEN f.level >= 3 THEN 2
          ELSE 1
        END
      ELSE 0
    END AS max_power_level
  FROM public.compendium_job_features f
  JOIN public.compendium_jobs j ON j.id = f.job_id
  LEFT JOIN public.compendium_job_paths jp ON jp.id = f.path_id
  WHERE lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(choose|select|pick)'
    AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) ~ '(power|spell)'
    AND lower(f.name || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.prerequisites, '')) !~ 'cantrip'
), eligible_features_with_options AS (
  SELECT ef.*
  FROM eligible_features ef
  WHERE ef.max_power_level >= 1
    AND EXISTS (
      SELECT 1
      FROM public.compendium_powers p
      WHERE p.power_level BETWEEN 1 AND ef.max_power_level
        AND (
          p.job_names @> ARRAY[ef.job_name]::text[]
          OR (ef.path_name IS NOT NULL AND p.path_names @> ARRAY[ef.path_name]::text[])
        )
    )
)
INSERT INTO public.compendium_feature_choice_groups (feature_id, choice_key, choice_count, prompt)
SELECT
  ef.feature_id,
  'leveled_power' AS choice_key,
  1 AS choice_count,
  'Select a power' AS prompt
FROM eligible_features_with_options ef
ON CONFLICT (feature_id, choice_key) DO NOTHING;

WITH eligible_groups AS (
  SELECT
    g.id AS group_id,
    ef.feature_id,
    ef.job_name,
    ef.path_name,
    ef.max_power_level
  FROM eligible_features_with_options ef
  JOIN public.compendium_feature_choice_groups g
    ON g.feature_id = ef.feature_id
   AND g.choice_key = 'leveled_power'
)
INSERT INTO public.compendium_feature_choice_options (group_id, option_key, name, description, grants)
SELECT
  eg.group_id,
  'power_' || regexp_replace(lower(p.name), '[^a-z0-9]+', '_', 'g') AS option_key,
  p.name,
  p.description,
  jsonb_build_array(jsonb_build_object('type','power','name',p.name)) AS grants
FROM eligible_groups eg
JOIN public.compendium_powers p
  ON p.power_level BETWEEN 1 AND eg.max_power_level
 AND (
   p.job_names @> ARRAY[eg.job_name]::text[]
   OR (eg.path_name IS NOT NULL AND p.path_names @> ARRAY[eg.path_name]::text[])
 )
ON CONFLICT (group_id, option_key) DO NOTHING;

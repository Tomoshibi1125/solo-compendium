# Compendium Coverage (Schema + Automation Readiness)

Generated: `2026-01-08T17:23:50.253Z`

Source: `supabase/migrations`

## Coverage Summary

| Type | Table | Total | Required Fields | Complete | Required % | Automation Readiness |
|---|---|---:|---|---:|---:|---:|
| jobs | compendium_jobs | 5 | name, description, hit_die, primary_abilities, saving_throw_proficiencies | 5 | 100% | 100% |
| job_paths | compendium_job_paths | 78 | name, description, job_id | 78 | 100% | 100% |
| job_features | compendium_job_features | 466 | name, description, level, job_id | 466 | 100% | 100% |
| powers | compendium_powers | 330 | name, power_level, casting_time, range, duration, description | 330 | 100% | 100% |
| equipment | compendium_equipment | 151 | name, equipment_type, description | 151 | 100% | 100% |
| relics | compendium_relics | 12 | name, rarity, item_type, description | 12 | 100% | 100% |
| monsters | compendium_monsters | 471 | name, size, creature_type, cr, armor_class, hit_points_average, hit_points_formula, str, agi, vit, int, sense, pre | 471 | 100% | 100% |
| monster_actions | compendium_monster_actions | 471 | name, description, action_type, monster_id | 471 | 100% | 100% |
| monster_traits | compendium_monster_traits | 471 | name, description, monster_id | 471 | 100% | 100% |
| backgrounds | compendium_backgrounds | 13 | name, description | 13 | 100% | 100% |
| conditions | compendium_conditions | 15 | name, description | 15 | 100% | 100% |
| feats | compendium_feats | 69 | name, description | 69 | 100% | 100% |
| skills | compendium_skills | 36 | name, description, ability | 36 | 100% | 100% |
| monarchs | compendium_monarchs | 9 | name, title, theme, description, unlock_level | 9 | 100% | 100% |
| monarch_features | compendium_monarch_features | 187 | name, description, level, monarch_id | 187 | 100% | 100% |
| sovereigns | compendium_sovereigns | 4 | name, description, unlock_level | 4 | 100% | 100% |
| sovereign_features | compendium_sovereign_features | 12 | name, description, level, sovereign_id | 12 | 100% | 100% |
| runes | compendium_runes | 4 | name, description, effect_description, effect_type, rune_category, rune_type, rune_level, rarity | 4 | 100% | 100% |
| shadow_soldiers | compendium_shadow_soldiers | 9 | name, title, rank, description, shadow_type, hit_points, armor_class, speed, str, agi, vit, int, sense, pre | 9 | 100% | 100% |

## Totals

- Total entries: 2813
- Entries meeting all required fields: 2813
- Overall required-field completeness: 100%

## Notes

- Supabase fetch failed: Failed to fetch compendium_jobs: TypeError: fetch failed
- Coverage derived from SQL migrations in supabase/migrations.
- Statements parsed: 710; statements skipped: 0.
- SELECT-based inserts are counted as one row per SELECT or UNION ALL clause.
- Required fields are derived from app automation usage and table schemas.
- Automation readiness is the percent of entries with all required fields present.

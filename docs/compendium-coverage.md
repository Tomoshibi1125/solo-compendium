# Compendium Coverage (Schema + Automation Readiness)

Generated: `2026-01-11T18:01:34.717Z`

Source: `https://hqouinpnnmjjtvgjrnff.supabase.co`

## Coverage Summary

| Type | Table | Total | Required Fields | Complete | Required % | Automation Readiness |
|---|---|---:|---|---:|---:|---:|
| jobs | compendium_jobs | 13 | name, description, hit_die, primary_abilities, saving_throw_proficiencies | 13 | 100% | 100% |
| job_paths | compendium_job_paths | 78 | name, description, job_id | 78 | 100% | 100% |
| job_features | compendium_job_features | 556 | name, description, level, job_id | 556 | 100% | 100% |
| powers | compendium_powers | 322 | name, power_level, casting_time, range, duration, description | 322 | 100% | 100% |
| equipment | compendium_equipment | 104 | name, equipment_type, description | 104 | 100% | 100% |
| relics | compendium_relics | 12 | name, rarity, item_type, description | 12 | 100% | 100% |
| monsters | compendium_monsters | 410 | name, size, creature_type, cr, armor_class, hit_points_average, hit_points_formula, str, agi, vit, int, sense, pre | 410 | 100% | 100% |
| monster_actions | compendium_monster_actions | 410 | name, description, action_type, monster_id | 410 | 100% | 100% |
| monster_traits | compendium_monster_traits | 410 | name, description, monster_id | 410 | 100% | 100% |
| backgrounds | compendium_backgrounds | 13 | name, description | 13 | 100% | 100% |
| conditions | compendium_conditions | 15 | name, description | 15 | 100% | 100% |
| feats | compendium_feats | 69 | name, description | 69 | 100% | 100% |
| skills | compendium_skills | 18 | name, description, ability | 18 | 100% | 100% |
| monarchs | compendium_monarchs | 9 | name, title, theme, description, unlock_level | 9 | 100% | 100% |
| monarch_features | compendium_monarch_features | 181 | name, description, level, monarch_id | 181 | 100% | 100% |
| sovereigns | compendium_sovereigns | 4 | name, description, unlock_level | 4 | 100% | 100% |
| sovereign_features | compendium_sovereign_features | 12 | name, description, level, sovereign_id | 12 | 100% | 100% |
| runes | compendium_runes | 0 | name, description, effect_description, effect_type, rune_category, rune_type, rune_level, rarity | 0 | 0% | 0% |
| shadow_soldiers | compendium_shadow_soldiers | 9 | name, title, rank, description, shadow_type, hit_points, armor_class, speed, str, agi, vit, int, sense, pre | 9 | 100% | 100% |

## Totals

- Total entries: 2645
- Entries meeting all required fields: 2645
- Overall required-field completeness: 100%

## Notes

- Required fields are derived from app automation usage and table schemas.
- Automation readiness is the percent of entries with all required fields present.

## Integrity Checks

- Mode: `supabase`
- Result: ✅ PASS
- Issues: 0

### Integrity Notes

- Integrity checks executed against live Supabase tables.

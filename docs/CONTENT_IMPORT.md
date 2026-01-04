# Content Import Guide

This guide explains how to import homebrew content into the Solo Compendium database.

## Import Format

Content is imported as JSON bundles with the following structure:

```json
{
  "version": "1.0.0",
  "jobs": [...],
  "job_paths": [...],
  "job_features": [...],
  "powers": [...],
  "relics": [...],
  "monsters": [...],
  "backgrounds": [...]
}
```

## Using the Admin UI

1. Navigate to `/admin` in the application
2. Either:
   - Upload a JSON file using the file picker
   - Paste JSON content directly into the text area
3. Click "Validate" to check for errors
4. Review validation results
5. Click "Import" to import the content (or "Dry Run" to test without importing)

## Import Options

- **Dry Run**: Validates content without importing (useful for testing)
- **Overwrite**: Updates existing entries with the same name instead of skipping

## Content Schemas

### Job

```json
{
  "name": "Job Name",
  "description": "Full description of the job",
  "flavor_text": "Optional flavor text",
  "primary_abilities": ["STR", "AGI"],
  "secondary_abilities": ["VIT"],
  "hit_die": 10,
  "armor_proficiencies": ["Light Armor", "Medium Armor"],
  "weapon_proficiencies": ["Simple Weapons", "Martial Weapons"],
  "tool_proficiencies": ["Smith's Tools"],
  "saving_throw_proficiencies": ["STR", "AGI"],
  "skill_choices": ["Athletics", "Acrobatics", "Stealth"],
  "skill_choice_count": 2,
  "source_book": "Solo Compendium",
  "tags": ["combat", "martial"],
  "source_kind": "homebrew",
  "source_name": "Solo Compendium Homebrew"
}
```

### Job Path

```json
{
  "job_name": "Job Name",
  "name": "Path Name",
  "description": "Path description",
  "path_level": 3,
  "source_kind": "homebrew",
  "source_name": "Solo Compendium Homebrew"
}
```

### Job Feature

```json
{
  "job_name": "Job Name",
  "path_name": "Path Name (optional)",
  "name": "Feature Name",
  "level": 1,
  "description": "Feature description",
  "action_type": "action",
  "uses_formula": "proficiency bonus",
  "recharge": "short-rest",
  "prerequisites": "Optional prerequisites",
  "is_path_feature": false
}
```

### Power

```json
{
  "name": "Power Name",
  "power_level": 1,
  "school": "Evocation",
  "casting_time": "1 action",
  "range": "60 feet",
  "duration": "Instantaneous",
  "components": "V, S",
  "concentration": false,
  "ritual": false,
  "description": "Power description",
  "higher_levels": "At higher levels...",
  "job_names": ["Mage", "Cleric"],
  "source_kind": "homebrew",
  "source_name": "Solo Compendium Homebrew"
}
```

### Relic

```json
{
  "name": "Relic Name",
  "rarity": "rare",
  "relic_tier": "awakened",
  "item_type": "Weapon",
  "requires_attunement": true,
  "attunement_requirements": "By a Hunter",
  "description": "Relic description",
  "properties": ["+1 to attack and damage"],
  "quirks": ["Glows in darkness"],
  "corruption_risk": "Low",
  "value_credits": 5000,
  "source_kind": "homebrew",
  "source_name": "Solo Compendium Homebrew"
}
```

### Monster

```json
{
  "name": "Monster Name",
  "size": "medium",
  "creature_type": "Humanoid",
  "alignment": "Chaotic Evil",
  "cr": "1/2",
  "armor_class": 13,
  "hit_points_average": 22,
  "hit_points_formula": "4d8 + 4",
  "speed_walk": 30,
  "str": 12,
  "agi": 14,
  "vit": 13,
  "int": 10,
  "sense": 11,
  "pre": 9,
  "source_kind": "homebrew",
  "source_name": "Solo Compendium Homebrew"
}
```

### Background

```json
{
  "name": "Background Name",
  "description": "Background description",
  "feature_name": "Feature Name",
  "feature_description": "Feature description",
  "skill_proficiencies": ["Investigation", "Insight"],
  "tool_proficiencies": ["Thieves' Tools"],
  "language_count": 1,
  "starting_equipment": "Equipment list",
  "starting_credits": 15,
  "source_kind": "homebrew",
  "source_name": "Solo Compendium Homebrew"
}
```

## Provenance Fields

All content should include provenance tracking:

- `source_kind`: `"homebrew"` | `"srd"` | `"generated"`
- `source_name`: Name of the source (e.g., "Solo Compendium Homebrew")
- `license_note`: Optional license/attribution note
- `generated_reason`: Required if `source_kind` is `"generated"` - explains what gap it filled
- `theme_tags`: Optional array of theme tags (e.g., `["Solo", "Gravesong"]`)

## Validation Rules

The validator checks:

1. **Schema Validation**: All required fields present and correct types
2. **Referential Integrity**: Job paths reference valid jobs, features reference valid jobs/paths
3. **Duplicate Detection**: Warns about duplicate names
4. **Data Constraints**: Ability scores in valid range, levels 1-20, etc.

## Import Order

Content is imported in this order to maintain referential integrity:

1. Jobs (referenced by paths and features)
2. Job Paths (referenced by path features)
3. Job Features (can reference jobs and paths)
4. Powers
5. Relics
6. Monsters
7. Backgrounds

## Error Handling

- **Validation Errors**: Must be fixed before import
- **Import Errors**: Individual items may fail, but others will still import
- **Warnings**: Non-fatal issues (duplicates, missing references) that don't block import

## Best Practices

1. Always validate before importing
2. Use dry run first to test imports
3. Include provenance information for all content
4. Keep content files version controlled
5. Test imports in a development environment first


## Compendium Coverage (Schema + Automation Readiness)

This repo’s compendium is stored primarily in Supabase tables (`compendium_*`) and seeded/updated via migrations in `supabase/migrations/`.

This report focuses on:
- **What categories exist**
- **What fields are required for automation**
- **How to generate real counts + gap lists**

---

## Categories (Tables)

Core compendium tables include:

- Jobs: `compendium_jobs`, `compendium_job_paths`, `compendium_job_features`
- Powers/Spells/Techniques: `compendium_powers`
- Equipment + Relics: `compendium_equipment`, `compendium_relics`
- Monsters: `compendium_monsters`
- Backgrounds/Feats/Skills: `compendium_backgrounds`, `compendium_feats`, `compendium_skills`
- Conditions: `compendium_conditions`
- Runes + Shadow Soldiers: `compendium_runes`, `compendium_shadow_soldiers`
- Monarchs/Sovereigns: `compendium_monarchs`, `compendium_monarch_features`, `compendium_sovereigns`, `compendium_sovereign_features`

---

## Automation Readiness (What the App Uses)

### Equipment

Used by:
- `src/lib/equipmentModifiers.ts` (parses `properties`, applies bonuses)
- `src/components/character/EquipmentList.tsx`

Recommended minimum fields:
- `name`
- `equipment_type` / `item_type`
- `properties` (modifier-friendly strings like `+1 AC`, `+2 STR`, etc.)
- `requires_attunement` (if applicable)

### Runes

Used by:
- `src/lib/runeAutomation.ts`
- `src/hooks/useRunes.ts`
- `src/components/character/ActionsList.tsx`

Recommended minimum fields:
- `effect_type` (passive/active/both)
- `passive_bonuses` (structured bonuses for automation)
- `activation_action`, `uses_per_rest`, `recharge` (for active abilities)

### Powers

Used by:
- `src/components/character/PowersList.tsx`
- `src/hooks/useSpellSlots.ts`

Recommended minimum fields:
- `power_level`, `casting_time`, `range`, `duration`, `concentration`, `school`, `components`

Note: spell effect automation is intentionally minimal; the compendium powers are used for presentation + selection + slot consumption.

### Conditions

Used by:
- `src/lib/conditions.ts`
- `src/pages/CharacterSheet.tsx`

Recommended minimum fields:
- `name`
- machine-readable effect tags/fields where present (varies by schema/migrations)

---

## How to Generate Counts + Gaps (Repo-Truth)

### In-app audit (recommended)

If Supabase is configured and populated:

1. Run `npm run dev`
2. Navigate to `/admin/audit`
3. Export the JSON report (includes per-table counts + completeness metrics)

Implementation:
- `src/hooks/useContentAudit.ts`
- `src/pages/admin/ContentAudit.tsx`

### Coverage snapshot doc sources

- Seed/migration-driven content: `supabase/migrations/*`
- SRD coverage summary: `docs/SRD_COVERAGE.md`
- Wiring integrity proof: `src/test/parity/linkIntegrity.test.ts`

---

## Top Gaps / Follow-ups

Common “coverage” gaps that affect UX/automation:

- Missing `description` (hurts compendium UX)
- Missing `image_url` (hurts browsing polish)
- Missing `tags` / `source_*` provenance fields (hurts filtering and legal clarity)

Use `/admin/audit` to see exact tables/rows that need improvement.



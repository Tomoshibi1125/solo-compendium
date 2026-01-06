# Parity Audit — D&D Beyond-like Systems Verification

**Date**: 2026-01-06  
**Status**: ✅ Phase 7 (Final Verification) complete  
**Objective**: Prove all D&D Beyond-like systems are functional with evidence-backed documentation

---

## Repo Map

### Core Architecture

**Package Manager**: npm  
**Build Tool**: Vite  
**Test Framework**: Vitest (unit) + Playwright (e2e)  
**Database**: Supabase (PostgreSQL)

### Key Directories & Modules

#### Compendium Data & Schema
- **Database Schema**: `src/integrations/supabase/types.ts` - Auto-generated TypeScript types
- **Migrations**: `supabase/migrations/` - 60+ migration files
- **Entity Types**: 14 compendium tables (jobs, paths, powers, runes, relics, monsters, backgrounds, conditions, monarchs, feats, skills, equipment, shadow-soldiers, sovereigns)
- **Full repo map**: `docs/REPO_MAP.md`

#### Reference Resolver
- **Location**: `src/lib/compendiumResolver.ts`
- **Functions**: `resolveRef()`, `resolveRefs()`, `getTableName()`, `validateRef()`, `isValidEntryType()`
- **Purpose**: Single source of truth for compendium entity resolution

#### Character Model & Store
- **Main Table**: `characters` (Supabase)
- **Related Tables**: `character_equipment`, `character_features`, `character_powers`, `character_rune_inscriptions`, `character_rune_knowledge`, `character_spell_slots`, `character_shadow_army`
- **Hooks**: `src/hooks/useCharacters.ts` - Character CRUD operations

#### Automation Engine
- **Effects Engine**: `src/lib/effectsEngine.ts` - Unified effects/modifiers system
- **Character Calculations**: `src/lib/characterCalculations.ts` - Derived stats (AC, saves, skills, proficiency)
- **Equipment Modifiers**: `src/lib/equipmentModifiers.ts` - Equipment property parsing and application
- **Rest System**: `src/lib/restSystem.ts` - Short/long rest mechanics
- **Rune Automation**: `src/lib/runeAutomation.ts` - Rune learning and inscription
- **Conditions**: `src/lib/conditions.ts` - Condition effects and mechanics

#### UI Routes & Pages
- **Builder**: `src/pages/CharacterNew.tsx` - Character creation wizard
- **Sheet**: `src/pages/CharacterSheet.tsx` - Main character display
- **Level Up**: `src/pages/CharacterLevelUp.tsx` - Level-up interface
- **Compendium Browser**: `src/pages/Compendium.tsx` - Main compendium search/browse
- **Compendium Detail**: `src/pages/compendium/CompendiumDetail.tsx` - Individual entry detail
- **DM Tools**: `src/pages/dm-tools/` - Initiative tracker, encounter builder, etc.

#### Dice & Game Log
- **Dice Roller**: `src/lib/diceRoller.ts` - Dice string parsing and rolling
- **Roll Engine**: `src/lib/rollEngine.ts` - Advanced roll mechanics (advantage/disadvantage)
- **Roll History**: `src/hooks/useRollHistory.ts` - Roll persistence

#### Link Integrity
- **Checker**: `src/lib/linkIntegrity.ts` - Dead reference detection
- **Integration**: `src/pages/admin/ContentAudit.tsx` - Admin tool integration

---

## Parity Matrix

### Legend
- ✅ **Done** - Feature exists, verified functional, evidence provided
- ⚠️ **Partial** - Feature exists but has gaps or needs verification
- ❌ **Missing** - Feature not implemented or broken
- 🔧 **Needs Fix** - Feature exists but needs correction

---

## A) Compendium & Navigation

| Feature/System | Status | Evidence | Gaps | Fix Plan |
|----------------|--------|----------|------|----------|
| **Global Search** | ✅ | `src/components/ui/GlobalSearch.tsx` + `e2e/global-search.spec.ts` | None | — |
| **Deep Links** | ✅ | `src/components/character/CompendiumLink.tsx` | None | — |
| **Reference Resolver** | ✅ | `src/lib/compendiumResolver.ts` + `src/test/parity/linkIntegrity.test.ts` | None | — |
| **Link Integrity** | ✅ | `src/lib/linkIntegrity.ts` + `src/test/parity/linkIntegrity.test.ts` | None | — |
| **Related Content** | ✅ | `src/components/compendium/RelatedContent.tsx` + `src/pages/compendium/CompendiumDetail.tsx` | None | — |
| **Command Palette** | ✅ | `src/components/ui/CommandPalette.tsx` | Not e2e-verified yet | Add Playwright smoke coverage in Phase 5 |

---

## B) Character Builder

| Feature/System | Status | Evidence | Gaps | Fix Plan |
|----------------|--------|----------|------|----------|
| **Step-by-Step Wizard** | ✅ | `src/pages/CharacterNew.tsx` + `e2e/character.spec.ts` | None | — |
| **Ability Score Methods** | ✅ | `src/lib/system-flows.test.ts` (Ability Score Generation) | None | — |
| **Job Selection** | ✅ | `src/pages/CharacterNew.tsx` + `src/lib/system-flows.test.ts` (Job Selection & Validation) | None | — |
| **Path Selection** | ✅ | `src/pages/CharacterNew.tsx` + `src/lib/system-flows.test.ts` (Path Selection) | None | — |
| **Background Selection** | ✅ | `src/pages/CharacterNew.tsx` + `src/lib/system-flows.test.ts` (Background Selection) | None | — |
| **Prerequisites Validation** | ⚠️ | `src/pages/CharacterNew.tsx` (basic required-step validation) | Deeper prereqs may be incomplete | Audit + harden in Phase 2/4 if needed |
| **Builder → Sheet Consistency** | ✅ | `src/test/parity/automation.test.ts` (Builder → Sheet Consistency) | None | — |

---

## C) Character Sheet Automations

| Feature/System | Status | Evidence | Gaps | Fix Plan |
|----------------|--------|----------|------|----------|
| **Derived Stats** | ✅ | `src/lib/characterCalculations.ts` + `src/test/parity/automation.test.ts` | None | — |
| **AC Calculation** | ✅ | `src/lib/equipmentModifiers.ts` + `src/test/parity/automation.test.ts` | None | — |
| **Attacks** | ⚠️ | `src/components/character/ActionsList.tsx` + `src/test/parity/automation.test.ts` (Attack Roll Modifiers) | UI interaction not e2e-verified | Add e2e + slot/roll integration tests |
| **Spellcasting** | ✅ | `src/components/character/PowersList.tsx`, `src/components/character/SpellSlotsDisplay.tsx`, `src/hooks/useSpellSlots.ts`, `src/components/character/PowersList.test.tsx` | None | — |
| **Conditions** | ✅ | `src/lib/conditions.ts` + `src/pages/CharacterSheet.tsx` + `src/test/parity/automation.test.ts` | None | — |
| **Rests** | ✅ | `src/lib/restSystem.ts` + `src/lib/system-flows.test.ts` + `src/test/parity/automation.test.ts` | None | — |
| **Runes** | ✅ | `src/lib/runeAutomation.ts` + `src/hooks/useRunes.ts` + `src/components/character/ActionsList.tsx` + `src/test/parity/automation.test.ts` | None | — |

---

## D) Dice + Game Log

| Feature/System | Status | Evidence | Gaps | Fix Plan |
|----------------|--------|----------|------|----------|
| **Dice Rolling** | ✅ | `src/lib/diceRoller.ts`, `src/lib/rollEngine.ts`, `src/lib/diceRoller.test.ts`, `src/lib/rollEngine.test.ts`, `src/pages/DiceRoller.tsx`, `e2e/dice.spec.ts` | None | — |
| **Roll History** | ✅ | `src/hooks/useRollHistory.ts`, `src/hooks/useRollHistory.test.tsx`, `src/components/character/RollHistoryPanel.tsx`, `supabase/migrations/20260104125806_bd02e25d-6866-4891-9e46-395931d3ed31.sql` | None | — |
| **Roll Display** | ✅ | `src/pages/DiceRoller.tsx` + `e2e/dice.spec.ts` | None | — |

---

## E) Encounters/Combat

| Feature/System | Status | Evidence | Gaps | Fix Plan |
|----------------|--------|----------|------|----------|
| **Initiative Tracker** | ⚠️ | `src/pages/dm-tools/InitiativeTracker.tsx` + `e2e/dm-tools.spec.ts` | Protected DM route; unauthenticated users redirect to `/auth` | Add authenticated DM e2e harness |
| **Encounter Builder** | ⚠️ | `src/pages/dm-tools/EncounterBuilder.tsx` + `e2e/dm-tools.spec.ts` | Protected DM route; unauthenticated users redirect to `/auth` | Add authenticated DM e2e harness |
| **Monster Addition** | ⚠️ | `src/pages/dm-tools/EncounterBuilder.tsx` | Not verified | Verify add-from-compendium path (requires seeded monsters) |

---

## Verification Results

- **CI loop (green)**: `npm install`, `npm run typecheck`, `npm run lint`, `npm run test -- --run`, `npm run build` all pass (see `docs/TEST_REPORT.md`).
- **Parity harness (green)**: `src/test/parity/` suite passes under `npm run test -- --run`.
- **E2E smoke (green-ish)**: `npm run test:e2e` passes with some skips (see `docs/TEST_REPORT.md`).

---

## Gaps Identified

- **DM tools parity**: Initiative/encounter workflows require authenticated DM access; current e2e only verifies route wiring + protected-route behavior.

---

## Fixes Applied

- **Phase 1 CI loop fixes** (proven green; see `docs/TEST_REPORT.md`)
  - Removed explicit `any`/unused `eslint-disable` directives in:
    - `src/components/ui/CommandPalette.tsx`
    - `src/lib/compendiumResolver.ts`
    - `src/lib/effectsEngine.ts`
    - `src/test/parity/automation.test.ts`
    - `src/test/parity/linkIntegrity.test.ts`
  - Fixed parity HP test to pass VIT modifier into `calculateHPMax` (`src/test/parity/automation.test.ts`)
  - Skipped Supabase “connection probe” during Vitest to avoid happy-dom teardown aborts (`src/integrations/supabase/client.ts`)
- **Phase 2 gap fixes**
  - Expanded Global Search compendium coverage (runes/equipment/monarchs/sovereigns/backgrounds/conditions) in `src/components/ui/GlobalSearch.tsx`
  - Removed `any` casting from related-content queries in `src/pages/compendium/CompendiumDetail.tsx`
- **Phase 4 automation fixes**
  - Implemented rune active-ability use tracking (decrements `character_rune_inscriptions.uses_current`, increments `times_used`):
    - Hook: `src/hooks/useRunes.ts` (`useUseRune`)
    - UI wiring: `src/components/character/ActionsList.tsx` (Rune actions → “Use”)
  - Applied condition-based speed effects in the character sheet (`grappled/restrained` etc): `src/pages/CharacterSheet.tsx` via `getActiveConditionEffects()`
- **Phase 5 test + spellcasting proof**
  - Added component tests proving spell slot consumption on cast: `src/components/character/PowersList.test.tsx`
  - Exposed “Cast” for prepared cantrips (uses no slots; existing code path): `src/components/character/PowersList.tsx`
- **Phase 7 dice + game log verification**
  - Added dice engine unit tests: `src/lib/diceRoller.test.ts`, `src/lib/rollEngine.test.ts`
  - Fixed `rollEngine` defaulting to normal rolls when advantage/disadvantage is omitted: `src/lib/rollEngine.ts`
  - Removed `any` + `eslint-disable` from roll history hooks (typed Supabase table): `src/hooks/useRollHistory.ts`
  - Added Playwright smoke coverage: `e2e/global-search.spec.ts`, `e2e/dice.spec.ts`, `e2e/dm-tools.spec.ts`

## Architecture (Repo-Truth)

This document is the canonical, code-backed architecture overview for Solo Compendium.

---

## Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router (`src/App.tsx`)
- **Server state**: TanStack Query
- **Backend**: Supabase (Postgres + Auth + Storage)
- **Testing**: Vitest (unit/integration) + Playwright (e2e)

---

## Runtime Modes

### Setup Mode (no Supabase env)

- Supabase client is initialized with safe fallbacks (no throw).
- Protected routes redirect to `/setup`.

Key code:
- `src/integrations/supabase/client.ts`
- `src/components/auth/ProtectedRoute.tsx`
- `src/pages/Setup.tsx`

### Guest Mode (guest-lite)

- When unauthenticated, **one local Hunter** is stored in localStorage.
- Local IDs are prefixed with `local_`.

Key code:
- `src/lib/guestStore.ts`
- `src/hooks/useCharacters.ts` (+ local branching in other hooks)

---

## Domain Model

### Core types

- `src/types/solo-leveling.ts`: Ability scores, modifiers, proficiency bonus, core system constants.

### Character persistence

- **Supabase tables**: `characters`, `character_abilities`, `character_equipment`, `character_features`, `character_powers`, `character_spell_slots`, …
- **Guest store**: localStorage (`solo-compendium.guest.v1`) mirroring the minimum data needed to render the sheet.

Hooks:
- `src/hooks/useCharacters.ts`
- `src/hooks/useEquipment.ts`
- `src/hooks/useFeatures.ts`
- `src/hooks/usePowers.ts`
- `src/hooks/useSpellSlots.ts`

---

## Compendium Wiring

### Source of truth

Compendium entities live in Supabase compendium tables (e.g. `compendium_powers`, `compendium_equipment`, `compendium_jobs`, …).

### Reference resolution + integrity

- `src/lib/compendiumResolver.ts`: canonical `resolveRef(type, id)` API
- `src/lib/linkIntegrity.ts`: detects broken references across compendium/character data
- `src/test/parity/linkIntegrity.test.ts`: proves resolver + integrity checks

---

## Rules / Automation

The app’s “automation engine” is deterministic and derived from character base data + modifiers:

- **Derived stats**: `src/lib/characterCalculations.ts`
- **Equipment parsing/modifiers**: `src/lib/equipmentModifiers.ts`
- **Effects aggregation**: `src/lib/effectsEngine.ts`
- **Rest system**: `src/lib/restSystem.ts`
- **Runes automation**: `src/lib/runeAutomation.ts`
- **Conditions**: `src/lib/conditions.ts`
- **Dice**: `src/lib/diceRoller.ts`, `src/lib/rollEngine.ts`

Parity tests:
- `src/test/parity/automation.test.ts`

---

## Primary User Flows

- **Compendium browse/search**: `src/pages/Compendium.tsx`, `src/components/ui/GlobalSearch.tsx`
- **Character builder**: `src/pages/CharacterNew.tsx` + automation wiring in `src/lib/characterCreation.ts`
- **Character sheet**: `src/pages/CharacterSheet.tsx`
- **Dice roller**: `src/pages/DiceRoller.tsx`
- **DM tools**: `src/pages/dm-tools/*` (gated by `ProtectedRoute`)

---

## Adding Homebrew Safely (No Copyrighted Text)

- Do **not** copy D&D Beyond / non-SRD book text.
- Prefer original phrasing and Solo Leveling themed names.
- For SRD-derived mechanics/content, ensure provenance fields are set (where present), e.g.:
  - `source_kind`, `source_name`, `license_note`

For DB changes/content seeding:
- Use migrations in `supabase/migrations/`.

---

## Testing Strategy

- Unit/integration: `npm run test -- --run`
- Parity harness: `src/test/parity/*`
- E2E smoke: `npm run test:e2e`

Evidence:
- `docs/TEST_REPORT.md`


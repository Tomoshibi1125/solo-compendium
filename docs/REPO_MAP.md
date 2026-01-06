# Repository Map

This document provides a comprehensive map of the Solo Compendium codebase, organized by functional area.

## Table of Contents

- [Compendium Data](#compendium-data)
- [Rules & Automation Engine](#rules--automation-engine)
- [Character Model & Store](#character-model--store)
- [UI Pages & Components](#ui-pages--components)
- [Dice & Game Log System](#dice--game-log-system)
- [Deployment Configuration](#deployment-configuration)

---

## Compendium Data

**Location**: Supabase PostgreSQL database

### Database Schema
- **Type Definitions**: `src/integrations/supabase/types.ts`
  - Auto-generated TypeScript types from Supabase schema
  - Contains all table definitions, RPCs, and enums
  - Updated via `supabase gen types typescript`

### Migrations
- **Location**: `supabase/migrations/`
- **Count**: 60+ migration files
- **Key Migrations**:
  - `20260104000000_add_provenance_tracking.sql` - Content source tracking
  - `20260107000001_create_runes_system.sql` - Rune system tables
  - `20260108000001_add_fulltext_search_functions.sql` - Full-text search RPCs
  - `20260111000000_add_spell_slot_tracking.sql` - Spell slot tracking

### Compendium Entity Types

The following entity types are stored in Supabase tables:

1. **Jobs** (`compendium_jobs`)
   - Character classes/jobs
   - Features, proficiencies, hit dice

2. **Paths** (`compendium_job_paths`)
   - Job specialization paths
   - Level-based feature progression

3. **Powers** (`compendium_powers`)
   - Spells and abilities
   - Casting requirements, effects

4. **Runes** (`compendium_runes`)
   - Inscribable runes for equipment
   - Passive bonuses, active abilities

5. **Relics** (`compendium_relics`)
   - Magic items and artifacts
   - Properties, attunement requirements

6. **Monsters** (`compendium_monsters`)
   - Creature stat blocks
   - Challenge ratings, abilities

7. **Backgrounds** (`compendium_backgrounds`)
   - Character backgrounds
   - Starting equipment, features

8. **Conditions** (`compendium_conditions`)
   - Status effects
   - Rules and mechanics

9. **Monarchs** (`compendium_monarchs`)
   - Monarch progression system
   - Features and abilities

10. **Sovereigns** (`compendium_sovereigns`)
    - Fusion of jobs/paths/monarchs
    - Advanced progression

11. **Feats** (`compendium_feats`)
    - Character feats
    - Prerequisites, benefits

12. **Skills** (`compendium_skills`)
    - Skill definitions
    - Ability associations

13. **Equipment** (`compendium_equipment`)
    - Weapons, armor, gear
    - Properties, modifiers

14. **Shadow Soldiers** (`compendium_shadow_soldiers`)
    - Shadow army units
    - Stats and abilities

### Content Access Patterns

- **Direct Queries**: Components query Supabase directly using `tableMap` pattern
- **Search**: Full-text search via RPC functions (`search_compendium_*`)
- **Reference Resolution**: Currently ad-hoc; needs centralized resolver (see Phase 2)

---

## Rules & Automation Engine

**Location**: `src/lib/`

### Core Calculation Files

1. **`characterCalculations.ts`**
   - Base stat calculations
   - Proficiency bonus, ability modifiers
   - Saving throws, skills, AC, speed
   - Functions: `calculateCharacterStats()`, `calculateHPMax()`, `formatModifier()`

2. **`equipmentModifiers.ts`**
   - Equipment property parsing
   - Modifier application (AC, attack, damage, abilities)
   - Functions: `parseModifiers()`, `applyEquipmentModifiers()`

3. **`automation.ts`**
   - Auto-calculation triggers
   - Level-up automation
   - System favor, shadow energy calculations
   - Functions: `autoCalculateCharacterStats()`, `autoApplyLevelUpFeatures()`

4. **`restSystem.ts`**
   - Short rest mechanics
   - Long rest mechanics
   - Resource restoration (hit dice, features, spell slots)
   - Functions: `executeShortRest()`, `executeLongRest()`

5. **`runeAutomation.ts`**
   - Rune learning automation
   - Inscription validation
   - Passive bonus application
   - Functions: `autoLearnRunes()`, `canInscribeRune()`, `applyRuneBonuses()`

6. **`conditions.ts`**
   - Condition application/removal
   - Effect stacking rules
   - Functions: `applyCondition()`, `removeCondition()`

7. **`skills.ts`**
   - Skill calculations
   - Proficiency/expertise handling
   - Passive skill scores
   - Functions: `getAllSkills()`, `calculateSkillModifier()`, `calculatePassiveSkill()`

8. **`encumbrance.ts`**
   - Carrying capacity calculations
   - Encumbrance status (light/medium/heavy/overloaded)
   - Speed penalties
   - Functions: `calculateCarryingCapacity()`, `calculateEncumbrance()`

### Automation Flow

```
Character Data → characterCalculations.ts → Base Stats
Equipment → equipmentModifiers.ts → Equipment Modifiers
Runes → runeAutomation.ts → Rune Bonuses
Conditions → conditions.ts → Condition Effects
─────────────────────────────────────────────
→ Final Calculated Stats (displayed on sheet)
```

**Current State**: Automation exists but is scattered. Phase 3 will create unified effects engine.

---

## Character Model & Store

**Location**: Supabase `characters` table + related tables

### Character Data Structure

**Main Table**: `characters`
- Core stats: level, abilities, HP, AC, speed
- Proficiencies: saving throws, skills, armor, weapons, tools
- Resources: hit dice, system favor, shadow energy
- Metadata: name, appearance, backstory, notes

**Related Tables**:
- `character_equipment` - Inventory items
- `character_features` - Class/race features
- `character_powers` - Known/prepared spells
- `character_rune_inscriptions` - Inscribed runes on equipment
- `character_rune_knowledge` - Known runes
- `character_spell_slots` - Spell slot tracking
- `character_shadow_army` - Shadow soldiers
- `character_abilities` - Ability scores (if normalized)

### Character Hooks

**Location**: `src/hooks/useCharacters.ts`
- `useCharacter(id)` - Fetch single character
- `useCharacters()` - Fetch user's characters
- `useCreateCharacter()` - Create new character
- `useUpdateCharacter()` - Update character
- `useDeleteCharacter()` - Delete character
- `useGenerateShareToken()` - Generate share link

### Character Pages

1. **`src/pages/CharacterSheet.tsx`**
   - Main character display
   - Stat calculations, equipment, features
   - Actions, powers, runes, spell slots

2. **`src/pages/CharacterNew.tsx`**
   - Character creation wizard
   - Step-by-step: concept → abilities → job → path → background → review

3. **`src/pages/CharacterLevelUp.tsx`**
   - Level-up interface
   - Feature selection, HP increase, stat improvements

4. **`src/pages/Characters.tsx`**
   - Character list/grid view
   - Create, edit, delete characters

5. **`src/pages/CharacterCompare.tsx`**
   - Side-by-side character comparison
   - Stat differences, feature comparison

---

## UI Pages & Components

### Main Pages

**Location**: `src/pages/`

1. **Compendium**
   - `Compendium.tsx` - Main compendium browser/search
   - `compendium/CompendiumDetail.tsx` - Individual entry detail view

2. **Characters** (see Character Model section above)

3. **DM Tools**
   - `DMTools.tsx` - DM tools hub
   - `dm-tools/EncounterBuilder.tsx` - Build encounters
   - `dm-tools/InitiativeTracker.tsx` - Track initiative
   - `dm-tools/SessionPlanner.tsx` - Session planning
   - `dm-tools/VTTEnhanced.tsx` - Virtual tabletop
   - Plus 10+ other DM tool pages

4. **Dice**
   - `DiceRoller.tsx` - Standalone dice roller

5. **Campaigns**
   - `Campaigns.tsx` - Campaign list
   - `CampaignDetail.tsx` - Campaign detail
   - `CampaignJoin.tsx` - Join campaign

6. **Admin**
   - `Admin.tsx` - Admin dashboard
   - `admin/ContentAudit.tsx` - Content audit tool

### Component Structure

**Location**: `src/components/`

1. **Character Components** (`components/character/`)
   - `ActionsList.tsx` - Action cards with rolls
   - `EquipmentList.tsx` - Inventory management
   - `FeaturesList.tsx` - Feature display
   - `PowersList.tsx` - Spell/power list
   - `RunesList.tsx` - Rune knowledge/inscriptions
   - `SpellSlotsDisplay.tsx` - Spell slot tracker
   - Plus 15+ other character components

2. **Compendium Components** (`components/compendium/`)
   - `JobDetail.tsx`, `PowerDetail.tsx`, `RuneDetail.tsx`, etc. - Type-specific detail views
   - `CompendiumSidebar.tsx` - Filter sidebar
   - `CompendiumFilters.tsx` - Filter controls
   - `RelatedContent.tsx` - Related entries
   - `CompendiumLink.tsx` - Deep link component

3. **UI Components** (`components/ui/`)
   - Shadcn UI components (70+ files)
   - `SystemWindow.tsx` - Themed window component
   - `GlobalSearch.tsx` - Global search modal
   - `CommandPalette.tsx` - Command palette

4. **Layout Components** (`components/layout/`)
   - `Layout.tsx` - Main layout wrapper
   - `Header.tsx` - Navigation header

---

## Dice & Game Log System

### Dice Rolling

**Location**: `src/lib/diceRoller.ts`
- `rollDiceString(diceStr: string)` - Parse and roll dice string
- `formatRollResult(roll: DiceRoll)` - Format roll for display
- Supports: `1d20`, `2d6+3`, `1d8-1`, etc.

**Location**: `src/lib/rollEngine.ts`
- Advanced roll mechanics
- Advantage/disadvantage handling
- Roll modifiers and tags

### Roll History

**Location**: `src/hooks/useRollHistory.ts`
- `useRollHistory(characterId)` - Fetch roll history
- `addRollToHistory()` - Save roll to history
- Persisted to Supabase (if implemented) or localStorage

### Roll Display

**Location**: `src/components/character/ActionsList.tsx`
- Action cards with roll buttons
- Roll results displayed in toast notifications
- Roll history panel (`RollHistoryPanel.tsx`)

### 3D Dice Visualization

**Location**: `src/components/dice/Dice3D.tsx`
- Three.js-based 3D dice rendering
- Multiple themes (shadow-monarch, supreme-deity, etc.)
- Interactive dice rolling animation

---

## Deployment Configuration

### Build Configuration

**Location**: `vite.config.ts`
- Vite build configuration
- Code splitting (react-vendor, ui-vendor, query-vendor, supabase-vendor)
- PWA plugin configuration
- Sentry source map integration

### Vercel Configuration

**Location**: `vercel.json`
- Build command: `npm run build`
- Output directory: `dist`
- Framework: `vite`
- SPA rewrites: `/*` → `/index.html`
- Asset caching headers

### Environment Variables

**Required**:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key

**Optional**:
- `VITE_SENTRY_DSN` - Sentry error tracking
- `VITE_SENTRY_ORG` - Sentry organization
- `VITE_SENTRY_PROJECT` - Sentry project
- `SENTRY_AUTH_TOKEN` - Sentry auth token (build-time)

### Deployment Scripts

**Location**: `package.json` scripts
- `build` - Production build
- `preview` - Preview production build
- `deploy:check` - Run all checks before deploy

### Database Migrations

**Location**: `supabase/migrations/`
- Apply via: `supabase migration up`
- Verify via: `supabase db diff`

### Storage Buckets

**Required Supabase Storage Buckets**:
- `character-portraits` - Character portrait images
- `compendium-images` - Compendium entry images (if using storage)

---

## Key Architectural Patterns

### State Management
- **Server State**: TanStack Query (`@tanstack/react-query`)
- **Local State**: React hooks (`useState`, `useReducer`)
- **Form State**: React Hook Form (`react-hook-form`)

### Data Fetching
- All Supabase queries via TanStack Query hooks
- Query keys: `['character', id]`, `['compendium', type]`, etc.
- Automatic caching and refetching

### Routing
- React Router v6 (`react-router-dom`)
- Lazy-loaded routes for code splitting
- Protected routes via `ProtectedRoute` component

### Error Handling
- Error boundary: `src/components/ErrorBoundary.tsx`
- Toast notifications: `src/hooks/use-toast.ts`
- Sentry integration: `src/lib/sentry.ts`

### Type Safety
- Full TypeScript coverage
- Generated Supabase types: `src/integrations/supabase/types.ts`
- Custom types: `src/types/solo-leveling.ts`

---

## Testing Structure

### Unit Tests
- **Location**: `src/lib/*.test.ts`
- **Framework**: Vitest
- **Files**: `automation.test.ts`, `system-flows.test.ts`, `utils.test.ts`

### E2E Tests
- **Location**: `e2e/*.spec.ts`
- **Framework**: Playwright
- **Files**: `home.spec.ts`, `search.spec.ts`, `compendium.spec.ts`, `compendium-detail.spec.ts`, `character.spec.ts`

### Test Configuration
- **Location**: `vitest.config.ts`
- **Environment**: happy-dom
- **Setup**: `src/test/setup.ts`

---

## Next Steps

See the plan document for:
- Phase 2: Creating centralized reference resolver
- Phase 3: Unified effects engine
- Phase 4: Comprehensive test suite
- Phase 5: UX polish
- Phase 6: Deploy readiness


# Persistence Matrix

This document tracks what state is persisted, where it lives (account-backed, campaign-backed, or local-only), and whether a local mirror exists for offline continuity.

## Legend

- **Account-backed**: stored per authenticated user.
- **Campaign-backed**: stored per campaign (shared among members).
- **Local-only**: stored in browser storage only.
- **Local mirror**: a localStorage copy is maintained to support offline/failed-remote continuity.

## State Buckets

### Warden tools (campaign operations)

- **Campaign tool state (generic Warden tool UIs)**
  - **Scope**: Campaign-backed
  - **Remote**: `campaign_tool_states` (Supabase)
  - **Local mirror**: Yes (`localStorage` via `useCampaignToolState`)
  - **Notes**: Remote load hydrates local; save writes local first, then remote.

- **Combat/session live sync**
  - **Scope**: Campaign-backed
  - **Remote**: `campaign_combat_sessions`, `campaign_combat_state` (and related RPCs)
  - **Local mirror**: Partial
  - **Notes**: Live sync depends on `sessionId`; when live sync unavailable, tool-state persistence acts as fallback.

- **Campaign journal / handouts / session logs**
  - **Scope**: Campaign-backed
  - **Remote**: `vtt_journal_entries`
  - **Local mirror**: Yes (`localStorage` key `vtt-journal-${campaignId}` in `VTTJournal.tsx`)
  - **Notes**: Visibility gating is enforced client-side (`visible_to_players`), and entries hydrate local.

### Player character state

- **Core character record**
  - **Scope**: Account-backed (implicitly via ownership / RLS)
  - **Remote**: `characters` + related tables
  - **Local mirror**: Yes for guests (`guestStore`)

- **Character sheet state (resources, custom modifiers)**
  - **Scope**: Character-backed (remote per character)
  - **Remote**: `character_sheet_state`
  - **Local mirror**: Yes
    - Authed: `localStorage` cache key `solo-compendium.cache.character-sheet-state.${userId}.character:${characterId}.v1`
    - Guest: `guestStore` (`getLocalCharacterSheetState` / `setLocalCharacterSheetState`)

- **Spell slots**
  - **Scope**: Character-backed
  - **Remote**: `character_spell_slots` (via `useSpellSlots` / `useUpdateSpellSlot` / `useInitializeSpellSlots` / `useRecoverSpellSlots`)
  - **Local mirror**: Yes
    - Authed: `localStorage` cache key `solo-compendium.cache.spell-slots.${userId}.character:${characterId}.v1` (write-through on fetch/update/initialize/recover; read-fallback on Supabase error).
    - Guest: `guestStore` (`listLocalSpellSlots` / `upsertLocalSpellSlot` / `updateLocalSpellSlotRow`).
  - **Notes**: Eagerly seeded during `CharacterNew` via `useInitializeSpellSlots` so the spells panel renders slots on first load instead of relying on lazy creation.

- **Character journal (player notes per character)**
  - **Scope**: Character-backed
  - **Remote**: `character_journal`
  - **Local mirror**: Yes (`localStorage` key `solo-compendium.character-journal.${characterId}.v1`)
  - **Notes**: Local is written before remote create/update/delete; remote hydration mirrors to local.

### Account-level UI state

- **User tool state (generic UI/tool preferences)**
  - **Scope**: Account-backed
  - **Remote**: `user_tool_states`
  - **Local mirror**: Yes (`localStorage` via `useUserToolState`)

- **Preferred campaign selection**
  - **Scope**: Account-backed (via tool state)
  - **Remote**: `user_tool_states` (implementation-specific key)
  - **Local mirror**: Yes

### Assets

- **Compendium / rules data**
  - **Scope**: Local-only (bundled/generated)
  - **Remote**: N/A
  - **Local mirror**: N/A

- **User-uploaded assets (portraits, tokens, etc.)**
  - **Scope**: Account-backed or campaign-backed depending on storage bucket/RLS
  - **Remote**: Supabase Storage buckets
  - **Local mirror**: No

## Prioritization Notes (parity)

- **High priority**
  - Player-facing campaign handouts UI (if missing) that reads `vtt_journal_entries` with player visibility
  - _(Spell slots local mirror — closed; see entry above.)_

- **Medium priority**
  - Broader offline queue support for journal mutations (optional) using `offlineSync`

## Canonical persistence (Apr 2026 remediation)

The canonical persistence remediation pass introduced canonical-ID columns and dual-write paths across every character-owned table that references a `compendium_*` row. See `docs/ra-canonical-persistence-audit-2026.md` for full per-phase detail.

### Schema and types

- **`characters`** carries `job_id`, `path_id`, `background_id` alongside the legacy name fields.
- **`character_powers`**: `power_id`. **`character_spells`**: `spell_id`. **`character_equipment`**: `item_id`. **`character_features`**: `feature_id`, `feat_id`.
- Supabase `Database` types include these columns in `Row`, `Insert`, and `Update` shapes (`@/integrations/supabase/types.ts`).

### Resolver layer

- **`@/lib/canonicalCompendium.ts`** exposes ID-first resolvers (`findCanonicalEntryById`, `findCanonicalCastableById`), composite ID-first / name-fallback resolvers (`resolveCanonicalReference`, `resolveCanonicalCastableReference`), a character-shape resolver (`resolveCharacterCanonicalIds`), and source-book accessibility checks (`isCanonicalEntryAccessible`, `isCanonicalCastableAccessible`).
- All resolvers return a `matchedBy: "id" | "name" | "none"` discriminator so callers can distinguish canonical hits, legacy name hits, and custom/unresolved entries.

### Dual-write paths

Every write path persists canonical IDs alongside legacy name fields:

- Hooks: `useCharacters`, `usePowers`, `useSpells`, `useEquipment`, `useFeatures`.
- Pages and components: `CharacterNew`, `LevelUpWizardModal`, `FeatureChoicesPanel`.
- Automation: `characterCreation.ts`, `bulkOperations.ts`, `useWardenItemDelivery.ts`, `useCampaignSandboxInjector.ts`.
- Guest persistence: `guestStore` mirrors all canonical IDs and supports symmetric add/remove for features, powers, spells, equipment, techniques, rune knowledge, and sigil inscriptions.
- Offline sync replay: `syncManager` and `offlineStorage` apply `resolveCharacterCanonicalIds` before queued character writes so legacy queued items also populate canonical IDs.

### Import/export (v2.4)

`@/hooks/useCharacterExportImport.ts` exports a versioned package keyed by canonical IDs and replays it through a single shared `importRelatedCharacterRows` helper. The v2.4 payload covers:

- `characters` (with canonical IDs).
- `character_abilities`, `character_equipment` (with stable old → new id remap and `container_id` rewiring), `character_features`, `character_powers`, `character_spells`.
- `character_techniques`, `character_rune_knowledge`, `character_rune_inscriptions` (with equipment-ID remap), `character_sigil_inscriptions` (with equipment-ID remap), `character_regents`, `character_shadow_soldiers`.
- Runtime/state and quest tables: `character_shadow_army`, `character_active_spells`, `character_extras`, `character_monarch_unlocks`, `character_regent_unlocks`, `character_feature_choices`, `character_journal`, `character_backups` (re-stamped with the importing user's id on replay).

### Manager UX

- `@/pages/Characters.tsx` provides search across name/job/path/background, filter by job, and sort by recently-updated/name/level. Selection-driven bulk actions remain available alongside the new controls.
- `@/lib/bulkOperations.ts` is guest-aware for local character IDs and skips choice-heavy bulk level-ups, returning skipped rows when ASI/Feat, first Path selection, or job-granted Power/Technique choices require the wizard.

### Tests

- `@/lib/__tests__/canonicalIds.test.ts` (32 tests).
- `@/lib/__tests__/guestStoreCanonicalIds.test.ts` (11 tests).
- `@/lib/__tests__/canonicalCompendium.test.ts` (7 tests).
- `@/lib/__tests__/characterCreation.persistence.test.ts` (1 test).
- `@/lib/__tests__/bulkOperationsGuestParity.test.ts` covers guest bulk parity plus bulk level-up choice-safety gates.

### Out of scope (design-level)

- **Multi-Job multiclass parity**: RA does not support DDB-style multiclass; the data model has a single `job` per character by design.
- **Generic character template ID-aware application**: there is currently no character-template feature in RA, so canonical-ID-aware template grants are not applicable.
- **SQL migration unit tests**: require a local Supabase test runner that is not part of this workspace.

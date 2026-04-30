# RA Canonical Persistence Audit 2026

**Audit date:** 2026-04-28  
**Project:** `solo-compendium` / System Ascendant / Rift Ascendant  
**Scope:** Character creation suite, level-up wizard, character manager, character sheet, character-owned persistence, guest/auth parity, and D&D Beyond-scale capability mapping adapted to RA mechanics.

## Executive summary

Full RA canonical persistence is **not yet true app-wide**. Several subsystems already use canonical IDs correctly, especially techniques, runes, sigils, and regent unlocks, but core character identity, powers, features/feats, equipment, and several import/export/manager flows still persist or hydrate primarily by display names. Guest mode mirrors most current schema limitations and also has additional divergence in local features, sigils, bulk actions, and import/export.

The correct remediation path is additive and migration-safe: add canonical ID columns, dual-write IDs plus existing names, backfill legacy rows by name, update readers to hydrate by ID first, then tighten constraints once data is stable.

## Terminology and canonical target

RA maps D&D Beyond concepts to Rift Ascendant mechanics as follows:

| DDB concept | RA concept | Persistence target |
|---|---|---|
| Character | Ascendant | `characters` row plus character-owned child rows |
| DM | Warden | campaign/user permissions and Warden tools |
| Class | Job | canonical `job_id` plus display snapshot |
| Race/species | Job lineage layer | embedded Job traits; no literal D&D species table required |
| Subclass | Path | canonical `path_id` plus display snapshot |
| Spell | Power / Spell | canonical `power_id` or `spell_id` plus display snapshot |
| Feat / feature | Feature / feat / awakening trait | canonical `feature_id` / `feat_id` / `homebrew_id` where applicable |
| Magic item | Relic/equipment/item | canonical `item_id` plus instance fields |
| Rune/sigil | Rune/sigil | canonical `rune_id` / `sigil_id` |
| Multiclass | multi-Job, if supported by RA rules | explicit canonical secondary job records; do not overload `characters.job` |

Canonical persistence means:

- **Rows store IDs**: every character-owned row that references compendium content stores a stable canonical ID.
- **Names are snapshots**: `name`, `source`, descriptions, and display fields are denormalized snapshots only.
- **Hydration is ID-first**: readers use `canonicalCompendium` / `ProtocolDataManager` by ID, with legacy name fallback only for pre-migration rows.
- **Auth and guest are symmetric**: Supabase and `guestStore` store equivalent shapes and support equivalent mutations.
- **Legacy data migrates**: raw-name rows are backfilled using canonical resolvers, with unresolved rows preserved and reported.

## Web-verified D&D Beyond capability baseline

This audit used current public D&D Beyond materials as capability references rather than content sources.

- **D&D Beyond 2026 roadmap**: DDB is rebuilding its game platform around modular, scalable, data-defined rules with faster character updates, rules validation, source/content access, and a revamped builder.
- **Quickbuilder 2026 post**: Quickbuilder targets level 1 creation, smart defaults, full device support, reduced rule expertise requirements, flexible customization, DM-controlled rules, and mistake prevention such as duplicate proficiency detection.
- **DDB first-character builder article**: standard builder covers class, class level, multiclass, spells, background, species, ability score methods, and starting equipment automation.
- **DDB character-sheet resource**: sheet tracks hit points, equipment, spells, abilities, level-up, clickable rolls, portraits, backgrounds/themes, and marketplace/source content access.

RA should not import literal D&D content. It should match structural capabilities using RA mechanics.

## Canonical persistence matrix

| Area | Current status | Evidence | Required remediation |
|---|---:|---|---|
| `characters.job` / `path` / `background` | ⚠️ raw-name only | `characters` row has `job`, `path`, `background`, `base_class`, but no `job_id`, `path_id`, `background_id`. `CharacterNew.tsx` selects IDs but persists names in `handleCreate`. | Add `job_id`, `path_id`, `background_id`; dual-write in create/update/import; hydrate names from IDs. |
| Character abilities | ✅ canonical enough | `character_abilities` stores enum `ability` + score; `characters` also duplicates score columns. | Keep as-is, but decide long-term source of truth for duplicated score columns. |
| Proficiencies/languages/tools | ⚠️ string arrays | Stored as raw string arrays on `characters`. | Accept if RA skills/proficiency keys are canonical string IDs; otherwise normalize to canonical IDs and validate choices. |
| `character_powers` | ❌ raw-name primary | Table has `name`, `power_level`, timing fields, no `power_id`. `CharacterNew.tsx`, `LevelUpWizardModal.tsx`, and `usePowers.ts` select canonical entries but persist `name`. | Add `power_id`; update creation, level-up, manual add, reorder/cache, import/export; hydrate by ID first. |
| `character_spells` | ⚠️ partial | `spell_id` exists but is nullable; `useSpells.ts` hydrates by `name`, and `addSpell` validates by name without ensuring `spell_id`. | Enforce `spell_id` for canonical spells; preserve null only for true custom/homebrew spells. |
| `character_techniques` | ✅ mostly canonical | Stores `technique_id`; creation and level-up persist technique IDs; guest store mirrors `technique_id`. | Add duplicate prevention by `(character_id, technique_id)` and continue ID-first hydration. |
| `character_features` | ❌ raw-name primary | Table has `name`, `source`, optional `homebrew_id`, no canonical feature/feat ID. Level-up feat selections drop `feat.id`; feature automation de-dupes by name. | Add `feature_id` and/or `feat_id`; update automation and de-dupe by ID; retain `homebrew_id` for custom content. |
| `character_feature_choices` | ✅ canonical | Stores `feature_id`, `group_id`, and `option_id`. | Keep; ensure parent feature rows also get canonical IDs. |
| `character_equipment` | ❌ raw-name primary | Table has `name`, `item_type`, instance fields, no `item_id`; `useEquipment.ts` validates sourcebook by name and inserts name fields. | Add `item_id`; update starting equipment, manual equipment, bulk equipment, import/export, and sourcebook access checks. |
| Rune knowledge/inscriptions | ✅ mostly canonical | Rune learning uses `rune_id`; schema has rune FKs. | Verify guest rune inscription symmetry; keep ID-first hydration. |
| Sigil inscriptions | ⚠️ canonical remote, missing guest symmetry | Remote rows use `sigil_id`; `useCharacterSigilInscriptions` returns `[]` for local characters and `useInscribeSigil` has no local branch. | Add guest sigil inscription helpers and local hydration. |
| Regent/Monarch unlocks | ✅ canonical | `character_regent_unlocks.regent_id`, `character_regents.regent_id`, `character_monarch_unlocks.monarch_id`. | Keep; audit Gemini/Sovereign state IDs inside JSON. |
| Gemini state / overlays | ⚠️ JSON / arrays | `gemini_state`, `regent_overlays`, `monarch_overlays`, `sovereign_id`, `active_sovereign_id` exist. | Define and validate canonical IDs inside JSON; add migration if free-form names are present. |
| Spell slots | ✅ derived/resource state | `character_spell_slots` / hook manage slot counts, not compendium references. | Add guest/offline mirror if required by parity; no canonical compendium ID needed. |
| Character sheet state | ✅ resource/UI state | `character_sheet_state` stores resources/custom modifiers/UI state. | No compendium ID requirement except custom modifiers should reference canonical source IDs where applicable. |
| Roll history | ✅ no compendium ref | Stores dice formula/result/context. | No canonical ID requirement. |
| Backups | ⚠️ snapshot only | Backup data serializes current character shape; will preserve canonical IDs only after schema adds them. | Version backup schema and include canonical IDs plus legacy fallback. |
| Export/import | ❌ incomplete | `useCharacterExportImport.ts` exports only character, abilities, equipment, features; spells skipped; import writes legacy fields and likely invalid ability column names (`strength`, `agility`, etc.). | Replace with canonical full export/import schema covering all character-owned rows and ID backfill. |

## Surface audit

### Character creation suite (`CharacterNew.tsx`)

**Current strengths**

- Wizard is guided and includes concept, Job, abilities, optional Path, Background, equipment, optional imprints, and review.
- UI state already uses canonical IDs for selected Job, Path, Background, Powers, and Techniques.
- Creation uses standard array, point-buy, and manual/rolled style ability setup.
- Techniques persist by `technique_id`.

**Gaps**

- `handleCreate` converts selected Job, Path, and Background IDs back into names before writing `characters`.
- Power imprints persist `name` and denormalized fields but drop `power.id`.
- Starting equipment automation persists equipment instances by name, not item ID.
- Level 1 features and awakening traits persist feature names and source strings, not feature IDs.
- Templates are name-based for Job and Background.
- Selected languages are stored as strings; this is acceptable only if language names are treated as canonical keys.

**Required work**

- Keep wizard state ID-based and write canonical IDs to every affected row.
- Update `addLevel1Features`, `addStartingEquipment`, `addJobAwakeningBenefitsForLevel`, and `applyJobAwakeningTraitsToCharacter` to accept/store canonical source IDs.
- Add duplicate-proficiency prevention equivalent to DDB’s mistake-prevention principle.
- Version templates or resolve template names to IDs before apply.

### Level-up wizard (`LevelUpWizardModal.tsx`)

**Current strengths**

- Handles XP/milestone gating, HP increase, Path selection, ASI/feat choices, Powers, Techniques, Regent features, spell slots, feature grants, domain events, and query invalidation.
- Techniques persist by `technique_id`.
- Available Powers/Techniques are selected by canonical entry ID in UI state.

**Original gaps and current status**

- Path, Feat, Power, and Feature selections now dual-write canonical IDs where the schema supports them.
- Duplicate prevention for powers/features is canonical-ID-first where canonical IDs are available, with name fallback retained for custom/legacy rows.
- Bulk level-up now skips ASI/Feat tiers, first Path selection levels, and job-granted choice deltas such as Power/Technique choices; skipped rows are returned to the UI for wizard completion.

**Required work**

- Keep level-up canonical-ID dual-write and choice-skip behavior covered as new choice sources are introduced.
- Multi-Job/multiclass remains a design-level non-goal unless RA rules add secondary Job support.

### Character manager (`Characters.tsx`, `BulkActionsBar.tsx`, import/export)

**Current strengths**

- Lists multiple Ascendants, supports create/import/delete, bulk delete, bulk level-up, bulk rest, guest-mode warning, and links to Party Stash.
- Cards show rank, portrait, HP, AC, initiative, proficiency, Job/Path display, and selection checkboxes.

**Original gaps and current status**

- Sheet/page-model display hydration prefers canonical Job/Path/Background IDs where available.
- Bulk operations branch for local guest IDs for delete, update, level-up, rest, and equipment add.
- Bulk level-up now gates choice-heavy levels and returns skipped rows with reasons instead of silently advancing.
- Import/export gaps from the original audit are remediated by JSON v2.4 full character-package replay.

**Required work**

- Keep manager/search/filter/sort behavior covered as card schema evolves.
- Maintain guest-aware bulk branches when new bulk operations are added.
- Maintain the versioned full character package as new character-owned tables are added.

### Character sheet (`CharacterSheetV2.tsx`, `useCharacterPageModel`)

**Current strengths**

- `CharacterSheetV2` is the authoritative page component and composes actions, equipment, features, runes, spell slots, backups, journal, extras, conditions, level-up, share links, and resource controls.
- `useCharacterPageModel` centralizes sheet data flow and resolves display rows through ID-first canonical helpers for Job/Path/Background.

**Original gaps and status**

- Original display hydration was name-based; implementation now prefers `job_id`, `path_id`, and `background_id` where available.
- Powers, spells, equipment, and features now resolve through composite ID-first helpers in their hooks/import paths.
- Sigils hydrate canonically and now support guest/local inscription add, list, and remove paths.
- Feature state was consolidated into `guestStore.ts` for local IDs.

**Maintenance work**

- Keep `useCharacterPageModel` identity hydration ID-first as sheet header fields evolve.
- Keep module hook hydration canonical-ID-first for new character-owned modules.
- Keep guest feature state consolidated in `guestStore`.
- Keep guest sigil inscription parity covered as sigil slot rules evolve.

## DDB capability to RA parity matrix

| Capability | RA surface | Current status | Notes |
| --- | --- | ---: | --- |
| Guided level 1 builder / Quickbuilder-style flow | `CharacterNew.tsx` | ✅/⚠️ | Guided flow exists and dual-writes canonical IDs; still needs smart defaults/mistake prevention. |
| Deep standard builder | `CharacterNew.tsx` | ✅/⚠️ | Covers many steps and persists canonical IDs; may need better advanced option surfacing. |
| Class selection | Job step | ✅ | Persists `job_id` alongside the legacy display name. |
| Species/race selection | Job lineage traits | ✅/⚠️ | RA intentionally fuses race+class into Job; traits apply, but source feature IDs missing. |
| Background selection | Background step | ✅ | Persists `background_id` alongside the legacy display name. |
| Multiclass | multi-Job equivalent | ❌/TBD | No clear canonical secondary Job persistence in audited surfaces. Needs RA rules decision. |
| Ability methods | Attributes step | ✅ | Standard, point-buy, manual/rolled patterns exist. |
| Ability total automation | `effectiveAbilities`, calculations | ✅/⚠️ | Job ASI applies; background/feat ability interactions need canonical source tracking. |
| Skill/tool/language choices | Job/background creation | ✅/⚠️ | Stored as strings; needs canonical key validation and duplicate prevention. |
| Spell/power choices in builder | Imprints step | ✅ | UI uses IDs and persistence stores `power_id` / `spell_id`. |
| Starting equipment automation | Equipment step + automation | ✅ | Exists and stores canonical `item_id` where available. |
| Level-up guided flow | `LevelUpWizardModal.tsx` | ✅ | Comprehensive and canonical-ID-aware; bulk level-up skips choice-heavy levels and routes them back to the wizard. |
| ASI / Feat windows | Level-up wizard | ✅ | Exists and persists `feat_id` for canonical feats. |
| HP fixed/manual/roll | Level-up wizard | ✅ | Average/roll/manual supported. |
| XP vs milestone | campaign settings + level-up | ✅ | Leveling mode present. |
| Spell slots/resources | `useSpellSlots`, sheet state | ✅/⚠️ | Core works; persistence matrix previously flags local mirror as high priority. |
| Equipment/inventory/equip/attune | `useEquipment`, `EquipmentList` | ✅ | Instance state exists and canonical `item_id` is dual-written. |
| Conditions/exhaustion/concentration | sheet modules | ✅ | Present in sheet/model. |
| Dice from sheet | `rollAndRecord`, actions panels | ✅ | Sheet rolls and records history. |
| Character sharing | share-token RPC | ✅ | Auth-only; local guest share requires sign-in. |
| Character import/export | manager/import hooks | ✅ | JSON v2.4 preserves canonical IDs and replays full character-owned package. |
| Multiple characters/manager | `Characters.tsx` | ✅ | Multi-card manager includes search/filter/sort controls. |
| Bulk operations | `BulkActionsBar`, `bulkOperations.ts` | ✅ | Guest-aware for local IDs; bulk level-up skips ASI/Feat, Path, and job-granted choice tiers with reasons. |
| Portrait/theme customization | character rows/sheet | ✅/⚠️ | Portrait shown; DDB-style sheet themes not fully audited. |
| Marketplace/source access | sourcebook filters | ✅/⚠️ | Access filtering is canonical-ID-aware; unresolved custom/null IDs remain user-authored and ungated by convention. |
| Guest/free usage | `guestStore.ts` | ✅/⚠️ | Guest store mirrors canonical IDs for character-owned data and sigil inscriptions; sharing still requires sign-in. |

## Residual guardrails

1. **Custom/name-only fallback convention**: canonical resolvers remain ID-first and retain name fallback only for legacy/custom rows. Spell references and overlay arrays now use normalization helpers so stale unknown IDs do not persist as canonical references.
2. **Guest store symmetry**: future guest-owned child tables must be added to `guestStore` symmetrically and covered by guest/auth parity tests.
3. **Import/export package coverage**: future character-owned tables must be added to the v2 package when introduced to avoid renewed data loss.
4. **Bulk level-up choice safety**: new choice source types must be represented in `calculateTotalChoices` so `detectBulkLevelUpChoiceRequirement` continues to skip choice-heavy levels.

## Remediation plan

### Phase 2 — Schema remediation

- Add nullable canonical ID columns first:
  - `characters.job_id`, `characters.path_id`, `characters.background_id`.
  - `character_powers.power_id`.
  - `character_features.feature_id`, `character_features.feat_id` where applicable.
  - `character_equipment.item_id`.
  - Normalize/enforce `character_spells.spell_id` for canonical spells.
- Add indexes for `(character_id, *_id)` where duplicates should be prevented.
- Backfill using canonical resolvers by current names, logging unresolved rows.
- Regenerate Supabase types.

### Phase 3 — Resolver and compatibility layer

- Add by-ID canonical resolver helpers to `canonicalCompendium.ts`.
- Update sourcebook checks to operate by canonical ID.
- Add fallback helpers: ID first, legacy name second, unresolved custom third.
- Add tests for duplicate names and renamed-content resilience.

### Phase 4 — Guest store symmetry

- Version or tolerant-migrate `GuestStateV1` to store the new canonical IDs.
- Update all `addLocal*` and `updateLocal*` helpers to mirror remote row shapes.
- Move local feature UI persistence into `guestStore` and remove split localStorage behavior.
- Add local sigil inscription helpers.
- Add guest/auth parity tests.

### Phase 5 — Creation suite remediation

- Dual-write canonical IDs from wizard selections.
- Update level 1 features, starting equipment, powers, techniques, and traits to include canonical source IDs.
- Make template application ID-aware.
- Add duplicate proficiency warnings/prevention.

### Phase 6 — Level-up remediation

- Persist Path, Feat, Power, Feature, and Regent-related canonical IDs.
- De-dupe grants by canonical ID.
- Make bulk level-up canonical-safe or restrict it when choices are required.
- Decide and implement multi-Job if RA supports DDB-style multiclass parity.

### Phase 7 — Manager, sheet, import/export

- Hydrate list cards and sheet headers from canonical IDs.
- Replace export/import with a versioned complete package:
  - character identity IDs,
  - abilities,
  - equipment,
  - features/choices,
  - powers/spells/slots,
  - techniques,
  - runes/sigils,
  - sheet state/resources,
  - journal/backups as appropriate.
- Keep manager search/filter/sort covered as the character card schema evolves.
- Make bulk actions guest-aware or explicitly disabled for guest records.

### Phase 8 — Verification and docs

- Add migration tests for schema additions/backfill.
- Add unit tests for canonical resolvers.
- Add integration tests for auth and guest creation/level-up/import/export.
- Run project checks:
  - `npm run test:run`.
  - lint/typecheck scripts from `package.json`.
- Update `docs/persistence-matrix.md` and DDB parity docs with post-remediation status.

## Initial audit verdict (superseded by implementation sections below)

- **Original canonical persistence status:** partial, not app-wide.
- **Original DDB-scale character feature status:** broad coverage existed, but several parity claims were overstated due to canonical persistence gaps, incomplete import/export, manager capability gaps, and guest/auth asymmetry.
- **Original recommended next action:** implement Phase 2 schema additions and type regeneration, then dual-write canonical IDs through creation and level-up before tightening constraints.

## Phase 2 implementation status (Apr 2026)

### Schema and types

- New migration `supabase/migrations/20260428010000_add_character_canonical_ids.sql`:
  - Adds `characters.job_id`, `characters.path_id`, `characters.background_id`.
  - Adds `character_powers.power_id`, `character_spells.spell_id` (where missing), `character_equipment.item_id`, `character_features.feature_id`, `character_features.feat_id`.
  - Backfills legacy rows using explicit static name -> ID mappings derived from the static compendium provider for jobs, backgrounds, paths, powers, spells, feats, equipment, and relics.
  - Falls back to a `pg_temp.ra_canonical_slug` helper for unmapped rows where slug-derived IDs are correct (jobs, powers, feats).
  - Adds partial indexes on each new ID column.
- Manually updated `src/integrations/supabase/types.ts` to reflect the new `*_id` columns in `Row`, `Insert`, and `Update` shapes.

### Canonical resolver layer

- `src/lib/canonicalCompendium.ts`:
  - `findCanonicalEntryById` and `findCanonicalCastableById` enable ID-first lookups.
  - `resolveCharacterCanonicalIds` is exported and shared across hooks and sync paths to fill `job_id`, `path_id`, `background_id` from names when an ID is not already provided.

### Dual-write coverage

Updated write paths now persist canonical IDs alongside legacy name fields:

- Hooks: `useCharacters`, `usePowers`, `useSpells`, `useEquipment`, `useFeatures`.
- Pages and components: `CharacterNew`, `LevelUpWizardModal`, `FeatureChoicesPanel`.
- Automation: `characterCreation.ts` insertion paths for features, powers, spells, and starting equipment.
- Library helpers: `bulkOperations.ts`, `useWardenItemDelivery.ts`.
- Sandbox: `useCampaignSandboxInjector.ts` NPC inserts now include null canonical IDs to satisfy types and avoid drift.
- Import/export: `useCharacterExportImport.ts` resolves or preserves `job_id`, `path_id`, `background_id`, equipment `item_id`, and feature `feat_id`/`feature_id` during replay.
- Guest persistence: `guestStore.ts` mirrors all new canonical ID fields on local characters, equipment, powers, and features.
- Offline sync safety net: `syncManager.ts` and `offlineStorage.ts` apply `resolveCharacterCanonicalIds` before replaying queued character writes so legacy queue items also populate canonical IDs.

### Hydration prioritization

Read-side hydration now prefers canonical IDs and falls back to names:

- `usePowers` hydrates by `power_id` first, then `name`.
- `useSpells` hydrates by `spell_id` first, then `name`.
- `useEquipment` filters and hydrates by `item_id` first, then `name`.

### Validation

- `npm run typecheck` passes.
- `git diff --check` reports no whitespace errors; only CRLF normalization warnings are present.

### Phase 2 deferred items

These items were explicitly not part of Phase 2 and remain open:

- Enforce non-null canonical IDs once backfill is verified in production.
- Constrain spells to canonical or custom by source convention.
- Add migration tests (Phase 8).
- Continue with Phases 4-8 of the remediation plan.

## Phase 3 implementation status (Apr 2026)

### Resolver layer additions

- `src/lib/canonicalCompendium.ts` adds:
  - `CanonicalReferenceLookup` and `CanonicalReferenceResolution<T>` types.
  - `resolveCanonicalReference` — ID-first reference resolver across any static canonical entry type, with explicit `matchedBy: "id" | "name" | "none"` so callers can distinguish canonical hits, legacy name matches, and custom/unresolved entries.
  - `resolveCanonicalCastableReference` — castable variant that walks preferred castable types (powers/spells) ID-first, then name-first, returning a `CanonicalCastableEntry` with `canonical_type`.
  - `isCanonicalEntryAccessible` — sourcebook accessibility check that operates by canonical ID, treating unresolved/custom entries as accessible.

### Test coverage

- New `src/lib/__tests__/canonicalIds.test.ts` covering:
  - `findCanonicalEntryById` and `findCanonicalCastableById` happy paths, null inputs, unknown IDs, and type isolation.
  - `resolveCharacterCanonicalIds` semantics including explicit-clear and explicit-override behavior.
  - `resolveCanonicalReference` and `resolveCanonicalCastableReference` ID-first preference, name fallback, and custom/unresolved cases.
  - Duplicate-name and rename resilience: cross-type id rejection, ID-first resolution ignoring stale names, case/whitespace-insensitive name lookup, and name-based type isolation.
  - `isCanonicalEntryAccessible` behavior for null/unknown ids and canonical ids resolving through to the source-book accessibility layer.

### Phase 3 validation

- `npm run typecheck` passes.
- `vitest run src/lib/__tests__/canonicalIds.test.ts` reports 29/29 passing tests.

### Phase 3 deferred items

- Refactor existing hooks (`usePowers`, `useSpells`, `useEquipment`, etc.) to use the composite `resolveCanonicalReference` / `resolveCanonicalCastableReference` helpers instead of their inlined ID-then-name lookups (mechanical refactor, low-risk).
- Add `isCanonicalCastableAccessible` if call sites need a castable-specific source-book check.
- Wire feature `feature_id` resolution into the audit-doc-defined "Phase 5 — Creation suite remediation" once feature canonical IDs become deterministic for grants.

## Phase 4-8 implementation status (Apr 2026)

### Phase 4 implementation — Guest store symmetry

- Added `removeLocalFeature` to `src/lib/guestStore.ts` so guest features can be deleted symmetrically with remote rows.
- Refactored `src/hooks/useCharacterFeatures.ts` to read/write features through `guestStore` (`listLocalFeatures`, `addLocalFeature`, `removeLocalFeature`) for guest characters, removing the legacy `localStorage["character-features"]` split-brain identified in the audit.
- Existing Phase 2 work already mirrored canonical ID columns (`job_id`, `path_id`, `background_id`, `power_id`, `spell_id`, `item_id`, `feat_id`, `feature_id`) into `addLocal*` and `createLocalCharacter` paths, satisfying the canonical-id symmetry portion of Phase 4.
- New parity test `src/lib/__tests__/guestStoreCanonicalIds.test.ts` (11/11 passing) covers:
  - `createLocalCharacter` persists provided canonical IDs.
  - `createLocalCharacter` null-coalesces missing canonical IDs.
  - `updateLocalCharacter` preserves existing canonical IDs through partial updates and applies new ones when supplied.
  - `addLocalPower` / `addLocalSpell` / `addLocalEquipment` write `power_id` / `spell_id` / `item_id` respectively.
  - `addLocalFeature` writes `feat_id` and `feature_id` and null-coalesces them when missing.
  - `addLocalSigilInscription` / `removeLocalSigilInscription` preserve canonical `sigil_id` rows for guest characters.

### Phase 5 implementation — Creation suite remediation

- The bulk of Phase 5 was completed in Phase 2: wizard and automation paths in `CharacterNew.tsx`, `LevelUpWizardModal.tsx`, `FeatureChoicesPanel.tsx`, and `characterCreation.ts` now dual-write canonical IDs for selected powers, granted features, granted equipment, granted feats, and starting items.
- Duplicate proficiency warnings/prevention are implemented in `CharacterNew` via `dedupeProficiencies` with toast feedback and lock tests.
- Design-out-of-scope (not deferred — not implementable in this codebase): generic character-template ID-aware application, since RA does not currently expose a character-template feature.

### Phase 6 implementation — Level-up remediation

- Updated `LevelUpWizardModal.tsx` power dedup to be canonical-ID-first (match by `power_id` before falling back to `name`) for both the local guest path and the Supabase path. Renames or near-duplicate names will no longer cause double-inserts.
- Bulk level-up choice safety is implemented in `bulkOperations.ts`: ASI/Feat tiers, first Path unlocks, and job-granted choice deltas are skipped with user-facing reasons. Multi-Job multiclass parity remains out of scope because RA does not currently support DDB-style multiclass.

### Phase 7 implementation — Manager, sheet, import/export

- Bumped the JSON export format in `useCharacterExportImport.ts` to `version: "2.4"` across five increments:
  - v2.0 added `powers` and `spells` arrays sourced from `character_powers` and `character_spells`.
  - v2.1 added `techniques`, `rune_knowledge`, `regents`, and `shadow_soldiers` (canonical-id-bearing tables) to the payload.
  - v2.2 added `rune_inscriptions` with stable equipment-ID remapping during import.
  - v2.3 added `sigil_inscriptions` using the same equipment-ID remap.
  - v2.4 added the runtime/state/quest tables (`shadow_army`, `active_spells`, `extras`, `monarch_unlocks`, `regent_unlocks`, `feature_choices`) plus `journal` and `backups`. Backups are re-stamped with the importing user's id on replay.
- Added a manager search/filter/sort UX in `@/pages/Characters.tsx` (search across name/job/path/background, filter by job, sort by recently-updated/name/level), addressing the previously-deferred "manager search/filter/sort" item.
- Extended import replay (`importRelatedCharacterRows`) to handle every payload key with canonical resolution:
  - `buildImportedPowerRows` / `buildImportedSpellRows` resolve `power_id` / `spell_id` from canonical names when an explicit ID is missing.
  - `buildImportedTechniqueRows`, `buildImportedRuneKnowledgeRows`, `buildImportedRegentRows`, `buildImportedShadowSoldierRows` reuse a shared `resolveStaticReferenceId` helper that walks `id` fields, embedded relations, and falls back to canonical name resolution.
  - `buildImportedRuneInscriptionRows` and `buildImportedSigilInscriptionRows` translate the exported `equipment_id` through the equipment ID map produced by `buildImportedEquipmentRows`, so attached runes/sigils survive re-import without dangling FKs.
  - `buildImportedActiveSpellRows`, `buildImportedShadowArmyRows`, `buildImportedExtrasRows`, `buildImportedMonarchUnlockRows`, `buildImportedRegentUnlockRows`, `buildImportedFeatureChoiceRows`, `buildImportedJournalRows`, and `buildImportedBackupRows` replay the previously-deferred character state tables. Backups replay under the importing user.
  - `buildImportedEquipmentRows` now pre-allocates a stable old→new id map and remaps `container_id` references so nested containers reattach correctly.
  - `buildImportedCharacterInsert`, `buildImportedEquipmentRows`, and `buildImportedFeatureRows` already dual-wrote canonical IDs from the Phase 2 sweep; this phase only adds the new tables.
- Both `useCharacterExport.importCharacterJson` and `useCharacterImport.importCharacterJson` now delegate to the same shared `importRelatedCharacterRows` helper to remove split-brain import logic.
- Remaining out of scope: export of campaign-shared data (campaign journals/handouts and campaign tool state), because it is not owned by a single character package.

### Phase 7.1 — Other character-owned tables audit

For each remaining `character_*` table that links to a `compendium_*` relation, the audit verified whether canonical-ID persistence work is required and then added v2.4 export/import replay even for runtime/state-scoped tables:

- `character_active_spells` — runtime concentration/cast state. `spell_id` and `spell_name` are required by schema; v2.4 exports/imports it with canonical spell resolution.
- `character_extras` — minion/monster snapshots referencing `compendium_Anomalies`; v2.4 exports/imports it and resolves `monster_id` through `anomalies` when present.
- `character_feature_choices` — leveling decisions referencing `compendium_job_features` / `compendium_feature_choice_groups` / `compendium_feature_choice_options`; v2.4 exports/imports the raw ID-driven rows.
- `character_monarch_unlocks` / `character_regent_unlocks` — quest-unlock metadata; v2.4 exports/imports both, resolving `regent_id` canonically and preserving required monarch IDs.
- `character_shadow_army` — runtime summon state; v2.4 exports/imports it and resolves `shadow_soldier_id` through `shadow-soldiers`.
- `character_shadow_soldiers` — included in export/import (Phase 7).
- `character_techniques`, `character_regents`, `character_rune_knowledge`, `character_rune_inscriptions`, `character_sigil_inscriptions` — all included in export/import with canonical-ID resolution and equipment remap where applicable (Phase 7).

### Phase 8 implementation — Verification and docs

- Type checks pass: `tsc -p tsconfig.json --noEmit`.
- Full Vitest suite passes: 51 files, 456/456 tests.
- Canonical persistence test suites pass as part of the full suite (51/51):
  - `src/lib/__tests__/canonicalIds.test.ts` (32/32, includes new `isCanonicalCastableAccessible` coverage).
  - `src/lib/__tests__/guestStoreCanonicalIds.test.ts` (11/11).
  - `src/lib/__tests__/canonicalCompendium.test.ts` (7/7).
  - `src/lib/__tests__/characterCreation.persistence.test.ts` (1/1).
- DDB-parity regression suites added in the Apr 2026 follow-up pass:
  - `src/lib/__tests__/attunementRules.test.ts` (9/9) — `canAttuneItem` / `canUnattuneItem` / `MAX_ATTUNEMENT_SLOTS`.
  - `src/lib/__tests__/extraAttack.test.ts` (19/19) — `computeAttacksPerAction` for martial Extra Attack, Destroyer high tiers, regents, and feature-granted attacks.
  - `src/lib/__tests__/activeSpellModifiers.test.ts` (15/15) — `buildActiveSpellEffectEntry` + `activeSpellsToCustomModifiers` projection (Bless / Shield / Haste / Bane / Heroism / Faerie Fire / Mage Armor / Enhance Ability / Resistance).
  - `src/lib/__tests__/importValidation.test.ts` (15/15) — container-id validation and version-aware import classification.
  - `src/lib/__tests__/bulkOperationsGuestParity.test.ts` (16/16) — guest-aware bulk delete / update / level-up / rest / equipment, plus ASI/Path/job-choice skip gates.
- This audit doc now reflects the completed Phase 2-8 work, the additional Phase 7 sigil/rune/runtime coverage, and the table-by-table audit of remaining `character_*` relations.
- `docs/persistence-matrix.md` and `docs/dndbeyond-parity-audit-feb2026-updated.md` now include post-remediation status notes.
- Remaining out of scope: SQL migration unit tests (require a local Supabase test runner not available in this workspace) and campaign-shared export bundles that are not owned by a single character package.
- Apr 2026 follow-up: `normalizeSpellReference` now enforces the canonical/custom spell convention for learned spell rows. Canonical spell rows must resolve to a known canonical spell ID by ID or legacy name; unresolved/custom spell rows have `spell_id: null`, preventing stale imported IDs from masquerading as canonical references.
- Apr 2026 follow-up: `characterOverlayValidation` now normalizes `gemini_state`, `monarch_overlays`, and `regent_overlays` across character create/update, import replay, offline sync replay, and long-rest persistence. Overlay arrays resolve to canonical Regent IDs, invalid/duplicate entries are dropped, Gemini scalar fields are normalized, corruption risk is clamped, and malformed Gemini modifiers are filtered.
- Apr 2026 follow-up: `detectBulkLevelUpChoiceRequirement` now shares the wizard's `calculateTotalChoices` logic for job-granted choice deltas, so bulk level-up skips ASI/Feat tiers, first Path selection levels, and Power/Technique choice tiers with reasons instead of bypassing player decisions.

### Apr 2026 follow-up pass — runtime parity hardening

Beyond canonical persistence, the follow-up pass closed runtime / behavioral parity gaps:

- **Concentration**: condition naming fix, auto-removal on broken save, advantage/disadvantage threading from custom modifiers, drop on long rest, single `onConcentrationLost` analytics callback for all loss paths.
- **Death saves**: `useDeathSaves` wired into HP damage/heal flow, RAW massive-damage rule, persistence effect on every state transition.
- **Attunement**: shared `attunementRules.ts` module + `item:attune` `DomainEventBus` event, `useAttunement` rewritten as a thin wrapper.
- **Active spell effects**: `useCharacterActiveSpells` hook persists buff/debuff rows, `activeSpellsToCustomModifiers` projects them so derived stats auto-pick up Bless / Shield / Haste / etc.
- **Extra Attack**: `computeAttacksPerAction` integrated into `useCharacterDerivedStats` and surfaced in `ActionsList`; regent IDs and feature flag both honored.
- **Long rest pipeline**: drops in-memory concentration and DB-deletes concentration `character_active_spells` rows.
- **Real PDF export**: browser print-to-PDF, threads share token; markdown fallback retained as `exportCharacterMarkdown`.
- **Version-aware import**: `classifyImportVersion` helper + soft warning toast; `EXPORT_VERSION` constant.
- **Container import validation**: `collectContainerOriginalIds` + `resolveImportedContainerId` drop orphan / non-container references silently.
- **Power activation pipeline**: `PowersList` instantiates a fallback `useSpellCasting` so concentration powers always go through the unified pipeline (slot consumption, active-spell persistence, `spell:cast` event).
- **Builder seeding**: spell slots eagerly seeded in `CharacterNew` via `useInitializeSpellSlots`; duplicate-proficiency dedup with toast warning.
- **Bulk ops**: `bulkDeleteCharacters`, `bulkUpdateCharacters`, `bulkLevelUp`, `bulkRest`, `bulkAddEquipment` all branch through `guestStore` for local IDs; `bulkLevelUp` skips ASI/Feat tiers and surfaces them via `BulkLevelUpResult.skipped`.
- **Cleanup**: removed dead `useCharacterSheetEnhancements` page-model invocation and dead `autoLearnRunes` effect; threaded `shareToken` to print URL.

## Final remediation status

- Canonical persistence work for character-owned tables is implemented across:
  - schema and types (`characters`, `character_powers`, `character_spells`, `character_equipment`, `character_features`),
  - canonical resolver layer with composite ID-first helpers (`findCanonicalEntryById`, `findCanonicalCastableById`, `resolveCanonicalReference`, `resolveCanonicalCastableReference`, `resolveCharacterCanonicalIds`, `isCanonicalEntryAccessible`, `isCanonicalCastableAccessible`),
  - dual-write paths in hooks, automation, pages, sandbox injectors, and bulk operations,
  - guest local persistence (`guestStore` mirrors all canonical IDs and supports symmetric add/remove for features, powers, spells, equipment, techniques, rune knowledge, and sigil inscriptions),
  - offline sync replay (`syncManager`, `offlineStorage` apply `resolveCharacterCanonicalIds` before queued writes),
  - import/export v2.4 covering `characters`, `character_abilities`, `character_equipment` (with container remap), `character_features`, `character_powers`, `character_spells`, `character_techniques`, `character_rune_knowledge`, `character_rune_inscriptions` (with equipment remap), `character_sigil_inscriptions` (with equipment remap), `character_regents`, `character_shadow_soldiers`, `character_shadow_army`, `character_active_spells`, `character_extras`, `character_monarch_unlocks`, `character_regent_unlocks`, `character_feature_choices`, `character_journal`, and `character_backups`,
  - level-up canonical-ID dedup for both guest and Supabase paths.
- Test coverage exists for canonical resolvers (32 tests), guest parity (11 tests), canonical compendium hydration (7 tests), and character creation persistence (1 test).
- Items explicitly deferred or out of scope are recorded in each phase section above.

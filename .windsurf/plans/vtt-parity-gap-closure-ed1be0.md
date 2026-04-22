---
description: Pragmatic implementation plan for closing remaining VTT, effect-system, notes, and homebrew parity gaps in solo-compendium
status: awaiting-approval
source_plan: C:\Users\jjcal\.gemini\antigravity\brain\50ddc0e1-5bb9-4a44-8852-a732d790fc5f\implementation_plan.md.resolved
repo_root: c:\Users\jjcal\Documents\solo-compendium
---

# VTT Parity Gap Closure Plan

## Objective

Close the remaining parity gaps called out by the external plan, but only where the current repository still has real missing behavior.

This plan is intentionally adapted to the repo as it exists today.

## Constraints

- Use existing Rift Ascendant lore and mechanics.
- Do not introduce multiclass support.
- Do not rebuild already-working surfaces just to match the external plan wording.
- Prefer extending the canonical static compendium and current hook stack over adding parallel systems.
- Avoid a broad `VTTEnhanced.tsx` refactor before parity work is stable; only extract focused helpers if a phase becomes too risky otherwise.
- Await approval before any implementation outside this plan artifact.

## Repo Reality Snapshot

### Already implemented enough that they should not be re-scoped as net-new work

- `src/pages/Homebrew.tsx`
- `src/components/homebrew/HomebrewWorkbench.tsx`
  - Homebrew authoring, import/export, publishing, version history, and visibility controls already exist.

- `src/types/vtt.ts`
- `src/lib/vtt/sceneState.ts`
- `src/pages/warden-directives/VTTEnhanced.tsx`
- `src/components/vtt/VttPixiStage.tsx`
  - Scene background image, scale, offsets, weather, terrain, ambient sound zones, scene duplication/deletion, and shared custom asset cleanup already exist.

- `src/hooks/useArmorClass.ts`
- `src/hooks/useCharacterDerivedStats.ts`
- `src/components/CharacterSheet/DefensesModal.tsx`
  - AC breakdown data and UI already exist.

- `src/lib/notePrivacy.ts`
  - Note visibility helpers already support owner/shared/per-player semantics, even though campaign note persistence is still simpler.

- `src/lib/canonicalCompendium.ts`
- `src/data/compendium/staticDataProvider.ts`
- `src/data/compendium/providers/types.ts`
  - Canonical static compendium infrastructure already exists for relics, runes, sigils, tattoos, and other built-in entities.

### Real gaps still present

- Relic, rune, sigil, and tattoo effects are not yet normalized through one authoritative runtime path.
- Tattoos have canonical content, but no visible runtime ownership hook surfaced in `src/hooks/*`.
- `src/pages/warden-directives/RollableTables.tsx` still rolls directly from `src/data/wardenGeneratorContent` arrays instead of compendium-style table entities with formulas.
- Scene-linked music or playlist metadata is not persisted on `VTTScene`, even though one-shot audio sync exists.
- Campaign note storage still persists only `is_shared`, while UI/privacy helpers imply richer privacy semantics.
- Secret text blocks are not parsed or rendered in campaign notes.
- VTT damage application currently subtracts raw HP in `src/pages/warden-directives/VTTEnhanced.tsx` without resistance, immunity, or vulnerability handling.
- Homebrew runtime wiring is partial: the editor exists, `usePublishedHomebrew` exists, and `HomebrewFeatureApplicator` exists, but creation/level-up/add-flow injection is not broadly wired.

### Non-goals for the first implementation pass

- Rebuilding the Homebrew page.
- Re-implementing map backgrounds from scratch.
- Replacing the current note privacy helper model.
- Broadly splitting `VTTEnhanced.tsx` before the parity gaps are closed.

## High-Risk Areas

- `src/hooks/useCharacterDerivedStats.ts`
  - This file already mixes equipment, sigils, custom modifiers, AC detail, encumbrance, and placeholder tattoo state. It is the highest-risk runtime aggregation surface.

- `src/pages/warden-directives/VTTEnhanced.tsx`
  - This file currently owns scene state, audio sync triggers, token HP syncing, and manual damage application.

- `src/hooks/useCampaignNotes.ts`
- `src/components/campaign/CampaignNotes.tsx`
  - The current persistence model is narrower than the privacy helper model, so note privacy work likely needs both schema and UI changes.

## Phase 1 - Unify effect-bearing content into one runtime path

### Outcome

Relics, absorbed runes, active sigils, and tattoos all contribute through one authoritative effect aggregation flow that character math and combat consumers can rely on.

### Authoritative files

- `src/lib/unifiedEffectSystem.ts`
- `src/hooks/useEquipment.ts`
- `src/hooks/useSigils.ts`
- `src/hooks/useRunes.ts`
- `src/hooks/useCharacterDerivedStats.ts`
- `src/data/compendium/staticDataProvider.ts`
- `src/data/compendium/providers/types.ts`
- `src/types/compendium.ts`

### Work items

- Expand the current effect bridge beyond feat/spell/equipment assumptions so it can normalize:
  - relic passive properties
  - relic activated abilities where they create persistent or conditional modifiers
  - absorbed rune features
  - active sigil bonuses
  - tattoo effects and resonance-style bonuses

- Introduce or wire a tattoo ownership/runtime hook rather than leaving tattoo support stranded at the compendium layer.

- Decide a single aggregation order and document it in tests:
  - base character
  - equipment/relics
  - runes
  - sigils
  - tattoos
  - custom modifiers
  - conditions

- Prefer extending existing hook-driven invalidation/query flows first.
- Only add a new typed domain event if cross-surface synchronization cannot be handled cleanly through current hook/state boundaries.

### Dependencies

- May require a new persistence surface for owned tattoos if one does not already exist in Supabase.
- Must preserve existing sourcebook entitlement filtering through the canonical compendium layer.

### Automated verification

- Add unit tests for `src/lib/unifiedEffectSystem.ts` covering relic/rune/sigil/tattoo normalization.
- Add unit tests around `src/hooks/useCharacterDerivedStats.ts` or extracted pure helpers to verify stacking order and deterministic outputs.

### Manual verification

- Equip a relic and confirm derived stats update.
- Absorb a rune and confirm its effect appears in the same downstream math path.
- Activate/deactivate a sigil and confirm recalculation.
- Apply a tattoo and confirm the effect is reflected without duplicating or bypassing the canonical effect stack.

## Phase 2 - Promote rollable tables into canonical compendium entities

### Outcome

Rollable tables become canonical table entities with row metadata and dice formulas, while the Warden UI keeps its current workflow and campaign sharing behavior.

### Authoritative files

- `src/pages/warden-directives/RollableTables.tsx`
- `src/data/wardenGeneratorContent`
- `src/data/compendium/providers/types.ts`
- `src/data/compendium/staticDataProvider.ts`
- `src/lib/canonicalCompendium.ts`
- `src/types/compendium.ts`
- `src/lib/vtt/inlineRolls.ts`

### Work items

- Define a compendium-facing table shape with at minimum:
  - `id`
  - `name`
  - `category`
  - `diceFormula`
  - `rows`
  - `source_book`
  - optional tags/description

- Seed canonical table entries from the existing `wardenGeneratorContent` constants instead of duplicating prose in `RollableTables.tsx`.

- Update `RollableTables.tsx` to consume table entities rather than raw arrays.

- Preserve current page behavior:
  - local tool-state persistence
  - campaign sharing
  - AI enhancement of rolled results

- Decide whether dynamic dice parsing should reuse the current inline roll/parser helpers or a small dedicated table roller.

### Dependencies

- If built-in tables are sufficient for the first pass, this phase can remain static-only and avoid a database migration.
- If user-authored or campaign-authored tables are required later, plan a second persistence pass separately.

### Automated verification

- Add pure tests for table-row selection from a dice formula.
- Add component tests for `RollableTables.tsx` tab switching, roll output, and share behavior using the new entity source.

### Manual verification

- Roll at least one table from each tab.
- Confirm results still share into campaign messages.
- Confirm AI enhancement still reads the current results payload.

## Phase 3 - Persist scene-linked atmosphere and harden map/background behavior

### Outcome

Scene activation applies not only the existing background and weather state, but also scene-owned music or playlist metadata in a way that survives save/load and realtime scene switches.

### Authoritative files

- `src/types/vtt.ts`
- `src/lib/vtt/sceneState.ts`
- `src/hooks/useVTTRealtime.ts`
- `src/pages/warden-directives/VTTEnhanced.tsx`
- `src/pages/player-tools/PlayerMapView.tsx`
- `src/components/vtt/WardenToolsPanel.tsx`
- `src/components/vtt/VttPixiStage.tsx`

### Work items

- Extend `VTTScene` with explicit scene-level audio metadata rather than relying only on immediate playback events.
- Candidate fields:
  - `musicMood`
  - `playlistId`
  - `trackId`
  - `autoplay` or equivalent flag

- Keep one-shot SFX support separate from scene-owned ambient state.

- Change Warden atmosphere controls so scene editing can persist current ambience rather than only firing transient sounds.

- On live scene change:
  - Warden and players should load the scene background as they already do
  - weather should remain scene-derived as it already is
  - music/playlist should now also be scene-derived and re-applied locally

- Treat background rendering as a validation/hardening subtask, not a net-new feature.
- Specifically regression-test:
  - upload map
  - clear map
  - duplicate scene
  - delete scene
  - switch live scene

### Dependencies

- Must remain compatible with the current shared custom asset model and scene cleanup logic.
- Should avoid a broad refactor of `VTTEnhanced.tsx`; extract only focused helpers if needed to keep changes safe.

### Automated verification

- Add unit tests for `src/lib/vtt/sceneState.ts` covering scene clone/delete/persist behavior for new audio fields.
- Add narrow tests for realtime scene hydration if feasible.

### Manual verification

- Set scene-specific weather and music, switch scenes, reload, and confirm persistence.
- Verify players receive the same scene audio intent on scene change.
- Verify background image scale/offset survives scene save/load.

## Phase 4 - Bring campaign note persistence up to the privacy model and add secret blocks

### Outcome

Campaign notes support richer privacy semantics and secret segments instead of only a coarse shared/private toggle.

### Authoritative files

- `src/hooks/useCampaignNotes.ts`
- `src/components/campaign/CampaignNotes.tsx`
- `src/lib/notePrivacy.ts`
- `src/integrations/supabase/types.ts`

### Work items

- Expand campaign note persistence beyond `is_shared` so it can carry the privacy model implied by `SecuredNote.privacy`.
- Prefer a migration path that preserves existing shared/private notes.

- Add secret content support using either:
  - inline secret block markers in note content
  - or structured block metadata persisted with the note

- Render secret segments differently for Warden vs permitted players.

- Preserve title visibility rules where appropriate.

- Upgrade the campaign note editor UI to manage privacy without discarding the current simple workflow for basic notes.

### Dependencies

- Requires schema/type changes for `campaign_notes` if privacy metadata is persisted server-side.
- Needs a clean fallback for guest/local notes.

### Automated verification

- Add unit tests for secret-block parsing and permission filtering.
- Add tests for legacy `is_shared` note migration behavior.

### Manual verification

- Verify Warden-only note.
- Verify shared note.
- Verify per-player note if supported in the first pass.
- Verify a mixed note with public text plus secret sections renders correctly for Warden and player roles.

## Phase 5 - Centralize damage type application before HP mutation

### Outcome

Damage application honors resistances, immunities, and vulnerabilities before token HP and character HP are updated.

### Authoritative files

- `src/lib/actionResolution.ts`
- `src/hooks/useCombatActions.ts`
- `src/hooks/useCharacterDerivedStats.ts`
- `src/pages/warden-directives/VTTEnhanced.tsx`
- `src/components/vtt/VTTInitiativePanel.tsx`

### Work items

- Create a single damage-resolution helper or service that accepts:
  - raw damage
  - damage type
  - target mitigation data
  - optional override mode for Warden raw adjustments

- Wire VTT damage application to that helper instead of subtracting raw HP directly.
- Current raw subtraction occurs in `src/pages/warden-directives/VTTEnhanced.tsx`.

- Reuse structured `damageType` information already produced by `useCombatActions` and `actionResolution` wherever possible.

- Decide how the VTT manual damage dialog should choose a type when the damage did not originate from an action payload.

- Keep an explicit raw-admin override path so the Warden can still set HP manually when needed.

### Dependencies

- Needs a reliable source of target mitigation data for both tokens linked to characters and unlinked tokens.
- Must not regress the existing token-to-character HP sync behavior.

### Automated verification

- Add unit tests for:
  - resistance halves damage
  - immunity zeroes damage
  - vulnerability increases damage
  - unknown damage type leaves damage unchanged

### Manual verification

- Apply typed damage to a character token with known resistance.
- Apply typed damage to a character token with immunity.
- Apply typed damage to a character token with vulnerability.
- Confirm both token HP and character HP sync to the same final value.

## Phase 6 - Finish homebrew runtime wiring without rebuilding Genesis Studio

### Outcome

Published homebrew appears in the actual gameplay and character progression surfaces that should consume it, while the existing editor stays intact.

### Authoritative files

- `src/pages/Homebrew.tsx`
- `src/components/homebrew/HomebrewWorkbench.tsx`
- `src/hooks/useHomebrewContent.ts`
- `src/components/character/HomebrewFeatureApplicator.tsx`
- `src/components/character/LevelUpWizardModal.tsx`
- `src/pages/CharacterNew.tsx`
- relevant add-dialogs and resolver layers as needed

### Work items

- Treat the existing Homebrew page/editor as complete enough for now.
- Do not rewrite it.

- Audit and replace dead or cache-only runtime wiring paths.
- In particular, the current `useHomebrewCharacterIntegration()` path should be treated as suspect until a real consumer audit proves otherwise.

- Wire published homebrew into the character flows that should actually consume it:
  - character creation
  - level-up
  - relevant add-item/add-power/add-technique/add-feat pickers if appropriate

- Decide one consistent runtime strategy:
  - merge published homebrew into picker lists at query time
  - or merge through a resolver layer
  - but avoid mixing both approaches inconsistently across flows

- Preserve `HomebrewFeatureApplicator` for explicit opt-in feature application where it still adds value.

### Dependencies

- Must align with the existing homebrew publication and visibility rules in `useHomebrewContent.ts`.
- Should not bypass campaign-scoped or public visibility filtering.

### Automated verification

- Add integration tests around published homebrew appearing in at least one creation flow and one progression flow.
- Add tests for visibility scoping where practical.

### Manual verification

- Publish homebrew content from Genesis Studio.
- Confirm it appears in the intended picker flow.
- Apply it to a character and confirm downstream stats or features update correctly.

## Suggested Implementation Order

1. Phase 1 - unified effect path
2. Phase 5 - typed damage application
3. Phase 3 - scene-linked atmosphere
4. Phase 4 - notes privacy and secret blocks
5. Phase 2 - canonical rollable tables
6. Phase 6 - homebrew runtime wiring

## Rationale for the order

- Phase 1 establishes the effect authority that later combat and character behavior should trust.
- Phase 5 is high-value and directly player-facing, but depends on a cleaner view of mitigation data.
- Phase 3 touches VTT persistence and realtime behavior and should land before any optional cleanup refactors.
- Phase 4 is partly schema-driven and benefits from the earlier VTT stabilization.
- Phase 2 is self-contained once the compendium shape decision is made.
- Phase 6 should land after the canonical and runtime integration story is clearer, so homebrew can plug into the same surfaces instead of inventing parallel behavior.

## Cross-Cutting Automated Verification

- Run targeted unit tests for any new pure helpers.
- Run `npx tsc --noEmit` after each implemented phase.
- Add focused regression coverage for:
  - `src/lib/vtt/sceneState.ts`
  - `src/lib/actionResolution.ts` and any new damage helper
  - `src/lib/notePrivacy.ts` and any new secret-block parser
  - `src/lib/unifiedEffectSystem.ts`

## Cross-Cutting Manual Verification

- Warden scene switching with players connected.
- Equip/inscribe/absorb/apply content and verify character math changes once.
- Run a VTT combat damage flow with at least one resistant target and one vulnerable target.
- Create notes with both visible and secret content and view them from different roles.
- Publish homebrew and consume it from at least one non-editor runtime surface.

## Exit Criteria

- No phase ships by duplicating a feature that the repo already has.
- The remaining parity gaps are covered by runtime-authoritative code paths rather than page-local exceptions.
- Backgrounds, scene weather, and shared assets remain stable after the atmosphere work.
- Campaign notes persist privacy intent instead of flattening everything to `is_shared`.
- Damage application respects damage type mitigation before HP sync.
- Published homebrew is consumable in real gameplay or progression flows, not only editable in Genesis Studio.
- User approval is obtained before implementation begins.

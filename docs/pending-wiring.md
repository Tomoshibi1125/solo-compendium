# Pending-Wiring Backlog (Knip-flagged, kept deliberately)

_Last updated: 2026-07-02_

## Program status — AFA best-in-class rebuild (2026-06-29)

The app is being taken to best-in-class as the in-world **AFA (Ascendant Field App)**. Landed so far:

- **Phase 0 — cleanup (done).** Session audio fully removed (VTT-era): deleted `components/audio/`,
  `lib/audio/`, `hooks/useAudioProtocol.ts`, `hooks/useRiftSound.ts`,
  `pages/warden-directives/AudioManager.tsx` + wiring (App route, RouteEffects title, toolCatalogs
  entry); uninstalled `howler`/`@types/howler`. **AI-audio also pruned** — `generateAudio`/
  `analyzeAudio`/`extractAudioFeatures` + audio schemas removed from `lib/ai/aiService.ts` /
  `lib/ai/types.ts`, and `useAIAudioAnalysis`/`useAIAudioGeneration` removed from `lib/ai/hooks.ts`;
  audio tests pruned. The dice roller's own SFX (`lib/dice/audio`) is kept. `fieldOverrides.ts`
  dropped. `SourceBookCallout` + `ProtocolBroadcastButton` wired into `players-book/IntroChapter`.
  Standalone Dungeon Map tool removed (route/page/import); `/player-tools/map` repoints to the Rift
  Generator. Sovereign overlay wired into `CharacterSheetV2` (`SovereignOverlayPanel` +
  `useSovereignReady` no longer pending).
- **Phase 1 — flagship (done).** Rift Generator (`GateGenerator`) auto-builds the **Interior map**
  from the packet (no manual click), packet-faithful rooms/markers/room-key, SVG/PNG/JSON/print
  export, and campaign save.
- **Phase 2 — Meridian (done).** Lore fixed (no standing rift sites) + table-ready vector overlay
  (city + 9 districts, POI pins, legend, compass/scale, print).
- **Phase 3 Wave A — structured generators (done).** NPC, Treasure, RandomEvent, Directive, Relic,
  Rollable Tables rebuilt to structured records + generation history + md/json export + AI
  enrichment. Shared scaffolding added: `lib/generationHistory.ts`,
  `components/warden-directives/GenerationHistoryPanel.tsx`, `lib/toolExport.ts`.

**Complete (2026-06-29):** Wave B (EncounterBuilder, PartyTracker, InitiativeTracker), Wave C
(SessionPlanner, ArtGenerator, Marketplace, ContentAudit, QuestLog export), the **Regent Status**
page, the catalog prune, and the RA visual overhaul (semantic palette sweep + book-brand print) all
shipped. The AFA best-in-class program is closed; `useLiveEncounterScaler` is consumed by Wave B.

---

## Why this file exists

The repo previously contained a **dependency-proof shim** (`WardenWiringHub.tsx` +
`WardenDirectiveMatrix.tsx` + `lib/maintenance/DependencyProof.ts`) and a barrel
(`src/index.ts`) that artificially imported hundreds of symbols so Knip would never report
them. That made Knip untrustworthy. Those files have been removed, so `npx knip` is now
accurate.

Knip now reports the items below as unused. **They are intentionally retained** — they are
not-yet-wired features ("pending UI implementation"), not dead code. This file is the record
of that decision so the items aren't silently re-flagged or deleted. Delete an item only
after confirming there is no near-term plan to wire it.

Run `npx knip` to regenerate the live list.

## Unused files (14)

These were audited against the live character sheet (`CharacterSheetV2`) to answer "does anything
*need* wiring that isn't wired yet?" **Verdict: no core functionality is missing.** Every essential
sheet feature — ability scores, skills, saves, senses, proficiencies, languages, HP/damage/heal,
short rest, long rest, death saves, hit dice, spell slots, job resource pools, limited-use tracking,
level-up, equipment, features, paths, regent unlocks/features, runes, tattoos, shadow soldiers,
crafting, vehicles, journal, currency — is wired into `CharacterSheetV2`. The list splits into:

### A. Legacy duplicates — superseded by wired V2 code (safe to delete when convenient)
| File | Superseded by (wired) |
| --- | --- |
| `src/components/CharacterLevelUp.tsx` | `character/LevelUpWizardModal` |
| `src/components/CharacterSheet/LongRestDialog.tsx` | V2 one-click Long Rest button → `handleLongRest` |
| `src/components/CharacterSheet/ProficienciesLanguages.tsx` | `character-v2/ProficiencySidebar` + `character/LanguagesPanel` + `ToolProficienciesPanel` |
| `src/components/CharacterSheet/SensesDisplay.tsx` | `character-v2/ProficiencySidebar` (senses section, `stats.senses`) |
| `src/components/character/CharacterResourcesPanel.tsx` | `JobResourcePools` + `LimitedUseAggregator` + `SpellSlotsDisplay` + `DeathSaveTracker` |
| `src/components/character/CharacterFAB.tsx` | V2 in-sheet action buttons |
| `src/hooks/useCharacterAbilities.ts` | `useCharacterPageModel` ability path (0 consumers) |
| `src/lib/deathSaves.ts` | `CharacterSheet/DeathSaveTracker` (via `StatusHeader`) |
| `src/lib/restAutomation.ts` | `sheetController.handleLongRest` (via `useCharacterPageModel`) |
| `src/lib/spellCasting.ts` | `hooks/useSpellCasting` (the wired spellcasting path) |
| `src/data/compendium/providers/utils.ts` | none — true orphan util (0 consumers) |
| `src/components/navigation/MegaMenu.tsx` | responsive nav (mobile bottom nav) |
| `src/components/navigation/MobileAccordionMenu.tsx` | responsive nav _(sole importer of the `vaul` dep)_ |

### B. Genuinely pending non-critical features (intended, not yet wired — no core breakage)
- `src/hooks/useLiveEncounterScaler.ts` — Warden encounter-scaling tool. **Queued for Wave B**
  (wired into `EncounterBuilder`); this entry should clear once that lands.

## Unused dependencies (2)
- `vaul` — sole consumer is `MobileAccordionMenu.tsx` above. Knip's flag is **accurate**: the dep is
  unreachable because its consumer is unwired. Remove `vaul` if/when that component is deleted; keep
  it while the component is retained as pending.
- `@radix-ui/react-slider` — orphaned when the audio player was deleted (its only consumer). Retained
  as a base UI-kit primitive; Wave B/C tool controls (e.g. encounter scaler, sliders) will reuse it.

## Unused exports (~169) and exported types (~57)
These live inside modules that are otherwise used (e.g. `lib/riftFavor`,
`lib/resourceTracking`, `lib/advancedDiceEngine`, `lib/conditionSystem`,
`integrations/supabase/supabaseExtended`, `lib/ai/*`). They are scaffolding for pending
features. **Do not bulk-delete** — prune per-module when wiring the feature or when a module
is confirmed dead. `ignoreExportsUsedInFile: true` is set, so these are genuinely
unconsumed across the project, not just within their own file.

## Removed in cleanup passes (for reference)
- **Shim trio + barrel:** `WardenWiringHub.tsx`, `WardenDirectiveMatrix.tsx`,
  `lib/maintenance/DependencyProof.ts`, `src/index.ts`.
- **Audio (VTT-era):** `components/audio/*`, `lib/audio/*`, `hooks/useAudioProtocol.ts`,
  `hooks/useRiftSound.ts`, `pages/warden-directives/AudioManager.tsx`; AI-audio methods/hooks/types
  in `lib/ai/*`. Deps `howler`/`@types/howler`.
- **Legacy/VTT orphans:** `data/premadeMaps.ts`, `data/tokens.ts`, `lib/rapierCompat.ts`,
  `lib/fieldOverrides.ts`.
- **Dependencies:** `honeycomb-grid`, `perfect-freehand`, `robust-point-in-polygon` (VTT
  leftovers); `@dimforge/rapier3d` (the dice roller uses **`@react-three/rapier`**, which
  bundles its own `@dimforge/rapier3d-compat`; the standalone package was only referenced by
  the now-deleted `rapierCompat.ts`); `@mediapipe/tasks-vision` (no importers anywhere).

## Knip config notes
- `ignoreDependencies`: `tailwindcss`, `tailwindcss-animate`, `@tailwindcss/typography` are
  loaded via `@plugin` / `@import` directives in `src/index.css` (Tailwind v4 CSS-based
  config). Knip cannot see CSS-directive usage, so these would be false positives without the
  ignore. They are genuinely used.
- Remaining advisory hints are intentionally accepted: `src/main.tsx` is listed explicitly
  for readability (Knip's vite plugin also auto-detects it); the `src/components/ui/**` and
  `src/integrations/supabase/types.ts` ignores cover the shadcn UI kit and generated Supabase
  types, both of which keep deliberately-unused exports.

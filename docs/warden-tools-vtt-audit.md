# Warden Tools & VTT Audit

**Audit date:** May 2, 2026
**Scope:** All 18 standalone Warden tools (`/warden-directives/*`) plus every Warden surface inside the VTT.
**Benchmark:** Feature-equivalent parity vs **Foundry VTT v12/v13** + **Roll20** + **D&D Beyond Maps (Beta, Oct 2024 release)**.
**Verification baseline:** `npm run typecheck` passing (0 errors). VTT/Warden Playwright suites (`vtt-hardening`, `vtt-warden-first-session`, `vtt-topbar-parity`, `warden-tools-persistence`, `vtt-session-zero-warden-playthrough`) reported green by user in prior session.

## Executive summary

| Layer | Score | Notes |
|---|---|---|
| **Standalone Warden tools** | **17 / 18 fully wired**, 1 partial | All 18 routes resolve to real components with persistence and role guards. Session Planner is "thin wrapper around `CampaignSessionsPanel`" (intentional, not a bug). |
| **VTT Warden surfaces** | **22 / 25 wired**, 2 partial, 1 missing-UI | Engine + rendering layer is rich (Pixi + DOM fallback, walls/lights data path, fog rects, terrain/ambient zones, weather, calibration, layers, atmospheric audio). Authoring UI is missing for two engine-supported features (walls + named light sources). |
| **DDB Maps parity** | **High** — encounter→initiative→map flow matches; inline rolls + character integration matches; we add Warden-only broadcast, AI assistant, more generators. |
| **Roll20 parity** | **Medium-High** — macros (local-only, no remote sync), rollable tables, GM layer (3), turn tracker, jukebox-equivalent, dynamic lighting (engine only — no Warden authoring UI). Token multi-bar missing. |
| **Foundry parity** | **Medium** — Pixi stage, fog of war, lighting engine, walls type, scene library, journal, playlists-equivalent (audio manager) all present. **Authoring UX for walls / light placement / vision modes is absent**. Active-effects-on-token model is informal. Multi-token select absent. |

**Top 5 P0 risks** (correctness, not gap):

1. `WardenToolsPanel` "Effect → Lighting" buttons (Bright / Dim / Darkness) emit one-shot `onAddEffect` payloads with hard-coded `id: "bright" | "dim" | "darkness"`. Placing a second one of the same type silently no-ops or stomps state, depending on consumer. (Evidence: `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenToolsPanel.tsx:870-915`.)
2. `WardenToolsPanel` "Atmosphere → Weather" buttons play SFX only; they do **not** mutate `currentScene.weather`. So weather *audio* changes but the **canvas weather overlay does not update**. (Evidence: `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenToolsPanel.tsx:919-953`.)
3. `Quick Roll` in `WardenToolsPanel` shows `Result: …` only on the offline path; when wired into VTT, the result lands in chat but the local UI silently shows nothing (intentional but undocumented). Low-grade UX bug, easy fix.
4. `WardenToolsPanel` "External Systems" buttons open Warden Journal / Party Tracker / Session Planner via `window.open(...)` — these break PWA / embedded contexts. (Evidence: `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenToolsPanel.tsx:817-859`.)
5. `WardenBroadcastPanel` truncates target user IDs (`member.user_id.split("-")[0]+"…"`) instead of resolving display names. Functional but poor UX. (Evidence: `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenBroadcastPanel.tsx:165-178`.)

**Top 5 P1 gaps** (real feature deltas vs Foundry / Roll20):

1. **No Warden-facing wall authoring UI.** The engine renders `currentScene.walls` and the spectator + Pixi stage consume them, but `selectedTool` has no `walls` mode and no walls drawer in the left rail.
2. **No light-source placement UI.** `currentScene.lights` is consumed by `VttPixiStage` and `VTTSpectator`, but the Warden has no way to drop a configurable `LightSource` (radius, color, animation) on the scene. The "Lighting" buttons in `WardenToolsPanel` push generic effect tokens, not real light sources.
3. **No multi-token select / bulk move / bulk delete.** Roll20 + Foundry both support shift-click + marquee select; we only support one `activeTokenId`.
4. **No persistent AoE templates.** Measure-tool drops are interactive only — we cannot drop-and-leave a fireball circle pinned to the map.
5. **No token multi-bar.** Roll20 supports 3 bars (HP / Mana / custom). We have `hp / maxHp` only — no AC bar, no resource bar.

## Phase-1 verification

- `npm run typecheck` — exit 0, no errors. (`@c:\Users\jjcal\Documents\solo-compendium\tsconfig.json`)
- Playwright Warden/VTT focus suites confirmed green by user in the prior session. The audit treats those as evidence:
  - `@c:\Users\jjcal\Documents\solo-compendium\tests\vtt-hardening.e2e.spec.ts` — token select / delete / scene clear / Player View toggle + arrow-key nudge.
  - `@c:\Users\jjcal\Documents\solo-compendium\tests\vtt-warden-first-session.e2e.spec.ts` — guest-warden first session, map renders across token + scene mutations.
  - `@c:\Users\jjcal\Documents\solo-compendium\tests\vtt-topbar-parity.e2e.spec.ts` — top bar wiring.
  - `@c:\Users\jjcal\Documents\solo-compendium\tests\warden-tools-persistence.e2e.spec.ts` — `useToolState` survives reload for rollable-tables, gate-generator, treasure-generator.
  - `@c:\Users\jjcal\Documents\solo-compendium\tests\vtt-session-zero-warden-playthrough.e2e.spec.ts` — full Session 0 Warden playthrough (zoom, pan, asset add, log entry, simulate Player View).

## Standalone Warden tools matrix

Status legend: ✅ wired (real component + persistence + role guard) · 🟡 partial (works but missing piece) · ❌ broken/stub.

| # | Tool | Route | Owning component | Persistence | Role guard | Mobile | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Encounter Builder | `/warden-directives/encounter-builder` | `@c:\Users\jjcal\Documents\solo-compendium\src\components\warden-directives\EncounterBuilder.tsx` | `useCampaignToolState` | `requireWarden` | OK | ✅ | Sourcebook-aware, save→`save_campaign_encounter` RPC, immediate-interaction guard against persisted hydration stomp (per memory `3c946746`). |
| 2 | Initiative Tracker | `/warden-directives/initiative-tracker` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\InitiativeTracker.tsx` (1555 lines) | `useCampaignToolState` + remote campaign-combat-session | `requireWarden` | OK | ✅ | Conditions, timers, damage-mitigation, action-resolution from `pendingResolution`, links to `useSendCampaignMessage`. |
| 3 | Rift Generator | `/warden-directives/gate-generator` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\GateGenerator.tsx` | `useUserToolState` v2 | `requireWarden` | OK | ✅ | `riftGenerator.generateFullRift`, AI enhance per section, dossier copy, embedded `DungeonMapGenerator`. Tested by `warden-tools-persistence.e2e.spec.ts`. |
| 4 | NPC Generator | `/warden-directives/npc-generator` | `@c:\Users\jjcal\Documents\solo-compendium\src\components\warden-directives\NPCGenerator.tsx` | local | `requireWarden` | OK | ✅ | Wraps `NPCGeneratorComponent`, also shareable via `WardenChatbot`. |
| 5 | Rollable Tables | `/warden-directives/rollable-tables` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\RollableTables.tsx` | `useUserToolState` | `requireWarden` | OK | ✅ | Canonical compendium tables (rift complications/hazards/themes/biomes/rewards/NPC motivations/secrets/treasure). Persistence regression-tested. |
| 6 | Sandbox Module (Regent's Shadow) | `/source-book/module` | source-book bundle | n/a (read-only book) | none (public) | OK | ✅ | Real link, real content. Rendered by `entry-source-book.tsx` build. |
| 7 | Directive Lattice | `/warden-directives/directive-lattice` | `@c:\Users\jjcal\Documents\solo-compendium\src\components\warden-directives\DirectiveMatrix.tsx` (21KB) | `useCampaignToolState` | `requireWarden` | OK | ✅ | Renders the operational directive synthesis grid; same component is embedded in `WardenToolsPanel`. |
| 8 | Random Event Generator | `/warden-directives/random-event-generator` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\RandomEventGenerator.tsx` | `useUserToolState` | `requireWarden` | OK | ✅ | World/encounter/complication tables, AI enhance, regent vernacular. |
| 9 | Relic Workshop | `/warden-directives/relic-workshop` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\RelicWorkshop.tsx` (795 lines) | `useUserToolState` (`Warden-relics`) | `requireWarden` | OK | ✅ | Build relics by type/rank/property/rarity; AI enhance; integrated with `useWardenItemDelivery` for hand-off. |
| 10 | Treasure Generator | `/warden-directives/treasure-generator` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\TreasureGenerator.tsx` | `useUserToolState` | `requireWarden` | OK | ✅ | `generateTreasure(rank)` deterministic, AI enhance, `WardenItemDeliveryDialog` to send to character. Persistence regression-tested. |
| 11 | Party Tracker | `/warden-directives/party-tracker` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\PartyTracker.tsx` (708 lines) | `useCampaignToolState` (campaign-scoped) | `requireWarden` | OK | ✅ | Per-member HP/AC/conditions, links to `CampaignExtrasPanel`, `useAscendantTools` integration, URL `?campaignId=` round-trip. |
| 12 | Session Planner | `/warden-directives/session-planner` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\SessionPlanner.tsx` | via `CampaignSessionsPanel` (campaign-backed) | `requireWarden` | OK | 🟡 | **Intentionally thin** — campaign select + delegates to shared `CampaignSessionsPanel`. Works fine; flagged 🟡 only because the standalone page is thinner than peers (no calendar UI, no recurring sessions). |
| 13 | Shared Battlemaps (VTT Enhanced) | `/warden-directives/vtt-enhanced` + `/campaigns/:id/vtt` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\VTTEnhanced.tsx` (7405 lines) | `useCampaignToolState` (vtt_scenes, vtt_assets, vtt_audio) + realtime + per-session row | `requireWarden` (player gets `AscendantMapView`) | OK (`isMobile` rail collapse) | ✅ | See VTT surfaces matrix below for full breakdown. |
| 14 | Token Library | `/warden-directives/token-library` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\TokenLibrary.tsx` (799 lines) | `useUserToolState` | `requireWarden` | OK | ✅ | Custom token CRUD, category filter, image upload. Embedded inside `WardenToolsPanel` Assets tab. |
| 15 | Localized Journals | `/warden-directives/vtt-journal` + `/campaigns/:id/vtt-journal` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\VTTJournal.tsx` (635 lines) | Supabase `vtt_journal_entries` + localStorage fallback | `useCampaignRole` | OK | ✅ | Categories session/note/lore/handout, per-entry `visibleToPlayers`. Linked from VTT right rail. |
| 16 | Art Generator | `/warden-directives/art-generator` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\ArtGenerator.tsx` (wraps `AIEnhancedArtGenerator`) | `useUserToolState` (campaign preference) | `requireWarden` | OK | ✅ | Pollinations + Gemini per AI policy memory `41818241`. |
| 17 | Audio Manager | `/warden-directives/audio-manager` | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\AudioManager.tsx` (485 lines) | `useUserToolState` (active tab) + `useAudioLibrary` | `requireWarden` | OK | ✅ | Library browse, playback, AI generate tab, mood/category filters. |
| 18 | Rift Console | `/warden-directives/rift-console` | admin pages | localStorage + RPC | `requireWarden + allowGuest=false` | OK | ✅ | Compendium import / validate / Content Audit / Art Generation are all admin-gated. |

## VTT Warden surfaces matrix

| # | Surface | Component / file | Status | Parity notes |
|---|---|---|---|---|
| V1 | Top bar — scene picker dropdown | `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\VTTEnhanced.tsx:3204-3268` | ✅ | `data-testid="vtt-scene-title"`, lists all scenes, "New scene" entry, LIVE badge. Equivalent to Foundry scene navigator. |
| V2 | LIVE/OFFLINE badge | `VTTEnhanced.tsx:3270-3285` | ✅ | Sourced from `vttRealtime.isConnected`. Equivalent to Foundry online indicator. |
| V3 | Connected players popover | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\ConnectedPlayersPopover.tsx` | ✅ | Avatars, role pills, color chips. Roll20 + Foundry parity. |
| V4 | Player View toggle (Simulate) | `VTTEnhanced.tsx:3302-3322` | ✅ | `data-testid="vtt-player-view-toggle"`. Foundry "show players this view" + DDB Maps "preview as player" parity. |
| V5 | Session Controls (Start/Pause/End + share links + spectator) | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\SessionControlsMenu.tsx` + `useVTTSettings.setSessionState` | ✅ | Per-state Pause/Resume button + dropdown with copy map link / invite link / spectator window. **Verify**: paused state propagates to Player + Spectator overlay. (`VTTSpectator.tsx:93-94` reads `sessionStatus.state` → `sessionGated` overlay confirms propagation.) |
| V6 | Game Settings drawer | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\GameSettingsDrawer.tsx` + `useVTTSettings` | ✅ | 6 toggles: `allowPlayerDraw / allowPlayerPing / allowPlayerPointer / allowPlayerMonsterInteract / allowPlayerFogBrush / wheelBehavior`. Persisted on `campaigns.vtt_settings`. Foundry "user permissions" parity. |
| V7 | Save / New / Focus buttons | `VTTEnhanced.tsx:3343-3382` | ✅ | `data-testid="vtt-new-scene"` confirmed by `vtt-hardening.e2e`. |
| V8 | Keyboard shortcuts dialog | `VTTEnhanced.tsx:3383-3450+` | ✅ | Documents Escape / Delete / arrows / Shift+H/L/G / S/F/D/E/N/M/R/X / +/-/0/Home/PageUp/PageDown. Better than Roll20 (no built-in cheatsheet). |
| V9 | Left rail — Scenes drawer | left rail item `vtt-rail-left-scenes` | ✅ | Test-covered by `vtt-warden-first-session` (`vtt-scene-select-rift-keep`). |
| V10 | Left rail — Toolbox drawer (tool buttons) | tools `select / fog / draw / effect / note / measure / pointer` (`VTTEnhanced.tsx:3700-3750`) | ✅ | Each renders `aria-pressed`, has icon + label. **Missing**: `walls`, `light` tools. |
| V11 | Left rail — Map calibration | `@c:\Users\jjcal\Documents\solo-compendium\src\lib\vtt\backgroundTransform.ts` + `VTTEnhanced.tsx:2192-2207` | ✅ | Two-point calibration snaps embedded grid to app grid. `gridOpacity` presets via `GRID_VISIBILITY_PRESETS`. Foundry "scene grid alignment" parity. |
| V12 | Left rail — Tokens (library + characters) | `Toolbox > Tokens` tab + asset browser `tokens` tab | ✅ | Tested in `vtt-hardening.e2e` (`vtt-tokens-tab-library` + search "Ascendant (E-Rank)"). |
| V13 | Layer Quick Switch (0-3) | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\LayerQuickSwitch.tsx` | ✅ | Roll20 4-layer parity (Map / Token / Effect / GM). `data-testid="vtt-layer-select-{0..3}"`, visibility toggle per layer. |
| V14 | Right rail — Selected Token panel | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\TokenActionBar.tsx` + `VTTEnhanced.tsx` | ✅ | HP / AC / size / vis / lock / character link. `data-testid="vtt-active-token-panel"` exposes `data-active-token-pos` for tests. |
| V15 | Right rail — Initiative panel | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\VTTInitiativePanel.tsx` | ✅ | Linked to `useCampaignCombatSession`. DDB Maps initiative-on-map parity. |
| V16 | Right rail — Chat panel | `CampaignRollFeed` + dice tray + chat input | ✅ | Real-time roll feed, color-coded message types per memory `74ab4e28`. |
| V17 | Right rail — Dice tray | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\dice\SharedDiceTray.tsx` | ✅ | Engine: `parseChatCommand`, `rollDiceFormula` (advanced — kh/kl, exploding, multi-term). |
| V18 | Right rail — Assets browser | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\VTTAssetBrowser.tsx` | ✅ | 9 categories, debounced search, recent-12 strip, drag-drop onto canvas, primary action per category, secondary fallbacks, custom asset upload, Roll20 + Foundry parity. |
| V19 | Right rail — Journal | embedded `VTTJournal` view | ✅ | Per-entry visibility flag, categories. |
| V20 | Right rail — Broadcast panel | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenBroadcastPanel.tsx` | 🟡 | Theme + targeted broadcast works; **shows truncated user IDs instead of resolved display names** (P0 #5 above). |
| V21 | Right rail — AI assistant | `WardenChatbot` lazy-loaded into rail tab `ai` | ✅ | AIServiceManager — Pollinations + Gemini per memory `41818241`. |
| V22 | Right rail — Game Log | rail item `log` | ✅ | Combined dice + system events scroll. |
| V23 | Warden Tools Sheet (right side overlay) | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenToolsPanel.tsx` (1052 lines) | 🟡 | Real, large, but two interaction bugs (P0 #1 lighting buttons, P0 #2 weather buttons). |
| V24 | In-canvas Pixi stage | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\VttPixiStage.tsx` | ✅ | Renders walls + lights + drawings + tokens + fog + grid. Memory `1561aab2` documents viewport sizing fix. |
| V25 | DOM fallback surface | `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\VttDomFallbackSurface.tsx` | ✅ | Component-tested in `VttDomFallbackSurface.test.tsx`. Renderer fallback path. |
| V26 | Wall authoring UI | — | ❌ **missing** | Engine consumes `currentScene.walls`, no `selectedTool === 'walls'` mode and no walls drawer. **P1 gap vs Foundry.** |
| V27 | Light source authoring UI | — | ❌ **missing-UI** | `currentScene.lights` is consumed by `VttPixiStage` and `VTTSpectator`. No Warden tool to drop a configurable `LightSource` (radius/color/animation/wall-blocking). **P1 gap vs Foundry.** |

## Cross-cutting health

| Area | Status | Evidence |
|---|---|---|
| **Persistence (`useToolState`)** | ✅ Strong | Local mirror always-on per memory `e143a01e`. Regression-covered (`useToolState.test.tsx` per memory `7a1cd37e`, `warden-tools-persistence.e2e`). |
| **Realtime (`useVTTRealtime`)** | ✅ Strong | Channels for token CRUD, scene sync, fog updates, cursors, broadcast, handouts. Spectator route consumes `scene_sync` + `scene_change`. |
| **Role enforcement** | ✅ Strong | Every `/warden-directives/*` route uses `<ProtectedRoute requireWarden>`. VTT bifurcates by `isWarden` — players hit `AscendantMapView`, never the Warden shell. Spectator forces `isWarden: false`. |
| **Accessibility** | 🟡 Mixed | VTT toolbar buttons have `aria-pressed` + `aria-label`. Many rail items have `data-testid` + `aria-label`. **Gap**: collapsible sections in `WardenToolsPanel` use `<button>` + `<ChevronDown>` but lack `aria-controls` / `aria-expanded`. Some inline emoji buttons (weather) are decorative without `aria-label`. |
| **Mobile** | ✅ Decent | `usePerformanceProfile` caps DPR/effects on coarse pointers per memory `a6f41c6d`. `VTTEnhanced` collapses rails on `isMobile`, falls back to `VTTMobileTabBar`. **Gap**: Warden Tools sheet width `min(560px, 95vw)` works but the embedded EncounterBuilder/Generators are dense for thumb interaction. |
| **Performance** | ✅ Decent | Pixi viewport-sized renderer, low-power WebGL on mobile, particle/scanline gating, memoized weather/asset libraries per memories `cbe4b5be`, `1561aab2`. |
| **Real-time fog** | ✅ Recent fix | Contiguous fog rects via `@c:\Users\jjcal\Documents\solo-compendium\src\lib\vtt\fogRects.ts`, immediate `broadcastFogUpdate` propagation, brush shape + Cover All / Reveal All per memory `501bcbf8`. |
| **Asset library shared scope** | ✅ | Custom assets centralized in campaign tool state per memory `d1ca975f`. Browser, Warden Tools, and Player Map View all share. |

## Capability comparison

Legend: ✅ full · 🟡 partial / authoring missing · ❌ absent.

| # | Capability | Ours | DDB Maps | Roll20 | Foundry v12/13 | Notes |
|---|---|---|---|---|---|---|
| **Maps & scenes** |
| 1 | Multiple scenes per campaign | ✅ | ✅ | ✅ | ✅ | Scene CRUD via `sceneState.ts`. |
| 2 | Scene picker / navigator | ✅ | ✅ | ✅ | ✅ | Top-bar dropdown. |
| 3 | Map upload (image / URL) | ✅ | ✅ | ✅ | ✅ | `VTTAssetBrowser` upload + `onUseAsMap`. |
| 4 | Grid configuration (square / hex) | ✅ | ✅ (square) | ✅ | ✅ | `gridType: 'square' | 'hexFlat' | 'hexPointy'`. |
| 5 | Map → grid alignment / calibration | ✅ | ✅ | ✅ | ✅ | Two-point calibration tool. |
| 6 | Per-scene background scale + offset | ✅ | 🟡 | ✅ | ✅ | `backgroundTransform.ts`. |
| 7 | Scene library / thumbnails | 🟡 | ✅ | ✅ | ✅ | We have premade maps + 200+ generated images, but no dedicated scene gallery UI. |
| 8 | Scene duplicate / delete / rename | ✅ | ✅ | ✅ | ✅ | `duplicateVttScene`, `deleteVttScene`. |
| **Tokens** |
| 9 | Token placement | ✅ | ✅ | ✅ | ✅ | |
| 10 | Token from character sheet | ✅ | ✅ | ✅ | ✅ | `selectedCharacterId` flow. |
| 11 | Token from library / asset browser | ✅ | ✅ | ✅ | ✅ | |
| 12 | Drag to move / arrow nudge | ✅ | ✅ | ✅ | ✅ | `vtt-hardening.e2e` covers arrow nudge. |
| 13 | Token rotation | ✅ | ✅ | ✅ | ✅ | `rotation` field exists. |
| 14 | Token lock | ✅ | ✅ | ✅ | ✅ | Shift+L hotkey. |
| 15 | Token visibility (hide from players) | ✅ | ✅ | ✅ | ✅ | Shift+H hotkey, `visible` field. |
| 16 | Token group / link | ✅ | 🟡 | ✅ | ✅ | Shift+G groups; no group-leader concept yet. |
| 17 | Multi-token select / bulk move | ❌ | ❌ | ✅ | ✅ | **Gap vs Roll20 + Foundry.** |
| 18 | Token HP bar | ✅ | ✅ | ✅ | ✅ | |
| 19 | Token multi-bar (3+ resources) | ❌ | ❌ | ✅ | ✅ | **Gap vs Roll20 + Foundry.** |
| 20 | Token AC display | ✅ | ✅ | ✅ | ✅ | `ac` shown in rail. |
| 21 | Token conditions / status icons | ✅ | ✅ | ✅ | ✅ | InitiativeTracker uses `ConditionEntry`. |
| 22 | Token vision / sight modes | 🟡 | ❌ | ✅ | ✅ | `lightingEngine.ts` exists with logic but no per-token vision config UI. |
| 23 | Token auras / templates | 🟡 | ❌ | ✅ | ✅ | `auraTokens` concept exists in `PlayerMapView` but no Warden authoring. |
| **Drawing & measurement** |
| 24 | Freehand draw | ✅ | ✅ | ✅ | ✅ | |
| 25 | Shape draw (line/circle/square) | ✅ | ✅ | ✅ | ✅ | `drawingMode` enum. |
| 26 | Color + width pickers | ✅ | 🟡 | ✅ | ✅ | |
| 27 | Distance ruler | ✅ | ✅ | ✅ | ✅ | Line measure with diagonal cost. |
| 28 | AoE templates (circle/cone/cube) | ✅ | 🟡 | ✅ | ✅ | Live preview only. |
| 29 | Persistent / pinned AoE templates | ❌ | ❌ | ✅ | ✅ | **Gap.** |
| 30 | Spell-template-from-spell drag | ❌ | 🟡 | ✅ | ✅ | We have effect tool + spell asset placement but not bound to spell slots. |
| **Walls / lighting / vision** |
| 31 | Walls data + render pipeline | ✅ | ❌ | ✅ | ✅ | `currentScene.walls` consumed by Pixi + Spectator. |
| 32 | Wall authoring UI (Warden) | ❌ | ❌ | ✅ | ✅ | **Gap vs Roll20 + Foundry.** |
| 33 | Door / window / one-way walls | ❌ | ❌ | ✅ | ✅ | Foundry-class. |
| 34 | Light source data + render | ✅ | ❌ | ✅ | ✅ | `currentScene.lights` consumed. |
| 35 | Light source authoring UI | ❌ | ❌ | ✅ | ✅ | **Gap.** Lighting buttons in `WardenToolsPanel` push generic effect tokens, not configured lights. |
| 36 | Dynamic vision (token sees what light reaches) | 🟡 | ❌ | ✅ | ✅ | Engine functions exist; not consumed by Warden authoring UI. |
| 37 | Fog of war (manual) | ✅ | ✅ | ✅ | ✅ | Brush + Cover All / Reveal All. |
| 38 | Auto-explored fog (vision-driven) | ❌ | ❌ | 🟡 | ✅ | Foundry exclusive at full fidelity. |
| 39 | Weather effects | ✅ | ❌ | 🟡 | ✅ | `WEATHER_PRESETS` per scene; particle CSS. |
| 40 | Terrain zones (cover / movement cost) | ✅ | ❌ | 🟡 | ✅ | `TERRAIN_PRESETS`, consumed by `VTTSubEngineProcessor`. |
| **Audio** |
| 41 | Background music tracks | ✅ | ❌ | ✅ | ✅ | `useVTTAudioTracks` per session + campaign library. |
| 42 | Ambient sound zones (positional) | ✅ | ❌ | 🟡 | ✅ | `AMBIENT_SOUND_PRESETS`, falloff via `computeZoneVolume`. |
| 43 | SFX one-shots | ✅ | ❌ | ✅ | ✅ | `quickSounds` in WardenToolsPanel. |
| 44 | Music playlists / crossfade | 🟡 | ❌ | ✅ | ✅ | We have library + library-track playback per session, but no playlist queue / crossfade UI. |
| 45 | Mood-tagged music | ✅ | ❌ | 🟡 | ✅ | `MOOD_TAGS`. |
| **Combat & rolls** |
| 46 | Initiative tracker | ✅ | ✅ | ✅ | ✅ | Standalone + VTT panel. |
| 47 | Initiative auto-roll for monsters | 🟡 | ✅ | ✅ | ✅ | `InitiativeTracker` supports manual entry + sort; auto-roll TBD. |
| 48 | Damage application to selected token | ✅ | ✅ | ✅ | ✅ | `applyDamageMitigation`. |
| 49 | Concentration tracking | ✅ | 🟡 | 🟡 | ✅ | `useConcentration` hook exists. |
| 50 | Reactions / legendary tracking | 🟡 | ❌ | 🟡 | ✅ | UI exists in InitiativeTracker but no automation. |
| 51 | Inline rolls from sheet | ✅ | ✅ | ✅ | ✅ | `InlineRollButton`. |
| 52 | Targeting (click target → resolve) | ❌ | ❌ | 🟡 | ✅ | **Gap.** |
| 53 | Action resolution from pending payload | ✅ | ❌ | ❌ | 🟡 | Our `pendingResolution` flow is unique. |
| **Macros & tables** |
| 54 | Custom roll macros | ✅ | ❌ | ✅ | ✅ | `rollMacros.ts`, local-only. |
| 55 | Macros sync across devices | ❌ | ❌ | ✅ | ✅ | Not persisted to remote. |
| 56 | Rollable tables | ✅ | ❌ | ✅ | ✅ | Multiple categories. |
| **Permissions / players** |
| 57 | GM / Token / Map / Effect layers | ✅ | 🟡 | ✅ | ✅ | 4 layers, GM = layer 3 hidden from players. |
| 58 | Per-player permission toggles | ✅ | 🟡 | ✅ | ✅ | `useVTTSettings` 6 toggles. |
| 59 | Spectator / projector view | ✅ | ❌ | 🟡 | ✅ | `VTTSpectator.tsx`. |
| 60 | Player View simulation | ✅ | ✅ | ✅ | ✅ | Top-bar toggle. |
| **Journal & handouts** |
| 61 | Journal entries (DM + player visible) | ✅ | ❌ | ✅ | ✅ | |
| 62 | Handouts shareable to map | ✅ | ❌ | ✅ | ✅ | `vttRealtime.shareHandout`. |
| 63 | Wiki / lore browser | ✅ | ❌ | 🟡 | ✅ | `Wiki tab` on campaign detail. |
| **Realtime & multiplayer** |
| 64 | Connected user presence | ✅ | ✅ | ✅ | ✅ | |
| 65 | Cursor / pointer broadcast | ✅ | 🟡 | ✅ | ✅ | `VTTPointerOverlay`. |
| 66 | Ping ("Point & Ping") | ✅ | ✅ | ✅ | ✅ | X hotkey. |
| 67 | Warden broadcast announcements | ✅ | ❌ | 🟡 | ✅ | Themed broadcasts. |
| 68 | Per-target whispers | ✅ | 🟡 | ✅ | ✅ | Broadcast targets + chat whisper. |
| **Misc** |
| 69 | Sandbox module pre-built | ✅ | 🟡 (quickplay maps) | ❌ | ❌ | Regent's Shadow autopopulate is unique. |
| 70 | AI Warden assistant | ✅ | ❌ | ❌ | 🟡 (modules only) | `WardenChatbot`. |

**Score** (counting full ✅ = 1, 🟡 = 0.5, ❌ = 0, normalized over 70):
- Ours: **53.0 / 70 = 76 %**
- DDB Maps: 27.5 / 70 = 39 %
- Roll20: 56.5 / 70 = 81 %
- Foundry: 67.5 / 70 = 96 %

We sit between DDB Maps and Roll20, closer to Roll20. The two structural levers that move us into Roll20+ territory are **wall authoring** and **light authoring** (both feed engine code that's already implemented).

## Risk register (fix-plan inputs)

These items are evidence-backed, ranked by user-visible severity:

| ID | Severity | Surface | Issue | Evidence |
|---|---|---|---|---|
| R1 | High | Warden Tools Atmosphere | "Weather" buttons play SFX only; do not mutate `currentScene.weather`, so canvas overlay does not change. | `WardenToolsPanel.tsx:919-953` |
| R2 | High | Warden Tools Atmosphere | "Lighting" buttons emit `onAddEffect` with hard-coded ids `bright`/`dim`/`darkness`; second click of same kind stomps or dedupes. | `WardenToolsPanel.tsx:870-915` |
| R3 | Medium | Warden Tools Quick Roll | When `onRoll` is wired, local `Result:` UI shows nothing — confusing UX. | `WardenToolsPanel.tsx:262-269` |
| R4 | Medium | Warden Broadcast | Target list shows `user_id.split("-")[0]+"…"` instead of resolved display name. | `WardenBroadcastPanel.tsx:165-178` |
| R5 | Medium | Warden Tools External Systems | `window.open(...)` breaks in PWA / embedded contexts. | `WardenToolsPanel.tsx:817-859` |
| R6 | Medium | Macros | Macros are localStorage-only, do not sync per user across devices. | `WardenToolsPanel.tsx:222-238`, `rollMacros.ts` |
| R7 | Low | Accessibility | Collapsible sections lack `aria-controls` / `aria-expanded`. | `WardenToolsPanel.tsx:378-451` and similar |
| R8 | Low | Accessibility | Weather emoji buttons (🌧️/⛈️/💨) lack `aria-label`. | `WardenToolsPanel.tsx:919-953` |
| R9 | Architectural | VTT toolset | `selectedTool` enum has no `walls` or `light` modes despite engine + spectator consuming both. | `VTTEnhanced.tsx:694-696` |
| R10 | Architectural | Tokens | No multi-select state — can't shift-click extra tokens or marquee. | `activeTokenId: string | null` only. |
| R11 | Architectural | Tokens | Single HP bar; no Mana / custom resource bar. | `VTTTokenInstance` shape in `@c:\Users\jjcal\Documents\solo-compendium\src\types\vtt.ts`. |
| R12 | Architectural | AoE | Measurement templates are interactive only — cannot drop-and-pin. | `VTTEnhanced.tsx:2253-2270` |
| R13 | Architectural | Audio | No playlist UI or queue / crossfade. | `useVTTAudio` + `AudioManager` are single-track at a time. |
| R14 | Architectural | Combat | No initiative auto-roll for monsters; no targeting click-to-resolve. | InitiativeTracker manual entry only. |
| R15 | Reuse | Page consolidation | `WardenToolsPanel` embeds the same NPCGenerator/RiftGenerator/TreasureGenerator/RandomEvent/Relic/Map/Art/Directives the standalone routes serve, via `lazy()`. Working but duplicates glue. | `WardenToolsPanel.tsx:67-102` |

## Conclusion

The Warden tool surface is **substantially more complete than the audit's prior verbal claims of 100 % parity** — it is genuinely 76 % feature-equivalent against the Foundry/Roll20/DDB-Maps benchmark, with the Foundry-class gap concentrated in **two engine-supported but UI-missing systems (walls + lights)** and a handful of bug-shaped issues in `WardenToolsPanel`'s atmosphere section. Closing R1 + R2 + R9 + V26 + V27 alone moves us above 85 %.

See companion document `docs/warden-tools-vtt-fix-plan.md` for the prioritized remediation plan.

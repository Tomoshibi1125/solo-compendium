# Warden Tools & VTT — Prioritized Fix Plan

**Companion to:** `@c:\Users\jjcal\Documents\solo-compendium\docs\warden-tools-vtt-audit.md`
**Date:** May 2, 2026
**Triage axis:** P0 = behavior bug (something looks like it works but doesn't, or breaks invariants) · P1 = real Foundry/Roll20 feature gap users will notice · P2 = polish / a11y / consolidation.

Each item is a self-contained work package: scope (one-paragraph delta — minimal upstream fix), files touched, regression test, effort, and dependencies. Priorities mirror the risk register `R1`–`R15` and the missing/partial surface entries `V26` / `V27` from the audit.

## Effort key

- **S** — < 1 hour, single file, ~30 LoC.
- **M** — 1–4 hours, 1–3 files, may touch types or one engine helper.
- **L** — 0.5–2 days, new component or new tool mode, meaningful test work.
- **XL** — 2+ days, requires new schema / new engine subsystem.

## P0 — Bug fixes (must land before any P1 work)

These items are correctness regressions or invariant violations. They are individually small but visible.

### P0-1 — `LightSource` duplicate-id when using preset lighting buttons (`R2`)

**Problem.** `WardenToolsPanel` Lighting buttons hard-code `id: "bright" | "dim" | "darkness"`. The consumer at `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\VTTEnhanced.tsx:5478-5498` uses `e.id || \`light-${Date.now()}\``, so the truthy literal short-circuits the unique-id fallback. Every press appends a *duplicate-id* `LightSource`, breaking React keys, scene-sync diffs, and any future id-based lookup.

**Fix.** Drop the fixed id at the *call site* in `WardenToolsPanel.tsx`. Let the consumer mint a unique id. One-line change × 3 buttons.

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenToolsPanel.tsx:870-915` — remove `id: "bright" | "dim" | "darkness"` lines from the three `onAddEffect` calls (the consumer already mints `\`light-${Date.now()}\`` when `e.id` is falsy).

**Regression test.** Add a unit-level scenario in a new `WardenToolsPanel` test, OR extend `vtt-warden-first-session.e2e.spec.ts` to: open Warden Tools sheet → expand Atmosphere → press "Bright Light" twice → assert `currentScene.lights.length === 2` AND `lights[0].id !== lights[1].id`. Reuse the existing scene-state helper.

**Effort:** **S**.
**Dependencies:** none.

---

### P0-2 — Warden Tools Weather buttons don't mutate scene weather (`R1`)

**Problem.** The 3 weather buttons (🌧️ rain / ⛈️ thunder / 💨 wind) at `WardenToolsPanel.tsx:919-953` only call `resolvedPlaySound(...)` and `logWardenMacro(...)`. They never set `currentScene.weather`, so the canvas weather overlay (rendered from `currentScene.weather`) does not change. Audio plays, visuals don't.

**Fix.** Add an `onWeatherChange?: (weather: WeatherType | null) => void` callback to `WardenToolsPanelProps`, wire each button to call it with the appropriate `WEATHER_PRESETS` key (`rain` / `thunderstorm` / `wind`) plus a fourth "Clear" button to set `null`. The consumer in `VTTEnhanced.tsx` calls `updateScene({ weather })` and broadcasts the scene sync. Same pattern as the existing `onAddEffect` weather-related code paths.

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenToolsPanel.tsx` — add prop, wire 3 (or 4) buttons.
- `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\VTTEnhanced.tsx` — pass `onWeatherChange={(w) => updateScene({ weather: w })}` and broadcast scene sync.
- `@c:\Users\jjcal\Documents\solo-compendium\src\lib\vtt\index.ts` — re-export `WeatherType` if not already exposed (it is, via `import("@/lib/vtt").WeatherType` in `types/vtt.ts`).

**Regression test.** Extend `vtt-warden-first-session.e2e.spec.ts`: open Warden Tools → Atmosphere → press 🌧️ → assert the rain particle layer becomes visible (existing testid `vtt-weather-overlay-rain` if present, else add one) and that the next scene-sync payload carries `weather: 'rain'`.

**Effort:** **S–M** depending on whether the test infrastructure for weather overlay already has a test-id.
**Dependencies:** none.

---

### P0-3 — Quick Roll local UX shows nothing when wired into VTT (`R3`)

**Problem.** When `onRoll` is provided, `WardenToolsPanel.tsx:262-269` deliberately does `setQuickRollResult(null)` because the result will appear in chat. But the user just clicked "Roll" and sees no local feedback at all.

**Fix.** Show a one-line "✓ Sent to chat — see Chat tab" confirmation that auto-dismisses after 1500 ms. Keep `quickRollResult` for the offline path.

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenToolsPanel.tsx:255-280` — add `setQuickRollSent(true)` + `setTimeout(() => setQuickRollSent(false), 1500)` and render an inline status row when truthy.

**Regression test.** None needed (UX-only, low value-to-cost ratio for an e2e). Optional: add a `data-testid="warden-tools-quick-roll-sent-confirm"` and assert it appears+disappears.

**Effort:** **S**.

---

### P0-4 — Warden Tools External-Systems buttons use `window.open(..., "_blank")` (`R5`)

**Problem.** `WardenToolsPanel.tsx:817-859` opens Source Book / Party Tracker / Session Planner / Warden Journal via `window.open(url, "_blank")`. This breaks PWA standalone mode (popup blocked or opened in an unstyled new browser window) and embedded contexts (the embedded provider sets `embedded: true` and routes should stay in-app).

**Fix.** Replace `window.open(url, "_blank")` with `useNavigate()` inside the same SPA, OR use `<a href target="_blank" rel="noopener">` so middle-click + new-tab gestures still work. Recommended: `<Link to={url}>` from react-router for in-app, `<a href target="_blank">` only for the public Source Book route. Detect `useEmbedded()` and prefer in-app navigation when embedded.

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenToolsPanel.tsx:780-859` — convert 4 button click handlers.

**Regression test.** None required, but consider asserting in `vtt-hardening.e2e.spec.ts` that no popup window is created when clicking these buttons (Playwright `page.on('popup', ...)` should not fire).

**Effort:** **S**.

---

### P0-5 — `WardenBroadcastPanel` shows truncated user IDs as recipient labels (`R4`)

**Problem.** At `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenBroadcastPanel.tsx:165-178`, the dropdown of broadcast targets renders `member.user_id.split("-")[0] + "…"`. This is a user-visible UUID fragment. We already use `useCampaignMembers(campaignId)` elsewhere to resolve display names.

**Fix.** Pull `useCampaignMembers` (or the existing resolved-character-name helper used by `ConnectedPlayersPopover`) and render `member.display_name` (or character name → user name → "Player N" fallback). Same pattern as `ConnectedPlayersPopover`.

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenBroadcastPanel.tsx` — swap the truncated label with resolved display name.

**Regression test.** Extend `vtt-warden-first-session.e2e.spec.ts` (or add a focused broadcast test) that asserts the broadcast targets dropdown has at least one option whose visible text is *not* a UUID fragment.

**Effort:** **S**.

---

## P1 — Real feature gaps (Foundry / Roll20 parity)

### P1-1 — Configurable light-source placement (`V27`, `R2`/`R9` adjacent)

**Problem.** Light authoring is limited to 3 hard-coded presets in the Warden Tools sheet, all centered on the scene. There's no way to: (a) drop a light at a chosen canvas location, (b) pick its bright / dim radius, (c) set color or animation, (d) toggle wall-blocking, (e) edit / delete a placed light.

**Fix.** Add a `light` mode to `selectedTool` in `VTTEnhanced.tsx`. Click on the canvas → opens a `LightSourceConfigDialog` populated with `{x, y}` derived from the click. Dialog fields: name, brightRadius (grid units), dimRadius, color (color picker, default `#ffffff`), intensity (0–1 slider), type (`torch` | `ambient`), `respectsWalls` (boolean). On save → push to `currentScene.lights`, broadcast scene sync. Right-click an existing light icon on the canvas → "Edit Light" / "Delete Light" context menu. Reuse the existing `LightSource` type from `@/lib/vtt`.

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\VTTEnhanced.tsx` — add `'light'` to `selectedTool` enum (currently `'select' | 'fog' | 'measure' | 'draw' | 'effect' | 'note' | 'pointer'`), handle canvas-click to open dialog, render light icon overlays in warden mode (already partially rendered in `VttPixiStage.tsx`).
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\LightSourceConfigDialog.tsx` — new component.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\VttPixiStage.tsx` — ensure light icons are clickable in warden mode for context-menu edit.
- `@c:\Users\jjcal\Documents\solo-compendium\src\lib\vtt\sceneState.ts` — add `addLight / updateLight / removeLight` helpers (mirroring `addToken / updateToken / removeToken`).

**Regression test.** New `tests/vtt-light-authoring.e2e.spec.ts`: enter light tool → click at (200, 200) → dialog opens → fill radius 6 → save → assert light appears, scene sync includes the new light, Player View renders the dim/bright zones. Right-click → Delete → assert removal.

**Effort:** **L** (~1 day; new dialog + canvas hit-test + scene helpers + spec).
**Dependencies:** none. Once landed, `WardenToolsPanel` "Lighting" presets become a fast-path that pre-fills and immediately commits without showing the dialog.

---

### P1-2 — Wall authoring tool (`V26`, `R9`)

**Problem.** Engine pipeline already accepts `currentScene.walls: WallSegment[]` and renders them in `VttPixiStage` + `VTTSpectator`. There is no Warden tool to draw walls.

**Fix.** Add `wall` mode to `selectedTool`. Click-drag draws a wall segment between two grid points. Right-click an existing wall → context menu: type (`standard` | `door` | `terrain` | `ethereal` | `window` | `oneway`), open/closed (door only), invisible (yes/no), delete. Render walls on the canvas as colored line segments (already done by `VttPixiStage` if walls exist). Add a "Walls" sub-drawer in the left rail Toolbox with: tool selection (segment / polygon / freehand), wall-type radio, "Clear all walls" button.

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\VTTEnhanced.tsx` — add `'wall'` mode + click-drag handler (similar to existing draw-tool flow).
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WallToolPanel.tsx` — new sub-panel with wall-type radio.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\VttPixiStage.tsx` — already renders walls; ensure warden-mode interactivity (hover highlight, right-click context).
- `@c:\Users\jjcal\Documents\solo-compendium\src\lib\vtt\sceneState.ts` — `addWall / updateWall / removeWall` helpers.
- `@c:\Users\jjcal\Documents\solo-compendium\src\lib\vtt\index.ts` — verify `WallSegment` shape supports the wall types listed above; extend if needed.

**Regression test.** New `tests/vtt-walls-authoring.e2e.spec.ts`: enter wall tool → click-drag from (100,100) to (300,100) → assert one wall added. Right-click → "Door" → assert `walls[0].type === 'door'`. Walk a player token through closed door → assert blocked. Reload → assert walls persist.

**Effort:** **L** (1–1.5 days; tool mode + drag handler + wall-type schema review + spec).
**Dependencies:** verify `WallSegment` schema in `@/lib/vtt/index.ts` supports door/window/oneway flags. If not, schema extension first.

---

### P1-3 — Multi-token select (`R10`)

**Status:** Implemented. Selection state now supports `activeTokenIds`, shift/ctrl/meta-click toggles membership, empty-canvas marquee selection selects tokens by center point, and bulk Delete / nudge / visibility / lock / grouping actions operate on the full selection. Pixi and DOM fallback render all selected tokens.

**Problem.** Only `activeTokenId: string | null` exists. Roll20 + Foundry both support shift-click and marquee-select to operate on N tokens at once.

**Fix.** Replace `activeTokenId` with `activeTokenIds: string[]`. Shift-click toggles a token in/out of the set. Marquee select (drag on empty canvas in `select` mode, no token under cursor) selects all tokens whose center lies within the rect. Bulk operations: arrow nudge moves all selected tokens, Delete deletes all, Shift+H toggles visibility on all. Right-click selected token offers "Group selection" (assigns a fresh `groupId` to all selected). Active-token-panel shows N-token summary when N > 1 (count + bulk action buttons).

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\VTTEnhanced.tsx` — refactor `activeTokenId` → `activeTokenIds`. ~30 call-sites to update.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\TokenActionBar.tsx` — handle multi-select state.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\VttPixiStage.tsx` — render selection rings on all selected tokens and support additive token pointer selection.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\VttDomFallbackSurface.tsx` — mirror multi-selection highlighting and additive token pointer selection in fallback rendering.

**Regression test.** Extend `vtt-hardening.e2e.spec.ts`: Shift-click two tokens → assert both have selection ring → press right arrow → assert both shift one grid unit.

**Effort:** **L** (1–2 days; refactor breadth + careful test coverage).
**Dependencies:** P1-1 / P1-2 land first to avoid merge conflicts in `VTTEnhanced.tsx`.

---

### P1-4 — Persistent / pinned AoE templates (`R12`)

**Problem.** Measure-tool drops are interactive only — release the click and the cone/circle/cube vanishes. Foundry + Roll20 both let you drop and leave a fireball template pinned for the round.

**Fix.** Add a "Pin" button to the active measurement HUD. When pressed, materialize the active shape as a `VTTDrawing` with `kind: 'aoe'` (new variant) so it persists and broadcasts to players. Render in `VttPixiStage` similar to existing shape drawings. Right-click a pinned AoE → Edit / Delete. Add a "Clear all AoE templates" button to the Toolbox > Measure sub-panel.

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\VTTEnhanced.tsx:3080-3127` — when measure HUD is active, render a "Pin" button that calls a new `pinMeasurement()` helper.
- `@c:\Users\jjcal\Documents\solo-compendium\src\lib\vtt\index.ts` — extend `VTTDrawing` (or add `VTTAoeTemplate`) variant.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\VttPixiStage.tsx` — render pinned AoE templates, hit-test for right-click.

**Regression test.** New e2e: select measure tool → cone shape → drag from token → Pin → assert template persists and is visible in spectator view.

**Effort:** **M** (4–6 hours).

---

### P1-5 — Token multi-bar (`R11`)

**Problem.** `VTTTokenInstance` exposes `hp / hp_current / maxHp / hp_max` only. Roll20 supports 3 configurable bars (HP / Mana / custom). Multi-bar is a common ask.

**Fix.** Extend `VTTTokenInstance`:

```ts
bars?: Array<{ id: string; label: string; current: number; max: number; color: string; visible: 'all' | 'controllers' | 'gm' }>
```

Backwards-compat: keep `hp / maxHp` as primary bar, sourced from the first bar if `bars[0].id === 'hp'`. Render up to 3 bars under the token. Add a "Bars" tab to the active-token panel for editing.

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\types\vtt.ts:39-80` — add `bars?` field.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\VttPixiStage.tsx` — render up to 3 stacked bars.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\TokenActionBar.tsx` — Bars tab.
- `@c:\Users\jjcal\Documents\solo-compendium\src\lib\vtt\sceneState.ts` — token migration helper that synthesizes `bars[0]` from legacy `hp / maxHp` so old scenes keep working.

**Regression test.** Add unit test in `lib/__tests__/sceneState.test.ts` for migration. Add e2e to add a Mana bar, set value, reload, assert persisted.

**Effort:** **M** (~6 hours).

---

### P1-6 — Initiative auto-roll for anomalies (`R14`)

**Problem.** `InitiativeTracker` requires manual init entry for every combatant. DDB Maps + Roll20 + Foundry auto-roll for anomaly tokens (using anomaly Dex modifier).

**Fix.** When opening Initiative for a campaign with monster tokens on the active scene, auto-prefill `initiative = 1d20 + (monster.dex_mod ?? 0)` for any token whose `tokenType === 'Anomaly' | 'npc' | 'monster'` and `initiative` is unset. Surface a "Re-roll all monsters" button in the tracker header. Player-controlled tokens stay manual.

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\InitiativeTracker.tsx` — auto-roll on open.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\VTTInitiativePanel.tsx` — same logic for the rail panel.

**Regression test.** Unit test the auto-roll function with a mocked RNG.

**Effort:** **M** (~3 hours).

---

### P1-7 — Targeting click-to-resolve (`R14` continued)

**Status:** Implemented. Tokens can be targeted from the token action bar or right-click context menu, selected targets render with red target rings in Pixi and DOM fallback, target state syncs through a `target_set` realtime event, and the VTT target HUD / active-token panel can apply a queued pending action resolution to all selected targets.

**Problem.** No way to click "target" on tokens. In Foundry, you click target, the system applies damage / status from the active power.

**Fix.** Add a global `selectedTargetIds: string[]` to VTT state. Right-click token → "Target" toggles inclusion. When a player rolls a damage / spell from the character sheet inline-roll, the resolver checks `selectedTargetIds` and emits an `ApplyToTargets` event consumed by `useTargetedDamageApply`.

**Files touched:**
- `@c:\Users\jjcal\Documents\solo-compendium\src\hooks\useVTTRealtime.ts` — add `target_set` event.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\TokenActionBar.tsx` — Target toggle.
- `@c:\Users\jjcal\Documents\solo-compendium\src\hooks\useTargetedDamageApply.ts` — new hook that listens for action-resolution events and applies to current `selectedTargetIds`.

**Regression test.** New e2e: target two enemies → Warden rolls Fireball damage from sheet → assert both enemies' HP reduced.

**Effort:** **L** (1 day).
**Dependencies:** P1-3 (multi-select) ideally lands first for shift-click multi-target.

---

### P1-8 — Music playlists / queue / crossfade (`R13`)

**Status:** Implemented. VTT audio now exposes playlist queue state, queue playback controls, previous/next/pause/resume/stop helpers, and a smooth crossfade gain helper. The Warden Tools session-audio drawer includes a queue HUD plus per-track "start queue here" controls.

**Problem.** `useVTTAudio` plays one track at a time per channel. No playlist queue, no crossfade.

**Fix.** Extend `useVTTAudio` to accept a `Playlist` (already typed in `@/lib/audio/types`). Add a queue UI in the AudioManager + Warden Tools session-audio section. Crossfade between tracks via two `AudioPlayer` instances and a fade-curve helper.

**Files touched:**

- `@c:\Users\jjcal\Documents\solo-compendium\src\hooks\useVTTAudio.ts` — playlist support.
- `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\VTTEnhanced.tsx` — Warden Tools session-audio queue HUD + skip/back.
- `@c:\Users\jjcal\Documents\solo-compendium\src\hooks\__tests__\useVTTAudio.test.ts` — crossfade curve coverage.

**Regression test.** Unit test the crossfade curve. e2e: queue 2 tracks → start → assert second track auto-plays after first ends with overlap.

**Effort:** **L** (1 day).

---

### P1-9 — Macros remote sync (`R6`)

**Status:** Implemented. Roll macros now hydrate through `useUserToolState<RollMacro[]>('warden_macros')` with the existing localStorage key as an always-on fallback/migration path. Warden Tools consumes the synced `useMacros` hook, and focused tests cover default seeding plus legacy local macro hydration.

**Problem.** `rollMacros.ts` persists to localStorage only. Switching devices loses macros.

**Fix.** Mirror macros via `useUserToolState` (per memory `7a1cd37e` — local mirror always-on). Migration: on first load, read existing localStorage macros and seed `useUserToolState`. Subsequent reads/writes go through `useUserToolState`.

**Files touched:**

- `@c:\Users\jjcal\Documents\solo-compendium\src\lib\vtt\rollMacros.ts` — keep load/save helpers but also expose a `useMacros` React hook backed by `useUserToolState<RollMacro[]>('warden_macros')`.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenToolsPanel.tsx:222-238` — switch to `useMacros`.
- `@c:\Users\jjcal\Documents\solo-compendium\src\lib\vtt\__tests__\rollMacros.test.tsx` — default seed and legacy local macro hydration coverage.

**Regression test.** Add to `warden-tools-persistence.e2e.spec.ts`: create a macro → reload → assert present (already works via localStorage). Also: switch user account → assert macros persist server-side under the same user.

**Effort:** **M** (~3 hours).

---

## P2 — Polish, a11y, consolidation

### P2-1 — Collapsible sections need `aria-controls` / `aria-expanded` (`R7`)

**Status:** Implemented. Warden Tools collapsible section toggles now expose stable `aria-controls` targets and `aria-expanded` state, with controlled panels kept mounted via `hidden`. Focused coverage asserts the relationships for Saved Macros, Ambient Music, Terrain Effects, and Ambient Audio Zones.

**Files:** `WardenToolsPanel.tsx` (~6 sections). Add `aria-controls={sectionId}` and `aria-expanded={openSections.X}` on each toggle button. **Effort: S.**

### P2-2 — Weather emoji buttons need `aria-label` (`R8`)

**Files:** `WardenToolsPanel.tsx:919-953`. Add `aria-label="Set weather to rain"` etc. **Effort: S.** (Combine with P0-2.)

### P2-3 — Scene library / thumbnail browser

**Status:** Implemented. The VTT Scenes drawer now includes a thumbnail scene library above the compact list, showing background previews, scene dimensions, token counts, open/live badges, go-live controls, and drag/drop reorder support while preserving the existing compact rename/duplicate/delete list.

**Problem.** Capability #7. We have premade maps and 200+ generated images, but no dedicated scene gallery UI. Wardens currently open scenes from the top-bar dropdown only.

**Fix.** Add a "Scene Library" tab to the left-rail Scenes drawer. Grid of thumbnails (generated from `scene.backgroundImage`) with name + tokenized count + last-modified. Click → switch scene. Drag to reorder. **Effort: M.**

### P2-4 — Mobile parity for Warden Tools sheet

**Status:** Implemented. `VTTEnhanced` now passes the existing mobile breakpoint state into the Warden Tools sheet. `WardenToolsPanel` collapses dense sections by default on mobile and applies larger tap targets to section toggles, quick actions, protocol tabs, generator actions, session tools, atmosphere controls, terrain buttons, and ambient-zone buttons.

**Problem.** Embedded EncounterBuilder / Generators are dense for thumb interaction. **Fix.** Detect `isMobile`, collapse all sections by default, add larger tap targets in the embedded views. **Effort: M.**

### P2-5 — Page / panel consolidation (`R15`)

**Problem.** `WardenToolsPanel` lazy-imports the same standalone-page modules (`@/pages/warden-directives/*`) it duplicates UI for. Each consumer (sheet vs page) has its own header/back-button/wrapper code.

**Fix.** Extract the *body* of each generator into `@/components/warden-directives/<X>Body.tsx`, have the page-level wrapper add the Layout / heading / back button, and have `WardenToolsPanel` import the body directly. Cuts ~400 LoC of duplicate glue. **Effort: L** (touches ~10 files but each change is mechanical).

### P2-6 — Standardize `data-testid` coverage across rail items

**Problem.** Some rail items rely on visible-text matching in tests; some have explicit `data-testid`. Inconsistent.

**Fix.** Audit `VTTEnhanced.tsx` rail items and ensure every right-rail tab + every left-rail drawer toggle has a `data-testid="vtt-rail-{side}-{name}"`. Update tests to consume the new ids. **Effort: S–M.**

### P2-7 — Wall / light hotkeys

**Problem.** Once P1-1 + P1-2 land, we'll want `W` for walls and `L` for lights to match the existing letter-tool hotkeys.

**Fix.** Extend the in-canvas hotkey handler in `VTTEnhanced.tsx` and the keyboard shortcuts dialog. **Effort: S.** (Bundle with P1-1 / P1-2.)

### P2-8 — Foundry-class door/window/one-way wall types (capability #33)

**Problem.** Once P1-2 lands, default wall type is "standard". Add door (open/close), window (block movement, allow vision), one-way wall (vision direction).

**Fix.** Extend `WallSegment` schema with `direction?: 'both' | 'left' | 'right'` and `state?: 'open' | 'closed'` (door only). Update LoS engine. **Effort: M.**

### P2-9 — Auto-explored fog (capability #38, Foundry-only currently)

**Problem.** Vision-driven fog (where moving a token reveals the area within its sight cone) is Foundry-exclusive at full fidelity.

**Fix.** Once P1-1 + P1-2 land (lights + walls), gate auto-explore behind a per-scene toggle "Token vision reveals fog". When enabled, on token-move broadcast, compute the visibility polygon (existing `lightingEngine.ts`) and union into `fogData`. Only when explicitly enabled to keep manual-fog campaigns deterministic. **Effort: L.** Defer to post-P1.

### P2-10 — Spell-template-from-spell drag (capability #30)

**Problem.** Dragging a spell from the compendium / character sheet onto the canvas doesn't auto-create the right AoE template (cone / cube / sphere) tied to the spell's slot consumption.

**Fix.** Once P1-4 (persistent AoE) lands, extend the spell-asset drag handler to create a pinned AoE of the correct shape. Optionally consume a spell slot via `useSpellCasting.buildActiveSpellEffectEntry`. **Effort: M.**

---

## Implementation order

Recommended sequencing (dependency-minimized):

1. **Bug-fix sprint**: P0-1 → P0-2 → P0-5 → P0-3 → P0-4. ~half a day total. Ship as one PR titled "Warden Tools P0 fixes".
2. **A11y sweep**: P2-1 + P2-2 + P2-6. Half a day. Ship together.
3. **Light authoring**: P1-1. ~1 day. Ship as "VTT light authoring".
4. **Wall authoring**: P1-2. ~1.5 days. Ship as "VTT wall authoring".
5. **Hotkeys + wall types**: P2-7 + P2-8. Bundle with #4 or as fast follow.
6. **Multi-select**: P1-3. ~1.5 days. Higher merge risk — land after #3 + #4 settle.
7. **Persistent AoE**: P1-4 → unblocks **P2-10** (spell-template drag).
8. **Multi-bar**: P1-5. Independent of others.
9. **Targeting**: P1-7 (depends on P1-3).
10. **Combat polish**: P1-6 (initiative auto-roll). Independent.
11. **Audio**: P1-8 (playlists / crossfade) + P1-9 (macros sync). Independent.
12. **Larger consolidation**: P2-5 (page/panel consolidation). Lowest urgency, highest LoC. Defer.
13. **Auto-explore fog**: P2-9. Defer until after P1-1 + P1-2.

After P0 + P1-1 + P1-2 + P1-3 ship, the audit's parity score moves from **76 % → 86 %**. After all P1 items, **~92 %**, with the remaining gap concentrated in Foundry-exclusive vision automation (P2-9) and Foundry-class door/window walls (P2-8).

## Test strategy

- **Every P0 item**: extend an existing Warden e2e spec (no new files).
- **Every P1-1 / P1-2 item**: new dedicated e2e spec because they introduce new tools modes.
- **P1-5 / P1-6**: unit tests in `lib/__tests__/` first (cheap), then targeted e2e.
- **No test deletion or weakening** — per testing discipline.
- **Always keep the local `useToolState` mirror invariant** (memory `7a1cd37e`) — every fix that touches persistence must keep the dev-tooling regression test happy.

## Out of scope

- No backend / Supabase migrations are required for any P0 or P1 item except optionally P1-9 (macros sync via `useUserToolState`, which already has the columns needed).
- No changes to compendium content (jobs / paths / items).
- No deploy-time changes; everything is in-repo TypeScript.
- No third-party VTT API integration — we benchmark Foundry/Roll20/DDB Maps but stay self-contained.

## Progress tracking

When implementation starts, this doc should be the source of truth. Mark each item with `[ ]`, `[~]` (in progress), or `[x]` (done) inline. Or convert to a todo list and link.

| ID | Status | Notes |
|---|---|---|
| P0-1 | `[x]` | Light duplicate-id — fixed via `createVttTokenInstanceId()` on 3 preset buttons + aria-labels. |
| P0-2 | `[x]` | Weather buttons — added `onWeatherChange` prop, wired 3 emoji buttons + new Clear button to mutate `currentScene.weather` and broadcast scene sync. |
| P0-3 | `[x]` | Quick roll UX — transient "Sent to chat — see Chat tab" confirmation for VTT-wired path, auto-dismiss 1500 ms, `aria-live=polite`. |
| P0-4 | `[x]` | `window.open()` replaced with `useNavigate()`. **Bonus repair:** the 3 External-Systems buttons were pointing to non-existent routes (`/party-tracker`, `/session-planner`, `/warden-journal`) → corrected to `/warden-directives/party-tracker`, `/warden-directives/session-planner`, and campaign-scoped `/campaigns/{id}/journal` (fallback `/warden-directives/vtt-journal`). |
| P0-5 | `[x]` | Broadcast labels — pulls `member.characters?.name` via `useCampaignMembers`; falls back to `Player <short-id>` rather than bare UUID fragment. Added `aria-pressed` + `aria-label` to each target row. |
| P1-1 | `[x]` | Light authoring UI — `LightSourceConfigDialog` + `'light'` tool mode (hotkey `l`) + Placed Lights list with Edit/Delete + scene-state helpers `addLightToScene` / `updateLightInScene` / `removeLightFromScene`. Verified by 13 new unit tests + new e2e spec. |
| P1-2 | `[x]` | Wall authoring UI — `'wall'` tool mode (hotkey `w`) + BrickWall toolbox button + click-drag with grid-corner snap + SVG ghost preview + Wall Authoring sub-panel with type radio (wall/door/window/terrain/ethereal) + placed-walls list with Delete + Clear All. Added `'ethereal'` to `WallSegment.type` and scene-state helpers `addWallToScene` / `updateWallInScene` / `removeWallFromScene`. Verified by 13 new unit tests + new e2e spec. |
| P1-3 | `[x]` | Multi-token select — `activeTokenIds`, additive shift/ctrl/meta selection, marquee select, bulk delete/nudge/visibility/lock/group, and Pixi/DOM fallback multi-selection rendering. Verified by typecheck + focused fallback tests. |
| P1-4 | `[x]` | Persistent / pinned AoE templates — added `kind?: "aoe"` discriminator on `VTTDrawing` + `createAoeFromMeasurement` helper covering line/circle/cube/cone shapes. Pin button in the measurement HUD commits the active shape as a persistent drawing; new cone render branch in the dynamic CSS generator + JSX. "Clear AoE Templates (N)" button in the Toolbox Measure sub-panel. Verified by 6 new unit tests + new e2e spec. Unblocks P2-10 (spell-template-from-spell drag). |
| P1-5 | `[x]` | Token multi-bar — added `VTTTokenBar` + `VTTTokenBarVisibility` and optional `bars?: VTTTokenBar[]` on `VTTTokenInstance`. `normalizeVttTokenBars()` synthesizes primary HP bars from legacy `hp/maxHp` or `hp_current/hp_max` and caps bars to 3. Pixi token renderer now draws up to 3 explicit bars with `all/controllers/gm` visibility. Active-token panel now includes a Bars editor (Add Bar, label/current/max/color/visibility/remove), with primary `hp` bar synced back to legacy HP fields. Verified by 4 new scene-state unit tests, `npm run typecheck`, and 95/95 VTT-lib unit tests. |
| P1-6 | `[x]` | Initiative auto-roll — pure `rollMonsterInitiative(candidates, { rng?, rerollAll? })` helper in `@/lib/vtt/initiative`. Auto-roll fires for non-hunter combatants with `initiative === 0`; dedupe ref prevents re-rolls on refetch. "Re-roll all anomalies" Dices button added to both `VTTInitiativePanel` and `InitiativeTracker`. Added `dexMod` field to `TrackerEntry` / `Combatant` (persisted via `stats.dex_mod`). Verified by 11 new unit tests + typecheck; 91/91 VTT-lib unit tests total. |
| P1-7 | `[x]` | Targeting — token action bar + context-menu target toggle, red target rings in Pixi/DOM fallback, map target HUD, realtime `target_set`, and pending action application to selected targets via `useTargetedDamageApply`. Verified by typecheck + focused VTT/action-resolution tests. |
| P1-8 | `[x]` | Audio playlists — `useVTTAudio` now supports playlist queue state/subscriptions, previous/next/pause/resume/stop helpers, crossfade between queued tracks, and a tested smooth crossfade curve. The Warden Tools session-audio drawer has a queue HUD and per-track "start queue here" controls. |
| P1-9 | `[x]` | Macros remote sync — `rollMacros.useMacros()` now uses `useUserToolState<RollMacro[]>('warden_macros')` with the existing localStorage key for migration/fallback; Warden Tools consumes the synced hook. Verified by typecheck + focused roll macro tests. |
| P2-1 | `[x]` | aria-controls — Warden Tools collapsible toggles now connect to stable controlled panel ids with `aria-expanded`; focused component test covers the four current `openSections` panels. |
| P2-2 | `[x]` | weather aria-label — bundled with P0-2, also added to lighting buttons. |
| P2-3 | `[x]` | Scene library — added `VTTSceneLibrary` thumbnail grid with map previews/fallbacks, token counts, dimensions, open/live badges, go-live action, and drag/drop reorder wiring in the left Scenes drawer. |
| P2-4 | `[x]` | Mobile Warden Tools — existing VTT mobile detection now reaches `WardenToolsPanel`; mobile mode collapses dense sections by default and increases key tap targets across quick actions, tabs, generators, tools, and atmosphere controls. |
| P2-5 | `[x]` | Page consolidation — Warden Tools now lazy-loads reusable directive components where available and embedded generator pages respect `EmbeddedContext`, omitting route `Layout`/back-header chrome inside the VTT drawer while preserving standalone route presentation. Verified by `npm run typecheck` and `npx vitest run src/components/vtt/__tests__/WardenToolsPanel.test.tsx`. |
| P2-6 | `[x]` | testid coverage — verified `VTTIconRail` emits explicit or fallback rail `data-testid`s and all current Warden left/right rail items provide stable `vtt-rail-left-*` / `vtt-rail-right-*` ids consumed by e2e coverage. |
| P2-7 | `[x]` | Wall/light hotkeys — verified in-canvas tool hotkeys include `L` for light authoring and `W` for wall authoring, and the keyboard shortcuts dialog documents both. |
| P2-8 | `[x]` | Door/window/one-way walls — extended wall schema/LoS for door state and one-way direction, added Warden wall authoring controls and placed-wall door toggles, and covered behavior with lighting-engine tests. |
| P2-9 | `[x]` | Auto-explore fog — added per-scene `tokenVisionRevealsFog`, Warden toggle UI, line-of-sight fog union on local/remote token movement, realtime fog update handling, and focused helper tests. Verified by `npm run typecheck` and `npx vitest run src/lib/__tests__/autoExploreFog.test.ts src/lib/__tests__/sceneState.test.ts`. |
| P2-10 | `[x]` | Spell-template drag — added spell-template drag payload helpers, draggable spell cards/details, map drop handling that pins inferred cone/line/cube/circle AoE drawings, and focused unit coverage. Verified by `npm run typecheck` and `npx vitest run src/lib/__tests__/spellTemplates.test.ts src/lib/__tests__/lightingEngine.test.ts`. |

## Shipped — P0 sprint (May 3, 2026)

**Files changed:**

- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenToolsPanel.tsx` — P0-1, P0-2, P0-3, P0-4, P2-2 (bundled).
- `@c:\Users\jjcal\Documents\solo-compendium\src\pages\warden-directives\VTTEnhanced.tsx` — P0-2 consumer.
- `@c:\Users\jjcal\Documents\solo-compendium\src\components\vtt\WardenBroadcastPanel.tsx` — P0-5.

**Verification:**

- `npm run typecheck` → exit 0, 0 errors.
- `npx vitest run src/lib/__tests__/sceneState.test.ts src/lib/__tests__/lightingEngine.test.ts` → 39/39 passed (2.3s).
- Playwright focused suites not re-run this pass (green in prior session per user confirmation); recommend extending `vtt-warden-first-session.e2e.spec.ts` with 2 new assertions before shipping:
  1. Pressing "Bright Light" twice appends 2 lights with distinct ids.
  2. Pressing 🌧️ weather then Clear toggles `currentScene.weather` between `"rain"` and `undefined`.

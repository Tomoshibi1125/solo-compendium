---
description: Concise remediation plan for campaign NPC scoping and Warden VTT fog-of-war parity
status: completed
repo_root: c:\Users\jjcal\Documents\solo-compendium
---

# Warden NPC + Fog Remediation Plan

## Objective

Stop sandbox/module NPCs from leaking into the Warden's personal Ascendant catalog and bring fog-of-war behavior up to the practical baseline set by D&D Beyond Maps, Roll20, and Foundry, without destabilizing the current scene-state and map-calibration work.

## Constraints

- Implementation proceeded under the current continuation request.
- Campaign NPCs must remain visible in campaign-management surfaces.
- Keep `src/lib/vtt/sceneState.ts` and the shared scene-state path as the authoritative VTT model.
- Separate canonical map-to-grid calibration from fog/render remediation.
- Avoid a broad `VTTEnhanced.tsx` refactor as the first step.

## Repo Findings

### NPC catalog root cause

- `src/hooks/useCampaignSandboxInjector.ts` creates sandbox NPCs as `characters` rows and marks them with `[SANDBOX_NPC]` in `notes`.
- `src/hooks/useCharacters.ts` supports scoped character lists and defaults to personal rows that exclude sandbox NPCs.
- `src/pages/Characters.tsx` consumes `useCharacters()` directly, so it receives the personal Ascendant roster by default.
- `src/components/campaign/CampaignCharacters.tsx` already treats Warden NPCs as a separate campaign-scoped surface and should remain the campaign-facing authority.

### Fog-of-war root causes

- Warden fog painting edits `currentScene.fogData`; the remediation now adds immediate fog broadcasts and explicit persistence for committed fog changes.
- `src/pages/warden-directives/VTTEnhanced.tsx` writes scene fog state, and `src/hooks/useVTTRealtime.ts` exposes `broadcastFogUpdate`; the Ascendant view consumes live `fog_update` events and persisted scene state.
- `src/pages/ascendant-tools/AscendantMapView.tsx` consumes live `fog_update` events and renders fog through shared merged fog rectangles.
- `src/styles/vtt-player-map.css` and `src/pages/ascendant-tools/AscendantMapView.css` render hidden regions as solid darkness without bordered grid cells.
- Current Warden fog controls include reveal/hide mode, square/circle brush shapes, labeled brush sizes, `Cover All`, `Reveal All`, immediate fog broadcasts, and persisted scene updates.

## Completion Update - 2026-05-04

- Phase 1 complete: `src/lib/characterScope.ts` provides shared sandbox NPC detection, `useCharacters()` defaults to the personal scope, and campaign NPCs remain in the dedicated Warden campaign roster.
- Phase 2 complete: Warden fog strokes, token-vision auto-explore updates, and bulk cover/reveal actions broadcast `fog_update` while persisting through scene state.
- Phase 3 complete: `buildVttFogRects()` merges hidden spans into solid rectangles, and Ascendant DOM, DOM fallback, and Pixi rendering all consume the shared merged-mask helper.
- Phase 4 complete: Warden fog controls expose reveal/hide, square/circle brushes, labeled brush sizes, `Cover All`, and `Reveal All`.
- Phase 5 staged: token-vision reveal with wall-aware auto-exploration is implemented behind the scene toggle; broader renderer unification remains a future enhancement.
- Validation passed: `npx vitest run src/lib/__tests__/characterScope.test.ts src/lib/__tests__/fogRects.test.ts src/lib/__tests__/autoExploreFog.test.ts src/components/vtt/__tests__/VttDomFallbackSurface.test.tsx` and `npm run typecheck`.

## Benchmark Behaviors To Match

### D&D Beyond Maps

- Manual fog workflow with `Cover All`, `Reveal All`, paint, and erase.
- Square and circular brush shapes.
- Multiple brush sizes.
- Warden can still inspect obscured areas while Ascendants cannot.
- Spectator/Ascendant-equivalent view respects fog state.
- Uploaded maps use an explicit token/grid calibration workflow that is separate from runtime fog.

### Roll20

- Explorer Mode can remember explored areas.
- Warden can hide and reveal from the lighting/fog toolbar.
- Line-of-sight updates in real time.
- Warden darkness opacity is adjustable without exposing hidden data to Ascendants.
- Movement restriction helps avoid accidental reveals.

### Foundry

- Scene grid alignment is treated as a separate scene-configuration concern.
- Walls, lighting, and token vision cooperate with exploration.
- Fog reset is an explicit administrative action.
- Scene resizing attempts to preserve placeable positions.

## Implementation Phases

## Phase 1 - Scope owned characters correctly

### Phase 1 outcome

Personal character surfaces exclude sandbox NPCs by default, while campaign-management surfaces retain access to campaign NPCs.

### Phase 1 authoritative files

- `src/hooks/useCharacters.ts`
- `src/pages/Characters.tsx`
- `src/pages/CampaignDetail.tsx`
- `src/components/campaign/CampaignCharacters.tsx`
- `src/hooks/useCampaignSandboxInjector.ts`

### Phase 1 work items

- Add one shared sandbox-NPC detector helper based on the existing `[SANDBOX_NPC]` marker.
- Change the owned-character query API to support scope explicitly instead of forcing all consumers to receive the same set.
- Make the default personal-roster path exclude sandbox NPCs.
- Audit `useCharacters()` consumers and decide per surface whether they need:
  - personal Ascendants only
  - all owned characters
  - or campaign NPCs through a separate campaign path
- Preserve the dedicated campaign NPC section in `CampaignCharacters.tsx`.

### Phase 1 verification

- Warden personal roster no longer lists sandbox NPCs.
- Campaign management still shows module NPCs.
- Any attach/share dialogs only show the intended character scope.

## Phase 2 - Make fog sync authoritative and immediate

### Phase 2 outcome

Fog changes propagate through one authoritative live path instead of depending on a slow generic save plus unused parallel fog channels.

### Phase 2 authoritative files

- `src/pages/warden-directives/VTTEnhanced.tsx`
- `src/pages/ascendant-tools/AscendantMapView.tsx`
- `src/hooks/useVTTRealtime.ts`
- `src/hooks/useToolState.ts`
- `src/lib/vtt/sceneState.ts`

### Phase 2 work items

- Pick one authoritative fog sync path.
- Prefer the existing shared scene-state channel that Ascendants already hydrate from, rather than maintaining a parallel fog store.
- Stop relying on the `800ms` debounced scene autosave as the only live fog propagation mechanism.
- Either:
  - persist and broadcast scene updates explicitly when fog strokes commit
  - or fully wire a dedicated fog event that both Warden and Ascendant views consume
- Demote or remove `vtt_fog_state` / `fog_update` as competing authorities unless they become the single consumed path.

### Phase 2 verification

- Warden fog edits appear in the Ascendant view during active play without waiting for a stale debounce cycle or reload.
- Fog state remains consistent after reload, scene switch, and reconnect.

## Phase 3 - Replace grid-like fog rendering with real concealment

### Phase 3 outcome

Hidden regions appear as solid obscured map areas rather than bordered grid cells.

### Phase 3 authoritative files

- `src/pages/ascendant-tools/AscendantMapView.tsx`
- `src/styles/vtt-player-map.css`
- `src/pages/ascendant-tools/AscendantMapView.css`
- `src/components/vtt/VttDomFallbackSurface.tsx`
- `src/components/vtt/VttPixiStage.tsx`

### Phase 3 work items

- Replace per-cell bordered DOM fog tiles with a solid mask presentation.
- Keep the hidden region visually continuous even if the underlying data remains cell-based.
- Ensure normal Ascendant rendering and DOM fallback rendering use the same concealment semantics.
- Preserve Warden edit visibility while ensuring Ascendants only see the obscured result.

### Phase 3 verification

- Hidden rooms and corridors read as solid darkness, not outlined cells.
- No white borders or grid seams remain in hidden areas.
- The Warden can still inspect and edit fog reliably.

## Phase 4 - Raise fog tools to D&D Beyond baseline

### Phase 4 outcome

The Warden gets a practical, full manual fog toolset for campaign play.

### Phase 4 authoritative files

- `src/pages/warden-directives/VTTEnhanced.tsx`
- relevant VTT control subcomponents if extraction is needed

### Phase 4 work items

- Rework manual fog controls to match benchmark vocabulary and workflow:
  - `Cover All`
  - `Reveal All`
  - paint/hide
  - erase/reveal
- Add square/circle brush-shape selection.
- Replace the raw numeric brush slider with clearer size presets or labels.
- Keep pan/zoom usable while fog editing is active, especially on touch/mobile.
- Ensure Warden preview behavior matches what the Ascendant will actually see.

### Phase 4 verification

- Warden can cover the whole map, reveal a starting area, re-hide sections, and fine-tune edges.
- Fog editing remains usable on desktop and touch surfaces.

## Phase 5 - Optional staged exploration / vision parity

### Phase 5 outcome

The app has a safe next step toward Roll20/Foundry-style exploration after manual fog is stable.

### Phase 5 work items

- Treat explorer memory, token-vision reveal, and wall/light-driven exploration as a second-stage enhancement.
- Do not block the manual fog fix on full LOS parity.
- Evaluate whether Ascendant DOM view should eventually consume walls/light/token vision directly or share a renderer path with Pixi.

### Phase 5 verification

- Only pursue after Phases 2 through 4 are stable and manually verified.

## Suggested Implementation Order

1. Phase 1 - NPC scoping
2. Phase 2 - authoritative fog sync
3. Phase 3 - fog rendering replacement
4. Phase 4 - fog tool UX
5. Phase 5 - optional exploration and vision parity

## Automated Verification

- Completed unit coverage for sandbox-NPC detection and personal-list filtering.
- Completed focused VTT coverage for wall-aware token-vision fog reveal and merged fog rectangle rendering.
- Completed rendering regression coverage for DOM fallback fog rendering through shared merged rectangles.
- Completed `npm run typecheck`.
- Completed focused VTT tests around auto-explore fog, fog rectangles, character scope, and DOM fallback rendering.

## Manual Verification

- Personal Warden roster does not show sandbox NPCs.
- Campaign management still shows module NPCs in the dedicated campaign context.
- Warden paints fog while an Ascendant view is connected and the Ascendant sees immediate concealment updates.
- Hidden areas appear as solid obscured regions.
- Map/grid calibration still behaves correctly and remains independent from fog fixes.

## Exit Criteria

- Completed: Sandbox NPCs no longer appear in the Warden's personal Ascendant catalog.
- Completed: Campaign NPCs remain available in campaign management surfaces.
- Completed: Fog uses immediate live `fog_update` broadcasts plus persisted scene state.
- Completed: Ascendant fog no longer relies on small bordered grid overlay semantics.
- Completed: Warden fog controls support cover/reveal plus brush shape and usable size controls.
- Completed: Map/background calibration remains independent from the fog remediation.

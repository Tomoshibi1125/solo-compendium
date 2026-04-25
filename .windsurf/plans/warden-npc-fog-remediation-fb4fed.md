---
description: Concise remediation plan for campaign NPC scoping and Warden VTT fog-of-war parity
status: awaiting-approval
repo_root: c:\Users\jjcal\Documents\solo-compendium
---

# Warden NPC + Fog Remediation Plan

## Objective

Stop sandbox/module NPCs from leaking into the Warden's personal Ascendant catalog and bring fog-of-war behavior up to the practical baseline set by D&D Beyond Maps, Roll20, and Foundry, without destabilizing the current scene-state and map-calibration work.

## Constraints

- Do not implement code before approval.
- Campaign NPCs must remain visible in campaign-management surfaces.
- Keep `src/lib/vtt/sceneState.ts` and the shared scene-state path as the authoritative VTT model.
- Separate canonical map-to-grid calibration from fog/render remediation.
- Avoid a broad `VTTEnhanced.tsx` refactor as the first step.

## Repo Findings

### NPC catalog root cause

- `src/hooks/useCampaignSandboxInjector.ts` creates sandbox NPCs as `characters` rows and marks them with `[SANDBOX_NPC]` in `notes`.
- `src/hooks/useCharacters.ts` fetches all rows for the current `user_id` and does not exclude sandbox NPCs.
- `src/pages/Characters.tsx` consumes `useCharacters()` directly, so sandbox NPCs appear in the Warden's personal roster.
- `src/components/campaign/CampaignCharacters.tsx` already treats Warden NPCs as a separate campaign-scoped surface and should remain the campaign-facing authority.

### Fog-of-war root causes

- Warden fog painting edits `currentScene.fogData`, but `updateScene()` only mutates local scene state and relies on the generic debounced `campaign_tool_states` save path for persistence.
- `src/pages/warden-directives/VTTEnhanced.tsx` also writes `vtt_fog_state`, and `src/hooks/useVTTRealtime.ts` exposes `broadcastFogUpdate`, but the player view is primarily consuming fog from shared scene state rather than one dedicated fog authority.
- `src/pages/player-tools/PlayerMapView.tsx` renders fog as many DOM `.vtt-fog-cell` tiles.
- `src/styles/vtt-player-map.css` and `src/pages/player-tools/PlayerMapView.css` style those cells as bordered grid-aligned boxes, which matches the reported symptom that fog looks like a small grid overlay rather than true concealment.
- Current Warden fog controls are below benchmark expectations: reveal/hide mode, size slider, reset/reveal-all, but no brush-shape toggle, no D&D Beyond style cover-all workflow, and no explicitly authoritative immediate fog sync path.

## Benchmark Behaviors To Match

### D&D Beyond Maps

- Manual fog workflow with `Cover All`, `Reveal All`, paint, and erase.
- Square and circular brush shapes.
- Multiple brush sizes.
- DM can still inspect obscured areas while players cannot.
- Spectator/player-equivalent view respects fog state.
- Uploaded maps use an explicit token/grid calibration workflow that is separate from runtime fog.

### Roll20

- Explorer Mode can remember explored areas.
- GM can hide and reveal from the lighting/fog toolbar.
- Line-of-sight updates in real time.
- GM darkness opacity is adjustable without exposing hidden data to players.
- Movement restriction helps avoid accidental reveals.

### Foundry

- Scene grid alignment is treated as a separate scene-configuration concern.
- Walls, lighting, and token vision cooperate with exploration.
- Fog reset is an explicit administrative action.
- Scene resizing attempts to preserve placeable positions.

## Implementation Phases

## Phase 1 - Scope owned characters correctly

### Outcome

Personal character surfaces exclude sandbox NPCs by default, while campaign-management surfaces retain access to campaign NPCs.

### Authoritative files

- `src/hooks/useCharacters.ts`
- `src/pages/Characters.tsx`
- `src/pages/CampaignDetail.tsx`
- `src/components/campaign/CampaignCharacters.tsx`
- `src/hooks/useCampaignSandboxInjector.ts`

### Work items

- Add one shared sandbox-NPC detector helper based on the existing `[SANDBOX_NPC]` marker.
- Change the owned-character query API to support scope explicitly instead of forcing all consumers to receive the same set.
- Make the default personal-roster path exclude sandbox NPCs.
- Audit `useCharacters()` consumers and decide per surface whether they need:
  - personal ascendants only
  - all owned characters
  - or campaign NPCs through a separate campaign path
- Preserve the dedicated campaign NPC section in `CampaignCharacters.tsx`.

### Verification

- Warden personal roster no longer lists sandbox NPCs.
- Campaign management still shows module NPCs.
- Any attach/share dialogs only show the intended character scope.

## Phase 2 - Make fog sync authoritative and immediate

### Outcome

Fog changes propagate through one authoritative live path instead of depending on a slow generic save plus unused parallel fog channels.

### Authoritative files

- `src/pages/warden-directives/VTTEnhanced.tsx`
- `src/pages/player-tools/PlayerMapView.tsx`
- `src/hooks/useVTTRealtime.ts`
- `src/hooks/useToolState.ts`
- `src/lib/vtt/sceneState.ts`

### Work items

- Pick one authoritative fog sync path.
- Prefer the existing shared scene-state channel that players already hydrate from, rather than maintaining a parallel fog store.
- Stop relying on the `800ms` debounced scene autosave as the only live fog propagation mechanism.
- Either:
  - persist and broadcast scene updates explicitly when fog strokes commit, or
  - fully wire a dedicated fog event that both Warden and player views consume.
- Demote or remove `vtt_fog_state` / `fog_update` as competing authorities unless they become the single consumed path.

### Verification

- Warden fog edits appear in the player view during active play without waiting for a stale debounce cycle or reload.
- Fog state remains consistent after reload, scene switch, and reconnect.

## Phase 3 - Replace grid-like fog rendering with real concealment

### Outcome

Hidden regions appear as solid obscured map areas rather than bordered grid cells.

### Authoritative files

- `src/pages/player-tools/PlayerMapView.tsx`
- `src/styles/vtt-player-map.css`
- `src/pages/player-tools/PlayerMapView.css`
- `src/components/vtt/VttDomFallbackSurface.tsx`
- `src/components/vtt/VttPixiStage.tsx`

### Work items

- Replace per-cell bordered DOM fog tiles with a solid mask presentation.
- Keep the hidden region visually continuous even if the underlying data remains cell-based.
- Ensure normal player rendering and DOM fallback rendering use the same concealment semantics.
- Preserve Warden edit visibility while ensuring players only see the obscured result.

### Verification

- Hidden rooms and corridors read as solid darkness, not outlined cells.
- No white borders or grid seams remain in hidden areas.
- The Warden can still inspect and edit fog reliably.

## Phase 4 - Raise fog tools to D&D Beyond baseline

### Outcome

The Warden gets a practical, full manual fog toolset for campaign play.

### Authoritative files

- `src/pages/warden-directives/VTTEnhanced.tsx`
- relevant VTT control subcomponents if extraction is needed

### Work items

- Rework manual fog controls to match benchmark vocabulary and workflow:
  - `Cover All`
  - `Reveal All`
  - paint/hide
  - erase/reveal
- Add square/circle brush-shape selection.
- Replace the raw numeric brush slider with clearer size presets or labels.
- Keep pan/zoom usable while fog editing is active, especially on touch/mobile.
- Ensure Warden preview behavior matches what the player will actually see.

### Verification

- Warden can cover the whole map, reveal a starting area, re-hide sections, and fine-tune edges.
- Fog editing remains usable on desktop and touch surfaces.

## Phase 5 - Optional staged exploration / vision parity

### Outcome

The app has a safe next step toward Roll20/Foundry-style exploration after manual fog is stable.

### Work items

- Treat explorer memory, token-vision reveal, and wall/light-driven exploration as a second-stage enhancement.
- Do not block the manual fog fix on full LOS parity.
- Evaluate whether player DOM view should eventually consume walls/light/token vision directly or share a renderer path with Pixi.

### Verification

- Only pursue after Phases 2 through 4 are stable and manually verified.

## Suggested Implementation Order

1. Phase 1 - NPC scoping
2. Phase 2 - authoritative fog sync
3. Phase 3 - fog rendering replacement
4. Phase 4 - fog tool UX
5. Phase 5 - optional exploration and vision parity

## Automated Verification

- Add unit coverage for the sandbox-NPC detection and scoped character query behavior.
- Add focused VTT regression coverage for Warden fog paint -> player hidden-region update.
- Add rendering regression coverage so fog no longer displays as bordered cell tiles.
- Run `npx tsc --noEmit`.
- Re-run focused VTT tests around `sceneState`, player view, and any fog helper extraction.

## Manual Verification

- Personal Warden roster does not show sandbox NPCs.
- Campaign management still shows module NPCs in the dedicated campaign context.
- Warden paints fog while a player view is connected and the player sees immediate concealment updates.
- Hidden areas appear as solid obscured regions.
- Map/grid calibration still behaves correctly and remains independent from fog fixes.

## Exit Criteria

- Sandbox NPCs no longer appear in the Warden's personal Ascendant catalog.
- Campaign NPCs remain available in campaign management surfaces.
- Fog uses one authoritative live sync path.
- Player fog no longer looks like a small bordered grid overlay.
- Warden fog controls support cover/reveal plus brush shape and usable size controls.
- Map/background calibration remains stable and is not coupled to the fog remediation.
- Approval is obtained before implementation begins.

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
  - **Remote**: `spell_slots` (via `useSpellSlots` / `useUpdateSpellSlot`)
  - **Local mirror**: No (remote-first)
  - **Notes**: Covered by player persistence E2E; if offline support is needed, add a local mirror similar to character journal.

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
  - Spell slots local mirror (offline continuity)
  - Player-facing campaign handouts UI (if missing) that reads `vtt_journal_entries` with player visibility

- **Medium priority**
  - Broader offline queue support for journal mutations (optional) using `offlineSync`


# D&D Beyond Feb 2026 Parity Audit — System Ascendant

**Audit Date:** July 2025 (targeting Feb 2026 D&D Beyond feature set)
**Codebase:** `solo-compendium` (System Ascendant)

---

## Section 1 — Canonical D&D Beyond Feature Inventory (Warden + Player)

### 1.1 Character Management (Player)

| # | Feature | Description |
|---|---------|-------------|
| C1 | Character Creation Wizard | Step-by-step guided creation: race, class, background, ability scores, equipment |
| C2 | Level-Up Flow | Guided level-up with class feature selection, ASI/feat choice, HP roll/average, spell selection |
| C3 | Character Sheet (View/Edit) | Full interactive sheet: stats, HP, AC, skills, saves, features, inventory, spells, conditions |
| C4 | Multiclass Support | Add secondary classes, split level progression, merged spell slot tables |
| C5 | Short Rest Automation | Spend hit dice, restore short-rest features/spell slots automatically |
| C6 | Long Rest Automation | Restore HP, hit dice, all features, reduce exhaustion, restore spell slots |
| C7 | Spell Slot Tracking | Per-level slot usage, pact magic slots, multiclass merged table |
| C8 | Conditions & Exhaustion | Apply/remove conditions, track exhaustion levels with mechanical effects |
| C9 | Equipment & Inventory | Add/remove items, weight tracking, attunement slots, currency management |
| C10 | Dice Roller (Inline) | Roll from character sheet actions (attacks, saves, checks) with modifiers auto-populated |
| C11 | Character Sharing | Share read-only character sheet via link/token |
| C12 | Character Export/Import | Export character data (PDF/JSON), import from file |
| C13 | Multiple Characters | Create and manage multiple characters per account |
| C14 | Character Comparison | Side-by-side comparison of characters |

### 1.2 Campaign Management (Warden + Player)

| # | Feature | Description |
|---|---------|-------------|
| K1 | Campaign Creation | Create campaign with name, description, settings |
| K2 | Invite System | Invite via share code/link, join code, email invite, role assignment |
| K3 | Campaign Member Management | View members, assign roles, kick/remove members |
| K4 | Campaign Settings | Leveling mode (XP/milestone), sourcebook restrictions, house rules |
| K5 | Campaign Chat / Messaging | Real-time in-campaign chat with message types (chat, roll, system, whisper) |
| K6 | Campaign Notes | Per-user and shared notes within a campaign, categories |
| K7 | Session Scheduling | Plan sessions with date/time, location, status tracking |
| K8 | Session Logs / Recaps | Session-linked logs (recap, loot, events), player visibility control |
| K9 | Character Sharing in Campaign | Share characters into campaign for Warden and party visibility |
| K10 | Campaign Leave/Disband | Players can leave; Warden can archive/deactivate campaign |

### 1.3 Encounter & Combat (Warden)

| # | Feature | Description |
|---|---------|-------------|
| E1 | Encounter Builder | Build encounters from monster compendium, CR/difficulty budget |
| E2 | Initiative Tracker | Manage turn order, HP, conditions for all combatants |
| E3 | Combat Session Sync | Persist combat state to campaign (round, turn, combatants) |
| E4 | Encounter → Initiative Handoff | Deploy built encounter directly into initiative tracker |
| E5 | XP/Reward Distribution | Award XP, loot, and rewards after encounter resolution |

### 1.4 Virtual Tabletop / Maps (Warden)

| # | Feature | Description |
|---|---------|-------------|
| V1 | Map Display / VTT Canvas | Grid-based map with token placement, fog of war |
| V2 | Token Management | PC/NPC/monster tokens with drag-and-drop, token library |
| V3 | Campaign-Scoped VTT | VTT state saved per-campaign with journal integration |
| V4 | Player Map View | Players see shared map state in real-time |

### 1.5 Compendium & Sourcebooks

| # | Feature | Description |
|---|---------|-------------|
| S1 | Compendium Browse/Search | Browse and search all SRD content (monsters, spells, items, classes, etc.) |
| S2 | Compendium Detail View | Full detail page per entry with stats, descriptions, mechanics |
| S3 | Sourcebook Entitlement Enforcement | Filter compendium/character options by owned sourcebooks |
| S4 | Favorites / Bookmarks | Bookmark compendium entries for quick access |

### 1.6 Homebrew

| # | Feature | Description |
|---|---------|-------------|
| H1 | Homebrew Creation | Create custom classes, spells, items, monsters with structured editor |
| H2 | Homebrew Management | Edit, version, publish/archive homebrew content |
| H3 | Homebrew Sharing | Share homebrew publicly or within campaign scope |
| H4 | Homebrew in Character Flows | Use homebrew content during character creation/level-up |

### 1.7 Marketplace / Content Sharing

| # | Feature | Description |
|---|---------|-------------|
| M1 | Marketplace Browse | Browse community-shared content with search/filter |
| M2 | Marketplace Publish | Publish content to marketplace with pricing, licensing |
| M3 | Marketplace Reviews | Rate and review marketplace listings |
| M4 | Marketplace Download / Entitlement | Download content, track entitlements, enforce access |
| M5 | Content Licensing | DRM/license metadata for shared content |

### 1.8 Dice & Rolls

| # | Feature | Description |
|---|---------|-------------|
| D1 | Standalone Dice Roller | Full dice roller with all standard dice, modifiers, advantage/disadvantage |
| D2 | 3D Dice Visualization | Animated 3D dice with themes |
| D3 | Roll History | Persistent roll history with type, context, formula |
| D4 | Campaign-Scoped Rolls | Rolls broadcast/recorded within campaign context |
| D5 | Inline Character Rolls | Roll from character sheet with auto-populated modifiers |

### 1.9 Offline / PWA / Mobile

| # | Feature | Description |
|---|---------|-------------|
| P1 | PWA Install | Installable as standalone app on mobile/desktop |
| P2 | Offline Asset Caching | Cache static assets (JS, CSS, images) for offline use |
| P3 | Offline Data Access | View cached characters, compendium entries offline |
| P4 | Offline Mutation Queue | Queue writes (character edits, notes) offline, sync when online |
| P5 | Service Worker Updates | Detect and prompt for app updates |
| P6 | Push Notifications | Web push for campaign events, session reminders, combat turns |
| P7 | Background Sync | Sync queued mutations when connectivity restored |
| P8 | Network Status Indicator | Show online/offline status and pending sync count |

### 1.10 Warden Toolbox (Beyond D&D Beyond — System Ascendant Extras)

| # | Feature | Description |
|---|---------|-------------|
| X1 | NPC Generator | AI-powered NPC creation |
| X2 | Treasure Generator | Loot table generation |
| X3 | Quest Generator | Quest/adventure hooks |
| X4 | Session Planner | Plan session structure with agenda |
| X5 | Random Event Generator | Dynamic gameplay events |
| X6 | Relic Workshop | Custom artifact creation |
| X7 | Party Tracker | Track party resources, HP, conditions |
| X8 | Dungeon Map Generator | Procedural dungeon layouts |
| X9 | Gate/Rift Generator | Planar content (System Ascendant specific) |
| X10 | Rollable Tables | Custom random tables |
| X11 | Token Library | Asset management for VTT tokens |
| X12 | Art Generator | AI art generation for campaigns |
| X13 | Audio Manager | Ambient sound/music management |
| X14 | Daily Quest System | Automated daily quests with rewards |

---

## Section 2 — App Feature Mapping (Status Matrix)

### Legend
- ✅ **Implemented** — Feature is fully functional and user-reachable
- ⚠️ **Partial** — UI/code exists but wiring, enforcement, or sync is incomplete
- ❌ **Not Implemented** — Feature is absent

### 2.1 Character Management

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| C1 | Character Creation Wizard | ✅ | `CharacterNew.tsx` — full step-by-step flow with race/class/background/abilities/equipment |
| C2 | Level-Up Flow | ✅ | `CharacterLevelUp.tsx` — guided level-up with feature/feat/ASI/spell selection |
| C3 | Character Sheet | ✅ | `CharacterSheet.tsx` — full interactive sheet, `useCharacters.ts` hooks |
| C4 | Multiclass Support | ✅ | Multiclass in creation and level-up flows |
| C5 | Short Rest Automation | ✅ | `restSystem.ts:executeShortRest` — hit dice, features, rune uses, spell slots |
| C6 | Long Rest Automation | ✅ | `restSystem.ts:executeLongRest` — full HP/HD/features/spells/exhaustion/quest assignment |
| C7 | Spell Slot Tracking | ✅ | `character_spell_slots` table, rest recovery automation |
| C8 | Conditions & Exhaustion | ✅ | `conditions` array + `exhaustion_level` on character, long rest reduces exhaustion |
| C9 | Equipment & Inventory | ✅ | `useEquipment` hook, currency/resource management, weight tracking |
| C10 | Dice Roller (Inline) | ⚠️ | `RollHistoryPanel` exists with roll types (attack/save/skill/etc.), but character sheet inline roll buttons are not fully wired to auto-populate modifiers from character stats |
| C11 | Character Sharing | ✅ | `get_character_by_share_token` RPC, `useCharacter` supports `shareToken` param |
| C12 | Character Export/Import | ❌ | No export-to-PDF/JSON or import-from-file functionality found |
| C13 | Multiple Characters | ✅ | `useCharacters` returns all user characters, list page at `/characters` |
| C14 | Character Comparison | ✅ | `CharacterCompare.tsx` at `/characters/compare` |

### 2.2 Campaign Management

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| K1 | Campaign Creation | ✅ | `Campaigns.tsx` — create dialog, `useCreateCampaign` mutation |
| K2 | Invite System | ✅ | `useCampaignInvites.ts` — create/redeem/revoke invites, join codes, email invites, audit logs |
| K3 | Campaign Member Management | ✅ | `useCampaignMembers`, `CampaignProtocolControls`, member roles (hunter/co-system) |
| K4 | Campaign Settings | ✅ | `CampaignSettings` component, leveling mode, settings JSON on campaign record |
| K5 | Campaign Chat | ✅ | `useCampaignChat.ts` — realtime via Supabase postgres_changes, local fallback, message types |
| K6 | Campaign Notes | ✅ | `useCampaignNotes.ts` — create/update/delete, categories, shared flag, local fallback |
| K7 | Session Scheduling | ✅ | `useCampaignSessions.ts` — upsert session with scheduled_for, status, location |
| K8 | Session Logs / Recaps | ✅ | `CampaignSessionLogRecord` with log types (session/recap/loot/event/note), player visibility |
| K9 | Character Sharing in Campaign | ✅ | `useCampaignCharacters.ts` — share/unshare/update permissions (view/edit) |
| K10 | Campaign Leave/Disband | ✅ | `useLeaveCampaign` + campaign `is_active` flag for deactivation |

### 2.3 Encounter & Combat

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| E1 | Encounter Builder | ✅ | `EncounterBuilder.tsx` — monster search, CR budget, sourcebook filtering |
| E2 | Initiative Tracker | ✅ | `InitiativeTracker.tsx` — turn order, HP, conditions management |
| E3 | Combat Session Sync | ✅ | `useCampaignCombat.ts` — campaign_combat_sessions + campaign_combatants with offline queue |
| E4 | Encounter → Initiative Handoff | ✅ | EncounterBuilder sends to combat session, navigates to InitiativeTracker with campaignId+sessionId |
| E5 | XP/Reward Distribution | ⚠️ | No dedicated post-encounter XP/loot distribution UI; rewards are manual via character edits or quest system |

### 2.4 Virtual Tabletop / Maps

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| V1 | Map Display / VTT Canvas | ✅ | `VTTMap.tsx` (Warden standalone), `VTTEnhanced.tsx` (campaign-scoped at `/campaigns/:id/vtt`) |
| V2 | Token Management | ✅ | `TokenLibrary.tsx` for asset management |
| V3 | Campaign-Scoped VTT | ✅ | `/campaigns/:campaignId/vtt` route with campaign context |
| V4 | Player Map View | ⚠️ | VTT routes exist but player-side real-time map view (shared fog-of-war state) is not evidenced as a separate player route; VTT appears Warden-centric |

### 2.5 Compendium & Sourcebooks

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| S1 | Compendium Browse/Search | ✅ | `Compendium.tsx` — search, type filters, virtual scrolling |
| S2 | Compendium Detail View | ✅ | `CompendiumDetail.tsx` at `/compendium/:type/:id` |
| S3 | Sourcebook Entitlement Enforcement | ✅ | `sourcebookAccess.ts` — `get_accessible_sourcebooks` RPC, filtering in compendium browse, character creation, level-up, powers |
| S4 | Favorites / Bookmarks | ✅ | `Favorites.tsx` at `/favorites` |

### 2.6 Homebrew

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| H1 | Homebrew Creation | ✅ | `Homebrew.tsx`, `HomebrewWorkbench.tsx`, `useHomebrewContent.ts` — structured editor with content types |
| H2 | Homebrew Management | ✅ | Draft/published/archived status, versioning (`HomebrewVersionRecord`), offline queue |
| H3 | Homebrew Sharing | ✅ | `visibility_scope` (private/campaign/public), campaign_id scoping |
| H4 | Homebrew in Character Flows | ⚠️ | Homebrew content types exist (job/path/relic/spell/item) but integration into character creation/level-up option pools is not evidenced as automatic — no compendium resolver merge path for homebrew into character selection dropdowns |

### 2.7 Marketplace

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| M1 | Marketplace Browse | ✅ | `Marketplace.tsx`, `useMarketplaceItems` with search/type/scope filters |
| M2 | Marketplace Publish | ✅ | `useSaveMarketplaceItem` — create/update listings with pricing, licensing |
| M3 | Marketplace Reviews | ✅ | `useUpsertMarketplaceReview`, `useMarketplaceReviews` |
| M4 | Marketplace Download / Entitlement | ⚠️ | `useRecordMarketplaceDownload` records download + `user_marketplace_entitlements` table checked for `has_access`, but downloaded content is not injected into user's compendium/character flows |
| M5 | Content Licensing | ⚠️ | `license` field on marketplace items exists but no DRM enforcement or license validation in content consumption paths |

### 2.8 Dice & Rolls

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| D1 | Standalone Dice Roller | ✅ | `DiceRoller.tsx` — all dice types, modifiers, advantage/disadvantage, quick rolls |
| D2 | 3D Dice Visualization | ✅ | `Dice3DRoller` lazy-loaded, theme system with 13+ themes |
| D3 | Roll History | ✅ | `useRollHistory.ts` — persisted to `roll_history` table or localStorage, `RollHistoryPanel` UI |
| D4 | Campaign-Scoped Rolls | ⚠️ | `roll_history` table has `campaign_id` column and campaign chat supports `roll` message type, but DiceRoller page always passes `campaign_id: null` — no UI to select active campaign for rolls |
| D5 | Inline Character Rolls | ⚠️ | Roll types exist (attack/save/skill/ability/initiative) in history, but character sheet does not have one-click roll buttons that auto-populate formula from character stats |

### 2.9 Offline / PWA / Mobile

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| P1 | PWA Install | ✅ | `usePWA.ts` — `beforeinstallprompt` handling, `installPWA` callback, manifest in `vite.config.ts` |
| P2 | Offline Asset Caching | ✅ | Workbox in vite config — `globPatterns`, `runtimeCaching` for generated assets and Supabase API |
| P3 | Offline Data Access | ⚠️ | `OfflineStorageManager` with IndexedDB stores (compendium, characters, campaigns, diceRolls) exists, but no code path populates these caches during normal use — `storeCompendiumItem`/`storeCharacter` are never called from hooks |
| P4 | Offline Mutation Queue | ✅ | `BackgroundSyncManager` with queue, processors registered for homebrew/marketplace/campaign_session/campaign_combat via `offlineSyncProcessors.ts` |
| P5 | Service Worker Updates | ✅ | `ServiceWorkerUpdatePrompt.tsx` — Workbox window, update detection, skip-waiting flow |
| P6 | Push Notifications | ❌ | No web push subscription, no push notification endpoint, no `PushManager` usage. `useNotifications` is localStorage-only in-app notifications, not web push |
| P7 | Background Sync | ⚠️ | `useOfflineSyncStatus.ts` processes queue when online, but does not use the Background Sync API (`navigator.serviceWorker.ready.then(reg => reg.sync.register(...))`); sync only triggers on React re-render when `isOnline` changes |
| P8 | Network Status Indicator | ✅ | `OfflineIndicator`, `OfflineStatus` components in `App.tsx`, `useOfflineSyncStatus` exposes `isOnline` + `queueLength` |

### 2.10 Warden Toolbox (Extras)

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| X1–X13 | All Warden Generator Tools | ✅ | All routes exist under `/dm-tools/*` with `ProtectedRoute requireDM` |
| X14 | Daily Quest System | ✅ | `QuestLog.tsx`, `useDailyQuests`, `on_long_rest_assign_quests` RPC, config/templates/instances |

---

## Section 3 — Detailed Gap Analysis

### GAP-C10: Inline Character Sheet Rolls (Partial)

**Current state:** `RollHistoryPanel` displays rolls tagged with types (attack, save, skill, etc.) and the `DiceRoller` page handles standalone rolling. However, the character sheet does not have contextual one-click roll buttons (e.g., click STR save → auto-builds `1d20+{save_mod}`).

**Missing behavior:**
- Character sheet action buttons for: ability checks, saving throws, skill checks, attack rolls, damage rolls
- Auto-populated formula from character's computed modifiers
- Roll result displayed inline or in a sheet-adjacent panel

**Implementation proposal:**
1. Create `useCharacterRoll(characterId)` hook that computes modifiers from character abilities/proficiencies
2. Add `RollButton` component that accepts `{ label, formula, rollType, characterId, campaignId? }`
3. Wire into character sheet sections: ability scores, saves, skills, attacks, spells
4. Record via existing `useRecordRoll` with `character_id` and optional `campaign_id`

**Complexity:** M | **Dependencies:** C3

---

### GAP-C12: Character Export/Import (Not Implemented)

**Current state:** No export or import functionality exists.

**Missing behavior:**
- Export character as JSON (full data dump) or formatted PDF
- Import character from JSON file

**Implementation proposal:**
1. `exportCharacterJson(characterId)` — fetch character + abilities + equipment + features + spells → download as `.json`
2. `exportCharacterPdf(characterId)` — generate a styled PDF using a library like `jspdf` or `@react-pdf/renderer`
3. `importCharacterJson(file)` — validate JSON schema, create character via existing mutation
4. UI: Add Export/Import buttons to character list page and character sheet header

**Complexity:** M | **Dependencies:** C3

---

### GAP-E5: Post-Encounter XP/Reward Distribution (Partial)

**Current state:** Combat sessions can be ended via `useEndCombatSession`, but there is no dedicated UI for calculating and distributing XP/loot after an encounter.

**Missing behavior:**
- Calculate total XP from defeated monsters
- Split XP evenly across party members
- Award loot items to specific characters
- Integration with campaign leveling mode (XP vs milestone)

**Implementation proposal:**
1. Add `EncounterRewards` component shown when combat session status becomes `ended`
2. Compute XP from encounter monster CRs (data available in encounter builder)
3. Provide party member selector and distribution mode (equal/custom)
4. Call `useUpdateCharacter` to increment XP on each selected character
5. Optionally log reward event via `campaign_session` log

**Complexity:** L | **Dependencies:** E2, E3, K4

---

### GAP-V4: Player Map View (Partial)

**Current state:** VTT routes exist at `/campaigns/:campaignId/vtt` but appear Warden-centric. No evidence of a read-only player view with shared fog-of-war state synced in real-time.

**Missing behavior:**
- Player-facing map view that shows only Warden-revealed areas
- Real-time token position sync from Warden → players
- Player can move their own token

**Implementation proposal:**
1. Create `VTTPlayerView` component that subscribes to VTT state via Supabase realtime
2. Filter token visibility based on fog-of-war mask set by Warden
3. Allow player to drag their own token, broadcasting position via realtime channel
4. Route: `/campaigns/:campaignId/vtt` with role-based rendering (Warden gets full controls, player gets view)

**Complexity:** XL | **Dependencies:** V1, V3, K5

---

### GAP-H4: Homebrew in Character Flows (Partial)

**Current state:** Homebrew content has structured types (job/path/relic/spell/item) matching compendium categories, but the character creation and level-up flows pull options only from the static compendium data, not from the user's homebrew library.

**Missing behavior:**
- During character creation, merge homebrew jobs/paths/items into selection dropdowns
- During level-up, include homebrew spells/features in available options
- Respect homebrew `visibility_scope` and `status` (only published homebrew)

**Implementation proposal:**
1. In `compendiumResolver.ts`, add a merge step that fetches user's published homebrew + campaign-scoped homebrew
2. Tag merged entries with `source: 'homebrew'` for UI differentiation
3. Filter by `content_type` matching the current selection context
4. Add a visual badge in selection UIs to distinguish homebrew from official content

**Complexity:** L | **Dependencies:** H1, H2, S3

---

### GAP-M4: Marketplace Content Injection (Partial)

**Current state:** Downloads are recorded and entitlements tracked via `user_marketplace_entitlements`, and `has_access` is computed on marketplace item listings. However, downloaded content is not injected into the user's compendium or character creation flows.

**Missing behavior:**
- Downloaded marketplace content appears in user's compendium view
- Marketplace items with content payloads are usable in character flows
- Entitlement checked before allowing use in character creation/level-up

**Implementation proposal:**
1. Add `useMarketplaceEntitledContent` hook that fetches entitled items' `content` payloads
2. Merge into compendium resolver alongside homebrew merge
3. Check entitlement in character flow selection filters

**Complexity:** L | **Dependencies:** M1, M4, H4

---

### GAP-M5: Content License Enforcement (Partial)

**Current state:** `license` field exists on marketplace items but no validation or enforcement occurs when content is consumed.

**Missing behavior:**
- License terms displayed to user before download
- Attribution requirements shown when content is used
- License type restricts redistribution/modification

**Implementation proposal:**
1. Add license display dialog in marketplace detail view before download confirmation
2. Store license acceptance in entitlement record
3. Show attribution badge on content sourced from marketplace

**Complexity:** S | **Dependencies:** M4

---

### GAP-D4: Campaign-Scoped Dice Rolls (Partial)

**Current state:** `roll_history` has a `campaign_id` column and campaign chat supports `roll` message type, but the DiceRoller page always passes `campaign_id: null`.

**Missing behavior:**
- User can select active campaign context in dice roller
- Rolls are recorded with `campaign_id` and optionally broadcast to campaign chat
- Campaign members see each other's rolls in real-time

**Implementation proposal:**
1. Add campaign selector dropdown to DiceRoller page (populated from `useMyCampaigns` + `useJoinedCampaigns`)
2. Pass selected `campaign_id` to `useRecordRoll`
3. Optionally send roll as `message_type: 'roll'` to campaign chat via `useSendCampaignMessage`

**Complexity:** S | **Dependencies:** D1, K5

---

### GAP-D5: Inline Character Rolls (Partial)

See **GAP-C10** — same gap from the dice perspective. Character sheet needs contextual roll buttons.

---

### GAP-P3: Offline Data Access (Partial)

**Current state:** `OfflineStorageManager` has IndexedDB stores for compendium, characters, campaigns, and dice rolls, with full CRUD methods. However, no code path populates these caches during normal online use. The `storeCompendiumItem`, `storeCharacter`, etc. methods are defined but never called from React hooks or data-fetching layers.

**Missing behavior:**
- Compendium entries cached to IndexedDB as user browses
- Character data cached when loaded
- Cached data served when offline (fallback in hooks)

**Implementation proposal:**
1. In `useCharacter` / `useCharacters`, after successful Supabase fetch, call `offlineStorage.storeCharacter(data)`
2. In compendium resolver, after fetching detail, call `offlineStorage.storeCompendiumItem(data)`
3. In query `queryFn`, if fetch fails due to offline error, fall back to `offlineStorage.getCharacter(id)` / `searchCompendium(query)`
4. Add a "cached" badge in UI when serving stale offline data

**Complexity:** M | **Dependencies:** P2

---

### GAP-P6: Push Notifications (Not Implemented)

**Current state:** `useNotifications` is an in-app localStorage-based notification center. There is no Web Push API integration — no `PushManager.subscribe()`, no VAPID key configuration, no push endpoint registration.

**Missing behavior:**
- Request notification permission from user
- Subscribe to web push with VAPID key
- Server-side push for: session reminders, combat turn alerts, campaign invites, chat mentions
- Service worker `push` event handler to display notifications

**Implementation proposal:**
1. Generate VAPID key pair; store public key in env, private key in server config
2. Add `usePushSubscription` hook: request permission → `pushManager.subscribe()` → store subscription endpoint in `user_push_subscriptions` table
3. Server-side (Edge Function or API route): `web-push` library to send notifications
4. Service worker: add `push` event listener to display `Notification`
5. Trigger points: session scheduled, combat turn change, campaign invite received, chat @mention
6. Settings UI: user can toggle notification categories

**Complexity:** XL | **Dependencies:** P1, P5, K5, K7

---

### GAP-P7: Background Sync API (Partial)

**Current state:** `useOfflineSyncStatus` processes the sync queue when `isOnline` changes and React re-renders. This works but misses sync opportunities when the app is in the background or closed.

**Missing behavior:**
- Register a `sync` event with the service worker so queued mutations are processed even if the app tab is not active
- Retry logic delegated to the browser's Background Sync API

**Implementation proposal:**
1. In `BackgroundSyncManager.addToQueue`, after saving to localStorage, call:
   ```ts
   navigator.serviceWorker.ready.then(reg => reg.sync.register('offline-sync-queue'));
   ```
2. In custom service worker code (or Workbox plugin), handle `sync` event:
   ```ts
   self.addEventListener('sync', (event) => {
     if (event.tag === 'offline-sync-queue') {
       event.waitUntil(processQueueInSW());
     }
   });
   ```
3. Keep existing React-based sync as fallback for browsers without Background Sync support

**Complexity:** M | **Dependencies:** P4, P5

---

## Section 4 — Prioritized Roadmap

### Tier 1: Must-Have Parity Blockers

| Priority | Gap | Feature | Complexity | Dependencies |
|----------|-----|---------|------------|--------------|
| 1 | GAP-C10/D5 | Inline character sheet rolls | M | C3 |
| 2 | GAP-D4 | Campaign-scoped dice rolls | S | D1, K5 |
| 3 | GAP-P3 | Offline data caching (populate IndexedDB) | M | P2 |
| 4 | GAP-H4 | Homebrew in character creation/level-up | L | H1, S3 |
| 5 | GAP-E5 | Post-encounter XP/reward distribution | L | E2, E3, K4 |
| 6 | GAP-C12 | Character export/import | M | C3 |

### Tier 2: Important Enhancements

| Priority | Gap | Feature | Complexity | Dependencies |
|----------|-----|---------|------------|--------------|
| 7 | GAP-M4 | Marketplace content injection into compendium/character flows | L | M1, H4 |
| 8 | GAP-P7 | Background Sync API integration | M | P4, P5 |
| 9 | GAP-M5 | Content license enforcement | S | M4 |
| 10 | GAP-V4 | Player-facing VTT map view | XL | V1, V3, K5 |

### Tier 3: Beyond-Parity Enhancements

| Priority | Gap | Feature | Complexity | Dependencies |
|----------|-----|---------|------------|--------------|
| 11 | GAP-P6 | Web Push Notifications | XL | P1, P5, K5, K7 |

---

## Section 5 — Summary Statistics

| Category | Implemented | Partial | Not Implemented | Total |
|----------|-------------|---------|-----------------|-------|
| Character Management | 11 | 2 | 1 | 14 |
| Campaign Management | 10 | 0 | 0 | 10 |
| Encounter & Combat | 4 | 1 | 0 | 5 |
| VTT / Maps | 3 | 1 | 0 | 4 |
| Compendium & Sourcebooks | 4 | 0 | 0 | 4 |
| Homebrew | 3 | 1 | 0 | 4 |
| Marketplace | 3 | 2 | 0 | 5 |
| Dice & Rolls | 3 | 2 | 0 | 5 |
| Offline / PWA / Mobile | 4 | 2 | 1 | 7* |
| Warden Toolbox (Extras) | 14 | 0 | 0 | 14 |
| **TOTAL** | **59** | **11** | **2** | **72** |

*P8 (Network Status) counted under Implemented.

**Overall parity score: 59/72 Implemented (82%), 11 Partial, 2 Not Implemented**

---

# Rift Ascendant ⇄ D&D Beyond Parity Audit — July 2026

**Audit date:** 2026-07-21
**Codebase:** `solo-compendium` (Rift Ascendant companion app)
**Method:** Firsthand inspection only (no subagent audits — workspace policy
[[no-subagents-verify-directly]]). Every ✅ below is backed by a traced
production caller chain, not merely an existing file. Runtime golden paths were
exercised in the dev-server browser preview.

**Supersedes** [`dndbeyond-parity-audit-feb2026-updated.md`](dndbeyond-parity-audit-feb2026-updated.md),
which claimed "100% / 72-of-72" but was stale and unreliable: its own Round-2
correction admitted Round-1 helpers were *library-only* (unit-tested, never
called from UI); it still listed the deliberately-removed VTT (V1–V4) as ✅; and
it cited a `verifyDDBeyondParity()` function that no longer exists in `src`.
Treat the Feb doc as historical only.

---

## What D&D Beyond is, and the yardstick

Web research (July 2026) confirms DDB's companion-app pillars for 5e:

- **Character builder** — guided step-by-step creation + a quick-build path.
- **Digital character sheet** — click-to-roll ability checks, saves, attacks,
  and damage; HP / conditions / rest tracking; portraits, themes; companions
  and familiars.
- **Campaign management** — join a campaign; the DM can view player sheets; a
  shared **Game Log** streams everyone's dice rolls in real time.
- **Encounter builder + combat tracker** — CR-budgeted encounter design that
  hands off to an initiative tracker with monster stat blocks and rolls.
- **Digital sources / compendium** — searchable rules content and readable
  rulebooks.
- **Homebrew** — create spells, items, monsters, feats, subclasses; scope them
  private → campaign → public; use them on character sheets.
- **Digital dice** — 3D dice, roll history, shared rolls.
- **Mobile / offline** — mobile app + offline access to sheets.
- **Maps (VTT)** — DDB's flagship 2024–26 push (tokens, fog, initiative on the
  map).

Sources: [DDB Player Tools](https://www.dndbeyond.com/en/players) ·
[Builder Sections](https://dndbeyond-support.wizards.com/hc/en-us/articles/7747202748436-Builder-Sections) ·
[Sheet Sections](https://dndbeyond-support.wizards.com/hc/en-us/articles/7747193946388-Sheet-Sections) ·
[Encounters](https://dndbeyond-support.wizards.com/hc/en-us/articles/7747237485716-Encounters) ·
[Homebrew Basics](https://dndbeyond-support.wizards.com/hc/en-us/articles/7747238519700-Homebrew-Creation-and-Collection-Basics) ·
[Maps VTT](https://www.dndbeyond.com/games) ·
[Combat tracking in Maps](https://www.dndbeyond.com/posts/1841-roll-for-initiative-combat-tracking-comes-to-the) ·
[D&D Beyond — Wikipedia](https://en.wikipedia.org/wiki/D&D_Beyond)

---

## Pillar-by-pillar status (with caller-chain evidence)

### Character builder — ✅
- Guided 7-step flow (`CONCEPT → JOB → ABILITIES → BACKGROUND → PERSONA →
  EQUIPMENT → REVIEW`) at `/characters/new` (`src/pages/CharacterNew.tsx`).
- **Quick Ascendant** quick-build dialog (Job + Path + Background + name →
  standard-array auto-placement, starting gear, L1 features, awakening benefit).
- **Runtime-verified:** created a Destroyer ("Audit Probe") via Quick Ascendant;
  landed on a fully-populated sheet (AC 18, HP 10/10, four weapons with
  auto-derived ATK/DMG, job pools, ammunition tracker).

### Digital character sheet — ✅
- `src/components/character-v2/CharacterSheetV2.tsx` is the canonical sheet.
  Click-to-roll wired through `useCharacterPageModel.rollAndRecord`, which pulls
  **derived** modifiers (`stats.calculatedStats.savingThrows`,
  `stats.skills[...].modifier`, `stats.finalInitiative`) and resolves
  condition/exhaustion advantage via `pm.resolveD20Advantage(...)`.
- Attacks/damage via `ActionCard` → `useCombatActions` (STR/AGI/finesse/ranged
  resolution, crit dice-doubling).
- **Runtime-verified:** clicked STRENGTH → toast "STR Check: 10+3 = 13"; roll
  persisted to the guest store's per-character `rollHistory`.
- HP/damage-with-resistance, temp-HP pools, rests, conditions, exhaustion,
  death saves, hit dice all present and rules-aware (recent commits +
  [[deep-systems-audit-jul18]]).

### Level-up — ✅
- `LevelUpWizardModal` gated by `experience.ts:checkLevelUpEligibility`
  (XP-threshold CTA, no silent auto-promote — DDB-style).

### Campaign management — ✅ **(gap found + fixed this pass)**
- Create/join (share codes), member management, chat, notes, sessions,
  calendar, wiki, handouts, presence, activity — all present under
  `src/pages/CampaignDetail.tsx` + `src/components/campaign/*`.
- **The Game Log (shared roll feed) was broken:** `CampaignRollFeed` +
  `CampaignActivityPanel` subscribe to the `campaign_roll_events` table (+ a
  Realtime `postgres_changes` INSERT subscription), but **nothing ever wrote to
  that table** — the only writer, `useCampaignRollFeed.addEvent`, had **zero
  callers** (verified by grep). Every player/warden roll went to `roll_history`
  and an ephemeral broadcast, so the persistent feed every member reads was
  permanently empty. This is exactly the "library-only, looks-wired" failure
  class this audit targets.
- **Fix (this pass):** new single-writer module
  [`src/lib/campaignRollEvents.ts`](../src/lib/campaignRollEvents.ts)
  (`publishCampaignRollEvent` — cloud insert when authenticated, shared
  `localStorage` store in guest/local mode; never throws — a failed feed
  publish must not fail the roll). Wired into the two disjoint roll chokepoints:
  - `useCharacterPageModel.rollAndRecord` — sheet ability/save/skill/initiative
    /hit-dice rolls, published whenever the character belongs to a campaign
    (not gated on the ephemeral socket).
  - `useCampaignDice.rollInCampaign` — the shared path for `ActionCard`
    (attacks/damage/saves), `DiceRoller`, and `useCharacterRoll` (InlineRoll).
    Threads a feed-only `character_name` (stripped before the `roll_history`
    insert, which has no such column).
  - `useCampaignRollFeed` refactored to read from the shared module; the dead
    `addEvent` removed.
  - Guarded by `src/lib/__tests__/campaignRollEvents.test.ts` (3 tests:
    per-campaign filtering + newest-first, 200-row cap, guest-mode publish).

### Encounter builder + combat tracker — ✅
- `EncounterBuilder.tsx` (CR budget + filtering) hands off to
  `InitiativeTracker.tsx`. Warden-side monster rolling is wired:
  `rollMonsterInitiative` (auto-roll 1d20+Dex per anomaly, de-duped per
  session) and `applyResolutionToTarget` (attack/save resolution with
  condition-inferred advantage/disadvantage, auto-fail on paralyzed/unconscious,
  damage mitigation → HP). `CampaignSessionPlay.tsx` is the play surface.

### Digital sources / compendium — ✅
- `Compendium.tsx` (search + virtual scroll; FTS via `websearch_to_tsquery`
  with ILIKE fallback). In-app rulebook reader at `/source-book`
  (`src/pages/compendium/SourceBook.tsx`) renders real authored chapters
  (Intro/Jobs/Paths/Spells/Techniques/Runes/Feats/Backgrounds/Equipment +
  Warden's Directive + Anomaly Manifest) — not a stub. Campaign-scoped book view
  at `/campaigns/:id/book`.

### Homebrew — ✅
- `HomebrewWorkbench.tsx` creates 7 content types (job, path, relic, spell,
  power, feat, item) with `private / campaign / public` visibility.
- **Flows onto sheets:** `usePublishedHomebrew` → `homebrewRuntime` mappers are
  consumed by `AddSpellDialog`, `AddPowerDialog`, `AddEquipmentDialog`,
  `AddFeatDialog`, `CharacterNew`, and `LevelUpWizardModal`. Mechanical binding
  follows the signed-bonus rule ([[equipment-effect-prose-binding]]).

### Digital dice — ✅
- `DiceRoller.tsx` standalone + `Dice3D` (13+ themes), `useRollHistory`
  (cloud + guest-local mirror), campaign-scoped rolls (now feeding the Game Log,
  above).

### Mobile / offline (PWA) — ✅
- `MobileBottomNav`, responsive sheet/compendium ([[responsive-cross-platform-pass]]).
- Offline: service worker + `useOfflineDataAccess`; **runtime-verified** console
  logged `[OfflineCache] Warmed 2212 compendium entries` on boot. Offline
  mutation queue via `syncManager` (`roll` / `message` / `homebrew` / campaign
  processors); background sync + push notifications present.

### Export / import — ✅
- `useCharacterExportImport.ts` JSON envelope **v2.4** + true PDF (`pdf-lib`).
  v2.4 covers the full character package: abilities, equipment, features,
  powers, spells, techniques, rune/sigil inscriptions, regents, shadow
  soldiers/army, active spells, extras, monarch/regent unlocks, feature choices,
  journal, backups. (Note under "Follow-ups" re: tables added after v2.4.)

---

## Accepted divergences (intentional — not gaps)

| DDB feature | RA stance |
|---|---|
| **Maps / VTT** | Deliberately scraped June 2026 ([[vtt-scrape-complete]]); Pixi/renderer removed. `vtt_journal_entries` retained (Handouts) + LiveKit/CommNet. The Feb doc's V1–V4 ✅ rows are obsolete. |
| **Multiclass** | RA is single-Job by design → N/A, not deferred. |
| **Sourcebook entitlement / paywall** | RA is a free app ([[guild-economy-ttrpg-not-sim]]); `sourcebookAccess` gates by campaign sharing, not purchase. |
| **Marketplace as storefront** | Present as content-sharing, not paid distribution. |

## RA exceeds DDB (preserve — do not dilute)

Condition/exhaustion **mechanical** auto-application; universal taming (6
bonding paths); Regent/Gemini fusion; Powers/Techniques/Runes triad; currency
overflow auto-cascade; death-save auto-reset; no free-tier encounter cap;
in-world diegetic rules teaching (Run Silent). See Feb doc §9.3 for the full
list — still accurate.

---

## Follow-ups (non-blocking, tracked here)

1. **Latent roll dual-stack (not live).** `useCharacterRoll`'s internally-
   computed `rollAbilityCheck` / `rollSavingThrow` / `rollSkillCheck` (own
   skill→ability map, unknown-skill→STR fallback, raw proficiency math) are
   exposed on `useCharacterSheetEnhancements` but **consumed by no UI** — only
   `roll` is used (by `InlineRollButton`), and it always receives an explicit
   *derived* `modifier`. No live drift today, but it's a trap for a future
   caller. Recommend trimming the unused convenience methods (and their
   skill-map) or routing them through the derived-stats pipeline.
2. **Standalone `DiceRoller` feed label.** Rolls from the generic dice page
   publish to the feed with `character_name = null` → shown as "Unknown". Cosmetic;
   could pass the user's display name.
3. **Attack roll label in feed.** The `ActionCard` attack uses
   `InlineRollButton rollType="ability"`, so it lands in the feed labeled
   "Check". Cosmetic mapping only.
4. **Export v2.4 coverage drift.** New character-owned tables added since v2.4
   (`character_vehicles`, `character_tamed_anomalies`, `character_tattoos`,
   `character_sheet_state`, `character_spell_slots`) are not yet in the
   export envelope — bump to v2.5 when convenient.

---

## Verification

- `npm run typecheck` → clean.
- `npm run lint:check` (Biome, 1154 files) → clean.
- `npx knip` → clean.
- `npm run test:run` → **2274 passed / 232 files**, incl. the new
  `campaignRollEvents.test.ts`.
- Runtime: dev-server browser preview — guest character creation (Quick
  Ascendant), sheet click-to-roll (STR check recorded), offline compendium warm,
  zero console errors after the wiring changes.

**Bottom line:** Rift Ascendant is a fully-realized DDB-class companion app for
its system. Every DDB pillar RA chooses to implement is present and
production-wired; the one substantive gap found — the campaign Game Log being
fed by an empty table — is fixed and tested this pass. Remaining items are
cosmetic or forward-looking, not parity holes.

---

## Pass 2 — Deep wiring + feature-parity sweep (2026-07-22)

A second exhaustive pass (firsthand, same policy) verified DDB's *complete*
free-tier feature set against RA and hunted the same "reader exists, producer
doesn't" class app-wide. Two hard product constraints were locked: **100% free
forever — no paid anything** (all DDB subscription/Marketplace-paywall/Drops
features are accepted divergences; verified no stripe/checkout/billing in src);
and **no VTT or VTT-adjacent anything** (both DDB VTTs — 2D Maps, 3D Sigil —
plus tokens/fog/map-DM-tools stay out).

### Findings + resolutions

| # | Finding (evidence) | Class | Resolution |
|---|---|---|---|
| 1 | **Session Replay was a dead reader** — `SessionReplayPanel` (mounted `CampaignDetail.tsx`) + `useSessionReplay` read `campaign_session_events`, but **nothing wrote it** (no src insert/trigger/RPC); the whole `hooks` bus had no live producers either. | unwired | **WIRED.** New single-writer `src/lib/campaignSessionEvents.ts` (`publishSessionEvent`, cloud+guest, never throws). `InitiativeTracker` now emits `combat:turnStart/turnEnd/roundStart` on turn/round advance and `effect:applied` on condition application. `useSessionReplay` merges `campaign_session_events` + `campaign_roll_events` into one ordered timeline; the panel renders a readable, scrubbable event log. VTT-only `token:*`/`scene:*` kinds dropped. |
| 2 | **Character HP/state not live in shared views** — `useCampaignCharacters` is a plain `useQuery`; no realtime subscription on the core `characters` table anywhere. A DM watching a player's shared sheet saw stale HP/conditions. | unwired | **WIRED.** New `useCharacterRealtime(characterId, enabled)` subscribes to `postgres_changes` on the character row and invalidates the sheet query; mounted in `useCharacterPageModel` for campaign-scoped, non-local sheets. (Combat already synced via `useCampaignCombat` DB subscription — so this used the same DB+subscription pattern, per decision.) |
| 3 | **Dead realtime scaffolding** — 5 of 6 `broadcast*` in `useRealtimeCollaboration.tsx` had zero callers and no `collaboration:*` listeners existed. | dead code | **REMOVED.** Deleted `broadcastCombatState` (redundant — combat syncs via DB), `broadcastCharacterUpdate` (replaced by #2), and VTT-era `broadcastMapUpdate/TextChange/CursorMove` + handlers + event types. Kept presence + `broadcastDiceRoll`. Knip clean. |
| 4 | **No secret/hidden rolls** — DDB's Game Log lets a roller hide a roll (roller + DM only); RA had no visibility control (no column, no UI). | missing feature | **WIRED.** Migration `20260722000000_roll_visibility.sql` adds a `visibility` column + visibility-aware SELECT RLS to `campaign_roll_events`. `publishCampaignRollEvent` carries visibility (omits it for public rolls so it stays safe pre-migration); a "🔒 Secret" toggle sits in the sheet Roll-Mode bar (campaign-only); the feed shows a lock and secret rolls skip the ephemeral broadcast. |
| 5 | **No homebrew creature type** — DDB supports homebrew monsters; RA's homebrew was job/path/relic/spell/power/feat/item, and `EncounterBuilder` offered only canonical anomalies. | missing feature | **WIRED.** Added `"anomaly"` to `HomebrewContentType` + the Workbench; new `mapHomebrewAnomalyForRuntime` (rank→CR/XP defaults, full stat block); `EncounterBuilder` merges published homebrew anomalies into the selectable list. Migration `20260722010000_homebrew_anomaly_type.sql` expands the `content_type` CHECK to the full set (also reconciling pre-existing `power`/`feat` drift). |
| 6 | **Latent roll dual-stack** (from Pass 1) — `useCharacterRoll`'s `rollAbilityCheck/SavingThrow/SkillCheck` (+ own skill→ability map) were consumed by no UI. | dead code / trap | **REMOVED.** Trimmed the three convenience methods + their modifier helpers + the props that fed them, from the hook and `CharacterSheetEnhancements`. `roll` (the live path, always fed a derived modifier) is unchanged. |
| 7 | **`character_shadow_army`** persisted + exported but not shown on the sheet. | minor | **Accepted as export-only** (bulk summons, distinct from named `character_shadow_soldiers`/Companions). Documented at the export site. |
| — | **Notes sections** — DDB has Allies/Enemies/Backstory/Other. | parity check | **Met differently, no change.** The Bio tab has Description (backstory), Ideals/Bonds/Flaws, Freeform Notes, a Journal, plus Companions (allies) — an equivalent-or-richer surface. |

### Accepted divergences reaffirmed (hard rules)
Both VTTs (2D Maps, 3D Sigil) + tokens/fog/map-DM-tools; and **all** paid
features — subscription tiers, Marketplace paywalls, content entitlement as
revenue, weekly Drops. RA is free forever; its Marketplace is free content-
sharing only.

### Verification (Pass 2)
- `typecheck`, `lint:check` (1157 files), `knip` → clean.
- `test:run` → **2279 passed / 233 files**, incl. new guards
  `campaignSessionEvents.test.ts`, roll-visibility cases in
  `campaignRollEvents.test.ts`, and anomaly mapping in `homebrewRuntime.test.ts`.
- `verify:chunks` (224 chunks) + `audit:compendium` (0 err / 0 warn / 0 missing)
  → clean.
- Runtime (dev preview): Encounter Builder renders; Homebrew type selector now
  offers **anomaly**; guest character sheet boots and click-to-roll records with
  **zero console errors** after the roll-hook trim + realtime mount.
- **Two migrations ship at deploy time** (not pushed to the shared DB without
  go-ahead): `20260722000000_roll_visibility.sql`,
  `20260722010000_homebrew_anomaly_type.sql`. Both are additive/backward-
  compatible; run `gen:types` after applying. The client is written to stay safe
  against a database where they haven't landed yet.

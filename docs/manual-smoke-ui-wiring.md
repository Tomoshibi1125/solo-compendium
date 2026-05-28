# Manual Smoke Test — Crit Display, Upcast Picker, PDF Download, Level-Up CTA

Step-by-step manual smoke test against `npm run dev` that exercises the four recently wired character-sheet UI surfaces end-to-end with explicit pass/fail checks and a deterministic fallback for the RNG-driven crit path.

## Automated Coverage (run before going hands-on)

The four flows below are also backed by Vitest specs. Run these as the regression gate before doing the manual walkthrough:

```bash
npx vitest run \
  src/components/character/__tests__/ExportDialog.test.tsx \
  src/lib/__tests__/smokeUiWiring.test.tsx \
  src/lib/__tests__/round2Wiring.test.ts \
  src/lib/__tests__/ddbParityHelpers.test.ts \
  src/lib/__tests__/actionResolution.test.ts
```

| Flow | Automated spec | Manual section below |
|---|---|---|
| **Crit display** | `smokeUiWiring.test.tsx` (T3 message format) + `round2Wiring.test.ts` (B1/D5) + `ddbParityHelpers.test.ts` (P1.3) | T3 |
| **Upcast picker** | `smokeUiWiring.test.tsx` (T2 `useSpellCasting.getUpcastLevels`) + `ddbParityHelpers.test.ts` (P1.5 upcast scaling) | T2 |
| **PDF download** | `ExportDialog.test.tsx` (7 tests: JSON, Preview iframe URL, Print routed through `iframe.contentWindow.print()`, direct PDF, state reset, no-token branch) + `smokeUiWiring.test.tsx` (T4 `printCharacterSheet` URL) | T4 |
| **Level-Up CTA** | `smokeUiWiring.test.tsx` (T1 `checkLevelUpEligibility` 299 / 300 / 350 / milestone / L20) + `ddbParityHelpers.test.ts` (P1.11) | T1 |

Manual run is still required to validate visual polish (pulse animation, amber ping badge, toast styling, browser print dialog, real iframe rendering).

## Scope & References

- **Crit display** — `src/components/character/ActionCard.tsx` lines 148-160 (toast `💥 CRITICAL HIT!`), resolved via `resolveAttack` in `src/lib/actionResolution.ts` lines 193-241 (`naturalD20 === 20` or `forceCritical`).
- **Upcast picker** — `src/components/character/SpellsList.tsx` lines 525-578 (per-spell `<select aria-label="Cast at level">`) plus `getUpcastLevels` in `src/hooks/useSpellCasting.ts` lines 292-305.
- **PDF download** — `src/components/character/ExportDialog.tsx` (Preview iframe → Print, "Open in new tab", JSON export); exporter in `src/lib/export.ts`. Stable hooks: `data-testid="export-dialog"`, `export-preview-btn`, `export-pdf-preview`, `export-print-from-preview`.
- **Level-up CTA** — `src/components/character-v2/CharacterSheetV2.tsx` lines 769-796 (pulse + amber ping badge), eligibility from `checkLevelUpEligibility` in `src/lib/experience.ts` line 103. XP thresholds in `src/components/CharacterLevelUp.tsx` line 13 and `src/lib/experience.ts`.

## Preconditions

- Clean `main`, `npm install` complete, `.env` with `VITE_PUBLIC_SITE_URL` set.
- Supabase: linked remote OR local (`supabase start`). Migrations up to date (`npx supabase migration list --linked`).
- Browser: latest Chrome/Edge (Chromium needed for the in-app print iframe).
- One test account ready (email/password or OAuth). Throwaway is fine.

## Boot

1. `npm run dev` in the repo root.
2. Open `http://localhost:5173/`, sign in with the test account.
3. Open DevTools → **Console** and **Network** tabs; keep them open for the entire run.

## Test Character Setup (fresh, one-time)

Goal: a level-1 caster in an XP-mode campaign with a leveled prepared spell, a melee weapon, and XP set just under the L2 threshold (300).

1. **Create campaign**: `/campaigns` → **New Campaign** → Name: `SmokeTest`, set **Leveling Mode = XP** in campaign settings → Save.
2. **Create character**: `/characters/new` → Job: **Mage** (full caster, easiest upcast) → Path: any → Level 1.
   - Ensure starting equipment includes a melee weapon (e.g., Quarterstaff / Dagger) OR add one in step 4.
3. **Join campaign**: from the character sheet, link it to `SmokeTest` so `useCampaignByCharacterId` resolves and `campaignId` is non-null.
4. **Spells tab**:
   - Confirm at least one **cantrip** is added.
   - **Add Spell** → pick a Level-1 leveled spell with damage (e.g., **Magic Missile**, **Burning Hands**) → mark **Prep**. Add a 2nd leveled spell for variety if convenient.
5. **Equipment tab**: confirm/add a weapon with an `attack` payload (so `ActionCard` exposes the **Attack** button via `useCombatActions`).
6. **XP setup** (for level-up CTA):
   - Open **Level Up Wizard** from sheet header → set/add XP to **299** (just under L2 threshold) → close without confirming.
   - Verify header CTA is NOT pulsing (`canLevelUp === false`).

> Capture the character's URL (`/characters/<id>`) — every test below starts from there.

---

## Test 1 — Level-Up CTA

1. From `/characters/<id>`, locate the **Level Up** button in the sheet header (Zap icon, top control row).
2. **Negative check (299 XP)**:
   - Button visible, label `Level Up`, no `animate-pulse`, no amber ping badge.
   - Hover → no tooltip text about "Level Up available".
3. **Trigger eligibility**: open the Level Up wizard (or character editor) → bump XP to **350** → save.
4. **Positive check (350 XP)**:
   - Button now has `animate-pulse` and the amber `bg-amber-500` ping dot at top-right.
   - Hover title reads `Level Up available — enough XP for level 2`.
5. **Modal open**: click button → `LevelUpWizardModal` opens, `canLevelUp === true` path renders advancement steps.
6. **Cancel** the wizard without committing; reload page → CTA still pulses (state persisted via XP).
7. **Level 20 wording**: set character level to 20 (Warden tools or DB) → CTA label switches to `Manage Level`, no pulse, no badge.

**Pass criteria**: pulse + badge toggle in lockstep with the 300-XP threshold; tooltip string matches; modal opens; L20 wording is `Manage Level`.

---

## Test 2 — Upcast Picker (Spells)

1. Open the **Spells** tab on the test character.
2. Locate the prepared Level-1 leveled spell (e.g., Magic Missile). With only L1 slots, the upcast `<select>` should NOT render (`levels.length <= 1`).
3. **Unlock higher slots**: complete the Level-Up wizard 1→2 (Mage gets L2 slots) OR temporarily bump character level to 3 in DB so L1 + L2 slots exist.
4. Return to Spells. On the prepared L1 spell:
   - A `<select aria-label="Cast at level">` is now visible next to **Cast**.
   - Options list contains `Lv 1` and `Lv 2` (only levels with `current > 0` slots).
5. **Default cast (Lv 1)**:
   - Click **Cast** → toast "Spell Cast" → L1 slot decremented by 1 (header / slot tracker).
6. **Upcast (Lv 2)**:
   - Change select to `Lv 2` → click **Cast** → toast "Spell Cast" → L2 slot decremented by 1, L1 slot unchanged.
   - If the spell's payload has `damage_roll`, confirm the rolled damage scales (see `useSpellCasting` scaling note in `SpellsList.tsx` ~line 201).
7. **Slot exhaustion**: cast until all L2 slots are spent → `Lv 2` disappears from the picker (only `Lv 1` remains) → if `levels.length` collapses to 1, the picker hides entirely.
8. **Long rest** → reopen Spells → picker reappears with both options.

**Pass criteria**: picker visibility tracks slot availability, default cast respects current selection, the correct slot level is consumed each time, no console errors.

---

## Test 3 — Crit Display

Primary path uses RNG; fallback uses a deterministic `Math.random` stub. Run both.

### 3A — RNG path (target ~20 attacks)

1. On the test character, open the **Actions** / **Combat** view containing weapon `ActionCard`s.
2. Click the weapon's **Attack** button repeatedly (up to ~30 times).
3. On a natural-20:
   - Toast: `💥 CRITICAL HIT! <Weapon> Attack: <total> (vs AC 10) | Damage: <n> (dice doubled)`.
   - Roll history (Dice tab / campaign feed) records `roll_type: "attack"` with context `<Weapon> (attack)`.
4. If no nat-20 within ~30 tries, fall back to **3B**.

### 3B — Deterministic stub (DevTools)

1. In DevTools Console, run:

   ```js
   const __origRandom = Math.random;
   Math.random = () => 0.9999; // forces max on every d20 → nat-20 every attack
   ```

2. Click weapon **Attack** once.
   - Toast must show `💥 CRITICAL HIT!` and `(dice doubled)`.
   - Damage total should be ≥ non-crit max for the same formula (e.g., `1d8+3` non-crit max 11 → crit becomes `2d8+3` ∈ [5,19]; with stub it lands at 19).
3. Restore:

   ```js
   Math.random = __origRandom;
   ```

4. Click **Attack** again → toast no longer prefixed with `💥 CRITICAL HIT!` (proves cleanup).
5. **Save-based action** (sanity): on a spell `ActionCard` with `save` payload (e.g., Burning Hands), click **Save** → toast reads `... Save DC <n>: Success/Failure | Damage: <n>` (no `CRITICAL HIT` prefix — crit logic is attack-only).

**Pass criteria**: crit prefix only fires on attack actions, damage actually doubles dice (not modifier), and the stub cleanly reverts.

---

## Test 4 — PDF Download / Export Dialog

1. From the character sheet header, open the **Export** modal (`persistentModals.export`). Confirm `data-testid="export-dialog"` is present in DOM.
2. **JSON export**:
   - Click **Export as JSON** → browser downloads `<Name>.json`.
   - Open the file → contains `name`, `level`, `abilities`, `spells`, `equipment`, `features` keys.
3. **Preview PDF**:
   - Reopen dialog → click **Preview PDF** (`data-testid="export-preview-btn"`).
   - Dialog widens (`max-w-5xl`); iframe renders at `data-testid="export-pdf-preview"` loading `/characters/<id>?print=true&token=<share_token>` (verify URL in Network).
   - Print-layout sheet (`?print=true` view) renders inside the iframe — name, abilities, AC, HP, spells, equipment all legible.
4. **Print / Save as PDF**:
   - Click **Print / Save as PDF** (`data-testid="export-print-from-preview"`) → browser print dialog opens scoped to the iframe content (NOT the surrounding app chrome).
   - Choose **Save as PDF** → save → open the PDF → matches the preview, no app navigation/UI bleed-through.
5. **Back navigation**: click **Back** in the preview → dialog returns to the action-list view, iframe unmounted (`previewOpen=false`).
6. **Open in new tab**:
   - From preview view, click **Open in new tab** → new tab loads `/characters/<id>?print=true&token=...`.
   - Browser print dialog auto-fires (see `exportCharacterPDF` in `src/lib/export.ts`).
7. **Direct PDF button**:
   - Close preview → click **Export as PDF** on the main list → new tab opens with the same printable view + print dialog.
8. **Close dialog** → reopen → `previewOpen` resets to `false` (action list view, not preview).

**Pass criteria**: all three export modes (JSON, Preview→Print, Open-in-tab) succeed; preview iframe uses the correct URL; closing/reopening resets state.

---

## Cross-Cutting Checks (run once after Tests 1–4)

- **Console**: zero red errors during the full session.
- **Network**: no 4xx/5xx on character / campaign / spell-slot fetches. Roll inserts (`roll_history` POST) succeed for both attack and cast actions.
- **Realtime**: if a 2nd browser/tab is signed into the same campaign, the crit and cast rolls appear in the campaign chat feed (`rollInCampaign` path).
- **Reload persistence**: full page reload after each test should not change CTA pulse state, slot counts, or spell prep state.

## Result Recording Template

Copy into a scratch doc as you go:

```
[ ] T1 Level-Up CTA — Negative (299 XP) PASS/FAIL
[ ] T1 Level-Up CTA — Positive (350 XP) PASS/FAIL
[ ] T1 Level-Up CTA — Modal opens PASS/FAIL
[ ] T1 Level-Up CTA — L20 wording PASS/FAIL
[ ] T2 Upcast — Hidden at L1 only PASS/FAIL
[ ] T2 Upcast — Visible after L2 slots PASS/FAIL
[ ] T2 Upcast — Default Lv 1 consumes L1 PASS/FAIL
[ ] T2 Upcast — Selected Lv 2 consumes L2 PASS/FAIL
[ ] T2 Upcast — Hides on slot exhaustion PASS/FAIL
[ ] T3 Crit — RNG nat-20 toast PASS/FAIL/SKIPPED
[ ] T3 Crit — DevTools stub forces crit PASS/FAIL
[ ] T3 Crit — Stub revert clears prefix PASS/FAIL
[ ] T3 Crit — Save action not prefixed PASS/FAIL
[ ] T4 Export — JSON download valid PASS/FAIL
[ ] T4 Export — Preview iframe loads ?print=true PASS/FAIL
[ ] T4 Export — Print iframe-scoped PASS/FAIL
[ ] T4 Export — Open-in-tab + auto print PASS/FAIL
[ ] T4 Export — State resets on close PASS/FAIL
[ ] Cross — No console errors PASS/FAIL
[ ] Cross — Network all 2xx PASS/FAIL
[ ] Cross — Reload persistence PASS/FAIL
```

## Notes / Known Sharp Edges

- `useSpellCasting` damage scaling depends on `spell.damage_roll` existing on the canonical spell payload; if a chosen test spell has no damage roll, T2 step 6's damage comparison degrades to "slot consumed correctly only".
- The print dialog flow varies per browser; the Chrome iframe-print path is what `handlePrintFromPreview` targets — Firefox may print the whole page.
- `Math.random` stub in T3B affects **all** dice rolls until reverted — keep the restore line ready.
- Level-up CTA reads `characters.experience`; if your campaign override forces milestone mode anywhere, eligibility will always be false. Confirm the campaign you joined is actually XP-mode (`getLevelingMode(campaign.settings) === "xp"`).

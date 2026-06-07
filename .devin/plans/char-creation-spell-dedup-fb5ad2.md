# Character Creation & Spell Deduplication Remediation Plan

**Status:** draft  
**ID:** fb5ad2

---

## Problem Statement

1. **Spell data duplication** — Each spell entry contains the same information in 2–3 places (e.g. `atHigherLevels` + `higher_levels`; top-level `attack`/`saving_throw` mirrored inside `mechanics`; `duration`/`range`/`casting_time` repeated in `mechanics`).
2. **Character creator "imprints" step UX** — Power/spell/technique/cantrip selection uses a tall scrolling button list instead of a compact, searchable dropdown. The Job and Background steps already use `<Select>` dropdowns correctly.
3. **ASI & awakening features** — Core logic and tests confirm these ARE wired correctly. No code bug identified. However, we should add a visual ASI/trait confirmation panel on the Review step so the user can clearly see what was applied (currently summarized minimally).

---

## Phase A — Spell Data Deduplication

### A-1: Identify canonical source-of-truth fields
The normalized `CanonicalCastableEntry` (built by `normalizeCastableEntry` in `canonicalCompendium.ts`) already derives display values from the raw data. The static spell files should store only **one** copy of each piece of information.

**Redundant fields to remove from raw spell data files:**
| Keep (source of truth) | Remove (duplicate) |
|---|---|
| `higher_levels` | `atHigherLevels` |
| `attack` (top-level) | `mechanics.attack` |
| `saving_throw` (top-level) | `mechanics.saving_throw` |
| `casting_time` | `mechanics.action` |
| `duration` | `mechanics.duration` |
| `range` | `mechanics.range` |
| `attack.ability` | `mechanics.ability` |
| `saving_throw.ability` / `saving_throw.dc` | `mechanics.save` / `mechanics.dc` |
| `school` | `mechanics.type` |

**Keep in `mechanics`:** only fields that add NEW information (e.g. `damage_profile`, `lattice_interaction`, `scaling`, `save_dc` when it differs from `saving_throw.dc`).

### A-2: Write a codemod script
- Script reads each `rank-*.ts` and `supplemental.ts` in `src/data/compendium/spells/`
- For each spell, removes duplicated fields from `mechanics`
- Removes `atHigherLevels` (keep `higher_levels`)
- Outputs cleaned files in place

### A-3: Update `normalizeCastableEntry` fallback
Ensure `normalizeCastableEntry` in `canonicalCompendium.ts` already handles the case where `mechanics.attack` / `mechanics.saving_throw` are absent (it already falls through to top-level fields). Verify with existing tests.

### A-4: Add deduplication regression test
A test that asserts no spell has both `atHigherLevels` AND `higher_levels` with the same value, and that `mechanics` doesn't duplicate top-level fields.

---

## Phase B — Imprints Step UX (DDB Dropdown Parity)

### B-1: Replace button-list with searchable combobox
For each imprint category (cantrips, spells, spellbook, powers, techniques, fighting styles, specialist training, favored terrains):
- Replace the scrolling `<button>` grid with a `<Combobox>` (or multi-select dropdown) component
- Show selected items as chips/badges below the dropdown
- Allow search/filter within the dropdown
- Maintain the selection limit logic

### B-2: Compact layout
- Each category gets a labeled combobox row (like DDB's "Choose N from the following")
- Selected items appear as removable badges
- Collapse long option descriptions into tooltips

### B-3: Optional detail drawer
- Clicking a selected badge opens a detail panel/drawer for that power/spell
- Matches DDB pattern of "click to see details without losing your place"

---

## Phase C — Review Step Enhancement

### C-1: Add ASI/Awakening summary panel
On the Review step, show a clear summary:
- **ASI Applied:** STR +2, VIT +1, etc.
- **Racial Traits:** list with descriptions
- **Awakening Features (Level 1):** list with brief descriptions
- **Job Traits:** list
- **Proficiencies:** saving throws, skills, weapons, armor, tools
- **Speed / Senses / Resistances**

This makes it unmistakable that everything has been wired in.

---

## Phase D — Validation & Testing

### D-1: Run existing tests
- `racialAsiRegression.test.ts`
- `jobAwakeningFeatures.test.ts`
- `spellsNormalization.test.ts`
- `compendiumCompleteness.test.ts`

### D-2: Add new tests
- Spell deduplication assertion (Phase A-4)
- UI smoke test for combobox selection (optional, if Playwright available)

### D-3: Typecheck
- `npm run typecheck` must pass after all changes

---

## Implementation Order

1. **Phase A** (spell dedup) — safest, data-only, no UI risk
2. **Phase D-1** (verify existing tests pass before changes)
3. **Phase B** (imprints UX) — UI change, moderate scope
4. **Phase C** (review step) — small additive UI
5. **Phase D-2/D-3** (new tests + typecheck)

---

## Out of Scope

- The `characterEngine.ts` awakening/ASI logic is working correctly and does not need changes.
- The `CharacterWizard` step structure is already sound.
- Job/Background dropdowns already match DDB pattern — no changes needed there.

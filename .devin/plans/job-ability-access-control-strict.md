# Job Ability Access Control Strict Plan

Status: proposed
Decision: strict only

## Objective
Ensure characters can only see and add powers, spells, and techniques allowed by their job, path, regent overlays, rune-granted abilities, and valid homebrew targeting rules. Remove unrestricted selection paths that let jobs such as Destroyer browse or add every ability.

## Scope
- Add dialogs for powers, spells, and techniques.
- Character creation and level-up selection flows.
- Mutation hooks that insert powers, spells, and techniques.
- Compendium send-to-character routing that can bypass the Add dialogs.
- Targeted tests for job eligibility and bypass prevention.

## Implementation Plan

### 1. Centralize eligibility checks
- Add reusable strict eligibility helpers in `canonicalCompendium.ts` or a nearby ability-access module.
- Helpers should validate canonical powers, spells, and techniques against the character job, path, regent overlays, and sourcebook access.
- Preserve rune-granted and homebrew rules only when they explicitly match the character.

### 2. Remove unrestricted Add dialog listing
- Remove the unrestricted `showAll` / all-list branches from `AddPowerDialog.tsx` and `AddSpellDialog.tsx`.
- Keep `AddTechniqueDialog.tsx` on the learnable technique list only; remove or neutralize any "all" / "my job only" behavior if present.
- Update empty states so they describe strict job/path/regent availability instead of implying a user can show every entry.

### 3. Enforce eligibility in mutation hooks
- Update `usePowers.ts`, `useSpells.ts`, and `useTechniques.ts` so `addPower`, `addSpell`, and `addTechnique` reject canonical entries that are not learnable by the target character.
- Fetch the target character's job/path/regents inside the mutation, then validate before local or remote insertion.
- Keep existing sourcebook access checks, but make job/path/regent checks a separate failure mode with a clear error message.

### 4. Close non-dialog bypasses
- Update `SendToInventoryDialog.tsx` so compendium powers/spells/techniques sent to a character still go through the same strict hook validation and correct spell-vs-power routing.
- Verify character creation and level-up already select only from `listLearnable*`; add guard validation before persisting selected IDs if needed.

### 5. Add regression coverage
- Extend canonical/job access tests to assert Destroyer cannot learn spells and Mage cannot learn powers/techniques through strict validation.
- Add hook or helper-level tests for rejecting direct add attempts that bypass the dialogs.
- Run targeted tests, typecheck, and a focused Biome check on changed files.

## Acceptance Criteria
- Destroyer sees only allowed powers/techniques and no spells unless explicitly granted by path/regent/rune/homebrew rules.
- Mage sees spells only and cannot add martial powers/techniques through UI or direct hook calls.
- `showAll` does not allow unrestricted selection in add dialogs.
- Sending a compendium spell/power/technique directly to a character cannot bypass eligibility.
- Tests cover both list filtering and add-time rejection.

# Rift Ascendant — SRD 5.1 Formula Re-derivation Audit (July 2026)

Deep, number-by-number re-derivation of every RA automation/formula against
**5e SRD 5.1** (+ RA canon overlay), with `file:line` evidence and a PASS/FIX
verdict per formula. Companion to the "Final Assurance Pass" plan.

Legend: **PASS** = matches SRD/RA canon as written · **FIX** = drift found and
corrected this pass · **NOTE** = intentional RA divergence (documented, kept).

---

## 1. Core math

| Formula | SRD rule | Source | Verdict |
|---|---|---|---|
| Ability modifier | `floor((score-10)/2)` (+NaN guard) | `5eRulesEngine.ts:214` | PASS |
| Proficiency bonus | `ceil(level/4)+1` | `5eRulesEngine.ts:224` | PASS |
| 18 skills → abilities | DEX→AGI, CON→VIT, WIS→SENSE, CHA→PRE | `5eRulesEngine.ts:40`, `5eCharacterCalculations.ts:118` | PASS |
| Saving throws | ability mod + (prof? PB) | `5eCharacterCalculations.ts:93`, `derivedStats/…calculateSavingThrows` | PASS |
| Skill mod | ability mod + prof/expertise + Jack-of-all-Trades `floor(PB/2)` | `5eCharacterCalculations.ts:139` | PASS |
| Initiative | AGI modifier | `5eCharacterCalculations.ts:159` | PASS |
| Carrying capacity | STR × 15 | `5eCharacterCalculations.ts:175` | PASS |
| HP max | L1 `die+VIT`; per-level `floor(die/2)+1+VIT`; +Tough/regent | `5eCharacterCalculations.ts:208` | PASS |
| Rift Favor (die/max by tier) | RA-bespoke (Inspiration analogue) | `5eRulesEngine.ts:234` | NOTE (RA canon) |

## 2. Spellcasting

| Formula | SRD rule | Source | Verdict |
|---|---|---|---|
| Spell save DC | `8 + PB + casting mod` | `5eCharacterCalculations.ts:243` | PASS |
| Spell attack | `PB + casting mod` | `5eCharacterCalculations.ts:256` | PASS |
| Caster-type job map | 14 RA jobs → 5e archetypes | `5eCharacterCalculations.ts:277` | PASS |
| Full-caster slot table (L1–20) | PHB full-caster | `5eCharacterCalculations.ts:350` | PASS |
| Half-caster slot table | PHB Paladin/Ranger | `5eCharacterCalculations.ts:413` | PASS |
| Pact (Warlock) slot table | PHB Warlock | `5eCharacterCalculations.ts:382` | PASS |
| Cantrips known (Wiz/Cler/Sorc/Bard/Druid/Warlock) | PHB per class | `5eCharacterCalculations.ts:610` | PASS |
| Spellcasting ability per job | INT/SENSE(WIS)/PRE(CHA) map | `5eCharacterCalculations.ts:479` | PASS |
| **Stalker (Ranger) spells known** | SRD Ranger = `ceil(level/2)+1` | `5eCharacterCalculations.ts:566` | **FIX (F1)** |
| **Holy Knight / Technomancer prepared** | half-caster `mod+floor(level/2)` | `5eCharacterCalculations.ts:589` | **FIX (F2)** |
| **Esper/Idol/Contractor spells known badge** | exact Sorc/Bard/Warlock tables | `5eCharacterCalculations.ts:543` | **FIX (F3)** |
| Technomancer = delayed half-caster ("artificer", L1 no slots) | RA canon (not Tasha's round-up) | `levelGating.test.ts:328`, `abilityProgression.ts:30` | NOTE (RA canon, kept) |

### FIX F1 — Stalker/Ranger spells known (odd-level off-by-one)
`getSpellsKnownLimit` used `floor(level/2)+1`, which under-counts at every odd
level ≥3 (L5 gave 3, Ranger knows 4; L9 gave 5, Ranger knows 6). SRD Ranger
"Spells Known" = `ceil(level/2)+1`. Stalker has **no** static `spellsKnown`
array in `jobs.ts`, so this computed value is its only source → user-visible on
the sheet badge and level-up swap gating. Corrected + tests updated
(`5eCharacterCalculations.test.ts`, `spellSaveDC.test.ts`). The source comment
had mislabelled `floor(level/2)+1` as "the Ranger formula" (it only matched at
even levels, hiding the bug).

### FIX F2 — Holy Knight / Technomancer prepared over-count
Both are half-casters (half-caster spell slots) but were listed among the
**full-caster** prepared casters using `mod + level`. SRD Paladin (and Artificer)
prepare `mod + floor(level/2)`, min 1 — exactly as Revenant (also half) was
already handled. A L13 Holy Knight (+1 PRE) prepared 14 instead of 7; a L2
Technomancer (+3 INT) prepared 5 instead of 4. Moved both to the half-caster
prepared branch. This also makes Technomancer's preparation *more*
artificer-accurate.

### FIX F3 — Known-caster badge drift vs. creation limit
`getSpellsKnownLimit` returned a rough `level + 1` for Esper/Idol/Contractor,
but the creation/level-up wizard reads the exact static Sorcerer/Bard/Warlock
`spellsKnown` arrays in `jobs.ts`. These diverged — worst for Idol/Bard (L1
showed 2 but the wizard grants 4) and at high levels where the real tables
plateau (Esper L12 = 12 not 13; Contractor L10 = 10 not 11). Encoded the exact
SRD tables and added a **guard test** binding `getSpellsKnownLimit` to the
`jobs.ts` arrays so the badge and the creation limit can never drift again.

---

## 3. Armor Class

| Formula | SRD rule | Source | Verdict |
|---|---|---|---|
| Unarmored base | `10 + AGI` | `acFormulas.ts:78` | PASS |
| Striker (Monk) UD | `10 + AGI + SENSE`, no shield | `acFormulas.ts:106` | PASS |
| Armored light/medium/heavy | full AGI / cap +2 / none, + magic | `acFormulas.ts:139` | PASS |
| Mage Armor | `13 + AGI` | `acFormulas.ts:170` | PASS |
| Shield | `+2 + magic` | `acFormulas.ts:225` | PASS |
| Best-of selection | evaluate all valid, take highest (DDB) | `acFormulas.ts:197` | PASS |
| **Berserker (Barbarian) UD** | SRD = `10 + DEX + CON` = `10 + AGI + VIT` | `acFormulas.ts:93` uses `10 + STR + VIT` | **NOTE — RA divergence** |
| Revenant Unarmored Requiem `10 + INT + VIT` | bespoke drain-tank | `acFormulas.ts:123` | NOTE (RA canon) |

## 4. Combat, resources, world math

| Formula | SRD rule | Source | Verdict |
|---|---|---|---|
| Death saves (Nat20 reset+1HP, Nat1 +2 fail, ≥10 success, massive dmg = death, heal-at-0 reset) | PHB p.197 | `deathSaveRules.ts` | PASS |
| Concentration DC | `max(10, floor(damage/2))` per hit | `system_ascendant/concentration.ts:57` | PASS |
| Cantrip dice scaling | 1/2/3/4 at L1/5/11/17 | `cantripScaling.ts:28` | PASS |
| Weapon attack | `ability mod + (prof? PB) + bonus` | `derivedStats/attackModifiers.ts:3` | PASS |
| Weapon ability select | ranged→AGI, melee→STR, finesse→best(STR,AGI) | `derivedStats/attackModifiers.ts:16` | PASS |
| Critical hit | double dice only (+Brutal extra dice), mod not doubled | `advancedDiceEngine.ts:71` | PASS |
| Encumbrance | carry `STR×15`, push/drag/lift `STR×30` | `encumbrance.ts:19` | PASS |
| Encumbrance penalty bands (>100% −10, >200% −20) | vs strict optional variant `STR×5`/`×10` | `encumbrance.ts:101` | NOTE (lenient RA homebrew) |
| Attunement cap | RA 6 (SRD default 3) | `attunementRules.ts:12` | NOTE (RA divergence) |
| Long rest | full HP; hit dice back `floor(max/2)` min 1; all slots; uses reset | `restSystem.ts:187` | PASS |
| Short rest | per-short-rest features + pact slots reset; HD spent by player | `restSystem.ts:48` | PASS |
| Monster stats by CR (0–30) | DMG p.274 (AC/HP/atk/DC/dmg) | `monster5eTable.ts:36` | PASS |
| XP advancement thresholds (L2–20) | PHB | `experience.ts:8` | PASS |
| CR → XP (0–30) | DMG | `experience.ts:32` | PASS |
| Level-up eligibility | XP-cross surfaces CTA, no auto-promote (DDB) | `experience.ts:93` | PASS |

Minor: `restSystem.ts:48` comment says hit-dice recovery is "rounded up"; the
code correctly `floor`s (SRD/DDB). Comment-only, no behavior change.

| Formula | SRD rule | Source | Verdict |
|---|---|---|---|
| 14 conditions mechanical effects | SRD condition appendix | `conditionEffects.ts:33` | PASS |
| Exhaustion 6-level table (L4 HP½, L5 speed 0, L6 death) | SRD 5.1 (2014) | `conditionEffects.ts:156` | PASS |
| Advantage + disadvantage cancel to normal | PHB | `conditionEffects.ts:321` | PASS |
| Extra Attack: 2 @ L5 (martials); 3 @ L11 / 4 @ L20 Destroyer-only | PHB Fighter vs others | `featEffectParser.ts:339` | PASS |
| Upcast damage scaling (`upcastLevels × dice/level`) | DDB auto-upcast | `upcastScaling.ts:69` | PASS |
| Currency cascade (core/gate/crystal/mana = 1000/100/10/1) | pp/gp/sp/cp 10:1 ladder + ep=5×sp | `currency.ts:340` | PASS (+ auto-cascade exceeds DDB) |
| **Encounter difficulty thresholds** | DMG p.82 (NOT in SRD 5.1) | `encounterMath.ts:5` | **NOTE — diverges from DMG/DDB** |

### Encounter math divergence (flagged, not fixed)
`encounterMath.ts` `DIFFICULTY_THRESHOLDS` is a flatter homebrew curve, not the
DMG "XP Thresholds by Character Level" (e.g. L10 deadly 1200 vs DMG 2800; L20
deadly 5500 vs DMG 12700), and `calculateDifficulty` multiplies monster XP by a
*party-size* factor compared against a *single*-character threshold (the DMG
method multiplies by monster count vs the summed party threshold). Encounter-
building rules are **DMG content, excluded from SRD 5.1**, so this is not an SRD
violation — but it diverges from DDB's encounter builder and underpins the
rank→CR band calibration. Left as-is per the "keep RA canon" decision; recorded
here so it's a conscious choice, not an accident.

## 5. Intentional RA divergences from SRD 5.1

All **documented design choices**, not bugs — each is internally consistent and
commented as intentional.

### 5a. Divergences from a specific SRD rule (**DECISION: keep all as RA canon**)

These each contradict/change a concrete SRD 5.1 rule and *could* be aligned, but
the maintainer chose (Jul 2026) to **keep them as intentional Rift Ascendant
canon** — do not align to strict SRD:

1. **Berserker Unarmored Defense = `10 + STR + VIT`** (SRD Barbarian = `10 + AGI + VIT`, i.e. DEX+CON). RA rationale: "raw muscle, no AGI." `acFormulas.ts:85`.
2. **Attunement cap 6** (SRD default 3). `attunementRules.ts:12`.
3. **Encumbrance bands** penalize at >100%/>200% of `STR×15` (SRD optional variant: `STR×5` encumbered / `STR×10` heavily encumbered). `encumbrance.ts:101`.

### 5b. RA-original content — no SRD analogue (nothing to align)

Not a deviation from any SRD rule — a net-new RA formula with no 5e baseline to
compare against. Structurally consistent with how SRD builds unarmored defense
(two ability mods, cf. Barbarian DEX+CON / Monk DEX+WIS):

- **Revenant Unarmored Requiem `10 + INT + VIT`** — the bespoke INT-based
  unarmored drain-tank job. `acFormulas.ts:118`. Kept as RA canon by definition.

## Track A status: COMPLETE

Every formula domain above has been re-derived against SRD 5.1 (+ RA canon).
Result: **3 real SRD bugs fixed (F1/F2/F3)**, the rest PASS, and the intentional
RA divergences catalogued (§5) and kept as canon per the maintainer decision.

The `characterEngine` ↔ `useCharacterDerivedStats` cross-path consistency check
is verified empirically in **Track B** (build a real character in the running
app; confirm the sheet's displayed AC/HP/saves/skills/slots/DC match the
re-derived values), rather than by a synthetic unit fixture.

## Track B — runtime sweep (next)

Drive the running app and confirm the automations/populations actually reach the
UI across the four areas (player lifecycle, Warden/campaign, compendium/content,
AI/offline/export). Findings appended below as they surface.

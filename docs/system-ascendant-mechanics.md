# System Ascendant Mechanics vs D&D 5e

## Overview

**System Ascendant** is a **modern urban fantasy d20 system** inspired by Korean manhwa like *Solo Leveling*. It uses **5e mechanics as the engine** but with **thematic reskins and custom systems** for a world where dimensional gates, ascendants, and the mysterious "System" replace traditional fantasy.

---

## Core D20 Framework (Same as 5e)

### ✅ Standard 5e Mechanics (Unchanged)

- **d20 roll system** - Attack rolls, saves, ability checks
- **Ability score modifiers** - `(score - 10) / 2`
- **Proficiency bonus scaling** - +2 at level 1, increases every 4 levels
- **Advantage/disadvantage** - Roll 2d20, take highest/lowest
- **Saving throws** - Target beats DC or suffers effect
- **Spell slots** - Full/half/pact caster progressions (PHB tables)
- **Hit dice** - d6/d8/d10/d12 based on class
- **Short/long rests** - 1 hour / 8 hours
- **Death saves** - 3 successes to stabilize, 3 failures = death
- **Multiclass spell slots** - PHB page 164 merging rules
- **Critical hits** - Natural 20 = maximum normal dice + rolled critical dice + modifiers once
- **Concentration** - One spell at a time, broken by damage/incapacitation

---

## Terminology Reskin (Mechanics Identical)

| D&D 5e | System Ascendant | Notes |
|--------|------------------|-------|
| Class | **Job** | Destroyer, Mage, Esper, etc. |
| Subclass | **Path** | Specializations within jobs |
| Spell | **Spell / Power / Technique** | **Three distinct categories** per RA canon (`docs/rift-ascendant-world-lore.md:213`). Powers use the Job's primary ability (`getJobPrimaryAbility`), Spells use the Job's spellcasting ability (`getSpellcastingAbility`), Techniques are martial maneuvers gated by Strength/Agility. See "Spell System Differences" below for the canonical type split. |
| Magic Item | **Relic** | Dimensional artifacts and System rewards |
| Spell Slots | **Spell Slots** | Same slot progression tables — applies to Spells only. Powers use a per-rest charge model (`computePowerUses`); Techniques use `uses_per_rest_formula`. |
| STR/DEX/CON/INT/WIS/CHA | **STR/AGI/VIT/INT/SENSE/PRE** | Renamed abilities, same formulas |
| Inspiration | **Rift Favor** | Enhanced version with multiple uses. Canonical labels live in `src/lib/riftFavor.ts:24-100`. |

### Ability Score Mapping

```typescript
'STR' → 'STR' (Strength)      // Physical power
'DEX' → 'AGI' (Agility)       // Reflexes, coordination
'CON' → 'VIT' (Vitality)      // Endurance, durability
'INT' → 'INT' (Intelligence)  // Logic, knowledge
'WIS' → 'SENSE' (Sense)       // Perception, intuition
'CHA' → 'PRE' (Presence)      // Force of personality
```

---

## Custom Systems (New/Different from 5e)

### 1. **System Favor** (Enhanced Inspiration)

**What It Replaces:** D&D Inspiration (binary on/off mechanic)

**How It Works:**
- **Resource pool** - Scales by level (3→4→5→6 at tiers 1→2→3→4)
- **Die size scales** - d4→d6→d8→d10 as you level up
- **Multiple uses** - Can spend points for various effects

**System Favor Progression:**
| Level | Max Points | Die Size |
|-------|-----------|----------|
| 1-4   | 3         | d4       |
| 5-10  | 4         | d6       |
| 11-16 | 5         | d8       |
| 17-20 | 6         | d10      |

**Usage Options** (canonical labels from `src/lib/riftFavor.ts:24-100`):
1. **Rift Boost** (1 pt) - Add favor die to d20 roll (like inspiration)
2. **Rift Override** (1 pt) - Reroll failed d20
3. **Rift Recovery** (1 pt, Level 3+) - End one condition as bonus action
4. **Death Defiance** (2 pts, Level 5+) - Drop to 1 HP instead of 0 (once/long rest)
5. **Rift Insight** (1 pt) - Learn creature's AC, HP %, resistances
6. **Flash Step** (1 pt, Level 5+) - Teleport 10 ft as part of movement
7. **Critical Surge** (2 pts, Level 9+) - Convert hit to crit (once/long rest)
8. **Party Link** (1 pt, Level 7+) - Telepathy + advantage on initiative for allies

> **Canon lock:** The "System Boost / System Override / …" labels used in earlier
> drafts of this doc were stale. RA canon (the source-of-truth labels in
> `riftFavor.ts`) uses "**Rift** Boost / Override / Recovery / Insight". The
> `5eRulesEngine.ts:SYSTEM_FAVOR_OPTIONS` array also drifted from canon and is
> tracked as a follow-up cleanup; do **not** copy its label strings.

**Implementation in Engine:**
```typescript
// characterEngine.ts already includes:
systemFavorMax: getSystemFavorMax(base.level),
systemFavorDie: getSystemFavorDie(base.level),
```

---

### 2. **Awakening Features** (Progressive Class Abilities) ✅ IMPLEMENTED

**What It Replaces:** Standard class features with fixed progressions

**How It Works:**
- **Awakening Features** - Unlocked at specific levels (1st, 5th, 11th, etc.)
- **Thematic to modern urban setting** - References to "The System", HUDs, mana veins, dimensional rifts
- **Scaling mechanics** - Features grow stronger with level
- **Auto-parsed from compendium** - `characterEngine.ts` extracts features and converts to effects

**Example** (Destroyer Job):
```typescript
awakeningFeatures: [
  {
    name: "Reinforced Frame",
    description: "When reduced to 0 HP but not killed outright, drop to 1 HP instead. Once per long rest.",
    level: 1
  },
  {
    name: "System Targeting HUD",
    description: "Cannot be surprised. Crit adds extra weapon die.",
    level: 1
  },
  {
    name: "Adrenal Regulator",
    description: "Below half HP, attacks deal +1d4 force damage (1d6 at 11th).",
    level: 5
  },
  {
    name: "Weapon Neural Bond",
    description: "+1 to attack/damage with proficient weapons (+2 at 17th).",
    level: 11
  }
]
```

**Key Difference from 5e:**
- 5e: Class features are discrete abilities (Action Surge, Rage, etc.)
- SA: Awakening features are **passive augmentations** granted by "The System"

**Implementation in Engine:**
```typescript
// ✅ IMPLEMENTED in characterEngine.ts:229-351
function aggregateAwakeningFeatures(jobs: CharacterJob[], totalLevel: number): FeatureInstance[] {
  // Loads from jobs compendium
  // Filters features by level
  // Parses effects automatically (HP bonuses, AC bonuses, attack bonuses, etc.)
}

function parseAwakeningEffects(feature, jobLevel): Effect[] {
  // Auto-detects:
  // - HP maximum increases
  // - AC bonuses
  // - Attack/damage bonuses
  // - Ability score improvements
  // - Speed modifiers
}

// Effects integrated into aggregateEffects() with Priority 150 (between equipment and features)
```

**Auto-Parsed Effects:**
- `"HP maximum increases by 1 per Berserker level"` → `{ type: 'resource', target: 'hp_max', value: jobLevel }`
- `"+1 to attack and damage"` → `{ type: 'modifier', target: 'attack_bonus', value: 1 }`
- `"STR and VIT increase by 4"` → Two effects for STR and VIT modifiers
- `"+10 ft speed"` → `{ type: 'modifier', target: 'speed', value: 10 }`

---

### 3. **Job Traits** (Passive Bonuses) ✅ IMPLEMENTED

**What It Replaces:** Class features that are always active

**How It Works:**
- **Job Traits** = Passive abilities that don't require activation
- **Frequency tags** - `'at-will' | 'short-rest' | 'long-rest' | 'once-per-day'`
- **Type tags** - `'passive' | 'active' | 'resistance' | 'immunity' | 'bonus'`
- **Auto-parsed from compendium** - `characterEngine.ts` extracts traits and converts to effects

**Example:**
```typescript
jobTraits: [
  {
    name: "Gate Breaker",
    description: "Deal double damage to objects. Advantage on saves vs fear from gate anomalies.",
    type: "resistance"
  },
  {
    name: "Combat Telemetry",
    description: "Scan target to learn AC, HP %, saves. Prof bonus uses/long rest.",
    type: "active",
    frequency: "long-rest"
  }
]
```

**Implementation in Engine:**
```typescript
// ✅ IMPLEMENTED in characterEngine.ts:358-456
function aggregateJobTraits(jobs: CharacterJob[], totalLevel: number): FeatureInstance[] {
  // Loads from jobs compendium
  // All traits available from level 1
  // Parses effects automatically (advantage, disadvantage, etc.)
}

function parseJobTraitEffects(trait, jobLevel): Effect[] {
  // Auto-detects:
  // - "Advantage on [check type]" → roll_tag effects
  // - "Disadvantage on [check type]" → roll_tag effects
}

// Effects integrated into aggregateEffects() with Priority 160
```

---

### 4. **Regent/Gemini System** (Gestalt Full-Class Overlay)

A Regent is an earned full class overlay: **Job + Path + Regent**. It is never a Path or subclass. A Warden or co-Warden offers exactly three distinct canonical Regents, and the player chooses one. The unlock is binary, has no character-level or highest-stat requirement, and a character can hold at most two Regents.

**Progression and HP:** A Regent's level equals character level. On unlock, all features and owed selections through the current level apply immediately. Each character level adds one maximum Regent Hit Die on top of Job HP; VIT is already included in Job HP. For a d10 Regent, the added total is +30 at level 3, including retroactive levels, and the next level adds only +10. The class overlay also contributes its authored proficiencies, saves, and spellcasting rules.

**Known abilities:** Martial and half-caster Regents with Power and Technique progressions use the cumulative known-count array `2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8` for each category. Full-caster Regents retain their authored spell and cantrip progression. Initial owed selections use the Warden-curated catch-up flow. Later Regent Power and Technique choices are made by the player from canonical tiers 5–9, with the ability's full effect intact.

**Regent Resonance:** A character has one shared pool for Regent-acquired Powers and Techniques. Its maximum at levels 1–20 is `1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,8`. Tier 5 costs 1; tiers 6–7 cost 2; tiers 8–9 cost 3. A Long Rest refills the pool. The pool replaces each Regent acquisition's native per-rest charges. The same canonical ability acquired through a Job or Path retains its own use system. Regent class features, Job resources, and spell slots are not paid from this pool.

**Gemini Protocol:** Two Regents can fuse into a Sovereign. The Sovereign is the resulting saved class package, not another name for a Regent. Its complete eight-milestone progression is generated and saved at creation; later play is deterministic.

---
### 5. **Rank System** (Power Tiers)

**What It Is:** Korean manhwa-style power classification

**Ranks:**
- **D-Rank** - Entry-level ascendants (city-tier threats)
- **C-Rank** - Experienced ascendants (regional threats)
- **B-Rank** - Elite ascendants (national threats)
- **A-Rank** - Top-tier ascendants (continental threats)
- **S-Rank** - National level ascendants (world-ending threats)

**Application:**
- **Jobs have ranks** - `rank: 'D' | 'C' | 'B' | 'A' | 'S'`
- **Powers have ranks** - Spell equivalents classified by danger
- **Relics have ranks** - Magic item power levels

**No effect on a character's own numbers** - Thematic flavor for world-building. The one mechanical use is a companion's rank tier in companion scaling (section 7).

---

### 6. **Modern Urban Setting Flavor**

**Thematic Changes** (no mechanical difference):
- **Gates** = Dimensional rifts instead of dungeons
- **Ascendants** = Player characters instead of adventurers
- **Ascendant Bureau** = Government guild registry instead of adventurer's guild
- **System Interface** = AR-like HUD overlay for abilities
- **Mana** = Visible energy (glowing veins, crystallized bones) instead of invisible magic
- **Smartphones, CCTV, social media** = Modern tech integrated into abilities

**Example Flavor Text:**
> "Your HUD displays [TARGET DESIGNATED]. Security cameras capture you vanishing. Your phone buzzes with [MANA ABSORBED]. Bystanders' smartphones auto-focus on your glowing veins."

---

### 7. **Companions and Mounts** (RA-9, RA-10)

A tamed or bonded creature and every mount belong to the character that holds them, and the owner edits the companion's sheet. The Add Companion catalog lists the creatures a character can take. There are no per-creature companion profiles. The former campaign tamed roster is retired; its creatures moved to their handlers' sheets. A player tells the Warden when a character mounts or dismounts; the app does not track riders.

**Which creatures scale:** Anomaly companions, mounts linked to an Anomaly stat block, and the combat-capable catalog mounts (Mana-Touched Wolf, Bureau Warhorse, Bureau K9 (Mastiff-class), Mountain Patrol Bear, and Pantheon Steed). Utility mounts, guild allies, and custom companions keep their saved stats.

**One scaled version:** L is the owning character's level (1–20) and PB = 2 + floor((L − 1) / 4).

- **Hit points:** L Hit Dice, each at its maximum value, with no VIT added. The die is the stat block's Hit Die (`12 (1d10 + 6)` → d10), or by size when none is authored: Tiny d4, Small d6, Medium d8, Large d10, Huge d12, Gargantuan d20. A level-up raises maximum HP without healing current HP.
- **Damage:** Every damage roll keeps its die size. The dice count is 1 at levels 1–4, 2 at 5–10, 3 at 11–16, and 4 at 17–20. Attack damage adds PB and drops the stat block's flat bonus; save-based effects roll dice only. Dice that are not damage, such as durations and recharge ranges, are unchanged.
- **Defenses:** AC = 10 + rank tier + floor((L − 1) / 4). Attack bonus = 2 + rank tier + PB. Save DC = 8 + rank tier + PB. Rank tiers are E 0, D 1, C 2, B 3, A 4, S 5; a missing rank counts as D. A linked mount uses its own catalog rank.
- **Actions:** The creature uses its stat block's traits, actions, bonus actions, reactions, and legendary actions. Lair actions stay with a wild creature's lair. A linked mount adds its own abilities; a combat-capable mount without a stat block uses its natural attacks (wolf Bite d8; warhorse and Pantheon Steed Hooves d10; bear Bite and Claws d10; the K9's authored d6 Bite).
- **Rests:** A companion rests with its character, by the character's rules. On a Short Rest its owner may spend its Hit Dice from the character's Short Rest dialog; each die heals one roll of its Hit Die, with no VIT added. On a Long Rest it regains all HP and half its Hit Dice (minimum 1), and its conditions end as the character's do. A companion that keeps its saved stats has no Hit Dice to spend; a Long Rest still restores all its HP.

**Examples:** A d10 Anomaly has 50 HP at level 5. A Mana-Touched Wolf has 40 HP and a 2d8 + 3 bite at level 5. A 1d6 claw deals 1d6 + 2 at level 1, 2d6 + 3 at level 5, 3d6 + 4 at level 11, and 4d6 + 6 at level 17.

The numbers are implemented in `src/lib/companionProgression.ts`, and `src/lib/companionScaling.ts` decides which creatures scale. The server mirrors the HP, AC, attack bonus, and save DC rules for companion combat state (`supabase/migrations/20260928100000_companion_scaling_v2.sql`) and applies companion rests and Hit Dice (`supabase/migrations/20260929100000_companion_rests_follow_character.sql`). `src/lib/__tests__/canonParity.test.ts` checks these numbers against this document, the canon locks, and the in-app sourcebook.

---

## Spell System Differences

### Three distinct ability-expression categories

Per Rift Ascendant canon (`docs/rift-ascendant-world-lore.md:213` — "Powers,
Spells, and Techniques: usable expressions of mana") and the engine types
in `src/types/compendium.ts:282/312/334`, RA has **three** distinct
ability types — they are **not** reskins of each other.

| Type | RA file | Identifier | Resource model | Casting ability |
|---|---|---|---|---|
| **Spell** | `CompendiumSpell` (`compendium.ts:282`) | `level: 0..9` (cantrip..rank-9) | Spell slot consumption (`spell_slots` table, `calculateSpellSlotsForLevel`) | Job's **spellcasting ability** via `getSpellcastingAbility(job)` |
| **Power** | `CompendiumPower` (`compendium.ts:312`) | `power_level: "Innate" \| "Cantrip" \| "Tier N"` (NOT `level: 0..9`) | Per-rest charges via `computePowerUses`; native rate 3 / long rest | Job's **primary ability** via `getJobPrimaryAbility(job)` (`powerActionFormulas.ts:9-23`) |
| **Technique** | `CompendiumTechnique` (`compendium.ts:334`) | `level_requirement: N` + `style` | `uses_per_rest_formula` (Stamina-style); no spell slots | Higher of STR / AGI modifier (per `techniqueActionFormula.ts`) |

**Shared 5e-shaped formulas:**
- Spell: `attack = PB + spellcasting_mod`, `DC = 8 + PB + spellcasting_mod` (`calculateSpellAttackBonus / calculateSpellSaveDC` in `5eCharacterCalculations.ts:196, 209`).
- Power: `attack = PB + primary_mod`, `DC = 8 + PB + primary_mod` (`resolvePowerActionFormula` in `powerActionFormulas.ts`).
- Technique: `attack = PB + max(STR_mod, AGI_mod)`, `DC = 8 + PB + max(...)` (`resolveTechniqueUseFormula`).

**Compendium counts (May 2026):** ~201 Spells, ~136 Powers, ~111 Techniques — independently authored, independently filtered (`listLearnableSpells / Powers / Techniques`), independently surfaced in `AddSpellDialog / AddPowerDialog / AddTechniqueDialog`.

> **Canon lock:** Earlier drafts of this doc claimed "Spell → Power is a
> reskin" and that Powers carry `level: 0-9`. Both contradict RA canon and
> the engine. The actual `CompendiumPower` interface (see file) declares
> `power_level: string`, `power_type`, `has_attack_roll`, `has_save` —
> none of which exist on `CompendiumSpell`.

### Essence vs Material Components

**Difference:**
- 5e: Material components (bat guano, diamond dust)
- SA: **Essence requirements** (dimensional crystals, mana cores)

**Mechanical Effect:** None - both just determine if you can cast

---

## What the Engine MUST Support

### Required Custom Mechanics

1. ✅ **System Favor** - Resource pool + die scaling
   - Implemented in `5eCharacterCalculations.ts`
   - Integrated in `characterEngine.ts`

2. ✅ **Awakening Features** - Progressive job abilities
   - Implemented in `characterEngine.ts:229-351`
   - Auto-parses from jobs compendium

3. ✅ **Job Traits** - Passive/active trait parsing
   - Implemented in `characterEngine.ts:358-462`
   - Auto-converts traits to effects

4. ✅ **Regent/Gemini System** - Earned Regent class overlays and saved Sovereign fusion
   - Implemented in `characterEngine.ts:469-662`
   - Auto-loads regent features when Warden unlocks

5. ✅ **Rank System** - Thematic for characters; sets a companion's rank tier
   - Can be displayed in UI but doesn't affect a character's own calculations

6. ✅ **Companion scaling** - One scaled version per species (RA-10)
   - Implemented in `src/lib/companionScaling.ts`

### Standard 5e Mechanics (Already Supported)

- Proficiency bonus ✅
- Ability modifiers ✅
- Saving throws ✅
- Skills ✅
- AC calculation ✅
- Initiative ✅
- Speed ✅
- Spell slots ✅
- Spell DC / attack bonus ✅
- Carrying capacity ✅
- Exhaustion ✅
- Conditions ✅

---

## Summary

| System | 5e Mechanic | SA Custom |
|--------|-------------|-----------|
| **Core d20** | ✅ Same | — |
| **Ability Scores** | ✅ Same formulas | Renamed (AGI, VIT, SENSE, PRE) |
| **Classes** | ✅ Same hit dice, progression | Renamed to Jobs, modern flavor |
| **Subclasses** | Job specialization | **Paths** belong to Jobs |
| **Regent overlays** | No direct 5e equivalent | Earned full class overlays; Gemini creates a saved Sovereign |
| **Class Features** | Standard | **Awakening Features** (System-granted) |
| **Inspiration** | Binary on/off | **System Favor** (resource pool + die) |
| **Spells, Powers, Techniques** | Distinct authored categories | Spells use slots; Powers and Techniques retain their own use rules unless Regent acquisition uses Resonance |
| **Companions and mounts** | Fixed stat blocks | Character-owned; one version scaled to the owner's level (max Hit Dice, cantrip-pace damage + PB) |
| **Setting** | Medieval fantasy | **Modern urban fantasy** |

---

## Integration Checklist for characterEngine.ts

- [x] System Favor max/die calculation
- [x] Awakening Feature parsing from job data
- [x] Job Trait effect conversion
- [x] Regent feature integration (if character has regent unlocked)
- [x] Gemini fusion stat bonuses
- [ ] Essence requirement validation (future enhancement)
- [ ] Rank display in UI (thematic only)

---

## Effect Priority System

All System Ascendant custom mechanics are integrated with the effect priority system:

| Priority | Source | Example |
|----------|--------|---------|
| 0-99 | Base stats | Base ability scores |
| 100-149 | Equipment | Armor, weapons, magic items |
| 150-159 | **Awakening Features** | Reinforced Frame, System Targeting HUD |
| 160-169 | **Job Traits** | Gate Breaker, Threat Reflex |
| 170-179 | **Regent Features** | Titanic Strength, Shadow Phase |
| 180-199 | **Gemini Fusion** | Stat bonuses, merged regent features |
| 200-299 | Features | Feats, racial abilities |
| 300-399 | Active Spells | Buff spells, concentration effects |
| 400-499 | Conditions | Stunned, frightened, exhaustion |

---

## Next Steps

1. ✅ **characterEngine.ts** - All System Ascendant mechanics integrated
2. **useComputedCharacterStats.ts** - Already fetches all data needed
3. **UI Integration** - Update character sheet to display awakening features, job traits, and regent/gemini status
4. **Database Schema** - Persist Regent unlocks, acquisition provenance, Resonance, and complete Sovereign definitions in their dedicated records.

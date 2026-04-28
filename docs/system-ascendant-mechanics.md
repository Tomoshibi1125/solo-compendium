# System Ascendant Mechanics vs D&D 5e

## Overview

**System Ascendant** is a **modern urban fantasy d20 system** inspired by Korean manhwa like *Solo Leveling*. It uses **5e mechanics as the engine** but with **thematic reskins and custom systems** for a world where dimensional gates, hunters, and the mysterious "System" replace traditional fantasy.

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
- **Critical hits** - Natural 20 = double damage dice
- **Concentration** - One spell at a time, broken by damage/incapacitation

---

## Terminology Reskin (Mechanics Identical)

| D&D 5e | System Ascendant | Notes |
|--------|------------------|-------|
| Class | **Job** | Destroyer, Mage, Esper, etc. |
| Subclass | **Path** | Specializations within jobs |
| Spell | **Power** | Thematic abilities with spell mechanics |
| Magic Item | **Relic** | Dimensional artifacts and System rewards |
| Spell Slots | **Power Slots** | Same slot progression tables |
| STR/DEX/CON/INT/WIS/CHA | **STR/AGI/VIT/INT/SENSE/PRE** | Renamed abilities, same formulas |
| Inspiration | **System Favor** | Enhanced version with multiple uses |

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

**Usage Options** (from `5eRulesEngine.ts:300`):
1. **System Boost** (1 pt) - Add favor die to d20 roll (like inspiration)
2. **System Override** (1 pt) - Reroll failed d20
3. **System Recovery** (1 pt, Level 3+) - End one condition as bonus action
4. **Death Defiance** (2 pts, Level 5+) - Drop to 1 HP instead of 0 (once/long rest)
5. **System Insight** (1 pt) - Learn creature's AC, HP %, resistances
6. **Flash Step** (1 pt, Level 5+) - Teleport 10 ft as part of movement
7. **Critical Surge** (2 pts, Level 9+) - Convert hit to crit (once/long rest)
8. **Party Link** (1 pt, Level 7+) - Telepathy + advantage on initiative for allies

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
    description: "Deal double damage to objects. Advantage on saves vs fear from gate monsters.",
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

### 4. **Regent/Gemini System** (Advanced Subclass Fusion) ✅ IMPLEMENTED

**What It Replaces:** Standard subclasses

**How It Works:**
- **Regent** = Sovereign-level subclass unlocked via quest/Warden gate (NOT automatic at level 3)
- **Gemini Protocol** = Fusion of TWO Regents for hybrid abilities (DBZ-style fusion)
- **Stat-based** - Regent type determined by highest ability score
- **Auto-integrated** - `characterEngine.ts` loads regent/gemini features when Warden unlocks

**Regent Types:**
```typescript
enum RegentType {
  STRENGTH_REGENT = 'Strength Regent',
  AGILITY_REGENT = 'Agility Regent',
  VITALITY_REGENT = 'Vitality Regent',
  INTELLIGENCE_REGENT = 'Intelligence Regent',
  SENSE_REGENT = 'Sense Regent',
  PRESENCE_REGENT = 'Presence Regent'
}
```

**Key Mechanic:**
- Regents are **NOT level-gated** (advisory only)
- Require **quest completion** or **Warden approval**
- Grant **unique features, spells, and stat bonuses**
- Can be **fused** into Gemini Sovereigns (fusion quality: Perfect/Good/Average)

**Example:**
```typescript
{
  id: 'iron_fist_regent',
  name: 'Iron Fist Regent',
  type: RegentType.STRENGTH_REGENT,
  requirements: {
    questCompleted: 'Trial of the Iron Fist',
    statThreshold: 18 // STR must be 18+
  },
  features: [
    { name: 'Titanic Strength', description: 'Double strength modifier for melee attacks' }
  ]
}
```

**Difference from 5e:**
- 5e: Subclass chosen at level 3, automatic progression
- SA: Regent is **earned**, not leveled into

**Implementation in Engine:**
```typescript
// ✅ IMPLEMENTED in characterEngine.ts:469-662
interface CharacterJob {
  job: string;
  path?: string; // Standard path (level 3 automatic)
  regent?: string; // Regent (quest-gated, Warden unlocks)
  gemini?: {
    regent1Id: string;
    regent2Id: string;
    sovereignId: string;
    fusionType: 'Perfect' | 'Good' | 'Average';
  };
  level: number;
}

function aggregateRegentFeatures(jobs: CharacterJob[]): FeatureInstance[] {
  // Loads regent data from regentGeminiSystem
  // Parses regent feature effects (AC bonuses, stat modifiers, etc.)
}

function aggregateGeminiFeatures(jobs: CharacterJob[]): FeatureInstance[] {
  // Loads both regents from Gemini fusion
  // Calculates stat bonuses based on fusion type
  // Merges features from both regents
}

function calculateGeminiStatBonuses(regent1, regent2, fusionType): StatBonuses {
  // Perfect fusion: +4 to regent stats, +2 to all stats
  // Good fusion: +3 to regent stats, +2 to all stats
  // Average fusion: +2 to regent stats, +2 to all stats
}

// Effects integrated with Priority 170 (Regent) and 180 (Gemini)
```

**Gemini Stat Bonuses:**
- **Perfect Fusion**: +4 to both regent primary stats, +2 to all other stats (+6/+2/+2/+2/+2/+2)
- **Good Fusion**: +3 to both regent primary stats, +2 to all other stats (+5/+2/+2/+2/+2/+2)
- **Average Fusion**: +2 to both regent primary stats, +2 to all other stats (+4/+2/+2/+2/+2/+2)

---

### 5. **Rank System** (Power Tiers)

**What It Is:** Korean manhwa-style power classification

**Ranks:**
- **D-Rank** - Entry-level hunters (city-tier threats)
- **C-Rank** - Experienced hunters (regional threats)
- **B-Rank** - Elite hunters (national threats)
- **A-Rank** - Top-tier hunters (continental threats)
- **S-Rank** - National level hunters (world-ending threats)

**Application:**
- **Jobs have ranks** - `rank: 'D' | 'C' | 'B' | 'A' | 'S'`
- **Powers have ranks** - Spell equivalents classified by danger
- **Relics have ranks** - Magic item power levels

**No Mechanical Effect** - Purely thematic flavor for world-building

---

### 6. **Modern Urban Setting Flavor**

**Thematic Changes** (no mechanical difference):
- **Gates** = Dimensional rifts instead of dungeons
- **Hunters** = Player characters instead of adventurers
- **Hunter Bureau** = Government guild registry instead of adventurer's guild
- **System Interface** = AR-like HUD overlay for abilities
- **Mana** = Visible energy (glowing veins, crystallized bones) instead of invisible magic
- **Smartphones, CCTV, social media** = Modern tech integrated into abilities

**Example Flavor Text:**
> "Your HUD displays [TARGET DESIGNATED]. Security cameras capture you vanishing. Your phone buzzes with [MANA ABSORBED]. Bystanders' smartphones auto-focus on your glowing veins."

---

## Spell System Differences

### Powers vs Spells

**Same Mechanics:**
- Spell slots, spell levels, concentration, ritual casting
- Spellcasting ability, spell save DC, spell attack bonus

**Thematic Reskin:**
```typescript
interface Power {
  // Standard 5e spell structure
  level: number; // 0-9
  school: string; // "Shadow", "Void", "Abyssal" (instead of "Evocation", "Necromancy")
  castingTime: string;
  range: string | { type: string; value: number; unit: string };
  components: { verbal: boolean; somatic: boolean; material: boolean | string };
  duration: string | { type: string; time?: string };
  concentration: boolean;
  ritual: boolean;

  // System Ascendant additions
  type: 'Attack' | 'Defense' | 'Utility' | 'Healing'; // Tactical classification
  rank: 'D' | 'C' | 'B' | 'A' | 'S'; // Power tier
  essenceRequirement?: string; // Replaces material components
  hunterClass?: string[]; // Job restrictions
  systemAwakening?: boolean; // Requires awakening to use
}
```

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

4. ✅ **Regent/Gemini System** - Quest-gated subclasses
   - Implemented in `characterEngine.ts:469-662`
   - Auto-loads regent features when Warden unlocks

5. ✅ **Rank System** - Thematic only, no mechanical effect
   - Can be displayed in UI but doesn't affect calculations

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
| **Subclasses** | Level 3 automatic | **Regent/Gemini** (quest-gated) |
| **Class Features** | Standard | **Awakening Features** (System-granted) |
| **Inspiration** | Binary on/off | **System Favor** (resource pool + die) |
| **Spells** | ✅ Same mechanics | Renamed to Powers, essence materials |
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
4. **Database Schema** - Add `regent` and `gemini` columns to `character_jobs` table if not present

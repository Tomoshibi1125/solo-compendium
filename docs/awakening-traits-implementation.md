# Awakening Features & Job Traits - Implementation Summary

## What Was Implemented

This implementation adds **System Ascendant custom mechanics** to the centralized character engine, allowing Awakening Features and Job Traits from the jobs compendium to automatically apply their effects to characters.

---

## Files Modified

### 1. `src/lib/characterEngine.ts`

**Added:**
- `aggregateAwakeningFeatures()` - Extracts awakening features from jobs compendium and filters by character level
- `parseAwakeningEffects()` - Automatically detects and parses mechanical effects from awakening feature descriptions
- `aggregateJobTraits()` - Extracts job traits from jobs compendium
- `parseJobTraitEffects()` - Automatically detects and parses effects from job trait descriptions
- `convertFrequencyToRecharge()` - Maps trait frequency tags to recharge types

**Updated:**
- `FeatureInstance.sourceType` - Added `'awakening'` and `'trait'` as valid source types
- `aggregateEffects()` - Now includes awakening features (Priority 150) and job traits (Priority 160)
- `buildEffectsSummary()` - Includes awakening features and job traits in the effects summary for UI display

### 2. `src/lib/effectsEngine.ts`

**Updated:**
- `EffectSource.sourceType` - Added `'awakening'` and `'trait'` to the union type

### 3. `docs/system-ascendant-mechanics.md`

**Updated:**
- Marked Awakening Features as `✅ IMPLEMENTED`
- Marked Job Traits as `✅ IMPLEMENTED`
- Added implementation details and auto-parsed effect examples
- Documented the parsing logic and priority system

---

## How It Works

### Awakening Features

**Definition:** Progressive class abilities unlocked at specific levels (1, 3, 5, 7, 11, 14, etc.) that are **passive augmentations** from "The System."

**Implementation Flow:**
1. `aggregateAwakeningFeatures()` loads the jobs compendium dynamically
2. For each character job, finds matching job data from compendium
3. Filters awakening features where `feature.level <= characterJobLevel`
4. Calls `parseAwakeningEffects()` for each feature to extract mechanical effects
5. Returns array of `FeatureInstance` objects with parsed effects

**Auto-Detected Patterns:**
```typescript
// HP increases
"HP maximum increases by 1 per Berserker level"
→ { type: 'resource', target: 'hp_max', value: 1 * jobLevel }

// AC bonuses
"+1 to AC" or "+2 to armor class"
→ { type: 'modifier', target: 'ac', value: 1 }

// Attack bonuses
"+1 to attack and damage" or "+2 to attack rolls"
→ { type: 'modifier', target: 'attack_bonus', value: 1 }

// Ability score improvements
"STR and VIT increase by 4"
→ [
  { type: 'modifier', target: 'str', value: 4 },
  { type: 'modifier', target: 'vit', value: 4 }
]

// Speed modifiers
"+10 ft speed" or "speed increases by 15 ft"
→ { type: 'modifier', target: 'speed', value: 10 }
```

**Example Awakening Feature:**
```typescript
// From Destroyer job
{
  name: "Weapon Neural Bond",
  description: "+1 to attack and damage with all proficient weapons; you cannot be disarmed. (+2 at 17th level).",
  level: 11
}

// Parsed to:
{
  id: "destroyer-awakening-11-weapon-neural-bond",
  name: "Weapon Neural Bond",
  sourceType: "awakening",
  sourceId: "destroyer",
  description: "...",
  effects: [
    { type: 'modifier', target: 'attack_bonus', value: 1, priority: 150 }
  ]
}
```

---

### Job Traits

**Definition:** Passive/active abilities that are always available from level 1, with frequency tags for limited-use abilities.

**Implementation Flow:**
1. `aggregateJobTraits()` loads the jobs compendium dynamically
2. For each character job, finds matching job data from compendium
3. All job traits are available (no level filtering)
4. Calls `parseJobTraitEffects()` for each trait to extract mechanical effects
5. Calls `convertFrequencyToRecharge()` to map frequency tags to recharge types
6. Returns array of `FeatureInstance` objects with parsed effects

**Auto-Detected Patterns:**
```typescript
// Advantage effects
"Advantage on saves against fear" or "Advantage on Stealth checks"
→ { type: 'roll_tag', target: 'advantage', value: true, condition: 'saves against fear' }

// Disadvantage effects
"Disadvantage on ability checks while in Overload"
→ { type: 'roll_tag', target: 'disadvantage', value: true, condition: 'ability checks' }
```

**Example Job Trait:**
```typescript
// From Berserker job
{
  name: "Threat Reflex",
  description: "Advantage on Agility saves against effects you can see while not blinded/deafened/incapacitated.",
  type: "passive"
}

// Parsed to:
{
  id: "berserker-trait-threat-reflex",
  name: "Threat Reflex",
  sourceType: "trait",
  sourceId: "berserker",
  description: "...",
  rechargeOn: "none",
  effects: [
    { type: 'roll_tag', target: 'advantage', value: true, condition: 'agility saves', priority: 160 }
  ]
}
```

---

## Effect Priority System

Effects are applied in priority order (lower = applied first):

| Priority Range | Source Type |
|----------------|-------------|
| 0-99 | Base stats |
| 100-149 | Equipment |
| 150-159 | **Awakening Features** ⭐ NEW |
| 160-199 | **Job Traits** ⭐ NEW |
| 200-299 | Features (feats, racial abilities) |
| 300-399 | Active spell effects |
| 400-499 | Conditions |

This ensures that awakening features and job traits apply **after equipment** but **before** active features and spells, matching the intended power curve.

---

## Integration with Character Engine

The centralized character engine now automatically:

1. **Loads awakening features and job traits** from the jobs compendium when computing character stats
2. **Parses descriptions** to extract mechanical effects using regex patterns
3. **Applies effects** in the correct priority order alongside equipment, features, and spells
4. **Displays effects** in the UI with source attribution (e.g., "Weapon Neural Bond (Destroyer)")

**Usage:**
```typescript
import { computeCharacterStats } from '@/lib/characterEngine';

const baseData: CharacterBaseData = {
  id: 'char_123',
  name: 'Jin Woo',
  level: 11,
  jobs: [
    { job: 'destroyer', level: 11, hitDie: 10 }
  ],
  abilities: { STR: 18, AGI: 14, VIT: 16, INT: 10, SENSE: 12, PRE: 8 },
  // ... other base data
};

const computed = computeCharacterStats(baseData);

// Automatically includes:
// - Awakening features for Destroyer levels 1, 5, 11
// - All Destroyer job traits
// - Parsed effects applied to stats (attack bonus, HP max, etc.)

console.log(computed.activeEffects);
// [
//   { source: { sourceType: 'awakening', sourceName: 'Weapon Neural Bond' }, target: 'attack_bonus', value: 1 },
//   { source: { sourceType: 'trait', sourceName: 'Gate Breaker' }, target: 'advantage', condition: 'saves vs fear' },
//   ...
// ]
```

---

## Graceful Degradation

Both functions handle errors gracefully:

```typescript
try {
  const { jobs: JOBS_DATABASE } = require('@/data/compendium/jobs');
  // Parse features/traits
} catch (error) {
  console.warn('Could not load from jobs compendium:', error);
  // Return empty array instead of crashing
}
```

This ensures the character engine continues to work even if:
- The jobs compendium file is missing
- The compendium structure changes
- A specific job has no awakening features or traits

---

## Testing Checklist

- [ ] **Destroyer at level 11** - Should have 4 awakening features (Reinforced Frame, System Targeting HUD, Adrenal Regulator, Weapon Neural Bond) and +1 attack bonus from Weapon Neural Bond
- [ ] **Berserker at level 14** - Should have 5 awakening features including Unstable Discharge, +1 HP per level from Mana-Dense Physiology
- [ ] **Assassin at level 7** - Should have 3 awakening features including Lethal Geometry with extra damage on advantage
- [ ] **Job traits** - All traits should be available at level 1 regardless of character level
- [ ] **Multiclass** - Awakening features should load for both jobs independently based on their individual levels
- [ ] **Effect display** - UI should show awakening features and traits in the active effects list with proper attribution

---

## Future Enhancements

### More Sophisticated Parsing

Current implementation uses regex patterns for common effect types. For more complex effects (e.g., "attacks deal +1d4 force damage below half HP"), consider:

1. **Natural language processing** for conditional effects
2. **Structured effect definitions** in compendium (instead of pure text parsing)
3. **Effect templates** for common patterns (e.g., `damageBonus`, `conditionalAdvantage`)

### Dynamic Scaling

Some awakening features scale with level (e.g., "+1d4 at 5th, +1d6 at 11th"). Future enhancement:

```typescript
function parseScalingEffect(description: string, currentLevel: number): Effect[] {
  // Detect scaling patterns like "1d4 (1d6 at 11th)"
  // Return the appropriate value based on current level
}
```

### Usage Tracking

Some awakening features have limited uses (e.g., "Once per long rest"). Future enhancement:

```typescript
interface FeatureInstance {
  // ... existing fields
  usesMax?: number;  // e.g., 1 for "once per long rest"
  usesCurrent?: number; // Decremented when used
}
```

---

## Summary

✅ **Awakening Features** - Auto-loaded from compendium, filtered by level, parsed for effects
✅ **Job Traits** - Auto-loaded from compendium, all available at level 1, parsed for effects
✅ **Effect Priority** - Awakening features at 150, job traits at 160
✅ **UI Integration** - Both show in active effects summary
✅ **Graceful Degradation** - Handles missing/malformed data without crashing

**Status:** System Ascendant custom mechanics are now fully integrated into the centralized character calculation engine. The engine automatically applies awakening features and job traits alongside equipment, features, spells, and conditions.

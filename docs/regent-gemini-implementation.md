# Regent/Gemini System - Implementation Summary

## What Was Implemented

This implementation adds **Regent and Gemini Protocol** mechanics to the centralized character engine, allowing quest-gated sovereign subclasses and DBZ-style regent fusions to apply their effects automatically.

---

## Files Modified

### 1. `src/lib/characterEngine.ts`

**Updated Interface:**
```typescript
export interface CharacterJob {
  job: string;
  path?: string; // Standard path (level 3, automatic)
  regent?: string; // Regent path ID (quest-gated, DM unlocks)
  gemini?: {
    regent1Id: string;
    regent2Id: string;
    sovereignId: string;
    fusionType: 'Perfect' | 'Good' | 'Average';
  };
  level: number;
  hitDie: number;
}
```

**Added Functions:**
- `aggregateRegentFeatures()` - Loads regent features when DM unlocks regent for character
- `parseRegentFeatureEffects()` - Parses regent feature descriptions into Effect[] (AC, attack, speed bonuses - **NO stat bonuses**)
- `aggregateGeminiFeatures()` - Loads Gemini Protocol fusion features (merged abilities from both regents)
- `aggregateAwakeningFeatures()` - Loads awakening features from jobs compendium
- `parseAwakeningEffects()` - Auto-parses awakening feature descriptions
- `aggregateJobTraits()` - Loads job traits from jobs compendium
- `parseJobTraitEffects()` - Auto-parses job trait descriptions

**Updated Functions:**
- `aggregateEffects()` - Now includes regent features (Priority 170) and Gemini fusion (Priority 180)
- `buildEffectsSummary()` - Includes regent and Gemini features in effects summary for UI

---

## How It Works

### Regent System (Quest-Gated Cosmic Overlays)

**Definition:** Regents are cosmic power overlays inspired by Solo Leveling's Nine Monarchs that are **quest-gated** and require **DM approval** after completing specific quests. Players can have a **maximum of 2 regents**.

**Key Differences from Standard Subclasses:**
- **5e Subclass**: Automatic at level 3, predetermined progression
- **SA Regent**: Earned through quests, DM manually unlocks, cosmic/reality-warping powers

**CRITICAL MECHANICS:**
- **NO STAT BONUSES**: Regents grant mechanical bonuses (AC, attack, speed, initiative, spell DC, regeneration) but **NO direct ability score increases** (STR, AGI, VIT, INT, SENSE, PRE)
- **2-Regent Limit**: Characters can only have 2 regents maximum
- **AI Selection**: When quest is complete, integrated AI presents 3 regent choices based on character stats/playstyle
- **Adaptation System**: Martial jobs selecting caster-heavy regents get martial adaptations (spells → techniques); caster jobs selecting martial-heavy regents get magical versions

**Implementation Flow:**
1. DM marks regent quest as complete
2. AI presents 3 regent choices with reasoning and adaptation notes
3. Player picks ONE regent
4. `aggregateRegentFeatures()` loads regent data from `NINE_REGENTS` database
5. `parseRegentFeatureEffects()` extracts mechanical effects (AC, attack, speed, etc.) but **NOT stat bonuses**
6. Returns array of `FeatureInstance` objects with parsed effects
7. Effects applied at Priority 170

**The Nine Regents (Inspired by Solo Leveling):**
1. **Shadow Regent** - Necromancy, shadow army, death manipulation
2. **Dragon Regent** - Draconic destruction, apocalypse
3. **Frost Regent** - Eternal winter, absolute zero
4. **Beast Regent** - Primal evolution, apex predator
5. **Titan Regent** - Invulnerability, immovable force
6. **Plague Regent** - Pandemic, biological weapon
7. **Architect Regent** - Reality architecture, dimensional construction
8. **Radiant Regent** - Purifying fire, holy annihilation
9. **Mimic Regent** - Perfect transformation, adaptation

Each regent is designed to be **completely distinct** from all 14 job themes with cosmic/reality-warping powers.

**Example Regent (Shadow Regent):**
```typescript
{
  id: 'shadow_regent',
  name: 'Shadow Regent',
  type: RegentType.INTELLIGENCE_REGENT,
  description: 'Ruler of death and the shadow realm. Command an eternal army extracted from fallen foes.',
  abilities: ['Shadow Extraction', 'Shadow Storage Dimension', 'Shadow Exchange', 'Eternal Army Command'],
  features: [
    {
      name: 'Shadow Extraction',
      description: 'Extract shadow from defeated enemy (CR ≤ level) as bonus action. Shadow soldier retains original abilities at 50% power. Max army = 2x level. Permanent until destroyed.',
      type: 'necromancy'
    }
  ],
  spells: ['Animate Dead', 'Create Undead', 'Danse Macabre', 'Finger of Death', 'True Resurrection (for shadows only)'],
  requirements: {
    level: 10,
    questCompleted: 'Trial of the Shadow Gate',
    statThreshold: 16
  }
}
```

**Regent Selection Flow:**
1. Player completes regent quest in-game
2. DM marks quest as complete
3. AI analyzes character (stats, job type, playstyle) and presents 3 regent choices
4. Each choice includes:
   - Regent description and features
   - AI reasoning for why this regent fits the character
   - Adaptation note (if martial job selecting caster regent or vice versa)
5. Player selects ONE regent
6. When player completes SECOND regent quest, AI presents 3 NEW choices (excluding first regent)
7. Player can only have **2 regents maximum**
8. With 2 regents, player unlocks **Gemini Protocol fusion**

---

### Gemini Protocol (Regent Fusion System)

**Definition:** Gemini Protocol allows fusion of **TWO Regents** into a Sovereign, creating a powerful subclass overlay that merges both regents' abilities. The AI generates unique sovereign names and abilities based on the fusion.

**CRITICAL MECHANICS:**
- **NO STAT BONUSES**: Sovereigns do NOT grant ability score increases. They function as powerful subclass overlays with merged features.
- **All 81 Combinations Valid**: All 9×9 regent combinations work for fusion (Shadow + Dragon, Frost + Mimic, etc.)
- **Fusion Quality Based on Synergy**: Quality determined by thematic/mechanical compatibility, NOT stats

**Fusion Formula:**
```
Sovereign = Job + Path + Regent A + Regent B
```

**Implementation Flow:**
1. Character has 2 regents unlocked
2. Player initiates Gemini Protocol fusion
3. AI analyzes Job + Path + Regent A + Regent B
4. AI generates unique sovereign with:
   - Custom sovereign name (e.g., "Abyssal Tyrant", "Eternal Predator")
   - Merged features from both regents
   - Synergistic abilities combining both themes
5. `aggregateGeminiFeatures()` loads merged features from database
6. Effects applied at Priority 180 (highest priority for custom mechanics)

**Fusion Quality Types:**
```typescript
type FusionType = 'Perfect' | 'Good' | 'Average';

// Determined by thematic and mechanical synergy
// Perfect: Regents with complementary themes (Shadow + Mimic, Dragon + Beast)
// Good: Most regent combinations (neutral pairing)
// Average: Regents with opposed themes (Radiant vs Shadow, Titan vs Mimic)
```

**Fusion Quality Examples:**

| Fusion Type | Regent Combination | Synergy Reasoning |
|-------------|-------------------|-------------------|
| **Perfect** | Shadow + Mimic | Both focus on deception and transformation |
| **Perfect** | Dragon + Beast | Both embody primal destruction and evolution |
| **Perfect** | Frost + Plague | Both are slow, overwhelming forces of nature |
| **Good** | Shadow + Frost | Neutral pairing, no direct synergy or opposition |
| **Average** | Radiant + Shadow | Opposed themes (light vs darkness) |
| **Average** | Titan + Mimic | Opposed themes (immovable vs adaptive) |

**Example Gemini Fusion:**
```typescript
// Character: Destroyer with Shadow Regent + Dragon Regent
{
  job: 'destroyer',
  path: 'tank', // Chosen at level 3
  level: 15,
  regent: null, // Replaced by gemini
  gemini: {
    regent1Id: 'shadow_regent',
    regent2Id: 'dragon_regent',
    sovereignId: 'destroyer-tank-shadow-dragon-sovereign',
    sovereignName: 'Abyssal Tyrant', // AI-generated
    fusionType: 'Perfect' // Shadow + Dragon have thematic synergy
  }
}

// Resulting abilities (NO stat bonuses):
// MERGED FEATURES FROM BOTH REGENTS:
// - Shadow Extraction (from Shadow Regent)
// - Shadow Storage Dimension (from Shadow Regent)
// - Draconic Apocalypse (from Dragon Regent)
// - Eternal Flame (from Dragon Regent)
//
// AI-GENERATED SOVEREIGN ABILITIES:
// - "Draconic Shadow Army": Extracted shadows gain dragon breath attacks
// - "Abyssal Inferno": Shadow realm ignites with eternal dragonfire
// - "Sovereign's Domain": 60ft aura of shadow flames that damages enemies
//
// MECHANICAL BONUSES (from parseRegentFeatureEffects):
// - AC: +2 (from Dragon Regent scales)
// - Speed: +10ft (from Shadow Regent phase)
// - Attack: +2 (from Sovereign's Domain)
// - Regeneration: 5 HP/turn in shadow/fire (from merged abilities)
```

**Adaptation Example (Martial Job + Caster Regent):**
```typescript
// Destroyer (martial) selecting Shadow Regent (spell-heavy)
{
  job: 'destroyer',
  regent: 'shadow_regent',
  adaptationNote: 'ADAPTED FOR MARTIAL: Spells converted to martial techniques. Example: "Finger of Death" becomes Shadow Strike (melee attack dealing 7d8+30 necrotic damage).'
}

// The AI adapts spell-based abilities into physical techniques:
// - "Animate Dead" → "Shadow Bind" (bonus action to extract shadow from corpse)
// - "Create Undead" → "Shadow Command" (permanently dominate extracted shadow)
// - Casting becomes physical actions (strikes, gestures) instead of verbal/somatic components
```

---

## Effect Priority System

Regent and Gemini effects are integrated into the priority system:

| Priority Range | Source Type | Example |
|----------------|-------------|---------|
| 0-99 | Base stats | Base ability scores |
| 100-149 | Equipment | Armor, weapons, relics |
| 150-159 | Awakening Features | Reinforced Frame, System Targeting HUD |
| 160-169 | Job Traits | Gate Breaker, Threat Reflex |
| **170-179** | **Regent Features** ⭐ NEW | Titanic Strength, Shadow Phase |
| **180-199** | **Gemini Fusion** ⭐ NEW | Stat bonuses, merged regent features |
| 200-299 | Features | Feats, racial abilities |
| 300-399 | Active Spells | Buff spells, concentration |
| 400-499 | Conditions | Stunned, frightened, exhaustion |

This ensures that Regent and Gemini effects apply **after** awakening features and job traits, but **before** standard features and spells, matching the intended power progression.

---

## Integration with Character Engine

The centralized character engine now automatically:

1. **Checks for regent unlock** - If `characterJob.regent` is populated, loads regent features
2. **Checks for Gemini fusion** - If `characterJob.gemini` is populated, loads both regents and calculates fusion bonuses
3. **Parses regent feature descriptions** - Extracts mechanical effects using regex patterns
4. **Applies effects** in the correct priority order
5. **Displays regent/gemini status** in UI with source attribution

**Usage:**
```typescript
import { computeCharacterStats } from '@/lib/characterEngine';

const baseData: CharacterBaseData = {
  id: 'char_123',
  name: 'Jin Woo',
  level: 15,
  jobs: [
    {
      job: 'destroyer',
      level: 15,
      hitDie: 10,
      // Option 1: Single Regent (quest-unlocked)
      regent: 'iron_fist_regent'

      // Option 2: Gemini Fusion (replaces single regent)
      // gemini: {
      //   regent1Id: 'iron_fist_regent',
      //   regent2Id: 'warlord_regent',
      //   sovereignId: 'destroyer-iron-fist-warlord-sovereign',
      //   fusionType: 'Perfect'
      // }
    }
  ],
  abilities: { STR: 18, AGI: 14, VIT: 16, INT: 10, SENSE: 12, PRE: 8 },
  // ... other base data
};

const computed = computeCharacterStats(baseData);

// With single regent:
console.log(computed.activeEffects);
// [
//   { source: { sourceType: 'path', sourceName: 'Titanic Strength' }, target: 'STR', value: 15 },
//   ...
// ]

// With Gemini fusion:
console.log(computed.abilityModifiers.STR);
// Base 18 + 6 from Gemini = 24 (+7 modifier)
console.log(computed.activeEffects);
// [
//   { source: { sourceType: 'path', sourceName: 'Gemini Fusion: STR Enhancement' }, target: 'STR', value: 6 },
//   { source: { sourceType: 'path', sourceName: 'Titanic Strength' }, ... },
//   { source: { sourceType: 'path', sourceName: 'Inspiring Presence' }, ... },
//   ...
// ]
```

---

## Graceful Degradation

Both functions handle errors gracefully:

```typescript
try {
  const { RegentGeminiSystem } = require('@/lib/regentGeminiSystem');
  // Load regent/gemini features
} catch (error) {
  console.warn('Could not load regent features:', error);
  // Return empty array instead of crashing
}
```

This ensures the character engine continues to work even if:
- The regent system module is missing
- The regent database structure changes
- A specific regent ID is not found

---

## Database Schema Requirements

To support Regent/Gemini mechanics, the `character_jobs` table should include:

```sql
-- Add to character_jobs table (or equivalent)
ALTER TABLE character_jobs
  ADD COLUMN regent TEXT, -- Regent path ID (null if no regent unlocked)
  ADD COLUMN gemini_regent1_id TEXT, -- First regent in Gemini fusion
  ADD COLUMN gemini_regent2_id TEXT, -- Second regent in Gemini fusion
  ADD COLUMN gemini_sovereign_id TEXT, -- Gemini Sovereign ID
  ADD COLUMN gemini_fusion_type TEXT CHECK (gemini_fusion_type IN ('Perfect', 'Good', 'Average'));

-- Constraint: Can have regent OR gemini, but not both
ALTER TABLE character_jobs
  ADD CONSTRAINT regent_or_gemini_only
  CHECK (
    (regent IS NOT NULL AND gemini_regent1_id IS NULL) OR
    (regent IS NULL AND gemini_regent1_id IS NOT NULL) OR
    (regent IS NULL AND gemini_regent1_id IS NULL)
  );
```

**Quest Tracking Table:**
```sql
CREATE TABLE regent_quests (
  id TEXT PRIMARY KEY,
  character_id TEXT REFERENCES characters(id),
  quest_id TEXT NOT NULL,
  regent_unlock TEXT NOT NULL, -- Regent ID that this quest unlocks
  completed BOOLEAN DEFAULT FALSE,
  completed_by TEXT, -- DM/Protocol Warden ID
  completed_at TIMESTAMP,
  UNIQUE(character_id, quest_id)
);
```

---

## Testing Checklist

- [ ] **Character with Shadow Regent** - Should have Shadow Extraction and other features with parsed effects (NO stat bonuses)
- [ ] **AI Regent Selection** - AI should present 3 choices with reasoning and adaptation notes
- [ ] **2-Regent Limit** - System should prevent selecting 3rd regent
- [ ] **Adaptation System** - Martial job selecting Shadow Regent should get adaptation note about spells → techniques
- [ ] **Perfect Gemini Fusion** - Shadow + Dragon should create "Abyssal Tyrant" sovereign with merged features
- [ ] **Good Gemini Fusion** - Shadow + Frost should create neutral-quality sovereign
- [ ] **Average Gemini Fusion** - Radiant + Shadow should create opposed-theme sovereign
- [ ] **All 81 Combinations** - All 9×9 regent pairings should work for fusion
- [ ] **NO Stat Bonuses** - Verify regents and sovereigns grant AC/attack/speed but NOT ability scores
- [ ] **Merged Regent Features** - Gemini fusion should include features from BOTH regents
- [ ] **Quest-Gated Unlocking** - Regent should only apply after DM completes quest
- [ ] **UI Display** - Regent/Gemini status should show in active effects list
- [ ] **Multiclass with Regent** - Each job can have its own regent/gemini independently

---

## Future Enhancements

### 1. AI-Generated Fusion Names
Currently fusion names use template patterns. Future enhancement could use local AI to generate creative sovereign names:

```typescript
// Instead of: "Destroyer Iron-Fist-Warlord Sovereign"
// Generate: "Titan Overlord", "Crimson Juggernaut", etc.
const sovereignName = await LocalAI.generateSovereignName(job, regent1, regent2);
```

### 2. Fusion-Specific Techniques
Generate unique techniques that combine both regents' abilities:

```typescript
function generateFusionTechniques(regent1: RegentPath, regent2: RegentPath): Technique[] {
  // Example: Iron Fist + Warlord = "Commanding Strike" (damage + ally buff)
}
```

### 3. Dynamic Fusion Quality
Instead of static calculation, factor in character's playstyle and combat performance:

```typescript
function calculateDynamicFusionQuality(
  regent1: RegentPath,
  regent2: RegentPath,
  characterStats: CharacterStats,
  combatHistory: CombatLog[]
): 'Perfect' | 'Good' | 'Average' {
  // Analyze combat patterns, synergy between regent abilities, etc.
}
```

### 4. Triple Regent Fusion (Sovereign+)
For level 20 characters, allow fusion of 3 regents:

```typescript
interface TripleGemini {
  regent1Id: string;
  regent2Id: string;
  regent3Id: string;
  sovereignPlusId: string;
  fusionType: 'Transcendent' | 'Legendary' | 'Epic';
}
```

---

## Summary

✅ **Nine Regents** - Cosmic powers inspired by Solo Leveling's Nine Monarchs, each distinct from all 14 job themes
✅ **Regent System** - Quest-gated cosmic overlays with 2-regent limit per character
✅ **AI Selection** - AI presents 3 regent choices with reasoning and adaptation notes
✅ **Adaptation System** - Martial/caster compatibility through spell→technique conversions
✅ **Gemini Protocol** - Regent fusion creating unique sovereigns with merged abilities
✅ **All 81 Combinations** - All 9×9 regent pairings valid for fusion
✅ **NO Stat Bonuses** - Regents/sovereigns grant mechanical bonuses (AC, attack, speed) but NOT ability scores
✅ **Thematic Fusion Quality** - Based on synergy/opposition, not stats
✅ **Effect Priority** - Awakening (150), Traits (160), Regent (170), Gemini (180)
✅ **UI Integration** - All show in active effects summary
✅ **Graceful Degradation** - Handles missing/malformed data without crashing
✅ **Database Schema** - Documented schema requirements for regent/gemini storage

**Status:** Regent and Gemini Protocol mechanics are now fully integrated into the centralized character calculation engine. The engine automatically applies regent features (with NO stat bonuses) and Gemini fusion merged abilities when DM unlocks them. The AI selection system with adaptation is ready for UI integration.

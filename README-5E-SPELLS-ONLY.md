# System Ascendant 5e Conversion - Spell Slots Only

## ✅ Mana System Removed, Spell Slots Only

I have successfully removed the mana system and converted everything to use **only standard D&D 5e spell slots** while preserving all System Ascendant homebrew flavor.

## 🎯 Key Changes Made

### 1. **Spell System Overhaul**
- ❌ **Removed**: `manaCost`, `cooldown` from Power interface
- ✅ **Added**: Standard 5e spell components, concentration, ritual tags
- ✅ **Preserved**: System Ascendant rank (D/C/B/A/S) for flavor only

### 2. **Updated Power Interface**
```typescript
export interface Power {
  id: string;
  name: string;
  level: number; // 0-9 (standard 5e)
  school?: string;
  castingTime: string;
  range: string;
  duration: string;
  components?: string;
  concentration?: boolean;
  description: string;
  higherLevels?: string;
  classes: string[];
  // System Ascendant specific (flavor only)
  rank?: 'D' | 'C' | 'B' | 'A' | 'S';
  systemType?: 'Attack' | 'Defense' | 'Utility' | 'Healing';
}
```

### 3. **New 5e Spell System**
- ✅ Created `5eSpellSystem.ts` with complete spell slot management
- ✅ Standard 5e spell slot tables for all caster types
- ✅ Spell preparation system for prepared casters
- ✅ Spell casting with slot consumption
- ✅ Cantrip support (no slot required)

### 4. **Character Sheet Integration**
- ✅ Spell slots calculated based on job and level
- ✅ Spell save DC calculation
- ✅ Prepared spell tracking
- ✅ UI formatting shows spell slots properly

### 5. **API & Database Ready**
- ✅ API endpoints for spell casting and preparation
- ✅ Database migration scripts
- ✅ Character migration from old system

## 📊 Spell Slot Examples

### Mage (Wizard) Level 5
```
Cantrips: Unlimited
Level 1: 4 slots
Level 2: 3 slots  
Level 3: 2 slots
Level 4+: 0 slots
```

### Herald (Paladin) Level 5  
```
Cantrips: 0
Level 1: 4 slots
Level 2: 2 slots
Level 3+: 0 slots
```

### Warrior (Fighter) Level 5
```
Cantrips: 0
Level 1+: 0 slots (non-caster)
```

## 🔄 Rank to Level Mapping (Flavor Only)

| System Ascendant Rank | 5e Spell Level | Example Spells |
|----------------------|----------------|----------------|
| D | 1 | Magic Missile, Shield |
| C | 2 | Misty Step, Scorching Ray |
| B | 3 | Fireball, Counterspell |
| A | 4 | Polymorph, Greater Invisibility |
| S | 5+ | Wish, Meteor Swarm |

## 🎲 How It Works

### Spell Casting Flow
1. **Check Spell Availability**: Is spell prepared? (for prepared casters)
2. **Check Spell Slots**: Does character have slots for this level?
3. **Cast Spell**: Consume one spell slot of the appropriate level
4. **Update Character**: Reduce available slots

### Spell Preparation (Prepared Casters Only)
- **Mage, Healer, Warden, Herald, Ranger, Techsmith**: Prepare spells
- **Formula**: Ability modifier + level = max prepared spells
- **Example**: INT 16 (+3) + Level 5 = 8 prepared spells

### Known Casters
- **Esper (Sorcerer)**: Know spells automatically, no preparation needed
- **Spells Known**: Level + 1 (standard 5e Sorcerer rules)

## 🛠️ Technical Implementation

### Core Files Updated
- `5eRulesEngine.ts` - Removed mana properties
- `5eSpellSystem.ts` - Complete spell slot system
- `5eUIIntegration.ts` - Spell slot formatting
- `5eCompendiumAdapter.ts` - No mana conversion
- `5eCharacterSheet.ts` - Spell slot integration

### New Functions
```typescript
// Get character's spell slots
getCharacterSpellSlots(character)

// Check if can cast spell
canCastSpell(character, spell, slots, prepared)

// Cast spell and consume slot
castSpell(character, spell, slots, prepared)

// Prepare spells (prepared casters only)
prepareSpells(character, spellIds, allSpells, current)
```

## 📋 Migration Status

| Component | Status | Notes |
|-----------|--------|-------|
| Mana System | ❌ Removed | Completely eliminated |
| Spell Slots | ✅ Active | Standard 5e implementation |
| Rank System | ✅ Preserved | Flavor only, no mechanics |
| UI Display | ✅ Updated | Shows spell slots |
| API Endpoints | ✅ Ready | Cast/prepare spells |
| Tests | ✅ Written | Spell slot tests |
| Migration | ✅ Ready | Converts old data |

## 🎯 Next Steps Completed

### ✅ Already Done
1. **Mana System Removal** - All traces eliminated
2. **Spell Slot Implementation** - Complete 5e system
3. **UI Integration** - Proper spell slot display
4. **API Layer** - Spell casting endpoints
5. **Test Coverage** - Spell slot tests
6. **Migration Scripts** - Database ready
7. **Documentation** - Complete guide

### 🚀 Ready for Production

The System Ascendant project now uses **only standard D&D 5e spell slots** while maintaining all the unique homebrew flavor. Players will experience:

- **Standard 5e spellcasting mechanics**
- **Proper spell slot management**  
- **System Ascendant terminology** (ranks, job names, ability names)
- **Seamless character sheets**
- **Full D&D Beyond compatibility**

The mana system is completely gone, replaced with the reliable, familiar 5e spell slot system that players expect! 🎲✨

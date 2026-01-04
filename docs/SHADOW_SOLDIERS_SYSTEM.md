# Shadow Soldiers System - Complete Implementation Guide

## Overview

The Shadow Soldiers system is a comprehensive implementation for managing the Shadow Monarch's army in Solo Leveling 5e. This system includes full stat blocks, summoning mechanics, character integration, and DM tools.

## Features Implemented

### 1. Database Schema

**Migration Files:**
- `20260108000000_add_shadow_soldiers.sql` - Main shadow soldiers tables and data
- `20260108000001_add_shadow_army_tracking.sql` - Character shadow army tracking

**Tables Created:**
- `compendium_shadow_soldiers` - Main shadow soldier entries
- `compendium_shadow_soldier_traits` - Shadow traits
- `compendium_shadow_soldier_actions` - Shadow actions
- `compendium_shadow_soldier_abilities` - Special abilities
- `character_shadow_army` - Character's summoned shadows

**Character Integration:**
- `characters.shadow_energy_current` - Current shadow energy
- `characters.shadow_energy_max` - Maximum shadow energy

### 2. Shadow Soldier Roster

**Tier 1 - Basic Shadows:**
- Shadow Soldier (CR 1/4) - Basic undead soldier

**Tier 2 - Elite Shadows:**
- Shadow Knight (CR 3) - Elite warrior with shadow armor

**Tier 3 - High Shadows:**
- Shadow Marshal (CR 5) - Tactical commander

**Tier 4 - Named Shadows:**
- Igris (CR 8) - Master swordsman, Shadow Monarch's right hand
- Beru (CR 9) - Massive ant-like shadow with flight
- Tank (CR 8) - Defensive powerhouse

**Tier 5 - Legendary Shadows:**
- Kaisel (CR 12) - Shadow Dragon with legendary actions

### 3. Compendium Integration

**Components:**
- `ShadowSoldiersDetail.tsx` - Full detail page with stat blocks
- ARISE animation - Summoning animation with CSS keyframes
- Integration into `CompendiumDetail.tsx` routing
- Added to `Compendium.tsx` browsing page

**Features:**
- Full stat blocks (AC, HP, Speed, CR, Gate Rank)
- Ability scores with modifiers
- Traits, actions, and special abilities
- Legendary actions for high-tier shadows
- Summoning lore with ARISE animation trigger
- Visual indicators (tier badges, named status, elite status)

### 4. Character Sheet Integration

**ShadowArmyManager Component:**
- Track shadow energy resource
- Summon shadow soldiers
- Manage active shadows
- Track shadow HP
- Dismiss shadows
- View shadow stats

**Features:**
- Shadow energy display in resources section
- Summon dialog with shadow selection
- Active shadows list with HP tracking
- Dismissed shadows archive
- Links to compendium entries

### 5. Encounter Builder Integration

**Features:**
- Tabs for Monsters and Shadow Soldiers
- Add shadow soldiers to encounters
- Shadow soldiers included in XP calculations
- Visual distinction (purple theme)
- Tier and status badges
- Shadow energy cost display

### 6. Shadow Energy System

**Scaling by Level:**
- Level 1-4: 10 max shadow energy
- Level 5-8: 25 max shadow energy
- Level 9-12: 50 max shadow energy
- Level 13-16: 100 max shadow energy
- Level 17-20: 200 max shadow energy

**Shadow Energy Costs:**
- Shadow Soldier: 10 SE
- Shadow Knight: 50 SE
- Shadow Marshal: 100 SE
- Igris: 200 SE
- Beru: 250 SE
- Tank: 200 SE
- Kaisel: 500 SE

### 7. ARISE Animation

**CSS Animations:**
- `arise-text` - Large "ARISE" text with gradient
- `arise-shadow-effect` - Expanding shadow energy burst
- Responsive sizing for mobile

**Trigger:**
- "Witness the Summoning" button on detail pages
- 3-second animation duration
- Full-screen overlay

### 8. Enhanced Filtering

**Shadow Soldier Filters:**
- Filter by tier (1-5)
- Filter by named status
- Filter by elite status
- Combined with existing filters (CR, Gate Rank, etc.)

## Usage Guide

### For Players

1. **Viewing Shadow Soldiers:**
   - Navigate to Compendium → Shadow Soldiers
   - Click any shadow to view full stat block
   - Click "Witness the Summoning" to see ARISE animation

2. **Managing Shadow Army:**
   - Open character sheet
   - Scroll to Shadow Army section (if character has shadow energy)
   - Click "Summon Shadow" to add shadows
   - Track HP and dismiss as needed

3. **Shadow Energy:**
   - Shadow energy displayed in Resources section
   - Automatically scales with level
   - Consumed when summoning shadows

### For DMs

1. **Encounter Building:**
   - Open Encounter Builder
   - Switch to "Shadow Soldiers" tab
   - Add shadows to encounters
   - Shadows included in XP calculations

2. **Shadow Stats:**
   - All shadows have full D&D 5e stat blocks
   - Use in encounters like any monster
   - Named shadows have legendary actions

## Technical Details

### Database Functions

**Shadow Energy Calculation:**
```sql
calculate_shadow_energy_max(character_level INTEGER)
```
Returns max shadow energy based on character level.

### Component Structure

```
src/
├── components/
│   ├── character/
│   │   └── ShadowArmyManager.tsx
│   └── compendium/
│       └── ShadowSoldiersDetail.tsx
├── pages/
│   ├── compendium/
│   │   └── CompendiumDetail.tsx (updated)
│   ├── Compendium.tsx (updated)
│   ├── CharacterSheet.tsx (updated)
│   └── dm-tools/
│       └── EncounterBuilder.tsx (updated)
└── index.css (ARISE animations)
```

### Type Definitions

All shadow soldier types are integrated into existing type system:
- `EntryType` includes `'shadow-soldiers'`
- `CompendiumEntry` interface updated
- Database types auto-generated from Supabase

## Future Enhancements

Potential additions:
- Shadow soldier evolution/upgrades
- Shadow synergies (combos)
- Shadow soldier templates
- Initiative tracker integration
- Shadow soldier art/portraits
- Print/export stat blocks
- Shadow soldier comparison tool
- Quick reference cards

## Migration Notes

1. Run migrations in order:
   - `20260108000000_add_shadow_soldiers.sql`
   - `20260108000001_add_shadow_army_tracking.sql`

2. Update character shadow energy:
   ```sql
   UPDATE characters
   SET shadow_energy_max = calculate_shadow_energy_max(level)
   WHERE shadow_energy_max IS NULL;
   ```

3. Verify RLS policies are active for `character_shadow_army` table

## Support

For issues or questions:
- Check component files for implementation details
- Review database schema in migration files
- See type definitions in `src/types/solo-leveling.ts`


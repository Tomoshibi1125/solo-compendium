# Enhancement Plan: D&D Beyond Parity

This document outlines the implementation plan for achieving feature parity with D&D Beyond.

## Phase 6: Equipment & Powers Management

### 6.1 Equipment Management UI

**Files to Create:**
- `src/components/character/EquipmentList.tsx` - Equipment inventory display
- `src/components/character/EquipmentItem.tsx` - Individual equipment item card
- `src/components/character/AddEquipmentDialog.tsx` - Add equipment from compendium
- `src/pages/CharacterEquipment.tsx` - Full equipment management page (optional)

**Files to Modify:**
- `src/pages/CharacterSheet.tsx` - Add equipment section
- `src/hooks/useCharacters.ts` - Add equipment CRUD operations

**Features:**
- Display equipment list with categories (weapons, armor, relics, consumables, gear)
- Add equipment from compendium search
- Remove equipment
- Toggle equipped status
- Toggle attunement (with 3-item limit)
- Display equipment properties
- Weight and value tracking

**Database Queries:**
```typescript
// Fetch equipment
const { data } = await supabase
  .from('character_equipment')
  .select('*')
  .eq('character_id', characterId)
  .order('item_type', { ascending: true });

// Add equipment
await supabase
  .from('character_equipment')
  .insert({
    character_id: characterId,
    name: equipment.name,
    item_type: equipment.type,
    // ... other fields
  });

// Update equipment (equipped, attuned)
await supabase
  .from('character_equipment')
  .update({ is_equipped: true, is_attuned: true })
  .eq('id', equipmentId);
```

---

### 6.2 Equipment Modifiers System

**Files to Create:**
- `src/lib/equipmentModifiers.ts` - Equipment modifier calculation
- `src/lib/modifierParser.ts` - Parse equipment properties into modifiers

**Files to Modify:**
- `src/lib/characterCalculations.ts` - Apply equipment modifiers
- `src/pages/CharacterSheet.tsx` - Recalculate stats when equipment changes

**Features:**
- Parse equipment properties (e.g., "+1 to attack and damage", "AC 15")
- Apply AC modifiers from armor
- Apply attack/damage modifiers from weapons
- Apply stat bonuses from relics
- Modifier stacking rules
- Real-time stat updates

**Implementation:**
```typescript
// Parse equipment properties
function parseModifiers(properties: string[]): Modifiers {
  const modifiers: Modifiers = {
    ac: 0,
    attack: 0,
    damage: 0,
    str: 0,
    agi: 0,
    // ... other stats
  };

  properties.forEach(prop => {
    // Parse "+1 to attack and damage"
    const attackMatch = prop.match(/\+(\d+)\s+to\s+attack/i);
    if (attackMatch) modifiers.attack += parseInt(attackMatch[1]);

    // Parse "AC 15" or "+2 AC"
    const acMatch = prop.match(/(?:AC\s+(\d+)|(\+?\d+)\s+AC)/i);
    if (acMatch) {
      const value = parseInt(acMatch[1] || acMatch[2]);
      if (prop.includes('AC') && !prop.includes('+')) {
        modifiers.ac = value; // Set AC
      } else {
        modifiers.ac += value; // Add to AC
      }
    }
  });

  return modifiers;
}

// Apply modifiers to character stats
function applyEquipmentModifiers(
  baseStats: CalculatedStats,
  equipment: Equipment[]
): CalculatedStats {
  const equipped = equipment.filter(e => e.is_equipped && (!e.requires_attunement || e.is_attuned));
  const modifiers = equipped.reduce((acc, item) => {
    const itemMods = parseModifiers(item.properties || []);
    return combineModifiers(acc, itemMods);
  }, {});

  return {
    ...baseStats,
    armorClass: baseStats.armorClass + modifiers.ac,
    // ... apply other modifiers
  };
}
```

---

### 6.3 Powers/Spells Management

**Files to Create:**
- `src/components/character/PowersList.tsx` - Powers display
- `src/components/character/PowerCard.tsx` - Individual power card
- `src/components/character/AddPowerDialog.tsx` - Add power from compendium
- `src/components/character/ConcentrationTracker.tsx` - Track concentration

**Files to Modify:**
- `src/pages/CharacterSheet.tsx` - Add powers section
- `src/hooks/useCharacters.ts` - Add powers CRUD operations

**Features:**
- Display powers list with filters (level, source, prepared)
- Add powers from compendium
- Prepare/unprepare powers
- Track concentration
- Power detail view
- Usage tracking (if applicable)

**Database Queries:**
```typescript
// Fetch powers
const { data } = await supabase
  .from('character_powers')
  .select('*')
  .eq('character_id', characterId)
  .order('power_level', { ascending: true });

// Toggle prepared
await supabase
  .from('character_powers')
  .update({ is_prepared: !power.is_prepared })
  .eq('id', powerId);
```

---

### 6.4 Skills Full Implementation

**Files to Create:**
- `src/lib/skills.ts` - Skill definitions and calculations
- `src/components/character/SkillsList.tsx` - Skills display

**Files to Modify:**
- `src/lib/characterCalculations.ts` - Complete skills calculation
- `src/pages/CharacterSheet.tsx` - Display skills

**Features:**
- Full skill list with ability associations
- Skill proficiency/expertise calculation
- Skill modifiers display
- Passive skill values
- Skill check roll buttons

**Implementation:**
```typescript
// Skill definitions
export const SKILLS = {
  'Athletics': { ability: 'STR' },
  'Acrobatics': { ability: 'AGI' },
  'Sleight of Hand': { ability: 'AGI' },
  'Stealth': { ability: 'AGI' },
  'Investigation': { ability: 'INT' },
  'History': { ability: 'INT' },
  // ... all skills
};

// Calculate skill modifier
function calculateSkillModifier(
  skill: string,
  abilities: Record<AbilityScore, number>,
  proficiencies: string[],
  expertise: string[],
  proficiencyBonus: number
): number {
  const skillDef = SKILLS[skill];
  if (!skillDef) return 0;

  const abilityMod = getAbilityModifier(abilities[skillDef.ability]);
  let modifier = abilityMod;

  if (expertise.includes(skill)) {
    modifier += proficiencyBonus * 2;
  } else if (proficiencies.includes(skill)) {
    modifier += proficiencyBonus;
  }

  return modifier;
}
```

---

## Phase 7: Action System

### 7.1 Action Cards

**Files to Create:**
- `src/components/character/ActionCard.tsx` - Reusable action card component
- `src/components/character/AttackCard.tsx` - Weapon attack card
- `src/components/character/PowerActionCard.tsx` - Power/spell action card
- `src/components/character/FeatureActionCard.tsx` - Feature action card

**Files to Modify:**
- `src/pages/CharacterSheet.tsx` - Add actions section
- `src/pages/DiceRoller.tsx` - Integrate with action cards

**Features:**
- Display actions (attacks, powers, features)
- Roll buttons for attacks (to-hit and damage)
- Roll buttons for skill checks
- Action type indicators (action, bonus, reaction)
- Quick action buttons

**Implementation:**
```typescript
// Action card component
interface ActionCardProps {
  name: string;
  type: 'action' | 'bonus-action' | 'reaction';
  description: string;
  onRoll?: (rollType: 'attack' | 'damage' | 'check') => void;
  attackBonus?: number;
  damage?: string;
}

export function ActionCard({ name, type, description, onRoll, attackBonus, damage }: ActionCardProps) {
  return (
    <SystemWindow title={name.toUpperCase()}>
      <Badge>{type}</Badge>
      <p>{description}</p>
      {attackBonus !== undefined && (
        <div className="flex gap-2">
          <Button onClick={() => onRoll?.('attack')}>
            Attack: {formatModifier(attackBonus)}
          </Button>
          {damage && (
            <Button onClick={() => onRoll?.('damage')}>
              Damage: {damage}
            </Button>
          )}
        </div>
      )}
    </SystemWindow>
  );
}
```

---

### 7.2 Attack System

**Files to Create:**
- `src/lib/attackCalculations.ts` - Attack and damage calculations
- `src/components/character/WeaponAttack.tsx` - Weapon attack component

**Features:**
- Calculate attack bonus (ability mod + proficiency + equipment)
- Calculate damage (ability mod + equipment)
- Roll integration
- Critical hit handling
- Multiple attack support

---

## Phase 8: Export & Polish

### 8.1 Character Export

**Files to Create:**
- `src/lib/export/pdf.ts` - PDF generation (using jsPDF or similar)
- `src/lib/export/json.ts` - JSON export
- `src/components/character/ExportDialog.tsx` - Export options

**Features:**
- PDF character sheet export
- JSON backup export
- Print-friendly view
- Shareable read-only links

---

### 8.2 Portrait Upload

**Files to Create:**
- `src/components/character/PortraitUpload.tsx` - Image upload component
- `src/lib/storage.ts` - Supabase Storage helpers

**Features:**
- Image upload to Supabase Storage
- Image cropping/resizing
- Portrait display

---

## Implementation Notes

### Database Considerations
- All necessary tables exist
- RLS policies are in place
- Indexes may need optimization for equipment/powers queries

### Performance Considerations
- Virtual scrolling for large equipment/powers lists
- Lazy loading for equipment details
- Memoization for modifier calculations

### Testing
- Unit tests for modifier parsing
- Integration tests for equipment management
- E2E tests for action cards

---

## Estimated Timeline

- **Phase 6**: 2-3 weeks (Equipment & Powers)
- **Phase 7**: 1-2 weeks (Action System)
- **Phase 8**: 1 week (Export & Polish)

**Total**: 4-6 weeks for full D&D Beyond parity

---

## Success Criteria

- [ ] Users can manage equipment (add, remove, equip, attune)
- [ ] Equipment modifiers automatically apply to stats
- [ ] Users can manage powers (add, prepare, track)
- [ ] Skills are fully calculated and displayed
- [ ] Action cards with roll buttons work
- [ ] Character export (PDF/JSON) works
- [ ] All features work on mobile devices


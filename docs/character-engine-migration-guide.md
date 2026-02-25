# Character Engine Migration Guide

## Overview

The new **centralized character engine** (`characterEngine.ts`) replaces fragmented stat calculations scattered across UI components. This is the **single source of truth** for all derived character stats.

## Key Principles

### ✅ DO

- **Use `useComputedCharacterStats()` in all UI components**
- Treat computed stats as **read-only**
- Store only **base values** in database (abilities, level, equipped items)
- Compute derived stats **on-demand** from base values + effects

### ❌ DON'T

- Store computed stats in database (AC, proficiency bonus, spell DC, etc.)
- Calculate stats directly in components
- Duplicate stat calculation logic
- Mutate computed stats objects

---

## Architecture

```
Database (Base Data Only)
  ↓
characterEngine.ts
  - Aggregate effects from equipment/features/spells/conditions
  - Apply 5e formulas (proficiency, ability mods, etc.)
  - Resolve conflicts (priority, stacking rules)
  - Apply exhaustion penalties
  ↓
ComputedCharacterStats
  ↓
UI Components (Read-Only)
```

---

## Usage Examples

### Basic Usage: Display Character Stats

```tsx
import { useComputedCharacterStats } from '@/hooks/useComputedCharacterStats';

function CharacterSheet({ characterId }: { characterId: string }) {
  const { computedStats, isLoading } = useComputedCharacterStats(characterId);

  if (isLoading) return <div>Loading...</div>;
  if (!computedStats) return <div>Error loading character</div>;

  return (
    <div>
      <h1>Armor Class: {computedStats.armorClass}</h1>
      <p>Initiative: {computedStats.initiative >= 0 ? '+' : ''}{computedStats.initiative}</p>
      <p>Speed: {computedStats.speed} ft.</p>
      <p>Proficiency Bonus: +{computedStats.proficiencyBonus}</p>

      <h2>Saving Throws</h2>
      {Object.entries(computedStats.savingThrows).map(([ability, save]) => (
        <div key={ability}>
          {ability}: {save.modifier >= 0 ? '+' : ''}{save.modifier}
          {save.proficient && ' (proficient)'}
        </div>
      ))}

      <h2>Skills</h2>
      {Object.entries(computedStats.skills).map(([skillId, skill]) => (
        <div key={skillId}>
          {skillId}: {skill.modifier >= 0 ? '+' : ''}{skill.modifier}
          {skill.expertise && ' (expertise)'}
        </div>
      ))}
    </div>
  );
}
```

### Get Single Stat

```tsx
import { useCharacterStat } from '@/hooks/useComputedCharacterStats';

function QuickACDisplay({ characterId }: { characterId: string }) {
  const ac = useCharacterStat(characterId, 'armorClass');

  return <div className="ac-badge">{ac ?? '—'}</div>;
}
```

### Check Conditions Before Actions

```tsx
import { useCanPerformAction } from '@/hooks/useComputedCharacterStats';

function AttackButton({ characterId }: { characterId: string }) {
  const canAttack = useCanPerformAction(characterId, 'action');

  return (
    <button disabled={!canAttack}>
      {canAttack ? 'Attack' : 'Incapacitated'}
    </button>
  );
}
```

### Display Active Effects

```tsx
function ActiveEffectsPanel({ characterId }: { characterId: string }) {
  const { computedStats } = useComputedCharacterStats(characterId);

  if (!computedStats) return null;

  return (
    <div>
      <h3>Active Effects</h3>
      {computedStats.activeEffects.map((effect, i) => (
        <div key={i} className="effect-row">
          <span className="effect-text">{effect.displayText}</span>
          <span className="effect-source">({effect.source.sourceName})</span>
        </div>
      ))}
    </div>
  );
}
```

---

## Migration Steps

### Step 1: Remove Inline Calculations

**❌ Before (BAD):**
```tsx
function CharacterSheet({ character }) {
  // DON'T: Calculating AC inline
  const ac = useMemo(() => {
    let baseAC = 10 + getAbilityModifier(character.abilities.AGI);
    // ... complex armor logic
    return baseAC;
  }, [character]);

  return <div>AC: {ac}</div>;
}
```

**✅ After (GOOD):**
```tsx
function CharacterSheet({ characterId }) {
  const { computedStats } = useComputedCharacterStats(characterId);

  return <div>AC: {computedStats?.armorClass}</div>;
}
```

### Step 2: Stop Reading Stored Derived Stats

**❌ Before (BAD):**
```tsx
const { data: character } = await supabase
  .from('characters')
  .select('armor_class, proficiency_bonus, spell_save_dc'); // Stored derived stats

return <div>AC: {character.armor_class}</div>;
```

**✅ After (GOOD):**
```tsx
const { computedStats } = useComputedCharacterStats(characterId);

return <div>AC: {computedStats?.armorClass}</div>;
```

### Step 3: Update Mutations to Trigger Recalculation

When updating base data (abilities, level, equipment), invalidate the base data query:

```tsx
import { useQueryClient } from '@tanstack/react-query';

function EquipItem({ characterId, itemId }) {
  const queryClient = useQueryClient();

  const equipMutation = useMutation({
    mutationFn: async () => {
      await supabase
        .from('character_equipment')
        .update({ is_equipped: true })
        .eq('id', itemId);
    },
    onSuccess: () => {
      // Invalidate base data -> triggers recomputation
      queryClient.invalidateQueries(['character-base-data', characterId]);
    },
  });

  // ...
}
```

---

## Effect System

### Adding Effects to Equipment

Effects are automatically parsed from equipped items. To add custom effects:

```typescript
import type { Effect } from '@/lib/effectsEngine';

const ringOfProtection: EquipmentInstance = {
  id: 'ring-123',
  name: 'Ring of Protection',
  type: 'accessory',
  isEquipped: true,
  isAttuned: true,
  requiresAttunement: true,
  effects: [
    {
      type: 'modifier',
      target: 'ac',
      value: 1,
      priority: 100, // Equipment priority
    },
    {
      type: 'modifier',
      target: 'saving_throw', // Applies to ALL saves
      value: 1,
      priority: 100,
    },
  ],
};
```

### Effect Priorities

Effects are applied in priority order (lower = first):

- **0-99**: Base modifiers (race, job features at level 1)
- **100-199**: Equipment effects
- **200-299**: Class/subclass feature effects
- **300-399**: Spell effects
- **400-499**: Condition penalties
- **500+**: Temporary effects

### Effect Conflict Resolution

- Effects from the **same source** do NOT stack (only highest applies)
- Effects of the **same type** on the **same target** stack additively
- `set_value` effects override additive modifiers

---

## Database Schema Changes Needed

### Remove Derived Stat Columns

These columns should be **removed** from `characters` table:

```sql
ALTER TABLE characters
  DROP COLUMN armor_class,
  DROP COLUMN proficiency_bonus,
  DROP COLUMN initiative,
  DROP COLUMN spell_save_dc,
  DROP COLUMN spell_attack_bonus;
```

**Keep these (base values):**
- `hp_current`, `hp_max` (synced in multiplayer)
- `system_favor_current` (resource tracking)
- `level` (base value)
- `speed` (base value, before modifiers)

### Add Feature Tracking Table

```sql
CREATE TABLE character_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  feature_id TEXT NOT NULL, -- Reference to compendium_features
  source_type TEXT NOT NULL, -- 'job' | 'path' | 'feat' | 'race'
  source_id TEXT NOT NULL,
  uses_max INT,
  uses_current INT,
  recharge_on TEXT, -- 'short-rest' | 'long-rest' | 'dawn'
  granted_at_level INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX character_features_character_idx ON character_features(character_id);
```

---

## Testing Checklist

After migration, verify:

- [ ] AC updates immediately when equipping armor
- [ ] Shield bonus applies/removes correctly
- [ ] Fighting Style: Defense (+1 AC) applies when wearing armor
- [ ] Poisoned condition auto-applies disadvantage to attacks/checks
- [ ] Exhaustion level 2+ halves speed
- [ ] Proficiency bonus increases at levels 5, 9, 13, 17
- [ ] Spell save DC updates when ability scores change
- [ ] Initiative includes bonuses from feats (when implemented)
- [ ] Passive Perception = 10 + Perception skill modifier
- [ ] Encumbrance tiers apply speed penalties (when implemented)

---

## Performance Considerations

### Memoization

The engine uses React's `useMemo` to recompute stats **only when base data changes**. This prevents unnecessary recalculations on every render.

### Query Caching

React Query caches base data for 1 minute (`staleTime: 60000`). This reduces database queries.

### Optimization Tips

1. **Don't destructure computed stats** - pass the whole object down to avoid re-renders:
   ```tsx
   // ❌ Bad - re-renders when any stat changes
   const { armorClass, initiative, speed } = computedStats;

   // ✅ Good - only re-renders when computedStats reference changes
   <StatBlock computedStats={computedStats} />
   ```

2. **Use `useCharacterStat()` for single values** - avoids subscribing to all stat changes:
   ```tsx
   // ✅ Only re-renders when AC changes
   const ac = useCharacterStat(characterId, 'armorClass');
   ```

---

## Troubleshooting

### Issue: Computed stats are null

**Cause:** Character base data failed to load or character doesn't exist

**Solution:** Check `error` from hook:
```tsx
const { computedStats, error } = useComputedCharacterStats(characterId);
if (error) console.error('Failed to load character:', error);
```

### Issue: Stats not updating after equipment change

**Cause:** Query not invalidated after mutation

**Solution:** Add query invalidation to mutation:
```tsx
onSuccess: () => {
  queryClient.invalidateQueries(['character-base-data', characterId]);
}
```

### Issue: Performance is slow

**Cause:** Computing stats too frequently (not memoized)

**Solution:** Ensure `useComputedCharacterStats` is called at component root, not inside loops or effects

---

## Next Steps

1. **Implement feature injection** - Auto-add class features on level up
2. **Add armor AC formula parsing** - Support "13 + AGI (max 2)" formulas
3. **Implement encumbrance penalties** - Speed reduction based on carrying capacity
4. **Add spell effect tracking** - Duration-based spell effects (Bless, Haste, etc.)
5. **Build rest system** - Auto-recharge features on short/long rest

---

## System Ascendant Terminology Reference

| D&D 5e Term | System Ascendant Term |
|-------------|----------------------|
| Class | Job |
| Subclass | Path |
| Spell | Power |
| Magic Item | Relic |
| STR | STR (Strength) |
| DEX | AGI (Agility) |
| CON | VIT (Vitality) |
| INT | INT (Intelligence) |
| WIS | SENSE (Sense) |
| CHA | PRE (Presence) |
| Inspiration | System Favor |

---

## Support

For questions or issues, see:
- `src/lib/characterEngine.ts` - Core calculation engine
- `src/hooks/useComputedCharacterStats.ts` - React integration
- `src/lib/5eRulesEngine.ts` - 5e formulas and constants

/**
 * Equipment modifier parsing and application
 */

export interface EquipmentModifiers {
  ac?: number;
  attack?: number;
  damage?: number;
  str?: number;
  agi?: number;
  vit?: number;
  int?: number;
  sense?: number;
  pre?: number;
  speed?: number;
  savingThrows?: Record<string, number>;
  skills?: Record<string, number>;
}

/**
 * Parse equipment properties into modifiers
 */
export function parseModifiers(properties: string[]): EquipmentModifiers {
  const modifiers: EquipmentModifiers = {};

  if (!properties || properties.length === 0) return modifiers;

  properties.forEach(prop => {
    const lowerProp = prop.toLowerCase();

    // AC modifiers: "AC 15", "+2 AC", "AC +2"
    const acMatch = lowerProp.match(/(?:ac\s+(\d+)|(\+?\d+)\s+ac|ac\s+(\+?\d+))/i);
    if (acMatch) {
      const value = parseInt(acMatch[1] || acMatch[2] || acMatch[3] || '0');
      if (lowerProp.includes('ac') && !lowerProp.includes('+')) {
        modifiers.ac = value; // Set AC (e.g., "AC 15")
      } else {
        modifiers.ac = (modifiers.ac || 0) + value; // Add to AC
      }
    }

    // Attack modifiers: "+1 to attack", "+2 attack bonus"
    const attackMatch = lowerProp.match(/(\+?\d+)\s+to\s+attack|(\+?\d+)\s+attack/i);
    if (attackMatch) {
      const value = parseInt(attackMatch[1] || attackMatch[2] || '0');
      modifiers.attack = (modifiers.attack || 0) + value;
    }

    // Damage modifiers: "+1 to damage", "+2 damage"
    const damageMatch = lowerProp.match(/(\+?\d+)\s+to\s+damage|(\+?\d+)\s+damage/i);
    if (damageMatch) {
      const value = parseInt(damageMatch[1] || damageMatch[2] || '0');
      modifiers.damage = (modifiers.damage || 0) + value;
    }

    // Ability score modifiers: "+2 Strength", "+1 to STR"
    const abilityMap: Record<string, keyof EquipmentModifiers> = {
      'strength': 'str',
      'str': 'str',
      'dexterity': 'agi',
      'dex': 'agi',
      'agility': 'agi',
      'agi': 'agi',
      'constitution': 'vit',
      'con': 'vit',
      'vitality': 'vit',
      'vit': 'vit',
      'intelligence': 'int',
      'int': 'int',
      'wisdom': 'sense',
      'wis': 'sense',
      'sense': 'sense',
      'charisma': 'pre',
      'cha': 'pre',
      'presence': 'pre',
      'pre': 'pre',
    };

    for (const [key, ability] of Object.entries(abilityMap)) {
      const abilityMatch = lowerProp.match(new RegExp(`(\\+?\\d+)\\s+(?:to\\s+)?${key}`, 'i'));
      if (abilityMatch) {
        const value = parseInt(abilityMatch[1] || '0');
        modifiers[ability] = (modifiers[ability] as number || 0) + value;
      }
    }

    // Speed modifiers: "+10 speed", "+5 ft speed"
    const speedMatch = lowerProp.match(/(\+?\d+)\s*(?:ft\s*)?speed/i);
    if (speedMatch) {
      const value = parseInt(speedMatch[1] || '0');
      modifiers.speed = (modifiers.speed || 0) + value;
    }

    // Saving throw modifiers: "+1 to saving throws", "+2 to all saves"
    const saveMatch = lowerProp.match(/(\+?\d+)\s+to\s+(?:all\\s+)?(?:saving\\s+)?throws?/i);
    if (saveMatch) {
      const value = parseInt(saveMatch[1] || '0');
      if (!modifiers.savingThrows) modifiers.savingThrows = {};
      // Apply to all saves if "all saves" mentioned
      if (lowerProp.includes('all')) {
        ['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'].forEach(ability => {
          if (!modifiers.savingThrows) modifiers.savingThrows = {};
          modifiers.savingThrows[ability] = (modifiers.savingThrows[ability] || 0) + value;
        });
      }
    }

    // Skill modifiers: "+2 to Stealth", "+1 to all skills"
    const skillMatch = lowerProp.match(/(\+?\d+)\s+to\s+(?:all\\s+)?skills?/i);
    if (skillMatch) {
      const value = parseInt(skillMatch[1] || '0');
      if (!modifiers.skills) modifiers.skills = {};
      if (lowerProp.includes('all')) {
        // Would need skill list - for now, just note it
        modifiers.skills['*'] = value;
      }
    }
  });

  return modifiers;
}

/**
 * Combine multiple modifier objects
 */
export function combineModifiers(...modifierSets: EquipmentModifiers[]): EquipmentModifiers {
  const combined: EquipmentModifiers = {};

  modifierSets.forEach(mods => {
    Object.entries(mods).forEach(([key, value]) => {
      if (key === 'savingThrows' || key === 'skills') {
        if (!combined[key]) combined[key] = {};
        Object.entries(value as Record<string, number>).forEach(([subKey, subValue]) => {
          (combined[key] as Record<string, number>)[subKey] = 
            ((combined[key] as Record<string, number>)[subKey] || 0) + subValue;
        });
      } else {
        combined[key as keyof EquipmentModifiers] = 
          ((combined[key as keyof EquipmentModifiers] as number) || 0) + (value as number);
      }
    });
  });

  return combined;
}

/**
 * Apply equipment modifiers to base stats
 */
export function applyEquipmentModifiers(
  baseAC: number,
  baseSpeed: number,
  baseAbilities: Record<string, number>,
  equipment: Array<{ properties?: string[]; is_equipped: boolean; is_attuned: boolean; requires_attunement: boolean }>
): {
  armorClass: number;
  speed: number;
  abilityModifiers: Record<string, number>;
  attackBonus: number;
  damageBonus: number;
} {
  const equipped = equipment.filter(
    e => e.is_equipped && (!e.requires_attunement || e.is_attuned)
  );

  const allModifiers = combineModifiers(
    ...equipped.map(e => parseModifiers(e.properties || []))
  );

  // Apply AC modifier (if set, use it; otherwise add to base)
  const armorClass = allModifiers.ac !== undefined 
    ? (allModifiers.ac > 10 ? allModifiers.ac : baseAC + (allModifiers.ac || 0))
    : baseAC;

  // Apply speed modifier
  const speed = baseSpeed + (allModifiers.speed || 0);

  // Apply ability modifiers
  const abilityModifiers: Record<string, number> = {};
  ['str', 'agi', 'vit', 'int', 'sense', 'pre'].forEach(ability => {
    abilityModifiers[ability] = (allModifiers[ability as keyof EquipmentModifiers] as number) || 0;
  });

  return {
    armorClass: Math.max(armorClass, 0),
    speed: Math.max(speed, 0),
    abilityModifiers,
    attackBonus: allModifiers.attack || 0,
    damageBonus: allModifiers.damage || 0,
  };
}



import { describe, test, expect } from 'vitest';
import { calculateAttackBonus, calculateWeaponDamage } from '../combatAutomation';
import { applyEquipmentModifiers } from '../equipmentModifiers';

describe('Equipment + weapons (5e rules)', () => {
  test('Finesse weapon uses higher of STR/AGI for attack and damage', () => {
    const character = {
      abilities: { STR: 10, AGI: 18 },
      proficiency_bonus: 2,
      armor_class: 10,
      equipment: [],
      modifiers: [],
    } as any;

    const weapon = {
      name: 'Dagger',
      type: 'weapon',
      damage: '1d4',
      damage_type: 'piercing',
      properties: ['finesse', 'light'],
    } as any;

    const atk = calculateAttackBonus(character, weapon, true);
    // AGI mod +4 + prof +2
    expect(atk).toBe(6);

    const dmg = calculateWeaponDamage(weapon, character, false);
    // We only assert that the ability mod was added; dice is random so check minimum.
    expect(dmg.totalDamage).toBeGreaterThanOrEqual(1 + 4);
  });

  test('Medium armor caps Dex (AGI) modifier at +2', () => {
    const baseAC = 10 + 4; // AGI 18

    const res = applyEquipmentModifiers(
      baseAC,
      30,
      { STR: 10, AGI: 18, VIT: 10, INT: 10, SENSE: 10, PRE: 10 },
      [
        {
          is_equipped: true,
          is_attuned: false,
          requires_attunement: false,
          properties: ['AC 14', 'Medium'],
        },
      ]
    );

    // 14 + min(4,2) = 16
    expect(res.armorClass).toBe(16);
  });

  test('Heavy armor ignores Dex (AGI) modifier', () => {
    const baseAC = 10 + 4; // AGI 18

    const res = applyEquipmentModifiers(
      baseAC,
      30,
      { STR: 10, AGI: 18, VIT: 10, INT: 10, SENSE: 10, PRE: 10 },
      [
        {
          is_equipped: true,
          is_attuned: false,
          requires_attunement: false,
          properties: ['AC 16', 'Heavy'],
        },
      ]
    );

    expect(res.armorClass).toBe(16);
  });
});

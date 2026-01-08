import { beforeEach, describe, expect, it } from 'vitest';
import type { Database } from '@/integrations/supabase/types';
import {
  addLocalEquipment,
  addLocalPower,
  createLocalCharacter,
  getLocalCharacterState,
  getLocalCharacterWithAbilities,
  listLocalCharacters,
  listLocalEquipment,
  listLocalPowers,
  listLocalSpellSlots,
  setLocalAbilities,
  updateLocalEquipment,
  updateLocalPower,
  updateLocalSpellSlotRow,
  upsertLocalSpellSlot,
} from '@/lib/guestStore';
import { calculateCharacterStats } from '@/lib/characterCalculations';
import { applyEquipmentModifiers } from '@/lib/equipmentModifiers';
import { getActiveConditionEffects } from '@/lib/conditions';
import {
  createLocalBackup,
  importBackupFromFile,
  loadLocalBackups,
  restoreFromBackup,
} from '@/hooks/useCharacterBackup';

type AbilityScore = Database['public']['Enums']['ability_score'];

const BASE_ABILITIES: Record<AbilityScore, number> = {
  STR: 14,
  AGI: 16,
  VIT: 12,
  INT: 10,
  SENSE: 8,
  PRE: 13,
};

function createLocalTestCharacter(name: string = 'Rin') {
  const agiModifier = Math.floor((BASE_ABILITIES.AGI - 10) / 2);
  const character = createLocalCharacter({
    name,
    level: 3,
    job: 'Mage',
    armor_class: 10 + agiModifier,
    initiative: agiModifier,
    hp_current: 20,
    hp_max: 20,
    hit_dice_current: 3,
    hit_dice_max: 3,
    hit_dice_size: 8,
    proficiency_bonus: 2,
    speed: 30,
    saving_throw_proficiencies: ['INT'],
    skill_proficiencies: [],
    skill_expertise: [],
  });

  setLocalAbilities(character.id, BASE_ABILITIES);
  return { character, abilities: BASE_ABILITIES };
}

describe('Release Scenarios', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('Scenario 1: create, save, reload, and compute sheet stats', () => {
    const { character, abilities } = createLocalTestCharacter('Jin');

    const stored = getLocalCharacterState(character.id);
    expect(stored).not.toBeNull();

    const list = listLocalCharacters();
    expect(list.some((entry) => entry.id === character.id)).toBe(true);

    const stats = calculateCharacterStats({
      level: stored?.character.level || 1,
      abilities: stored?.abilities || abilities,
      savingThrowProficiencies: stored?.character.saving_throw_proficiencies || [],
      skillProficiencies: stored?.character.skill_proficiencies || [],
      skillExpertise: stored?.character.skill_expertise || [],
      armorClass: stored?.character.armor_class,
      speed: stored?.character.speed,
    });

    expect(stats.proficiencyBonus).toBe(2);
    expect(stats.armorClass).toBe(character.armor_class);
  });

  it('Scenario 2: add equipment, equip, and see AC/attack changes', () => {
    const { character, abilities } = createLocalTestCharacter('Min');

    const item = addLocalEquipment(character.id, {
      name: 'Gateforged Mail',
      item_type: 'armor',
      description: 'Test armor.',
      properties: ['+2 AC', '+1 to attack'],
      quantity: 1,
      is_equipped: true,
      is_attuned: false,
      requires_attunement: false,
    });

    const equipment = listLocalEquipment(character.id);
    const modifiers = applyEquipmentModifiers(character.armor_class, character.speed, abilities, equipment);
    expect(modifiers.armorClass).toBe(character.armor_class + 2);
    expect(modifiers.attackBonus).toBe(1);

    updateLocalEquipment(item.id, { is_equipped: false });
    const after = applyEquipmentModifiers(character.armor_class, character.speed, abilities, listLocalEquipment(character.id));
    expect(after.armorClass).toBe(character.armor_class);
  });

  it('Scenario 3: apply condition and remove it to restore derived effects', () => {
    const baseSpeed = 30;

    const withCondition = getActiveConditionEffects(['Grappled']);
    const speedAfter = withCondition.speedModifier === 'zero'
      ? 0
      : typeof withCondition.speedModifier === 'number'
        ? Math.max(0, baseSpeed + withCondition.speedModifier)
        : baseSpeed;
    expect(speedAfter).toBe(0);

    const cleared = getActiveConditionEffects([]);
    const restoredSpeed = cleared.speedModifier === 'zero'
      ? 0
      : typeof cleared.speedModifier === 'number'
        ? Math.max(0, baseSpeed + cleared.speedModifier)
        : baseSpeed;
    expect(restoredSpeed).toBe(baseSpeed);
  });

  it('Scenario 4: add power, cast to spend slot, and track concentration', () => {
    const { character } = createLocalTestCharacter('Ara');

    const power = addLocalPower(character.id, {
      name: 'Binding Sigil',
      power_level: 1,
      source: 'Test',
      casting_time: '1 action',
      range: '30 ft',
      duration: '1 minute',
      concentration: true,
      description: 'Test power.',
      is_prepared: false,
      is_known: true,
    });

    const initialConcentration = listLocalPowers(character.id).find(
      (p) => p.concentration && p.is_prepared
    );
    expect(initialConcentration).toBeUndefined();

    updateLocalPower(power.id, { is_prepared: true });
    const preparedConcentration = listLocalPowers(character.id).find(
      (p) => p.concentration && p.is_prepared
    );
    expect(preparedConcentration?.name).toBe('Binding Sigil');

    const slot = upsertLocalSpellSlot(character.id, {
      spell_level: 1,
      slots_max: 2,
      slots_current: 2,
      slots_recovered_on_short_rest: 0,
      slots_recovered_on_long_rest: 1,
    });
    updateLocalSpellSlotRow(slot.id, { slots_current: slot.slots_current - 1 });
    const slots = listLocalSpellSlots(character.id);
    expect(slots.find((s) => s.spell_level === 1)?.slots_current).toBe(1);
  });

  it('Scenario 6: export backup, wipe, import, and restore', async () => {
    const { character } = createLocalTestCharacter('Nova');
    const withAbilities = getLocalCharacterWithAbilities(character.id);
    expect(withAbilities).not.toBeNull();

    const backupId = createLocalBackup(withAbilities!, 'Release backup');
    const backup = loadLocalBackups(character.id).find((b) => b.id === backupId);
    expect(backup).toBeDefined();

    const backupJson = JSON.stringify(backup);
    window.localStorage.clear();

    const file = new File([backupJson], 'backup.json', { type: 'application/json' });
    const imported = await importBackupFromFile(file);
    const restored = restoreFromBackup(imported);

    expect(restored.name).toBe(withAbilities!.name);
    expect(restored.level).toBe(withAbilities!.level);
  });
});

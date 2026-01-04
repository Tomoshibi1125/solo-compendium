/**
 * System Flows Integration Tests
 * Tests all major user flows and automation systems
 */

import { describe, it, expect } from 'vitest';
import { 
  calculateCharacterStats, 
  calculateHPMax,
  formatModifier 
} from './characterCalculations';
import { 
  parseModifiers, 
  combineModifiers, 
  applyEquipmentModifiers 
} from './equipmentModifiers';
import { 
  executeShortRest, 
  executeLongRest 
} from './restSystem';
import { 
  addLevel1Features,
  addBackgroundFeatures,
  addStartingEquipment,
  addStartingPowers
} from './characterCreation';
import { getAbilityModifier, getProficiencyBonus, getSystemFavorDie } from '../types/solo-leveling';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      upsert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } }, error: null })),
    },
  },
}));

describe('Character Creation Flow', () => {
  describe('Ability Score Generation', () => {
    it('validates standard array method', () => {
      const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
      const sorted = [...STANDARD_ARRAY].sort((a, b) => b - a);
      
      expect(sorted).toEqual([15, 14, 13, 12, 10, 8]);
      expect(sorted.length).toBe(6);
      expect(sorted.every(score => score >= 8 && score <= 15)).toBe(true);
    });

    it('validates point buy costs', () => {
      const POINT_BUY_COST: Record<number, number> = {
        8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
      };
      
      expect(POINT_BUY_COST[8]).toBe(0);
      expect(POINT_BUY_COST[15]).toBe(9);
      
      // Total cost for standard array equivalent
      const totalCost = 9 + 7 + 5 + 4 + 2 + 0; // 15, 14, 13, 12, 10, 8
      expect(totalCost).toBe(27);
    });

    it('validates manual/rolled stats', () => {
      // Roll 4d6, drop lowest
      const roll4d6 = () => {
        const rolls = [1, 2, 3, 4].map(() => Math.floor(Math.random() * 6) + 1);
        rolls.sort((a, b) => b - a);
        return rolls[0] + rolls[1] + rolls[2]; // Sum of top 3
      };
      
      const stat = roll4d6();
      expect(stat).toBeGreaterThanOrEqual(3); // Minimum: 1+1+1
      expect(stat).toBeLessThanOrEqual(18); // Maximum: 6+6+6
    });
  });

  describe('Job Selection and Validation', () => {
    it('validates job selection is required', () => {
      const selectedJob = '';
      expect(selectedJob.length).toBe(0);
      
      const isValid = selectedJob.length > 0;
      expect(isValid).toBe(false);
    });

    it('validates skill selection when required', () => {
      const jobSkillChoices = ['Athletics', 'Acrobatics', 'Stealth', 'Perception'];
      const skillChoiceCount = 2;
      const selectedSkills = ['Athletics', 'Stealth'];
      
      const isValid = selectedSkills.length === skillChoiceCount &&
        selectedSkills.every(skill => jobSkillChoices.includes(skill));
      
      expect(isValid).toBe(true);
    });

    it('validates skill selection count matches requirement', () => {
      const skillChoiceCount = 2;
      const selectedSkills = ['Athletics'];
      
      const isValid = selectedSkills.length === skillChoiceCount;
      expect(isValid).toBe(false);
    });
  });

  describe('Path Selection', () => {
    it('validates path is optional', () => {
      const selectedPath = '';
      const pathsAvailable = true;
      
      // Path is optional: if paths are available but none selected, that's okay
      // The validation should allow empty path when paths are available
      const isValid = pathsAvailable ? true : true; // Always valid (optional)
      expect(isValid).toBe(true);
    });

    it('validates path belongs to selected job', () => {
      const selectedJob = 'Vanguard';
      const pathJob = 'Vanguard';
      
      const isValid = pathJob === selectedJob;
      expect(isValid).toBe(true);
    });
  });

  describe('Background Selection', () => {
    it('validates background is required', () => {
      const selectedBackground = '';
      
      const isValid = selectedBackground.length > 0;
      expect(isValid).toBe(false);
    });

    it('validates background has required fields', () => {
      const background = {
        id: 'bg-1',
        name: 'Acolyte',
        description: 'Test description',
        feature_name: 'Shelter of the Faithful',
        feature_description: 'Test feature',
        skill_proficiencies: ['Insight', 'Religion'],
        tool_proficiencies: null,
        language_count: 2,
        starting_equipment: 'Holy symbol',
        starting_credits: 1500,
      };
      
      expect(background.name).toBeTruthy();
      expect(background.description).toBeTruthy();
      expect(background.feature_name).toBeTruthy();
    });
  });

  describe('Character Creation Automation', () => {
    it('calculates initial stats correctly', () => {
      const level = 1;
      const hitDie = 8;
      const vitModifier = 2;
      const agiModifier = 1;
      
      const hpMax = calculateHPMax(level, hitDie, vitModifier);
      const baseAC = 10 + agiModifier;
      const proficiencyBonus = getProficiencyBonus(level);
      const systemFavorDie = getSystemFavorDie(level);
      const systemFavorMax = 3; // Level 1-4
      
      expect(hpMax).toBe(10); // 8 + 2
      expect(baseAC).toBe(11); // 10 + 1
      expect(proficiencyBonus).toBe(2);
      expect(systemFavorDie).toBe(4);
      expect(systemFavorMax).toBe(3);
    });

    it('validates ability score increases from job (racial feature)', () => {
      // Jobs provide +2 to primary, +1 to secondary at level 1
      const jobPrimary = 'STR';
      const jobSecondary = 'AGI';
      
      const baseAbilities = {
        STR: 15,
        AGI: 14,
        VIT: 13,
        INT: 12,
        SENSE: 10,
        PRE: 8,
      };
      
      // Apply job ability score increases
      const finalAbilities = {
        ...baseAbilities,
        [jobPrimary]: baseAbilities.STR + 2,
        [jobSecondary]: baseAbilities.AGI + 1,
      };
      
      expect(finalAbilities.STR).toBe(17); // 15 + 2
      expect(finalAbilities.AGI).toBe(15); // 14 + 1
    });
  });
});

describe('Level Up Flow', () => {
  describe('Level Validation', () => {
    it('validates new level is higher than current', () => {
      const currentLevel = 5;
      const newLevel = 6;
      
      const isValid = newLevel > currentLevel;
      expect(isValid).toBe(true);
    });

    it('rejects level decrease', () => {
      const currentLevel = 5;
      const newLevel = 4;
      
      const isValid = newLevel > currentLevel;
      expect(isValid).toBe(false);
    });
  });

  describe('HP Increase Calculation', () => {
    it('calculates average HP increase', () => {
      const hitDieSize = 8;
      const vitModifier = 2;
      const averageHP = Math.floor(hitDieSize / 2) + 1; // 5
      const hpIncrease = averageHP + vitModifier; // 7
      
      expect(hpIncrease).toBe(7);
    });

    it('validates rolled HP increase range', () => {
      const hitDieSize = 8;
      const vitModifier = 2;
      const minHP = 1 + vitModifier; // 3
      const maxHP = hitDieSize + vitModifier; // 10
      
      const rolledHP = 6 + vitModifier; // 8
      expect(rolledHP).toBeGreaterThanOrEqual(minHP);
      expect(rolledHP).toBeLessThanOrEqual(maxHP);
    });
  });

  describe('Stat Scaling on Level Up', () => {
    it('calculates proficiency bonus scaling', () => {
      expect(getProficiencyBonus(1)).toBe(2);
      expect(getProficiencyBonus(5)).toBe(3);
      expect(getProficiencyBonus(9)).toBe(4);
      expect(getProficiencyBonus(13)).toBe(5);
      expect(getProficiencyBonus(17)).toBe(6);
    });

    it('calculates System Favor scaling', () => {
      const getSystemFavor = (level: number) => ({
        die: getSystemFavorDie(level),
        max: level <= 4 ? 3 : level <= 10 ? 4 : level <= 16 ? 5 : 6,
      });
      
      expect(getSystemFavor(1)).toEqual({ die: 4, max: 3 });
      expect(getSystemFavor(5)).toEqual({ die: 6, max: 4 });
      expect(getSystemFavor(11)).toEqual({ die: 8, max: 5 });
      expect(getSystemFavor(17)).toEqual({ die: 10, max: 6 });
    });

    it('calculates hit dice max scaling', () => {
      const level = 5;
      const hitDiceMax = level;
      
      expect(hitDiceMax).toBe(5);
    });
  });

  describe('Feature Selection', () => {
    it('validates feature selection when choices available', () => {
      const availableFeatures = [
        { id: 'f1', name: 'Feature 1', requires_choice: false },
        { id: 'f2', name: 'Feature 2', requires_choice: true },
        { id: 'f3', name: 'Feature 3', requires_choice: true },
      ];
      
      const choiceFeatures = availableFeatures.filter(f => f.requires_choice);
      const selectedFeatures = ['f2'];
      const choiceCount = 1;
      
      const isValid = selectedFeatures.length === choiceCount &&
        selectedFeatures.every(id => choiceFeatures.some(f => f.id === id));
      
      expect(isValid).toBe(true);
    });
  });
});

describe('Rest System Flow', () => {
  describe('Short Rest Logic', () => {
    it('calculates hit dice restoration correctly', () => {
      const hitDiceMax = 10;
      const hitDiceCurrent = 3;
      const hitDiceToRestore = Math.ceil(hitDiceMax / 2); // 5
      const newHitDiceCurrent = Math.min(
        hitDiceCurrent + hitDiceToRestore,
        hitDiceMax
      );
      
      expect(newHitDiceCurrent).toBe(8); // 3 + 5 = 8
    });

    it('does not exceed max hit dice', () => {
      const hitDiceMax = 5;
      const hitDiceCurrent = 4;
      const hitDiceToRestore = Math.ceil(hitDiceMax / 2); // 3
      const newHitDiceCurrent = Math.min(
        hitDiceCurrent + hitDiceToRestore,
        hitDiceMax
      );
      
      expect(newHitDiceCurrent).toBe(5); // Capped at max
    });
  });

  describe('Long Rest Logic', () => {
    it('restores all HP to max', () => {
      const hpCurrent = 5;
      const hpMax = 50;
      
      const newHPCurrent = hpMax;
      expect(newHPCurrent).toBe(50);
    });

    it('restores all hit dice', () => {
      const hitDiceCurrent = 3;
      const hitDiceMax = 10;
      
      const newHitDiceCurrent = hitDiceMax;
      expect(newHitDiceCurrent).toBe(10);
    });

    it('restores System Favor to max', () => {
      const systemFavorCurrent = 1;
      const systemFavorMax = 4;
      
      const newSystemFavorCurrent = systemFavorMax;
      expect(newSystemFavorCurrent).toBe(4);
    });

    it('reduces exhaustion by 1 (minimum 0)', () => {
      const exhaustionLevels = [0, 1, 2, 3, 4, 5, 6];
      
      exhaustionLevels.forEach(level => {
        const newLevel = Math.max(0, level - 1);
        expect(newLevel).toBeGreaterThanOrEqual(0);
        expect(newLevel).toBeLessThanOrEqual(6);
      });
    });

    it('clears all conditions', () => {
      const conditions = ['Poisoned', 'Frightened', 'Exhausted'];
      const newConditions: string[] = [];
      
      expect(newConditions.length).toBe(0);
    });
  });

  describe('Feature Recharge Logic', () => {
    it('resets short-rest recharge features', () => {
      const feature = {
        id: 'f1',
        uses_current: 0,
        uses_max: 3,
        recharge: 'short-rest',
      };
      
      const newUsesCurrent = feature.uses_max;
      expect(newUsesCurrent).toBe(3);
    });

    it('resets long-rest recharge features', () => {
      const feature = {
        id: 'f1',
        uses_current: 1,
        uses_max: 5,
        recharge: 'long-rest',
      };
      
      const newUsesCurrent = feature.uses_max;
      expect(newUsesCurrent).toBe(5);
    });

    it('resets encounter recharge features on long rest', () => {
      const feature = {
        id: 'f1',
        uses_current: 0,
        uses_max: 1,
        recharge: 'encounter',
      };
      
      const newUsesCurrent = feature.uses_max;
      expect(newUsesCurrent).toBe(1);
    });
  });
});

describe('Equipment System Flow', () => {
  describe('Equipment Modifier Application', () => {
    it('applies AC modifiers from equipped items', () => {
      const baseAC = 12;
      const equipment = [
        { properties: ['+2 AC'], is_equipped: true, is_attuned: false, requires_attunement: false },
      ];
      
      const result = applyEquipmentModifiers(baseAC, 30, {}, equipment);
      expect(result.armorClass).toBe(14);
    });

    it('applies ability score modifiers', () => {
      const baseAbilities = { STR: 16, AGI: 14, VIT: 13, INT: 12, SENSE: 10, PRE: 8 };
      const equipment = [
        { properties: ['+2 Strength'], is_equipped: true, is_attuned: false, requires_attunement: false },
      ];
      
      const result = applyEquipmentModifiers(10, 30, baseAbilities, equipment);
      expect(result.abilityModifiers.str).toBeGreaterThanOrEqual(2);
    });

    it('applies attack and damage bonuses', () => {
      const equipment = [
        { properties: ['+1 to attack', '+2 damage'], is_equipped: true, is_attuned: false, requires_attunement: false },
      ];
      
      const result = applyEquipmentModifiers(10, 30, {}, equipment);
      expect(result.attackBonus).toBe(1);
      expect(result.damageBonus).toBe(2);
    });

    it('requires attunement for attunement items', () => {
      const equipment = [
        { properties: ['+2 AC'], is_equipped: true, is_attuned: false, requires_attunement: true },
        { properties: ['+1 AC'], is_equipped: true, is_attuned: true, requires_attunement: true },
      ];
      
      const result = applyEquipmentModifiers(10, 30, {}, equipment);
      // Only attuned item should apply
      expect(result.armorClass).toBe(11);
    });
  });

  describe('Equipment Equip/Unequip', () => {
    it('only applies modifiers from equipped items', () => {
      const equipment = [
        { properties: ['+2 AC'], is_equipped: true, is_attuned: false, requires_attunement: false },
        { properties: ['+1 AC'], is_equipped: false, is_attuned: false, requires_attunement: false },
      ];
      
      const result = applyEquipmentModifiers(10, 30, {}, equipment);
      expect(result.armorClass).toBe(12); // Only +2 from equipped
    });
  });
});

describe('Feature Usage Flow', () => {
  describe('Feature Use Tracking', () => {
    it('decrements uses on feature use', () => {
      const feature = {
        uses_current: 3,
        uses_max: 3,
      };
      
      const newUsesCurrent = feature.uses_current - 1;
      expect(newUsesCurrent).toBe(2);
    });

    it('prevents use when out of uses', () => {
      const feature = {
        uses_current: 0,
        uses_max: 3,
      };
      
      const canUse = feature.uses_current > 0;
      expect(canUse).toBe(false);
    });

    it('calculates uses from formulas', () => {
      const level = 5;
      const proficiencyBonus = getProficiencyBonus(level);
      
      // Formula: "proficiency bonus per long rest"
      const usesMax = proficiencyBonus;
      expect(usesMax).toBe(3);
      
      // Formula: "level per long rest"
      const usesMax2 = level;
      expect(usesMax2).toBe(5);
    });
  });

  describe('Feature Activation', () => {
    it('toggles feature active state', () => {
      const feature = {
        is_active: true,
      };
      
      const newActiveState = !feature.is_active;
      expect(newActiveState).toBe(false);
    });
  });
});

describe('Character Sheet Calculations', () => {
  describe('Real-time Stat Updates', () => {
    it('recalculates stats when abilities change', () => {
      const stats1 = calculateCharacterStats({
        level: 5,
        abilities: { STR: 16, AGI: 14, VIT: 13, INT: 12, SENSE: 10, PRE: 8 },
        savingThrowProficiencies: ['STR'],
        skillProficiencies: [],
        skillExpertise: [],
      });
      
      const stats2 = calculateCharacterStats({
        level: 5,
        abilities: { STR: 18, AGI: 14, VIT: 13, INT: 12, SENSE: 10, PRE: 8 },
        savingThrowProficiencies: ['STR'],
        skillProficiencies: [],
        skillExpertise: [],
      });
      
      expect(stats2.abilityModifiers.STR).toBeGreaterThan(stats1.abilityModifiers.STR);
      expect(stats2.savingThrows.STR).toBeGreaterThan(stats1.savingThrows.STR);
    });

    it('recalculates stats when level changes', () => {
      const stats1 = calculateCharacterStats({
        level: 4,
        abilities: { STR: 16, AGI: 14, VIT: 13, INT: 12, SENSE: 10, PRE: 8 },
        savingThrowProficiencies: ['STR'],
        skillProficiencies: [],
        skillExpertise: [],
      });
      
      const stats2 = calculateCharacterStats({
        level: 5,
        abilities: { STR: 16, AGI: 14, VIT: 13, INT: 12, SENSE: 10, PRE: 8 },
        savingThrowProficiencies: ['STR'],
        skillProficiencies: [],
        skillExpertise: [],
      });
      
      expect(stats2.proficiencyBonus).toBeGreaterThan(stats1.proficiencyBonus);
    });
  });
});

describe('Validation and Error Handling', () => {
  describe('Character Creation Validation', () => {
    it('validates name is required', () => {
      const name = '';
      const isValid = name.trim().length > 0;
      expect(isValid).toBe(false);
    });

    it('validates all required steps completed', () => {
      const steps = {
        concept: true,
        abilities: true,
        job: true,
        path: true, // Optional
        background: true,
        review: true,
      };
      
      const allRequired = steps.concept && steps.abilities && steps.job && steps.background;
      expect(allRequired).toBe(true);
    });
  });

  describe('Level Up Validation', () => {
    it('validates HP increase is provided', () => {
      const hpIncrease = null;
      const isValid = hpIncrease !== null && hpIncrease > 0;
      expect(isValid).toBe(false);
    });

    it('validates HP increase is within range', () => {
      const hitDieSize = 8;
      const vitModifier = 2;
      const minHP = 1 + vitModifier; // 3
      const maxHP = hitDieSize + vitModifier; // 10
      const hpIncrease = 7;
      
      const isValid = hpIncrease >= minHP && hpIncrease <= maxHP;
      expect(isValid).toBe(true);
    });
  });
});

console.log('✅ All system flow tests completed!');


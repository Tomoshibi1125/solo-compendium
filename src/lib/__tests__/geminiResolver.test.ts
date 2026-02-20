import { describe, it, expect } from 'vitest';
import {
  EMPTY_GEMINI_STATE,
  resolveFusionModifiers,
  buildGeminiRuntimeState,
  toGeminiStateRef,
  toGeminiEffectRefs,
  applyModifiers,
  getPowerMultiplierFactor,
  type FusionAbilityInput,
} from '@/lib/geminiResolver';

describe('EMPTY_GEMINI_STATE', () => {
  it('has all fields defaulted', () => {
    expect(EMPTY_GEMINI_STATE.sovereignId).toBeNull();
    expect(EMPTY_GEMINI_STATE.isActive).toBe(false);
    expect(EMPTY_GEMINI_STATE.modifiers).toEqual([]);
    expect(EMPTY_GEMINI_STATE.corruptionRisk).toBe(0);
  });
});

describe('resolveFusionModifiers', () => {
  it('converts abilities with stat+value into modifiers', () => {
    const abilities: FusionAbilityInput[] = [
      { name: 'Shadow Strike', description: 'Bonus damage', stat: 'damage', value: 4 },
      { name: 'Iron Shell', description: 'AC boost', stat: 'ac', value: 2, operation: 'add' },
    ];
    const mods = resolveFusionModifiers(abilities, 'TestSovereign');
    expect(mods).toHaveLength(2);
    expect(mods[0].stat).toBe('damage');
    expect(mods[0].value).toBe(4);
    expect(mods[0].source).toContain('TestSovereign');
    expect(mods[1].operation).toBe('add');
  });

  it('skips abilities without stat or value', () => {
    const abilities: FusionAbilityInput[] = [
      { name: 'Flavor', description: 'Just lore' },
    ];
    expect(resolveFusionModifiers(abilities, 'X')).toEqual([]);
  });
});

describe('buildGeminiRuntimeState', () => {
  it('returns empty state when inactive', () => {
    const state = buildGeminiRuntimeState('s1', 'Sov', false, null, null, null, []);
    expect(state.isActive).toBe(false);
    expect(state.modifiers).toEqual([]);
  });

  it('returns empty state when sovereignId is null', () => {
    const state = buildGeminiRuntimeState(null, null, true, null, null, null, []);
    expect(state.isActive).toBe(false);
  });

  it('builds full state when active', () => {
    const abilities: FusionAbilityInput[] = [
      { name: 'Power Surge', description: 'Damage boost', stat: 'damage', value: 5 },
    ];
    const state = buildGeminiRuntimeState('s1', 'Sovereign X', true, 'Shadow', 'Volatile', 'Volatile', abilities);
    expect(state.isActive).toBe(true);
    expect(state.sovereignName).toBe('Sovereign X');
    expect(state.corruptionRisk).toBe(25);
    expect(state.modifiers).toHaveLength(1);
  });
});

describe('toGeminiStateRef', () => {
  it('converts runtime state to compact ref', () => {
    const state = buildGeminiRuntimeState('s1', 'Sov', true, 'Fire', 'Stable', 'Stable', []);
    const ref = toGeminiStateRef(state);
    expect(ref.sovereignId).toBe('s1');
    expect(ref.isActive).toBe(true);
    expect(ref.fusionTheme).toBe('Fire');
  });
});

describe('toGeminiEffectRefs', () => {
  it('returns empty array when inactive', () => {
    expect(toGeminiEffectRefs(EMPTY_GEMINI_STATE)).toEqual([]);
  });

  it('returns effect refs for active state', () => {
    const abilities: FusionAbilityInput[] = [
      { name: 'Slash', description: 'x', stat: 'damage', value: 3 },
    ];
    const state = buildGeminiRuntimeState('s1', 'Sov', true, 'Fire', 'Stable', 'Stable', abilities);
    const refs = toGeminiEffectRefs(state);
    expect(refs).toHaveLength(1);
    expect(refs[0].sourceType).toBe('gemini');
    expect(refs[0].sourceId).toBe('s1');
  });
});

describe('applyModifiers', () => {
  it('applies add modifiers', () => {
    const mods = [
      { stat: 'ac', value: 2, operation: 'add' as const, source: 'A' },
      { stat: 'ac', value: 1, operation: 'add' as const, source: 'B' },
    ];
    expect(applyModifiers(10, mods)).toBe(13);
  });

  it('applies set modifier (last wins)', () => {
    const mods = [
      { stat: 'ac', value: 15, operation: 'set' as const, source: 'A' },
      { stat: 'ac', value: 18, operation: 'set' as const, source: 'B' },
    ];
    expect(applyModifiers(10, mods)).toBe(18);
  });

  it('applies multiply modifier', () => {
    const mods = [
      { stat: 'speed', value: 2, operation: 'multiply' as const, source: 'A' },
    ];
    expect(applyModifiers(30, mods)).toBe(60);
  });

  it('applies in order: set → multiply → add', () => {
    const mods = [
      { stat: 'ac', value: 10, operation: 'set' as const, source: 'A' },
      { stat: 'ac', value: 2, operation: 'multiply' as const, source: 'B' },
      { stat: 'ac', value: 3, operation: 'add' as const, source: 'C' },
    ];
    // set=10, multiply=20, add=23
    expect(applyModifiers(5, mods)).toBe(23);
  });

  it('filters by active conditions', () => {
    const mods = [
      { stat: 'damage', value: 5, operation: 'add' as const, source: 'A', condition: 'while_raging' },
      { stat: 'damage', value: 2, operation: 'add' as const, source: 'B' },
    ];
    // Without condition
    expect(applyModifiers(10, mods)).toBe(12);
    // With condition
    expect(applyModifiers(10, mods, ['while_raging'])).toBe(17);
  });
});

describe('getPowerMultiplierFactor', () => {
  it('returns 1.0 for null', () => {
    expect(getPowerMultiplierFactor(null)).toBe(1.0);
  });

  it('returns correct multipliers', () => {
    expect(getPowerMultiplierFactor('Stable')).toBe(1.0);
    expect(getPowerMultiplierFactor('Volatile')).toBe(1.5);
    expect(getPowerMultiplierFactor('Critical')).toBe(2.0);
  });

  it('returns 1.0 for unknown label', () => {
    expect(getPowerMultiplierFactor('Unknown')).toBe(1.0);
  });
});

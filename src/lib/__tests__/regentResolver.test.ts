import { describe, it, expect } from 'vitest';
import {
  resolveRegentModifiers,
  buildRegentRuntimeState,
  toRegentRef,
  toRegentEffectRefs,
  mergeRegentModifiers,
  applyRegentModifiers,
  canUnlockRegent,
  canActivateGemini,
  type RegentFeatureInput,
  type RegentRuntimeState,
} from '@/lib/regentResolver';

describe('resolveRegentModifiers', () => {
  const features: RegentFeatureInput[] = [
    { name: 'Shadow Cloak', description: 'AC boost', level: 1, isSignature: false, stat: 'ac', value: 1 },
    { name: 'Dark Surge', description: 'Damage', level: 5, isSignature: true, stat: 'damage', value: 3, actionType: 'action' },
    { name: 'Lore', description: 'Flavor only', level: 1, isSignature: false },
  ];

  it('includes features at or below character level', () => {
    const mods = resolveRegentModifiers(features, 'TestRegent', 5);
    expect(mods).toHaveLength(2);
    expect(mods[0].stat).toBe('ac');
    expect(mods[1].stat).toBe('damage');
  });

  it('excludes features above character level', () => {
    const mods = resolveRegentModifiers(features, 'TestRegent', 3);
    expect(mods).toHaveLength(1);
    expect(mods[0].stat).toBe('ac');
  });

  it('skips features without stat or value', () => {
    const mods = resolveRegentModifiers(features, 'TestRegent', 20);
    expect(mods).toHaveLength(2); // Lore excluded
  });

  it('marks passive features correctly', () => {
    const mods = resolveRegentModifiers(features, 'R', 10);
    expect(mods[0].isPassive).toBe(true); // no actionType
    expect(mods[1].isPassive).toBe(false); // actionType: 'action'
  });
});

describe('buildRegentRuntimeState', () => {
  it('builds state with level-filtered modifiers', () => {
    const features: RegentFeatureInput[] = [
      { name: 'A', description: 'x', level: 1, isSignature: false, stat: 'ac', value: 1 },
      { name: 'B', description: 'x', level: 10, isSignature: true, stat: 'damage', value: 5 },
    ];

    const state = buildRegentRuntimeState(
      'r1', 'Shadow Lord', 'The Dark One', 'Shadow', true, 3, 'necrotic', 'Low',
      features, 5
    );

    expect(state.regentId).toBe('r1');
    expect(state.isPrimary).toBe(true);
    expect(state.modifiers).toHaveLength(1); // Only level 1 feature at char level 5
    expect(state.damageType).toBe('necrotic');
  });
});

describe('toRegentRef', () => {
  it('converts to compact ref', () => {
    const state: RegentRuntimeState = {
      regentId: 'r1', regentName: 'Test', title: 'T', theme: 'Fire',
      isPrimary: true, unlockLevel: 3, modifiers: [], damageType: null, corruptionRisk: null,
    };
    const ref = toRegentRef(state);
    expect(ref.regentId).toBe('r1');
    expect(ref.isPrimary).toBe(true);
    expect(ref.theme).toBe('Fire');
  });
});

describe('toRegentEffectRefs', () => {
  it('returns effect refs for each modifier', () => {
    const state: RegentRuntimeState = {
      regentId: 'r1', regentName: 'Test', title: 'T', theme: 'Fire',
      isPrimary: true, unlockLevel: 3, damageType: null, corruptionRisk: null,
      modifiers: [
        { stat: 'ac', value: 1, operation: 'add', source: 'Test: Shield', isPassive: true },
      ],
    };
    const refs = toRegentEffectRefs(state);
    expect(refs).toHaveLength(1);
    expect(refs[0].sourceType).toBe('regent');
    expect(refs[0].sourceId).toBe('r1');
  });
});

describe('mergeRegentModifiers', () => {
  const primary: RegentRuntimeState = {
    regentId: 'r1', regentName: 'Primary', title: 'T', theme: 'Fire',
    isPrimary: true, unlockLevel: 3, damageType: null, corruptionRisk: null,
    modifiers: [
      { stat: 'ac', value: 15, operation: 'set', source: 'P: Shield', isPassive: true },
      { stat: 'damage', value: 2, operation: 'add', source: 'P: Strike', isPassive: true },
    ],
  };

  const secondary: RegentRuntimeState = {
    regentId: 'r2', regentName: 'Secondary', title: 'S', theme: 'Ice',
    isPrimary: false, unlockLevel: 5, damageType: null, corruptionRisk: null,
    modifiers: [
      { stat: 'ac', value: 18, operation: 'set', source: 'S: Shell', isPassive: true },
      { stat: 'speed', value: 10, operation: 'add', source: 'S: Dash', isPassive: true },
    ],
  };

  it('primary set modifiers take precedence over secondary set on same stat', () => {
    const merged = mergeRegentModifiers([primary, secondary]);
    const acSets = merged.filter((m) => m.stat === 'ac' && m.operation === 'set');
    expect(acSets).toHaveLength(1); // Only primary's set
    expect(acSets[0].source).toContain('P: Shield');
  });

  it('includes non-conflicting modifiers from secondary', () => {
    const merged = mergeRegentModifiers([primary, secondary]);
    const speedAdds = merged.filter((m) => m.stat === 'speed');
    expect(speedAdds).toHaveLength(1);
  });

  it('includes all add modifiers from both', () => {
    const merged = mergeRegentModifiers([primary, secondary]);
    const addMods = merged.filter((m) => m.operation === 'add');
    expect(addMods).toHaveLength(2); // damage + speed
  });
});

describe('applyRegentModifiers', () => {
  it('applies add modifiers', () => {
    const mods = [
      { stat: 'ac', value: 2, operation: 'add' as const, source: 'A', isPassive: true },
    ];
    expect(applyRegentModifiers(10, mods)).toBe(12);
  });

  it('respects conditions', () => {
    const mods = [
      { stat: 'damage', value: 5, operation: 'add' as const, source: 'A', isPassive: true, condition: 'on_crit' },
    ];
    expect(applyRegentModifiers(10, mods)).toBe(10); // no condition active
    expect(applyRegentModifiers(10, mods, ['on_crit'])).toBe(15);
  });
});

describe('canUnlockRegent', () => {
  it('allows at or above unlock level', () => {
    expect(canUnlockRegent(5, 3).allowed).toBe(true);
    expect(canUnlockRegent(3, 3).allowed).toBe(true);
  });

  it('denies below unlock level', () => {
    expect(canUnlockRegent(2, 3).allowed).toBe(false);
  });
});

describe('canActivateGemini', () => {
  it('requires 2+ regents', () => {
    expect(canActivateGemini(0).allowed).toBe(false);
    expect(canActivateGemini(1).allowed).toBe(false);
    expect(canActivateGemini(2).allowed).toBe(true);
    expect(canActivateGemini(5).allowed).toBe(true);
  });
});

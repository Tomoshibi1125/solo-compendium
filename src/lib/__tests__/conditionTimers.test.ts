import { describe, expect, test } from 'vitest';
import { cleanupExpiredConditions } from '@/lib/conditionTimers';

describe('conditionTimers', () => {
  test('returns original refs when no timers exist', () => {
    const conditions = ['Prone'];
    const out = cleanupExpiredConditions(conditions, undefined, 5);
    expect(out.conditions).toBe(conditions);
    expect(out.timers).toBeUndefined();
  });

  test('removes expired conditions and timers at nextRound boundary (<=)', () => {
    const conditions = ['Prone', 'Poisoned', 'Blinded'];
    const timers = { Prone: 3, Poisoned: 5 };

    const out = cleanupExpiredConditions(conditions, timers, 5);
    expect(out.conditions).toEqual(['Blinded']);
    expect(out.timers).toBeUndefined();
  });

  test('keeps non-expired timers and conditions', () => {
    const conditions = ['Prone', 'Blinded'];
    const timers = { Prone: 10 };

    const out = cleanupExpiredConditions(conditions, timers, 5);
    expect(out.conditions).toEqual(['Prone', 'Blinded']);
    expect(out.timers).toEqual({ Prone: 10 });
  });
});

import { describe, it, expect } from 'vitest';
import { resolveAdvantageForRoll, combineAdvantageStates } from '../rollAdvantage';
import type { CustomModifier } from '../customModifiers';

describe('rollAdvantage resolution', () => {
  describe('combineAdvantageStates', () => {
    it('cancels advantage and disadvantage to normal', () => {
      expect(combineAdvantageStates(['advantage', 'disadvantage'])).toBe('normal');
    });

    it('returns advantage if only advantage is present', () => {
      expect(combineAdvantageStates(['advantage', 'normal'])).toBe('advantage');
    });

    it('returns disadvantage if only disadvantage is present', () => {
      expect(combineAdvantageStates(['disadvantage', 'normal'])).toBe('disadvantage');
    });

    it('returns normal if neither is present', () => {
      expect(combineAdvantageStates(['normal', 'normal'])).toBe('normal');
    });
  });

  describe('resolveAdvantageForRoll', () => {
    const mockModifiers: CustomModifier[] = [
      {
        id: 'mod1',
        type: 'advantage',
        target: 'initiative',
        value: 0,
        source: 'Predator Instinct',
        enabled: true,
      },
      {
        id: 'mod2',
        type: 'advantage',
        target: 'skill:stealth',
        value: 0,
        source: 'Ghost Walk',
        enabled: true,
      },
      {
        id: 'mod3',
        type: 'disadvantage',
        target: 'ability_checks',
        value: 0,
        source: 'Exhaustion',
        enabled: true,
      }
    ];

    it('applies feature-based advantage for matching targets', () => {
      const state = resolveAdvantageForRoll({
        conditions: [],
        exhaustionLevel: 0,
        rollType: 'ability_checks',
        customModifiers: mockModifiers,
        customTargets: ['initiative']
      });
      // Predator Instinct (Adv) + Exhaustion (Dis) = Normal
      expect(state).toBe('normal');
    });

    it('honors conditions (Poisoned -> Disadvantage)', () => {
      const state = resolveAdvantageForRoll({
        conditions: ['Poisoned'],
        exhaustionLevel: 0,
        rollType: 'attack_rolls',
        customModifiers: [],
      });
      expect(state).toBe('disadvantage');
    });

    it('honors UI overrides', () => {
      const state = resolveAdvantageForRoll({
        conditions: [],
        exhaustionLevel: 0,
        rollType: 'ability_checks',
        customModifiers: [],
        uiOverride: 'advantage'
      });
      expect(state).toBe('advantage');
    });

    it('correctly targets specific saves (AGI_saves)', () => {
      const agiSaveMod: CustomModifier = {
        id: 'mod4',
        type: 'advantage',
        target: 'AGI_saves',
        value: 0,
        source: 'Threat Reflex',
        enabled: true,
      };
      
      const state = resolveAdvantageForRoll({
        conditions: [],
        exhaustionLevel: 0,
        rollType: 'AGI_saves',
        customModifiers: [agiSaveMod],
      });
      expect(state).toBe('advantage');
    });
  });
});

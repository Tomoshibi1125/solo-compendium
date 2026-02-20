import { describe, expect, it } from 'vitest';
import { staticDataProvider } from '@/data/compendium/staticDataProvider';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

describe('compendium completeness (static packs)', () => {
  it('spells have structured mechanics fields', async () => {
    const spells = await staticDataProvider.getSpells('');

    for (const spell of spells) {
      expect(typeof spell.id).toBe('string');
      expect(typeof spell.name).toBe('string');
      expect(typeof spell.description).toBe('string');

      expect(isRecord(spell.activation)).toBe(true);
      expect(isRecord(spell.duration)).toBe(true);
      const hasRangeRecord = isRecord(spell.range);
      const hasRangeNumber = typeof spell.range === 'number';
      expect(hasRangeRecord || hasRangeNumber).toBe(true);
      if (hasRangeRecord) {
        const range = spell.range as Record<string, unknown>;
        expect(typeof range.type).toBe('string');
      }
      expect(isRecord(spell.components)).toBe(true);
      expect(isRecord(spell.effects)).toBe(true);
      expect(isRecord(spell.mechanics)).toBe(true);
      expect(isRecord(spell.limitations)).toBe(true);

      const mechanics = spell.mechanics as Record<string, unknown>;
      const hasAttack = isRecord(mechanics.attack);
      const hasSave = isRecord(mechanics.saving_throw);
      const hasHealing = isRecord(mechanics.healing);
      expect(hasAttack || hasSave || hasHealing).toBe(true);

      expect(typeof spell.flavor).toBe('string');
    }
  });

  it('monsters have complete statblock and embedded actions/traits', async () => {
    const monsters = await staticDataProvider.getMonsters('');

    for (const monster of monsters) {
      expect(typeof monster.id).toBe('string');
      expect(typeof monster.name).toBe('string');
      expect(typeof monster.description).toBe('string');

      expect(typeof monster.armor_class).toBe('number');
      expect(typeof monster.hit_points_average).toBe('number');

      expect(typeof monster.str).toBe('number');
      expect(typeof monster.agi).toBe('number');
      expect(typeof monster.vit).toBe('number');
      expect(typeof monster.int).toBe('number');
      expect(typeof monster.sense).toBe('number');
      expect(typeof monster.pre).toBe('number');

      expect(Array.isArray(monster.monster_actions)).toBe(true);
      expect((monster.monster_actions || []).length).toBeGreaterThan(0);

      expect(Array.isArray(monster.monster_traits)).toBe(true);
      expect((monster.monster_traits || []).length).toBeGreaterThan(0);
    }
  });
});
